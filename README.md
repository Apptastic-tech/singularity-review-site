# Singularity Review

AI news, research, and analysis.

Static site built with [Eleventy](https://www.11ty.dev/) (v3). No ads, no ad feeds, no tracking scripts. Traffic comes from the Singularity Review fan pages:

- Facebook: https://www.facebook.com/profile.php?id=61595278645448
- Instagram: https://www.instagram.com/singularityreview/

Live site: https://singularityreview.com (the Firebase default hosts singularity-review.web.app and singularity-review.firebaseapp.com send readers here)

## Quick start

```bash
npm start        # dev server at http://localhost:8080
npm run build    # output in _site/
```

## Publishing an article

Add one markdown file to `src/articles/` (named `YYYY-MM-DD-slug.md`) and its hero image to `src/images/articles/slug.jpg`. Full details, frontmatter reference, and a template: see [CONTENT_GUIDE.md](CONTENT_GUIDE.md) and [content-template/](content-template/).

## Redesign v2

The reading feed uses large single-column cards, a sticky header that follows scroll direction, a four-destination editorial navigation, a full-height accessible mobile menu, and progressive infinite loading. Homepage headline pagination publishes `/page/2/` onward only when needed. Without JavaScript, Load more remains a normal page link. The homepage contains headline news only, with a featured author carousel near the top. `/featured/` collects author articles; `/what-is-singularity/` explains the idea and consumes the separately maintained expert and organisation data. Category pages and Read next reuse the same cards. Section placement follows the author unless optional `section: featured` or `section: news` overrides it.

Newsreader Variable and Inter Tight Variable are self-hosted from the installed packages into `/fonts/`. All article images are processed automatically at build time by `@11ty/eleventy-img` into cached AVIF, WebP, and JPEG variants in `_site/img/`, while original image URLs stay published for social sharing and RSS. The first hero receives a responsive preload; later images are lazy. Missing hero files cause a clear build error.

Prepare a new hero with `node scripts/prepare-hero.mjs <input-image> <slug>`. Rebuild the photographic brand assets and social cover with `node scripts/prepare-brand.mjs`. To import the graded Kitt Peak source again, pass the directory containing `skyline-kittpeak-graded-5472.jpg`. Exact original image generation prompts are recorded in [scripts/image-prompts.json](scripts/image-prompts.json).

See [docs/DESIGN.md](docs/DESIGN.md) for the visual system and [docs/UX_REFERENCE.md](docs/UX_REFERENCE.md) for the interaction reference. See [GATES.md](GATES.md) for verification outcomes. Dependencies are already installed in this working checkout.

Build verification: `npm run build` followed by `node scripts/verify-site.mjs`. Future-post regression checks: `node scripts/verify-content.mjs`. Browser verification requires an existing Playwright runtime and an environment that permits launching a local browser and server; no dependencies are installed by these scripts. Set `BROWSER_RUNTIME_ROOT` to that runtime directory and optionally `BROWSER_EXECUTABLE_PATH` to an existing Chromium executable, then run `node scripts/verify-browser.mjs`. See [docs/MENU_SECTIONS_REPORT.md](docs/MENU_SECTIONS_REPORT.md) for the current verification status.

## Deploy

Hosting: Firebase Hosting, project `apptastic-mobi`, site `singularity-review` (hosting target `site`, see `.firebaserc`). The deploy only touches this site.

```bash
firebase login             # once, with an account that has access to apptastic-mobi
npm run deploy             # = clean + build + firebase deploy --only hosting:site --project apptastic-mobi
```

Pushing to `main` runs a CI build check (`.github/workflows/ci.yml`) but does not deploy. Automatic deploys would need a Firebase service account secret in the repo, which has not been added.

## Project layout

```
src/
  articles/              one .md file per article (+ articles.11tydata.js defaults)
  images/articles/       hero and inline images
  images/brand/          wordmark, Apple touch icon, default social image
  _data/site.js          site title, description, URL, social links
  _includes/             layouts, social icons, and whole-card partial
  css/style.css          all styles
  js/site.js             small deferred navigation and loading enhancements
  js/carousel.js         carousel controls and optional auto-advance
  index.njk              headline feed, ten stories per page
  featured.njk           author carousel and complete featured archive
  what-is-singularity.njk singularity explainer and data-driven profiles
  category.njk           category pages (generated per category)
  about.md               Who we are page
  rss.njk, sitemap.njk   feeds
content-template/        copy-paste article template (not built)
```

Set `SITE_URL` when building for a different domain, for example `SITE_URL=https://example.com npm run build`.
