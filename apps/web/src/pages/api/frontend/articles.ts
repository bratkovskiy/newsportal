import type { APIRoute } from 'astro';

// В SSR используем CMS_URL (для Docker - http://cms:3000)
const CMS_URL = import.meta.env.CMS_URL || 'http://cms:3000';

export const GET: APIRoute = async ({ url }) => {
  try {
    const page = Number(url.searchParams.get('page') || '1');
    const limit = Number(url.searchParams.get('limit') || '20');

    const cmsUrl = new URL('/api/articles', CMS_URL);
    cmsUrl.searchParams.set('where[status][equals]', 'published');
    cmsUrl.searchParams.set('depth', '1');
    cmsUrl.searchParams.set('sort', '-publishedDate');
    cmsUrl.searchParams.set('page', String(page));
    cmsUrl.searchParams.set('limit', String(limit));

    const res = await fetch(cmsUrl.toString());
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return new Response(JSON.stringify({ error: 'Failed to fetch from CMS', status: res.status, text }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
