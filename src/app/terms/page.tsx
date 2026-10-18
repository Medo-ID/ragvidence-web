import { TrustPage } from "@/components/trust-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Terms", description: "Terms for using the RAGvidence website and software materials.", path: "/terms" });

export default function TermsPage() {
  return (
    <TrustPage eyebrow="Legal" title="Terms of use" intro="These terms cover this website. Installation and use of the RAGvidence software are also governed by the license distributed with that software release.">
      <h2>Acceptance and eligibility</h2>
      <p>By using this website, you agree to these terms. If you use it for an organization, you represent that you have authority to accept them for that organization. If you do not agree, do not use the website.</p>
      <h2>Software license</h2>
      <p>The RAGvidence 0.2.0 CLI is fully free and open source under Apache-2.0, including all shipped techniques, comparisons and report formats. Its license and NOTICE govern software use and redistribution.</p>
      <p><a href="/ragvidence-0.2.0-license.txt">CLI Apache-2.0 license</a> · <a href="/ragvidence-0.2.0-notice.txt">CLI NOTICE</a>. Third-party code, fonts and downloaded models retain their own notices and licenses. A model adapter does not grant rights to model weights or services.</p>
      <h2>Website materials</h2>
      <p>Copyright © 2026 Medo-ID. The website repository has no open-source license; website rights remain reserved. The CLI license does not apply to the website’s original code and design. Embedded asset notices remain with their assets.</p>
      <h2>No professional advice or certification</h2>
      <p>RAGvidence reports retrieval evidence. They do not certify answer correctness, safety, legal compliance, financial compliance, regulatory compliance, or fitness for a high-stakes use. Documentation and examples are technical information, not legal, financial, accounting, or other professional advice.</p>
      <h2>Acceptable use</h2>
      <ul><li>Do not use the website to violate law or another person’s rights.</li><li>Do not attempt to disrupt, probe, or bypass site security.</li><li>Do not misrepresent tutorial data as independent customer results.</li><li>Do not remove notices or redistribute the software contrary to its license.</li></ul>
      <h2>Third-party services</h2>
      <p>Links, package registries, hosting, email, embedding providers, and model providers are operated by third parties. Their terms and privacy practices apply separately. RAGvidence does not control or guarantee their availability.</p>
      <h2>Availability and warranties</h2>
      <p>The website, software, documentation, and examples are provided on an “as available” basis. To the maximum extent permitted by applicable law, no warranty is made that they will be uninterrupted, error-free, suitable for a particular purpose, or sufficient for a production decision.</p>
      <h2>Limitation of liability</h2>
      <p>To the maximum extent permitted by applicable law, Medo-ID is not liable for indirect, incidental, special, consequential, or punitive loss arising from use of the website, software, reports, providers, or reliance on evaluation results.</p>
      <h2>Changes</h2>
      <p>These website terms may be updated. The updated date will change, and material product changes will be described before they apply.</p>
      <h2>Contact</h2>
      <p>Questions about these terms can be sent to <a href="mailto:midaghdour@gmail.com?subject=RAGvidence%20terms">midaghdour@gmail.com</a>.</p>
    </TrustPage>
  );
}
