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
  /**
   * Instagram's signed mp4. Server-side only — it expires in about 34 hours,
   * well inside the three-day cache, so the browser is handed `reelVideoSrc()`
   * instead and the proxy resolves this at request time.
   */
  video?: string | null;
  postedAt?: string;
};

/**
 * What the rail actually receives. The signed mp4 is deliberately absent: it
 * would be serialised into the HTML payload for no reason, and it is stale
 * within a day and a half.
 */
export type RailReel = {
  shortcode: string;
  caption?: string;
  thumbnail?: string | null;
  hasVideo: boolean;
};

/** Our stable URL for a reel's video. Constant while Instagram's rotates. */
export const reelVideoSrc = (shortcode: string) =>
  `/api/reel/${encodeURIComponent(shortcode)}/video`;

/** How many reels to ask the scraper for. The rail scrolls, so this can grow. */
export const REEL_LIMIT = 12;

/**
 * Cards rendered before the visitor scrolls the rail, and how many more arrive
 * each time they reach the end.
 *
 * Every card carries a cover and a video element, so mounting twelve up front
 * costs markup and image requests for reels most visitors never scroll to.
 */
export const REELS_INITIAL = 5;
export const REELS_STEP = 4;

/**
 * Wording that beats the real caption, keyed by shortcode.
 *
 * Empty on purpose. The previous entries were written before anyone could see
 * the posts and described them wrongly — a stock-update reel was labelled
 * "Handover day", inventing a delivery (CLAUDE.md §2). Only add an entry for a
 * reel you have actually watched.
 */
export const CAPTION_OVERRIDES: Record<string, string> = {};

/**
 * The five reels the client supplied, shipped in the bundle.
 *
 * They are what renders with no Apify token, with no network, and on the day the
 * scrape breaks. The section is never empty and never fabricated — these are
 * real posts, carrying no caption because we cannot confirm what each one says
 * without the scrape; the card renders without a caption line.
 */
export const FALLBACK_REELS: Reel[] = [
  { shortcode: "Dcz-tbMsWPB", thumbnail: null },
  { shortcode: "DcvzZ8osrle", thumbnail: null },
  { shortcode: "Dcu6BkEs6Tx", thumbnail: null },
  { shortcode: "DcjXWkpstDs", thumbnail: null },
  { shortcode: "DcbahaHPWKv", thumbnail: null },
];

export const reelPermalink = (reel: Pick<Reel, "shortcode">) =>
  `https://www.instagram.com/reel/${reel.shortcode}/`;
