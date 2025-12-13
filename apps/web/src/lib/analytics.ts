// Universal event tracking function for GA4 and Yandex.Metrica

declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, any>) => void;
    ym?: (id: number, type: string, ...args: any[]) => void;
  }
}

const YANDEX_METRICA_ID = 12345678; // Replace with your actual Yandex.Metrica counter ID

/**
 * Tracks a custom event in Google Analytics 4 and Yandex.Metrica.
 * Checks for the existence of analytics objects to prevent errors.
 * @param eventName The name of the event to track.
 * @param params Additional parameters for the event.
 */
export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  console.log(`[Analytics] Tracking event: ${eventName}`, params);

  // Track with Google Analytics 4 (gtag.js)
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  } else {
    console.warn('[Analytics] gtag is not defined.');
  }

  // Track with Yandex.Metrica
  if (typeof window.ym === 'function') {
    // Yandex.Metrica uses 'reachGoal' for custom events.
    // We pass the event name as the goal identifier and params as the goal parameters.
    window.ym(YANDEX_METRICA_ID, 'reachGoal', eventName, params);
  } else {
    console.warn('[Analytics] ym is not defined.');
  }
};

// --- Specific Event Tracking Functions ---

/**
 * Tracks an ad slot becoming visible.
 * @param adSlotId The ID of the ad slot.
 * @param adProvider The provider of the ad (e.g., 'yan', 'adsense').
 */
export const trackAdViewable = (adSlotId: string, adProvider: string) => {
  trackEvent('ad_slot_viewable', {
    ad_slot_id: adSlotId,
    ad_provider: adProvider,
  });
};

/**
 * Tracks a click on an ad slot.
 * @param adSlotId The ID of the ad slot.
 * @param adProvider The provider of the ad.
 */
export const trackAdClick = (adSlotId: string, adProvider: string) => {
  trackEvent('ad_slot_click', {
    ad_slot_id: adSlotId,
    ad_provider: adProvider,
  });
};

/**
 * Tracks an ad slot being successfully filled.
 * @param adSlotId The ID of the ad slot.
 * @param adProvider The provider of the ad.
 */
export const trackAdFilled = (adSlotId: string, adProvider: string) => {
  trackEvent('ad_slot_filled', {
    ad_slot_id: adSlotId,
    ad_provider: adProvider,
  });
};

/**
 * Tracks a 'like' action on an article.
 * @param articleId The ID of the article.
 */
export const trackLike = (articleId: string) => {
  trackEvent('like', {
    content_type: 'article',
    item_id: articleId,
  });
};

/**
 * Tracks a 'share' action.
 * @param articleId The ID of the article being shared.
 * @param method The method used for sharing (e.g., 'telegram', 'whatsapp').
 */
export const trackShare = (articleId: string, method: string) => {
  trackEvent('share', {
    method: method,
    content_type: 'article',
    item_id: articleId,
  });
};
