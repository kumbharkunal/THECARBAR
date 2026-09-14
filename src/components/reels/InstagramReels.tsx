import { getReels } from "@/lib/instagram";
import { ReelsRail } from "@/components/reels/ReelsRail";

/**
 * Server half of the reels section: it does the fetching, `ReelsRail` does the
 * interaction. Keeping the Apify call on this side of the boundary is the point
 * — the token is read in a Server Component and never reaches the browser.
 */
export async function InstagramReels() {
  const reels = await getReels();
  return <ReelsRail reels={reels} />;
}
