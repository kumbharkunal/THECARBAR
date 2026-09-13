import { chromium } from "playwright";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const byType = {};
let total = 0;
page.on("response", async (r) => {
  try {
    const h = r.headers();
    const len = Number(h["content-length"] || 0);
    const t = (h["content-type"] || "other").split(";")[0];
    byType[t] = (byType[t] || 0) + len;
    total += len;
  } catch {}
});
await page.goto("http://localhost:3111", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
console.log("=== INITIAL PAGE WEIGHT (transferred, content-length) ===");
Object.entries(byType).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) =>
  console.log(`  ${(v/1024).toFixed(1).padStart(8)} KB  ${k}`));
console.log(`  ${(total/1024).toFixed(1).padStart(8)} KB  TOTAL`);

const metrics = await page.evaluate(() => {
  const nav = performance.getEntriesByType("navigation")[0];
  const paints = performance.getEntriesByType("paint");
  return {
    domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
    load: Math.round(nav.loadEventEnd),
    fcp: Math.round(paints.find(p=>p.name==="first-contentful-paint")?.startTime ?? -1),
  };
});
console.log("\n=== TIMING (local, uncached) ===", JSON.stringify(metrics));
await browser.close();
