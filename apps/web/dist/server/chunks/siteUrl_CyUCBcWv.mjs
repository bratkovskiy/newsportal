function getSiteUrl(request) {
  const proto = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host") || "localhost:4321";
  return `${proto}://${host}`;
}

export { getSiteUrl as g };
