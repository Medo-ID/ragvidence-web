import { expect, test } from "@playwright/test";

declare global {
  interface Window {
    __fontStability: { cls: number };
  }
}

for (const width of [360, 390, 768, 1280, 1440, 1920]) {
  for (const [name, route] of [["home", "/"], ["docs", "/docs/semantic-workflow"]]) {
    test(`font loading preserves ${name} layout at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
      await page.addInitScript(() => {
        const state = { cls: 0 };
        Object.defineProperty(window, "__fontStability", { value: state });
        let first = Number.NEGATIVE_INFINITY, last = Number.NEGATIVE_INFINITY, session = 0;
        new PerformanceObserver(list => {
          for (const item of list.getEntries()) {
            const entry = item as PerformanceEntry & { value: number; hadRecentInput: boolean };
            if (entry.hadRecentInput) continue;
            if (entry.startTime - last < 1000 && entry.startTime - first < 5000) session += entry.value;
            else { first = entry.startTime; session = entry.value; }
            last = entry.startTime;
            state.cls = Math.max(state.cls, session);
          }
        }).observe({ type: "layout-shift", buffered: true });
      });
      let releaseFonts!: () => void;
      const gate = new Promise<void>(resolve => { releaseFonts = resolve; });
      await page.route("**/*.woff2", async route => { await gate; await route.continue(); });
      try {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        if (route === "/") await expect(page.locator("#hero-install-command")).toContainText("ragvidence==0.2.0");
        await page.waitForTimeout(200);
        releaseFonts();
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(200);
        const evidence = await page.evaluate(() => ({
          cls: window.__fontStability.cls,
          overflow: document.documentElement.scrollWidth > innerWidth,
        }));
        expect(evidence.cls).toBeLessThanOrEqual(0.1);
        expect(evidence.overflow).toBe(false);
      } finally { releaseFonts(); await page.unrouteAll({ behavior: "wait" }); }
    });
  }
}
