// PDF compression and image -> PDF assembly. Runs inside the processing worker.
//
// Compression strategy (most of a PDF's weight is usually raster images):
//  1. Re-encode embedded JPEG (DCTDecode) images with MozJPEG, downscaling
//     very large ones. Photo-like FlateDecode images become JPEG too.
//  2. Drop data viewers never use (page thumbnails, editor-private PieceInfo).
//  3. Deflate streams that were stored uncompressed.
//  4. Remove unreachable objects and pack the rest into object streams.
// The result is kept only if it is smaller and still parses.

import {
  EncryptedPDFError,
  ParseSpeeds,
  PDFArray,
  PDFBool,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFRawStream,
  PDFRef,
  PDFStream,
  type PDFObject,
} from 'pdf-lib';
import { SITE_NAME } from '../site';
import { jpegOrientation, MIME } from './formats';
import { decodeImage, encodeJpeg, resizeImage } from './image';
import {
  EngineError,
  type ImageSource,
  type ImagesToPdfOptions,
  type InputFormat,
  type JobResult,
  type PdfCompressOptions,
} from './types';

const N = (name: string) => PDFName.of(name);

const LEVELS = {
  low: { quality: 82, maxSide: 3000, flateToJpeg: false },
  medium: { quality: 68, maxSide: 2000, flateToJpeg: true },
  high: { quality: 50, maxSide: 1400, flateToJpeg: true },
} as const;

type Level = (typeof LEVELS)[keyof typeof LEVELS];

async function pipeThrough(
  bytes: Uint8Array,
  stream: CompressionStream | DecompressionStream,
): Promise<Uint8Array> {
  const out = new Blob([bytes as Uint8Array<ArrayBuffer>]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
}

const inflate = (b: Uint8Array) => pipeThrough(b, new DecompressionStream('deflate'));
const deflate = (b: Uint8Array) => pipeThrough(b, new CompressionStream('deflate'));

function num(obj: PDFObject | undefined): number | undefined {
  return obj instanceof PDFNumber ? obj.asNumber() : undefined;
}

function filtersOf(dict: PDFDict): string[] {
  const f = dict.lookup(N('Filter'));
  if (f instanceof PDFName) return [f.decodeText()];
  if (f instanceof PDFArray) {
    return f.asArray().map((x) => (x instanceof PDFName ? x.decodeText() : '?'));
  }
  return [];
}

/** Returns 'rgb' | 'gray' for colour spaces we can safely re-encode, else null. */
function colorKind(doc: PDFDocument, dict: PDFDict): 'rgb' | 'gray' | null {
  const cs = dict.lookup(N('ColorSpace'));
  if (cs instanceof PDFName) {
    const name = cs.decodeText();
    if (name === 'DeviceRGB' || name === 'CalRGB') return 'rgb';
    if (name === 'DeviceGray' || name === 'CalGray') return 'gray';
    return null;
  }
  if (cs instanceof PDFArray && cs.size() >= 2) {
    const family = cs.lookup(0);
    if (family instanceof PDFName && family.decodeText() === 'ICCBased') {
      const profile = doc.context.lookup(cs.get(1));
      if (profile instanceof PDFStream) {
        const n = num(profile.dict.lookup(N('N')));
        if (n === 3) return 'rgb';
        if (n === 1) return 'gray';
      }
    }
  }
  return null;
}

/** Reverses PNG row predictors (DecodeParms /Predictor >= 10). */
function unpredict(data: Uint8Array, columns: number, colors: number): Uint8Array | null {
  const bpp = colors;
  const rowLen = columns * colors;
  const rows = Math.floor(data.length / (rowLen + 1));
  const out = new Uint8Array(rows * rowLen);
  for (let y = 0; y < rows; y++) {
    const type = data[y * (rowLen + 1)];
    const src = y * (rowLen + 1) + 1;
    const dst = y * rowLen;
    for (let x = 0; x < rowLen; x++) {
      const raw = data[src + x];
      const left = x >= bpp ? out[dst + x - bpp] : 0;
      const up = y > 0 ? out[dst - rowLen + x] : 0;
      const upLeft = y > 0 && x >= bpp ? out[dst - rowLen + x - bpp] : 0;
      let v: number;
      switch (type) {
        case 0:
          v = raw;
          break;
        case 1:
          v = raw + left;
          break;
        case 2:
          v = raw + up;
          break;
        case 3:
          v = raw + ((left + up) >> 1);
          break;
        case 4: {
          const p = left + up - upLeft;
          const pa = Math.abs(p - left);
          const pb = Math.abs(p - up);
          const pc = Math.abs(p - upLeft);
          v = raw + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft);
          break;
        }
        default:
          return null;
      }
      out[dst + x] = v & 0xff;
    }
  }
  return out;
}

/** Heuristic: line art / screenshots have few distinct colours and suffer as JPEG. */
function looksLikePhoto(raw: Uint8Array, channels: number): boolean {
  const pixels = raw.length / channels;
  const step = Math.max(1, Math.floor(pixels / 20000));
  const seen = new Set<number>();
  for (let i = 0; i < pixels; i += step) {
    const p = i * channels;
    const v = channels === 3 ? (raw[p] << 16) | (raw[p + 1] << 8) | raw[p + 2] : raw[p];
    seen.add(v);
  }
  return seen.size > (channels === 3 ? 2000 : 128);
}

async function rawToImageData(
  stream: PDFRawStream,
  width: number,
  height: number,
  channels: number,
): Promise<ImageData | null> {
  let raw = await inflate(stream.contents);
  const parms = stream.dict.lookup(N('DecodeParms'));
  if (parms instanceof PDFDict) {
    const predictor = num(parms.lookup(N('Predictor'))) ?? 1;
    if (predictor >= 10) {
      const columns = num(parms.lookup(N('Columns'))) ?? width;
      const colors = num(parms.lookup(N('Colors'))) ?? channels;
      const bpc = num(parms.lookup(N('BitsPerComponent'))) ?? 8;
      if (columns !== width || colors !== channels || bpc !== 8) return null;
      const out = unpredict(raw, columns, colors);
      if (!out) return null;
      raw = out;
    } else if (predictor !== 1) {
      return null;
    }
  }
  if (raw.length < width * height * channels) return null;
  if (!looksLikePhoto(raw, channels)) return null;
  const rgba = new Uint8ClampedArray(width * height * 4);
  for (let i = 0, s = 0, d = 0; i < width * height; i++, s += channels, d += 4) {
    rgba[d] = raw[s];
    rgba[d + 1] = channels === 3 ? raw[s + 1] : raw[s];
    rgba[d + 2] = channels === 3 ? raw[s + 2] : raw[s];
    rgba[d + 3] = 255;
  }
  return new ImageData(rgba, width, height);
}

async function recompressImage(
  doc: PDFDocument,
  stream: PDFRawStream,
  level: Level,
  grayscale: boolean,
): Promise<PDFRawStream | null> {
  const dict = stream.dict;
  if (dict.lookup(N('ImageMask')) === PDFBool.True) return null;
  if (dict.has(N('Decode'))) return null;
  const width = num(dict.lookup(N('Width')));
  const height = num(dict.lookup(N('Height')));
  const bpc = num(dict.lookup(N('BitsPerComponent')));
  if (!width || !height || bpc !== 8) return null;
  if (width * height < 16_000) return null; // icons, bullets: not worth it
  const kind = colorKind(doc, dict);
  if (!kind) return null;

  const filters = filtersOf(dict);
  let img: ImageData | null = null;
  if (filters.length === 1 && filters[0] === 'DCTDecode') {
    const decode = (await import('@jsquash/jpeg/decode')).default;
    // PDF viewers ignore EXIF orientation, so pixels are decoded as stored.
    img = await decode(stream.contents.slice().buffer, { preserveOrientation: false });
    if (img.width !== width || img.height !== height) return null;
  } else if (filters.length === 1 && filters[0] === 'FlateDecode' && level.flateToJpeg) {
    img = await rawToImageData(stream, width, height, kind === 'rgb' ? 3 : 1);
  }
  if (!img) return null;

  // Soft masks must keep matching their base image, so masked images are
  // re-encoded at their original size.
  const masked = dict.has(N('SMask')) || dict.has(N('Mask'));
  const scaled = masked ? img : await resizeImage(img, level.maxSide);
  const gray = grayscale || kind === 'gray';
  const jpeg = new Uint8Array(await encodeJpeg(scaled, level.quality, gray));
  if (jpeg.length >= stream.contents.length * 0.92) return null;

  const next = dict.clone(doc.context);
  next.set(N('Width'), PDFNumber.of(scaled.width));
  next.set(N('Height'), PDFNumber.of(scaled.height));
  next.set(N('BitsPerComponent'), PDFNumber.of(8));
  next.set(N('Filter'), N('DCTDecode'));
  next.delete(N('DecodeParms'));
  if (gray && kind === 'rgb') next.set(N('ColorSpace'), N('DeviceGray'));
  return PDFRawStream.of(next, jpeg);
}

function removeUnreachable(doc: PDFDocument) {
  const ctx = doc.context;
  if (!ctx.trailerInfo.Root) return;
  const reachable = new Set<string>();
  const stack: PDFObject[] = [];
  const { Root, Info, Encrypt, ID } = ctx.trailerInfo;
  for (const o of [Root, Info, Encrypt, ID]) if (o) stack.push(o);
  while (stack.length) {
    const obj = stack.pop()!;
    if (obj instanceof PDFRef) {
      const key = obj.toString();
      if (reachable.has(key)) continue;
      reachable.add(key);
      const target = ctx.lookup(obj);
      if (target) stack.push(target);
    } else if (obj instanceof PDFDict) {
      for (const [, v] of obj.entries()) stack.push(v);
    } else if (obj instanceof PDFArray) {
      for (const v of obj.asArray()) stack.push(v);
    } else if (obj instanceof PDFStream) {
      stack.push(obj.dict);
    }
  }
  for (const [ref] of ctx.enumerateIndirectObjects()) {
    if (!reachable.has(ref.toString())) ctx.delete(ref);
  }
}

async function loadPdf(bytes: Uint8Array): Promise<PDFDocument> {
  try {
    return await PDFDocument.load(bytes, {
      updateMetadata: false,
      parseSpeed: ParseSpeeds.Fastest,
    });
  } catch (e) {
    if (e instanceof EncryptedPDFError) throw new EngineError('encrypted');
    throw new EngineError('decode', String(e));
  }
}

export async function compressPdf(
  input: ArrayBuffer,
  options: PdfCompressOptions,
  progress: (v: number) => void,
): Promise<JobResult> {
  const original = new Uint8Array(input);
  const doc = await loadPdf(original.slice());
  if (doc.isEncrypted) throw new EngineError('encrypted');
  const ctx = doc.context;
  const level = LEVELS[options.level] ?? LEVELS.medium;
  progress(0.05);

  // Images referenced as soft masks are left alone (their size must match).
  const maskRefs = new Set<string>();
  const images: [PDFRef, PDFRawStream][] = [];
  for (const [ref, obj] of ctx.enumerateIndirectObjects()) {
    if (!(obj instanceof PDFRawStream)) continue;
    for (const key of ['SMask', 'Mask']) {
      const v = obj.dict.get(N(key));
      if (v instanceof PDFRef) maskRefs.add(v.toString());
    }
    if (obj.dict.lookup(N('Subtype')) === N('Image')) images.push([ref, obj]);
  }

  let done = 0;
  for (const [ref, stream] of images) {
    if (!maskRefs.has(ref.toString())) {
      try {
        const replacement = await recompressImage(doc, stream, level, options.grayscale);
        if (replacement) ctx.assign(ref, replacement);
      } catch {
        // Leave images we cannot decode exactly as they were.
      }
    }
    done++;
    progress(0.05 + 0.8 * (done / Math.max(1, images.length)));
  }

  // Thumbnails and application-private data are ignored by viewers.
  for (const page of doc.getPages()) {
    page.node.delete(N('Thumb'));
    page.node.delete(N('PieceInfo'));
  }
  doc.catalog.delete(N('PieceInfo'));

  // Deflate streams that were stored without compression.
  for (const [ref, obj] of ctx.enumerateIndirectObjects()) {
    if (!(obj instanceof PDFRawStream) || obj.contents.length < 256) continue;
    const d = obj.dict;
    if (d.has(N('Filter')) || d.lookup(N('Type')) === N('Metadata')) continue;
    try {
      const packed = await deflate(obj.contents);
      if (packed.length < obj.contents.length * 0.9) {
        const next = d.clone(ctx);
        next.set(N('Filter'), N('FlateDecode'));
        next.delete(N('DecodeParms'));
        ctx.assign(ref, PDFRawStream.of(next, packed));
      }
    } catch {
      // keep as is
    }
  }

  removeUnreachable(doc);
  progress(0.9);

  const saved = await doc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    updateFieldAppearances: false,
    objectsPerTick: Infinity,
  });
  progress(0.97);

  let valid = saved.length < original.length;
  if (valid) {
    try {
      const check = await PDFDocument.load(saved, { updateMetadata: false });
      valid = check.getPageCount() === doc.getPageCount();
    } catch {
      valid = false;
    }
  }
  progress(1);
  if (!valid) return { data: input, mime: MIME.pdf, ext: 'pdf', keptOriginal: true };
  return { data: saved.slice().buffer, mime: MIME.pdf, ext: 'pdf' };
}

const PAGE_SIZES = {
  a4: [595.28, 841.89],
  letter: [612, 792],
} as const;

export async function imagesToPdf(
  inputs: { data: ImageSource; format: InputFormat }[],
  options: ImagesToPdfOptions,
  progress: (v: number) => void,
): Promise<JobResult> {
  const doc = await PDFDocument.create();
  doc.setProducer(SITE_NAME);
  doc.setCreator(SITE_NAME);
  const margin = options.margin ? 28 : 0; // ~1 cm

  for (let i = 0; i < inputs.length; i++) {
    const { data, format } = inputs[i];
    let embedded;
    const bytes = data instanceof ImageBitmap ? null : new Uint8Array(data);
    if (bytes && format === 'jpg' && jpegOrientation(bytes) === 1) {
      embedded = await doc.embedJpg(bytes); // lossless pass-through
    } else if (bytes && format === 'png') {
      embedded = await doc.embedPng(bytes);
    } else {
      const img = await decodeImage(data, format);
      let opaque = true;
      for (let p = 3; p < img.data.length; p += 4) {
        if (img.data[p] !== 255) {
          opaque = false;
          break;
        }
      }
      if (opaque) {
        embedded = await doc.embedJpg(new Uint8Array(await encodeJpeg(img, 92)));
      } else {
        const encode = (await import('@jsquash/png/encode')).default;
        embedded = await doc.embedPng(new Uint8Array(await encode(img)));
      }
    }

    const iw = embedded.width;
    const ih = embedded.height;
    let pw: number;
    let ph: number;
    if (options.pageSize === 'fit') {
      // 96 dpi: CSS pixels to points.
      pw = iw * 0.75 + margin * 2;
      ph = ih * 0.75 + margin * 2;
    } else {
      const [w, h] = PAGE_SIZES[options.pageSize];
      [pw, ph] = iw > ih ? [h, w] : [w, h];
    }
    const scale = Math.min((pw - margin * 2) / iw, (ph - margin * 2) / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const page = doc.addPage([pw, ph]);
    page.drawImage(embedded, { x: (pw - dw) / 2, y: (ph - dh) / 2, width: dw, height: dh });
    progress((i + 1) / inputs.length);
  }

  const out = await doc.save({ useObjectStreams: true, objectsPerTick: Infinity });
  return { data: out.slice().buffer, mime: MIME.pdf, ext: 'pdf' };
}
