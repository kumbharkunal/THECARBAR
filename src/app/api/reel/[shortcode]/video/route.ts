import type { NextRequest } from "next/server";
import { getReels } from "@/lib/instagram";

/**
 * Serves a reel's mp4 from our own origin.
 *
 * Instagram signs its video URLs and they expire in about 34 hours — half the
 * life of the three-day scrape cache. Pointing a <video> at one directly means
 * dead playback for most of every cycle.
 *
 * So the browser gets this stable path instead. It is keyed by shortcode, which
 * does not change, while the upstream URL rotates underneath. The response is
 * cached at the edge for 30 days, so once a reel has been fetched it keeps
 * playing long after Instagram stops honouring the original link — the same
 * trick `minimumCacheTTL` plays for the cover images.
 */

/** A month at the edge; the bytes for a given shortcode never change. */
const EDGE_TTL = 60 * 60 * 24 * 30;

export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/reel/[shortcode]/video">,
) {
  const { shortcode } = await ctx.params;

  const reel = (await getReels()).find((r) => r.shortcode === shortcode);
  if (!reel?.video) {
    return new Response(null, { status: 404 });
  }

  // Forward Range so the browser can seek and start playing before the whole
  // 9 MB has arrived. Without it the element waits for the full file.
  const range = request.headers.get("range");

  let upstream: Response;
  try {
    upstream = await fetch(reel.video, {
      headers: range ? { Range: range } : undefined,
      signal: AbortSignal.timeout(20_000),
      cache: "no-store",
    });
  } catch {
    return new Response(null, { status: 504 });
  }

  // Expired signature or a pulled post. The card falls back to its cover, so a
  // short cache here stops every visitor re-driving a request that cannot work,
  // while still letting the next scrape fix it.
  if (!upstream.ok || !upstream.body) {
    return new Response(null, {
      status: 502,
      headers: { "Cache-Control": "public, max-age=0, s-maxage=300" },
    });
  }

  const headers = new Headers({
    "Content-Type": upstream.headers.get("content-type") ?? "video/mp4",
    "Cache-Control": `public, max-age=3600, s-maxage=${EDGE_TTL}, stale-while-revalidate=${EDGE_TTL}`,
    "Accept-Ranges": "bytes",
  });

  for (const h of ["content-length", "content-range", "etag"]) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}
