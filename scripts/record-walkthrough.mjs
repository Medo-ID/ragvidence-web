// Linux authoring: native captures of a verified wheel, composed at 1080p60.
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { copyFile, mkdir, mkdtemp, readFile, writeFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, basename } from "node:path";
import { pathToFileURL } from "node:url";
import { stripVTControlCharacters } from "node:util";
import { createHash } from "node:crypto";
import { prepareDemoRenderer } from "./render-demo-frames.mjs";

const resume = process.argv[2] === "--resume";
const working = resume ? resolve(process.argv[3]) : await mkdtemp(join(tmpdir(), "ragvidence-native-walkthrough-"));
const staging = join(working, "media");
await mkdir(staging, { recursive: true });
const destination = resolve(process.env.RAGVIDENCE_RECORDING_DIR ?? "public/media");
const wheel = resume ? null : resolve(process.argv[2] ?? "../ragvidence/dist/ragvidence-0.1.0-py3-none-any.whl");
const ffmpeg = process.argv[resume ? 4 : 3] ?? process.env.FFMPEG_EXECUTABLE;
const libraryPath = process.argv[resume ? 5 : 4] ?? process.env.LD_LIBRARY_PATH;
const captureOnly = process.argv.includes("--capture-only");
const env = { ...process.env, UV_CACHE_DIR: join(working, "cache"), NO_COLOR: "1", TERM: "dumb", COLUMNS: "96" };
const transcript = [];
const clean = text => stripVTControlCharacters(text).replaceAll(working + "/", "").replaceAll(wheel ?? "<no-wheel>", "built-wheel.whl");
async function command(executable, args) {
  const child = spawn(executable, args, { cwd: working, env, stdio: ["ignore", "pipe", "pipe"] });
  let output = "";
  child.stdout.on("data", chunk => { output += chunk; });
  child.stderr.on("data", chunk => { output += chunk; });
  const code = await new Promise((resolveResult, reject) => { child.once("error", reject); child.once("close", resolveResult); });
  transcript.push({ argv: [basename(executable), ...args.map(arg => clean(String(arg)))], code, text: clean(output) });
  if (code !== 0) throw new Error(output);
  return clean(output);
}
const browser = await chromium.launch({ env: { ...process.env, ...(libraryPath ? { LD_LIBRARY_PATH: libraryPath } : {}) } });
const encoders = [];
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  let state;
  if (resume) state = JSON.parse(await readFile(join(working, "capture-state.json"), "utf8"));
  else {
    await command("uv", ["venv", "--python", "3.12", join(working, "venv")]);
    await command("uv", ["pip", "install", "--python", join(working, "venv/bin/python"), wheel]);
    const ragvi = join(working, "venv/bin/ragvi");
    await command(ragvi, ["verify"]);
    const tutorial = await command(ragvi, ["tutorial"]);
    const workspace = join(working, "workspaces/first-run");
    const baseline = JSON.parse(await readFile(join(workspace, "evaluations/bm25-body.json"), "utf8"));
    const candidate = JSON.parse(await readFile(join(workspace, "evaluations/bm25-heading_context.json"), "utf8"));
    const after = new Map(candidate.questions.map(q => [q.question_id, q.sufficient_evidence]));
    const changes = { improved: 0, regressed: 0, unresolved: 0, stable: 0 };
    for (const q of baseline.questions) {
      if (q.sufficient_evidence === false && after.get(q.question_id) === true) changes.improved++;
      if (q.sufficient_evidence === true && after.get(q.question_id) === false) changes.regressed++;
      if (q.sufficient_evidence === false && after.get(q.question_id) === false) changes.unresolved++;
      if (q.sufficient_evidence === true && after.get(q.question_id) === true) changes.stable++;
    }
    if (baseline.summary.successful !== 6 || candidate.summary.successful !== 9 || baseline.summary.answerable !== 10 || candidate.summary.answerable !== 10 || baseline.manifest.config.k !== 2 || changes.improved !== 3 || changes.regressed !== 0 || changes.unresolved !== 1 || changes.stable !== 6) throw new Error("Tutorial drift");
    const report = join(workspace, "reports/tutorial.html");
    const html = await readFile(report, "utf8");
    const fontCSS = html.match(/@font-face\s*\{[^}]*\}/g).join("\n");
    const terminal = join(working, "terminal.html");
    await writeFile(terminal, `<!doctype html><html><meta charset="utf-8"><style>${fontCSS}*{box-sizing:border-box}body{margin:0;background:#050809;color:#f2f6f5;font-family:Geist,sans-serif}header{height:72px;border-bottom:1px solid #174e56;padding:22px max(32px,calc((100vw - 1440px)/2));font-size:18px;color:#8bd4db}main{width:1440px;margin:64px auto}#command{font:28px/42px "Geist Mono",monospace}pre{margin-top:36px;white-space:pre-wrap;overflow-wrap:anywhere;font:25px/42px "Geist Mono",monospace}a{display:inline-block;margin-top:30px;color:#8bd4db;font-size:22px;text-underline-offset:6px}a[hidden]{display:none}</style><header>Terminal · RAGvidence</header><main><div id="command">$ <span id="typed"></span></div><pre id="result"></pre><a id="report-link" hidden>Open tutorial.html ↗</a></main></html>`);
    const captures = {}, points = {};
    async function capture(name) {
      await page.evaluate(() => document.fonts.ready);
      const png = await page.screenshot(); captures[name] = png.toString("base64"); await writeFile(join(working, `${name}-native.png`), png);
    }
    async function center(locator) { const box = await locator.boundingBox(); return { x: box.x + box.width / 2, y: box.y + box.height / 2 }; }
    await page.goto(pathToFileURL(terminal).href);
    points.command = await center(page.locator("#command")); points.command.x = 280;
    const typed = await page.locator("#typed").boundingBox(); points.typed = { x: typed.x, y: typed.y };
    await capture("terminal");
    await page.locator("#typed").evaluate(el => { el.textContent = "ragvi tutorial"; });
    await page.locator("#result").evaluate((el, text) => { el.textContent = text; }, tutorial);
    await page.locator("#report-link").evaluate((el, href) => { el.hidden = false; el.href = href; }, pathToFileURL(report).href);
    points.link = await center(page.locator("#report-link")); await capture("result");
    await page.locator("#report-link").click();
    points.changeLink = await center(page.getByRole("link", { name: "Change analysis", exact: true })); await capture("summary");
    await page.getByRole("link", { name: "Change analysis", exact: true }).click(); await capture("changes");
    await page.getByRole("link", { name: "Improvements", exact: true }).first().click();
    const question = page.locator("#improvements .question-card").first();
    if (!(await question.innerText()).includes("DEV-01")) throw new Error("Expected recovered question absent");
    points.summary = await center(question.locator("summary")); await capture("closed");
    await question.locator("summary").click(); await capture("opened");
    if (!(await question.innerText()).includes("eight seconds")) throw new Error("Recovered preview absent");
    await page.goto(pathToFileURL(terminal).href);
    await page.locator("#typed").evaluate(el => { el.textContent = 'uv tool install "ragvidence[semantic]"'; });
    await capture("install");
    state = { captures, points, fontCSS, provenance: { cliVersion: baseline.manifest.product_version, recordedAt: new Date().toISOString(), width: 1920, height: 1080, fps: 60, frames: 2880, durationSeconds: 48, audio: false, captions: false, wheelSHA256: createHash("sha256").update(await readFile(wheel)).digest("hex"), reportSHA256: createHash("sha256").update(html).digest("hex"), baseline: baseline.summary, candidate: candidate.summary, changes, commands: transcript, zooms: [{ stage: "Terminal typing", scale: 1.18, durationMs: 400 }, { stage: "Recovered evidence", scale: 1.18, durationMs: 400 }], presentation: "Fresh installed source-build wheel, genuine tutorial output and generated-report interactions captured natively at 1920x1080. Clean cuts and fixed-size cursor composed at 60fps; no old recording or upscaled source. Local working paths shortened for presentation. No sound, narration, captions, player controls, browser chrome, or remote report assets." } };
    await writeFile(join(working, "capture-state.json"), JSON.stringify(state));
  }
  await prepareDemoRenderer(page, state.captures, state.points, state.fontCSS);
  for (const time of [1, 4, 10, 24, 29, 34, 40, 45]) {
    const png = await page.evaluate(time => { window.renderFrame(time); return document.querySelector("canvas").toDataURL("image/png").split(",")[1]; }, time);
    await writeFile(join(working, `preview-${time}s.png`), Buffer.from(png, "base64"));
  }
  console.log(`Native previews: ${working}`);
  if (captureOnly) process.exitCode = 0;
  else {
    if (!ffmpeg) throw new Error("Provide an FFmpeg executable with libx264 and libvpx-vp9");
    const outputs = [
      ["walkthrough.mp4", ["-c:v", "libx264", "-preset", "medium", "-crf", "20", "-movflags", "+faststart"]],
      ["walkthrough.webm", ["-c:v", "libvpx-vp9", "-crf", "20", "-b:v", "0", "-cpu-used", "4", "-row-mt", "1"]],
    ];
    const jobs = outputs.map(([file, codec]) => {
      const child = spawn(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", "-f", "image2pipe", "-vcodec", "mjpeg", "-r", "60", "-i", "pipe:0", "-an", "-sn", ...codec, "-threads", "4", "-g", "120", "-pix_fmt", "yuv420p", join(staging, file)], { stdio: ["pipe", "ignore", "pipe"] });
      encoders.push(child); let errors = "", failure;
      child.stderr.on("data", chunk => { errors += chunk; }); child.stdin.on("error", error => { failure = error; });
      const done = new Promise((resolveResult, reject) => { child.once("error", reject); child.once("close", code => code === 0 ? resolveResult() : reject(new Error(errors))); }); done.catch(() => {});
      return { child, done, error: () => failure };
    });
    for (let frame = 0; frame < 2880; frame++) {
      const jpeg = Buffer.from(await page.evaluate(time => window.renderFrame(time), frame / 60), "base64");
      for (const job of jobs) { if (job.error()) throw job.error(); if (!job.child.stdin.write(jpeg)) await once(job.child.stdin, "drain"); }
      if (frame % 600 === 0) console.log(`Rendered ${frame} / 2880 native frames`);
    }
    for (const job of jobs) job.child.stdin.end(); await Promise.all(jobs.map(job => job.done));
    const poster = await page.evaluate(() => { window.renderFrame(14); return document.querySelector("canvas").toDataURL("image/webp", 0.95).split(",")[1]; });
    await writeFile(join(staging, "walkthrough-poster.webp"), Buffer.from(poster, "base64"));
    state.provenance.files = await Promise.all(outputs.map(async ([file]) => ({ file, bytes: (await stat(join(staging, file))).size, codec: file.endsWith("mp4") ? "H.264" : "VP9", crf: 20 })));
    await writeFile(join(staging, "walkthrough-provenance.json"), JSON.stringify(state.provenance, null, 2) + "\n");
    await mkdir(destination, { recursive: true });
    for (const file of ["walkthrough.mp4", "walkthrough.webm", "walkthrough-poster.webp", "walkthrough-provenance.json"]) await copyFile(join(staging, file), join(destination, file));
    console.log("Created 48-second native 1080p60 MP4, WebM, and poster.");
  }
} finally {
  for (const child of encoders) if (child.exitCode === null) child.kill("SIGTERM");
  await browser.close();
}
