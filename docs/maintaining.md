# Maintaining the website

## Content updates

Edit the landing page in `src/app/page.tsx` and versioned CLI articles in
`src/lib/docs.ts`. Navigation and the static search index derive from those
articles. Use the existing typed content blocks and shared renderers.
Route-specific metadata uses `src/lib/seo.ts`; the preferred documentation
overview is `/docs`. Keep release, installation, trust, and license information
consistent with the shipped CLI.

## Tutorial sample

`public/sample-report.html` is generated CLI output, not a hand-authored website
mockup. It represents the bundled v0.1.0 BM25 tutorial: ten answerable questions,
k=2, body versus heading-context, 6/10 → 9/10 sufficient questions. Two additional
unanswerable questions appear as N/A. The result is tutorial data, not a customer
benchmark or a general performance promise.

The retained sample was generated from the CLI source build during the report
template work. It does not establish that the same template is in the published
PyPI wheel. The release license in `public/ragvidence-0.1.0-license.txt` was copied
from the production wheel; source notices and licenses are retained separately.

Sample SHA-256 at repository cleanup:

```text
8b82b8c9ad7927ebb98a3b76a0a8346d387f19e11cef6d874922658f4ef7c93c
```

When updating the proof:

1. Install the intended released CLI version in an isolated environment.
2. Run `ragvi --version`, `ragvi health`, and `ragvi tutorial`.
3. Inspect the question-level outcomes and record the version and configuration.
4. Copy the generated report to `public/sample-report.html`; do not patch its HTML.
5. Update the landing page, CLI demo, tutorial documentation, and this provenance
   together if the verified results change.
6. Check the report offline and in print; retain its escaped content and licenses.

## Demo media

The homepage video is a separate 36-second native 1920×1080, 60fps recording using
synthetic shop-policy data. It compares BM25 and local semantic retrieval with
the same dataset, body representation, and k=2: 5/6 versus 6/6 successful questions.
It is not the 60% → 90% bundled tutorial. Execution waits and the first model
download are omitted from the recording.

`public/media/walkthrough-provenance.json` records the commands, source wheel and
report hashes, results, and encoding details. Keep it alongside both encodings
and the poster. Do not substitute invented results or private customer data.

To regenerate, provide a verified CLI wheel, a temporary fixture JSON with
`sources` and `questions` arrays, uv, Python 3.12, Playwright Chromium, and an
FFmpeg executable with H.264 and VP9 encoders:

```bash
node scripts/record-walkthrough.mjs /path/to/ragvidence.whl /tmp/fixture.json /path/to/ffmpeg
```

This runs the real CLI in a temporary workspace, captures the report, and stages
both encodings before replacing the public assets. `--capture-only` produces
previews without replacing media. To resume encoding:

```bash
node scripts/record-walkthrough.mjs --resume /tmp/capture-directory /path/to/ffmpeg
```

`RAGVIDENCE_RECORDING_DIR` can stage media outside `public/media`. Inspect exported
frames and provenance for private paths or data before committing them.

To decode both videos and check dimensions, frame counts, codecs, and audio:

```bash
node scripts/check-walkthrough.mjs /path/to/ffmpeg
```

Its logs and frame captures go to the ignored `verification/` directory.

## Public assets

The active evidence-convergence mark is
`public/brand/a-evidence-convergence/mark-dark.svg`. App icons live in `src/app/`.
Keep font and CLI license notices with their corresponding assets. Old logo
alternatives, review HTML, design handoffs, screenshots, and milestone logs are
not part of the maintained source tree.
