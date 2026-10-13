# RAGvidence identity audit — October 13, 2026

Milestone 0 is **blocked**, not complete. No application code, report template,
metric calculation, schema, sample report, or product video was changed. Both
repositories were clean at entry. Implementation milestones have not started.

## Verification baseline

| Check | Result |
| --- | --- |
| Website `npm ci` | Passed; ESLint 9 deprecation, existing development advisory, and unapproved optional resolver install-script notice recorded |
| Website lint and TypeScript | Passed within `npm run verify` |
| Website production build | Failed at Turbopack's CSS worker: `binding to a port: Operation not permitted (os error 1)` |
| Permission-approved build retries | Same failure, including direct build and non-login-shell retry |
| Loopback/default-address socket diagnostics | Both passed; this does not establish that Turbopack's worker can bind |
| Website HTTP and Chromium regression gate | Not reached; requires a successful production build |
| Standalone verification-script tests | 4 passed |
| Production dependency audit | Zero vulnerabilities |
| Development dependency audit | Five high-severity entries from the existing `braces` advisory and its ancestors |
| CLI `uv sync --frozen --dev` | Passed |
| CLI `uv run ruff check src tests` | Passed |
| CLI `uv run pytest` | 45 passed |
| CLI `uv run ragvi verify` | All seven checks passed |
| CLI `uv build` | Wheel and source distribution built |
| Built-wheel installation in isolated `/tmp` environment | Passed; installed executable verification and tutorial passed |
| Fresh source tutorial | Passed; 6/10 → 9/10, BM25, k=2 |
| Report browser baseline | Opened through `file://`; no page overflow at all six requested viewports |
| Report print | PDF generated and print-media viewport visually inspected; complete pagination and closed-disclosure printing remain unverified |
| Local landing/docs screenshots | Blocked by build failure |
| Deployed landing/docs fallback | Hostname failed to resolve in Chromium; no captures represented as successful |

The failed build is preserved in
[`turbopack-panic.log`](../verification/identity/baseline/turbopack-panic.log).
The exact generated baseline HTML is archived as `tutorial.html.gz`; decompression
restores the original bytes, including whitespace emitted by the existing template.
The directly openable original remains at
`/tmp/ragvidence-identity-baseline/first-run/reports/tutorial.html`.
The production and development audit JSON files are saved in the same directory.
The dependency path is:

```text
eslint-config-next@16.4.0
→ @next/eslint-plugin-next@16.4.0
→ fast-glob@3.3.1 → micromatch@4.0.8 → braces@3.0.3
```

Registry checks still show `braces@3.0.3` as latest and
`eslint-config-next@16.4.0` as latest. The audit proposes downgrading the lint
configuration to 14.2.35, incompatible with the current stack. No forced fix,
override, advisory suppression, bundler switch, or dependency downgrade was made.
Within-range updates found: Lucide 1.56.0 and Node 24 types 24.19.2. ESLint 10 and
TypeScript 7 need peer-compatibility review and are not automatic upgrades.

## Visual and implementation findings

- **Repeated glass:** `glass-panel` and `surface` apply 36px backdrop blur,
  white gradients, inset highlights, and a large 24px/64px shadow. The same
  treatment appears on capability cards, plans, docs navigation, tables, code,
  tutorial preview, and the table of contents. Header blur is 32px.
- **Gray-heavy surfaces:** canvas #141414, panel #1b1b1b, raised #262626, line
  #3b3b3b, and white identity accents make regions visually similar. Two large
  white radial gradients strengthen the gray appearance.
- **Shape and borders:** website components are mostly square and use many
  opacity variations of the same border. The CLI report mixes 5, 9, 10, 11,
  12, 13, 16, and 22px radii with pill labels. The public report differs again.
  The user's requested 6/9/12/16px system takes precedence over the older
  square-edge convention in the website AGENTS.md.
- **Terminal duplication:** hero terminal, docs examples, plan install value,
  and final tutorial command have separate wrappers and padding. Font sizes
  range from 12px to 14px; docs labels are 10px. Clipboard failure/retry and
  announcements already exist and should be reused. Raw content copying must
  remain independent of any visible prompt.
- **Documentation limits:** left navigation occupies 256px with a nested
  viewport-height scroller. It appears only at 1024px, leaving tablet navigation
  as a disclosure. The h2-only table of contents consumes article space and has
  no section tracking or right rail. Stable heading IDs already exist. The 80%
  desktop shell would compress three columns at 1280px; use a docs-specific width.
- **Report hierarchy:** the title emphasizes the product, not the experiment or
  outcome. Separate six-card baseline/intervention summaries give index time
  equal weight to sufficiency. Every question's header and five-metric grid are
  expanded; only hits are collapsed. Baseline and intervention repeat all 12
  questions independently, with no explicit gained/lost/missing evidence. Stable
  cases dominate the page. Review must prioritize regressions and unresolved
  failures. Diagnosis already includes evidence, confidence, next experiment,
  and a causation limitation; its interpretation needs a clearer visual boundary.
- **Sample drift:** the CLI produces the light violet/cyan report shown in the
  fresh baseline, while the supplied report screenshot/public sample use an
  independently modified dark/neutral presentation and appearance controls.
  Redesign the Jinja source and copy exact generated output afterward.
- **Typography:** website narrative card text is often 14px and supporting text
  12px; command/metadata text is sometimes smaller. Report metric labels are
  about 11.5px, evidence metadata about 13px. The existing Geist fonts are locally
  packaged on the website. The report requests Inter but embeds no font, so it
  actually falls back to system fonts. Offline portability must be retained.
- **Responsive risks:** the fresh report has no horizontal page overflow, but
  single-column metric cards push the intervention/result far below the mobile
  fold. Long report hashes wrap. The website hero puts installation in the
  second stacked column, risking an offscreen command on mobile. A three-column
  docs layout must reserve adequate article width and activate at sufficient width.
- **Accessibility risks:** no complete AA contrast or keyboard audit is claimed
  while the local site cannot run. Docs search replaces the input outline with
  a border at only signal/40; verify its visibility. Existing mobile disclosure,
  copy announcements, reduced-motion rules, skip link, and text status labels
  are strengths to preserve. Current report CSS has no explicit focus treatment
  or reduced-motion override. Print retains a dark gradient hero; closed evidence
  printing and page breaks need dedicated verification.

## Tutorial and security boundaries

Fresh results are recorded in
[`tutorial-results.json`](../verification/identity/baseline/tutorial-results.json):
10 answerable questions plus 2 unanswerable N/A cases; 3 Fail → Pass, 0 Pass →
Fail, 6 Pass → Pass, and 1 Fail → Fail. This is bundled teaching data.

`reporting/html.py` enables Jinja autoescaping and StrictUndefined. The payload
has schema version 1. Evaluations include question IDs, split, required IDs,
metrics, and hits, but omit question prose. The future template must use available
IDs/labels unless an explicit schema change is separately designed; do not silently
add fields or fabricate question text. Comparison and diagnosis calculations stay
unchanged. Generated report HTML contains no scripts or remote assets.

## Supplied media review

Reviewed the three supplied screenshots in `/home/medo-id/projects/`: landing,
Semantic workflow documentation, and report. They show repetitive gray panels,
small labels/code, and long duplicated report question lists.

The supplied `walkthrough.webm` is VP9, 1280×720, 60fps, 24 seconds, 2,938,076 bytes,
with one video stream and no audio/caption streams. Browser metadata and sampled
frames are saved with the audit. The opening has excess empty terminal space;
baseline/intervention require separate reading; at the 12s transition text overlaps;
the 20s evidence zoom clips text on the right. The current website also presents
player/chapter controls. A new 35–50s native 1080p60 recording must wait for the
real report redesign and must use clean cuts, longer reading holds, and restrained
cursor movement. No existing recording was upscaled or replaced.

## Proposed files by milestone

These are proposals, not implemented changes. Include a dated verification note
and relevant screenshots with each later milestone commit.

| Milestone | Files proposed |
| --- | --- |
| 1 — Identity | `src/app/globals.css`, `src/components/brand.tsx`, `src/app/opengraph-image.tsx`; compatible dependency updates in `package.json` and `package-lock.json` after the baseline build can pass |
| 2 — Surfaces | `src/app/globals.css`, `src/components/product-sections.tsx`, `src/components/cli-demo.tsx`, `src/components/docs-sidebar.tsx`, `src/components/doc-page.tsx`, `src/components/doc-renderer.tsx`, `src/app/page.tsx`, `tests/browser/site.spec.ts` (replace the obsolete requirement for 36px glass) |
| 3 — Shape | `src/app/globals.css`, `src/components/site-header.tsx`, `src/components/copy-command.tsx`, `src/components/cli-demo.tsx`, `src/components/docs-sidebar.tsx`, `src/components/doc-page.tsx`, `src/components/doc-renderer.tsx`, `src/components/product-sections.tsx`, `src/app/page.tsx` |
| 4 — Typography | `src/app/globals.css`, `src/components/doc-renderer.tsx`, `src/components/docs-sidebar.tsx`, `src/components/cli-demo.tsx`, `src/components/product-sections.tsx` |
| 5 — Landing | `src/app/page.tsx`, `src/components/cli-demo.tsx`, `src/components/product-sections.tsx`, `src/components/section-heading.tsx` |
| 6 — Documentation | `src/app/docs/layout.tsx`, `src/components/docs-sidebar.tsx`, `src/components/doc-page.tsx`, new `src/components/on-this-page.tsx`, `src/app/globals.css`, `tests/browser/site.spec.ts` |
| 7 — Code system | New `src/components/code-block.tsx`; `src/components/copy-command.tsx`, `src/components/doc-renderer.tsx`, `src/components/cli-demo.tsx`, `src/components/product-sections.tsx`, `src/app/globals.css`, `tests/browser/site.spec.ts` |
| 8 — Real report | CLI `src/ragvidence/reporting/templates/report.html.j2`, `tests/unit/test_reporting.py`; website generated `public/sample-report.html`, report-specific assertions in `tests/browser/site.spec.ts`, `README.md` provenance description |
| 9 — QA | `tests/browser/site.spec.ts`, `verification/identity/`; focused fixes only where QA finds a defect |
| 10 — New video | `scripts/record-walkthrough.mjs`, `scripts/render-demo-frames.mjs`, `src/components/product-demo.tsx`, `src/components/product-walkthrough.tsx`, `public/media/walkthrough.mp4`, `public/media/walkthrough.webm`, `public/media/walkthrough-poster.webp`, `public/media/walkthrough-provenance.json`, `tests/browser/site.spec.ts`, `README.md` |
| 11 — Synchronization | Exact generated `public/sample-report.html`, `verification/identity/`; CLI `README.md` public documentation links if verified corrections are needed |

## Resume conditions

The user requires stopping a milestone on failed builds/security checks. Restore
production Turbopack worker access in the execution environment and rerun the
baseline gate. The development advisory needs a compatible upstream fix or an
explicit decision from the user about this existing development-only limitation.
Do not mark a blocked build, unavailable site, missing website screenshot, or
unperformed browser regression test as passing. Milestones 1–11 remain pending.
