import type { APIRoute } from 'astro';

const CMS_URL = import.meta.env.CMS_URL || 'http://cms:3000';

function getSiteUrl(request: Request): string {
  const envSite = (import.meta as any).env?.SITE as string | undefined;
  if (envSite) {
    return envSite;
  }

  // Fallback: construct from request headers
  const url = new URL(request.url);
  return url.origin;
}

async function getRobotsContent(siteUrl: string): Promise<string> {
  const defaultContent = `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', siteUrl).href}`;

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

export const GET: APIRoute = async ({ request }) => {
  const siteUrl = getSiteUrl(request);
  const robotsTxt = await getRobotsContent(siteUrl);
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
