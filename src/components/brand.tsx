import Link from "next/link";

export function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} aria-label="RAGvidence home" className="inline-flex min-h-11 items-center text-xl font-semibold tracking-tight text-ink">
      <span><span className="text-signal">RAG</span>vidence<span className="text-signal" aria-hidden="true">.</span></span>
    </Link>
  );
}
