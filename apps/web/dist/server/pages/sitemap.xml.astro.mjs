export { renderers } from '../renderers.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "PUBLIC_CMS_URL": "http://localhost:3000", "PUBLIC_PLACEHOLDER_URL": "http://localhost:3000/api/media/file/placeholder-1.jpg", "SITE": undefined, "SSR": true};
const env = Object.assign(__vite_import_meta_env__, { CMS_URL: "http://cms:3000", SITE: "http://localhost:4321", _: process.env._ }) || {};
const site = env.PUBLIC_SITE_URL || env.SITE || "http://localhost:4321";
const CMS_URL = env.CMS_URL || "http://cms:3000";
const SITEMAP_LIMIT = 5e4;
const generateSitemap = (pageEntries) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageEntries.map(
    (page) => `  <url>
    <loc>${new URL(page.url, site).href}</loc>
    <lastmod>${page.lastmod.toISOString()}</lastmod>
  </url>`
  ).join("\n")}
</urlset>`;
  return sitemap;
};
const generateSitemapIndex = (chunks) => {
  const now = /* @__PURE__ */ new Date();
  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunks.map((chunk, idx) => {
    const lastmod = chunk.reduce((acc, entry) => {
      if (!acc) return entry.lastmod;
      return entry.lastmod > acc ? entry.lastmod : acc;
    }, null) ?? now;
    const locUrl = new URL(`/sitemap.xml?page=${idx + 1}`, site).href;
    return `  <sitemap>
    <loc>${locUrl}</loc>
    <lastmod>${lastmod.toISOString()}</lastmod>
  </sitemap>`;
  }).join("\n")}
</sitemapindex>`;
  return indexXml;
};
const addEntry = (entries, url, lastmod) => {
  if (!url) return;
  entries.push({ url, lastmod: lastmod ?? /* @__PURE__ */ new Date() });
};
async function fetchPaginatedDocs(path, baseParams) {
  const all = [];
  let page = 1;
  const limit = Number(baseParams.limit || "100");
  const MAX_PAGES = 1e3;
  while (page <= MAX_PAGES) {
    const url = new URL(path, CMS_URL);
    for (const [key, value] of Object.entries(baseParams)) {
      url.searchParams.set(key, value);
    }
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));
    const res = await fetch(url.toString());
    if (!res.ok) break;
    const data = await res.json();
    const docs = Array.isArray(data?.docs) ? data.docs : [];
    if (!docs.length) break;
    all.push(...docs);
    const totalPages = typeof data.totalPages === "number" ? data.totalPages : page;
    if (page >= totalPages) break;
    page += 1;
  }
  return all;
}
function buildArticlePath(article) {
  const slug = article?.slug ? String(article.slug) : "";
  const id = article?.id != null ? String(article.id) : "";
  if (slug && id) return `/article/${slug}-${id}.html`;
  if (slug) return `/article/${slug}`;
  if (id) return `/article/${id}`;
  return "";
}
const GET = async ({ request }) => {
  const entries = [];
  const now = /* @__PURE__ */ new Date();
  addEntry(entries, "/");
  addEntry(entries, "/about");
  addEntry(entries, "/disclaimer");
  addEntry(entries, "/legal");
  addEntry(entries, "/privacy-policy");
  addEntry(entries, "/cookies-policy");
  addEntry(entries, "/contacts");
  addEntry(entries, "/search");
  addEntry(entries, "/tags");
  addEntry(entries, "/categories");
  try {
    const categories = await fetchPaginatedDocs("/api/categories", { limit: "100" });
    for (const cat of categories) {
      if (!cat?.slug) continue;
      const lastmodStr = cat.updatedAt || cat.createdAt;
      const lastmod = lastmodStr ? new Date(lastmodStr) : now;
      addEntry(entries, `/categories/${cat.slug}`, lastmod);
      if (entries.length >= SITEMAP_LIMIT) break;
    }
  } catch (error) {
    console.error("Failed to fetch categories for sitemap", error);
  }
  try {
    const tags = await fetchPaginatedDocs("/api/tags", { limit: "100" });
    for (const tag of tags) {
      if (!tag?.slug) continue;
      const lastmodStr = tag.updatedAt || tag.createdAt;
      const lastmod = lastmodStr ? new Date(lastmodStr) : now;
      addEntry(entries, `/tags/${tag.slug}`, lastmod);
      if (entries.length >= SITEMAP_LIMIT) break;
    }
  } catch (error) {
    console.error("Failed to fetch tags for sitemap", error);
  }
  try {
    const articles = await fetchPaginatedDocs("/api/articles", {
      "where[status][equals]": "published",
      sort: "-publishedDate",
      limit: "100"
    });
    for (const article of articles) {
      if (article.noindex) continue;
      const loc = buildArticlePath(article);
      if (!loc) continue;
      const lastmodStr = article.updatedAt || article.publishedDate || article.createdAt;
      const lastmod = lastmodStr ? new Date(lastmodStr) : now;
      addEntry(entries, loc, lastmod);
    }
  } catch (error) {
    console.error("Failed to fetch articles for sitemap", error);
  }
  const total = entries.length;
  if (total === 0) {
    const fallback = generateSitemap([{ url: "/", lastmod: /* @__PURE__ */ new Date() }]);
    return new Response(fallback, {
      headers: {
        "Content-Type": "application/xml"
      }
    });
  }
  const totalPages = Math.ceil(total / SITEMAP_LIMIT);
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page");
  const page = pageParam ? Number(pageParam) : NaN;
  if (!pageParam || !Number.isFinite(page) || page < 1 || page > totalPages) {
    if (totalPages === 1) {
      const sitemapContent2 = generateSitemap(entries);
      return new Response(sitemapContent2, {
        headers: {
          "Content-Type": "application/xml"
        }
      });
    }
    const chunks = [];
    for (let i = 0; i < totalPages; i++) {
      const start2 = i * SITEMAP_LIMIT;
      const end2 = start2 + SITEMAP_LIMIT;
      chunks.push(entries.slice(start2, end2));
    }
    const indexContent = generateSitemapIndex(chunks);
    return new Response(indexContent, {
      headers: {
        "Content-Type": "application/xml"
      }
    });
  }
  const start = (page - 1) * SITEMAP_LIMIT;
  const end = start + SITEMAP_LIMIT;
  const pageEntries = entries.slice(start, end);
  const sitemapContent = generateSitemap(pageEntries);
  return new Response(sitemapContent, {
    headers: {
      "Content-Type": "application/xml"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
