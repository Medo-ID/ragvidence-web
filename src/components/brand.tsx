import Link from "next/link";
import Image from "next/image";

export function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} aria-label="RAGvidence home" className="brand-link inline-flex min-h-11 shrink-0 items-center gap-3 text-xl font-medium tracking-tight text-ink">
      <Image src="/brand/evidence-cli/mark-dark.svg" width={28} height={28} alt="" unoptimized className="brand-dark shrink-0" />
      <Image src="/brand/evidence-cli/mark-light.svg" width={28} height={28} alt="" unoptimized className="brand-light shrink-0" />
      <span>RAGvidence</span>
    </Link>
  );
}
