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
  const intent = useRef<"auto" | "play" | "pause">("auto");
  const inView = useRef(false);
  const [requestedMedia, setRequestedMedia] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showPlayHint, setShowPlayHint] = useState(false);
  const [failed, setFailed] = useState(false);
  const loadMedia = !reducedMotion || requestedMedia;
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    // React may insert sources after hydration. Explicitly restart media selection;
    // visibility can arrive before the first playable frame, so retry on canplay.
    element.muted = true;
    element.load();
    function syncPlayback() {
      if (!element) return;
      const wantsPlayback = intent.current === "play" || (!reducedMotion && intent.current === "auto");
      const shouldPlay = loadMedia && wantsPlayback && inView.current && document.visibilityState === "visible";
      element.autoplay = shouldPlay;
      if (shouldPlay) {
        // play() requests frames when metadata preload has stopped at
        // HAVE_METADATA. Waiting for canplay first would deadlock loading.
        void element.play().catch(() => {
          if (inView.current && element.paused) setShowPlayHint(true);
        });
      } else element.pause();
    }
    element.addEventListener("canplay", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      // A wide video can be taller than a short viewport. Measure useful visible
      // height instead of demanding an impossible fraction of its total area.
      inView.current = entry.isIntersecting && entry.intersectionRect.height >= Math.min(entry.boundingClientRect.height * 0.4, window.innerHeight * 0.4);
      syncPlayback();
    }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1] });
    function measureFallback() {
      if (!element) return;
      const box = element.getBoundingClientRect();
      const visibleHeight = Math.min(box.bottom, window.innerHeight) - Math.max(box.top, 0);
      inView.current = visibleHeight >= Math.min(box.height * 0.4, window.innerHeight * 0.4);
      syncPlayback();
    }
    if (observer) observer.observe(element);
    else {
      measureFallback();
      window.addEventListener("scroll", measureFallback, { passive: true });
      window.addEventListener("resize", measureFallback);
    }
    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", measureFallback);
      window.removeEventListener("resize", measureFallback);
      element.removeEventListener("canplay", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      element.pause();
    };
  }, [reducedMotion, loadMedia]);

  function togglePlayback() {
    const element = video.current;
    if (!element) return;
    if (!element.paused) {
      intent.current = "pause";
      element.autoplay = false;
      setShowPlayHint(true);
      element.pause();
    } else {
      intent.current = "play";
      element.autoplay = true;
      if (!loadMedia) setRequestedMedia(true);
      element.muted = true;
      if (loadMedia) void element.play().catch(() => setShowPlayHint(true));
    }
  }

  return (
    <div className="surface showcase">
      <div className="relative">
        <video ref={video} muted loop playsInline preload="metadata" controls={false} poster="/media/walkthrough-poster.webp" width={1920} height={1080} className="block aspect-video w-full" aria-label="Silent own-data workflow: label sources and questions, benchmark BM25 and semantic retrieval, evaluate, and inspect a report" onPlaying={() => { setPlaying(true); setShowPlayHint(false); setFailed(false); }} onPause={() => setPlaying(false)} onError={() => { if (loadMedia) setFailed(true); }}>
          {loadMedia && <><source src="/media/walkthrough.webm" type="video/webm" /><source src="/media/walkthrough.mp4" type="video/mp4" /></>}
        </video>
        <button type="button" onClick={togglePlayback} aria-label={playing ? "Pause workflow video" : "Play workflow video"} className="absolute inset-0 cursor-pointer rounded-none focus-visible:-outline-offset-4">
          {!playing && (showPlayHint || reducedMotion || failed) && <span aria-hidden="true" className="absolute bottom-4 left-4 rounded-sm border border-line bg-panel px-3 py-2 text-sm text-ink">Click to play</span>}
        </button>
      </div>
      {failed && <p role="status" className="p-4 text-sm text-muted">The walkthrough could not play. Follow the own-data guide below or <a href="/media/walkthrough.mp4" className="text-signal-ink underline">download the MP4</a>.</p>}
    </div>
  );
}
