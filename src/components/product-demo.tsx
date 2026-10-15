"use client";

import { useEffect, useRef, useState } from "react";

export function ProductDemo() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    element.muted = true; // React doesn't reliably emit the muted attribute in SSR HTML
    element.play().catch(() => {}); // if blocked, the poster stays and the button works
  }, []);

  function togglePlayback() {
    const element = video.current;
    if (!element) return;
    if (element.paused) element.play().catch(() => {});
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
          aria-label="Silent own-data workflow: label sources and questions, benchmark BM25 and semantic retrieval, evaluate, and inspect a report"
          onClick={togglePlayback}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src="/media/walkthrough.webm" type="video/webm" />
          <source src="/media/walkthrough.mp4" type="video/mp4" />
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