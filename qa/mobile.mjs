import { chromium } from "playwright";

/** Hunt for text that is too small, too cramped, or clipped on a phone. */
const BASE = process.env.BASE ?? "http://localhost:3111";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const W = Number(process.env.W ?? 390);
const H = Number(process.env.H ?? 844);

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(900);

const total = await page.evaluate(
  () => document.documentElement.scrollHeight - window.innerHeight,
);

const small = new Map();
const cramped = new Map();
const clipped = new Map();

for (let f = 0; f <= 1.0001; f += 0.05) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(total * f));
  await page.waitForTimeout(360);

  const found = await page.evaluate(() => {
    const out = { small: [], cramped: [], clipped: [] };
    for (const el of document.querySelectorAll("p,span,a,h1,h2,h3,li,dd,dt,button,figcaption")) {
      const txt = (el.textContent || "").trim();
      if (!txt || el.children.length) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || Number(cs.opacity) < 0.5) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      if (r.bottom < 0 || r.top > window.innerHeight) continue;

      const size = parseFloat(cs.fontSize);
      const tag = `${el.tagName}|${txt.slice(0, 34)}`;

      // Body copy under 12px is hard work on a phone.
      const isMono = cs.fontFamily.toLowerCase().includes("mono");
      if (size < (isMono ? 10.5 : 13)) out.small.push(`${size}px ${tag}`);

      // Line-height under 1.25 on multi-line body text reads as cramped.
      const lh = parseFloat(cs.lineHeight);
      if (lh && size >= 13 && lh / size < 1.25 && r.height > size * 1.6)
        out.cramped.push(`${size}px lh=${(lh / size).toFixed(2)} ${tag}`);

      // Text wider than its own box is being cut off.
      if (el.scrollWidth > el.clientWidth + 2 && cs.overflow !== "auto")
        out.clipped.push(`${el.scrollWidth}>${el.clientWidth} ${tag}`);
    }
    return out;
  });

  found.small.forEach((v) => small.set(v, 1));
  found.cramped.forEach((v) => cramped.set(v, 1));
  found.clipped.forEach((v) => clipped.set(v, 1));
}

const show = (label, m) => {
  if (!m.size) return console.log(`${label}: none`);
  console.log(`${label} (${m.size}):`);
  [...m.keys()].slice(0, 14).forEach((v) => console.log("   " + v));
};

console.log(`viewport ${W}x${H} — scroll ${total}px\n`);
show("TOO SMALL", small);
show("CRAMPED LINE-HEIGHT", cramped);
show("CLIPPED TEXT", clipped);

await browser.close();
