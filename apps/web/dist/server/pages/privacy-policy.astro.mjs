/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from '../chunks/astro/server_CMM1Egp5.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_Daea0-QY.mjs';
import { $ as $$MainColumns, S as SITE_CONFIG } from '../chunks/seo_Dd-zSdmL.mjs';
export { renderers } from '../renderers.mjs';

const $$PrivacyPolicy = createComponent(async ($$result, $$props, $$slots) => {
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
  let privacyContent = "";
  try {
    const res = await fetch(`${CMS_URL}/api/globals/privacy-page`);
    if (res.ok) {
      const data = await res.json();
      privacyContent = siteLanguage === "en" ? data.contentEn || "" : data.contentRu || "";
    }
  } catch (e) {
    privacyContent = "";
  }
  const pageTitle = siteLanguage === "en" ? "Privacy Policy" : "Политика конфиденциальности";
  const pageDescription = siteLanguage === "en" ? `Privacy Policy of ${SITE_CONFIG.brandName}.` : `Политика конфиденциальности и обработка персональных данных на сайте ${SITE_CONFIG.brandName}.`;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": pageDescription }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "MainColumns", $$MainColumns, {}, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<article class="max-w-3xl mx-auto py-8 lg:py-10"> <h1 class="text-3xl md:text-4xl font-bold text-foreground mb-6">${pageTitle}</h1> ${privacyContent ? renderTemplate`<div class="prose article-prose max-w-none">${unescapeHTML(privacyContent)}</div>` : renderTemplate`<p class="text-sm text-muted"> ${siteLanguage === "en" ? "Privacy Policy has not been published yet." : "Политика конфиденциальности пока не опубликована."} </p>`} </article> ` })} ` })}`;
}, "/home/ilia/newsportal_clean/apps/web/src/pages/privacy-policy.astro", void 0);
const $$file = "/home/ilia/newsportal_clean/apps/web/src/pages/privacy-policy.astro";
const $$url = "/privacy-policy";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$PrivacyPolicy,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
