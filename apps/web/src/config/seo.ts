/**
 * SEO Configuration and Templates
 */

export const SITE_CONFIG = {
  brandName: 'FashionSite',
  baseUrl: import.meta.env.PUBLIC_SITE_URL || 'https://fashionsite.com',
};

/**
 * Generate meta title for home page
 * @param articleCount - number of articles
 */
export function generateHomeTitle(articleCount: number): string {
  return `Последние новости сегодня | ${SITE_CONFIG.brandName}`;
}

/**
 * Generate meta description for home page
 * @param articleCount - number of articles
 */
export function generateHomeDescription(articleCount: number): string {
  return `Актуальные события, аналитика и топ-материалы: на ${SITE_CONFIG.brandName}.`;
}

/**
 * Generate meta title for category page
 * @param categoryName - name of the category
 * @param articleCount - number of articles in the category
 */
export function generateCategoryTitle(categoryName: string, articleCount: number): string {
  return `${categoryName} — новости и статьи | ${SITE_CONFIG.brandName}`;
}

/**
 * Generate meta description for category page
 * @param categoryName - name of the category
 * @param articleCount - number of articles in the category
 */
export function generateCategoryDescription(categoryName: string, articleCount: number): string {
  return `${articleCount} свежих материалов по теме «${categoryName}»: события, мнения, хроника на ${SITE_CONFIG.brandName}.`;
}

/**
 * Generate meta title for tag page
 * @param tagName - name of the tag
 * @param articleCount - number of articles with the tag
 */
export function generateTagTitle(tagName: string, articleCount: number): string {
  return `${tagName} — материалы, новости и обзоры | ${SITE_CONFIG.brandName}`;
}

/**
 * Generate meta description for tag page
 * @param tagName - name of the tag
 * @param articleCount - number of articles with the tag
 */
export function generateTagDescription(tagName: string, articleCount: number): string {
  return `Подборка материалов по тегу «${tagName}»: ${articleCount} новостей, аналитика, фото и видео на ${SITE_CONFIG.brandName}.`;
}

/**
 * Generate meta title for search page
 * @param query - search query
 * @param resultCount - number of search results
 */
export function generateSearchTitle(query: string, resultCount: number): string {
  return `Поиск «${query}» — ${resultCount} результатов | ${SITE_CONFIG.brandName}`;
}

/**
 * Generate meta description for search page
 * @param query - search query
 * @param resultCount - number of search results
 */
export function generateSearchDescription(query: string, resultCount: number): string {
  return `Найдено ${resultCount} материалов по запросу «${query}»: новости, статьи, мнения на ${SITE_CONFIG.brandName}.`;
}

/**
 * Generate meta title for article page
 * @param articleTitle - title of the article
 */
export function generateArticleTitle(articleTitle: string): string {
  return `${articleTitle} | ${SITE_CONFIG.brandName}`;
}

/**
 * Generate meta description for article page
 * Truncates excerpt to first period or 150-160 chars with soft truncation
 * @param excerpt - article excerpt
 */
export function generateArticleDescription(excerpt: string): string {
  if (!excerpt) {
    return `Подробности — на ${SITE_CONFIG.brandName}.`;
  }

  // Ищем первую точку
  const firstPeriodIndex = excerpt.indexOf('.');
  
  // Если точка найдена в пределах разумного (до 160 символов), обрезаем по ней
  if (firstPeriodIndex > 0 && firstPeriodIndex <= 160) {
    const textToFirstPeriod = excerpt.substring(0, firstPeriodIndex + 1).trim();
    return `${textToFirstPeriod} Подробности — на ${SITE_CONFIG.brandName}.`;
  }
  
  // Иначе обрезаем до 150-160 символов с мягким обрезанием (по пробелу)
  const maxLength = 160;
  if (excerpt.length <= maxLength) {
    // Если текст короткий, используем его полностью
    const result = excerpt.trim();
    // Добавляем точку, если её нет
    return result.endsWith('.') || result.endsWith('!') || result.endsWith('?')
      ? `${result} Подробности — на ${SITE_CONFIG.brandName}.`
      : `${result}. Подробности — на ${SITE_CONFIG.brandName}.`;
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
  
  return `${truncated}... Подробности — на ${SITE_CONFIG.brandName}.`;
}
