<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Scope and orientation

This repository contains the RAGvidence product website and versioned CLI
documentation, not the Python CLI implementation. Read `README.md`,
`docs/maintaining.md`, and `docs/project-health.md` before making changes.
Inspect Git status and relevant diffs; preserve existing uncommitted work.

The site has no accounts, forms, analytics, or checkout. Keep privacy and trust
content consistent with actual integrations. Never add invented testimonials,
customer logos, prices, benchmarks, or payment flows. Plus is future direction
until functionality and licensing are verified.

## Setup and dependencies

- Use Node.js 24, npm 11 or newer, and `npm ci`. Commit manifest and lock changes
  together. Read exact versions from `package.json` and `package-lock.json`.
- Keep Next.js and eslint-config-next aligned, and React and React DOM aligned.
  Check peer ranges before major upgrades; never force dependency installation
  or use `npm audit fix --force` to bypass compatibility constraints.
- Audit production and development dependencies separately. Track unresolved
  advisories and their dependency paths in `docs/project-health.md`.

## Code and content

- `src/app/page.tsx` contains the landing page. `src/app/layout.tsx` owns the
  shared layout, fonts, metadata, and skip link; `src/app/globals.css` owns global
  styles and theme tokens.
- `src/lib/docs.ts` contains typed article content and navigation order.
  `src/app/docs/` renders it; keep full article bodies out of client navigation.
- `src/components/` contains shared UI and interactive controls. Reuse it.
  Keep pages and content rendering in Server Components; add `"use client"`
  only where interaction requires it. Use strict TypeScript and `@/*` imports.
- Read the relevant installed Next.js guide before editing framework behavior.
  Preserve async route params, static generation, unknown-slug handling, and the
  existing caching/prefetch configuration unless the task requires changing them.
- Preserve canonical URLs, sitemap coverage, security headers, and route metadata.
  Use `pageMetadata` from `src/lib/seo.ts`, `docPath` for the preferred `/docs`
  overview URL, and safe serialization for factual JSON-LD. Use `next/link` for
  internal pages and anchors for files, mail, and external destinations.
- Handle browser API failures and effect cleanup. Clipboard failures need useful
  recovery. Preserve labels, heading order, keyboard focus, the skip link,
  reduced-motion behavior, and print support.

## Visual conventions

- Use the existing Abyssal Teal identity (#063f47), evidence-convergence mark,
  and RAGvidence wordmark. Reuse theme colors and `shell`, `surface`, `eyebrow`,
  and `CodeBlock` helpers. Copy command content without shell prompts.
- Preserve 6/9/12/16px radius tokens for small controls, navigation controls,
  cards/code/disclosures, and showcases. Avoid pills and individually rounded
  nested children. Navigation uses a full-width border and aligned inner content.
- Most surfaces are solid and near-black. Reserve teal translucency for important
  regions and blur for the sticky header. Keep semantic colors distinct.
- Preserve the CSS-first Tailwind v4 setup (`@import "tailwindcss"` and
  `@theme inline`). Use complete class strings and existing theme utilities;
  avoid removed v3 utilities or dynamically constructed utility names.
- This project uses Turbopack and `@tailwindcss/turbopack`; do not assume a
  PostCSS config or switch the normal bundler without verifying CSS compilation.

## Product artifacts

The bundled v0.1.0 tutorial is BM25, ten answerable questions, k=2, body versus
heading-context, 60% → 90%. Update claims, CLI demo, docs, and generated sample
together if the verified tutorial changes. Keep `public/sample-report.html`
generated from the CLI; preserve its provenance and embedded license notices.
The own-data video is a separate synthetic-data comparison documented in
`docs/maintaining.md` and `public/media/walkthrough-provenance.json`.
Verify production PyPI installation before changing release availability claims
or announcing a release.

## Verification and repository hygiene

1. Inspect affected code, installed framework guidance, and the behavior baseline.
2. Make focused changes, then run `npm run lint` and `npm run typecheck` for
   code/config changes, followed by `npm run build`.
3. Run `npm run verify:site` after a successful build for route, asset, navigation,
   content, or header changes. It owns port 3001 and stops its server. Explicit
   `RAGVIDENCE_SITE_URL` targets must already be reachable.
4. Run `npm run verify` before deployment. It includes Chromium tests on a
   dedicated production server at port 3002 and a production dependency audit.
   For a separate production smoke check, start `npm run start -- --port 3001`,
   run the verifier with `RAGVIDENCE_SITE_URL=http://127.0.0.1:3001`, then stop it.
5. Verify interactive and responsive changes in a browser, including keyboard
   use, clipboard failures, search, mobile menus, and console errors. Add focused
   regression tests for meaningful behavior changes.
6. Run `git diff --check` and review the final diff. Report failures and unperformed
   checks honestly. Never describe a Webpack check as Turbopack verification.

In restricted environments, `npm run build -- --webpack` is an authorized fallback
using the existing verification-only CSS hook; leave the normal build command
unchanged. Standard Turbopack and deployment verification still require a capable
host. The temporarily accepted development-only braces advisory and its dependency
path are tracked in `docs/project-health.md`; production audits must pass.

Measure performance before and after optimization. Prefer small client boundaries
and simpler layouts; avoid dependencies or redesigns without a concrete benefit.

Keep maintained tests and CI scripts in Git. Ignore generated logs, captures,
workspaces, build output, and local agent/tool settings. Never commit credentials,
private keys, environment files, or confidential data. Inspect staged changes and
scan reachable history before publishing a repository; deleting a file from the
working tree does not remove its historical contents.
