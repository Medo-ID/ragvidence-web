// Optional media authoring: requires uv, Python 3.12, and Playwright Chromium.
// Runs the released CLI in a new temporary tool environment and workspace.
import { alignWalkthrough } from "./align-walkthrough.mjs";
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { stripVTControlCharacters } from "node:util";

const destination = resolve(process.env.RAGVIDENCE_RECORDING_DIR ?? "public/media");
const working = await mkdtemp(join(tmpdir(), "ragvidence-recording-"));
const output = join(working, "media");
const env = {
  ...process.env,
  UV_TOOL_DIR: join(working, "tools"),
  UV_TOOL_BIN_DIR: join(working, "bin"),
  UV_CACHE_DIR: process.env.UV_CACHE_DIR ?? join(working, "cache"),
  PATH: `${join(working, "bin")}:${process.env.PATH}`,
  NO_COLOR: "1", TERM: "dumb", COLUMNS: "96",
};
await mkdir(output, { recursive: true });
const framePath = join(working, "terminal.html");
await writeFile(framePath, `<!doctype html><html lang="en"><meta charset="utf-8"><title>RAGvidence walkthrough</title>
<style>
*{box-sizing:border-box}body{margin:0;width:1280px;height:720px;background:radial-gradient(ellipse at top right,#19373b,#07090d 80%);color:#f3f7fa;font:20px Arial,sans-serif;padding:28px}header{display:flex;justify-content:space-between;align-items:center;height:54px}header strong{font-size:26px}header span{color:#78b0b4;font-size:17px}section{height:584px;margin-top:18px;border:1px solid #344b50;background:linear-gradient(135deg,#ffffff18,transparent 50%),#14202580;box-shadow:inset 0 1px #ffffff33}h1{font-size:24px;margin:0;padding:20px 24px;border-bottom:1px solid #344b50}#command{display:block;padding:18px 24px;color:#78b0b4;font:18px monospace;border-bottom:1px solid #344b50}pre{height:416px;padding:20px 24px;margin:0;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;font:17px/1.35 monospace}iframe{display:none;width:100%;height:510px;border:0}footer{position:absolute;bottom:18px;left:28px;font-size:14px;color:#94a3b8}#cursor{color:#78b0b4}
</style><header><strong>RAGvidence.</strong><span>Real CLI · v0.1.0 · local BM25 tutorial</span></header>
<section><h1 id="step">Install the Free CLI</h1><code id="command"></code><pre id="output"></pre><iframe title="Generated tutorial report"></iframe></section><footer>Recorded on Linux with Python 3.12 · silent walkthrough · English captions available</footer></html>`);
const browser = await chromium.launch();
let context;
let cues = [];
const transcript = [];
const origin = Date.now();
function timestamp(seconds) {
  const ms = Math.round(seconds * 1000);
  return `${String(Math.floor(ms / 3600000)).padStart(2, "0")}:${String(Math.floor(ms / 60000) % 60).padStart(2, "0")}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")}.${String(ms % 1000).padStart(3, "0")}`;
}
try {
  context = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: join(working, "video"), size: { width: 1280, height: 720 } }, colorScheme: "dark" });
  const page = await context.newPage();
  await page.goto(pathToFileURL(framePath).href);
  let cueStart = (Date.now() - origin) / 1000;
  async function chapter(title, caption) {
    const end = (Date.now() - origin) / 1000;
    if (cues.length) cues.at(-1).end = end;
    cues.push({ start: cueStart, end: undefined, caption });
    await page.locator("#step").evaluate((element, text) => { element.textContent = text; }, title);
    cueStart = end;
    cues.at(-1).start = end;
  }
  async function command(executable, args, shown) {
    await page.locator("#output").evaluate((element) => { element.textContent = ""; });
    await page.locator("#command").evaluate((element, text) => { element.textContent = `$ ${text}`; }, shown);
    await page.waitForTimeout(1200);
    const result = await new Promise((resolveResult, reject) => {
      const child = spawn(executable, args, { cwd: working, env, stdio: ["ignore", "pipe", "pipe"] });
      let text = "";
      child.stdout.on("data", (chunk) => { text += chunk.toString(); });
      child.stderr.on("data", (chunk) => { text += chunk.toString(); });
      child.once("error", reject);
      child.once("close", (code) => resolveResult({ code, text: stripVTControlCharacters(text) }));
    });
    // The complete, unmodified command output is rendered after exit and saved.
    transcript.push({ command: shown, argv: [executable, ...args], ...result });
    await page.locator("#output").evaluate((element, text) => { element.textContent = text; }, result.text);
    if (result.code !== 0) throw new Error(`${shown} exited ${result.code}: ${result.text}`);
    return result.text;
  }
  await chapter("01 / Install the released Free CLI", "Install version 0.1.0 with Python 3.12. The semantic extra enables local embeddings; this tutorial uses BM25.");
  await command(process.env.UV_EXECUTABLE ?? "uv", ["tool", "install", "--python", "3.12", "--index-url", "https://pypi.org/simple", "ragvidence[semantic]==0.1.0"], 'uv tool install --python 3.12 "ragvidence[semantic]==0.1.0"');
  await page.waitForTimeout(6000);
  await page.locator("#output").evaluate((element) => { element.scrollTop = element.scrollHeight; });
  await page.waitForTimeout(4000);
  await chapter("02 / Confirm the release", "Check the installed version before following the versioned documentation.");
  const version = await command(join(working, "bin/ragvi"), ["--version"], "ragvi --version");
  if (version.trim() !== "0.1.0") throw new Error("Unexpected CLI release");
  await page.waitForTimeout(4000);
  await chapter("03 / Check your environment", "Run health checks. Resolve required failures before continuing. The local BM25 tutorial needs no account or API key.");
  await command(join(working, "bin/ragvi"), ["health"], "ragvi health");
  await page.waitForTimeout(9000);
  await chapter("04 / Run one controlled experiment", "Evaluate ten answerable questions at k=2. Compare body text with heading context while keeping questions and retrieval depth fixed.");
  await command(join(working, "bin/ragvi"), ["tutorial"], "ragvi tutorial");
  const baseline = JSON.parse(await readFile(join(working, "workspaces/first-run/evaluations/bm25-body.json"), "utf8"));
  const candidate = JSON.parse(await readFile(join(working, "workspaces/first-run/evaluations/bm25-heading_context.json"), "utf8"));
  if (baseline.summary.successful !== 6 || candidate.summary.successful !== 9 ||
    baseline.summary.answerable !== 10 || candidate.summary.answerable !== 10 ||
    baseline.summary.sufficient_evidence_rate !== 0.6 || candidate.summary.sufficient_evidence_rate !== 0.9 ||
    baseline.manifest.config.k !== 2 || candidate.manifest.config.k !== 2) throw new Error("Unexpected tutorial results");
  const candidateQuestions = new Map(candidate.questions.map((question) => [question.question_id, question.sufficient_evidence]));
  const changes = { improved: 0, regressed: 0, stillInsufficient: 0 };
  for (const question of baseline.questions) {
    const after = candidateQuestions.get(question.question_id);
    if (question.sufficient_evidence === false && after === true) changes.improved += 1;
    if (question.sufficient_evidence === true && after === false) changes.regressed += 1;
    if (question.sufficient_evidence === false && after === false) changes.stillInsufficient += 1;
  }
  if (changes.improved !== 3 || changes.regressed !== 0 || changes.stillInsufficient !== 1) throw new Error("Unexpected question-level changes");
  await page.waitForTimeout(11000);
  await page.screenshot({ path: join(output, "walkthrough-poster.png") });
  await chapter("05 / Inspect the generated report", "Open the generated HTML report locally. The tutorial records 60% versus 90% evidence sufficiency. This is bundled example data.");
  await page.locator("#command").evaluate((element) => { element.style.display = "none"; });
  await page.locator("#output").evaluate((element) => { element.style.display = "none"; });
  const iframe = page.locator("iframe");
  await iframe.evaluate((element, src) => { element.style.display = "block"; element.src = src; }, pathToFileURL(join(working, "workspaces/first-run/reports/tutorial.html")).href);
  const report = page.frameLocator("iframe");
  await report.locator("h1").waitFor();
  const css = (await readFile("public/sample-report.html", "utf8")).match(/<style>([\s\S]*?)<\/style>/)[1];
  await report.locator("body").evaluate((element, css) => { const style = element.ownerDocument.createElement("style"); style.textContent = css; element.ownerDocument.head.append(style); }, css);
  await page.waitForTimeout(5000);
  await report.getByRole("heading", { name: "Change analysis", exact: true }).evaluate((element) => {
    element.closest("section").scrollIntoView({ block: "start", behavior: "instant" });
  });
  await page.waitForTimeout(6500);
  await chapter("06 / Read the evidence behind the score", "Open a question's ranked evidence. Three questions improved, none regressed, and one remains insufficient.");
  const question = report.locator(".question-card").first();
  await question.evaluate((element) => element.scrollIntoView({ block: "start", behavior: "instant" }));
  await page.waitForTimeout(4000);
  await question.locator("summary").click();
  await question.locator(".hit").first().evaluate((element) => element.scrollIntoView({ block: "start", behavior: "instant" }));
  await page.waitForTimeout(8000);
  cues.at(-1).end = (Date.now() - origin) / 1000;
  const video = page.video();
  await context.close();
  context = undefined;
  await copyFile(await video.path(), join(output, "walkthrough.webm"));
  cues = await alignWalkthrough(browser, pathToFileURL(framePath).href, pathToFileURL(join(output, "walkthrough.webm")).href, cues);
  await writeFile(join(output, "walkthrough.en.vtt"), `WEBVTT\n\n${cues.map((cue, i) => `${i + 1}\n${timestamp(cue.start)} --> ${timestamp(cue.end)}\n${cue.caption}\n`).join("\n")}`);
  await writeFile(join(output, "walkthrough-provenance.json"), JSON.stringify({ cliVersion: "0.1.0", recordedAt: new Date().toISOString(), durationSeconds: cues.at(-1).end, platform: process.platform, captionAlignment: "Chapter heading transitions measured from encoded video frames, within 40ms.", commands: transcript, baseline: baseline.summary, candidate: candidate.summary, changes, presentation: "Real command output displayed after each command exits, with reading pauses. Host caches may be reused. Generated report uses website CSS; report content is unchanged. No output or result is simulated." }, null, 2) + "\n");
  await mkdir(destination, { recursive: true });
  for (const filename of ["walkthrough.webm", "walkthrough.en.vtt", "walkthrough-poster.png", "walkthrough-provenance.json"]) {
    await copyFile(join(output, filename), join(destination, filename));
  }
  console.log(`Recorded ${cues.at(-1).end.toFixed(1)} seconds to ${destination}. Temporary source artifacts: ${working}`);
} finally {
  if (context) await context.close();
  await browser.close();
}
