import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, children, centered = false }: { eyebrow: string; title: string; children: ReactNode; centered?: boolean }) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">{title}</h2>
      <div className="mt-4 text-pretty text-base leading-7 text-muted">{children}</div>
    </div>
  );
}
