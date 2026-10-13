"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function motionSnapshot() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
function serverSnapshot() { return true; }

export function ProductDemo() {
  const reducedMotion = useSyncExternalStore(subscribeToMotion, motionSnapshot, serverSnapshot);
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (reducedMotion) { element.pause(); element.load(); }
    if (!("IntersectionObserver" in window)) { element.pause(); return; }
    let cancelled = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!reducedMotion && entry.intersectionRatio >= 0.4) {
        element.play().catch(() => { if (!cancelled) element.pause(); });
      } else element.pause();
    }, { threshold: [0, 0.4] });
    observer.observe(element);
    return () => { cancelled = true; observer.disconnect(); element.pause(); };
  }, [reducedMotion]);

  return (
    <div className="surface showcase">
      <video ref={video} autoPlay={!reducedMotion} muted loop playsInline preload="metadata" controls={false} poster="/media/walkthrough-poster.webp" width={1920} height={1080} className="aspect-video w-full" aria-label="Silent tutorial walkthrough: run the CLI, understand 60% to 90%, and inspect recovered evidence" onError={() => { if (!reducedMotion) setFailed(true); }}>
        {!reducedMotion && <><source src="/media/walkthrough.webm" type="video/webm" /><source src="/media/walkthrough.mp4" type="video/mp4" /></>}
      </video>
      {failed && <p role="status" className="p-4 text-sm text-muted">The walkthrough could not play. Follow the written tutorial below or <a href="/media/walkthrough.mp4" className="text-signal-ink underline">download the MP4</a>.</p>}
    </div>
  );
}
