import { ArrowRight, Database, FileSearch, Globe2, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CliDemo } from "@/components/cli-demo";
import { ProductSections } from "@/components/product-sections";

export default function Home() {
  return (
    <div className="home-sections">
      <section id="install" className="hero-section relative isolate ">
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
              <Link href="/docs/installation" className="inline-flex min-h-11 items-center gap-2 border border-ink bg-ink px-5 text-sm font-semibold text-canvas transition-colors hover:bg-white">Install Free<ArrowRight size={16} aria-hidden="true" /></Link>
              <a href="/sample-report.html" className="glass-panel inline-flex min-h-11 items-center gap-2 border border-line px-5 text-sm font-medium text-ink transition-colors hover:border-signal/40">View sample report<FileSearch size={16} aria-hidden="true" /></a>
            </div>

            <div className="mt-10 border-t border-line pt-6">
              <p className="text-sm text-muted"><span className="font-mono text-lg text-ink">60% <span className="text-muted">→</span> 90%</span><span className="ml-3">evidence sufficiency</span></p>
              <p className="mt-2 text-xs leading-6 text-muted">Bundled tutorial · v0.1.0 · 10 answerable questions · BM25 · k=2</p>
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

      <ProductSections />
    </div>
  );
}
