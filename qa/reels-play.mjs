/**
 * Does the reel rail actually play?
 *
 * Server-rendered markup proves nothing here: autoplay, the one-at-a-time rule
 * and the mute toggle are all browser behaviour.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3111";

// Headless Chromium withholds autoplay even when muted. Real browsers allow
// muted inline autoplay unconditionally, so this only restores parity — it does
// not paper over a gesture requirement the site would actually hit.
const browser = await chromium.launch({
  args: ["--autoplay-policy=no-user-gesture-required"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto(BASE, { waitUntil: "domcontentloaded" });

// The intro loader holds the page for ~3.6s and swallows any scroll issued
// underneath it, which silently parks #stories 2,000px below the fold — where
// the rail is right not to play anything.
await page.waitForFunction(
  () => {
    const l = document.querySelector(".site-loader");
    return !l || getComputedStyle(l).opacity === "0";
  },
  { timeout: 15000 },
);

await page.locator("#stories").scrollIntoViewIfNeeded();
await page.waitForTimeout(600);

const onScreen = await page.evaluate(() => {
  const b = document.querySelector("#stories").getBoundingClientRect();
  return b.top < innerHeight && b.bottom > 0;
});
if (!onScreen) {
  console.log("ABORT: #stories never entered the viewport — nothing below is meaningful.");
  await browser.close();
  process.exit(1);
}

const state = () =>
  page.$$eval("#stories video", (vs) =>
    vs.map((v) => ({
      playing: !v.paused && !v.ended && v.readyState > 2,
      paused: v.paused,
      muted: v.muted,
      t: Number(v.currentTime.toFixed(2)),
      src: (v.currentSrc || v.src).split("/").slice(-2, -1)[0],
    })),
  );

const settle = (ms) => page.waitForTimeout(ms);

console.log(`videos on page: ${(await state()).length}`);

// Autoplay. The first play pulls ~9 MB through the proxy with nothing cached
// at the edge yet; the cover holds the frame until then.
await settle(8000);
let s = await state();
let live = s.filter((v) => v.playing);
console.log(`\n[autoplay]      playing=${live.length}  ${live.map((v) => v.src).join(",")}`);
console.log(`                muted=${live.every((v) => v.muted) ? "yes (all)" : "NO - has sound"}`);
console.log(live.length === 1 ? "  PASS one plays" : `  FAIL expected 1, got ${live.length}`);
console.log(live.every((v) => v.muted) ? "  PASS starts muted" : "  FAIL not muted");

// It is actually advancing, not just flagged as playing
const t1 = live[0]?.t ?? 0;
await settle(2500);
const t2 = (await state()).find((v) => v.src === live[0]?.src)?.t ?? 0;
console.log(`\n[advancing]     ${t1}s -> ${t2}s`);
console.log(t2 > t1 ? "  PASS frames advancing" : "  FAIL stalled");

// Pause control
await page.getByRole("button", { name: /pause reels/i }).click();
await settle(1200);
s = await state();
console.log(`\n[pause btn]     playing=${s.filter((v) => v.playing).length}`);
console.log(s.every((v) => v.paused) ? "  PASS all paused" : "  FAIL still playing");

await page.getByRole("button", { name: /play reels/i }).click();
await settle(3000);
s = await state();
console.log(`[resume]        playing=${s.filter((v) => v.playing).length}`);
console.log(s.filter((v) => v.playing).length === 1 ? "  PASS resumed" : "  FAIL did not resume");

// Mute toggle
await page.getByRole("button", { name: /unmute reels/i }).click();
await settle(900);
s = await state();
const active = s.find((v) => v.playing);
console.log(`\n[unmute]        active muted=${active?.muted}`);
console.log(active && active.muted === false ? "  PASS sound on" : "  FAIL still muted");

await page.getByRole("button", { name: /mute reels/i }).click();
await settle(700);
console.log(`[re-mute]       active muted=${(await state()).find((v) => v.playing)?.muted}`);

// Scrolling the rail hands playback to the next card
const before = (await state()).find((v) => v.playing)?.src;
await page.locator("#stories .rail-scroll").evaluate((el) => {
  el.scrollBy({ left: el.clientWidth, behavior: "instant" });
});
await settle(4000);
s = await state();
const after = s.find((v) => v.playing)?.src;
console.log(`\n[rail scroll]   ${before} -> ${after}`);
console.log(after && after !== before ? "  PASS handed over" : "  FAIL same card");
console.log(
  s.filter((v) => v.playing).length === 1
    ? "  PASS still only one"
    : `  FAIL ${s.filter((v) => v.playing).length} playing`,
);

// Off-screen should stop it
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await settle(1500);
console.log(`\n[off-screen]    playing=${(await state()).filter((v) => v.playing).length}`);
console.log(
  (await state()).filter((v) => v.playing).length === 0
    ? "  PASS stops off-screen"
    : "  FAIL still streaming",
);

await browser.close();
