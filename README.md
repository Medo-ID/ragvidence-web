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

This executes ESLint with zero warnings allowed, TypeScript without emitting files, a complete Next.js production build, every public route and internal-link check, security-header checks, and a production dependency audit.

TypeScript is intentionally constrained to version 6. TypeScript 7.0.2 is newer, but the ESLint stack bundled with the current Next.js release explicitly does not support the TypeScript 7 compiler API yet. Upgrade only when `eslint-config-next` supports it and `npm run verify` passes.

The production dependency audit is clean. A full development-tree audit may still report the current `braces` advisory inherited by `eslint-config-next`; npm offers no patched `braces` release and suggests an incompatible Next.js downgrade. It is not shipped in the runtime bundle. Recheck it whenever the Next.js lint stack updates.

## Content architecture

- `src/app/page.tsx` — product landing page
- `src/lib/docs.ts` — versioned documentation content and navigation order
- `src/app/docs` — documentation routes
- `src/app/privacy`, `terms`, `security` — trust pages
- `public/sample-report.html` — website-styled presentation of the bundled v0.1.0 tutorial report; recorded results and provenance are preserved, with offline Auto/Light/Dark appearance controls

## Walkthrough recording

The homepage reserves an integrated walkthrough window in
`src/components/product-walkthrough.tsx`. Until the recording is ready, that window
contains the interactive CLI preview and a clearly labeled recording status.

To add your recording, place an MP4, English WebVTT captions, and an optional poster
in `public/`, then pass them to the homepage component:

```tsx
<ProductWalkthrough
  video={{
    src: "/walkthrough.mp4",
    captions: "/walkthrough.en.vtt",
    poster: "/walkthrough-poster.webp",
  }}
/>
```

The video replaces the preview inside the same window. It uses native playback
controls, inline playback, a reserved 16:9 frame, and no autoplay or video preload.
The first-tutorial documentation remains the written walkthrough.

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
uv tool install "ragvidence[semantic]"
```

That command resolves against production PyPI. The package has already passed TestPyPI verification, but the site must not be announced until version 0.1.0 is published to production PyPI and a clean-machine install passes.

Recommended release order:

1. Publish `ragvidence==0.1.0` to production PyPI through the trusted GitHub workflow.
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
