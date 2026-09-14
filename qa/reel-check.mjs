import { chromium } from "playwright";

/**
 * Do the reels the page is actually showing resolve on Instagram?
 *
 * It reads the rendered page rather than a hard-coded list, so it checks
 * whatever source is live — the Apify scrape or the bundled fallback — and
 * cannot drift out of step with the data the way a duplicated list did.
 *
 *   BASE=http://localhost:3111 node qa/reel-check.mjs
 */
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.BASE ?? "http://localhost:3111";

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(BASE, { waitUntil: "load" });
await page.evaluate(() => document.querySelector("#stories")?.scrollIntoView());
await page.waitForTimeout(1200);

const cards = await page.evaluate(() => {
  const sec = document.querySelector("#stories");
  if (!sec) return null;
  return [...sec.querySelectorAll('a[href*="/reel/"]')].map((a) => {
    const img = a.querySelector("img");
    return {
      shortcode: a.href.match(/\/reel\/([A-Za-z0-9_-]+)/)?.[1],
      label: a.querySelector(".sr-only")?.textContent?.trim().slice(0, 70) ?? "",
      hasImage: !!img,
      // next/image rewrites the src, so the origin shows up in the ?url= param.
      src: img ? decodeURIComponent(img.getAttribute("src") ?? "") : null,
      iframes: a.querySelectorAll("iframe").length,
    };
  });
});

if (!cards) {
  console.log("#stories section not found");
  await browser.close();
  process.exit(1);
}

const real = cards.filter((c) => c.src && /cdninstagram|fbcdn/.test(c.src)).length;
console.log(`reels rendered : ${cards.length}`);
console.log(`real covers    : ${real}  (rest fall back to the MediaFrame composition)`);
console.log(`iframes        : ${cards.reduce((n, c) => n + c.iframes, 0)} (expected 0)`);
console.log("");

let bad = 0;
for (const c of cards) {
  const res = await page.request.get(`https://www.instagram.com/reel/${c.shortcode}/`, {
    maxRedirects: 3,
  });
  const body = (await res.text()).slice(0, 4000);
  const loginWall = /"login_required"|Log in to Instagram/i.test(body);
  const ok = res.status() === 200 && !loginWall;
  if (!ok) bad++;
  console.log(
    `${ok ? "ok  " : "FAIL"} ${c.shortcode}  http=${res.status()} loginWall=${loginWall}  ${c.label}`,
  );
}

await page.screenshot({ path: "qa/shots/reel-cards.png" });
await browser.close();
console.log(bad ? `\n${bad} reel(s) did not resolve` : "\nall reels resolve");
process.exit(bad ? 1 : 0);
