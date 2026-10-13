# Walkthrough follow-up — October 13, 2026

## Playback milestone

Files: `src/components/product-demo.tsx`, `tests/browser/site.spec.ts`, `README.md`,
this record, and `verification/identity/playback-fix/`.

The server initially renders a reduced-motion-safe poster without sources. Source
selection is now explicitly restarted when hydration adds media, and playback is
retried when a playable frame becomes available. Visibility is measured against
the usable viewport height so a tall video can play in a short window. Hidden tabs
and offscreen video pause; manual pause survives scrolling. A full-area semantic
button supports clicking anywhere and Space/Enter, visible keyboard focus, and a
play/pause accessible name. Autoplay rejection leaves the manual play action usable.
Reduced-motion users load no video unless they explicitly play it.

The first gate passed 44 tests but failed a new focus test that incorrectly expected
keyboard focus after mouse interaction. The test now enters keyboard modality.
The complete rerun passed lint, TypeScript, Webpack build, route/link/header checks,
four verifier tests, 45 browser tests, and the production dependency audit.
Visual desktop/mobile review found no overflow, console errors, or unexpected
external requests. Standard Turbopack confirmation remains pending with the user.

## Own-data video milestone

Objective: replace repeated tutorial footage with a concise, genuine workflow using
temporary synthetic customer-support data: labeled sources/questions, validation,
BM25 and semantic benchmarking at fixed k, evaluation, report creation, and ranked
evidence investigation. Keep native 1920×1080 at 60fps, no sound or captions, and
shorten execution waits. The original bundled tutorial and sample report remain
independent proof artifacts.
