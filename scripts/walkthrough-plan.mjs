// Shared recording contract; the short loop follows the inspected Supabase workflow.
export const walkthroughPlan = { width: 1920, height: 1080, fps: 30, durationSeconds: 22, frames: 660 };
export const transcript = [
  [0, 4, "Run the actual comparison command on a synthetic local manual and four reviewed dev questions. Reviewed spans anchor the reset duration and power condition to the original text. k=1, chunk size 100, overlap 10. Execution waits are omitted."],
  [4, 8, "Read all three participants and their resource trade-offs in the unmodified production 0.2.1 report. BM25, parent-child and sentence extraction have 3/4, 4/4 and 3/4 sufficient dev questions. Mean rendered contexts round to 161, 741 and 200 characters. No automatic winner or heldout evaluation is claimed."],
  [8, 11, "Inspect question-level changes. Q1 gains the required POWER evidence with parent-child retrieval. Sentence extraction remains insufficient for the same question."],
  [11, 16, "Open ranked contexts. The original parent passage includes both the reset duration and the condition: Keep USB-C power connected throughout the reset."],
  [16, 18, "Switch the report to light mode without changing evidence or scores."],
  [18, 20.5, "Inspect the same report and source evidence on mobile, including native horizontally scrolling keyboard navigation."],
  [20.5, 22, "Print includes closed evidence disclosures. These synthetic teaching results are not a benchmark. Review report contents before sharing."],
];
export const timecode = value => `00:${String(Math.floor(value / 60)).padStart(2, "0")}:${(value % 60).toFixed(3).padStart(6, "0")}`;
const captionText = [
  "Compare three techniques on synthetic local data and reviewed dev questions.",
  "Inspect every participant and resource trade-off. No automatic winner.",
  "Q1 gains POWER. Sentence extraction still misses it.",
  "Open the original context: USB-C power must stay connected during reset.",
  "Light mode. Same evidence.",
  "Mobile report and keyboard navigation.",
  "Print includes evidence. Teaching data, not a benchmark.",
];
export const captions = "WEBVTT\n\n" + transcript.map(([a, b], i) => `${i + 1}\n${timecode(a)} --> ${timecode(b)}\n${captionText[i]}\n`).join("\n");
export const plainTranscript = "RAGvidence 0.2.1 — synthetic own-data workflow\n\n" + transcript.map(([a, b, text]) => `${a}–${b}s: ${text}`).join("\n\n") + "\n";
