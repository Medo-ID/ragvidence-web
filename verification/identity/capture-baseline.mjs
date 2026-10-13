import { chromium } from "@playwright/test";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const destination = resolve("verification/identity/baseline");
await mkdir(destination, { recursive: true });
const browser = await chromium.launch();
const observations = { websiteSource: "https://ragvidence.medo-id.com (deployed baseline; local build blocked)", reportSource: "/tmp/ragvidence-identity-baseline/first-run/reports/tutorial.html", views: [], video: null };
try {
  const page = await browser.newPage();
  const report = pathToFileURL(observations.reportSource).href;
  let websiteAvailable = true;
  try {
    await page.goto("https://ragvidence.medo-id.com", { timeout: 15000 });
  } catch (error) {
    websiteAvailable = false;
    observations.websiteError = error.message;
  }
  for (const [width, height] of [[360, 800], [390, 844], [768, 1024], [1280, 800], [1440, 900], [1920, 1080]]) {
    for (const [name, url] of [["landing", observations.websiteSource.split(" ")[0]], ["docs", "https://ragvidence.medo-id.com/docs/semantic-workflow"], ["cli-report", report]]) {
      if (name !== "cli-report" && !websiteAvailable) {
        observations.views.push({ name, width, height, skipped: "Deployed hostname did not resolve; local build blocked." });
        continue;
      }
      const capturePage = await browser.newPage({ viewport: { width, height } });
      try {
        await capturePage.goto(url, { waitUntil: "networkidle", timeout: 30000 });
        await capturePage.screenshot({ path: `${destination}/${name}-${width}.png`, fullPage: true });
        await capturePage.screenshot({ path: `${destination}/${name}-${width}-viewport.png` });
        observations.views.push({ name, width, height, url: capturePage.url(), overflow: await capturePage.evaluate(() => document.documentElement.scrollWidth > innerWidth), title: await capturePage.title() });
      } catch (error) {
        observations.views.push({ name, width, height, error: error.message });
      } finally {
        await capturePage.close();
      }
    }
  }
  await page.goto("about:blank");
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(report);
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: `${destination}/cli-report-print.pdf`, format: "A4", printBackground: true });
  await page.screenshot({ path: `${destination}/cli-report-print-viewport.png` });
  await page.emulateMedia({ media: "screen" });
  await page.setContent('<html><body style="margin:0;background:#050809"><video style="width:1280px;height:720px" muted></video></body></html>');
  await page.locator("video").evaluate((element, url) => { element.src = url; }, pathToFileURL("/home/medo-id/projects/walkthrough.webm").href);
  await page.locator("video").evaluate(element => new Promise((resolve, reject) => { if (element.readyState >= 1) resolve(); else { element.addEventListener("loadedmetadata", resolve, { once: true }); element.addEventListener("error", () => reject(new Error("Video load failed")), { once: true }); } }));
  observations.video = await page.locator("video").evaluate(element => ({ width: element.videoWidth, height: element.videoHeight, duration: element.duration, audioTracks: element.audioTracks?.length ?? null, textTracks: element.textTracks.length }));
  for (const time of [1, 4, 8, 12, 16, 20, 23]) {
    await page.locator("video").evaluate((element, seconds) => new Promise(resolve => { element.addEventListener("seeked", resolve, { once: true }); element.currentTime = seconds; }), time);
    await page.screenshot({ path: `${destination}/video-${time}s.png` });
  }
} finally {
  await writeFile(`${destination}/observations.json`, JSON.stringify(observations, null, 2) + "\n");
  await writeFile(`${destination}/tutorial.html.gz`, gzipSync(await readFile(observations.reportSource)));
  await browser.close();
}
