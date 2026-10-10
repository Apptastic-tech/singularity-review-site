# Hero and AdSense stage report

Last updated 11 October 2026. Branch: rebrand-blackhole. Local implementation and verification only.

## Outcome

The homepage has the approved h1 and single subline, centered below both the complete static disk and the full shader influence region. The disk stays at its original 16px top position. The reserved band, readable type and broader edgeless scrim keep the separate lead within the requested fold limits. The contrast verifier now evaluates the actual elliptical scrim alpha at every modeled text-envelope pixel.

AdSense is disabled by default. Default output contains no ad slots, labels, reservations, loader tag or ads.js file. Preview builds reserve article and homepage slots with a neutral border and never load Google. The enabled loader implements denied Consent Mode v2 defaults, explicit any-decision gating, personalised/non-personalised mapping, lazy filling and safe unfilled-slot retention.

About, Contact, Editorial standards, Privacy, Cookies and Terms carry the requested date, substantial content and a single Legal footer group. The new routes are in sitemap, llms.txt Policies and the SEO graph with breadcrumbs. Article, consent, newsletter, lensing, carousel, transition and sharing implementation files retain their initial hashes. No Firestore file was changed.

## New placeholders

- [Founder and editor name], About. Existing data establishes Ararat Ovsepian's authorship, not a confirmed founder/editor role.
- [Governing law and jurisdiction], Terms.
- [AdSense ad unit ID], the three ad-unit configuration values and documentation.

Every new placeholder is listed in LEGAL-PLACEHOLDERS.md. Existing company, address, country, email and AI-use placeholder strings are reused unchanged. The publisher record retains the requested pub-XXXXXXXXXXXXXXXX placeholder until approval.

## Static hero geometry

All values below are CSS pixels. Band height is a height; disk bottom, lensing bottom, statement top and lead headline are document Y coordinates, including the 72px masthead. These values are computed from current shipped CSS, not measured browser coordinates. Statement top clears the full lensing influence by 24px at every width.

- 320x844@1: band 640; disk bottom 241; lensing bottom 294.86; statement top 318.86; lead headline Y 764. Headline/subline contrast 8.68/7.01:1.
- 390x844@3: band 640; disk bottom 280.38; lensing bottom 348.09; statement top 372.09; lead headline Y 764. Headline/subline contrast 8.56/6.37:1.
- 639x844@1: band 689.46; disk bottom 420.44; lensing bottom 537.46; statement top 561.46; lead headline Y 813.46. Headline/subline contrast 9.88/8.73:1.
- 640x900@1: band 720; disk bottom 358; lensing bottom 453.04; statement top 477.04; lead headline Y 840. Headline/subline contrast 10.14/7.98:1.
- 768x1024@1: band 720; disk bottom 412; lensing bottom 526.05; statement top 550.05; lead headline Y 840. Headline/subline contrast 10.22/8.96:1.
- 1024x768@2: band 720; disk bottom 448; lensing bottom 574.72; statement top 598.72; lead headline Y 840. Headline/subline contrast 10.75/10.71:1.
- 1440x900@1: band 720; disk bottom 448; lensing bottom 574.72; statement top 598.72; lead headline Y 840. Headline/subline contrast 11.88/11.27:1.
- 1440x900@2: band 720; disk bottom 448; lensing bottom 574.72; statement top 598.72; lead headline Y 840. Headline/subline contrast 10.61/10.90:1.
- 1920x1080@1: band 756; disk bottom 448; lensing bottom 574.72; statement top 598.72; lead headline Y 876. Headline/subline contrast 10.88/9.10:1.
- 2560x1440@1: band 780; disk bottom 448; lensing bottom 574.72; statement top 598.72; lead headline Y 900. Headline/subline contrast 9.06/8.57:1.

The decoded-image and CPU shader models both clear 3:1 for the large headline and 4.5:1 for the subline. Independent white-pixel checks use each text envelope's minimum actual scrim opacity. The lowest white-pixel bounds are 7.86:1 for the headline and 5.94:1 for the subline. Detailed fresh source fingerprints and per-line metrics are in .audit/skyline/measurements.json.

## Verification

- npm run build passed.
- All 15 scripts matching scripts/verify-*.mjs without browser in the filename passed. The suite wrapper executes the other 14 static/Node scripts.
- The ad verifier builds into an isolated temporary directory inside .audit, exercises actual article/home placements, top-level paragraph traps and thresholds, disabled output, verification-meta fallback, fixed CSS heights and Node consent simulations. It checks accept, reject, mixed choices, decision removal, saved decisions, preview isolation, idempotent filling and unfilled visibility retention.
- verify-ads-browser.mjs, browser-local.mjs, verify-browser.mjs and preview-hero.mjs passed node --check only. No browser verifier was executed.
- All four acceptance gates passed their explicit authorized checks. Execution output and fingerprints are recorded under .audit/adsense.

Actual CLS, browser font wrapping, GPU output, rendered appearance, real AdSense behavior and certified-CMP integration were not verified. Geometry is reserved statically and the owner-run browser verifier asserts CLS 0 at 1440 and 390. Google approval, publisher/ad-unit IDs, confirmed legal details and a Google-certified IAB TCF CMP for EEA, UK and Switzerland remain go-live requirements described in ADSENSE.md and CONSENT.md.

No browser, application, screen capture, network request, git write, deployment or Firebase command was used. All task writes stayed in this repository.

## Files changed

- GATES.md
- docs/ADSENSE-READINESS-REPORT.md
- docs/ADSENSE.md
- docs/CONSENT.md
- docs/DESIGN.md
- docs/LEGAL-PLACEHOLDERS.md
- eleventy.config.js
- firebase.json
- scripts/ads-runtime.mjs
- scripts/browser-local.mjs
- scripts/hero-contract.mjs
- scripts/hero-pixels.mjs
- scripts/preview-hero.mjs
- scripts/static-layout.mjs
- scripts/verify-ads-browser.mjs
- scripts/verify-ads.mjs
- scripts/verify-browser.mjs
- scripts/verify-chrome.mjs
- scripts/verify-consent.mjs
- scripts/verify-content.mjs
- scripts/verify-seo.mjs
- scripts/verify-skyline-suite.mjs
- scripts/verify-skyline.mjs
- scripts/verify-static-pages.mjs
- src/_data/site.js
- src/_includes/ad-slot.njk
- src/_includes/layouts/article.njk
- src/_includes/layouts/base.njk
- src/_includes/privacy-controls.njk
- src/_lib/ads.js
- src/_lib/seo.js
- src/about.md
- src/ads.njk
- src/contact.md
- src/cookies.md
- src/css/style.css
- src/editorial-standards.md
- src/index.njk
- src/js/ads.js
- src/llms.njk
- src/privacy.md
- src/terms.md

Generated output and evidence were refreshed in _site and .audit. Those generated files are not individually included above.
