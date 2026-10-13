import { chromium, firefox, expect } from "@playwright/test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const engine = process.argv[3] ?? "chromium";
if (!["chromium", "firefox"].includes(engine)) throw new Error("Unknown browser");
const directory = `verification/identity/brand-assets/after-${engine}`;
await mkdir(directory, { recursive: true });
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3003"], { stdio: ["ignore", "pipe", "pipe"] });
let log = "", browser;
server.stdout.on("data", chunk => { log += chunk; });
server.stderr.on("data", chunk => { log += chunk; });
const results = { engine, views: [], icons: [], errors: [], external: [] };
try {
  for (let i = 0; i < 120 && !log.includes("Ready in"); i++) {
    if (server.exitCode !== null) throw new Error(log);
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!log.includes("Ready in")) throw new Error(log);
  browser = await ({ chromium, firefox })[engine].launch({ env: { ...process.env, LD_LIBRARY_PATH: process.argv[2] ?? "" }, ...(engine === "chromium" ? { ignoreDefaultArgs: ["--hide-scrollbars"] } : {}) });
  const page = await browser.newPage();
  page.on("pageerror", error => results.errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") results.errors.push(message.text()); });
  page.on("request", request => { if (!request.url().startsWith("http://127.0.0.1:3003") && !request.url().startsWith("data:")) results.external.push(request.url()); });
  for (const [width, height] of [[360,800],[390,844],[768,1024],[1280,800],[1440,900],[1920,1080]]) {
    await page.setViewportSize({ width, height });
    await page.goto("http://127.0.0.1:3003/", { waitUntil: "networkidle" });
    const brand = page.locator("header").getByRole("link", { name: "RAGvidence home" });
    await expect.poll(() => brand.locator("img").evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
    await page.screenshot({ path: `${directory}/landing-${width}.png` });
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${directory}/footer-${width}.png` });
    await page.goto("http://127.0.0.1:3003/docs/semantic-workflow", { waitUntil: "networkidle" });
    await page.screenshot({ path: `${directory}/docs-${width}.png` });
    await brand.focus();
    const outline = await brand.evaluate(el => getComputedStyle(el).outlineWidth);
    const box = await brand.boundingBox();
    if (outline === "0px" || box.height < 44) throw new Error("Brand link lost accessible focus/target");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("http://127.0.0.1:3003/");
    results.views.push({ width, height, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), brandWidth: box.width, brandHeight: box.height, focusOutline: outline });
  }
  for (const route of ["/", "/docs/installation", "/privacy"]) {
    await page.goto(`http://127.0.0.1:3003${route}`);
    const links = await page.locator('link[rel="icon"], link[rel="apple-touch-icon"]').evaluateAll(elements => elements.map(el => ({ href: el.getAttribute("href"), type: el.getAttribute("type"), sizes: el.getAttribute("sizes") })));
    for (const prefix of ["/favicon.ico", "/icon.svg", "/apple-icon.png"]) if (!links.some(link => link.href.startsWith(prefix))) throw new Error(`Missing ${prefix} on ${route}`);
    for (const link of links) {
      const response = await page.request.get(new URL(link.href, page.url()).href);
      if (!response.ok()) throw new Error(`Broken icon ${link.href}`);
    }
    results.icons.push({ route, links });
  }
  // Inspect actual ICO frames at native sizes, not enlarged favicon substitutes.
  const ico = await readFile("src/app/favicon.ico"), frames = [];
  for (let i = 0; i < ico.readUInt16LE(4); i++) {
    const entry = 6 + 16 * i, size = ico[entry] || 256;
    const offset = ico.readUInt32LE(entry + 12), length = ico.readUInt32LE(entry + 8);
    const png = ico.subarray(offset, offset + length), metadata = await sharp(png).metadata();
    if (metadata.width !== size || metadata.height !== size) throw new Error("Incorrect ICO frame dimensions");
    frames.push({ size, url: `data:image/png;base64,${png.toString("base64")}` });
  }
  const asset = async name => `data:image/svg+xml;base64,${(await readFile(`public/brand/${name}`)).toString("base64")}`;
  const dark = await asset("ragvidence-logo.svg"), light = await asset("ragvidence-logo-light.svg"), mark = await asset("ragvidence-mark.svg");
  await page.setViewportSize({ width: 1100, height: 700 });
  await page.setContent(`<!doctype html><html lang="en"><head><title>RAGvidence brand review</title><style>body{margin:0;background:#050809;font:16px system-ui;color:#f2f6f5}main{padding:32px}h1{font-size:22px;margin:0 0 24px}.panels{display:grid;grid-template-columns:1fr 1fr;gap:24px}.panel{padding:32px;border:1px solid #1b3438;border-radius:12px}.light{background:#f2f6f5;color:#17212b}.logo{width:366px;height:60px}.frames{display:flex;align-items:center;gap:32px;margin-top:48px}.frames figure{margin:0;text-align:center}.frames figcaption{font-size:12px;margin-top:12px}.mark{width:96px;height:96px}p{color:#a4b0ae;line-height:1.7}</style></head><body><main><h1>RAGvidence · logo and favicon review</h1><div class="panels">${[[dark, ""], [light, "light"]].map(([logo, theme]) => `<div class="panel ${theme}"><img class="logo" alt="RAGvidence logo" src="${logo}"><div class="frames"><img class="mark" alt="R mark" src="${mark}">${frames.map(frame => `<figure><img width="${frame.size}" height="${frame.size}" alt="${frame.size}px favicon" src="${frame.url}"><figcaption>${frame.size}px</figcaption></figure>`).join("")}</div></div>`).join("")}</div><p>Abyssal Teal #063f47 · off-white #f2f6f5 · pale teal #8bd4db<br>Outlined Geist wordmark · transparent vector exports · native ICO frames</p></main></body></html>`);
  await page.screenshot({ path: `${directory}/logo-review.png` });
  if (results.views.some(view => view.overflow) || results.errors.length || results.external.length) throw new Error(JSON.stringify(results));
} finally {
  await writeFile(`${directory}/observations.json`, JSON.stringify(results, null, 2) + "\n");
  await browser?.close(); const closed = once(server, "close"); server.kill("SIGTERM"); await closed;
}
