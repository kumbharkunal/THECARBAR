import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3111";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const W = Number(process.env.W ?? 1440);
const H = Number(process.env.H ?? 900);

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(700);

const total = await page.evaluate(
  () => document.documentElement.scrollHeight - window.innerHeight,
);
console.log(`viewport ${W}x${H}  scrollable=${total}px  pages=${(total / H).toFixed(1)}`);

const SELECTORS = [
  ["header", "header"],
  ["act1 title", "#act-one-title"],
  ["act2 caption", "[data-beat='hub']"],
  ["act2 svg", ".net-desktop"],
  ["how title", "#how-title"],
];

for (const frac of [0.1, 0.18, 0.28, 0.4, 0.52]) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(total * frac));
  await page.waitForTimeout(500);
  const rows = await page.evaluate((sels) => {
    return sels.map(([name, sel]) => {
      const el = document.querySelector(sel);
      if (!el) return `${name}: absent`;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return `${name}: top=${Math.round(r.top)} bottom=${Math.round(r.bottom)} h=${Math.round(r.height)} op=${cs.opacity}`;
    });
  }, SELECTORS);
  console.log(`\n-- scroll ${(frac * 100).toFixed(0)}% --`);
  rows.forEach((r) => console.log("   " + r));
}

await browser.close();
