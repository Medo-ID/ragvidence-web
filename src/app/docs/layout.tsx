import type { Metadata } from "next";
import { DocsSidebar } from "@/components/docs-sidebar";
import { docs, docGroups } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Install RAGvidence, run controlled retrieval experiments, evaluate evidence, and interpret reports.",
  alternates: { canonical: "/docs" },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-shell grid items-start gap-8 pb-12 pt-8 xl:grid-cols-[230px_minmax(0,1fr)] xl:pt-12">
      <DocsSidebar pages={docs.map(({ slug, title, description, group }) => ({ slug, title, description, group }))} groups={docGroups} />
      <div className="w-full min-w-0 flex-1">{children}</div>
    </div>
  );
}
