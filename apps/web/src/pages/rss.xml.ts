import type { APIRoute } from 'astro';
import { getCmsEnv } from '../utils/cmsEnv';

const { cmsUrl: CMS_URL } = getCmsEnv();
const SITE_URL = 'https://modareview.com';
const FEED_LIMIT = 50;

type PayloadArticle = {
  id: string;
  title?: string;
  slug?: string;
  metaDescription?: string;
  publishedDate?: string;
  feedImageUrl?: string;
  categories?: Array<{ id: string; name?: string }>;
};

type ArticlesResponse = {
  docs?: PayloadArticle[];
};

async function fetchArticles(): Promise<PayloadArticle[]> {
  try {
    const url = `${CMS_URL}/api/articles?where[status][equals]=published&depth=1&sort=-publishedDate&page=1&limit=${FEED_LIMIT}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Failed to fetch articles for RSS:', res.status);
      return [];
    }
    const data = (await res.json()) as ArticlesResponse;
    return Array.isArray(data?.docs) ? data.docs : [];
  } catch (e) {
    console.error('Error fetching articles for RSS:', e);
    return [];
  }
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatRFC822Date(dateString: string): string {
  const date = new Date(dateString);
  return date.toUTCString();
}

function getCategoryName(article: PayloadArticle): string {
  if (!Array.isArray(article.categories) || article.categories.length === 0) {
    return '';
  }
  const first = article.categories[0];
  return first?.name ?? '';
}

function generateRssItem(article: PayloadArticle): string {
  const title = escapeXml(article.title ?? '');
  const slug = article.slug ?? article.id;
  const link = `${SITE_URL}/article/${slug}`;
  const description = escapeXml(article.metaDescription ?? '');
  const pubDate = article.publishedDate ? formatRFC822Date(article.publishedDate) : '';
  const categoryName = getCategoryName(article);
  const category = categoryName ? `    <category>${escapeXml(categoryName)}</category>\n` : '';
  
  let enclosure = '';
  if (article.feedImageUrl) {
    enclosure = `    <enclosure url="${escapeXml(article.feedImageUrl)}" type="image/jpeg" />\n`;
  }

  return `  <item>
    <title>${title}</title>
    <link>${link}</link>
    <description>${description}</description>
    <pubDate>${pubDate}</pubDate>
${enclosure}${category}    <guid isPermaLink="true">${link}</guid>
  </item>`;
}

export const GET: APIRoute = async () => {
  const articles = await fetchArticles();
  
  const items = articles.map(generateRssItem).join('\n');
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>LADY.NEWS</title>
    <link>${SITE_URL}</link>
    <description>Fashion news and style guides</description>
    <language>ru</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
