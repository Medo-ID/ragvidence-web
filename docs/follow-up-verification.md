# Verification and quality follow-up

Checked October 12, 2026, after the layout commit `6c83045`, using Node 24.20.0
and npm 11.19.0. This supersedes the pending verification status in the initial
implementation notes.

## Completed fixes

- Cancelling the HTTP verifier with SIGINT or SIGTERM now stops the production
  server it spawned and returns the conventional 130/143 exit status. Cleanup is
  shared with the normal finally path, so concurrent shutdown requests do not
  duplicate the lifecycle. Explicit external targets remain outside its ownership.
  A regression reproduced the missing cancellation cleanup before the fix; both
  signal variants now pass.
- Print styling now uses dark text and transparent surfaces on white paper.
  Headings, links, commands, and callouts retain readable contrast. Clipboard and
  demo controls are hidden in print. The previous documentation print check failed
  on low-contrast text; its regression now checks at least 4.5:1 text contrast
  against white paper.

## Completed verification

The original working-directory build still encountered the Turbopack worker-port
restriction, including on an approved retry. A fresh checkout was prepared in
`/tmp/ragvidence-clean-verification` from the layout commit, followed by a fresh
`npm ci`. The follow-up source files were copied into that checkout and compared
with the working tree. It uses the same manifest, lock, Next config, and Turbopack
CSS loader; no bundler or dependency-version change was made.

| Check | Result |
| --- | --- |
| Fresh npm ci | Pass, 383 packages installed |
| ESLint / TypeScript | Pass |
| Production Turbopack build | Pass in the fresh checkout |
| Full npm run verify | Pass in the fresh checkout |
| HTTP smoke check | 29 routes, 117 links/fragments, all five configured headers, sitemap doc coverage, and not-found behavior pass |
| Verification regressions | All four pass, including SIGINT/SIGTERM cleanup |
| Chromium regressions | All 14 pass, including the corrected narrow-screen cases and print contrast |
| Separate production smoke check | Pass against a separately started production server on port 3001 |
| Production dependency audit | Zero reported vulnerabilities |
| Screenshot / console review | Desktop hero, mobile docs, workflow, proof, plans, and report themes inspected; no uncaught page errors |
| Responsive containment | No page overflow at 320, 390, 768, 1024, 1440, or 1920px; long commands scroll within their containers |

The verification server was stopped after the checks. The hosted GitHub Actions
job, deployment, and domain/DNS checks have not been executed. The successful fresh
checkout proves the production source builds; it does not establish the cause of
the original working-directory restriction.

## Final asset observations

The same local measurement script sampled homepage and installation docs at 390px
and 1440px, after loading and framework prefetching. Totals count unique script and
stylesheet references present in the page; gzip values are summed per asset,
not measured wire transfer sizes.

| Assets | Before layout pass | Final production source |
| --- | --- | --- |
| JavaScript, raw | 627,096 bytes | 603,729 bytes |
| JavaScript, summed gzip | 196,457 bytes | 188,775 bytes |
| CSS, raw | 36,731 bytes | 36,985 bytes |
| CSS, summed gzip | 7,779 bytes | 7,847 bytes |

Final local LCP samples were 92–172ms, with automated click/search samples of
36–68ms. These unthrottled localhost observations are not controlled benchmarks or
claims about production user performance. The desktop hero ends at approximately
y=882px at 1440px, so the introduction and preview controls fit together within the
900px review viewport.

## Remaining items

- The real walkthrough and full-text search were subsequently completed; see
  [optional-feature-verification.md](optional-feature-verification.md).
- The development-only `braces` advisory remains inherited through the Next lint
  stack. Registry checks still report braces 3.0.3 and eslint-config-next 16.4.0;
  no compatible patched release was found. The production audit remains clean.
- Hosting, HTTPS/DNS, and the hosted CI run remain release checks outside this
  local verification. No deployment or GitHub push was performed.
