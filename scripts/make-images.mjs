// Renders PNG icons and the Open Graph image from HTML with headless Chromium.
// Run after changing the brand: `node scripts/make-images.mjs`.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const logo = readFileSync('public/favicon.svg', 'utf8');
const browser = await chromium.launch();
const page = await browser.newPage();

async function shot(html, width, height, path) {
  await page.setViewportSize({ width, height });
  await page.setContent(`<!doctype html><html><body style="margin:0">${html}</body></html>`);
  await page.screenshot({ path, omitBackground: false });
  console.log('wrote', path);
}

const icon = (size, padding) =>
  `<div style="width:${size}px;height:${size}px;display:grid;place-items:center;background:#4f46e5">
     <div style="width:${size - padding * 2}px;height:${size - padding * 2}px">${logo.replace('<svg', '<svg width="100%" height="100%"')}</div>
   </div>`;

await shot(icon(512, 40), 512, 512, 'public/icon-512.png');
await shot(icon(192, 16), 192, 192, 'public/icon-192.png');
await shot(icon(180, 14), 180, 180, 'public/apple-touch-icon.png');
await shot(`<div style="width:32px;height:32px">${logo.replace('<svg', '<svg width="32" height="32"')}</div>`, 32, 32, 'public/favicon-32.png');

const formats = ['PDF', 'JPG', 'PNG', 'WebP', 'AVIF', 'HEIC']
  .map((f) => `<span style="padding:10px 22px;border-radius:999px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.25)">${f}</span>`)
  .join('');
await shot(
  `<div style="width:1200px;height:630px;box-sizing:border-box;padding:80px;display:flex;flex-direction:column;justify-content:space-between;
      background:radial-gradient(circle at 85% 15%,#7c74ff 0,transparent 45%),linear-gradient(135deg,#312e81,#4f46e5);color:#fff;font-family:system-ui,sans-serif">
     <div style="display:flex;align-items:center;gap:20px;font-size:40px;font-weight:700">
       <div style="width:72px;height:72px;border-radius:18px;overflow:hidden;box-shadow:0 0 0 3px rgba(255,255,255,.4)">${logo.replace('<svg', '<svg width="72" height="72"')}</div>
       FileCompressor
     </div>
     <div>
       <div style="font-size:68px;font-weight:800;line-height:1.1;letter-spacing:-1px">Compress &amp; convert files<br>right in your browser</div>
       <div style="margin-top:22px;font-size:30px;opacity:.9">Free · No upload · No limits · Works offline</div>
     </div>
     <div style="display:flex;gap:14px;font-size:26px;font-weight:600">${formats}</div>
   </div>`,
  1200,
  630,
  'public/og.png',
);
await browser.close();
