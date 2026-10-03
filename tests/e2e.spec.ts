import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { PDFDocument } from 'pdf-lib';
import { makeImage, makePdf } from './fixtures';

// Fails a test on CSP violations, uncaught errors and any request that leaves
// the site's origin (files must never be uploaded anywhere).
function guard(page: Page) {
  const problems: string[] = [];
  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error' && !/favicon/.test(text)) problems.push(`console: ${text}`);
    if (/Content Security Policy/i.test(text)) problems.push(`csp: ${text}`);
  });
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
  page.on('request', (req) => {
    const url = new URL(req.url());
    if (!['http:', 'https:'].includes(url.protocol)) return;
    if (url.host !== 'localhost:4321') problems.push(`external request: ${req.url()}`);
    if (req.method() !== 'GET') problems.push(`non-GET request: ${req.method()} ${req.url()}`);
  });
  return problems;
}

async function download(page: Page, click: () => Promise<void>) {
  const [dl] = await Promise.all([page.waitForEvent('download'), click()]);
  return { name: dl.suggestedFilename(), bytes: readFileSync((await dl.path())!) };
}

const doneRows = (page: Page) => page.locator('.item.is-done');

/** Opens a tool page and waits until the interactive app has hydrated. */
async function openTool(page: Page, path: string) {
  await page.goto(path);
  await page.locator('.app[data-ready]').waitFor();
}

test('home page is indexable and multilingual', async ({ page }) => {
  const problems = guard(page);
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/$|example\.com$/);
  expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBe(8);
  await expect(page.locator('meta[http-equiv="content-security-policy"]')).toHaveCount(1);
  expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(0);
  await page.goto('/ru/compress-pdf');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  expect(problems).toEqual([]);
});

test('sitemap, robots and llms.txt are served', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('hreflang="ru"');
  expect(sitemap).toContain('/ru/compress-pdf');
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Sitemap:');
  const llms = await (await request.get('/llms.txt')).text();
  expect(llms).toContain('Compress PDF');
});

test('compress JPG: smaller files, ZIP download', async ({ page }) => {
  const problems = guard(page);
  await openTool(page, '/compress-jpg');
  const a = await makeImage(page, { width: 2400, height: 1600, type: 'image/jpeg', quality: 0.98, noise: true });
  const b = await makeImage(page, { width: 1200, height: 900, type: 'image/jpeg', quality: 0.95, noise: true });
  await page.locator('input[type=file]').setInputFiles([
    { name: 'photo-a.jpg', mimeType: 'image/jpeg', buffer: a },
    { name: 'photo-b.jpg', mimeType: 'image/jpeg', buffer: b },
  ]);
  await expect(doneRows(page)).toHaveCount(2);
  await expect(page.locator('.badge-saving').first()).toBeVisible();

  const single = await download(page, () => page.locator('.item').first().getByRole('button', { name: /download/i }).click());
  expect(single.name).toBe('photo-a.jpg');
  expect(single.bytes.length).toBeLessThan(a.length * 0.6);
  expect(single.bytes.subarray(0, 3).toString('hex')).toBe('ffd8ff');

  const zip = await download(page, () => page.locator('.toolbar').getByRole('button', { name: /zip/i }).click());
  expect(zip.name).toBe('compress-jpg.zip');
  expect(zip.bytes.subarray(0, 4).toString('hex')).toBe('504b0304');
  expect(problems).toEqual([]);
});

test('compress PNG: palette reduction keeps it a valid, smaller PNG', async ({ page }) => {
  const problems = guard(page);
  await openTool(page, '/compress-png');
  const png = await makeImage(page, { width: 1600, height: 1000, type: 'image/png', alpha: true });
  await page.locator('input[type=file]').setInputFiles({ name: 'graphic.png', mimeType: 'image/png', buffer: png });
  await expect(doneRows(page)).toHaveCount(1);
  const out = await download(page, () => page.locator('.item').getByRole('button', { name: /download/i }).click());
  expect(out.name).toBe('graphic.png');
  expect(out.bytes.subarray(1, 4).toString()).toBe('PNG');
  expect(out.bytes.length).toBeLessThan(png.length * 0.7);
  expect(problems).toEqual([]);
});

for (const [tool, from, mime, ext, magic] of [
  ['png-to-webp', 'png', 'image/png', 'webp', 'RIFF'],
  ['jpg-to-avif', 'jpg', 'image/jpeg', 'avif', 'ftyp'],
  ['webp-to-jpg', 'webp', 'image/webp', 'jpg', '\xff\xd8\xff'],
  ['jpg-to-png', 'jpg', 'image/jpeg', 'png', 'PNG'],
] as const) {
  test(`convert ${tool}`, async ({ page }) => {
    const problems = guard(page);
    await openTool(page, `/${tool}`);
    const input = await makeImage(page, { width: 800, height: 600, type: mime, quality: 0.9, noise: true });
    await page.locator('input[type=file]').setInputFiles({ name: `pic.${from}`, mimeType: mime, buffer: input });
    await expect(doneRows(page)).toHaveCount(1);
    const out = await download(page, () => page.locator('.item').getByRole('button', { name: /download/i }).click());
    expect(out.name).toBe(`pic.${ext}`);
    expect(out.bytes.toString('latin1')).toContain(magic);
    expect(problems).toEqual([]);
  });
}

test('compress PDF: much smaller, still a valid 2-page PDF', async ({ page }) => {
  const problems = guard(page);
  await openTool(page, '/compress-pdf');
  const pdf = await makePdf(page);
  await page.locator('input[type=file]').setInputFiles({ name: 'scan.pdf', mimeType: 'application/pdf', buffer: pdf });
  await expect(doneRows(page)).toHaveCount(1);
  const out = await download(page, () => page.locator('.item').getByRole('button', { name: /download/i }).click());
  expect(out.name).toBe('scan.pdf');
  expect(out.bytes.length).toBeLessThan(pdf.length * 0.5);
  const doc = await PDFDocument.load(out.bytes);
  expect(doc.getPageCount()).toBe(2);
  expect(problems).toEqual([]);
});

test('JPG to PDF: combines images in order', async ({ page }) => {
  const problems = guard(page);
  await openTool(page, '/jpg-to-pdf');
  const a = await makeImage(page, { width: 1200, height: 1600, type: 'image/jpeg', quality: 0.9 });
  const b = await makeImage(page, { width: 1600, height: 1000, type: 'image/png' });
  await page.locator('input[type=file]').setInputFiles([
    { name: 'one.jpg', mimeType: 'image/jpeg', buffer: a },
    { name: 'two.png', mimeType: 'image/png', buffer: b },
  ]);
  await page.getByRole('button', { name: /create pdf/i }).click();
  const out = await download(page, () => page.locator('.combine').getByRole('button', { name: /download/i }).click());
  expect(out.name).toMatch(/\.pdf$/);
  const doc = await PDFDocument.load(out.bytes);
  expect(doc.getPageCount()).toBe(2);
  const [p1, p2] = doc.getPages();
  expect(p1.getWidth()).toBeLessThan(p1.getHeight()); // portrait A4 for a tall image
  expect(p2.getWidth()).toBeGreaterThan(p2.getHeight()); // landscape for a wide one
  expect(problems).toEqual([]);
});

test('PDF to JPG: one image per page', async ({ page }) => {
  const problems = guard(page);
  await openTool(page, '/pdf-to-jpg');
  const pdf = await makePdf(page);
  await page.locator('input[type=file]').setInputFiles({ name: 'doc.pdf', mimeType: 'application/pdf', buffer: pdf });
  await expect(doneRows(page)).toHaveCount(1);
  await expect(page.locator('.summary')).toContainText('2');
  const out = await download(page, () => page.locator('.item').getByRole('button', { name: /download/i }).click());
  expect(out.name).toBe('doc.zip');
  expect(out.bytes.subarray(0, 4).toString('hex')).toBe('504b0304');
  expect(problems).toEqual([]);
});

test('rejects files of the wrong type with a clear message', async ({ page }) => {
  await openTool(page, '/compress-pdf');
  await page.locator('input[type=file]').setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hello world, not a pdf at all') });
  await expect(page.locator('.item.is-error')).toHaveCount(1);
});

test('HEIC decoder loads under CSP and reports broken files', async ({ page }) => {
  const problems = guard(page);
  await openTool(page, '/heic-to-jpg');
  // Valid HEIF "ftyp" header followed by garbage.
  const header = Buffer.from('00000018667479706865696300000000', 'hex');
  const ftyp = Buffer.concat([header, Buffer.from('mif1heic'), Buffer.alloc(2000, 7)]);
  await page.locator('input[type=file]').setInputFiles({ name: 'broken.heic', mimeType: 'image/heic', buffer: ftyp });
  await expect(page.locator('.item.is-error')).toHaveCount(1);
  await expect(page.locator('.item-status')).toContainText(/damaged/);
  // Expected: a decode error, not a CSP violation or a crash.
  expect(problems.filter((p) => !p.startsWith('console:'))).toEqual([]);
});
