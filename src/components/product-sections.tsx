import { ArrowRight, Binary, BookOpen, Boxes, Check, CircleGauge, FileSearch, Fingerprint, GitCompareArrows, Layers, LockKeyhole, ScanSearch, ShieldCheck, Sparkles, Terminal, Upload } from "lucide-react";
import Link from "next/link";
import { CopyCommand } from "./copy-command";
import { ProductWalkthrough } from "./product-walkthrough";
import { SectionHeading } from "./section-heading";

const installCommand = 'uv tool install --python 3.12 "ragvidence[semantic]"';

const capabilities = [
  { icon: Terminal, title: "Local retrieval", text: "Start with BM25. Add local embeddings, Ollama, or an OpenAI-compatible provider when your experiment needs them.", href: "/docs/bm25-workflow" },
  { icon: Upload, title: "Your retriever, too", text: "Import ranked hits from an existing service and evaluate them against the same reviewed evidence.", href: "/docs/import-retriever" },
  { icon: GitCompareArrows, title: "Question-level changes", text: "Find recovered questions, regressions, stable successes, and persistent failures behind the aggregate score.", href: "/docs/compare-diagnose" },
  { icon: FileSearch, title: "Portable reports", text: "Inspect source units and ranked evidence in a self-contained HTML report. Export Markdown and JSON, too.", href: "/docs/reports" },
];

const workflow = [
  { icon: Fingerprint, title: "Label the evidence", text: "Connect each question to every source unit required for a complete answer.", href: "/docs/evidence-labels" },
  { icon: Binary, title: "Change one variable", text: "Keep questions and retrieval depth fixed. Change one model, retriever, or representation.", href: "/docs/controlled-experiments" },
  { icon: ScanSearch, title: "Inspect what moved", text: "Read the changed questions, recovered evidence, and remaining failures together.", href: "/docs/compare-diagnose" },
];

const freeFeatures = ["BM25 lexical and local semantic retrieval", "Ollama and OpenAI-compatible adapters", "Body vs. heading-context experiments", "Import runs from your existing retriever", "Evidence metrics, comparisons, and diagnosis", "HTML, Markdown, and JSON reports", "Recoverable local workspaces"];

export function ProductSections() {
  return (
    <>
      <section className="product-section">
        <div className="shell">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="The retrieval toolkit" title="Everything you need to inspect a change.">
              A fluent answer can hide missing evidence. Test the retrieval job directly, from the first ranked hit to the complete experiment.
            </SectionHeading>
            <Link href="/docs/overview" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm text-ink">Explore the workflow <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <article className="surface surface-teal flex flex-col p-7 sm:p-9">
              <CircleGauge size={25} className="text-ink" aria-hidden="true" />
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">Evidence-level evaluation</h3>
              <p className="mt-3 max-w-sm text-base leading-7 text-muted">Measure whether your top-k hits contain everything needed to answer. Sufficiency, coverage, precision, and rank tell you where retrieval falls short.</p>
              <div className="my-9 grid flex-1 content-center gap-3" aria-hidden="true">
                <div className="flex items-center gap-4 border border-line bg-canvas/50 p-4"><Fingerprint size={20} /><span className="text-sm text-ink">Reviewed question + required evidence</span></div>
                <div className="ml-7 h-5 border-l border-line" />
                <div className="flex items-center gap-4 border border-line bg-canvas/50 p-4"><Layers size={20} /><span className="text-sm text-ink">Ranked source units at your actual k</span></div>
                <div className="ml-7 h-5 border-l border-line" />
                <div className="flex items-center gap-4 border border-line bg-canvas/50 p-4"><ScanSearch size={20} /><span className="text-sm text-ink">Missing evidence. Recovered questions.</span></div>
              </div>
              <Link href="/docs/metrics" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink">Read the metrics reference <ArrowRight size={15} aria-hidden="true" /></Link>
            </article>
            <div className="divide-y divide-line">{capabilities.map(({ icon: Icon, title, text, href }) => (
              <article key={title} className="grid grid-cols-[2rem_1fr] gap-x-4 py-6">
                <Icon size={22} className="text-ink" aria-hidden="true" />
                <h3 className="text-base font-semibold text-ink">{title}</h3>
                <p className="col-start-2 mt-2 text-base leading-6 text-muted">{text}</p>
                <Link href={href} className="col-start-2 mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-medium text-ink">Learn more<span className="sr-only"> about {title.toLowerCase()}</span><ArrowRight size={14} aria-hidden="true" /></Link>
              </article>
            ))}</div>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-sm text-muted">
            <span className="inline-flex items-center gap-2"><LockKeyhole size={16} aria-hidden="true" /> No account or activation</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck size={16} aria-hidden="true" /> Local BM25 needs no API key</span>
            <span className="inline-flex items-center gap-2"><FileSearch size={16} aria-hidden="true" /> Share a self-contained report</span>
          </div>
        </div>
      </section>

      <ProductWalkthrough />

      <section id="how-it-works" className="product-section">
        <div className="shell">
          <SectionHeading eyebrow="A controlled loop" title="Three steps. One inspectable experiment.">Freeze the evidence, make one meaningful change, and compare the same questions at the same retrieval depth.</SectionHeading>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {workflow.map(({ icon: Icon, title, text, href }, index) => (
              <article key={title} className="border-t border-line py-7 sm:py-8">
                <div className="flex items-center justify-between"><Icon size={24} aria-hidden="true" /><span className="font-mono text-xs text-muted">0{index + 1}</span></div>
                <h3 className="mt-8 text-lg font-semibold text-ink">{title}</h3><p className="mt-3 text-base leading-7 text-muted">{text}</p>
                <Link href={href} className="mt-6 inline-flex min-h-11 items-center gap-2 text-xs font-medium text-ink">Read the guide <ArrowRight size={14} aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="product-section">
        <div className="shell grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Reproducible bundled tutorial data" title="A score you can open and inspect.">The bundled tutorial compares body text with heading context on ten answerable questions at k=2. Three failures recover, with no regression.</SectionHeading>
            <p className="mt-6 text-base leading-7 text-muted">Two additional unanswerable cases have N/A evidence metrics. These are tutorial results, not a customer benchmark or a promise about your corpus.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="/sample-report.html" className="inline-flex min-h-11 items-center gap-2 rounded-sm button-primary px-4 text-sm font-semibold ">Open the full report <ArrowRight size={15} aria-hidden="true" /></a><Link href="/docs/first-tutorial" className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-line px-4 text-sm text-ink hover:bg-white/5">Reproduce it locally <Terminal size={15} aria-hidden="true" /></Link></div>
            <p className="mt-6 font-mono text-xs leading-6 text-muted">v0.1.0 · BM25 · k=2 · body vs. heading-context</p>
          </div>
          <div className="surface border border-line p-2">
            <div className="flex items-center gap-3 px-3 py-4"><FileSearch size={16} aria-hidden="true" /><span className="font-mono text-xs text-muted">tutorial.html · +30 percentage points</span></div>
            <div className="border border-line bg-canvas/65">
              <div className="grid grid-cols-2 divide-x divide-line">
                <div className="p-6 sm:p-8"><p className="text-xs text-muted">Body only</p><p className="mt-4 text-4xl font-semibold tracking-tight text-ink">60%</p><p className="mt-2 text-xs text-muted">6 / 10 sufficient</p></div>
                <div className="p-6 sm:p-8"><p className="text-xs text-muted">With heading context</p><p className="mt-4 text-4xl font-semibold tracking-tight text-ink">90%</p><p className="mt-2 text-xs text-muted">9 / 10 sufficient</p></div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-line border-y border-line">
                {[["3", "improved"], ["0", "regressed"], ["1", "still insufficient"]].map(([value, label]) => <div key={label} className="p-4 sm:p-5"><strong className="text-2xl font-semibold text-ink">{value}</strong><p className="mt-2 text-xs leading-5 text-muted">{label}</p></div>)}
              </div>
              <div className="p-5 sm:p-7"><p className="mb-4 text-sm text-muted">6 Pass → Pass · 2 N/A cases outside the denominator</p><p className="font-mono text-xs text-muted">DEV-01 / Orion DeskHub 4.2 pairing reset</p><div className="mt-4 space-y-3 text-sm leading-6"><p className="flex items-start gap-3 text-muted"><FileSearch size={17} className="mt-1 shrink-0" aria-hidden="true" />Body: required evidence absent from the top two hits.</p><p className="flex items-start gap-3 text-ink"><Check size={17} className="mt-1 shrink-0 text-success" aria-hidden="true" />Heading context: the required reset section appears at rank 1.</p></div><p className="mt-5 border-t border-line pt-4 text-xs leading-6 text-muted">Diagnosis: missing structural context. This small comparison identifies correlation, not universal causation.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-section">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div><SectionHeading eyebrow="Works with your stack" title="Start local. Bring your own retriever.">Use a built-in baseline to learn the workflow, then evaluate the ranked hits your production application actually retrieves.</SectionHeading><Link href="/docs/import-retriever" className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm text-ink">Import an existing run <ArrowRight size={15} aria-hidden="true" /></Link></div>
          <div className="grid gap-4 sm:grid-cols-2">{[
            { icon: Terminal, name: "BM25", text: "An offline lexical baseline.", href: "/docs/bm25-workflow" },
            { icon: Boxes, name: "FastEmbed", text: "Local semantic embeddings.", href: "/docs/semantic-workflow" },
            { icon: Layers, name: "Your provider", text: "Ollama or OpenAI-compatible.", href: "/docs/privacy-providers" },
            { icon: Upload, name: "Imported runs", text: "Your service, the same metrics.", href: "/docs/import-retriever" },
          ].map(({ icon: Icon, name, text, href }) => <Link key={name} href={href} className="surface p-6 transition-colors hover:border-muted"><Icon size={22} aria-hidden="true" /><h3 className="mt-5 text-sm font-semibold text-ink">{name}</h3><p className="mt-2 text-xs leading-6 text-muted">{text}</p></Link>)}</div>
        </div>
      </section>

      <section id="plans" className="product-section">
        <div className="shell">
          <SectionHeading eyebrow="Simple editions" title="The Free edition is a real tool, not a demo.">Use the complete current workflow without an account. Plus stays future direction until its advanced features are verified and shipped.</SectionHeading>
          <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article className="surface border border-line p-7 sm:p-9"><div className="flex items-center justify-between gap-4"><Terminal size={25} aria-hidden="true" /><span className="border border-line px-3 py-1 font-mono text-xs text-success">Available now</span></div><p className="mt-7 font-mono text-xs text-muted">FREE / v0.1.0</p><h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Build a trustworthy baseline</h3><p className="mt-4 text-base leading-7 text-muted">No activation, account, or payment required.</p><ul className="mt-7 space-y-3">{freeFeatures.map(feature => <li key={feature} className="flex gap-3 text-base leading-7 text-muted"><Check size={16} className="mt-1 shrink-0 text-ink" aria-hidden="true" />{feature}</li>)}</ul><Link href="/docs/installation" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-sm button-primary px-4 text-sm font-semibold ">Install Free <ArrowRight size={15} aria-hidden="true" /></Link><div className="mt-5 flex min-w-0 items-center gap-3 border border-line bg-canvas/50 p-3"><code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-ink">{installCommand}</code><CopyCommand command={installCommand} /></div></article>
            <article className="surface border border-line p-7 sm:p-9"><div className="flex items-center justify-between gap-4"><Sparkles size={25} aria-hidden="true" /><span className="border border-line px-3 py-1 font-mono text-xs text-muted">Future Plus direction</span></div><p className="mt-7 font-mono text-xs text-muted">PLUS / FUTURE DIRECTION</p><h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Go deeper with real workloads</h3><p className="mt-4 text-base leading-7 text-muted">Shaped by observed failure patterns and feedback from real corpora.</p><ul className="mt-7 space-y-3">{["Advanced retrieval experiments", "Deeper failure clustering and comparisons", "Cross-document and multi-evidence investigation", "Team report and experiment history workflows"].map(feature => <li key={feature} className="flex gap-3 text-base leading-7 text-muted"><Sparkles size={16} className="mt-1 shrink-0" aria-hidden="true" />{feature}</li>)}</ul><p className="mt-7 text-xs leading-6 text-muted">No pre-orders. These capabilities are not part of the current release.</p><a href="mailto:midaghdour@gmail.com?subject=RAGvidence%20Plus%20early%20interest" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-sm border border-line px-4 text-sm text-ink hover:bg-white/5">Share your use case <ArrowRight size={15} aria-hidden="true" /></a></article>
          </div>
        </div>
      </section>

      <section className="product-section">
        <div className="shell">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><SectionHeading eyebrow="Learn by doing" title="From first command to a defensible experiment.">Practical guides for the decisions you make at each step.</SectionHeading><Link href="/docs" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm text-ink">All documentation <ArrowRight size={15} aria-hidden="true" /></Link></div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[
            { icon: Terminal, title: "Install & first run", text: "Set up uv and reproduce the tutorial.", href: "/docs/installation" },
            { icon: Fingerprint, title: "Bring your own data", text: "Review questions and label complete evidence.", href: "/docs/bring-your-own-data" },
            { icon: CircleGauge, title: "Evaluate & compare", text: "Understand scores and question-level changes.", href: "/docs/metrics" },
            { icon: BookOpen, title: "Read & share reports", text: "Inspect ranked source units and the diagnosis.", href: "/docs/first-report" },
          ].map(({ icon: Icon, title, text, href }) => <Link key={title} href={href} className="surface p-6 transition-colors hover:border-muted"><Icon size={23} aria-hidden="true" /><h3 className="mt-6 text-sm font-semibold text-ink">{title}</h3><p className="mt-3 text-xs leading-6 text-muted">{text}</p><ArrowRight size={16} className="mt-6" aria-hidden="true" /></Link>)}</div>
        </div>
      </section>

      <section id="roadmap" className="product-section">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-20"><div><SectionHeading eyebrow="Built independently" title="A roadmap grounded in observed retrieval failures.">Built by Medo-ID to make retrieval decisions easier to inspect and reproduce.</SectionHeading><a href="https://medo-id.com" className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm text-ink">Meet the builder <ArrowRight size={15} aria-hidden="true" /></a></div><ol className="divide-y divide-line border-y border-line">{[["Now · Free", "Local retrieval, imported runs, evidence metrics, diagnosis, and portable reports."], ["Next · Validate", "Early-user feedback on real corpora, reporting, and integration friction."], ["Later · Plus", "Advanced investigation and history workflows, after validation."]].map(([title, text], i) => <li key={title} className="flex gap-5 py-7"><span className="mt-1 font-mono text-xs text-muted">0{i + 1}</span><div><h3 className="text-sm font-semibold text-ink">{title}</h3><p className="mt-3 text-base leading-6 text-muted">{text}</p></div></li>)}</ol></div>
      </section>

      <section className="product-section">
        <div className="shell text-center"><p className="eyebrow">Your next experiment</p><h2 className="mx-auto mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Run the evidence check before you trust the answer.</h2><p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted">Reproduce the bundled comparison, then replace the sample with reviewed questions from your own corpus.</p><div className="surface mx-auto mt-8 flex max-w-lg items-center justify-between gap-3 border border-line p-4 text-left"><code className="font-mono text-sm text-ink">ragvi tutorial</code><CopyCommand command="ragvi tutorial" /></div><Link href="/docs/installation" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-sm button-primary px-5 text-sm font-semibold ">Install Free <ArrowRight size={15} aria-hidden="true" /></Link></div>
      </section>
    </>
  );
}
