import { defineMiddleware } from 'astro:middleware';

// Define your Content Security Policy
const cspDirectives = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'", // Often required for analytics/ads, review if possible
    "https://*.googlesyndication.com",
    "https://*.doubleclick.net",
    "https://yandex.ru",
    "https://*.yandex.ru",
    "https://*.yandex.net",
    "https://yastatic.net",
    "https://*.yastatic.net",
  ],
  "style-src": [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com",
    "https://yastatic.net",
    "https://*.yastatic.net",
  ],
  "img-src": [
    "'self'",
    "data:",
    "https:",
    "http://localhost:3000",
    "http://cms:3000",
  ],
  "font-src": [
    "'self'",
    "data:",
    "https://fonts.gstatic.com",
    "https://yastatic.net",
    "https://*.yastatic.net",
  ],
  "frame-src": [
    "'self'",
    "https://*.googlesyndication.com",
    "https://*.doubleclick.net",
    "https://yandex.ru",
    "https://*.yandex.ru",
  ],
  "connect-src": [
    "'self'",
    "http://localhost:3000",
    "http://cms:3000",
    "https://*.google-analytics.com",
    "https://mc.yandex.ru",
    "https://yastatic.net",
    "https://*.yastatic.net",
  ],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
};

const csp = Object.entries(cspDirectives)
  .map(([key, value]) => `${key} ${value.join(' ')}`)
  .join('; ');

// This middleware function will be executed for every request
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Set security headers
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=(), interest-cohort=()');

  // Set caching headers for static assets and pages
  const contentType = response.headers.get('Content-Type');
  if (contentType && (contentType.includes('text/html') || contentType.includes('application/javascript') || contentType.includes('text/css'))) {
    response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=31536000, stale-while-revalidate=60');
  }

  return response;
});
