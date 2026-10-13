import { expect, test } from "@playwright/test";

test("env and JSONL copy exact raw content without terminal prompts", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => { document.documentElement.dataset.copied = text; } } }));
  for (const [route, label] of [["/docs/semantic-workflow", ".env"], ["/docs/evidence-labels", "JSONL"]]) {
    await page.goto(route);
    const block = page.locator(".terminal").filter({ has: page.getByText(new RegExp(label === ".env" ? "^\\.env$" : "^JSONL")) }).first();
    const raw = await block.locator("code").textContent();
    expect(raw).not.toMatch(/^\$ /);
    await block.getByRole("button", { name: /^Copy / }).click();
    await expect(page.locator("html")).toHaveAttribute("data-copied", raw!);
    await expect(block.getByRole("button")).toHaveText("Copied");
  }
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
    await expect(command).toHaveText('uv tool install --python 3.12 "ragvidence[semantic]"');
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
