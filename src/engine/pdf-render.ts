// PDF -> images with pdf.js. Parsing happens in pdf.js' own worker; pages are
// rasterised one at a time on a canvas to keep memory flat.

// The legacy build bundles polyfills for very recent JS APIs, so PDF pages
// render in older Safari/Chrome versions too.
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import workerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import { EngineError, type PdfToImagesOptions } from './types';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

// Browsers refuse canvases above ~16k px per side or ~268 MP in total.
const MAX_SIDE = 12_000;
const MAX_AREA = 60_000_000;

export interface RenderedPage {
  blob: Blob;
  page: number;
  total: number;
  width: number;
  height: number;
}

export async function renderPdf(
  data: ArrayBuffer,
  options: PdfToImagesOptions,
  onPage: (page: RenderedPage) => void,
  signal?: AbortSignal,
): Promise<void> {
  const base = new URL('/pdfjs/', location.href).href;
  const task = pdfjs.getDocument({
    data: new Uint8Array(data),
    cMapUrl: `${base}cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${base}standard_fonts/`,
    wasmUrl: `${base}wasm/`,
    iccUrl: `${base}iccs/`,
    enableXfa: false,
  });
  let pdf: pdfjs.PDFDocumentProxy;
  try {
    pdf = await task.promise;
  } catch (e) {
    const name = (e as { name?: string })?.name;
    if (name === 'PasswordException') throw new EngineError('encrypted');
    throw new EngineError('decode', String(e));
  }

  const mime = options.format === 'png' ? 'image/png' : 'image/jpeg';
  try {
    for (let n = 1; n <= pdf.numPages; n++) {
      if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
      const page = await pdf.getPage(n);
      let scale = options.dpi / 72;
      const base1 = page.getViewport({ scale: 1 });
      const w = base1.width * scale;
      const h = base1.height * scale;
      const limit = Math.min(MAX_SIDE / Math.max(w, h), Math.sqrt(MAX_AREA / (w * h)), 1);
      scale *= limit;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const ctx = canvas.getContext('2d', { alpha: options.format === 'png' });
      if (!ctx) throw new EngineError('failed', 'no canvas');
      if (options.format === 'jpg') {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      await page.render({ canvas, canvasContext: ctx, viewport }).promise;
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, mime, options.quality / 100),
      );
      page.cleanup();
      const { width, height } = canvas;
      canvas.width = 0;
      canvas.height = 0;
      if (!blob) throw new EngineError('failed', 'canvas export failed');
      onPage({ blob, page: n, total: pdf.numPages, width, height });
    }
  } finally {
    await task.destroy();
  }
}
