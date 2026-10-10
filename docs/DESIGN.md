# Singularity Review design

## Publication chrome

The publication uses a text-only Newsreader masthead in a fixed 72px slot. Navigation has four destinations: News, Featured, Explainer and About. Current destinations use white text with the same regular weight. Other headings and reporting remain left-aligned with the page grid. All rendered h1, h2 and h3 headings use sentence case, preserving proper names. Article display titles are normalized at the template boundary while the editor retains ownership of frontmatter.

The mobile footer keeps Sections, Topics and Follow in three compact columns beneath the publication identity, with 32px link targets. Desktop uses four columns. Reporting, author shelves and expert profiles use plain page surfaces and spacing, without floating boxes over photographs.

## Hero statement and photographic identity

The owner's hero-statement brief, including its highest-priority EIGHTH note, supersedes the previous no-tagline rule for this homepage statement only. Its exact copy is:

1. Hard to keep up with everything happening in the technological singularity?
2. We make it easier for you.
3. AI news, research, and analysis made simple.

The first line is the page h1, in balanced Newsreader with tight leading. The second uses a smaller italic serif and the third uses muted Inter Tight. The statement is centered; the lead article below uses h2 and the publication's left-aligned grid.

The neutral Kitt Peak night photograph has no colour filter or warm overlay. Its entire atmospheric layer, including the black hole and lensing canvas, fades continuously into #0B0C0E over the bottom 38 percent of the band. A neutral 72 percent text scrim has broad, feathered edges for bright-star contrast. It has no colour tint, text gradient or visible enclosure. The band has a reserved height of 640px below 640px viewport width, 560px between 640px and 959px, then clamp(560px, 65vh, 680px). The lead follows in normal document flow, with no negative margin or image overlap.

The supplied blackhole-wide.jpg remains the artwork source. Its full frame is centered with at least 24px side margins: viewport width minus 48px on mobile, then min(75vw, 640px). Both fallback and shader feather the source edges. The thin photon ring and photographed Doppler asymmetry remain; slow orbital variation blends only four percent of a moving texture sample. Lensing shimmer and star deflection are subdued. Pointer influence is absent, and the system cursor is unchanged.

The renderer initializes after paint and idle time, pauses offscreen and in hidden tabs, restores pause state and caps DPR at 1.5 on phones and 2 elsewhere. Reduced motion, Save-Data, unavailable WebGL and render failures preserve static artwork; failed WebGL hides the idle motion button. Only the homepage loads the module.

## Sharpness, attribution and verification

The 5472 by 3648 skyline produces 1440, 1920, 2880 and 3840 widths in AVIF, WebP and JPEG. Mobile uses a lossless square crop at source position 2100,500 with width 2800, encoded at 1280, 1920 and 2560. Its source sizes request 640 CSS pixels to account for the 640px-tall cover crop. JPEG uses full 4:4:4 chroma. The required viewport/DPR cases do not enlarge the selected sky resource. Credits remain linked in About and the footer.

Run npm run build, then node scripts/verify-skyline-suite.mjs. All nine static/Node verifiers cover publishing, chrome, sentence case, exact hero semantics, sharpness, artwork bounds, reserved fold positions, contrast and renderer lifecycle. The browser verifier also supports node scripts/verify-browser.mjs --static, which parses the generated pages without launching a browser or opening a port. The page matrix covers home, articles, Featured, Explainer, About, author and category archives, including the footer, at 390, 768, 1024, 1440, 1920 and 2560 widths.

The pixel verifier composes the current generated skyline and artwork with the CSS masks and neutral scrim. It samples each text line's rectangular envelope, using Sharp/Pango and the shipped fonts. Its CPU shader reconstruction uses a conservative shimmer bound at two times. A separate worst-case white-pixel check covers all frames and line wrapping. These are static models, not measured browser line boxes or GPU output. Local inline Markdown images receive intrinsic dimensions during the build without modifying article sources. The masthead, cover and media reserve their geometry; font-display: optional avoids a delayed font swap. Actual CLS remains for rendered review.

The latest tools rule assigns rendered visual review to the editor outside the sandbox. This pass does not launch browsers or visible applications. Runtime GPU compilation, browser interactions, actual CLS and the anti-ai-slop rendered gate are pending that review; historical screenshots are not current verification evidence.
