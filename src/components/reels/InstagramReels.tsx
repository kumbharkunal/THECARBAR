import { getReels } from "@/lib/instagram";
import type { RailReel } from "@/data/reels";
import { ReelsRail } from "@/components/reels/ReelsRail";

/**
 * Server half of the reels section: it does the fetching, `ReelsRail` does the
 * interaction. Keeping the Apify call on this side of the boundary is the point
 * — the token is read in a Server Component and never reaches the browser.
 *
 * The signed mp4 is dropped here too. The rail only needs to know a video
 * exists; it plays it through the proxy route, which resolves the real URL.
 */
export async function InstagramReels() {
  const reels = await getReels();

  const rail: RailReel[] = reels.map((r) => ({
    shortcode: r.shortcode,
    caption: r.caption,
    thumbnail: r.thumbnail,
    hasVideo: Boolean(r.video),
  }));

  return <ReelsRail reels={rail} />;
}
