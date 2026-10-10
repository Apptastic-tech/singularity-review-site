# Restored publication structure

## Navigation

The four short section labels were replaced with the owner-approved text: Singularity headline news, Featured author articles, What is singularity and Who we are. The starting branch already had four primary links, so no additional navigation destination was present to remove. Desktop navigation, the mobile menu, no-JavaScript navigation and footer sections all use the same four-item data file. Topics, contact and editorial standards are excluded from primary navigation.

## Homepage removals

- Separate large lead story treatment and its lead-only card partial and CSS.
- Latest heading and band.
- Homepage story grid and the old story-block partial and CSS.
- Homepage Load more control and automatic loading sentinel. See all links to /page/2/ when it exists.

The homepage retains only the unchanged v4 skyline hero and exact two lines of copy, the Singularity headline news card row with all page-1 headlines, the conditional homeGrid advertisement, and the Featured author articles carousel with See all. The ad is below the entire headline row and above the carousel. Default builds have no ad markup, wrapper or reserved space.

## Footer removals

- Topics column and its category links.
- Sections, Follow and Legal headings and all column layout containers.
- Long site description.
- Editorial standards link.
- Duplicate About link in the legal list.
- Social text labels, replaced by the existing accessible icons.

The footer retains a small wordmark, the four approved section links, Facebook, Instagram and RSS icons, the existing consent-required newsletter form, small Privacy, Cookies, Terms and Contact links, Cookie settings, copyright and the CC BY skyline photo credit. Three compact wrapping rows share the content gutter. At desktop widths the newsletter heading and reserved response area sit beside the input row; the checkbox line uses the available width beneath it. Email and Subscribe stay on one line from 320px through 1920px; consent is unticked and the privacy link sits below the input.

## Preserved routes and behavior

/editorial-standards/, /category/*/ and /authors/*/ still build and remain in the sitemap. Category links and named author links on articles, the editorial standards sentence on Who we are and our mission, and the retained pages provide their context. /privacy/, /cookies/, /terms/ and /contact/ remain available as small footer links. Existing legal and operator placeholders remain unchanged.

Archives and pagination use shared post cards in 3, 2 and 1 columns. /page/N/ retains real pagination links and progressive loading. Read next uses the shared card row. Card rows support native scrolling without JavaScript, overflow-only desktop arrows, keyboard steps, reduced motion and phone edge peeking. The featured carousel's JavaScript and behavior are unchanged.

The hero, share bar, reactions, redirects, asset hashes, article URLs, SEO graph, sitemap, robots, RSS, Atom, llms.txt, consent storage/API/version, newsletter delay/suppression/Firestore writes and AdSense preparation remain. The consent popup, settings dialog and newsletter now share popup-card styles. Newsletter display is guarded against visible consent controls.

## Verification

Run npm run build and node scripts/check-restore-suite.mjs for every non-browser verify script, including publication fixtures and in-memory runtime checks. scripts/verify-restore.mjs checks the exact restored structure, preserved hero/carousel contracts, punctuation, palette and static input/row widths. scripts/verify-cards.mjs replaces the former block verifier. ADSENSE_PREVIEW=1 npx @11ty/eleventy --output=/tmp/sr-adpreview-restore builds the separate preview.

Browser scripts were adjusted for the owner and were not executed. Actual rendered geometry, touch scrolling, keyboard focus visibility, GPU behavior and CLS 0 need the prepared owner-run checks; static models do not prove browser rendering. No browser, desktop app, screenshot, network request or Git write is part of this task.
