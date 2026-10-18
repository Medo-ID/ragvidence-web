# Project health

## Verification status

Repository cleanup: October 15, 2026. Historical design reviews, screenshots,
logs, temporary captures, and unused brand alternatives were removed. Maintained
browser tests, verifier tests, CI, and repeatable media-authoring tools remain.

Cleanup verification on Node 24.20.0 / npm 11.19.0:

| Check | Result |
| --- | --- |
| ESLint and TypeScript | Pass |
| `npm run build -- --webpack` | Pass |
| HTTP/content/header checks | Pass: 39 routes, 124 links/fragments |
| Verifier regression tests | Pass: 5 tests |
| Chromium suite | 62 pass, 2 existing reduced-motion failures |
| Production dependency audit | Pass: zero reported vulnerabilities |
| Gitleaks 8.16.0 | No leaks detected in 40 commits or the cleaned publication snapshot |
| Additional credential-pattern scan | No matches in 1,120 reachable historical blobs or current source files |

The two browser failures are `reduced motion shows the poster without loading or
autoplaying video` and `native source queries preserve the reduced-motion poster
before hydration` in `tests/browser/site.spec.ts`. The current video component
autoplays unconditionally and its sources lack reduced-motion media queries.
The component is byte-identical to the pre-cleanup HEAD; this cleanup does not
change video behavior. Fix those failures before treating the full gate as green.
Browser checks used temporary libraries outside the repository because the host
lacked Chromium's NSS/NSPR/ALSA libraries. No dependencies were added to the project.

The sample report, active mark, videos, poster, and recording provenance retain
their pre-cleanup SHA-256 hashes. Deletions remove historical review artifacts
from the current tree; existing Git history remains intact. Secret scans detect
known patterns and do not constitute a guarantee that all sensitive data is absent.

The restricted execution environment previously prevented Turbopack worker port
binding. The existing Webpack CSS hook permits `npm run build -- --webpack` for
local verification; the normal build remains Turbopack. Standard build and live
hosting/domain checks remain pending on a capable host.

## Dependency policy and tracked advisory

Read exact dependency versions from `package.json` and `package-lock.json`.
Keep Node types aligned with Node 24, Next.js aligned with eslint-config-next,
and React aligned with React DOM. Check peer compatibility before major updates.
The previously audited TypeScript lint range was `>=4.8.4 <6.1.0`; the React and
accessibility lint plugins excluded ESLint 10. Recheck installed peers before
changing those versions.

The previously accepted development-only advisory follows this path:

```text
eslint-config-next@16.4.0
└─ @next/eslint-plugin-next@16.4.0
   └─ fast-glob@3.3.1
      └─ micromatch@4.0.8
         └─ braces@3.0.3
```

Advisory identifier: `GHSA-vfj7-8cjw-p6xm` (stack exhaustion on deeply nested
patterns). The prior audit reported no compatible fix; its proposed Next.js
lint-stack downgrade was not applied. Recheck with `npm audit` when updating
dependencies. Do not use force fixes or incompatible overrides. Audit production
and development separately; production audits must pass.

## Release checks

- Run `npm ci` and `npm run verify` on a capable host.
- Check preview routes and headers with `RAGVIDENCE_SITE_URL` and `verify:site`.
- Check keyboard navigation, search, copy controls, reduced motion, and media.
- Confirm the intended CLI release installs from production PyPI before changing
  availability claims or announcing a release.
- Verify hosting, domain configuration, HTTPS, and live loading behavior.

Local measurements and synthetic tutorial outcomes are not field performance
claims. Keep new verification output in ignored directories.
