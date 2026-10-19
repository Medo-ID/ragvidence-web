import type { DocBlock, DocPage } from "./docs";

// Article prose is plain text. Escape Markdown syntax without changing code bytes.
const prose = (text: string) => text.replace(/[\\`*_{}[\]<>~#!|]/g, "\\$&");
const cell = (text: string) => prose(text).replace(/\r?\n/g, "<br>");

export function docMarkdown(doc: DocPage, sourceUrl: string): string {
  function blockMarkdown(block: DocBlock): string {
    switch (block.type) {
      case "p": return prose(block.text);
      case "h2": return `## ${prose(block.text)}`;
      case "h3": return `### ${prose(block.text)}`;
      case "list": return block.items.map((item, index) => `${block.ordered ? `${index + 1}.` : "-"} ${prose(item).replace(/\n/g, "\n   ")}`).join("\n");
      case "links": return block.items.map(item => `- [${prose(item.label)}](<${new URL(item.href, sourceUrl).href}>)`).join("\n");
      case "code": {
        const longest = Math.max(2, ...Array.from(block.code.matchAll(/`+/g), match => match[0].length));
        const fence = "`".repeat(longest + 1);
        return `${block.label ? `**${prose(block.label)}**\n\n` : ""}${fence}\n${block.code}\n${fence}`;
      }
      case "note": return `> **${prose(block.title)}**\n>\n${prose(block.text).split("\n").map(line => `> ${line}`).join("\n")}`;
      case "table": return [block.headers.map(cell), block.headers.map(() => "---"), ...block.rows.map(row => row.map(cell))].map(row => `| ${row.join(" | ")} |`).join("\n");
    }
  }
  return [`# ${prose(doc.title)}`, prose(doc.description), `CLI version: 0.2.1 · [Read online](<${sourceUrl}>)`, ...doc.blocks.map(blockMarkdown)].join("\n\n") + "\n";
}
