import { expect, test } from "@playwright/test";

test("mobile docs selection closes the browser and reveals the article", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/installation");
  await page.getByText("Browse documentation", { exact: true }).click();
  const navigation = page.locator("details[data-docs-browser]");
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

test("silent native video autoplays on page load without scrolling or native controls", async ({ page }) => {
  await page.goto("/");
  const video = page.locator("#walkthrough video");
  await expect(video).toHaveAttribute("autoplay", "");
  await expect(video).toHaveAttribute("preload", "auto");
  await expect(video).not.toHaveAttribute("controls", "");
  await expect(page.locator("#walkthrough button")).toHaveCount(1);
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => !el.paused && el.currentTime > 0.1)).toBe(true);
  const metadata = await video.evaluate((el: HTMLVideoElement) => ({ width: el.videoWidth, height: el.videoHeight, duration: el.duration, muted: el.muted, loop: el.loop, tracks: el.textTracks.length }));
  expect(metadata).toMatchObject({ width: 1920, height: 1080, muted: true, loop: true, tracks: 0 });
  expect(metadata.duration).toBeCloseTo(36, 1);
});

test("native autoplay works before hydration with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "no-preference" });
  try {
    const page = await context.newPage();
    for (const reload of [false, true]) {
      if (reload) await page.reload();
      else await page.goto("/");
      const video = page.locator("#walkthrough video");
      await expect(video.locator("source")).toHaveCount(2);
      // Browsers may defer native offscreen autoplay; entering the viewport
      // must start it without JavaScript, hydration, or a click.
      await video.scrollIntoViewIfNeeded();
      await expect.poll(() => video.evaluate((el: HTMLVideoElement) => !el.paused && el.currentTime > 0.1)).toBe(true);
    }
  } finally { await context.close(); }
});

test("cold fragment navigation retries playback once delayed media is ready", async ({ page }) => {
  await page.route(/walkthrough\.(webm|mp4)$/, async route => {
    await new Promise(resolve => setTimeout(resolve, 700));
    await route.continue();
  });
  await page.goto("/#walkthrough");
  const video = page.locator("#walkthrough video");
  await video.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => !el.paused && el.currentTime > 0), { timeout: 10000 }).toBe(true);
});

test("metadata-only readiness starts on first visit and reload without a click", async ({ page }) => {
  // Some browsers stop metadata preloading at HAVE_METADATA. Calling play()
  // must start loading frames rather than waiting for canplay first.
  await page.addInitScript(() => {
    const readReadyState = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "readyState")?.get;
    if (!readReadyState) throw new Error("Missing media readyState getter");
    Object.defineProperty(HTMLMediaElement.prototype, "readyState", {
      configurable: true,
      get(this: HTMLMediaElement) {
        const state: number = readReadyState.call(this);
        return this.paused && state >= HTMLMediaElement.HAVE_METADATA ? HTMLMediaElement.HAVE_METADATA : state;
      },
    });
  });
  await page.goto("/");
  for (const reload of [false, true]) {
    if (reload) await page.reload();
    const video = page.locator("#walkthrough video");
    await video.scrollIntoViewIfNeeded();
    await expect.poll(() => video.evaluate((el: HTMLVideoElement) => !el.paused && el.currentTime > 0.1)).toBe(true);
    expect(await video.evaluate((el: HTMLVideoElement) => el.autoplay)).toBe(true);
    await expect(page.getByRole("button", { name: "Pause workflow video", exact: true })).toBeVisible();
  }
});

test("clicking anywhere toggles playback and manual pause survives scrolling", async ({ page }) => {
  await page.goto("/");
  const video = page.locator("#walkthrough video");
  await video.scrollIntoViewIfNeeded();
  const toggle = page.locator("#walkthrough button");
  await expect(toggle).toHaveAccessibleName("Pause workflow video");
  await toggle.click({ position: { x: 12, y: 12 } });
  await expect(toggle).toHaveAccessibleName("Play workflow video");
  const time = await video.evaluate((el: HTMLVideoElement) => el.currentTime);
  await page.locator("#install").scrollIntoViewIfNeeded();
  await video.scrollIntoViewIfNeeded();
  expect(await video.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeCloseTo(time, 1);
  await page.keyboard.press("Tab");
  await toggle.focus();
  expect(await toggle.evaluate(el => getComputedStyle(el).outlineWidth)).toBe("2px");
  await page.keyboard.press("Space");
  await expect(toggle).toHaveAccessibleName("Pause workflow video");
  await page.keyboard.press("Enter");
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
});

test("a tall video can autoplay in a short viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 400 });
  await page.goto("/");
  const video = page.locator("#walkthrough video");
  await video.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => !el.paused && el.currentTime > 0)).toBe(true);
});

test("reduced motion shows the poster without loading or autoplaying video", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const mediaRequests: string[] = [];
  page.on("request", request => { if (/walkthrough\.(webm|mp4)$/.test(request.url())) mediaRequests.push(request.url()); });
  await page.goto("/");
  const video = page.locator("#walkthrough video");
  await video.scrollIntoViewIfNeeded();
  expect(await video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
  await expect(video).toHaveAttribute("poster", "/media/walkthrough-poster.webp");
  await expect(video.locator("source")).toHaveCount(2);
  for (const source of await video.locator("source").all()) await expect(source).toHaveAttribute("media", "(prefers-reduced-motion: no-preference)");
  expect(mediaRequests).toHaveLength(0);
  await page.getByRole("button", { name: "Play workflow video", exact: true }).click();
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => !el.paused && el.currentTime > 0)).toBe(true);
  await expect(video.locator("source")).toHaveCount(2);
});

test("native source queries preserve the reduced-motion poster before hydration", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce" });
  try {
    const requests: string[] = [];
    const page = await context.newPage();
    page.on("request", request => { if (/walkthrough\.(webm|mp4)$/.test(request.url())) requests.push(request.url()); });
    await page.goto("/");
    const video = page.locator("#walkthrough video");
    await video.scrollIntoViewIfNeeded();
    expect(await video.evaluate((el: HTMLVideoElement) => el.paused && el.currentTime === 0 && el.currentSrc === "")).toBe(true);
    expect(requests).toHaveLength(0);
  } finally { await context.close(); }
});

test("site actions retain high contrast and report surfaces stay opaque", async ({ page }) => {
  await page.goto("/");
  for (const blur of await page.locator(".surface").evaluateAll(elements => elements.map(element => getComputedStyle(element).backdropFilter))) expect(blur).toBe("none");
  await page.goto("/sample-report.html");
    const styles = await page.locator(".hero, section, .run-summary").evaluateAll(elements => elements.map(element => {
      const css = getComputedStyle(element);
      const channels = css.backgroundColor.match(/[\d.]+/g)?.map(Number) ?? [];
      return { blur: css.backdropFilter, image: css.backgroundImage, alpha: channels[3] ?? 1 };
    }));
    for (const style of styles) {
      expect(style.blur).toBe("none");
      expect(style.image).toBe("none");
      expect(style.alpha).toBe(1);
    }
    const samples = await page.locator(".hero-copy, .rate, .run-summary .config, .summary-metrics, .hit-meta").evaluateAll(elements => elements.map(element => {
      const foreground = getComputedStyle(element).color.match(/[\d.]+/g)!.slice(0, 3).map(Number);
      let ancestor: Element | null = element;
      let background: number[] = [];
      while (ancestor) {
        const values = getComputedStyle(ancestor).backgroundColor.match(/[\d.]+/g)!.map(Number);
        if (values.length === 3 || values[3] === 1) { background = values.slice(0, 3); break; }
        ancestor = ancestor.parentElement;
      }
      const luminance = (rgb: number[]) => rgb.map(channel => { const v = channel / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((total, v, i) => total + v * [0.2126, 0.7152, 0.0722][i], 0);
      const f = luminance(foreground), b = luminance(background);
      return { text: element.textContent, contrast: (Math.max(f, b) + 0.05) / (Math.min(f, b) + 0.05) };
    }));
    for (const sample of samples) expect(sample.contrast, sample.text ?? "").toBeGreaterThanOrEqual(4.5);
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
      await expect(page.locator("#demo").getByRole("button", { name: /^Copy / })).toHaveCount(1);
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
  await page.locator("details[data-docs-browser]").getByRole("link", { name: "First tutorial", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "First tutorial", exact: true })).toBeVisible();
  await context.close();
});
