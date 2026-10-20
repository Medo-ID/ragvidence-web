import { createHash } from "node:crypto";

// Exact static theme script from the verified production 0.2.1 wheel.
// All other executable scripts remain forbidden in generated public reports.
export const reportThemeSHA256 = "ff56ff5c0701d5e87731a7d12a1b0c75040815c60cf0b3e99fdb59f6788d2def";
export function validReportScripts(html) {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
  return scripts.length === 1 && /^\s+id="report-theme"\s*$/.test(scripts[0][1]) &&
    createHash("sha256").update(scripts[0][2]).digest("hex") === reportThemeSHA256 &&
    (html.match(/<script\b/gi) ?? []).length === 1;
}

// Specification of the published product video.
export const walkthroughSpec = { width: 1920, height: 1080, fps: 30, durationSeconds: 34, frames: 1020 };
