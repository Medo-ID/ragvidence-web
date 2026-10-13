import { chromium, expect } from "@playwright/test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, writeFile } from "node:fs/promises";

const directory = "verification/identity/own-data-video";
await mkdir(directory, { recursive: true });
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3003"], { stdio: ["ignore", "pipe", "pipe"] });
let log = "", browser;
server.stdout.on("data", chunk => { log += chunk; }); server.stderr.on("data", chunk => { log += chunk; });
const results = { views: [], errors: [], external: [] };
try {
  for (let i = 0; i < 120 && !log.includes("Ready in"); i++) {
    if (server.exitCode !== null) throw new Error(log);
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!log.includes("Ready in")) throw new Error(log);
  browser = await chromium.launch({ env: { ...process.env, LD_LIBRARY_PATH: process.argv[2] ?? "" } });
  const page = await browser.newPage();
  page.on("pageerror", error => results.errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") results.errors.push(message.text()); });
  page.on("request", request => { if (!request.url().startsWith("http://127.0.0.1:3003") && !request.url().startsWith("data:")) results.external.push(request.url()); });
  for (const [width, height] of [[360,800],[390,844],[768,1024],[1280,800],[1440,900],[1920,1080]]) {
    await page.setViewportSize({ width, height });
    await page.goto("http://127.0.0.1:3003/", { waitUntil: "networkidle" });
    const video = page.locator("#walkthrough video"), toggle = page.locator("#walkthrough button");
    await video.scrollIntoViewIfNeeded();
    await expect.poll(() => video.evaluate(el => !el.paused && el.currentTime > 0.2)).toBe(true);
    await toggle.click({ position: { x: 12, y: 12 } });
    await expect(toggle).toHaveAccessibleName("Play workflow video");
    await video.evaluate(el => new Promise(resolve => { el.addEventListener("seeked", resolve, { once: true }); el.currentTime = 5; }));
    await page.locator("#walkthrough .showcase").screenshot({ path: `${directory}/video-${width}-paused.png` });
    await page.screenshot({ path: `${directory}/page-${width}.png` });
    await toggle.click();
    await expect(toggle).toHaveAccessibleName("Pause workflow video");
    const resumed = await video.evaluate(el => el.currentTime);
    await expect.poll(() => video.evaluate(el => el.currentTime)).toBeGreaterThan(resumed);
    await page.locator("#install").scrollIntoViewIfNeeded();
    await expect.poll(() => video.evaluate(el => el.paused)).toBe(true);
    await video.scrollIntoViewIfNeeded();
    await expect(toggle).toHaveAccessibleName("Pause workflow video");
    results.views.push({ width, height, autoplay: true, cornerClickPause: true, centerClickResume: true, offscreenPauseAndReturnResume: true, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:3003/", { waitUntil: "networkidle" });
  const video = page.locator("#walkthrough video"); await video.scrollIntoViewIfNeeded();
  await expect(video.locator("source")).toHaveCount(0);
  await page.locator("#walkthrough .showcase").screenshot({ path: `${directory}/reduced-motion-poster.png` });
  if (results.errors.length || results.external.length || results.views.some(view => view.overflow)) throw new Error(JSON.stringify(results));
} finally {
  await writeFile(`${directory}/visual-observations.json`, JSON.stringify(results, null, 2) + "\n");
  await browser?.close(); const closed = once(server, "close"); server.kill("SIGTERM"); await closed;
}
