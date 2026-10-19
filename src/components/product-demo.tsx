"use client";

import { useEffect, useRef, useState } from "react";

export function ProductDemo() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [playError, setPlayError] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    element.muted = true; // React doesn't reliably emit the muted attribute in SSR HTML
    let active = true;
    element.play().catch(() => {
      if (!active) return;
      element.autoplay = false;
      element.pause();
      setPlayError(true);
    });
    return () => { active = false; };
  }, []);

  function togglePlayback() {
    const element = video.current;
    if (!element) return;
    if (element.paused) {
      // Explicit retries must not race a second native autoplay attempt.
      element.autoplay = false;
      if (!element.currentSrc) element.load();
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
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/walkthrough-poster.webp"
          width={1920}
          height={1080}
          className="block aspect-video w-full cursor-pointer focus-visible:-outline-offset-4"
          role="button"
          tabIndex={0}
          aria-label={playing ? "Pause workflow video" : "Play workflow video"}
          aria-pressed={playing}
          aria-describedby="workflow-video-help"
          onClick={event => {
            if (!event.currentTarget.controls || event.clientY < event.currentTarget.getBoundingClientRect().bottom - 64) {
              event.preventDefault();
              togglePlayback();
            }
          }}
          onKeyDown={event => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              if (!event.repeat) togglePlayback();
            }
          }}
          onPlay={() => { setPlaying(true); setPlayError(false); }}
          onPause={() => setPlaying(false)}
        >
          <source src="/media/walkthrough.mp4" type="video/mp4" />
          <source src="/media/walkthrough.webm" type="video/webm" />
          <track kind="captions" src="/media/walkthrough.vtt" srcLang="en" label="English descriptions" />
        </video>
        <p id="workflow-video-help" className="sr-only">Silent workflow: ask a question about local data, compare techniques, export HTML, JSON and Markdown, then inspect original evidence. Click or press Space or Enter to pause or play. Right-click for browser video options.</p>
      </div>
      {playError && <p role="status" className="px-4 py-3 text-sm text-muted">Playback could not start. Click the video or press Space to retry, <a href="/media/walkthrough.mp4" className="text-signal-ink underline">download the video</a>, or <a href="/media/walkthrough-transcript.txt" className="text-signal-ink underline">read the transcript</a>.</p>}
    </div>
  );
}
