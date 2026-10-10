# Singularity Review hero statement report

The resumed implementation preserves the existing hero rework and finishes the highest-priority EIGHTH note's static contract. The homepage uses the owner's exact three lines, with the statement as its only h1 and the lead title as h2. The natural night skyline fades into the plain page background; the lead follows in normal flow. The full black hole artwork frame fits at all six requested widths. Its photographed photon ring, restrained disk and slow lensing remain, with no pointer effect or warm sky overlay.

## Remaining fixes completed

Restored “made simple.” in the third hero line. Aligned the mobile Featured byline with its title. Applied sentence casing to category heading output. Fixed failure-state precedence so visibility and connection changes cannot reveal an inactive Pause control after WebGL fails. Added intrinsic dimensions to local inline Markdown images at build time, without editing article files; the transform preserves partial explicit dimensions and skips draft outputs.

The existing sharp responsive sources, long atmospheric fade, separate unboxed lead, compact footer and renderer geometry were retained. The rendered-heading check parses HTML entities and rejects Title Case while allowing the required proper names. Hero verifiers require all three exact lines in order and reject extra slogans, eyebrows, highlighters, CTA pills and gradient text.

## Measurements

These are current CSS-derived reserved positions and decoded-pixel models, not browser measurements. Heights exclude the separate 72px masthead. Contrast numbers are headline / response / description ratios over each modeled line envelope. Pixel samples compose the generated AVIF skyline and supplied artwork, their masks, photographic fade and neutral scrim. The CPU shader model samples times 0 and 60 seconds with a conservative shimmer bound; it does not execute a GPU.

- 390x844@3: band 640px; lead headline Y 764px; skyline 1920w; fallback and shader model 7.20 / 7.54 / 6.04.
- 768x1024@1: band 560px; lead Y 680px; skyline 1440w; fallback 7.86 / 8.89 / 9.78; shader model 8.52 / 8.89 / 9.78.
- 1024x768@2: band 560px; lead Y 680px; skyline 2880w; fallback 7.18 / 7.70 / 6.71; shader model 7.24 / 7.70 / 6.71.
- 1440x900@1: band 585px; lead Y 705px; skyline 1440w; fallback 7.71 / 12.80 / 11.64; shader model 8.09 / 12.80 / 11.64.
- 1440x900@2: band 585px; lead Y 705px; skyline 2880w; fallback and shader model 7.22 / 12.36 / 11.37.
- 1920x1080@1: band 680px; lead Y 800px; skyline 1920w; fallback 7.23 / 9.79 / 9.19; shader model 7.46 / 9.79 / 9.19.
- 2560x1440@1: band 680px; lead Y 800px; skyline 2880w; fallback and shader model 7.20 / 9.37 / 8.55.

An independent white-pixel bound guarantees at least 7.15 / 7.15 / 5.03 across every tested viewport, all animation frames and all wrapping choices. Every line exceeds its AA threshold. Selected skyline resources cover both dimensions of the crop at each required DPR. The artwork has at least 24px side and 16px top/bottom clearance. The last photographic row converges to the page colour without a step. Full values and source fingerprints are in .audit/skyline/measurements.json.

## Verification and limits

Run npm run build and node scripts/verify-skyline-suite.mjs. The suite includes verify-site, verify-content, verify-rebrand, verify-lensing, verify-rework, verify-chrome, verify-skyline, verify-headings and verify-static-pages. Content regressions include future publication, pagination, drafts, empty sections, metadata and inline image reservation. Node VM checks cover lazy initialization, pause state, reduced motion, Save-Data, visibility, BFCache, failure cleanup, texture refresh, DPR caps and geometry. Positive controls make the exact-copy, heading, contrast and overlap checks fail for invalid fixtures.

Final result: npm run build passed; all nine suite verifiers passed; verify-browser --static passed; git diff --check passed. The scoped acceptance ledger records 5 met gates, 0 unmet and 0 abandoned. Its rendered-review gate records the editor handoff, not a visual approval. All 10 measurement input fingerprints matched the current tree after verification.

node scripts/verify-browser.mjs --static checks all 14 current HTML routes at six widths, covering home, articles, Featured, Explainer, About, author and category pages, plus the footer. It parses structure and CSS geometry, including separate story media/body siblings and normal-flow reading surfaces. Evidence is in .audit/hero-statement/static/pages.json. Reserved image slots and optional font loading support stable layout; actual CLS is not claimed from static checks.

Under the latest tools rule, no MCP, browser, computer-use or app-driving tools were used, and no Chromium launch or visible application opening was attempted. The editor owns rendered visual review outside the sandbox. Browser interactions, GPU compilation/output, measured CLS and the anti-ai-slop rendered gate remain for that review. Earlier native previews and historical screenshots were not reused as passing evidence.

## Files and ownership

This resumed pass changed src/index.njk, src/css/style.css, src/js/site.js, src/category.njk and eleventy.config.js. It updated scripts/verify-content.mjs, scripts/verify-lensing.mjs, scripts/verify-headings.mjs, scripts/verify-browser.mjs, scripts/verify-skyline.mjs and scripts/verify-skyline-suite.mjs; added scripts/static-layout.mjs, scripts/hero-pixels.mjs and scripts/verify-static-pages.mjs; and updated docs/DESIGN.md and this report. The prior run's implementation and verifier edits remain in the working tree.

The concurrent content pass owns src/articles, src/what-is-singularity.njk, src/about.md and CONTENT_GUIDE.md; this resumed pass did not edit them. Article image assets, illustration documentation and image prompts were also untouched. Concurrent brand asset changes were preserved. The acceptance ledger is scoped to .audit/hero-statement/GATES.md so it does not overwrite the content pass's root ledger. Changes remain in the working tree: this sandbox exposes .git as read-only, so staging must occur in the editor outside the sandbox. No commit, push or deployment was made.
