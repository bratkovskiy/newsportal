/* empty css                                 */
import { c as createComponent, b as createAstro, m as maybeRenderHead, e as addAttribute, a as renderTemplate, r as renderComponent, F as Fragment, f as defineScriptVars } from '../chunks/astro/server_CMM1Egp5.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_Daea0-QY.mjs';
import 'clsx';
import { e as getBrandName, k as generateHomeTitle, l as generateHomeDescription, $ as $$MainColumns } from '../chunks/seo_Dd-zSdmL.mjs';
import { g as getCmsEnv } from '../chunks/cmsEnv_CFHJDxTC.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$CardA = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CardA;
  const { href, title, excerpt, imageUrl, imageAlt, category } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")} class="block group rounded-card overflow-hidden shadow-card hover:shadow-lg transition-shadow duration-300 bg-background"> <div class="relative"> <img${addAttribute(imageUrl, "src")}${addAttribute(imageAlt, "alt")}${addAttribute(1200, "width")}${addAttribute(675, "height")} loading="lazy" class="w-full h-auto object-cover aspect-video transition-transform duration-300 group-hover:scale-105"> <div class="absolute top-4 left-4 text-xs font-bold uppercase px-3 py-1 rounded-button bg-accent text-white"> ${category} </div> </div> <div class="p-4 sm:p-6"> <h3 class="text-lg sm:text-xl font-bold text-foreground mb-2">${title}</h3> <p class="text-sm sm:text-base text-muted">${excerpt}</p> </div> </a>`;
}, "/home/ilia/newsportal_clean/apps/web/src/components/CardA.astro", void 0);

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
      return docs.map((cat) => ({
        id: String(cat.id),
        name: cat.name ?? "",
        slug: cat.slug ?? ""
      }));
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
      return docs.map((tag) => ({
        id: String(tag.id),
        name: tag.name ?? "",
        slug: tag.slug ?? ""
      }));
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
    if (article.feedImageUrl) {
      return { url: article.feedImageUrl, alt: article.title ?? "" };
    }
    const coverImage = article.coverImage && typeof article.coverImage === "object" ? article.coverImage : null;
    const url = coverImage?.url ?? PLACEHOLDER_IMAGE_URL;
    const alt = coverImage?.alt ?? (article.title ?? "");
    return { url, alt };
  }
  function getCategoryName(article) {
    if (!Array.isArray(article.categories) || article.categories.length === 0) return "";
    const first = article.categories[0];
    if (first && typeof first === "object") {
      return first.name ?? "";
    }
    return "";
  }
  function getAuthorName(article) {
    if (article.author && typeof article.author === "object") {
      return article.author.name ?? "Unknown";
    }
    return "Unknown";
  }
  function getPrimaryTagName(article) {
    if (!Array.isArray(article.tags) || article.tags.length === 0) return "";
    const first = article.tags[0];
    if (first && typeof first === "object") {
      return first.name ?? "";
    }
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
    function selectMain() {
      if (all.length === 0) return void 0;
      const flagged = sortByDateThenViews(all.filter((a) => a.homeMainBlock));
      const chosen = flagged.length > 0 ? flagged[0] : sortByDateThenViews(all)[0];
      if (chosen) {
        usedIds.add(chosen.id);
      }
      return chosen;
    }
    function selectTopMany(limit) {
      const result = [];
      if (all.length === 0 || limit <= 0) return result;
      const allFlagged = sortByDateThenViews(all.filter((a) => a.homeTop));
      const availableFlagged = allFlagged.filter((a) => !usedIds.has(a.id));
      for (const article of availableFlagged) {
        if (result.length >= limit) break;
        result.push(article);
        usedIds.add(article.id);
      }
      if (result.length < limit && allFlagged.length > 0) {
        for (const article of allFlagged) {
          if (result.some((r) => r.id === article.id)) continue;
          result.push(article);
          usedIds.add(article.id);
          if (result.length >= limit) break;
        }
      }
      if (result.length < limit) {
        const sorted = sortByDateThenViews(all);
        const candidates = sorted.filter(
          (a) => !usedIds.has(a.id) && !result.some((r) => r.id === a.id)
        );
        for (const article of candidates) {
          if (result.length >= limit) break;
          result.push(article);
          usedIds.add(article.id);
        }
        if (result.length < limit && sorted.length > 0) {
          for (const article of sorted) {
            if (result.some((r) => r.id === article.id)) continue;
            result.push(article);
            usedIds.add(article.id);
            if (result.length >= limit) break;
          }
        }
      }
      return result;
    }
    function selectMustReadMany(limit) {
      const result = [];
      if (all.length === 0 || limit <= 0) return result;
      const allFlagged = sortByDateThenViews(all.filter((a) => a.homeMustRead));
      const availableFlagged = allFlagged.filter((a) => !usedIds.has(a.id));
      for (const article of availableFlagged) {
        if (result.length >= limit) break;
        result.push(article);
        usedIds.add(article.id);
      }
      if (result.length < limit && allFlagged.length > 0) {
        for (const article of allFlagged) {
          if (result.some((r) => r.id === article.id)) continue;
          result.push(article);
          usedIds.add(article.id);
          if (result.length >= limit) break;
        }
      }
      if (result.length < limit) {
        const sorted = sortByDateThenViews(all);
        const candidates = sorted.filter(
          (a) => !usedIds.has(a.id) && !result.some((r) => r.id === a.id)
        );
        for (const article of candidates) {
          if (result.length >= limit) break;
          result.push(article);
          usedIds.add(article.id);
        }
        if (result.length < limit && sorted.length > 0) {
          for (const article of sorted) {
            if (result.some((r) => r.id === article.id)) continue;
            result.push(article);
            usedIds.add(article.id);
            if (result.length >= limit) break;
          }
        }
      }
      return result;
    }
    function selectPopular(limit) {
      const popular = [];
      if (all.length === 0 || limit <= 0) return popular;
      const sortedAll = sortByViewsThenDate(all);
      for (const article of sortedAll) {
        if (usedIds.has(article.id)) continue;
        popular.push(article);
        usedIds.add(article.id);
        if (popular.length >= limit) break;
      }
      if (popular.length < limit) {
        for (const article of sortedAll) {
          if (popular.some((p) => p.id === article.id)) continue;
          popular.push(article);
          usedIds.add(article.id);
          if (popular.length >= limit) break;
        }
      }
      return popular;
    }
    function selectCategoryBlocks(limit) {
      const blocks = [];
      if (!homeCategories2.length || !all.length || limit <= 0) return blocks;
      for (const category of homeCategories2) {
        if (blocks.length >= 2) break;
        const catArticles = all.filter((a) => articleHasCategory(a, category.id));
        if (!catArticles.length) continue;
        const sortedCat = sortByViewsThenDate(catArticles);
        const blockArticles = [];
        for (const article of sortedCat) {
          if (usedIds.has(article.id)) continue;
          blockArticles.push(article);
          usedIds.add(article.id);
          if (blockArticles.length >= limit) break;
        }
        if (blockArticles.length < limit) {
          for (const article of sortedCat) {
            if (blockArticles.some((b) => b.id === article.id)) continue;
            blockArticles.push(article);
            usedIds.add(article.id);
            if (blockArticles.length >= limit) break;
          }
        }
        if (blockArticles.length > 0) {
          blocks.push({ category, articles: blockArticles });
        }
      }
      return blocks;
    }
    const mainArticle2 = selectMain();
    const topArticles2 = selectTopMany(4);
    const mustReadArticles2 = selectMustReadMany(2);
    const popularArticles2 = selectPopular(4);
    const categoryBlocks2 = selectCategoryBlocks(4);
    return { mainArticle: mainArticle2, topArticles: topArticles2, mustReadArticles: mustReadArticles2, popularArticles: popularArticles2, categoryBlocks: categoryBlocks2 };
  }
  const articles = await fetchArticles();
  const tags = await fetchTags();
  const displayTags = tags.slice(0, 20);
  const homeCategories = await fetchHomeCategories();
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
      category: tagName || categoryName || "\u0421\u0442\u0430\u0442\u044C\u0438",
      authorName: getAuthorName(article),
      publishedDate: article.publishedDate,
      viewCount,
      homeMainBlock: article.homeMainBlock ?? false,
      homeTop: article.homeTop ?? false,
      homeMustRead: article.homeMustRead ?? false,
      categories: article.categories
    };
  });
  const { mainArticle, topArticles, mustReadArticles, popularArticles, categoryBlocks } = selectHomeLayout(
    latestArticles,
    homeCategories
  );
  const featuredIds = /* @__PURE__ */ new Set();
  if (mainArticle) {
    featuredIds.add(mainArticle.id);
  }
  for (const a of topArticles) {
    featuredIds.add(a.id);
  }
  for (const a of mustReadArticles) {
    featuredIds.add(a.id);
  }
  for (const a of popularArticles) {
    featuredIds.add(a.id);
  }
  for (const block of categoryBlocks) {
    for (const a of block.articles) {
      featuredIds.add(a.id);
    }
  }
  const feedArticles = latestArticles.filter((article) => !featuredIds.has(article.id));
  let siteSettings = null;
  try {
    const res = await fetch(`${CMS_URL}/api/globals/site-settings`);
    if (res.ok) {
      const data = await res.json();
      siteSettings = data;
    }
  } catch (e) {
  }
  const currentLanguage = siteSettings?.currentLanguage === "en" ? "en" : "ru";
  const labelHomeMain = currentLanguage === "en" ? siteSettings?.labels?.homeMainEn || "Top stories" : siteSettings?.labels?.homeMainRu || "\u0413\u043B\u0430\u0432\u043D\u043E\u0435";
  const labelHomeLatest = currentLanguage === "en" ? siteSettings?.labels?.homeLatestEn || "Latest news" : siteSettings?.labels?.homeLatestRu || "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0438";
  const labelHomeMustRead = currentLanguage === "en" ? siteSettings?.labels?.homeMustReadEn || "Must-Read Stories" : siteSettings?.labels?.homeMustReadRu || "Must-Read Stories";
  const labelHomePopular = currentLanguage === "en" ? siteSettings?.labels?.homePopularEn || "Popular" : siteSettings?.labels?.homePopularRu || "\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u043E\u0435";
  const labelHomeTags = currentLanguage === "en" ? siteSettings?.labels?.homeTagsEn || "Tags" : siteSettings?.labels?.homeTagsRu || "\u0422\u0435\u0433\u0438";
  const articleCount = articles.length;
  const brandName = await getBrandName();
  const metaTitle = await generateHomeTitle(articleCount, brandName);
  const metaDescription = await generateHomeDescription(articleCount, brandName);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": metaTitle, "description": metaDescription }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "MainColumns", $$MainColumns, {}, { "default": async ($$result3) => renderTemplate`${articles.length === 0 ? renderTemplate`${maybeRenderHead()}<p>Нет статей из CMS (articles.length = ${articles.length}).</p>` : renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate(_a || (_a = __template(["", '<section id="article-feed" class="mb-12"> <h2 class="text-xs font-semibold tracking-[0.18em] uppercase text-muted mb-4">', '</h2> <div id="article-feed-grid" class="grid grid-cols-1 lg:grid-cols-2 gap-6"> ', ' </div> <div class="mt-10 flex justify-center"> <button id="article-feed-more" type="button" class="px-6 py-2 border border-border rounded-button text-sm text-foreground hover:bg-accent hover:text-white transition-colors duration-150">\n\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0435\u0449\u0451\n</button> </div> </section> <section class="mb-8"> <h2 class="text-xs font-semibold tracking-[0.18em] uppercase text-muted mb-4">', '</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> ', " </div> </section> ", '<section class="mb-12"> <h2 class="text-xs font-semibold tracking-[0.18em] uppercase text-muted mb-4">', '</h2> <div class="flex flex-wrap gap-2"> ', ' <a href="/tags" class="inline-flex px-3 py-1 bg-background border border-border rounded-full text-xs font-medium text-foreground hover:bg-accent hover:text-background hover:border-accent transition-colors duration-150">\n\u0412\u0441\u0435 \u0442\u0435\u0433\u0438\n</a> </div> </section> <script>(function(){', "\n          (function() {\n            var grid = document.getElementById('article-feed-grid');\n            var moreBtn = document.getElementById('article-feed-more');\n            if (!grid || !moreBtn) return;\n\n              var wrappers = Array.prototype.slice.call(\n                grid.querySelectorAll('[data-index]')\n              );\n\n              if (wrappers.length < PAGE_LIMIT) {\n                moreBtn.style.display = 'none';\n                return;\n              }\n\n              var currentPage = 1;\n              var isLoading = false;\n              var hasMore = true;\n\n              function buildArticlePath(doc) {\n                var slug = doc.slug || '';\n                var id = doc.id != null ? String(doc.id) : '';\n                if (slug && id) return '/article/' + slug + '-' + id + '.html';\n                if (slug) return '/article/' + slug;\n                if (id) return '/article/' + id;\n                return '/';\n              }\n\n              function getCoverImage(doc) {\n                if (doc.feedImageUrl) {\n                  return { url: doc.feedImageUrl, alt: doc.title || '' };\n                }\n                var cover = doc.coverImage && typeof doc.coverImage === 'object'\n                  ? doc.coverImage\n                  : null;\n                var url = (cover && cover.url) || PLACEHOLDER_IMAGE_URL;\n                var alt = (cover && cover.alt) || (doc.title || '');\n                return { url: url, alt: alt };\n              }\n\n              function getCategoryName(doc) {\n                var categories = Array.isArray(doc.categories) ? doc.categories : [];\n                if (!categories.length) return '';\n                var first = categories[0];\n                if (first && typeof first === 'object') {\n                  return first.name || '';\n                }\n                return '';\n              }\n\n              function getAuthorName(doc) {\n                var author = doc.author;\n                if (author && typeof author === 'object') {\n                  return author.name || 'Unknown';\n                }\n                return 'Unknown';\n              }\n\n              function createCardWrapperFromDoc(doc, index) {\n                var cover = getCoverImage(doc);\n                var category = getCategoryName(doc);\n                var authorName = getAuthorName(doc);\n                var href = buildArticlePath(doc);\n                var title = doc.title || '';\n                var excerpt = doc.excerpt || '';\n\n                var wrapper = document.createElement('div');\n                wrapper.setAttribute('data-index', String(index));\n\n                var link = document.createElement('a');\n                link.href = href;\n                link.className = 'flex gap-4 group';\n\n                var imageWrapper = document.createElement('div');\n                imageWrapper.className = 'flex-shrink-0 w-32 md:w-40 overflow-hidden rounded-image';\n\n                var img = document.createElement('img');\n                img.src = cover.url;\n                img.alt = cover.alt || '';\n                img.width = 200;\n                img.height = 130;\n                img.loading = 'lazy';\n                img.className = 'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105';\n                img.onerror = function () {\n                  this.onerror = null;\n                  this.src = PLACEHOLDER_IMAGE_URL;\n                };\n\n                imageWrapper.appendChild(img);\n\n                var content = document.createElement('div');\n                content.className = 'flex-1 border-b border-border pb-4';\n\n                if (category) {\n                  var catP = document.createElement('p');\n                  catP.className = 'text-[11px] font-semibold tracking-[0.18em] uppercase text-accent';\n                  catP.textContent = category;\n                  content.appendChild(catP);\n                }\n\n                var titleEl = document.createElement('h3');\n                titleEl.className = 'text-sm md:text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:underline';\n                titleEl.textContent = title;\n                content.appendChild(titleEl);\n\n                if (excerpt) {\n                  var excerptP = document.createElement('p');\n                  excerptP.className = 'text-sm text-muted leading-relaxed line-clamp-3';\n                  excerptP.textContent = excerpt;\n                  content.appendChild(excerptP);\n                }\n\n                var authorEl = document.createElement('p');\n                authorEl.className = 'text-[11px] text-muted mt-1';\n                authorEl.textContent = authorName;\n                content.appendChild(authorEl);\n\n                link.appendChild(imageWrapper);\n                link.appendChild(content);\n                wrapper.appendChild(link);\n\n                return wrapper;\n              }\n\n              async function loadMore() {\n                if (isLoading || !hasMore) return;\n                isLoading = true;\n                moreBtn.disabled = true;\n\n                try {\n                  var nextPage = currentPage + 1;\n                  var res = await fetch('/api/frontend/articles?page=' + nextPage + '&limit=' + PAGE_LIMIT);\n                  if (!res.ok) {\n                    throw new Error('HTTP ' + res.status);\n                  }\n                  var data = await res.json();\n                  var docs = Array.isArray(data.docs) ? data.docs : [];\n\n                  if (!docs.length) {\n                    hasMore = false;\n                    moreBtn.style.display = 'none';\n                    return;\n                  }\n\n                  for (var i = 0; i < docs.length; i++) {\n                    var overallIndex = wrappers.length;\n                    var wrapper = createCardWrapperFromDoc(docs[i], overallIndex);\n                    wrappers.push(wrapper);\n                    grid.appendChild(wrapper);\n                  }\n\n                  currentPage = typeof data.page === 'number' ? data.page : nextPage;\n\n                  if (\n                    (typeof data.hasNextPage === 'boolean' && !data.hasNextPage) ||\n                    (typeof data.totalPages === 'number' && typeof data.page === 'number' && data.page >= data.totalPages) ||\n                    (data.nextPage == null)\n                  ) {\n                    hasMore = false;\n                    moreBtn.style.display = 'none';\n                  }\n                } catch (e) {\n                  console.error('Failed to load more articles', e);\n                  hasMore = false;\n                  moreBtn.style.display = 'none';\n                } finally {\n                  isLoading = false;\n                  moreBtn.disabled = false;\n                }\n              }\n\n            moreBtn.addEventListener('click', function () {\n              loadMore();\n            });\n          })();\n        })();<\/script> "])), mainArticle && renderTemplate`<section class="mb-12 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)] items-start"> <div> ${renderComponent($$result4, "CardA", $$CardA, { ...mainArticle })} </div> <div class="space-y-4"> <h2 class="text-xs font-semibold tracking-[0.18em] uppercase text-muted mb-3">${labelHomeMain}</h2> <div class="space-y-4"> ${topArticles.map((article) => renderTemplate`<a${addAttribute(article.href, "href")} class="block border-b border-border pb-4 last:border-b-0 last:pb-0"> ${article.category && renderTemplate`<p class="text-[11px] font-semibold tracking-[0.18em] uppercase text-accent mb-1"> ${article.category} </p>`} <h3 class="text-sm font-semibold text-foreground leading-snug line-clamp-2"> ${article.title} </h3> </a>`)} </div> </div> </section>`, labelHomeLatest, feedArticles.map((article, index) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, {}, { "default": async ($$result5) => renderTemplate`${index === 8 && mustReadArticles.length > 0 && renderTemplate`<div class="lg:col-span-2 mb-8"> <h3 class="text-xs font-semibold tracking-[0.18em] uppercase text-muted mb-4">${labelHomeMustRead}</h3> <div class="grid gap-6 md:grid-cols-2"> ${mustReadArticles.map((mr) => renderTemplate`<a${addAttribute(mr.href, "href")} class="block group"> <div class="rounded-card overflow-hidden mb-4"> <img${addAttribute(mr.imageUrl, "src")}${addAttribute(mr.imageAlt, "alt")}${addAttribute(640, "width")}${addAttribute(360, "height")} loading="lazy" class="w-full h-auto object-cover aspect-video transition-transform duration-300 group-hover:scale-105"${addAttribute(`this.onerror=null; this.src='${PLACEHOLDER_IMAGE_URL}';`, "onerror")}> </div> ${mr.category && renderTemplate`<p class="text-[11px] font-semibold tracking-[0.18em] uppercase text-accent mb-1"> ${mr.category} </p>`} <h4 class="text-lg md:text-xl font-bold text-foreground leading-snug mb-2 line-clamp-2"> ${mr.title} </h4> <p class="text-xs text-muted"> ${mr.authorName} </p> </a>`)} </div> </div>`}<div${addAttribute([index < 14 ? "" : "hidden"], "class:list")}${addAttribute(index, "data-index")}> <a${addAttribute(article.href, "href")} class="flex gap-4 group"> <div class="flex-shrink-0 w-32 md:w-40 overflow-hidden rounded-image"> <img${addAttribute(article.imageUrl, "src")}${addAttribute(article.imageAlt, "alt")}${addAttribute(200, "width")}${addAttribute(130, "height")} loading="lazy" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"${addAttribute(`this.onerror=null; this.src='${article.fallbackImageUrl}';`, "onerror")}> </div> <div class="flex-1 border-b border-border pb-4"> ${article.category && renderTemplate`<p class="text-[11px] font-semibold tracking-[0.18em] uppercase text-accent mb-1"> ${article.category} </p>`} <h3 class="text-sm md:text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:underline"> ${article.title} </h3> <p class="text-xs text-muted mt-2"> ${article.authorName} </p> </div> </a> </div> ` })}`), labelHomePopular, popularArticles.map((article) => renderTemplate`<a${addAttribute(article.href, "href")} class="block border-b border-border pb-3 last:border-b-0 last:pb-0"> ${article.category && renderTemplate`<p class="text-[11px] font-semibold tracking-[0.18em] uppercase text-accent mb-1"> ${article.category} </p>`} <h3 class="text-sm font-semibold text-foreground leading-snug line-clamp-2"> ${article.title} </h3> </a>`), categoryBlocks.length > 0 && renderTemplate`<section class="mb-8 grid gap-8 lg:grid-cols-2"> ${categoryBlocks.map((block) => renderTemplate`<div class="space-y-4"> <h2 class="text-xs font-semibold tracking-[0.18em] uppercase text-muted mb-4">${block.category.name}</h2> <div class="space-y-3"> ${block.articles.map((article) => renderTemplate`<a${addAttribute(article.href, "href")} class="block border-b border-border pb-3 last:border-b-0 last:pb-0"> ${article.category && renderTemplate`<p class="text-[11px] font-semibold tracking-[0.18em] uppercase text-accent mb-1"> ${article.category} </p>`} <h3 class="text-sm font-semibold text-foreground leading-snug line-clamp-2"> ${article.title} </h3> </a>`)} </div> </div>`)} </section>`, labelHomeTags, displayTags.map((tag) => renderTemplate`<a${addAttribute(`/tags/${tag.slug}`, "href")} class="inline-flex px-3 py-1 bg-background border border-border rounded-full text-xs font-medium text-foreground hover:bg-accent hover:text-background hover:border-accent transition-colors duration-150"> ${tag.name} </a>`), defineScriptVars({ PAGE_LIMIT, PLACEHOLDER_IMAGE_URL })) })}`}` })} ` })}`;
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
