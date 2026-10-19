import Link from "next/link";
import { DocsSidebar } from "@/components/docs-sidebar";
import { docs, docGroups } from "@/lib/docs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Documentation", description: "Install RAGvidence, run controlled retrieval experiments, evaluate evidence, and interpret reports.", path: "/docs" });

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <div className="docs-layout">
    <div className="docs-masthead"><div className="frame"><p><span className="font-mono text-signal-ink">RAGVIDENCE /</span> Documentation</p><Link href="/releases">CLI v0.2.1 <span aria-hidden="true">↗</span></Link></div></div>
    <div className="docs-shell">
      <DocsSidebar pages={docs.map(({ slug, title, description, group }) => ({ slug, title, description, group }))} groups={docGroups} />
      <div className="docs-article min-w-0">{children}</div>
    </div>
  </div>;
}
