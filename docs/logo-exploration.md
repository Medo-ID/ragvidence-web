# RAGvidence logo and favicon exploration

October 13, 2026. The rejected monogram commit `13c316b` was reverted by
`3240267`, preserving history and the user's existing heading/video edits.
The website has its previous text wordmark and favicon again. This milestone
delivers three complete design systems and a recommendation for review; no new
concept was adopted in application code at this exploration milestone. The
subsequent [website adoption](logo-adoption.md) applies concept A.

## Three distinct directions

| Concept | Construction / meaning | Small-size tradeoff |
| --- | --- | --- |
| A — Evidence convergence | Three evidence fragments follow traceable paths into one result node with a negative-space check. Directly expresses finding and validating the required evidence. | The dedicated 16px version uses two fragments and an enlarged checked result. |
| B — Evidence search | Two document fragments enter a magnifier aperture containing a check. Search reveals the matched evidence. | Ring, handle, and check compete for space; a pixel-specific drawing shortens the tabs. |
| C — Connected V | Two descending chunks join a continuous ascending verification path, forming an abstract V. | Strongest compact silhouette; the 16px drawing omits the thin joining path. Retrieval meaning needs more context. |

**Recommendation: A.** It most directly communicates evidence-level traceability,
combines retrieval and verification in a distinctive asymmetric silhouette, and
fits terminal/report/documentation contexts. The dedicated small-size version
keeps it recognizable at 16px. C wins on compact silhouette; B makes search
immediately familiar, with less distinctive geometry. The full comparison covers
meaning, originality, small-size readability, developer credibility, and existing
identity compatibility. These are design judgments; no claim of trademark
clearance or measured product performance is made. Geometry was drawn from
scratch for this brief, using no stock icon or company mark as source.

[Full comparison](../public/brand/concepts.html) ·
[Preview PNG](../public/brand/concepts-preview.png) ·
[All assets and editable source](../public/brand/ragvidence-logo-system.zip).

## Deliverables

Each family has dark/light and pure black/white horizontal logos and icon-only
marks, in editable SVG and transparent PNG. The exact wordmark is `RAGvidence`:
Geist SemiBold for RAG and Geist Medium for vidence, with uninterrupted spacing.
SVG lettering is outlined and requires no external font.

Each family also includes independently optimized 16/32/48px SVG/PNG favicons,
a matching three-frame ICO, a simplified scalable favicon, a 180px Apple touch
icon, and 192px/512px app icons. All use only the symbol. Favicon and app fields
are solid Abyssal Teal with high-contrast ink and safe insets; Apple artwork lets
the platform apply its own mask.

- [A asset pack](../public/brand/a-evidence-convergence.zip)
- [B asset pack](../public/brand/b-evidence-search.zip)
- [C asset pack](../public/brand/c-connected-v.zip)
- [Brand sheet PNG](../public/brand/brand-sheet.png), [HTML](../public/brand/brand-sheet.html), [one-page PDF](../public/brand/brand-sheet.pdf)
- [Actual dark browser tabs](../public/brand/browser-tabs-dark.png), [light browser tabs](../public/brand/browser-tabs-light.png)

The recommended brand sheet shows palette, clear space (one-quarter of mark
size), a 24px primary-mark minimum, a 160px horizontal-lockup minimum, the special
16px favicon, and incorrect stretching, rotation, cropping, and low contrast.
The check motif is brand meaning, not a report outcome indicator.

Palette: Abyssal Teal `#063F47`, pale teal `#8BD4DB`, interactive teal `#35B7C7`,
canvas `#050809`, off-white `#F2F6F5`. Tested ratios: primary on off-white 10.65:1;
pale teal on canvas 12.00:1; interactive teal on canvas 8.37:1; favicon ink on
teal 10.65:1. The brighter accents are intended for dark surfaces; use primary
teal for essential light-surface text. All geometry also works in one color.

## Source and regeneration

Vector masters and the dedicated 16px drawings live in `design/brand/`.
`scripts/generate-logo-concepts.mjs` derives all asset variants;
`scripts/build-brand-sheets.mjs` produces the comparison, guide, and family ZIPs;
`scripts/package-logo-system.py` packages the complete review system. These are
authoring tools, not production build steps. No product dependency was added.

```bash
uv pip install --target /tmp/ragvidence-brand-tools fonttools==4.66.1
PYTHONPATH=/tmp/ragvidence-brand-tools python3 scripts/outline-logo-concepts.py
node scripts/generate-logo-concepts.mjs
node scripts/build-brand-sheets.mjs
node verification/identity/review-logo-concepts.mjs /path/to/browser/libraries chromium
node verification/identity/review-native-favicons.mjs /path/to/browser/libraries
```

Copy the native-tab captures to `public/brand/browser-tabs-dark.png` and
`browser-tabs-light.png`, then run `python3 scripts/package-logo-system.py`.
The committed pack includes source, guide, native browser proof, and the common
[Geist license](../public/brand/GEIST-LICENSE.txt). PNG/SVG/ICO assets work without
authoring tools. Comparison/guide pages embed their locally packaged Geist font
and work offline when kept with the asset directories.

## Verification

The [rollback gate](../verification/identity/logo-rollback/checks.json) and
[design milestone gate](../verification/identity/logo-exploration/checks.json)
pass lint, TypeScript, Webpack production build, four verifier tests, 39 scoped
Chromium tests, route/link/header checks, and production audit (zero vulnerabilities).
The normal site checks still cover 36 routes and 123 links/fragments.

[Chromium asset observations](../verification/identity/logo-exploration/chromium/observations.json)
verify exact served bytes, required PNG sizes, actual transparent backgrounds,
monochrome colors, and ICO frame equality with the dedicated PNGs. Responsive
comparison/guide captures cover all six requested widths with no overflow,
console errors, or unexpected external requests. Firefox also rendered all
families and both guides at all six widths; see its
[observations](../verification/identity/logo-exploration/firefox/observations.json).

Actual native Chrome UI was rendered in headed mode using the
[documented Ozone software platform](https://chromium.googlesource.com/chromium/src/+/main/docs/ozone_overview.md).
The browser tab strip was captured at device scale 1 in dark and light UI,
with all three genuine 16px PNG favicons; it is not an HTML imitation of tabs.
[Capture observations](../verification/identity/logo-exploration/native-tabs/observations.json).

Initial Xvfb setup could not bind its UNIX display socket in this environment;
no shared display-directory permissions or product settings were changed. The
Ozone method avoids that dependency. An initial native-capture harness conflict
(`deviceScaleFactor` combined with `viewport: null`) was corrected by keeping
the browser's forced 1x launch scale and checking `devicePixelRatio` directly.

Visual PDF inspection found low-contrast inherited labels and white-on-paper
examples. Print styles now explicitly preserve ink on dark cards and use dark
text on paper. The corrected one-page PDF was rasterized and reviewed; all 34
essential print-text samples exceed AA, with minimum contrast 7.92:1.
[PDF observations](../verification/identity/logo-exploration/brand-sheet-pdf.json),
[reviewed print page](../verification/identity/logo-exploration/brand-sheet-print-1.png).

No website concept adoption, CLI/report modification, metrics/schema change,
video replacement, new account/backend/analytics, or security-header change.
SEO is deferred. Full video tests/full `npm run verify` remain outside this
design milestone. Standard Turbopack still awaits local/Vercel user confirmation,
and the accepted development-only braces advisory remains tracked.

The user's uncommitted files remain byte-for-byte preserved and excluded:
`page.tsx` SHA-256 `940e142b46b2e335983da8782b867779c3a35266f02133fae9981a6815cf7e71`;
`product-demo.tsx` SHA-256 `14b2112ba11d7bbbb449b4643e2140d70072d96c2384c0a5427485a20dc939cf`.
Baseline commit `2c91723` is unchanged.
