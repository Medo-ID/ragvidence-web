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
