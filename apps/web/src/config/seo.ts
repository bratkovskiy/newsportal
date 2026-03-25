/**
 * SEO Configuration and Templates
 */

export const SITE_CONFIG = {
  brandName: "FashionSite",
  baseUrl: import.meta.env.PUBLIC_SITE_URL || "https://fashionsite.com",
};

const CMS_URL = import.meta.env.CMS_URL || "http://cms:3000";

interface SiteSettings {
  siteName?: string;
  currentLanguage?: 'ru' | 'en';
  seo?: {
    homeTitleEn?: string;
    homeTitleRu?: string;
    homeDescriptionEn?: string;
    homeDescriptionRu?: string;
    categoryTitleSuffixEn?: string;
    categoryTitleSuffixRu?: string;
    categoryDescriptionTemplateEn?: string;
    categoryDescriptionTemplateRu?: string;
    tagTitleSuffixEn?: string;
    tagTitleSuffixRu?: string;
    tagDescriptionTemplateEn?: string;
    tagDescriptionTemplateRu?: string;
    searchTitleTemplateEn?: string;
    searchTitleTemplateRu?: string;
    searchDescriptionTemplateEn?: string;
    searchDescriptionTemplateRu?: string;
    articleReadMoreEn?: string;
    articleReadMoreRu?: string;
  };
}

let cachedSettings: SiteSettings | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 minute

async function getSiteSettings(): Promise<SiteSettings> {
  const now = Date.now();
  if (cachedSettings && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedSettings;
  }

  try {
    const res = await fetch(`${CMS_URL}/api/globals/site-settings`);
    if (res.ok) {
      const data = await res.json();
      cachedSettings = data as SiteSettings;
      cacheTimestamp = now;
      return cachedSettings;
    }
  } catch {}
  
  return {};
}

export async function getBrandName(): Promise<string> {
  const settings = await getSiteSettings();
  const raw = settings.siteName || SITE_CONFIG.brandName;
  return String(raw).replace(/<[^>]*>/g, "");
}

function replaceTemplate(template: string, replacements: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }
  return result;
}

export async function generateHomeTitle(articleCount: number, brandName?: string): Promise<string> {
  const settings = await getSiteSettings();
  const brand = brandName ?? (await getBrandName());
  const lang = settings.currentLanguage || 'en';
  
  const titleTemplate = lang === 'ru' 
    ? (settings.seo?.homeTitleRu || 'Последние новости сегодня')
    : (settings.seo?.homeTitleEn || 'Latest Fashion News & Style Trends');
  
  return `${titleTemplate} | ${brand}`;
}

export async function generateHomeDescription(articleCount: number, brandName?: string): Promise<string> {
  const settings = await getSiteSettings();
  const brand = brandName ?? (await getBrandName());
  const lang = settings.currentLanguage || 'en';
  
  const descTemplate = lang === 'ru'
    ? (settings.seo?.homeDescriptionRu || 'Актуальные события, аналитика и топ-материалы на {siteName}.')
    : (settings.seo?.homeDescriptionEn || 'Stay up to date with the latest fashion news, style trends and top stories on {siteName}.');
  
  return replaceTemplate(descTemplate, { siteName: brand });
}

export async function generateCategoryTitle(categoryName: string, articleCount: number, brandName?: string): Promise<string> {
  const settings = await getSiteSettings();
  const brand = brandName ?? (await getBrandName());
  const lang = settings.currentLanguage || 'en';
  
  const suffix = lang === 'ru'
    ? (settings.seo?.categoryTitleSuffixRu || 'новости и статьи')
    : (settings.seo?.categoryTitleSuffixEn || 'News & Articles');
  
  return `${categoryName} — ${suffix} | ${brand}`;
}

export async function generateCategoryDescription(categoryName: string, articleCount: number, brandName?: string): Promise<string> {
  const settings = await getSiteSettings();
  const brand = brandName ?? (await getBrandName());
  const lang = settings.currentLanguage || 'en';
  
  const template = lang === 'ru'
    ? (settings.seo?.categoryDescriptionTemplateRu || '{count} свежих статей по теме {category}: новости, мнения и аналитика на {siteName}.')
    : (settings.seo?.categoryDescriptionTemplateEn || '{count} fresh articles on {category}: news, opinions and analysis on {siteName}.');
  
  return replaceTemplate(template, { count: articleCount, category: categoryName, siteName: brand });
}

export async function generateTagTitle(tagName: string, articleCount: number, brandName?: string): Promise<string> {
  const settings = await getSiteSettings();
  const brand = brandName ?? (await getBrandName());
  const lang = settings.currentLanguage || 'en';
  
  const suffix = lang === 'ru'
    ? (settings.seo?.tagTitleSuffixRu || 'статьи, новости и обзоры')
    : (settings.seo?.tagTitleSuffixEn || 'Articles, News & Reviews');
  
  return `${tagName} — ${suffix} | ${brand}`;
}

export async function generateTagDescription(tagName: string, articleCount: number, brandName?: string): Promise<string> {
  const settings = await getSiteSettings();
  const brand = brandName ?? (await getBrandName());
  const lang = settings.currentLanguage || 'en';
  
  const template = lang === 'ru'
    ? (settings.seo?.tagDescriptionTemplateRu || '{count} статей с тегом "{tag}": новости, аналитика и многое другое на {siteName}.')
    : (settings.seo?.tagDescriptionTemplateEn || '{count} articles tagged "{tag}": news, analysis and more on {siteName}.');
  
  return replaceTemplate(template, { count: articleCount, tag: tagName, siteName: brand });
}

export async function generateSearchTitle(query: string, resultCount: number, brandName?: string): Promise<string> {
  const settings = await getSiteSettings();
  const brand = brandName ?? (await getBrandName());
  const lang = settings.currentLanguage || 'en';
  
  const template = lang === 'ru'
    ? (settings.seo?.searchTitleTemplateRu || 'Поиск "{query}" — {count} результатов')
    : (settings.seo?.searchTitleTemplateEn || 'Search "{query}" — {count} results');
  
  const title = replaceTemplate(template, { query, count: resultCount, siteName: brand });
  return `${title} | ${brand}`;
}

export async function generateSearchDescription(query: string, resultCount: number, brandName?: string): Promise<string> {
  const settings = await getSiteSettings();
  const brand = brandName ?? (await getBrandName());
  const lang = settings.currentLanguage || 'en';
  
  const template = lang === 'ru'
    ? (settings.seo?.searchDescriptionTemplateRu || 'Найдено {count} статей по запросу "{query}": новости, истории и мнения на {siteName}.')
    : (settings.seo?.searchDescriptionTemplateEn || 'Found {count} articles for "{query}": news, stories and opinions on {siteName}.');
  
  return replaceTemplate(template, { count: resultCount, query, siteName: brand });
}

export async function generateArticleTitle(articleTitle: string, brandName?: string): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  return `${articleTitle} | ${brand}`;
}

export async function generateArticleDescription(excerpt: string, brandName?: string): Promise<string> {
  const settings = await getSiteSettings();
  const brand = brandName ?? (await getBrandName());
  const lang = settings.currentLanguage || 'en';
  
  const readMoreText = lang === 'ru'
    ? (settings.seo?.articleReadMoreRu || 'Подробности — на')
    : (settings.seo?.articleReadMoreEn || 'Read more on');

  const firstPeriodIndex = excerpt.indexOf(".");
  if (firstPeriodIndex > 0 && firstPeriodIndex <= 160) {
    return `${excerpt.substring(0, firstPeriodIndex + 1).trim()} ${readMoreText} ${brand}.`;
  }

  const maxLength = 160;
  if (excerpt.length <= maxLength) {
    const result = excerpt.trim();
    return (result.endsWith('.') || result.endsWith('!') || result.endsWith('?'))
      ? `${result} ${readMoreText} ${brand}.`
      : `${result}. ${readMoreText} ${brand}.`;
  }

  let truncated = excerpt.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");
  if (lastSpaceIndex > maxLength - 30) truncated = truncated.substring(0, lastSpaceIndex);
  truncated = truncated.replace(/[,;:\s]+$/, "").trim();
  return `${truncated}... ${readMoreText} ${brand}.`;
}
