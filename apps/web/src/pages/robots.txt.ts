import type { APIRoute } from 'astro';
import { getSiteUrl } from '../utils/siteUrl';

const CMS_URL = import.meta.env.CMS_URL || 'http://cms:3000';

async function getRobotsContent(siteUrl: string): Promise<string> {
  const sitemapLine = `Sitemap: ${new URL('sitemap.xml', siteUrl).href}`;
  const defaultContent = `User-agent: *\nAllow: /\n\n${sitemapLine}`;

  try {
    const res = await fetch(`${CMS_URL}/api/globals/robots`);
    if (!res.ok) {
      return defaultContent;
    }

    const data = await res.json();
    const content = (data as any)?.content;
    if (typeof content === 'string' && content.trim().length > 0) {
      // Replace any localhost sitemap references with the correct production URL
      const fixed = content.replace(/Sitemap:\s*https?:\/\/localhost[^\n]*/gi, sitemapLine);
      // If no Sitemap directive present, append one
      if (!/^sitemap:/im.test(fixed)) {
        return `${fixed.trimEnd()}\n\n${sitemapLine}`;
      }
      return fixed;
    }

    return defaultContent;
  } catch (e) {
    return defaultContent;
  }
}

export const GET: APIRoute = async ({ request }) => {
  const siteUrl = getSiteUrl(request);
  const robotsTxt = await getRobotsContent(siteUrl);
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
