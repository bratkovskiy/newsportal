import { XMLParser } from 'fast-xml-parser';

const CMS_URL = process.env.CMS_URL || 'http://localhost:3000';

interface FeedDoc {
  id: number;
  name: string;
  url: string;
  type?: 'rss' | 'json' | null;
  enabled?: boolean | null;
}

interface CmsListResponse<T> {
  docs: T[];
}

const JOBS_API_KEY = process.env.JOBS_API_KEY || '';

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith('http') ? path : `${CMS_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-jobs-key': JOBS_API_KEY,
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed ${res.status} ${res.statusText} for ${url}: ${text}`);
  }

  return (await res.json()) as T;
}

async function getEnabledFeeds(): Promise<FeedDoc[]> {
  const data = await fetchJSON<CmsListResponse<FeedDoc>>(
    `/api/feeds?where[enabled][equals]=true&limit=50`,
  );
  return Array.isArray(data.docs) ? data.docs : [];
}

async function ensureAuthor(name: string | undefined | null): Promise<number | null> {
  const trimmed = (name || '').trim();
  if (!trimmed) return null;

  const search = encodeURIComponent(trimmed);
  const data = await fetchJSON<CmsListResponse<any>>(
    `/api/authors?where[name][equals]=${search}&limit=1`,
  );

  if (data.docs?.[0]?.id) return data.docs[0].id as number;

  const created = await fetchJSON<any>(`/api/authors`, {
    method: 'POST',
    body: JSON.stringify({ name: trimmed }),
  });

  return created?.id ?? null;
}

async function ensureCategory(name: string | undefined | null): Promise<number | null> {
  const trimmed = (name || '').trim();
  if (!trimmed) return null;

  const search = encodeURIComponent(trimmed);
  const data = await fetchJSON<CmsListResponse<any>>(
    `/api/categories?where[name][equals]=${search}&limit=1`,
  );

  if (data.docs?.[0]?.id) return data.docs[0].id as number;

  const created = await fetchJSON<any>(`/api/categories`, {
    method: 'POST',
    body: JSON.stringify({ name: trimmed }),
  });

  return created?.id ?? null;
}

async function ensureTag(name: string | undefined | null): Promise<number | null> {
  const trimmed = (name || '').trim();
  if (!trimmed) return null;

  const search = encodeURIComponent(trimmed);
  const data = await fetchJSON<CmsListResponse<any>>(
    `/api/tags?where[name][equals]=${search}&limit=1`,
  );

  if (data.docs?.[0]?.id) return data.docs[0].id as number;

  const created = await fetchJSON<any>(`/api/tags`, {
    method: 'POST',
    body: JSON.stringify({ name: trimmed }),
  });

  return created?.id ?? null;
}

async function getDefaultCoverImageId(): Promise<number | null> {
  const data = await fetchJSON<CmsListResponse<any>>(`/api/media?limit=1`);
  return data.docs?.[0]?.id ?? null;
}

function parseRssItems(xml: string): any[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });

  const json = parser.parse(xml);
  const channel = json?.rss?.channel || json?.channel;
  if (!channel) return [];

  const items = channel.item ?? [];
  return Array.isArray(items) ? items : [items];
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripHtmlTags(input: string): string {
  if (!input) return '';
  return input.replace(/<[^>]*>/g, ' ');
}

function mapItemToArticlePayload(item: any, defaults: {
  coverImageId: number | null;
}): any | null {
  const title: string | undefined = item.title;
  const description: string | undefined = item.description;
  const secondTitle: string | undefined = item['custom:secondTitle'];
  const htmlContent: string | undefined =
    item['custom:content'] ?? item['content:encoded'] ?? item.content;
  const authorName: string | undefined = item.author ?? item['dc:creator'];
  const pubDateRaw: string | undefined = item.pubDate;
  
  // Теперь category из фида идет в теги
  const tagNames = Array.isArray(item.category) ? item.category : item.category ? [item.category] : [];
  
  // Для категории ищем специальное поле, если нет - используем дефолтную
  const categoryFromFeed: string | undefined = item['custom:category'];
  
  const imageUrl: string | undefined = item['custom:image'];

  if (!title) return null;

  const publishedDate = pubDateRaw ? new Date(pubDateRaw) : null;
  const publishedDateISO = publishedDate && !Number.isNaN(publishedDate.getTime())
    ? publishedDate.toISOString()
    : null;

  const contentHtmlCombined = htmlContent || '';

  const hasImage = Boolean(imageUrl);
  const statusValue: 'draft' | 'published' = hasImage ? 'published' : 'draft';

  // Нормализованный excerpt: 20–200 символов из secondTitle/description/content/title
  const minExcerptLength = 20;
  const maxExcerptLength = 200;

  const rawExcerptSource: string | undefined =
    secondTitle || description || htmlContent || title;

  const excerptTextFull = rawExcerptSource
    ? stripHtmlTags(rawExcerptSource).replace(/\s+/g, ' ').trim()
    : '';

  let excerpt = excerptTextFull;

  if (!excerpt && title) {
    excerpt = String(title);
  }

  if (excerpt.length < minExcerptLength && title) {
    const padded = `${title}. ${excerpt || ''}`.replace(/\s+/g, ' ').trim();
    excerpt = padded;
  }

  if (excerpt.length > maxExcerptLength) {
    excerpt = `${excerpt.slice(0, maxExcerptLength - 3).trimEnd()}...`;
  }

  return {
    title,
    excerpt,
    contentHtml: contentHtmlCombined,
    seo: {
      metaTitle: title,
      metaDescription: description || secondTitle || '',
    },
    _raw: {
      description: description || '',
      secondTitle: secondTitle || '',
      tagNames: tagNames || [],
      categoryName: categoryFromFeed || '',
      authorName: authorName || '',
      pubDateRaw: pubDateRaw || '',
      imageUrl: imageUrl || '',
    },
    authorName,
    tagNames,
    categoryName: categoryFromFeed,
    status: statusValue,
    publishedDate: publishedDateISO,
    coverImage: defaults.coverImageId,
  };
}

async function articleExistsByTitle(title: string): Promise<boolean> {
  const search = encodeURIComponent(title);
  const data = await fetchJSON<CmsListResponse<any>>(
    `/api/articles?where[title][equals]=${search}&limit=1`,
  );
  return !!data.docs?.[0];
}

async function importFromFeed(feed: FeedDoc): Promise<void> {
  console.log(`\n=== Importing from feed: ${feed.name} (${feed.url}) ===`);

  const res = await fetch(feed.url);
  if (!res.ok) {
    console.error(`Failed to fetch feed ${feed.url}: ${res.status} ${res.statusText}`);
    return;
  }
  const xml = await res.text();

  const items = parseRssItems(xml);
  if (!items.length) {
    console.log('No items in feed.');
    return;
  }

  const coverImageId = await getDefaultCoverImageId();

  for (const item of items) {
    const payload = mapItemToArticlePayload(item, { coverImageId });
    if (!payload) continue;

    if (await articleExistsByTitle(payload.title)) {
      console.log(`Skip existing article: ${payload.title}`);
      continue;
    }

    const authorId = await ensureAuthor(payload.authorName);
    
    // Обрабатываем теги (бывшие category из фида)
    const tagIds: number[] = [];
    if (payload.tagNames && Array.isArray(payload.tagNames)) {
      for (const tagName of payload.tagNames) {
        const tagId = await ensureTag(typeof tagName === 'string' ? tagName : String(tagName));
        if (tagId) tagIds.push(tagId);
      }
    }
    
    // Обрабатываем категорию: либо из custom:category, либо дефолтная (ID 64)
    let categoryId: number | null = null;
    if (payload.categoryName) {
      categoryId = await ensureCategory(payload.categoryName);
    }
    if (!categoryId) {
      categoryId = 64; // Дефолтная категория
    }

    const body: any = {
      title: payload.title,
      excerpt: payload.excerpt,
      contentHtml: payload.contentHtml,
      seo: payload.seo,
      status: payload.status,
      _status: payload.status,
      coverImage: payload.coverImage,
    };

    if (payload.publishedDate) body.publishedDate = payload.publishedDate;
    if (payload._raw?.imageUrl) body.feedImageUrl = payload._raw.imageUrl;
    if (authorId) body.author = authorId;
    if (categoryId) body.categories = [categoryId];
    if (tagIds.length > 0) body.tags = tagIds;

    try {
      const created = await fetchJSON<any>(`/api/articles`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      console.log(`Created article id=${created?.id ?? '?'} title="${payload.title}"`);
    } catch (err) {
      console.error(`Failed to create article "${payload.title}":`, err);
    }
  }
}

export async function runImportFeeds() {
  console.log(`Using CMS_URL=${CMS_URL}`);

  const feeds = await getEnabledFeeds();
  if (!feeds.length) {
    console.log('No enabled feeds found.');
    return;
  }

  for (const feed of feeds) {
    if (feed.type && feed.type !== 'rss') {
      console.log(`Skip feed ${feed.name} (${feed.url}) of type ${feed.type}`);
      continue;
    }

    await importFromFeed(feed);
  }
}

if (require.main === module) {
  runImportFeeds().catch((err) => {
    console.error('Fatal error while importing feeds:', err);
    process.exit(1);
  });
}
