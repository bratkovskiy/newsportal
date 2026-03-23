const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "PUBLIC_CMS_URL": "http://localhost:3000", "PUBLIC_PLACEHOLDER_URL": "http://localhost:3000/api/media/file/placeholder-1.jpg", "SITE": undefined, "SSR": true};
const DEV_PUBLIC_CMS_FALLBACK = "http://localhost:3000";
const DEV_PLACEHOLDER_FALLBACK = `${DEV_PUBLIC_CMS_FALLBACK}/api/media/file/placeholder-1.jpg`;
const env = Object.assign(__vite_import_meta_env__, { CMS_URL: "http://cms:3000", _: process.env._ }) ?? {};
function stripTrailingSlash(url) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}
function resolvePublicCmsUrl() {
  const publicCmsUrl = env.PUBLIC_CMS_URL;
  if (publicCmsUrl) {
    return publicCmsUrl;
  }
  if (env.MODE === "development") {
    console.warn("PUBLIC_CMS_URL is not defined. Falling back to http://localhost:3000 for development.");
    return DEV_PUBLIC_CMS_FALLBACK;
  }
  throw new Error("PUBLIC_CMS_URL is not defined. Set PUBLIC_CMS_URL in the environment for production builds.");
}
function getCmsEnv() {
  const cmsUrl = env.CMS_URL || "http://cms:3000";
  const publicCmsUrlRaw = resolvePublicCmsUrl();
  const normalizedPublicCmsUrl = stripTrailingSlash(publicCmsUrlRaw);
  const placeholderImageUrl = env.PUBLIC_PLACEHOLDER_URL || DEV_PLACEHOLDER_FALLBACK.replace(DEV_PUBLIC_CMS_FALLBACK, normalizedPublicCmsUrl);
  let publicCmsOrigin = normalizedPublicCmsUrl;
  try {
    publicCmsOrigin = new URL(normalizedPublicCmsUrl).origin;
  } catch {
  }
  return {
    cmsUrl,
    publicCmsUrl: normalizedPublicCmsUrl,
    placeholderImageUrl,
    publicCmsOrigin
  };
}

export { getCmsEnv as g };
