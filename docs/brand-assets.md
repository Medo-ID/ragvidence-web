# RAGvidence logo and favicon

October 13, 2026. Objective: create a clean, small-size identity mark and favicon,
and pair it with the existing Geist wordmark in the website header and footer.
SEO optimization is deferred to a separate milestone.

The geometric R uses a solid Abyssal Teal tile (#063f47), an off-white body
(#f2f6f5), and a pale-teal angled leg (#8bd4db). It uses flat geometry without
shadows or gradients. The full wordmark is outlined Geist SemiBold, so exported
SVGs need no fonts or external assets. Light and dark versions have transparent
backgrounds; use the appropriate text color for the destination surface.

## Assets

| Asset | Format / size | Source |
| --- | --- | --- |
| Master mark | SVG, 32px viewBox | [ragvidence-mark.svg](../public/brand/ragvidence-mark.svg) |
| Dark-surface logo | SVG, 244×40 | [ragvidence-logo.svg](../public/brand/ragvidence-logo.svg) |
| Light-surface logo | SVG, 244×40 | [ragvidence-logo-light.svg](../public/brand/ragvidence-logo-light.svg) |
| Dark-surface logo export | Transparent PNG, 976×160 | [ragvidence-logo.png](../public/brand/ragvidence-logo.png) |
| Light-surface logo export | Transparent PNG, 976×160 | [ragvidence-logo-light.png](../public/brand/ragvidence-logo-light.png) |
| Mark export | Transparent PNG, 512×512 | [ragvidence-mark.png](../public/brand/ragvidence-mark.png) |
| Browser favicon | ICO, native 16/32/48px frames | [favicon.ico](../src/app/favicon.ico) |
| Scalable browser icon | Exact copy of master SVG | [icon.svg](../src/app/icon.svg) |
| Apple touch icon | PNG, 180×180, full-bleed background | [apple-icon.png](../src/app/apple-icon.png) |

[Logo and native favicon preview](../verification/identity/brand-assets/after-chromium/logo-review.png).
The Geist license is retained at [GEIST-LICENSE.txt](../public/brand/GEIST-LICENSE.txt).

Product files: `src/components/brand.tsx`, app icon files, and `public/brand/`.
Support files: `scripts/generate-brand.mjs`, `scripts/outline-brand.py`, the HTTP
verifier's asset coverage, `AGENTS.md`, this record, the progress record, and
the brand visual-review helper/artifacts. The old text-only guidance is updated
under the user's explicit authorization to create and integrate a logo.

The brand link retains its existing accessible name and wordmark. Its decorative
28px mark has empty alternative text, reserved dimensions, and local SVG delivery
without image optimization. Header and footer share the same component. The
installed Next.js icon conventions supply favicon/SVG/Apple head links automatically;
the general metadata, canonical URLs, and sitemap remain unchanged.

## Authoring

The committed assets require no authoring tools during install, build, or deployment.
To regenerate after editing the master mark or wordmark, run from the repository:

```bash
uv pip install --target /tmp/ragvidence-brand-tools fonttools==4.66.1
PYTHONPATH=/tmp/ragvidence-brand-tools python3 scripts/outline-brand.py
node scripts/generate-brand.mjs
```

The Python tool outlines the locally installed Geist font. The Node tool uses
the existing Next.js Sharp dependency to render vectors at their export resolutions,
package native PNG frames into the ICO, and copy the master SVG into the app icon.
It removes the tile radius for Apple's own icon mask. No new product dependency,
font download, or generator runs in the deployed application.

## Verification

[Gate](../verification/identity/brand-assets/checks.json): lint, TypeScript,
Webpack production build, four verifier tests, 39 scoped Chromium tests, and
production dependency audit passed with zero vulnerabilities. HTTP checks cover
45 routes, 125 links/fragments, image MIME types, security headers, and not-found
behavior. The new SVG/PNG exports and font license resolve locally.

Captured and visually reviewed header/footer branding, documentation, and favicon
previews across 360, 390, 768, 1280, 1440, and 1920px widths. Both Chromium and
Firefox load the mark, follow the keyboard-operated home link, and resolve all
three generated icon links on landing, installation, and privacy pages. No page
overflow, console errors, or unexpected external requests. The link retains a
44px target and 2px focus outline. ICO frames were decoded from the actual file
and inspected at native sizes against light and dark backgrounds.

[Chromium observations](../verification/identity/brand-assets/after-chromium/observations.json),
[Firefox observations](../verification/identity/brand-assets/after-firefox/observations.json).

| View | Before | After |
| --- | --- | --- |
| Desktop header | [Previous wordmark](../verification/identity/brand-assets/before-chromium/landing.png) | [New logo](../verification/identity/brand-assets/after-chromium/landing-1440.png) |
| Mobile header | [Previous wordmark](../verification/identity/brand-assets/before-chromium/docs-390.png) | [New logo](../verification/identity/brand-assets/after-chromium/docs-390.png) |
| Mobile footer | — | [New logo](../verification/identity/brand-assets/after-chromium/footer-390.png) |

The master and app SVG both have SHA-256
`7edd5bed0afd538f55c1218aeb731c7984736539530974a35612fd8e3aa5883e`.
ICO SHA-256: `12f46936bad605c6c6f45bccbe53036607d989192dd677eff992237a3ca348cb`.
Apple PNG SHA-256: `5158668f0e05e34cabee33157b7b2612ab869050742534c59b03a19b22b76d4c`.

The user's uncommitted heading/video edits remain byte-for-byte unchanged and
outside the commit. CLI, generated reports, media, metrics, schemas, and security
boundaries are unchanged. Existing verification-tool module-type/color notices
remain; no application check failed. Full video tests and full `npm run verify`
were outside this milestone. Standard Turbopack still awaits local/Vercel user
confirmation, and the accepted development-only braces advisory remains tracked.
Baseline commit `2c91723` is unchanged.
