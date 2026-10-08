"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

export function CopyCommand({ command, label = "Copy" }: { command: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function copy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
  }

  return (
    <button type="button" onClick={copy} aria-label={`Copy command: ${command}`} className="inline-flex items-center gap-2 rounded-lg border border-line bg-white/[0.025] px-3 py-2 text-xs font-medium text-muted transition-colors hover:border-signal/30 hover:text-ink">
      {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
      {copied ? "Copied" : label}
    </button>
  );
}
