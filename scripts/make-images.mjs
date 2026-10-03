// Renders PNG icons and the Open Graph image from HTML with headless Chromium.
// Run after changing the brand: `node scripts/make-images.mjs`.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const logo = readFileSync('public/favicon.svg', 'utf8');
const font = readFileSync(
  'node_modules/@fontsource-variable/onest/files/onest-latin-wght-normal.woff2',
).toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage();

async function shot(html, width, height, path) {
  await page.setViewportSize({ width, height });
  await page.setContent(`<!doctype html><html><head><style>
    @font-face { font-family: Onest; src: url(data:font/woff2;base64,${font}) format('woff2'); font-weight: 100 900; }
    body { margin: 0; font-family: Onest, sans-serif; }
  </style></head><body>${html}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path });
  console.log('wrote', path);
}

const sized = (s) => logo.replace('<svg', `<svg width="${s}" height="${s}"`);
const icon = (size, pad) =>
  `<div style="width:${size}px;height:${size}px;display:grid;place-items:center;background:#16150f">
     <div style="width:${size - pad * 2}px;height:${size - pad * 2}px">${logo.replace('<svg', '<svg width="100%" height="100%"')}</div>
   </div>`;

await shot(icon(512, 64), 512, 512, 'public/icon-512.png');
await shot(icon(192, 20), 192, 192, 'public/icon-192.png');
await shot(icon(180, 18), 180, 180, 'public/apple-touch-icon.png');
await shot(sized(32), 32, 32, 'public/favicon-32.png');

const formats = ['PDF', 'JPG', 'PNG', 'WebP', 'AVIF', 'HEIC']
  .map((f) => `<span style="padding:8px 16px;border:2px solid #16150f;border-radius:8px">${f}</span>`)
  .join('');
await shot(
  `<div style="width:1200px;height:630px;box-sizing:border-box;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between;background:#f6f4ef;color:#16150f">
     <div style="display:flex;align-items:center;gap:18px;font-size:36px;font-weight:700;letter-spacing:-0.02em">${sized(56)} FileCompressor</div>
     <div>
       <div style="font-size:84px;font-weight:650;line-height:1;letter-spacing:-0.04em;max-width:960px">Compress and convert files without uploading them</div>
       <div style="display:flex;align-items:center;gap:12px;margin-top:28px;font-size:30px;color:#3b3830">
         <span style="width:14px;height:14px;border-radius:50%;background:#ff5b14"></span> Free · Runs in your browser · Works offline
       </div>
     </div>
     <div style="display:flex;gap:12px;font-family:ui-monospace,Menlo,monospace;font-size:26px;font-weight:700">${formats}</div>
   </div>`,
  1200,
  630,
  'public/og.png',
);
await browser.close();
