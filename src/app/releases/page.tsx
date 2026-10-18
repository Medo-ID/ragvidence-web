import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Releases",
  description: "RAGvidence CLI releases, included workflows, installation requirements, and the shipped software license.",
  path: "/releases",
});

export default function ReleasesPage() {
  return (
    <div className="shell py-16 sm:py-24">
      <div className="max-w-2xl">
        <p className="eyebrow">Release history</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">What ships with RAGvidence.</h1>
        <p className="mt-5 text-base leading-7 text-muted">Current documentation covers the fully free Apache-2.0 CLI v0.2.0.</p>
      </div>
      <article className="surface mt-12 max-w-4xl border border-line p-6 sm:p-10">
        <h2 className="font-mono text-2xl font-semibold text-ink">v0.2.0</h2>
        <p className="mt-6 text-sm leading-7 text-muted">Published on production PyPI · Python 3.12 · Apache-2.0 · All shipped features free.</p>
        <ul className="mt-6 list-disc space-y-3 pl-5 text-sm leading-7 text-muted marker:text-signal-ink">
          <li>Portable TXT, Markdown, HTML, document JSON/JSONL, CSV and optional text-bearing PDF input.</li>
          <li>BM25, dense, hybrid, reranking, parent-child, heading/contextual indexing, query fusion, typed filters, MMR, rewriting and exact-span compression.</li>
          <li>Original-span evidence evaluation, external retriever imports, frozen comparisons, bounded suites/grids, dev shortlists, heldout disclosure and validated resume.</li>
          <li>Terminal summaries and self-contained HTML, JSON and Markdown reports with exact context and stage evidence.</li>
        </ul>
        <p className="mt-6 text-sm leading-7 text-muted">Local models need their optional runtime and first download. Selected Ollama or OpenAI-compatible operations use your server/API access. Answer and citation correctness judging is outside this release.</p>
        <div className="mt-8 flex flex-wrap gap-6 text-sm text-signal-ink">
          <Link href="/docs/installation" className="inline-flex min-h-11 items-center gap-2">Installation guide<ArrowRight size={15} aria-hidden="true" /></Link>
          <a href="https://pypi.org/project/ragvidence/0.2.0/" className="inline-flex min-h-11 items-center gap-2">PyPI release<ExternalLink size={15} aria-hidden="true" /></a>
          <a href="https://github.com/Medo-ID/ragvidence/releases/tag/v0.2.0" className="inline-flex min-h-11 items-center gap-2">GitHub release<ExternalLink size={15} aria-hidden="true" /></a>
          <a href="/ragvidence-0.2.0-license.txt" className="inline-flex min-h-11 items-center gap-2">Shipped license<ArrowRight size={15} aria-hidden="true" /></a>
          <a href="/ragvidence-0.2.0-notice.txt" className="inline-flex min-h-11 items-center gap-2">NOTICE<ArrowRight size={15} aria-hidden="true" /></a>
        </div>
      </article>
      <details className="mt-8 max-w-4xl border-t border-line py-6 text-sm text-muted"><summary className="cursor-pointer py-2">Historical release: v0.1.0</summary><p className="mt-4 leading-7">Historical release records are separate from current documentation. The <a href="https://pypi.org/project/ragvidence/0.1.0/" className="text-signal-ink">0.1.0 package</a> retains its <a href="/ragvidence-0.1.0-license.txt" className="text-signal-ink">original shipped license</a>.</p></details>
    </div>
  );
}
