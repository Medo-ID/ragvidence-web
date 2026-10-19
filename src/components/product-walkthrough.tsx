import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductDemo } from "./product-demo";
import { SectionHeading } from "./section-heading";

export function ProductWalkthrough() {
  return <section id="walkthrough">
    <div className="frame section-index"><span>03 / THE WALKTHROUGH</span><span>REAL COMMANDS. INSPECTABLE RESULTS.</span></div>
    <div className="frame section-intro walkthrough-intro"><SectionHeading eyebrow="Your questions. Your evidence." title="Follow an experiment all the way through.">Compare BM25, parent-child retrieval and sentence extraction on a fictional device manual, then inspect returned evidence in the actual report.</SectionHeading><Link href="/docs/bring-your-own-data" className="text-link">Run it on your data<ArrowRight size={16} aria-hidden="true" /></Link></div>
    <div className="frame walkthrough-stage"><ProductDemo /><p className="mt-5 text-xs leading-6 text-muted">22-second workflow · Synthetic manual · 4 reviewed dev questions · k=1 · CLI 0.2.1.<br />Execution waits shortened. Results are specific to this mock dataset. Use the playback controls to pause, seek or show descriptions.</p><a href="/media/walkthrough-transcript.txt" className="text-link mt-2">Read the transcript<ArrowRight size={14} aria-hidden="true" /></a></div>
  </section>;
}
