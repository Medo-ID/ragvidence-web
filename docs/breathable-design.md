# Product spacing, translucent surfaces, and report themes

Implemented October 9, 2026, on top of the existing uncommitted design pass.

The opening message now has its own centered layout. The interactive CLI preview
moves into an integrated walkthrough window below it, where the future recording
will appear. Section padding scales from 80px to 144px; cards have wider gaps and
more interior space. Navigation uses a translucent background, a subtle surface
texture, and backdrop blur, with an opaque fallback. Panels keep square edges.

`ProductWalkthrough` accepts an optional video configuration. An MP4 and English
captions replace the preview inside the same frame, with an optional poster,
native controls, inline playback, and a reserved 16:9 aspect ratio. Playback is
manual and video preload is disabled. Until those assets are supplied, visitors
see the interactive preview and the recording status. See README for the wiring.

The sample HTML report follows the website's cyan accents, square panels, spacing,
and translucent navigation. Its Auto/Light/Dark radio controls use CSS only. Auto
follows the system preference; explicit choices apply to the open document.
Appearance selection does not use storage, scripts, cookies, or remote assets.
Print uses a light palette and hides navigation. Theme controls and evidence
disclosures remain usable when the report is opened locally without JavaScript.

## Report provenance

The original generated report's SHA-256 is
`3280912191c5a571a7d6bc5cc75a8702918938451f66722cebe3ea8198fe4bdf`.
The change affects presentation and adds navigation/appearance controls. Every
text value inside the original report's main content matches after whitespace
normalization, including evidence previews, scores, dataset hash, run IDs,
timestamps, limitations, and environment metadata. This is a website presentation
of the v0.1.0 tutorial output; the CLI's report generator lives in another repo.

## Verification

- `npm run check`: lint, TypeScript, and production build pass.
- Production server on port 3001: `npm run verify:site` passes all 27 routes and
  26 internal links, including security headers and the script-free report check.
- Chromium: homepage and report fit 320, 390, 768, 1024, and 1440px viewports.
  All four CLI steps fit at 320px. Expanded report evidence remains within the
  viewport; comparison tables scroll inside their wrapper.
- CLI step selection, previous/next, clipboard rejection, mobile menu
  Escape/focus restoration and link dismissal, and reduced-motion controls pass.
- Report light/dark switching, radio keyboard navigation, system preference
  changes, explicit theme override, print styling, and local-file operation with
  JavaScript disabled pass. Original report content matches in the browser.
- Desktop homepage/walkthrough, both report themes, and mobile screenshots were
  inspected. No uncaught browser errors were recorded.
- Rendering with video configuration confirms the preview is replaced by the
  native player with captions, poster, fallback, and the intended loading controls.
- `git diff --check` passes. The production verification server was stopped.

Browser tooling, runtime libraries, scripts, and screenshots are temporary files
under `/tmp/ragvidence-design-review`; no project dependencies were added.
Actual walkthrough playback awaits the owner's recording.
