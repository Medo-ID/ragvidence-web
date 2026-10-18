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

const p = (text: string): DocBlock => ({ type: "p", text });
const h = (id: string, text: string): DocBlock => ({ type: "h2", id, text });
const code = (code: string, label = "Terminal"): DocBlock => ({ type: "code", code, label });
const list = (...items: string[]): DocBlock => ({ type: "list", items });
const note = (title: string, text: string): DocBlock => ({ type: "note", title, text, tone: "info" });
const table = (headers: string[], rows: string[][]): DocBlock => ({ type: "table", headers, rows });
const links = (...items: { label: string; href: string }[]): DocBlock => ({ type: "links", items });
const guide = (name: string, label: string): DocBlock => links({ label, href: `https://github.com/Medo-ID/ragvidence/blob/v0.2.0/docs/${name}.md` });
const page = (slug: string, title: string, description: string, group: string, blocks: DocBlock[]): DocPage => ({ slug, title, description, group, blocks });

export const docs: DocPage[] = [
  page("overview", "What RAGvidence does", "Diagnose and compare RAG retrieval techniques on your own data.", "Start here", [
    p("RAGvidence is a fully free Apache-2.0 CLI. Run retrieval experiments on local data before choosing what to implement in your RAG project. No Python project, RAG framework, database or manually prepared workspace is required for portable commands."),
    h("start", "Start with your data"),
    code('ragvi bm25 ./manual.txt --query "How do I reset the device?"\nragvi compare-data ./docs --questions ./questions.txt --techniques bm25,parent-child'),
    table(["Inputs", "What you can inspect"], [["Sources only", "Extraction, structure and chunk diagnostics; retrieval is not executed."], ["Sources and questions", "Ranked passages, exact context, stage traces and resources; quality is unscored."], ["Reviewed original-span evidence", "Evidence sufficiency, coverage, rank/precision metrics and paired improvements/regressions."]]),
    h("what-it-does-not-prove", "What it does not prove"),
    p("The CLI provides evidence for your choice. It does not modify or deploy your production RAG system. It does not judge generated answers, citations or abstention, and it does not promise a universally best technique."),
    h("lifecycle", "The experiment lifecycle"),
    list("Install once, then run from any data folder.", "Inspect extraction and returned context.", "Compare alternatives on frozen data and questions.", "Add reviewed references for scored evaluation.", "Read failures, regressions, context size and observed timing together.", "Use dev questions for exploration, then freeze a shortlist before heldout evaluation."),
  ]),
  page("installation", "Installation", "Install CLI 0.2.0, check it, and add optional PDF or model support.", "Start here", [
    p("Python 3.12 is required. uv installs an isolated global command and can download the selected Python version. Python 3.13 and newer are outside the supported release scope."),
    h("prerequisites", "First, install uv"),
    code("curl -LsSf https://astral.sh/uv/install.sh | sh", "macOS / Linux"),
    code("winget install --id=astral-sh.uv -e", "Windows · PowerShell"),
    p("Open a new terminal afterward. Follow the installer’s PATH instructions, then run uv --version."),
    links({ label: "Official uv installation instructions", href: "https://docs.astral.sh/uv/getting-started/installation/" }),
    h("recommended", "Install the CLI"),
    code('uv tool install --python 3.12 "ragvidence==0.2.0"\nragvi --version\nragvi health\nragvi verify'),
    p("verify runs deterministic bundled checks without downloading a model. A WARN for an absent optional semantic runtime does not block BM25."),
    h("upgrade", "Upgrade an existing installation"),
    code('uv tool install --upgrade --python 3.12 "ragvidence==0.2.0"\nragvi --version\nragvi verify'),
    h("extras", "Optional extras"),
    code('uv tool install --reinstall --python 3.12 "ragvidence[pdf,semantic]==0.2.0"'),
    p("pdf adds text-bearing PDF extraction, without OCR. semantic adds local FastEmbed embeddings and cross-encoder reranking. Include every extra you need when reinstalling. First model use downloads model files; inference is then local. Choose --cache-dir for model/vector storage."),
    h("platforms", "Tested platforms"),
    p("Automated installed-package release checks cover Linux x64, Windows x64, macOS ARM64 and macOS Intel with Python 3.12. Real-model checks use identified Linux configurations; this is not a claim that every model/hardware combination works on every OS. Human Windows usability review remains deferred."),
    h("uninstall", "Uninstall"), code("uv tool uninstall ragvidence"),
    p("Experiment files and reports remain where you saved them. If ragvi is missing from PATH, run uv tool update-shell and restart the terminal."),
    guide("installation", "Source builds and full installation guidance"),
  ]),
  page("bring-your-own-data", "Bring your own data", "Run a file or folder directly, with questions and optional reviewed evidence.", "Start here", [
    h("prepare", "Prepare a small first experiment"),
    code("Hold the reset button for eight seconds. Use USB-C power.", "manual.txt"),
    code('ragvi bm25 ./manual.txt --query "How do I reset the device?"'),
    p("The default export is a self-contained HTML report in a unique directory under ragvi-reports/. Original input files stay unchanged. --output DIRECTORY selects another root; --open explicitly opens the HTML in a browser."),
    h("questions", "Add your questions"),
    code("How do I reset the device?\nWhat power does it require?", "questions.txt"),
    code('ragvi bm25 ./docs --questions ./questions.txt --format html --format json\nragvi compare-data ./docs --questions ./questions.txt --techniques bm25,parent-child'),
    p("TXT uses one question per nonblank line. JSON accepts an array of strings or question objects; JSONL uses one object per line. IDs must be unique; portable question objects accept only question_id and question."),
    code('{"question_id":"Q1","question":"How do I reset the device?"}', "JSONL · questions.jsonl"),
    h("source-only", "Inspect without questions"), code("ragvi bm25 ./manual.txt --no-input"),
    p("Without questions, an interactive terminal offers question entry. Empty entry selects source inspection. --no-input disables prompts; redirected input never blocks. --interactive offers output-format selection on a terminal. Explicit --format flags work without prompts."),
    h("example", "Download the synthetic worked example"),
    links({ label: "Device manual", href: "/examples/manual.md" }, { label: "Question file", href: "/examples/questions.txt" }, { label: "Reviewed original spans", href: "/examples/reviewed.json" }, { label: "Actual generated comparison", href: "/sample-report.html" }),
    p("Save manual.md inside docs/, with questions.txt and reviewed.json beside that folder. The reviewed file binds to the exact original text and its corpus hash. Keep the downloaded manual’s UTF-8 bytes unchanged."),
    code('ragvi compare-data ./docs --reviewed ./reviewed.json --techniques bm25,parent-child,compress --k 1 --chunk-size 100 --chunk-overlap 10 --format html --format json --format markdown'),
    note("Scoring needs review", "Questions alone do not establish relevant evidence or a quality winner. Reviewed references supply questions and cannot combine with --query or --questions."),
  ]),
  page("first-tutorial", "First tutorial", "An optional fictional example of reviewed body versus heading-context retrieval.", "Start here", [
    h("run", "Run it"), code("ragvi tutorial"),
    p("Creates workspaces/first-run and writes workspaces/first-run/reports/tutorial.html. The command refuses to overwrite an existing workspace. Use ragvi tutorial --name first-run-2 to repeat."),
    h("expected", "Expected result"),
    p("The bundled fictional English exercise compares BM25 body and authentic heading-context representations at k=2. It teaches mechanics; it is not a benchmark for your corpus."),
    table(["Run", "Sufficient", "Rate"], [["bm25-body", "6 / 10", "60%"], ["bm25-heading_context", "9 / 10", "90%"]]),
    note("Why the report lists 12 questions", "Ten questions are answerable; two unanswerable questions have N/A retrieval metrics and remain outside the denominator. Three failures recover, none regress, six stay sufficient and one stays insufficient."),
    h("inspect", "Inspect the evidence"),
    list("Check the fixed k and representation.", "Open changed question details and compare ranked source units.", "Check all required evidence, including conditions and exceptions.", "Read the limitation beside the diagnosis."),
    links({ label: "Generated tutorial report from PyPI 0.2.0", href: "/tutorial-report.html" }),
  ]),
  page("first-report", "Read your first report", "Read status, context, evidence and limitations before drawing a conclusion.", "Start here", [
    h("summary", "Check status and configuration"),
    table(["State", "Meaning"], [["ingestion_only", "No questions; retrieval was not executed."], ["retrieval_inspection", "Actual retrieval; relevance and quality are unscored."], ["reviewed_evaluation", "Reviewed original-span evidence was validated and scored."]]),
    p("Confirm loaded/skipped files, failed extraction, question counts, k, chunking, models and context budgets. Low lexical scores are observations, not probabilities or command failures."),
    h("changes", "Prioritize changed questions"),
    table(["Class", "Interpretation"], [["fail → pass", "All required evidence became available."], ["pass → fail", "Required evidence was lost: investigate the regression."], ["pass → pass", "Both contexts are sufficient; ranks/resources may differ."], ["fail → fail", "The gap remains; inspect partial gains and missing spans."]]),
    h("hits", "Inspect the actual context"),
    p("Read original source locations, exact returned text and stage traces. A parent can restore missing qualifications while increasing context size. Compression can drop a necessary condition. A valid model output can still be unhelpful."),
    h("diagnosis", "Treat diagnosis as a hypothesis"),
    p("An observed change does not prove a universal cause. Use a relevant next experiment and reserve separate heldout data before making a decision."),
    note("Before sharing", "Exports can contain full passages, questions, prompts and model output. Private snapshots and references can include the full corpus. Review the selected files before sharing."),
  ]),
  page("supported-inputs", "Supported files and schemas", "TXT, Markdown, HTML, document JSON/JSONL, CSV and optional text-bearing PDF.", "Reference", [
    h("formats", "Supported input formats"),
    table(["Format", "Searchable text and retained locations"], [["UTF-8 TXT / Markdown", "Original character and line offsets; Markdown ATX heading paths outside fenced code."], ["HTML / HTM", "Visible text grouped by headings, section number and heading path. No scripts or remote assets execute."], ["JSON / JSONL", "Document object(s), one selected text field per record; record and file line where available."], ["CSV", "Unique header and consistent comma-separated rows; data-row and physical-line ranges, including multiline cells."], ["PDF + pdf extra", "Text-bearing pages and original page numbers; parser/version/warnings recorded."]]),
    h("records", "Document records"),
    code('[{"text":"Hold reset for eight seconds.","product":"Orion","version":2}]', "documents.json"),
    p("Select one unambiguous text, content or body string field; --text-field NAME resolves multiple candidates or custom names. Nested metadata is retained without being flattened into text. Question/evaluation records and RAGvidence artifacts are rejected as documents. CSV metadata remains string-typed."),
    code('ragvi bm25 ./articles.json --text-field article --query "Reset procedure"'),
    h("discovery", "Folder discovery and limits"),
    p("Discovery is recursive and deterministic. Hidden files, symlinks, known generated directories, selected questions/config/env files, output/cache roots and marked earlier runs are excluded. Reports list intentionally skipped files, extraction failures and parser warnings."),
    p("Defaults: 1,000 files; 20 MiB per file; 100 MiB attempted bytes; 10,000 records/sections/pages per file; 20 Mi extracted characters. --max-files, --max-file-bytes, --max-total-bytes, --max-records and --max-extracted-characters override these limits. Total budgets fail the command; valid files can proceed past individual folder extraction failures."),
    code("ragvi bm25 ./data --include '*.jsonl' --include '*.csv' --exclude 'drafts/*' --no-input"),
    h("limits", "Extraction limits"),
    p("No OCR/scanned PDF, DOCX/spreadsheet, image/audio, crawling or database connector support. PDF/HTML extraction does not guarantee table/layout fidelity. Encrypted and fully textless PDFs fail. CSS layout/dynamic HTML and Setext headings are not interpreted. Unicode decoding is not language-specific stemming or universal semantic model support."),
    guide("portable-file-usage", "Full file, configuration and discovery reference"),
  ]),
  page("evidence-labels", "Questions and evidence labels", "Anchor reviewed facts to original Unicode character spans for scored evaluation.", "Core concepts", [
    h("inventory", "Inspect original sources first"), code("ragvi bm25 ./manual.txt --no-input --format html --format json"),
    p("Read source IDs and the corpus hash from the source report. snapshot.json retains exact extracted bodies. Offsets are zero-based Unicode character positions with an exclusive end, relative to the original extracted source unit."),
    h("reviewed", "Reviewed sidecar schema"),
    code('{\n  "schema_version": 1,\n  "corpus_hash": "COPY_FROM_SOURCE_REPORT",\n  "evidence": [{"evidence_id":"RESET","spans":[\n    {"source_id":"COPY_ORIGINAL_SOURCE_ID","start":0,"end":13,"text":"eight seconds"}\n  ]}],\n  "questions": [{"question_id":"Q1","question":"How long is reset?",\n    "split":"dev","answerable":true,"required_evidence_ids":["RESET"]}]\n}', "reviewed.json · schema illustration"),
    p("The example offsets apply only if the original body begins with eight seconds. Copy actual source IDs/hashes and review each quote. One evidence item can require multiple spans across sources. A question’s complete required set must contain every condition needed for an answer. Tags and reference answers are optional evaluation data."),
    code("ragvi bm25 ./manual.txt --reviewed ./reviewed.json"),
    h("multi-evidence", "Evidence credit"),
    p("Full union coverage of every required span earns evidence credit, including coverage across multiple chunks. Partial text and duplicate overlap cannot inflate credit. Search prefixes never earn span credit. Changing chunk size retains the same original corpus identity."),
    h("answerability", "Answerability and review quality"),
    p("Dev and heldout are separate splits. Unanswerable questions have N/A retrieval metrics. Review completeness, corpus version and question wording; do not leak expected evidence into supplied variants or prefixes for heldout questions."),
    links({ label: "Runnable reviewed synthetic example", href: "/examples/reviewed.json" }),
    guide("portable-techniques", "Reviewed span rules and complete import schemas"),
  ]),
  page("retrieval-depth", "Retrieval depth k", "Control final depth, candidate stages and exact context budgets.", "Core concepts", [
    h("depth", "Use the context your application actually sends"),
    p("k caps final returned units. Larger k can recover evidence while adding irrelevant context. Compare techniques at a matched final depth or an explicit matched context budget; do not credit evidence your generation step never receives."),
    table(["Option", "Cap"], [["--branch-k", "Candidates per lexical/dense hybrid branch"], ["--child-k", "Children before parent deduplication"], ["--query-k", "Each original/variant search and fused pool"], ["--rerank-k", "Candidates scored by the cross-encoder"], ["--k", "Final returned source units"], ["--context-budget", "Complete rendered context count"]]),
    h("budgets", "Context budgets"),
    p("Whole ranked passages that do not fit are skipped and remaining ranks are renumbered. Text is not silently cut. IDs, headings and separators count. The default counter uses exact Unicode characters; --tokenizer-file selects and hashes a local Hugging Face tokenizer JSON for token counts with padding/truncation/special tokens disabled."),
    p("Those counts exclude generation instructions and provider framing. Model adapters can independently truncate ranking inputs; exact per-model truncation counts are unavailable. Small explicit candidate caps can return fewer than k passages."),
    guide("portable-techniques", "Stage and tokenizer reference"),
  ]),
  page("controlled-experiments", "Controlled experiments", "Freeze inputs, isolate decisions and protect heldout questions.", "Core concepts", [
    h("one-variable", "Change one meaningful variable"),
    p("Compare a specific decision using the same original corpus, reviewed references and questions. Keep final depth or context policy explicit. If you change chunking, model, k and labels together, the result describes the combined intervention."),
    h("splits", "Dev exploration and heldout evaluation"),
    p("Reviewed comparisons default to --phase dev: heldout questions are not retrieved or scored. A successful comparison writes shortlist.json with frozen configurations. --shortlist-names selects a subset including the baseline; the CLI does not optimize the choice."),
    code('ragvi compare-data ./docs --reviewed ./reviewed.json --techniques bm25,parent-child\nragvi compare-data ./docs --phase heldout --shortlist ./ragvi-reports/COMPARISON/shortlist.json'),
    p("Replace COMPARISON with the printed directory, keep its frozen files together, and include heldout questions in your own references. The downloadable four-question website example has only dev questions; it is not a heldout benchmark."),
    h("reuse", "Heldout reuse disclosure"),
    p("Reuse is recorded locally under the chosen output root across shortlists for the same corpus/references. Moving/deleting that ledger defeats the disclosure. Public or repeatedly tuned heldout data is not unseen evaluation data."),
    h("manifest", "Preserve provenance"),
    p("Keep configurations, source/reference hashes, provider/model identities, warnings and stage evidence. Resuming validates frozen artifacts; make a fresh comparison when the experiment changes."),
  ]),
  page("bm25-workflow", "BM25 workflow", "Inspect a lexical baseline without a model, API key or network calls.", "Workflows", [
    h("run", "Run on a file or folder"),
    code('ragvi bm25 ./manual.txt --query "How do I reset the device?"\nragvi bm25 ./docs --questions ./questions.txt --format html --format json'),
    p("BM25 is useful for identifiers, names and domain terms. It requires no LLM and no semantic runtime. Scores are ranking observations, not correctness probabilities."),
    h("compare", "Compare structural alternatives"),
    code('ragvi compare-data ./docs --questions ./questions.txt --techniques bm25,parent-child\nragvi heading-context ./manual.md --query "Reset procedure"'),
    p("Parent-child searches smaller children and returns full originals: a document, HTML section, record or PDF page. It may restore conditions while using more context. heading-context indexes authentic heading paths and fails on wholly flat input."),
    h("chunks", "Chunk settings"),
    p("Default passages have at most 500 body characters with 50 overlap. --chunk-size and --chunk-overlap use characters; overlap must be smaller than size. Markdown overlap stays within sections. Recursive splitting and ATX heading structure are supported; these are not arbitrary language parsers."),
    guide("portable-techniques", "Portable technique reference"),
  ]),
  page("semantic-workflow", "Semantic workflow", "Select local FastEmbed, Ollama or an OpenAI-compatible embedding provider.", "Workflows", [
    h("local", "Local FastEmbed"),
    code('uv tool install --reinstall --python 3.12 "ragvidence[semantic]==0.2.0"\nragvi semantic ./docs --query "How do I reset the device?"'),
    p("First use downloads the selected model; inference then runs locally. --cache-dir chooses model/vector storage. Reuse requires compatible model and searchable-text identities. Dense retrieval ranks by cosine; weighted hybrid combines lexical/dense ranks with RRF."),
    h("ollama", "Ollama embeddings"),
    code("RAGVIDENCE_EMBEDDING_BASE_URL=http://localhost:11434", ".env · providers.env"),
    code('ragvi semantic ./docs --env-file ./providers.env --provider ollama --model YOUR_EMBEDDING_MODEL --query "Reset procedure"'),
    p("Make a suitable embedding model available on your own Ollama service first. The CLI does not install a model server. Portable commands read dotenv only through explicit --env-file; they do not discover .env in your data folder."),
    h("remote", "OpenAI-compatible embeddings"),
    code("RAGVIDENCE_EMBEDDING_BASE_URL=https://provider.example/v1\nRAGVIDENCE_EMBEDDING_API_KEY=YOUR_KEY", ".env · providers.env"),
    p("Select --provider openai_compatible --model YOUR_EMBEDDING_MODEL and --env-file ./providers.env. Replace the example endpoint with your service. Compatible services can be local or remote; remote endpoints receive the source/query text needed for the operation. Keys are excluded from reports."),
    h("compare", "Compare specific models and settings"),
    p("Hybrid, reranking and cosine MMR have different requirements. Use ragvi techniques before selecting them. Model output compliance and useful retrieval depend on the selected model and hardware; the CLI provides no API credits."),
    guide("installation", "Provider setup and installation"),
  ]),
  page("techniques", "Techniques and requirements", "Choose supported experiments and understand the model or sidecar each needs.", "Workflows", [
    h("catalog", "Inspect the installed catalog"), code("ragvi techniques\nragvi techniques --format json"),
    table(["Experiment", "Requirements and behavior"], [["bm25", "Lexical independent passages; no model"], ["semantic / hybrid", "Embedding provider; local FastEmbed needs semantic extra. Hybrid uses weighted RRF."], ["rerank", "semantic extra and --reranker-model for a local cross-encoder"], ["parent-child", "Search children, return full originals; no model with BM25 base"], ["heading-context", "Authentic headings"], ["contextual", "--prefixes maps original IDs to text hashes and supplied prefixes"], ["multi-query", "--variants maps question IDs to 1–8 supplied strings; original is included"], ["metadata-filter", "--filters with typed predicates before ranking"], ["mmr", "Embedding provider; cosine relevance/diversity selection"], ["rewrite / auto-multi-query", "--rewrite-model and your transformation provider"], ["compress", "Deterministic sentence extraction, or an explicit exact-span model selector"], ["import-data", "--results with external exact-span or registered-unit results"]]),
    h("compose", "Compose stages explicitly"),
    p("BM25, semantic and hybrid are base retrievers. Modifiers default to BM25; --base-retriever changes the base. --representation selects body, heading_context or contextual. Cross-encoding, MMR, rewriting and compression can be configured per suite variant. These are experiment presets and stages, not a claim of independent algorithm count."),
    h("sidecars", "Supplied variants and prefixes"),
    code('{"Q1":["pairing reset duration","hold reset button"]}', "variants.json"),
    code('{"COPY_ORIGINAL_SOURCE_ID":{"text_hash":"COPY_ORIGINAL_TEXT_HASH","prefix":"Device documentation"}}', "prefixes.json"),
    p("Unknown question IDs fail. Prefixes must cover every original source and match its text hash. Prefixes and supplied query variants should be prepared independently of expected heldout evidence. Prefix text earns no evidence credit."),
    guide("portable-techniques", "Full commands, stages and sidecar contracts"),
    guide("rag-technique-coverage", "Supported scope and missing retrieval families"),
  ]),
  page("advanced-techniques", "Filters, rewriting and compression", "Inspect typed filters, cosine MMR and bounded model transformations.", "Workflows", [
    h("filters", "Typed metadata filters"),
    code('{"all":[{"field":"record_metadata.product","op":"eq","value":"Orion"}]}', "filters.json"),
    p("eq, in, gt, gte, lt and lte combine with AND. Missing fields/type mismatches exclude a source; CSV values remain strings. Strings compare lexically without date/version conversion. Filters apply before ranking and parent expansion cannot reintroduce excluded sources."),
    h("mmr", "Cosine MMR"),
    p("MMR trades query cosine relevance against maximum cosine similarity to already selected candidates. --mmr-lambda controls that balance; --mmr-candidates caps the pool. It needs an embedding provider, even after lexical ranking. Diversity can displace needed similar passages."),
    h("rewriting", "Bounded model queries"),
    p("rewrite requests one query; auto-multi-query requests up to three by default, configurable 1–8. Set --rewrite-model and --rewrite-provider, with RAGVIDENCE_TRANSFORM_BASE_URL/API_KEY for your service. The model receives the question and instruction, without corpus, answers or reviewed evidence IDs. Strict JSON is required. --rewrite-failure original explicitly permits a disclosed fallback; default fail does not invent a successful result."),
    h("compression", "Exact-span compression"),
    code('ragvi compress ./docs --questions ./questions.txt --compression-max-spans 2'),
    p("The default sentence selector ranks punctuation/newline spans by lexical question-word overlap, keeping up to two positive-overlap spans per source. An explicit --compression-model can select exact offsets from candidate bodies. No added summary earns evidence credit. Removed conditions lose credit even when an output passes validation."),
    h("limits", "Model and suite bounds"),
    p("Timeouts, output caps, prompt/JSON/query sizes and suite call bounds are validated. Invalid model output fails unless explicit original-text fallback is selected and disclosed. The CLI does not supply the server, API access or an answer correctness judge."),
    guide("portable-advanced-techniques", "Full schemas, provider settings, bounds and composition"),
  ]),
  page("import-retriever", "Import an existing retriever", "Evaluate your system’s returned spans against the same original sources.", "Workflows", [
    h("exact", "Exact-span imports"),
    code('{"question_id":"Q1","hits":[{"source_id":"COPY_ORIGINAL_SOURCE_ID","start":0,"end":13,"text":"eight seconds","rank":1,"score":0.8}]}', "results.jsonl · schema illustration"),
    p("Use original source IDs and exact offsets/text from your corpus; the illustration assumes the source starts with eight seconds. Include a row for every question, even empty hit lists. Ranks are one-based; scores can be omitted. All hit tails are validated before selection."),
    code('ragvi import-data ./docs --reviewed ./reviewed.json --results ./results.jsonl'),
    h("proxy", "Registered-unit proxies"),
    p("ID-only hits use source_unit_id referring to a registered original or passage. They are explicitly labeled registered_unit_proxy: the actual external context was not supplied. Exact spans and proxy hits cannot mix in one run. Proxy scores cannot satisfy actual-context quality criteria."),
    h("baseline", "Use your system as a comparison baseline"),
    code('ragvi compare-data ./docs --reviewed ./reviewed.json --results ./results.jsonl --techniques bm25,parent-child'),
    p("existing becomes the default baseline; --baseline chooses another named participant. Missing external timing, internal stages and generation-request context remain unavailable."),
    guide("portable-techniques", "Import contract and evidence validation"),
  ]),
  page("compare-diagnose", "Compare and diagnose", "Compare frozen alternatives, inspect paired changes, and resume validated work.", "Evaluation", [
    h("compare", "Run one frozen comparison"),
    code('ragvi compare-data ./docs --questions ./questions.txt --techniques bm25,parent-child\nragvi compare-data ./docs --reviewed ./reviewed.json --techniques bm25,parent-child,compress --k 1 --chunk-size 100 --chunk-overlap 10'),
    p("Inputs load once. Without reviewed references the comparison is unscored. With references, evidence gained/lost/missing and per-question outcomes accompany aggregate metrics. A neutral result or keeping the baseline is valid."),
    h("suites", "Suites and controlled grids"),
    code('{"schema_version":1,"baseline":"body","policy":"fixed_k","variants":[{"name":"body","technique":"bm25"},{"name":"parents","technique":"parent-child"}]}', "suite.json"),
    code('ragvi compare-data ./docs --reviewed ./reviewed.json --suite ./suite.json'),
    p("Suite variants can set explicit stage options and sidecars. Grids are bounded before execution: default 16, maximum 32 expanded configurations; 0–3 extra timing trials; 100–10,000 bootstrap resamples. Query-call limits exclude indexing, downloads and provider-internal work, so are not billing limits."),
    h("intervals", "Uncertainty and resources"),
    p("Seeded 95% percentile intervals resample paired question differences, optionally grouping related questions. Fewer than two groups gives an N/A interval. Small samples and multiple-comparison limits apply; repeated timing runs do not add independent questions. Timing/cache observations are labeled; missing measurements stay unavailable."),
    p("Optional criteria report matched, not-matched or unknown. Cost estimates require supplied usage and identified pricing; they are not provider bills or a fabricated saving."),
    h("resume", "Failures and resume"),
    code('ragvi compare-data . --resume ./ragvi-reports/COMPARISON --format html --format json'),
    p("Replace COMPARISON with the printed directory. Resume validates frozen digests, settings, contexts, checkpoints and recomputed evidence before reusing completed work. It rereads frozen inputs rather than INPUT. Failed trials get new attempts and previous files remain. Configuration changes require a fresh comparison. Any participant failure produces a partial-failure report and nonzero status; a failed baseline is not silently replaced."),
    guide("portable-comparisons", "Suites, heldout shortlists, criteria and resume contracts"),
  ]),
  page("metrics", "Metrics reference", "Understand original-span sufficiency, coverage, rank, precision and N/A states.", "Evaluation", [
    h("definitions", "Evidence metrics"),
    table(["Metric", "Meaning"], [["Sufficiency", "Every required original evidence item is fully covered by the final span union."], ["Coverage", "Fraction of complete required evidence items recovered."], ["First relevant rank / reciprocal rank", "First ranked prefix that completes any required evidence item; its reciprocal."], ["Overlap precision", "Relevant returned hits divided by configured k."], ["Paired delta", "Within-question intervention minus baseline, keeping gains and regressions."]]),
    h("denominators", "Denominators and limits"),
    p("Answerable questions determine retrieval-quality rates, separately for dev/heldout/slices. Unanswerable questions have N/A metrics. Unreviewed runs cannot establish relevance. nDCG is unavailable without reviewed relevance gains. ID-only imports are limited proxies."),
    p("Body truncation or extractive compression can remove evidence; evaluation uses actual final original spans. Prefixes never establish evidence. Low raw ranking scores are not a correctness probability."),
    h("answers", "Generated answers are separate"),
    p("The optional workspace generate command can produce answers for inspection using your provider. Neither answers, citations nor abstention are judged. Portable retrieval commands do not generate answers."),
    guide("interpreting-results", "Metric interpretation and decision limits"),
  ]),
  page("reports", "Reports and exports", "Save terminal summaries and self-contained HTML, JSON or Markdown reports.", "Reports", [
    h("formats", "Choose exports"),
    code('ragvi bm25 ./docs --questions ./questions.txt --format html --format json --format markdown'),
    p("HTML is the default; an explicit repeated --format selection replaces it. Every run uses a unique directory under ragvi-reports/; --output chooses a different root. --open opens HTML only when requested."),
    h("contents", "What exports contain"),
    p("Reports identify input hashes, settings, source locations, exact returned context, queries, stage candidates/scores/timings, model/provider identity, warnings and evaluation scope. Unknown cost/timing stays unavailable. HTML escapes source content, embeds fonts and has no scripts or remote assets. Disclosures and print styles allow offline inspection."),
    links({ label: "Synthetic comparison · HTML", href: "/sample-report.html" }, { label: "Same report · JSON", href: "/sample-report.json" }, { label: "Same report · Markdown", href: "/sample-report.md" }, { label: "Generation commands and hashes", href: "/examples/provenance.json" }),
    h("private", "Keep internal artifacts private"),
    p("snapshot.json retains original bodies; questions.json and references.json retain evaluation inputs; run.json records exact context; search-sources.json freezes searchable bodies/prefixes. Comparison directories also retain plans, sidecars, tokenizers and checkpoints. They can expose much more than the selected report. Review all content before sharing."),
    guide("portable-file-usage", "Artifact and export reference"),
  ]),
  page("privacy-providers", "Privacy and providers", "Know which operations stay local and what selected endpoints receive.", "Reference", [
    h("local", "Local processing"),
    p("BM25 and deterministic sentence extraction need no LLM, account, telemetry, API key or network request. FastEmbed embeddings/cross-encoders run locally after initial model download. Ollama uses your configured service. The CLI does not supply a server or credits."),
    h("remote", "Selected model operations"),
    p("An OpenAI-compatible endpoint may be local or remote. Embeddings receive source text and queries. Rewriting receives the original question and instruction. Model compression receives questions and candidate bodies. Reviewed evidence IDs/reference answers are excluded from retrieval/transformation prompts. Optional workspace generation sends selected context and questions."),
    h("config", "Configuration and secrets"),
    p("Portable precedence is CLI flags, environment, explicit --config, user configuration, defaults. --env-file contributes values below actual process environment. No data-folder dotenv/config is discovered automatically. Credentials are excluded from reports; provider/model/endpoint identities and prompts may be included."),
    h("sharing", "Review before sharing"),
    p("Exports may contain complete passages, questions, prompts and outputs; internal artifacts can contain the full corpus and references. Review the destination’s retention/security policies and sanitize data before sending or sharing it."),
    guide("privacy-and-providers", "Detailed CLI privacy boundaries"),
  ]),
  page("commands", "CLI reference", "Discover installed commands and portable configuration before running an experiment.", "Reference", [
    h("help", "Use installed help"),
    code('ragvi --help\nragvi bm25 --help\nragvi compare-data --help\nragvi techniques --format json'),
    h("portable", "Portable workflow"),
    list("bm25, semantic, hybrid: base retrieval.", "rerank, parent-child, heading-context, contextual, multi-query: candidate/representation experiments.", "metadata-filter, mmr, rewrite, auto-multi-query, compress: explicit stages.", "import-data: existing-system context; compare-data: frozen comparisons."),
    h("workspace", "Optional reviewed workspace"),
    p("tutorial, quickstart and init create recoverable reviewed workspaces. validate checks references; benchmark/experiment write runs; import-run normalizes existing results; evaluate scores reviewed labels; compare/diagnose/inspect investigate; report exports authoritative evaluations. generate optionally calls your answer provider for inspection, without correctness judging."),
    h("config", "Portable configuration"),
    code('k = 3\nformats = ["html", "json"]\nchunk_size = 500\nchunk_overlap = 50\noutput = "reports"', "config.toml"),
    p("Select --config explicitly. Relative paths in config files resolve against that file; flag/environment paths resolve from the command directory. Unknown keys fail. See the CLI guide for user-config locations and environment equivalents."),
    guide("portable-file-usage", "Complete portable options and user configuration"),
    guide("user-guide", "Reviewed workspace command guide"),
  ]),
  page("troubleshooting", "Troubleshooting and recovery", "Resolve PATH, extraction, optional runtime, model and frozen-input failures.", "Help", [
    h("command", "ragvi: command not found"), code("uv tool update-shell"),
    p("Restart the terminal and run ragvi --version. Confirm Python 3.12 and the intended isolated tool installation."),
    h("health", "Start with installation checks"), code("ragvi health\nragvi verify"),
    p("PASS means a check succeeded, WARN can describe an optional unavailable runtime, and FAIL requires action. A missing semantic extra does not block BM25. Install extras with the pinned command in Installation."),
    h("validation", "Input or reference validation fails"),
    list("Use UTF-8 input and the supported document-only schemas.", "Separate question files from document exports.", "Use unique question IDs and exact original-span source IDs/quotes/hashes.", "Use writable output/cache roots when source folders are read-only.", "Use a fresh comparison after changing frozen inputs; resume cannot accept configuration changes."),
    h("models", "Model-backed experiments fail"),
    p("Check the extra/provider, model’s operation, endpoint, disk/memory and explicit --env-file. Strict rewriting/compression JSON failures are retained with private failure evidence. No automatic retry invents an output; original-text fallback must be selected and is disclosed."),
    h("restore", "Optional workspace recovery"),
    code("ragvi workspace restore customer-support"),
    p("An existing edited workspace is moved to a timestamped backup before bundled files are restored. This command is for named workspaces; portable data does not need workspace setup."),
    note("Need help?", "Report the version, OS, exact command and complete error at the CLI issue tracker. Remove keys, confidential content and private paths first."),
    links({ label: "CLI issue tracker", href: "https://github.com/Medo-ID/ragvidence/issues" }),
    guide("troubleshooting", "Full troubleshooting guide"),
  ]),
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
