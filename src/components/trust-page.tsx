import type { ReactNode } from "react";

export function TrustPage({ eyebrow, title, intro, updated = "October 8, 2026", children }: { eyebrow: string; title: string; intro: string; updated?: string; children: ReactNode }) {
  return (
    <div className="shell py-20 sm:py-28">
      <article className="mx-auto max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-muted">{intro}</p>
        <p className="mt-5 font-mono text-xs text-muted">Last updated: {updated}</p>
        <div className="prose-ragvi mt-12 space-y-5 text-[0.98rem] leading-7 text-muted [&_a]:text-signal [&_a:hover]:text-ink [&_h2]:mt-12 [&_h2]:border-t [&_h2]:border-line [&_h2]:pt-9 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink [&_li]:mb-2 [&_strong]:text-ink [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </article>
    </div>
  );
}
