import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" aria-label="RAGvidence home" className="group inline-flex items-center gap-2.5 font-semibold tracking-[-0.025em] text-ink">
      <span className="relative grid size-8 place-items-center overflow-hidden rounded-lg border border-signal/35 bg-signal-soft/55 font-mono text-xs text-signal shadow-[0_0_28px_rgba(98,231,245,0.08)]">
        RV<span className="absolute inset-x-1 bottom-0 h-px bg-signal/70" />
      </span>
      {!compact && <span className="text-[1.05rem]"><span className="text-signal">RAG</span>vidence</span>}
    </Link>
  );
}
