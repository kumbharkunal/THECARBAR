import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3111";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ executablePath: CHROME });

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(900);

// ---- heading order ----
const headings = await page.evaluate(() =>
  [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
    level: Number(h.tagName[1]),
    text: (h.textContent || "").trim().slice(0, 48),
    sr: h.className.includes("sr-only"),
  })),
);
let prev = 0;
const orderIssues = [];
for (const h of headings) {
  if (prev && h.level > prev + 1)
    orderIssues.push(`h${prev} -> h${h.level} at "${h.text}"`);
  prev = h.level;
}
console.log(`headings: ${headings.length}, h1 count: ${headings.filter((h) => h.level === 1).length}`);
console.log(orderIssues.length ? `HEADING ORDER SKIPS: ${orderIssues.join("; ")}` : "heading order: ok");

// ---- text contrast + touch targets + link names ----
const results = await page.evaluate(() => {
  const parse = (s) => (s.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);
  const effectiveBg = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      const p = parse(bg);
      const alpha = bg.startsWith("rgba") ? Number(bg.split(",")[3]) : 1;
      if (p.length === 3 && alpha > 0.85) return p;
      n = n.parentElement;
    }
    return [244, 243, 239];
  };

  const text = [];
  for (const el of document.querySelectorAll("p,span,a,h1,h2,h3,li,dd,dt,button,figcaption")) {
    if (!el.textContent?.trim() || el.children.length) continue;
    const cs = getComputedStyle(el);
    if (Number(cs.opacity) < 0.9 || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    text.push({
      t: el.textContent.trim().slice(0, 34),
      fg: parse(cs.color),
      bg: effectiveBg(el),
      size: parseFloat(cs.fontSize),
      weight: cs.fontWeight,
    });
  }

  const small = [];
  for (const el of document.querySelectorAll("a[href], button")) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    if (r.height < 24 || r.width < 24)
      small.push(`${el.tagName} "${(el.textContent || "").trim().slice(0, 26)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
  }

  const unnamed = [];
  for (const el of document.querySelectorAll("a[href], button")) {
    const name =
      (el.textContent || "").trim() ||
      el.getAttribute("aria-label") ||
      el.querySelector(".sr-only")?.textContent?.trim();
    if (!name) unnamed.push(el.outerHTML.slice(0, 80));
  }

  const imgs = [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt"));
  return { text, small, unnamed, imgsNoAlt: imgs.length };
});

console.log(`
text nodes found: ${results.text.length} (contrast is checked by qa/contrast.mjs)`);

console.log(results.small.length ? `\nSMALL TARGETS (${results.small.length}): ${results.small.slice(0, 8).join(" | ")}` : "\ntouch targets: ok");
console.log(results.unnamed.length ? `UNNAMED CONTROLS: ${results.unnamed.join(" | ")}` : "accessible names: ok");
console.log(`images without alt: ${results.imgsNoAlt}`);

// ---- keyboard walk ----
// Real Tab presses: el.focus() does not reliably set :focus-visible, and it also
// reaches lg:hidden controls that a keyboard user never gets on this viewport.
// transition-colors animates outline-color, so settle before reading it.
const seen = [];
for (let i = 0; i < 24; i++) {
  await page.keyboard.press("Tab");
  await page.waitForTimeout(700);
  const info = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      name: ((el.textContent || "").trim() || el.getAttribute("aria-label") || "?").slice(0, 28),
      ring: cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0,
      color: cs.outlineColor,
      size: `${Math.round(r.width)}x${Math.round(r.height)}`,
    };
  });
  if (info) seen.push(info);
}
const noRing = seen.filter((s) => !s.ring);
const offBrand = seen.filter((s) => s.ring && s.color !== "rgb(69, 161, 23)");
console.log(`
keyboard-reachable controls walked: ${seen.length}`);
console.log(noRing.length ? `NO FOCUS RING: ${noRing.map((n) => n.name).join(", ")}` : "focus rings: all present");
console.log(offBrand.length ? `OFF-BRAND RING COLOUR: ${offBrand.map((n) => n.name + " " + n.color).join(", ")}` : "focus ring colour: brand green throughout");

await browser.close();
