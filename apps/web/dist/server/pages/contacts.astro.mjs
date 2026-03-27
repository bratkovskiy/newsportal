/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from '../chunks/astro/server_CMM1Egp5.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BwCxMai_.mjs';
import { $ as $$MainColumns, S as SITE_CONFIG } from '../chunks/seo_C7GlaQdg.mjs';
export { renderers } from '../renderers.mjs';

const $$Contacts = createComponent(async ($$result, $$props, $$slots) => {
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
  let contactsContent = "";
  try {
    const res = await fetch(`${CMS_URL}/api/globals/contacts-page`);
    if (res.ok) {
      const data = await res.json();
      contactsContent = siteLanguage === "en" ? data.contentEn || "" : data.contentRu || "";
    }
  } catch (e) {
    contactsContent = "";
  }
  const pageTitle = siteLanguage === "en" ? "Contacts" : "Контакты";
  const pageDescription = siteLanguage === "en" ? `Contacts and feedback for ${SITE_CONFIG.brandName}.` : `Контактная информация и способы связи с редакцией ${SITE_CONFIG.brandName}.`;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": pageDescription }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "MainColumns", $$MainColumns, {}, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<article class="max-w-3xl mx-auto py-8 lg:py-10"> <h1 class="text-3xl md:text-4xl font-bold text-foreground mb-6">${pageTitle}</h1> ${contactsContent ? renderTemplate`<div class="prose article-prose max-w-none">${unescapeHTML(contactsContent)}</div>` : renderTemplate`<p class="text-sm text-muted"> ${siteLanguage === "en" ? "Contacts page has not been published yet." : "Страница «Контакты» пока не опубликована."} </p>`} </article> ` })} ` })}`;
}, "/home/ilia/newsportal_clean/apps/web/src/pages/contacts.astro", void 0);
const $$file = "/home/ilia/newsportal_clean/apps/web/src/pages/contacts.astro";
const $$url = "/contacts";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contacts,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
