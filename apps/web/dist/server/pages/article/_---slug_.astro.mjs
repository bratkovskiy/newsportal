/* empty css                                    */
import { c as createComponent, b as createAstro, r as renderComponent, a as renderTemplate, d as renderSlot, m as maybeRenderHead, e as addAttribute, f as defineScriptVars, F as Fragment, u as unescapeHTML } from '../../chunks/astro/server_CMM1Egp5.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_BwCxMai_.mjs';
import { g as generateArticleTitle, a as generateArticleDescription, $ as $$MainColumns, b as $$AdSlot } from '../../chunks/seo_C7GlaQdg.mjs';
/* empty css                                     */
import 'clsx';
import { g as getCmsEnv } from '../../chunks/cmsEnv_CFHJDxTC.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro();
const $$Article = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Article;
  const {
    title,
    excerpt,
    author,
    publishedDate,
    coverImage,
    coverImageAlt,
    fallbackImageUrl,
    category,
    coverCaption,
    locale = "ru"
  } = Astro2.props;
  const dateLocale = locale === "en" ? "en-US" : "ru-RU";
  const _d = publishedDate instanceof Date ? publishedDate : new Date(publishedDate);
  const formattedDate = new Intl.DateTimeFormat(dateLocale, { dateStyle: "long" }).format(_d);
  const metaTitle = await generateArticleTitle(title);
  const metaDescription = await generateArticleDescription(excerpt);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": metaTitle, "description": metaDescription }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "MainColumns", $$MainColumns, {}, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<article class="article-page"> <!-- Breadcrumbs --> <div class="article-page__breadcrumbs"> ${renderSlot($$result3, $$slots["breadcrumbs"])} </div> <!-- Header --> <header class="article-page__header"> ${category?.name && renderTemplate`<a${addAttribute(category.slug ? `/tags/${category.slug}` : "#", "href")} class="article-page__cat-tag"> ${category.name} </a>`} <h1 class="article-page__title">${title}</h1> ${excerpt && renderTemplate`<p class="article-page__excerpt">${excerpt}</p>`} <div class="article-page__byline"> ${author?.avatar ? renderTemplate`<img${addAttribute(author.avatar, "src")}${addAttribute(typeof author === "object" ? author.name : author, "alt")}${addAttribute(32, "width")}${addAttribute(32, "height")} class="article-page__avatar" onerror="this.style.display='none'">` : renderTemplate`<div class="article-page__avatar-placeholder"> ${(typeof author === "object" ? author?.name : author)?.charAt(0)?.toUpperCase()} </div>`} <span class="article-page__author">${typeof author === "object" ? author?.name : author}</span> <span class="article-page__byline-sep" aria-hidden="true"></span> <time class="article-page__date"${addAttribute(publishedDate instanceof Date ? publishedDate.toISOString() : publishedDate, "datetime")}> ${formattedDate} </time> </div> ${coverImage && renderTemplate`<figure class="article-page__cover-wrap"> <img${addAttribute(coverImage, "src")}${addAttribute(coverImageAlt, "alt")}${addAttribute(1200, "width")}${addAttribute(630, "height")} fetchpriority="high" class="article-page__cover"${addAttribute(`this.onerror=null;this.src='${fallbackImageUrl}'`, "onerror")}> ${coverCaption && renderTemplate`<figcaption class="article-page__cover-caption">${coverCaption}</figcaption>`} </figure>`} </header> <!-- Body --> <div class="article-prose"> ${renderSlot($$result3, $$slots["default"])} </div> <!-- Related --> ${renderSlot($$result3, $$slots["related"])} </article>  `, "right": async ($$result3) => renderTemplate`<div class="space-y-6"> ${renderSlot($$result3, $$slots["right"])} ${renderComponent($$result3, "AdSlot", $$AdSlot, { "placementKey": "article_sidebar" })} </div>` })} ` })} `;
}, "/home/ilia/newsportal_clean/apps/web/src/layouts/Article.astro", void 0);

const $$ArticleBody = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="article-body"> ${renderSlot($$result, $$slots["default"])} </div> `;
}, "/home/ilia/newsportal_clean/apps/web/src/components/article/ArticleBody.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { cmsUrl: CMS_URL, publicCmsUrl: PUBLIC_CMS_URL, placeholderImageUrl: PLACEHOLDER_IMAGE_URL } = getCmsEnv();
  let siteSettings = null;
  try {
    const res = await fetch(new URL("/api/globals/site-settings", CMS_URL).toString());
    if (res.ok) {
      siteSettings = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
  }
  const currentLanguage = siteSettings?.currentLanguage === "en" ? "en" : "ru";
  const breadcrumbsHomeLabel = currentLanguage === "en" ? "Home" : "\u0413\u043B\u0430\u0432\u043D\u0430\u044F";
  const defaultAuthorName = currentLanguage === "en" ? "Unknown" : "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E";
  const notFoundText = currentLanguage === "en" ? "Article not found." : "\u0421\u0442\u0430\u0442\u044C\u044F \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430.";
  function buildArticlePath(article) {
    const slug = article.slug ?? "";
    const id = article.id ? String(article.id) : "";
    if (slug && id) return `/article/${slug}-${id}.html`;
    if (slug) return `/article/${slug}`;
    if (id) return `/article/${id}`;
    return "/";
  }
  function parseArticlePath(slugPath) {
    const segments = slugPath.split("/").filter(Boolean);
    if (!segments.length) return { id: null, slug: null };
    const lastSegment = segments[segments.length - 1];
    const withoutExt = lastSegment.endsWith(".html") ? lastSegment.slice(0, -".html".length) : lastSegment;
    const lastDash = withoutExt.lastIndexOf("-");
    if (lastDash === -1) {
      return { id: null, slug: withoutExt || null };
    }
    const idPart = withoutExt.slice(lastDash + 1);
    const slugPart = withoutExt.slice(0, lastDash);
    const idNum = Number(idPart);
    if (!idPart || Number.isNaN(idNum)) {
      return { id: null, slug: withoutExt || null };
    }
    return { id: idNum, slug: slugPart || null };
  }
  async function fetchArticleByPath(slugPath) {
    try {
      const { id, slug } = parseArticlePath(slugPath);
      if (id !== null) {
        try {
          const urlById = new URL(`/api/articles/${id}`, CMS_URL);
          urlById.searchParams.set("depth", "1");
          const resById = await fetch(urlById.toString());
          if (resById.ok) {
            const doc = await resById.json();
            if (!doc) return null;
            if (doc._status && doc._status !== "published") {
              return null;
            }
            if (!doc._status && doc.status && doc.status !== "published") {
              return null;
            }
            return doc;
          }
        } catch {
        }
      }
      const fallbackSlug = slug ?? slugPath.split("/").filter(Boolean).slice(-1)[0] ?? "";
      if (!fallbackSlug) return null;
      const url = new URL("/api/articles", CMS_URL);
      url.searchParams.set("where[status][equals]", "published");
      url.searchParams.set("where[slug][equals]", fallbackSlug);
      url.searchParams.set("depth", "1");
      url.searchParams.set("limit", "1");
      const res = await fetch(url.toString());
      if (!res.ok) return null;
      const data = await res.json();
      const docs = Array.isArray(data?.docs) ? data.docs : [];
      return docs[0] ?? null;
    } catch {
      return null;
    }
  }
  const slugParam = Array.isArray(Astro2.params.slug) ? Astro2.params.slug.join("/") : Astro2.params.slug ?? "";
  const payloadArticle = await fetchArticleByPath(slugParam);
  if (!payloadArticle) {
    Astro2.response.status = 404;
  }
  const _rawDate = payloadArticle?.publishedDate;
  const publishedDate = _rawDate && !isNaN(new Date(_rawDate).getTime()) ? new Date(_rawDate) : /* @__PURE__ */ new Date();
  const firstCategory = Array.isArray(payloadArticle?.categories) && payloadArticle.categories.length > 0 ? payloadArticle.categories[0] : null;
  const category = firstCategory && typeof firstCategory === "object" ? { name: firstCategory.name ?? "", slug: firstCategory.slug ?? "" } : { name: "", slug: "" };
  const firstTag = Array.isArray(payloadArticle?.tags) && payloadArticle.tags.length > 0 ? payloadArticle.tags[0] : null;
  const tag = firstTag && typeof firstTag === "object" ? { name: firstTag.name ?? "", slug: firstTag.slug ?? "" } : { name: "", slug: "" };
  const authorObj = payloadArticle?.author && typeof payloadArticle.author === "object" ? payloadArticle.author : null;
  const author = {
    name: authorObj?.name ?? defaultAuthorName,
    slug: authorObj?.slug ?? "unknown",
    avatar: authorObj?.avatar && typeof authorObj.avatar === "object" ? new URL(authorObj.avatar.url, CMS_URL).toString() : void 0
  };
  let coverImageUrl = "";
  let coverImageAlt = payloadArticle?.title ?? "";
  if (payloadArticle?.feedImageUrl) {
    coverImageUrl = payloadArticle.feedImageUrl;
  } else if (payloadArticle?.coverImage && typeof payloadArticle.coverImage === "object") {
    const ci = payloadArticle.coverImage;
    if (ci.url) {
      coverImageUrl = new URL(ci.url, CMS_URL).toString();
    }
    if (ci.alt) {
      coverImageAlt = ci.alt;
    }
  } else if (typeof payloadArticle?.coverImage === "number") {
    try {
      const mediaRes = await fetch(new URL(`/api/media/${payloadArticle.coverImage}`, CMS_URL).toString());
      if (mediaRes.ok) {
        const mediaDoc = await mediaRes.json();
        if (mediaDoc?.url) {
          coverImageUrl = new URL(mediaDoc.url, CMS_URL).toString();
        }
        if (mediaDoc?.alt) {
          coverImageAlt = mediaDoc.alt;
        }
      }
    } catch (e) {
    }
  }
  function addLazyLoadingToImages(html) {
    if (!html) return html;
    return html.replace(
      /<img(?![^>]*\bloading=)([^>]*)>/gi,
      '<img loading="lazy" decoding="async"$1>'
    ).replace(
      /<img(?![^>]*\bonerror=)([^>]*?)>/gi,
      `<img onerror="this.onerror=null; this.src='${PLACEHOLDER_IMAGE_URL}';"$1>`
    );
  }
  function escapeForRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function removeHeroImageFromHtml(html, coverUrl) {
    if (!html || !coverUrl) return html;
    const candidates = [coverUrl];
    try {
      const u = new URL(coverUrl);
      if (u.pathname) {
        candidates.push(u.pathname);
      }
    } catch {
    }
    let result = html;
    for (const candidate of candidates) {
      const pattern = escapeForRegex(candidate);
      const imgRegex = new RegExp(
        `<img[^>]*src=["'][^"']*${pattern}[^"']*["'][^>]*>`,
        "i"
      );
      if (imgRegex.test(result)) {
        result = result.replace(imgRegex, "");
        break;
      }
    }
    return result;
  }
  function extractHeroFigure(html, coverUrl) {
    if (!html || !coverUrl) return { html, caption: "" };
    const candidates = [coverUrl];
    try {
      const u = new URL(coverUrl);
      if (u.pathname) {
        candidates.push(u.pathname);
      }
    } catch {
    }
    let working = html;
    let caption = "";
    for (const candidate of candidates) {
      const pattern = escapeForRegex(candidate);
      const figureRegex = new RegExp(
        `<figure[^>]*>[\\s\\S]*?<img[^>]*src=["'][^"']*${pattern}[^"']*["'][^>]*>[\\s\\S]*?<\\/figure>`,
        "i"
      );
      const match = working.match(figureRegex);
      if (match) {
        const figureHtml = match[0];
        const figcaptionRegex = new RegExp("<figcaption[^>]*>([\\s\\S]*?)<\\/figcaption>", "i");
        const capMatch = figureHtml.match(figcaptionRegex);
        if (capMatch) {
          caption = capMatch[1].trim();
        }
        working = working.replace(figureRegex, "");
        break;
      }
    }
    return { html: working, caption };
  }
  const articleHtmlRaw = payloadArticle ? payloadArticle.contentHtml ?? (typeof payloadArticle.body === "string" ? payloadArticle.body : "") : "";
  const { html: articleWithoutHeroFigure } = extractHeroFigure(articleHtmlRaw, coverImageUrl);
  const articleHtmlClean = removeHeroImageFromHtml(articleWithoutHeroFigure, coverImageUrl);
  const articleHtml = addLazyLoadingToImages(articleHtmlClean);
  function calcReadingTime(html) {
    const text = html.replace(/<[^>]+>/g, " ");
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  }
  calcReadingTime(articleHtml);
  let relatedArticles = [];
  if (payloadArticle?.id) {
    try {
      const usedIds = /* @__PURE__ */ new Set([String(payloadArticle.id)]);
      if (tag.slug) {
        const tagUrl = new URL("/api/articles", CMS_URL);
        tagUrl.searchParams.set("where[status][equals]", "published");
        tagUrl.searchParams.set("where[tags.slug][equals]", tag.slug);
        tagUrl.searchParams.set("limit", "10");
        tagUrl.searchParams.set("depth", "1");
        tagUrl.searchParams.set("sort", "-publishedDate");
        const tagRes = await fetch(tagUrl.toString());
        if (tagRes.ok) {
          const { docs } = await tagRes.json();
          for (const doc of docs) {
            const docId = String(doc.id);
            if (usedIds.has(docId)) continue;
            let coverImg = "";
            if (doc.feedImageUrl) {
              coverImg = doc.feedImageUrl;
            } else if (doc.coverImage && typeof doc.coverImage === "object" && doc.coverImage.url) {
              coverImg = new URL(doc.coverImage.url, CMS_URL).toString();
            }
            relatedArticles.push({
              title: doc.title ?? "",
              slug: doc.slug ?? "",
              href: buildArticlePath(doc),
              tag: tag.name,
              coverImage: coverImg
            });
            usedIds.add(docId);
            if (relatedArticles.length >= 4) break;
          }
        }
      }
      if (relatedArticles.length < 4) {
        const backfillUrl = new URL("/api/articles", CMS_URL);
        backfillUrl.searchParams.set("where[status][equals]", "published");
        backfillUrl.searchParams.set("limit", "20");
        backfillUrl.searchParams.set("depth", "1");
        backfillUrl.searchParams.set("sort", "-publishedDate");
        const backfillRes = await fetch(backfillUrl.toString());
        if (backfillRes.ok) {
          const { docs } = await backfillRes.json();
          for (const doc of docs) {
            const docId = String(doc.id);
            if (usedIds.has(docId)) continue;
            let coverImg = "";
            if (doc.feedImageUrl) {
              coverImg = doc.feedImageUrl;
            } else if (doc.coverImage && typeof doc.coverImage === "object" && doc.coverImage.url) {
              coverImg = new URL(doc.coverImage.url, CMS_URL).toString();
            }
            const docFirstTag = Array.isArray(doc.tags) && doc.tags.length > 0 ? doc.tags[0] : null;
            const docTagName = docFirstTag && typeof docFirstTag === "object" ? docFirstTag.name ?? "" : "";
            relatedArticles.push({
              title: doc.title ?? "",
              slug: doc.slug ?? "",
              href: buildArticlePath(doc),
              tag: docTagName || (typeof doc.categories?.[0] === "object" ? doc.categories[0].name ?? "" : ""),
              coverImage: coverImg
            });
            usedIds.add(docId);
            if (relatedArticles.length >= 4) break;
          }
        }
      }
    } catch (e) {
      console.error("Error fetching related articles:", e);
    }
  }
  const metaTitle = payloadArticle?.title ?? "";
  const metaDescription = payloadArticle?.excerpt ?? "";
  return renderTemplate`${payloadArticle ? renderTemplate`${renderComponent($$result, "ArticleLayout", $$Article, { "title": metaTitle, "excerpt": metaDescription, "category": tag.slug ? tag : category, "author": author, "publishedDate": publishedDate instanceof Date ? publishedDate.toISOString() : publishedDate, "coverImage": coverImageUrl, "coverImageAlt": coverImageAlt, "fallbackImageUrl": PLACEHOLDER_IMAGE_URL }, { "breadcrumbs": async ($$result2) => renderTemplate`${maybeRenderHead()}<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">${breadcrumbsHomeLabel}</a><span aria-hidden="true">/</span>${category.slug ? renderTemplate`<a${addAttribute(`/categories/${category.slug}`, "href")}>${category.name}</a>` : renderTemplate`<span>${category.name}</span>`}<span aria-hidden="true">/</span><span class="breadcrumb-current">${metaTitle}</span></nav>`, "default": async ($$result2) => renderTemplate(_a || (_a = __template(["", "<script>(function(){", "\n      (function() {\n        if (!articleId || !publicCmsUrl) return;\n        \n        fetch(publicCmsUrl + '/api/articles/' + articleId + '/increment-view', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' }\n        }).catch(function(err) {\n          console.error('Failed to increment view count:', err);\n        });\n      })();\n    })();<\/script>"])), renderComponent($$result2, "ArticleBody", $$ArticleBody, {}, { "default": async ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate`${unescapeHTML(articleHtml)}` })}` }), defineScriptVars({ articleId: payloadArticle?.id, publicCmsUrl: PUBLIC_CMS_URL })), "related": async ($$result2) => renderTemplate`${relatedArticles.length > 0 && renderTemplate`<div class="art-related"><div class="art-related__header"><span class="art-related__label">Related articles</span><span class="art-related__line"></span></div><div class="art-related__grid">${relatedArticles.map((rel) => renderTemplate`<a${addAttribute(rel.href, "href")} class="art-related__item">${rel.coverImage && renderTemplate`<div class="art-related__img-wrap"><img${addAttribute(rel.coverImage, "src")}${addAttribute(rel.title, "alt")}${addAttribute(280, "width")}${addAttribute(160, "height")} loading="lazy" class="art-related__img"></div>`}<div class="art-related__body">${rel.tag && renderTemplate`<span class="art-related__cat">${rel.tag}</span>`}<h3 class="art-related__title">${rel.title}</h3></div></a>`)}</div></div>`}` })}` : renderTemplate`<p style="padding: 2rem; text-align: center;">${notFoundText}</p>`}`;
}, "/home/ilia/newsportal_clean/apps/web/src/pages/article/[...slug].astro", void 0);

const $$file = "/home/ilia/newsportal_clean/apps/web/src/pages/article/[...slug].astro";
const $$url = "/article/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
