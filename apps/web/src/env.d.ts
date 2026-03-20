/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly CMS_URL?: string;
  readonly PUBLIC_CMS_URL?: string;
  readonly PUBLIC_PLACEHOLDER_URL?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly MODE?: 'development' | 'production' | 'test';
  readonly DEV?: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
