import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3111";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(800);

// Map the document: every top-level section and pin-spacer, in order.
const layout = await page.evaluate(() => {
  const out = [];
  const walk = (node, depth) => {
    for (const el of node.children) {
      const cls = String(el.className);
      const isSpacer = cls.includes("pin-spacer");
      const isSection = el.tagName === "SECTION" || el.tagName === "FOOTER";
      if (isSpacer || isSection) {
        const r = el.getBoundingClientRect();
        out.push(
          `${"  ".repeat(depth)}${isSpacer ? "SPACER" : el.tagName}#${el.id || "-"} ` +
            `docTop=${Math.round(r.top + window.scrollY)} h=${Math.round(r.height)} ` +
            `bg=${getComputedStyle(el).backgroundColor}`,
        );
        if (isSpacer) walk(el, depth + 1);
      } else if (depth < 2) {
        walk(el, depth);
      }
    }
  };
  walk(document.body, 0);
  return out;
});

console.log("=== DOCUMENT LAYOUT (scroll 0) ===");
layout.forEach((l) => console.log(l));

// Probe what is actually painted at the centre of the viewport across the scroll.
const total = await page.evaluate(
  () => document.documentElement.scrollHeight - window.innerHeight,
);
console.log(`\n=== WHAT IS AT VIEWPORT CENTRE (total=${total}) ===`);
for (let f = 0.3; f <= 0.55; f += 0.025) {
  const y = Math.round(total * f);
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(420);
  const info = await page.evaluate(() => {
    const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    if (!el) return "none";
    const owner = el.closest("section, footer");
    const bg = getComputedStyle(document.elementFromPoint(30, window.innerHeight / 2)).backgroundColor;
    return `hit=${el.tagName}.${String(el.className).slice(0, 34)} owner=${owner ? owner.tagName + "#" + (owner.id || "-") : "NONE"} leftBg=${bg}`;
  });
  console.log(`  ${(f * 100).toFixed(1)}% y=${y}  ${info}`);
}

await browser.close();
