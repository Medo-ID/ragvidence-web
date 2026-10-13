import { chromium, firefox, expect } from "@playwright/test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, writeFile } from "node:fs/promises";

const stage = process.argv[2], engine = process.argv[4] ?? "chromium";
if (!/^(before|after)$/.test(stage ?? "") || !["chromium", "firefox"].includes(engine)) throw new Error("Provide before/after and an optional browser engine");
const directory = `verification/identity/finishing-touches/${stage}-${engine}`;
await mkdir(directory, { recursive: true });
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3003"], { stdio: ["ignore", "pipe", "pipe"] });
let log = "", browser;
server.stdout.on("data", chunk => { log += chunk; }); server.stderr.on("data", chunk => { log += chunk; });
const results = { stage, engine, views: [], errors: [], external: [] };
try {
  for (let i = 0; i < 120 && !log.includes("Ready in"); i++) {
    if (server.exitCode !== null) throw new Error(log);
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!log.includes("Ready in")) throw new Error(log);
  browser = await ({ chromium, firefox })[engine].launch({ env: { ...process.env, LD_LIBRARY_PATH: process.argv[3] ?? "" }, ...(engine === "chromium" ? { ignoreDefaultArgs: ["--hide-scrollbars"] } : {}) });
  const page = await browser.newPage();
  page.on("pageerror", error => results.errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") results.errors.push(message.text()); });
  page.on("request", request => { if (!request.url().startsWith("http://127.0.0.1:3003") && !request.url().startsWith("data:")) results.external.push(request.url()); });
  for (const [width, height] of [[360,800],[390,844],[768,1024],[1280,800],[1440,900],[1920,1080]]) {
    await page.setViewportSize({ width, height });
    await page.goto("http://127.0.0.1:3003/docs/semantic-workflow", { waitUntil: "networkidle" });
    await page.screenshot({ path: `${directory}/docs-${width}.png` });
    const sidebar = page.locator(".docs-shell > aside:visible");
    if (width >= 1280) {
      await sidebar.screenshot({ path: `${directory}/sidebar-${width}.png` });
      const toc = page.locator(".on-this-page nav:visible");
      await toc.getByRole("link", { name: "Ollama embeddings", exact: true }).click();
      await expect(toc.getByRole("link", { name: "Ollama embeddings", exact: true })).toHaveAttribute("aria-current", "location");
      await page.screenshot({ path: `${directory}/active-section-${width}.png` });
    } else {
      await page.locator("details[data-docs-browser] summary").click();
      await page.screenshot({ path: `${directory}/navigation-${width}.png` });
      await page.locator("details[data-docs-browser] summary").click();
      await page.locator(".on-this-page summary").click();
      await page.screenshot({ path: `${directory}/toc-${width}.png` });
    }
    results.views.push(await page.evaluate(({ width, height }) => {
      const sidebar = document.querySelector(".docs-shell > aside"), selected = document.querySelector('.on-this-page nav a[aria-current="location"]');
      const css = getComputedStyle(sidebar), active = getComputedStyle(selected);
      return { width, height, overflow: document.documentElement.scrollWidth > innerWidth, scrollbar: { width: getComputedStyle(document.documentElement).scrollbarWidth, color: getComputedStyle(document.documentElement).scrollbarColor }, sidebar: { borders: [css.borderTopWidth, css.borderRightWidth, css.borderBottomWidth, css.borderLeftWidth], radius: css.borderRadius, background: css.backgroundColor }, active: { background: active.backgroundColor, radius: active.borderRadius, borderWidth: active.borderLeftWidth, color: active.color } };
    }, { width, height }));
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://127.0.0.1:3003/", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${directory}/landing.png` });
  const video = page.locator("#walkthrough video");
  await expect.poll(() => video.evaluate(el => el.readyState >= 2)).toBe(true);
  await video.evaluate(el => new Promise(resolve => { el.pause(); el.addEventListener("seeked", resolve, { once: true }); el.currentTime = 24; }));
  await video.evaluate(el => window.scrollTo({ top: scrollY + el.getBoundingClientRect().top - 20, behavior: "instant" }));
  await expect.poll(() => video.evaluate(el => Math.abs(el.getBoundingClientRect().top - 20))).toBeLessThan(2);
  await page.screenshot({ path: `${directory}/navbar-over-light-content.png` });
  results.headerContrast = await page.locator("header.site-nav").evaluate(header => {
    const channels = value => value.match(/[\d.]+/g).map(Number);
    const bg = channels(getComputedStyle(header).backgroundColor), alpha = bg[3] ?? 1;
    const surface = bg.slice(0, 3).map(v => v * alpha + 255 * (1 - alpha));
    const luminance = color => color.map(v => { const n = v / 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4; }).reduce((sum, value, i) => sum + value * [.2126,.7152,.0722][i], 0);
    return { background: getComputedStyle(header).backgroundColor, backdrop: getComputedStyle(header).backdropFilter, againstWhiteContent: [...header.querySelectorAll("nav a")].filter(el => el.getClientRects().length).map(el => {
      const css = getComputedStyle(el), own = channels(css.backgroundColor), backdrop = (own[3] ?? 1) === 1 ? own : surface, foreground = channels(css.color);
      const a = luminance(foreground.slice(0, 3)), b = luminance(backdrop.slice(0, 3));
      return { text: el.textContent, contrast: (Math.max(a,b) + .05) / (Math.min(a,b) + .05) };
    }) };
  });
  await page.emulateMedia({ forcedColors: "active" });
  results.forcedColors = await page.evaluate(() => ({ width: getComputedStyle(document.documentElement).scrollbarWidth, color: getComputedStyle(document.documentElement).scrollbarColor }));
  if (results.views.some(view => view.overflow) || results.errors.length || results.external.length || results.headerContrast.againstWhiteContent.some(item => item.contrast < 4.5)) throw new Error(JSON.stringify(results));
} finally {
  await writeFile(`${directory}/observations.json`, JSON.stringify(results, null, 2) + "\n");
  await browser?.close(); const closed = once(server, "close"); server.kill("SIGTERM"); await closed;
}
