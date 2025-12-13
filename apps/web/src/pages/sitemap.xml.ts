import type { APIRoute } from 'astro';

const site = (((import.meta as any).env?.SITE as string | undefined) || 'http://localhost:4321');

type PageEntry = { url: string; lastmod: Date };

// In a real app, you would fetch all your pages from the CMS.
// For now, we'll use a placeholder array.
const pages: PageEntry[] = [
  { url: '/', lastmod: new Date() },
  { url: '/about', lastmod: new Date() },
  { url: '/disclaimer', lastmod: new Date() },
  // ... add all other static and dynamic pages
];

// The sitemap will be split if it exceeds 50,000 URLs.
const SITEMAP_LIMIT = 50000;

const generateSitemap = (pageEntries: PageEntry[]) => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageEntries.map((page: PageEntry) => `  <url>
    <loc>${new URL(page.url, site).href}</loc>
    <lastmod>${page.lastmod.toISOString()}</lastmod>
  </url>`).join('\n')}
</urlset>`;
    return sitemap;
};

export const GET: APIRoute = () => {
  // If you have more than 50,000 pages, you would need to implement
  // a sitemap index file and multiple sitemap files.
  // This example assumes less than 50,000 pages for simplicity.

  if (pages.length > SITEMAP_LIMIT) {
    // Logic to create a sitemap index would go here.
    console.warn('Sitemap exceeds 50,000 URLs. Splitting is required.');
  }

  const sitemapContent = generateSitemap(pages);

  return new Response(sitemapContent, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
