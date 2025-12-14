import * as addFeedsImportFields from './2025-12-08-01-add-feeds-import-fields';
import * as addArticlesFeedImageUrl from './2025-12-08-02-add-articles-feed-image-url';
import * as addArticlesVersionFeedImageUrl from './2025-12-08-03-add-articles-version-feed-image-url';
import * as addFeedsFieldMapping from './2025-12-10-01-add-feeds-field-mapping';
import * as addCategoriesFields from './2025-12-10-02-add-categories-fields';
import * as addArticleViewCount from './2025-12-10-03-add-article-view-count';
import * as addArticleVersionsViewCount from './2025-12-10-04-add-article-versions-view-count';
import * as addTagsFields from './2025-12-11-01-add-tags-fields';
import * as addCategoriesShowOnHome from './2025-12-12-01-add-categories-show-on-home';
import * as addArticlesHomeFlags from './2025-12-12-02-add-articles-home-flags';
import * as addArticleVersionsHomeFlags from './2025-12-12-03-add-article-versions-home-flags';
import * as addAnalyticsSettingsGlobal from './2025-12-12-04-add-analytics-settings-global';
import * as addRobotsGlobal from './2025-12-12-05-add-robots-global';
import * as addSiteSettingsGlobal from './2025-12-12-06-add-site-settings-global';
import * as addSiteBranding from './2025-12-13-01-add-site-branding';
import * as addSiteHeaderTagline from './2025-12-13-02-add-site-header-tagline';
import * as addLegalPageGlobal from './2025-12-12-07-add-legal-page-global';
import * as addAdSlots from './2025-12-12-08-add-ad-slots';
import * as addAnalyticsCustomHead from './2025-12-12-10-add-analytics-custom-head';
import * as addAdSlotsUsageHint from './2025-12-12-11-add-ad-slots-usage-hint';
import * as addPrivacyPageGlobal from './2025-12-13-03-add-privacy-page-global';
import * as addCookiesPageGlobal from './2025-12-13-04-add-cookies-page-global';
import * as addContactsPageGlobal from './2025-12-13-05-add-contacts-page-global';
import * as addArticlesNoindex from './2025-12-14-01-add-articles-noindex';

// Payload CLI читает просто массив модулей с up/down,
// строгая типизация здесь не обязательна.
export const migrations = [
  addFeedsImportFields,
  addArticlesFeedImageUrl,
  addArticlesVersionFeedImageUrl,
  addFeedsFieldMapping,
  addCategoriesFields,
  addArticleViewCount,
  addArticleVersionsViewCount,
  addTagsFields,
  addCategoriesShowOnHome,
  addArticlesHomeFlags,
  addArticleVersionsHomeFlags,
  addAnalyticsSettingsGlobal,
  addRobotsGlobal,
  addSiteSettingsGlobal,
  addSiteBranding,
  addSiteHeaderTagline,
  addLegalPageGlobal,
  addAdSlots,
  addAnalyticsCustomHead,
  addAdSlotsUsageHint,
  addPrivacyPageGlobal,
  addCookiesPageGlobal,
  addContactsPageGlobal,
  addArticlesNoindex,
];
