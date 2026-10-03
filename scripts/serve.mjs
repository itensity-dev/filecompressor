// Static server for the built site that mimics Cloudflare Pages: clean URLs
// (/compress-pdf -> compress-pdf.html) and the headers from dist/_headers.
// Used by the e2e tests; also handy to preview production behaviour:
//   npm run build && node scripts/serve.mjs
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'dist');
const port = Number(process.env.PORT || 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.wasm': 'application/wasm',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.bcmap': 'application/octet-stream',
  '.pfb': 'application/octet-stream',
  '.ttf': 'font/ttf',
  '.icc': 'application/vnd.iccprofile',
};

// Parse the Netlify/Cloudflare `_headers` format.
const rules = [];
const headersFile = join(root, '_headers');
if (existsSync(headersFile)) {
  let current = null;
  for (const line of readFileSync(headersFile, 'utf8').split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      current = { pattern: line.trim(), headers: {} };
      rules.push(current);
    } else if (current) {
      const i = line.indexOf(':');
      current.headers[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
}
const matches = (pattern, path) =>
  new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`).test(path);

function resolve(path) {
  const clean = normalize(decodeURIComponent(path)).replace(/^(\.\.[/\\])+/, '');
  const candidates = [clean, `${clean}.html`, join(clean, 'index.html')];
  for (const c of candidates) {
    const file = join(root, c);
    if (file.startsWith(root) && existsSync(file) && statSync(file).isFile()) return file;
  }
  return null;
}

createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const file = resolve(url.pathname === '/' ? '/index.html' : url.pathname);
  for (const rule of rules) {
    if (matches(rule.pattern, url.pathname)) {
      for (const [k, v] of Object.entries(rule.headers)) res.setHeader(k, v);
    }
  }
  if (!file) {
    res.statusCode = 404;
    res.setHeader('Content-Type', TYPES['.html']);
    res.end(readFileSync(join(root, '404.html')));
    return;
  }
  res.setHeader('Content-Type', TYPES[extname(file)] || 'application/octet-stream');
  res.end(readFileSync(file));
}).listen(port, () => console.log(`Serving dist on http://localhost:${port}`));
