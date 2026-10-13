# Apply the evidence-convergence identity

October 13, 2026. The three-concept exploration (`162f63a`) delivered artwork;
it did not change the website. This follow-up applies the recommended concept A
so the identity is visible after building and starting the site.

## Applied files

- `src/components/brand.tsx`: a 28px evidence-convergence mark beside the exact
  RAGvidence wordmark, shared by the header and footer. RAG uses Geist SemiBold;
  vidence uses Medium. The trailing decorative period is removed.
- `src/app/favicon.ico`: exact concept A ICO with native 16/32/48px frames.
- `src/app/icon.svg`: exact simplified, high-contrast concept A favicon.
- `src/app/apple-icon.png`: exact concept A 180px touch icon.
- `scripts/verify-site.mjs`: checks the new icon/mark routes and validates SVG
  responses as SVG rather than HTML.
- `AGENTS.md`, `README.md`, the progress/exploration notes, and the asset-pack
  README: record the applied identity. The master ZIP contains the updated README.
- `verification/identity/review-finishing.mjs`: captures the applied identity at
  six sizes and compares the icons served by Next.js against the selected assets.

The mark is decorative inside the existing "RAGvidence home" link; it does not
create a second focus target or duplicate accessible name. The 44px link height
and visible keyboard focus are preserved. The local SVG is served unchanged,
without an image-optimization endpoint or new dependency. Next.js file-based
metadata registers the favicon and touch icon without custom browser scripts.

## Verification

[Available production gate](../verification/identity/logo-adoption/checks.json):
lint, TypeScript, Webpack production build, 39 routes and 125 internal links,
four verifier tests, 39 scoped Chromium tests, and a production audit with zero
vulnerabilities. The final verification-helper changes were also linted.

[Visual observations](../verification/identity/logo-adoption/after-chromium/observations.json)
cover landing and docs pages at 360×800, 390×844, 768×1024, 1280×800, 1440×900,
and 1920×1080, with no horizontal overflow, console errors, or external requests.
The header mark loads, footer uses the same artwork, and keyboard focus remains
visible. The favicon, SVG icon, and Apple icon metadata all resolve to bytes
identical to the selected concept A exports. Mobile and desktop screenshots
were reviewed manually.

The first icon-request check failed with `apiRequestContext.get: Invalid URL`
because its standalone request client received a relative metadata href. The
checker now resolves that href against the page URL before requesting it;
application icon URLs and security settings did not need modification.

- [Mobile landing](../verification/identity/logo-adoption/after-chromium/landing-360.png)
- [Desktop landing](../verification/identity/logo-adoption/after-chromium/landing-1440.png)
- [Desktop documentation](../verification/identity/logo-adoption/after-chromium/docs-1280.png)

The protected user changes in `page.tsx` and `product-demo.tsx` remain unchanged
and excluded from this commit. No CLI template, sample report, video, product
metrics, privacy boundary, or normal build configuration changes. Standard
Turbopack confirmation and the full video regression suite remain pending as
previously recorded. Existing development-only braces and module-type warning
tracking is unchanged.
