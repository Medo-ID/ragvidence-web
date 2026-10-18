import { ArrowRight, Database, FileSearch, Globe2, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CliDemo } from "@/components/cli-demo";
import { ProductSections } from "@/components/product-sections";
import { CodeBlock } from "@/components/code-block";

const installCommand = 'uv tool install --python 3.12 "ragvidence==0.2.0"';

export default function Home() {
  return (
    <div className="home-sections">
      <section id="install" className="hero-section relative isolate ">
        <div className="shell grid grid-cols-1 items-start gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 xl:gap-16">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-muted">
              <span className="size-1.5 bg-success" aria-hidden="true" />
              v0.2.0 · Free · Apache-2.0
            </div>
            <h1 className="mt-5 max-w-xl text-balance text-[2.4rem] font-semibold leading-[1.08] tracking-tighter text-ink sm:text-6xl lg:text-[3.2rem] xl:text-6xl">
              See whether your RAG change{" "}
              <span className="text-signal-ink">helped.</span>
            </h1>
            <p className="mt-5 max-w-lg text-pretty text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Try retrieval techniques on your own data before implementing them in your RAG project. Compare returned context, diagnose missing evidence and share the report.
            </p>

            <div id="hero-install-command" className="mt-6"><CodeBlock label="Terminal" content={installCommand} wrap /></div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/docs/installation" className="inline-flex min-h-11 items-center gap-2 rounded-sm button-primary px-5 text-sm font-semibold transition-colors">Install CLI<ArrowRight size={16} aria-hidden="true" /></Link>
              <a href="/sample-report.html" className="surface inline-flex min-h-11 items-center gap-2 rounded-sm border border-line px-5 text-sm font-medium text-ink transition-colors hover:border-signal/40">View sample report<FileSearch size={16} aria-hidden="true" /></a>
            </div>

            <div className="mt-6 border-t border-line pt-5">
              <p className="text-sm text-ink">Your files → retrieval experiments → inspectable reports</p>
              <p className="mt-2 text-xs leading-6 text-muted">BM25 needs no model or API key. Add reviewed original spans when you need scored evidence.</p>
              <div className="mt-3 flex flex-wrap gap-5 text-sm text-signal-ink"><a href="https://github.com/Medo-ID/ragvidence">Source</a><a href="https://github.com/Medo-ID/ragvidence/blob/main/CONTRIBUTING.md">Contribute</a><a href="https://github.com/Medo-ID/ragvidence/stargazers">Star on GitHub</a></div>
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
