# Singularity Review v4 rebrand report

Implemented the black hole and night skyline brief on `rebrand-blackhole` in the site repository. The owner's supplied artwork is the visual source. No generated replacement art, dependencies, external scripts or remote fonts were added.

## Theme and assets

The homepage has a full width observatory skyline cover with a photoreal black hole in the sky and a large editorial headline. A faint crop of the supplied starfield sits behind the rest of the publication. Amber remains `#F2A93B`; paper text and near black backgrounds retain the reading palette.

The header and footer pair the new photographic mark with a live wordmark. The header mark is 36px on phones and 40px on desktop. The old orbit SVG has been replaced with a raster embedded wordmark. PNG favicons at 32px and 48px use a tight, contrast normalized crop of the central shadow and lensed light. The SVG favicon embeds that crop, and the Apple touch icon is 180px.

The default 1200 by 630 social JPG combines the skyline, black hole and wordmark. Default Open Graph and Twitter metadata reference it; article metadata retains each story's original hero. The source artwork was read without modification. Optimized copies and derived assets live in `src/images/brand/`. The old thumbnail reference is not shipped. `scripts/prepare-brand.mjs` regenerates all static brand assets from those copies or imports from a supplied source directory.

## Type and photography

Cover headlines scale to 104px. Story headlines scale from 38px to 64px; article titles scale from 48px to 88px. Section headings and expert names are also larger. Desktop menu text is 19px to 24px; the mobile sheet uses 32px to 48px destinations. Newsreader and Inter Tight remain self hosted.

Card, carousel and article hero photographs touch the mobile viewport edges. Text keeps 20px gutters. The desktop feed expands from 760px to 1248px, and article hero images expand from 1120px to 1440px. Cards are open editorial units without a rounded container or border. The lead news photo follows the cover; the featured author shelf follows the news feed. Carousel controls and behavior remain in place.

## Removed treatments

Links no longer use underlines. The active desktop navigation rule and byline line treatment are removed. Prose links use amber and weight 600; navigation uses color, weight and mobile position. Focus outlines remain.

Tags and stance labels are plain small caps. Pagination and share controls are rectangular. Reactions remain a functional emoji or heart and count in a plain row, with `aria-pressed` and a selected count marker. Generic Read story arrows and View all arrow treatment are removed. There are no gradient buttons, glass cards or emoji feature bullets. Strict source checks reject forbidden long dash punctuation and the excluded source palette.

## Motion

Cross document View Transitions opt in where supported. The header has a shared name; only the selected preview photo receives the article photo name during navigation. Article heroes and return navigation use the same name without creating duplicates in feed and carousel instances. A small local head script registers listeners before first paint and clears outgoing names after capture for back and forward cache safety. This timing follows the [Chrome Developers cross document transition guidance](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document).

IntersectionObserver reveals cards and inline article images once when they enter the viewport, including appended pagination cards. Content remains visible without JavaScript and observers. Card hover gently scales the photograph within its clipped frame and changes the title color.

The cover sky drifts slowly through CSS transforms, and the black hole disk tilts subtly with opacity variation. Atmosphere stops outside the viewport or in a hidden tab. A plain Pause sky motion control reserves its layout space and lets readers stop or resume movement. Reduced motion disables nonessential animation and transformations, including document transitions; carousel auto advance retains its existing reduced motion behavior.

The menu animates opening and closing with staggered destinations. Pending close cleanup can be cancelled by a rapid reopen. Focus trapping, Escape, background inert state, scroll locking and restoration remain. Reduced motion and desktop resizing finish pending closes immediately.

## Performance and preservation

Eleventy Image produces responsive AVIF, WebP and JPEG brand variants, up to 1920px without upscaling. The cover skyline's sizes account for its tall mobile crop so the photograph stays sharp. The skyline and black hole are eager, with the skyline at high priority. Article heroes and first lead cards retain high priority; later cards and the homepage author shelf are lazy. The featured archive's first carousel image is eager.

Intrinsic image dimensions, reserved media aspect ratios, fixed masthead dimensions and the motion control slot avoid image and enhancement layout shifts. Existing CSS and script hashes remain; new header, starfield and icon references are also hashed. No libraries were added.

The four destinations, content file naming, frontmatter, `section:` override, URLs, ten story pagination, featured carousel, sharing, Firestore REST reactions, author/category archives, RSS, sitemap, structured data and legacy hostname redirect remain. Article Markdown, article images, expert/organisation data, carousel JavaScript and article JavaScript are unchanged. CONTENT_GUIDE.md now describes the actual crops and plain topic labels.

## Verification and handoff

Required commands pass:

- `npm run build`: 17 pages generated for the five current published articles.
- `node scripts/verify-site.mjs`: five articles, four headlines, one featured, navigation, metadata, local assets, responsive formats, photographic icons, compression, motion hooks, source palette, punctuation and treatment checks.
- `node scripts/verify-content.mjs`: isolated fixtures exercise 23 headlines, three featured stories, ten story pagination, section overrides, drafts, author archives, empty sections, small images, captions, updated metadata and expected failures for missing images or invalid sections.

`node scripts/verify-rebrand.mjs` additionally exercises the menu's close timing, rapid reversal, focus trap, scroll restoration, runtime reduced motion changes and desktop cleanup in a simulated DOM. It also checks duplicate preview selection, shared article photos, snapshot cleanup and reduced motion transition skipping. It checks the theme documentation and unchanged dependency list. Syntax and whitespace checks also pass.

The favicon crop, touch icon, header artwork and final social cover were visually inspected as image assets. `scripts/verify-browser.mjs` is updated for the larger type, edge photos, non-underline active navigation, sky pause control and reduced motion paths.

The browser suite and rendered page screenshots were not run. The brief says local servers are blocked and the owner will render screenshots. This pass therefore has no fresh browser evidence or passing visual audit score. GATES.md records the owner screenshot handoff explicitly. Review homepage, featured archive, article, explainer and about page at 390 by 844, 1024 by 900 and 1440 by 1000, including open/close menu, keyboard focus, reduced motion, carousel and mobile image edges.

No commit, push, Firebase command or deployment was performed.
