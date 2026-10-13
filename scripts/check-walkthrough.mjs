import { spawn } from "node:child_process";
import { mkdir, stat, writeFile } from "node:fs/promises";

const ffmpeg = process.argv[2];
if (!ffmpeg) throw new Error("Provide FFmpeg for codec and full-frame verification");
const directory = "verification/identity/milestone-10-media";
await mkdir(directory, { recursive: true });
async function run(args) {
  const child = spawn(ffmpeg, args, { stdio: ["ignore", "pipe", "pipe"] });
  let stdout = "", stderr = "";
  child.stdout.on("data", chunk => { stdout += chunk; }); child.stderr.on("data", chunk => { stderr += chunk; });
  const code = await new Promise((resolve, reject) => { child.once("error", reject); child.once("close", resolve); });
  if (code !== 0) throw new Error(stderr);
  return { stdout, stderr };
}
const results = [];
for (const [file, codec] of [["walkthrough.mp4", "h264"], ["walkthrough.webm", "vp9"]]) {
  const path = `public/media/${file}`;
  const result = await run(["-hide_banner", "-xerror", "-nostats", "-i", path, "-map", "0:v:0", "-f", "null", "-", "-progress", "pipe:1"]);
  const frames = [...result.stdout.matchAll(/frame=(\d+)/g)].at(-1)?.[1];
  const valid = result.stderr.includes(`Video: ${codec}`) && /1920x1080[^\n]*60 fps/.test(result.stderr) && /Duration: 00:00:48\.00/.test(result.stderr) && frames === "2880" && !/Stream #0:[^\n]*(Audio|Subtitle):/.test(result.stderr);
  await writeFile(`${directory}/${file}.log`, (result.stderr + "\n" + result.stdout).split("\n").map(line => line.trimEnd()).join("\n").trimEnd() + "\n");
  if (!valid) throw new Error(`Invalid native media: ${file}\n${result.stderr}`);
  results.push({ file, codec, width: 1920, height: 1080, fps: 60, durationSeconds: 48, frames: 2880, bytes: (await stat(path)).size, audio: false, subtitles: false });
  for (const time of file.endsWith("mp4") ? [4, 14, 24, 35, 45] : [35]) {
    await run(["-y", "-hide_banner", "-loglevel", "error", "-ss", String(time), "-i", path, "-frames:v", "1", `${directory}/${file}-${time}s.png`]);
  }
}
await writeFile(`${directory}/results.json`, JSON.stringify(results, null, 2) + "\n");
console.log(JSON.stringify(results));
