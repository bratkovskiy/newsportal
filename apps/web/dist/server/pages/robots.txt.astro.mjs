import { g as getSiteUrl } from '../chunks/siteUrl_CyUCBcWv.mjs';
export { renderers } from '../renderers.mjs';

const CMS_URL = "http://cms:3000";
async function getRobotsContent(siteUrl) {
  const sitemapLine = `Sitemap: ${new URL("sitemap.xml", siteUrl).href}`;
  const defaultContent = `User-agent: *
Allow: /

${sitemapLine}`;
  try {
    const res = await fetch(`${CMS_URL}/api/globals/robots`);
    if (!res.ok) {
      return defaultContent;
    }
    const data = await res.json();
    const content = data?.content;
    if (typeof content === "string" && content.trim().length > 0) {
      const fixed = content.replace(/Sitemap:\s*https?:\/\/localhost[^\n]*/gi, sitemapLine);
      if (!/^sitemap:/im.test(fixed)) {
        return `${fixed.trimEnd()}

${sitemapLine}`;
      }
      return fixed;
    }
    return defaultContent;
  } catch (e) {
    return defaultContent;
  }
}
const GET = async ({ request }) => {
  const siteUrl = getSiteUrl(request);
  const robotsTxt = await getRobotsContent(siteUrl);
  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
