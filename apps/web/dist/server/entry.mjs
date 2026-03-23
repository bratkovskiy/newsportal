import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Bc44FTjX.mjs';
import { manifest } from './manifest_BetlpVTH.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/api/frontend/articles.astro.mjs');
const _page4 = () => import('./pages/api/revalidate.astro.mjs');
const _page5 = () => import('./pages/article/_---slug_.astro.mjs');
const _page6 = () => import('./pages/categories/_slug_.astro.mjs');
const _page7 = () => import('./pages/categories.astro.mjs');
const _page8 = () => import('./pages/contacts.astro.mjs');
const _page9 = () => import('./pages/cookies-policy.astro.mjs');
const _page10 = () => import('./pages/disclaimer.astro.mjs');
const _page11 = () => import('./pages/legal.astro.mjs');
const _page12 = () => import('./pages/privacy-policy.astro.mjs');
const _page13 = () => import('./pages/robots.txt.astro.mjs');
const _page14 = () => import('./pages/search.astro.mjs');
const _page15 = () => import('./pages/sitemap.xml.astro.mjs');
const _page16 = () => import('./pages/tags/_slug_.astro.mjs');
const _page17 = () => import('./pages/tags.astro.mjs');
const _page18 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/api/frontend/articles.ts", _page3],
    ["src/pages/api/revalidate.ts", _page4],
    ["src/pages/article/[...slug].astro", _page5],
    ["src/pages/categories/[slug].astro", _page6],
    ["src/pages/categories/index.astro", _page7],
    ["src/pages/contacts.astro", _page8],
    ["src/pages/cookies-policy.astro", _page9],
    ["src/pages/disclaimer.astro", _page10],
    ["src/pages/legal.astro", _page11],
    ["src/pages/privacy-policy.astro", _page12],
    ["src/pages/robots.txt.ts", _page13],
    ["src/pages/search.astro", _page14],
    ["src/pages/sitemap.xml.ts", _page15],
    ["src/pages/tags/[slug].astro", _page16],
    ["src/pages/tags/index.astro", _page17],
    ["src/pages/index.astro", _page18]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///home/ilia/newsportal_clean/apps/web/dist/client/",
    "server": "file:///home/ilia/newsportal_clean/apps/web/dist/server/",
    "host": "0.0.0.0",
    "port": 4321,
    "assets": "_astro"
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
{
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
