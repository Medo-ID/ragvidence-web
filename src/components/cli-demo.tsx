"use client";

import { ArrowRight, Check, ChevronLeft, ChevronRight, FileSearch, Pause, Play, RotateCcw, Terminal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { CodeBlock } from "./code-block";
import { exampleResults } from "@/lib/example-results";

const steps = [
  {
    label: "Install",
    title: "One command. Your own machine.",
    command: 'uv tool install --python 3.12 "ragvidence==0.2.1"',
    description: "Install the CLI in an isolated tool environment.",
    detail: "BM25 and the synthetic example need no account or API key.",
    href: "/docs/installation",
    link: "Installation guide",
  },
  {
    label: "Check",
    title: "Check before you experiment.",
    command: "ragvi health\nragvi verify",
    description: "Run bundled deterministic checks without downloading a model.",
    detail: "PASS means a check succeeded. WARN identifies optional capabilities. Resolve required FAIL checks before continuing.",
    href: "/docs/troubleshooting",
    link: "Understand health checks",
  },
  {
    label: "Run",
    title: "Compare techniques on frozen data.",
    command: "ragvi compare-data ./docs --reviewed ./reviewed.json --techniques bm25,parent-child,compress --k 1 --chunk-size 100 --chunk-overlap 10",
    description: "Compare BM25, parent-child and sentence extraction on four reviewed synthetic dev questions at k=1.",
    detail: "Download the manual and reviewed sidecar from the own-data guide. The larger parent recovers a power condition; all outcomes remain visible.",
    href: "/docs/bring-your-own-data#example",
    link: "Get the example files",
  },
  {
    label: "Inspect",
    title: "Open the evidence behind the score.",
    command: "ragvi-reports/COMPARISON/exports/EXPORT/report.html",
    description: "Open the generated HTML report in your browser. Review changed questions, required evidence, ranked hits, and diagnosis.",
    detail: "A self-contained report you can inspect locally and share. Review source content before sharing it.",
    href: "/sample-report.html",
    link: "Open the real sample report",
  },
] as const;

function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function serverMotionPreference() {
  return false;
}

export function CliDemo() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeToMotion, prefersReducedMotion, serverMotionPreference);
  const isPlaying = playing && !reducedMotion;
  const step = steps[active];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setTimeout(() => {
      if (active < steps.length - 1) setActive(active + 1);
      else setPlaying(false);
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [active, isPlaying]);

  function selectStep(index: number) {
    setPlaying(false);
    setActive(index);
  }

  function togglePlayback() {
    if (!isPlaying && active === steps.length - 1) setActive(0);
    setPlaying(!isPlaying);
  }

  return (
    <div id="demo" className="surface showcase scroll-mt-24 border border-line text-left">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-3 text-sm font-medium text-ink"><Terminal size={17} className="text-signal-ink" aria-hidden="true" />From command to evidence</div>
        <span className="font-mono text-xs text-muted">Synthetic own-data preview</span>
      </div>

      <div className="no-print grid grid-cols-4 border-b border-line" aria-label="Tutorial steps">
        {steps.map((item, index) => (
          <button key={item.label} type="button" aria-pressed={active === index} aria-controls="cli-demo-stage" onClick={() => selectStep(index)} className={`min-h-14 border-r border-line px-2 py-3 text-sm transition-colors last:border-r-0 sm:px-4 ${active === index ? "surface-selected text-ink" : "text-muted hover:bg-panel-raised hover:text-ink"}`}>
            <span className="mr-2 font-mono text-xs opacity-65" aria-hidden="true">0{index + 1}</span>{item.label}
          </button>
        ))}
      </div>

      <div id="cli-demo-stage" role="region" aria-labelledby="cli-demo-title" className="grid px-5 py-5 sm:px-6 sm:py-6">
        {steps.map((step, index) => (
          <div key={step.label} aria-hidden={active !== index} inert={active !== index} className={`demo-panel col-start-1 row-start-1 min-w-0 ${active === index ? "demo-stage visible" : "invisible pointer-events-none"}`}>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 font-mono text-xs text-signal-ink">STEP 0{index + 1} / 04</p>
                <h2 id={active === index ? "cli-demo-title" : `cli-demo-title-${index}`} className="text-lg font-semibold tracking-tight text-ink sm:text-xl">{step.title}</h2>
              </div>
              <FileSearch size={22} className="mt-1 shrink-0 text-muted" aria-hidden="true" />
            </div>

            <CodeBlock label={index === 3 ? "Output" : "Terminal"} content={step.command} prompt={index < 3} wrap />

            <p className="mt-5 text-base leading-7 text-muted">{step.description}</p>

            <div className="mt-5 min-h-32">
              {index < 2 ? (
                <div className="space-y-2 border-l-2 border-signal/40 bg-canvas/50 p-4 text-sm text-muted">
                  {(index === 0 ? ["All shipped techniques included", "Isolated installation with uv", "Local workspaces and portable reports"] : ["Required runtime and dependencies", "Workspace permissions and bundled data", "Optional semantic support and privacy defaults"]).map((item) => (
                    <p key={item} className="flex items-center gap-3"><Check size={15} className="shrink-0 text-signal-ink" aria-hidden="true" />{item}</p>
                  ))}
                </div>
              ) : (
                <div className="border border-line bg-canvas/75 p-4 text-ink">
                  <p className="mb-4 text-xs font-medium text-muted">Synthetic manual · 4 reviewed dev questions · k=1 · v0.2.1</p>
                  <div className="space-y-2">{exampleResults.map(row => <p key={row.name} className="flex flex-wrap justify-between gap-2 text-sm"><span>{row.name}</span><span>{row.sufficient} / {row.total} sufficient</span></p>)}</div>
                  <p className="mt-4 border-t border-line pt-3 text-xs leading-5 text-muted">The parent returns more context. Small teaching data does not establish a general winner.</p>
                </div>
              )}
            </div>

            <p className="mt-3 text-xs leading-5 text-muted">{step.detail}</p>
          </div>
        ))}
      </div>

      <div className="no-print grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4 sm:px-6 sm:py-5">
        <Link href={step.href} className="col-span-2 inline-flex min-h-11 items-center gap-2 text-xs font-medium text-signal-ink hover:text-ink">{step.link}<ArrowRight size={13} aria-hidden="true" /></Link>
        <button type="button" onClick={togglePlayback} disabled={reducedMotion} aria-label={reducedMotion ? "Explore at your pace" : isPlaying ? "Pause walkthrough" : active === steps.length - 1 ? "Replay walkthrough" : "Play walkthrough"} title={reducedMotion ? "Automatic playback is disabled with reduced motion." : undefined} className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap text-xs text-ink hover:text-signal-ink disabled:cursor-default disabled:text-muted">
          {isPlaying ? <Pause size={15} aria-hidden="true" /> : active === steps.length - 1 ? <RotateCcw size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
          {reducedMotion ? "Manual steps" : isPlaying ? "Pause" : active === steps.length - 1 ? "Replay" : "Play"}
        </button>
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Previous tutorial step" disabled={active === 0} onClick={() => selectStep(active - 1)} className="grid size-11 place-items-center border border-line text-muted hover:border-signal/40 hover:text-ink disabled:cursor-default disabled:opacity-30"><ChevronLeft size={17} aria-hidden="true" /></button>
          <button type="button" aria-label="Next tutorial step" disabled={active === steps.length - 1} onClick={() => selectStep(active + 1)} className="grid size-11 place-items-center border border-line text-muted hover:border-signal/40 hover:text-ink disabled:cursor-default disabled:opacity-30"><ChevronRight size={17} aria-hidden="true" /></button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">Step {active + 1} of 4: {step.label}. {step.title}</p>
      <noscript><p className="border-t border-line p-5 text-sm text-muted">Follow the <Link href="/docs/first-tutorial" className="text-signal-ink underline">first tutorial</Link> for every step and the complete report.</p></noscript>
    </div>
  );
}
