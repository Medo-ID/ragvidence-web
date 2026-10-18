# Project health

## CLI 0.2.0 synchronization — October 18, 2026

The website now describes one fully free Apache-2.0 CLI for diagnosing and
comparing retrieval on users' data. The CLI repository remained read-only.
The previous cleanup was reviewed and checkpointed separately as `02ad400`.
Current content, examples, report downloads, licenses and media use production
PyPI 0.2.0; provenance and the claim map are in [maintaining.md](maintaining.md).

Local checks: Node 24.20.0, npm 11.19.0, Python 3.12.14, Chromium via Playwright.

| Check | Result |
| --- | --- |
| `npm ci` | Pass |
| ESLint / TypeScript / `git diff --check` | Pass |
| `npm run verify` with normal Turbopack build | Attempted; fresh CSS worker port binding fails with `Operation not permitted`, also on escalated retry |
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
| Reachable-history secret scan | Gitleaks 8.16.0: 41 commits, no leaks |
| Publication snapshot secret scan | Gitleaks 8.16.0: no leaks in maintained source/assets |

An exploratory whole-directory scan included Next's ignored preview/cache keys
and raced active browser traces. The publication scan instead examined exactly
Git-tracked/intended source files, excluding generated files. Those build keys
and captures are not publication inputs. Secret scans detect known patterns,
not all possible confidential information.

The earlier normal-build baseline reused cached CSS and passed. A fresh build
exposed the worker-port restriction; neither that cached run nor the Webpack
fallback establishes a successful fresh normal build. The normal `npm run verify`
command and Turbopack configuration remain unchanged. CI must establish the fresh
normal production gate before this update can be treated as fully verified.

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

The code and synthetic artifacts are ready for review on `release/website-0.2.0`.
CI runs the standard gate on branch pushes as well as PRs, so review candidates
can be checked before merging. No production deployment or DNS change is authorized.
The local preview uses the verified fallback build; it is not a hosted deployment.

Remaining gates:

- Confirm exact-commit CI, including the fresh normal Turbopack build.
- Open/review the website PR and follow any branch protection requirements.
- Connect/select the intended Node 24 Next.js host, then verify a hosted preview.
- Obtain separate production-deployment authorization only after preview review.
- Deploy the reviewed commit, configure host-supplied domain/DNS, verify HTTPS,
  redirects, metadata, search/copy/mobile/media and installation/documentation links.
- Record deployed commit and rollback target, then update repository homepage/About.

There is no GitHub API or hosting token configured in this session. Git SSH can
publish source; PR creation/hosting may require owner access. Do not describe
unperformed CI, hosted-preview or live-domain checks as passed. Human Windows CLI
usability review and sponsorship remain deferred and do not block website work.
