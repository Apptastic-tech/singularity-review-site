# Header and sections redesign

The second pass builds and passes the site, publishing and browser regressions. The current layouts were rendered and visually reviewed at 390, 1024 and 1440px. The first-pass implementation and its historical environment limitations are recorded below.

## Second pass: 10 October 2026

- Expert profiles now use a 96 by 120px mobile portrait beside the name, role and stance label. Desktop uses 104 by 130px portraits in a two-column directory from 960px. The stance and linked works sit below, with small inline credits. Every attribution and work link, supplied photo position and the I. J. Good initials fallback remains present. At 390px the explainer measures about 9,070px, down from the supplied first-pass screenshot's 12,257px.
- The featured archive shelf is labelled "Editor's picks", distinguishing it from the page title. Mobile shelf headings reserve a clear row for the view-all link; focus outlines fit within the shelf's scrolling area without crossing the article text.
- The sticky header's full height now determines the scroll-snap offset: 73px on mobile and 119px on desktop. This prevents the initial desktop snap from pulling the page introduction under the navigation. Desktop introductions have at least 48px of space below the bar, and the current underline meets its bottom rule.
- Mobile masthead slots are explicitly symmetrical. The supplied wordmark receives a small optical correction for its internal trailing space. The menu button retains a 48 by 48px hit area, and navigation focus outlines clear the destination text.
- The homepage uses a smaller section heading, with the publication tagline retained in the menu and footer. Its single mobile essay becomes a compact thumbnail-and-title feature. A landscape crop on the first homepage news card brings its headline to about 746px from the page top at 390px, inside the initial 844px viewport. Other feed cards retain their existing photograph treatment.
- The mobile footer is a compact ruled two-column destination index. Long expert labels and explainer headings reflow at narrow zoom widths.

Verification: `npm run build`, `node scripts/verify-site.mjs`, `node scripts/verify-content.mjs` and `node scripts/verify-browser.mjs` pass. The browser regression now checks masthead centring and hit area, page-header spacing, the desktop underline, the shelf label, portrait sizes and positioning, directory columns, every credit link and missing-image initials. Existing carousel checks now wait for completed native scrolling and asynchronous preference or resize events. Carousel behaviour itself was not changed.

Additional loaded-image captures cover the homepage, featured archive, explainer, about page, a news article, category, author and 404 page at all three widths. They verify first-screen headline placement, portrait loading, menu/carousel/footer keyboard focus and reflow at half-width zoom equivalents. Evidence is retained in `.audit/r2/`; the skill audit keeps immutable before and after captures in `.audit/anti-ai-slop/`.

Article markdown, expert and organisation data, URLs, share/reaction code, the legacy-host redirect, asset hashing and dependencies remain unchanged. This pass is uncommitted; no push or deployment was performed.

## First pass record

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
