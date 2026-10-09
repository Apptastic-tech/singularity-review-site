# Singularity Review

AI news for people living through the singularity.

Static site built with [Eleventy](https://www.11ty.dev/) (v3). No ads, no ad feeds, no tracking scripts. Traffic comes from the Singularity Review fan pages:

- Facebook: https://www.facebook.com/profile.php?id=61595278645448
- Instagram: https://www.instagram.com/singularityreview/

Live preview: https://singularity-review.web.app

## Quick start

```bash
npm install
npm start        # dev server at http://localhost:8080
npm run build    # output in _site/
```

## Publishing an article

Add one markdown file to `src/articles/` (named `YYYY-MM-DD-slug.md`) and its hero image to `src/images/articles/slug.jpg`. Full details, frontmatter reference, and a template: see [CONTENT_GUIDE.md](CONTENT_GUIDE.md) and [content-template/](content-template/).

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
  images/brand/          avatar and cover
  _data/site.js          site title, tagline, URL, social links
  _includes/             layouts and card partial
  css/style.css          all styles
  index.njk              homepage feed
  category.njk           category pages (generated per category)
  about.md               About page
  rss.njk, sitemap.njk   feeds
content-template/        copy-paste article template (not built)
```

Set `SITE_URL` when building for a different domain, for example `SITE_URL=https://example.com npm run build`.
