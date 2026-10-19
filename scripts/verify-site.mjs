import { spawn } from "node:child_process";
import { once } from "node:events";
import { docs } from "../src/lib/docs.ts";
import { walkthroughPlan } from "./walkthrough-plan.mjs";
import { validReportScripts } from "./report-contract.mjs";

const explicitUrl = process.env.RAGVIDENCE_SITE_URL;
const baseUrl = new URL(explicitUrl ?? "http://127.0.0.1:3001");
let server;
let serverLog = "";
let serverError;
let stopping;

async function request(path = "/", options = {}) {
  return fetch(new URL(path, baseUrl), { ...options, signal: AbortSignal.timeout(10000) });
}

async function startProduction() {
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3001"], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  const collect = (chunk) => { serverLog = (serverLog + chunk.toString()).slice(-16000); };
  server.stdout.on("data", collect);
  server.stderr.on("data", collect);
  server.on("error", (error) => { serverError = error; });
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (serverError) throw serverError;
    if (server.exitCode !== null) throw new Error(`Production server exited (${server.exitCode}).\n${serverLog}`);
    // A reachable port alone could belong to an older server.
    if (serverLog.includes("Ready in") && (await request()).ok) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Production server did not become ready.\n${serverLog}`);
}

function stopProduction() {
  stopping ??= (async () => {
    if (!server || server.exitCode !== null || server.signalCode !== null) return;
    const closed = once(server, "close").catch(() => {});
    server.kill("SIGTERM");
    const timeout = setTimeout(() => server.kill("SIGKILL"), 3000);
    await closed;
    clearTimeout(timeout);
  })();
  return stopping;
}

for (const [signal, exitCode] of [["SIGINT", 130], ["SIGTERM", 143]]) {
  process.once(signal, async () => {
    try { await stopProduction(); } finally { process.exit(exitCode); }
  });
}

function notFound(html) {
  return /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html);
}

async function verify() {
  if (!explicitUrl) await startProduction();
  else if (!(await request()).ok) throw new Error(`Site is unavailable at ${baseUrl}.`);

  const routes = ["/", "/docs", ...docs.map(({ slug }) => `/docs/${slug}`), "/releases", "/privacy", "/terms", "/security", "/sample-report.html", "/ragvidence-0.1.0-license.txt", "/ragvidence-0.2.1-license.txt", "/ragvidence-0.2.1-notice.txt", "/sample-report.json", "/sample-report.md", "/tutorial-report.html", "/examples/manual.md", "/examples/questions.txt", "/examples/reviewed.json", "/examples/provenance.json", "/robots.txt", "/sitemap.xml", "/opengraph-image", "/favicon.ico", "/icon.svg", "/apple-icon.png", "/brand/a-evidence-convergence/mark-dark.svg", "/docs/search-index.json", "/media/walkthrough.webm", "/media/walkthrough-poster.webp", "/media/walkthrough-provenance.json"];
  routes.push("/media/walkthrough.mp4", "/media/walkthrough.vtt", "/media/walkthrough-transcript.txt", "/brand/evidence-cli/mark-dark.svg", "/brand/evidence-cli/mark-light.svg");
  routes.push("/ragvidence-source-notices.txt", "/ragvidence-source-licenses.txt");
  const binaryRoutes = new Set(["/opengraph-image", "/favicon.ico", "/apple-icon.png", "/media/walkthrough.mp4", "/media/walkthrough.webm", "/media/walkthrough-poster.webp"]);
  const failures = [];
  const pages = new Map();
  const headers = [
    ["x-content-type-options", "nosniff"],
    ["x-frame-options", "DENY"],
    ["referrer-policy", "strict-origin-when-cross-origin"],
    ["permissions-policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()"],
    ["cross-origin-opener-policy", "same-origin"],
  ];
  for (const route of routes) {
    const response = await request(route);
    const body = binaryRoutes.has(route) ? Buffer.from(await response.arrayBuffer()) : await response.text();
    if (!response.ok) failures.push(`${route}: HTTP ${response.status}`);
    if (!body.length) failures.push(`${route}: empty response`);
    for (const [name, value] of headers) {
      if (response.headers.get(name) !== value) failures.push(`${route}: invalid ${name}`);
    }
    if (typeof body !== "string") continue;
    pages.set(route, body);
    if (route.endsWith(".svg")) {
      if (!body.includes("<svg")) failures.push(`${route}: not an SVG image`);
    } else if (!/\.(txt|md|xml|json|vtt)$/.test(route)) {
      if (!body.includes("<html")) failures.push(`${route}: not an HTML document`);
      if (notFound(body)) failures.push(`${route}: unexpectedly rendered not-found content`);
    }
    if (/Create Next App|Lorem ipsum|TODO|FIXME/i.test(body)) failures.push(`${route}: placeholder content`);
  }
  try {
    const index = JSON.parse(pages.get("/docs/search-index.json") ?? "{}");
    for (const doc of docs) {
      if (typeof index[doc.slug] !== "string" || !index[doc.slug].includes(doc.title.toLowerCase())) failures.push(`Search index missing ${doc.slug}`);
    }
  } catch { failures.push("Documentation search index is not valid JSON."); }
  try {
    const media = JSON.parse(pages.get("/media/walkthrough-provenance.json") ?? "{}");
    if (Object.entries(walkthroughPlan).some(([key, value]) => media[key] !== value) || media.audio !== false || media.captions !== true || media.workflow !== "own-data" || media.mockData !== true || media.sourceCount !== 1 || media.questionCount !== 4 || media.cliVersion !== "0.2.1" || media.comparison?.k !== 1 || media.comparison?.techniques?.join(",") !== "bm25,parent-child,compress") failures.push("Demo provenance does not match the verified production 0.2.1 synthetic workflow.");
  } catch { failures.push("Demo provenance is not valid JSON."); }
  const home = pages.get("/") ?? "";
  for (const phrase of ["ragvidence==0.2.1", "See whether your RAG change", "Apache-2.0", "reviewed original spans", "One CLI."]) {
    if (!home.includes(phrase)) failures.push(`/: missing ${phrase}`);
  }
  if (!(pages.get("/docs/first-tutorial") ?? "").includes("Why the report lists 12 questions")) failures.push("Tutorial docs do not explain the score denominator.");
  const sampleReport = pages.get("/sample-report.html") ?? "";
  // Plain dataset text and the embedded font license can contain URL strings.
  // Reject executable tags and remote asset/navigation attributes, not escaped prose.
  if (!validReportScripts(sampleReport) || /(?:src|href)\s*=\s*["']\s*(?:https?:)?\/\//i.test(sampleReport) || /url\(\s*["']?\s*(?:https?:)?\/\//i.test(sampleReport)) failures.push("Sample report contains an untrusted script or remote assets.");

  const internalLinks = new Map();
  for (const [route, html] of pages) {
    if (!html.includes("<html")) continue;
    for (const match of html.matchAll(/href="((?:\/|#)[^"]*)"/g)) {
      const target = new URL(match[1].replaceAll("&amp;", "&"), new URL(route, baseUrl));
      if (target.origin === baseUrl.origin) internalLinks.set(target.pathname + target.search + target.hash, target);
    }
  }
  for (const [link, target] of internalLinks) {
    if (binaryRoutes.has(target.pathname)) continue;
    let html = pages.get(target.pathname);
    if (html === undefined) {
      const response = await request(target.pathname + target.search);
      html = await response.text();
      if (!response.ok || notFound(html)) failures.push(`${link}: broken internal destination`);
    }
    if (target.hash && !html.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`)) failures.push(`${link}: missing fragment target`);
  }
  for (const path of ["/no-such-page", "/docs/no-such-page"]) {
    const response = await request(path);
    const html = await response.text();
    if (![200, 404].includes(response.status) || !notFound(html) || !html.includes("This evidence trail ends here.")) failures.push(`${path}: missing not-found UI or noindex`);
    if (path === "/no-such-page" && response.status !== 404) failures.push(`${path}: expected HTTP 404`);
  }
  for (const { slug } of docs) {
    const preferredPath = slug === "overview" ? "/docs" : `/docs/${slug}`;
    if (!(pages.get("/sitemap.xml") ?? "").includes(`${preferredPath}</loc>`)) failures.push(`Sitemap missing ${preferredPath}`);
  }
  if (failures.length) throw new Error(`Site verification failed (${failures.length}):\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  console.log(`Verified ${routes.length} routes, ${internalLinks.size} internal links/fragments, all security headers, and not-found behavior at ${baseUrl}.`);
}

try {
  await verify();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await stopProduction();
}
