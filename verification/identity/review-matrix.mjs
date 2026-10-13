import { chromium } from "@playwright/test";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const directory = "verification/identity/milestone-9-matrix";
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ env: { ...process.env, LD_LIBRARY_PATH: process.argv[2] ?? process.env.LD_LIBRARY_PATH ?? "" } });
const results = [];
try {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const remote = [];
  page.on("request", request => { if (!/^(file:|data:)/.test(request.url())) remote.push(request.url()); });
  for (const file of await readdir("/tmp/ragvidence-report-matrix")) {
    for (const width of [360, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(pathToFileURL(`/tmp/ragvidence-report-matrix/${file}`).href);
      for (const summary of await page.locator(".question-card summary").all()) { await summary.focus(); await page.keyboard.press("Enter"); }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      const executableTags = await page.locator("script, img, iframe, link").count();
      results.push({ file, width, overflow, executableTags });
      if (overflow || executableTags) throw new Error(JSON.stringify(results));
      if (file.startsWith("long")) await page.locator(".question-card").first().screenshot({ path: `${directory}/long-question-${width}.png` });
    }
  }
  if (remote.length) throw new Error(JSON.stringify(remote));
} finally {
  await writeFile(`${directory}/results.json`, JSON.stringify(results, null, 2) + "\n");
  await browser.close();
}
