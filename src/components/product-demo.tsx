"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function motionSnapshot() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
function serverSnapshot() { return false; }

export function ProductDemo() {
  const reducedMotion = useSyncExternalStore(subscribeToMotion, motionSnapshot, serverSnapshot);
  const video = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const [requestedMedia, setRequestedMedia] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showPlayHint, setShowPlayHint] = useState(false);
  const [failed, setFailed] = useState(false);
  const loadMedia = !reducedMotion || requestedMedia;
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let cancelled = false;
    function syncPlayback() {
      if (!element) return;
      element.muted = true;
      element.autoplay = loadMedia && !manuallyPaused.current;
      if (element.autoplay) {
        void element.play().then(() => {
          if (!cancelled) setPlaying(!element.paused);
        }).catch(() => {
          if (!cancelled) setShowPlayHint(true);
        });
      } else element.pause();
    }
    // Native source media queries handle the initial preference before hydration.
    // Reload source selection only when a previously ineligible source is enabled.
    if (!loadMedia || element.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) element.load();
    element.addEventListener("canplay", syncPlayback);
    syncPlayback();
    return () => { cancelled = true; element.removeEventListener("canplay", syncPlayback); element.pause(); };
  }, [loadMedia, requestedMedia]);

  function togglePlayback() {
    const element = video.current;
    if (!element) return;
    if (!element.paused) {
      manuallyPaused.current = true;
      element.autoplay = false;
      setShowPlayHint(true);
      element.pause();
    } else {
      manuallyPaused.current = false;
      element.autoplay = true;
      element.muted = true;
      if (!loadMedia) setRequestedMedia(true);
      else void element.play().catch(() => setShowPlayHint(true));
    }
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
          controls={false}
          poster="/media/walkthrough-poster.webp"
          width={1920}
          height={1080}
          className="block aspect-video w-full" aria-label="Silent own-data workflow: label sources and questions, benchmark BM25 and semantic retrieval, evaluate, and inspect a report"
          onPlaying={() => {
              setPlaying(true);
              setShowPlayHint(false); setFailed(false);
            }
          }
          onPause={() => setPlaying(false)}
          onError={() => { if (loadMedia) setFailed(true); }}
        >
          <source src="/media/walkthrough.webm" type="video/webm" media={requestedMedia ? undefined : "(prefers-reduced-motion: no-preference)"} />
          <source src="/media/walkthrough.mp4" type="video/mp4" media={requestedMedia ? undefined : "(prefers-reduced-motion: no-preference)"} />
        </video>
        <button type="button" onClick={togglePlayback} aria-label={playing ? "Pause workflow video" : "Play workflow video"} className="absolute inset-0 cursor-pointer rounded-none focus-visible:-outline-offset-4">
          {!playing && (showPlayHint || reducedMotion || failed) && <span aria-hidden="true" className="absolute bottom-4 left-4 rounded-sm border border-line bg-panel px-3 py-2 text-sm text-ink">{reducedMotion && !requestedMedia ? "Reduced motion · Click to play" : "Click to play"}</span>}
        </button>
      </div>
      {failed && <p role="status" className="p-4 text-sm text-muted">The walkthrough could not play. Follow the own-data guide below or <a href="/media/walkthrough.mp4" className="text-signal-ink underline">download the MP4</a>.</p>}
    </div>
  );
}
