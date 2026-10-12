# Neutral website and silent product demo

October 12, 2026. This supersedes the preceding teal/glass report presentation
and captioned walkthrough. The reference was the live [Supabase homepage](https://supabase.com/),
including the nested, lazy-loaded table-editor video and its actual public asset.
The reference asset is a 28.2-second, 30fps VP9 WebM; its markup establishes muted
looping playback, but does not identify the recording tool. Reference assets
remain in the temporary review directory and are not shipped with this website.

## Visual changes

- Removed the teal/cyan tokens, lighter teal links, blue-gray neutral surfaces,
  and colored action fills. Shared canvas/panels/text now use neutral charcoal,
  gray, and off-white. Green, red, and amber remain meaningful status colors.
  Navigation, documentation, trust/release pages, sharing artwork, and browser
  theme metadata follow the same palette.
- Website panels use a brighter reflected edge, diagonal sheen, a translucent
  neutral base, deeper shadows, and 36px backdrop blur. Navigation uses 32px blur.
  Opaque browser fallbacks and plain print styling remain available.
- Kept the hero's composition and intrinsic height reservation across all four
  tutorial panels. Removed the header/footer separators and increased vertical
  padding in the guided preview. Inactive controls remain hidden and inert.
- Rebuilt the remaining sections around varied card grids, side-by-side feature
  explanations, a framed demonstration, resource cards, and restrained dividers.
  Corners remain square. Icons identify workflows and destinations. The Free
  install copy control remains available; Plus is explicitly future direction.
- Reporting HTML is fully opaque. Removed backdrop blur, gradients, glass grain,
  and decorative shadows. Neutral surfaces, readable prose, alternating table
  rows, tabular numbers, and wider responsive summary cards favor inspection.
  The four comparison cards use their own balanced grid. Auto/Light/Dark and
  offline/print behavior remain supported.

The report's complete main content is unchanged. Its before/after SHA-256 is
`5b06bc750cbb095d2b16a3e750d3bc21502634c42ed235e347616efb151f1ce3`.
Recorded timestamps, dataset hash, source excerpts, diagnoses, and values are
preserved. Only presentation CSS changed.

## Media

The replacement is a 24-second 1280×720 VP9 WebM at 60fps: 1,440 encoded frames,
with no audio or caption track. The authoring script executes the released
v0.1.0 CLI in a new isolated environment, checks its version and health, and runs
the real tutorial. It validates 6/10 versus 9/10, k=2, three recovered questions,
zero regressions, and one persistent failure before capturing report states.

Actual report-link navigation and ranked-evidence expansion are captured in
Chromium. Command typing, cursor movement/click feedback, camera zoom, transitions,
and timing are composed in post-production over those authentic states. The
report uses the same opaque presentation CSS. This creates a product demonstration
without inventing a browser dashboard for a CLI product. Host install caches may
be reused; provenance records the exact commands and their output.

The player starts a muted loop when visible, pauses off-screen, and includes an
explicit pause/play button. Keyboard-operable chapter tabs seek to Run, Compare,
and Inspect. Reduced motion shows the poster until explicitly played. A written
tutorial and error/download fallback remain available. The superseded caption
track, PNG poster, and caption-alignment helper were removed; Git history retains
the previous recording and authoring workflow.

## Verification and observations

Production verification uses the established clean checkout described in the
earlier verification notes, with identical manifest, lockfile, Next config, and
Turbopack loader. No dependency or bundler change was made. The original workspace
worker restriction remains a previously recorded environment limitation.

The new browser regressions cover viewport-driven playback, manual pause,
keyboard chapter selection, off-screen pausing, reduced-motion opt-in, silent
playback, neutral action colors, opaque report surfaces, and at least 4.5:1 contrast
for representative report text/numbers in light and dark modes. Existing checks
retain search failure recovery, clipboard feedback, navigation, print readability,
JavaScript-disabled access, containment, and stable hero height at six widths.

The complete gate passes: ESLint, TypeScript, production build, 33 routes and
117 internal links/fragments with security headers, all four verifier regressions,
all 26 Chromium tests, and a clean production dependency audit. Responsive tests
caught an intrinsic-width issue after restoring the Free edition's copy control;
an explicit mobile grid column fixed it, and all six tested widths now pass.
Desktop/mobile screenshots include the hero, complete section layout,
demo, docs, trust content, and both report themes. No uncaught page errors were
observed during the completed visual review.

A separately started final production build also passes the explicit smoke check
on port 3001. Review servers were stopped after checking. Final diff whitespace
checks pass. The report main-content checksum remains identical after the last
responsive summary-grid adjustment.

The same unthrottled localhost asset script sampled home/docs at 390px and 1440px,
after loading and framework prefetching. Observed JavaScript: 610,081 raw / 190,768
summed gzip bytes (previously 605,358 / 189,411). CSS: 35,751 raw / 7,658 summed
gzip bytes (previously 37,579 / 7,993). The small client playback boundary adds
4,723 raw JavaScript bytes; the rebuilt sections remove 1,828 raw CSS bytes.
Local LCP samples were 92–252ms and automated interactions 38–99ms. These are
observations, not controlled benchmarks or production performance claims.

The final WebP poster is 29,686 bytes versus the preceding 306,178-byte PNG. The
edited video is 2,938,076 bytes versus the preceding 5,035,435-byte recording.
Video has preload none and is not
requested before the player enters view in the tested browser. Exact artifact
sizes are available in Git and the media directory.

Hosted CI, push/deployment, domain/DNS checks, and exhaustive browser/platform
certification remain outside this local pass. The known development-only advisory
is unchanged; production dependency auditing remains clean.
