import { spawn } from "node:child_process";

const baseUrl = process.env.RAGVIDENCE_SITE_URL ?? "http://127.0.0.1:3000";
let server;
let serverLog = "";

async function reachable() {
  try {
    const response = await fetch(baseUrl);
    return response.ok;
  } catch {
    return false;
  }
}

if (!(await reachable())) {
  server = spawn("./node_modules/.bin/next", ["dev", "--hostname", "127.0.0.1"], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (chunk) => { serverLog += chunk.toString(); });
  server.stderr.on("data", (chunk) => { serverLog += chunk.toString(); });
  for (let attempt = 0; attempt < 40 && !(await reachable()); attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!(await reachable())) {
    server.kill("SIGTERM");
    console.error(serverLog);
    throw new Error(`Could not start a local site at ${baseUrl}`);
  }
}

const docs = [
  "overview", "installation", "first-tutorial", "first-report", "evidence-labels",
  "retrieval-depth", "controlled-experiments", "bm25-workflow", "semantic-workflow",
  "import-retriever", "bring-your-own-data", "metrics", "compare-diagnose", "reports",
  "commands", "privacy-providers", "troubleshooting",
];

const routes = [
  "/", "/docs", ...docs.map((slug) => `/docs/${slug}`), "/privacy", "/terms",
  "/security", "/sample-report.html", "/robots.txt", "/sitemap.xml",
  "/opengraph-image", "/favicon.ico",
];

const failures = [];
const pages = new Map();
const responses = new Map();

for (const route of routes) {
  const response = await fetch(new URL(route, baseUrl));
  const body = await response.text();
  pages.set(route, body);
  responses.set(route, response);
  if (!response.ok) failures.push(`${route}: HTTP ${response.status}`);
  if (!body.trim()) failures.push(`${route}: empty response`);
}

const home = pages.get("/") ?? "";
for (const phrase of [
  'uv tool install &quot;ragvidence[semantic]&quot;',
  "Stop guessing whether your RAG change",
  "60%",
  "90%",
  "The Free edition is a real tool",
]) {
  if (!home.includes(phrase)) failures.push(`/: missing required content: ${phrase}`);
}

const binaryRoutes = new Set(["/opengraph-image", "/favicon.ico"]);
for (const [route, html] of pages) {
  if (!html.includes("<html") && !route.endsWith(".txt") && !route.endsWith(".xml") && !binaryRoutes.has(route)) {
    failures.push(`${route}: not an HTML document`);
  }
  if (/Create Next App|Lorem ipsum|TODO|FIXME/i.test(html)) {
    failures.push(`${route}: placeholder content detected`);
  }
}

const homeHeaders = responses.get("/")?.headers;
for (const [name, expected] of [
  ["x-content-type-options", "nosniff"],
  ["x-frame-options", "DENY"],
  ["referrer-policy", "strict-origin-when-cross-origin"],
]) {
  if (homeHeaders?.get(name) !== expected) failures.push(`/: missing security header ${name}`);
}

if (/<script|https?:\/\//i.test(pages.get("/sample-report.html") ?? "")) {
  failures.push("/sample-report.html: report must not contain scripts or remote assets");
}

const internalLinks = new Set();
for (const html of pages.values()) {
  for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
    const path = match[1].split("#")[0];
    if (path) internalLinks.add(path);
  }
}

for (const path of internalLinks) {
  const response = await fetch(new URL(path, baseUrl), { redirect: "manual" });
  if (response.status >= 400) failures.push(`linked route ${path}: HTTP ${response.status}`);
}

if (failures.length) {
  if (serverLog) console.error(serverLog);
  console.error(`Site verification failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  server?.kill("SIGTERM");
  process.exit(1);
}

console.log(`Verified ${routes.length} routes and ${internalLinks.size} internal links at ${baseUrl}.`);
server?.kill("SIGTERM");
