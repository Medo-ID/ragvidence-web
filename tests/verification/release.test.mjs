import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { validReportScripts, walkthroughSpec } from "../../scripts/report-contract.mjs";

test("published release artifacts, demo and displayed outcomes share verified provenance", async () => {
  const provenance = JSON.parse(await readFile("public/examples/provenance.json", "utf8"));
  assert.equal(provenance.cliVersion, "0.2.1");
  assert.equal(provenance.releaseTag, "v0.2.1");
  assert.equal(provenance.releaseCommit, "60b3302d8b2ad1726c1a40bece26b64b0c06c1e1");
  assert.equal(provenance.installedPackageVerifiedAgainstWheel, true);
  assert.equal(provenance.wheelSHA256, "4e74385f2920e13e0de462949791813cf7891fb4575ec17c8e9b577c005eebcf");
  for (const file of provenance.files) assert.equal(createHash("sha256").update(await readFile(file.path)).digest("hex"), file.sha256, file.path);
  const report = JSON.parse(await readFile("public/sample-report.json", "utf8"));
  assert.equal(report.evaluation_level, "reviewed_comparison");
  assert.equal(report.phase, "dev");
  assert.deepEqual(report.participants.map(({ name, report }) => [name, report.evaluation.summaries.dev.sufficient_count]), [["bm25", 3], ["parent-child", 4], ["compress", 3]]);
  const media = JSON.parse(await readFile("public/media/walkthrough-provenance.json", "utf8"));
  // Reports can predate a revised video; verify the shipped artifacts and release identity.
  for (const key of ["cliVersion", "releaseTag", "releaseCommit"]) assert.equal(media[key], provenance[key], key);
  assert.match(media.websiteSourceCommit, /^[a-f0-9]{40}$/);
  assert.deepEqual(media.exports.formats, ["html", "json", "markdown"]);
  assert.equal(media.exports.opened, "html");
  assert.ok(provenance.commands.some(({ command }) => command === media.exports.command));
  assert.match(media.exports.command, /--format html --format json --format markdown/);
  assert.equal(media.reportSHA256, provenance.files.find(file => file.path === "public/sample-report.html").sha256);
  assert.equal(media.wheelSHA256, provenance.wheelSHA256);
  for (const [key, value] of Object.entries(walkthroughSpec)) assert.equal(media[key], value, key);
  assert.equal(media.captions, true);
  for (const file of media.sourceFiles) assert.equal(createHash("sha256").update(await readFile(file.path)).digest("hex"), file.sha256, file.path);
  for (const file of media.files) assert.equal(createHash("sha256").update(await readFile(`public/media/${file.file}`)).digest("hex"), file.sha256, file.file);
  const license = await readFile("public/ragvidence-0.2.1-license.txt", "utf8");
  assert.match(license, /Apache License/);
  assert.doesNotMatch(license, /Free edition|Plus edition/);
});

test("public provenance uses portable commands without local machine paths", async () => {
  for (const path of ["public/examples/provenance.json", "public/media/walkthrough-provenance.json"]) {
    const text = await readFile(path, "utf8");
    assert.doesNotMatch(text, /\/(?:home|Users|tmp)\/|[A-Z]:\\\\/);
    const provenance = JSON.parse(text);
    assert.equal(provenance.commandPaths, "Recorded commands use paths relative to the example workspace; local absolute paths are normalized.");
    assert.ok(provenance.commands.some(({ command }) => command.includes("--resume ./comparison/")));
  }
});

test("reports contain only the wheel's trusted static theme script", async () => {
  for (const name of ["sample-report", "tutorial-report"]) {
    const html = await readFile(`public/${name}.html`, "utf8");
    assert.equal(validReportScripts(html), true);
    assert.equal(validReportScripts(html + '<script>alert(1)</script>'), false);
    assert.equal(validReportScripts(html.replace("button.hidden = false", "alert(1)")), false);
    assert.doesNotMatch(html, /(?:src|href)\s*=\s*["']\s*(?:https?:)?\/\//i);
  }
});
