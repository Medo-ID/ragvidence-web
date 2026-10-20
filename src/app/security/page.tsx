import { TrustPage } from "@/components/trust-page";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Security", description: "Security boundaries and responsible vulnerability reporting for RAGvidence.", path: "/security" });

export default function SecurityPage() {
  return (
    <TrustPage eyebrow="Trust" title="Security and responsible reporting" intro="RAGvidence minimizes hosted surface area: there are no user accounts, uploaded corpora, hosted API keys, or runtime databases on this website.">
      <h2>Website controls</h2>
      <ul><li>Production hosting must serve HTTPS; check the deployed domain before sharing it.</li><li>Security headers restrict framing, content sniffing, referrer leakage, and unnecessary browser capabilities.</li><li>The site has no forms that accept project data. Vercel Web Analytics measures aggregate page visits; see the <Link href="/privacy">privacy page</Link> for its data boundaries.</li><li>Production and development dependencies are locked and audited by the verification gate.</li></ul>
      <h2>CLI boundaries</h2>
      <ul><li>BM25 operates without network requests.</li><li>Provider keys are read from local environment configuration and excluded from reports.</li><li>HTML reports escape dataset content and include only a static theme-switching script and no remote assets.</li><li>Remote provider use is explicit and can transmit source text and questions.</li></ul>
      <h2>Report a vulnerability</h2>
      <p>For CLI vulnerabilities, use <a href="https://github.com/Medo-ID/ragvidence/security/advisories/new">private vulnerability reporting</a>, or email <a href="mailto:midaghdour@gmail.com?subject=RAGvidence%20security%20report">midaghdour@gmail.com</a> with the affected version, impact, reproduction steps, and a safe proof of concept. Do not include active credentials or confidential third-party data.</p>
      <p>Please allow a reasonable period to investigate before public disclosure. This page does not authorize testing that degrades service, accesses another person’s data, violates law, or targets third-party infrastructure.</p>
      <h2>Supported release</h2>
      <p>The current supported CLI release is 0.2.1. Upgrade before reporting a problem already resolved in a newer release.</p>
    </TrustPage>
  );
}
