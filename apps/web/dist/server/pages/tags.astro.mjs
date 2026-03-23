/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_CMM1Egp5.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_Daea0-QY.mjs';
import { e as getBrandName, $ as $$MainColumns } from '../chunks/seo_Dd-zSdmL.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const CMS_URL = "http://cms:3000";
  let tags = [];
  try {
    const response = await fetch(`${CMS_URL}/api/tags?limit=1000&sort=name`);
    if (response.ok) {
      const data = await response.json();
      tags = (data.docs || []).map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        metaTitle: tag.metaTitle,
        metaDescription: tag.metaDescription
      }));
    }
  } catch (error) {
    console.error("Error fetching tags:", error);
  }
  const brandName = await getBrandName();
  const metaTitle = `Все теги - ${brandName}`;
  const metaDescription = `Полный список тегов на ${brandName}`;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": metaTitle, "description": metaDescription }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "MainColumns", $$MainColumns, {}, { "default": async ($$result3) => renderTemplate`  ${maybeRenderHead()}<nav class="text-sm mb-6"> <a href="/" class="text-muted hover:text-accent">Главная</a> <span class="mx-2">/</span> <span>Теги</span> </nav> <h1 class="text-3xl font-bold text-foreground mb-8">Все теги</h1> ${tags.length > 0 ? renderTemplate`<div class="flex flex-wrap gap-3"> ${tags.map((tag) => renderTemplate`<a${addAttribute(`/tags/${tag.slug}`, "href")} class="inline-block px-4 py-2 bg-background border border-border rounded-full text-sm font-medium text-foreground hover:bg-accent hover:text-background hover:border-accent transition-all duration-200 shadow-sm hover:shadow-md"> ${tag.name} </a>`)} </div>` : renderTemplate`<p class="text-muted">Теги не найдены</p>`}` })} ` })}`;
}, "/home/ilia/newsportal_clean/apps/web/src/pages/tags/index.astro", void 0);
const $$file = "/home/ilia/newsportal_clean/apps/web/src/pages/tags/index.astro";
const $$url = "/tags";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
