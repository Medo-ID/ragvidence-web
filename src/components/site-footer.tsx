import Link from "next/link";
import { Brand } from "./brand";

const groups = [
  { title: "Product", links: [["Install", "/#install"], ["Proof", "/#proof"], ["Plans", "/#plans"], ["Roadmap", "/#roadmap"]] },
  { title: "Learn", links: [["Documentation", "/docs"], ["First tutorial", "/docs/first-tutorial"], ["Releases", "/releases"], ["Troubleshooting", "/docs/troubleshooting"]] },
  { title: "Trust", links: [["Privacy", "/privacy"], ["Terms", "/terms"], ["Security", "/security"], ["Support", "mailto:midaghdour@gmail.com"]] },
] as const;

export function SiteFooter() {
  return (
    <footer className="no-print mt-16 border-t border-line/80 bg-panel/35">
      <div className="shell grid gap-12 py-14 md:grid-cols-[1.4fr_2fr]">
        <div>
          <Brand />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted">Evidence-first retrieval diagnostics for engineers who want to know why a RAG change helped—or hurt.</p>
          <p className="mt-5 font-mono text-xs text-muted">Built independently by <a className="text-ink hover:text-signal-ink" href="https://medo-id.com">Medo-ID</a>.</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-ink">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map(([label, href]) => <li key={href}><Link href={href} className="text-sm text-muted transition-colors hover:text-signal-ink">{label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-line/70">
        <div className="shell flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Medo-ID. RAGvidence is proprietary software.</p>
          <p>No telemetry · No account · Your data stays under your control</p>
        </div>
      </div>
    </footer>
  );
}
