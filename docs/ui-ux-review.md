# UI/UX review

Reviewed October 8, 2026. Scope: homepage, shared navigation/footer, documentation,
trust pages, copy controls, global styling, and the generated sample report.
This is a source-based review; no browser or screenshot renderer is available in
this environment. Responsive geometry and visual judgments need browser confirmation.
Application code and styling have not been changed by this review.

## Design assessment

The existing design has a coherent foundation: Geist typography, a dark palette,
cyan accents, shared content widths, restrained iconography, and real tutorial
evidence. The main opportunity is stronger hierarchy and a shorter product story.
The current implementation repeats similar bordered cards, colors, and section
spacing, giving supporting information almost as much emphasis as the product result.

## Highest-value changes

| Priority | Finding and evidence | Suggested improvement |
| --- | --- | --- |
| 1 | The hero emphasizes the install command; the detailed evidence preview is the fifth homepage section (`src/app/page.tsx:63,150`). | Pair a shorter headline and clear action with a readable report preview in the hero, or immediately below it. Show what the tool produces early. |
| 1 | The homepage has 12 sections; nine use `py-28 sm:py-36`. At a 16px root size that is 224px/288px of vertical padding per section before content. | Establish compact, standard, and feature section spacing. Reduce mobile spacing most. Combine overlapping problem/features/metrics content and shorten the roadmap/builder treatment. |
| 1 | Mobile docs navigation and the article share a default flex row (`src/app/docs/layout.tsx:12`; `src/components/docs-sidebar.tsx:62`). | Stack navigation above the article below the desktop breakpoint. Ensure both occupy the available width; verify expanded search, long commands, and tables at 320–430px. |
| 2 | The marketing report preview is dark/cyan, whereas `public/sample-report.html` is light with navy/violet/cyan styling. | Show a crop or faithful rendition of the actual report. Make the generated artifact's appearance clear; preserve the original report and tutorial provenance. |
| 2 | The hero's visible copy action is small; its secondary links sit inside the terminal footer. The header emphasizes a version badge rather than a user task (`site-header.tsx:30`). | Make one primary action easy to identify, such as “Install Free,” with “View sample report” as a clear secondary action. Keep version information subordinate. Preserve ready-to-copy commands. |
| 2 | Cards, icon tiles, pills, shadows, and accent borders recur across nearly every marketing section. Panels use very similar dark colors. | Reserve prominent surfaces and cyan emphasis for actions and evidence. Use simpler rows and unboxed content elsewhere. Define a small surface, radius, button, and badge system instead of styling each instance independently. |
| 2 | Fifteen utility occurrences set labels to 9–11px, including report states, integration badges, and docs headings. | Raise meaningful labels to a comfortable reading size, reduce uppercase/tracking where it hurts scanning, and keep tiny text for genuinely incidental detail. Maintain strong heading/body/action hierarchy. |
| 2 | Docs have heading IDs but no “On this page” navigation. Search filters titles, descriptions, and groups rather than article bodies (`docs-sidebar.tsx:14`). | Generate a heading-based contents list, add heading permalinks, and clarify the search scope or improve search results. Add shortcuts to installation and the first tutorial. |
| 2 | Copy controls lack a clipboard failure state (`copy-command.tsx:15`). Mobile header links close the menu, but there is no Escape/outside dismissal or route-change reset. | Provide visible and announced copy outcomes with manual-copy guidance on failure. Give mobile navigation predictable dismissal and focus behavior. Make the active destination explicit. |

## Additional details to verify visually

- The proof panel's “+30 pts” badge is absolutely positioned over the same small
  column that contains `bm25-heading_context`. At narrow widths these may overlap;
  use normal-flow layout or move the badge below the metric if confirmed.
- The hero command scrolls horizontally, while the Free card truncates its command.
  Prefer readable commands and consistent copy affordances, especially on mobile.
- Existing `Copy` controls use `text-xs py-2`, implying about 32px height at default
  font sizing. Increase frequently used touch controls toward 44px as a usability
  target and check adjacent spacing; this is not a claimed accessibility failure.
- The footer uses two columns for three link groups on small screens. Consider a
  deliberate mobile hierarchy and reduce the standalone `mt-28` gap where it adds
  unnecessary space after the final section.
- Documentation h2 sections combine `mt-12` and `pt-10` with a border every time.
  Reduce interruptions to reading flow; use lighter separators selectively.
- Trust pages can share a calmer reading layout with docs. A light reading theme
  may be worth considering once reference screenshots establish the direction.

## Color checks

Calculated contrast for solid CSS theme tokens:

| Combination | Ratio |
| --- | --- |
| Muted text `#94a3b8` on canvas `#07090d` | 7.77:1 |
| Muted text on panel `#0d1117` | 7.38:1 |
| Main text `#f3f7fa` on canvas | 18.50:1 |
| Cyan `#62e7f5` on canvas | 13.54:1 |
| Border `#202833` against canvas | 1.34:1 |

The core text colors are well separated from their solid backgrounds. This review
does not establish accessibility compliance: translucent surfaces, focus states,
small typography, and interactive boundaries need separate checks. Increasing
all text brightness is less useful than improving size and hierarchy. Treat faint
decorative dividers separately from boundaries needed to identify controls.

## Proposed homepage flow

1. Hero: clear product value, primary/secondary actions, actual report preview.
2. Evidence: the bundled 60% → 90% comparison, with ten questions, BM25, k=2,
   v0.1.0 provenance and one readable question-level example.
3. Workflow: label evidence → run a controlled change → inspect the result.
4. Capabilities: concise metrics and supported retrieval workflows.
5. Free availability: shipped capabilities and installation; future Plus gets
   less space than the available product.
6. Getting started: install → tutorial → your own corpus, followed by a compact
   builder/trust treatment and footer.

This can retain the current dark/cyan identity. Reference screenshots can then
guide composition, density, typography, and surface treatment. The first redesign
pass should prioritize the hero, real evidence preview, mobile docs, and shared
controls. Add motion only where it helps explain the retrieval workflow.

## Acceptance checks for a future redesign

- Desktop and mobile screenshots of homepage, docs overview, tutorial, and trust page.
- Clear next action and useful product evidence near the top of the homepage.
- Readable report states and commands without overlapping labels or badges.
- Mobile docs navigation stacks correctly; tables/code scroll within their containers.
- Keyboard-visible focus, usable menu/search, and clipboard success/failure feedback.
- Existing routes, metadata, factual product claims, and tutorial provenance preserved.
- Lint/types, production build, route checks, and browser console checks as described
  in `AGENTS.md`; record any environment-blocked checks honestly.
