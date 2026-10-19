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
Samples retain source commit `5c9987bc425d87267b5156d2dd6c5c0b5f770d49`.
The revised media records reachable baseline `547e441ab3cb04c073f586ebe606397a060265c4`
and a SHA-256 snapshot of the exact authoring files, so the owner-requested amended
delivery commit can bind the changed source and media without changing reports.
Public provenance records every input, command, report and final media hash. Main outcomes remain 3/4, 4/4 and 3/4 on four
reviewed dev questions, with mean context sizes 161, 741 and 200 characters.

| Check | Result |
| --- | --- |
| Node / npm | 24.20.0 / 11.19.0; `npm ci` passed |
| Complete `npm run verify` | Pass locally with the normal Turbopack build |
| HTTP, links, headers, not-found | 75 routes and 191 links/fragments passed |
| Verifier / provenance tests | 10 passed |
| Chromium | 83 passed; no retries needed in the final run |
| Themes / mobile / keyboard / copy / search | Passed, including storage errors, pre-hydration theme, AA text contrast, overflow and print |
| Video playback | Owner-requested hidden controls and autoplay in both motion preferences; click, keyboard, seek/captions and untouched browser context menu are checked |
| Production dependency audit | Zero advisories |
| Separate development audit | Five high entries for the accepted braces advisory below; no compatible fix offered |
| Installed CLI commands, schemas, PDF and licenses | 42 checks passed |
| Seven robustness journeys | 70 offline browser checks; unchanged evidence and all expected blocks in 14 PDFs |
| Media | H.264 / VP9, 1920×1080, 30fps, 1,020 frames / 34 seconds; every frame decoded; 34 distinct samples per format; MP4 fast-start verified |
| Secret scans | Gitleaks 8.16.0: reachable history and intended publication files; no leaks found |
| `git diff --check` | Pass |

The owner requested more instructional pacing after the initial review. The
34-second revision shows a local-file question, a larger/slower comparison command,
all real output and HTML/JSON/Markdown export paths before opening HTML. The
reference-style black arrow/white outline becomes a hand on controls, and focused
zooms indicate resources and original evidence. Scores and report bytes are unchanged.

Per the owner's latest request, the video has no visible playback bar or overlay
and requests muted looping autoplay even with reduced motion enabled. Click and
Space/Enter pause or play, and the native right-click menu remains intact. Browser
or device policies can still block autoplay; retry/download/transcript recovery
is provided. Other site animations retain reduced-motion support. The primary
MP4 is 3,623,208 bytes (3.62 MB), approximately 58% less than the prior primary
WebM's 8,712,670 bytes. The VP9 fallback is 5,175,593 bytes (5.18 MB). Both are
smaller than the corresponding prior encodings despite the longer demonstration.
MP4 fast-start metadata is verified by checking that `moov` precedes `mdat`.

A controlled loading observation used cold browser cache, 40 ms latency and
4 Mbit/s download on the local production server. First video frame was about
1.14 s both before (WebM) and after (MP4); this does not establish a speed gain.
Reduced-motion mode now also autoplays as requested (first frame about 1.15 s).
These are single local observations, not a benchmark or SEO ranking claim.
Logs and final captures for this revision are in
`verification/website-021/video-revision/`.

Before/after local observations used Chromium at 1440×1000 with reduced motion.
Home FCP: 172 → 136 ms; resource transfer: 478,122 → 435,968 bytes. Docs FCP:
68 → 76 ms; transfer: 19,514 → 23,269 bytes. These are individual local runs with
warm shared resources and different build/cache conditions; the final used
Turbopack. They do not establish a performance improvement or measure
full autoplay media delivery. Final captures show no page overflow or console errors.

Fresh local builds earlier encountered CSS-worker port restrictions. The final
normal build and entire standard gate passed without switching bundlers.
Ignored evidence is under `verification/website-021/`; final screenshots and
metrics are in `final/`, with full output in `verify-final.log`. The pushed
review branch also runs the unchanged standard gate in
[GitHub Actions](https://github.com/Medo-ID/ragvidence-web/actions?query=branch%3Arelease%2Fwebsite-0.2.1).
Check its exact commit before merging. No deployment is claimed.

The final spacing pass reduces the hero title from 84 to 66 px maximum, tightens
terminal text to 13 px (12 px in the manual preview) and removes the duplicate
installation terminal. The manual preview keeps its commands and explanations,
while removing repeated checklists/results already shown elsewhere. Shorter
feature descriptions and more section padding
leave more surrounding space. The video frame is square; docs navigation uses a
square selection edge aligned with the left structural rail, with inset keyboard
focus so its outline is not clipped. Article body text retains its reading size.

All 20 articles now offer Markdown copy and download from statically generated
routes. They share the HTML article source, preserve raw commands and scope
notices, and use absolute links. Browser checks cover both themes/mobile,
keyboard copying, denied clipboard recovery, failed fetch/retry, downloads and
no-JavaScript use. Markdown responses are noindex; existing HTML canonicals and
sitemap coverage remain intact.

The unchanged movie passed complete decoding and provenance checks again. Its
historical website context snapshot remains intact. Validation distinguishes
actual recording scripts/branding/report inputs from surrounding website page
and CSS context, so these spacing changes do not claim to be new footage.

The finishing review captured 390/1440 px home/docs pages in both themes without
overflow or console errors. Local before/after observations at 1440×1000 measured
home FCP 236 → 156 ms and initial resource transfer 437,596 → 438,003 bytes; docs
FCP 108 → 96 ms and transfer 24,560 → 23,220 bytes. These are single local runs,
with shared warm resources, not a demonstrated speed gain or full video delivery
measurement. Evidence is in `verification/website-021/finishing/`.

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
