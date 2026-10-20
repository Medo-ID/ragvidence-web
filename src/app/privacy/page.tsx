import { TrustPage } from "@/components/trust-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Privacy", description: "How the RAGvidence website and CLI handle data.", path: "/privacy" });

export default function PrivacyPage() {
  return (
    <TrustPage eyebrow="Trust" title="Privacy, without vague boundaries." intro="The website is intentionally simple, and the CLI is local by default. This page distinguishes the two and explains when a third-party provider may receive data.">
      <h2>Website data</h2>
      <p>This website has no accounts, advertising trackers, or payment forms. It includes Vercel Web Analytics to measure aggregate page visits when enabled on the hosting project. Vercel processes page URLs, referrers, approximate location, browser, and device information. It uses a request-derived hash rather than third-party cookies to distinguish visitors; the visitor session is discarded after 24 hours. See <a href="https://vercel.com/docs/analytics/privacy-policy">Vercel’s Web Analytics privacy documentation</a>.</p>
      <p>The hosting provider may also process ordinary request data such as IP address, user agent, requested URL, and timestamps for security and delivery operations under its own terms.</p>
      <p>Your color-theme choice is saved in this browser’s local storage and used across website pages. It is not sent to us. If storage is blocked, theme switching still works for the current visit. Downloaded reports keep their theme choice only while the report is open.</p>
      <h2>Support email</h2>
      <p>If you email <a href="mailto:midaghdour@gmail.com">midaghdour@gmail.com</a>, the message and any attachments are processed by the sender’s and recipient’s email providers. Send only the information needed to investigate the problem. Remove API keys, credentials, and confidential source content.</p>
      <h2>CLI data</h2>
      <p>BM25 evaluation runs locally and does not require an account, telemetry, a hosted database, or an API key. Workspaces and generated reports stay on the device or storage location chosen by the user.</p>
      <p>FastEmbed downloads a model on first use and then performs inference locally. Ollama sends data to the configured Ollama endpoint. An OpenAI-compatible provider receives the source text and questions needed for the selected operation. Rewriting receives the original question and instructions; model compression receives questions and candidate bodies. Reviewed evidence IDs and reference answers are excluded from retrieval/transformation prompts. Users are responsible for reviewing a provider’s retention, training, security, and regional processing policies.</p>
      <h2>Reports</h2>
      <p>Self-contained HTML reports include only a bundled theme-switching script and no remote scripts or assets, but they can include question text, source identifiers, metadata, reference answers, and full source passages, prompts and model output. Internal snapshots and references can include the full corpus. Treat reports as copies of project data and review them before sharing.</p>
      <h2>Questions</h2>
      <p>For a privacy question or deletion request concerning a support conversation, email <a href="mailto:midaghdour@gmail.com?subject=RAGvidence%20privacy">midaghdour@gmail.com</a>.</p>
    </TrustPage>
  );
}
