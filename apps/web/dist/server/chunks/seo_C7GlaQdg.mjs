import { c as createComponent, b as createAstro, a as renderTemplate, e as addAttribute, m as maybeRenderHead, d as renderSlot, r as renderComponent } from './astro/server_CMM1Egp5.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                          */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro();
const $$AdSlot = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AdSlot;
  const CMS_URL = "http://cms:3000";
  const {
    placementKey,
    defaultWidth = 300,
    defaultHeight = 250,
    class: className
  } = Astro2.props;
  let slot = null;
  try {
    const url = new URL("/api/ad-slots", CMS_URL);
    url.searchParams.set("where[key][equals]", placementKey);
    url.searchParams.set("limit", "1");
    const res = await fetch(url.toString());
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.docs) && data.docs.length > 0) {
        const doc = data.docs[0];
        slot = {
          enabled: !!doc.enabled,
          provider: doc.provider,
          yandexBlockId: doc.yandexBlockId,
          adsenseSlotId: doc.adsenseSlotId,
          adFormat: doc.adFormat,
          width: typeof doc.width === "number" ? doc.width : void 0,
          height: typeof doc.height === "number" ? doc.height : void 0
        };
      }
    }
  } catch (e) {
    console.error("Failed to load ad slot config for", placementKey, e);
  }
  const provider = slot && slot.provider ? slot.provider : "yan";
  const width = slot && typeof slot.width === "number" ? slot.width : defaultWidth;
  const height = slot && typeof slot.height === "number" ? slot.height : defaultHeight;
  const slotId = slot && slot.yandexBlockId ? slot.yandexBlockId : "";
  const adUnit = slot && slot.adsenseSlotId ? slot.adsenseSlotId : "";
  const adFormat = slot && slot.adFormat ? slot.adFormat : "auto";
  const isConfigured = provider === "yan" && !!slotId || provider === "adsense" && !!adUnit || provider === "direct" || provider === "prebid";
  const isEnabled = Boolean(slot && slot.enabled && isConfigured);
  const minHeight = `min-h-[${height}px]`;
  const minWidth = `min-w-[${width}px]`;
  return renderTemplate(_a || (_a = __template(["", "<div", "", "", "", "", "", "", "", "", '> <div class="text-xs text-muted">Advertisement</div> </div> <script src="/js/adloader.js"></script> '])), maybeRenderHead(), addAttribute([
    "ad-slot-placeholder",
    "flex justify-center items-center bg-gray-100 border border-dashed border-border",
    minHeight,
    minWidth,
    className
  ], "class:list"), addAttribute({ minHeight: `${height}px`, width: "100%" }, "style"), addAttribute(provider, "data-provider"), addAttribute(slotId, "data-slot-id"), addAttribute(adUnit, "data-ad-unit"), addAttribute(adFormat, "data-ad-format"), addAttribute(isEnabled ? "true" : "false", "data-enabled"), addAttribute(isConfigured ? "true" : "false", "data-configured"), addAttribute(placementKey, "data-placement-key"));
}, "/home/ilia/newsportal_clean/apps/web/src/components/AdSlot.astro", void 0);

const $$Astro = createAstro();
const $$MainColumns = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MainColumns;
  const hasLeft = !!Astro2.slots.left;
  const hasRight = !!Astro2.slots.right;
  return renderTemplate`${maybeRenderHead()}<div class="container mx-auto px-4 py-8"> <div class="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_260px]"> <aside class="hidden"> ${hasLeft && renderTemplate`${renderSlot($$result, $$slots["left"])}`} </aside> <div class="lg:col-start-1"> ${renderSlot($$result, $$slots["default"])} </div> <aside class="lg:col-start-2 space-y-6"> ${hasRight ? renderTemplate`${renderSlot($$result, $$slots["right"])}` : renderTemplate`${renderComponent($$result, "AdSlot", $$AdSlot, { "placementKey": "sidebar_default" })}`} </aside> </div> </div>`;
}, "/home/ilia/newsportal_clean/apps/web/src/layouts/MainColumns.astro", void 0);

const SITE_CONFIG = {
  brandName: "FashionSite"};
const CMS_URL = "http://cms:3000";
let cachedSettings = null;
let cacheTimestamp = 0;
const CACHE_TTL = 6e4;
async function getSiteSettings() {
  const now = Date.now();
  if (cachedSettings && now - cacheTimestamp < CACHE_TTL) {
    return cachedSettings;
  }
  try {
    const res = await fetch(`${CMS_URL}/api/globals/site-settings`);
    if (res.ok) {
      const data = await res.json();
      cachedSettings = data;
      cacheTimestamp = now;
      return cachedSettings;
    }
  } catch {
  }
  return {};
}
async function getBrandName() {
  const settings = await getSiteSettings();
  const raw = settings.siteName || SITE_CONFIG.brandName;
  return String(raw).replace(/<[^>]*>/g, "");
}
function replaceTemplate(template, replacements) {
  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
  }
  return result;
}
async function generateHomeTitle(articleCount, brandName) {
  const settings = await getSiteSettings();
  const brand = brandName ?? await getBrandName();
  const lang = settings.currentLanguage || "en";
  const titleTemplate = lang === "ru" ? settings.seo?.homeTitleRu || "Последние новости сегодня" : settings.seo?.homeTitleEn || "Latest Fashion News & Style Trends";
  return `${titleTemplate} | ${brand}`;
}
async function generateHomeDescription(articleCount, brandName) {
  const settings = await getSiteSettings();
  const brand = brandName ?? await getBrandName();
  const lang = settings.currentLanguage || "en";
  const descTemplate = lang === "ru" ? settings.seo?.homeDescriptionRu || "Актуальные события, аналитика и топ-материалы на {siteName}." : settings.seo?.homeDescriptionEn || "Stay up to date with the latest fashion news, style trends and top stories on {siteName}.";
  return replaceTemplate(descTemplate, { siteName: brand });
}
async function generateCategoryTitle(categoryName, articleCount, brandName) {
  const settings = await getSiteSettings();
  const brand = await getBrandName();
  const lang = settings.currentLanguage || "en";
  const suffix = lang === "ru" ? settings.seo?.categoryTitleSuffixRu || "новости и статьи" : settings.seo?.categoryTitleSuffixEn || "News & Articles";
  return `${categoryName} — ${suffix} | ${brand}`;
}
async function generateCategoryDescription(categoryName, articleCount, brandName) {
  const settings = await getSiteSettings();
  const brand = await getBrandName();
  const lang = settings.currentLanguage || "en";
  const template = lang === "ru" ? settings.seo?.categoryDescriptionTemplateRu || "{count} свежих статей по теме {category}: новости, мнения и аналитика на {siteName}." : settings.seo?.categoryDescriptionTemplateEn || "{count} fresh articles on {category}: news, opinions and analysis on {siteName}.";
  return replaceTemplate(template, { count: articleCount, category: categoryName, siteName: brand });
}
async function generateTagTitle(tagName, articleCount, brandName) {
  const settings = await getSiteSettings();
  const brand = await getBrandName();
  const lang = settings.currentLanguage || "en";
  const suffix = lang === "ru" ? settings.seo?.tagTitleSuffixRu || "статьи, новости и обзоры" : settings.seo?.tagTitleSuffixEn || "Articles, News & Reviews";
  return `${tagName} — ${suffix} | ${brand}`;
}
async function generateTagDescription(tagName, articleCount, brandName) {
  const settings = await getSiteSettings();
  const brand = await getBrandName();
  const lang = settings.currentLanguage || "en";
  const template = lang === "ru" ? settings.seo?.tagDescriptionTemplateRu || '{count} статей с тегом "{tag}": новости, аналитика и многое другое на {siteName}.' : settings.seo?.tagDescriptionTemplateEn || '{count} articles tagged "{tag}": news, analysis and more on {siteName}.';
  return replaceTemplate(template, { count: articleCount, tag: tagName, siteName: brand });
}
async function generateSearchTitle(query, resultCount, brandName) {
  const settings = await getSiteSettings();
  const brand = brandName ?? await getBrandName();
  const lang = settings.currentLanguage || "en";
  const template = lang === "ru" ? settings.seo?.searchTitleTemplateRu || 'Поиск "{query}" — {count} результатов' : settings.seo?.searchTitleTemplateEn || 'Search "{query}" — {count} results';
  const title = replaceTemplate(template, { query, count: resultCount, siteName: brand });
  return `${title} | ${brand}`;
}
async function generateSearchDescription(query, resultCount, brandName) {
  const settings = await getSiteSettings();
  const brand = brandName ?? await getBrandName();
  const lang = settings.currentLanguage || "en";
  const template = lang === "ru" ? settings.seo?.searchDescriptionTemplateRu || 'Найдено {count} статей по запросу "{query}": новости, истории и мнения на {siteName}.' : settings.seo?.searchDescriptionTemplateEn || 'Found {count} articles for "{query}": news, stories and opinions on {siteName}.';
  return replaceTemplate(template, { count: resultCount, query, siteName: brand });
}
async function generateArticleTitle(articleTitle, brandName) {
  const brand = await getBrandName();
  return `${articleTitle} | ${brand}`;
}
async function generateArticleDescription(excerpt, brandName) {
  const settings = await getSiteSettings();
  const brand = await getBrandName();
  const lang = settings.currentLanguage || "en";
  const readMoreText = lang === "ru" ? settings.seo?.articleReadMoreRu || "Подробности — на" : settings.seo?.articleReadMoreEn || "Read more on";
  const firstPeriodIndex = excerpt.indexOf(".");
  if (firstPeriodIndex > 0 && firstPeriodIndex <= 160) {
    return `${excerpt.substring(0, firstPeriodIndex + 1).trim()} ${readMoreText} ${brand}.`;
  }
  const maxLength = 160;
  if (excerpt.length <= maxLength) {
    const result = excerpt.trim();
    return result.endsWith(".") || result.endsWith("!") || result.endsWith("?") ? `${result} ${readMoreText} ${brand}.` : `${result}. ${readMoreText} ${brand}.`;
  }
  let truncated = excerpt.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");
  if (lastSpaceIndex > maxLength - 30) truncated = truncated.substring(0, lastSpaceIndex);
  truncated = truncated.replace(/[,;:\s]+$/, "").trim();
  return `${truncated}... ${readMoreText} ${brand}.`;
}

export { $$MainColumns as $, SITE_CONFIG as S, generateArticleDescription as a, $$AdSlot as b, generateCategoryTitle as c, generateCategoryDescription as d, getBrandName as e, generateSearchTitle as f, generateArticleTitle as g, generateSearchDescription as h, generateTagTitle as i, generateTagDescription as j, generateHomeTitle as k, generateHomeDescription as l };
