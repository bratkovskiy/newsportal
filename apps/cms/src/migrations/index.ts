import * as migration_2025-12-08-01-add-feeds-import-fields from './2025-12-08-01-add-feeds-import-fields';
import * as migration_2025-12-08-02-add-articles-feed-image-url from './2025-12-08-02-add-articles-feed-image-url';
import * as migration_2025-12-08-03-add-articles-version-feed-image-url from './2025-12-08-03-add-articles-version-feed-image-url';
import * as migration_2025-12-10-01-add-feeds-field-mapping from './2025-12-10-01-add-feeds-field-mapping';
import * as migration_2025-12-10-02-add-categories-fields from './2025-12-10-02-add-categories-fields';
import * as migration_2025-12-10-03-add-article-view-count from './2025-12-10-03-add-article-view-count';
import * as migration_2025-12-10-04-add-article-versions-view-count from './2025-12-10-04-add-article-versions-view-count';
import * as migration_2025-12-11-01-add-tags-fields from './2025-12-11-01-add-tags-fields';
import * as migration_2025-12-12-01-add-categories-show-on-home from './2025-12-12-01-add-categories-show-on-home';
import * as migration_2025-12-12-02-add-articles-home-flags from './2025-12-12-02-add-articles-home-flags';
import * as migration_2025-12-12-03-add-article-versions-home-flags from './2025-12-12-03-add-article-versions-home-flags';
import * as migration_2025-12-12-04-add-analytics-settings-global from './2025-12-12-04-add-analytics-settings-global';
import * as migration_2025-12-12-05-add-robots-global from './2025-12-12-05-add-robots-global';
import * as migration_2025-12-12-06-add-site-settings-global from './2025-12-12-06-add-site-settings-global';
import * as migration_2025-12-12-07-add-legal-page-global from './2025-12-12-07-add-legal-page-global';
import * as migration_2025-12-12-08-add-ad-slots from './2025-12-12-08-add-ad-slots';
import * as migration_2025-12-12-09-fix-locked-docs-ad-slots from './2025-12-12-09-fix-locked-docs-ad-slots';
import * as migration_2025-12-12-10-add-analytics-custom-head from './2025-12-12-10-add-analytics-custom-head';
import * as migration_2025-12-12-11-add-ad-slots-usage-hint from './2025-12-12-11-add-ad-slots-usage-hint';
import * as migration_2025-12-13-01-add-site-branding from './2025-12-13-01-add-site-branding';
import * as migration_2025-12-13-02-add-site-header-tagline from './2025-12-13-02-add-site-header-tagline';
import * as migration_2025-12-13-03-add-privacy-page-global from './2025-12-13-03-add-privacy-page-global';
import * as migration_2025-12-13-04-add-cookies-page-global from './2025-12-13-04-add-cookies-page-global';
import * as migration_2025-12-13-05-add-contacts-page-global from './2025-12-13-05-add-contacts-page-global';
import * as migration_2025-12-14-01-add-articles-noindex from './2025-12-14-01-add-articles-noindex';
import * as migration_2025-12-14-02-add-article-versions-noindex from './2025-12-14-02-add-article-versions-noindex';
import * as migration_20260319_100737 from './20260319_100737';

export const migrations = [
  {
    up: migration_2025-12-08-01-add-feeds-import-fields.up,
    down: migration_2025-12-08-01-add-feeds-import-fields.down,
    name: '2025-12-08-01-add-feeds-import-fields',
  },
  {
    up: migration_2025-12-08-02-add-articles-feed-image-url.up,
    down: migration_2025-12-08-02-add-articles-feed-image-url.down,
    name: '2025-12-08-02-add-articles-feed-image-url',
  },
  {
    up: migration_2025-12-08-03-add-articles-version-feed-image-url.up,
    down: migration_2025-12-08-03-add-articles-version-feed-image-url.down,
    name: '2025-12-08-03-add-articles-version-feed-image-url',
  },
  {
    up: migration_2025-12-10-01-add-feeds-field-mapping.up,
    down: migration_2025-12-10-01-add-feeds-field-mapping.down,
    name: '2025-12-10-01-add-feeds-field-mapping',
  },
  {
    up: migration_2025-12-10-02-add-categories-fields.up,
    down: migration_2025-12-10-02-add-categories-fields.down,
    name: '2025-12-10-02-add-categories-fields',
  },
  {
    up: migration_2025-12-10-03-add-article-view-count.up,
    down: migration_2025-12-10-03-add-article-view-count.down,
    name: '2025-12-10-03-add-article-view-count',
  },
  {
    up: migration_2025-12-10-04-add-article-versions-view-count.up,
    down: migration_2025-12-10-04-add-article-versions-view-count.down,
    name: '2025-12-10-04-add-article-versions-view-count',
  },
  {
    up: migration_2025-12-11-01-add-tags-fields.up,
    down: migration_2025-12-11-01-add-tags-fields.down,
    name: '2025-12-11-01-add-tags-fields',
  },
  {
    up: migration_2025-12-12-01-add-categories-show-on-home.up,
    down: migration_2025-12-12-01-add-categories-show-on-home.down,
    name: '2025-12-12-01-add-categories-show-on-home',
  },
  {
    up: migration_2025-12-12-02-add-articles-home-flags.up,
    down: migration_2025-12-12-02-add-articles-home-flags.down,
    name: '2025-12-12-02-add-articles-home-flags',
  },
  {
    up: migration_2025-12-12-03-add-article-versions-home-flags.up,
    down: migration_2025-12-12-03-add-article-versions-home-flags.down,
    name: '2025-12-12-03-add-article-versions-home-flags',
  },
  {
    up: migration_2025-12-12-04-add-analytics-settings-global.up,
    down: migration_2025-12-12-04-add-analytics-settings-global.down,
    name: '2025-12-12-04-add-analytics-settings-global',
  },
  {
    up: migration_2025-12-12-05-add-robots-global.up,
    down: migration_2025-12-12-05-add-robots-global.down,
    name: '2025-12-12-05-add-robots-global',
  },
  {
    up: migration_2025-12-12-06-add-site-settings-global.up,
    down: migration_2025-12-12-06-add-site-settings-global.down,
    name: '2025-12-12-06-add-site-settings-global',
  },
  {
    up: migration_2025-12-12-07-add-legal-page-global.up,
    down: migration_2025-12-12-07-add-legal-page-global.down,
    name: '2025-12-12-07-add-legal-page-global',
  },
  {
    up: migration_2025-12-12-08-add-ad-slots.up,
    down: migration_2025-12-12-08-add-ad-slots.down,
    name: '2025-12-12-08-add-ad-slots',
  },
  {
    up: migration_2025-12-12-09-fix-locked-docs-ad-slots.up,
    down: migration_2025-12-12-09-fix-locked-docs-ad-slots.down,
    name: '2025-12-12-09-fix-locked-docs-ad-slots',
  },
  {
    up: migration_2025-12-12-10-add-analytics-custom-head.up,
    down: migration_2025-12-12-10-add-analytics-custom-head.down,
    name: '2025-12-12-10-add-analytics-custom-head',
  },
  {
    up: migration_2025-12-12-11-add-ad-slots-usage-hint.up,
    down: migration_2025-12-12-11-add-ad-slots-usage-hint.down,
    name: '2025-12-12-11-add-ad-slots-usage-hint',
  },
  {
    up: migration_2025-12-13-01-add-site-branding.up,
    down: migration_2025-12-13-01-add-site-branding.down,
    name: '2025-12-13-01-add-site-branding',
  },
  {
    up: migration_2025-12-13-02-add-site-header-tagline.up,
    down: migration_2025-12-13-02-add-site-header-tagline.down,
    name: '2025-12-13-02-add-site-header-tagline',
  },
  {
    up: migration_2025-12-13-03-add-privacy-page-global.up,
    down: migration_2025-12-13-03-add-privacy-page-global.down,
    name: '2025-12-13-03-add-privacy-page-global',
  },
  {
    up: migration_2025-12-13-04-add-cookies-page-global.up,
    down: migration_2025-12-13-04-add-cookies-page-global.down,
    name: '2025-12-13-04-add-cookies-page-global',
  },
  {
    up: migration_2025-12-13-05-add-contacts-page-global.up,
    down: migration_2025-12-13-05-add-contacts-page-global.down,
    name: '2025-12-13-05-add-contacts-page-global',
  },
  {
    up: migration_2025-12-14-01-add-articles-noindex.up,
    down: migration_2025-12-14-01-add-articles-noindex.down,
    name: '2025-12-14-01-add-articles-noindex',
  },
  {
    up: migration_2025-12-14-02-add-article-versions-noindex.up,
    down: migration_2025-12-14-02-add-article-versions-noindex.down,
    name: '2025-12-14-02-add-article-versions-noindex',
  },
  {
    up: migration_20260319_100737.up,
    down: migration_20260319_100737.down,
    name: '20260319_100737'
  },
];
