"use client";

import { Check, Copy, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

export function CopyCommand({ command, label = "Copy", contentLabel = "command" }: { command: string; label?: string; contentLabel?: string }) {
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
      <button type="button" onClick={copy} aria-label={contentLabel === "command" ? `Copy command: ${command}` : `Copy ${contentLabel} content`} title={status === "error" ? "Clipboard unavailable. Select the content and copy it manually, or try again." : undefined} className="copy-control inline-flex min-h-11 items-center gap-2 border border-line bg-panel-raised px-3 text-sm font-medium text-muted transition-colors hover:border-signal-ink hover:text-ink">
        {status === "copied" ? <Check size={14} className="text-success" aria-hidden="true" /> : status === "error" ? <TriangleAlert size={14} className="text-danger" aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
        {status === "copied" ? "Copied" : status === "error" ? "Copy failed" : label}
      </button>
      <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">{status === "copied" ? "Content copied to clipboard." : status === "error" ? "Clipboard unavailable. Select the content and copy it manually, or try again." : ""}</span>
    </span>
  );
}
