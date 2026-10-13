# Documentation hierarchy and custom scrollbars

October 13, 2026. Follow-up to commit `5fa7297`: make documentation categories
easier to distinguish, give scrollbars custom geometry, and increase navbar
transparency visibly.

Product files: `src/components/docs-sidebar.tsx`, `src/components/site-header.tsx`,
and `src/app/globals.css`. Verification files: the existing visual-review helper,
`verification/identity/navigation-polish/`, this record, and the progress record.

Categories now have 36px between groups, compared with 24px previously. Within
groups, links have no additional list gap; desktop rows have a 36px minimum and
6px vertical padding. Mobile and coarse-pointer controls retain a 44px minimum.
The desktop right divider and the existing active page treatment remain.

Custom CSS scrollbars use an 8px native drag area with a 4px visible teal thumb,
transparent track, subtle rounding, no arrow buttons, and brighter hover/drag
states. Pages, desktop navigation, and horizontally overflowing code share this
styling. Firefox receives the standard thin teal fallback; its exact dimensions
and visibility follow browser/platform preferences. Forced-colors mode restores
browser styling. No JavaScript scrolling replacement or dependency was added.

Standard scrollbar properties are reset where custom pseudo-elements are
supported, because non-auto values override those custom styles.
[MDN documents this precedence](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::-webkit-scrollbar).

Navbar background opacity drops from 80% to 60%, with blur reduced from 8px to
6px. Brighter navigation labels preserve at least 4.72:1 contrast even over white
content; hover darkens the local background. The expanded mobile menu retains its
solid surface and the opaque fallback remains for browsers without backdrop blur.

## Verification

[Gate](../verification/identity/navigation-polish/checks.json): lint, TypeScript,
Webpack production build, four verifier tests, 39 scoped Chromium tests, and
production audit passed. Zero production vulnerabilities. HTTP checks cover
36 routes, 123 links/fragments, security headers, and not-found behavior.
[Firefox](../verification/identity/navigation-polish/firefox.log) passed 15 focused
documentation/navigation/contrast tests. Lint was rerun after the final review-helper
measurement adjustment and passed.

The final build includes the scrollbar hover correction: changing only its color
keeps the transparent border and 4px visible width intact. Visually reviewed
desktop/mobile documentation, compact disclosures, code overflow, the current
section, and the navbar over light report footage. All six requested viewports
were captured in both engines, with no page overflow, console errors, or external
requests. Custom thumb dragging was exercised at all three desktop widths in
Chromium. Focusing the final sidebar link scrolls it into view in both engines.
Native scrollbars are not visible in the Firefox automation screenshots (the
computed viewport width is `none`); these captures do not certify visible thumb
geometry in a real Zen profile.

| View | Before | After |
| --- | --- | --- |
| Desktop categories and scrollbar | [1440px](../verification/identity/navigation-polish/before-chromium/docs-1440.png) | [1440px](../verification/identity/navigation-polish/after-chromium/docs-1440.png) |
| Mobile categories | [390px](../verification/identity/navigation-polish/before-chromium/navigation-390.png) | [390px](../verification/identity/navigation-polish/after-chromium/navigation-390.png) |
| Navbar over light content | [80% opacity](../verification/identity/navigation-polish/before-chromium/navbar-over-light-content.png) | [60% opacity](../verification/identity/navigation-polish/after-chromium/navbar-over-light-content.png) |

Computed styles and contrast measurements:
[Chromium](../verification/identity/navigation-polish/after-chromium/observations.json),
[Firefox](../verification/identity/navigation-polish/after-firefox/observations.json).
Existing Node module-type/color-environment notices remain in verification logs;
no application check failed. Full video regression tests and full `npm run verify`
were outside this styling milestone. Normal Turbopack still awaits the user's
local/Vercel confirmation; its build configuration is unchanged. The previously
accepted development-only braces advisory remains tracked in `identity-audit.md`.

The user's uncommitted heading and autoplay edits were preserved byte-for-byte
and excluded from the commit: `page.tsx` SHA-256
`940e142b46b2e335983da8782b867779c3a35266f02133fae9981a6815cf7e71`,
`product-demo.tsx` SHA-256
`14b2112ba11d7bbbb449b4643e2140d70072d96c2384c0a5427485a20dc939cf`.
CLI behavior, reports, media, dependencies, and security/privacy boundaries are
unchanged. Baseline commit `2c91723` remains intact.
