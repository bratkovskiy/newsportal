/* empty css                                    */
import { c as createComponent, b as createAstro, r as renderComponent, a as renderTemplate, m as maybeRenderHead, F as Fragment, e as addAttribute } from '../../chunks/astro/server_CMM1Egp5.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_Daea0-QY.mjs';
import { i as generateTagTitle, j as generateTagDescription, $ as $$MainColumns } from '../../chunks/seo_Dd-zSdmL.mjs';
import { g as getCmsEnv } from '../../chunks/cmsEnv_CFHJDxTC.mjs';
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
  let tag = null;
  let tagId = null;
  try {
    const tagsResponse = await fetch(`${CMS_URL}/api/tags?where[slug][equals]=${slug}&limit=1`);
    if (tagsResponse.ok) {
      const tagsData = await tagsResponse.json();
      const tags = tagsData.docs || [];
      if (tags.length > 0) {
        tag = tags[0];
        tagId = tag.id;
      }
    }
  } catch (error) {
    console.error("Error fetching tag:", error);
  }
  if (!tag || !tagId) {
    return Astro2.redirect("/404");
  }
  let articles = [];
  let pagination = {
    page: currentPage,
    totalPages: 1,
    totalDocs: 0
  };
  try {
    const articlesResponse = await fetch(
      `${CMS_URL}/api/articles?where[tags][equals]=${tagId}&where[status][equals]=published&sort=-publishedDate&page=${currentPage}&limit=${PAGE_LIMIT}`
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
        let authorName = "\u0420\u0435\u0434\u0430\u043A\u0446\u0438\u044F";
        if (article.author) {
          if (typeof article.author === "object" && article.author?.name) {
            authorName = article.author.name;
          }
        }
        let categoryName = "";
        if (article.categories && Array.isArray(article.categories) && article.categories.length > 0) {
          const firstCategory = article.categories[0];
          if (typeof firstCategory === "object" && firstCategory?.name) {
            categoryName = firstCategory.name;
          }
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
          category: categoryName,
          authorName
        };
      });
    }
  } catch (error) {
    console.error("Error fetching articles:", error);
  }
  const articleCount = articles.length;
  let metaTitle = tag.metaTitle;
  let metaDescription = tag.metaDescription;
  if (!metaTitle) {
    metaTitle = await generateTagTitle(tag.name);
  }
  if (!metaDescription) {
    metaDescription = await generateTagDescription(tag.name, articleCount);
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": metaTitle, "description": metaDescription }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "MainColumns", $$MainColumns, {}, { "default": async ($$result3) => renderTemplate`  ${maybeRenderHead()}<nav class="text-sm mb-6"> <a href="/" class="text-muted hover:text-accent">Главная</a> <span class="mx-2">/</span> <a href="/tags" class="text-muted hover:text-accent">Теги</a> <span class="mx-2">/</span> <span>${tag.name}</span> </nav> <h1 class="text-3xl font-bold text-foreground mb-8">${tag.name}</h1> ${articles.length > 0 ? renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate` <section class="mb-8"> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"> ${articles.map((article) => renderTemplate`<a${addAttribute(article.href, "href")} class="flex gap-4 group"> <div class="flex-shrink-0 w-32 md:w-40 overflow-hidden rounded-image"> <img${addAttribute(article.imageUrl, "src")}${addAttribute(article.imageAlt, "alt")}${addAttribute(200, "width")}${addAttribute(130, "height")} loading="lazy" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"${addAttribute(`this.onerror=null; this.src='${PLACEHOLDER_IMAGE_URL}';`, "onerror")}> </div> <div class="flex-1 border-b border-border pb-4"> ${article.category && renderTemplate`<p class="text-[11px] font-semibold tracking-[0.18em] uppercase text-accent mb-1"> ${article.category} </p>`} <h3 class="text-sm md:text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:underline"> ${article.title} </h3> <p class="text-xs text-muted mt-2"> ${article.authorName} </p> </div> </a>`)} </div> </section> ${pagination.totalPages > 1 && renderTemplate`<nav class="mt-8 flex items-center justify-center gap-4 text-sm" aria-label="Пагинация"> ${pagination.page > 1 && renderTemplate`<a${addAttribute(pagination.page - 1 === 1 ? `/tags/${slug}` : `/tags/${slug}?page=${pagination.page - 1}`, "href")} class="px-3 py-1 border border-border rounded-button hover:bg-accent hover:text-background transition-colors">
Назад
</a>`} <span class="text-muted">
Страница ${pagination.page} из ${pagination.totalPages} </span> ${pagination.page < pagination.totalPages && renderTemplate`<a${addAttribute(`/tags/${slug}?page=${pagination.page + 1}`, "href")} class="px-3 py-1 border border-border rounded-button hover:bg-accent hover:text-background transition-colors">
Вперёд
</a>`} </nav>`}` })}` : renderTemplate`<p class="text-muted">Статьи с этим тегом не найдены</p>`}` })} ` })}`;
}, "/home/ilia/newsportal_clean/apps/web/src/pages/tags/[slug].astro", void 0);

const $$file = "/home/ilia/newsportal_clean/apps/web/src/pages/tags/[slug].astro";
const $$url = "/tags/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
