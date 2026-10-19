// Linux authoring: native captures of a verified wheel, composed at 1080p30.
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { copyFile, mkdir, mkdtemp, readFile, writeFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { walkthroughPlan, captions, plainTranscript } from "./walkthrough-plan.mjs";
import { join, resolve } from "node:path";
import { captureOwnData } from "./capture-own-data.mjs";
import { prepareDemoRenderer } from "./render-demo-frames.mjs";

const resume = process.argv[2] === "--resume";
await mkdir("verification/website-021", { recursive: true });
const working = resume ? resolve(process.argv[3]) : await mkdtemp(resolve("verification/website-021/media-capture-"));
const staging = join(working, "media");
await mkdir(staging, { recursive: true });
const destination = resolve(process.env.RAGVIDENCE_RECORDING_DIR ?? "verification/website-021/media-candidate");
if (!resume && !process.argv[2]) throw new Error("Provide the verified production 0.2.1 wheel");
const wheel = resume ? null : resolve(process.argv[2]);
const ffmpeg = process.argv[resume ? 4 : 3] ?? process.env.FFMPEG_EXECUTABLE;
const libraryPath = process.env.LD_LIBRARY_PATH;
const captureOnly = process.argv.includes("--capture-only");
const browser = await chromium.launch({ env: { ...process.env, ...(libraryPath ? { LD_LIBRARY_PATH: libraryPath } : {}) } });
const encoders = [];
try {
  const page = await browser.newPage({ viewport: { width: walkthroughPlan.width, height: walkthroughPlan.height }, deviceScaleFactor: 2, reducedMotion: "reduce" });
  let state;
  if (resume) state = JSON.parse(await readFile(join(working, "capture-state.json"), "utf8"));
  else {
    state = await captureOwnData({ page, working, wheel });
    await writeFile(join(working, "capture-state.json"), JSON.stringify(state));
  }
  if (!captureOnly) {
    for (const file of [...state.provenance.websiteSourceFiles, ...state.provenance.sourceFiles]) {
      if (createHash("sha256").update(await readFile(file.path)).digest("hex") !== file.sha256) throw new Error(`Stale capture input: ${file.path}; capture again`);
    }
  }
  await prepareDemoRenderer(page, state.captures, state.points, state.fontCSS, state.typing);
  for (const time of [0.5, 2, 3.5, 5, 7, 9, 11.7, 13, 15, 16.7, 19, 20, 21.5]) {
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
      const child = spawn(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", "-f", "image2pipe", "-vcodec", "mjpeg", "-r", String(walkthroughPlan.fps), "-i", "pipe:0", "-an", "-sn", ...codec, "-threads", "4", "-g", "120", "-pix_fmt", "yuv420p", join(staging, file)], { stdio: ["pipe", "ignore", "pipe"] });
      encoders.push(child); let errors = "", failure;
      child.stderr.on("data", chunk => { errors += chunk; }); child.stdin.on("error", error => { failure = error; });
      const done = new Promise((resolveResult, reject) => { child.once("error", reject); child.once("close", code => code === 0 ? resolveResult() : reject(new Error(errors))); }); done.catch(() => {});
      return { child, done, error: () => failure };
    });
    for (let frame = 0; frame < state.provenance.frames; frame++) {
      const jpeg = Buffer.from(await page.evaluate(time => window.renderFrame(time), frame / walkthroughPlan.fps), "base64");
      for (const job of jobs) { if (job.error()) throw job.error(); if (!job.child.stdin.write(jpeg)) await once(job.child.stdin, "drain"); }
      if (frame % 600 === 0) console.log(`Rendered ${frame} / ${state.provenance.frames} native frames`);
    }
    for (const job of jobs) job.child.stdin.end(); await Promise.all(jobs.map(job => job.done));
    const poster = await page.evaluate(() => { window.renderFrame(6); return document.querySelector("canvas").toDataURL("image/webp", 0.95).split(",")[1]; });
    await writeFile(join(staging, "walkthrough-poster.webp"), Buffer.from(poster, "base64"));
    await writeFile(join(staging, "walkthrough.vtt"), captions);
    await writeFile(join(staging, "walkthrough-transcript.txt"), plainTranscript);
    state.provenance.tools.ffmpeg = execFileSync(ffmpeg, ["-version"], { encoding: "utf8" }).split("\n")[0];
    state.provenance.files = await Promise.all(["walkthrough.mp4", "walkthrough.webm", "walkthrough-poster.webp", "walkthrough.vtt", "walkthrough-transcript.txt"].map(async file => ({ file, bytes: (await stat(join(staging, file))).size, sha256: createHash("sha256").update(await readFile(join(staging, file))).digest("hex") })));
    await writeFile(join(staging, "walkthrough-provenance.json"), JSON.stringify(state.provenance, null, 2) + "\n");
    await mkdir(destination, { recursive: true });
    for (const file of ["walkthrough.mp4", "walkthrough.webm", "walkthrough-poster.webp", "walkthrough.vtt", "walkthrough-transcript.txt", "walkthrough-provenance.json"]) await copyFile(join(staging, file), join(destination, file));
    console.log("Created 22-second 1080p30 candidate MP4, WebM, poster, captions and transcript. Validate before publishing.");
  }
} finally {
  for (const child of encoders) if (child.exitCode === null) child.kill("SIGTERM");
  await browser.close();
}
