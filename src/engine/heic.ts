// HEIC/HEIF (iPhone photos). Safari decodes HEIC natively; other browsers
// get libheif (LGPL, loaded as a separate chunk only when needed).

import { EngineError } from './types';

let nativeSupport: Promise<boolean> | null = null;

async function canDecodeNatively(file: Blob): Promise<boolean> {
  try {
    const bitmap = await createImageBitmap(file);
    bitmap.close();
    return true;
  } catch {
    return false;
  }
}

/** Returns an ImageBitmap for a HEIC file, decoded on this device. */
export async function decodeHeic(file: Blob): Promise<ImageBitmap> {
  nativeSupport ??= canDecodeNatively(file);
  if (await nativeSupport) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      // fall through to libheif
    }
  }
  // The CSP-safe build avoids eval and runs the decoder in its own worker.
  const { heicTo } = await import('heic-to/csp');
  try {
    return await heicTo({ blob: file, type: 'bitmap' });
  } catch (e) {
    throw new EngineError('decode', String(e));
  }
}
