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

Website branding uses the evidence-convergence mark (concept A) beside the exact
`RAGvidence` wordmark, with matching SVG/ICO and Apple touch icons. See
[logo-adoption.md](docs/logo-adoption.md) for verification and screenshots, and
[logo-exploration.md](docs/logo-exploration.md) for editable artwork and alternatives.

The homepage includes a 36-second, native 1920×1080, 60fps silent walkthrough
of an own-data workflow using temporary synthetic shop policies. It shows labeled
source/question files, validation, BM25 and local semantic benchmarks, evaluation,
HTML report creation, and the evidence behind a changed question. The two compared
runs keep the dataset, body representation, and k=2 fixed. Native captures use two
purposeful 118% zooms and clean cuts; execution waits and the initial model download
are omitted. The mock result (5/6 versus 6/6) is specific to that dataset;
the preceding 720p recording is never used as input. H.264 MP4 and VP9 WebM use
CRF 20; provenance records wheel/report hashes, commands, actual results, and sizes.

The native video has `autoPlay`, `muted`, `loop`, `playsInline`, `preload="auto"`,
and both sources in the initial HTML. Startup does not wait for hydration, scrolling,
or a first click. The application no longer pauses it based on viewport visibility.
Click anywhere inside it, or focus it and press Space/Enter, to pause or resume;
a manual pause persists when scrolling away and back. There is no player chrome.

Native source media queries preserve the reduced-motion poster without loading
video even before hydration; explicit play removes that source restriction.
The play hint appears for manual pause, autoplay rejection, or reduced motion.
Browsers may defer native offscreen autoplay without JavaScript until the video
enters view; no click is needed. The hydrated app requests playback at page load.
No audio, narration, captions, browser chrome, personal paths, or remote report
assets are included. The own-data guide is linked below it; the original 60% → 90%
tutorial remains in the hero and public sample report.

Article search loads a static full-text index only on the first search; filtering
and queries remain in the browser. Failed index loads fall back to navigation
metadata with an explicit retry.

Authoring requires uv, Python 3.12, Playwright Chromium, and an FFmpeg build
with H.264 and VP9 encoders (outside the product quality gate).

The script takes a temporary fixture JSON containing `sources` and `questions`
arrays, installs a freshly built CLI wheel with its semantic extra, verifies it,
creates a named workspace, replaces its data files, and runs the actual CLI
workflow. The file preview pretty-prints one real JSONL record per file; it does
not represent a shipped GUI editor. It checks that the comparison changes only
the retrieval strategy and captures the generated report at native 1920×1080.
It stages both encodings before replacing public media. No mock workspace/data
files are added to either product repository. This documents the source build; publication
of the redesigned CLI template to PyPI is a separate release step.

Provide the wheel, a temporary fixture JSON, an FFmpeg executable supporting libx264/libvpx-vp9, and an
optional browser library path:

```bash
node scripts/record-walkthrough.mjs ../ragvidence/dist/ragvidence-0.1.0-py3-none-any.whl /tmp/fixture.json /path/to/ffmpeg
```

`--capture-only` creates native previews without replacing media. Resume encoding
with `node scripts/record-walkthrough.mjs --resume /tmp/capture-directory /path/to/ffmpeg`.
`RAGVIDENCE_RECORDING_DIR` can stage the final assets outside public/media.

The current Abyssal Teal system and milestone verification are recorded in
[identity-progress.md](docs/identity-progress.md). Ordinary website and report
surfaces are solid; blur is limited to the sticky site header.

The website does not collect user input, host user data, or provide checkout yet. Update privacy and terms before adding analytics, forms, accounts, or payment processing.

## Deploy to Vercel

The [pre-deployment SEO audit](docs/seo-audit.md) records the corrected route
metadata, canonical documentation URLs, factual site/breadcrumb structured data,
indexing exclusions for brand-review HTML, and before/after local measurements.
Deployment, Search Console indexing, and field Core Web Vitals still need live
checks. The [local layout-stability fix](docs/layout-stability.md) resolves the
reproduced mobile font-loading jump and records cross-browser QA.

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
