import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3111";
const OUT = process.env.OUT ?? "qa/shots";
const CHROME =
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900 },
  { name: "1280", width: 1280, height: 820 },
  { name: "1024", width: 1024, height: 768 },
  { name: "768", width: 768, height: 1024 },
  { name: "430", width: 430, height: 932 },
  { name: "390", width: 390, height: 844 },
  { name: "360", width: 360, height: 780 },
];

// Scroll depths sampled as a fraction of total scrollable height.
const STOPS = [0, 0.08, 0.16, 0.26, 0.36, 0.46, 0.56, 0.66, 0.76, 0.86, 0.94, 1];

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME });
const problems = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion: process.env.REDUCED === "1" ? "reduce" : "no-preference",
  });
  const page = await context.newPage();

  // Only our own origin's errors count. The Instagram reel embeds report their
  // own CSP warnings from inside their iframes, which we neither cause nor can fix.
  const OURS = new URL(BASE).origin;
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const from = msg.location()?.url ?? "";
    if (from && !from.startsWith(OURS)) return;
    problems.push(`[${vp.name}] console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => problems.push(`[${vp.name}] pageerror: ${err.message}`));

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);

  // Horizontal overflow is the single most likely responsive failure here.
  //
  // Test whether the page can ACTUALLY be scrolled sideways, not whether
  // scrollWidth exceeds clientWidth: body has `overflow-x: clip`, under which
  // scrollWidth still reports the unclipped content width even though nothing
  // is reachable or visible. Comparing those two cried wolf on every rail that
  // legitimately bleeds past its parent.
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const before = window.scrollX;
    window.scrollTo(99999, window.scrollY);
    const reached = window.scrollX;
    window.scrollTo(0, window.scrollY);

    const offenders = [];
    if (reached > before) {
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.right > doc.clientWidth + 1 || r.left < -1) {
          const style = getComputedStyle(el);
          if (style.overflowX === "auto" || style.overflowX === "scroll") continue;
          offenders.push(
            `${el.tagName}.${String(el.className).slice(0, 60)} right=${Math.round(r.right)} left=${Math.round(r.left)}`,
          );
        }
      }
    }
    return { scrollable: reached > before, reached, offenders: offenders.slice(0, 6) };
  });

  if (overflow.scrollable) {
    const detail = overflow.offenders.join(" | ");
    problems.push(`[${vp.name}] H-SCROLLABLE to ${overflow.reached}px :: ${detail}`);
  }

  const total = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight,
  );

  for (const [i, stop] of STOPS.entries()) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(total * stop));
    await page.waitForTimeout(650);
    await page.screenshot({
      path: `${OUT}/${vp.name}-${String(i).padStart(2, "0")}.png`,
    });
  }

  await context.close();
}

await browser.close();

if (problems.length) {
  console.log("PROBLEMS FOUND:\n" + problems.join("\n"));
} else {
  console.log("No console errors, page errors, or horizontal overflow.");
}
