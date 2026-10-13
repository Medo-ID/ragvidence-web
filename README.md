# RAGvidence website

The product site and documentation for [RAGvidence](https://ragvidence.medo-id.com), built with Next.js 16, React 19, TypeScript 6, and Tailwind CSS 4.

## Local development

Requirements:

- Node.js 24 or newer (`.nvmrc` is included)
- npm 11 or newer

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Quality gate

Run the complete production check before every deployment:

```bash
npm run verify
```

First install the browser used by the regression checks:

```bash
npx playwright install --with-deps chromium
```

The gate executes ESLint with zero warnings allowed, TypeScript, a production
build, route/link/fragment and security-header checks, Chromium regression tests,
and a production dependency audit. CI runs it on pull requests and pushes to main.

`npm run verify:site` starts its own production server on port 3001 and stops it
after checking. It requires a successful build and fails if that port is occupied.
`npm run test:browser` starts a separate production server on port 3002; both checks
exercise production, rather than falling back to a development server.

To check a deployed preview or a separately started production server:

```bash
RAGVIDENCE_SITE_URL=https://your-preview.example npm run verify:site
```

An unavailable explicit target fails directly without starting a local server.
Browser traces and screenshots on failure are written to ignored `test-results/`
and `playwright-report/` directories.

The verifier stops its own production server on success, failure, or cancellation.
The October 12 clean-install and full-gate results are recorded in
[`docs/follow-up-verification.md`](docs/follow-up-verification.md).

TypeScript is intentionally constrained to version 6. TypeScript 7.0.2 is newer, but the ESLint stack bundled with the current Next.js release explicitly does not support the TypeScript 7 compiler API yet. Upgrade only when `eslint-config-next` supports it and `npm run verify` passes.

The production dependency audit is clean. A full development-tree audit may still report the current `braces` advisory inherited by `eslint-config-next`; npm offers no patched `braces` release and suggests an incompatible Next.js downgrade. It is not shipped in the runtime bundle. Recheck it whenever the Next.js lint stack updates.

## Content architecture

- `src/app/page.tsx` — product landing page
- `src/lib/docs.ts` — versioned documentation content and navigation order
- `src/app/docs` — documentation routes
- `src/app/releases` — verified CLI release history and distribution links
- `src/app/privacy`, `terms`, `security` — trust pages
- `public/sample-report.html` — exact generated tutorial report from the verified CLI source build; embedded fonts, escaped content, offline disclosures, and complete print output
- `public/ragvidence-0.1.0-license.txt` — verbatim LICENSE.md from the production PyPI wheel

## Product demo

The homepage includes a 24-second, 1280×720, 60fps silent demo of the production
v0.1.0 CLI and its generated report. It types the tutorial command, shows actual
results, compares 60% versus 90%, and opens the recovered ranked evidence.
Camera moves, cursor motion, typing, and transitions are composed over captured
real states. There is no audio or caption track. The provenance JSON records the
executed commands, actual output, checked evaluations, and post-production.

The square player loops only while visible. A pause/play control and keyboard
chapter navigation remain available. Reduced motion shows a still poster until
the visitor explicitly plays the demo. The written tutorial is linked below it.
The WebP poster is much smaller than the preceding PNG; video uses preload none
and starts loading when the player enters view.

Article search loads a static full-text index only on the first search; filtering
and queries remain in the browser. Failed index loads fall back to navigation
metadata with an explicit retry.

To recreate the demo (optional Linux authoring, outside the quality gate):

```bash
# Requires uv, Python 3.12, and installed Playwright Chromium/FFmpeg.
node scripts/record-walkthrough.mjs
```

The script installs the pinned production release in a new temporary environment,
runs the tutorial, verifies 6/10 versus 9/10 and the exact question-level changes,
captures genuine report interactions, and encodes 1,440 frames at 60fps.
Two unanswerable cases have N/A metrics and do not enter the success-rate denominator.
Host installation caches may be reused. Report data is unchanged; its presentation
uses the website's opaque report CSS. Successful media is staged before copying
to its destination. Temporary source artifacts remain available for review.

`UV_EXECUTABLE`, `UV_CACHE_DIR`, `FFMPEG_EXECUTABLE`, and
`RAGVIDENCE_RECORDING_DIR` configure authoring paths. By default, the encoder
comes from the installed Playwright browser cache.

The current neutral visual system and verification are recorded in
[neutral-design-pass.md](docs/neutral-design-pass.md). Glass belongs to the website;
the reporting HTML uses opaque surfaces, readable prose, and semantic status colors.

The website does not collect user input, host user data, or provide checkout yet. Update privacy and terms before adding analytics, forms, accounts, or payment processing.

## Deploy to Vercel

1. Push this repository to `Medo-ID/ragvidence-web` on GitHub.
2. In Vercel, choose **Add New → Project** and import that repository.
3. Keep the detected framework as **Next.js**. No environment variables are required.
4. Confirm the Node.js runtime is version 24.
5. Deploy and test the Vercel preview URL.
6. In the Vercel project, open **Settings → Domains** and add `ragvidence.medo-id.com`.
7. In Hostinger DNS, add the CNAME record Vercel displays. Use host `ragvidence`; do not guess the target.
8. Wait for Vercel to show a valid configuration and issue HTTPS.
9. Run the production checklist below before announcing the URL.

## Release order

The landing page uses the production command:

```bash
uv tool install --python 3.12 "ragvidence[semantic]"
```

Version 0.1.0 was published to production PyPI on October 8, 2026. On October 12,
the command above passed a fresh isolated uv tool installation from production
PyPI on Linux with Python 3.12.14, followed by `ragvi --version`, `ragvi health`,
and `ragvi tutorial`. The generated evaluations recorded 6/10 versus 9/10
sufficient questions at k=2. This is an isolated-install check on the development
host, not a clean-machine or Windows/macOS certification. Deployment and domain
health remain separate checks before announcement.

For subsequent releases:

1. Publish the verified CLI version to production PyPI through its trusted GitHub workflow.
2. Install it into a temporary isolated `uv` tool directory.
3. Run `ragvi --version`, `ragvi health`, and `ragvi tutorial`.
4. Confirm the tutorial HTML report exists and opens.
5. Deploy the website preview and run the checks below.
6. Connect `ragvidence.medo-id.com` and announce the release.

## Production checklist

- [ ] `npm ci` succeeds from a clean checkout.
- [ ] `npm run check` passes.
- [ ] `/`, `/docs`, all docs pages, `/privacy`, `/terms`, and `/security` load.
- [ ] `/sample-report.html`, `/robots.txt`, and `/sitemap.xml` load.
- [ ] Both install-command copy buttons work.
- [ ] Mobile navigation, documentation search, and docs mobile browser work.
- [ ] Keyboard focus is visible and the skip link reaches main content.
- [ ] The page remains usable with JavaScript disabled except copy/search/menu enhancements.
- [ ] No analytics, cookies, payment claims, customer logos, or fabricated testimonials appear.
- [ ] The Free/Plus statements match the currently shipped software license.
- [ ] The PyPI install command succeeds from production PyPI.
- [ ] Support mail links point to `midaghdour@gmail.com`.
- [ ] Hostinger DNS and Vercel HTTPS both show healthy status.

## Updating the tutorial proof

The 60% → 90% result is reproducible bundled tutorial data, not a customer claim. When the dataset or retrieval behavior changes:

1. Run the tutorial with the released package.
2. Verify all question-level changes.
3. Replace `public/sample-report.html` with the newly generated report.
4. Update landing-page values and the first-tutorial documentation together.
5. State the package version, question count, strategy, and k.

Do not cherry-pick only favorable runs or present tutorial results as external validation.

## Ownership

Copyright © 2026 Medo-ID. This website repository is private and proprietary. The distributable CLI has its own Free/Plus license inside each software release.
