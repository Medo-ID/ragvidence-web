# Project health

## CLI 0.2.1 synchronization — October 19, 2026

Public production tag `v0.2.1` resolves to
`60b3302d8b2ad1726c1a40bece26b64b0c06c1e1`. The downloaded production wheel
matches PyPI's SHA-256:
`4e74385f2920e13e0de462949791813cf7891fb4575ec17c8e9b577c005eebcf`.
The isolated Python 3.12 installation was compared byte for byte with the wheel.
The CLI checkout's five existing local handoff changes remain untouched.

The owner-reviewed redesign uses shared rails, thin dividers, persistent
light/dark themes, a refined evidence/CLI mark and Amber #FFBF00 accents.
The requested spacing and terminal/manual-step reductions are implemented.
Reports remain byte-identical generated exports, with their original theme colors.
Samples and media record source commit
`5c9987bc425d87267b5156d2dd6c5c0b5f770d49`; public provenance records every input,
command, report and final media hash. Main outcomes remain 3/4, 4/4 and 3/4 on four
reviewed dev questions, with mean context sizes 161, 741 and 200 characters.

| Check | Result |
| --- | --- |
| Node / npm | 24.20.0 / 11.19.0; `npm ci` passed |
| Complete `npm run verify` | Pass locally with the normal Turbopack build |
| HTTP, links, headers, not-found | 55 routes and 171 links/fragments passed |
| Verifier / provenance tests | 7 passed |
| Chromium | 76 passed; no retries needed in the final run |
| Themes / mobile / keyboard / copy / search | Passed, including storage errors, pre-hydration theme, AA text contrast, overflow and print |
| Native media controls | Click, keyboard playback, seek and captions passed; browser context menu is not intercepted |
| Production dependency audit | Zero advisories |
| Separate development audit | Five high entries for the accepted braces advisory below; no compatible fix offered |
| Installed CLI commands, schemas, PDF and licenses | 42 checks passed |
| Seven robustness journeys | 70 offline browser checks; unchanged evidence and all expected blocks in 14 PDFs |
| Media | H.264 / VP9, 1920×1080, 30fps, 660 frames / 22 seconds; every frame decoded; 22 distinct content samples per format |
| Secret scans | Gitleaks 8.16.0: reachable history and intended publication files; no leaks found |
| `git diff --check` | Pass |

The new MP4, WebM, poster, WebVTT descriptions and transcript replaced the retained
recording only after candidate validation. The video autoplays muted and loops,
with native controls and an explicit toggle. Reduced motion keeps the poster
until explicit playback. A regression test found and now prevents native autoplay
from racing a rejected manual play request. MP4 is 3.88 MB and WebM is 8.71 MB;
continuous motion increases media bytes compared with the historical static scenes.

Before/after local observations used Chromium at 1440×1000 with reduced motion.
Home FCP: 172 → 172 ms; resource transfer: 478,122 → 436,031 bytes. Docs FCP:
68 → 80 ms; transfer: 19,514 → 24,525 bytes. These are individual local runs with
warm shared resources and different build/cache conditions; the final used
Turbopack. They do not establish a performance improvement or measure
full autoplay media delivery. Final captures show no page overflow or console errors.

Fresh local builds earlier encountered CSS-worker port restrictions. The final
normal build and entire standard gate passed without switching bundlers.
Ignored evidence is under `verification/website-021/`; final screenshots and
metrics are in `final/`, with full output in `verify-final.log`. Exact-commit CI
is the remaining source-publication check. No deployment is claimed.

The following 0.2.0 section is a historical verification record.

## CLI 0.2.0 synchronization — October 18, 2026

The website now describes one fully free Apache-2.0 CLI for diagnosing and
comparing retrieval on users' data. The CLI repository remained read-only.
The previous cleanup was reviewed and checkpointed separately as `02ad400`.
Implementation commit: `0ff85aa`. The final report/media provenance records that
exact source commit. Current content, examples, report downloads, licenses and media use production
PyPI 0.2.0; provenance and the claim map are in [maintaining.md](maintaining.md).

Local checks: Node 24.20.0, npm 11.19.0, Python 3.12.14, Chromium via Playwright.

| Check | Result |
| --- | --- |
| `npm ci` | Pass |
| ESLint / TypeScript / `git diff --check` | Pass |
| `npm run verify` with normal Turbopack build | Pass in GitHub Actions on `b860fc1`; local fresh build remains blocked by worker-port sandboxing |
| `npm run build -- --webpack` | Pass; authorized local fallback only |
| HTTP/content/link/header/not-found checks | Pass: 51 routes, 160 links/fragments |
| Verifier and artifact provenance tests | Pass: 6 tests |
| Full Chromium suite | Pass: 66 tests, including both previously failing reduced-motion cases |
| Separate local preview | Pass at `http://127.0.0.1:3000`: route/header checks, 390/1440px captures, no page errors |
| Offline reports / Unicode / escaped source text / print | Pass; open desired portable-report disclosures before printing |
| Native media decoding | Pass: H.264 and VP9, 1920×1080, 60fps, 2,160 frames, 36 seconds, no audio/subtitles |
| Production dependency audit | Pass: zero reported vulnerabilities |
| Full dependency audit | Five high-severity package entries from the accepted development-only braces advisory below |
| PyPI install / uv upgrade / version / health / verify | Pass in isolated `/tmp` environments; personal installation unchanged |
| Installed CLI examples and schemas | Pass: 42 command/help checks, including formats, suites, exact-span imports, PDF and wheel license copies |
| Production wheel checksum | Matches published SHA-256 and handoff |
| Reachable-history secret scan | Gitleaks 8.16.0: all reachable commits, no leaks |
| Publication snapshot secret scan | Gitleaks 8.16.0: no leaks in maintained source/assets |

An exploratory whole-directory scan included Next's ignored preview/cache keys
and raced active browser traces. The publication scan instead examined exactly
Git-tracked/intended source files, excluding generated files. Those build keys
and captures are not publication inputs. Secret scans detect known patterns,
not all possible confidential information.

The complete standard gate passed in [GitHub Actions run 39156419147](https://github.com/Medo-ID/ragvidence-web/actions/runs/39156419147)
on exact candidate `b860fc180ff4c46770905e3049ab198a64561ce8`. It runs the unchanged
`npm run verify` command: lint, types, fresh normal Turbopack production build,
HTTP verifier, verifier/provenance tests, Chromium suite and production audit.
This establishes the normal-build gate on a capable host. The local Webpack
fallback remains labeled separately; local fresh Turbopack attempts hit the CSS
worker port-binding restriction even on escalated retry.

Chromium used temporary NSS/NSPR/ALSA libraries under `/tmp` because this host
lacks them. They are not repository dependencies. Media authoring used a temporary
FFmpeg binary. Generated logs, screenshots, installation environments and working
artifacts remain ignored/outside the repository.

## Dependency policy and tracked advisory

Read exact versions from `package.json` and `package-lock.json`. This update
changes the website version to 0.2.1 without upgrading dependencies. Keep Next.js
aligned with eslint-config-next, React aligned with React DOM and Node types
aligned with Node 24. Do not use force fixes or incompatible overrides.

The currently accepted development advisory follows this path:

```text
eslint-config-next@16.4.0
└─ @next/eslint-plugin-next@16.4.0
   └─ fast-glob@3.3.1
      └─ micromatch@4.0.8
         └─ braces@3.0.3
```

Identifier: `GHSA-vfj7-8cjw-p6xm`, stack exhaustion on deeply nested patterns.
The five audit entries represent that dependency and affected ancestors.
No compatible fix is offered; do not apply the proposed incompatible Next lint
stack downgrade. Production audits must remain clean. Recheck on dependency updates.

## Review and deployment status

The review branch is `release/website-0.2.1`, based on current `origin/main`.
The owner previously chose to open the PR and create the Vercel preview.
No production deployment or DNS change is authorized. The local preview uses
the normal production build at `http://localhost:3011`; port 3000 may still serve
an older unrelated preview and should not be used for this review.

Owner actions after exact-commit CI passes:

1. Open/review the branch PR against `main` and satisfy branch protection.
2. Create a Vercel **Preview** deployment for this branch with Node 24,
   `npm ci` and normal `npm run build`; no environment variables are needed.
3. Supply the preview URL for route, browser, HTTPS and media verification.
4. Authorize production separately after reviewing that concrete preview.

After authorization, record the deployed commit and rollback target, verify
live canonical URLs/redirects and update repository About/homepage only when
those destinations are live. Human Windows CLI usability review and sponsorship
remain deferred and do not block this website release.
