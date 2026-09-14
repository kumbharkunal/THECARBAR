import { chromium } from "playwright";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.BASE ?? "http://localhost:3111";
const browser = await chromium.launch({ executablePath: CHROME });

for (const [W, H] of [[390, 844], [430, 932], [768, 1024], [1280, 800], [1440, 900]]) {
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto(BASE, { waitUntil: "load" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
  });
  await page.waitForTimeout(900);
  const r = await page.evaluate(() => {
    const lens = document.querySelector(".cta-lens");
    const sec = lens.closest("section");
    sec.scrollIntoView({ block: "center" });
    return new Promise((res) => setTimeout(() => {
      const svg = lens.querySelector("svg");
      const vb = svg.viewBox.baseVal;
      const box = svg.getBoundingClientRect();
      const k = box.width / vb.width;          // artboard units -> px
      const gcx = box.left + (300 - vb.x) * k;
      const gcy = box.top + (268 - vb.y) * k;
      const gr = 150 * k;
      const para = sec.querySelectorAll("p")[1].getBoundingClientRect();
      const note = sec.querySelectorAll("p")[2].getBoundingClientRect();
      const btn = sec.querySelector("a").getBoundingClientRect();
      const tipY = box.top + (438 - vb.y) * k + 13 * k;
      return res({
        glassDia: Math.round(gr * 2),
        btnW: Math.round(btn.width),
        btnFitsGlass: Math.round(gr * 2 - btn.width),
        centringX: Math.round(gcx - (btn.left + btn.width / 2)),
        centringY: Math.round(gcy - (btn.top + btn.height / 2)),
        glassTopMinusParaBottom: Math.round(gcy - gr - para.bottom),
        noteTopMinusHandleTip: Math.round(note.top - tipY),
        secOverflowL: Math.round(sec.getBoundingClientRect().left - (gcx - gr)),
      });
    }, 500));
  });
  console.log(`${W}x${H}`, JSON.stringify(r));
  await page.close();
}
await browser.close();
