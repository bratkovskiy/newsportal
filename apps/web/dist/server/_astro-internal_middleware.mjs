import { d as defineMiddleware, s as sequence } from './chunks/index_DBiL6Bsg.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_o2GHimJ7.mjs';
import '@astrojs/internal-helpers/path';
import 'cookie';

const cspDirectives = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    // Often required for analytics/ads, review if possible
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://ssl.google-analytics.com",
    "https://*.googlesyndication.com",
    "https://*.doubleclick.net",
    "https://yandex.ru",
    "https://*.yandex.ru",
    "https://*.yandex.net",
    "https://yastatic.net",
    "https://*.yastatic.net"
  ],
  "style-src": [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com",
    "https://yastatic.net",
    "https://*.yastatic.net"
  ],
  "img-src": [
    "'self'",
    "data:",
    "https:",
    "http://localhost:3000",
    "http://cms:3000"
  ],
  "font-src": [
    "'self'",
    "data:",
    "https://fonts.gstatic.com",
    "https://yastatic.net",
    "https://*.yastatic.net"
  ],
  "frame-src": [
    "'self'",
    "https://*.googlesyndication.com",
    "https://*.doubleclick.net",
    "https://yandex.ru",
    "https://*.yandex.ru"
  ],
  "connect-src": [
    "'self'",
    "http://localhost:3000",
    "http://cms:3000",
    "https://www.google-analytics.com",
    "https://*.google-analytics.com",
    "https://analytics.google.com",
    "https://stats.g.doubleclick.net",
    "https://mc.yandex.ru",
    "https://yastatic.net",
    "https://*.yastatic.net"
  ],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"]
};
const csp = Object.entries(cspDirectives).map(([key, value]) => `${key} ${value.join(" ")}`).join("; ");
const onRequest$1 = defineMiddleware(async (context, next) => {
  const response = await next();
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("Permissions-Policy", "geolocation=(), camera=(), microphone=(), interest-cohort=()");
  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.includes("text/html")) {
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  } else if (contentType && (contentType.includes("application/javascript") || contentType.includes("text/css"))) {
    response.headers.set("Cache-Control", "public, max-age=0, s-maxage=31536000, stale-while-revalidate=60");
  }
  return response;
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
