# Singularity Review: Content Guide

Publishing a new article means adding ONE markdown file plus its hero image, then building and deploying.

## Where things go

| What | Folder | Naming |
| --- | --- | --- |
| Article text | `src/articles/` | `YYYY-MM-DD-slug.md` (example: `2026-10-09-openai-agent-audit.md`) |
| Hero image | `src/images/articles/` | `slug.jpg` (same slug as the article, without the date) |
| Extra inline images (optional) | `src/images/articles/` | `slug-2.jpg`, `slug-3.jpg`, and so on |

The public URL is `/articles/<slug>/`. The date prefix in the filename is only for sorting files and is dropped from the URL.
Example: `src/articles/2026-10-09-openai-agent-audit.md` becomes `https://singularityreview.com/articles/openai-agent-audit/`.

Use lowercase letters, numbers, and hyphens in the slug. Do not rename a published file: that changes its URL.

## Frontmatter

Copy `content-template/YYYY-MM-DD-your-article-slug.md` into `src/articles/`, rename it, and fill in:

```yaml
---
title: "Headline in Title Case"            # required
description: "One or two sentence dek."      # required. Card excerpt, RSS, og:description
date: 2026-10-09T09:00:00Z                   # required. ISO 8601, UTC. Controls feed order (newest first)
category: Policy                             # required. One category per article
hero: /images/articles/your-article-slug.jpg # required. Path under src/images, starting with /images/
heroAlt: "What the image shows"              # required. Alt text for accessibility
author: Singularity Review                   # optional. Defaults to "Singularity Review"
section: featured                            # optional. featured or news; absent = automatic
authorPhoto: /images/authors/your-author.jpg  # optional. Self-hosted avatar for featured carousel
tags: ["Tag one", "Tag two"]                 # optional. Shown as plain small caps under the article
updated: 2026-10-10T09:00:00Z                # optional. Used in sitemap lastmod and JSON-LD
heroCaption: "Image credit or caption"       # optional. Shown under the hero image
draft: true                                  # optional. If true, the article is not built or listed
---
```

Body: plain markdown below the frontmatter. Do not repeat the title or dek in the body (the layout prints them). Start with the first paragraph of the story.

## Headline news and featured articles

Section placement is automatic. A post with no `author`, or with `author: Singularity Review` (the site's `defaultAuthor`), appears in **Singularity headline news** on `/` and its ten-story pagination pages. A post whose author differs from the house name appears in **Featured author articles** on `/featured/` and in the featured carousel on the homepage.

The optional `section:` field overrides this placement. Use `section: featured` to feature a house-authored story, or `section: news` to place a named author's story in the headline feed. Leave it out for automatic placement. Other section values fail the build with a clear error. Existing articles need no changes.

`authorPhoto:` optionally supplies a self-hosted author avatar, such as `/images/authors/your-author.jpg`. Place the image under `src/images/`; it is copied automatically. Without a photo, the carousel displays initials in an amber circle. Author archive URLs and bylines continue to follow the `author` field, and article navigation highlights the author destination for named authors even when `section: news` is set.

RSS, sitemap, category pages and Read next include all published articles from both sections. Drafts remain excluded. The featured homepage band is hidden when there are no featured posts; both section routes still build when their feeds are empty.

## Categories

Categories are created automatically from the `category` field. `/category/<slug>/` pages and the footer **Topics** list are generated for every category that has at least one article. Article kicker links also lead to category pages. Current categories: `Agents`, `Models`, `Policy`. Reuse the exact spelling to keep stories together. A new spelling creates a new topic page and footer link.

## Image guidelines

The content format is unchanged. Articles still use `src/articles/YYYY-MM-DD-slug.md` and the same frontmatter keys above. A future article needs only one Markdown file and one hero JPG. No per-article configuration or manually generated image variants are needed.

- A hero is required. Save it as `src/images/articles/<slug>.jpg` and use `hero: /images/articles/<slug>.jpg`.
- Use a 16:9 JPG, ideally 1280x720 or larger, up to 2560px wide. Aim for a source file under about 500 KB. Any reasonable source size works; the build avoids upscaling.
- Keep the main subject near the centre of the frame: feed cards crop the hero to 4:3 on phones and 16:9 on larger screens. The article page shows the full 16:9 image.
- The build automatically generates AVIF, WebP, and JPEG versions at 480, 800, and 1280px widths for cards and article pages. Widths above the source size collapse to the original width. Variants are cached on disk in `_site/img/` for fast rebuilds.
- The original `/images/articles/<slug>.jpg` remains published and is used for Open Graph, Twitter, and RSS. A missing image fails the build with an error naming the article or its source path.
- Use photographic editorial imagery with realistic physical detail and natural light. No identifiable real people, logos, or readable text. No purple tints. Only original or properly licensed images.
- Describe what is visible in `heroAlt`, in a concise sentence. Do not repeat the title or start with "image of". Do not infer identities, use promotional copy, or put image credits in alt text. Put credits and contextual captions in optional `heroCaption`.
- Keep meaningful subjects near the center. Mobile feed images are cropped to 4:3; desktop cards and article heroes use the landscape image.

To prepare a hero from an existing image:

```bash
node scripts/prepare-hero.mjs /path/to/input-image.png your-article-slug
```

The helper reads the source orientation, center-crops to exactly 1280x720, and writes a quality-82 progressive JPEG with mozjpeg at `src/images/articles/your-article-slug.jpg`. It overwrites that slug's hero. Smaller images are resized by this optional helper, so start with a sufficiently large source when possible. The build pipeline itself never upscales.

## Style rules

- Narrative, New York Times feature voice.
- No em dashes anywhere. Use periods, commas, colons, or parentheses. Avoid en dashes in prose too.
- No emoji, no hollow futurism.

## Publish

```bash
npm start            # optional local preview at http://localhost:8080
npm run deploy       # clean build + deploy to Firebase Hosting (site: singularity-review)
git add -A && git commit -m "Add article: <title>" && git push
```

What updates automatically on build: headline feed, featured archive and carousel, category pages and footer topics, "Read next" feed, RSS (`/rss.xml`), sitemap (`/sitemap.xml`), Open Graph and Twitter tags, and JSON-LD.
