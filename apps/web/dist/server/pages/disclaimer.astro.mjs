/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CMM1Egp5.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BwCxMai_.mjs';
export { renderers } from '../renderers.mjs';

const $$Disclaimer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Disclaimer & Privacy Policy", "description": "Disclaimer and privacy policy for FashionSite." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-8"> <div class="max-w-2xl mx-auto prose prose-lg"> <h1>Disclaimer & Privacy Policy</h1> <h2>Disclaimer</h2> <p>All the information on this website is published in good faith and for general information purpose only. FashionSite does not make any warranties about the completeness, reliability and accuracy of this information.</p> <h2>Privacy Policy</h2> <p>Your privacy is important to us. It is FashionSite's policy to respect your privacy regarding any information we may collect from you across our website.</p> <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p> <h2>Cookie Policy</h2> <p>We use cookies to help improve your experience of our website. This cookie policy is part of our privacy policy, and covers the use of cookies between your device and our site.</p> </div> </div> ` })}`;
}, "/home/ilia/newsportal_clean/apps/web/src/pages/disclaimer.astro", void 0);

const $$file = "/home/ilia/newsportal_clean/apps/web/src/pages/disclaimer.astro";
const $$url = "/disclaimer";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Disclaimer,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
