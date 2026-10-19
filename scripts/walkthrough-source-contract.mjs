import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

// These files produce the footage. The remaining websiteSourceFiles entries are
// the historical site context at capture time, not inputs to the canvas renderer.
const recordingInputs = [
  "scripts/capture-own-data.mjs",
  "scripts/render-demo-frames.mjs",
  "scripts/record-walkthrough.mjs",
  "scripts/walkthrough-plan.mjs",
  "public/brand/evidence-cli/mark-dark.svg",
];

export async function validateRecordingSource(provenance, read = readFile) {
  const sha = bytes => createHash("sha256").update(bytes).digest("hex");
  if (sha(JSON.stringify(provenance.websiteSourceFiles)) !== provenance.websiteSourceSnapshotSHA256) throw new Error("Invalid recording source snapshot");
  for (const path of recordingInputs) {
    const records = provenance.websiteSourceFiles.filter(file => file.path === path);
    if (records.length !== 1 || sha(await read(path)) !== records[0].sha256) throw new Error(`Changed recording source: ${path}`);
  }
}
