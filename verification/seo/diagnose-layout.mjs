import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, writeFile } from "node:fs/promises";

const stage = process.argv[2];
if (!["before", "after"].includes(stage)) throw new Error("Use before or after");
const directory = `verification/seo/layout-shift/${stage}`, origin = "http://127.0.0.1:3003";
await mkdir(directory, { recursive: true });
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3003"], { stdio: ["ignore", "pipe", "pipe"] });
let log = "", browser;
server.stdout.on("data", chunk => { log += chunk; }); server.stderr.on("data", chunk => { log += chunk; });
const results = { stage, scope: "Local cold contexts with layout-shift source attribution. Delayed-font cases intentionally hold WOFF2 requests through the fallback screenshot. CLS uses the maximum session window; totalShiftScore is recorded separately.", samples: [], errors: [] };
try {
  for (let i = 0; i < 120 && !log.includes("Ready in"); i++) {
    if (server.exitCode !== null) throw new Error(log);
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!log.includes("Ready in")) throw new Error(log);
  browser = await chromium.launch({ env: { ...process.env, LD_LIBRARY_PATH: process.argv[3] ?? "" } });
  for (const [profile, width, height, holdFonts] of [["mobile-natural",390,844,false],["mobile-held-fonts",390,844,true],["desktop-natural",1440,900,false]]) {
    for (const [name, route] of [["landing","/"],["docs","/docs/semantic-workflow"]]) {
      console.log(`${stage}: ${profile} ${route}`);
      const context = await browser.newContext({ viewport: { width, height } });
      await context.addInitScript(() => {
        window.__layoutEvidence = { cls: 0, totalShiftScore: 0, shifts: [], fontEvents: [], lcpMs: 0 };
        let first = 0, last = 0, session = 0;
        const box = rect => ({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.hadRecentInput) continue;
            if (entry.startTime - last < 1000 && entry.startTime - first < 5000) session += entry.value;
            else { first = entry.startTime; session = entry.value; }
            last = entry.startTime;
            window.__layoutEvidence.cls = Math.max(window.__layoutEvidence.cls, session);
            window.__layoutEvidence.totalShiftScore += entry.value;
            window.__layoutEvidence.shifts.push({ time: entry.startTime, value: entry.value, sources: entry.sources.map(source => ({ tag: source.node?.nodeName, id: source.node?.id, className: source.node?.className, text: source.node?.textContent?.slice(0,100), previous: box(source.previousRect), current: box(source.currentRect) })) });
          }
        }).observe({ type: "layout-shift", buffered: true });
        new PerformanceObserver(list => { window.__layoutEvidence.lcpMs = list.getEntries().at(-1)?.startTime ?? 0; }).observe({ type: "largest-contentful-paint", buffered: true });
        for (const event of ["loading", "loadingdone", "loadingerror"]) document.fonts.addEventListener(event, () => window.__layoutEvidence.fontEvents.push({ event, time: performance.now() }));
      });
      const page = await context.newPage(), cdp = await context.newCDPSession(page);
      page.on("pageerror", error => results.errors.push(error.message));
      await cdp.send("DOM.enable"); await cdp.send("CSS.enable");
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: width < 768 ? 4 : 1 });
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: width < 768 ? 50 : 0, downloadThroughput: width < 768 ? 200000 : 10000000, uploadThroughput: 10000000 });
      let releaseFonts;
      const fontGate = new Promise(resolve => { releaseFonts = resolve; });
      if (holdFonts) await page.route("**/*.woff2", async route => { await fontGate; await route.continue(); });
      try {
        await page.goto(origin + route, { waitUntil: "domcontentloaded" });
        const platformFonts = async () => {
          const { root } = await cdp.send("DOM.getDocument");
          const { nodeId } = await cdp.send("DOM.querySelector", { nodeId: root.nodeId, selector: "h1" });
          return (await cdp.send("CSS.getPlatformFontsForNode", { nodeId })).fonts;
        };
        const fallbackFonts = await platformFonts();
        if (holdFonts) {
          const capture = await cdp.send("Page.captureScreenshot", { format: "png" });
          await writeFile(`${directory}/${name}-fallback.png`, Buffer.from(capture.data, "base64"));
          releaseFonts();
        }
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(5000);
        const finalFonts = await platformFonts();
        await page.screenshot({ path: `${directory}/${name}-${profile}.png` });
        const evidence = await page.evaluate(() => ({ ...window.__layoutEvidence, fontStatus: document.fonts.status, fontFamily: getComputedStyle(document.querySelector("h1")).fontFamily, overflow: document.documentElement.scrollWidth > innerWidth }));
        results.samples.push({ profile, route, width, height, fallbackFonts, finalFonts, ...evidence });
      } finally { releaseFonts(); await context.close(); }
    }
  }
  if (results.errors.length || results.samples.some(sample => sample.overflow)) throw new Error("Browser errors or overflow; see observations");
} finally {
  await writeFile(`${directory}/observations.json`, JSON.stringify(results, null, 2) + "\n");
  await browser?.close(); const closed = once(server, "close"); server.kill("SIGTERM"); await closed;
}
