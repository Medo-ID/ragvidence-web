import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, writeFile } from "node:fs/promises";
import { docs } from "../../src/lib/docs.ts";

const stage = process.argv[2];
if (!["baseline", "final"].includes(stage)) throw new Error("Use baseline or final");
const directory = `verification/seo/${stage}`, origin = "http://127.0.0.1:3003";
await mkdir(directory, { recursive: true });
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3003"], { stdio: ["ignore", "pipe", "pipe"] });
let log = "", browser;
server.stdout.on("data", chunk => { log += chunk; });
server.stderr.on("data", chunk => { log += chunk; });
const results = { stage, scope: "Local production build; no live deployment, rankings, field Core Web Vitals, or Google indexing verification.", pages: [], files: [], errors: [], external: [], performance: [] };
try {
  for (let i = 0; i < 120 && !log.includes("Ready in"); i++) {
    if (server.exitCode !== null) throw new Error(log);
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!log.includes("Ready in")) throw new Error(log);
  browser = await chromium.launch({ env: { ...process.env, LD_LIBRARY_PATH: process.argv[3] ?? "" } });
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const routes = ["/", "/docs", ...docs.map(doc => `/docs/${doc.slug}`), "/releases", "/privacy", "/terms", "/security"];
  for (const route of routes) {
    const response = await page.goto(origin + route, { waitUntil: "domcontentloaded" });
    results.pages.push({ route, status: response.status(), xRobotsTag: response.headers()["x-robots-tag"] ?? null, ...await page.evaluate(() => {
      const meta = name => [...document.querySelectorAll(`meta[name="${name}"],meta[property="${name}"]`)].map(el => el.content);
      return { title: document.title, description: meta("description"), canonical: [...document.querySelectorAll('link[rel="canonical"]')].map(el => el.href), ogTitle: meta("og:title"), ogDescription: meta("og:description"), ogUrl: meta("og:url"), ogImage: meta("og:image"), twitterTitle: meta("twitter:title"), twitterDescription: meta("twitter:description"), twitterImage: meta("twitter:image"), robots: meta("robots"), lang: document.documentElement.lang, h1: [...document.querySelectorAll("h1")].map(el => el.textContent), mainTextLength: document.querySelector("main").textContent.length, jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.parse(el.textContent)) };
    }) });
  }
  for (const route of ["/robots.txt", "/sitemap.xml", "/brand/concepts.html", "/brand/brand-sheet.html", "/brand/a-evidence-convergence/tab-preview.html", "/not-a-real-seo-page"]) {
    const response = await context.request.get(origin + route);
    results.files.push({ route, status: response.status(), xRobotsTag: response.headers()["x-robots-tag"] ?? null, ...(route.endsWith(".txt") || route.endsWith(".xml") ? { body: await response.text() } : {}) });
  }
  for (const [width, height] of [[390,844],[1440,900]]) {
    await page.setViewportSize({ width, height });
    for (const [name, route] of [["landing","/"],["docs","/docs/semantic-workflow"]]) {
      await page.goto(origin + route, { waitUntil: "networkidle" });
      await page.screenshot({ path: `${directory}/${name}-${width}.png` });
    }
  }
  const preview = await context.request.get(origin + "/opengraph-image");
  if (!preview.ok()) throw new Error("Social image unavailable");
  await writeFile(`${directory}/opengraph.png`, await preview.body());
  await context.close();
  for (const [profile, width, height, cpu, latency, throughput] of [["mobile-lab",390,844,4,50,200000],["desktop-lab",1440,900,1,0,10000000]]) {
    for (const route of ["/", "/docs/semantic-workflow"]) {
      console.log(`${stage}: ${profile} ${route}`);
      for (let sample = 0; sample < 3; sample++) {
        const context = await browser.newContext({ viewport: { width, height } });
        await context.addInitScript(() => {
          window.__seoLcp = 0; window.__seoCls = 0;
          new PerformanceObserver(list => { window.__seoLcp = list.getEntries().at(-1)?.startTime ?? 0; }).observe({ type: "largest-contentful-paint", buffered: true });
          new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__seoCls += entry.value; }).observe({ type: "layout-shift", buffered: true });
        });
        const page = await context.newPage(), cdp = await context.newCDPSession(page);
        page.on("pageerror", error => results.errors.push(error.message));
        page.on("request", request => { if (!request.url().startsWith(origin) && !request.url().startsWith("data:")) results.external.push(request.url()); });
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
        await cdp.send("Network.enable");
        await cdp.send("Network.emulateNetworkConditions", { offline: false, latency, downloadThroughput: throughput, uploadThroughput: throughput });
        let mediaBytesReceived = 0;
        const media = new Set();
        cdp.on("Network.responseReceived", event => { if (event.type === "Media") media.add(event.requestId); });
        cdp.on("Network.dataReceived", event => { if (media.has(event.requestId)) mediaBytesReceived += event.encodedDataLength; });
        await page.goto(origin + route, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(5000);
        results.performance.push({ profile, route, sample, cpu, latency, throughput, mediaBytesReceived, ...await page.evaluate(() => {
          const nav = performance.getEntriesByType("navigation")[0], resources = performance.getEntriesByType("resource");
          return { ttfbMs: nav.responseStart, domContentLoadedMs: nav.domContentLoadedEventEnd, lcpMs: window.__seoLcp, cls: window.__seoCls, clientJavaScriptBytes: resources.filter(r => /\.js(?:\?|$)/.test(r.name)).reduce((sum, r) => sum + r.encodedBodySize, 0), cssBytes: resources.filter(r => /\.css(?:\?|$)/.test(r.name)).reduce((sum, r) => sum + r.encodedBodySize, 0), overflow: document.documentElement.scrollWidth > innerWidth };
        }) });
        await context.close();
      }
    }
  }
  if (results.errors.length || results.external.length || results.performance.some(sample => sample.overflow)) throw new Error("Browser errors, external requests, or overflow; see observations");
} finally {
  await writeFile(`${directory}/observations.json`, JSON.stringify(results, null, 2) + "\n");
  await browser?.close();
  const closed = once(server, "close"); server.kill("SIGTERM"); await closed;
}
