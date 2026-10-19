// Reproducible production screenshots and local performance observations.
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.RAGVIDENCE_SITE_URL ?? "http://127.0.0.1:3011";
const output = process.argv[2] ?? "verification/website-021/design";
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [], errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  for (const [name, route] of [["home", "/"], ["docs", "/docs/semantic-workflow"]]) {
    await page.goto(base + route);
    if (name === "home" && !(await page.locator(".hero-frame").count())) throw new Error("Preview is serving an outdated home page");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(100);
    results.push({ name, metrics: await page.evaluate(() => ({
      navigation: performance.getEntriesByType("navigation").map(n => ({ ttfb: n.responseStart, dcl: n.domContentLoadedEventEnd })),
      transfer: performance.getEntriesByType("resource").reduce((n, r) => n + r.transferSize, 0),
      paint: performance.getEntriesByType("paint").map(x => ({ name: x.name, startTime: x.startTime })),
    })) });
  }
  for (const theme of ["dark", "light"]) {
    await page.evaluate(theme => { localStorage.setItem("ragvidence-theme", theme); }, theme);
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      for (const [name, route] of [["home", "/"], ["docs", "/docs/semantic-workflow"], ["tables", "/docs/metrics"], ["release", "/releases"], ["report", "/sample-report.html"]]) {
        await page.goto(base + route);
        if (name === "report" && theme === "light") await page.getByRole("button", { name: "Light mode" }).click();
        await page.evaluate(() => document.fonts.ready);
        if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error(`${name}/${theme}/${width}: page overflow`);
        await page.screenshot({ path: `${output}/${name}-${theme}-${width}.png`, fullPage: name === "home" });
        if (name === "home") await page.screenshot({ path: `${output}/home-viewport-${theme}-${width}.png` });
      }
    }
  }
  await writeFile(`${output}/metrics.json`, JSON.stringify(results, null, 2) + "\n");
  await writeFile(`${output}/errors.json`, JSON.stringify(errors, null, 2) + "\n");
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(`Design captures and local performance observations: ${output}`);
} finally { await browser.close(); }
