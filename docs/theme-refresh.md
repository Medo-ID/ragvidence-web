# Teal theme and stable tutorial preview

Verified October 12, 2026.

The main accent is #387478. Filled actions use light text; small text on dark
surfaces uses the derived #78b0b4 teal for readable contrast. The shared palette
covers site pages, docs, navigation, OpenGraph artwork, and both sample-report
themes. The report's main content and recorded results match the preceding commit
exactly; only presentation CSS changed.

Glass surfaces have brighter edge reflections, diagonal sheen, fine grain,
stronger backdrop blur, and more translucent backgrounds. Navigation and docs
panels use the same treatment, with opaque fallbacks and plain print surfaces.
Desktop content retains the existing 80% width (capped at 1440px), with wider
mobile layouts and generous section spacing.

All four tutorial panels occupy one grid cell. Hidden, inert panels reserve the
tallest intrinsic height without exposing their controls to assistive technology.
The hero and preview retain their height across step selection at every tested
viewport, including 320px. The larger reserved frame increases desktop hero
height to approximately 1025px at a 1440px viewport.

## Evidence

- ESLint, TypeScript, and the production Turbopack build pass in the existing
  clean verification checkout described in follow-up-verification.md.
- Full gate passes: 20 Chromium tests, four verifier regressions, 29 routes and
  117 internal links/fragments, security headers, and production dependency audit.
- A separately started production build passes the HTTP smoke check.
- Visual review includes six widths (320–1920px), mobile docs, section cards,
  and light/dark reports. No page overflow or uncaught browser errors observed.
- Final code-only accessibility adjustment gives the skip link light text on teal.
- Asset samples after framework prefetching: JavaScript 604,079 raw / 188,889
  summed gzip bytes; CSS 37,579 raw / 7,993 summed gzip bytes. Compared with the
  preceding source, this adds 350 raw JavaScript bytes and 594 raw CSS bytes.
  Local unthrottled LCP samples were 148–204ms; automated interactions 38–84ms.
  These are observations, not controlled production performance claims.

The original workspace's Turbopack worker restriction remains an environment
limitation; the clean checkout uses identical dependencies, config, and source.
No deployment or push was performed. Optional video and full-text docs search
are the next content/usability work.
