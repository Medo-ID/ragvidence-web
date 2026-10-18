"use client";

import { useEffect, useRef, useState } from "react";

export function ProductDemo() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const manualChoice = useRef(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    element.muted = true; // React doesn't reliably emit the muted attribute in SSR HTML
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      if (motion.matches) element.pause();
      else if (!manualChoice.current) element.play().catch(() => {});
    };
    updateMotion();
    motion.addEventListener("change", updateMotion);
    return () => motion.removeEventListener("change", updateMotion);
  }, []);

  function togglePlayback() {
    const element = video.current;
    if (!element) return;
    manualChoice.current = true;
    if (element.paused) {
      if (!element.currentSrc) {
        for (const source of element.querySelectorAll("source")) source.removeAttribute("media");
        element.load();
      }
      element.play().catch(() => {});
    }
    else element.pause();
  }

  return (
    <div className="surface showcase">
      <div className="relative">
        <video
          ref={video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/walkthrough-poster.webp"
          width={1920}
          height={1080}
          className="block aspect-video w-full"
          aria-label="Silent own-data workflow: inspect a synthetic device manual, compare BM25, parent-child and sentence extraction, then inspect reviewed evidence"
          onClick={togglePlayback}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src="/media/walkthrough.webm" type="video/webm" media="(prefers-reduced-motion: no-preference)" />
          <source src="/media/walkthrough.mp4" type="video/mp4" media="(prefers-reduced-motion: no-preference)" />
        </video>
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={playing ? "Pause workflow video" : "Play workflow video"}
          className="absolute bottom-4 left-4 rounded-sm border border-line bg-panel px-3 py-2 text-sm text-ink"
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}
