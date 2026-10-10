# Singularity Review v4 rework report

The rework follows the owner's news-first brief on `rebrand-blackhole`. The supplied 1440px and 390px before screenshots and the full replacement photograph were inspected before implementation. The homepage now leads with the newest published news story rather than publication slogans. No generated artwork or dependencies were added.

## Implemented changes

1. The original 5472 by 3648 graded Kitt Peak source is copied without recompression to `src/images/brand/skyline-kittpeak.jpg`. The previous low resolution skyline and all its shipped derivatives are removed. The new photograph supplies the sky band, shader texture and regenerated 1200 by 630 social cover. The social cover contains the black hole and wordmark, with no tagline.
2. Responsive skyline pictures offer AVIF, WebP and JPEG at 1280, 1920, 2560 and 3840 widths. AVIF quality is 65, WebP 88, JPEG 82 with progressive encoding and 4:4:4 chroma. Height-aware sizes cover the 3:2 photograph's mobile crop, 3x mobile and 2x 1920 desktop. The shader reads actual resource pixels rather than density-corrected natural dimensions, including for artwork mipmaps.
3. The homepage has a shallow sky band, a fully visible black hole in open sky, then the actual lead headline, category, date, byline and large 16:9 story photo. The author carousel follows that lead, then the rest of the news feed. The lead photo remains eager with high fetch priority and a matching AVIF preload; atmosphere is eager at low priority. The band is 170px on phones, 210px from 640px, and 200px from 960px. Desktop lead spacing gives the story photograph more visible area than the sky at the requested first-screen sizes.
4. The sky control is an icon-only 44px button with a 16px pause or play glyph, `aria-pressed`, and Pause sky animation or Play sky animation as its accessible name. Pause persists in local storage and controls the shader and fallback motion.
5. The menu, footer, featured archive, explainer, About page, articles, author and topic archives, and 404 use plain destination headings and labels. Non-category eyebrow labels, promotional introductions, taglines, marker treatments, decorative section rules, gradients and text shadows are removed. Categories are small muted text. Selection is neutral. Long dash punctuation and the excluded accent palette remain rejected by verification.
6. The photo credit and modification notice appear quietly in the footer, on About, and in `docs/DESIGN.md`: [Kitt Peak at Night](https://commons.wikimedia.org/wiki/File:Kitt_Peak_at_Night_(3S8A6804).jpg) by KPNO/NOIRLab/NSF/AURA/P. Marenfeld, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Colour graded; satellite trail removed.

## Lensing and preserved behavior

Lensing remains homepage only, cache busted, lazy after visible intersection, two animation frames, decoding and idle work. The new smooth foreground mask protects the dome, mountains and tree. Premultiplied alpha removes bright seams at transparent edges. The fallback and social artwork have a solid black event horizon beneath the screen-composited light.

DPR stays capped at 1.5 on phones and 2 elsewhere. Insufficient texture resolution restores the photo until a suitable responsive source arrives. A larger source restores lensing after resizing without resetting pause state. GPU texture limits and renderer failures leave the original pictures. Reduced motion, Save-Data, unavailable WebGL, hidden tabs, offscreen pauses and BFCache behavior remain covered. Simulated slow frame delivery and draw work retain the 60 to 30fps fallback.

Fixed masthead geometry, reserved media ratios, intrinsic image dimensions and an absolute motion button prevent enhancement reflow. Font display is optional, with the existing self-hosted normal headline font preloaded, to avoid late font swaps. These provisions do not independently certify measured CLS or LCP.

Content files, frontmatter format, URLs, four menu sections, ten-story pagination, author and category archives, carousel behavior, sharing, reactions, RSS, sitemap, structured metadata, legacy redirect and asset hashing remain. This rework leaves article Markdown, the article-image pipeline, expert and organisation data, carousel JavaScript, reaction JavaScript and transition JavaScript unchanged. Concurrent edits to `scripts/image-prompts.json` and article photographs appeared during the session and were preserved. The native review reflects the theme review snapshots before these ongoing artwork replacements; the final build includes the currently available article assets.

## Verification

The build and all five required verification scripts passed on the final source. Their command-bound evidence is recorded in `.unlazy/rework/GATES.md`:

- `npm run build`: generated 17 pages for five published articles, including four headlines and one featured article.
- `node scripts/verify-site.mjs`: assets, responsive formats, actual lead, icon semantics, credits, navigation, metadata, publishing contracts, punctuation and palette.
- `node scripts/verify-content.mjs`: isolated fixtures for pagination, section overrides, drafts, author archives, empty sections, image dimensions, captions, updated metadata and expected publishing failures.
- `node scripts/verify-lensing.mjs`: lazy lifecycle, failures and cleanup, persistent pause, actual resource pixels, responsive recovery, DPR, frame pacing and foreground geometry at five widths.
- `node scripts/verify-rebrand.mjs`: menu timing and reversal, focus trap, scroll restoration, reduced motion, shared photo transitions, copy, documentation and unchanged dependencies.
- `node scripts/verify-rework.mjs`: full source dimensions, lossless source import, four skyline widths in three formats, full JPEG chroma, height-aware sizes, texture guards, plain copy and absence of decorative section rules.

`verify-browser.mjs` was updated with stricter lead visibility, icon semantics, zero CLS and story-photo LCP assertions, but was not run, as the owner requested.

Native Safari file previews use inline copies of built CSS, fonts, responsive pictures and local scripts inside exact viewport frames. Homepage composition was reviewed at 390 by 844, 1024 by 900, 1440 by 900 and 1920 by 1080. Mobile reviews also covered featured, About, explainer, article, author, topic and 404 pages, plus menu and pause interactions. Live GPU rendering exposed a mask edge and alpha seam; both were repaired and inspected again. These previews have different network and origin behavior from production HTTP pages. They cannot establish a measured production LCP, CLS, frame rate or complete accessibility audit.

The deterministic anti-ai-slop scan found only references to the existing Inter Tight font and no candidate clusters. That family is dismissed for this rework: Inter Tight remains restrained metadata and navigation, paired with the established Newsreader story hierarchy and the owner's photographic identity. No visual quality score is claimed.

Automated HTTP capture could not complete: local server listening was denied with EPERM, shell Chromium launch was denied, and the browser connector required approval under a session policy that forbids approvals. The skill's final visual gate remains a required handoff, with `completion_eligible: false`. Its missing automated screenshots, responsive and contrast evidence must be collected in a browser-enabled session before visual certification. The native review does not substitute for that gate.

The acceptance ledger records eight met gates, no pending code gates, and one abandoned gate requiring handoff: G7, the automated visual certification blocked by session permissions. Syntax and `git diff --check` also pass. HEAD remains `b36a611c52901b52c16a463268f8b2c102724f0f`. No commit, push, Firebase command or deployment was performed.
