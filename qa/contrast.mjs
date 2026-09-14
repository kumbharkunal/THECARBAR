import { chromium } from "playwright";
import { PNG } from "pngjs";

/**
 * Contrast check that samples real rendered pixels.
 *
 * Computing contrast from CSS is unreliable here: Tailwind v4 emits oklab(),
 * backgrounds are translucent over other layers, and captions sit on gradients
 * over images. Reading the actual framebuffer sidesteps all of that.
 */

const BASE = process.env.BASE ?? "http://localhost:3111";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const srgb = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(900);

const total = await page.evaluate(
  () => document.documentElement.scrollHeight - window.innerHeight,
);

const failures = [];
let checked = 0;

for (const frac of [0, 0.08, 0.2, 0.33, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95, 1]) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(total * frac));
  await page.waitForTimeout(1800); // scrub needs time to settle before capture

  const targets = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll("p,span,a,h1,h2,h3,li,dd,dt,button,figcaption")) {
      if (!el.textContent?.trim() || el.children.length) continue;
      const cs = getComputedStyle(el);
      // Skip visually-hidden text and anything mid-fade.
      if (cs.clipPath !== "none" || cs.position === "absolute" && cs.width === "1px") continue;
      if (Number(cs.opacity) < 0.95 || cs.visibility === "hidden") continue;
      let p = el, faded = false;
      while (p && p !== document.body) {
        if (Number(getComputedStyle(p).opacity) < 0.95) { faded = true; break; }
        p = p.parentElement;
      }
      if (faded) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 6) continue;
      if (r.top < 80 || r.bottom > 900) continue; // clear of the fixed header
      const fg = (getComputedStyle(el).color.match(/\d+(\.\d+)?/g) || []).slice(0,3).map(Number);
      out.push({
        fg,
        text: el.textContent.trim().slice(0, 38),
        x: Math.round(r.x), y: Math.round(r.y),
        w: Math.round(r.width), h: Math.round(r.height),
        size: parseFloat(cs.fontSize),
        weight: Number(cs.fontWeight),
      });
    }
    return out;
  });

  if (!targets.length) continue;
  const shot = PNG.sync.read(await page.screenshot());

  for (const t of targets) {
    const px = [];
    for (let y = t.y; y < Math.min(t.y + t.h, shot.height); y++) {
      for (let x = t.x; x < Math.min(t.x + t.w, shot.width); x++) {
        const i = (shot.width * y + x) << 2;
        px.push([shot.data[i], shot.data[i + 1], shot.data[i + 2]]);
      }
    }
    if (px.length < 20) continue;

    // Background = the most common pixel in the box; text is always the minority.
    const tally = new Map();
    for (const p of px) {
      const k = `${p[0]},${p[1]},${p[2]}`;
      tally.set(k, (tally.get(k) || 0) + 1);
    }
    const [top, count] = [...tally].sort((a, b) => b[1] - a[1])[0];
    if (count / px.length < 0.25) continue; // box not dominated by one bg — skip
    const bg = top.split(",").map(Number);
    const r = ratio(t.fg, bg);
    checked++;

    const large = t.size >= 24 || (t.size >= 18.66 && t.weight >= 700);
    const min = large ? 3 : 4.5;
    if (r < min)
      failures.push(`${r.toFixed(2)}:1 (need ${min}) ${t.size}px fg=${t.fg} bg=${bg} "${t.text}"`);
  }
}

console.log(`text runs sampled from rendered pixels: ${checked}`);
if (failures.length) {
  const uniq = [...new Set(failures)];
  console.log(`CONTRAST FAILURES (${uniq.length}):`);
  uniq.slice(0, 20).forEach((f) => console.log("   " + f));
} else {
  console.log("contrast: all sampled text passes WCAG AA");
}

await browser.close();
