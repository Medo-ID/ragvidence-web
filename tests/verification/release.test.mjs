import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

test("published release artifacts, demo and displayed outcomes share verified provenance", async () => {
  const provenance = JSON.parse(await readFile("public/examples/provenance.json", "utf8"));
  assert.equal(provenance.cliVersion, "0.2.0");
  assert.equal(provenance.wheelSHA256, "ef300e798bc7cad72a560dc2a6c6c9819737bdbac9241f7ebf2a593a5f2c54e9");
  for (const file of provenance.files) assert.equal(createHash("sha256").update(await readFile(file.path)).digest("hex"), file.sha256, file.path);
  const report = JSON.parse(await readFile("public/sample-report.json", "utf8"));
  assert.equal(report.evaluation_level, "reviewed_comparison");
  assert.equal(report.phase, "dev");
  assert.deepEqual(report.participants.map(({ name, report }) => [name, report.evaluation.summaries.dev.sufficient_count]), [["bm25", 3], ["parent-child", 4], ["compress", 3]]);
  const media = JSON.parse(await readFile("public/media/walkthrough-provenance.json", "utf8"));
  assert.equal(media.reportSHA256, provenance.files.find(file => file.path === "public/sample-report.html").sha256);
  assert.equal(media.wheelSHA256, provenance.wheelSHA256);
  const license = await readFile("public/ragvidence-0.2.0-license.txt", "utf8");
  assert.match(license, /Apache License/);
  assert.doesNotMatch(license, /Free edition|Plus edition/);
});
