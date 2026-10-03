// Test files are generated on the fly (no binary fixtures in the repo).
import type { Page } from '@playwright/test';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

interface ImageSpec {
  width: number;
  height: number;
  type: 'image/jpeg' | 'image/png' | 'image/webp';
  quality?: number;
  /** Photo-like noise (hard to compress) vs. flat screenshot-like graphics. */
  noise?: boolean;
  alpha?: boolean;
}

export async function makeImage(page: Page, spec: ImageSpec): Promise<Buffer> {
  if (page.url() === 'about:blank') await page.goto('/about');
  const b64 = await page.evaluate(async (s) => {
    const c = new OffscreenCanvas(s.width, s.height);
    const ctx = c.getContext('2d')!;
    let seed = 42;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    if (!s.alpha) {
      const g = ctx.createLinearGradient(0, 0, s.width, s.height);
      g.addColorStop(0, '#3b82f6');
      g.addColorStop(0.5, '#f59e0b');
      g.addColorStop(1, '#10b981');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s.width, s.height);
    }
    for (let i = 0; i < 150; i++) {
      ctx.fillStyle = `hsla(${rnd() * 360},70%,${30 + rnd() * 40}%,${0.4 + rnd() * 0.6})`;
      ctx.beginPath();
      ctx.arc(rnd() * s.width, rnd() * s.height, 10 + rnd() * 120, 0, Math.PI * 2);
      ctx.fill();
    }
    if (s.noise) {
      const id = ctx.getImageData(0, 0, s.width, s.height);
      for (let i = 0; i < id.data.length; i += 4) {
        const n = (rnd() - 0.5) * 24;
        id.data[i] += n;
        id.data[i + 1] += n;
        id.data[i + 2] += n;
      }
      ctx.putImageData(id, 0, 0);
    }
    ctx.fillStyle = '#111';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('FileCompressor test image', 40, 90);
    const blob = await c.convertToBlob({ type: s.type, quality: s.quality });
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) {
      bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return btoa(bin);
  }, spec);
  return Buffer.from(b64, 'base64');
}

/** A 2-page PDF with a heavy high-quality photo, like a typical scan. */
export async function makePdf(page: Page): Promise<Buffer> {
  const jpg = await makeImage(page, {
    width: 2480,
    height: 3508,
    type: 'image/jpeg',
    quality: 0.97,
    noise: true,
  });
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const image = await doc.embedJpg(jpg);
  const p1 = doc.addPage([595, 842]);
  p1.drawImage(image, { x: 0, y: 0, width: 595, height: 842 });
  const p2 = doc.addPage([595, 842]);
  p2.drawText('Page two: selectable text must survive compression.', {
    x: 50,
    y: 780,
    size: 16,
    font,
    color: rgb(0, 0, 0),
  });
  p2.drawImage(image, { x: 50, y: 300, width: 300, height: 424 });
  return Buffer.from(await doc.save());
}
