// Linux authoring: native captures of a verified wheel, composed at 1080p60.
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { copyFile, mkdir, mkdtemp, readFile, writeFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, basename } from "node:path";
import { stripVTControlCharacters } from "node:util";
import { captureOwnData } from "./capture-own-data.mjs";
import { prepareDemoRenderer } from "./render-demo-frames.mjs";

const resume = process.argv[2] === "--resume";
const working = resume ? resolve(process.argv[3]) : await mkdtemp(join(tmpdir(), "ragvidence-own-data-walkthrough-"));
const staging = join(working, "media");
await mkdir(staging, { recursive: true });
const destination = resolve(process.env.RAGVIDENCE_RECORDING_DIR ?? "public/media");
const wheel = resume ? null : resolve(process.argv[2] ?? "../ragvidence/dist/ragvidence-0.1.0-py3-none-any.whl");
if (!resume && !process.argv[3]) throw new Error("Provide a temporary fixture JSON with sources/questions arrays");
const fixturePath = resume ? null : resolve(process.argv[3]);
const ffmpeg = process.argv[4] ?? process.env.FFMPEG_EXECUTABLE;
const libraryPath = process.argv[5] ?? process.env.LD_LIBRARY_PATH;
const captureOnly = process.argv.includes("--capture-only");
const env = { ...process.env, UV_CACHE_DIR: join(working, "cache"), UV_LINK_MODE: "copy", NO_COLOR: "1", TERM: "dumb", COLUMNS: "96" };
const transcript = [];
const clean = text => stripVTControlCharacters(text).replaceAll(working + "/", "").replaceAll(working, ".").replaceAll(wheel ?? "<no-wheel>", "built-wheel.whl");
async function command(executable, args, cwd = working) {
  const child = spawn(executable, args, { cwd, env, stdio: ["ignore", "pipe", "pipe"] });
  let output = "";
  child.stdout.on("data", chunk => { output += chunk; });
  child.stderr.on("data", chunk => { output += chunk; });
  const code = await new Promise((resolveResult, reject) => { child.once("error", reject); child.once("close", resolveResult); });
  transcript.push({ argv: [basename(executable), ...args.map(arg => clean(String(arg)))], cwd: clean(cwd), code, text: clean(output) });
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
    state = await captureOwnData({ page, command, working, wheel, fixturePath, transcript });
    await writeFile(join(working, "capture-state.json"), JSON.stringify(state));
  }
  await prepareDemoRenderer(page, state.captures, state.points, state.fontCSS, state.typing);
  for (const time of [1, 2, 5, 11, 13, 16, 19, 21, 24, 28, 32, 35]) {
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
    for (let frame = 0; frame < state.provenance.frames; frame++) {
      const jpeg = Buffer.from(await page.evaluate(time => window.renderFrame(time), frame / 60), "base64");
      for (const job of jobs) { if (job.error()) throw job.error(); if (!job.child.stdin.write(jpeg)) await once(job.child.stdin, "drain"); }
      if (frame % 600 === 0) console.log(`Rendered ${frame} / ${state.provenance.frames} native frames`);
    }
    for (const job of jobs) job.child.stdin.end(); await Promise.all(jobs.map(job => job.done));
    const poster = await page.evaluate(() => { window.renderFrame(5); return document.querySelector("canvas").toDataURL("image/webp", 0.95).split(",")[1]; });
    await writeFile(join(staging, "walkthrough-poster.webp"), Buffer.from(poster, "base64"));
    state.provenance.files = await Promise.all(outputs.map(async ([file]) => ({ file, bytes: (await stat(join(staging, file))).size, codec: file.endsWith("mp4") ? "H.264" : "VP9", crf: 20 })));
    await writeFile(join(staging, "walkthrough-provenance.json"), JSON.stringify(state.provenance, null, 2) + "\n");
    await mkdir(destination, { recursive: true });
    for (const file of ["walkthrough.mp4", "walkthrough.webm", "walkthrough-poster.webp", "walkthrough-provenance.json"]) await copyFile(join(staging, file), join(destination, file));
    console.log("Created 36-second native 1080p60 MP4, WebM, and poster.");
  }
} finally {
  for (const child of encoders) if (child.exitCode === null) child.kill("SIGTERM");
  await browser.close();
}
