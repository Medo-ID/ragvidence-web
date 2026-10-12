import { docs, type DocBlock } from "@/lib/docs";

function blockText(block: DocBlock): string {
  switch (block.type) {
    case "p":
    case "h2":
    case "h3": return block.text;
    case "code": return `${block.label ?? ""} ${block.code}`;
    case "note": return `${block.title} ${block.text}`;
    case "list": return block.items.join(" ");
    case "links": return block.items.map((item) => item.label).join(" ");
    case "table": return [block.headers, ...block.rows].flat().join(" ");
  }
}

export async function GET() {
  const index = Object.fromEntries(docs.map((doc) => [
    doc.slug,
    [doc.title, doc.description, doc.group, ...doc.blocks.map(blockText)].join(" ").toLowerCase(),
  ]));
  return Response.json(index);
}
