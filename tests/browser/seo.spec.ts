import { expect, test } from "@playwright/test";
import { docs } from "../../src/lib/docs";

const domain = "https://ragvidence.medo-id.com";
test.use({ javaScriptEnabled: false });

test("SEO: server-rendered page metadata describes each destination", async ({ page }) => {
  const routes = ["/", "/docs", ...docs.map(doc => `/docs/${doc.slug}`), "/releases", "/privacy", "/terms", "/security"];
  for (const route of routes) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), route).toBe(200);
    const canonical = domain + (route === "/docs/overview" ? "/docs" : route);
    const title = await page.title();
    expect(title).toContain("RAGvidence");
    // Next.js normalizes the root URL; compare URL identity, including scheme/path.
    expect(new URL((await page.locator('link[rel="canonical"]').getAttribute("href"))!).href).toBe(new URL(canonical).href);
    expect(new URL((await page.locator('meta[property="og:url"]').getAttribute("content"))!).href).toBe(new URL(canonical).href);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", title);
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description).toBeTruthy();
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", description!);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute("content", description!);
    for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
      const image = new URL((await page.locator(selector).getAttribute("content"))!);
      expect(image.origin).toBe(domain);
      expect(image.pathname).toBe("/opengraph-image");
    }
    await expect(page.locator("h1")).toHaveCount(1);
    const robots = await page.locator('meta[name="robots"]').evaluateAll(elements => elements.map(el => el.getAttribute("content")).join(","));
    expect(robots).not.toMatch(/noindex/);
    expect(response?.headers()["x-robots-tag"] ?? "").not.toMatch(/noindex/);
  }
});

test("SEO: overview alias agrees with preferred canonical and sitemap", async ({ page, request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const urls = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  expect(new Set(urls).size).toBe(urls.length);
  expect(urls).toHaveLength(25);
  for (const slug of ["commands", "supported-inputs", "techniques", "advanced-techniques"]) expect(urls).toContain(`${domain}/docs/${slug}`);
  expect(urls).toContain(domain + "/docs");
  expect(urls).not.toContain(domain + "/docs/overview");
  await page.goto("/docs/overview");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("What RAGvidence does");
  await expect(page.locator('nav[aria-label="Documentation"]:visible').getByRole("link", { name: "What RAGvidence does" })).toHaveAttribute("href", "/docs");
});

test("SEO: site identity and article breadcrumbs are crawlable inert data", async ({ page }) => {
  await page.goto("/");
  const identity = await page.locator('script[type="application/ld+json"]').evaluateAll(elements => elements.map(el => JSON.parse(el.textContent!)));
  expect(identity).toHaveLength(1);
  expect(identity[0]).toMatchObject({ "@context": "https://schema.org", "@type": "WebSite", name: "RAGvidence", url: domain + "/" });
  await page.goto("/docs/installation");
  const breadcrumb = await page.locator('article script[type="application/ld+json"]').evaluate(el => JSON.parse(el.textContent!));
  expect(breadcrumb).toMatchObject({ "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Documentation", item: domain + "/docs" },
    { "@type": "ListItem", position: 2, name: "Installation", item: domain + "/docs/installation" },
  ] });
});

test("SEO: removed design previews return 404 while public product assets remain usable", async ({ request }) => {
  for (const path of ["/brand/concepts.html", "/brand/brand-sheet.html", ...["a-evidence-convergence", "b-evidence-search", "c-connected-v"].map(concept => `/brand/${concept}/tab-preview.html`)]) {
    const response = await request.get(path);
    expect(response.status()).toBe(404);
    expect(response.headers()["x-frame-options"]).toBe("DENY");
  }
  for (const path of ["/favicon.ico", "/icon.svg", "/brand/evidence-cli/mark-dark.svg", "/brand/evidence-cli/mark-light.svg", "/sample-report.html"]) {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
    expect(response.headers()["x-robots-tag"] ?? "").not.toMatch(/noindex/);
  }
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Allow: /");
  expect(await robots.text()).toContain("Sitemap: " + domain + "/sitemap.xml");
});
