# Project gaps and hero direction

Implementation follow-up: see [implementation-pass.md](implementation-pass.md)
for the resulting changes and the final verification restriction. This review
records the pre-implementation findings.

Reviewed October 12, 2026. Scope: this website, its documentation, onboarding,
verification, and a comparison with the [Node.js homepage](https://nodejs.org/en).
The CLI implementation lives elsewhere; this review does not establish its feature
completeness. The working tree was clean before the review. Application code and
dependencies were left unchanged.

## Current baseline

The site already has an installation flow, 17 documentation pages, an interactive
CLI preview, a provenance-preserving sample report, trust pages, metadata, a
sitemap, security headers, and error/not-found pages. Earlier findings about the
mobile docs flex layout and missing clipboard feedback have been addressed.

Fresh checks:

| Check | Result |
| --- | --- |
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm run build` | Pass, Next.js 16.4.0 / Turbopack |
| Production smoke check | Pass: 27 routes and 26 internal links against the newly built `next start` server on port 3001 |
| Production dependency audit | Zero reported vulnerabilities |
| Full dependency audit | Five high-severity package entries from the existing development-only `braces` advisory chain |
| Chromium homepage geometry | No horizontal page overflow at 320, 390, 768, 1024, and 1440px |
| Targeted Chromium navigation checks | Two mobile dismissal issues reproduced; see below |
| Unknown routes | Unmatched top-level route: 404. Unknown docs slug: streamed 200 with not-found UI and `noindex` |
| Browser errors | No uncaught page errors in the completed local navigation/geometry checks |

Browser tooling and screenshots are under `/tmp/ragvidence-project-review` and are
temporary. Chromium initially required missing runtime libraries, which were
downloaded and extracted there without installing system packages. These checks
were not a full accessibility, cross-browser, or performance audit. A clean
`npm ci`, clean-machine CLI install, and deployment/DNS checks were not performed.

## Prioritized work

### 1. Finish prerequisite onboarding — high priority

`src/lib/docs.ts` identifies Python 3.12 and recommends `uv`, but provides no
instructions or links for obtaining `uv`, nor a concrete Python-selection path.
A visitor without `uv` cannot execute the first command.

Add a short prerequisites section with official uv setup links for macOS/Linux
and Windows, explain automatic Python management, and verify whether explicitly
selecting Python 3.12 is necessary for the released package. Production
[PyPI metadata](https://pypi.org/project/ragvidence/) currently requires
`>=3.12,<3.13`, so do not describe arbitrary newer Python versions as supported.
Cover PATH setup, upgrading, and uninstalling. Validate the exact documented
sequence in an isolated tool environment before changing installation commands.

Acceptance: a visitor with no existing uv installation can follow linked setup,
install the package, run health, and produce the tutorial report.

### 2. Close mobile navigation after navigation — high priority

In `src/components/docs-sidebar.tsx`, `Navigation` accepts a `close` callback, but
the mobile `<details>` does not supply one. At 390px, selecting First tutorial
leaves the panel open and the article starts at approximately y=1234px, below the
844px viewport. The underlying column layout is already correct.

In `src/components/site-header.tsx`, menu links close the menu, but the wordmark
does not. Opening the menu and clicking the header wordmark leaves
`aria-expanded="true"`. Escape dismissal already works in the implementation.

Close the docs panel after a mobile selection and make header dismissal consistent
for brand/route navigation. Define focus behavior and test browser back/forward.
With JavaScript disabled, the mobile header exposes only the wordmark; footer
navigation remains available. A native or explicit fallback would improve access.

Acceptance: selecting a document reveals its article immediately; navigation does
not leave an unrelated menu expanded; keyboard focus remains useful.

### 3. Make the verification gate prove the production build — high priority

`scripts/verify-site.mjs` starts `next dev` if its URL is unavailable and reuses any
reachable server otherwise. Therefore `npm run verify` can pass without checking
the build it just produced. Startup also lacks robust child-process error handling,
fetch timeouts, and unconditional cleanup after exceptions. An unreachable remote
target still triggers a local server launch.

Give the full gate a dedicated production-server lifecycle, explicit readiness
checks, fetch timeouts, and cleanup in `finally`. Keep a separately named dev or
external-URL smoke mode if useful. Fail unavailable external targets directly.
Derive route coverage from documentation data instead of duplicating 17 slugs.
Check all configured headers, fragment destinations, and not-found behavior.

The installed Next.js `not-found` guide explains that a response already streaming
can retain status 200 while rendering not-found content and adding `noindex`.
That is the observed unknown-doc behavior here, rather than evidence that the
route's existing `notFound()` call is missing. Tests should assert these semantics
and ensure bad links do not pass just because `response.ok` is true. Decide whether
a strict HTTP 404 for every unknown doc is a separate product requirement before
changing routing or caching flags.

Acceptance: the default deployment gate exercises its own fresh production build,
detects broken documentation links, and stops its server on success or failure.

### 4. Commit repeatable regression checks and CI — next

There is no committed `.github/workflows` quality workflow or browser-test setup.
Previous design verification used temporary scripts; this review did too. That
evidence cannot protect future changes automatically.

Add focused browser coverage for mobile navigation, docs search, clipboard
success/failure, CLI preview controls, reduced motion, and responsive containment.
Run it against production. Add a Node 24 / npm 11+ CI job using `npm ci` and the
production gate, with failure artifacts. Avoid snapshotting implementation details.

Acceptance: a pull request that reproduces the mobile dismissal issue fails a
meaningful automated check.

### 5. Bring product proof into the hero — next

At 1440px the current hero ends around y=1018px and the walkthrough section starts
around y=1132px. At 390px they are approximately y=989px and y=1281px. The desktop
hero screenshot consequently shows a large headline and installation card, with
the interactive product preview outside the first viewport.

Use the Node.js layout direction described below. This is a design recommendation,
not a rendering failure. Preserve the current page's calmer spacing elsewhere.

### 6. Keep full documentation out of the sidebar bundle — next

`src/components/docs-sidebar.tsx` imports the complete `docs` array. Inspection of
the production assets confirms full article text is present in a browser chunk.
Extract a navigation manifest containing only slug, title, description, and group;
keep content blocks on the server. Continue supporting current search behavior.

Current initial script references total 598,604 raw bytes on the homepage and
614,954 on installation docs. Summing gzip-compressed asset contents gives 186,313
and 192,302 bytes respectively. These are asset baselines, not measured network
transfer sizes or Lighthouse results, and include shared framework code. Measure
the before/after change rather than promising savings from source size alone.

### 7. Refresh release evidence and maintenance notes — next

README still describes production PyPI publication as outstanding.
[PyPI now lists v0.1.0](https://pypi.org/project/ragvidence/) with wheel and source
artifacts uploaded October 8, 2026. Publication alone does not prove the homepage
command works in a fresh environment. Record a clean isolated install, version,
health, tutorial, and generated-report check, then update the release notes.

The old project-health report also references a TestPyPI header link that is absent
from the current header. Keep old audits historical and point readers to a fresh
baseline rather than reopening resolved findings.

Track the remaining development advisory path:
`eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`.
The current npm audit proposes an incompatible Next lint-stack downgrade. Recheck
upstream fixes; do not force that downgrade.

### 8. Complete optional content and docs polish — later

- The walkthrough recording is missing. The component already accepts MP4,
  captions, and poster assets. Either supply a real recording or make the existing
  interactive preview feel complete without a prominent coming-soon message.
- Add a public release/changelog page when release history is maintained, and
  make the actual shipped CLI license easy to inspect through a verified link or
  accurate published copy.
- Longer docs could benefit from heading links/table of contents and richer
  search. Current search covers titles, descriptions, and groups; it is not
  full-text search. Treat these as usability additions, not broken existing features.

Accounts, dashboards, analytics, billing, and hosted workspaces are outside the
current product flow. The evidence does not establish a need to add them.

## Node.js-inspired hero proposal

The reference currently puts a short, left-aligned introduction and primary action
beside a tabbed code example. Both the explanation and an example are visible on
desktop. Adapt that composition using existing RAGvidence components and styling:

| Element | Proposed RAGvidence treatment |
| --- | --- |
| Headline | “See whether your RAG change helped.” |
| Supporting copy | “Compare retrieval changes locally. Find missing evidence, catch regressions, and inspect every result.” |
| Primary action | Install Free |
| Secondary action | View sample report |
| Example panel | Compact Install / Check / Run / Report preview using the existing CLI demo behavior |
| Result proof | 60% → 90%, explicitly labeled bundled v0.1.0 tutorial, 10 questions, BM25, k=2 |
| Visual language | Existing dark canvas, cyan accent, square panels, text-only wordmark, restrained grid |
| Desktop layout | Introduction left, command/result preview right; reduce hero padding enough for both to appear together |
| Mobile layout | Introduction and actions first, compact preview second, no horizontal overflow |

The separate walkthrough section can retain a longer explanation and future video
without repeating the same full demo. Reuse the current clipboard handling and
manual step controls; do not import full documentation into the hero. Keep actual
CLI commands, the report link, keyboard operation, reduced-motion support, and a
useful no-JavaScript fallback. Sponsor logos or open-source claims from the Node.js
reference do not describe this product.

Recommended implementation order: prerequisite onboarding and mobile dismissal,
production gate and regression coverage, hero revision, then bundle/content polish.
