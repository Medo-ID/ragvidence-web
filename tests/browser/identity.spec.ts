import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

for (const [width, height] of [[360,800],[390,844],[768,1024],[1280,800],[1440,900],[1920,1080]]) {
  test(`responsive navigation and reading widths are usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/docs/semantic-workflow");
    const content = await page.locator(".doc-content").boundingBox();
    expect(content!.width).toBeGreaterThan(width < 768 ? 320 : width < 1280 ? 650 : 650);
    if (width < 1280) {
      await expect(page.locator(".on-this-page > nav")).toBeHidden();
      await page.locator("details[data-docs-browser] summary").click();
      const link = page.locator("details[data-docs-browser]").getByRole("link", { name: "Installation", exact: true });
      expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    } else {
      await expect(page.locator(".on-this-page > nav")).toBeVisible();
      await expect(page.locator(".docs-shell > aside")).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("report works offline without scripts and prints closed ranked evidence", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const remote: string[] = [];
  page.on("request", request => { if (!/^(file:|data:)/.test(request.url())) remote.push(request.url()); });
  await page.goto(pathToFileURL(resolve("public/tutorial-report.html")).href);
  await expect(page.locator("script, img, link")).toHaveCount(0);
  await expect(page.locator(".result")).toHaveText("60% → 90%");
  const question = page.locator("#improvements .question-card").first();
  await question.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(question).toHaveAttribute("open", "");
  await expect(question).toContainText("Required evidence gained: E-ORION-42-RESET");
  await page.keyboard.press("Enter");
  await expect(question).not.toHaveAttribute("open", "");
  await page.emulateMedia({ media: "print" });
  expect(await question.locator(".investigation").evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThan(100);
  expect(remote).toHaveLength(0);
  await context.close();
});

test("env and JSONL copy exact raw content without terminal prompts", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => { document.documentElement.dataset.copied = text; } } }));
  for (const [route, label] of [["/docs/semantic-workflow", ".env"], ["/docs/bring-your-own-data", "JSONL"]]) {
    await page.goto(route);
    const block = page.locator(".terminal").filter({ has: page.getByText(new RegExp(label === ".env" ? "^\\.env" : "^JSONL")) }).first();
    const raw = await block.locator("code").textContent();
    expect(raw).not.toMatch(/^\$ /);
    await block.getByRole("button", { name: /^Copy / }).click();
    await expect(page.locator("html")).toHaveAttribute("data-copied", raw!);
    await expect(block.getByRole("button")).toHaveText("Copied");
  }
});

test("portable comparison stays offline, exposes all participants and prints opened evidence", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const remote: string[] = [];
  page.on("request", request => { if (!/^(file:|data:)/.test(request.url())) remote.push(request.url()); });
  await page.goto(pathToFileURL(resolve("public/sample-report.html")).href);
  await expect(page.locator("script, img, link")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "parent-child versus bm25", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "compress versus bm25", exact: true })).toBeVisible();
  const parent = page.locator("section").filter({ has: page.getByRole("heading", { name: "parent-child", exact: true }) });
  const summary = parent.getByText("Ranked contexts and stage evidence (4 questions)", { exact: true });
  await summary.focus();
  await page.keyboard.press("Enter");
  const question = parent.locator("article").first();
  await expect(question).toContainText("Keep USB-C power connected throughout the reset.");
  await expect(question).toContainText("Sufficient: True");
  await page.emulateMedia({ media: "print" });
  await expect(question).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(remote).toHaveLength(0);
  await context.close();
});

test("docs rails track headings and compact navigation works by keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/docs/semantic-workflow");
  const toc = page.locator(".on-this-page nav:visible");
  await expect(toc).toBeVisible();
  await expect(page.locator(".docs-shell > aside:visible")).toBeVisible();
  expect((await page.locator(".doc-content").boundingBox())!.width).toBeGreaterThan(650);
  await toc.getByRole("link", { name: "Ollama embeddings", exact: true }).click();
  await expect(toc.getByRole("link", { name: "Ollama embeddings", exact: true })).toHaveAttribute("aria-current", "location");
  expect((await page.locator("#ollama").boundingBox())!.y).toBeGreaterThan(68);
  for (const width of [390, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/docs/semantic-workflow");
    const summary = page.locator(".on-this-page summary");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".on-this-page details")).toHaveAttribute("open", "");
    await expect(page.locator(".on-this-page nav:visible")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

for (const [width, height] of [[360, 800], [390, 844], [768, 1024], [1280, 800], [1440, 900], [1920, 1080]]) {
  test(`production installation is readable above the fold at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    const command = page.locator("#hero-install-command code");
    await expect(command).toHaveText('uv tool install --python 3.12 "ragvidence==0.2.0"');
    const box = await command.boundingBox();
    expect(box!.y + box!.height).toBeLessThan(height);
    expect(await command.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  });
}

test("essential website text meets AA contrast and docs search has visible focus", async ({ page }) => {
  for (const route of ["/", "/docs/semantic-workflow"]) {
    await page.goto(route);
    const samples = await page.locator("h1, h2, p, a, button, summary, pre code, input").evaluateAll(elements => {
      const rgb = (value: string) => value.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0];
      const blend = (fg: number[], bg: number[]) => fg.slice(0, 3).map((v, i) => v * (fg[3] ?? 1) + bg[i] * (1 - (fg[3] ?? 1)));
      const lum = (color: number[]) => color.map(v => { const n = v / 255; return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4; }).reduce((sum, n, i) => sum + n * [0.2126, 0.7152, 0.0722][i], 0);
      return elements.filter(el => el.getClientRects().length && getComputedStyle(el).visibility === "visible" && !el.closest("[inert], .sr-only") && !(el instanceof HTMLButtonElement && el.disabled)).map(el => {
        const chain: Element[] = [];
        for (let parent: Element | null = el; parent; parent = parent.parentElement) chain.unshift(parent);
        let bg = [5, 8, 9];
        for (const parent of chain) bg = blend(rgb(getComputedStyle(parent).backgroundColor), bg);
        const fg = blend(rgb(getComputedStyle(el).color), bg);
        const a = lum(fg), b = lum(bg);
        return { text: (el.textContent ?? "input").slice(0, 70), contrast: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) };
      });
    });
    expect(samples.length).toBeGreaterThan(20);
    for (const sample of samples) expect(sample.contrast, sample.text).toBeGreaterThanOrEqual(4.5);
  }
  await page.getByRole("textbox", { name: "Search documentation" }).filter({ visible: true }).focus();
  expect(await page.locator(".search-field:focus-within").evaluate(el => getComputedStyle(el).outlineWidth)).toBe("2px");
});
