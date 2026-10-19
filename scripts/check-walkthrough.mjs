import { spawn } from "node:child_process";
import { mkdir, readFile, stat, writeFile, copyFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { walkthroughPlan } from "./walkthrough-plan.mjs";
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
for (const file of provenance.files) if (sha(await readFile(`${media}/${file.file}`)) !== file.sha256) throw new Error(`Changed media: ${file.file}`);
for (const file of provenance.websiteSourceFiles) if (sha(await readFile(file.path)) !== file.sha256) throw new Error(`Changed recording source: ${file.path}`);
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
for (const [file, codec] of [["walkthrough.mp4", "h264"], ["walkthrough.webm", "vp9"]]) {
  const path = `${media}/${file}`;
  const decoded = await run(["-hide_banner", "-xerror", "-nostats", "-i", path, "-map", "0:v:0", "-f", "null", "-", "-progress", "pipe:1"]);
  const frames = [...decoded.stdout.matchAll(/frame=(\d+)/g)].at(-1)?.[1];
  const valid = decoded.stderr.includes(`Video: ${codec}`) && /1920x1080[^\n]*30 fps/.test(decoded.stderr) && /Duration: 00:00:22\.00/.test(decoded.stderr) && frames === "660" && !/Stream #0:[^\n]*(Audio|Subtitle):/.test(decoded.stderr);
  await writeFile(`${directory}/${file}.log`, decoded.stderr + "\n" + decoded.stdout);
  if (!valid) throw new Error(`Invalid media ${file}`);
  const motion = await run(["-hide_banner", "-loglevel", "error", "-i", path, "-vf", "fps=1,crop=1600:800:160:130", "-f", "framemd5", "-"]);
  const hashes = motion.stdout.split("\n").filter(line => line && !line.startsWith("#")).map(line => line.split(",").at(-1).trim());
  if (new Set(hashes).size < 18) throw new Error("Video has regressed to static scenes");
  for (const time of [0.5, 2, 5, 7, 9, 11.7, 13, 15, 16.7, 19, 20, 21.5]) await run(["-y", "-hide_banner", "-loglevel", "error", "-ss", String(time), "-i", path, "-frames:v", "1", `${directory}/${file}-${time}s.png`]);
  results.push({ file, codec, ...walkthroughPlan, uniqueContentSamples: new Set(hashes).size, bytes: (await stat(path)).size });
}
if (!(await readFile(`${media}/walkthrough.vtt`, "utf8")).startsWith("WEBVTT")) throw new Error("Missing accessible captions");
await writeFile(`${directory}/results.json`, JSON.stringify(results, null, 2) + "\n");
if (process.argv.includes("--publish")) {
  for (const file of [...provenance.files.map(file => file.file), "walkthrough-provenance.json"]) await copyFile(`${media}/${file}`, `public/media/${file}`);
  console.log("Validated candidate promoted to public/media.");
}
console.log(JSON.stringify(results));
