import { TrustPage } from "@/components/trust-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Security", description: "Security boundaries and responsible vulnerability reporting for RAGvidence.", path: "/security" });

export default function SecurityPage() {
  return (
    <TrustPage eyebrow="Trust" title="Security and responsible reporting" intro="RAGvidence minimizes hosted surface area: there are no user accounts, uploaded corpora, hosted API keys, or runtime databases on this website.">
      <h2>Website controls</h2>
      <ul><li>HTTPS is enforced by the deployment platform.</li><li>Security headers restrict framing, content sniffing, referrer leakage, and unnecessary browser capabilities.</li><li>The site has no forms that accept project data and no client-side analytics.</li><li>Dependencies are locked and checked before production deployment.</li></ul>
      <h2>CLI boundaries</h2>
      <ul><li>BM25 operates without network requests.</li><li>Provider keys are read from local environment configuration and excluded from reports.</li><li>HTML reports escape dataset content and contain no scripts or remote assets.</li><li>Remote provider use is explicit and can transmit source text and questions.</li></ul>
      <h2>Report a vulnerability</h2>
      <p>Email <a href="mailto:midaghdour@gmail.com?subject=RAGvidence%20security%20report">midaghdour@gmail.com</a> with the affected version, impact, reproduction steps, and a safe proof of concept. Do not include active credentials or confidential third-party data.</p>
      <p>Please allow a reasonable period to investigate before public disclosure. This page does not authorize testing that degrades service, accesses another person’s data, violates law, or targets third-party infrastructure.</p>
      <h2>Supported release</h2>
      <p>Security fixes target the current published RAGvidence version. Upgrade before reporting a problem already resolved in a newer release.</p>
    </TrustPage>
  );
}
