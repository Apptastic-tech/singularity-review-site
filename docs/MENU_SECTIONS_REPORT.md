# Header and sections redesign

The implementation builds and its site and publishing regressions pass. Rendered mobile, tablet and desktop verification remains blocked by this execution environment. No visual quality pass or browser interaction pass is claimed.

## Decisions and implementation

- A centered 72px mobile masthead opens a full-height menu. Large ruled destination rows, amber current states, visible focus, a keyboard focus trap, Escape handling and body scroll restoration support navigation. Desktop uses a 64px centered masthead over four inline destinations. Header changes use transforms within fixed dimensions.
- Navigation, the no-JavaScript fallback and footer share exactly four destinations. Categories remain in article kickers and the generated footer Topics list. Secondary social links and RSS appear in the menu and footer.
- The `headlines` and `featured` collections derive placement from authorship, with optional `section: news` or `section: featured` overrides. `articles` still contains every published post for RSS, sitemap and Read next. Article navigation follows the requested authorship rule even when placement is overridden.
- The headline homepage paginates ten posts. A ruled author shelf sits near the top of its first page. `/featured/` has the shelf and the complete featured archive. Empty sections keep their routes and show useful fallback copy. Nunjucks asynchronous conditionals preserve the shelf when the headline feed is empty.
- The vanilla carousel uses native horizontal scroll snapping, responsive thumbnails, photo or initial avatars, arrow controls and a visible pause/play control. Auto-advance pauses for hover, focus, pointer contact and hidden tabs; reduced motion disables it. A single article has a full-width presentation with no controls or auto-advance.
- `/about/` now reads "Who we are". `/what-is-singularity/` explains the historical idea and its uncertainties, links original sources, and consumes expert and organisation data with visible credits. Missing portraits show initials. Page metadata, canonicals, Open Graph tags and explainer WebPage structured data are present.

Article markdown, share and reaction code, the legacy-host redirect, asset hashing, the picture shortcode and existing article structured data were preserved. No libraries, frameworks or external script dependencies were added. The separately maintained expert and organisation data and portraits were consumed without modifying their contents.

## Verification

- `npm run build`: passes. Five existing articles, four headlines, one featured, both new routes and all existing archives and feeds build.
- `node scripts/verify-site.mjs`: passes. Checks section feeds, all four navigation variants and current states, canonical/social metadata, structured data, sitemap entries, share/reaction preservation, carousel script scoping, unique HTML IDs and local asset links.
- `node scripts/verify-content.mjs`: passes. An isolated fixture verifies 23 headlines in pages of ten, ten and three; three featured posts; automatic authorship and both overrides; draft exclusion; author archives; populated expert credits and organisations; empty data and sections; a single featured post with no headlines; fully empty publishing; no image upscaling; and clear invalid-section and missing-image failures.
- JavaScript syntax and Git whitespace checks pass. Forbidden punctuation is absent from project source and documentation. Palette keyword matches are limited to existing prohibitions and the verification matcher; frontend source has none.
- The carousel controller also passes an isolated event harness covering timed advance, hover, focus, pointer cancellation, tab visibility, pause/play, reduced motion, buttons and keyboard navigation. This logic check does not establish browser layout or interaction quality.

`scripts/verify-browser.mjs` now covers the 390px, 1024px and 1440px layouts, menu focus and scroll locking, header scrolling, loading fallbacks, carousel controls/timing and the new pages. Its execution fails at local server creation with `listen EPERM` on `127.0.0.1`. The Eleventy preview also fails with `listen EPERM` on `0.0.0.0`. An existing Chromium executable fails to launch in this environment, and the browser connector requires an approval that this session cannot grant. No dependencies or browser binaries were installed.

The anti-ai-slop skill requires rendered evidence and a passing completion gate. Its audit and gate remain blocked, so visual review is outstanding. Run the browser script and skill audit in a permitted environment before claiming visual completion. Build-output inspection does not replace rendered evidence.

## Main files

- Publishing: `eleventy.config.js`, `src/_lib/sections.js`, `src/index.njk`, `src/featured.njk`, `src/sitemap.njk`.
- Navigation and presentation: `src/_data/navigation.js`, `src/_includes/navigation.njk`, `src/_includes/layouts/base.njk`, `src/css/style.css`, `src/js/site.js`.
- Carousel: `src/_includes/carousel.njk`, `src/js/carousel.js`.
- Pages: `src/about.md`, `src/what-is-singularity.njk`, `src/what-is-singularity.11tydata.js`.
- Verification and documentation: `scripts/verification-helpers.mjs`, the three `scripts/verify-*.mjs` files, `CONTENT_GUIDE.md`, `README.md`, `docs/DESIGN.md`, `docs/UX_REFERENCE.md`, this report.

The requested local commit is blocked: `git add` cannot create `.git/index.lock` because the session denies writes to Git metadata. Implementation and documentation remain in the working tree. The separately filled expert data and portraits were left out of the attempted staging command. No push, deployment or Firebase command was run.
