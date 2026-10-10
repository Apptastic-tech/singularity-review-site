# Singularity Review design

## Publication chrome

The owner's v4 chrome brief calls for a compact publication frame around the existing news-first homepage. The header is one 72px row, with a left-aligned Newsreader wordmark and right-aligned navigation on desktop. The wordmark is one normal face at 38px on desktop and 28px on mobile, falling to 24px below 360px. There is no header or footer picture mark, mixed typeface, italic half, separate navigation row, or scroll condensation.

Navigation reads News, Featured, Explainer, About everywhere: desktop, mobile sheet, no-JavaScript fallback, footer and navigation data. The paths remain `/`, `/featured/`, `/what-is-singularity/`, `/about/`. Current links are white; other destinations are white at 63 percent alpha. Selection does not change font weight or add a line. The mobile menu is just four destinations beneath the same-row 44px button. Its focus trap, Escape close, reversal, scroll restoration, inert background and desktop cleanup remain.

News and Featured page titles match the navigation. About has the h1 About. The Explainer document title is Explainer, with the article-like h1 What is the singularity? The homepage still uses the latest published story as its h1. Plain section titles, including the Featured shelf, are Newsreader at 26px mobile and 32px desktop. There are no promotional introductions, accent eyebrows, wide tracking on labels, or decorative section rules. Story categories are quiet regular-case links.

## Attribution and reading

One shared byline macro prints `By Ararat Ovsepian · September 4, 2026 · 14 min read` on articles, with a linked author name, explicit middle-dot separators, full publication date and computed reading time. Cards and carousel items use the same line without reading time. House names may remain plain text. Metadata stays small, muted and regular weight. Bylines wrap naturally when the viewport requires it, without becoming an avatar block.

No photograph of the publication's author exists under `src/images`, so the chrome uses no author image. There are no fabricated initials avatars. Missing expert portraits on the explainer are omitted as well; the existing real expert photographs and their credits remain. Preview story links and linked author names are siblings, preventing nested anchors and allowing each destination to work independently. Article dek and byline spacing is tight and unruled.

The footer is left aligned and compact. Its four desktop columns contain the serif publication name and AI news, research, and analysis; Sections; Topics; and Follow. They stack with a 20px gap on mobile. Section and topic links use the same quiet white active treatment as the masthead. Follow has aligned, labelled Facebook, Instagram and RSS links. The bottom line includes the copyright year, About and the photo attribution. Standalone footer targets are at least 44px high.

## Photographic identity and sky

The owner-supplied black hole has a dark shadow, thin photon ring and an accretion disk lensed into an upper arch. The square crop is 400px at source position 440,135. Favicons at 32 and 48px use sharpening; the 180px touch icon retains full colour with modest sharpening. A 512px social avatar is available at `/images/brand/social-avatar.png`. The favicon SVG embeds the real 48px photograph. The separate wordmark SVG is text only. `scripts/prepare-brand.mjs` regenerates these assets and the 1200 by 630 default social cover. The social cover uses the black hole, skyline and a consistent normal serif wordmark without a slogan.

The skyline remains the owner's graded 5472 by 3648 [Kitt Peak at Night](https://commons.wikimedia.org/wiki/File:Kitt_Peak_at_Night_(3S8A6804).jpg) photograph by KPNO/NOIRLab/NSF/AURA/P. Marenfeld, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). It is colour graded and has a satellite trail removed. Credit and modification notice appear in the footer and About page.

The photographic sky is a shallow identity band, 170px mobile, 210px tablet and 200px desktop. The current lead follows immediately, then its 16:9 photograph, the Featured shelf and remaining news. The sky produces AVIF, WebP and JPEG at 1280, 1920, 2560 and 3840 widths, retaining the 3:2 aspect, high-quality compression and 4:4:4 JPEG chroma. Height-aware sizes cover the mobile crop at 3x DPR and 1920 desktop at 2x. The lead alone has high fetch priority and a matching AVIF preload. Atmosphere loads at low priority; later news and the homepage shelf stay lazy.

Homepage lensing remains an optional local WebGL1 enhancement. It starts after visible intersection, two animation frames, image decoding and idle work, uses actual selected-resource pixels and protects the observatory foreground. Insufficient textures, GPU limits and renderer failures preserve the photographs. Source changes restore rendering without resetting pause. DPR is capped at 1.5 on phones and 2 elsewhere; slow rendering falls back from 60 to 30 frames per second. The 44px pause/play button persists state locally. Hidden pages, offscreen content and BFCache stop rendering. Reduced motion, Save-Data and unavailable WebGL retain the static fallback.

## Verification and ownership

Build with `npm run build`. Run every `scripts/verify-*.mjs` except `verify-browser.mjs`, as the owner requested. The new chrome verifier checks every generated HTML route and tests deliberate regressions as positive controls. Existing site, content, lensing, menu and rework verifiers retain their original publishing and behavior contracts with the updated presentation expectations. The browser script is updated for the new masthead and navigation but excluded from execution.

Native local-file Safari previews review exact mobile, tablet, desktop and wide desktop frame sizes with inline copies of built assets. Chrome also rendered the mobile preview. These establish visible composition and local geometry, not HTTP loading metrics or production accessibility certification. The automated HTTP audit remains blocked by sandbox server permissions; its final gate must not be reported as passed.

Concurrent illustration work owns `src/images/articles/*`, `CONTENT_GUIDE.md`, `docs/ILLUSTRATIONS.md` and `scripts/image-prompts.json`. This chrome pass does not edit them. Publishing-guide lines 32 and 48 describe obsolete avatars, line 44 uses old section labels, line 33 calls the now regular-case tags small caps, and line 54 calls quiet category links kickers. No commit, push or deployment is included.
