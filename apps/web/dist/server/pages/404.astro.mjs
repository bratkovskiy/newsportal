/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CMM1Egp5.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BwCxMai_.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "404: Not Found", "description": "The page you were looking for could not be found." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-16 text-center"> <h1 class="text-4xl font-bold text-accent">404</h1> <h2 class="text-2xl font-semibold text-foreground mt-4">Page Not Found</h2> <p class="text-muted mt-2">Sorry, we couldn't find the page you're looking for.</p> <a href="/" class="inline-block bg-accent text-white px-6 py-2 rounded-button mt-8 hover:opacity-90 transition-opacity">Go Home</a> </div> ` })}`;
}, "/home/ilia/newsportal_clean/apps/web/src/pages/404.astro", void 0);

const $$file = "/home/ilia/newsportal_clean/apps/web/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
