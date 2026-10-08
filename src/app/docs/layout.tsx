import type { Metadata } from "next";
import { DocsSidebar } from "@/components/docs-sidebar";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Install RAGvidence, run controlled retrieval experiments, evaluate evidence, and interpret reports.",
  alternates: { canonical: "/docs" },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell flex items-start gap-8 pb-10 pt-12 lg:gap-12">
      <DocsSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
