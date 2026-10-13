import { chromium } from "@playwright/test";
import { pathToFileURL } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";

const report = process.argv[2];
const directory = process.argv[3];
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ env: { ...process.env, ...(process.argv[4] ? { LD_LIBRARY_PATH: process.argv[4] } : {}) } });
const observations = { file: report, javaScriptEnabled: false, views: [], requests: [], print: null };
try {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  page.on("request", request => { if (!/^(file:|data:)/.test(request.url())) observations.requests.push(request.url()); });
  for (const [width, height] of [[360,800],[390,844],[768,1024],[1280,800],[1440,900],[1920,1080]]) {
    await page.setViewportSize({ width, height });
    await page.goto(pathToFileURL(report).href);
    await page.screenshot({ path: `${directory}/summary-${width}.png` });
    const question = page.locator("#improvements .question-card").first();
    await question.locator("summary").focus();
    await page.keyboard.press("Enter");
    if (!(await question.getAttribute("open") !== null)) throw new Error("Keyboard expansion failed");
    await question.screenshot({ path: `${directory}/question-${width}.png` });
    observations.views.push({ width, height, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), question: (await question.innerText()).slice(0, 250) });
    if (width === 1440) await page.locator("#change-analysis").screenshot({ path: `${directory}/change-analysis.png` });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(pathToFileURL(report).href);
  await page.emulateMedia({ reducedMotion: "reduce" });
  if (await page.locator("html").evaluate(el => getComputedStyle(el).scrollBehavior) !== "auto") throw new Error("Reduced motion ignored");
  await page.emulateMedia({ media: "print" });
  observations.print = await page.locator(".question-card .investigation").evaluateAll(elements => elements.map(el => ({ height: el.getBoundingClientRect().height, visibility: getComputedStyle(el).visibility })));
  if (observations.print.some(el => el.height <= 0 || el.visibility !== "visible")) throw new Error("Collapsed evidence missing in print");
  await page.pdf({ path: `${directory}/report.pdf`, format: "A4", printBackground: true });
  await page.screenshot({ path: `${directory}/print-preview.png` });
  await page.emulateMedia({ media: "screen" });
  await page.goto(pathToFileURL(report).href);
  await page.locator("body").evaluate(el => { el.style.filter = "grayscale(1)"; });
  await page.locator("#change-analysis").screenshot({ path: `${directory}/grayscale-changes.png` });
  if (observations.requests.length || observations.views.some(view => view.overflow)) throw new Error(JSON.stringify(observations));
} finally {
  await writeFile(`${directory}/observations.json`, JSON.stringify(observations, null, 2) + "\n");
  await browser.close();
}
