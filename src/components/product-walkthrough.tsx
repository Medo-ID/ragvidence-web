import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { ProductDemo } from "./product-demo";

export function ProductWalkthrough() {
  return (
    <section id="walkthrough" className="product-section">
      <div className="shell">
        <div className="mb-10 grid gap-5 lg:grid-cols-2 lg:gap-16">
          <div><p className="eyebrow">From command to evidence</p><h2 className="mt-4 max-w-xl text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Run a change. See exactly what it recovered.</h2></div>
          <p className="max-w-lg text-base leading-7 text-muted lg:self-end">A short, silent look at the released CLI and its report. Follow the cursor from your terminal to the ranked evidence behind a result.</p>
        </div>
        <ProductDemo />
        <div className="mt-7 flex flex-col justify-between gap-5 text-xs leading-6 text-muted sm:flex-row">
          <p>Bundled tutorial · 10 answerable questions · BM25 · k=2 · body vs. heading-context.</p>
          <Link href="/docs/first-tutorial" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm text-ink"><BookOpen size={16} aria-hidden="true" />Follow the written tutorial <ArrowRight size={14} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
