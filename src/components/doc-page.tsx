import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { adjacentDocs, type DocPage as DocPageType } from "@/lib/docs";
import { DocRenderer } from "./doc-renderer";
import { OnThisPage } from "./on-this-page";
import { docPath } from "@/lib/doc-path";
import { serializeJsonLd, siteUrl } from "@/lib/seo";

export function DocPage({ doc }: { doc: DocPageType }) {
  const { previous, next } = adjacentDocs(doc.slug);
  const headings = doc.blocks.filter((block) => block.type === "h2" || block.type === "h3");
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: (doc.slug === "overview"
      ? [{ name: "RAGvidence", path: "/" }, { name: "Documentation", path: "/docs" }]
      : [{ name: "Documentation", path: "/docs" }, { name: doc.title, path: docPath(doc.slug) }]
    ).map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: new URL(item.path, siteUrl).href })),
  };
  return (
    <article className="doc-grid min-w-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }} />
      <div className="doc-heading min-w-0">
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted"><Link href="/docs" className="hover:text-signal-ink">Docs</Link><span>/</span><span>{doc.group}</span></div>
      <h1 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">{doc.title}</h1>
      <p className="mt-5 text-lg leading-8 text-muted">{doc.description}</p>
      <div className="mt-6 flex items-center gap-3 text-xs text-muted"><span className="rounded-sm border border-line px-2.5 py-1 font-mono">v0.2.0</span><span>Apache-2.0 · All features free</span></div>
      </div>
      <OnThisPage headings={headings} />
      <div className="doc-content min-w-0">
      <DocRenderer blocks={doc.blocks} />
      <nav aria-label="Previous and next documentation" className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
        {previous ? <Link href={docPath(previous.slug)} className="rounded-lg border border-line p-4 text-sm text-muted hover:border-signal/30 hover:text-ink"><span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider"><ArrowLeft size={13} /> Previous</span><strong className="mt-2 block text-ink">{previous.title}</strong></Link> : <span />}
        {next && <Link href={docPath(next.slug)} className="rounded-lg border border-line p-4 text-right text-sm text-muted hover:border-signal/30 hover:text-ink"><span className="flex items-center justify-end gap-2 font-mono text-xs uppercase tracking-wider">Next <ArrowRight size={13} /></span><strong className="mt-2 block text-ink">{next.title}</strong></Link>}
      </nav>
      <div className="mt-8 text-sm text-muted">Was something unclear? <a href={`mailto:midaghdour@gmail.com?subject=RAGvidence%20docs%20feedback%3A%20${encodeURIComponent(doc.title)}`} className="text-signal-ink hover:text-ink">Send documentation feedback.</a></div>
      </div>
    </article>
  );
}
