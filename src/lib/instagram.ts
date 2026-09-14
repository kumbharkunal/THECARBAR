import { unstable_cache } from "next/cache";
import {
  CAPTION_OVERRIDES,
  FALLBACK_REELS,
  REEL_LIMIT,
  type Reel,
} from "@/data/reels";
import { SITE } from "@/data/site";

/**
 * The reels section, fed by apify/instagram-reel-scraper.
 *
 * Scraped at most once every three days and cached in between, because a run
 * costs real credit and the client does not post hourly. The cache is Next's
 * own, so it survives redeploys — ten deploys in a day still cost one run.
 *
 * `unstable_cache` rather than `fetch`'s `next.revalidate`: starting an Actor is
 * a POST, and the fetch Data Cache only covers GET. Next 16 would prefer the
 * `use cache` directive, but that needs `cacheComponents: true` across the whole
 * app — a caching-semantics change for the entire site to serve one section.
 *
 * Nothing here is allowed to throw. A scrape that fails must leave a finished
 * page behind, not a hole.
 */

/** apify/instagram-reel-scraper */
const ACTOR = "apify~instagram-reel-scraper";
const ENDPOINT = `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items`;

/** Three days. The cadence the client asked for. */
export const REELS_REVALIDATE = 60 * 60 * 24 * 3;

/** Ceiling on the Actor run, and on our own wait for it. */
const RUN_TIMEOUT_S = 180;

/**
 * After a failure nothing is written to the cache, so the next request would try
 * again immediately. Apify bills an `actor-start` event per attempt, so a bad
 * afternoon on a page with traffic could quietly eat the month's credit.
 */
const FAILURE_COOLDOWN_MS = 15 * 60 * 1000;
let lastFailureAt = 0;

/** `@thecarbar.in` → `thecarbar.in`, which is what the Actor wants. */
const profileHandle = () => SITE.instagramHandle.replace(/^@/, "");

type Item = Record<string, unknown>;

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

/**
 * The Actor's cover-image field is not documented on its store page, and these
 * scrapers rename fields between builds. Rather than bet on one spelling, take
 * the first candidate that is actually an Instagram CDN URL.
 */
function coverUrl(item: Item): string | null {
  const candidates = [
    item.displayUrl,
    item.thumbnailUrl,
    item.coverUrl,
    item.imageUrl,
    item.thumbnail,
    item.image,
    item.displayUri,
    Array.isArray(item.images) ? item.images[0] : undefined,
  ];

  for (const c of candidates) {
    const url = str(c);
    if (url && /^https:\/\/[^/]*(cdninstagram\.com|fbcdn\.net)\//.test(url)) {
      return url;
    }
  }
  return null;
}

/**
 * Vercel's CDN refuses to cache a response over 10 MB — measured against
 * production: 8.7 MB comes back HIT, 11.0 MB and 16.1 MB never do.
 *
 * An uncacheable reel is fetched from Instagram on every single view, and stops
 * playing altogether once the signed URL expires about 34 hours in. Rather than
 * show a play button that works for half a cycle and costs 37 MB a viewer, those
 * reels keep their cover and link out, which is where they would play anyway.
 */
const MAX_INLINE_BYTES = 10_000_000;

/**
 * Ask for more reels than the rail shows. Roughly a quarter come back too large
 * to play, and the surplus keeps the rail full rather than short.
 */
const SCRAPE_LIMIT = 20;

/** Total size via a one-byte range — cheaper and likelier to answer than HEAD. */
async function videoBytes(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, {
      headers: { Range: "bytes=0-0" },
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    const total = res.headers.get("content-range")?.split("/")[1];
    const bytes = total ? Number(total) : NaN;
    return Number.isFinite(bytes) ? bytes : null;
  } catch {
    return null;
  }
}

/** Drops the mp4 from anything we cannot serve reliably. Size unknown counts. */
async function keepPlayable(reels: Reel[]): Promise<Reel[]> {
  return Promise.all(
    reels.map(async (reel) => {
      if (!reel.video) return reel;
      const bytes = await videoBytes(reel.video);
      return bytes !== null && bytes <= MAX_INLINE_BYTES
        ? reel
        : { ...reel, video: null };
    }),
  );
}

/** The reel's mp4. Same CDN guard as the cover — anything else is not ours. */
function videoUrl(item: Item): string | null {
  const url = str(item.videoUrl) ?? str(item.video_url);
  return url && /^https:\/\/[^/]*(cdninstagram\.com|fbcdn\.net)\//.test(url)
    ? url
    : null;
}

function shortcodeOf(item: Item): string | undefined {
  const direct = str(item.shortCode) ?? str(item.shortcode) ?? str(item.code);
  if (direct) return direct;
  // Fall back to the permalink: .../reel/<code>/ or .../p/<code>/
  const url = str(item.url) ?? str(item.inputUrl);
  return url?.match(/\/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/)?.[1];
}

/**
 * Instagram captions are written for Instagram: a line of copy, then a wall of
 * hashtags, mentions and credits. Keep the first line, drop the machinery.
 */
function cleanCaption(raw: string | undefined): string | undefined {
  if (!raw) return undefined;

  let text = raw.split(/\r?\n/, 1)[0] ?? "";
  text = text.replace(/[#@][\p{L}\p{N}._]+/gu, " ");
  text = text.replace(/https?:\/\/\S+/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  text = text.replace(/^[-–—·•|,.:;\s]+|[-–—·•|,:;\s]+$/g, "").trim();

  if (text.length < 4) return undefined;

  if (text.length > 60) {
    const cut = text.slice(0, 60);
    const space = cut.lastIndexOf(" ");
    text = `${(space > 28 ? cut.slice(0, space) : cut).trim()}…`;
  }
  return text;
}

function normalise(item: Item): Reel | null {
  const shortcode = shortcodeOf(item);
  if (!shortcode) return null;

  return {
    shortcode,
    caption: CAPTION_OVERRIDES[shortcode] ?? cleanCaption(str(item.caption)),
    thumbnail: coverUrl(item),
    video: videoUrl(item),
    postedAt: str(item.timestamp) ?? str(item.takenAt),
  };
}

/** Starts the Actor and waits for its dataset. Throws on any failure. */
async function scrapeReels(): Promise<Reel[]> {
  const token = process.env.APIFY_TOKEN;
  if (!token) throw new Error("APIFY_TOKEN is not set");

  const url = `${ENDPOINT}?token=${encodeURIComponent(token)}&timeout=${RUN_TIMEOUT_S}&format=json`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: [profileHandle()],
      resultsLimit: SCRAPE_LIMIT,
      skipPinnedPosts: false,
      skipTrialReels: true,
      // Each of these is a separately billed add-on event, and the page shows
      // none of them.
      includeSharesCount: false,
      includeTranscript: false,
      includeDownloadedVideo: false,
    }),
    signal: AbortSignal.timeout((RUN_TIMEOUT_S + 15) * 1000),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Apify responded ${res.status} ${res.statusText}`);
  }

  const payload: unknown = await res.json();
  if (!Array.isArray(payload)) throw new Error("Apify returned a non-array dataset");

  const reels = payload
    .filter((i): i is Item => !!i && typeof i === "object")
    .map(normalise)
    .filter((r): r is Reel => r !== null);

  // An empty result is far more likely to be a broken scrape than an account
  // that deleted every reel, so treat it as a failure and keep the fallback.
  if (!reels.length) throw new Error("Apify returned no reels");

  // Newest first, for reels that carry a timestamp.
  reels.sort((a, b) => (b.postedAt ?? "").localeCompare(a.postedAt ?? ""));

  // Size the whole catch, then keep the newest REEL_LIMIT that can actually
  // play. Dropping an oversized reel then costs us reach into the back
  // catalogue rather than leaving a dead card in the rail.
  const sized = await keepPlayable(reels);
  const playable = sized.filter((r) => r.video);

  // If every single one was oversized, a rail of covers still beats no rail.
  return (playable.length ? playable : sized).slice(0, REEL_LIMIT);
}

/**
 * Bump when the shape of a cached Reel changes.
 *
 * The cache outlives deploys, which is the point of it — but that also means a
 * release that adds a field would serve the old shape for up to three days.
 * `video` arrived this way: every reel came back with no mp4 and the rail
 * rendered no players at all.
 */
const SHAPE = "v4-playable-only";

const cachedScrape = unstable_cache(scrapeReels, ["instagram-reels", ACTOR, SHAPE], {
  revalidate: REELS_REVALIDATE,
  tags: ["instagram-reels"],
});

/** Never throws, never returns an empty list. */
export async function getReels(): Promise<Reel[]> {
  // No token is a normal state — local clones and previews run without one, and
  // they should render the section rather than call out and fail.
  if (!process.env.APIFY_TOKEN) return FALLBACK_REELS;
  if (Date.now() - lastFailureAt < FAILURE_COOLDOWN_MS) return FALLBACK_REELS;

  try {
    return await cachedScrape();
  } catch (error) {
    lastFailureAt = Date.now();
    console.error("[reels] falling back to the bundled reels:", error);
    return FALLBACK_REELS;
  }
}
