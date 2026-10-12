import {
  ArrowRight,
  BadgeCheck,
  Binary,
  Braces,
  Check,
  ChevronRight,
  CircleGauge,
  Database,
  FileSearch,
  Fingerprint,
  Globe2,
  LockKeyhole,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { CopyCommand } from "@/components/copy-command";
import { SectionHeading } from "@/components/section-heading";
import { ProductWalkthrough } from "@/components/product-walkthrough";
import { CliDemo } from "@/components/cli-demo";

const installCommand = 'uv tool install --python 3.12 "ragvidence[semantic]"';
const tutorialCommand = "ragvi tutorial";

const workflow = [
  { step: "01", title: "Label the evidence", text: "Connect each test question to the source units required for a complete answer.", icon: Fingerprint },
  { step: "02", title: "Run a controlled change", text: "Keep the question set and k fixed. Change one retriever, model, or representation.", icon: Binary },
  { step: "03", title: "Inspect what moved", text: "See improvements, regressions, missing evidence, ranks, and reproducibility details.", icon: ScanSearch },
];

const metrics = [
  ["Sufficiency@k", "Did the first k hits contain every required evidence ID?"],
  ["Evidence coverage@k", "What fraction of the required evidence was recovered?"],
  ["First relevant rank", "How early did any required evidence appear?"],
  ["Reciprocal rank", "A rank-sensitive score for the first relevant hit."],
  ["Precision@k", "How many of the k retrieved units contained required evidence?"],
  ["Change class", "Fail→pass, pass→fail, pass→pass, or fail→fail."],
];

const freeFeatures = [
  "BM25 lexical retrieval",
  "Local semantic retrieval with FastEmbed",
  "Ollama and OpenAI-compatible adapters",
  "Body vs. heading-context experiments",
  "Import results from an existing retriever",
  "Evidence-level metrics and change analysis",
  "Self-contained HTML, Markdown, and JSON reports",
  "Recoverable local workspaces",
];

const plusDirection = [
  "Advanced retrieval experiments",
  "Deeper failure clustering and comparison workflows",
  "Cross-document and multi-evidence investigations",
  "Team-oriented report and history features",
];

export default function Home() {
  return (
    <div className="home-sections">
      <section id="install" className="hero-section relative isolate border-b border-line/70">
        <div className="site-grid absolute inset-0 -z-10" aria-hidden="true" />
        <div className="shell grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 xl:gap-16">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-muted">
              <span className="size-1.5 bg-success" aria-hidden="true" />
              Local-first · CLI-native · Evidence-level
            </div>
            <h1 className="mt-7 max-w-xl text-balance text-[2.65rem] font-semibold leading-[1.08] tracking-[-0.05em] text-ink sm:text-6xl lg:text-[3.2rem] xl:text-6xl">
              See whether your RAG change{" "}
              <span className="text-signal">helped.</span>
            </h1>
            <p className="mt-7 max-w-lg text-pretty text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Compare retrieval changes locally. Find missing evidence, catch regressions, and share a report your team can inspect.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/docs/installation" className="inline-flex min-h-11 items-center gap-2 border border-signal bg-signal px-5 text-sm font-semibold text-ink transition-colors hover:bg-signal-hover">Install Free<ArrowRight size={16} aria-hidden="true" /></Link>
              <a href="/sample-report.html" className="glass-panel inline-flex min-h-11 items-center gap-2 border border-line px-5 text-sm font-medium text-ink transition-colors hover:border-signal/40">View sample report<FileSearch size={16} aria-hidden="true" /></a>
            </div>

            <div className="mt-10 border-t border-line pt-6">
              <p className="text-sm text-muted"><span className="font-mono text-lg text-ink">60% <span className="text-muted">→</span> 90%</span><span className="ml-3">evidence sufficiency</span></p>
              <p className="mt-2 text-xs leading-6 text-muted">Bundled tutorial · v0.1.0 · 10 questions · BM25 · k=2</p>
            </div>

            <div className="mt-6 flex max-w-lg flex-wrap gap-x-5 gap-y-3 text-xs text-muted">
              <span className="inline-flex items-center gap-2"><LockKeyhole size={15} className="text-signal-ink" /> No account</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-signal-ink" /> No telemetry</span>
              <span className="inline-flex items-center gap-2"><Database size={15} className="text-signal-ink" /> No hosted database</span>
              <span className="inline-flex items-center gap-2"><Globe2 size={15} className="text-signal-ink" /> Your model, or none</span>
            </div>
          </div>
          <div className="min-w-0"><CliDemo /></div>
        </div>
      </section>

      <section className="border-y border-line/80 bg-panel/35">
        <div className="shell grid divide-y divide-line/80 py-3 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[["Free", "Useful without an API key"], ["Local", "Files stay on your machine by default"], ["Shareable", "One self-contained HTML report"]].map(([title, text]) => (
            <div key={title} className="px-5 py-5 text-center"><strong className="font-mono text-sm text-ink">{title}</strong><p className="mt-1 text-sm text-muted">{text}</p></div>
          ))}
        </div>
      </section>

      <ProductWalkthrough />

      <section className="product-section shell">
        <SectionHeading eyebrow="The failure behind the answer" title="A plausible answer can hide a broken retriever.">
          RAG output is easy to judge by feel. Retrieval is not. A response may cite one relevant chunk while silently missing the constraint, exception, or second piece of evidence needed to be complete.
        </SectionHeading>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {[
            { icon: FileSearch, title: "Missing evidence", text: "The top hits mention the topic but omit a required condition buried elsewhere." },
            { icon: TriangleAlert, title: "Invisible regressions", text: "A new embedding model fixes several questions and quietly breaks others." },
            { icon: CircleGauge, title: "Weak evaluation", text: "A single aggregate score hides exactly which questions changed and why." },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="surface rounded-none p-7 sm:p-9">
              <div className="grid size-10 place-items-center rounded-none border border-line bg-panel-raised text-signal-ink"><Icon size={19} /></div>
              <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-line/75 bg-panel/20 product-section">
        <div className="shell">
          <SectionHeading eyebrow="A controlled loop" title="Turn retrieval changes into inspectable experiments." centered>
            Freeze the evidence, change one meaningful variable, and compare the same questions at the same retrieval depth.
          </SectionHeading>
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {workflow.map(({ step, title, text, icon: Icon }) => (
              <article key={step} className="relative overflow-hidden rounded-none border border-line glass-panel p-7 sm:p-9">
                <span className="absolute right-5 top-4 font-mono text-4xl font-semibold text-white/[0.035]">{step}</span>
                <div className="grid size-11 place-items-center rounded-none border border-signal/20 bg-signal/8 text-signal-ink"><Icon size={20} /></div>
                <h3 className="mt-8 text-xl font-semibold tracking-tight text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="product-section shell">
        <div className="grid items-start gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <SectionHeading eyebrow="Reproducible proof" title="See the change. Then inspect every rank.">
              This is the bundled tutorial—not a customer benchmark. On the same ten labeled questions at k=2, adding heading context recovered three failures without introducing a regression.
            </SectionHeading>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="/sample-report.html" className="inline-flex items-center gap-2 rounded-none bg-signal px-4 py-2.5 text-sm font-semibold text-ink hover:bg-signal-hover">Open the full report <ArrowRight size={15} /></a>
              <Link href="/docs/first-tutorial" className="inline-flex items-center gap-2 rounded-none border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:border-signal/30">Reproduce it locally <ChevronRight size={15} /></Link>
            </div>
            <p className="mt-5 text-xs leading-5 text-muted">Bundled dataset · 10 questions · BM25 · k=2 · body vs. heading-context · version 0.1.0</p>
          </div>

          <div className="overflow-hidden rounded-none border border-line glass-panel">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div><p className="font-mono text-xs text-muted">tutorial.html</p><p className="mt-1 text-sm font-medium text-ink">Representation comparison</p></div>
              <span className="rounded-none border border-success/25 bg-success/10 px-2.5 py-1 font-mono text-xs text-success">COMPLETE</span>
            </div>
            <div className="grid grid-cols-2 border-b border-line">
              <div className="p-5 sm:p-8"><p className="font-mono text-xs text-muted">Body only</p><p className="mt-3 text-4xl font-semibold tracking-tight text-ink">60%</p><p className="mt-1 text-xs text-muted">6 / 10 sufficient</p></div>
              <div className="border-l border-line bg-signal/[0.035] p-5 sm:p-8"><p className="font-mono text-xs text-signal-ink">With heading context</p><p className="mt-3 text-4xl font-semibold tracking-tight text-signal-ink">90%</p><p className="mt-1 text-xs text-muted">9 / 10 sufficient</p><span className="mt-3 inline-block bg-success/10 px-2 py-1 font-mono text-xs text-success">+30 pts</span></div>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-4">
              {[["3", "fail → pass", "text-success"], ["0", "pass → fail", "text-ink"], ["6", "pass → pass", "text-ink"], ["1", "fail → fail", "text-danger"]].map(([value, label, color]) => (
                <div key={label} className="rounded-none border border-line bg-panel p-4"><strong className={`text-2xl ${color}`}>{value}</strong><p className="mt-1 font-mono text-xs uppercase tracking-wide text-muted">{label}</p></div>
              ))}
            </div>
            <div className="border-t border-line p-5">
              <div className="rounded-none border border-line bg-panel/80 p-5">
                <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-widest text-muted">Changed question · DEV-01</p><h3 className="mt-2 text-sm font-medium leading-6 text-ink">How long should I hold the button to reset pairing on Orion DeskHub firmware 4.2?</h3></div><span className="shrink-0 rounded-none bg-success/10 px-2.5 py-1 font-mono text-xs text-success">FAIL → PASS</span></div>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <div className="rounded-none border border-danger/15 bg-danger/[0.035] p-4"><p className="font-mono text-xs text-danger">BODY ONLY</p><p className="mt-2 text-xs leading-5 text-muted">Top hits: migration reset and an unrelated Lyra device. Required evidence absent.</p></div>
                  <div className="rounded-none border border-success/15 bg-success/[0.035] p-4"><p className="font-mono text-xs text-success">WITH HEADING CONTEXT</p><p className="mt-2 text-xs leading-5 text-muted">Rank 1: the Orion 4.2 reset section. Required evidence found: “Eight seconds.”</p></div>
                </div>
              </div>
            </div>
            <div className="border-t border-line bg-panel/45 px-5 py-4 text-xs leading-5 text-muted"><span className="font-semibold text-ink">Diagnosis:</span> Missing structural context in the baseline representation. <span className="text-muted">Correlation in a small labeled comparison—not universal causation.</span></div>
          </div>
        </div>
      </section>

      <section className="border-y border-line/75 bg-panel/20 product-section">
        <div className="shell">
          <SectionHeading eyebrow="Evidence-level metrics" title="Measure the retrieval job, not the confidence of the prose.">
            RAGvidence keeps retrieval evaluation separate from optional answer generation, so a fluent model cannot disguise missing context.
          </SectionHeading>
          <div className="mt-12 grid gap-px overflow-hidden rounded-none border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
            {metrics.map(([name, description]) => (
              <article key={name} className="glass-panel p-7 sm:p-9"><Braces size={17} className="text-signal-ink" /><h3 className="mt-4 font-mono text-sm font-semibold text-ink">{name}</h3><p className="mt-2 text-sm leading-6 text-muted">{description}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="product-section shell">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading eyebrow="Meet your stack where it is" title="Start local. Bring your own retriever when ready.">
            Use built-in BM25 and semantic retrieval to learn and iterate, or import ranked hits from LangChain, LlamaIndex, a vector database, or your production service.
          </SectionHeading>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ["BM25", "Offline lexical baseline", "No key"],
              ["FastEmbed", "Local semantic retrieval", "Local model"],
              ["Ollama", "Local embedding adapter", "Your runtime"],
              ["OpenAI-compatible", "Remote embedding adapter", "Your key"],
              ["Imported run", "Any external retriever", "JSONL"],
              ["Optional generation", "Inspect answers separately", "Your model"],
            ].map(([name, text, badge]) => (
              <div key={name} className="surface rounded-none p-4"><div className="flex items-center justify-between gap-3"><strong className="text-sm text-ink">{name}</strong><span className="rounded-none bg-white/4 px-2 py-1 font-mono text-xs uppercase text-muted">{badge}</span></div><p className="mt-2 text-xs leading-5 text-muted">{text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section id="plans" className="border-y border-line/75 bg-panel/20 product-section">
        <div className="shell">
          <SectionHeading eyebrow="Simple editions" title="The Free edition is a real tool, not a demo." centered>
            Use the complete current workflow without an account. Plus will add advanced depth only after those features exist and early users validate the need.
          </SectionHeading>
          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-5 lg:grid-cols-2">
            <article className="rounded-none border border-signal/35 bg-canvas p-7 glass-panel sm:p-9">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between"><div><p className="font-mono text-xs text-signal-ink">FREE</p><h3 className="mt-2 text-2xl font-semibold text-ink">Build a trustworthy baseline</h3></div><span className="shrink-0 border border-success/25 bg-success/10 px-2.5 py-1 font-mono text-xs text-success">AVAILABLE</span></div>
              <p className="mt-4 text-sm leading-6 text-muted">Everything currently shipped in version 0.1.0. No activation, account, or payment required.</p>
              <ul className="mt-7 space-y-3">
                {freeFeatures.map((feature) => <li key={feature} className="flex gap-3 text-sm text-muted"><Check size={16} className="mt-0.5 shrink-0 text-signal-ink" />{feature}</li>)}
              </ul>
              <div className="mt-8 rounded-none border border-line bg-panel p-3"><div className="flex items-center justify-between gap-3 overflow-hidden"><code className="truncate font-mono text-xs text-ink">{installCommand}</code><CopyCommand command={installCommand} label="Copy" /></div></div>
            </article>
            <article className="rounded-none border border-line glass-panel p-7 sm:p-9">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between"><div><p className="font-mono text-xs text-muted">PLUS</p><h3 className="mt-2 text-2xl font-semibold text-ink">Go deeper with real workloads</h3></div><span className="shrink-0 border border-line bg-white/2.5 px-2.5 py-1 font-mono text-xs text-muted">COMING LATER</span></div>
              <p className="mt-4 text-sm leading-6 text-muted">Shaped with early users. No pre-orders and no promises disguised as shipped features.</p>
              <ul className="mt-7 space-y-3">
                {plusDirection.map((feature) => <li key={feature} className="flex gap-3 text-sm text-muted"><Sparkles size={16} className="mt-0.5 shrink-0 text-muted" />{feature}</li>)}
              </ul>
              <a href="mailto:midaghdour@gmail.com?subject=RAGvidence%20Plus%20early%20interest" className="mt-8 inline-flex items-center gap-2 rounded-none border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:border-signal/30">Share your use case <ArrowRight size={15} /></a>
            </article>
          </div>
        </div>
      </section>

      <section className="product-section shell">
        <div className="overflow-hidden rounded-none border border-line glass-panel p-7 sm:p-10 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div><p className="eyebrow">Documentation that teaches the workflow</p><h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">From first command to a defensible experiment.</h2><p className="mt-4 max-w-2xl text-base leading-7 text-muted">Follow a first-run tutorial, label your own dataset, compare retrievers, understand every metric, import production results, and recover a broken workspace.</p></div>
            <Link href="/docs" className="inline-flex items-center justify-center gap-2 rounded-none bg-ink px-5 py-3 text-sm font-semibold text-canvas hover:bg-white">Read the docs <ArrowRight size={16} /></Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {["Install & first run", "Bring your own data", "Evaluate & compare", "Read & share reports"].map((item, index) => <div key={item} className="rounded-none border border-line bg-canvas/70 p-4"><span className="font-mono text-xs text-signal-ink">0{index + 1}</span><p className="mt-2 text-sm font-medium text-ink">{item}</p></div>)}
          </div>
        </div>
      </section>

      <section id="roadmap" className="border-y border-line/75 bg-panel/20 product-section">
        <div className="shell grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <SectionHeading eyebrow="Roadmap" title="Expand from observed pain, not feature volume.">
            The current release covers the core single- and multi-evidence retrieval loop. More complex diagnosis belongs in later validated milestones.
          </SectionHeading>
          <ol className="space-y-3">
            {[
              ["Now · Free", "Lexical and semantic retrieval, evidence metrics, comparisons, diagnostics, portable reports."],
              ["Next · Validate", "Early-user feedback on real corpora, failure patterns, reporting, and integration friction."],
              ["Later · Plus", "Advanced cross-document investigations, experiment history, and team workflows."],
              ["Later · Teams", "Shared infrastructure only when multiple users genuinely need it."],
            ].map(([title, text], index) => (
              <li key={title} className="flex gap-5 rounded-none border border-line glass-panel p-5"><span className={`mt-1 size-2.5 shrink-0 rounded-none ${index === 0 ? "bg-success shadow-[0_0_16px_rgba(85,214,139,0.6)]" : "border border-muted/50"}`} /><div><h3 className="text-sm font-semibold text-ink">{title}</h3><p className="mt-2 text-sm leading-6 text-muted">{text}</p></div></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="product-section shell">
        <div className="grid gap-8 rounded-none border border-line glass-panel p-7 sm:p-10 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="grid size-14 place-items-center rounded-none border border-signal/25 bg-signal/10 font-mono font-semibold text-signal-ink">MI</div>
          <div><p className="text-sm font-semibold text-ink">Built by Medo-ID</p><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">RAGvidence grew from a practical problem: deciding whether retrieval changes actually found the complete evidence needed for high-stakes, document-grounded answers. The project is independent, transparent about its limits, and designed in public-facing milestones.</p></div>
          <a href="https://medo-id.com" className="inline-flex items-center gap-2 text-sm font-semibold text-signal-ink hover:text-ink">Meet the builder <ArrowRight size={15} /></a>
        </div>
      </section>

      <section className="shell pb-10">
        <div className="relative overflow-hidden rounded-none border border-signal/25 bg-signal-soft/35 px-6 py-14 text-center sm:px-10 sm:py-20">
          <div className="site-grid absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative"><BadgeCheck className="mx-auto text-signal-ink" size={28} /><h2 className="mx-auto mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">Run the evidence check before you trust the answer.</h2><p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted">Install RAGvidence, reproduce the bundled comparison, then replace the sample with questions from your own corpus.</p><div className="mx-auto mt-8 flex max-w-xl items-center gap-3 rounded-none border border-signal/20 bg-canvas/85 p-2 pl-4 text-left"><code className="min-w-0 flex-1 truncate font-mono text-xs text-ink sm:text-sm">{tutorialCommand}</code><CopyCommand command={tutorialCommand} /></div></div>
        </div>
      </section>
    </div>
  );
}
