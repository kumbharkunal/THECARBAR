import fs from "node:fs";

/**
 * What does apify/instagram-reel-scraper actually return?
 *
 * The Actor's store page publishes an abridged sample that stops before the
 * media fields, so the cover-image key is a guess until a real run proves it.
 * This prints one item's keys, says which candidate `coverUrl()` would pick, and
 * shows the normalised result — run it once after setting APIFY_TOKEN.
 *
 *   node qa/reels-probe.mjs
 */
const ACTOR = "apify~instagram-reel-scraper";
const LIMIT = Number(process.env.LIMIT ?? 3);

function token() {
  if (process.env.APIFY_TOKEN) return process.env.APIFY_TOKEN;
  try {
    const env = fs.readFileSync(".env.local", "utf8");
    return env.match(/^APIFY_TOKEN\s*=\s*(.+)$/m)?.[1]?.trim().replace(/^["']|["']$/g, "");
  } catch {
    return undefined;
  }
}

const APIFY_TOKEN = token();
if (!APIFY_TOKEN) {
  console.error("APIFY_TOKEN not found in the environment or .env.local");
  process.exit(1);
}

const handle = (process.env.HANDLE ?? "thecarbar.in").replace(/^@/, "");
const url = `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?token=${encodeURIComponent(APIFY_TOKEN)}&timeout=180&format=json`;

console.log(`running ${ACTOR} for @${handle} (limit ${LIMIT})...`);
const started = Date.now();

const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: [handle],
    resultsLimit: LIMIT,
    skipPinnedPosts: false,
    skipTrialReels: true,
    includeSharesCount: false,
    includeTranscript: false,
    includeDownloadedVideo: false,
  }),
});

console.log(`http ${res.status} in ${((Date.now() - started) / 1000).toFixed(1)}s`);
const items = await res.json();

if (!Array.isArray(items)) {
  console.error("non-array payload:", JSON.stringify(items).slice(0, 600));
  process.exit(1);
}
console.log(`items: ${items.length}\n`);
if (!items.length) process.exit(1);

const first = items[0];
console.log("--- keys on item[0] ---");
for (const [k, v] of Object.entries(first)) {
  const t = Array.isArray(v) ? `array(${v.length})` : typeof v;
  const preview = typeof v === "string" ? ` ${v.slice(0, 78)}` : "";
  console.log(`  ${k.padEnd(24)} ${t}${preview}`);
}

const CANDIDATES = [
  "displayUrl", "thumbnailUrl", "coverUrl", "imageUrl",
  "thumbnail", "image", "displayUri", "images",
];
console.log("\n--- cover-image candidates ---");
let matched = null;
for (const key of CANDIDATES) {
  const raw = key === "images" ? first.images?.[0] : first[key];
  const ok = typeof raw === "string" && /^https:\/\/[^/]*(cdninstagram\.com|fbcdn\.net)\//.test(raw);
  if (raw !== undefined) console.log(`  ${ok ? "MATCH" : "     "} ${key}: ${String(raw).slice(0, 90)}`);
  if (ok && !matched) matched = key;
}
console.log(matched
  ? `\ncoverUrl() will use: ${matched}`
  : "\nNO CANDIDATE MATCHED — add the right key to coverUrl() in src/lib/instagram.ts");

console.log("\n--- as the page would show them ---");
for (const it of items) {
  const code = it.shortCode ?? it.shortcode ?? String(it.url ?? "").match(/\/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/)?.[1];
  const cap = String(it.caption ?? "").split(/\r?\n/, 1)[0]
    .replace(/[#@][\p{L}\p{N}._]+/gu, " ").replace(/\s+/g, " ").trim();
  console.log(`  ${code}  ${cap.slice(0, 60) || "(no caption)"}`);
}
