# Project health

## CLI 0.2.1 synchronization — October 19, 2026 (in progress)

Public production tag `v0.2.1` resolves to
`60b3302d8b2ad1726c1a40bece26b64b0c06c1e1`. Downloaded production wheel SHA-256:
`4e74385f2920e13e0de462949791813cf7891fb4575ec17c8e9b577c005eebcf`.
The isolated Python 3.12 installation was compared byte for byte with the wheel.
The CLI checkout's five existing local handoff changes are preserved read-only.

The website now uses a structural grid, shared rails and dividers, persistent
light/dark themes, the refined evidence/CLI mark and owner-selected Amber accent.
The owner reviewed the redesign and requested the implemented spacing refinements.
The amber design passed 75 Chromium tests before the new media integration.
All seven freshly generated robustness journeys passed 70 offline browser checks
and evidence-complete extraction of 14 PDFs. The 42 installed command/schema/PDF
and wheel-license checks pass. Main sample outcomes remain 3/4, 4/4 and 3/4 on
four reviewed dev questions, with mean context sizes 161, 741 and 200 characters.

New media integration and final release/provenance gates remain in progress.
The prior recording is retained until the 22-second candidate is validated.
No current-branch CI or production deployment is claimed yet.

Fresh local normal Turbopack builds hit the known CSS worker port-binding
restriction, including escalated retry. The authorized Webpack verification
fallback passes and is labeled separately. Normal-build verification still
requires exact-commit CI on a capable host. Production audit: zero advisories.
The separate development audit retains the five entries for the accepted braces
advisory below. Generated evidence lives in ignored `verification/website-021/`.

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
changes the website version to 0.2.0 without upgrading dependencies. Keep Next.js
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

The code and synthetic artifacts are pushed for review on `release/website-0.2.0`.
CI runs the standard gate on branch pushes as well as PRs, so review candidates
can be checked before merging. No production deployment or DNS change is authorized.
The local preview uses the verified fallback build; it is not a hosted deployment.

Remaining gates:

- Open/review the website PR and follow any branch protection requirements.
- Connect/select the intended Node 24 Next.js host, then verify a hosted preview.
- Obtain separate production-deployment authorization only after preview review.
- Deploy the reviewed commit, configure host-supplied domain/DNS, verify HTTPS,
  redirects, metadata, search/copy/mobile/media and installation/documentation links.
- Record deployed commit and rollback target, then update repository homepage/About.

The owner chose to open the PR and create the Vercel preview. Use feature branch
`release/website-0.2.0` against `main`; create a **Preview** deployment of that branch
with Node 24, `npm ci` and the normal `npm run build`. No environment variables
are required. Send the reachable preview URL for verification before considering
production authorization. No hosted preview or production URL has been verified.

Checklist tasks 7–11 are complete. Task 12 awaits the owner's PR/hosted-preview
steps, then preview verification and separate production authorization. Task 13
(verified live links/About, deployed identity/rollback and launch) follows
production. The CLI working tree is clean and unchanged. Human Windows CLI
usability review and sponsorship remain deferred and do not block website work.
