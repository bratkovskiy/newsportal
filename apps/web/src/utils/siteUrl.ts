// Resolves the public site URL from env or request headers (for nginx proxy setups)
export function getSiteUrl(request: Request): string {
  const envSite = (import.meta as any).env?.SITE as string | undefined;
  if (envSite && envSite !== 'http://localhost:4321') {
    return envSite.replace(/\/$/, '');
  }

  // Use X-Forwarded-Proto + Host headers set by nginx
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const host = request.headers.get('host') || 'localhost:4321';
  return `${proto}://${host}`;
}
