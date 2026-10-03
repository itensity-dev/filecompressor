// Copies the static data pdf.js needs at runtime (CMaps for CJK text, standard
// fonts, wasm image decoders, ICC profiles) into public/ so they are served
// from our own origin. Nothing is fetched from third-party CDNs.
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const root = dirname(require.resolve('pdfjs-dist/package.json'));
const out = join(process.cwd(), 'public', 'pdfjs');

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const dir of ['cmaps', 'standard_fonts', 'wasm', 'iccs']) {
  const src = join(root, dir);
  if (existsSync(src)) {
    cpSync(src, join(out, dir), {
      recursive: true,
      // quickjs runs JavaScript embedded in PDFs; scripting stays disabled.
      filter: (path) => !path.includes('quickjs'),
    });
  }
}
console.log('pdf.js assets copied to public/pdfjs');
