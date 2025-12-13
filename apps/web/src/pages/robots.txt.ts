import type { APIRoute } from 'astro';

const site = (((import.meta as any).env?.SITE as string | undefined) || 'http://localhost:4321');
const CMS_URL = import.meta.env.CMS_URL || 'http://cms:3000';

async function getRobotsContent(): Promise<string> {
  const defaultContent = `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', site).href}`;

  try {
    const res = await fetch(`${CMS_URL}/api/globals/robots`);
    if (!res.ok) {
      return defaultContent;
    }

    const data = await res.json();
    const content = (data as any)?.content;
    if (typeof content === 'string' && content.trim().length > 0) {
      return content;
    }

    return defaultContent;
  } catch (e) {
    return defaultContent;
  }
}

export const GET: APIRoute = async () => {
  const robotsTxt = await getRobotsContent();
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
