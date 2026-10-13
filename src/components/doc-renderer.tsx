import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { DocBlock } from "@/lib/docs";
import { CopyCommand } from "./copy-command";

export function DocRenderer({ blocks }: { blocks: DocBlock[] }) {
  return (
    <div className="prose-ragvi mt-10">
      {blocks.map((block, index) => {
        if (block.type === "p") return <p key={index} className="my-5 text-[0.98rem] leading-7 text-muted">{block.text}</p>;
        if (block.type === "h2") return <h2 key={index} id={block.id} className="mb-4 mt-12 border-t border-line/70 pt-10 text-2xl font-semibold tracking-[-0.03em] text-ink">{block.text}</h2>;
        if (block.type === "h3") return <h3 key={index} id={block.id} className="mb-3 mt-8 text-lg font-semibold text-ink">{block.text}</h3>;
        if (block.type === "list") {
          const Tag = block.ordered ? "ol" : "ul";
          return <Tag key={index} className={`my-5 space-y-2 pl-5 text-[0.95rem] leading-7 text-muted ${block.ordered ? "list-decimal" : "list-disc marker:text-signal-ink"}`}>{block.items.map((item) => <li key={item} className="pl-1">{item}</li>)}</Tag>;
        }
        if (block.type === "links") {
          return <ul key={index} className="my-5 space-y-3 text-sm leading-6">{block.items.map(({ label, href }) => <li key={href}><a href={href} className="text-signal-ink underline underline-offset-4 hover:text-ink">{label}</a></li>)}</ul>;
        }
        if (block.type === "code") {
          return (
            <div key={index} className="surface my-6 overflow-hidden border border-line">
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5"><span className="font-mono text-[10px] uppercase tracking-wider text-muted">{block.label ?? "Code"}</span><CopyCommand command={block.code} /></div>
              <pre className="overflow-x-auto p-4 font-mono text-[0.82rem] leading-6 text-ink"><code>{block.code}</code></pre>
            </div>
          );
        }
        if (block.type === "note") {
          const tone = block.tone ?? "info";
          const Icon = tone === "warning" ? AlertTriangle : tone === "success" ? CheckCircle2 : Info;
          const style = tone === "warning" ? "surface-warning text-warning" : tone === "success" ? "surface-success text-success" : "surface-teal text-signal-ink";
          return <aside key={index} className={`my-7 rounded-none border p-4 ${style}`}><div className="flex gap-3"><Icon size={18} className="mt-0.5 shrink-0" /><div><strong className="text-sm text-ink">{block.title}</strong><p className="mt-1 text-sm leading-6 text-muted">{block.text}</p></div></div></aside>;
        }
        if (block.type === "table") {
          return (
            <div key={index} className="surface my-7 overflow-x-auto border border-line">
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <thead className="bg-panel"><tr>{block.headers.map((header) => <th key={header} className="border-b border-line px-4 py-3 font-semibold text-ink">{header}</th>)}</tr></thead>
                <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex} className="border-b border-line/70 last:border-0">{row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3.5 align-top leading-6 text-muted">{cell}</td>)}</tr>)}</tbody>
              </table>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
