"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="shell grid min-h-[62dvh] place-items-center py-20 text-center">
      <div>
        <p className="font-mono text-sm font-semibold text-danger">UNEXPECTED ERROR</p>
        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.045em] text-ink">The page could not finish loading.</h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-muted">Your local RAGvidence data is not involved. Retry this page, and contact support if the problem continues.</p>
        <button type="button" onClick={reset} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-canvas hover:bg-white"><RotateCcw size={15} /> Try again</button>
      </div>
    </div>
  );
}
