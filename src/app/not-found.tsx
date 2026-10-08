import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell grid min-h-[62dvh] place-items-center py-20 text-center">
      <div>
        <p className="font-mono text-sm font-semibold text-signal">404 · NOT FOUND</p>
        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">This evidence trail ends here.</h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-muted">The page may have moved, or the address may be incomplete. Return to the product page or continue in the documentation.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-canvas hover:bg-white"><ArrowLeft size={15} /> Back home</Link>
          <Link href="/docs" className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:border-signal/30"><BookOpen size={15} /> Read the docs</Link>
        </div>
      </div>
    </div>
  );
}
