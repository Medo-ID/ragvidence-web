# RAGvidence website

Source for the RAGvidence product website and versioned CLI documentation.
RAGvidence helps evaluate whether a retrieval change improves the evidence
available to answer your questions.

This repository contains the website, documentation, sample report, and demo
media. The Python CLI is maintained separately.

- [Website](https://ragvidence.medo-id.com)
- [Documentation](https://ragvidence.medo-id.com/docs)
- [Installation guide](https://ragvidence.medo-id.com/docs/installation)
- [Sample report](https://ragvidence.medo-id.com/sample-report.html)
- [CLI on PyPI](https://pypi.org/project/ragvidence/)

## Run locally

Use Node.js 24 (`.nvmrc`) and npm 11 or newer.

```bash
git clone git@github.com:Medo-ID/ragvidence-web.git
cd ragvidence-web
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). No environment variables, API keys,
or external services are required to run the website.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build with Turbopack |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint with zero warnings allowed |
| `npm run typecheck` | Check TypeScript |
| `npm run check` | Run lint, types, and a production build |
| `npm run verify:site` | Check routes, links, content, and security headers |
| `npm run test:verification` | Test the HTTP verifier and structured-data serialization |
| `npm run test:browser` | Run Chromium interaction and responsive regression tests |
| `npm run verify` | Run all checks above and audit production dependencies |

Before running the browser tests, install Chromium:

```bash
npx playwright install --with-deps chromium
npm run verify
```

The route verifier and browser suite require a successful production build.
They start and stop dedicated servers on ports 3001 and 3002; those ports must
be available. CI runs the full gate on pull requests and pushes to `main`.
Generated reports, screenshots, traces, and build output are ignored by Git.

To check an already running preview or deployment:

```bash
RAGVIDENCE_SITE_URL=https://your-preview.example npm run verify:site
```

See [project health](docs/project-health.md) for verification limits and tracked
dependency findings. A Webpack fallback is available for restricted environments;
it does not replace verification of the standard Turbopack build.

## Project layout

Built with Next.js 16 App Router, React 19, TypeScript 6, Tailwind CSS 4, Lucide
icons, and locally packaged Geist fonts. Exact dependencies are in
[`package.json`](package.json) and [`package-lock.json`](package-lock.json).

| Path | Contents |
| --- | --- |
| `src/app/` | Landing page, documentation routes, releases, trust pages, and metadata |
| `src/lib/docs.ts` | Typed documentation content and navigation order |
| `src/components/` | Shared UI, documentation navigation, copy controls, and demos |
| `public/` | Active brand mark, demo media, generated sample report, and license notices |
| `scripts/` | HTTP verification and repeatable demo-media authoring tools |
| `tests/` | Maintained browser and verifier regression tests |
| `.github/workflows/verify.yml` | Production quality gate |
| `AGENTS.md` | Repository instructions for coding agents |

For content updates, report provenance, and media regeneration, read
[the maintenance guide](docs/maintaining.md).

## Deployment

Deploy as a Next.js application on Vercel or a Node.js host. Use Node.js 24,
`npm ci` to install, and `npm run build` to build. A Node.js host serves the build
with `npm run start`. Vercel can import this GitHub repository using its Next.js
preset; no environment variables are required.

Run the quality gate before deployment, then run `verify:site` against the preview
URL. Configure `ragvidence.medo-id.com` in the hosting provider and use the DNS
records it supplies. Verify HTTPS, navigation, search, copy controls, and media
on the deployed site before announcing it.

## Repository hygiene

Keep credentials, environment files, local agent configuration, generated
workspaces, and verification output out of commits. `.gitignore` covers these
paths; review staged changes before publishing. The maintained tests and CI
scripts are intentional source files.

The website has no accounts, forms, analytics, or checkout. Update its privacy,
security, and terms pages when introducing integrations that change this behavior.

## Ownership

Copyright © 2026 Medo-ID. This repository is publicly visible and does not include
an open-source license for the website. The CLI has its own
[release license](public/ragvidence-0.1.0-license.txt); third-party notices remain
with their corresponding assets.
