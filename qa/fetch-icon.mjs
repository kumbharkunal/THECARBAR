import { chromium } from "playwright";

/** One-off: locate the official Instagram mark on thesvg.org. */
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage();

const svgUrls = new Set();
page.on("response", (r) => {
  if (/\.svg(\?|$)/i.test(r.url())) svgUrls.add(r.url());
});

try {
  await page.goto("https://thesvg.org/", { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(2500);
  console.log("title:", await page.title());

  const searchSel = 'input[type="search"], input[name="s"], input[placeholder*="earch" i]';
  const hasSearch = await page.$(searchSel);
  if (hasSearch) {
    await page.fill(searchSel, "instagram");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(4000);
    console.log("after search:", page.url());
  } else {
    console.log("no search input");
  }

  const links = await page.evaluate(() =>
    [...document.querySelectorAll("a")]
      .filter((a) => /insta/i.test(a.href) || /insta/i.test(a.textContent || ""))
      .slice(0, 12)
      .map((a) => `${a.href} | ${(a.textContent || "").trim().slice(0, 50)}`),
  );
  console.log("instagram links:", links.length);
  links.forEach((l) => console.log("  " + l));

  const inline = await page.evaluate(() => {
    const hits = [];
    for (const el of document.querySelectorAll("[class*='insta' i], [alt*='insta' i], [title*='insta' i]")) {
      hits.push(el.tagName + " " + (el.getAttribute("src") || el.getAttribute("alt") || el.className).toString().slice(0, 80));
    }
    return hits.slice(0, 8);
  });
  console.log("inline instagram elements:", inline);
} catch (e) {
  console.log("error:", e.message);
}

console.log("svg responses:", [...svgUrls].slice(0, 10));
await browser.close();
