import { ArrowRight, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { CliDemo } from "./cli-demo";
import { SectionHeading } from "./section-heading";

type WalkthroughVideo = {
  src: string;
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
          <span className="inline-flex items-center gap-3 text-sm text-ink"><MonitorPlay size={18} className="text-signal" aria-hidden="true" />RAGvidence / first experiment</span>
          <span className="font-mono text-xs text-muted">{video ? "Step-by-step walkthrough" : "Recording coming soon"}</span>
        </div>

        {video ? (
          <video className="aspect-video w-full bg-canvas" width={1920} height={1080} controls playsInline preload="none" poster={video.poster} aria-label="RAGvidence installation and first experiment walkthrough" aria-describedby="walkthrough-caption">
            <source src={video.src} type="video/mp4" />
            <track src={video.captions} kind="captions" srcLang="en" label="English" default />
            <p>Your browser cannot play this video. <a href={video.src}>Download the walkthrough</a> or follow the <Link href="/docs/first-tutorial">written tutorial</Link>.</p>
          </video>
        ) : (
          <div className="grid items-center gap-10 p-5 sm:p-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-12 lg:p-10">
            <div>
              <p className="eyebrow">Your terminal. Your evidence.</p>
              <h3 className="mt-5 text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl">One workflow, from command to clarity.</h3>
              <p className="mt-5 text-sm leading-7 text-muted">The recorded walkthrough is on its way. In the meantime, explore each step in this interactive preview.</p>
              <ol className="mt-8 space-y-5 border-t border-line pt-7">
                {["Install the Free CLI", "Check your environment", "Run a controlled comparison", "Open the evidence report"].map((step, index) => (
                  <li key={step} className="flex gap-4 text-sm leading-6 text-muted"><span className="font-mono text-xs leading-6 text-signal">0{index + 1}</span>{step}</li>
                ))}
              </ol>
              <Link href="/docs/first-tutorial" className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm text-signal hover:text-ink">Follow along in the docs<ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
            <div className="min-w-0"><CliDemo /></div>
          </div>
        )}

        <figcaption id="walkthrough-caption" className="border-t border-line px-5 py-4 text-xs leading-6 text-muted sm:px-7">
          Bundled tutorial · v0.1.0 · 10 questions · BM25 · k=2 · body vs. heading-context. <a href="/sample-report.html" className="text-signal underline underline-offset-4 hover:text-ink">Inspect the sample report</a>.
        </figcaption>
      </figure>
    </section>
  );
}
