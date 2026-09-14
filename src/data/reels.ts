/**
 * Instagram reels, embedded through Instagram's official /embed endpoint.
 *
 * Only the shortcode is stored — the permalink and the embed URL are derived, so
 * there is one source of truth per reel. Adding a reel means adding a shortcode.
 */

export type Reel = {
  /** The code in instagram.com/reel/<shortcode>/ */
  shortcode: string;
  caption: string;
};

export const REELS: Reel[] = [
  { shortcode: "Dcz-tbMsWPB", caption: "From the showroom floor" },
  { shortcode: "DcvzZ8osrle", caption: "Handover day" },
  { shortcode: "Dcu6BkEs6Tx", caption: "Walkaround" },
  { shortcode: "DcjXWkpstDs", caption: "On the road" },
  { shortcode: "DcbahaHPWKv", caption: "Just delivered" },
];

export const reelPermalink = (r: Reel) =>
  `https://www.instagram.com/reel/${r.shortcode}/`;

/** Instagram's supported embed view — no scraping, no third-party script. */
export const reelEmbedSrc = (r: Reel) =>
  `https://www.instagram.com/reel/${r.shortcode}/embed`;
