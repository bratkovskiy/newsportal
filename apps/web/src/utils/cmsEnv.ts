const DEV_PUBLIC_CMS_FALLBACK = 'http://localhost:3000';
const DEV_PLACEHOLDER_FALLBACK = `${DEV_PUBLIC_CMS_FALLBACK}/api/media/file/placeholder-1.jpg`;

type CmsEnv = {
  CMS_URL?: string;
  PUBLIC_CMS_URL?: string;
  PUBLIC_PLACEHOLDER_URL?: string;
  MODE?: 'development' | 'production' | 'test';
};

const env = ((import.meta as { env?: CmsEnv }).env ?? {}) as CmsEnv;

function stripTrailingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function resolvePublicCmsUrl(): string {
  const publicCmsUrl = env.PUBLIC_CMS_URL;
  if (publicCmsUrl) {
    return publicCmsUrl;
  }

  if (env.MODE === 'development') {
    console.warn('PUBLIC_CMS_URL is not defined. Falling back to http://localhost:3000 for development.');
    return DEV_PUBLIC_CMS_FALLBACK;
  }

  throw new Error('PUBLIC_CMS_URL is not defined. Set PUBLIC_CMS_URL in the environment for production builds.');
}

export function getCmsEnv() {
  const cmsUrl = env.CMS_URL || 'http://cms:3000';
  const publicCmsUrlRaw = resolvePublicCmsUrl();
  const normalizedPublicCmsUrl = stripTrailingSlash(publicCmsUrlRaw);
  const placeholderImageUrl =
    env.PUBLIC_PLACEHOLDER_URL ||
    DEV_PLACEHOLDER_FALLBACK.replace(DEV_PUBLIC_CMS_FALLBACK, normalizedPublicCmsUrl);

  let publicCmsOrigin = normalizedPublicCmsUrl;
  try {
    publicCmsOrigin = new URL(normalizedPublicCmsUrl).origin;
  } catch {
    // keep as-is if parsing fails
  }

  return {
    cmsUrl,
    publicCmsUrl: normalizedPublicCmsUrl,
    placeholderImageUrl,
    publicCmsOrigin,
  };
}
