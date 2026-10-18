import { ArrowRight, BookOpen, Check, FileSearch, GitCompareArrows, Layers, Terminal } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { ProductWalkthrough } from "@/components/product-walkthrough";
import { SectionHeading } from "@/components/section-heading";
import { exampleResults } from "@/lib/example-results";

export function ProductSections() {
  return <>
    <section className="product-section"><div className="shell">
      <SectionHeading eyebrow="Try the experiment" title="From your files to a retrieval decision.">Run techniques against the same data and questions. Inspect what each returns before choosing what belongs in your RAG project.</SectionHeading>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">{[
        { icon: Terminal, title: "Start with local data", text: "TXT, Markdown, visible-text HTML, document JSON/JSONL, CSV and optional text-bearing PDFs. Inspect extraction without preparing a workspace.", href: "/docs/supported-inputs" },
        { icon: Layers, title: "Compare useful alternatives", text: "Lexical and dense retrieval, hybrid fusion, reranking, parent-child, heading context, filters, query variants and exact-span extraction.", href: "/docs/techniques" },
        { icon: FileSearch, title: "Read the returned evidence", text: "Open exact context, source locations, stage traces and resources. Add reviewed references for sufficiency, coverage and paired changes.", href: "/docs/first-report" },
      ].map(({ icon: Icon, title, text, href }) => <article key={title} className="surface p-7"><Icon size={24} aria-hidden="true" /><h3 className="mt-6 text-lg font-semibold text-ink">{title}</h3><p className="mt-3 text-base leading-7 text-muted">{text}</p><Link href={href} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-signal-ink">Read the guide<span className="sr-only">: {title}</span><ArrowRight size={15} aria-hidden="true" /></Link></article>)}</div>
      <CodeBlock className="mt-8" label="Terminal" content={'ragvi compare-data ./docs --questions ./questions.txt --techniques bm25,parent-child'} wrap />
    </div></section>
    <ProductWalkthrough />
    <section id="how-it-works" className="product-section"><div className="shell">
      <SectionHeading eyebrow="Your next experiment" title="Inspect first. Review when you need scores.">Sources alone reveal extraction and chunking. Questions reveal actual retrieval. Reviewed evidence makes quality measurable.</SectionHeading>
      <div className="mt-10 grid gap-8 lg:grid-cols-3">{[
        ["01", "Point at a file or folder", "Run BM25 without a model or API key. Your source files stay unchanged; reports go to a new local directory."],
        ["02", "Ask representative questions", "Compare passages, settings and context size. Questions alone do not create relevance labels or a quality winner."],
        ["03", "Review and compare evidence", "Anchor required facts to original spans. Inspect every improvement and regression, then freeze a shortlist before heldout evaluation."],
      ].map(([n, title, text]) => <article key={n} className="border-t border-line py-7"><p className="font-mono text-xs text-muted">{n}</p><h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3><p className="mt-3 text-base leading-7 text-muted">{text}</p></article>)}</div>
      <Link href="/docs/bring-your-own-data" className="inline-flex min-h-11 items-center gap-2 text-sm text-signal-ink">Run on your own data<ArrowRight size={15} aria-hidden="true" /></Link>
    </div></section>
    <section id="proof" className="product-section"><div className="shell grid gap-12 lg:grid-cols-2">
      <div><SectionHeading eyebrow="Synthetic own-data example" title="The evidence improved. The context grew.">A small fictional device manual exposes a missing power condition. Searching children and returning the full parent recovers it, while returning more text.</SectionHeading>
      <p className="mt-6 text-base leading-7 text-muted">All three runs use four reviewed dev questions, k=1, 100-character chunks and 10-character overlap. Sentence extraction leaves the same question insufficient. These are teaching results, not a general benchmark.</p>
      <p className="mt-4 text-sm leading-7 text-muted">The CLI helps diagnose and compare retrieval. It does not change your production system or judge generated answers, citations or abstention.</p>
      <div className="mt-7 flex flex-wrap gap-4"><a href="/sample-report.html" className="inline-flex min-h-11 items-center gap-2 rounded-sm button-primary px-4 text-sm font-semibold">Open the full report<ArrowRight size={15} aria-hidden="true" /></a><Link href="/docs/bring-your-own-data#example" className="inline-flex min-h-11 items-center gap-2 text-sm text-signal-ink">Reproduce it locally<Terminal size={15} aria-hidden="true" /></Link></div></div>
      <div className="surface p-6 sm:p-8"><div className="flex items-center gap-3 text-sm text-muted"><GitCompareArrows size={18} aria-hidden="true" />PyPI 0.2.0 · reviewed original spans · no model</div>
      <div className="mt-6 overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">Synthetic device manual comparison</caption><thead><tr className="border-b border-line"><th className="py-4 pr-4">Technique</th><th className="py-4 pr-4">Sufficient</th><th className="py-4">Mean context¹</th></tr></thead><tbody>{exampleResults.map(row => <tr key={row.name} className="border-b border-line"><th className="py-4 pr-4 font-medium text-ink">{row.name}</th><td className="py-4 pr-4 text-muted">{row.sufficient} / {row.total}</td><td className="py-4 text-muted">{row.meanContext} chars</td></tr>)}</tbody></table></div>
      <p className="mt-5 text-xs leading-6 text-muted">¹ Complete rendered context, including IDs and headings. All results are shown. Four questions are too few to establish a general best technique; no heldout evaluation is claimed.</p>
      <p className="mt-4 border-t border-line pt-4 text-sm leading-7 text-muted">Q1 needs both reset duration and USB-C power. The short BM25 hit contains the duration; the returned parent also contains the required power condition.</p></div>
    </div></section>
    <section id="open-source" className="product-section"><div className="shell grid gap-12 lg:grid-cols-2">
      <div><SectionHeading eyebrow="Free · Apache-2.0" title="One CLI. All shipped features included.">Install, inspect, compare and share. No activation, account or payment is required.</SectionHeading><CodeBlock className="mt-7" content={'uv tool install --python 3.12 "ragvidence==0.2.0"'} wrap /><div className="mt-6 flex flex-wrap gap-5 text-sm text-signal-ink"><Link href="/docs/installation">Install CLI</Link><a href="https://github.com/Medo-ID/ragvidence">Source</a><a href="https://github.com/Medo-ID/ragvidence/blob/main/CONTRIBUTING.md">Contribute</a><a href="https://github.com/Medo-ID/ragvidence/stargazers">Star on GitHub</a><a href="/ragvidence-0.2.0-license.txt">Apache-2.0 license</a></div></div>
      <div><ul className="space-y-4">{["Portable local-file experiments and existing-retriever imports", "Lexical, dense, hybrid and composed retrieval stages", "Reviewed evidence metrics, frozen suites and validated resume", "Offline HTML, JSON and Markdown reports"].map(text => <li key={text} className="flex gap-3 text-base leading-7 text-muted"><Check size={18} className="mt-1 shrink-0 text-signal-ink" aria-hidden="true" />{text}</li>)}</ul><p className="mt-7 border-t border-line pt-6 text-sm leading-7 text-muted">Local FastEmbed embeddings and rerankers need the semantic extra and first model download. Ollama and OpenAI-compatible operations use your model server or API access. Remote services receive text needed for the selected operation.</p><p className="mt-4 text-sm leading-7 text-muted">Python 3.12 · installed-package checks: Linux x64, Windows x64, macOS ARM64/Intel. Model inference support depends on the selected model and hardware.</p></div>
    </div></section>
    <section className="product-section"><div className="shell"><SectionHeading eyebrow="Practical guides" title="Make the next decision with evidence.">Use representative questions and inspect the details behind every result.</SectionHeading><div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Installation", "/docs/installation"], ["Files and schemas", "/docs/supported-inputs"], ["Techniques and requirements", "/docs/techniques"], ["Reports and sharing", "/docs/reports"]].map(([title, href]) => <Link key={href} href={href} className="surface p-6"><BookOpen size={22} aria-hidden="true" /><h3 className="mt-5 text-base font-semibold text-ink">{title}</h3><ArrowRight size={16} className="mt-5" aria-hidden="true" /></Link>)}</div></div></section>
  </>;
}
