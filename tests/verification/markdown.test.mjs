import assert from "node:assert/strict";
import test from "node:test";
import { docMarkdown } from "../../src/lib/docs-markdown.ts";
import { docs } from "../../src/lib/docs.ts";

test("Markdown preserves every article's raw commands and content blocks", () => {
  for (const doc of docs) {
    const markdown = docMarkdown(doc, `https://ragvidence.medo-id.com/docs/${doc.slug}`);
    assert.ok(markdown.startsWith(`# ${doc.title}`));
    assert.ok(markdown.endsWith("\n"));
    assert.ok(markdown.includes("CLI version: 0.2.1"));
    for (const block of doc.blocks.filter(block => block.type === "code")) assert.ok(markdown.includes(`\n${block.code}\n`), doc.slug);
  }
});

test("Markdown handles fences, literal prose, tables, notes, lists and portable links", () => {
  const markdown = docMarkdown({ title: "Test", description: "<raw> *literal*", blocks: [
    { type: "h2", text: "A heading", id: "a" }, { type: "h3", text: "A subheading", id: "b" },
    { type: "p", text: "Use [literal] text" },
    { type: "code", label: "example.md", code: "```json\n{}\n```" },
    { type: "table", headers: ["A", "B"], rows: [["left|right", "line\nnext"]] },
    { type: "note", title: "Review", text: "Scope\nLimitations" },
    { type: "list", ordered: true, items: ["First", "Second"] },
    { type: "links", items: [{ label: "Report", href: "/sample-report.html" }, { label: "Section", href: "#a" }] },
  ] }, "https://ragvidence.medo-id.com/docs/test");
  assert.ok(markdown.includes("\\<raw\\> \\*literal\\*"));
  assert.ok(markdown.includes("Use \\[literal\\] text"));
  assert.ok(markdown.includes("````\n```json\n{}\n```\n````"));
  assert.ok(markdown.includes("| left\\|right | line<br>next |"));
  assert.ok(markdown.includes("## A heading\n\n### A subheading"));
  assert.ok(markdown.includes("> **Review**\n>\n> Scope\n> Limitations"));
  assert.ok(markdown.includes("1. First\n2. Second"));
  assert.ok(markdown.includes("[Report](<https://ragvidence.medo-id.com/sample-report.html>)"));
  assert.ok(markdown.includes("[Section](<https://ragvidence.medo-id.com/docs/test#a>)"));
});
