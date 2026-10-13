# Project health baseline

October 13 identity refinement: [identity-progress.md](identity-progress.md) records
separate milestone commits, passing Webpack production gates, responsive/browser
checks, regenerated CLI report, and native 1080p60 media. The original baseline
commit is `2c91723`. Standard Turbopack and deployment confirmation remain pending
with the user. The known development-only braces advisory is temporarily accepted;
production audits remain clean. Do not treat earlier visual guidance below as current.

Current visual system and delivery: [identity-delivery.md](identity-delivery.md).
Historical visual record: [neutral-design-pass.md](neutral-design-pass.md) records
the earlier charcoal redesign, opaque reporting HTML, and silent 60fps product demo.
Earlier verification: [follow-up-verification.md](follow-up-verification.md)
records the successful October 12 production gate in a fresh checkout and remaining
release checks. [implementation-pass.md](implementation-pass.md) describes the UI changes.
The tables below remain the historical October 8 audit.

Checked on October 8, 2026, against the working tree, including pre-existing edits
to the package files, root layout, and landing page. This audit adds documentation;
it does not upgrade dependencies or change application behavior.

Follow-up: the subsequent UI implementation passed a fresh `npm run check`,
production HTTP verification, and Chromium interaction/responsive checks. The
earlier worker-port restriction no longer blocked that build. See
`docs/design-pass.md` for the completed work and final verification. The findings
below describe the original audit baseline.

## Executed checks

| Check | Result |
| --- | --- |
| Runtime | Node 24.20.0 / npm 11.19.0; matches project baseline |
| `npm run lint` | Pass; zero errors or warnings |
| `npm run typecheck` | Pass |
| Source unused locals/parameters | Pass; no source diagnostics |
| Manifest/lock root dependencies, dev dependencies, engines | Match |
| `npm ls --depth=0` | Pass; installed direct dependencies match |
| `npm ls --all --json` | Pass; full dependency tree reports no problems |
| `npm outdated --json` | Three newer majors; no within-range updates |
| `npm audit --omit=dev --json` | Zero reported vulnerabilities |
| `npm audit --json` | Five high-severity package entries from one underlying development dependency advisory |
| `npm run build` | Blocked: Turbopack worker port binding fails with `Operation not permitted` |
| `npm run check` | Lint and types pass; build prevents the combined gate passing |
| `npm run verify:site` | Pass against the reachable local site: 27 routes, 26 internal links |
| Tailwind class compilation and removed-utility scan | No invalid or removed utilities in the examined source |
| Docs structure | 17 unique slugs; heading IDs, navigation groups, and table widths consistent |
| Sample report source | No scripts or remote URLs detected |
| `git diff --check` | Pass on the audited tree |

Production build failed inside the sandbox and on permission-escalated retries.
The failure is a worker/process networking restriction, not an identified TS or
ESLint error. The local HTTP smoke check succeeded on an escalated retry, but
cannot establish that a fresh production build works. Rerun the build in an
environment that permits the Turbopack worker's socket, then smoke-test that build.
No browser interaction, accessibility audit, Lighthouse measurement, or fresh
`npm ci` installation was performed.

An exploratory `tsc --noUnusedLocals --noUnusedParameters` over the whole configured
tree reported two unused imports/types in generated `.next/dev/types/validator.ts`.
A separate TypeScript program checking source files produced zero source unused
diagnostics. Do not edit generated Next.js validators to fix this exploratory check.

## Dependency findings

Installed direct packages: Next.js and eslint-config-next 16.4.0; React and React DOM
19.3.0; Tailwind CSS and its Turbopack loader 4.3.3; Geist 1.7.2; Lucide React 1.53.0;
TypeScript 6.0.3; ESLint 9.39.5; Node types 24.19.1; React types 19.3.0.

| Package | Installed / wanted | npm latest | Assessment |
| --- | --- | --- | --- |
| `@types/node` | 24.19.1 | 26.6.4 | Keep aligned with Node 24 runtime |
| `eslint` | 9.39.5 | 10.12.0 | Installed React and JSX accessibility plugins exclude ESLint 10 in their peers |
| `typescript` | 6.0.3 | 7.0.2 | Installed typescript-eslint 8.71.1 requires `>=4.8.4 <6.1.0` |

These are compatibility constraints, not evidence that the application needs an
immediate upgrade. All other direct packages match npm's latest reported versions.
Recheck registry results and installed peer ranges before future upgrades.

The development advisory path is:

```text
eslint-config-next@16.4.0
└─ @next/eslint-plugin-next@16.4.0
   └─ fast-glob@3.3.1
      └─ micromatch@4.0.8
         └─ braces@3.0.3
```

The [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) concerns stack
exhaustion on deeply nested patterns. It lists no patched version; npm reports
3.0.3 as latest. The five audit entries cover this dependency and its affected
ancestors, rather than five independent root vulnerabilities. npm proposes
downgrading eslint-config-next to 14.2.35. That conflicts with the current Next.js
lint stack; do not apply that suggestion blindly. Track an upstream compatible fix.

## Tailwind findings

Read the [official v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide) and
checked source class values using the installed 4.3.3 compiler/design system with
the actual global theme. Inspected 20 TSX files, 270 `className` attributes, and 358
unique class strings, including conditional branches and referenced style strings.
Custom CSS helpers were accounted for. The separately referenced array color
classes compile; the font package's generated variable class names are not Tailwind
utilities and were excluded from utility validation.

No removed v3 utilities or unsupported utility candidates were found. The installed
compiler suggests eight optional canonical replacements:

| Current | Canonical | Source |
| --- | --- | --- |
| `bg-amber-400/[0.055]` | `bg-amber-400/5.5` | `src/components/doc-renderer.tsx:28` |
| `bg-signal/[0.055]` | `bg-signal/5.5` | `src/components/doc-renderer.tsx:28` |
| `bg-success/[0.055]` | `bg-success/5.5` | `src/components/doc-renderer.tsx:28` |
| `bg-white/[0.025]` | `bg-white/2.5` | `src/components/copy-command.tsx:21` |
| `hover:bg-white/[0.04]` | `hover:bg-white/4` | `src/components/site-header.tsx:26,39` |
| `hover:bg-white/[0.05]` | `hover:bg-white/5` | `src/components/site-header.tsx:32` |
| `min-w-[34rem]` | `min-w-136` | `src/components/doc-renderer.tsx:33` |
| `tracking-[-0.025em]` | `tracking-tight` | `src/components/brand.tsx:5` |

These classes already work. Canonicalization is cleanup, not a production fix.
`globals.css:67` also duplicates Tailwind's built-in `text-balance` utility, and
`--header-height` at line 20 is currently unused. Review these during CSS cleanup.

## Prioritized optimization backlog

1. **Establish a trustworthy production gate.** `scripts/verify-site.mjs:17` starts
   `next dev` if its target URL is unavailable; it can also reuse any reachable
   server. Consequently `npm run verify` does not guarantee the smoke check exercises
   the build it just produced. Test a dedicated `next start` server after a successful
   build. Improve server startup/error handling and ensure cleanup on thrown fetch
   errors. A nonlocal `RAGVIDENCE_SITE_URL` that is unavailable should fail directly,
   rather than starting a local server that cannot satisfy that URL.

2. **Correct the mobile documentation layout.** `src/app/docs/layout.tsx:12` uses
   `flex` without a mobile column direction. `DocsSidebar` returns mobile `<details>`
   and desktop `<aside>` directly into that flex container, so mobile navigation and
   the article remain side by side. Use a column below the desktop breakpoint and
   appropriate full-width children; retain the desktop sidebar layout. This is a
   source/CSS finding; confirm the fix at mobile widths with expanded search/results,
   tables, and code blocks.

3. **Handle clipboard failures accessibly.** `src/components/copy-command.tsx:16`
   assumes `navigator.clipboard.writeText` is available and succeeds. Denied access
   or an unsupported context can reject the click handler without useful feedback.
   Add a failure state/manual-copy guidance and announce copy success or failure to
   assistive technology. Verify both outcomes in a browser.

4. **Reduce documentation data crossing the client boundary.**
   `src/components/docs-sidebar.tsx:7` imports full `docs` objects from a 27,535-byte
   source module, although navigation/search uses only slug, title, description,
   and group. Expose a lightweight navigation manifest while retaining content
   blocks on the server. Measure production client bundle changes; source size is
   not a measurement of compressed browser payload.

5. **Extend meaningful regression coverage.** The HTTP script hardcodes the 17 doc
   slugs and checks three of the configured security headers. It does not test
   clipboard behavior, search/menu interaction, mobile geometry, fragment targets,
   or expected 404 behavior. Keep route coverage aligned with the docs content and
   add focused checks for behavior being fixed. No CI workflow or dedicated browser
   test setup is present in the audited project.

6. **Clean up styling and release consistency after behavior fixes.** Apply optional
   class simplifications together with CSS cleanup, verifying visual equivalence.
   The header links to TestPyPI while installation commands use production PyPI.
   README already documents this release prerequisite; confirm release status
   before changing the link or announcing availability.

## Reproduction commands

```bash
npm run lint
npm run typecheck
npm ls --all
npm outdated
npm audit
npm audit --omit=dev
npm run build
```

After the build succeeds, run the production server in a separate terminal:

```bash
npm run start -- --port 3001
```

While it is running:

```bash
RAGVIDENCE_SITE_URL=http://127.0.0.1:3001 npm run verify:site
```

Stop that server when verification finishes. Rerun browser checks for changed
interactions and measure performance before making optimization claims.
