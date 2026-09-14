import { chromium } from "playwright";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.BASE ?? "http://localhost:3111";
const browser = await chromium.launch({ executablePath: CHROME });
for (const [W, H] of [[1440, 900], [390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForTimeout(600);
  console.log(`${W}x${H} loaderPresent(should be false):`,
    await page.evaluate(() => !!document.querySelector(".site-loader")));
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40));
    }
  });
  await page.evaluate(() =>
    document.querySelector(".cta-lens").closest("section").scrollIntoView({ block: "center" }));
  await page.waitForTimeout(900);
  const s = await page.evaluate(() => {
    const g = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return "missing";
      const cs = getComputedStyle(el);
      return { op: (+cs.opacity).toFixed(2), tf: cs.transform.slice(0, 34) };
    };
    return { lens: g(".cta-lens"), word: g(".cta-word__inner"), rise: g(".cta-rise"), lock: g(".cta-lock") };
  });
  console.log(`${W}x${H} reduced-motion CTA:`, JSON.stringify(s));
  await page.screenshot({ path: `qa/shots/reduced-${W}.png` });
  await ctx.close();
}
await browser.close();
