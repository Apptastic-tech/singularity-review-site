# Singularity Review design v4 rework

The homepage is a news front page. A compact Kitt Peak skyline band holds the fully visible black hole in open sky. The newest headline news story follows immediately with its actual headline, category, date, byline and dominant photograph. The featured author band follows that lead, then the remaining news feed. The owner supplied before screenshots guided this rework.

## Composition and reading

The sky band is 170px on phones, 210px from 640px, and 200px from 960px. The black hole photograph is 260px wide on phones, 220px below 360px, and 320px on larger screens. Its whole frame remains inside the sky band and clear of the Kitt Peak dome. The shader field is larger, with radial falloff; only its surrounding atmospheric field can extend beyond the band.

Headlines align left. The real lead headline uses Newsreader at 38px to 64px, followed by a quiet byline. The lead photograph keeps its full 16:9 composition, including on mobile, and reaches the viewport edges. Other cards retain their 4:3 mobile crop and 16:9 desktop crop. Text has 20px mobile gutters; the desktop feed is at most 1248px wide with 32px minimum gutters. Article photographs remain at most 1440px wide.

Newsreader and Inter Tight remain self hosted. Normal Newsreader is preloaded. Font display is optional so a late font download does not change already painted line wrapping. Fixed header dimensions, intrinsic picture dimensions, reserved media ratios and an absolutely positioned motion button prevent enhancement layout shifts. Rendered CLS and LCP are separate browser checks; source structure alone cannot certify them.

## Palette and UI

The existing reading palette remains: ink `#0B0C0E`, paper `#F4F1EA`, muted text `#A4A29C`, and amber `#F2A93B` for links, focus and selected navigation. Actual article categories are plain muted small text. Other eyebrow labels, slogans, marker highlights and promotional introductions are removed. Selection uses neutral `#C8CDD1`. Text rests on opaque ink rather than a global starfield backdrop.

Cards remain open story units. Spacing groups navigation and reading sections. Borders identify interactive controls; author-written thematic breaks and quotations retain their semantics. No decorative section dividers, gradient glows or text shadows are used. Sharing, reactions, tags, carousel controls, navigation focus and menu keyboard behavior retain their functional meaning. Menu and footer labels name their destinations. The 404 heading is Page not found.

## Skyline source and credit

The source is the owner's 5472 by 3648 graded photograph, copied without recompression to `src/images/brand/skyline-kittpeak.jpg`. The previous low resolution photograph and its starfield derivatives are removed. The new skyline is used in the homepage background, the lensing texture and the regenerated 1200 by 630 default social photograph. That social image contains the black hole and wordmark with no slogan.

Photo credit: [Kitt Peak at Night](https://commons.wikimedia.org/wiki/File:Kitt_Peak_at_Night_(3S8A6804).jpg) by KPNO/NOIRLab/NSF/AURA/P. Marenfeld, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The supplied photograph is colour graded and has a satellite trail removed. The credit and modification notice are visible in the footer and About page.

Eleventy Image produces AVIF, WebP and JPEG at 1280, 1920, 2560 and 3840 widths. AVIF quality is 65, WebP 88, and JPEG 82 with 4:4:4 chroma. The skyline aspect is 3:2. Its sizes are `max(255px, 100vw)`, expressed as a media condition: the height crop at the tallest mobile band needs at least 170 times 1.5, or 255 CSS pixels. This supplies sufficient pixels at 3x mobile and 2x 1920 desktop without enlargement. Responsive filenames contain their actual pixel width and change with the image content.

The skyline and black hole load eagerly at low priority. The lead story photograph alone has high fetch priority and a matching AVIF preload. Later cards and the homepage author shelf remain lazy. Article heroes and the first featured archive image retain their existing priority. The source image files are publishing inputs; browsers request the generated responsive variants.

## Black hole and motion

The owner's photographic black hole remains the masthead, favicon and sky artwork. A solid shadow beneath screen blended fallback light keeps stars out of the event horizon. The same compositing rule is used in the social image.

Homepage lensing remains a local WebGL1 enhancement. It reuses the selected responsive sky and black hole resources after two animation frames, visible intersection, idle initialization and image decoding. The shader uses separate sky and artwork mappings, inverse-distance deflection, a lensed critical curve, the existing accretion motion and radial alpha falloff. A smooth, conservative Kitt Peak silhouette protects the dome, mountains and tree. Premultiplied alpha prevents visible RGB seams along the mask.

Responsive `naturalWidth` is density corrected by browsers. Texture sizing therefore reads the selected resource's width descriptor, preserving actual pixel resolution in sky sampling and artwork mipmaps. A texture too small for the canvas or too large for the GPU restores the sharp photograph. No extra image request is required. Source changes refresh textures while retaining pause state. A resize that temporarily outgrows the selected image waits for its sharper replacement, then restores lensing; GPU errors retain the static fallback. DPR remains capped at 1.5 on phones and 2 elsewhere; slow rendering falls back from 60 to 30 frames per second.

A 44px icon button in the sky corner exposes Pause sky animation or Play sky animation, with `aria-pressed`. It controls CSS fallback motion and the shader. The preference persists under `sr-sky-paused` in local storage; blocked storage still retains current-page state. Offscreen, hidden and BFCache-suspended pages stop rendering and exclude paused time. Reduced motion, Save-Data, unavailable WebGL and all renderer failures preserve the original pictures. The module remains homepage only and cache busted.

Cross document photo transitions, reveal behavior, carousel scrolling and auto advance, menu reversal, focus trapping and scroll restoration remain. Reduced motion disables nonessential transitions and CSS animation.

## Preserved contracts and verification

The four menu destinations, URLs, publishing format, article source files, pagination, author and category archives, share bar, reactions, legacy hostname redirect, metadata and asset hashing remain. No deployment, commit or push is part of this rework.

Run `npm run build` and all `scripts/verify-*.mjs` except `verify-browser.mjs`, as requested. The site, content, lensing, rebrand and rework checks cover the generated output, lifecycle, original photo dimensions, resource pixel sizing, credits, three responsive formats and plain copy. The browser script additionally asserts the story photo is LCP, zero CLS and lead visibility at the requested widths when a browser-enabled environment is available.

The owner supplied before images were inspected first. Native Safari file previews provide rendered review with inline copies of actual built assets. Their network and origin behavior differs from HTTP production pages. Automated browser capture and the anti-ai-slop quality gate are blocked by this session's server and browser permissions; they must not be reported as passed.
