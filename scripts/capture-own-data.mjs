// Capture only verified synthetic PyPI outputs. textContent keeps fixture text inert.
import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
export async function captureOwnData({ page, working, wheel }) {
  const provenance = JSON.parse(await readFile("public/examples/provenance.json", "utf8"));
  if (hash(await readFile(wheel)) !== provenance.wheelSHA256 || provenance.cliVersion !== "0.2.0") throw new Error("Recording requires the verified production 0.2.0 wheel");
  for (const file of provenance.files) if (hash(await readFile(file.path)) !== file.sha256) throw new Error(`Changed artifact ${file.path}`);
  const html = await readFile("public/sample-report.html", "utf8");
  const fontCSS = html.match(/@font-face\s*\{[^}]*\}/g)?.join("\n") ?? "";
  const captures = {};
  async function capture(name) { await page.evaluate(() => document.fonts.ready); const bytes = await page.screenshot(); captures[name] = bytes.toString("base64"); await writeFile(join(working, `${name}.png`), bytes); }
  const terminal = join(working, "terminal.html");
  await writeFile(terminal, `<!doctype html><html lang="en"><meta charset="utf-8"><title>RAGvidence CLI 0.2.0</title><style>${fontCSS}*{box-sizing:border-box}body{margin:0;background:#050809;color:#f2f6f5;font-family:Geist,sans-serif}header{padding:30px 80px;border-bottom:1px solid #174e56;color:#8bd4db;font-size:24px}main{padding:50px 80px}h1{font-size:38px;margin:0 0 36px}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:25px/1.55 'Geist',monospace;margin:0}footer{position:fixed;bottom:25px;left:80px;color:#a4b0ae;font-size:20px}</style><header>RAGvidence 0.2.0 · Free Apache-2.0 CLI</header><main><h1></h1><pre></pre></main><footer>Synthetic device manual · Four reviewed dev questions · k=1 · No model · Execution waits omitted</footer></html>`);
  async function scene(name, title, text) { await page.goto(pathToFileURL(terminal).href); await page.locator("h1").evaluate((el, value) => { el.textContent = value; }, title); await page.locator("pre").evaluate((el, value) => { el.textContent = value; }, text); await page.locator("pre").evaluate(el => { let size = 25; while (el.scrollHeight > 760 && size > 14) { size--; el.style.fontSize = `${size}px`; el.style.lineHeight = "1.4"; } }); await capture(name); }
  const commands = provenance.commands;
  const first = commands.find(x => x.command.startsWith("ragvi bm25 ./docs/manual.md"));
  const comparison = commands.find(x => x.command.includes("--techniques bm25,parent-child,compress"));
  if (!first || !comparison) throw new Error("Missing actual execution transcripts");
  await scene("files", "1. Start with your own files and questions", `docs/manual.md\n${await readFile("public/examples/manual.md", "utf8")}\nquestions.txt\n${await readFile("public/examples/questions.txt", "utf8")}`);
  await scene("inspect", "2. Inspect retrieval without a workspace", `${first.command}\n\n${first.output}`);
  await scene("review", "3. Review the facts needed for a complete answer", `Q1: How long should I hold the reset button, and what power is required?\n\n${JSON.stringify(JSON.parse(await readFile("public/examples/reviewed.json", "utf8")).evidence.slice(0, 2), null, 2)}\n\nReviewed references anchor both facts to original text spans.`);
  await scene("compare", "4. Compare the same frozen data", `${comparison.command}\n\n${comparison.output}`);
  await page.goto(pathToFileURL(resolve("public/sample-report.html")).href);
  await capture("summary");
  const parent = page.locator("section").filter({ has: page.getByRole("heading", { name: "parent-child", exact: true }) });
  await parent.getByText("Ranked contexts and stage evidence (4 questions)", { exact: true }).click();
  await parent.locator("article").first().scrollIntoViewIfNeeded();
  await capture("evidence");
  return { captures, fontCSS, provenance: { workflow: "own-data", mockData: true, cliVersion: "0.2.0", releaseCommit: provenance.releaseCommit, websiteSourceCommit: provenance.websiteSourceCommit, recordedAt: new Date().toISOString(), width: 1920, height: 1080, fps: 60, frames: 2160, durationSeconds: 36, audio: false, captions: false, sourceCount: 1, questionCount: 4, wheelSHA256: provenance.wheelSHA256, reportSHA256: hash(Buffer.from(html)), comparison: provenance.configuration, sourceFiles: provenance.files, commands, presentation: "Native screenshots of verified production CLI outputs and its unmodified report. Synthetic dev-only data, no model. All participants remain visible. Execution waits omitted. No general performance claim." } };
}
