import { chromium } from "playwright";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.BASE ?? "http://localhost:3111";
const browser = await chromium.launch({ executablePath: CHROME });

for (const [W, H] of [[1280, 720], [1366, 768], [1440, 900], [1920, 1080]]) {
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto(BASE, { waitUntil: "load" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 45));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
  const g = await page.evaluate(() => {
    const el = document.querySelector("#act-two-title").closest("section");
    const r = el.getBoundingClientRect();
    return { top: Math.round(r.top + scrollY), h: Math.round(r.height) };
  });
  const line = [];
  for (const f of [0.4, 0.6, 0.85, 0.99]) {
    await page.evaluate((y) => window.scrollTo(0, y), g.top + g.h * f);
    await page.waitForTimeout(750);
    const m = await page.evaluate(() => {
      const sec = document.querySelector("#act-two-title").closest("section");
      // Bounding box of everything actually painted right now.
      let top = Infinity, bot = -Infinity;
      const walk = (el) => {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") return;
        if (+cs.opacity < 0.06) return;
        const r = el.getBoundingClientRect();
        const leaf = !el.children.length || el.tagName === "SVG" || el.tagName === "svg";
        if (leaf && r.height > 0 && r.width > 0 && el.textContent?.trim() !== "" || el.tagName.toLowerCase() === "svg") {
          top = Math.min(top, r.top); bot = Math.max(bot, r.bottom);
        }
        for (const c of el.children) walk(c);
      };
      walk(sec);
      return { top: Math.round(top), bot: Math.round(bot),
               offCentre: Math.round((top + bot) / 2 - innerHeight / 2),
               above: Math.round(top), below: Math.round(innerHeight - bot) };
    });
    line.push(`f=${f} off=${m.offCentre} above=${m.above} below=${m.below}`);
  }
  console.log(`${W}x${H}  ${line.join("  |  ")}`);
  await page.close();
}
await browser.close();
