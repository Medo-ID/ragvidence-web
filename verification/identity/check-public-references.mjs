import { readFile, writeFile } from "node:fs/promises";

const root = process.argv[2] ?? "../ragvidence";
const readme = await readFile(`${root}/README.md`, "utf8");
const origin = "https://ragvidence.medo-id.com";
const links = [...readme.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]);
const results = [];
for (const href of [...new Set(links)]) {
  if (!href.startsWith(origin + "/")) throw new Error(`README link does not use the final website: ${href}`);
  const target = new URL(href);
  const response = await fetch(`http://127.0.0.1:3001${target.pathname}`, { signal: AbortSignal.timeout(10000) });
  const body = await response.text();
  if (!response.ok || (target.hash && !body.includes(`id="${target.hash.slice(1)}"`))) throw new Error(`Broken public route/fragment: ${href}`);
  results.push({ href, status: response.status, fragment: target.hash || null });
}
const metadata = await readFile(`${root}/pyproject.toml`, "utf8");
if (!metadata.includes(`Homepage = "${origin}"`) || !metadata.includes(`Documentation = "${origin}/docs"`)) throw new Error("Project metadata URLs differ");
await writeFile("verification/identity/milestone-11/public-references.json", JSON.stringify({ routes: results, publishedPyPI: "Metadata correct; long-description source fixes await a new release", liveDomain: "Unreachable in this environment; deployment validation pending" }, null, 2) + "\n");
console.log(`Verified ${results.length} final public README destinations against the local production build.`);
