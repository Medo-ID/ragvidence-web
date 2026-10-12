import { expect, test } from "@playwright/test";

test("mobile docs selection closes the browser and reveals the article", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/installation");
  await page.getByText("Browse documentation", { exact: true }).click();
  const navigation = page.locator("details");
  await navigation.getByRole("textbox", { name: "Search documentation" }).fill("tutorial");
  await navigation.getByRole("link", { name: "First tutorial", exact: true }).click();
  const heading = page.getByRole("heading", { name: "First tutorial", level: 1, exact: true });
  await expect(heading).toBeVisible();
  await expect(navigation).not.toHaveAttribute("open", "");
  await expect(heading).toBeInViewport();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Installation", level: 1, exact: true })).toBeVisible();
  await expect(navigation).not.toHaveAttribute("open", "");
});

test("mobile menu dismisses on Escape, brand click, and route navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs");
  const toggle = page.locator("header button");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page.locator("header").getByRole("link", { name: "RAGvidence home" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("See whether your RAG change");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page.locator("#mobile-navigation").getByRole("link", { name: "Docs", exact: true }).click();
  await expect(page).toHaveURL(/\/docs$/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("copy failure provides feedback and retry copies the real command", async ({ page }) => {
  await page.addInitScript(() => {
    let attempts = 0;
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: {
      writeText: async (text: string) => {
        attempts += 1;
        if (attempts === 1) throw new Error("Permission denied");
        document.documentElement.dataset.copied = text;
      },
    } });
  });
  await page.goto("/");
  const copy = page.locator("#demo").getByRole("button", { name: /Copy command/ });
  await copy.click();
  await expect(copy).toHaveText("Copy failed");
  await expect(page.locator("#demo").getByRole("status")).toContainText("copy it manually");
  await copy.click();
  await expect(copy).toHaveText("Copied");
  await expect(page.locator("html")).toHaveAttribute("data-copied", 'uv tool install --python 3.12 "ragvidence[semantic]"');
});

test("preview steps, bounds, playback, and reduced motion remain usable", async ({ page }) => {
  await page.goto("/");
  const previous = page.getByRole("button", { name: "Previous tutorial step" });
  const next = page.getByRole("button", { name: "Next tutorial step" });
  await expect(previous).toBeDisabled();
  for (let index = 0; index < 3; index += 1) await next.click();
  await expect(next).toBeDisabled();
  await expect(page.locator("#demo").getByRole("link", { name: "Open the real sample report" })).toHaveAttribute("href", "/sample-report.html");
  await page.getByRole("button", { name: "Replay walkthrough" }).click();
  await expect(page.getByRole("button", { name: "Pause walkthrough" })).toBeVisible();
  await page.getByRole("button", { name: "Pause walkthrough" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("button", { name: "Explore at your pace" })).toBeDisabled();
  await next.click();
  await expect(page.locator("#cli-demo-title")).toHaveText("Check before you experiment.");
});

test("search filters pages and announces an empty result", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/docs");
  const sidebar = page.locator("aside").filter({ has: page.getByRole("textbox", { name: "Search documentation" }) });
  await sidebar.getByRole("textbox", { name: "Search documentation" }).fill("metrics reference");
  await expect(sidebar.getByRole("link", { name: "Metrics reference" })).toBeVisible();
  await expect(sidebar.getByRole("link", { name: "Installation", exact: true })).toHaveCount(0);
  await sidebar.getByRole("textbox", { name: "Search documentation" }).fill("no-such-topic");
  await expect(sidebar).toContainText("No documentation pages match");
});

test("full-text search loads on demand, keeps queries local, and finds article content", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const requests: string[] = [];
  page.on("request", (request) => { if (request.url().includes("search-index.json")) requests.push(request.url()); });
  await page.goto("/docs");
  expect(requests).toHaveLength(0);
  const sidebar = page.locator("aside").filter({ has: page.getByRole("textbox", { name: "Search documentation" }) });
  const search = sidebar.getByRole("textbox", { name: "Search documentation" });
  await search.fill("uninstall");
  await expect(sidebar.getByRole("link", { name: "Installation", exact: true })).toBeVisible();
  await expect(sidebar).toContainText("Searching titles, descriptions, and article text.");
  await search.fill("Python 3.13");
  await expect(sidebar.getByRole("link", { name: "Installation", exact: true })).toBeVisible();
  expect(requests).toHaveLength(1);
  expect(new URL(requests[0]).search).toBe("");
  await search.fill("");
  await expect(sidebar.getByRole("link", { name: "First tutorial", exact: true })).toBeVisible();
});

for (const failure of ["http", "invalid-index"]) {
  test(`search recovers from ${failure} failure while metadata remains usable`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    let requests = 0;
    await page.route("**/docs/search-index.json", async (route) => {
      requests += 1;
      if (requests === 1) await route.fulfill({ status: failure === "http" ? 503 : 200, contentType: "application/json", body: "{}" });
      else await route.continue();
    });
    await page.goto("/docs");
    const sidebar = page.locator("aside").filter({ has: page.getByRole("textbox", { name: "Search documentation" }) });
    const search = sidebar.getByRole("textbox", { name: "Search documentation" });
    await search.fill("installation");
    await expect(sidebar).toContainText("Article search is unavailable");
    await expect(sidebar.getByRole("link", { name: "Installation", exact: true })).toBeVisible();
    await sidebar.getByRole("button", { name: "Retry search" }).click();
    await expect(sidebar).toContainText("Searching titles, descriptions, and article text.");
    await search.fill("uninstall");
    await expect(sidebar.getByRole("link", { name: "Installation", exact: true })).toBeVisible();
    expect(requests).toBe(2);
  });
}

test("real walkthrough waits for playback and loads video with English captions", async ({ page }) => {
  const mediaRequests: string[] = [];
  page.on("request", (request) => { if (request.url().endsWith("/media/walkthrough.webm")) mediaRequests.push(request.url()); });
  await page.goto("/");
  const video = page.locator("#walkthrough video");
  await expect(video).toHaveAttribute("preload", "none");
  await expect(video).not.toHaveAttribute("autoplay", "");
  expect(mediaRequests).toHaveLength(0);
  await expect(video.locator("track")).toHaveAttribute("src", "/media/walkthrough.en.vtt");
  await video.evaluate((element: HTMLVideoElement) => element.play());
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  const metadata = await video.evaluate((element: HTMLVideoElement) => ({ width: element.videoWidth, height: element.videoHeight, duration: element.duration }));
  expect(metadata.width).toBe(1280);
  expect(metadata.height).toBe(720);
  expect(metadata.duration).toBeGreaterThan(50);
  expect(metadata.duration).toBeLessThan(180);
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.textTracks[0]?.cues?.length ?? 0)).toBe(6);
  const captionEnd = await video.evaluate((element: HTMLVideoElement) => {
    const cues = element.textTracks[0].cues!;
    return cues[cues.length - 1].endTime;
  });
  expect(Math.abs(captionEnd - metadata.duration)).toBeLessThan(0.05);
  await video.evaluate((element: HTMLVideoElement) => element.pause());
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await expect(page.locator("#walkthrough").getByRole("link", { name: "Follow the written tutorial" })).toHaveAttribute("href", "/docs/first-tutorial");
});

test("unknown docs show not-found content and noindex", async ({ page }) => {
  await page.goto("/docs/no-such-page");
  await expect(page.getByRole("heading", { name: "This evidence trail ends here." })).toBeVisible();
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
});

test("printed documentation keeps headings, links, and commands readable", async ({ page }) => {
  await page.goto("/docs/installation");
  await page.emulateMedia({ media: "print" });
  const samples = await page.locator("article h1, article p, article a, article pre code").evaluateAll((elements) => elements.map((element) => {
    const color = getComputedStyle(element).color;
    const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
    const linear = channels.map((channel) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    return { text: element.textContent?.slice(0, 60), contrastOnPaper: 1.05 / (luminance + 0.05) };
  }));
  expect(samples.length).toBeGreaterThan(0);
  for (const sample of samples) expect(sample.contrastOnPaper, sample.text).toBeGreaterThanOrEqual(4.5);
});

for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`tutorial selection keeps hero geometry stable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const initialHero = await page.locator("#install").boundingBox();
    const initialDemo = await page.locator("#demo").boundingBox();
    for (const label of ["Check", "Run", "Inspect", "Install"]) {
      await page.getByRole("button", { name: new RegExp(label), exact: false }).filter({ hasText: label }).first().click();
      await expect(page.locator("#demo").getByRole("heading", { level: 2 })).toBeVisible();
      expect(Math.abs((await page.locator("#install").boundingBox())!.height - initialHero!.height)).toBeLessThan(0.5);
      expect(Math.abs((await page.locator("#demo").boundingBox())!.height - initialDemo!.height)).toBeLessThan(0.5);
      await expect(page.locator("#demo").getByRole("button", { name: /Copy command/ })).toHaveCount(1);
    }
  });

  test(`homepage and long docs fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/docs/installation", "/docs/metrics", "/sample-report.html"]) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} at ${width}px`).toBe(true);
      if (route === "/") {
        for (let step = 0; step < 3; step += 1) {
          await page.getByRole("button", { name: "Next tutorial step" }).click();
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `preview step ${step + 2} at ${width}px`).toBe(true);
        }
      }
    }
    if (width >= 1024) {
      await page.goto("/");
      const shell = await page.locator("#install > .shell").boundingBox();
      expect(shell?.width).toBeCloseTo(Math.min(width * 0.8, 1440), 0);
    }
  });
}

test("installation and mobile navigation remain accessible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3002/");
  await page.locator("header").getByRole("link", { name: "Install Free", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Installation", exact: true })).toBeVisible();
  await page.getByText("Browse documentation", { exact: true }).click();
  await page.locator("details").getByRole("link", { name: "First tutorial", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "First tutorial", exact: true })).toBeVisible();
  await context.close();
});
