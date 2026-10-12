import type { Metadata } from "next";
import { TrustPage } from "@/components/trust-page";

export const metadata: Metadata = { title: "Terms", description: "Terms for using the RAGvidence website and software materials.", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <TrustPage eyebrow="Legal" title="Terms of use" intro="These terms cover this website. Installation and use of the RAGvidence software are also governed by the license distributed with that software release.">
      <h2>Acceptance and eligibility</h2>
      <p>By using this website, you agree to these terms. If you use it for an organization, you represent that you have authority to accept them for that organization. If you do not agree, do not use the website.</p>
      <h2>Software license</h2>
      <p>RAGvidence is proprietary software, not an open-source package. The Free and Plus rights, restrictions, redistribution rules, and edition boundaries are stated in the LICENSE.md file shipped with the software. A package download does not transfer ownership or grant rights beyond that license.</p>
      <p><a href="/ragvidence-0.1.0-license.txt">Read the license shipped with RAGvidence v0.1.0.</a></p>
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
      <p>These terms may change as checkout, licensing, or hosted features are introduced. The updated date will change, and material product changes will be described before they apply.</p>
      <h2>Contact</h2>
      <p>Questions about these terms can be sent to <a href="mailto:midaghdour@gmail.com?subject=RAGvidence%20terms">midaghdour@gmail.com</a>.</p>
    </TrustPage>
  );
}
