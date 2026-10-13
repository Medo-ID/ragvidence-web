import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";

export async function captureOwnData({ page, command, working, wheel, fixturePath, transcript }) {
  const fixture = JSON.parse(await readFile(fixturePath, "utf8"));
  if (!fixture.sources?.length || !fixture.questions?.length) throw new Error("Empty recording fixture");
  await command("uv", ["venv", "--python", "3.12", join(working, "venv")]);
  await command("uv", ["pip", "install", "--python", join(working, "venv/bin/python"), `${wheel}[semantic]`]);
  const ragvi = join(working, "venv/bin/ragvi");
  await command(ragvi, ["verify"]);
  const init = await command(ragvi, ["init", "shop-support"]);
  const workspace = join(working, "workspaces/shop-support");
  for (const name of ["sources", "questions"]) await writeFile(join(workspace, `${name}.jsonl`), fixture[name].map(row => JSON.stringify(row)).join("\n") + "\n");
  const validate = await command(ragvi, ["validate", "."], workspace);
  const benchmark = await command(ragvi, ["benchmark", ".", "--strategies", "bm25,semantic", "--k", "2"], workspace);
  const evaluateCommands = ["ragvi evaluate . runs/bm25-body.json", "ragvi evaluate . runs/semantic-body.json"];
  const evaluated = [];
  for (const run of ["bm25-body", "semantic-body"]) evaluated.push(await command(ragvi, ["evaluate", ".", `runs/${run}.json`], workspace));
  const reportOutput = await command(ragvi, ["report", "evaluations/bm25-body.json", "report.html", "--intervention", "evaluations/semantic-body.json", "--format", "html"], workspace);
  const baseline = JSON.parse(await readFile(join(workspace, "evaluations/bm25-body.json"), "utf8"));
  const candidate = JSON.parse(await readFile(join(workspace, "evaluations/semantic-body.json"), "utf8"));
  if (baseline.manifest.dataset_hash !== candidate.manifest.dataset_hash || baseline.manifest.config.k !== candidate.manifest.config.k || baseline.manifest.config.representation !== candidate.manifest.config.representation) throw new Error("Comparison changes more than the retrieval strategy");
  const after = new Map(candidate.questions.map(q => [q.question_id, q.sufficient_evidence]));
  const changes = { improved: 0, regressed: 0, unresolved: 0, stable: 0 }, recovered = [];
  for (const q of baseline.questions) {
    if (q.sufficient_evidence === false && after.get(q.question_id) === true) { changes.improved++; recovered.push(q.question_id); }
    if (q.sufficient_evidence === true && after.get(q.question_id) === false) changes.regressed++;
    if (q.sufficient_evidence === false && after.get(q.question_id) === false) changes.unresolved++;
    if (q.sufficient_evidence === true && after.get(q.question_id) === true) changes.stable++;
  }
  if (!recovered.length) throw new Error("No changed question to investigate; do not invent a result");
  const shownQuestion = fixture.questions.find(q => q.question_id === recovered[0]);
  const shownSource = fixture.sources.find(source => source.evidence_ids.some(id => shownQuestion.required_evidence_ids.includes(id)));
  const report = join(workspace, "report.html"), html = await readFile(report, "utf8");
  const fontCSS = html.match(/@font-face\s*\{[^}]*\}/g).join("\n");
  const terminal = join(working, "terminal.html");
  await writeFile(terminal, `<!doctype html><html><meta charset="utf-8"><style>${fontCSS}*{box-sizing:border-box}body{margin:0;background:#050809;color:#f2f6f5;font-family:Geist,sans-serif}header{height:72px;border-bottom:1px solid #174e56;padding:22px 240px;font-size:20px;color:#8bd4db}main{width:1440px;margin:60px auto}#command{font:28px/44px "Geist Mono",monospace;white-space:pre-wrap}pre{margin:28px 0;white-space:pre-wrap;overflow-wrap:anywhere;font:25px/40px "Geist Mono",monospace}a{display:inline-block;margin-top:16px;color:#8bd4db;font-size:24px;text-underline-offset:6px}[hidden]{display:none}</style><header>Terminal · <span id="cwd">RAGvidence</span></header><main><pre id="history" hidden></pre><div id="command">$ <span id="typed"></span></div><pre id="result"></pre><a id="report-link" hidden>Open report.html ↗</a></main></html>`);
  const captures = {}, points = {};
  async function capture(name) {
    await page.evaluate(() => document.fonts.ready);
    const png = await page.screenshot(); captures[name] = png.toString("base64"); await writeFile(join(working, `${name}-native.png`), png);
  }
  async function center(locator) { const box = await locator.boundingBox(); return { x: box.x + box.width / 2, y: box.y + box.height / 2 }; }
  async function terminalScene(name, text, output, link = false) {
    await page.goto(pathToFileURL(terminal).href);
    await page.locator("#cwd").evaluate((el, value) => { el.textContent = value; }, name.startsWith("init") ? "RAGvidence" : "workspaces/shop-support");
    await page.locator("#history").evaluate((el, value) => { el.textContent = value; el.hidden = !value; }, name.startsWith("benchmark") ? `$ ragvi validate .\n${validate.trim()}` : "");
    await page.locator("#typed").evaluate((el, value) => { el.textContent = value; }, text);
    await page.locator("#result").evaluate((el, value) => { el.textContent = value; }, output);
    const box = await page.locator("#typed").boundingBox(); points[name] = { x: box.x, y: box.y };
    if (link) { await page.locator("#report-link").evaluate((el, href) => { el.hidden = false; el.href = href; }, pathToFileURL(report).href); points.link = await center(page.locator("#report-link")); }
    await capture(name);
  }
  await terminalScene("initTyping", "", "");
  await terminalScene("initDone", "ragvi init shop-support", `${init.trim()}\n\n$ cd workspaces/shop-support`);
  const editor = join(working, "dataset.html");
  await writeFile(editor, `<!doctype html><html><meta charset="utf-8"><style>${fontCSS}*{box-sizing:border-box}body{margin:0;background:#050809;color:#f2f6f5;font-family:Geist,sans-serif}header{height:76px;border-bottom:1px solid #174e56;padding:24px 64px;font-size:22px;color:#8bd4db}main{display:grid;grid-template-columns:1fr 1fr;gap:36px;padding:44px 64px}section{border:1px solid #174e56;background:#090d0f;border-radius:12px;overflow:hidden}h2{margin:0;padding:22px 28px;font:24px "Geist Mono",monospace;border-bottom:1px solid #174e56;color:#8bd4db}pre{margin:0;padding:28px;white-space:pre-wrap;overflow-wrap:anywhere;font:24px/36px "Geist Mono",monospace}footer{margin:0 64px;color:#a4b0ae;font-size:22px}</style><header>workspaces/shop-support / Files</header><main><section><h2>sources.jsonl</h2><pre id="source"></pre></section><section><h2>questions.jsonl</h2><pre id="question"></pre></section></main><footer id="records"></footer></html>`);
  await page.goto(pathToFileURL(editor).href);
  await page.locator("#source").evaluate((el, value) => { el.textContent = value; }, JSON.stringify(shownSource, null, 2));
  await page.locator("#question").evaluate((el, value) => { el.textContent = value; }, JSON.stringify(shownQuestion, null, 2));
  await page.locator("#records").evaluate((el, value) => { el.textContent = value; }, `Synthetic shop policies · ${fixture.sources.length} source units · ${fixture.questions.length} labeled questions · Record preview (JSONL stores one object per line)`);
  await capture("dataset");
  await terminalScene("benchmarkTyping", "", "");
  await terminalScene("benchmarkDone", "ragvi benchmark . --strategies bm25,semantic --k 2", benchmark);
  await terminalScene("evaluateTyping", "", "");
  await terminalScene("evaluateDone", evaluateCommands[0], `${evaluated[0].trim()}\n\n$ ${evaluateCommands[1]}\n${evaluated[1].trim()}`);
  const reportCommand = "ragvi report evaluations/bm25-body.json report.html \\\n  --intervention evaluations/semantic-body.json --format html";
  await terminalScene("reportTyping", "", "");
  await terminalScene("reportDone", reportCommand, reportOutput, true);
  await page.locator("#report-link").click();
  points.improvementsLink = await center(page.getByRole("link", { name: "Improvements", exact: true }).first());
  await capture("summary");
  await page.getByRole("link", { name: "Improvements", exact: true }).first().click();
  const question = page.locator("#improvements .question-card").filter({ hasText: shownQuestion.question_id }).first();
  points.question = await center(question.locator("summary")); await capture("closed");
  await question.locator("summary").click(); await capture("opened");
  for (const id of shownQuestion.required_evidence_ids) if (!(await question.innerText()).includes(id)) throw new Error("Required evidence absent from investigation");
  return { captures, points, fontCSS, typing: { init: "ragvi init shop-support", benchmark: "ragvi benchmark . --strategies bm25,semantic --k 2", evaluate: evaluateCommands[0], report: reportCommand }, provenance: { workflow: "own-data", mockData: true, sourceCount: fixture.sources.length, questionCount: fixture.questions.length, datasetHash: baseline.manifest.dataset_hash, comparison: { baseline: "bm25-body", intervention: "semantic-body", representation: "body", k: 2, provider: "fastembed", model: candidate.manifest.config.model }, inspectedQuestion: shownQuestion.question_id, cliVersion: baseline.manifest.product_version, recordedAt: new Date().toISOString(), width: 1920, height: 1080, fps: 60, frames: 2160, durationSeconds: 36, audio: false, captions: false, wheelSHA256: createHash("sha256").update(await readFile(wheel)).digest("hex"), reportSHA256: createHash("sha256").update(html).digest("hex"), baseline: baseline.summary, candidate: candidate.summary, changes, commands: transcript, zooms: [{ stage: "Benchmark command", scale: 1.18, durationMs: 400 }, { stage: "Changed evidence", scale: 1.18, durationMs: 400 }], presentation: "Native captures of an installed wheel, temporary synthetic dataset, genuine BM25 and local semantic runs, evaluations, and generated report. Execution waits and first model download omitted. Two purposeful zooms, clean cuts, fixed-size cursor. No old recording input or upscale. No sound, narration, captions, controls, browser chrome, confidential data, or personal paths. Synthetic result is not a general performance claim." } };
}
