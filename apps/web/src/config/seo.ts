/**
 * SEO Configuration and Templates
 */

export const SITE_CONFIG = {
  brandName: 'FashionSite',
  baseUrl: import.meta.env.PUBLIC_SITE_URL || 'https://fashionsite.com',
};

const CMS_URL = import.meta.env.CMS_URL || 'http://cms:3000';

export async function getBrandName(): Promise<string> {
  try {
    const res = await fetch(`${CMS_URL}/api/globals/site-settings`);
    if (res.ok) {
      const data = await res.json();
      const raw = (data as any).siteName || SITE_CONFIG.brandName;
      return String(raw).replace(/<[^>]*>/g, '');
    }
  } catch {
    // ignore errors and use fallback brand name
  }

  return SITE_CONFIG.brandName;
}

/**
 * Generate meta title for home page
 * @param articleCount - number of articles
 */
export async function generateHomeTitle(articleCount: number, brandName?: string): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  return `Последние новости сегодня | ${brand}`;
}

/**
 * Generate meta description for home page
 * @param articleCount - number of articles
 */
export async function generateHomeDescription(articleCount: number, brandName?: string): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  return `Актуальные события, аналитика и топ-материалы: на ${brand}.`;
}

/**
 * Generate meta title for category page
 * @param categoryName - name of the category
 * @param articleCount - number of articles in the category
 */
export async function generateCategoryTitle(
  categoryName: string,
  articleCount: number,
  brandName?: string,
): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  return `${categoryName} — новости и статьи | ${brand}`;
}

/**
 * Generate meta description for category page
 * @param categoryName - name of the category
 * @param articleCount - number of articles in the category
 */
export async function generateCategoryDescription(
  categoryName: string,
  articleCount: number,
  brandName?: string,
): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  return `${articleCount} свежих материалов по теме «${categoryName}»: события, мнения, хроника на ${brand}.`;
}

/**
 * Generate meta title for tag page
 * @param tagName - name of the tag
 * @param articleCount - number of articles with the tag
 */
export async function generateTagTitle(tagName: string, articleCount: number, brandName?: string): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  return `${tagName} — материалы, новости и обзоры | ${brand}`;
}

/**
 * Generate meta description for tag page
 * @param tagName - name of the tag
 * @param articleCount - number of articles with the tag
 */
export async function generateTagDescription(tagName: string, articleCount: number, brandName?: string): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  return `Подборка материалов по тегу «${tagName}»: ${articleCount} новостей, аналитика, фото и видео на ${brand}.`;
}

/**
 * Generate meta title for search page
 * @param query - search query
 * @param resultCount - number of search results
 */
export async function generateSearchTitle(
  query: string,
  resultCount: number,
  brandName?: string,
): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  return `Поиск «${query}» — ${resultCount} результатов | ${brand}`;
}

/**
 * Generate meta description for search page
 * @param query - search query
 * @param resultCount - number of search results
 */
export async function generateSearchDescription(
  query: string,
  resultCount: number,
  brandName?: string,
): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  return `Найдено ${resultCount} материалов по запросу «${query}»: новости, статьи, мнения на ${brand}.`;
}

/**
 * Generate meta title for article page
 * @param articleTitle - title of the article
 */
export async function generateArticleTitle(articleTitle: string, brandName?: string): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  return `${articleTitle} | ${brand}`;
}

/**
 * Generate meta description for article page
 * Truncates excerpt to first period or 150-160 chars with soft truncation
 * @param excerpt - article excerpt
 */
export async function generateArticleDescription(excerpt: string, brandName?: string): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  if (!excerpt) {
    return `Подробности — на ${brand}.`;
  }

  // Ищем первую точку
  const firstPeriodIndex = excerpt.indexOf('.');
  
  // Если точка найдена в пределах разумного (до 160 символов), обрезаем по ней
  if (firstPeriodIndex > 0 && firstPeriodIndex <= 160) {
    const textToFirstPeriod = excerpt.substring(0, firstPeriodIndex + 1).trim();
    return `${textToFirstPeriod} Подробности — на ${brand}.`;
  }
  
  // Иначе обрезаем до 150-160 символов с мягким обрезанием (по пробелу)
  const maxLength = 160;
  if (excerpt.length <= maxLength) {
    // Если текст короткий, используем его полностью
    const result = excerpt.trim();
    // Добавляем точку, если её нет
    return result.endsWith('.') || result.endsWith('!') || result.endsWith('?')
      ? `${result} Подробности — на ${brand}.`
      : `${result}. Подробности — на ${brand}.`;
  }
  
  // Мягкое обрезание: ищем последний пробел до maxLength
  let truncated = excerpt.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength - 30) {
    // Если пробел найден не слишком далеко от конца
    truncated = truncated.substring(0, lastSpaceIndex);
  }
  
  // Убираем возможные знаки препинания в конце обрезанного текста
  truncated = truncated.replace(/[,;:\s]+$/, '').trim();
  
  return `${truncated}... Подробности — на ${brand}.`;
}
