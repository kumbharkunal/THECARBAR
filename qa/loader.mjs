import { chromium } from "playwright";

/**
 * The loader must always leave. Three ways it can be asked to:
 *  1. normally, on `load`
 *  2. with reduced motion, before the first paint
 *  3. when hydration never happens at all — the CSS backstop
 *
 * Case 3 is the one worth the trouble: the JS timer only starts at hydration,
 * so on a slow connection it is exactly the wrong thing to depend on.
 */
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.BASE ?? "http://localhost:3111";
const browser = await chromium.launch({ executablePath: CHROME });

const present = (p) => p.evaluate(() => !!document.querySelector(".site-loader"));

// 1 — the normal path.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  const early = await present(page);
  await page.waitForTimeout(3000);
  const late = await present(page);
  const overflow = await page.evaluate(() => document.documentElement.style.overflow || "(cleared)");
  console.log(`normal      : shown=${early} gone=${!late} htmlOverflow=${overflow}`);

  // Once per session. sessionStorage is per-tab, so the check has to be a
  // reload of this tab — a second tab legitimately gets a fresh session.
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  console.log(`on reload   : shown again=${await present(page)} (expected false)`);
  await ctx.close();
}

// 2 — reduced motion never sees it.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(600);
  console.log(`reduced     : shown=${await present(page)} (expected false)`);
  await ctx.close();
}

// 3 — hydration never arrives; only CSS can rescue the page.
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.route("**/*.js", (r) => r.abort());
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(5200);
  const s = await page.evaluate(() => {
    const el = document.querySelector(".site-loader");
    if (!el) return { gone: true };
    const cs = getComputedStyle(el);
    const hit = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
    return {
      faded: +cs.opacity < 0.02,
      clickThrough: !hit?.closest?.(".site-loader"),
    };
  });
  console.log(`no hydration: ${JSON.stringify(s)} (expected faded+clickThrough)`);
  await page.close();
}

await browser.close();
