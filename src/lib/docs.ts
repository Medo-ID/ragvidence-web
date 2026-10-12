export type DocBlock =
  | { type: "p"; text: string }
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; id: string; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "links"; items: { label: string; href: string }[] }
  | { type: "code"; code: string; label?: string }
  | { type: "note"; title: string; text: string; tone?: "info" | "warning" | "success" }
  | { type: "table"; headers: string[]; rows: string[][] };

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  group: string;
  blocks: DocBlock[];
};

export type DocNavigation = Pick<DocPage, "slug" | "title" | "description" | "group">;

export const docs: DocPage[] = [
  {
    slug: "overview",
    title: "What RAGvidence does",
    description: "Understand the problem, the evaluation boundary, and the workflow before running an experiment.",
    group: "Start here",
    blocks: [
      { type: "p", text: "RAGvidence is a local, CLI-first toolkit for testing retrieval changes with reviewed evidence. It answers a narrow but important question: did the retriever return the source units required for a complete answer within the context depth you actually use?" },
      { type: "h2", id: "what-it-measures", text: "What it measures" },
      { type: "list", items: ["Whether all required evidence appeared in the first k hits.", "How much of the required evidence was recovered.", "Where the first relevant hit appeared.", "How many retrieved units were relevant.", "Which questions improved, regressed, stayed correct, or stayed broken."] },
      { type: "h2", id: "what-it-does-not-prove", text: "What it does not prove" },
      { type: "p", text: "Retrieval success is necessary for grounded generation, but it is not the same as answer correctness. RAGvidence does not prove that an LLM followed the evidence, reasoned correctly, avoided harmful content, or produced legally compliant advice." },
      { type: "note", title: "Evaluation boundary", text: "Treat RAGvidence as evidence about retrieval behavior—not a certification of the final answer or the whole AI system.", tone: "warning" },
      { type: "h2", id: "lifecycle", text: "The experiment lifecycle" },
      { type: "list", ordered: true, items: ["Create and validate a labeled workspace.", "Run a baseline retrieval configuration.", "Change one meaningful variable.", "Evaluate both runs at the same k.", "Compare improvements and regressions.", "Inspect changed rankings and export a report."] },
    ],
  },
  {
    slug: "installation",
    title: "Installation",
    description: "Install the CLI, choose optional semantic support, and confirm your environment is healthy.",
    group: "Start here",
    blocks: [
      { type: "p", text: "RAGvidence requires Python 3.12. The recommended installation uses uv, which installs the CLI in an isolated tool environment and exposes ragvi on your PATH." },
      { type: "h2", id: "prerequisites", text: "First, install uv" },
      { type: "p", text: "If uv is not installed, choose the setup for your operating system below. You do not need to install Python separately: uv can download Python 3.12 when the tool installation requests it." },
      { type: "code", label: "macOS / Linux", code: "curl -LsSf https://astral.sh/uv/install.sh | sh" },
      { type: "code", label: "Windows · PowerShell", code: "winget install --id=astral-sh.uv -e" },
      { type: "p", text: "Open a new terminal after setup, then confirm uv is available. If the command is still missing, follow the installer's PATH instructions." },
      { type: "code", label: "Terminal", code: "uv --version" },
      { type: "links", items: [{ label: "Official uv setup and alternative installation methods", href: "https://docs.astral.sh/uv/getting-started/installation/" }, { label: "How uv installs and manages Python", href: "https://docs.astral.sh/uv/guides/install-python/" }] },
      { type: "h2", id: "recommended", text: "Recommended: full Free edition" },
      { type: "code", label: "Terminal", code: "uv tool install --python 3.12 \"ragvidence[semantic]\"\nragvi --version\nragvi health" },
      { type: "p", text: "Version 0.1.0 supports Python 3.12; selecting it explicitly avoids using an incompatible Python 3.13 or newer interpreter. After installation, continue with ragvi tutorial." },
      { type: "p", text: "The semantic extra adds FastEmbed for local embeddings. The first semantic run downloads the selected embedding model; later inference is local." },
      { type: "h2", id: "minimal", text: "Minimal offline installation" },
      { type: "code", label: "Terminal", code: "uv tool install --python 3.12 ragvidence\nragvi health" },
      { type: "p", text: "The minimal install supports BM25, imported runs, all evaluation metrics, comparisons, diagnoses, and report formats. It does not install the local semantic model runtime." },
      { type: "h2", id: "upgrade", text: "Upgrade or add the semantic extra" },
      { type: "code", label: "Terminal", code: "uv tool upgrade ragvidence\n# To add local semantic support:\nuv tool install --reinstall --python 3.12 \"ragvidence[semantic]\"" },
      { type: "h2", id: "uninstall", text: "Uninstall the CLI" },
      { type: "code", label: "Terminal", code: "uv tool uninstall ragvidence" },
      { type: "p", text: "Uninstalling removes the tool environment and ragvi command. Your workspaces and exported reports remain in the directories where you created them." },
      { type: "h2", id: "health", text: "Read the health result" },
      { type: "table", headers: ["Status", "Meaning", "Action"], rows: [["PASS", "The required check succeeded.", "None."], ["WARN", "An optional capability is unavailable.", "Follow the displayed guide only if you need it."], ["FAIL", "A required dependency or workspace check failed.", "Use the troubleshooting page before continuing."]] },
      { type: "note", title: "Command not found?", text: "Open a new terminal after installation or run uv tool update-shell, then follow the PATH instructions it prints.", tone: "info" },
    ],
  },
  {
    slug: "first-tutorial",
    title: "First tutorial",
    description: "Generate a complete controlled comparison and learn what changed.",
    group: "Start here",
    blocks: [
      { type: "p", text: "The bundled tutorial is the fastest way to understand RAGvidence. It compares BM25 over raw body text with BM25 over heading-enriched text using the same ten answerable questions at k=2." },
      { type: "note", title: "Why the report lists 12 questions", text: "The dataset also includes two unanswerable questions. Their evidence-level metrics are N/A and they are excluded from the success-rate denominator. The reported 60% and 90% therefore mean 6/10 and 9/10 answerable questions.", tone: "info" },
      { type: "h2", id: "run", text: "Run it" },
      { type: "code", label: "Terminal", code: "ragvi tutorial" },
      { type: "p", text: "The command creates workspaces/first-run and writes a self-contained report to workspaces/first-run/reports/tutorial.html." },
      { type: "h2", id: "expected", text: "Expected result" },
      { type: "table", headers: ["Run", "Sufficient", "Rate"], rows: [["bm25-body", "6 / 10", "60%"], ["bm25-heading_context", "9 / 10", "90%"]] },
      { type: "p", text: "Three questions move from fail to pass, no question regresses, six remain pass to pass, and one remains fail to fail. This is deterministic bundled tutorial data, not a promise about another corpus." },
      { type: "h2", id: "inspect", text: "Inspect the right things" },
      { type: "list", ordered: true, items: ["Open the Change analysis section.", "Select a fail → pass question.", "Compare the ranked source units in baseline and intervention.", "Verify the required evidence ID is present in the improved run.", "Read the diagnosis, next experiment, and limitation together."] },
      { type: "note", title: "Do not optimize on the tutorial", text: "The tutorial teaches the mechanics. Product decisions must come from a frozen, reviewed slice of your own corpus.", tone: "warning" },
    ],
  },
  {
    slug: "first-report",
    title: "Read your first report",
    description: "Understand summaries, changed questions, ranked hits, diagnoses, and limitations.",
    group: "Start here",
    blocks: [
      { type: "h2", id: "summary", text: "Start with the summary" },
      { type: "p", text: "Confirm the configuration name, retrieval strategy, representation, and k before comparing the scores. A score without its configuration is not reproducible evidence." },
      { type: "h2", id: "changes", text: "Prioritize changed questions" },
      { type: "table", headers: ["Class", "Interpretation"], rows: [["fail → pass", "The intervention recovered every required evidence ID within k."], ["pass → fail", "A regression: evidence that was available in the baseline is now missing."], ["pass → pass", "Both runs supplied enough evidence; ranks may still differ."], ["fail → fail", "The intervention did not resolve the evidence gap."]] },
      { type: "h2", id: "hits", text: "Inspect ranked hits" },
      { type: "p", text: "For every changed question, read the source unit ID, score, evidence IDs, and preview. The score is retriever-specific; compare rank order and evidence presence before comparing raw values across strategies." },
      { type: "h2", id: "diagnosis", text: "Treat diagnosis as a hypothesis" },
      { type: "p", text: "The deterministic diagnosis identifies observable patterns and suggests a next experiment. It is intentionally paired with a limitation because a small comparison can show correlation without proving a universal cause." },
      { type: "note", title: "Before sharing", text: "Reports contain source previews and may reveal confidential text. Review the entire file before sending it to a teammate.", tone: "warning" },
    ],
  },
  {
    slug: "evidence-labels",
    title: "Questions and evidence labels",
    description: "Design answerable questions and map them to the complete evidence needed for an answer.",
    group: "Core concepts",
    blocks: [
      { type: "p", text: "An evidence ID represents an atomic fact, rule, condition, or passage that a complete answer must be able to use. A question may require one evidence ID or several IDs found in different source units." },
      { type: "h2", id: "multi-evidence", text: "Multi-evidence questions" },
      { type: "p", text: "Suppose a price appears in one source unit and a country-specific discount condition appears in another. Label the question with both evidence IDs. Sufficiency passes only when the union of evidence IDs in the first k hits contains both requirements." },
      { type: "code", label: "questions.jsonl", code: "{\"question_id\":\"Q-PRICE-01\",\"question\":\"What will a customer in Morocco pay?\",\"required_evidence_ids\":[\"E-BASE-PRICE\",\"E-MA-DISCOUNT\"],\"split\":\"dev\"}" },
      { type: "h2", id: "answerability", text: "Answerable and unanswerable questions" },
      { type: "p", text: "An empty required_evidence_ids list means retrieval success is undefined for that question. Metrics return N/A rather than pretending an unanswerable question passed or failed." },
      { type: "h2", id: "quality", text: "Labeling checklist" },
      { type: "list", items: ["Every evidence ID exists in at least one source unit.", "The set is sufficient, not merely relevant.", "Different reviewers would select approximately the same evidence.", "The question does not leak the expected source wording.", "The labels reflect the version of the corpus being tested."] },
      { type: "note", title: "Known hard case", text: "Labeling multi-evidence needs exposes the failure, but retrieval still needs a mechanism to discover implicit related constraints. Advanced cross-document investigation remains a roadmap area.", tone: "info" },
    ],
  },
  {
    slug: "retrieval-depth",
    title: "Retrieval depth k",
    description: "Choose k based on the context your application actually sends to generation.",
    group: "Core concepts",
    blocks: [
      { type: "p", text: "k is the number of ranked hits evaluated for each question. If production sends four source units to the model, evaluate at k=4. Testing at a larger value can hide a production failure by crediting evidence the model never receives." },
      { type: "h2", id: "tradeoff", text: "The tradeoff" },
      { type: "table", headers: ["Smaller k", "Larger k"], rows: [["Lower context cost", "More chances to recover distributed evidence"], ["Less retrieval noise", "More irrelevant context may reach generation"], ["Demands high early precision", "Can hide poor ranking quality"]] },
      { type: "h2", id: "rule", text: "Comparison rule" },
      { type: "p", text: "Never compare two runs at different k and attribute the difference to the retriever. Keep k fixed while evaluating a strategy or representation change." },
    ],
  },
  {
    slug: "controlled-experiments",
    title: "Controlled experiments",
    description: "Change one variable, freeze the evaluation slice, and protect held-out questions.",
    group: "Core concepts",
    blocks: [
      { type: "h2", id: "one-variable", text: "Change one meaningful variable" },
      { type: "p", text: "A useful comparison isolates a decision: body text versus heading-context, BM25 versus a specific semantic model, or production retriever v1 versus v2. If you also change labels, k, corpus content, and model, the cause becomes ambiguous." },
      { type: "h2", id: "splits", text: "Use dev and heldout splits" },
      { type: "list", items: ["Use dev questions to understand failures and design the intervention.", "Freeze the implementation before opening heldout results.", "If you tune against heldout, it is no longer held out; create a new final slice."] },
      { type: "h2", id: "manifest", text: "Preserve the manifest" },
      { type: "p", text: "Each run records the configuration, strategy, representation, k, timestamps, provider or model identifiers, and warnings needed to interpret the artifact. Do not edit a run after evaluation; produce a newly named run." },
    ],
  },
  {
    slug: "bm25-workflow",
    title: "BM25 workflow",
    description: "Run a strong lexical baseline and compare searchable representations.",
    group: "Workflows",
    blocks: [
      { type: "p", text: "BM25 is fast, deterministic, offline, and strong for exact identifiers, names, error codes, and domain terms. It is a valuable baseline even when production uses embeddings." },
      { type: "h2", id: "benchmark", text: "Run the benchmark" },
      { type: "code", label: "Terminal", code: "ragvi benchmark workspaces/customer-support --strategies bm25 --k 4" },
      { type: "p", text: "The benchmark creates body and heading-context runs so you can test whether structural context improves retrieval." },
      { type: "h2", id: "evaluate", text: "Evaluate both runs" },
      { type: "code", label: "Terminal", code: "ragvi evaluate workspaces/customer-support workspaces/customer-support/runs/bm25-body.json\nragvi evaluate workspaces/customer-support workspaces/customer-support/runs/bm25-heading_context.json" },
      { type: "h2", id: "when", text: "When BM25 is the right tool" },
      { type: "list", items: ["Queries include exact codes, product names, or statutory terms.", "The corpus is small enough for local evaluation.", "You need an interpretable zero-network baseline.", "You want to detect whether semantic retrieval is actually adding value."] },
    ],
  },
  {
    slug: "semantic-workflow",
    title: "Semantic workflow",
    description: "Evaluate local, Ollama, or OpenAI-compatible embeddings without surrendering provider choice.",
    group: "Workflows",
    blocks: [
      { type: "h2", id: "local", text: "Local FastEmbed" },
      { type: "code", label: "Terminal", code: "uv tool install --reinstall --python 3.12 \"ragvidence[semantic]\"\nragvi benchmark workspaces/customer-support --strategies semantic --k 4" },
      { type: "p", text: "The first run downloads the model. Embeddings are cached inside the workspace and reused only while the model and searchable text still match." },
      { type: "h2", id: "ollama", text: "Ollama embeddings" },
      { type: "code", label: ".env", code: "RAGVIDENCE_EMBEDDING_PROVIDER=ollama\nRAGVIDENCE_EMBEDDING_MODEL=your-embedding-model\nRAGVIDENCE_EMBEDDING_BASE_URL=http://localhost:11434" },
      { type: "h2", id: "remote", text: "OpenAI-compatible embeddings" },
      { type: "code", label: ".env", code: "RAGVIDENCE_EMBEDDING_PROVIDER=openai_compatible\nRAGVIDENCE_EMBEDDING_MODEL=your-model\nRAGVIDENCE_EMBEDDING_BASE_URL=https://provider.example/v1\nRAGVIDENCE_EMBEDDING_API_KEY=your-key" },
      { type: "note", title: "Provider boundary", text: "A remote embedding endpoint receives the source text and questions sent for embedding. Review that provider's retention, training, and regional processing policies first.", tone: "warning" },
      { type: "h2", id: "compare", text: "Compare without confounding" },
      { type: "p", text: "Keep the same corpus, labels, representation, and k when comparing BM25 with semantic retrieval. Record the exact provider and model name; semantic results are model-dependent." },
    ],
  },
  {
    slug: "import-retriever",
    title: "Import an existing retriever",
    description: "Evaluate LangChain, LlamaIndex, vector databases, or a production service without rebuilding them.",
    group: "Workflows",
    blocks: [
      { type: "p", text: "Export one JSON object per question. Every question_id and source_unit_id must match the reviewed RAGvidence workspace." },
      { type: "code", label: "exported-results.jsonl", code: "{\"question_id\":\"Q-001\",\"hits\":[{\"source_unit_id\":\"S-17\",\"rank\":1,\"score\":0.82}]}" },
      { type: "h2", id: "import", text: "Import and evaluate" },
      { type: "code", label: "Terminal", code: "ragvi import-run workspaces/customer-support exported-results.jsonl --name production-v1 --k 4\nragvi evaluate workspaces/customer-support workspaces/customer-support/runs/production-v1.json" },
      { type: "h2", id: "contracts", text: "Import contract" },
      { type: "list", items: ["Ranks are one-based and unique per question.", "The imported k matches the number of results production supplies.", "Source IDs map to the same version of the labeled corpus.", "Scores may be omitted, but fabricated scores should never be added.", "Missing questions are validation failures, not zero-score substitutions."] },
    ],
  },
  {
    slug: "bring-your-own-data",
    title: "Bring your own data",
    description: "Create a reviewed workspace from a small, representative corpus slice.",
    group: "Workflows",
    blocks: [
      { type: "h2", id: "create", text: "Create the workspace" },
      { type: "code", label: "Terminal", code: "ragvi init customer-support" },
      { type: "p", text: "Edit workspaces/customer-support/sources.jsonl and questions.jsonl. Start with 10–50 source units and 10–30 carefully reviewed questions. A smaller trustworthy set is more useful than a large weakly labeled set." },
      { type: "h2", id: "source-schema", text: "Source unit schema" },
      { type: "code", label: "sources.jsonl", code: "{\"source_unit_id\":\"S-001\",\"heading\":\"Returns > Timing\",\"body\":\"Return requests must be filed within 30 days.\",\"evidence_ids\":[\"E-RETURN-WINDOW\"],\"metadata\":{\"document\":\"policy-v3\"}}" },
      { type: "h2", id: "question-schema", text: "Question schema" },
      { type: "code", label: "questions.jsonl", code: "{\"question_id\":\"Q-001\",\"question\":\"How long do I have to request a return?\",\"required_evidence_ids\":[\"E-RETURN-WINDOW\"],\"split\":\"dev\",\"reference_answer\":\"30 days.\"}" },
      { type: "h2", id: "validate", text: "Validate before benchmarking" },
      { type: "code", label: "Terminal", code: "ragvi validate workspaces/customer-support" },
      { type: "note", title: "Keep source units meaningful", text: "A source unit should match what your retriever can return. Do not label evidence against full documents if production retrieves smaller chunks.", tone: "info" },
    ],
  },
  {
    slug: "metrics",
    title: "Metrics reference",
    description: "Use each retrieval metric for the question it actually answers.",
    group: "Evaluation",
    blocks: [
      { type: "table", headers: ["Metric", "Meaning", "No relevant hit"], rows: [["Sufficiency@k", "All unique required evidence appears in the union of the first k hits.", "false"], ["Evidence coverage@k", "Unique required evidence found divided by unique required evidence needed.", "0.0"], ["First relevant rank", "One-based rank of the first hit containing any required evidence.", "N/A"], ["Reciprocal rank", "1 divided by the first relevant rank.", "0.0"], ["Precision@k", "Relevant hits divided by k.", "0.0"]] },
      { type: "h2", id: "sufficiency", text: "Why sufficiency is the primary outcome" },
      { type: "p", text: "A question requiring two independent facts should not pass because one fact ranked first. Sufficiency evaluates whether the union of evidence in the first k hits contains the entire required set." },
      { type: "h2", id: "precision-denominator", text: "Precision always divides by k" },
      { type: "p", text: "If only two hits are returned at k=4 and both are relevant, precision@4 is 0.5. The application reserved four context positions; missing positions do not become free precision." },
      { type: "h2", id: "undefined", text: "Undefined questions" },
      { type: "p", text: "When required_evidence_ids is empty, evidence-level metrics are N/A. This prevents unanswerable or deliberately negative questions from distorting retrieval success rates." },
    ],
  },
  {
    slug: "compare-diagnose",
    title: "Compare and diagnose",
    description: "Find improvements and regressions, then turn patterns into a next experiment.",
    group: "Evaluation",
    blocks: [
      { type: "h2", id: "compare", text: "Create the comparison" },
      { type: "code", label: "Terminal", code: "ragvi compare workspaces/customer-support/evaluations/bm25-body.json workspaces/customer-support/evaluations/bm25-heading_context.json workspaces/customer-support/comparisons/bm25.json" },
      { type: "h2", id: "diagnose", text: "Generate the diagnosis" },
      { type: "code", label: "Terminal", code: "ragvi diagnose workspaces/customer-support/comparisons/bm25.json" },
      { type: "p", text: "The diagnostic rules use observed change patterns. For example, several fail → pass changes after heading enrichment with no regressions support a structural-context hypothesis. They do not prove that the same intervention will generalize." },
      { type: "h2", id: "order", text: "Review order" },
      { type: "list", ordered: true, items: ["Investigate pass → fail regressions first.", "Validate fail → pass changes against the required evidence.", "Inspect fail → fail cases for missing labels, missing corpus content, or retrieval limitations.", "Spot-check pass → pass ranks for quality movement hidden by the boolean outcome.", "Run the recommended next experiment on a frozen slice."] },
    ],
  },
  {
    slug: "reports",
    title: "Reports and sharing",
    description: "Export JSON, Markdown, or a portable HTML report without losing reproducibility context.",
    group: "Reports",
    blocks: [
      { type: "h2", id: "html", text: "Generate an HTML comparison" },
      { type: "code", label: "Terminal", code: "ragvi report workspaces/customer-support/evaluations/bm25-body.json workspaces/customer-support/reports/bm25-comparison.html --intervention workspaces/customer-support/evaluations/bm25-heading_context.json --format html" },
      { type: "p", text: "The HTML report is self-contained: it has no remote assets, no JavaScript, and no network requirement. A teammate can open it directly in a browser." },
      { type: "h2", id: "formats", text: "Choose the format" },
      { type: "table", headers: ["Format", "Best for"], rows: [["HTML", "Human review, meetings, and sharing a complete local artifact."], ["Markdown", "Pull requests, issue threads, and lightweight review."], ["JSON", "Automation, custom dashboards, and downstream analysis."]] },
      { type: "h2", id: "safe-sharing", text: "Share safely" },
      { type: "list", items: ["Review source IDs and text previews for confidential data.", "Do not assume self-contained means anonymous.", "Keep the run and evaluation artifacts with the report when reproducibility matters.", "State the corpus version and limitations in any decision based on the report."] },
    ],
  },
  {
    slug: "commands",
    title: "Command reference",
    description: "A compact map of the current ragvi command surface.",
    group: "Reference",
    blocks: [
      { type: "table", headers: ["Command", "Purpose"], rows: [["ragvi health", "Check Python, dependencies, bundled data, workspace permissions, optional semantic support, and privacy defaults."], ["ragvi tutorial", "Run the complete guided bundled comparison."], ["ragvi init NAME", "Create a recoverable custom workspace."], ["ragvi validate PATH", "Validate sources, questions, evidence links, and schema constraints."], ["ragvi benchmark PATH", "Run built-in retrieval strategies and representations."], ["ragvi import-run ...", "Import ranked results from another retrieval stack."], ["ragvi evaluate ...", "Compute evidence-level metrics for a run."], ["ragvi compare ...", "Classify question-level changes between evaluations."], ["ragvi diagnose ...", "Generate a deterministic pattern-based diagnosis."], ["ragvi report ...", "Export JSON, Markdown, or self-contained HTML."], ["ragvi generate ...", "Optionally produce answers for separate inspection."], ["ragvi workspace restore NAME", "Back up and restore bundled workspace files."], ["ragvi verify", "Run deterministic release verification."]] },
      { type: "note", title: "Discover options", text: "Run ragvi COMMAND --help for authoritative flags and defaults in your installed version.", tone: "info" },
    ],
  },
  {
    slug: "privacy-providers",
    title: "Privacy and providers",
    description: "Know exactly when data stays local and when a provider receives it.",
    group: "Help",
    blocks: [
      { type: "table", headers: ["Workflow", "Network behavior"], rows: [["BM25", "No network request."], ["FastEmbed", "Downloads the model on first use; inference then runs locally."], ["Ollama", "Sends data to the configured Ollama endpoint, commonly localhost."], ["OpenAI-compatible", "Sends source text and questions to the configured remote endpoint."], ["HTML reports", "No remote assets or scripts; opens locally."]] },
      { type: "h2", id: "secrets", text: "Secrets" },
      { type: "p", text: "Store provider keys in .env, never in source files or CLI history. Keys are not included in run manifests or reports. Keep .env and generated workspaces out of version control." },
      { type: "h2", id: "reports", text: "Reports are data" },
      { type: "p", text: "A report can include source previews, metadata, question text, and reference answers. Review and redact according to your organization’s rules before sharing it." },
    ],
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting and recovery",
    description: "Resolve command, dependency, validation, model, and workspace problems safely.",
    group: "Help",
    blocks: [
      { type: "h2", id: "command", text: "ragvi: command not found" },
      { type: "code", label: "Terminal", code: "uv tool update-shell" },
      { type: "p", text: "Restart the terminal and run ragvi --version. If needed, inspect uv tool dir and follow the PATH instruction printed by uv." },
      { type: "h2", id: "health", text: "Start every diagnosis with health" },
      { type: "code", label: "Terminal", code: "ragvi health" },
      { type: "h2", id: "semantic", text: "Semantic extra is missing" },
      { type: "code", label: "Terminal", code: "uv tool install --reinstall --python 3.12 \"ragvidence[semantic]\"" },
      { type: "h2", id: "validation", text: "Dataset validation fails" },
      { type: "list", items: ["Use unique source_unit_id and question_id values.", "Confirm every required evidence ID exists in a source unit.", "Confirm imported source IDs match the workspace exactly.", "Validate JSONL one object per line; do not wrap it in an array."] },
      { type: "h2", id: "restore", text: "Restore a broken workspace" },
      { type: "code", label: "Terminal", code: "ragvi workspace restore customer-support" },
      { type: "p", text: "The current workspace is moved to a timestamped backup before bundled files are restored. RAGvidence does not silently delete your edited workspace." },
      { type: "note", title: "Still blocked?", text: "Email midaghdour@gmail.com with the RAGvidence version, operating system, command, and complete error output. Remove secrets and confidential content first.", tone: "info" },
    ],
  },
];

export const docGroups = ["Start here", "Core concepts", "Workflows", "Evaluation", "Reports", "Reference", "Help"];

export function getDoc(slug: string) {
  return docs.find((doc) => doc.slug === slug);
}

export function adjacentDocs(slug: string) {
  const index = docs.findIndex((doc) => doc.slug === slug);
  return {
    previous: index > 0 ? docs[index - 1] : undefined,
    next: index >= 0 && index < docs.length - 1 ? docs[index + 1] : undefined,
  };
}
