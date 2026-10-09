# First design pass

Implemented October 8, 2026, following the owner's preference for sharp edges,
a full-width navigation bar, text branding, and a guided CLI demonstration.
The [Supabase homepage](https://supabase.com/) was inspected as the supplied product
showcase reference. This implementation uses an interactive walkthrough; it does
not include a recorded CLI video.

## Changes

- Square panels, cards, badges, and controls throughout the website, including
  documentation, error/404 pages, and inline code styling.
- Full-width sticky navigation with aligned inner content, text-only wordmark,
  a CLI demo link, and an installation action. Sharing artwork uses the wordmark.
- A two-column desktop hero with clearer actions and the guided demo alongside it;
  it stacks on smaller screens. Removed the decorative hero glow, reduced section
  spacing, and increased small homepage label sizes.
- Four demo steps: install with uv, run `ragvi health`, run `ragvi tutorial`, and
  inspect the generated report. Commands and results match repository documentation.
  The tutorial figures are bundled data: v0.1.0, ten questions, BM25, k=2.
- Manual step selection, next/previous controls, and optional six-second-per-step
  playback with pause/replay. No playback starts automatically. Reduced-motion
  users retain manual controls; without JavaScript, the installation preview and
  a link to the complete tutorial remain available.
- Copy buttons use larger targets, handle clipboard rejection, and announce
  success/failure. The mobile menu supports Escape and restores focus to its toggle.
- Mobile documentation navigation stacks above the article. The plans grid no
  longer overflows at narrow widths; plan badges stack under headings on mobile.
  The proof panel's improvement badge sits in normal flow.
- Project design conventions recorded in `AGENTS.md`.

The demo is a guided preview, not an in-browser CLI execution. Health check items
describe what is checked rather than asserting the visitor's environment passed.
The original generated sample report is preserved.

## Final verification

- `npm run check`: ESLint, TypeScript, and the Turbopack production build pass.
- Production `next start` on port 3001: 27 routes and 26 internal links pass the
  HTTP smoke check, including sharing artwork and the sample report.
- Chromium checks: step selection, next/previous bounds, play/pause/replay,
  clipboard rejection/retry success, mobile menu Escape/focus, docs search,
  stacked docs layout, reduced-motion controls, and no-JavaScript fallback pass.
- Homepage widths 320, 390, 768, 1024, and 1440px: no horizontal page overflow;
  navigation background spans the viewport; tested cards and controls have 0px
  border radius. All four demo steps also fit the 320px viewport.
- Browser checks reported no uncaught page errors.
- Desktop, mobile homepage, and mobile documentation screenshots inspected.
- `git diff --check` passes. Existing package changes were preserved; no project
  dependency was added for the demo or verification tooling.

Browser tooling and screenshots were kept in `/tmp/ragvidence-ui-review` rather
than the application dependencies. Tests ran against the production build; the
verification server was stopped afterward.
