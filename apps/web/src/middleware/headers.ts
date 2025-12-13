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
  ],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "https://*.google.com", "https://*.yandex.ru"],
  "frame-src": ["'self'", "https://*.googlesyndication.com", "https://*.doubleclick.net", "https://yandex.ru"],
  "connect-src": ["'self'", "https://*.google-analytics.com", "https://mc.yandex.ru"],
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

  // Set caching headers for static assets and pages
  const contentType = response.headers.get('Content-Type');
  if (contentType && (contentType.includes('text/html') || contentType.includes('application/javascript') || contentType.includes('text/css'))) {
    response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=31536000, stale-while-revalidate=60');
  }

  return response;
});
