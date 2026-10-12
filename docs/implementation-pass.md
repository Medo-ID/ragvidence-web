# Layout and project follow-up

Implemented October 12, 2026, following `project-review.md` and the owner's
request for 80% desktop content width, clearer section separation, translucent
components, and a softer cyan accent.

## Changes

- Shared content uses 80% width from 1024px, capped at 1440px on very large
  screens. Smaller screens use 16px side margins, increasing to 24px on tablets.
  The navigation background remains full width. Documentation keeps its readable
  article width, and the standalone report follows the same outer container.
- The hero pairs a shorter introduction with the existing interactive CLI
  preview, inspired by the Node.js homepage composition. A compact tutorial proof
  identifies v0.1.0, ten questions, BM25, and k=2. The separate walkthrough provides
  written steps and retains its optional native video/captions configuration.
- Sections have responsive 32–80px outer separation in addition to interior
  padding. Glass surfaces use neutral highlights, translucent backgrounds, blur,
  square edges, and an opaque fallback. Cyan changes from `#62e7f5` to `#c4edf1`;
  accent coverage is not increased. Sharing artwork and the report dark theme
  use the same pale cyan. The report light theme retains readable dark accents.
- Mobile docs close after a selection and restore focus to the browser summary.
  Header menus close on brand clicks and pathname changes, retain Escape/focus
  behavior, and provide installation/docs/report links without JavaScript.
- The docs sidebar receives only navigation metadata from the server. Article
  bodies no longer cross its client import boundary. Articles have an on-page
  heading index; empty search results use an accessible status message.
- Installation docs cover uv setup on macOS/Linux and Windows, official setup
  links, Python 3.12 selection, PATH, upgrading, and uninstalling. Website install
  commands consistently select Python 3.12.
- `/releases` records the published v0.1.0 release and links to PyPI and the exact
  shipped license. The license copy's SHA-256 is
  `f1e0b1f359705ed502eb60f59b9536c9ac0391e465f71b092751b9986ba6862f`.
- The HTTP verifier starts a dedicated production server, refuses occupied ports,
  fails unavailable explicit targets directly, times out requests, and cleans up
  on thrown errors. Routes derive from documentation content. It checks all five
  configured security headers, fragment destinations, sitemap doc coverage, and
  Next.js's streamed not-found/noindex behavior.
- Two committed verification-script regressions and 13 Chromium tests cover the
  meaningful interactions and responsive behavior. The full gate includes both.
  GitHub Actions uses Node 24, npm ci, Chromium, and failure artifacts. Generated
  browser reports are excluded from both Git and ESLint.

## Release verification

A fresh isolated uv tool install of `ragvidence[semantic]` from production PyPI,
explicitly selecting Python 3.12, succeeded on the development Linux host.
`ragvi --version` reported 0.1.0; all health checks passed. The tutorial generated
its HTML report, which opened in Chromium. Generated evaluations recorded 6/10
and 9/10 sufficient questions. This does not certify a clean machine or other
operating systems. Website deployment and DNS were not checked or changed.

The existing sample report's entire `<main>` content matches the committed
original byte for byte. Its results, evidence, manifests, and provenance remain
unchanged; edits are confined to presentation CSS.

## Verification status and limitations

- ESLint and TypeScript pass on the final source, including the new tests/config.
- Both verification-script regression tests pass: unavailable external targets
  do not launch a local fallback, and an occupied production port is not reused.
- An intermediate production build passed, followed by 29 route and 117
  link/fragment checks and browser screenshot inspection.
- On that build, 10 of the 13 Chromium tests passed, including navigation
  dismissal/back, clipboard rejection/retry, preview playback/reduced motion,
  no-JavaScript navigation, and desktop/tablet containment. The remaining failures
  identified a test selector matching multiple asides and real walkthrough-card
  overflow at 320/390px. The selector was scoped to the search sidebar, and the
  walkthrough now uses explicit single-column tracks and shrinkable cards.
- Final rebuilds, including permission-escalated retries, fail in Turbopack's CSS
  loader worker with `binding to a port: Operation not permitted`. Consequently
  the corrected responsive tests, final production smoke check, and full
  `npm run verify` have not passed on the final tree. Do not treat the earlier
  intermediate build or screenshots as final verification. Rerun the gate where
  the worker can bind its socket before deployment.
- Production npm audit reports zero vulnerabilities. The full audit still reports
  five high-severity package entries from the pre-existing development-only
  `braces` advisory chain; no forced downgrade was applied. `npm outdated` also
  reports optional Lucide/Node-types updates and incompatible newer ESLint and
  TypeScript majors; dependencies were not broadly upgraded.
- A clean website npm ci and the hosted GitHub workflow were not executed here.
  Browser tooling, screenshots, and isolated CLI workspaces are temporary files
  under `/tmp`, separate from application dependencies and content.

An intermediate before/after asset measurement reduced post-load referenced
JavaScript from 627,096 to 603,881 raw bytes (196,457 to 188,814 summed gzip bytes).
CSS was approximately 36.7KB raw / 7.8KB gzip. Local LCP samples ranged from 84–228ms
and automated interaction samples from 31–92ms; these are unthrottled localhost
observations, not user-performance claims. Final measurements await the successful
final build, particularly after the last demo/containment adjustments.
