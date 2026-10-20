import Link from "next/link";
import { Brand } from "./brand";
import { OwnerLink } from "./owner-link";
import { cliRepositoryUrl } from "@/lib/seo";

const groups = [
  { title: "Product", links: [["Install", "/docs/installation"], ["Proof", "/#proof"], ["Open source", "/#open-source"], ["CLI on GitHub", cliRepositoryUrl]] },
  { title: "Learn", links: [["Documentation", "/docs"], ["First tutorial", "/docs/first-tutorial"], ["Releases", "/releases"], ["Troubleshooting", "/docs/troubleshooting"]] },
  { title: "Trust", links: [["Privacy", "/privacy"], ["Terms", "/terms"], ["Security", "/security"], ["Support", "mailto:midaghdour@gmail.com"]] },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer no-print border-t border-line bg-panel/35">
      <div className="shell grid gap-12 py-14 md:grid-cols-[1.4fr_2fr]">
        <div>
          <Brand />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted">Retrieval diagnostics for retrieval-augmented generation (RAG). Compare techniques and inspect the evidence behind each change.</p>
          <p className="mt-5 font-mono text-xs text-muted">Built independently by <OwnerLink className="text-ink hover:text-signal-ink" />.</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-ink">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map(([label, href]) => <li key={href}><FooterLink href={href} label={label} /></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-line/70">
        <div className="shell flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 <OwnerLink className="hover:text-signal-ink" />. CLI: Apache-2.0. Website rights reserved.</p>
          <p>Free CLI · No account · Local-first experiments</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  const className = "text-sm text-muted transition-colors hover:text-signal-ink";
  return href.startsWith("/") ? <Link href={href} className={className}>{label}</Link> : <a href={href} className={className}>{label}</a>;
}
