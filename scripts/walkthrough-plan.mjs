// Shared recording contract; the short loop follows the inspected Supabase workflow.
export const walkthroughPlan = { width: 1920, height: 1080, fps: 30, durationSeconds: 34, frames: 1020 };
export const walkthroughPreviewTimes = [0.5, 2.8, 5.8, 8, 10, 12, 13.6, 15, 17, 19.5, 21.8, 22.7, 24, 26, 28.3, 30.5, 31.5, 33];
export const walkthroughEncodings = [
  { file: "walkthrough.mp4", codec: "h264", arguments: ["-c:v", "libx264", "-preset", "medium", "-crf", "23", "-movflags", "+faststart"] },
  { file: "walkthrough.webm", codec: "vp9", arguments: ["-c:v", "libvpx-vp9", "-crf", "32", "-b:v", "0", "-cpu-used", "3", "-row-mt", "1"] },
];
export const transcript = [
  [0, 4.5, "Run ragvi bm25 on a synthetic local manual with a question. Read the actual ranked source passages. Questions alone are retrieval inspection, not scored evaluation. Execution waits are omitted."],
  [4.5, 10.5, "Run compare-data on the same local documents with reviewed.json, comparing BM25, parent-child and sentence extraction at k=1, chunk size 100 and overlap 10. The actual output retains all participants, the dev and heldout counts, resource measurements and limitations."],
  [10.5, 14, "The repeated --format html --format json --format markdown options export all three formats in one command. Read the actual HTML, JSON and Markdown file paths. Open the generated HTML report for interactive evidence inspection."],
  [14, 18, "Read the unmodified production 0.2.1 HTML report and its resource trade-offs. The three participants have 3/4, 4/4 and 3/4 sufficient dev questions, with mean rendered contexts of approximately 161, 741 and 200 characters. Unavailable supplied-usage costs remain N/A. No automatic winner or heldout evaluation is claimed."],
  [18, 21, "Inspect question-level changes. Q1 gains required POWER evidence with parent-child retrieval. Sentence extraction remains insufficient for the same question."],
  [21, 27.5, "Open ranked contexts and the Q1 disclosure. Zoom into the original parent passage: hold reset for eight seconds and keep USB-C power connected throughout the reset. These are reviewed source spans, not generated-answer correctness scores."],
  [27.5, 29.5, "Switch the report to light mode without changing evidence or scores."],
  [29.5, 32, "Inspect the same report and original source evidence on mobile, including native horizontally scrolling keyboard navigation."],
  [32, 34, "Print includes closed evidence disclosures. These synthetic teaching results are not a benchmark. Review report contents before sharing."],
];
export const timecode = value => `00:${String(Math.floor(value / 60)).padStart(2, "0")}:${(value % 60).toFixed(3).padStart(6, "0")}`;
const captionText = [
  "Ask a question about a local file. Read the real terminal output.",
  "Compare three techniques using reviewed evidence. All dev outcomes remain visible.",
  "Export HTML, JSON and Markdown. Open HTML to inspect the report.",
  "Read every participant and resource trade-off. N/A stays unavailable.",
  "Q1 gains POWER. Sentence extraction still misses it.",
  "Open the original context: USB-C power must stay connected during reset.",
  "Light mode. Same evidence.",
  "Mobile report and keyboard navigation.",
  "Print includes evidence. Teaching data, not a benchmark.",
];
export const captions = "WEBVTT\n\n" + transcript.map(([a, b], i) => `${i + 1}\n${timecode(a)} --> ${timecode(b)}\n${captionText[i]}\n`).join("\n");
export const plainTranscript = "RAGvidence 0.2.1 — synthetic own-data workflow\n\n" + transcript.map(([a, b, text]) => `${a}–${b}s: ${text}`).join("\n\n") + "\n";
