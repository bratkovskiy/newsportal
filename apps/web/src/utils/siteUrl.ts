export function getSiteUrl(request: Request): string {
  const envSite = process.env.SITE || (import.meta as any).env?.SITE;
  if (envSite && !envSite.includes('localhost')) {
    return envSite.replace(/\/$/, '');
  }
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const host = request.headers.get('host') || 'modareview.com';
  return `${proto}://${host}`;
}
