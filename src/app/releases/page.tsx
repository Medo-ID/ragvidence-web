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
        <p className="mt-5 text-base leading-7 text-muted">Released capabilities, requirements, and the license distributed with each version. Documentation currently covers the Free v0.1.0 release.</p>
      </div>
      <article className="surface mt-12 max-w-4xl border border-line p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
          <h2 className="font-mono text-2xl font-semibold text-ink">v0.1.0</h2>
          <time dateTime="2026-10-08" className="text-sm text-muted">October 8, 2026</time>
        </div>
        <p className="mt-6 text-sm leading-7 text-muted">Initial Free release · Python 3.12 · Proprietary software. No account or paid activation is required.</p>
        <ul className="mt-6 list-disc space-y-3 pl-5 text-sm leading-7 text-muted marker:text-signal-ink">
          <li>BM25, optional FastEmbed semantic retrieval, and Ollama / OpenAI-compatible embedding adapters.</li>
          <li>Controlled body versus heading-context comparisons and imported retriever results.</li>
          <li>Evidence-level evaluation, improvement and regression analysis, and deterministic diagnosis.</li>
          <li>Self-contained HTML, Markdown, and JSON reports, with recoverable local workspaces.</li>
        </ul>
        <div className="mt-8 border-t border-line pt-6 text-sm leading-7 text-muted">
          <p>The bundled tutorial compares the same ten questions at k=2 using BM25. Evidence sufficiency changes from 60% to 90%; this teaching example is not a benchmark for another corpus.</p>
          <p className="mt-4">Plus features remain future direction. This release does not provide paid checkout or team hosting.</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-6 text-sm text-signal-ink">
          <Link href="/docs/installation" className="inline-flex min-h-11 items-center gap-2 hover:text-ink">Installation guide<ArrowRight size={15} aria-hidden="true" /></Link>
          <a href="https://pypi.org/project/ragvidence/0.1.0/" className="inline-flex min-h-11 items-center gap-2 hover:text-ink">Release on PyPI<ExternalLink size={15} aria-hidden="true" /></a>
          <a href="/ragvidence-0.1.0-license.txt" className="inline-flex min-h-11 items-center gap-2 hover:text-ink">Read the shipped license<ArrowRight size={15} aria-hidden="true" /></a>
        </div>
      </article>
    </div>
  );
}
