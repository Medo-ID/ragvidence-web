# Walkthrough and full-text search

Verified October 12, 2026, following the teal theme commit `902f6b9`.

## Completed work

- Added a silent, approximately 66-second 1280×720 recording of the production
  v0.1.0 CLI. It installs into a new isolated tool environment, checks the version
  and health, runs the tutorial, opens the generated report, and expands ranked
  evidence. Commands actually run; their output is displayed after exit with
  reading pauses. Host installation caches were reused.
- English WebVTT captions follow all six chapters. Their boundaries are measured
  from the encoded heading transitions within 40ms. The player has native controls,
  no autoplay, no video preload, a reserved 16:9 frame, and external links to the
  written tutorial and recording download.
- Authoring scripts preserve command arguments/output and verified artifact
  summaries in the provenance JSON. They check 6/10 versus 9/10 at k=2, three
  improvements, zero regressions, and one persistent failure. Output is staged
  before copying successful media to its destination. The recreated recording
  passed the complete authoring pipeline, including automatic caption alignment.
- Added a statically prerendered `/docs/search-index.json` route from the existing
  typed documentation blocks. Article text loads only on the first search; queries
  and filtering stay in the browser. Multiple terms can match across an article.
  Failed or invalid index responses retain metadata search and an explicit retry.
  Requests are cancelled on unmount; loading does not announce false empty results.
- Clarified the tutorial labels to say ten **answerable** questions. The generated
  report also includes two unanswerable cases with N/A evidence metrics, excluded
  from the success-rate denominator. Tutorial docs explain this distinction.
  Scores and recorded report content are unchanged.

The recording uses website CSS to present the real generated report. The committed
sample report itself is byte-identical to the preceding theme commit.

## Final verification

The existing fresh checkout at `/tmp/ragvidence-clean-verification` uses the same
manifest, lockfile, Next config, Turbopack loader, and final application source.
The original workspace's previously documented worker restriction remains an
environment limitation; it was not worked around by changing the bundler.

| Check | Result |
| --- | --- |
| Full `npm run verify` | Pass |
| ESLint / TypeScript / production build | Pass |
| HTTP/content/header checks | 33 routes and 118 internal links/fragments pass |
| Verifier lifecycle regressions | Four pass |
| Chromium regressions | All 24 pass |
| Separate production smoke check | Pass against a separately started final build on port 3001 |
| Production dependency audit | Zero reported vulnerabilities |
| Screenshot and console review | Desktop/mobile video, native captions, article search, comparison metrics, and expanded evidence inspected; no uncaught page errors |
| Responsive containment and hero sizing | Pass at 320, 390, 768, 1024, 1440, and 1920px, including every preview step |

New browser coverage proves on-demand index loading, article-only matches,
multiple-term search, local queries, HTTP/invalid-index failure recovery, native
video decoding/playback, all six caption cues, and captions reaching the encoded
video's end. Existing coverage retains clipboard failure/retry, mobile navigation,
Escape dismissal, print contrast, reduced motion, and JavaScript-disabled access.
All servers started for these checks were stopped.

## Asset observations

Samples use the same local script after loading and framework prefetching. Gzip
totals sum individual asset sizes; they are not measured wire-transfer totals.

| Assets | Theme commit | Final optional features |
| --- | --- | --- |
| JavaScript, raw | 604,079 bytes | 605,358 bytes |
| JavaScript, summed gzip | 188,889 bytes | 189,411 bytes |
| CSS, raw | 37,579 bytes | 37,579 bytes |
| CSS, summed gzip | 7,993 bytes | 7,993 bytes |

The search index is 20,193 raw / 7,065 gzip bytes, fetched on demand rather than
imported into initial navigation JavaScript. The video is 5,035,435 bytes and
downloads when playback begins; its poster is 306,178 bytes. Browser tests observed
no video request before playback. Local unthrottled LCP samples were 108–208ms;
automated interactions were 35–93ms. These observations are not controlled
benchmarks or production performance claims.

## Remaining release work

- The inherited development-only `braces` advisory awaits a compatible upstream
  fix; dependencies were not changed in this pass. Production auditing is clean.
- Hosted CI, deployment, HTTPS, and DNS checks remain external release work.
  No push or deployment was performed. Chromium verification does not certify
  playback in every browser or CLI installation on every operating system.
