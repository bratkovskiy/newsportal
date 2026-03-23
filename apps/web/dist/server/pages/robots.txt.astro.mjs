export { renderers } from '../renderers.mjs';

const site = "http://localhost:4321";
const CMS_URL = "http://cms:3000";
async function getRobotsContent() {
  const defaultContent = `User-agent: *
Allow: /

Sitemap: ${new URL("sitemap.xml", site).href}`;
  try {
    const res = await fetch(`${CMS_URL}/api/globals/robots`);
    if (!res.ok) {
      return defaultContent;
    }
    const data = await res.json();
    const content = data?.content;
    if (typeof content === "string" && content.trim().length > 0) {
      return content;
    }
    return defaultContent;
  } catch (e) {
    return defaultContent;
  }
}
const GET = async () => {
  const robotsTxt = await getRobotsContent();
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
