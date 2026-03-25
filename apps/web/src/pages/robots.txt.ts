import type { APIRoute } from 'astro';

const CMS_URL = import.meta.env.CMS_URL || 'http://cms:3000';
const SITE_URL = 'https://modareview.com';

export const GET: APIRoute = async () => {
  const sitemapLine = `Sitemap: ${SITE_URL}/sitemap.xml`;
  const defaultContent = `User-agent: *\nAllow: /\n\n${sitemapLine}`;

  try {
    const res = await fetch(`${CMS_URL}/api/globals/robots`);
    if (!res.ok) return new Response(defaultContent, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

    const data = await res.json();
    const content = (data as any)?.content;
    if (typeof content === 'string' && content.trim().length > 0) {
      const fixed = content.replace(/Sitemap:\s*https?:\/\/localhost[^\n]*/gi, sitemapLine);
      if (!/^sitemap:/im.test(fixed)) {
        return new Response(`${fixed.trimEnd()}\n\n${sitemapLine}`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
      return new Response(fixed, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
    return new Response(defaultContent, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  } catch (e) {
    return new Response(defaultContent, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
};
