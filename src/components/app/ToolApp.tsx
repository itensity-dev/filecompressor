import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { replaceExtension, sniffFile } from '../../engine/formats';
import type { WorkerPool } from '../../engine/pool';
import {
  EngineError,
  type ErrorCode,
  type ImageFormat,
  type ImageSource,
  type InputFormat,
  type JobResult,
  type PageSize,
  type PdfLevel,
} from '../../engine/types';
import type { Dict, Plural } from '../../i18n/types';
import { ACCEPT, FORMAT_LABEL, isImageFormat, type Tool } from '../../tools';
import { Compare } from './Compare';
import { downloadBlob, formatBytes, formatPercent } from './format';
import {
  AlertIcon,
  CompareIcon,
  DownIcon,
  DownloadIcon,
  PlusIcon,
  TrashIcon,
  UpIcon,
  UploadIcon,
} from './icons';

export type AppStrings = Pick<Dict, 'drop' | 'settings' | 'status' | 'results'>;

interface Props {
  tool: Tool;
  t: AppStrings;
  locale: string;
  /** Converter pages: where the "PDF" target button leads. */
  pdfHref?: string;
}

interface Settings {
  format: ImageFormat | 'same';
  quality: number;
  maxSide: number;
  pngLossy: boolean;
  level: PdfLevel;
  grayscale: boolean;
  pageSize: PageSize;
  margin: boolean;
  dpi: number;
}

interface Output {
  name: string;
  blob: Blob;
  url: string;
}

type Status = 'queued' | 'processing' | 'done' | 'error' | 'ready';

interface Item {
  id: number;
  file: File;
  format: InputFormat;
  status: Status;
  progress: number;
  outputs: Output[];
  error?: ErrorCode;
  kept?: boolean;
  /** Format and pixel size of the result (images). */
  outFormat?: string;
  width?: number;
  height?: number;
  /** Settings the current outputs were produced with. */
  key?: string;
  /** Object URL of the original, for the before/after view. */
  preview?: string;
}

const IMAGE_INPUTS: InputFormat[] = ['jpg', 'png', 'webp', 'avif', 'heic', 'gif', 'bmp'];
const BROWSER_VIEWABLE: InputFormat[] = ['jpg', 'png', 'webp', 'avif', 'gif', 'bmp'];
const RESIZE_OPTIONS = [0, 3840, 2560, 1920, 1280, 800];
const IMAGE_TARGETS: ImageFormat[] = ['jpg', 'png', 'webp', 'avif'];

const label = (f: string) => FORMAT_LABEL[f as keyof typeof FORMAT_LABEL] ?? f.toUpperCase();

function defaults(tool: Tool): Settings {
  const to = tool.to;
  let quality = 85;
  if (tool.category === 'compress') quality = 75;
  else if (to === 'webp') quality = 80;
  else if (to === 'avif') quality = 60;
  return {
    format: tool.category === 'convert' && isImageFormat(to) ? to : 'same',
    quality,
    maxSide: 0,
    pngLossy: tool.category === 'compress',
    level: 'medium',
    grayscale: false,
    pageSize: 'a4',
    margin: false,
    dpi: 150,
  };
}

function settingsKey(tool: Tool, s: Settings): string {
  switch (tool.kind) {
    case 'image':
      return JSON.stringify([s.format, s.quality, s.maxSide, s.pngLossy]);
    case 'pdf-compress':
      return JSON.stringify([s.level, s.grayscale]);
    case 'pdf-to-images':
      return JSON.stringify([s.format, s.dpi, s.quality]);
    case 'images-to-pdf':
      return JSON.stringify([s.pageSize, s.margin]);
  }
}

function acceptedInputs(tool: Tool): InputFormat[] {
  return tool.kind === 'image' || tool.kind === 'images-to-pdf' ? IMAGE_INPUTS : ['pdf'];
}

const isAbort = (e: unknown) => e instanceof DOMException && e.name === 'AbortError';

const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));

let nextItemId = 1;

/** A row of mutually exclusive buttons. */
function Segmented<T extends string | number>(props: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
  class?: string;
  extra?: preact.ComponentChildren;
}) {
  return (
    <div class={`segmented ${props.class ?? ''}`} role="group" aria-label={props.label}>
      {props.options.map((o) => (
        <button
          type="button"
          aria-pressed={o.value === props.value}
          onClick={() => props.onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
      {props.extra}
    </div>
  );
}

export default function ToolApp({ tool, t, locale, pdfHref }: Props) {
  const storageKey = `fc:settings:${tool.id}`;
  const [settings, setSettings] = useState<Settings>(() => defaults(tool));
  const [items, setItems] = useState<Item[]>([]);
  const [dragging, setDragging] = useState(false);
  const [compareId, setCompareId] = useState<number | null>(null);
  const [combined, setCombined] = useState<Output | null>(null);
  const [building, setBuilding] = useState<number | null>(null);
  const [zipping, setZipping] = useState(false);
  const [ready, setReady] = useState(false);

  const input = useRef<HTMLInputElement>(null);
  const pool = useRef<WorkerPool | null>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const generation = useRef(new Map<number, number>());
  const tasks = useRef(new Map<number, number>());
  const aborts = useRef(new Map<number, AbortController>());
  const pdfChain = useRef<Promise<unknown>>(Promise.resolve());

  const plural = useCallback(
    (forms: Plural, n: number) => {
      const cat = new Intl.PluralRules(locale).select(n);
      return fill(forms[cat] ?? forms.other, { n });
    },
    [locale],
  );

  // Files picked before the component hydrated (slow connections) are not lost.
  useEffect(() => {
    setReady(true);
    const pending = input.current?.files;
    if (pending?.length) {
      void addFiles(Array.from(pending));
      input.current!.value = '';
    }
  }, []);

  // Restore and persist settings (only in this browser). A converter page
  // always starts with the target format it is named after.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const restored = { ...defaults(tool), ...JSON.parse(saved) };
        if (tool.category === 'convert' || tool.kind === 'pdf-to-images') {
          restored.format = defaults(tool).format;
        }
        setSettings(restored);
      }
    } catch {
      /* storage unavailable */
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch {
      /* storage unavailable */
    }
  }, [settings]);

  const getPool = async () => {
    if (!pool.current) {
      const { WorkerPool } = await import('../../engine/pool');
      pool.current = new WorkerPool();
    }
    return pool.current;
  };

  const update = (id: number, patch: Partial<Item> | ((item: Item) => Partial<Item>)) =>
    setItems((list) =>
      list.map((it) =>
        it.id === id ? { ...it, ...(typeof patch === 'function' ? patch(it) : patch) } : it,
      ),
    );

  const revoke = (outputs: Output[]) => outputs.forEach((o) => URL.revokeObjectURL(o.url));

  const toOutput = (item: Item, r: JobResult): Output => {
    const blob = new Blob([r.data], { type: r.mime });
    const name = r.keptOriginal ? item.file.name : replaceExtension(item.file.name, r.ext);
    return { name, blob, url: URL.createObjectURL(blob) };
  };

  const loadImage = async (item: Item): Promise<ImageSource> => {
    if (item.format === 'heic') {
      const { decodeHeic } = await import('../../engine/heic');
      return decodeHeic(item.file);
    }
    return item.file.arrayBuffer();
  };

  const pdfImageFormat = (s: Settings): 'jpg' | 'png' =>
    s.format === 'png' || (s.format === 'same' && tool.to === 'png') ? 'png' : 'jpg';

  const process = async (item: Item) => {
    const s = settingsRef.current;
    const gen = (generation.current.get(item.id) ?? 0) + 1;
    generation.current.set(item.id, gen);
    const current = () => generation.current.get(item.id) === gen;
    const key = settingsKey(tool, s);
    update(item.id, (it) => {
      revoke(it.outputs);
      return { status: 'processing', progress: 0, outputs: [], error: undefined, kept: false, key };
    });
    const onProgress = (p: number) => current() && update(item.id, { progress: p });

    try {
      if (tool.kind === 'pdf-to-images') {
        const controller = new AbortController();
        aborts.current.set(item.id, controller);
        const ext = pdfImageFormat(s);
        const job = pdfChain.current.then(async () => {
          if (!current()) return;
          const { renderPdf } = await import('../../engine/pdf-render');
          const outputs: Output[] = [];
          const base = item.file.name.replace(/\.[^.]+$/, '');
          await renderPdf(
            await item.file.arrayBuffer(),
            { format: ext, dpi: s.dpi, quality: s.quality },
            (page) => {
              const name = `${base}-${String(page.page).padStart(page.total >= 100 ? 3 : 2, '0')}.${ext}`;
              outputs.push({ name, blob: page.blob, url: URL.createObjectURL(page.blob) });
              if (current()) {
                update(item.id, { progress: page.page / page.total, outputs: [...outputs] });
              }
            },
            controller.signal,
          );
          if (current()) update(item.id, { status: 'done', progress: 1, outFormat: ext });
          else revoke(outputs);
        });
        pdfChain.current = job.catch(() => undefined);
        await job;
        return;
      }

      const p = await getPool();
      let run;
      if (tool.kind === 'image') {
        const source = await loadImage(item);
        run = p.run(
          {
            type: 'image',
            input: source,
            inFormat: item.format,
            options: {
              format: s.format,
              quality: s.quality,
              maxSide: s.maxSide,
              pngLossy: s.pngLossy,
            },
          },
          [source],
          onProgress,
        );
      } else {
        const buffer = await item.file.arrayBuffer();
        run = p.run(
          {
            type: 'pdf-compress',
            input: buffer,
            options: { level: s.level, grayscale: s.grayscale },
          },
          [buffer],
          onProgress,
        );
      }
      tasks.current.set(item.id, run.id);
      const result = await run.promise;
      if (!current()) return;
      update(item.id, {
        status: 'done',
        progress: 1,
        outputs: [toOutput(item, result)],
        kept: result.keptOriginal,
        outFormat: result.ext,
        width: result.width,
        height: result.height,
      });
    } catch (e) {
      if (isAbort(e) || !current()) return;
      // Damaged or unsupported files are expected; only log real failures.
      if (!(e instanceof EngineError) || e.code === 'failed') console.error(e);
      update(item.id, {
        status: 'error',
        error: e instanceof EngineError ? e.code : 'failed',
      });
    }
  };

  const addFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (!list.length) return;
    const accepted = acceptedInputs(tool);
    const added: Item[] = [];
    for (const file of list) {
      const format = await sniffFile(file);
      const ok = accepted.includes(format);
      added.push({
        id: nextItemId++,
        file,
        format,
        status: ok ? (tool.kind === 'images-to-pdf' ? 'ready' : 'queued') : 'error',
        error: ok ? undefined : 'unsupported',
        progress: 0,
        outputs: [],
        preview:
          (tool.kind === 'image' || tool.kind === 'images-to-pdf') && BROWSER_VIEWABLE.includes(format)
            ? URL.createObjectURL(file)
            : undefined,
      });
    }
    setItems((current) => [...current, ...added]);
    if (tool.kind === 'images-to-pdf') {
      invalidateCombined();
      return;
    }
    for (const item of added) if (item.status === 'queued') void process(item);
  };

  const cancel = (id: number) => {
    generation.current.set(id, (generation.current.get(id) ?? 0) + 1);
    const task = tasks.current.get(id);
    if (task !== undefined) pool.current?.cancel(task);
    aborts.current.get(id)?.abort();
  };

  const removeItem = (id: number) => {
    cancel(id);
    setItems((list) => {
      const item = list.find((i) => i.id === id);
      if (item) {
        revoke(item.outputs);
        if (item.preview) URL.revokeObjectURL(item.preview);
      }
      return list.filter((i) => i.id !== id);
    });
    if (tool.kind === 'images-to-pdf') invalidateCombined();
  };

  const clearAll = () => {
    for (const item of items) {
      cancel(item.id);
      revoke(item.outputs);
      if (item.preview) URL.revokeObjectURL(item.preview);
    }
    setItems([]);
    invalidateCombined();
    if (input.current) input.current.value = '';
  };

  const move = (id: number, delta: number) => {
    setItems((list) => {
      const i = list.findIndex((x) => x.id === id);
      const j = i + delta;
      if (i < 0 || j < 0 || j >= list.length) return list;
      const copy = list.slice();
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
    invalidateCombined();
  };

  const invalidateCombined = () => {
    setCombined((c) => {
      if (c) URL.revokeObjectURL(c.url);
      return null;
    });
  };

  const buildPdf = async () => {
    const ready = items.filter((i) => i.status !== 'error');
    if (!ready.length) return;
    invalidateCombined();
    setBuilding(0);
    try {
      const inputs = [];
      for (const item of ready) inputs.push({ data: await loadImage(item), format: item.format });
      const p = await getPool();
      const run = p.run(
        {
          type: 'images-to-pdf',
          inputs,
          options: { pageSize: settings.pageSize, margin: settings.margin },
        },
        inputs.map((i) => i.data),
        (v) => setBuilding(v),
      );
      const result = await run.promise;
      const blob = new Blob([result.data], { type: result.mime });
      const first = ready[0].file.name.replace(/\.[^.]+$/, '');
      const name = ready.length === 1 ? `${first}.pdf` : `${first}-${ready.length}.pdf`;
      setCombined({ name, blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      console.error(e);
      alert(t.status.errors[e instanceof EngineError ? e.code : 'failed']);
    } finally {
      setBuilding(null);
    }
  };

  // A finished PDF no longer matches once page settings change.
  useEffect(() => {
    if (tool.kind === 'images-to-pdf') invalidateCombined();
  }, [settings.pageSize, settings.margin]);

  const reprocessable = (item: Item) =>
    item.error !== 'unsupported' && item.status !== 'ready' && item.status !== 'queued';

  const reapply = () => {
    for (const item of itemsRef.current) {
      if (!reprocessable(item)) continue;
      cancel(item.id);
      void process(item);
    }
  };

  /** Switching the target format re-runs every file right away. */
  const chooseFormat = (format: Settings['format']) => {
    const next = { ...settingsRef.current, format };
    settingsRef.current = next;
    setSettings(next);
    reapply();
  };

  const allOutputs = items.flatMap((i) => i.outputs);
  const doneItems = items.filter((i) => i.status === 'done');
  const busy = items.some((i) => i.status === 'queued' || i.status === 'processing');
  const currentKey = settingsKey(tool, settings);
  const stale = doneItems.some((i) => i.key !== currentKey) && !busy;

  const downloadAll = async () => {
    if (allOutputs.length === 1) return downloadBlob(allOutputs[0].blob, allOutputs[0].name);
    setZipping(true);
    try {
      const { makeZip } = await import('../../engine/zip');
      downloadBlob(await makeZip(allOutputs), `${tool.id}.zip`);
    } finally {
      setZipping(false);
    }
  };

  const downloadItem = async (item: Item) => {
    if (item.outputs.length === 1) return downloadBlob(item.outputs[0].blob, item.outputs[0].name);
    const { makeZip } = await import('../../engine/zip');
    downloadBlob(await makeZip(item.outputs), replaceExtension(item.file.name, 'zip'));
  };

  // Paste files from the clipboard and accept drops anywhere on the page.
  useEffect(() => {
    const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer?.types ?? []).includes('Files');
    let depth = 0;
    const onEnter = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      depth++;
      setDragging(true);
    };
    const onOver = (e: DragEvent) => {
      if (hasFiles(e)) e.preventDefault();
    };
    const onLeave = () => {
      depth = Math.max(0, depth - 1);
      if (!depth) setDragging(false);
    };
    const onDrop = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      depth = 0;
      setDragging(false);
      if (e.dataTransfer?.files.length) void addFiles(e.dataTransfer.files);
    };
    const onPaste = (e: ClipboardEvent) => {
      const files = e.clipboardData?.files;
      if (files?.length) {
        e.preventDefault();
        void addFiles(files);
      }
    };
    window.addEventListener('dragenter', onEnter);
    window.addEventListener('dragover', onOver);
    window.addEventListener('dragleave', onLeave);
    window.addEventListener('drop', onDrop);
    window.addEventListener('paste', onPaste);
    return () => {
      window.removeEventListener('dragenter', onEnter);
      window.removeEventListener('dragover', onOver);
      window.removeEventListener('dragleave', onLeave);
      window.removeEventListener('drop', onDrop);
      window.removeEventListener('paste', onPaste);
    };
  });

  const inputFormats =
    tool.kind === 'image' || tool.kind === 'images-to-pdf'
      ? (['jpg', 'png', 'webp', 'avif', 'heic'] as const)
      : (['pdf'] as const);

  const accept = useMemo(
    () =>
      [...inputFormats.map((f) => ACCEPT[f]), tool.kind === 'image' ? '.gif,.bmp' : '']
        .filter(Boolean)
        .join(','),
    [tool],
  );

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) =>
    setSettings((s) => ({ ...s, [k]: v }));

  const totalIn = doneItems.reduce((sum, i) => sum + i.file.size, 0);
  const totalOut = doneItems.reduce(
    (sum, i) => sum + i.outputs.reduce((s, o) => s + o.blob.size, 0),
    0,
  );
  const compareItem = items.find((i) => i.id === compareId);

  // ------------------------------------------------------------ format bar

  const isConverter = tool.kind === 'image' && tool.category === 'convert';
  let formatBar: preact.ComponentChildren = null;
  if (isConverter || tool.id === 'compress-image') {
    const options = IMAGE_TARGETS.map((f) => ({ value: f as Settings['format'], label: label(f) }));
    if (!isConverter) options.unshift({ value: 'same', label: t.settings.keepFormat });
    formatBar = (
      <div class="app-bar">
        <span class="app-bar-label">{isConverter ? t.settings.convertTo : t.settings.format}</span>
        <Segmented
          class="formats"
          label={isConverter ? t.settings.convertTo : t.settings.format}
          value={settings.format}
          options={options}
          onChange={chooseFormat}
          extra={isConverter && pdfHref ? <a href={pdfHref}>PDF</a> : null}
        />
      </div>
    );
  } else if (tool.kind === 'pdf-to-images') {
    const value = pdfImageFormat(settings);
    formatBar = (
      <div class="app-bar">
        <span class="app-bar-label">{t.settings.convertTo}</span>
        <Segmented
          class="formats"
          label={t.settings.convertTo}
          value={value}
          options={[
            { value: 'jpg', label: 'JPG' },
            { value: 'png', label: 'PNG' },
          ]}
          onChange={(v) => chooseFormat(v)}
        />
      </div>
    );
  }

  // -------------------------------------------------------------- settings

  const lossyTarget =
    tool.kind === 'image'
      ? settings.format === 'same'
        ? tool.id !== 'compress-png'
        : settings.format !== 'png'
      : tool.kind === 'pdf-to-images' && pdfImageFormat(settings) === 'jpg';
  const showPngMode =
    tool.kind === 'image' &&
    (settings.format === 'png' ||
      (settings.format === 'same' && (tool.id === 'compress-png' || tool.id === 'compress-image')));

  const settingsPanel = (
    <section class="settings" aria-label={t.settings.title}>
      <h2 class="settings-title">{t.settings.title}</h2>

      {lossyTarget && (
        <label class="field">
          <span class="field-label">
            <span>{t.settings.quality}</span>
            <output>{settings.quality}</output>
          </span>
          <input
            type="range"
            min={10}
            max={100}
            step={1}
            value={settings.quality}
            onInput={(e) => set('quality', Number((e.target as HTMLInputElement).value))}
          />
          <small>{t.settings.qualityHint}</small>
        </label>
      )}

      {showPngMode && (
        <div class="field">
          <span class="field-label">{t.settings.pngMode}</span>
          <Segmented
            label={t.settings.pngMode}
            value={settings.pngLossy ? 'lossy' : 'lossless'}
            options={[
              { value: 'lossy', label: t.settings.pngLossy },
              { value: 'lossless', label: t.settings.pngLossless },
            ]}
            onChange={(v) => set('pngLossy', v === 'lossy')}
          />
        </div>
      )}

      {tool.kind === 'image' && (
        <label class="field">
          <span class="field-label">{t.settings.resize}</span>
          <select
            value={settings.maxSide}
            onChange={(e) => set('maxSide', Number((e.target as HTMLSelectElement).value))}
          >
            {RESIZE_OPTIONS.map((v) => (
              <option value={v}>{v ? `${v} px` : t.settings.originalSize}</option>
            ))}
          </select>
        </label>
      )}

      {tool.kind === 'pdf-compress' && (
        <>
          <fieldset class="field">
            <legend>{t.settings.level}</legend>
            <div class="levels">
              {(
                [
                  ['low', t.settings.levelLow, t.settings.levelLowHint],
                  ['medium', t.settings.levelMedium, t.settings.levelMediumHint],
                  ['high', t.settings.levelHigh, t.settings.levelHighHint],
                ] as const
              ).map(([value, name, hint]) => (
                <label class={`level ${settings.level === value ? 'is-active' : ''}`}>
                  <input
                    type="radio"
                    name={`level-${tool.id}`}
                    value={value}
                    checked={settings.level === value}
                    onChange={() => set('level', value)}
                  />
                  <span class="level-name">{name}</span>
                  <span class="level-hint">{hint}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label class="check">
            <input
              type="checkbox"
              checked={settings.grayscale}
              onChange={(e) => set('grayscale', (e.target as HTMLInputElement).checked)}
            />
            <span>{t.settings.grayscale}</span>
          </label>
        </>
      )}

      {tool.kind === 'images-to-pdf' && (
        <>
          <div class="field">
            <span class="field-label">{t.settings.pageSize}</span>
            <Segmented
              label={t.settings.pageSize}
              value={settings.pageSize}
              options={[
                { value: 'a4', label: 'A4' },
                { value: 'letter', label: 'Letter' },
                { value: 'fit', label: t.settings.pageFit },
              ]}
              onChange={(v) => set('pageSize', v)}
            />
          </div>
          <label class="check">
            <input
              type="checkbox"
              checked={settings.margin}
              onChange={(e) => set('margin', (e.target as HTMLInputElement).checked)}
            />
            <span>{t.settings.margin}</span>
          </label>
        </>
      )}

      {tool.kind === 'pdf-to-images' && (
        <div class="field">
          <span class="field-label">{t.settings.dpi}</span>
          <Segmented
            label={t.settings.dpi}
            value={settings.dpi}
            options={[
              { value: 72, label: '72' },
              { value: 150, label: '150' },
              { value: 300, label: '300' },
            ]}
            onChange={(v) => set('dpi', v)}
          />
          <small>DPI</small>
        </div>
      )}

      {stale && tool.kind !== 'images-to-pdf' && (
        <div class="stale">
          <span>{t.settings.changed}</span>
          <button type="button" class="btn btn-primary" onClick={reapply}>
            {t.settings.apply}
          </button>
        </div>
      )}
    </section>
  );

  // ----------------------------------------------------------------- rows

  const metaText = (item: Item) => {
    if (item.status === 'error') return t.status.errors[item.error ?? 'failed'];
    if (item.status === 'queued') return t.status.queued;
    if (item.status === 'processing') {
      if (tool.kind === 'pdf-to-images' && item.outputs.length) {
        return `${t.status.processing} ${plural(t.results.pages, item.outputs.length)}`;
      }
      return `${t.status.processing} ${Math.round(item.progress * 100)}%`;
    }
    const from = label(item.format);
    if (item.status === 'ready') return `${from} · ${formatBytes(item.file.size, locale)}`;
    if (item.kept) return t.status.kept;
    if (tool.kind === 'pdf-to-images') {
      return `${from} → ${label(item.outFormat ?? 'jpg')} · ${plural(t.results.pages, item.outputs.length)}`;
    }
    const to = item.outFormat ? label(item.outFormat) : from;
    const dims = item.width && item.height ? ` · ${item.width}×${item.height}` : '';
    return `${to === from ? from : `${from} → ${to}`}${dims}`;
  };

  const row = (item: Item, index: number) => {
    const out = item.outputs.reduce((s, o) => s + o.blob.size, 0);
    const done = item.status === 'done';
    const ratio = done && !item.kept && out ? out / item.file.size - 1 : 0;
    const thumb = (tool.kind === 'image' || tool.kind === 'pdf-to-images') && item.outputs[0]
      ? item.outputs[0].url
      : item.preview;
    return (
      <li class={`item is-${item.status}`} key={item.id}>
        <div class="item-thumb">
          {item.status === 'error' ? (
            <AlertIcon />
          ) : thumb ? (
            <img src={thumb} alt="" loading="lazy" decoding="async" />
          ) : (
            <span class="ext">{label(item.format)}</span>
          )}
        </div>
        <div class="item-body">
          <div class="item-name" title={item.file.name}>
            {item.file.name}
          </div>
          <div class={`item-status ${item.status === 'error' ? '' : 'item-meta'}`}>
            {metaText(item)}
          </div>
        </div>
        <div class="item-sizes">
          {done && tool.kind !== 'pdf-to-images' && (
            <>
              <span>
                {formatBytes(item.file.size, locale)} → {formatBytes(out, locale)}
              </span>
              {ratio < 0 && <span class="badge-saving">{formatPercent(ratio, locale)}</span>}
            </>
          )}
          {done && tool.kind === 'pdf-to-images' && <span>{formatBytes(out, locale)}</span>}
        </div>
        <div class="item-actions">
          {tool.kind === 'images-to-pdf' && (
            <>
              <button
                type="button"
                class="icon-btn"
                aria-label={t.results.moveUp}
                title={t.results.moveUp}
                disabled={index === 0}
                onClick={() => move(item.id, -1)}
              >
                <UpIcon />
              </button>
              <button
                type="button"
                class="icon-btn"
                aria-label={t.results.moveDown}
                title={t.results.moveDown}
                disabled={index === items.length - 1}
                onClick={() => move(item.id, 1)}
              >
                <DownIcon />
              </button>
            </>
          )}
          {done && item.preview && item.outputs[0] && !item.kept && (
            <button
              type="button"
              class="icon-btn"
              aria-label={t.results.compare}
              title={t.results.compare}
              onClick={() => setCompareId(item.id)}
            >
              <CompareIcon />
            </button>
          )}
          {done && item.outputs.length > 0 && (
            <button type="button" class="btn btn-small" onClick={() => void downloadItem(item)}>
              <DownloadIcon size={16} /> {t.results.download}
            </button>
          )}
          <button
            type="button"
            class="icon-btn"
            aria-label={t.results.remove}
            title={t.results.remove}
            onClick={() => removeItem(item.id)}
          >
            <TrashIcon />
          </button>
        </div>
        {item.status === 'processing' && (
          <div
            class="progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(item.progress * 100)}
          >
            <span style={{ width: `${Math.max(3, item.progress * 100)}%` }} />
          </div>
        )}
      </li>
    );
  };

  const summary = () => {
    if (tool.kind === 'images-to-pdf') {
      return <span class="big">{plural(t.results.images, items.length)}</span>;
    }
    if (!doneItems.length) return <span class="big">{plural(t.results.files, items.length)}</span>;
    if (tool.kind === 'pdf-to-images') {
      return (
        <>
          <span class="big">{plural(t.results.pages, allOutputs.length)}</span>
          <span class="muted">{formatBytes(totalOut, locale)}</span>
        </>
      );
    }
    const sizes = `${formatBytes(totalIn, locale)} → ${formatBytes(totalOut, locale)}`;
    if (totalOut < totalIn) {
      return (
        <>
          <span class="big saving">−{formatBytes(totalIn - totalOut, locale)}</span>
          <span class="muted">
            {plural(t.results.files, doneItems.length)} · {sizes} (
            {formatPercent(totalOut / totalIn - 1, locale)})
          </span>
        </>
      );
    }
    return (
      <>
        <span class="big">{plural(t.results.files, doneItems.length)}</span>
        <span class="muted">{sizes}</span>
      </>
    );
  };

  // ---------------------------------------------------------------- render

  const picker = (
    <input
      ref={input}
      type="file"
      multiple
      accept={accept}
      class="visually-hidden"
      tabIndex={-1}
      aria-hidden="true"
      onChange={(e) => {
        const el = e.target as HTMLInputElement;
        if (el.files) void addFiles(el.files);
        el.value = '';
      }}
    />
  );

  const dropzone = (
    <div class="dropzone" onClick={() => input.current?.click()}>
      <UploadIcon size={28} />
      <p class="dropzone-title">{t.drop.title}</p>
      <button
        type="button"
        class="btn btn-primary btn-lg"
        onClick={(e) => {
          e.stopPropagation();
          input.current?.click();
        }}
      >
        {t.drop.choose}
      </button>
      <p class="dropzone-hint">{t.drop.paste}</p>
      <p class="dropzone-formats">{inputFormats.map(label).join(' · ')}</p>
    </div>
  );

  return (
    <div class={`app ${items.length ? 'has-items' : ''}`} data-ready={ready ? '' : undefined}>
      {picker}
      {formatBar}
      <div class="app-main">
        {items.length === 0 ? (
          dropzone
        ) : (
          <>
            <div class="toolbar">
              <p class="summary" aria-live="polite">
                {summary()}
              </p>
              <div class="toolbar-actions">
                <button type="button" class="btn" onClick={() => input.current?.click()}>
                  <PlusIcon size={16} /> {t.drop.addMore}
                </button>
                <button type="button" class="btn" onClick={clearAll}>
                  {t.results.clear}
                </button>
                {tool.kind !== 'images-to-pdf' && allOutputs.length > 0 && (
                  <button
                    type="button"
                    class="btn btn-primary"
                    disabled={busy || zipping}
                    onClick={() => void downloadAll()}
                  >
                    <DownloadIcon size={16} />{' '}
                    {allOutputs.length > 1 ? t.results.downloadZip : t.results.download}
                  </button>
                )}
              </div>
            </div>

            {tool.kind === 'images-to-pdf' && (
              <div class="combine">
                {combined ? (
                  <>
                    <span class="combine-ready">
                      {t.results.pdfReady} · <span class="mono">{formatBytes(combined.blob.size, locale)}</span>
                    </span>
                    <button
                      type="button"
                      class="btn btn-primary btn-lg"
                      onClick={() => downloadBlob(combined.blob, combined.name)}
                    >
                      <DownloadIcon size={18} /> {t.results.download}
                    </button>
                  </>
                ) : (
                  <>
                    <span class="combine-ready">{plural(t.results.images, items.length)} → PDF</span>
                    <button
                      type="button"
                      class="btn btn-primary btn-lg"
                      disabled={building !== null || !items.some((i) => i.status === 'ready')}
                      onClick={() => void buildPdf()}
                    >
                      {building !== null
                        ? `${t.results.creating} ${Math.round(building * 100)}%`
                        : t.results.createPdf}
                    </button>
                  </>
                )}
              </div>
            )}

            <ul class="items">{items.map((item, i) => row(item, i))}</ul>
          </>
        )}
      </div>
      <aside class="app-side">{settingsPanel}</aside>

      {dragging && (
        <div class="drop-overlay" aria-hidden="true">
          <div>
            <UploadIcon size={40} />
            <p>{t.drop.overlay}</p>
          </div>
        </div>
      )}

      {compareItem?.preview && compareItem.outputs[0] && (
        <Compare
          before={compareItem.preview}
          after={compareItem.outputs[0].url}
          beforeSize={formatBytes(compareItem.file.size, locale)}
          afterSize={formatBytes(compareItem.outputs[0].blob.size, locale)}
          labels={{ before: t.results.before, after: t.results.after, close: t.results.close }}
          onClose={() => setCompareId(null)}
        />
      )}
    </div>
  );
}
