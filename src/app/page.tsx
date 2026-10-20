import { ArrowRight, FileSearch, LockKeyhole, ShieldCheck, Database, Globe2 } from "lucide-react";
import Link from "next/link";
import { CliDemo } from "@/components/cli-demo";
import { ProductSections } from "@/components/product-sections";
import { CodeBlock } from "@/components/code-block";
import { serializeJsonLd, softwareIdentity } from "@/lib/seo";

const installCommand = 'uv tool install --python 3.12 "ragvidence==0.2.1"';

export default function Home() {
  return (
    <div className="home-sections">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(softwareIdentity) }} />
      <section id="install" className="hero-section">
        <div className="frame hero-frame">
          <Link href="/releases" className="release-link"><span className="release-version">v0.2.1</span><span>New HTML reports. Same inspectable evidence.</span><ArrowRight size={14} aria-hidden="true" /></Link>
          <p className="eyebrow mt-8">Local files. Controlled experiments. Original evidence.</p>
          <h1>See whether your RAG change <span>helped.</span></h1>
          <p className="hero-description">Compare retrieval techniques on your own data. Inspect what changed before bringing it into your RAG project.</p>
          <div id="hero-install-command"><CodeBlock label="Install CLI · Python 3.12" content={installCommand} wrap /></div>
          <div className="hero-actions">
            <Link href="/docs/installation" className="button-primary inline-flex min-h-11 items-center gap-2 px-5 text-sm font-medium">Install CLI<ArrowRight size={16} aria-hidden="true" /></Link>
            <a href="/sample-report.html" className="button-secondary"><FileSearch size={16} aria-hidden="true" />View sample report</a>
          </div>
          <p className="hero-footnote">Runs locally · BM25 needs no model or API key</p>
        </div>
        <div className="frame assurance-grid">{[
          [LockKeyhole, "No account"], [ShieldCheck, "CLI: no telemetry"], [Database, "No hosted database"], [Globe2, "Your model, or none"],
        ].map(([Icon, text]) => { const ItemIcon = Icon as typeof LockKeyhole; return <div key={String(text)}><ItemIcon size={16} aria-hidden="true" /><span>{String(text)}</span></div>; })}</div>
      </section>
      <section className="experiment-section">
        <div className="frame section-index"><span>01 / THE WORKFLOW</span><span>FROM COMMAND TO EVIDENCE</span></div>
        <div className="frame experiment-grid">
          <div className="grid-cell experiment-copy"><p className="eyebrow">Work on your own data</p><h2>Start with a question.<br />Follow the evidence.</h2><p>Compare alternatives locally. Inspect original sources, returned context and resource trade-offs.</p><Link href="/docs/bring-your-own-data" className="text-link">Bring your own data<ArrowRight size={16} aria-hidden="true" /></Link><div className="experiment-note"><span className="font-mono text-xs text-signal-ink">SYNTHETIC PREVIEW</span><p>Four reviewed dev questions. Three retrieval techniques. All outcomes remain visible.</p></div></div>
          <div className="grid-cell experiment-demo"><CliDemo /></div>
        </div>
      </section>
      <ProductSections />
    </div>
  );
}
