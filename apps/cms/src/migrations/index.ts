import * as migration_2025_12_08_01_add_feeds_import_fields from './2025-12-08-01-add-feeds-import-fields';
import * as migration_2025_12_08_02_add_articles_feed_image_url from './2025-12-08-02-add-articles-feed-image-url';
import * as migration_2025_12_08_03_add_articles_version_feed_image_url from './2025-12-08-03-add-articles-version-feed-image-url';
import * as migration_2025_12_10_01_add_feeds_field_mapping from './2025-12-10-01-add-feeds-field-mapping';
import * as migration_2025_12_10_02_add_categories_fields from './2025-12-10-02-add-categories-fields';
import * as migration_2025_12_10_03_add_article_view_count from './2025-12-10-03-add-article-view-count';
import * as migration_2025_12_10_04_add_article_versions_view_count from './2025-12-10-04-add-article-versions-view-count';
import * as migration_2025_12_11_01_add_tags_fields from './2025-12-11-01-add-tags-fields';
import * as migration_2025_12_12_01_add_categories_show_on_home from './2025-12-12-01-add-categories-show-on-home';
import * as migration_2025_12_12_02_add_articles_home_flags from './2025-12-12-02-add-articles-home-flags';
import * as migration_2025_12_12_03_add_article_versions_home_flags from './2025-12-12-03-add-article-versions-home-flags';
import * as migration_2025_12_12_04_add_analytics_settings_global from './2025-12-12-04-add-analytics-settings-global';
import * as migration_2025_12_12_05_add_robots_global from './2025-12-12-05-add-robots-global';
import * as migration_2025_12_12_06_add_site_settings_global from './2025-12-12-06-add-site-settings-global';
import * as migration_2025_12_12_07_add_legal_page_global from './2025-12-12-07-add-legal-page-global';
import * as migration_2025_12_12_08_add_ad_slots from './2025-12-12-08-add-ad-slots';
import * as migration_2025_12_12_09_fix_locked_docs_ad_slots from './2025-12-12-09-fix-locked-docs-ad-slots';
import * as migration_2025_12_12_10_add_analytics_custom_head from './2025-12-12-10-add-analytics-custom-head';
import * as migration_2025_12_12_11_add_ad_slots_usage_hint from './2025-12-12-11-add-ad-slots-usage-hint';
import * as migration_2025_12_13_01_add_site_branding from './2025-12-13-01-add-site-branding';
import * as migration_2025_12_13_02_add_site_header_tagline from './2025-12-13-02-add-site-header-tagline';
import * as migration_2025_12_13_03_add_privacy_page_global from './2025-12-13-03-add-privacy-page-global';
import * as migration_2025_12_13_04_add_cookies_page_global from './2025-12-13-04-add-cookies-page-global';
import * as migration_2025_12_13_05_add_contacts_page_global from './2025-12-13-05-add-contacts-page-global';
import * as migration_2025_12_14_01_add_articles_noindex from './2025-12-14-01-add-articles-noindex';
import * as migration_2025_12_14_02_add_article_versions_noindex from './2025-12-14-02-add-article-versions-noindex';
import * as migration_20260319_100737 from './20260319_100737';

export const migrations = [
  { up: migration_2025_12_08_01_add_feeds_import_fields.up, down: migration_2025_12_08_01_add_feeds_import_fields.down, name: '2025-12-08-01-add-feeds-import-fields' },
  { up: migration_2025_12_08_02_add_articles_feed_image_url.up, down: migration_2025_12_08_02_add_articles_feed_image_url.down, name: '2025-12-08-02-add-articles-feed-image-url' },
  { up: migration_2025_12_08_03_add_articles_version_feed_image_url.up, down: migration_2025_12_08_03_add_articles_version_feed_image_url.down, name: '2025-12-08-03-add-articles-version-feed-image-url' },
  { up: migration_2025_12_10_01_add_feeds_field_mapping.up, down: migration_2025_12_10_01_add_feeds_field_mapping.down, name: '2025-12-10-01-add-feeds-field-mapping' },
  { up: migration_2025_12_10_02_add_categories_fields.up, down: migration_2025_12_10_02_add_categories_fields.down, name: '2025-12-10-02-add-categories-fields' },
  { up: migration_2025_12_10_03_add_article_view_count.up, down: migration_2025_12_10_03_add_article_view_count.down, name: '2025-12-10-03-add-article-view-count' },
  { up: migration_2025_12_10_04_add_article_versions_view_count.up, down: migration_2025_12_10_04_add_article_versions_view_count.down, name: '2025-12-10-04-add-article-versions-view-count' },
  { up: migration_2025_12_11_01_add_tags_fields.up, down: migration_2025_12_11_01_add_tags_fields.down, name: '2025-12-11-01-add-tags-fields' },
  { up: migration_2025_12_12_01_add_categories_show_on_home.up, down: migration_2025_12_12_01_add_categories_show_on_home.down, name: '2025-12-12-01-add-categories-show-on-home' },
  { up: migration_2025_12_12_02_add_articles_home_flags.up, down: migration_2025_12_12_02_add_articles_home_flags.down, name: '2025-12-12-02-add-articles-home-flags' },
  { up: migration_2025_12_12_03_add_article_versions_home_flags.up, down: migration_2025_12_12_03_add_article_versions_home_flags.down, name: '2025-12-12-03-add-article-versions-home-flags' },
  { up: migration_2025_12_12_04_add_analytics_settings_global.up, down: migration_2025_12_12_04_add_analytics_settings_global.down, name: '2025-12-12-04-add-analytics-settings-global' },
  { up: migration_2025_12_12_05_add_robots_global.up, down: migration_2025_12_12_05_add_robots_global.down, name: '2025-12-12-05-add-robots-global' },
  { up: migration_2025_12_12_06_add_site_settings_global.up, down: migration_2025_12_12_06_add_site_settings_global.down, name: '2025-12-12-06-add-site-settings-global' },
  { up: migration_2025_12_12_07_add_legal_page_global.up, down: migration_2025_12_12_07_add_legal_page_global.down, name: '2025-12-12-07-add-legal-page-global' },
  { up: migration_2025_12_12_08_add_ad_slots.up, down: migration_2025_12_12_08_add_ad_slots.down, name: '2025-12-12-08-add-ad-slots' },
  { up: migration_2025_12_12_09_fix_locked_docs_ad_slots.up, down: migration_2025_12_12_09_fix_locked_docs_ad_slots.down, name: '2025-12-12-09-fix-locked-docs-ad-slots' },
  { up: migration_2025_12_12_10_add_analytics_custom_head.up, down: migration_2025_12_12_10_add_analytics_custom_head.down, name: '2025-12-12-10-add-analytics-custom-head' },
  { up: migration_2025_12_12_11_add_ad_slots_usage_hint.up, down: migration_2025_12_12_11_add_ad_slots_usage_hint.down, name: '2025-12-12-11-add-ad-slots-usage-hint' },
  { up: migration_2025_12_13_01_add_site_branding.up, down: migration_2025_12_13_01_add_site_branding.down, name: '2025-12-13-01-add-site-branding' },
  { up: migration_2025_12_13_02_add_site_header_tagline.up, down: migration_2025_12_13_02_add_site_header_tagline.down, name: '2025-12-13-02-add-site-header-tagline' },
  { up: migration_2025_12_13_03_add_privacy_page_global.up, down: migration_2025_12_13_03_add_privacy_page_global.down, name: '2025-12-13-03-add-privacy-page-global' },
  { up: migration_2025_12_13_04_add_cookies_page_global.up, down: migration_2025_12_13_04_add_cookies_page_global.down, name: '2025-12-13-04-add-cookies-page-global' },
  { up: migration_2025_12_13_05_add_contacts_page_global.up, down: migration_2025_12_13_05_add_contacts_page_global.down, name: '2025-12-13-05-add-contacts-page-global' },
  { up: migration_2025_12_14_01_add_articles_noindex.up, down: migration_2025_12_14_01_add_articles_noindex.down, name: '2025-12-14-01-add-articles-noindex' },
  { up: migration_2025_12_14_02_add_article_versions_noindex.up, down: migration_2025_12_14_02_add_article_versions_noindex.down, name: '2025-12-14-02-add-article-versions-noindex' },
  { up: migration_20260319_100737.up, down: migration_20260319_100737.down, name: '20260319_100737' },
];
