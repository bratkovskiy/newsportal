/* empty css                                 */
import { c as createComponent, b as createAstro, m as maybeRenderHead, e as addAttribute, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_CMM1Egp5.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BwCxMai_.mjs';
import { e as getBrandName, f as generateSearchTitle, h as generateSearchDescription, $ as $$MainColumns } from '../chunks/seo_C7GlaQdg.mjs';
import '@astrojs/internal-helpers/path';
import { $ as $$Image } from '../chunks/_astro_assets_B8LqoNoR.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro();
const $$CardC = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$CardC;
  const { href, title, imageUrl, imageAlt } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")} class="flex items-center group p-2 rounded-card hover:bg-gray-100 transition-colors duration-200"> <div class="w-16 h-16 flex-shrink-0 mr-4"> ${renderComponent($$result, "Image", $$Image, { "src": imageUrl, "alt": imageAlt, "width": 100, "height": 100, "format": "avif", "quality": 75, "class": "w-full h-full object-cover rounded-image" })} </div> <div> <h4 class="text-sm font-semibold text-foreground leading-tight group-hover:text-accent transition-colors duration-200">${title}</h4> </div> </a>`;
}, "/home/ilia/newsportal_clean/apps/web/src/components/CardC.astro", void 0);

const $$Astro = createAstro();
const $$Search = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Search;
  const CMS_URL = "http://cms:3000";
  const rawQuery = Astro2.url.searchParams.get("q") || "";
  const query = rawQuery.trim();
  let searchResults = [];
  let searchTime = 0;
  if (query.length >= 2) {
    try {
      const cmsUrl = new URL("/api/articles", CMS_URL);
      cmsUrl.searchParams.set("where[status][equals]", "published");
      cmsUrl.searchParams.set("depth", "1");
      cmsUrl.searchParams.set("sort", "-publishedDate");
      cmsUrl.searchParams.set("page", "1");
      cmsUrl.searchParams.set("limit", "20");
      cmsUrl.searchParams.set("where[or][0][title][like]", query);
      cmsUrl.searchParams.set("where[or][1][excerpt][like]", query);
      cmsUrl.searchParams.set("where[or][2][contentHtml][like]", query);
      const startTime = Date.now();
      const res = await fetch(cmsUrl.toString());
      searchTime = Date.now() - startTime;
      if (res.ok) {
        const data = await res.json();
        const docs = Array.isArray(data?.docs) ? data.docs : [];
        searchResults = docs.map((doc) => {
          const slug = doc.slug || String(doc.id);
          const id = String(doc.id);
          const href = slug && id ? `/article/${slug}-${id}.html` : slug ? `/article/${slug}` : `/article/${id}`;
          return {
            href,
            title: doc.title || "",
            imageUrl: "/placeholder-1.jpg",
            imageAlt: doc.title || ""
          };
        });
      }
    } catch (e) {
      searchResults = [];
    }
  }
  const resultCount = searchResults.length;
  const brandName = await getBrandName();
  const metaTitle = query ? await generateSearchTitle(query, resultCount, brandName) : `Поиск по сайту | ${brandName}`;
  const metaDescription = query ? await generateSearchDescription(query, resultCount, brandName) : `Поиск новостей и статей на ${brandName}.`;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": metaTitle, "description": metaDescription }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "MainColumns", $$MainColumns, {}, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<h1 class="text-3xl font-bold text-foreground mb-8 text-center">Поиск по сайту</h1> <form action="/search" method="GET" class="max-w-xl mx-auto mb-12"> <div class="flex"> <input type="search" name="q"${addAttribute(query, "value")} placeholder="Введите запрос..." class="w-full px-4 py-2 border border-border rounded-l-button focus:outline-none focus:ring-2 focus:ring-accent"> <button type="submit" class="bg-accent text-white px-6 py-2 rounded-r-button hover:opacity-90">
Найти
</button> </div> </form> <div class="max-w-2xl mx-auto"> ${query && query.length < 2 && renderTemplate`<div class="mb-8 text-center text-muted"> <p>Введите не менее двух символов для поиска.</p> </div>`} ${query && query.length >= 2 && renderTemplate`<div class="mb-8 text-center text-muted"> <p>
Найдено ${searchResults.length} материалов по запросу «${query}»
${searchTime > 0 && ` за ${searchTime} мс`}.
</p> </div>`} <div class="space-y-4"> ${searchResults.map((result) => renderTemplate`${renderComponent($$result3, "CardC", $$CardC, { ...result })}`)} </div> ${searchResults.length === 0 && query.length >= 2 && renderTemplate`<p class="text-center text-muted mt-8">Ничего не найдено.</p>`} </div> ` })} ` })}`;
}, "/home/ilia/newsportal_clean/apps/web/src/pages/search.astro", void 0);
const $$file = "/home/ilia/newsportal_clean/apps/web/src/pages/search.astro";
const $$url = "/search";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Search,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
