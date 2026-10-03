// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// Public URL of the deployed site. Used for canonical URLs, hreflang,
// sitemap.xml, robots.txt and llms.txt. Set SITE_URL in your hosting
// provider's build settings (e.g. https://yourdomain.com).
const site = (process.env.SITE_URL || 'https://example.com').replace(/\/$/, '');

// jSquash codecs ship wasm next to their JS and load it with
// `new URL('./x.wasm', import.meta.url)`; Vite's dependency pre-bundling
// breaks those relative URLs in dev, so these packages are excluded.
const wasmPackages = [
  '@jsquash/avif',
  '@jsquash/jpeg',
  '@jsquash/oxipng',
  '@jsquash/png',
  '@jsquash/resize',
  '@jsquash/webp',
];

export default defineConfig({
  site,
  trailingSlash: 'never',
  build: {
    // /compress-pdf.html is served as /compress-pdf by Cloudflare Pages,
    // Netlify and Vercel, which gives clean canonical URLs.
    format: 'file',
  },
  integrations: [preact()],
  // No Markdown code blocks are used; Shiki's inline styles would clash with CSP.
  markdown: { syntaxHighlight: false },
  security: {
    // Astro emits a <meta http-equiv="content-security-policy"> with hashes of
    // its own inline scripts. Network-facing directives (connect-src etc.)
    // are repeated as an HTTP header in public/_headers so they also cover
    // web workers.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' blob: data:",
        "media-src 'self' blob:",
        "font-src 'self' data:",
        "connect-src 'self' blob: data:",
        "worker-src 'self' blob:",
        "manifest-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
      ],
      scriptDirective: {
        resources: ["'self'", "'wasm-unsafe-eval'"],
      },
      styleDirective: {
        resources: ["'self'", "'unsafe-inline'"],
      },
    },
  },
  vite: {
    optimizeDeps: {
      exclude: wasmPackages,
    },
    worker: {
      format: 'es',
    },
    build: {
      // Codec bundles are large by nature and are only loaded on demand.
      chunkSizeWarningLimit: 4000,
    },
  },
});
