import { chromium } from "playwright";

const BASE = "http://localhost:3111";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ executablePath: CHROME });

/** Anything carrying text must be readable, whatever the motion preference. */
async function hiddenContent(page) {
  return page.evaluate(() => {
    const bad = [];
    const check = (sel, label) => {
      for (const el of document.querySelectorAll(sel)) {
        const cs = getComputedStyle(el);
        const text = (el.textContent || "").trim();
        if (!text) continue;
        const op = Number(cs.opacity);
        if (op < 0.25 || cs.visibility === "hidden" || cs.display === "none") {
          bad.push(`${label} "${text.slice(0, 45)}" opacity=${cs.opacity} vis=${cs.visibility}`);
        }
      }
    };
    check("h1, h2, h3", "heading");
    check("[data-beat]", "beat");
    check(".a2-chain, .a2-match-card", "act2-block");
    check("a[href]", "link");
    return bad;
  });
}

for (const mode of ["reduce", "no-preference"]) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: mode,
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);

  // Walk the whole page so every scroll-triggered state gets a chance to run.
  const total = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight,
  );
  const found = new Set();
  for (let f = 0; f <= 1.001; f += 0.05) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(total * f));
    await page.waitForTimeout(300);
    (await hiddenContent(page)).forEach((b) => found.add(b));
  }

  console.log(`\n===== prefers-reduced-motion: ${mode} =====`);
  console.log(`scrollable: ${total}px`);
  console.log(errs.length ? `ERRORS: ${errs.join(" | ")}` : "no console/page errors");
  if (found.size) {
    console.log(`content hidden at some scroll position (${found.size}):`);
    [...found].slice(0, 12).forEach((b) => console.log("   " + b));
  } else {
    console.log("no text content left hidden");
  }

  await page.screenshot({ path: `qa/shots/reduced-${mode}.png` });
  await ctx.close();
}

// --- JavaScript disabled ---
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  javaScriptEnabled: false,
});
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(600);
const noJs = await page.evaluate(() => ({
  h1: document.querySelector("h1")?.textContent?.trim(),
  headings: document.querySelectorAll("h2, h3").length,
  links: document.querySelectorAll("a[href]").length,
  bodyText: document.body.innerText.replace(/\s+/g, " ").length,
}));
console.log("\n===== JavaScript disabled =====");
console.log(JSON.stringify(noJs, null, 1));
await page.screenshot({ path: "qa/shots/nojs.png" });
await ctx.close();

await browser.close();
