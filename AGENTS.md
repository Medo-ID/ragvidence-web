<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project purpose and boundaries

RAGvidence's product website and versioned CLI documentation. This repository is a
Next.js App Router site, not the CLI implementation. The current product flow is
installation, a reproducible tutorial, a sample report, and documentation; there
are no accounts, forms, analytics, or checkout.

- Read `README.md` for release, ownership, and deployment context.
- Read `docs/project-health.md` for the dated baseline and optimization backlog.
  Recheck findings before treating them as current facts.
- Preserve existing uncommitted changes. Inspect `git status` and relevant diffs
  before editing. Keep changes focused on the requested outcome.
- Keep the managed Next.js block above intact.

## Setup and dependency policy

- Use npm and `package-lock.json`. Node 24 is the project baseline (`.nvmrc`);
  README requires npm 11 or newer. Use `npm ci` for a clean install.
- Current stack: Next.js 16, React 19, TypeScript 6, Tailwind CSS 4, Lucide icons,
  and locally packaged Geist fonts. Read versions from `package.json` and the lock.
- Keep `next` and `eslint-config-next` aligned, and `react` and `react-dom` aligned.
- Verify peer dependencies before major upgrades. The audited lint stack supports
  TypeScript `>=4.8.4 <6.1.0`; React and accessibility lint plugins exclude ESLint
  10. Keep Node types aligned with the target Node runtime. Recheck these ranges
  when updating the lint stack rather than blindly choosing `latest`.
- Update the manifest and lock together. Avoid force-installing dependencies or
  running `npm audit fix --force` to bypass compatibility problems.
- Audit production and development dependencies separately. Track unresolved
  advisories with their dependency path and remediation status.

## Code and content map

- `src/app/page.tsx`: product landing page and installation/tutorial commands.
- `src/app/layout.tsx`: shared layout, fonts, site metadata, and skip link.
- `src/app/globals.css`: Tailwind import, theme tokens, global helpers, reduced
  motion, and print styles.
- `src/app/docs/`: docs layout, overview, and statically enumerated `[slug]` route.
- `src/lib/docs.ts`: typed content blocks, doc pages, groups, and navigation order.
- `src/components/`: shared page sections and interactive controls.
- `src/components/cli-demo.tsx`: guided installation, health, tutorial, and report
  preview; manual steps and optional playback, with reduced-motion support.
- `src/app/privacy`, `terms`, `security`: trust pages.
- `src/app/robots.ts`, `sitemap.ts`, `opengraph-image.tsx`: discovery and sharing.
- `public/sample-report.html`: generated tutorial proof; preserve its provenance.
- `scripts/verify-site.mjs`: HTTP/content/link/header smoke check.
- `next.config.ts`: caching, partial prefetching, security headers, and the
  `@tailwindcss/turbopack` CSS loader. This project uses Turbopack; do not assume a
  PostCSS config or switch bundlers without checking CSS compilation.

## Implementation conventions

- Use strict TypeScript, existing typed content models, and the `@/*` source alias.
  Match surrounding conventions and reuse shared components before adding helpers.
- Keep pages and content rendering in Server Components. Add `"use client"` only
  where interaction requires it; avoid importing full documentation bodies into
  client navigation when only titles, descriptions, groups, and slugs are needed.
- Read the installed Next.js guide for the feature being changed. Route params
  are asynchronous in the existing docs route; preserve static generation and
  unknown-slug handling. Check caching/prefetching guidance before changing the
  existing flags or `instant` exports.
- Handle browser API failures and effect cleanup. Copy controls need a useful
  failure state when clipboard access is unavailable or denied.
- Preserve route metadata, canonical URLs, sitemap coverage, and security headers.
  Use `next/link` for internal page navigation and appropriate anchors for files,
  mail links, and external destinations.

## Tailwind and visual work

- Use the 6/9/12/16px radius tokens for small controls, navigation/copy controls,
  cards/code/disclosures, and showcases. Avoid pills and independently rounded
  nested children. Navigation uses a full-width border and aligned inner content;
  the brand is a text-only wordmark. Abyssal Teal #063f47 is the identity color;
  pale teal is used for readable text/focus. Preserve separate semantic colors.
- Most surfaces are solid and near-black. Reserve teal translucency for important
  regions; blur belongs only to the sticky header. Reuse CodeBlock for commands,
  structured data, configuration, and output; copy raw content without prompts.
- Keep the CSS-first v4 setup: `@import "tailwindcss"` and `@theme inline` tokens.
  Use existing colors (`canvas`, `panel`, `line`, `ink`, `muted`, `signal`, etc.) and
  shared helpers (`shell`, `surface`, `eyebrow`) to maintain the visual language.
- Write complete class strings so Tailwind can detect them. For conditional
  styles, map to full literals instead of constructing utility names dynamically.
- Prefer standard utilities when they express the exact intended value. Arbitrary
  values remain valid when needed. Examples of optional v4 simplifications:
  `bg-white/[0.025]` → `bg-white/2.5`, `min-w-[34rem]` → `min-w-136`.
- Avoid removed v3 utilities such as `bg-opacity-*`, `text-opacity-*`,
  `flex-shrink-*`, `flex-grow-*`, and `overflow-ellipsis`. Consult the official
  Tailwind upgrade guide and installed compiler before migrating classes.
- Check mobile and desktop layouts, long code blocks, tables, and docs navigation.
  Preserve accessible labels, heading order, visible keyboard focus, the skip
  link, reduced-motion behavior, and print support.

## Product accuracy

- Describe shipped Free features accurately. Plus remains future direction until
  functionality and licensing are verified. Do not invent testimonials, customer
  logos, benchmarks, pricing, or payment flows.
- The 60% → 90% result is the bundled v0.1.0 BM25 tutorial: ten questions, k=2,
  body versus heading-context. Update claims, CLI demo, docs, and the generated
  sample report together when the verified tutorial changes.
- Keep site privacy claims consistent with actual integrations. When introducing
  data collection, accounts, analytics, or checkout, update relevant trust content
  as part of that feature.
- Confirm production PyPI release/install status before changing release claims
  or announcing the site. README describes the release sequence.

## Verification and optimization workflow

1. Inspect the affected code and relevant installed Next.js documentation.
2. Establish a baseline for the requested behavior, then make a focused change.
3. Run `npm run lint` and `npm run typecheck` for code/config changes.
4. Run `npm run build` for production verification. `npm run check` combines
   lint, typecheck, and build; Next.js builds do not automatically run ESLint.
5. Run `npm run verify:site` for route/content/navigation/header changes after a
   successful build. It starts its own `next start` on port 3001 and stops it after
   checking; an occupied port fails instead of reusing an unknown server. Explicit
   `RAGVIDENCE_SITE_URL` targets must already be reachable. For an additional
   production smoke check, start the build separately with `npm run start -- --port 3001`, then run
   `RAGVIDENCE_SITE_URL=http://127.0.0.1:3001 npm run verify:site` while it is running.
   Stop servers you started after checking them.
6. Use `npm run verify` for the full gate (including Chromium tests against a
   dedicated production server on port 3002), plus the explicit production smoke
   check above before deployment. Install Chromium with
   `npx playwright install --with-deps chromium` when needed. Check `npm audit` and `npm outdated`
   when dependencies change; the existing verify gate audits production only.
7. Verify interactive and responsive changes in a browser, including keyboard
   operation, clipboard failures, docs search, mobile menus, and console errors.
   HTTP checks do not cover these behaviors. Add focused regression coverage when
   fixing meaningful behavior; avoid tests that only mirror implementation.
8. Run `git diff --check` and review the final diff. Report changes, evidence,
   unresolved issues, and environment limitations accurately. Do not call a
   blocked build or unperformed browser check a pass.

In this restricted execution environment the user authorizes `npm run build --
--webpack` plus the available gate in `verification/identity/verify-milestone.mjs`.
Webpack uses the existing Tailwind compiler through a verification-only hook;
the normal Turbopack command/configuration stays in place. Standard build and
deployment verification remain pending until the user confirms them locally or
on Vercel. The development-only braces advisory is temporarily accepted; production
audits must pass and the dependency path/remediation remain tracked in the health notes.

Measure performance before and after optimization: production client JavaScript,
CSS size, and representative mobile/desktop loading and interaction metrics. Prefer
small client boundaries and simpler layouts; do not add a dependency or redesign
without a concrete benefit to the requested product flow.
