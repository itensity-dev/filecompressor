// Image decode / resize / encode. Runs inside the processing worker; codecs
// are WebAssembly builds of MozJPEG, libwebp, libavif and oxipng (via jSquash)
// and are only downloaded the first time they are needed.

import { MIME } from './formats';
import { countColors, quantize } from './quantize';
import {
  EngineError,
  type ImageFormat,
  type ImageOptions,
  type ImageSource,
  type InputFormat,
  type JobResult,
} from './types';

// Below this estimated PSNR a 256-colour palette visibly damages the image
// (smooth photos, wide gradients), so PNGs fall back to lossless mode.
const MIN_PALETTE_PSNR = 30;

function bitmapToImageData(bitmap: ImageBitmap): ImageData {
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new EngineError('failed', 'no 2d context');
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

async function decodeWithCodec(buf: ArrayBuffer, format: InputFormat): Promise<ImageData> {
  switch (format) {
    case 'jpg':
      return (await import('@jsquash/jpeg/decode')).default(buf, { preserveOrientation: true });
    case 'png':
      return (await import('@jsquash/png/decode')).default(buf);
    case 'webp':
      return (await import('@jsquash/webp/decode')).default(buf);
    case 'avif': {
      const img = await (await import('@jsquash/avif/decode')).default(buf);
      if (!img) throw new EngineError('decode');
      return img;
    }
    default:
      throw new EngineError('unsupported');
  }
}

/**
 * Decodes to straight RGBA. The browser's decoder is preferred: it is fast,
 * applies EXIF orientation and converts embedded colour profiles to sRGB
 * (we strip profiles on output). WebAssembly decoders are the fallback.
 */
export async function decodeImage(input: ImageSource, format: InputFormat): Promise<ImageData> {
  if (input instanceof ImageBitmap) return bitmapToImageData(input);
  const mime = (MIME as Record<string, string>)[format];
  try {
    const bitmap = await createImageBitmap(new Blob([input], { type: mime }), {
      imageOrientation: 'from-image',
      premultiplyAlpha: 'none',
    });
    return bitmapToImageData(bitmap);
  } catch {
    try {
      return await decodeWithCodec(input, format);
    } catch (e) {
      if (e instanceof EngineError) throw e;
      throw new EngineError('decode', String(e));
    }
  }
}

export async function resizeImage(img: ImageData, maxSide: number): Promise<ImageData> {
  const longest = Math.max(img.width, img.height);
  if (!maxSide || longest <= maxSide) return img;
  const scale = maxSide / longest;
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));
  const resize = (await import('@jsquash/resize')).default;
  return resize(img, { width, height, method: 'lanczos3', premultiply: true, linearRGB: true });
}

function hasAlpha(img: ImageData): boolean {
  const d = img.data;
  for (let p = 3; p < d.length; p += 4) if (d[p] !== 255) return true;
  return false;
}

/** JPEG has no transparency: composite onto white instead of black. */
function flattenOnWhite(img: ImageData): ImageData {
  if (!hasAlpha(img)) return img;
  const d = new Uint8ClampedArray(img.data);
  for (let p = 0; p < d.length; p += 4) {
    const a = d[p + 3] / 255;
    d[p] = d[p] * a + 255 * (1 - a);
    d[p + 1] = d[p + 1] * a + 255 * (1 - a);
    d[p + 2] = d[p + 2] * a + 255 * (1 - a);
    d[p + 3] = 255;
  }
  return new ImageData(d, img.width, img.height);
}

export async function encodeJpeg(
  img: ImageData,
  quality: number,
  grayscale = false,
): Promise<ArrayBuffer> {
  const encode = (await import('@jsquash/jpeg/encode')).default;
  return encode(flattenOnWhite(img), {
    quality,
    progressive: true,
    optimize_coding: true,
    // MozJpegColorSpace: 1 = grayscale, 3 = YCbCr
    color_space: grayscale ? 1 : 3,
    // Keep full chroma resolution at high quality settings (sharper text/edges).
    auto_subsample: quality < 90,
    chroma_subsample: quality < 90 ? 2 : 1,
  });
}

async function encodePng(img: ImageData, lossy: boolean): Promise<ArrayBuffer> {
  const optimise = (await import('@jsquash/oxipng/optimise')).default;
  let pixels = img;
  if (lossy && countColors(img, 256) > 256) {
    const q = quantize(img, 256, 0.8);
    if (q.psnr >= MIN_PALETTE_PSNR) pixels = q.image;
  }
  // oxipng losslessly converts images with <= 256 colours to indexed PNG.
  const level = img.width * img.height > 8_000_000 ? 1 : 2;
  return optimise(pixels, { level, interlace: false, optimiseAlpha: true });
}

async function encodeWebp(img: ImageData, quality: number): Promise<ArrayBuffer> {
  const encode = (await import('@jsquash/webp/encode')).default;
  return encode(img, quality >= 100 ? { lossless: 1, quality: 100 } : { quality, method: 4 });
}

async function encodeAvif(img: ImageData, quality: number): Promise<ArrayBuffer> {
  const encode = (await import('@jsquash/avif/encode')).default;
  // Faster speed preset for large images keeps encode times reasonable.
  const speed = img.width * img.height > 4_000_000 ? 8 : 6;
  return encode(img, { quality, speed, lossless: quality >= 100 });
}

export async function encodeImage(
  img: ImageData,
  format: ImageFormat,
  options: ImageOptions,
): Promise<ArrayBuffer> {
  switch (format) {
    case 'jpg':
      return encodeJpeg(img, options.quality);
    case 'png':
      return encodePng(img, options.pngLossy);
    case 'webp':
      return encodeWebp(img, options.quality);
    case 'avif':
      return encodeAvif(img, options.quality);
  }
}

const OUTPUT_FORMATS: ImageFormat[] = ['jpg', 'png', 'webp', 'avif'];

export async function processImage(
  input: ImageSource,
  inFormat: InputFormat,
  options: ImageOptions,
  progress: (v: number) => void,
): Promise<JobResult> {
  let target: ImageFormat;
  if (options.format === 'same') {
    if (!OUTPUT_FORMATS.includes(inFormat as ImageFormat)) {
      // HEIC/GIF/BMP cannot be written back: use the closest web format.
      target = inFormat === 'gif' ? 'png' : 'jpg';
    } else {
      target = inFormat as ImageFormat;
    }
  } else {
    target = options.format;
  }

  const originalSize = input instanceof ImageBitmap ? Infinity : input.byteLength;
  const original = input instanceof ImageBitmap ? null : input.slice(0);

  // Lossless PNG -> PNG without resizing: optimise the original file
  // directly so pixels (incl. 16-bit and colour profiles) stay untouched.
  if (target === 'png' && inFormat === 'png' && !options.pngLossy && !options.maxSide && original) {
    progress(0.2);
    const optimise = (await import('@jsquash/oxipng/optimise')).default;
    const data = await optimise(original, { level: 2, interlace: false, optimiseAlpha: true });
    progress(1);
    if (data.byteLength >= originalSize) {
      return { data: original, mime: MIME.png, ext: 'png', keptOriginal: true };
    }
    return { data, mime: MIME.png, ext: 'png' };
  }

  progress(0.1);
  const decoded = await decodeImage(input, inFormat);
  progress(0.3);
  const img = await resizeImage(decoded, options.maxSide);
  const resized = img !== decoded;
  progress(0.45);
  const data = await encodeImage(img, target, options);
  progress(1);

  // Never hand back a bigger file in the same format and size.
  if (target === inFormat && original && !resized && data.byteLength >= originalSize) {
    return {
      data: original,
      mime: MIME[target],
      ext: target,
      width: img.width,
      height: img.height,
      keptOriginal: true,
    };
  }
  return { data, mime: MIME[target], ext: target, width: img.width, height: img.height };
}
