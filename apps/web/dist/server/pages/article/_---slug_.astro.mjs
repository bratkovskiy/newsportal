/* empty css                                    */
import { c as createComponent, b as createAstro, r as renderComponent, a as renderTemplate, d as renderSlot, m as maybeRenderHead, e as addAttribute, f as defineScriptVars, F as Fragment, u as unescapeHTML } from '../../chunks/astro/server_CMM1Egp5.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_Daea0-QY.mjs';
import { g as generateArticleTitle, a as generateArticleDescription, $ as $$MainColumns, b as $$AdSlot } from '../../chunks/seo_Dd-zSdmL.mjs';
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
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": metaTitle, "description": metaDescription }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "MainColumns", $$MainColumns, {}, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<article class="max-w-4xl mx-auto py-8 lg:py-10"> <div class="mb-6"> ${renderSlot($$result3, $$slots["breadcrumbs"])} </div> <header class="mb-10"> <div class="mb-6"> <h1 class="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground"> ${title} </h1> ${excerpt && renderTemplate`<p class="text-base md:text-lg text-muted mt-4 max-w-2xl"> ${excerpt} </p>`} </div> <div class="flex flex-wrap items-center gap-3 text-xs text-muted"> <span>${typeof author === "object" ? author?.name : author}</span> <span class="w-px h-3 bg-border" aria-hidden="true"></span> <time${addAttribute(publishedDate instanceof Date ? publishedDate.toISOString() : publishedDate, "datetime")}>${formattedDate}</time> </div> <div class="mt-8 rounded-card overflow-hidden shadow-card"> <img${addAttribute(coverImage, "src")}${addAttribute(coverImageAlt, "alt")}${addAttribute(1200, "width")}${addAttribute(600, "height")} fetchpriority="high" class="w-full h-auto object-cover aspect-video"${addAttribute(`this.onerror=null; this.src='${fallbackImageUrl}';`, "onerror")}> </div> ${coverCaption && renderTemplate`<p class="mt-3 text-xs text-muted max-w-2xl"> ${coverCaption} </p>`} </header> <div class="prose prose-lg article-prose max-w-4xl w-full"> ${renderSlot($$result3, $$slots["default"])} <!-- Article content goes here --> </div> ${renderSlot($$result3, $$slots["related"])} <!-- Related articles block --> </article>  `, "right": async ($$result3) => renderTemplate`<div class="space-y-6"> ${renderSlot($$result3, $$slots["right"])} ${renderComponent($$result3, "AdSlot", $$AdSlot, { "placementKey": "article_sidebar" })} </div>` })} ` })} `;
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
  const authorObj = payloadArticle?.author && typeof payloadArticle.author === "object" ? payloadArticle.author : null;
  const author = {
    name: authorObj?.name ?? "Unknown",
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
  if (category.slug && payloadArticle?.id) {
    try {
      const relatedUrl = new URL("/api/articles", CMS_URL);
      relatedUrl.searchParams.set("where[status][equals]", "published");
      relatedUrl.searchParams.set("where[categories.slug][equals]", category.slug);
      relatedUrl.searchParams.set("limit", "5");
      relatedUrl.searchParams.set("depth", "1");
      relatedUrl.searchParams.set("sort", "-publishedDate");
      const relatedRes = await fetch(relatedUrl.toString());
      if (relatedRes.ok) {
        const { docs } = await relatedRes.json();
        relatedArticles = docs.filter((doc) => String(doc.id) !== String(payloadArticle.id)).slice(0, 4).map((doc) => {
          let coverImg = "";
          if (doc.feedImageUrl) {
            coverImg = doc.feedImageUrl;
          } else if (doc.coverImage && typeof doc.coverImage === "object" && doc.coverImage.url) {
            coverImg = new URL(doc.coverImage.url, CMS_URL).toString();
          }
          return {
            title: doc.title ?? "",
            slug: doc.slug ?? "",
            category: category.name,
            coverImage: coverImg
          };
        });
      }
    } catch (e) {
      console.error("Error fetching related articles:", e);
    }
  }
  const metaTitle = payloadArticle?.title ?? "";
  const metaDescription = payloadArticle?.excerpt ?? "";
  return renderTemplate`${payloadArticle ? renderTemplate`${renderComponent($$result, "ArticleLayout", $$Article, { "title": metaTitle, "excerpt": metaDescription, "category": category, "author": author, "publishedDate": publishedDate instanceof Date ? publishedDate.toISOString() : publishedDate, "coverImage": coverImageUrl, "coverImageAlt": coverImageAlt, "fallbackImageUrl": PLACEHOLDER_IMAGE_URL }, { "breadcrumbs": async ($$result2) => renderTemplate`${maybeRenderHead()}<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Главная</a><span aria-hidden="true">/</span>${category.slug ? renderTemplate`<a${addAttribute(`/category/${category.slug}`, "href")}>${category.name}</a>` : renderTemplate`<span>${category.name}</span>`}<span aria-hidden="true">/</span><span class="breadcrumb-current">${metaTitle}</span></nav>`, "default": async ($$result2) => renderTemplate(_a || (_a = __template(["", "<script>(function(){", "\n      (function() {\n        if (!articleId || !publicCmsUrl) return;\n        \n        fetch(publicCmsUrl + '/api/articles/' + articleId + '/increment-view', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' }\n        }).catch(function(err) {\n          console.error('Failed to increment view count:', err);\n        });\n      })();\n    })();<\/script>"])), renderComponent($$result2, "ArticleBody", $$ArticleBody, {}, { "default": async ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate`${unescapeHTML(articleHtml)}` })}` }), defineScriptVars({ articleId: payloadArticle?.id, publicCmsUrl: PUBLIC_CMS_URL })) })}` : renderTemplate`<p style="padding: 2rem; text-align: center;">Article not found.</p>`}`;
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
