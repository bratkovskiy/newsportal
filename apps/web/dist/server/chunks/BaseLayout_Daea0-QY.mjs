import { c as createComponent, b as createAstro, a as renderTemplate, d as renderSlot, e as addAttribute, u as unescapeHTML, g as renderHead, r as renderComponent, m as maybeRenderHead, F as Fragment, f as defineScriptVars } from './astro/server_CMM1Egp5.mjs';
import 'kleur/colors';
/* empty css                          */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a, _b, _c;
const $$Astro = createAstro();
const $$BaseLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title, description } = Astro2.props;
  const CMS_URL = "http://cms:3000";
  let menuCategories = [];
  try {
    const response = await fetch(`${CMS_URL}/api/categories?limit=10&sort=name`);
    if (response.ok) {
      const data = await response.json();
      menuCategories = (data.docs || []).map((cat) => ({
        name: cat.name,
        slug: cat.slug
      }));
    }
  } catch (error) {
    console.error("Failed to fetch categories for menu:", error);
  }
  let analyticsSettings = null;
  try {
    const res = await fetch(`${CMS_URL}/api/globals/analytics-settings`);
    if (res.ok) {
      const data = await res.json();
      analyticsSettings = data;
      if (analyticsSettings?.googleAnalytics?.measurementId) {
        const measurementId = analyticsSettings.googleAnalytics.measurementId;
        if (!/^G-[A-Z0-9]+$/.test(measurementId)) {
          console.error("Invalid GA4 Measurement ID format:", measurementId);
          analyticsSettings.googleAnalytics.measurementId = void 0;
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch analytics settings:", error);
  }
  let siteSettings = null;
  try {
    const res = await fetch(`${CMS_URL}/api/globals/site-settings`);
    if (res.ok) {
      const data = await res.json();
      siteSettings = data;
    }
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
  }
  const siteNameRaw = siteSettings?.siteName || "LADY.NEWS";
  const siteNameText = siteNameRaw.replace(/<[^>]*>/g, "");
  const currentLanguage = siteSettings?.currentLanguage === "en" ? "en" : "ru";
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const footerTextSuffixRu = siteSettings?.footer?.textRu || `${siteNameText}. Все права защищены.`;
  const footerTextSuffixEn = siteSettings?.footer?.textEn || `${siteNameText}. All rights reserved.`;
  const footerText = currentLanguage === "en" ? `${currentYear} ${footerTextSuffixEn}` : `${currentYear} ${footerTextSuffixRu}`;
  return renderTemplate(_c || (_c = __template(["<html", '> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', `><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preconnect" href="https://static.piter.tv" crossorigin><link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@700&display=swap"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@700&display=swap" media="print" onload="this.media='all'">`, '<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@700&display=swap"></noscript><title>', '</title><meta name="description"', ">", "", "", "", "", "", "", '</head> <body class="bg-background text-foreground font-sans antialiased"> <header class="border-b border-border bg-background sticky top-0 z-50"> <div class="container mx-auto px-4"> <div class="h-16 lg:h-20 flex items-center"> <div class="flex items-center gap-6 w-full"> <a href="/" class="site-logo-header text-foreground"> <span class="site-logo-header-main">', "</span> ", ' </a> <nav class="hidden md:flex items-center gap-6 text-xs font-medium uppercase tracking-[0.18em] text-muted flex-1 justify-center"> <a href="/" class="hover:text-accent transition-colors">Главная</a> ', ' <a href="/tags" class="hover:text-accent transition-colors">Теги</a> </nav> <div class="ml-auto flex items-center gap-3"> <button type="button" class="mobile-burger md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-border text-foreground hover:text-accent transition-colors" aria-expanded="false" aria-controls="mobile-menu" data-mobile-menu-toggle> <span class="sr-only">Открыть меню</span> <span class="mobile-burger-icon flex flex-col items-center justify-center gap-1 w-5 h-5"> <span class="mobile-burger-line block w-full h-0.5 bg-current rounded-full"></span> <span class="mobile-burger-line block w-full h-0.5 bg-current rounded-full"></span> <span class="mobile-burger-line block w-full h-0.5 bg-current rounded-full"></span> </span> </button> </div> </div> <div id="mobile-menu" class="md:hidden hidden fixed inset-x-0 top-16 bottom-0 z-40 border-t border-border bg-background text-xs font-medium uppercase tracking-[0.18em] text-muted"> <nav class="flex flex-col gap-4 items-center justify-start pt-6 text-center"> <a href="/" class="hover:text-accent transition-colors">Главная</a> ', ' <a href="/tags" class="hover:text-accent transition-colors">Теги</a> </nav> </div> </div> </div></header> <main> ', ' </main> <footer class="border-t border-border mt-12 py-8"> <div class="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted"> <div class="font-semibold tracking-[0.18em] uppercase text-muted"> ', ' </div> <div class="flex flex-col items-center md:items-end gap-1"> <a href="/legal" class="hover:text-accent transition-colors"> ', ' </a> <a href="/privacy-policy" class="hover:text-accent transition-colors"> ', ' </a> <a href="/cookies-policy" class="hover:text-accent transition-colors"> ', ' </a> <a href="/contacts" class="hover:text-accent transition-colors"> ', ' </a> <p class="text-center md:text-right">\n&copy; ', " </p> </div> </div> </footer> <script>\n      if (typeof window !== 'undefined') {\n        window.addEventListener('DOMContentLoaded', function () {\n          var toggle = document.querySelector('[data-mobile-menu-toggle]');\n          var menu = document.getElementById('mobile-menu');\n          if (!toggle || !menu) return;\n\n          toggle.addEventListener('click', function () {\n            var isHidden = menu.classList.contains('hidden');\n            if (isHidden) {\n              menu.classList.remove('hidden');\n              toggle.setAttribute('aria-expanded', 'true');\n              toggle.classList.add('is-open');\n              document.body.classList.add('overflow-hidden');\n            } else {\n              menu.classList.add('hidden');\n              toggle.setAttribute('aria-expanded', 'false');\n              toggle.classList.remove('is-open');\n              document.body.classList.remove('overflow-hidden');\n            }\n          });\n        });\n      }\n    </script> </body> </html>"])), addAttribute(currentLanguage === "en" ? "en" : "ru", "lang"), addAttribute(Astro2.generator, "content"), maybeRenderHead(), title, addAttribute(description, "content"), analyticsSettings?.webmaster?.googleVerification && renderTemplate`<meta name="google-site-verification"${addAttribute(analyticsSettings.webmaster.googleVerification, "content")}>`, analyticsSettings?.webmaster?.yandexVerification && renderTemplate`<meta name="yandex-verification"${addAttribute(analyticsSettings.webmaster.yandexVerification, "content")}>`, analyticsSettings?.googleAnalytics?.enabled && analyticsSettings.googleAnalytics.measurementId && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["<script async", "></script><script>(function(){", "\n            window.dataLayer = window.dataLayer || [];\n            function gtag(){dataLayer.push(arguments);}\n            gtag('js', new Date());\n            gtag('config', measurementId);\n          })();</script>"])), addAttribute(`https://www.googletagmanager.com/gtag/js?id=${analyticsSettings.googleAnalytics.measurementId}`, "src"), defineScriptVars({ measurementId: analyticsSettings.googleAnalytics.measurementId })) })}`, analyticsSettings?.yandexMetrica?.enabled && analyticsSettings.yandexMetrica.counterId && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate(_b || (_b = __template(["<script>(function(){", "\n            (function(m,e,t,r,i,k,a){\n              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};\n              m[i].l=1*new Date();\n              k=e.createElement(t),a=e.getElementsByTagName(t)[0];\n              k.async=1;k.src=r;a.parentNode.insertBefore(k,a);\n            })(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');\n\n            ym(ymCounterId, 'init', {\n              clickmap:true,\n              trackLinks:true,\n              accurateTrackBounce:true,\n              webvisor:true\n            });\n          })();</script><noscript><div><img", ' style="position:absolute; left:-9999px;" alt=""></div></noscript>'])), defineScriptVars({ ymCounterId: analyticsSettings.yandexMetrica.counterId }), addAttribute(`https://mc.yandex.ru/watch/${analyticsSettings.yandexMetrica.counterId}`, "src")) })}`, analyticsSettings?.customHeadHtml && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(analyticsSettings.customHeadHtml)}` })}`, siteSettings?.headerLogoCss && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(`<style>${siteSettings.headerLogoCss}</style>`)}` })}`, renderHead(), unescapeHTML(siteNameRaw), siteSettings?.headerTagline && renderTemplate`<span class="site-logo-header-subline">${siteSettings.headerTagline}</span>`, menuCategories.map((category) => renderTemplate`<a${addAttribute(`/categories/${category.slug}`, "href")} class="hover:text-accent transition-colors"> ${category.name} </a>`), menuCategories.map((category) => renderTemplate`<a${addAttribute(`/categories/${category.slug}`, "href")} class="hover:text-accent transition-colors"> ${category.name} </a>`), renderSlot($$result, $$slots["default"]), siteNameText, currentLanguage === "en" ? "Legal information" : "Правовая информация", currentLanguage === "en" ? "Privacy Policy" : "Политика конфиденциальности", currentLanguage === "en" ? "Cookies Policy" : "Политика использования файлов Cookie", currentLanguage === "en" ? "Contacts" : "Контакты", footerText);
}, "/home/ilia/newsportal_clean/apps/web/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
