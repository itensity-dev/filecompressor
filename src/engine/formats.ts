import type { ImageFormat, InputFormat } from './types';

export const MIME: Record<ImageFormat | 'pdf' | 'heic' | 'gif' | 'bmp', string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  heic: 'image/heic',
  gif: 'image/gif',
  bmp: 'image/bmp',
  pdf: 'application/pdf',
};

const ascii = (b: Uint8Array, start: number, len: number) =>
  String.fromCharCode(...b.subarray(start, start + len));

/** Detects the real file type from its first bytes (extensions can lie). */
export function sniffFormat(head: Uint8Array): InputFormat {
  if (head.length < 12) return 'unknown';
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return 'jpg';
  if (head[0] === 0x89 && ascii(head, 1, 3) === 'PNG') return 'png';
  if (ascii(head, 0, 4) === 'RIFF' && ascii(head, 8, 4) === 'WEBP') return 'webp';
  if (ascii(head, 0, 4) === 'GIF8') return 'gif';
  if (head[0] === 0x42 && head[1] === 0x4d) return 'bmp';
  if (ascii(head, 4, 4) === 'ftyp') {
    const boxSize = (head[0] << 24) | (head[1] << 16) | (head[2] << 8) | head[3];
    const brands: string[] = [];
    for (let i = 8; i + 4 <= Math.min(boxSize, head.length); i += 4) {
      if (i === 12) continue; // minor_version
      brands.push(ascii(head, i, 4));
    }
    if (brands.some((b) => b === 'avif' || b === 'avis')) return 'avif';
    if (brands.some((b) => /^(heic|heix|hevc|hevx|heim|heis|mif1|msf1)$/.test(b))) return 'heic';
  }
  // %PDF may be preceded by junk bytes in some real-world files.
  const text = ascii(head, 0, Math.min(head.length, 1024));
  if (text.includes('%PDF-')) return 'pdf';
  return 'unknown';
}

export async function sniffFile(file: Blob): Promise<InputFormat> {
  const head = new Uint8Array(await file.slice(0, 1024).arrayBuffer());
  return sniffFormat(head);
}

export function replaceExtension(name: string, ext: string): string {
  const dot = name.lastIndexOf('.');
  const base = dot > 0 ? name.slice(0, dot) : name;
  return `${base}.${ext}`;
}

/** Reads the EXIF orientation (1..8) of a JPEG, or 1 if absent. */
export function jpegOrientation(bytes: Uint8Array): number {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (view.getUint16(0) !== 0xffd8) return 1;
  let offset = 2;
  while (offset + 4 < view.byteLength) {
    const marker = view.getUint16(offset);
    const size = view.getUint16(offset + 2);
    if (marker === 0xffe1 && ascii(bytes, offset + 4, 4) === 'Exif') {
      const tiff = offset + 10;
      const little = view.getUint16(tiff) === 0x4949;
      const ifd = tiff + view.getUint32(tiff + 4, little);
      if (ifd + 2 > view.byteLength) return 1;
      const entries = view.getUint16(ifd, little);
      for (let i = 0; i < entries; i++) {
        const entry = ifd + 2 + i * 12;
        if (entry + 12 > view.byteLength) return 1;
        if (view.getUint16(entry, little) === 0x0112) {
          const value = view.getUint16(entry + 8, little);
          return value >= 1 && value <= 8 ? value : 1;
        }
      }
      return 1;
    }
    if ((marker & 0xff00) !== 0xff00 || marker === 0xffda) break;
    offset += 2 + size;
  }
  return 1;
}
