import { chromium } from "playwright";

/** Walk one section slowly and capture it, so a specific complaint can be seen. */
const BASE = process.env.BASE ?? "http://localhost:3111";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const SEL = process.env.SEL ?? "#act-one-title";
const W = Number(process.env.W ?? 390);
const H = Number(process.env.H ?? 844);
const TAG = process.env.TAG ?? "sec";
const STEPS = Number(process.env.STEPS ?? 7);

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(900);

const box = await page.evaluate((sel) => {
  const el = document.querySelector(sel);
  if (!el) return null;
  const sec = el.closest("section") ?? el;
  const r = sec.getBoundingClientRect();
  return { top: r.top + window.scrollY, height: r.height };
}, SEL);

if (!box) {
  console.log(`selector not found: ${SEL}`);
} else {
  console.log(`${SEL}: docTop=${Math.round(box.top)} height=${Math.round(box.height)} (viewport ${H})`);
  const start = Math.max(0, box.top - H * 0.35);
  const span = box.height + H * 0.7;
  for (let i = 0; i < STEPS; i++) {
    const y = Math.round(start + (span * i) / (STEPS - 1));
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(900);
    const state = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      const sec = el?.closest("section");
      const stage = sec?.querySelector(".a1-stage");
      const q = sec?.querySelector(".a1-question");
      return {
        stageOpacity: stage ? getComputedStyle(stage).opacity : "-",
        stageTransform: stage ? getComputedStyle(stage).transform.slice(0, 30) : "-",
        questionOpacity: q ? getComputedStyle(q).opacity : "-",
      };
    }, SEL);
    console.log(`  step ${i} y=${y} ${JSON.stringify(state)}`);
    await page.screenshot({ path: `qa/shots/${TAG}-${W}-${i}.png` });
  }
}

await browser.close();
