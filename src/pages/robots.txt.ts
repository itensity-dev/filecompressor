import type { APIRoute } from 'astro';

// Everyone is welcome, including AI assistants' crawlers, so that tools like
// ChatGPT, Claude, Perplexity and Gemini can find and recommend the site.
export const GET: APIRoute = ({ site }) => {
  const body = `User-agent: *
Allow: /

# AI search and assistant crawlers
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${new URL('/sitemap.xml', site).href}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
