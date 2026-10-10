# Restored publication structure

## Navigation

The four short section labels were replaced with the owner-approved text: Singularity headline news, Featured author articles, What is singularity and Who we are. The starting branch already had four primary links, so no additional navigation destination was present to remove. Desktop navigation, the mobile menu, no-JavaScript navigation and footer sections all use the same four-item data file. Topics, contact and editorial standards are excluded from primary navigation.

## Homepage removals

- Separate large lead story treatment and its lead-only card partial and CSS.
- Latest heading and band.
- Homepage story grid. Pass 2 restores the approved story-block partial and CSS for featured, author, category and read-next pages.
- Homepage Load more control and automatic loading sentinel. See all links to /page/2/ when it exists.

The homepage retains only the unchanged v4 skyline hero and exact two lines of copy, the Singularity headline news card row with all page-1 headlines, the conditional homeGrid advertisement, and the Featured author articles carousel with See all. The ad is below the entire headline row and above the carousel. Default builds have no ad markup, wrapper or reserved space.

## Footer removals

- Topics column and its category links.
- Sections, Follow and Legal headings and all column layout containers.
- Long site description.
- Editorial standards link.
- Duplicate About link in the legal list.
- Social text labels, replaced by the existing accessible icons.

The footer retains a small wordmark, the four approved section links, Facebook, Instagram and RSS icons, the existing consent-required newsletter form, small Privacy, Cookies, Terms and Contact links, Cookie settings, copyright and the CC BY skyline photo credit. Three compact wrapping rows share the content gutter. At every width Get the newsletter sits above the input row, aligned with its left edge. The newsletter section stays in normal flow with a 520px maximum width; its checkbox and reserved response line sit below the input. Email and Subscribe stay on one line from 320px through 1920px; consent is unticked and the privacy link sits below the input.

## Preserved routes and behavior

/editorial-standards/, /category/*/ and /authors/*/ still build and remain in the sitemap. Category links and named author links on articles, the editorial standards sentence on Who we are and our mission, and the retained pages provide their context. /privacy/, /cookies/, /terms/ and /contact/ remain available as small footer links. Existing legal and operator placeholders remain unchanged.

Headline news pagination uses post cards in 3, 2 and 1 columns. /page/N/ retains real pagination links and progressive loading. Featured author articles, author pages, category pages and Read next use the exact approved story-block template and rules from fa31c2d, with serif headlines, plain categories and dates at the bottom. Read next markup is restored unchanged from that commit. Card rows support native scrolling without JavaScript, overflow-only desktop arrows, keyboard steps, reduced motion and phone edge peeking. The featured carousel's JavaScript and behavior are unchanged.

The hero copy and controls, share bar, reactions, redirects, asset hashes, article URLs, SEO graph, sitemap, robots, RSS, Atom, llms.txt, consent storage/API/version, newsletter delay/suppression/Firestore writes and AdSense preparation remain. The consent popup, settings dialog and newsletter now share popup-card styles. Newsletter display is guarded against visible consent controls.

## Verification

Run npm run build and node scripts/check-restore-suite.mjs for every non-browser verify script, including publication fixtures and in-memory runtime checks. scripts/verify-restore.mjs checks the exact restored structure, preserved hero/carousel contracts, punctuation, palette and static input/row widths. scripts/verify-cards.mjs verifies headline post cards and their restricted routes. scripts/verify-blocks.mjs verifies restored story blocks and compares the template, read-next markup and CSS rules against fa31c2d. ADSENSE_PREVIEW=1 npx @11ty/eleventy --output=/tmp/sr-adpreview-restore builds the separate preview.

Browser scripts were adjusted for the owner and were not executed. Actual rendered geometry, touch scrolling, keyboard focus visibility, GPU behavior and CLS 0 need the prepared owner-run checks; static models do not prove browser rendering. No browser, desktop app, screenshot, network request or Git write is part of this task.

## Restore pass 2

This section records the pass 2 snapshot. The pass 3 section below supersedes its accumulating shader rotation, breathing amount, narrow band height and motion model results.

The featured archive keeps the owner-approved story blocks. The author carousel keeps its original template structure, JavaScript and behavior, with the approved section heading and See all label from pass 1. Headline post cards and horizontal card-row are limited to the homepage news row and /page/N/ news grids.

The disk-to-H1 gap is exactly half the previous CSS value at every breakpoint: old gap = .198 times disk width + 24px, new gap = .099 times disk width + 12px. Each cover band is shortened by the same amount. The statement remains above the decorative canvas and never intersects the disk image box.

The existing Kitt Peak photograph is unchanged. Desktop object-position now aligns the bottom; narrow screens reserve a shorter sky region above the H1 with a separate soft lower fade. The mobile crop is a 3648px square beginning at source 350,0, which places the whole dome to the right of the black hole. A short-screen safeguard at very wide widths keeps the ridge clear of the ring. src/_data/heroPhoto.json records source dimensions, crop and conservative dome bounds; node scripts/prepare-hero.mjs --skyline-contract regenerates that contract locally. Eleventy, the static model and shader map the same source coordinates. The foreground mask now includes the full dome crown, and the text scrim has smaller vertical insets. No local exposure or colour changes were needed.

The supplied real-GPU diagnosis reported only 0.02 percent of hero pixels changing above the threshold after three seconds. The cause was the approximately 350-second sky drift, 4 percent orbit blend, .025 orbital rate and 1.2 percent shimmer. The shader now has continuous frame dragging with a roughly 20-second orbit near r=1.5, an 8-second deflection breath of 12 percent, .6 Keplerian disk orbit rate, 50 percent orbit-light blend, 9 percent flowing shimmer and a 6 percent travelling ring pulse. The ring geometry, opaque shadow and protected foreground remain stable. Shader warm-up ignores five draws; fallback requires twelve draws over 24ms within the first sixty. A single long draw cannot cause fallback. Software-only WebGL guards and force capture mode remain.

The runtime publishes running, paused, static-reduced-motion, static-save-data, static-no-webgl, static-software-gl, static-frame-budget, static-error or pending-source in cover.dataset.lensingState. ?lensing=debug or localStorage sr-lensing-debug=1 enables an aria-hidden fixed badge with state, renderer, fps and draw cost. The production module contains no console calls. Node lifecycle fixtures exercise all states, debug flags, renderer classification, warm-up and heavy-frame boundaries. Real GPU thresholds are still assigned to the owner: at least 1.5 percent changed after one second and 4 percent after three seconds, with an unchanged shadow and less than 0.2 percent foreground change. Static models cannot certify those GPU measurements or rendered CLS.

The requested expert entry and portrait were removed. Six expert profiles remain and Gary Marcus remains the skeptic. The restore verifier checks every built HTML/XML file and llms.txt for the removed expert and checks that the deleted portrait is absent. There were no other matching mentions in source prose, FAQ, source lists or docs.

### Static hero geometry

Disk bottom and H1 top below are document coordinates including the fixed 72px masthead. Band and dome coordinates are relative to the cover. These are static CSS results, not browser measurements.

- 1440x900: band 644.64px, disk bottom 448.00px, H1 top 523.36px, gap 75.36px, old gap 150.72px. Dome box in band: x 843.84 to 1005.12, y 260.64 to 448.80.
- 1920x1080: band 680.64px, disk bottom 448.00px, H1 top 523.36px, gap 75.36px, old gap 150.72px. Dome box in band: x 1125.12 to 1340.16, y 168.64 to 419.52.
- 768x1024: band 650.98px, disk bottom 412.00px, H1 top 481.02px, gap 69.02px, old gap 138.05px. Dome box in band: x 450.05 to 536.06, y 200.22 to 300.58.
- 390x844: band 594.14px, disk bottom 280.38px, H1 top 326.23px, gap 45.86px, old gap 91.72px. Dome box in band: x 305.39 to 370.91, y 94.23 to 170.67.

The motion field now keeps its full influence through r=3.8 and fades continuously to zero by r=4.5. Outer-sky advection supplements inverse-square dragging without changing the inner 20-second cadence. This exposes the dim stars over enough area to satisfy the CPU regression thresholds. scripts/verify-lensing-pixels.mjs compares the decoded shipped imagery at 0, 1 and 3 seconds, plus the CSS scrim and fade, at DPR 1 with a two-pixel sample stride. The model regression targets are 1.5 and 4 percent with stable shadow and lower foreground; they are not measured GPU output. Intermediate widths from 960px to 1439px have a shorter softly faded sky crop so the dome remains above the statement.

The final static motion model reports 1.78 percent changed after one second and 9.52 percent after three seconds, with zero changed samples in the shadow and sampled lower foreground. The real-GPU threshold remains unverified. Builds also prune obsolete expert portrait files from previous output so deletion survives incremental builds and preview output.

## Pass 2 file summary

32 paths changed or added, including the portrait deletion. The pre-existing Eleventy output-directory correction was preserved.

- docs/CONSENT.md
- docs/DESIGN.md
- docs/RESTORE-STRUCTURE.md
- eleventy.config.js
- scripts/hero-contract.mjs
- scripts/hero-pixels.mjs
- scripts/prepare-hero.mjs
- scripts/static-layout.mjs
- scripts/verification-helpers.mjs
- scripts/verify-blocks-browser.mjs
- scripts/verify-blocks.mjs
- scripts/verify-browser.mjs
- scripts/verify-cards.mjs
- scripts/verify-consent.mjs
- scripts/verify-content.mjs
- scripts/verify-lensing-pixels.mjs
- scripts/verify-lensing.mjs
- scripts/verify-restore.mjs
- scripts/verify-site.mjs
- scripts/verify-skyline-suite.mjs
- scripts/verify-skyline.mjs
- scripts/verify-static-pages.mjs
- src/_data/experts.js
- src/_data/heroPhoto.json
- src/_includes/layouts/article.njk
- src/_includes/story-block.njk
- src/author.njk
- src/category.njk
- src/css/style.css
- src/featured.njk
- src/js/lensing.js
- Removed expert portrait, a plain file deletion.

## Restore pass 3

The shader no longer accumulates sky rotation. A four-second bounded oscillation has a maximum .35-radian angle at r=1.3, decreasing as inverse radius squared, with a smooth r=1.6 to r=2.6 fade. Swirl, tangential smear and drift are zero beyond r=2.6. The outer photographic field uses only the static deflection and its reduced 8 percent breathing. All five sky taps cap the complete sampling offset to .9 hole radii, including the foreground guard and smear, and retain the explicit 1.2-radius limit towards the horizon. The circular alpha fade remains r=3.8 to r=4.5.

To keep the required motion in the bounded inner field, orbiting emission now covers the disk and lensed inner arch, with a 1.0 Keplerian rate and 90 percent orbit-light blend. The photon ring's coordinates remain locked, its travelling pulse remains 6 percent, shimmer remains 9 percent, and the supplied Doppler treatment, black shadow, ridge and dome masks remain. Outer emission transitions smoothly at r=2.2 to r=2.6 to at most six byte levels away from its static value. The bound concerns sky sampling; the retained outer disk detail is also constrained by the strict long-time pixel test.

The footer heading is above the input at every width and shares its left edge. The desktop side-heading override and detached status positioning were removed. Post-card category and date now sit next to each other, left aligned with a 10px gap; distributed meta spacing was removed. Existing date formatting stays unchanged.

Phones through 639px and tablets below 960px use natural statement height rather than a fixed-height tail. Padding reserves the disk and its approved gap above the text, then 48px below the phone subline or 56px below tablet text. The 44px pause target occupies that padding at the right gutter, with 2px or 6px clearance. Desktop geometry remains unchanged. CSS models use measured Sharp/Pango text height for narrow fold assertions, and owner-run browser checks measure actual text boxes and pause targets. At 390x844 the current model band is 512.513px with 48px after the subline; at 768x1024 it is 591.444px with 56px after the subline. Browser wrapping can differ from the font model; natural flow keeps the same padding.

### Pass 3 measurements

scripts/verify-lensing-pixels.mjs records current decoded-image results in .audit/skyline/motion-model.json, with source and asset fingerprints. It checks both the sky alone against the unchanged photograph and the full supplied-artwork composite against its static fallback. Seam circles bypass the CSS text scrim and band fade. Annulus means use equal-area pixels and linear sRGB luminance, every ten seconds through 600 seconds. Every visible DPR-1 pixel outside r=2.6 is compared at 600 versus 0 seconds. Shader-equation bindings and deliberately unsafe shader, seam, winding and outer-pixel controls are verified.

- Motion above summed RGB difference 30: 2.80 percent at 1 second and 4.10 percent at 3 seconds. Most changed samples are inside r=2.6.
- Worst mean absolute circle error over 39 radii from 2.6 to 4.5 at 0, 5, 30, 120 and 600 seconds: 3.456/255 composite and 3.312/255 sky alone, below 6/255.
- Maximum absolute annulus luminance deviation from the static image, r=1.6 to r=4.5: 1.336 percent composite and 1.147 percent sky alone, within 4 percent.
- Time-600 outer maximum difference: 20.522/765. Zero pixels exceed 40/765.
- Maximum sampled sky displacement: .900 hole radii. Shadow and protected foreground have zero changed samples.

These figures are CPU model measurements. Real GPU pixels, rendered alignment, touch behavior and CLS 0 remain the editor's prepared browser checks. Browser scripts were updated and syntax checked only. No browser, screen tool, network access or Git write was used.

### Pass 3 removals

Accumulating rotation and outer sky advection, the 12 percent breathing amplitude, the detached desktop newsletter heading and status positioning, space-between on post-card metadata, and fixed narrow hero band heights were removed. Navigation destinations, homepage sections, footer links, approved story blocks, the featured carousel and all publishing, consent, newsletter and ad behavior remain as established in pass 2.

### Pass 3 file summary

16 tracked paths changed.

- src/js/lensing.js
- src/css/style.css
- scripts/hero-contract.mjs
- scripts/hero-pixels.mjs
- scripts/static-layout.mjs
- scripts/verify-lensing-pixels.mjs
- scripts/verify-lensing.mjs
- scripts/verify-cards.mjs
- scripts/verify-restore.mjs
- scripts/verify-skyline.mjs
- scripts/verify-static-pages.mjs
- scripts/verify-browser.mjs
- scripts/verify-blocks-browser.mjs
- scripts/verify-consent-browser.mjs
- docs/DESIGN.md
- docs/RESTORE-STRUCTURE.md

Final pass 3 validation: npm run build passed, all 18 non-browser verify scripts passed, and the separate ADSENSE_PREVIEW build passed. Completion ledger: 6 met, 0 unmet, 0 abandoned. Browser scripts passed syntax checks; browser, real-GPU and rendered CLS checks were not run, as required by the restoration rules.
