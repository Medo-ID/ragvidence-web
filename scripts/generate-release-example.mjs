// Run with an isolated production ragvi executable; never import the CLI checkout.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cp, mkdir, mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const ragvi = resolve(process.argv[2] ?? "/tmp/ragvidence-web-020/bin/ragvi");
const root = await mkdtemp(join(tmpdir(), "ragvidence-020-example-"));
const commands = [];
function run(args) {
  const output = execFileSync(ragvi, args, { cwd: root, encoding: "utf8", env: { ...process.env, NO_COLOR: "1", TERM: "dumb", COLUMNS: "100" } });
  commands.push({ command: ["ragvi", ...args].join(" "), output: output.replaceAll(root, ".") });
  return output;
}
async function json(path) { return JSON.parse(await readFile(path, "utf8")); }
async function runDir(path) { return join(root, path, (await readdir(join(root, path)))[0]); }
const version = run(["--version"]).trim();
if (version !== "0.2.0") throw new Error(`Expected production 0.2.0, got ${version}`);
await mkdir(join(root, "docs"));
await cp("public/examples/manual.md", join(root, "docs/manual.md"));
await cp("public/examples/questions.txt", join(root, "questions.txt"));
run(["health"]); run(["verify"]); run(["techniques", "--format", "json"]);
run(["bm25", "./docs", "--no-input", "--format", "json", "--output", "./inventory"]);
const inventory = await runDir("inventory");
const snapshot = await json(join(inventory, "snapshot.json"));
const inspected = await json(join(inventory, "report.json"));
const source = snapshot.documents[0];
const facts = [
  ["RESET", "Hold the reset button for eight seconds to clear pairing."],
  ["POWER", "Keep USB-C power connected throughout the reset."],
  ["WARRANTY", "The warranty lasts two years."],
  ["EXCLUSION", "Accidental water damage is excluded."],
  ["CHARGE", "Charge it every three months when unused."],
  ["DELIVERY", "Tracked delivery is available in Morocco."],
];
const questions = (await readFile(join(root, "questions.txt"), "utf8")).trim().split("\n");
const reviewed = {
  schema_version: 1, corpus_hash: inspected.manifest.corpus_hash,
  evidence: facts.map(([evidence_id, text]) => {
    const start = source.body.indexOf(text);
    if (start < 0) throw new Error(`Missing reviewed quote ${evidence_id}`);
    return { evidence_id, spans: [{ source_id: source.source_unit_id, start, end: start + text.length, text }] };
  }),
  questions: questions.map((question, i) => ({ question_id: `Q${i + 1}`, question, split: "dev", answerable: true, required_evidence_ids: [["RESET", "POWER"], ["WARRANTY", "EXCLUSION"], ["CHARGE"], ["DELIVERY"]][i] })),
};
await writeFile(join(root, "reviewed.json"), JSON.stringify(reviewed, null, 2) + "\n");
await writeFile("public/examples/reviewed.json", JSON.stringify(reviewed, null, 2) + "\n");
run(["bm25", "./docs/manual.md", "--query", "How do I reset the device?", "--output", "./single"]);
run(["bm25", "./docs", "--questions", "./questions.txt", "--format", "html", "--format", "json", "--output", "./inspection"]);
run(["compare-data", "./docs", "--questions", "./questions.txt", "--techniques", "bm25,parent-child", "--output", "./unscored"]);
const args = ["compare-data", "./docs", "--reviewed", "./reviewed.json", "--techniques", "bm25,parent-child,compress", "--k", "1", "--chunk-size", "100", "--chunk-overlap", "10", "--format", "html", "--format", "json", "--format", "markdown", "--output", "./comparison"];
run(args);
const comparison = await runDir("comparison");
const files = await readdir(comparison, { recursive: true });
console.log(JSON.stringify({ root, comparison }, null, 2));
for (const extension of ["html", "json", "md"]) {
  const file = files.find(file => file.startsWith("exports/") && file.endsWith(`/report.${extension}`));
  if (!file) throw new Error(`Missing ${extension} export`);
  await cp(join(comparison, file), `public/sample-report.${extension}`);
}
const report = await json("public/sample-report.json");
const results = report.participants.map(({ name, report }) => {
  const summary = report.evaluation.summaries.dev;
  return { name, sufficient: summary.sufficient_count, total: summary.answerable_questions,
    meanContext: Math.round(report.questions.reduce((sum, question) => sum + question.context_measurement.count, 0) / report.questions.length) };
});
await writeFile("src/lib/example-results.ts", `// Generated from public/sample-report.json by generate-release-example.mjs.\nexport const exampleResults = ${JSON.stringify(results, null, 2)} as const;\n`);
run(["compare-data", ".", "--resume", comparison, "--format", "json"]);
run(["tutorial"]);
await cp(join(root, "workspaces/first-run/reports/tutorial.html"), "public/tutorial-report.html");
const sha = async path => createHash("sha256").update(await readFile(path)).digest("hex");
const provenance = {
  cliVersion: version, releaseCommit: "fba0c92ddaeb414ba8e9f0dea0e0c93f4e9c29f4", websiteSourceCommit: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
  packageIndex: "https://pypi.org/simple", wheelSHA256: "ef300e798bc7cad72a560dc2a6c6c9819737bdbac9241f7ebf2a593a5f2c54e9",
  synthetic: true, generatedAt: new Date().toISOString(), models: [], corpusHash: inspected.manifest.corpus_hash,
  configuration: { techniques: ["bm25", "parent-child", "compress"], k: 1, chunkSize: 100, chunkOverlap: 10, phase: "dev" },
  files: await Promise.all(["public/examples/manual.md", "public/examples/questions.txt", "public/examples/reviewed.json", "public/sample-report.html", "public/sample-report.json", "public/sample-report.md", "public/tutorial-report.html"].map(async path => ({ path, sha256: await sha(path) }))),
  commands,
};
await writeFile("public/examples/provenance.json", JSON.stringify(provenance, null, 2) + "\n");
await writeFile("verification/cli-0.2.0/example-location.json", JSON.stringify({ root, comparison }));
