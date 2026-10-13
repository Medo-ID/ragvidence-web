# SEO audit before deployment

Follow-up: the local font-induced mobile layout shift is now fixed and verified
in [layout-stability.md](layout-stability.md). Hosting/indexing and field checks
remain pending; the baseline numbers and earlier findings below are historical.

October 13, 2026. Audited the local production build at `6362e53`, including the
user's existing heading and video edits. The public site is not hosted yet.
This is a technical/content audit, not proof of Google indexing, keyword demand,
rankings, live redirects, or field Core Web Vitals.

## Baseline findings

[Rendered observations](../verification/seo/baseline/observations.json) cover
all 23 HTML routes with JavaScript disabled, robots/sitemap, a genuine missing
URL, and the public brand-review pages. [Production checks](../verification/identity/seo-baseline/checks.json)
pass lint, types, Webpack build, routes/links/headers, four verifier tests,
39 scoped Chromium tests, and production audit with zero vulnerabilities.

| Priority | Finding | Proposed action |
| --- | --- | --- |
| High | All 22 non-home routes inherit the homepage Open Graph title, description, and URL, and homepage Twitter text. | Generate complete route-specific metadata from one helper. This fixes misleading shared links; social tags are not a ranking shortcut. |
| High | `/docs` and `/docs/overview` have identical article content but different self-canonicals and both appear in the sitemap. | Prefer `/docs`, align the alias canonical and internal links, and include only preferred URLs in the sitemap. Keep the existing alias usable. |
| Medium | Documentation article titles lack the RAGvidence suffix because the nested layout changes metadata inheritance. | Use explicit complete page titles so both search and social titles are consistent. |
| Medium | No structured data is rendered. | Add factual WebSite identity and documentation breadcrumbs, safely serialized. |
| Medium | Public comparison/brand-sheet/tab-preview HTML has no indexing exclusion. | Apply `X-Robots-Tag: noindex` to those review HTML pages while allowing crawling and keeping logos/favicon assets accessible. |
| Medium | The home title says diagnostics but omits the clearer product category, retrieval evaluation. | Use a concise title and description naming local RAG retrieval evaluation, BM25/semantic retrieval, evidence, and reports. |
| Low | Social image uses an earlier text wordmark with a trailing period. | Align it with the selected evidence-convergence mark and exact capitalization. |
| Follow-up | Mobile homepage lab CLS median is 0.139; video also consumes bandwidth before reaching its section. | Check layout-shift attribution and real-device/live loading after deployment. Preserve the user's working autoplay fix in this milestone. |

The foundation is sound: every HTML page returns 200, has a description, one H1,
an English language declaration, a canonical, and server-rendered article text.
Missing top-level URLs return 404. The robots file allows crawling and names the
production sitemap. Product/docs/trust pages are internally linked. The site
does not require customer accounts, third-party fonts, analytics, or a backend.
The existing copy explains real features and labels the tutorial as bundled data.

## Local performance baseline

Three cold browser contexts per page/profile, sampled five seconds after
DOMContentLoaded. Mobile uses 390×844, 4× CPU slowdown, 50ms network latency and
200,000 bytes/sec throughput; desktop uses 1440×900 without CPU slowdown,
zero added latency and 10,000,000 bytes/sec. These are localhost lab measurements,
not production PageSpeed scores or field Core Web Vitals. INP is not measured.
Completed JavaScript/CSS body sizes and media bytes received during the observation
window are recorded; incomplete transfers are not counted as complete resources.

| Page / profile | Median LCP | Median CLS | Completed JS | CSS |
| --- | ---: | ---: | ---: | ---: |
| Home / mobile | 628ms | 0.139 | 157,523B | 8,049B |
| Semantic docs / mobile | 560ms | 0.032 | 157,523B | 8,049B |
| Home / desktop | 200ms | 0 | 159,585B | 8,049B |
| Semantic docs / desktop | 152ms | 0 | 157,523B | 8,049B |

Median homepage media received in this window: 598,384B mobile, 3,241,040B desktop.
There were no browser exceptions, unexpected external requests, or horizontal
overflow in the measured views. The mobile CLS result deserves follow-up;
it is not evidence that the deployed site passes all performance requirements.

[Mobile baseline](../verification/seo/baseline/landing-390.png) ·
[Desktop baseline](../verification/seo/baseline/landing-1440.png) ·
[Docs baseline](../verification/seo/baseline/docs-1440.png) ·
[Social preview baseline](../verification/seo/baseline/opengraph.png).

## Content priorities

Intent mapping below is inferred from the product, without search-volume or
competitor-ranking research. Keep the homepage focused on the category and
engineer outcome. Use the documentation to answer concrete workflow questions.

| Reader intent | Existing destination | Useful future improvement |
| --- | --- | --- |
| Local RAG retrieval evaluation tool | `/` | Clear product/category title; preserve the install, privacy and real report proof. |
| Install RAGvidence | `/docs/installation` | Keep production install/version requirements accurate. |
| Evaluate BM25 vs semantic retrieval | `/docs/bm25-workflow`, `/docs/semantic-workflow` | Add a concise comparison of when to test each, using controlled examples. |
| Evaluate an existing RAG retriever | `/docs/import-retriever` | Add tested integration examples for actual imported artifacts. |
| Evidence coverage, sufficiency and retrieval depth | `/docs/metrics`, `/docs/retrieval-depth` | Explain metric tradeoffs using small ranked-evidence examples, preserving definitions. |
| Diagnose retrieval regressions | `/docs/compare-diagnose` | Show an honest failure/recovery investigation with limitations. |

Do not publish generic AI blog filler, keyword lists, invented customer results,
ratings, unsupported competitor comparisons, or unshipped Plus claims. Do not
change current metric definitions to make explanations easier.

## Proposed implementation files

`src/lib/seo.ts`, `src/lib/doc-path.ts`, `src/app/layout.tsx`,
`src/app/docs/layout.tsx`, `src/app/docs/[slug]/page.tsx`,
`src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/app/security/page.tsx`,
`src/app/releases/page.tsx`, `src/app/sitemap.ts`, `src/app/opengraph-image.tsx`,
`src/components/doc-page.tsx`, `src/components/docs-sidebar.tsx`,
`src/components/product-sections.tsx`, `next.config.ts`,
`scripts/verify-site.mjs`, `tests/browser/seo.spec.ts`, and the audit/progress notes.
The SEO review harness and captured evidence are under `verification/seo/`.
Protected `src/app/page.tsx` and `src/components/product-demo.tsx` will be preserved.

## Applied improvements and final verification

The implementation follows the proposed file list. Every HTML destination now
has a complete branded title, description, canonical, Open Graph title/URL and
Twitter title/description. `/docs/overview` retains its content and URL for
compatibility but agrees with `/docs` as canonical; sidebar, previous/next and
landing links prefer `/docs`. The sitemap contains 22 unique preferred URLs.
It omits the duplicate alias, unused priority/changefreq values and invented
modification dates.

The shared server layout emits one factual WebSite identity node per HTML page,
including the homepage required by Google's site-name guidance. Documentation
adds a two-step BreadcrumbList using real navigable URLs. JSON-LD is inert,
escaped against script termination, and tested with malicious-looking text.
No SoftwareApplication rating/review markup, FAQ rich-result claim, analytics,
or customer data collection is introduced. Reports remain unchanged and script-free.

Five brand-review HTML pages receive `X-Robots-Tag: noindex`; robots still permits
crawling so the exclusion can be read. Product pages, logo/favicon assets and
the generated public report remain accessible. All existing security headers
were verified. The 1200×630 social image now uses concept A and local Geist
SemiBold. Its 127,872-byte font is explicitly included in the route's deployment
trace; no remote font fetch is needed. [Trace evidence](../verification/seo/font-trace.json).

[Final gate](../verification/identity/seo-foundations/checks.json) passes lint,
TypeScript, Webpack production build, 39 routes/124 internal links and fragments,
five verifier/security tests, 43 scoped Chromium tests, and production audit
with zero vulnerabilities. New browser checks inspect rendered metadata with
JavaScript disabled, canonical/sitemap agreement, inert structured data and
indexing exclusions. [Final observations](../verification/seo/final/observations.json)
crawl all 23 HTML routes and record screenshots and the same 12 lab samples.
Mobile and desktop landing/docs screenshots and the social image were visually
reviewed. No browser exceptions, unexpected external requests or measured
horizontal overflow were found.

The first new browser run failed on the root canonical's optional trailing
slash: Next.js emitted the same root URL without `/`, while the assertion
compared raw strings. URL-normalized comparisons preserve the scheme, host and
path checks; the corrected run passes. [Initial failure](../verification/seo/canonical-test-first-run.log).
Deployment inspection then found the social font absent from the route trace;
an explicit, narrowly scoped include fixed it, followed by another full available
gate. Normal Turbopack selection and all existing security headers were preserved.

| Page / profile | Baseline → final median LCP | Baseline → final median CLS | JS delta | CSS delta |
| --- | ---: | ---: | ---: | ---: |
| Home / mobile | 628 → 632ms | 0.139 → 0.139 | +2B | 0B |
| Semantic docs / mobile | 560 → 540ms | 0.032 → 0.032 | +2B | 0B |
| Home / desktop | 200 → 148ms | 0 → 0 | +2B | 0B |
| Semantic docs / desktop | 152 → 160ms | 0 → 0 | +2B | 0B |

These small sample differences are ordinary lab variation, not a demonstrated
speed improvement. The homepage mobile layout shift remains unresolved. No video
or hero content change was made. The deployment-trace-only addition followed the
final visual/lab capture and does not change rendered content or client assets.

[Final mobile](../verification/seo/final/landing-390.png) ·
[Final desktop](../verification/seo/final/landing-1440.png) ·
[Final documentation](../verification/seo/final/docs-1440.png) ·
[Final social image](../verification/seo/final/opengraph.png).

The protected `page.tsx` SHA-256 remains
`940e142b46b2e335983da8782b867779c3a35266f02133fae9981a6815cf7e71`;
`product-demo.tsx` remains
`14b2112ba11d7bbbb449b4643e2140d70072d96c2384c0a5427485a20dc939cf`.
Neither file is included in the SEO implementation commit.

## Deployment checks still needed

1. Deploy a Vercel preview, verify its build and routes, then connect the production
   domain. Keep production canonicals pointed at the final public domain.
2. Confirm HTTPS and one-hop HTTP-to-HTTPS/domain redirects, absence of deployment
   `noindex` on production pages, and correct robots/sitemap/image responses.
3. Verify domain ownership in Search Console, submit `/sitemap.xml`, and inspect
   the home page and representative docs with URL Inspection. No ownership token
   is available in this workspace and no submission has been performed.
4. Validate deployed breadcrumbs in Rich Results Test and site identity in Schema
   Markup Validator. Local parsing is not external schema/rich-result validation.
5. Run mobile/desktop PageSpeed and test real devices. Use Search Console/CrUX
   field data when enough traffic exists. Review mobile layout shifts and video
   loading before claiming Core Web Vitals are good.
6. Add the final website/docs links to the public package/repository profiles when
   those changes are authorized. No external profiles were edited in this audit.

Standard Turbopack build confirmation remains pending; the authorized Webpack
gate is used here. The accepted development-only braces advisory remains tracked
in project health. Full video regression coverage is outside this SEO milestone.

## Reference guidance

- [Google: concise, distinct title links](https://developers.google.com/search/docs/appearance/title-link)
- [Google: consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google: use preferred URLs in sitemaps; priority/changefreq are ignored](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: WebSite identity on the homepage](https://developers.google.com/search/docs/appearance/site-names)
- [Google: breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Google: noindex requires crawl access](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Google: SoftwareApplication rich results require a real rating or review](https://developers.google.com/search/docs/appearance/structured-data/software-app)
- [Google: Core Web Vitals and search](https://developers.google.com/search/docs/appearance/core-web-vitals)

The installed Next.js guides for metadata inheritance, JSON-LD, sitemap and header
matching were read before implementing changes. Structured data will describe
only visible, true content; no synthetic reviews or SoftwareApplication rich-result
eligibility claim will be added.
