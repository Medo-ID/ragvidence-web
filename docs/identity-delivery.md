# RAGvidence identity delivery — October 13, 2026

Milestones 1–11 are implemented and separately committed. Final verification remains
pending the user's confirmation that the standard `npm run build` succeeds locally
or on Vercel. The Webpack gates below passed; they do not certify Turbopack.

## Changes by repository

**ragvidence-web:** Abyssal Teal identity, near-black solid surfaces, consistent
6/9/12/16px shapes, readable Geist typography, clearer installation/tutorial proof,
honest Free/future Plus positioning, responsive documentation rails and disclosures,
current-section tracking, and a shared accessible terminal/code system. The public
sample is exact generated CLI output. Native video respects reduced motion and
pauses outside the viewport. Existing routes, static generation, metadata, security
headers, and default Turbopack build command are retained.

**ragvidence CLI:** The real Jinja template prioritizes the experiment outcome,
comparison, regressions/unresolved questions, diagnosis, and paired ranked evidence.
Native disclosures reduce initial density; print exposes complete evidence. Fonts
and licenses are embedded locally. Escaping and strict undefined handling remain
enabled. No report JavaScript, remote assets, metric changes, retrieval changes,
or artifact schema changes. Compatible locked dependencies and public README
references were updated separately.

No accounts, telemetry, analytics, backend, hosted customer data, checkout, invented
customer claims, or paid feature promises were introduced.

## Commit record

| Milestone | Website commit | CLI commit |
|---|---|---|
| 0: audit and baseline | `2c91723`, preserved unchanged | original CLI baseline `e9f83a3` |
| Verification support | `6b9fe79` | — |
| 1: identity | `913fe12` | — |
| 2: surfaces | `f21596b` | — |
| 3: shape | `98e8c70` | — |
| 4: typography | `b1b22dd` | — |
| 5: landing | `c4f9e43` | — |
| 6: documentation | `46fb6a9` | — |
| 7: terminals/code | `facc6f4` | — |
| 8: generated report | `8316a93` | dependency preparation `03f096f`; template/tests `a308f1f` |
| 9: responsive/accessibility QA | `aca487a` | print refinement `07a133e` |
| 10: native walkthrough | `d216091` | — |
| 11: synchronization/delivery | commit containing this file | `735acee` |

## Verification

Clean install and clean-snapshot lint/type checking **before** build passed. The
Webpack production build, four verification regression tests, and 42 Chromium
tests passed. Production dependency audit: zero advisories. Explicit production
smoke check: 36 routes and 123 internal links/fragments, including documentation
anchors and security headers. Fifteen unique source README destinations pass
against the local production server. No unexpected external requests were observed.

[Clean snapshot logs](../verification/identity/final-clean/checks.json),
[working-tree gate](../verification/identity/milestone-11/checks.json),
[responsive observations](../verification/identity/milestone-11/observations.json),
[README destination checks](../verification/identity/milestone-11/public-references.json).

CLI: `uv sync --frozen --dev`, `uv run ruff check src tests`, `uv run pytest`
(53 passed), `uv run ragvi verify` (seven passed fixtures), and `uv build` passed.
The built wheel was installed into a separate environment; installed `ragvi verify`
and `ragvi tutorial` passed. Full original and final tutorial evaluations match,
including per-question metrics, evidence IDs, ranks, retriever scores, and previews.

The report matrix covers baseline-only, paired comparisons, answerable/unanswerable,
all four change classifications, empty hits, absent diagnosis/optional fields,
long questions/previews, and hostile-looking HTML. Escaping, no script/remote assets,
no page overflow, and offline `file://` behavior were checked.
[Browser matrix](../verification/identity/milestone-9-matrix/results.json).

The normal `npm run verify` includes Turbopack and remains environment-blocked.
Its available stages were run individually through the approved Webpack gate.
The normal production architecture, caching, and security configuration were not
changed to accommodate the restricted runtime.

## Screenshots and visual review

| View | Before | After |
|---|---|---|
| Desktop landing hero | [1440px](../verification/identity/baseline-web/landing-1440.png) | [1440px](../verification/identity/milestone-11/landing-1440.png) |
| Mobile landing hero | [390px](../verification/identity/baseline-web/landing-390.png) | [390px](../verification/identity/milestone-11/landing-390.png) |
| Documentation | [desktop](../verification/identity/baseline-web/docs-1440.png) | [both rails](../verification/identity/milestone-11/docs-1440.png) |
| Tutorial proof | [before](../verification/identity/baseline-web/proof.png) | [after](../verification/identity/milestone-11/proof.png) |
| Free versus Plus | [before](../verification/identity/baseline-web/plans.png) | [after](../verification/identity/milestone-11/plans.png) |
| Actual generated report | [original CLI](../verification/identity/baseline/cli-report-1440-viewport.png) | [summary](../verification/identity/final-report/summary-1440.png) |

Mobile documentation: [navigation](../verification/identity/milestone-11/docs-navigation.png)
and [separate On this page disclosure](../verification/identity/milestone-11/docs-toc.png).
Report: [change analysis](../verification/identity/final-report/change-analysis.png),
[expanded recovered question](../verification/identity/final-report/question-1440.png),
[mobile evidence](../verification/identity/final-report/question-390.png),
[grayscale](../verification/identity/final-report/grayscale-changes.png),
[print preview](../verification/identity/final-report/print-preview.png),
[actual PDF summary](../verification/identity/final-report/print-page-1.png),
[actual PDF evidence](../verification/identity/final-report/print-page-5.png).

All requested sizes were captured and reviewed:

| Viewport | Landing | Documentation | Generated report |
|---|---|---|---|
| 360×800 | [image](../verification/identity/milestone-11/landing-360.png) | [image](../verification/identity/milestone-11/docs-360.png) | [image](../verification/identity/final-report/summary-360.png) |
| 390×844 | [image](../verification/identity/milestone-11/landing-390.png) | [image](../verification/identity/milestone-11/docs-390.png) | [image](../verification/identity/final-report/summary-390.png) |
| 768×1024 | [image](../verification/identity/milestone-11/landing-768.png) | [image](../verification/identity/milestone-11/docs-768.png) | [image](../verification/identity/final-report/summary-768.png) |
| 1280×800 | [image](../verification/identity/milestone-11/landing-1280.png) | [image](../verification/identity/milestone-11/docs-1280.png) | [image](../verification/identity/final-report/summary-1280.png) |
| 1440×900 | [image](../verification/identity/milestone-11/landing-1440.png) | [image](../verification/identity/milestone-11/docs-1440.png) | [image](../verification/identity/final-report/summary-1440.png) |
| 1920×1080 | [image](../verification/identity/milestone-11/landing-1920.png) | [image](../verification/identity/milestone-11/docs-1920.png) | [image](../verification/identity/final-report/summary-1920.png) |

No horizontal page overflow, clipped installation command, overlapping sticky
regions, or unreadably narrow desktop article was found. Essential text/controls
passed rendered WCAG AA contrast checks. Keyboard focus, logical navigation,
copy accessible names/exact values/failure recovery, 44px documentation touch targets,
heading offsets, disclosure operation, and current-section identification passed.
Reduced motion disables autoplay and media requests. Reports remain useful with
JavaScript disabled, and classification labels/arrows preserve meaning in grayscale.
Print exposes all 12 questions and all 48 ranked evidence items over 18 pages.

These are Chromium tests and manual visual checks, not cross-browser or assistive
technology certification. The long desktop documentation navigation deliberately
keeps one bounded scroll region; compact navigation scrolls with the page. Native
video controls remain absent as requested; the written tutorial supplies the
step-by-step reference and reduced-motion users receive the poster.

## Generated report and media

[Fresh tutorial report](../verification/identity/final-report/generated-tutorial.html)
and [synchronized public sample](../public/sample-report.html) are identical:
SHA-256 `8b82b8c9ad7927ebb98a3b76a0a8346d387f19e11cef6d874922658f4ef7c93c`.
The original generated workspace is `/tmp/ragvidence-final-delivery/first-run`;
the committed delivery copy preserves the artifact independently of temporary files.
[Complete print PDF](../verification/identity/final-report/report.pdf)
and [print content checks](../verification/identity/final-report/print-check.json).

Tutorial: ten answerable labeled questions, BM25, k=2, body versus heading-context,
60% → 90%, +30 percentage points, three Fail → Pass, zero Pass → Fail,
six Pass → Pass, one Fail → Fail. Two additional unanswerable labels appear as N/A.
This is reproducible bundled tutorial data, not a customer claim or general promise.

| Artifact | Codec | Dimensions / rate / duration | Bytes |
|---|---|---|---:|
| [MP4](../public/media/walkthrough.mp4) | H.264 | native 1920×1080 / 60 FPS / 48 s | 2,654,144 |
| [WebM](../public/media/walkthrough.webm) | VP9 | native 1920×1080 / 60 FPS / 48 s | 4,141,080 |
| [Poster](../public/media/walkthrough-poster.webp) | WebP | 1920×1080 | 110,238 |

Both video encodes use CRF 20 and contain 2,880 frames with no audio/subtitle stream.
Full decode completed without errors. Native screenshots and decoded frames were
visually inspected for terminal/evidence readability. Two 118% zooms use 400ms
transitions, with clean cuts and stationary reading pauses. The original 720p video
was not an input. No media controls, browser chrome, confidential data, or personal
paths appear. [Capture provenance](../public/media/walkthrough-provenance.json)
and [codec/full-decode checks](../verification/identity/milestone-10-media/results.json).

## Performance and remaining checks

Performance data is recorded in
[frontend-measurements.json](../verification/identity/milestone-11/frontend-measurements.json).
It compares production Webpack builds at pre-identity commit `6b9fe79` and final
source, three cold browser contexts per route/profile. Mobile uses 4× CPU, 50ms
latency and 200KB/s; desktop uses unthrottled CPU and local fast network. Copy
feedback uses a mocked clipboard to isolate UI response. These local observations
are not production/customer performance claims.

Median values across three samples; bytes below are encoded response-body bytes,
not the uncompressed build output. Raw CSS decreased from 35,334 to 34,763 bytes;
encoded CSS increased slightly from 7,598 to 7,671 bytes.

| Profile / route | Client JS bytes, before → after | LCP ms, before → after | Copy feedback ms, before → after |
|---|---:|---:|---:|
| Mobile / landing | 152,024 → 151,973 | 624 → 604 | 12.6 → 12.9 |
| Mobile / documentation | 152,024 → 151,973 | 564 → 544 | 13.9 → 14.9 |
| Desktop / landing | 153,517 → 154,049 | 212 → 160 | 1.8 → 1.8 |
| Desktop / documentation | 152,024 → 151,973 | 152 → 148 | 2.7 → 2.0 |

Small timing differences are within the limits of this local sample; no universal
speed improvement is claimed. Payload totals count JavaScript requests observed
during each measurement window; prefetch timing may influence desktop differences.

The development-only advisory path is `eslint-config-next → @next/eslint-plugin-next
→ fast-glob@3.3.1 → micromatch@4.0.8 → braces@3.0.3`. The user temporarily accepts
it because the production audit passes. No compatible remediation was available
in the checked registry snapshot; track a future compatible lint-stack update.
No force fix, Next.js downgrade, or unsafe override was applied.

Normal Turbopack build confirmation is required from the user before final
verification can be called complete. Vercel deployment/live-domain verification,
GitHub push, and the next PyPI release were not performed. Source README links and
metadata point to final public routes; the currently published PyPI description
will receive the corrected links on release. The redesigned CLI report likewise
requires a package release before production installation delivers it.

## Continuation prompt

```text
Continue the RAGvidence identity delivery in /home/medo-id/projects/ragvidence-web
and /home/medo-id/projects/ragvidence. Read docs/identity-delivery.md and
docs/identity-progress.md, inspect both git statuses, and preserve baseline 2c91723.
Milestones 1–11 are implemented with separate commits and recorded visual/check
artifacts. Do not rebuild or repeat passing checks without a new reason. Webpack
verification is complete; final verification remains pending my confirmation of
the normal Turbopack npm run build locally or on Vercel. Keep the accepted
development-only braces limitation and clean production audit documented. Do not
publish, push, release, deploy, or add accounts/analytics/checkout unless requested.
Incorporate my build result, fix any actual failure at its cause, and update the
delivery verification record. The final report must remain generated from the
CLI source, escaped, self-contained, and JavaScript-free.
```
