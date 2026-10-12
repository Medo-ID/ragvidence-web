import { ArrowRight, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "./section-heading";

type WalkthroughVideo = {
  src: string;
  type?: "video/mp4" | "video/webm";
  poster?: string;
  captions: string;
};

export function ProductWalkthrough({ video }: { video?: WalkthroughVideo }) {
  return (
    <section id="walkthrough" className="product-section shell">
      <SectionHeading eyebrow="A window into your workflow" title="See your first experiment unfold." centered>
        From a fresh terminal to the evidence behind a result. Install the tool, run the tutorial, and inspect what changed—all on your own machine.
      </SectionHeading>

      <figure className="glass-panel mx-auto mt-14 max-w-5xl border border-line sm:mt-16">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
          <span className="inline-flex items-center gap-3 text-sm text-ink"><MonitorPlay size={18} className="text-signal-ink" aria-hidden="true" />RAGvidence / first experiment</span>
          <span className="font-mono text-xs text-muted">{video ? "Step-by-step walkthrough" : "Your first run"}</span>
        </div>

        {video ? (
          <video className="aspect-video w-full bg-canvas" width={1920} height={1080} controls playsInline preload="none" poster={video.poster} aria-label="RAGvidence installation and first experiment walkthrough" aria-describedby="walkthrough-caption">
            <source src={video.src} type={video.type ?? "video/mp4"} />
            <track src={video.captions} kind="captions" srcLang="en" label="English" default />
            <p>Your browser cannot play this video. <a href={video.src}>Download the walkthrough</a> or follow the <Link href="/docs/first-tutorial">written tutorial</Link>.</p>
          </video>
        ) : (
          <div className="grid grid-cols-1 items-start gap-10 p-5 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:p-10">
            <div>
              <p className="eyebrow">Your terminal. Your evidence.</p>
              <h3 className="mt-5 text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl">One workflow, from command to clarity.</h3>
              <p className="mt-5 text-sm leading-7 text-muted">Start with the bundled example. It keeps the questions and retrieval depth fixed so you can inspect what a single change to the searchable text recovered.</p>
              <Link href="/docs/first-tutorial" className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm text-signal-ink hover:text-ink">Follow along in the docs<ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
            <ol className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                ["Install", "Install the Free CLI with uv. The installation guide covers uv and Python setup.", "uv tool install --python 3.12 \"ragvidence[semantic]\""],
                ["Check", "Resolve required failures before running an experiment.", "ragvi health"],
                ["Run", "Compare body text with heading context on ten answerable questions.", "ragvi tutorial"],
                ["Inspect", "Open the generated report. Review changed questions and the ranked evidence.", "workspaces/first-run/reports/tutorial.html"],
              ].map(([title, text, command], index) => (
                <li key={title} className="surface min-w-0 p-5">
                  <p className="font-mono text-xs text-muted">0{index + 1}</p>
                  <h3 className="mt-3 text-base font-semibold text-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
                  <div className="mt-4 overflow-x-auto"><code className="whitespace-nowrap font-mono text-xs leading-6 text-signal-ink">{command}</code></div>
                </li>
              ))}
            </ol>
          </div>
        )}

        <figcaption id="walkthrough-caption" className="border-t border-line px-5 py-4 text-xs leading-6 text-muted sm:px-7">
          Bundled tutorial · v0.1.0 · 10 answerable questions · BM25 · k=2 · body vs. heading-context. <a href="/sample-report.html" className="text-signal-ink underline underline-offset-4 hover:text-ink">Inspect the sample report</a>. {video && <><Link href="/docs/first-tutorial" className="text-signal-ink underline underline-offset-4 hover:text-ink">Follow the written tutorial</Link> or <a href={video.src} className="text-signal-ink underline underline-offset-4 hover:text-ink">download the recording</a>.</>}
        </figcaption>
      </figure>
    </section>
  );
}
