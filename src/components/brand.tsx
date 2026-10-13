import Link from "next/link";
import Image from "next/image";

export function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} aria-label="RAGvidence home" className="inline-flex min-h-11 shrink-0 items-center gap-2.5 text-xl font-medium tracking-tight text-ink">
      <Image src="/brand/a-evidence-convergence/mark-dark.svg" width={28} height={28} alt="" unoptimized className="shrink-0" />
      <span><span className="font-semibold text-signal-ink">RAG</span>vidence</span>
    </Link>
  );
}
