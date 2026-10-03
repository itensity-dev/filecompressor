import type { APIRoute } from 'astro';
import { LOCALE_INFO, LOCALES, localePath } from '../i18n/locales';
import { TOOLS } from '../tools';

// One <url> per page and language, each listing all its translations
// (hreflang alternates), as recommended by Google for multilingual sites.
export const GET: APIRoute = ({ site }) => {
  const pages = ['', ...TOOLS.map((t) => t.id), 'about'];
  const abs = (path: string) => new URL(path, site).href;
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = pages.flatMap((page) =>
    LOCALES.map((locale) => {
      const links = LOCALES.map(
        (l) =>
          `    <xhtml:link rel="alternate" hreflang="${LOCALE_INFO[l].hreflang}" href="${abs(localePath(l, page))}"/>`,
      ).join('\n');
      const priority = page === '' ? '1.0' : page === 'about' ? '0.5' : '0.9';
      return `  <url>
    <loc>${abs(localePath(locale, page))}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
${links}
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(localePath('en', page))}"/>
  </url>`;
    }),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
