/**
 * GA4 custom event tracking utility.
 *
 * Wraps window.gtag so callers don't have to guard for its existence.
 * All custom event names and their expected parameter shapes are defined
 * here so they stay consistent across the codebase.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type GTagParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(eventName: string, params?: GTagParams): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

// ─── Typed helpers (optional convenience wrappers) ────────────────────────────

/** Fired when a user clicks an affiliate / buy link on the Shelf or a book review card. */
export function trackAffiliateLinkClick(params: {
  item_name: string;
  item_category: string;
  destination_url: string;
  source?: string; // e.g. "shelf", "book_review_card", "book_review_modal"
}) {
  trackEvent("affiliate_link_click", params);
}

/** Fired when a user clicks any social / external platform link. */
export function trackSocialLinkClick(params: {
  platform: string;
  link_location: string; // e.g. "footer", "about_section", "book_review_card"
  destination_url?: string;
}) {
  trackEvent("social_link_click", params);
}

/** Fired when a user opens an individual writing piece or book review. */
export function trackPostRead(params: {
  post_title: string;
  post_category?: string;
  destination_url?: string;
}) {
  trackEvent("post_read", params);
}

/** Fired once when a user scrolls past 50% of a content page/modal. */
export function trackScrollDepth(params: {
  post_title: string;
  depth: "50";
}) {
  trackEvent("scroll_depth", params);
}
