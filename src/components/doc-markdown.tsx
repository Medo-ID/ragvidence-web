"use client";

import { Check, Copy, Download } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

export function DocMarkdown({ slug }: { slug: string }) {
  const url = `/docs/${slug}/markdown`;
  const [status, setStatus] = useState<"idle" | "loading" | "copied" | "clipboard-error" | "fetch-error">("idle");
  const [markdown, setMarkdown] = useState("");
  const request = useRef<AbortController | null>(null);
  const fallbackId = useId();
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (status !== "copied") return;
    const timer = window.setTimeout(() => setStatus("idle"), 2500);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copy() {
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setStatus("loading");
    let text = markdown;
    try {
      if (!text) {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok || !response.headers.get("content-type")?.startsWith("text/markdown")) throw new Error("Markdown unavailable");
        text = await response.text();
        if (controller.signal.aborted) return;
        setMarkdown(text);
      }
      try {
        if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(text);
        if (!controller.signal.aborted) setStatus("copied");
      } catch {
        if (!controller.signal.aborted) setStatus("clipboard-error");
      }
    } catch {
      if (!controller.signal.aborted) setStatus("fetch-error");
    } finally {
      if (request.current === controller) request.current = null;
    }
  }

  return <div className="no-print mt-7">
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
      <button type="button" onClick={() => void copy()} disabled={status === "loading"} className="inline-flex min-h-11 items-center gap-2 hover:text-ink disabled:opacity-60">
        {status === "copied" ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
        {status === "copied" ? "Markdown copied" : status === "loading" ? "Loading Markdown…" : "Copy as Markdown"}
      </button>
      <a href={url} download={`ragvidence-${slug}.md`} className="inline-flex min-h-11 items-center gap-2 hover:text-ink"><Download size={14} aria-hidden="true" />Download .md</a>
    </div>
    <p role="status" className="text-xs leading-6 text-muted">{status === "copied" ? "Article copied to clipboard." : status === "clipboard-error" ? "Clipboard unavailable. Select and copy the Markdown below, or download the file." : status === "fetch-error" ? "Could not load Markdown. Try again or use Download .md." : ""}</p>
    {status === "clipboard-error" && <div className="mt-3">
      <label htmlFor={fallbackId} className="text-xs text-muted">Article Markdown</label>
      <textarea id={fallbackId} readOnly value={markdown} onFocus={event => event.currentTarget.select()} className="mt-2 block h-48 w-full rounded-sm border border-line bg-panel p-3 font-mono text-xs leading-6 text-ink" />
    </div>}
    <noscript><p className="text-xs text-muted">Download the Markdown file to copy this article.</p></noscript>
  </div>;
}
