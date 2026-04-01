import type { APIRoute } from 'astro';
import { getSiteUrl } from '../utils/siteUrl';

const CMS_URL: string = (((import.meta as any).env || {}) as Record<string, string | undefined>).CMS_URL || 'http://cms:3000';

type PageEntry = { url: string; lastmod: Date };

// Ограничение sitemaps.org: максимум 50 000 URL в одном sitemap-файле
const SITEMAP_LIMIT = 50000;

const generateSitemap = (pageEntries: PageEntry[], site: string) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageEntries
  .map(
    (page: PageEntry) => `  <url>
    <loc>${new URL(page.url, site).href}</loc>
    <lastmod>${page.lastmod.toISOString()}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>`;
  return sitemap;
};

const generateSitemapIndex = (chunks: PageEntry[][], site: string) => {
  const now = new Date();

  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunks
  .map((chunk, idx) => {
    const lastmod = chunk.reduce<Date | null>((acc, entry) => {
      if (!acc) return entry.lastmod;
      return entry.lastmod > acc ? entry.lastmod : acc;
    }, null) ?? now;

    const locUrl = new URL(`/sitemap.xml?page=${idx + 1}`, site).href;
    return `  <sitemap>
    <loc>${locUrl}</loc>
    <lastmod>${lastmod.toISOString()}</lastmod>
  </sitemap>`;
  })
  .join('\n')}
</sitemapindex>`;

  return indexXml;
};

const addEntry = (entries: PageEntry[], url: string, lastmod?: Date) => {
  if (!url) return;
  entries.push({ url, lastmod: lastmod ?? new Date() });
};

async function fetchPaginatedDocs(path: string, baseParams: Record<string, string>): Promise<any[]> {
  const all: any[] = [];
  let page = 1;

  // используем limit из baseParams или дефолт 100
  const limit = Number(baseParams.limit || '100');

  // простая пагинация по page/totalPages
  // защищаемся от бесконечного цикла жёстким upper bound по страницам
  const MAX_PAGES = 1000;

  while (page <= MAX_PAGES) {
    const url = new URL(path, CMS_URL);
    for (const [key, value] of Object.entries(baseParams)) {
      url.searchParams.set(key, value);
    }
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(limit));

    const res = await fetch(url.toString());
    if (!res.ok) break;

    const data = await res.json();
    const docs: any[] = Array.isArray((data as any)?.docs) ? (data as any).docs : [];
    if (!docs.length) break;

    all.push(...docs);

    const totalPages = typeof (data as any).totalPages === 'number' ? (data as any).totalPages : page;
    if (page >= totalPages) break;

    page += 1;
  }

  return all;
}

function buildArticlePath(article: any): string {
  const slug = article?.slug ? String(article.slug) : '';
  if (slug) return `/article/${slug}`;
  const id = article?.id != null ? String(article.id) : '';
  if (id) return `/article/${id}`;
  return '';
}

export const GET: APIRoute = async ({ request }) => {
  const site = getSiteUrl(request);
  const entries: PageEntry[] = [];
  const now = new Date();

  // Статические страницы
  addEntry(entries, '/');
  addEntry(entries, '/about');
  addEntry(entries, '/disclaimer');
  addEntry(entries, '/legal');
  addEntry(entries, '/privacy-policy');
  addEntry(entries, '/cookies-policy');
  addEntry(entries, '/contacts');
  addEntry(entries, '/search');
  addEntry(entries, '/tags');
  addEntry(entries, '/categories');

  // Категории
  try {
    const categories = await fetchPaginatedDocs('/api/categories', { limit: '100' });
    for (const cat of categories) {
      if (!cat?.slug) continue;
      const lastmodStr: string | undefined = (cat as any).updatedAt || (cat as any).createdAt;
      const lastmod = lastmodStr ? new Date(lastmodStr) : now;
      addEntry(entries, `/categories/${cat.slug}`, lastmod);
      if (entries.length >= SITEMAP_LIMIT) break;
    }
  } catch (error) {
    console.error('Failed to fetch categories for sitemap', error);
  }

  // Теги
  try {
    const tags = await fetchPaginatedDocs('/api/tags', { limit: '100' });
    for (const tag of tags) {
      if (!tag?.slug) continue;
      const lastmodStr: string | undefined = (tag as any).updatedAt || (tag as any).createdAt;
      const lastmod = lastmodStr ? new Date(lastmodStr) : now;
      addEntry(entries, `/tags/${tag.slug}`, lastmod);
      if (entries.length >= SITEMAP_LIMIT) break;
    }
  } catch (error) {
    console.error('Failed to fetch tags for sitemap', error);
  }

  // Статьи (только опубликованные, без noindex)
  try {
    const articles = await fetchPaginatedDocs('/api/articles', {
      'where[status][equals]': 'published',
      sort: '-publishedDate',
      limit: '100',
    });

    for (const article of articles) {
      if ((article as any).noindex) continue;
      const loc = buildArticlePath(article);
      if (!loc) continue;

      const lastmodStr: string | undefined = (article as any).updatedAt
        || (article as any).publishedDate
        || (article as any).createdAt;
      const lastmod = lastmodStr ? new Date(lastmodStr) : now;

      addEntry(entries, loc, lastmod);
    }
  } catch (error) {
    console.error('Failed to fetch articles for sitemap', error);
  }

  const total = entries.length;

  if (total === 0) {
    // Фолбек: хотя бы главная страница
    const fallback = generateSitemap([{ url: '/', lastmod: new Date() }], site);
    return new Response(fallback, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }

  const totalPages = Math.ceil(total / SITEMAP_LIMIT);

  const url = new URL(request.url);
  const pageParam = url.searchParams.get('page');
  const page = pageParam ? Number(pageParam) : NaN;

  if (!pageParam || !Number.isFinite(page) || page < 1 || page > totalPages) {
    // Отдаём sitemap index
    if (totalPages === 1) {
      const sitemapContent = generateSitemap(entries, site);
      return new Response(sitemapContent, {
        headers: {
          'Content-Type': 'application/xml',
        },
      });
    }

    const chunks: PageEntry[][] = [];
    for (let i = 0; i < totalPages; i++) {
      const start = i * SITEMAP_LIMIT;
      const end = start + SITEMAP_LIMIT;
      chunks.push(entries.slice(start, end));
    }

    const indexContent = generateSitemapIndex(chunks, site);
    return new Response(indexContent, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }

  // Конкретная страница sitemap.xml?page=N
  const start = (page - 1) * SITEMAP_LIMIT;
  const end = start + SITEMAP_LIMIT;
  const pageEntries = entries.slice(start, end);
  const sitemapContent = generateSitemap(pageEntries, site);

  return new Response(sitemapContent, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
