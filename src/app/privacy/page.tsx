import type { Metadata } from "next";
import { TrustPage } from "@/components/trust-page";

export const metadata: Metadata = { title: "Privacy", description: "How the RAGvidence website and CLI handle data.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <TrustPage eyebrow="Trust" title="Privacy, without vague boundaries." intro="The website is intentionally simple, and the CLI is local by default. This page distinguishes the two and explains when a third-party provider may receive data.">
      <h2>Website data</h2>
      <p>This website does not include account creation, advertising trackers, analytics scripts, or payment forms. The hosting provider may process ordinary request data such as IP address, user agent, requested URL, and timestamps for security and delivery operations under its own terms.</p>
      <h2>Support email</h2>
      <p>If you email <a href="mailto:midaghdour@gmail.com">midaghdour@gmail.com</a>, the message and any attachments are processed by the sender’s and recipient’s email providers. Send only the information needed to investigate the problem. Remove API keys, credentials, and confidential source content.</p>
      <h2>CLI data</h2>
      <p>BM25 evaluation runs locally and does not require an account, telemetry, a hosted database, or an API key. Workspaces and generated reports stay on the device or storage location chosen by the user.</p>
      <p>FastEmbed downloads a model on first use and then performs inference locally. Ollama sends data to the configured Ollama endpoint. An OpenAI-compatible provider receives the source text and questions submitted to that endpoint. Users are responsible for reviewing a provider’s retention, training, security, and regional processing policies.</p>
      <h2>Reports</h2>
      <p>Self-contained HTML reports contain no remote scripts or assets, but they can include question text, source identifiers, metadata, reference answers, and source previews. Treat reports as copies of project data and review them before sharing.</p>
      <h2>Future payments</h2>
      <p>RAGvidence does not currently take payment on this website. Before paid checkout launches, this notice will be updated to identify the payment processor, the data it receives, and the records retained for licensing, fraud prevention, tax, and support.</p>
      <h2>Questions</h2>
      <p>For a privacy question or deletion request concerning a support conversation, email <a href="mailto:midaghdour@gmail.com?subject=RAGvidence%20privacy">midaghdour@gmail.com</a>.</p>
    </TrustPage>
  );
}
