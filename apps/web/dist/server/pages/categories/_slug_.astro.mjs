/* empty css                                    */
import { c as createComponent, b as createAstro, r as renderComponent, a as renderTemplate, m as maybeRenderHead, F as Fragment, e as addAttribute } from '../../chunks/astro/server_CMM1Egp5.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_BwCxMai_.mjs';
import { c as generateCategoryTitle, d as generateCategoryDescription, $ as $$MainColumns } from '../../chunks/seo_C7GlaQdg.mjs';
import { g as getCmsEnv } from '../../chunks/cmsEnv_CFHJDxTC.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { cmsUrl: CMS_URL, placeholderImageUrl: PLACEHOLDER_IMAGE_URL } = getCmsEnv();
  const PAGE_LIMIT = 50;
  const { slug } = Astro2.params;
  const url = Astro2.url;
  const currentPage = Number(url.searchParams.get("page") || "1");
  let category = null;
  let categoryId = null;
  try {
    const categoriesResponse = await fetch(`${CMS_URL}/api/categories?where[slug][equals]=${slug}&limit=1`);
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      const categories = categoriesData.docs || [];
      if (categories.length > 0) {
        category = categories[0];
        categoryId = category.id;
      }
    }
  } catch (error) {
    console.error("Error fetching category:", error);
  }
  if (!category || !categoryId) {
    return Astro2.redirect("/404");
  }
  let articles = [];
  let pagination = {
    page: currentPage,
    totalPages: 1,
    totalDocs: 0
  };
  let siteSettings = null;
  try {
    const res = await fetch(`${CMS_URL}/api/globals/site-settings`);
    if (res.ok) {
      siteSettings = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
  }
  const currentLanguage = siteSettings?.currentLanguage === "en" ? "en" : "ru";
  const defaultAuthorName = currentLanguage === "en" ? "Editorial team" : "\u0420\u0435\u0434\u0430\u043A\u0446\u0438\u044F";
  const breadcrumbsHomeLabel = currentLanguage === "en" ? "Home" : "\u0413\u043B\u0430\u0432\u043D\u0430\u044F";
  const breadcrumbsCategoriesLabel = currentLanguage === "en" ? "Categories" : "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438";
  const sectionAllArticlesLabel = currentLanguage === "en" ? "All articles" : "\u0412\u0441\u0435 \u0441\u0442\u0430\u0442\u044C\u0438";
  const paginationPrevLabel = currentLanguage === "en" ? "\u2190 Previous" : "\u2190 \u041D\u0430\u0437\u0430\u0434";
  const paginationNextLabel = currentLanguage === "en" ? "Next \u2192" : "\u0412\u043F\u0435\u0440\u0451\u0434 \u2192";
  const paginationAriaLabel = currentLanguage === "en" ? "Pagination" : "\u041F\u0430\u0433\u0438\u043D\u0430\u0446\u0438\u044F";
  const emptyStateText = currentLanguage === "en" ? "No published articles in this category yet." : "\u0412 \u044D\u0442\u043E\u0439 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043D\u044B\u0445 \u0441\u0442\u0430\u0442\u0435\u0439.";
  const paginationInfoText = (page, total) => currentLanguage === "en" ? `Page ${page} of ${total}` : `\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 ${page} \u0438\u0437 ${total}`;
  const formatArticleCount = (count) => {
    if (count <= 0) {
      return "";
    }
    if (currentLanguage === "en") {
      return `${count} ${count === 1 ? "article" : "articles"}`;
    }
    const mod100 = count % 100;
    const mod10 = count % 10;
    let word = "\u0441\u0442\u0430\u0442\u0435\u0439";
    if (mod100 > 10 && mod100 < 20) {
      word = "\u0441\u0442\u0430\u0442\u0435\u0439";
    } else if (mod10 === 1) {
      word = "\u0441\u0442\u0430\u0442\u044C\u044F";
    } else if (mod10 >= 2 && mod10 <= 4) {
      word = "\u0441\u0442\u0430\u0442\u044C\u0438";
    }
    return `${count} ${word}`;
  };
  try {
    const articlesResponse = await fetch(
      `${CMS_URL}/api/articles?where[categories][equals]=${categoryId}&where[status][equals]=published&sort=-publishedDate&page=${currentPage}&limit=${PAGE_LIMIT}`
    );
    if (articlesResponse.ok) {
      const articlesData = await articlesResponse.json();
      pagination = {
        page: typeof articlesData.page === "number" ? articlesData.page : currentPage,
        totalPages: typeof articlesData.totalPages === "number" ? articlesData.totalPages : 1,
        totalDocs: typeof articlesData.totalDocs === "number" ? articlesData.totalDocs : Array.isArray(articlesData.docs) ? articlesData.docs.length : 0
      };
      articles = (articlesData.docs || []).map((article) => {
        let imageUrl = PLACEHOLDER_IMAGE_URL;
        if (article.feedImageUrl) {
          imageUrl = article.feedImageUrl;
        } else if (article.coverImage) {
          if (typeof article.coverImage === "object" && article.coverImage?.url) {
            imageUrl = article.coverImage.url.startsWith("http") ? article.coverImage.url : `${CMS_URL}${article.coverImage.url}`;
          } else if (typeof article.coverImage === "number" || typeof article.coverImage === "string") {
            imageUrl = `${CMS_URL}/api/media/${article.coverImage}`;
          }
        }
        let authorName = defaultAuthorName;
        if (article.author && typeof article.author === "object" && article.author?.name) {
          authorName = article.author.name;
        }
        const articleSlug = article.slug || article.title?.toLowerCase().replace(/\s+/g, "-");
        const publishedDate = article.publishedDate ? new Date(article.publishedDate) : /* @__PURE__ */ new Date();
        const year = publishedDate.getFullYear();
        const month = String(publishedDate.getMonth() + 1).padStart(2, "0");
        return {
          href: `/article/${year}/${month}/${articleSlug}`,
          title: article.title,
          excerpt: article.excerpt || "",
          imageUrl,
          imageAlt: article.title,
          fallbackImageUrl: PLACEHOLDER_IMAGE_URL,
          category: category.name,
          authorName,
          publishedDate: article.publishedDate
        };
      });
    }
  } catch (error) {
    console.error("Error fetching articles:", error);
  }
  const articleCount = articles.length;
  let metaTitle = category.metaTitle;
  let metaDescription = category.metaDescription;
  if (!metaTitle) metaTitle = await generateCategoryTitle(category.name);
  if (!metaDescription) metaDescription = await generateCategoryDescription(category.name, articleCount);
  const featuredArticles = articles.slice(0, 2);
  const gridArticles = articles.slice(2);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": metaTitle, "description": metaDescription, "data-astro-cid-dqg6fwsj": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "MainColumns", $$MainColumns, { "data-astro-cid-dqg6fwsj": true }, { "default": async ($$result3) => renderTemplate`  ${maybeRenderHead()}<nav class="cat-breadcrumb" data-astro-cid-dqg6fwsj> <a href="/" data-astro-cid-dqg6fwsj>${breadcrumbsHomeLabel}</a> <span data-astro-cid-dqg6fwsj>/</span> <a href="/categories" data-astro-cid-dqg6fwsj>${breadcrumbsCategoriesLabel}</a> <span data-astro-cid-dqg6fwsj>/</span> <span class="cat-breadcrumb__current" data-astro-cid-dqg6fwsj>${category.name}</span> </nav>  <div class="cat-header" data-astro-cid-dqg6fwsj> <span class="cat-header__tag" data-astro-cid-dqg6fwsj>${category.name}</span> <h1 class="cat-header__title" data-astro-cid-dqg6fwsj>${category.name}</h1> ${pagination.totalDocs > 0 && renderTemplate`<p class="cat-header__count" data-astro-cid-dqg6fwsj>${formatArticleCount(pagination.totalDocs)}</p>`} </div> ${articles.length > 0 ? renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "data-astro-cid-dqg6fwsj": true }, { "default": async ($$result4) => renderTemplate`  ${featuredArticles.length > 0 && renderTemplate`<div class="cat-featured" data-astro-cid-dqg6fwsj> ${featuredArticles.map((article, i) => renderTemplate`<a${addAttribute(article.href, "href")} class="cat-featured__item group" data-astro-cid-dqg6fwsj> <div class="cat-featured__img-wrap" data-astro-cid-dqg6fwsj> <img${addAttribute(article.imageUrl, "src")}${addAttribute(article.imageAlt, "alt")}${addAttribute(560, "width")}${addAttribute(315, "height")}${addAttribute(i === 0 ? "eager" : "lazy", "loading")} class="cat-featured__img"${addAttribute(`this.onerror=null;this.src='${PLACEHOLDER_IMAGE_URL}'`, "onerror")} data-astro-cid-dqg6fwsj> </div> <div class="cat-featured__body" data-astro-cid-dqg6fwsj> <span class="cat-tag" data-astro-cid-dqg6fwsj>${article.category}</span> <h2 class="cat-featured__title" data-astro-cid-dqg6fwsj>${article.title}</h2> ${article.excerpt && renderTemplate`<p class="cat-featured__excerpt" data-astro-cid-dqg6fwsj>${article.excerpt}</p>`} <p class="cat-featured__meta" data-astro-cid-dqg6fwsj>${article.authorName}</p> </div> </a>`)} </div>`} ${gridArticles.length > 0 && renderTemplate`<section class="cat-grid-section" data-astro-cid-dqg6fwsj> <div class="cat-section-label" data-astro-cid-dqg6fwsj> <span data-astro-cid-dqg6fwsj>${sectionAllArticlesLabel}</span> <span class="cat-section-label__line" data-astro-cid-dqg6fwsj></span> </div> <div class="cat-grid" data-astro-cid-dqg6fwsj> ${gridArticles.map((article) => renderTemplate`<a${addAttribute(article.href, "href")} class="cat-news-item group" data-astro-cid-dqg6fwsj> <div class="cat-news-item__img-wrap" data-astro-cid-dqg6fwsj> <img${addAttribute(article.imageUrl, "src")}${addAttribute(article.imageAlt, "alt")}${addAttribute(160, "width")}${addAttribute(107, "height")} loading="lazy" class="cat-news-item__img"${addAttribute(`this.onerror=null;this.src='${article.fallbackImageUrl}'`, "onerror")} data-astro-cid-dqg6fwsj> </div> <div class="cat-news-item__body" data-astro-cid-dqg6fwsj> <span class="cat-tag" data-astro-cid-dqg6fwsj>${article.category}</span> <h3 class="cat-news-item__title" data-astro-cid-dqg6fwsj>${article.title}</h3> <p class="cat-news-item__meta" data-astro-cid-dqg6fwsj>${article.authorName}</p> </div> </a>`)} </div> </section>`} ${pagination.totalPages > 1 && renderTemplate`<nav class="cat-pagination"${addAttribute(paginationAriaLabel, "aria-label")} data-astro-cid-dqg6fwsj> ${pagination.page > 1 && renderTemplate`<a${addAttribute(pagination.page - 1 === 1 ? `/categories/${slug}` : `/categories/${slug}?page=${pagination.page - 1}`, "href")} class="cat-pagination__btn" data-astro-cid-dqg6fwsj> ${paginationPrevLabel} </a>`} <span class="cat-pagination__info" data-astro-cid-dqg6fwsj> ${paginationInfoText(pagination.page, pagination.totalPages)} </span> ${pagination.page < pagination.totalPages && renderTemplate`<a${addAttribute(`/categories/${slug}?page=${pagination.page + 1}`, "href")} class="cat-pagination__btn" data-astro-cid-dqg6fwsj> ${paginationNextLabel} </a>`} </nav>`}` })}` : renderTemplate`<div class="cat-empty" data-astro-cid-dqg6fwsj> <p data-astro-cid-dqg6fwsj>${emptyStateText}</p> </div>`}` })} ` })} `;
}, "/home/ilia/newsportal_clean/apps/web/src/pages/categories/[slug].astro", void 0);

const $$file = "/home/ilia/newsportal_clean/apps/web/src/pages/categories/[slug].astro";
const $$url = "/categories/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
