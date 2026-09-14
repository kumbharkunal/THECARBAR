import { chromium } from "playwright";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.BASE ?? "http://localhost:3111";
const browser = await chromium.launch({ executablePath: CHROME });
for (const W of [320, 360, 390, 430, 540, 640, 768, 1024, 1280, 1440]) {
  const page = await browser.newPage({ viewport: { width: W, height: 800 } });
  await page.goto(BASE, { waitUntil: "load" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);
  const r = await page.evaluate(() => {
    // Real scrollability, not scrollWidth (meaningless under overflow-x: clip).
    const before = window.scrollX;
    window.scrollTo(9999, window.scrollY);
    const canScroll = window.scrollX > before;
    window.scrollTo(before, window.scrollY);
    // Widest offender, if any.
    let worst = null;
    for (const el of document.querySelectorAll("body *")) {
      const b = el.getBoundingClientRect();
      if (b.width === 0) continue;
      const over = Math.round(b.right - innerWidth);
      if (over > 1 && (!worst || over > worst.over)) {
        worst = { over, tag: el.tagName.toLowerCase(), cls: (el.className || "").toString().slice(0, 50) };
      }
    }
    return { canScroll, innerWidth, worst };
  });
  console.log(`${W}px  hScroll=${r.canScroll}  ${r.worst ? "widest overhang: " + JSON.stringify(r.worst) : "no overhang"}`);
  await page.close();
}
await browser.close();
