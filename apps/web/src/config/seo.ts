/**
 * SEO Configuration and Templates
 */

export const SITE_CONFIG = {
  brandName: "FashionSite",
  baseUrl: import.meta.env.PUBLIC_SITE_URL || "https://fashionsite.com",
};

const CMS_URL = import.meta.env.CMS_URL || "http://cms:3000";

export async function getBrandName(): Promise<string> {
  try {
    const res = await fetch(`${CMS_URL}/api/globals/site-settings`);
    if (res.ok) {
      const data = await res.json();
      const raw = (data as any).siteName || SITE_CONFIG.brandName;
      return String(raw).replace(/<[^>]*>/g, "");
    }
  } catch {}
  return SITE_CONFIG.brandName;
}

export async function generateHomeTitle(articleCount: number, brandName?: string): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  return `Latest Fashion News & Style Trends | ${brand}`;
}

export async function generateHomeDescription(articleCount: number, brandName?: string): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  return `Stay up to date with the latest fashion news, style trends and top stories on ${brand}.`;
}

export async function generateCategoryTitle(categoryName: string, articleCount: number, brandName?: string): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  return `${categoryName} — News & Articles | ${brand}`;
}

export async function generateCategoryDescription(categoryName: string, articleCount: number, brandName?: string): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  return `${articleCount} fresh articles on ${categoryName}: news, opinions and analysis on ${brand}.`;
}

export async function generateTagTitle(tagName: string, articleCount: number, brandName?: string): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  return `${tagName} — Articles, News & Reviews | ${brand}`;
}

export async function generateTagDescription(tagName: string, articleCount: number, brandName?: string): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  return `${articleCount} articles tagged "${tagName}": news, analysis and more on ${brand}.`;
}

export async function generateSearchTitle(query: string, resultCount: number, brandName?: string): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  return `Search "${query}" — ${resultCount} results | ${brand}`;
}

export async function generateSearchDescription(query: string, resultCount: number, brandName?: string): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  return `Found ${resultCount} articles for "${query}": news, stories and opinions on ${brand}.`;
}

export async function generateArticleTitle(articleTitle: string, brandName?: string): Promise<string> {
  const brand = brandName ?? (await getBrandName());
  return `${articleTitle} | ${brand}`;
}

export async function generateArticleDescription(excerpt: string, brandName?: string): Promise<string> {
  const brand = brandName ?? (await getBrandName());

  const firstPeriodIndex = excerpt.indexOf(".");
  if (firstPeriodIndex > 0 && firstPeriodIndex <= 160) {
    return `${excerpt.substring(0, firstPeriodIndex + 1).trim()} Read more on ${brand}.`;
  }

  const maxLength = 160;
  if (excerpt.length <= maxLength) {
    const result = excerpt.trim();
    return (result.endsWith('.') || result.endsWith('!') || result.endsWith('?'))
      ? `${result} Read more on ${brand}.`
      : `${result}. Read more on ${brand}.`;
  }

  let truncated = excerpt.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");
  if (lastSpaceIndex > maxLength - 30) truncated = truncated.substring(0, lastSpaceIndex);
  truncated = truncated.replace(/[,;:\s]+$/, "").trim();
  return `${truncated}... Read more on ${brand}.`;
}
