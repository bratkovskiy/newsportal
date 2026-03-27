/* empty css                                 */
import { c as createComponent, a as renderTemplate, f as defineScriptVars, r as renderComponent, m as maybeRenderHead, F as Fragment, e as addAttribute } from '../chunks/astro/server_CMM1Egp5.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BwCxMai_.mjs';
import { e as getBrandName, k as generateHomeTitle, l as generateHomeDescription, $ as $$MainColumns } from '../chunks/seo_C7GlaQdg.mjs';
import { g as getCmsEnv } from '../chunks/cmsEnv_CFHJDxTC.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { cmsUrl: CMS_URL, placeholderImageUrl: PLACEHOLDER_IMAGE_URL } = getCmsEnv();
  const PAGE_LIMIT = 100;
  async function fetchArticles() {
    try {
      const url = `${CMS_URL}/api/articles?where[status][equals]=published&depth=1&sort=-publishedDate&page=1&limit=${PAGE_LIMIT}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.error("Failed to fetch articles:", res.status);
        return [];
      }
      const data = await res.json();
      return Array.isArray(data?.docs) ? data.docs : [];
    } catch (e) {
      console.error("Error fetching articles:", e);
      return [];
    }
  }
  async function fetchHomeCategories() {
    try {
      const url = `${CMS_URL}/api/categories?where[showOnHome][equals]=true&limit=20&sort=name`;
      const res = await fetch(url);
      if (!res.ok) {
        console.error("Failed to fetch home categories:", res.status);
        return [];
      }
      const data = await res.json();
      const docs = Array.isArray(data?.docs) ? data.docs : [];
      return docs.map((cat) => ({ id: String(cat.id), name: cat.name ?? "", slug: cat.slug ?? "" }));
    } catch (e) {
      console.error("Error fetching home categories:", e);
      return [];
    }
  }
  async function fetchTags() {
    try {
      const url = `${CMS_URL}/api/tags?limit=50&sort=name`;
      const res = await fetch(url);
      if (!res.ok) {
        console.error("Failed to fetch tags:", res.status);
        return [];
      }
      const data = await res.json();
      const docs = Array.isArray(data?.docs) ? data.docs : [];
      return docs.map((tag) => ({ id: String(tag.id), name: tag.name ?? "", slug: tag.slug ?? "" }));
    } catch (e) {
      console.error("Error fetching tags:", e);
      return [];
    }
  }
  function buildArticlePath(article) {
    const slug = article.slug ?? "";
    const id = article.id ? String(article.id) : "";
    if (slug && id) return `/article/${slug}-${id}.html`;
    if (slug) return `/article/${slug}`;
    if (id) return `/article/${id}`;
    return "/";
  }
  function getCoverImage(article) {
    if (article.feedImageUrl) return { url: article.feedImageUrl, alt: article.title ?? "" };
    const coverImage = article.coverImage && typeof article.coverImage === "object" ? article.coverImage : null;
    const url = coverImage?.url ?? PLACEHOLDER_IMAGE_URL;
    const alt = coverImage?.alt ?? (article.title ?? "");
    return { url, alt };
  }
  function getCategoryName(article) {
    if (!Array.isArray(article.categories) || article.categories.length === 0) return "";
    const first = article.categories[0];
    if (first && typeof first === "object") return first.name ?? "";
    return "";
  }
  function getAuthorName(article) {
    if (article.author && typeof article.author === "object") return article.author.name ?? "Unknown";
    return "Unknown";
  }
  function getPrimaryTagName(article) {
    if (!Array.isArray(article.tags) || article.tags.length === 0) return "";
    const first = article.tags[0];
    if (first && typeof first === "object") return first.name ?? "";
    return "";
  }
  function getPublishedTimestamp(article) {
    if (!article.publishedDate) return 0;
    const time = Date.parse(article.publishedDate);
    return Number.isNaN(time) ? 0 : time;
  }
  function sortByDateThenViews(list) {
    return [...list].sort((a, b) => {
      const dateDiff = getPublishedTimestamp(b) - getPublishedTimestamp(a);
      if (dateDiff !== 0) return dateDiff;
      const av = typeof a.viewCount === "number" ? a.viewCount : 0;
      const bv = typeof b.viewCount === "number" ? b.viewCount : 0;
      return bv - av;
    });
  }
  function sortByViewsThenDate(list) {
    return [...list].sort((a, b) => {
      const av = typeof a.viewCount === "number" ? a.viewCount : 0;
      const bv = typeof b.viewCount === "number" ? b.viewCount : 0;
      if (av !== bv) return bv - av;
      return getPublishedTimestamp(b) - getPublishedTimestamp(a);
    });
  }
  function articleHasCategory(article, categoryId) {
    const list = Array.isArray(article.categories) ? article.categories : [];
    return list.some((cat) => {
      if (!cat) return false;
      if (typeof cat === "object") {
        const id = cat.id ?? cat;
        return String(id) === categoryId;
      }
      return String(cat) === categoryId;
    });
  }
  function selectHomeLayout(all, homeCategories2) {
    const usedIds = /* @__PURE__ */ new Set();
    function pick(sorted, limit) {
      const result = [];
      for (const a of sorted) {
        if (result.length >= limit) break;
        if (!usedIds.has(a.id)) {
          result.push(a);
          usedIds.add(a.id);
        }
      }
      if (result.length < limit) {
        for (const a of sorted) {
          if (result.length >= limit) break;
          if (!result.some((r) => r.id === a.id)) {
            result.push(a);
            usedIds.add(a.id);
          }
        }
      }
      return result;
    }
    const byDate = sortByDateThenViews(all);
    const byViews = sortByViewsThenDate(all);
    const mainFlagged = sortByDateThenViews(all.filter((a) => a.homeMainBlock));
    const mainArticle2 = mainFlagged[0] ?? byDate[0];
    if (mainArticle2) usedIds.add(mainArticle2.id);
    const topArticles2 = pick(sortByDateThenViews(all.filter((a) => a.homeTop)).concat(byDate), 4);
    const mustReadArticles2 = pick(sortByDateThenViews(all.filter((a) => a.homeMustRead)).concat(byDate), 2);
    const popularArticles2 = pick(byViews, 4);
    const categoryBlocks2 = [];
    for (const category of homeCategories2) {
      if (categoryBlocks2.length >= 2) break;
      const catArticles = sortByViewsThenDate(all.filter((a) => articleHasCategory(a, category.id)));
      const blockArticles = pick(catArticles, 4);
      if (blockArticles.length > 0) categoryBlocks2.push({ category, articles: blockArticles });
    }
    return { mainArticle: mainArticle2, topArticles: topArticles2, mustReadArticles: mustReadArticles2, popularArticles: popularArticles2, categoryBlocks: categoryBlocks2 };
  }
  const articles = await fetchArticles();
  const tags = await fetchTags();
  const displayTags = tags.slice(0, 20);
  const homeCategories = await fetchHomeCategories();
  const defaultCategoryLabel = currentLanguage === "en" ? "Articles" : "\u0421\u0442\u0430\u0442\u044C\u0438";
  const latestArticles = articles.map((article) => {
    const { url, alt } = getCoverImage(article);
    const tagName = getPrimaryTagName(article);
    const categoryName = getCategoryName(article);
    const viewCount = typeof article.viewCount === "number" ? article.viewCount : 0;
    return {
      id: String(article.id),
      href: buildArticlePath(article),
      title: article.title ?? "",
      excerpt: article.excerpt ?? "",
      imageUrl: url,
      imageAlt: alt,
      fallbackImageUrl: PLACEHOLDER_IMAGE_URL,
      category: tagName || categoryName || defaultCategoryLabel,
      authorName: getAuthorName(article),
      publishedDate: article.publishedDate,
      viewCount,
      homeMainBlock: article.homeMainBlock ?? false,
      homeTop: article.homeTop ?? false,
      homeMustRead: article.homeMustRead ?? false,
      categories: article.categories
    };
  });
  const { mainArticle, topArticles, mustReadArticles, popularArticles, categoryBlocks } = selectHomeLayout(latestArticles, homeCategories);
  const featuredIds = /* @__PURE__ */ new Set([
    ...mainArticle ? [mainArticle.id] : [],
    ...topArticles.map((a) => a.id),
    ...mustReadArticles.map((a) => a.id),
    ...popularArticles.map((a) => a.id),
    ...categoryBlocks.flatMap((b) => b.articles.map((a) => a.id))
  ]);
  const feedArticles = latestArticles.filter((a) => !featuredIds.has(a.id));
  let siteSettings = null;
  try {
    const res = await fetch(`${CMS_URL}/api/globals/site-settings`);
    if (res.ok) siteSettings = await res.json();
  } catch (e) {
  }
  const currentLanguage = siteSettings?.currentLanguage === "en" ? "en" : "ru";
  const L = (en, ru, defEn, defRu) => currentLanguage === "en" ? en || defEn : ru || defRu;
  const labelHomeMain = L(siteSettings?.labels?.homeMainEn, siteSettings?.labels?.homeMainRu, "Top stories", "\u0413\u043B\u0430\u0432\u043D\u043E\u0435");
  const labelHomeLatest = L(siteSettings?.labels?.homeLatestEn, siteSettings?.labels?.homeLatestRu, "Latest news", "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0438");
  const labelHomeMustRead = L(siteSettings?.labels?.homeMustReadEn, siteSettings?.labels?.homeMustReadRu, "Must-Read Stories", "Must-Read Stories");
  const labelHomePopular = L(siteSettings?.labels?.homePopularEn, siteSettings?.labels?.homePopularRu, "Popular", "\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u043E\u0435");
  const labelHomeTags = L(siteSettings?.labels?.homeTagsEn, siteSettings?.labels?.homeTagsRu, "Tags", "\u0422\u0435\u0433\u0438");
  const articleCount = articles.length;
  const brandName = await getBrandName();
  const metaTitle = await generateHomeTitle(articleCount, brandName);
  const metaDescription = await generateHomeDescription(articleCount, brandName);
  return renderTemplate(_a || (_a = __template(["", "  <script>(function(){", "\n  (function () {\n    var grid = document.getElementById('article-feed-grid');\n    var moreBtn = document.getElementById('article-feed-more');\n    if (!grid || !moreBtn) return;\n\n    var wrappers = Array.prototype.slice.call(grid.querySelectorAll('[data-index]'));\n\n    if (wrappers.length < PAGE_LIMIT) {\n      moreBtn.style.display = 'none';\n      return;\n    }\n\n    var currentPage = 1;\n    var isLoading = false;\n    var hasMore = true;\n\n    function buildArticlePath(doc) {\n      var slug = doc.slug || '';\n      var id = doc.id != null ? String(doc.id) : '';\n      if (slug && id) return '/article/' + slug + '-' + id + '.html';\n      if (slug) return '/article/' + slug;\n      if (id) return '/article/' + id;\n      return '/';\n    }\n\n    function getCoverImage(doc) {\n      if (doc.feedImageUrl) return { url: doc.feedImageUrl, alt: doc.title || '' };\n      var cover = doc.coverImage && typeof doc.coverImage === 'object' ? doc.coverImage : null;\n      return { url: (cover && cover.url) || PLACEHOLDER_IMAGE_URL, alt: (cover && cover.alt) || (doc.title || '') };\n    }\n\n    function getCategoryName(doc) {\n      var cats = Array.isArray(doc.categories) ? doc.categories : [];\n      if (!cats.length) return '';\n      var first = cats[0];\n      return (first && typeof first === 'object') ? (first.name || '') : '';\n    }\n\n    function getAuthorName(doc) {\n      var a = doc.author;\n      return (a && typeof a === 'object') ? (a.name || 'Unknown') : 'Unknown';\n    }\n\n    function createCard(doc, index) {\n      var cover = getCoverImage(doc);\n      var category = getCategoryName(doc);\n      var authorName = getAuthorName(doc);\n      var href = buildArticlePath(doc);\n\n      var wrap = document.createElement('div');\n      wrap.className = 'home-news-item';\n      wrap.setAttribute('data-index', String(index));\n\n      var link = document.createElement('a');\n      link.href = href;\n      link.className = 'home-news-item__link group';\n\n      var imgWrap = document.createElement('div');\n      imgWrap.className = 'home-news-item__img-wrap';\n\n      var img = document.createElement('img');\n      img.src = cover.url;\n      img.alt = cover.alt || '';\n      img.width = 160;\n      img.height = 107;\n      img.loading = 'lazy';\n      img.className = 'home-news-item__img';\n      img.onerror = function () { this.onerror = null; this.src = PLACEHOLDER_IMAGE_URL; };\n      imgWrap.appendChild(img);\n\n      var body = document.createElement('div');\n      body.className = 'home-news-item__body';\n\n      if (category) {\n        var cat = document.createElement('span');\n        cat.className = 'home-cat-tag';\n        cat.textContent = category;\n        body.appendChild(cat);\n      }\n\n      var title = document.createElement('h3');\n      title.className = 'home-news-item__title';\n      title.textContent = doc.title || '';\n      body.appendChild(title);\n\n      var meta = document.createElement('p');\n      meta.className = 'home-news-item__meta';\n      meta.textContent = authorName;\n      body.appendChild(meta);\n\n      link.appendChild(imgWrap);\n      link.appendChild(body);\n      wrap.appendChild(link);\n      return wrap;\n    }\n\n    async function loadMore() {\n      if (isLoading || !hasMore) return;\n      isLoading = true;\n      moreBtn.disabled = true;\n      try {\n        var nextPage = currentPage + 1;\n        var res = await fetch('/api/frontend/articles?page=' + nextPage + '&limit=' + PAGE_LIMIT);\n        if (!res.ok) throw new Error('HTTP ' + res.status);\n        var data = await res.json();\n        var docs = Array.isArray(data.docs) ? data.docs : [];\n\n        if (!docs.length) { hasMore = false; moreBtn.style.display = 'none'; return; }\n\n        for (var i = 0; i < docs.length; i++) {\n          var card = createCard(docs[i], wrappers.length);\n          wrappers.push(card);\n          grid.appendChild(card);\n        }\n\n        currentPage = typeof data.page === 'number' ? data.page : nextPage;\n\n        if (\n          (typeof data.hasNextPage === 'boolean' && !data.hasNextPage) ||\n          (typeof data.totalPages === 'number' && typeof data.page === 'number' && data.page >= data.totalPages) ||\n          data.nextPage == null\n        ) {\n          hasMore = false;\n          moreBtn.style.display = 'none';\n        }\n      } catch (e) {\n        console.error('Failed to load more articles', e);\n        hasMore = false;\n        moreBtn.style.display = 'none';\n      } finally {\n        isLoading = false;\n        moreBtn.disabled = false;\n      }\n    }\n\n    moreBtn.addEventListener('click', loadMore);\n  })();\n})();<\/script>"])), renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": metaTitle, "description": metaDescription, "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "MainColumns", $$MainColumns, { "data-astro-cid-j7pv25f6": true }, { "default": async ($$result3) => renderTemplate`${articles.length === 0 ? renderTemplate`${maybeRenderHead()}<p class="text-muted text-sm py-12 text-center" data-astro-cid-j7pv25f6>No articles yet.</p>` : renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "data-astro-cid-j7pv25f6": true }, { "default": async ($$result4) => renderTemplate`${mainArticle && renderTemplate`<section class="home-hero" data-astro-cid-j7pv25f6>  <a${addAttribute(mainArticle.href, "href")} class="home-hero__main group" data-astro-cid-j7pv25f6> <div class="home-hero__img-wrap" data-astro-cid-j7pv25f6> <img${addAttribute(mainArticle.imageUrl, "src")}${addAttribute(mainArticle.imageAlt, "alt")}${addAttribute(800, "width")}${addAttribute(450, "height")} loading="eager" class="home-hero__img"${addAttribute(`this.onerror=null;this.src='${PLACEHOLDER_IMAGE_URL}'`, "onerror")} data-astro-cid-j7pv25f6> </div> <div class="home-hero__body" data-astro-cid-j7pv25f6> ${mainArticle.category && renderTemplate`<span class="home-cat-tag" data-astro-cid-j7pv25f6>${mainArticle.category}</span>`} <h1 class="home-hero__title" data-astro-cid-j7pv25f6>${mainArticle.title}</h1> ${mainArticle.excerpt && renderTemplate`<p class="home-hero__excerpt" data-astro-cid-j7pv25f6>${mainArticle.excerpt}</p>`} <p class="home-hero__meta" data-astro-cid-j7pv25f6>${mainArticle.authorName}</p> </div> </a>  <div class="home-hero__stack" data-astro-cid-j7pv25f6> <p class="home-section-label" data-astro-cid-j7pv25f6>${labelHomeMain}</p> ${topArticles.map((article) => renderTemplate`<a${addAttribute(article.href, "href")} class="home-hero__side-item group" data-astro-cid-j7pv25f6> <div class="home-hero__side-img-wrap" data-astro-cid-j7pv25f6> <img${addAttribute(article.imageUrl, "src")}${addAttribute(article.imageAlt, "alt")}${addAttribute(120, "width")}${addAttribute(80, "height")} loading="lazy" class="home-hero__side-img"${addAttribute(`this.onerror=null;this.src='${PLACEHOLDER_IMAGE_URL}'`, "onerror")} data-astro-cid-j7pv25f6> </div> <div class="home-hero__side-body" data-astro-cid-j7pv25f6> ${article.category && renderTemplate`<span class="home-cat-tag" data-astro-cid-j7pv25f6>${article.category}</span>`} <h3 class="home-hero__side-title" data-astro-cid-j7pv25f6>${article.title}</h3> <p class="home-hero__side-meta" data-astro-cid-j7pv25f6>${article.authorName}</p> </div> </a>`)} </div> </section>`}<div class="home-two-col" data-astro-cid-j7pv25f6>  <section class="home-feed" id="article-feed" data-astro-cid-j7pv25f6> <p class="home-section-label" data-astro-cid-j7pv25f6>${labelHomeLatest}</p> <div id="article-feed-grid" class="home-feed__grid" data-astro-cid-j7pv25f6> ${feedArticles.map((article, index) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "data-astro-cid-j7pv25f6": true }, { "default": async ($$result5) => renderTemplate`${index === 7 && mustReadArticles.length > 0 && renderTemplate`<div class="home-mustread" data-astro-cid-j7pv25f6> <p class="home-section-label" data-astro-cid-j7pv25f6>${labelHomeMustRead}</p> <div class="home-mustread__grid" data-astro-cid-j7pv25f6> ${mustReadArticles.map((mr) => renderTemplate`<a${addAttribute(mr.href, "href")} class="home-mustread__item group" data-astro-cid-j7pv25f6> <div class="home-mustread__img-wrap" data-astro-cid-j7pv25f6> <img${addAttribute(mr.imageUrl, "src")}${addAttribute(mr.imageAlt, "alt")}${addAttribute(480, "width")}${addAttribute(270, "height")} loading="lazy" class="home-mustread__img"${addAttribute(`this.onerror=null;this.src='${PLACEHOLDER_IMAGE_URL}'`, "onerror")} data-astro-cid-j7pv25f6> </div> ${mr.category && renderTemplate`<span class="home-cat-tag" data-astro-cid-j7pv25f6>${mr.category}</span>`} <h3 class="home-mustread__title" data-astro-cid-j7pv25f6>${mr.title}</h3> <p class="home-mustread__meta" data-astro-cid-j7pv25f6>${mr.authorName}</p> </a>`)} </div> </div>`}<div${addAttribute(["home-news-item", index >= 14 ? "hidden" : ""], "class:list")}${addAttribute(index, "data-index")} data-astro-cid-j7pv25f6> <a${addAttribute(article.href, "href")} class="home-news-item__link group" data-astro-cid-j7pv25f6> <div class="home-news-item__img-wrap" data-astro-cid-j7pv25f6> <img${addAttribute(article.imageUrl, "src")}${addAttribute(article.imageAlt, "alt")}${addAttribute(160, "width")}${addAttribute(107, "height")} loading="lazy" class="home-news-item__img"${addAttribute(`this.onerror=null;this.src='${article.fallbackImageUrl}'`, "onerror")} data-astro-cid-j7pv25f6> </div> <div class="home-news-item__body" data-astro-cid-j7pv25f6> ${article.category && renderTemplate`<span class="home-cat-tag" data-astro-cid-j7pv25f6>${article.category}</span>`} <h3 class="home-news-item__title" data-astro-cid-j7pv25f6>${article.title}</h3> <p class="home-news-item__meta" data-astro-cid-j7pv25f6>${article.authorName}</p> </div> </a> </div> ` })}`)} </div> <div class="home-feed__more-wrap" data-astro-cid-j7pv25f6> <button id="article-feed-more" type="button" class="home-feed__more-btn" data-astro-cid-j7pv25f6> ${currentLanguage === "en" ? "Load more" : "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0435\u0449\u0451"} </button> </div> </section>  <aside class="home-sidebar" data-astro-cid-j7pv25f6>  <div class="home-sidebar__section" data-astro-cid-j7pv25f6> <p class="home-section-label" data-astro-cid-j7pv25f6>${labelHomePopular}</p> <ol class="home-popular" data-astro-cid-j7pv25f6> ${popularArticles.map((article, i) => renderTemplate`<li class="home-popular__item" data-astro-cid-j7pv25f6> <a${addAttribute(article.href, "href")} class="home-popular__link group" data-astro-cid-j7pv25f6> <span class="home-popular__num" data-astro-cid-j7pv25f6>${String(i + 1).padStart(2, "0")}</span> <div data-astro-cid-j7pv25f6> ${article.category && renderTemplate`<span class="home-cat-tag" data-astro-cid-j7pv25f6>${article.category}</span>`} <h3 class="home-popular__title" data-astro-cid-j7pv25f6>${article.title}</h3> </div> </a> </li>`)} </ol> </div>  ${categoryBlocks.map((block) => renderTemplate`<div class="home-sidebar__section" data-astro-cid-j7pv25f6> <p class="home-section-label" data-astro-cid-j7pv25f6> <a${addAttribute(`/categories/${block.category.slug}`, "href")} class="hover:text-accent transition-colors" data-astro-cid-j7pv25f6> ${block.category.name} </a> </p> <ul class="home-catblock" data-astro-cid-j7pv25f6> ${block.articles.map((article) => renderTemplate`<li class="home-catblock__item" data-astro-cid-j7pv25f6> <a${addAttribute(article.href, "href")} class="home-catblock__link group" data-astro-cid-j7pv25f6> ${article.category && renderTemplate`<span class="home-cat-tag" data-astro-cid-j7pv25f6>${article.category}</span>`} <h3 class="home-catblock__title" data-astro-cid-j7pv25f6>${article.title}</h3> </a> </li>`)} </ul> </div>`)}  <div class="home-sidebar__section" data-astro-cid-j7pv25f6> <p class="home-section-label" data-astro-cid-j7pv25f6>${labelHomeTags}</p> <div class="home-tags" data-astro-cid-j7pv25f6> ${displayTags.map((tag) => renderTemplate`<a${addAttribute(`/tags/${tag.slug}`, "href")} class="home-tags__pill" data-astro-cid-j7pv25f6>${tag.name}</a>`)} <a href="/tags" class="home-tags__pill home-tags__pill--all" data-astro-cid-j7pv25f6> ${currentLanguage === "en" ? "All tags \u2192" : "\u0412\u0441\u0435 \u0442\u0435\u0433\u0438 \u2192"} </a> </div> </div>  <div class="home-ad-slot" data-astro-cid-j7pv25f6> <p class="home-ad-slot__label" data-astro-cid-j7pv25f6>Advertisement</p> <div class="home-ad-slot__area" id="home-sidebar-ad" data-astro-cid-j7pv25f6></div> </div> </aside> </div> ` })}`}` })} ` }), defineScriptVars({ PAGE_LIMIT, PLACEHOLDER_IMAGE_URL }));
}, "/home/ilia/newsportal_clean/apps/web/src/pages/index.astro", void 0);

const $$file = "/home/ilia/newsportal_clean/apps/web/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
