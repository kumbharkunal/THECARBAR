import { chromium } from "playwright";

/** Does Instagram's official /embed endpoint actually render in an iframe? */
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const IDS = ["Dcz-tbMsWPB", "DcvzZ8osrle", "Dcu6BkEs6Tx", "DcjXWkpstDs", "DcbahaHPWKv"];

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 420, height: 760 } });

for (const id of IDS) {
  const url = `https://www.instagram.com/reel/${id}/embed`;
  try {
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(3500);
    const info = await page.evaluate(() => {
      const text = document.body.innerText.slice(0, 160).replace(/\s+/g, " ");
      return {
        hasMedia: !!document.querySelector("img[srcset], video, .EmbeddedMedia, ._aagv img"),
        loginWall: /log in|sign up/i.test(document.body.innerText),
        text,
      };
    });
    console.log(`${id}: HTTP ${res?.status()} media=${info.hasMedia} loginWall=${info.loginWall}`);
    console.log(`   "${info.text}"`);
  } catch (e) {
    console.log(`${id}: ERROR ${e.message}`);
  }
}

await page.goto(`https://www.instagram.com/reel/${IDS[0]}/embed`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(4000);
await page.screenshot({ path: "qa/shots/reel-embed.png" });
await browser.close();
