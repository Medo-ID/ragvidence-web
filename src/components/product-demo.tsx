"use client";

import { useEffect, useRef, useState } from "react";

export function ProductDemo() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [playError, setPlayError] = useState(false);
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
      // Loading reduced-motion sources must wait for this explicit play request.
      element.autoplay = false;
      if (!element.currentSrc) {
        for (const source of element.querySelectorAll("source")) source.removeAttribute("media");
        element.load();
      }
      setPlayError(false);
      element.play().catch(() => { element.pause(); setPlayError(true); });
    }
    else element.pause();
  }

  return (
    <div className="surface showcase">
      <div className="relative">
        <video
          ref={video}
          autoPlay
          controls
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/walkthrough-poster.webp"
          width={1920}
          height={1080}
          className="block aspect-video w-full"
          aria-label="Silent own-data workflow: inspect a synthetic device manual, compare BM25, parent-child and sentence extraction, then inspect reviewed evidence"
          onClick={event => {
            manualChoice.current = true;
            if (event.clientY < event.currentTarget.getBoundingClientRect().bottom - 64) {
              event.preventDefault();
              togglePlayback();
            }
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src="/media/walkthrough.webm" type="video/webm" media="(prefers-reduced-motion: no-preference)" />
          <source src="/media/walkthrough.mp4" type="video/mp4" media="(prefers-reduced-motion: no-preference)" />
          <track kind="captions" src="/media/walkthrough.vtt" srcLang="en" label="English descriptions" />
        </video>
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={playing ? "Pause workflow video" : "Play workflow video"}
          className="absolute top-4 right-4 rounded-sm border border-line bg-panel px-3 py-2 text-sm text-ink"
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>
      {playError && <p role="status" className="px-4 py-3 text-sm text-muted">Playback could not start. Try Play again, <a href="/media/walkthrough.mp4" className="text-signal-ink underline">download the video</a>, or <a href="/media/walkthrough-transcript.txt" className="text-signal-ink underline">read the transcript</a>.</p>}
    </div>
  );
}
