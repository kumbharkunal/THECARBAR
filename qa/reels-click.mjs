/**
 * Clicking a reel must play THAT reel, and clicking it again must pause it.
 *
 * Both were broken: every card's frame toggled one global pause flag, so a
 * click anywhere on the rail drove whichever card happened to be centred.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3111";

const browser = await chromium.launch({
  args: ["--autoplay-policy=no-user-gesture-required"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForFunction(
  () => {
    const l = document.querySelector(".site-loader");
    return !l || getComputedStyle(l).opacity === "0";
  },
  { timeout: 15000 },
);
await page.locator("#stories").scrollIntoViewIfNeeded();
await page.waitForTimeout(600);

/** Which card is playing, by index among all cards. */
const playingIndex = () =>
  page.$$eval("#stories article", (arts) =>
    arts.findIndex((a) => {
      const v = a.querySelector("video");
      return v && !v.paused && v.readyState > 2;
    }),
  );

const frameButton = (i) =>
  page.locator("#stories article").nth(i).getByRole("button", { name: /this reel/i });

/** Poll until some card is genuinely playing — buffering time varies a lot. */
const waitForPlaying = async (want, ms = 30000) => {
  const until = Date.now() + ms;
  for (;;) {
    const i = await playingIndex();
    if (want === undefined ? i >= 0 : i === want) return i;
    if (Date.now() > until) return i;
    await page.waitForTimeout(500);
  }
};

const start = await waitForPlaying();
console.log(`autoplay      -> card ${start} playing`);

// Find a different card that has a video to click.
const candidates = await page.$$eval("#stories article", (arts) =>
  arts.map((a, i) => (a.querySelector("video") ? i : -1)).filter((i) => i >= 0),
);
const target = candidates.find((i) => i !== start);
console.log(`cards with video: [${candidates.join(",")}] -> clicking ${target}`);

// 1. Clicking a different card should hand playback to it.
await frameButton(target).click();
let now = await waitForPlaying(target);
console.log(`\nclick card ${target}  -> card ${now} playing`);
console.log(now === target ? "  PASS that card plays" : `  FAIL expected ${target}, got ${now}`);

const count = await page.$$eval(
  "#stories video",
  (vs) => vs.filter((v) => !v.paused && v.readyState > 2).length,
);
console.log(count === 1 ? "  PASS still only one" : `  FAIL ${count} playing`);

// 2. Clicking the same card again should pause it.
await frameButton(target).click();
await page.waitForTimeout(1200);
now = await playingIndex();
console.log(`\nclick again    -> playing index ${now}`);
console.log(now === -1 ? "  PASS paused" : `  FAIL card ${now} still playing`);

// The frame must stay on screen while paused, not revert to the cover.
const visible = await page
  .locator("#stories article")
  .nth(target)
  .locator("video")
  .evaluate((v) => getComputedStyle(v).opacity);
console.log(`  paused frame opacity ${visible}`);
console.log(Number(visible) > 0.9 ? "  PASS frame held" : "  FAIL reverted to cover");

// 3. And clicking once more resumes that same card.
await frameButton(target).click();
now = await waitForPlaying(target);
console.log(`\nclick again    -> card ${now} playing`);
console.log(now === target ? "  PASS resumed same card" : `  FAIL got ${now}`);

await browser.close();
