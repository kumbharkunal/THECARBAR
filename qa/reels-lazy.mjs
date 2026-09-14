/**
 * The rail starts with a handful of reels and grows as it is scrolled, and the
 * FIRST reel is the one that plays — not whichever card the rail centres.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3111";

const browser = await chromium.launch({
  args: ["--autoplay-policy=no-user-gesture-required"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const requests = [];
page.on("request", (r) => {
  const u = r.url();
  if (/\/api\/reel\/|\/_next\/image/.test(u)) requests.push(u);
});

await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForFunction(
  () => {
    const l = document.querySelector(".site-loader");
    return !l || getComputedStyle(l).opacity === "0";
  },
  { timeout: 15000 },
);
await page.locator("#stories").scrollIntoViewIfNeeded();
await page.waitForTimeout(700);

const cards = () => page.locator("#stories article").count();
const playingIndex = () =>
  page.$$eval("#stories article", (arts) =>
    arts.findIndex((a) => {
      const v = a.querySelector("video");
      return v && !v.paused && v.readyState > 2;
    }),
  );

console.log(`initial cards : ${await cards()}`);
console.log((await cards()) === 5 ? "  PASS starts with 5" : "  FAIL expected 5");

// First reel must be the one playing.
let idx = -1;
for (let i = 0; i < 60 && idx !== 0; i++) {
  idx = await playingIndex();
  if (idx === 0) break;
  await page.waitForTimeout(500);
}
console.log(`\nplaying card  : ${idx}`);
console.log(idx === 0 ? "  PASS first reel plays" : `  FAIL card ${idx} plays, expected 0`);

const videoReqs = requests.filter((u) => u.includes("/api/reel/")).length;
console.log(`\nvideo requests while idle: ${videoReqs}`);
console.log(
  videoReqs <= 1 ? "  PASS only the playing reel fetched" : `  FAIL ${videoReqs} videos pulled`,
);

// Growing the rail by scrolling it.
let before = await cards();
for (let step = 1; step <= 4; step++) {
  await page.locator("#stories .rail-scroll").evaluate((el) => {
    el.scrollTo({ left: el.scrollWidth, behavior: "instant" });
  });
  await page.waitForTimeout(1200);
  const now = await cards();
  console.log(`scroll ${step}      : ${before} -> ${now} cards`);
  if (now === before) break;
  before = now;
}

console.log(`\nfinal cards   : ${before}`);
console.log(before > 5 ? "  PASS rail grew on scroll" : "  FAIL never grew");

await browser.close();
