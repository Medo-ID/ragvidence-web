import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdir, writeFile, readFile, readdir } from "node:fs/promises";
import { once } from "node:events";

const milestone = process.argv[2] ?? "review";
const directory = `verification/identity/${milestone}`;
await mkdir(directory, { recursive: true });
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3003"], { stdio: ["ignore", "pipe", "pipe"] });
let log = "";
server.stdout.on("data", chunk => { log += chunk; });
server.stderr.on("data", chunk => { log += chunk; });
let browser;
const observations = { milestone, build: "Webpack; standard Turbopack confirmation pending", views: [], errors: [], external: [] };
try {
  for (let i = 0; i < 120 && !log.includes("Ready in"); i++) {
    if (server.exitCode !== null) throw new Error(log);
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!log.includes("Ready in")) throw new Error(log);
  browser = await chromium.launch({ env: { ...process.env, ...(process.argv[3] ? { LD_LIBRARY_PATH: process.argv[3] } : {}) } });
  const page = await browser.newPage();
  page.on("pageerror", error => observations.errors.push(error.message));
  page.on("request", request => { if (!request.url().startsWith("http://127.0.0.1:3003") && !request.url().startsWith("data:")) observations.external.push(request.url()); });
  const widths = milestone === "milestone-9" || milestone === "milestone-11" || milestone === "baseline-web" ? [[360,800],[390,844],[768,1024],[1280,800],[1440,900],[1920,1080]] : [[390,844],[1440,900]];
  for (const [width, height] of widths) {
    await page.setViewportSize({ width, height });
    for (const [name, route] of [["landing", "/"], ["docs", "/docs/semantic-workflow"], ["report", "/sample-report.html"]]) {
      await page.goto(`http://127.0.0.1:3003${route}`, { waitUntil: "networkidle" });
      await page.screenshot({ path: `${directory}/${name}-${width}.png` });
      observations.views.push({ route, width, height, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), font: await page.locator("body").evaluate(el => getComputedStyle(el).fontFamily) });
      if (name === "landing" && width === 1440) {
        for (const id of ["proof", "plans"]) {
          await page.locator(`#${id}`).screenshot({ path: `${directory}/${id}.png` });
        }
      }
      if (name === "docs" && width === 390) {
        const disclosures = page.locator("details");
        for (const element of await disclosures.all()) await element.evaluate(el => { el.open = true; });
        await page.screenshot({ path: `${directory}/docs-disclosures.png` });
      }
    }
  }
  const cssFiles = await readdir(".next/static/css");
  const css = await Promise.all(cssFiles.map(file => readFile(`.next/static/css/${file}`, "utf8")));
  observations.cssBytes = css.reduce((sum, value) => sum + Buffer.byteLength(value), 0);
  observations.utilitiesCompiled = css.some(value => value.includes(".flex{") && value.includes(".text-ink")) && css.every(value => !value.includes("@theme"));
  if (!observations.utilitiesCompiled || observations.views.some(view => view.overflow) || observations.errors.length || observations.external.length) throw new Error(JSON.stringify(observations));
} finally {
  await writeFile(`${directory}/observations.json`, JSON.stringify(observations, null, 2) + "\n");
  await browser?.close();
  const closed = once(server, "close");
  server.kill("SIGTERM");
  await closed;
}
