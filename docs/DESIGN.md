# Singularity Review design v4

Singularity Review reads as an observatory for the AI beat. The homepage opens on the owner's photograph of a mountain observatory under a starfield. A photoreal black hole hangs in the upper sky. Large newspaper headlines and dominant documentary photographs carry the reporting below.

## Palette and surfaces

Near black `#0B0C0E` is the page ground, warm paper `#F4F1EA` is primary text, and amber `#F2A93B` identifies links, categories, focus and the current destination. Secondary reading text uses `#A4A29C`. Surfaces use `#131518` and `#1C1F23`; structural dividers use `#2A2E33`. There are no additional saturated brand colors.

A faint, compressed crop of the real starfield sits behind the page. Story cards have no enclosing border, shadow, translucent material or rounded corners. Dividers separate editorial sections; they never decorate a tagline or identify active navigation. Tags and stance labels are plain small caps. Reactions use a plain emoji or heart and count, with no capsule border or filled container. Selected reactions keep `aria-pressed` and add a visible check beside a count.

Every link has no underline. Prose references use amber and weight 600. Navigation uses color and weight, with a slight inset on the current mobile destination. Hover changes color; amber focus outlines remain visible. Rectangular share and pagination controls retain their accessible labels and at least 44px targets.

## Typography and photographic scale

Newsreader Variable is the editorial face, with Georgia as fallback. Inter Tight Variable handles controls and metadata. Both remain self hosted with `font-display: swap`; normal Newsreader is preloaded. Optical sizing stays enabled.

The cover headline scales from 54px on small phones to 104px on desktop. Feed and archive introductions scale from 50px to 88px. Story titles scale from 38px to 64px, and article titles from 48px to 88px. Section headings, expert names and organisation headings also increase. Desktop navigation is 19px to 24px; mobile menu destinations are 32px to 48px. Body copy stays 19px on phones and 21px on larger screens, at a reading measure of up to 65ch.

Mobile card, carousel and article hero photographs reach both viewport edges. Text keeps 20px gutters. The feed grows to 1248px on desktop with 32px minimum side space, and article hero images grow to 1440px. Story cards use a 4:3 mobile crop and a 16:9 desktop crop. Article heroes retain their intrinsic 16:9 ratio. Carousel images are large landscape frames; a single desktop essay pairs its image with headline and author. Multiple slides retain horizontal touch scrolling and the existing controls.

The article publishing format remains `src/articles/YYYY-MM-DD-slug.md` plus `src/images/articles/<slug>.jpg`. Frontmatter, `section:` overrides and public URLs are unchanged. Subject placement should suit both 4:3 and landscape crops. Image aspect ratios and intrinsic dimensions reserve space before loading.

## Black hole identity

The header pairs a round 36px photographic crop on mobile, 40px on desktop, with a refined live wordmark. The footer uses the same artwork. The old drawn orbit is replaced everywhere. `wordmark.svg` embeds the real raster crop for portable use.

The 32px and 48px PNG favicons tightly frame the central shadow and lensed accretion disk. `favicon.svg` embeds the same real raster crop. The Apple touch icon is 180px. The default Open Graph cover is a progressive 1200 by 630 JPG showing the skyline, black hole and wordmark. Article social images keep their original hero JPGs.

Run `node scripts/prepare-brand.mjs /path/to/source-directory` to import the supplied artwork and prepare assets. Run `node scripts/prepare-brand.mjs` to regenerate from the committed optimized copies. Original artwork in the owner's brand directory remains read only. The reference thumbnail containing the old mark is never copied or shipped.

## Motion and navigation

`@view-transition { navigation: auto; }` enables cross document transitions where supported. The masthead has a stable transition name. JavaScript names only the chosen story photograph `article-photo` during page swap and reveal, including return navigation, preventing collisions when one story appears in both the feed and carousel. A small local head script registers these listeners before the first rendering opportunity. Outgoing names are cleared after capture for back and forward cache safety. Unsupported browsers navigate normally.

IntersectionObserver adds a brief entrance to cards and inline article images when they first enter the viewport, including progressively appended stories. Content is visible without JavaScript, without IntersectionObserver and with reduced motion. Hover gently scales an image inside its clipped media area and changes headline color.

The cover sky drifts over 36 seconds; the disk changes its tilt by two degrees and its opacity over 24 seconds. Only transforms and opacity animate. Atmospheric motion runs while the cover is visible and the tab is active. A plain Pause sky motion control lets readers stop or resume it; its reserved slot prevents layout shift. These motions make the supplied astronomical setting tangible without interrupting reading.

The mobile sheet fades and translates on open and close over 240ms. Destinations enter with short staggered offsets. Rapid reversals cancel pending close cleanup. The existing focus trap, Escape handling, background inert state, body scroll lock and scroll restoration remain. Crossing to desktop completes any pending close immediately.

Reduced motion disables cover drift, reveals, hover transforms, sheet transitions and document animations. The carousel's existing reduced motion path disables auto advance. No motion library is used.

## Performance and contracts

Eleventy Image generates AVIF, WebP and JPEG variants. Article variants remain 480, 800 and 1280px without upscaling. Brand variants use the same widths plus 1920px where the source permits. The cover skyline is eager with high fetch priority; first lead story images and article heroes keep eager priority, while later cards and the homepage author shelf are lazy. The featured archive's first carousel image is eager. Asset hashing continues for CSS and scripts and also covers header artwork, starfield, favicons and the touch icon.

The sticky masthead keeps fixed dimensions: 73px total on mobile and 143px on desktop. Header condensation uses transforms and does not move the feed. The four navigation destinations, ten story pagination, featured carousel, share bar, Firestore REST reactions, RSS, sitemap, canonical metadata and legacy hostname redirect remain in place.

Source and generated output checks live in `scripts/verify-site.mjs`; content regressions use isolated temporary checkouts in `scripts/verify-content.mjs`. `scripts/verify-browser.mjs` checks the larger scale, edge images, focus handling, animation preferences and carousel behavior when run in an environment with a local browser runtime and server permissions. Owner rendered screenshots are the final visual check for this pass.
