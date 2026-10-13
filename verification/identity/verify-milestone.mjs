import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { stripVTControlCharacters } from "node:util";

const milestone = process.argv[2];
if (!/^[-a-z0-9]+$/.test(milestone ?? "")) throw new Error("Provide a milestone name");
const directory = `verification/identity/${milestone}`;
await mkdir(directory, { recursive: true });
const checks = [
  ["lint", ["run", "lint"]],
  ["types", ["run", "typecheck"]],
  ["webpack-build", ["run", "build", "--", "--webpack"]],
  ["routes", ["run", "verify:site"]],
  ["verification-tests", ["run", "test:verification"]],
  ["browser", ["run", "test:browser"]],
  ["production-audit", ["audit", "--omit=dev", "--audit-level=high"]],
];
const results = [];
for (const [name, args] of checks) {
  console.log(`${milestone}: ${name}`);
  const child = spawn("npm", args, { env: process.env, stdio: ["ignore", "pipe", "pipe"] });
  let log = "";
  child.stdout.on("data", chunk => { log += chunk; });
  child.stderr.on("data", chunk => { log += chunk; });
  const code = await new Promise((resolve, reject) => { child.once("error", reject); child.once("close", resolve); });
  const transcript = stripVTControlCharacters(log).replaceAll("\r", "").split("\n").map(line => line.trimEnd()).join("\n").trimEnd();
  await writeFile(`${directory}/${name}.log`, transcript + "\n");
  results.push({ name, code });
  await writeFile(`${directory}/checks.json`, JSON.stringify({ results, standardTurbopack: "User confirmation pending" }, null, 2) + "\n");
  if (code !== 0) { console.error(log); process.exit(code ?? 1); }
}
console.log(`${milestone}: available checks passed`);
