// Capture real states of the byte-identical production report; never alter evidence.
import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
export async function captureOwnData({ page, working, wheel }) {
  const source = JSON.parse(await readFile("public/examples/provenance.json", "utf8"));
  if (hash(await readFile(wheel)) !== source.wheelSHA256 || source.cliVersion !== "0.2.1") throw new Error("Requires the verified production 0.2.1 wheel");
  for (const file of source.files) if (hash(await readFile(file.path)) !== file.sha256) throw new Error(`Changed artifact ${file.path}`);
  const html = await readFile("public/sample-report.html", "utf8");
  const fontCSS = html.match(/@font-face\s*\{[^}]*\}/g)?.join("\n") ?? "";
  const captures = {}, points = {}, interactions = [], errors = [], requests = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => { if (/^https?:/.test(request.url())) requests.push(request.url()); });
  async function capture(name, fullPage = true) {
    await page.evaluate(() => document.fonts.ready);
    const bytes = await page.screenshot({ fullPage });
    captures[name] = bytes.toString("base64");
    await writeFile(join(working, `${name}.png`), bytes);
  }
  async function absoluteY(locator) { return locator.evaluate(el => el.getBoundingClientRect().top + scrollY); }
  await page.goto(pathToFileURL(resolve("public/sample-report.html")).href);
  points.summary = await absoluteY(page.locator("#summary"));
  points.resources = await absoluteY(page.locator("#tradeoffs"));
  points.changes = await absoluteY(page.locator("#pair-1"));
  points.parent = await absoluteY(page.locator("#participant-2"));
  const themeBox = await page.locator("#theme-toggle").boundingBox();
  points.themeX = themeBox.x + themeBox.width / 2; points.themeY = themeBox.y + themeBox.height / 2;
  await capture("report");
  await page.getByRole("navigation", { name: "Report navigation" }).getByRole("link", { name: "parent-child", exact: true }).click();
  interactions.push({ action: "click", target: "Report navigation / parent-child" });
  const summary = page.locator("#participant-2").getByText("Ranked contexts and stage evidence (4 questions)", { exact: true });
  await summary.click();
  interactions.push({ action: "click", target: "Ranked contexts and stage evidence (4 questions)", open: true });
  await page.evaluate(() => scrollTo(0, 0));
  await capture("ranked");
  const questionSummary = page.locator("#participant-2 summary").filter({ hasText: /^Q1 ·/ }).first();
  points.questionDisclosure = await absoluteY(questionSummary);
  await questionSummary.click();
  interactions.push({ action: "click", target: "Q1 / original ranked evidence", open: true });
  const article = page.locator("#participant-2 article").first();
  if (!await article.isVisible()) throw new Error("Question evidence did not open");
  if (!(await article.textContent()).includes("Keep USB-C power connected throughout the reset.")) throw new Error("Missing real power evidence");
  points.disclosure = await absoluteY(summary);
  points.evidence = await absoluteY(article);
  await page.evaluate(() => scrollTo(0, 0));
  await capture("evidence");
  await page.getByRole("button", { name: "Light mode" }).click();
  interactions.push({ action: "click", target: "Light mode", theme: "light" });
  await capture("light");
  await page.setViewportSize({ width: 794, height: 1123 });
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: join(working, "report-print.pdf"), format: "A4", printBackground: false });
  await article.evaluate(el => scrollTo(0, el.getBoundingClientRect().top + scrollY - 40));
  await capture("print", false);
  interactions.push({ action: "print", closedDisclosures: await page.locator("details:not([open])").count() });
  await page.emulateMedia({ media: "screen" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => scrollTo(0, 0));
  points.mobileNav = await absoluteY(page.getByRole("navigation", { name: "Report navigation" }));
  await capture("mobile");
  const navigation = page.getByRole("navigation", { name: "Report navigation" });
  await navigation.focus(); await page.keyboard.press("ArrowRight"); await page.waitForTimeout(150);
  interactions.push({ action: "keyboard", target: "mobile report navigation", key: "ArrowRight", scrollLeft: await navigation.evaluate(el => el.scrollLeft) });
  await capture("mobileNav", false);
  await article.evaluate(el => scrollTo(0, el.getBoundingClientRect().top + scrollY - 24));
  await capture("mobileEvidence", false);
  await page.setViewportSize({ width: 1920, height: 1080 });
  if (errors.length || requests.length) throw new Error(JSON.stringify({ errors, requests }));
  const inspect = source.commands.find(x => x.command.startsWith("ragvi bm25 ./docs/manual.md"));
  const compare = source.commands.find(x => x.command.includes("--techniques bm25,parent-child,compress"));
  if (!inspect || !compare) throw new Error("Missing actual command transcripts");
  const inputs = { manual: await readFile("public/examples/manual.md", "utf8"), questions: await readFile("public/examples/questions.txt", "utf8"), reviewed: JSON.parse(await readFile("public/examples/reviewed.json", "utf8")) };
  const sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  const authoringFiles = ["scripts/capture-own-data.mjs", "scripts/render-demo-frames.mjs", "scripts/record-walkthrough.mjs", "scripts/walkthrough-plan.mjs", "src/app/globals.css", "src/app/page.tsx", "src/components/product-sections.tsx", "src/components/product-walkthrough.tsx", "src/components/product-demo.tsx", "public/brand/evidence-cli/mark-dark.svg"];
  return { captures, points, fontCSS, typing: { inspect, compare, inputs }, provenance: {
    workflow: "own-data", mockData: true, cliVersion: source.cliVersion, releaseTag: source.releaseTag, releaseCommit: source.releaseCommit,
    websiteSourceCommit: sourceCommit, websiteSourceFiles: await Promise.all(authoringFiles.map(async path => ({ path, sha256: hash(await readFile(path)) }))),
    recordedAt: new Date().toISOString(), width: 1920, height: 1080, fps: 30, frames: 660, durationSeconds: 22, audio: false, captions: true,
    sourceCount: 1, questionCount: 4, wheelSHA256: source.wheelSHA256, reportSHA256: hash(Buffer.from(html)), comparison: source.configuration, sourceFiles: source.files,
    commands: source.commands, interactions, errors, remoteRequests: requests,
    tools: { node: process.version, chromium: page.context().browser().version(), capture: "Playwright native screenshots at deviceScaleFactor=2", compositor: "Canvas 2D, every frame rendered", settings: "1920×1080, 30 fps; H.264/VP9 CRF 20; no audio" },
    presentation: "Continuous cursor, typing, scroll and zoom replay using actual CLI transcripts and native report states captured after genuine interactions. Execution waits omitted. Synthetic dev-only data. No general performance or quality claim; no automatic winner. Color changes are document-local; mobile and paper views use the same unmodified report.",
  } };
}
