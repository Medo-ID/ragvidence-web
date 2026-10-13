import Link from "next/link";
import Image from "next/image";

export function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} aria-label="RAGvidence home" className="inline-flex min-h-11 items-center gap-2.5 text-xl font-semibold tracking-tight text-ink">
      <Image src="/brand/ragvidence-mark.svg" alt="" aria-hidden="true" width={28} height={28} unoptimized loading="eager" className="size-7 shrink-0" />
      <span><span className="text-signal-ink">RAG</span>vidence<span className="text-signal-ink" aria-hidden="true">.</span></span>
    </Link>
  );
}
