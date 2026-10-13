"use client";

import { FileSearch, GitCompareArrows, Pause, Play, Terminal } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const chapters = [
  { title: "Run tutorial", icon: Terminal, start: 0 },
  { title: "Compare results", icon: GitCompareArrows, start: 8 },
  { title: "Inspect evidence", icon: FileSearch, start: 16 },
];

function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function reducedMotionSnapshot() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
function serverMotionSnapshot() { return true; }

export function ProductDemo() {
  const reducedMotion = useSyncExternalStore(subscribeToMotion, reducedMotionSnapshot, serverMotionSnapshot);
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const pendingSeek = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [requested, setRequested] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let cancelled = false;
    if (visible && (requested === true || (!reducedMotion && requested !== false))) {
      element.play().catch(() => { if (!cancelled) setRequested(false); });
    } else element.pause();
    return () => { cancelled = true; element.pause(); };
  }, [visible, requested, reducedMotion]);

  function selectChapter(index: number) {
    setActive(index);
    const element = video.current;
    if (!element) return;
    if (element.readyState > 0) element.currentTime = chapters[index].start;
    else { pendingSeek.current = chapters[index].start; element.load(); }
  }

  return (
    <div ref={root}>
      <div role="tablist" aria-label="Product demo chapters" className="mb-7 flex flex-wrap gap-2">
        {chapters.map(({ title, icon: Icon }, index) => (
          <button key={title} id={`demo-tab-${index}`} type="button" role="tab" aria-selected={active === index} aria-controls="product-demo-stage" tabIndex={active === index ? 0 : -1} onClick={() => selectChapter(index)} onKeyDown={(event) => {
            const next = event.key === "ArrowRight" ? (index + 1) % chapters.length : event.key === "ArrowLeft" ? (index + chapters.length - 1) % chapters.length : event.key === "Home" ? 0 : event.key === "End" ? chapters.length - 1 : null;
            if (next !== null) { event.preventDefault(); selectChapter(next); document.getElementById(`demo-tab-${next}`)?.focus(); }
          }} className={`inline-flex min-h-11 items-center gap-2 border px-4 text-xs transition-colors sm:text-sm ${active === index ? "border-muted bg-white/8 text-ink" : "border-transparent text-muted hover:border-line hover:text-ink"}`}><Icon size={15} aria-hidden="true" />{title}</button>
        ))}
      </div>
      <div className="surface border border-line p-2 sm:p-3">
        <div className="flex items-center justify-between gap-4 px-2 pb-4 pt-2 text-xs text-muted">
          <div className="flex gap-1.5" aria-hidden="true"><span className="size-2 border border-muted/50" /><span className="size-2 border border-muted/50" /><span className="size-2 border border-muted/50" /></div>
          <span className="font-mono">ragvi / tutorial.html</span>
          <span className="hidden sm:block">v0.1.0</span>
        </div>
        <div id="product-demo-stage" role="tabpanel" aria-labelledby={`demo-tab-${active}`} className="border border-line bg-canvas">
          <video ref={video} className="aspect-video w-full" width={1280} height={720} muted loop playsInline preload="none" poster="/media/walkthrough-poster.webp" aria-label="Silent RAGvidence demo: run the tutorial, compare results, and open ranked evidence" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} onLoadedMetadata={() => {
            if (pendingSeek.current !== null && video.current) { video.current.currentTime = pendingSeek.current; pendingSeek.current = null; }
          }} onTimeUpdate={() => { if (video.current) setActive(Math.min(2, Math.floor(video.current.currentTime / 8))); }}>
            <source src="/media/walkthrough.webm" type="video/webm" />
          </video>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-1 pt-4">
          <span className="text-xs text-muted">v0.1.0 tutorial · BM25 · k=2</span>
          <button type="button" disabled={failed} aria-label={playing ? "Pause product demo" : "Play product demo"} onClick={() => setRequested(!playing)} className="inline-flex min-h-11 items-center gap-2 border border-line px-3 text-xs text-ink hover:bg-white/5 disabled:opacity-50">{playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}{playing ? "Pause" : "Play"}</button>
        </div>
        {failed && <p role="status" className="px-2 py-3 text-sm text-muted">This browser cannot play the demo. <a href="/media/walkthrough.webm" className="text-ink underline">Download it</a> or follow the written tutorial below.</p>}
      </div>
    </div>
  );
}
