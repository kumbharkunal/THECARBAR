import { chromium } from "playwright";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.BASE ?? "http://localhost:3112";
const browser = await chromium.launch({ executablePath: CHROME });
for (const [W, H, tag] of [[1440, 900, "d"], [390, 844, "m"]]) {
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto(BASE, { waitUntil: "load" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 45));
    }
  });
  await page.evaluate(() => document.querySelector("#stories .rail-scroll").scrollIntoView({ block: "center" }));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `qa/shots/reels-${tag}.png` });
  await page.close();
}
await browser.close();
