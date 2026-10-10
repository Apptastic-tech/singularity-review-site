# UX reference v4

The original browsing patterns were informed by ux-news.com. No visuals, text, code or assets were copied. The v4 identity comes from the owner's black hole artwork and clean night skyline photograph.

## Reading and browsing

A night observatory cover establishes the publication on the homepage. Its large headline gives way directly to the lead news photograph. A single vertical feed keeps documentary imagery dominant instead of enclosing stories in generic card containers. Photos reach the mobile edges; headlines and excerpts retain comfortable text gutters. The desktop feed reaches 1248px, and article heroes reach 1440px.

The four primary destinations remain Singularity headline news, Featured author articles, What is singularity, and Who we are. Larger desktop text and a full height mobile sheet make the destinations easier to scan. Color, weight and position identify the current section. There are no active underlines, chips or arrow capsules. The footer repeats the destinations and includes generated topics, social links and RSS.

The homepage keeps ten stories per page and its featured author carousel. The author shelf follows the news feed so the lead photograph has the next position after the cover. The featured archive opens with its Editor's picks carousel and then the full archive. Multiple slides support touch scrolling, keyboard arrow navigation, previous and next controls, and pause/play. A single slide uses a generous photograph without carousel controls.

Section placement still follows author identity unless `section: news` or `section: featured` overrides it. Author archives, category archives, Read next, RSS and sitemap include the same published stories. Drafts remain excluded, and empty sections retain usable routes and fallback copy.

## Navigation and feedback

The sticky header reveals and hides with scroll direction and condenses on desktop without changing page geometry. The menu animates both opening and closing, contains keyboard focus while open, supports Escape, locks background scrolling and restores the reader's position. Fast open/close reversals remain usable. Navigation works without JavaScript through the fallback links.

Story image hover and title color changes identify whole card links. Prose references use amber and stronger weight instead of underlines. All controls retain clear focus outlines. Share controls keep the same targets, native sharing and copy feedback. Reaction emoji remain functional, displayed as plain emoji and counts rather than capsules; Firestore REST loading and voting are unchanged.

Cross document transitions maintain the masthead and, where supported, connect a selected preview photograph to the article hero. Reveal motion is a one time enhancement to photographs entering the viewport. A real story link remains usable in every browser.

The cover's slow sky drift and slight disk tilt express the astronomical setting. They stop outside the viewport or when the document is hidden, and readers can pause them explicitly. Reduced motion disables atmospheric movement, reveal entrances, hover transforms, menu animation, document animation and carousel auto advance. Story content never relies on animation or observers to appear.

## Performance and accessibility

Fonts remain self hosted. Responsive AVIF and WebP variants reduce the cost of larger images; JPEG fallback remains available. Image dimensions and aspect ratios reserve space. Lead images are eager with high fetch priority; below fold images are lazy. Progressive feed loading keeps a real Load more link for disabled JavaScript, unavailable observers and fetch failures.

There are no new libraries, external font services, third party scripts, ads, analytics or new subscription flows. The publishing format, legacy host redirect and hashed asset URLs remain intact.

The required build and source/content checks are recorded in REBRAND_V4_REPORT.md. Browser assertions have been updated for v4 but were not executed in this pass because the brief reserves screenshot rendering for the owner and identifies local servers as blocked. Review desktop 1440 by 1000, tablet 1024 by 900 and mobile 390 by 844, including the open menu, article hero and featured shelf.
