/**
 * The reels shown in the Instagram section.
 *
 * The live list is scraped from @thecarbar.in every three days — see
 * `src/lib/instagram.ts`. This file holds the parts a scraper should not decide:
 * the shape, the wording we want to say ourselves, and the reels that keep the
 * section standing when the scrape is unavailable.
 */

export type Reel = {
  /** The code in instagram.com/reel/<shortcode>/ */
  shortcode: string;
  /**
   * Optional on purpose. Plenty of real captions are nothing but hashtags, and
   * CLAUDE.md §2 says render less rather than invent a stand-in — so a reel with
   * no usable caption simply shows none.
   */
  caption?: string;
  /**
   * Instagram's cover image. `null` falls through to MediaFrame's art-directed
   * composition, so a missing cover looks deliberate instead of broken.
   */
  thumbnail?: string | null;
  postedAt?: string;
};

/** How many reels to ask the scraper for. The rail scrolls, so this can grow. */
export const REEL_LIMIT = 12;

/**
 * Wording that beats whatever the caption says, keyed by shortcode.
 *
 * The client's own captions are written for Instagram; these are written for the
 * page. Delete an entry and the real caption takes over.
 */
export const CAPTION_OVERRIDES: Record<string, string> = {
  "Dcz-tbMsWPB": "From the showroom floor",
  "DcvzZ8osrle": "Handover day",
  "Dcu6BkEs6Tx": "Walkaround",
  "DcjXWkpstDs": "On the road",
  "DcbahaHPWKv": "Just delivered",
};

/**
 * The five reels the client supplied, shipped in the bundle.
 *
 * They are what renders with no Apify token, with no network, and on the day the
 * scrape breaks. The section is never empty and never fabricated — these are
 * real posts.
 */
export const FALLBACK_REELS: Reel[] = [
  { shortcode: "Dcz-tbMsWPB", caption: "From the showroom floor", thumbnail: null },
  { shortcode: "DcvzZ8osrle", caption: "Handover day", thumbnail: null },
  { shortcode: "Dcu6BkEs6Tx", caption: "Walkaround", thumbnail: null },
  { shortcode: "DcjXWkpstDs", caption: "On the road", thumbnail: null },
  { shortcode: "DcbahaHPWKv", caption: "Just delivered", thumbnail: null },
];

export const reelPermalink = (reel: Pick<Reel, "shortcode">) =>
  `https://www.instagram.com/reel/${reel.shortcode}/`;
