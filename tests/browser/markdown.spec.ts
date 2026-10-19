import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  for (const theme of ["dark", "light"]) {
    test(`Markdown copy and download work in ${theme} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(theme => {
        localStorage.setItem("ragvidence-theme", theme);
        Object.defineProperty(navigator, "clipboard", { configurable: true, value: {
          writeText: async (text: string) => { document.documentElement.dataset.copied = text; },
        } });
      }, theme);
      await page.goto("/docs/installation");
      const response = await page.request.get("/docs/installation/markdown");
      const markdown = await response.text();
      expect(response.headers()["content-type"]).toBe("text/markdown; charset=utf-8");
      expect(response.headers()["x-robots-tag"]).toBe("noindex");
      expect(markdown).toContain('uv tool install --python 3.12 "ragvidence==0.2.1"');
      const copy = page.getByRole("button", { name: "Copy as Markdown", exact: true });
      await copy.focus();
      await page.keyboard.press("Enter");
      await expect(page.locator("html")).toHaveAttribute("data-copied", markdown);
      await expect(page.getByRole("status").filter({ hasText: "Article copied to clipboard." })).toBeVisible();
      const pendingDownload = page.waitForEvent("download");
      await page.getByRole("link", { name: "Download .md", exact: true }).click();
      expect((await pendingDownload).suggestedFilename()).toBe("ragvidence-installation.md");
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
      await page.getByRole("navigation", { name: "Previous and next documentation" }).getByRole("link", { name: /Bring your own data/ }).click();
      await expect(page.getByRole("link", { name: "Download .md", exact: true })).toHaveAttribute("href", "/docs/bring-your-own-data/markdown");
    });
  }
}

test("clipboard rejection exposes selectable Markdown and supports retry", async ({ page }) => {
  await page.addInitScript(() => {
    let attempts = 0;
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: {
      writeText: async (text: string) => {
        if (++attempts === 1) throw new Error("Permission denied");
        document.documentElement.dataset.copied = text;
      },
    } });
  });
  await page.goto("/docs/supported-inputs");
  await page.getByRole("button", { name: "Copy as Markdown", exact: true }).click();
  const fallback = page.getByRole("textbox", { name: "Article Markdown", exact: true });
  await expect(fallback).toBeVisible();
  await fallback.focus();
  expect(await fallback.evaluate((el: HTMLTextAreaElement) => el.selectionEnd - el.selectionStart)).toBe((await fallback.inputValue()).length);
  await expect(page.getByRole("status").filter({ hasText: "Clipboard unavailable" })).toBeVisible();
  await page.getByRole("button", { name: "Copy as Markdown", exact: true }).click();
  await expect(page.getByRole("button", { name: "Markdown copied", exact: true })).toBeVisible();
  await expect(fallback).toHaveCount(0);
});

test("Markdown fetch failure offers download and a successful retry", async ({ page }) => {
  let attempts = 0;
  await page.route("**/docs/overview/markdown", route => ++attempts === 1 ? route.fulfill({ status: 503, body: "Unavailable" }) : route.continue());
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => {} } });
  });
  await page.goto("/docs");
  await page.getByRole("button", { name: "Copy as Markdown", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Could not load Markdown" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Download .md", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Copy as Markdown", exact: true }).click();
  await expect(page.getByRole("button", { name: "Markdown copied", exact: true })).toBeVisible();
});

test("Markdown remains downloadable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("/docs/reports");
    const pendingDownload = page.waitForEvent("download");
    await page.getByRole("link", { name: "Download .md", exact: true }).click();
    expect((await pendingDownload).suggestedFilename()).toBe("ragvidence-reports.md");
  } finally { await context.close(); }
});
