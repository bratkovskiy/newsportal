import { XMLParser } from 'fast-xml-parser';
import type { PayloadRequest } from 'payload';

interface FieldMapping {
  titleField?: string;
  contentField?: string;
  excerptField?: string;
  authorField?: string;
  categoryField?: string;
  tagsField?: string;
  imageField?: string;
  dateField?: string;
  defaultCategoryId?: number;
  authorSource?: 'from_feed' | 'existing' | 'create_new';
  existingAuthor?: number | { id: number };
  newAuthorName?: string;
}

interface FeedDoc {
  id: number;
  name: string;
  url: string;
  type?: 'rss' | 'json' | null;
  enabled?: boolean | null;
  fieldMapping?: FieldMapping;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

// Функция для извлечения значения по пути с точками (например: "media:content.@_url")
function getNestedValue(obj: any, path: string): any {
  if (!path || !obj) return undefined;
  
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  
  return value;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripHtmlTags(input: string): string {
  if (!input) return '';
  return input.replace(/<[^>]*>/g, ' ');
}

function extractFirstImageFromHtml(html: string): string | undefined {
  if (!html) return undefined;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : undefined;
}

function parseRssItems(xml: string): any[] {
  const json = parser.parse(xml);
  const channel = (json as any)?.rss?.channel || (json as any)?.channel;
  if (!channel) return [];

  const items = (channel as any).item ?? [];
  return Array.isArray(items) ? items : [items];
}

async function ensureAuthor(req: PayloadRequest, name?: string | null): Promise<number | null> {
  const trimmed = (name || '').trim();
  if (!trimmed) return null;

  const existing = await req.payload.find({
    collection: 'authors',
    where: { name: { equals: trimmed } },
    limit: 1,
  });

  if (existing.docs[0]?.id) return existing.docs[0].id as number;

  const created = await req.payload.create({
    collection: 'authors',
    data: { name: trimmed },
  });

  return (created as any).id ?? null;
}

async function ensureCategory(req: PayloadRequest, name?: string | null): Promise<number | null> {
  const trimmed = (name || '').trim();
  if (!trimmed) return null;

  const existing = await req.payload.find({
    collection: 'categories',
    where: { name: { equals: trimmed } },
    limit: 1,
  });

  if (existing.docs[0]?.id) return existing.docs[0].id as number;

  const slug = trimmed
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const created = await req.payload.create({
    collection: 'categories',
    data: { name: trimmed, slug },
    draft: false,
  });

  return (created as any).id ?? null;
}

async function ensureTag(req: PayloadRequest, name?: string | null): Promise<number | null> {
  const trimmed = (name || '').trim();
  if (!trimmed) return null;

  const existing = await req.payload.find({
    collection: 'tags',
    where: { name: { equals: trimmed } },
    limit: 1,
  });

  if (existing.docs[0]?.id) return existing.docs[0].id as number;

  const slug = trimmed
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const created = await req.payload.create({
    collection: 'tags',
    data: { name: trimmed, slug },
    draft: false,
  });

  return (created as any).id ?? null;
}

async function getDefaultCoverImageId(req: PayloadRequest): Promise<number | null> {
  const media = await req.payload.find({
    collection: 'media',
    limit: 1,
  });
  return (media.docs[0] as any)?.id ?? null;
}

async function articleExistsByTitle(req: PayloadRequest, title: string): Promise<boolean> {
  const existing = await req.payload.find({
    collection: 'articles',
    where: { title: { equals: title } },
    limit: 1,
  });
  return Boolean(existing.docs[0]);
}

function mapItemToArticlePayload(
  item: any,
  defaults: {
    coverImageId: number | null;
  },
  mapping?: FieldMapping,
) {
  // Используем маппинг полей из настроек фида или дефолтные значения
  const titleField = mapping?.titleField || 'title';
  const contentField = mapping?.contentField || 'content:encoded';
  const excerptField = mapping?.excerptField || 'custom:secondTitle';
  const authorField = mapping?.authorField || 'dc:creator';
  const categoryField = mapping?.categoryField; // Не используем дефолтное значение!
  const tagsField = mapping?.tagsField || 'category';
  const imageField = mapping?.imageField || 'custom:image';
  const dateField = mapping?.dateField || 'pubDate';
  
  const title: string | undefined = getNestedValue(item, titleField) || item[titleField];
  const description: string | undefined = item.description;
  const secondTitle: string | undefined = getNestedValue(item, excerptField) || item[excerptField];
  const contentHtmlSource: string | undefined =
    getNestedValue(item, contentField) || item[contentField] || item['content:encoded'] || item.content;

  const minExcerptLength = 20;
  const maxExcerptLength = 200;

  // Источники для анонса: сначала специальное поле (secondTitle), потом description,
  // потом HTML-контент и в крайнем случае title
  const rawExcerptSource: string | undefined =
    secondTitle || description || contentHtmlSource || title;

  const excerptTextFull = rawExcerptSource
    ? stripHtmlTags(rawExcerptSource).replace(/\s+/g, ' ').trim()
    : '';

  let excerpt = excerptTextFull;

  // Если совсем пусто, используем заголовок
  if (!excerpt && title) {
    excerpt = String(title);
  }

  // Если текста меньше минимальной длины, слегка "распухаем" за счёт заголовка
  if (excerpt.length < minExcerptLength && title) {
    const padded = `${title}. ${excerpt || ''}`.replace(/\s+/g, ' ').trim();
    excerpt = padded;
  }

  // Жёстко ограничиваем максимум 200 символов
  if (excerpt.length > maxExcerptLength) {
    excerpt = `${excerpt.slice(0, maxExcerptLength - 3).trimEnd()}...`;
  }

  const htmlContent: string | undefined = contentHtmlSource;
  const authorName: string | undefined = 
    getNestedValue(item, authorField) || item[authorField] || item.author || item['dc:creator'];
  const pubDateRaw: string | undefined = getNestedValue(item, dateField) || item[dateField];
  
  // Теперь category из фида идет в теги
  const tagFieldValue = getNestedValue(item, tagsField) || item[tagsField];
  const tagNames = Array.isArray(tagFieldValue) ? tagFieldValue : tagFieldValue ? [tagFieldValue] : [];
  
  // Для категории: только если categoryField указано и не пустое
  const categoryFromFeed: string | undefined = (categoryField && categoryField.trim()) 
    ? (getNestedValue(item, categoryField) || item[categoryField]) 
    : undefined;
  
  // Изображение: поддержка вложенных путей типа "media:content.@_url"
  let imageUrl: string | undefined = getNestedValue(item, imageField) || item[imageField];
  
  // Fallback: если в фиде нет изображения, извлекаем первое <img> из HTML-контента
  if (!imageUrl && htmlContent) {
    imageUrl = extractFirstImageFromHtml(htmlContent);
  }
  
  if (imageField && imageField.includes('.')) {
    console.log('Image field extraction:', { imageField, extracted: getNestedValue(item, imageField), direct: item[imageField], final: imageUrl });
  }

  if (!title) return null;

  const publishedDate = pubDateRaw ? new Date(pubDateRaw) : null;
  const publishedDateISO =
    publishedDate && !Number.isNaN(publishedDate.getTime()) ? publishedDate.toISOString() : null;

  const contentHtmlCombined = htmlContent || '';

  const hasImage = Boolean(imageUrl);
  const statusValue: 'draft' | 'published' = hasImage ? 'published' : 'draft';

  return {
    data: {
      title,
      excerpt: excerpt || '',
      contentHtml: contentHtmlCombined,
      seo: {
        metaTitle: title,
        metaDescription: description || secondTitle || '',
      },
      status: statusValue,
      _status: statusValue,
      coverImage: defaults.coverImageId,
      ...(publishedDateISO ? { publishedDate: publishedDateISO } : {}),
    },
    meta: {
      authorName,
      tagNames,
      categoryName: categoryFromFeed,
      imageUrl,
    },
  };
}

async function importFromFeedDoc(req: PayloadRequest, feed: FeedDoc) {
  let response: Response;

  try {
    // Используем глобальный fetch из Node/Next. Возможны сетевые ошибки,
    // поэтому обязательно оборачиваем в try/catch.
    // eslint-disable-next-line no-undef
    response = await fetch(feed.url);
  } catch (e: any) {
    const msg = e?.message || String(e);
    throw new Error(`Failed to fetch feed ${feed.url}: ${msg}`);
  }

  if (!response || typeof (response as any).ok === 'undefined') {
    throw new Error(`Failed to fetch feed ${feed.url}: invalid response object`);
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch feed ${feed.url}: ${response.status} ${response.statusText || ''}`.trim(),
    );
  }

  const xml = await response.text();
  const items = parseRssItems(xml);
  if (!items.length) {
    return { created: 0, skipped: 0 };
  }

  const coverImageId = await getDefaultCoverImageId(req);
  let createdCount = 0;
  let skippedCount = 0;

  for (const item of items) {
    const mapped = mapItemToArticlePayload(item, { coverImageId }, feed.fieldMapping);
    if (!mapped) {
      skippedCount += 1;
      continue;
    }

    const { data, meta } = mapped;

    const exists = await articleExistsByTitle(req, data.title as string);
    if (exists) {
      skippedCount += 1;
      continue;
    }

    // Обрабатываем автора в зависимости от источника
    let authorId: number | null = null;
    const authorSource = feed.fieldMapping?.authorSource || 'from_feed';
    
    console.log('Author processing:', { authorSource, existingAuthor: feed.fieldMapping?.existingAuthor, meta_authorName: meta.authorName });
    
    if (authorSource === 'from_feed' && meta.authorName) {
      // Берем автора из фида
      authorId = await ensureAuthor(req, meta.authorName);
    } else if (authorSource === 'existing') {
      // Используем существующего автора
      if (feed.fieldMapping?.existingAuthor) {
        const existingAuthorId = typeof feed.fieldMapping.existingAuthor === 'number' 
          ? feed.fieldMapping.existingAuthor 
          : (feed.fieldMapping.existingAuthor as any)?.id;
        console.log('Extracted existingAuthorId:', existingAuthorId);
        if (existingAuthorId) {
          authorId = existingAuthorId;
        }
      }
    } else if (authorSource === 'create_new' && feed.fieldMapping?.newAuthorName) {
      // Создаем нового автора
      authorId = await ensureAuthor(req, feed.fieldMapping.newAuthorName);
    }
    
    // Автор обязателен для статьи
    if (!authorId) {
      console.error('No author ID resolved, skipping article:', data.title);
      skippedCount += 1;
      continue;
    }
    
    console.log('Final authorId:', authorId);
    
    // Обрабатываем теги (бывшие category из фида)
    const tagIds: number[] = [];
    if (meta.tagNames && Array.isArray(meta.tagNames)) {
      for (const tagName of meta.tagNames) {
        const tagId = await ensureTag(req, typeof tagName === 'string' ? tagName : String(tagName));
        if (tagId) tagIds.push(tagId);
      }
    }
    
    // Обрабатываем категорию: либо из настроек фида, либо дефолтная (ID 64)
    let categoryId: number | null = null;
    if (meta.categoryName) {
      categoryId = await ensureCategory(req, meta.categoryName);
    }
    if (!categoryId) {
      categoryId = feed.fieldMapping?.defaultCategoryId || 64; // Дефолтная категория
    }

    const articleData: any = {
      ...data,
    };

    if (meta.imageUrl) {
      articleData.feedImageUrl = meta.imageUrl;
    }

    if (authorId) articleData.author = authorId;
    if (categoryId) articleData.categories = [categoryId];
    if (tagIds.length > 0) articleData.tags = tagIds;

    await req.payload.create({
      collection: 'articles',
      data: articleData,
    });

    createdCount += 1;
  }

  await (req.payload as any).update({
    collection: 'feeds',
    id: feed.id,
    data: {
      lastImportedAt: new Date().toISOString(),
      lastImportStatus: `ok: created=${createdCount}, skipped=${skippedCount}`,
    },
  });

  return { created: createdCount, skipped: skippedCount };
}

export async function importAllFeedsFromCMS(req: PayloadRequest) {
  const feedsRes = await req.payload.find({
    collection: 'feeds',
    where: {
      enabled: { equals: true },
      type: { equals: 'rss' },
    },
    limit: 100,
  });

  const results: Array<{ feedId: number; feedName: string; created: number; skipped: number }> = [];

  for (const feed of feedsRes.docs as any as FeedDoc[]) {
    const r = await importFromFeedDoc(req, feed);
    results.push({ feedId: feed.id, feedName: feed.name, ...r });
  }

  return { feeds: results };
}

export async function importFeedByIdFromCMS(req: PayloadRequest, id: number) {
  const feedDoc = (await req.payload.findByID({
    collection: 'feeds',
    id,
  })) as any as FeedDoc;

  if (!feedDoc.enabled || (feedDoc.type && feedDoc.type !== 'rss')) {
    return { skipped: true };
  }

  const r = await importFromFeedDoc(req, feedDoc);
  return { feedId: feedDoc.id, feedName: feedDoc.name, ...r };
}
