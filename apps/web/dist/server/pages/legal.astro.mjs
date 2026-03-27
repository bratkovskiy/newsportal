/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from '../chunks/astro/server_CMM1Egp5.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BwCxMai_.mjs';
import { $ as $$MainColumns, S as SITE_CONFIG } from '../chunks/seo_C7GlaQdg.mjs';
export { renderers } from '../renderers.mjs';

const $$Legal = createComponent(async ($$result, $$props, $$slots) => {
  const CMS_URL = "http://cms:3000";
  let siteLanguage = "ru";
  try {
    const res = await fetch(`${CMS_URL}/api/globals/site-settings`);
    if (res.ok) {
      const data = await res.json();
      siteLanguage = data.currentLanguage === "en" ? "en" : "ru";
    }
  } catch (e) {
  }
  let legalContent = "";
  try {
    const res = await fetch(`${CMS_URL}/api/globals/legal-page`);
    if (res.ok) {
      const data = await res.json();
      legalContent = siteLanguage === "en" ? data.contentEn || "" : data.contentRu || "";
    }
  } catch (e) {
    legalContent = "";
  }
  const pageTitle = siteLanguage === "en" ? "Legal information" : "Правовая информация";
  const pageDescription = siteLanguage === "en" ? `Legal information and policies of ${SITE_CONFIG.brandName}.` : `Правовая информация и условия использования сайта ${SITE_CONFIG.brandName}.`;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": pageDescription }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "MainColumns", $$MainColumns, {}, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<article class="max-w-3xl mx-auto py-8 lg:py-10"> <h1 class="text-3xl md:text-4xl font-bold text-foreground mb-6">${pageTitle}</h1> ${legalContent ? renderTemplate`<div class="prose article-prose max-w-none">${unescapeHTML(legalContent)}</div>` : renderTemplate`<p class="text-sm text-muted"> ${siteLanguage === "en" ? "No legal information has been published yet." : "Правовая информация пока не опубликована."} </p>`} </article> ` })} ` })}`;
}, "/home/ilia/newsportal_clean/apps/web/src/pages/legal.astro", void 0);
const $$file = "/home/ilia/newsportal_clean/apps/web/src/pages/legal.astro";
const $$url = "/legal";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Legal,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
