import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { writeFile } from "node:fs/promises";

const baseline = "/tmp/ragvidence-baseline-performance";
const server = spawn(process.execPath, [`${baseline}/node_modules/next/dist/bin/next`, "start", "--hostname", "127.0.0.1", "--port", "3004"], { cwd: baseline, stdio: ["ignore", "pipe", "pipe"] });
let log = ""; server.stdout.on("data", chunk => { log += chunk; }); server.stderr.on("data", chunk => { log += chunk; });
const browser = await chromium.launch({ env: { ...process.env, LD_LIBRARY_PATH: process.argv[2] ?? process.env.LD_LIBRARY_PATH ?? "" } });
const samples = [];
try {
  for (let i = 0; i < 120 && !log.includes("Ready in"); i++) { if (server.exitCode !== null) throw new Error(log); await new Promise(resolve => setTimeout(resolve, 250)); }
  if (!log.includes("Ready in")) throw new Error(log);
  for (const [version, port] of [["baseline-6b9fe79", 3004], ["final", 3001]]) {
    for (const [profile, width, height, cpu, latency, download] of [["mobile-4x-CPU",390,844,4,50,200000],["desktop",1440,900,1,0,10000000]]) {
      for (const route of ["/", "/docs/semantic-workflow"]) for (let sample = 0; sample < 3; sample++) {
        const context = await browser.newContext({ viewport: { width, height } });
        await context.addInitScript(() => {
          window.__lcp = 0;
          new PerformanceObserver(list => { window.__lcp = list.getEntries().at(-1)?.startTime ?? 0; }).observe({ type: "largest-contentful-paint", buffered: true });
          Object.defineProperty(navigator, "clipboard", { value: { writeText: async () => {} } });
        });
        const page = await context.newPage(), cdp = await context.newCDPSession(page);
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
        await cdp.send("Network.enable");
        await cdp.send("Network.emulateNetworkConditions", { offline: false, latency, downloadThroughput: download, uploadThroughput: download });
        await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        const timing = await page.evaluate(() => {
          const nav = performance.getEntriesByType("navigation")[0];
          const resources = performance.getEntriesByType("resource");
          return { ttfbMs: nav.responseStart, domContentLoadedMs: nav.domContentLoadedEventEnd, lcpMs: window.__lcp, clientJavaScriptBytes: resources.filter(r => /\.js(?:\?|$)/.test(r.name)).reduce((n,r) => n + r.encodedBodySize, 0), cssBytes: resources.filter(r => /\.css(?:\?|$)/.test(r.name)).reduce((n,r) => n + r.encodedBodySize, 0) };
        });
        const copyMs = await page.getByRole("button", { name: /^Copy / }).first().evaluate(button => new Promise(resolve => {
          const start = performance.now();
          const observer = new MutationObserver(() => { if (button.textContent.includes("Copied")) { observer.disconnect(); resolve(performance.now() - start); } });
          observer.observe(button, { childList: true, subtree: true, characterData: true }); button.click();
        }));
        samples.push({ version, profile, route, sample, ...timing, copyFeedbackMs: copyMs });
        await context.close();
      }
    }
  }
} finally {
  await writeFile("verification/identity/milestone-11/frontend-measurements.json", JSON.stringify({ scope: "Three cold-context local samples per route/profile; mobile 4x CPU and 50ms/200KBps network. Copy uses a mocked clipboard to measure UI feedback. These are development measurements, not production/customer benchmarks.", samples }, null, 2) + "\n");
  await browser.close(); const closed = once(server, "close"); server.kill("SIGTERM"); await closed;
}
