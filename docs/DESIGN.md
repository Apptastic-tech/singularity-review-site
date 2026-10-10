# Singularity Review design

## Publication chrome

The publication uses a Newsreader masthead with the existing AI mark in a fixed 72px slot. Navigation has exactly four destinations: Singularity headline news, Featured author articles, What is singularity and Who we are. The last page is titled Who we are and our mission. Long labels use the mobile menu below 1280px, and 14px desktop navigation above that width. Current destinations use white text with the same regular weight. Other headings and reporting remain left-aligned with the page grid. All rendered h1, h2 and h3 headings use sentence case, preserving proper names. Article display titles are normalized at the template boundary while the editor retains ownership of frontmatter.

The footer is one compact band with three wrapping rows: small wordmark, approved sections and social icons; the newsletter form; then Privacy, Cookies, Terms, Contact, Cookie settings, copyright and the required skyline attribution. It has a hairline top border and 48px mobile or 64px desktop separation. No columns, topic list or description remain. Article bodies, author shelves and expert profiles keep their existing reading surfaces.

## Hero statement and photographic identity

The owner's latest hero brief replaces the prior three-line statement. Its exact copy is:

1. The singularity is already here.
2. So many AI breakthroughs land every day that it's hard to keep up. We help you focus on what matters and leave out the noise.

The first is the page h1 in balanced Newsreader, 38px on mobile and clamp(44px, 4.4vw, 64px) on larger screens. The single subline is Newsreader at 19px or 21px, with balanced wrapping and a maximum width of 34em. The statement is centered; the headline row below uses h2 and the left-aligned page grid. There is no third line.

The black hole remains at top 16px. Statement top is disk top plus disk width times .7605 plus 24px. The .7605 factor includes the shader center at .48 of its 16:9 height and its full 4.5-radius influence at .109 of the disk width, a stronger bound than the static artwork bottom. This leaves 24px below the full lensing region before the statement starts, at every tested width.

The neutral Kitt Peak photograph retains its grading, continuous lower fade and edgeless radial scrim. Its scrim plateau opacity is .74 through 80 percent of the ellipse, with a darker .80 center and broad -140px/-400px/-220px insets. The verifier evaluates the actual elliptical alpha at each pixel and the worst-case white-pixel bound at each text envelope corner. These existing photographic masks are retained, without adding decorative gradients. The band reserves max(640px, disk width times .7605 plus 240px) on mobile, 720px on tablet, and clamp(720px, 70vh, 780px) on desktop. The headline row stays in normal flow below the preserved cover. Reporting has no negative margin or image overlap.

The supplied blackhole-wide.jpg remains the artwork source. Its full frame is centered with at least 24px side margins: viewport width minus 48px on mobile, then min(75vw, 640px). Both fallback and shader feather the source edges. The thin photon ring and photographed Doppler asymmetry remain; slow orbital variation blends only four percent of a moving texture sample. Lensing shimmer and star deflection are subdued. Pointer influence is absent, and the system cursor is unchanged.

The renderer initializes after paint and idle time, pauses offscreen and in hidden tabs, restores pause state and caps DPR at 1.5 on phones and 2 elsewhere. Reduced motion, Save-Data, unavailable WebGL and render failures preserve static artwork; failed WebGL hides the idle motion button. Only the homepage loads the module.

## Advertising reservations

Default builds contain no ad markup or space. ADSENSE_PREVIEW=1 and enabled client builds reserve article and homepage placements below the headline. Labels use muted Inter Tight; only preview reservations have a simple 1px border. Articles insert after top-level paragraphs three and seven, while homeGrid now sits at full content width between the complete headline row and featured author carousel. See ADSENSE.md for fixed heights, consent and the regional CMP launch requirement.

## Sharpness, attribution and verification

The 5472 by 3648 skyline produces 1440, 1920, 2880 and 3840 widths in AVIF, WebP and JPEG. Mobile uses a lossless square crop at source position 2100,500 with width 2800, encoded at 1280, 1920 and 2560. Its source sizes request 640 CSS pixels to account for the 640px-tall cover crop. JPEG uses full 4:4:4 chroma. The required viewport/DPR cases do not enlarge the selected sky resource. Credits remain linked in About and the footer.

Run npm run build, then node scripts/verify-skyline-suite.mjs. All static/Node verifiers cover publishing, chrome, sentence case, exact hero semantics, sharpness, artwork bounds, reserved fold positions, contrast and renderer lifecycle. Run node scripts/verify-static-pages.mjs directly for the geometry model. Browser-named scripts are owner-run only and are not executed during this restore. The page matrix covers home, articles, Featured author articles, What is singularity, Who we are and our mission, author and category archives, including the footer, at 390, 768, 1024, 1440, 1920 and 2560 widths.

The pixel verifier composes the current generated skyline and artwork with the CSS masks and neutral scrim. It samples each text line's rectangular envelope, using Sharp/Pango and the shipped fonts. Its CPU shader reconstruction uses a conservative shimmer bound at two times. A separate worst-case white-pixel check covers all frames and line wrapping. These are static models, not measured browser line boxes or GPU output. Local inline Markdown images receive intrinsic dimensions during the build without modifying article sources. The masthead, cover and media reserve their geometry; font-display: optional avoids a delayed font swap. Actual CLS remains for rendered review.

The latest tools rule assigns rendered visual review to the editor outside the sandbox. This pass does not launch browsers or visible applications. Runtime GPU compilation, browser interactions, actual CLS and the anti-ai-slop rendered gate are pending that review; historical screenshots are not current verification evidence.

## Cards, rows and popups

The homepage order is the unchanged skyline hero, one Singularity headline news row containing every page-1 headline newest first, the optional full-width homeGrid advertisement, and the existing Featured author articles carousel. See all points to /page/2/ only when it exists. There is no lead treatment, Latest band, homepage grid or homepage infinite loader.

Post cards use a neutral raised surface, 24px corners, layered shadows and an edge-to-edge 16:9 responsive image with intrinsic dimensions. Category and date share a line, followed by a bold 24px desktop or 22px mobile Inter Tight headline and a 15.5px excerpt. Headlines and excerpts clamp to three lines. A stretched headline link covers the card with an inset keyboard focus ring. Archives use 3, 2 and 1 columns. Read next uses the same row component.

Rows scroll natively without JavaScript. The 24px gaps, mandatory snap alignment, 84vw phone cards and viewport-edge track reveal the next card. Desktop arrows appear only for overflow and are hidden for touch-only devices. Focused-track arrow keys move one card plus gap. Reduced motion changes smooth scrolling to immediate scrolling and disables card lift and image brightness hover effects. Header controls reserve 44px before enhancement to avoid reflow.

Consent, settings and newsletter share popup-card: neutral surface, 24px corners, 24px padding, layered shadow, 20px semibold sans title, 14.5px body and 44px buttons with 12px corners. Consent stays bottom-left and the newsletter bottom-right on desktop. Phones use safe-area bottom sheets with a 60dvh internal scroll limit. Appearance and consent dismissal use a 240ms, 16px slide and fade, disabled with reduced motion. The newsletter checks both consent surfaces and hides when settings reopen.
