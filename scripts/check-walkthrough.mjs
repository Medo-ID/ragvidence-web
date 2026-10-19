import { spawn } from "node:child_process";
import { mkdir, readFile, stat, writeFile, copyFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { walkthroughPlan, walkthroughEncodings, walkthroughPreviewTimes } from "./walkthrough-plan.mjs";
import { validateRecordingSource } from "./walkthrough-source-contract.mjs";
const ffmpeg = process.argv[2];
if (!ffmpeg) throw new Error("Provide FFmpeg for full-frame verification");
const mediaFlag = process.argv.indexOf("--media");
const media = mediaFlag < 0 ? "public/media" : resolve(process.argv[mediaFlag + 1]);
const directory = "verification/website-021/media-checks";
const provenance = JSON.parse(await readFile(`${media}/walkthrough-provenance.json`, "utf8"));
for (const [key, value] of Object.entries(walkthroughPlan)) if (provenance[key] !== value) throw new Error(`Unexpected ${key}`);
if (provenance.cliVersion !== "0.2.1" || provenance.workflow !== "own-data" || !provenance.mockData || !provenance.captions) throw new Error("Unexpected recording provenance");
const source = JSON.parse(await readFile("public/examples/provenance.json", "utf8"));
if (provenance.wheelSHA256 !== source.wheelSHA256 || provenance.reportSHA256 !== source.files.find(file => file.path === "public/sample-report.html").sha256) throw new Error("Stale recording inputs");
const sha = bytes => createHash("sha256").update(bytes).digest("hex");
await validateRecordingSource(provenance);
for (const file of provenance.files) if (sha(await readFile(`${media}/${file.file}`)) !== file.sha256) throw new Error(`Changed media: ${file.file}`);
await mkdir(directory, { recursive: true });
async function run(args) {
  const child = spawn(ffmpeg, args, { stdio: ["ignore", "pipe", "pipe"] });
  let stdout = "", stderr = "";
  child.stdout.on("data", chunk => { stdout += chunk; }); child.stderr.on("data", chunk => { stderr += chunk; });
  const code = await new Promise((done, reject) => { child.once("error", reject); child.once("close", done); });
  if (code !== 0) throw new Error(stderr);
  return { stdout, stderr };
}
const results = [];
for (const { file, codec } of walkthroughEncodings) {
  const path = `${media}/${file}`;
  if (codec === "h264") {
    const bytes = await readFile(path), atoms = [];
    for (let offset = 0; offset + 8 <= bytes.length;) {
      let size = bytes.readUInt32BE(offset);
      atoms.push(bytes.toString("ascii", offset + 4, offset + 8));
      if (size === 1) size = Number(bytes.readBigUInt64BE(offset + 8));
      if (size < 8) break;
      offset += size;
    }
    if (atoms.indexOf("moov") < 0 || atoms.indexOf("mdat") < 0 || atoms.indexOf("moov") > atoms.indexOf("mdat")) throw new Error("MP4 is missing fast-start metadata");
  }
  const decoded = await run(["-hide_banner", "-xerror", "-nostats", "-i", path, "-map", "0:v:0", "-f", "null", "-", "-progress", "pipe:1"]);
  const frames = [...decoded.stdout.matchAll(/frame=(\d+)/g)].at(-1)?.[1];
  const duration = decoded.stderr.match(/Duration: (\d+):(\d+):([\d.]+)/);
  const seconds = duration ? Number(duration[1]) * 3600 + Number(duration[2]) * 60 + Number(duration[3]) : NaN;
  const valid = decoded.stderr.includes(`Video: ${codec}`) && decoded.stderr.includes(`${walkthroughPlan.width}x${walkthroughPlan.height}`) && decoded.stderr.includes(`${walkthroughPlan.fps} fps`) && seconds === walkthroughPlan.durationSeconds && Number(frames) === walkthroughPlan.frames && !/Stream #0:[^\n]*(Audio|Subtitle):/.test(decoded.stderr);
  await writeFile(`${directory}/${file}.log`, decoded.stderr + "\n" + decoded.stdout);
  if (!valid) throw new Error(`Invalid media ${file}`);
  const motion = await run(["-hide_banner", "-loglevel", "error", "-i", path, "-vf", "fps=1,crop=1600:800:160:130", "-f", "framemd5", "-"]);
  const hashes = motion.stdout.split("\n").filter(line => line && !line.startsWith("#")).map(line => line.split(",").at(-1).trim());
  if (new Set(hashes).size < Math.ceil(walkthroughPlan.durationSeconds * .82)) throw new Error("Video has regressed to static scenes");
  for (const time of walkthroughPreviewTimes) await run(["-y", "-hide_banner", "-loglevel", "error", "-ss", String(time), "-i", path, "-frames:v", "1", `${directory}/${file}-${time}s.png`]);
  if ((await stat(path)).size > 8_000_000) throw new Error(`Media exceeds the 8 MB delivery budget: ${file}`);
  results.push({ file, codec, ...walkthroughPlan, uniqueContentSamples: new Set(hashes).size, bytes: (await stat(path)).size });
}
if (!(await readFile(`${media}/walkthrough.vtt`, "utf8")).startsWith("WEBVTT")) throw new Error("Missing accessible captions");
await writeFile(`${directory}/results.json`, JSON.stringify(results, null, 2) + "\n");
if (process.argv.includes("--publish")) {
  for (const file of [...provenance.files.map(file => file.file), "walkthrough-provenance.json"]) await copyFile(`${media}/${file}`, `public/media/${file}`);
  console.log("Validated candidate promoted to public/media.");
}
console.log(JSON.stringify(results));
