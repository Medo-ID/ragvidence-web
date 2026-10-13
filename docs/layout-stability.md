# Local layout-stability follow-up

October 13, 2026. This work follows the SEO audit's mobile layout-shift finding.
Hosting, live indexing and Search Console actions are out of scope. The user's
uncommitted hero-heading and video-autoplay edits remain protected.

## Diagnosis baseline

[Source attribution](../verification/seo/layout-shift/before/observations.json)
reproduces homepage CLS 0.13909 and semantic-document CLS 0.03154 at 390×844,
4× CPU slowdown, 50ms latency and 200,000B/sec download throughput. Desktop at
1440×900 has no recorded shift. These are local lab results, not field vitals.

On this Linux host the installed Geist package's metric-adjusted Arial fallback
cannot resolve its `local("Arial")` source. Chrome renders DejaVu Sans first.
Its unadjusted bold glyphs are wider than Geist SemiBold: the hero occupies three
lines and the CTAs stack. When the local Geist WOFF2 arrives, the hero drops to
two lines and the CTAs fit on one row. The proof section moves upward about
98px. On mobile docs the heading loses a line and the following content moves
upward about 40px. Source rectangles and font-loading timestamps establish the
connection; the video has already reserved its dimensions and does not cause
these recorded shifts.

- [Fallback hero](../verification/seo/layout-shift/before/landing-fallback.png)
- [Loaded hero](../verification/seo/layout-shift/before/landing-mobile-held-fonts.png)
- [Fallback docs](../verification/seo/layout-shift/before/docs-fallback.png)
- [Loaded docs](../verification/seo/layout-shift/before/docs-mobile-held-fonts.png)

The diagnostic uses the largest CLS session window (under one second between
shifts, at most five seconds per session) and separately records the sum of all
shift scores. They coincide in this baseline. The prior SEO observer recorded
the sum; the updated verification observer will use the actual session-window
calculation. Neither change affects CLI retrieval/evaluation metrics.

The [baseline gate](../verification/identity/layout-baseline/checks.json) passes
lint, TypeScript, Webpack build, routes/headers, five verifier tests, 43 scoped
browser tests and production audit with zero vulnerabilities.

## Proposed focused fix

Add local DejaVu fallback faces after the existing Geist/Arial stack, with width
and vertical metrics matched to the packaged Geist Regular/SemiBold fonts. Keep
the original Arial fallback first on platforms where it exists. Add generic
sans-serif fallbacks after the adjusted faces. No new font file or remote font
request is needed, and loaded Geist typography remains unchanged.

[Derived values](../verification/seo/layout-shift/fallback-metrics.json) use the
same Latin-frequency sample as installed `next/font/local`, matching normal and
semibold separately. The FontTools authoring script reads real target/fallback
font files; FontTools is not a product dependency. Recalculate these values when
updating Geist and verify visible wrapping rather than assuming width averages
guarantee exact glyph-by-glyph equivalence.

Files for the implementation milestone: `src/app/globals.css`,
`tests/browser/layout-stability.spec.ts`, `verification/seo/review.mjs`, the
diagnostic/metrics evidence under `verification/seo/`, and the health/progress/SEO
notes. `src/app/page.tsx` and `src/components/product-demo.tsx` are excluded.

The installed Next.js font documentation and fallback-metric helper were read.
The measurement follows [Google's CLS definition](https://web.dev/articles/cls)
and the font advice in [Optimize CLS](https://web.dev/articles/optimize-cls).

## Reproduce the diagnosis

```bash
node verification/seo/diagnose-layout.mjs before /path/to/browser/libraries
PYTHONPATH=/tmp/ragvidence-brand-tools python3 verification/seo/measure-font-fallback.py \
  --regular /usr/share/fonts/truetype/dejavu/DejaVuSans.ttf \
  --bold /usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
```

The metrics command requires FontTools in the temporary authoring environment;
the fallback paths above are the actual files on this host. Neither tool runs in
the product or production build.

## Implemented fix and results

Baseline diagnosis commit: `bdf2a2a`. `globals.css` now places the two measured
local DejaVu faces after the original Geist/adjusted-Arial stack. Generic Arial,
Helvetica and sans-serif follow those faces. Platforms with the original Arial
fallback retain its priority; Linux has an adjusted local fallback when Arial is
absent. Primary Geist and Mono assets, sizes, weights, copy and video behaviour
are unchanged. No font file, remote request or runtime JavaScript was added.

[After attribution](../verification/seo/layout-shift/after/observations.json)
shows that the large hero/CTA/doc jumps disappear. Both natural and intentionally
held-font mobile runs keep the hero at two lines and the CTAs on one row at 390px.
The only recorded remaining homepage shift is a roughly 3px horizontal change
in a small trust label, contributing 0.00001762. Docs and desktop samples have
no recorded shift.

| Profile / page | Before → after CLS | Before → after median LCP |
| --- | ---: | ---: |
| Mobile / home | 0.13909 → 0.00001762 | 632 → 660ms |
| Mobile / semantic docs | 0.03154 → 0 | 540 → 564ms |
| Desktop / home | 0 → 0 | 148 → 144ms |
| Desktop / semantic docs | 0 → 0 | 160 → 144ms |

LCP values compare the preceding SEO final run to three new cold contexts per
page/profile using the same throttling. Small timing differences are not proof
of a speed improvement. CLS is the maximum session window in the updated harness;
the previous sum and session-window values coincide for the single-shift baseline.
The observer starts its first window at the first actual shift. Client JS sizes
are unchanged (157,525B mobile/docs; 159,587B desktop home). Compressed CSS changes
from 8,049B to 8,172B, an increase of 123B.

[Comparable crawl/lab results](../verification/seo/layout-stability/final/observations.json)
confirm all 23 rendered SEO routes, metadata and indexing exclusions remain
correct, with no measured horizontal overflow, browser exceptions or unexpected
external requests. These are Chromium localhost measurements on this host;
they are not field Core Web Vitals or native-device certification.

## Local verification

- `npm ci` succeeds from the existing lockfile; manifest/lock remain unchanged.
- [Final production gate](../verification/identity/layout-stability/checks.json)
  passes lint, TypeScript, Webpack build, 39 routes/124 internal links, five
  verifier/security tests, 55 scoped Chromium tests and production audit with
  zero vulnerabilities.
- The 12 new browser cases use independent cold contexts, intentionally hold
  WOFF2 loading, keep content visible and readable, and verify CLS ≤0.1 and no
  page overflow for home/docs at all six widths.
- [Chromium observations](../verification/identity/layout-stability/after-chromium/observations.json)
  and [Firefox observations](../verification/identity/layout-stability/after-firefox/observations.json)
  cover 360×800, 390×844, 768×1024, 1280×800, 1440×900 and 1920×1080. Both engines
  pass docs navigation/disclosures/current-section checks, overflow, console,
  external-request and essential header contrast checks. The minimum tested
  header-text contrast against white content is 4.72:1.
- Existing keyboard/menu, copy success/failure, docs search, installation,
  tutorial interaction, offline report and report print checks pass. The visual
  helper also loads and seeks the retained workflow video.
- Mobile, desktop, disclosure and before/after font-loading images were reviewed
  manually. Loaded typography and the existing visual identity are preserved.

Clean install emits the existing ESLint 9 deprecation and an unapproved
`unrs-resolver` postinstall notice; installation and checks still pass. No script
approval or lint-stack override was added. Full development audit reports exactly
the previously accepted braces advisory and four ancestors, while production
audit is clean. The dependency chain/remediation remain in project health.
[Clean-install/audit record](../verification/seo/layout-shift/dependencies.json).

The first new test failed TypeScript checking because its injected browser state
was not declared on Window. The test now declares that field explicitly rather
than weakening type checks. [Failure record](../verification/seo/layout-shift/typecheck-first-run.log).
A Firefox visual run overlapped a rebuild and requested an obsolete JavaScript
chunk, causing the existing nosniff boundary to reject the missing resource.
The review was rerun sequentially against the finished build and passes;
[initial observations](../verification/seo/layout-shift/firefox-review-first-run.json)
are retained. No product header or security exception was introduced.

## Review artifacts

- [Before fallback hero](../verification/seo/layout-shift/before/landing-fallback.png)
- [After fallback hero](../verification/seo/layout-shift/after/landing-fallback.png)
- [Final mobile landing](../verification/seo/layout-stability/final/landing-390.png)
- [Final desktop landing](../verification/identity/layout-stability/after-chromium/landing.png)
- [Desktop docs](../verification/identity/layout-stability/after-chromium/docs-1440.png)
- [Mobile docs](../verification/identity/layout-stability/after-firefox/docs-390.png)

The protected `page.tsx` SHA-256 remains
`940e142b46b2e335983da8782b867779c3a35266f02133fae9981a6815cf7e71`;
`product-demo.tsx` remains
`14b2112ba11d7bbbb449b4643e2140d70072d96c2384c0a5427485a20dc939cf`.
Neither file is staged in this milestone. Reports, schemas, evaluation semantics,
media files and the normal Turbopack configuration are unchanged.

## Remaining external verification

Standard Turbopack still awaits the user's local/Vercel confirmation. Hosting,
live redirects/indexing, Search Console ownership/submission, rich-result service
validation, real-device testing and field vitals require the deployment or
external access; no hosting action was taken. The full legacy video regression
suite remains outside this focused change, as previously recorded. Autoplay
bandwidth was measured but the user's video startup logic was deliberately
preserved. This fix addresses the reproduced font-induced jump without claiming
all possible layout shifts are eliminated on every device or writing system.
