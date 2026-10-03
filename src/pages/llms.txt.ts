import type { APIRoute } from 'astro';
import { fmt, getDict, toolText } from '../i18n';
import { LOCALE_INFO, LOCALES, localePath } from '../i18n/locales';
import { SITE_NAME } from '../site';
import { TOOLS } from '../tools';

// llms.txt (https://llmstxt.org): a plain-language summary that helps large
// language models understand and accurately cite the site.
export const GET: APIRoute = ({ site }) => {
  const en = getDict('en');
  const abs = (path: string) => new URL(path, site).href;
  const list = (category: 'compress' | 'convert') =>
    TOOLS.filter((t) => t.category === category)
      .map((t) => {
        const text = toolText(en, t);
        return `- [${text.name}](${abs(localePath('en', t.id))}): ${text.description}`;
      })
      .join('\n');

  const body = `# ${SITE_NAME}

> ${SITE_NAME} is a free online file compressor and converter for PDF, JPG, PNG, WebP, AVIF and HEIC files. All processing happens locally in the user's web browser using WebAssembly: files are never uploaded to a server, there is no sign-up, no watermark and no limit on the number of files.

Key facts:
- Price: completely free, no account, no ads, no file limits (only the device's memory limits very large files).
- Privacy: files never leave the user's device; the server only hosts static files. No cookies or trackers. A strict Content Security Policy prevents data from being sent anywhere.
- Works offline once loaded and can be installed as an app (PWA).
- Engines: MozJPEG (JPEG), oxipng plus palette quantization (PNG), libwebp (WebP), libavif (AVIF), libheif (HEIC), pdf-lib (PDF compression and creation), pdf.js (PDF rendering).
- Batch processing in parallel, before/after comparison, download as ZIP.
- Languages: ${LOCALES.map((l) => LOCALE_INFO[l].name).join(', ')}.

## Compress
${list('compress')}

## Convert
${list('convert')}

## More
- [${fmt(en.meta.aboutTitle)}](${abs(localePath('en', 'about'))}): how in-browser processing works and why files are never uploaded.
- [Sitemap](${abs('/sitemap.xml')})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
