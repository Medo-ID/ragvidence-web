import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { ESLint } from "eslint";

const eslint = new ESLint();
const lint = async code => (await eslint.lintText(code, { filePath: "src/app/lint-probe.tsx" }))[0].messages;

test("lint still rejects React, Hooks, accessibility and TypeScript regressions", async () => {
  const messages = await lint(`
    import { useState } from "react";
    export function Probe({ enabled }: { enabled: boolean }) {
      if (enabled) useState(0);
      const value: any = 1;
      return <div>{[value].map(item => <img src={item} />)}</div>;
    }
  `);
  for (const rule of ["react-hooks/rules-of-hooks", "react/jsx-key", "jsx-a11y/alt-text", "@typescript-eslint/no-explicit-any"]) {
    assert.ok(messages.some(message => message.ruleId === rule), `Missing check: ${rule}`);
  }
});

test("navigation lint rejects internal page anchors while allowing files and external links", async () => {
  for (const href of ["/", "/docs", "/docs/installation?from=home#setup", "/privacy/"]) {
    const messages = await lint(`export default function Probe() { return <a href="${href}">Open</a>; }`);
    assert.ok(messages.some(message => message.ruleId === "navigation/no-html-link-for-pages"), href);
  }
  const messages = await lint(`
    import Link from "next/link";
    export default function Probe() {
      return <><Link href="/docs">Docs</Link><a href="/sample-report.html">Report</a>
        <a href="/media/walkthrough.mp4">Video</a><a href="/ragvidence-0.2.1-license.txt">License</a>
        <a href="/docs/installation/markdown" download>Markdown</a>
        <a href="https://example.com">External</a><a href="mailto:a@example.com">Email</a>
        <a href="#content">Jump</a><a href="/docs" target="_blank">New tab</a></>;
    }
  `);
  assert.deepEqual(messages, []);
});

test("navigation lint catches browser redirects, constants and template prefixes without shadowing false positives", async () => {
  for (const code of [
    "window.location.assign('/docs');",
    "location['assign']('/docs');",
    "globalThis.location.href = '/docs';",
    "document['location']['href'] = '/docs';",
    "const path = '/docs'; self.location.assign(path);",
    "const slug = Date.now(); window.location.assign(`/docs/${slug}`);",
    "let path = 'https://example.com'; path = '/docs/' + Date.now(); location.assign(path);",
  ]) {
    const messages = await lint(code);
    assert.ok(messages.some(message => message.ruleId === "navigation/no-location-assign-relative-destination"), code);
  }
  for (const code of [
    "window.location.assign('https://example.com');",
    "location.href = '//example.com';",
    "export function run(location: { assign(value: string): void }) { location.assign('/docs'); }",
    "window.location.assign();",
    "let destination; destination = destination; location.assign(destination);",
  ]) {
    const messages = await lint(code);
    assert.ok(!messages.some(message => message.ruleId?.startsWith("navigation/")), code);
  }
});

test("Oxlint rejects Next.js client and synchronous-script regressions", async () => {
  const directory = await mkdtemp(join(tmpdir(), "ragvidence-lint-"));
  try {
    const file = join(directory, "page.tsx");
    await writeFile(file, `"use client"; export default async function Page() { return <script src="/script.js" />; }`);
    const result = spawnSync(process.execPath, [
      resolve("node_modules/oxlint/bin/oxlint"), "--config", resolve(".oxlintrc.json"), "--max-warnings=0", file,
    ], { encoding: "utf8" });
    assert.equal(result.error, undefined);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout + result.stderr, /no-async-client-component/);
    assert.match(result.stdout + result.stderr, /no-sync-scripts/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
