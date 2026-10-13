# Identity refinement verification

Baseline commit: `2c91723` (unchanged).

The user accepted the existing development-only braces advisory on October 13,
2026 and authorized Webpack production verification in this restricted execution
environment. Its dependency path and registry status remain recorded in
`identity-audit.md`. Production audits must still pass. No forced fix, downgrade,
or unsafe dependency override is allowed.

The normal `npm run build`, Turbopack loader, caching/prefetch flags, and security
headers remain unchanged. Webpack-only verification applies the existing Tailwind
compiler before Next.js's existing PostCSS loader, because a plain Webpack build otherwise emits raw
Tailwind directives and lacks utility CSS. No alternate CSS compiler was added.

Final verification remains pending until the user confirms the normal Turbopack
build locally or on Vercel. Webpack results cannot certify that build.

## Milestone 1 — Identity

Abyssal Teal #063f47 anchors the palette with pale teal text/focus accents, near-black
canvas, and separate semantic colors. Updated Lucide to 1.56.0 and Node 24 types to
24.19.2; retained the compatible Next/React/lint/TypeScript majors. All available
checks passed, including 26 browser tests and a clean production audit. Reviewed
desktop/mobile screenshots; no page overflow, script errors, or external requests.
Card translucency is addressed separately in Milestone 2.

## Milestone 2 — Surfaces

Ordinary surfaces, documentation navigation, tables, and code wrappers are solid.
Removed gradients, glows, and panel blur/shadows. Added raised, teal, selected,
success, danger, and warning primitives; header blur is limited to 8px. All available
checks passed, including 26 browser tests. Reviewed desktop/mobile layouts and
confirmed no panel blur, overflow, console errors, or external requests.

## Milestone 3 — Shape

Applied 6/9/12/16px tokens to controls, navigation, copy buttons, code shells,
cards, disclosures, and the hero showcase. Tables round at their outer wrapper.
All available checks and 26 browser tests passed. Desktop/mobile visual review
confirmed consistent edges without adding shadows or blur.

## Milestone 4 — Readability

Documentation prose/list text and commands use 16px with comfortable line height;
product narrative text is larger, and secondary labels remain 12–14px. Search
focus has a visible 2px pale-teal outline. Self-hosted Geist fonts are retained.
All available checks passed, including 27 browser tests and rendered AA contrast
checks for essential website text. Reviewed desktop/mobile text and code scrolling.

## Milestone 5 — Landing

Installation is wrapped and visible above the fold at all six target sizes. The
hero explains local retrieval diagnosis and the HTML deliverable; teal provides
one primary CTA. Removed decorative grid and reduced showcase padding. Capabilities
use compact rows, workflow steps use separators, and proof emphasizes +30 percentage
points with recovered/regressed/unresolved counts. Free says Available now; Plus
says Future Plus direction with no checkout. All available checks and 33 browser
tests passed. Reviewed hero, proof, and plans on desktop/mobile.

## Milestone 6 — Documentation

Desktop at 1280px+ has sticky left navigation, a comfortable main article, and
a sticky right h2/h3 rail with current-section tracking. Below 1280px both navigation
and the table of contents use keyboard-accessible disclosures without an empty rail.
Heading offsets account for the site header. Long desktop navigation retains one
bounded scroller; article and compact disclosures scroll with the page. All available
checks and 34 browser tests passed, including rail width, section tracking, anchors,
keyboard disclosures, search, and route transitions. Reviewed desktop and mobile.

## Milestone 7 — Terminal system

One CodeBlock foundation now renders hero commands, docs examples, install values,
report paths, and tutorial commands. Consistent dark background, teal border, 12px
radius, label/header/copy position, Geist Mono, wrapping for installation, and
horizontal keyboard scrolling for long examples. Copy uses exact raw content and
retains success/failure announcements and retry. Non-shell values have no prompt.
All available checks and 35 browser tests passed, including .env/JSONL exact-copy
checks. Reviewed desktop/mobile terminals and documentation.

## Milestone 8 — Real report and synchronized sample

The CLI source now has an outcome-first summary, unified run comparison, prioritized
change groups, explicit diagnosis boundaries, and collapsed paired ranked evidence.
Embedded Geist fonts/OFL license make the artifact self-contained. Escaping remains
enabled and the schema/metrics are unchanged. CLI checks passed with 53 tests and
installed-wheel verification. All six file:// layouts work without JavaScript or
remote requests. Actual PDF text contains all 12 questions and 48 ranked evidence
items; summary and recovered-question PDF pages were visually inspected. Full print
is verbose (28 pages); density will be assessed during Milestone 9 QA.

Copied exact generated output into the website; SHA-256
`ebbd4ad2c585c1b75412476ee08bd00c82deb7b094247db518f13740383871dc`.
All website checks and 36 browser tests passed. The HTTP verifier now distinguishes
remote attributes/CSS URLs from harmless URL text in dataset prose/font licensing;
offline browser checks confirm zero remote requests.

## Milestone 9 — Responsive and accessibility QA

All six requested viewports pass for landing, docs, and report. Installation stays
visible, desktop article width exceeds 650px with both rails, compact disclosures
work, and docs links have 44px touch targets. All available checks and 42 browser
tests pass, including visible focus, active sections, copying, motion preferences,
and offline/no-JS report behavior. No console errors or unexpected requests.

Browser matrix covers seven generated report variants at 360/1440px, including all
change classes, N/A, baseline-only/empty hits, long hostile content, and missing
diagnosis. No executable tags or overflow. Grayscale review preserves classification
meaning through labels/arrows. PDF inspection verifies all 12 questions and 48
ranked evidence items; print spacing reduces 28 pages to 18 without hiding content.
Reviewed actual rasterized summary and recovered-evidence PDF pages. These are
Chromium checks and visual review, not universal assistive-technology or cross-browser
certification.

## Milestone 10 — Native walkthrough

Fresh installed-wheel tutorial/report states captured at 1920×1080 and composed
into 2,880 frames at 60fps over 48 seconds. Two 118% zooms, 400ms transitions,
clean cuts, and a cursor whose screen size remains fixed. No old video input,
audio, narration, captions, player controls, browser chrome, or personal paths.
Both files decoded completely with zero errors: H.264 MP4 2,654,144 bytes; VP9
WebM 4,141,080 bytes; CRF 20. Reviewed native previews and decoded frames in both
formats. WebP poster and hashes/provenance are included.

Native video has no controls, pauses below 40% visibility, and shows only the
poster/no video requests under reduced motion. All available checks and 42 browser
tests passed. Reviewed the embedded showcase and its desktop/mobile surroundings.

## Milestone 11 — Final synchronization

Built and installed the final CLI wheel, verified it, and generated a fresh tutorial.
Baseline and candidate evaluation summaries and every question's metrics, IDs,
ranks, scores, and previews match the original baseline. The final tutorial remains
60% → 90%, three recovered, zero regressions, six stable passes, and one unresolved
failure. Two unanswerable questions are presented separately as N/A.

Inspected the generated file at all six viewports with JavaScript disabled before
copying it unchanged to the website. The generated artifact, recorded delivery copy,
and public sample share SHA-256
`8b82b8c9ad7927ebb98a3b76a0a8346d387f19e11cef6d874922658f4ef7c93c`.
Print verification confirms 18 pages, all 12 questions, and all 48 ranked hits.

CLI frozen sync, Ruff, all 53 tests, seven verification fixtures, wheel/sdist build,
and installed-package tutorial passed. Website checks passed in the working tree
and an isolated clean snapshot: npm ci, lint, TypeScript before build, Webpack
production build, four verifier tests, 42 browser tests, routes, and production audit.
Explicit production smoke verification passed 36 routes and 123 internal links or
fragments. All 15 unique README destinations resolve against the local production
site. Public license/notices copies match the CLI sources.

Reviewed final screenshots, documentation disclosures/rails, evidence, grayscale,
and actual printed pages. The source README now uses final public routes. Published
PyPI description updates require a release; GitHub changes require a push, and live
website verification requires deployment. No release, push, or deployment was done.
Standard Turbopack remains pending the user's confirmation, as agreed.

See [identity-delivery.md](identity-delivery.md) for commits, artifacts, findings,
performance measurements, limitations, and a continuation prompt.

## User follow-up — Own-data video and playback

The user requested a more useful workflow video and full-area click pause/resume.
[walkthrough-follow-up.md](walkthrough-follow-up.md) records the separate playback
commit `0b2996a` and the replacement video milestone. Current media is a genuine
36-second BM25/local-semantic benchmark on temporary synthetic shop data, native
1920×1080 at 60fps. The 60% → 90% tutorial proof and sample report remain unchanged.
All available gates pass, with 45 browser tests and full-frame decode checks.
The mock workspace is removed after export; final Turbopack confirmation is pending.

The later first-click autoplay report was reproduced with metadata-only readiness.
Visibility now requests playback without waiting for frame readiness and enables
native muted autoplay. The initial play hint is removed during automatic startup.
The gate passes 46 Chromium tests; focused playback checks also pass in Firefox.
See the latest section of walkthrough-follow-up.md for evidence and limitations.

The final page-load revision follows the user's requested native autoplay approach:
autoplay/muted/loop/inline attributes and sources exist before hydration, with no
viewport gating. Native source queries preserve reduced motion. Supabase's rendered
video pattern was inspected as requested. The gate passes 48 Chromium tests and
16 focused checks across Chromium/Firefox, plus six-size visual review.

## User follow-up — Final styling touches

Thin native teal scrollbars, a single desktop docs divider, unfilled current-section
styling, and a more transparent navbar are recorded in
[finishing-touches.md](finishing-touches.md), including before/after screenshots.
Lint, types, Webpack, routes, verifier tests, scoped Chromium/Firefox checks, and
production audit passed. Both engines were reviewed at all six requested sizes.
The user's subsequent autoplay fix and heading edit remain untouched and uncommitted.
This styling milestone does not certify the full video regression suite or the
standard Turbopack build, which still awaits user confirmation.

## User follow-up — Documentation hierarchy and custom scrollbars

Categories use 36px separation with compact desktop links and preserved mobile
touch targets. Custom CSS scrollbar geometry and a 60% navbar tint address the
follow-up in [navigation-polish.md](navigation-polish.md). Lint, types, Webpack,
routes, verifier tests, 39 scoped Chromium tests, 15 Firefox docs tests, and the
production audit passed. Six-size screenshots and native scrollbar drag/keyboard
checks are recorded. User heading/video edits remain untouched and excluded from
the commit; standard Turbopack confirmation remains pending.

## User follow-up — Logo and favicon

A geometric Abyssal Teal R mark now accompanies the Geist wordmark in the shared
header/footer component. [brand-assets.md](brand-assets.md) lists transparent
light/dark SVG and PNG exports, native 16/32/48px ICO frames, SVG favicon, and
180px Apple icon, with regeneration instructions and visual evidence. Lint, types,
Webpack, 45 routes/125 links, four verifier tests, 39 scoped browser tests, and
production audit passed. Six-size Chromium/Firefox review covers logo loading,
focus, navigation, and generated icon metadata. SEO is deferred; user edits and
baseline are preserved. Standard Turbopack confirmation remains pending.
