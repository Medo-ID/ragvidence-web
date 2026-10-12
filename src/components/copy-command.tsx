"use client";

import { Check, Copy, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

export function CopyCommand({ command, label = "Copy" }: { command: string; label?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (status !== "copied") return;
    const timeout = window.setTimeout(() => setStatus("idle"), 1800);
    return () => window.clearTimeout(timeout);
  }, [status]);

  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(command);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <span className="no-print inline-flex shrink-0 items-center">
      <button type="button" onClick={copy} aria-label={`Copy command: ${command}`} title={status === "error" ? "Clipboard unavailable. Select the command and copy it manually, or try again." : undefined} className="inline-flex min-h-11 items-center gap-2 border border-line bg-white/2.5 px-3 text-xs font-medium text-muted transition-colors hover:border-signal/30 hover:text-ink">
        {status === "copied" ? <Check size={14} className="text-success" aria-hidden="true" /> : status === "error" ? <TriangleAlert size={14} className="text-danger" aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
        {status === "copied" ? "Copied" : status === "error" ? "Copy failed" : label}
      </button>
      <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">{status === "copied" ? "Command copied to clipboard." : status === "error" ? "Clipboard unavailable. Select the command and copy it manually, or try again." : ""}</span>
    </span>
  );
}
