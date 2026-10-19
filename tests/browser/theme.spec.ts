import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  for (const theme of ["dark", "light"]) {
    test(`${theme} theme persists before hydration and across navigation at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(theme => localStorage.setItem("ragvidence-theme", theme), theme);
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const toggle = page.getByRole("button", { name: "Light theme", exact: true });
      await expect(toggle).toHaveAttribute("aria-pressed", String(theme === "light"));
      if (width < 1280) await page.getByRole("button", { name: "Open navigation" }).click();
      await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Docs", exact: true }).or(page.locator("#mobile-navigation").getByRole("link", { name: "Docs", exact: true })).filter({ visible: true }).click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      for (const route of ["/docs/semantic-workflow", "/docs/metrics", "/docs/supported-inputs", "/releases"]) {
        await page.goto(route);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      }
      await toggle.focus();
      await page.keyboard.press("Enter");
      const next = theme === "light" ? "dark" : "light";
      await expect(page.locator("html")).toHaveAttribute("data-theme", next);
      expect(await page.evaluate(() => localStorage.getItem("ragvidence-theme"))).toBe(next);
      expect(errors).toEqual([]);
    });
  }
}

test("stored light theme paints while hydration scripts are held back", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("ragvidence-theme", "light"));
  await page.route("**/_next/**/*.js", route => route.abort());
  await page.goto("/docs/installation", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await page.locator("body").evaluate(el => getComputedStyle(el).color)).toBe("rgb(32, 33, 38)");
});

test("theme switching survives blocked storage and stays readable without blur", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, "localStorage", { get() { throw new Error("Blocked"); } }));
  await page.goto("/");
  await page.addStyleTag({ content: ".site-nav { backdrop-filter: none !important; background: var(--color-panel) !important; }" });
  await page.getByRole("button", { name: "Light theme", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("status").filter({ hasText: "Theme changed for this visit" })).toBeAttached();
  expect(await page.locator(".site-nav").evaluate(el => getComputedStyle(el).backgroundColor)).toBe("rgb(250, 251, 252)");
});

for (const theme of ["dark", "light"]) {
  test(`report ${theme} keeps native keyboard evidence and closed-disclosure print`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/sample-report.html");
    if (theme === "light") await page.getByRole("button", { name: "Light mode" }).click();
    const navigation = page.getByRole("navigation", { name: "Report navigation" });
    await navigation.focus();
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => navigation.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
    const links = navigation.getByRole("link");
    await links.first().focus();
    for (let index = 1; index < await links.count(); index++) await page.keyboard.press("Tab");
    const lastLink = links.last();
    await expect(lastLink).toBeFocused();
    for (let attempt = 0; attempt < 25 && !(await lastLink.evaluate(el => {
      const a = el.getBoundingClientRect(), b = el.closest("nav")!.getBoundingClientRect();
      return a.left >= b.left && a.right <= b.right;
    })); attempt++) {
      await navigation.focus(); await page.keyboard.press("ArrowRight"); await page.waitForTimeout(120);
    }
    await lastLink.focus();
    await expect(lastLink).toBeInViewport();
    const participant = page.locator("#participant-2");
    const summary = participant.getByText("Ranked contexts and stage evidence (4 questions)", { exact: true });
    await summary.focus(); await page.keyboard.press("Enter");
    await participant.locator("summary").filter({ hasText: /^Q1 ·/ }).first().click();
    await expect(participant.locator("article").first()).toBeVisible();
    await expect(participant.locator("article").first()).toContainText("Keep USB-C power connected throughout the reset.");
    await page.keyboard.press("Enter");
    await page.emulateMedia({ media: "print" });
    expect(await participant.locator("article").first().evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThan(100);
  });
}


test("marketing grid and docs frame share defined edges and the evidence/CLI identity", async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const frames = await page.locator("main .frame").evaluateAll(elements => elements.map(el => {
    const r = el.getBoundingClientRect(); return { left: r.left, right: r.right };
  }));
  expect(frames.length).toBeGreaterThan(10);
  for (const frame of frames) { expect(frame.left).toBe(frames[0].left); expect(frame.right).toBe(frames[0].right); }
  expect(await page.locator(".feature-grid").evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length)).toBe(3);
  await expect(page.locator("header .brand-dark")).toHaveAttribute("src", "/brand/evidence-cli/mark-dark.svg");
  expect(await (await request.get("/icon.svg")).text()).toContain('m12 8 8 8-8 8');
  await page.goto("/docs/installation");
  await expect(page.locator(".docs-masthead")).toContainText("CLI v0.2.1");
  expect(await page.locator(".docs-article").evaluate(el => getComputedStyle(el).borderLeftWidth)).toBe("1px");
});
