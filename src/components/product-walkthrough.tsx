import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { ProductDemo } from "./product-demo";

export function ProductWalkthrough() {
  return (
    <section id="walkthrough" className="product-section">
      <div className="shell">
        <div className="mb-10 grid gap-5 lg:grid-cols-2 lg:gap-16">
          <div><p className="eyebrow">Benchmark your own data</p><h2 className="mt-4 max-w-xl text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Your questions. Your evidence. A comparison you can inspect.</h2></div>
          <p className="max-w-lg text-base leading-7 text-muted lg:self-end">Watch the published CLI compare BM25, parent-child retrieval and sentence extraction on a fictional device manual, then inspect the returned evidence in its actual report.</p>
        </div>
        <ProductDemo />
        <div className="mt-7 flex flex-col justify-between gap-5 text-xs leading-6 text-muted sm:flex-row">
          <p>36-second workflow · Synthetic manual · 4 reviewed dev questions · k=1 · CLI 0.2.0.<br />Execution waits shortened. Results are specific to this mock dataset. Click the video to pause or play.</p>
          <Link href="/docs/bring-your-own-data" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm text-ink"><BookOpen size={16} aria-hidden="true" />Bring your own data <ArrowRight size={14} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
