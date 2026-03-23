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
  brandName: "FashionSite",
  baseUrl: "https://fashionsite.com"
};
const CMS_URL = "http://cms:3000";
async function getBrandName() {
  try {
    const res = await fetch(`${CMS_URL}/api/globals/site-settings`);
    if (res.ok) {
      const data = await res.json();
      const raw = data.siteName || SITE_CONFIG.brandName;
      return String(raw).replace(/<[^>]*>/g, "");
    }
  } catch {
  }
  return SITE_CONFIG.brandName;
}
async function generateHomeTitle(articleCount, brandName) {
  const brand = brandName ?? await getBrandName();
  return `Последние новости сегодня | ${brand}`;
}
async function generateHomeDescription(articleCount, brandName) {
  const brand = brandName ?? await getBrandName();
  return `Актуальные события, аналитика и топ-материалы: на ${brand}.`;
}
async function generateCategoryTitle(categoryName, articleCount, brandName) {
  const brand = await getBrandName();
  return `${categoryName} — новости и статьи | ${brand}`;
}
async function generateCategoryDescription(categoryName, articleCount, brandName) {
  const brand = await getBrandName();
  return `${articleCount} свежих материалов по теме «${categoryName}»: события, мнения, хроника на ${brand}.`;
}
async function generateTagTitle(tagName, articleCount, brandName) {
  const brand = await getBrandName();
  return `${tagName} — материалы, новости и обзоры | ${brand}`;
}
async function generateTagDescription(tagName, articleCount, brandName) {
  const brand = await getBrandName();
  return `Подборка материалов по тегу «${tagName}»: ${articleCount} новостей, аналитика, фото и видео на ${brand}.`;
}
async function generateSearchTitle(query, resultCount, brandName) {
  const brand = brandName ?? await getBrandName();
  return `Поиск «${query}» — ${resultCount} результатов | ${brand}`;
}
async function generateSearchDescription(query, resultCount, brandName) {
  const brand = brandName ?? await getBrandName();
  return `Найдено ${resultCount} материалов по запросу «${query}»: новости, статьи, мнения на ${brand}.`;
}
async function generateArticleTitle(articleTitle, brandName) {
  const brand = await getBrandName();
  return `${articleTitle} | ${brand}`;
}
async function generateArticleDescription(excerpt, brandName) {
  const brand = await getBrandName();
  if (!excerpt) {
    return `Подробности — на ${brand}.`;
  }
  const firstPeriodIndex = excerpt.indexOf(".");
  if (firstPeriodIndex > 0 && firstPeriodIndex <= 160) {
    const textToFirstPeriod = excerpt.substring(0, firstPeriodIndex + 1).trim();
    return `${textToFirstPeriod} Подробности — на ${brand}.`;
  }
  const maxLength = 160;
  if (excerpt.length <= maxLength) {
    const result = excerpt.trim();
    return result.endsWith(".") || result.endsWith("!") || result.endsWith("?") ? `${result} Подробности — на ${brand}.` : `${result}. Подробности — на ${brand}.`;
  }
  let truncated = excerpt.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");
  if (lastSpaceIndex > maxLength - 30) {
    truncated = truncated.substring(0, lastSpaceIndex);
  }
  truncated = truncated.replace(/[,;:\s]+$/, "").trim();
  return `${truncated}... Подробности — на ${brand}.`;
}

export { $$MainColumns as $, SITE_CONFIG as S, generateArticleDescription as a, $$AdSlot as b, generateCategoryTitle as c, generateCategoryDescription as d, getBrandName as e, generateSearchTitle as f, generateArticleTitle as g, generateSearchDescription as h, generateTagTitle as i, generateTagDescription as j, generateHomeTitle as k, generateHomeDescription as l };
