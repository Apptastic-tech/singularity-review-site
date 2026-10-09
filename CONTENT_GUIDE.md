# Singularity Review: Content Guide

Publishing a new article means adding ONE markdown file plus its hero image, then building and deploying.

## Where things go

| What | Folder | Naming |
| --- | --- | --- |
| Article text | `src/articles/` | `YYYY-MM-DD-slug.md` (example: `2026-10-09-openai-agent-audit.md`) |
| Hero image | `src/images/articles/` | `slug.jpg` (same slug as the article, without the date) |
| Extra inline images (optional) | `src/images/articles/` | `slug-2.jpg`, `slug-3.jpg`, and so on |

The public URL is `/articles/<slug>/`. The date prefix in the filename is only for sorting files and is dropped from the URL.
Example: `src/articles/2026-10-09-openai-agent-audit.md` becomes `https://singularity-review.web.app/articles/openai-agent-audit/`.

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
tags: ["Tag one", "Tag two"]                 # optional. Shown as chips under the article
updated: 2026-10-10T09:00:00Z                # optional. Used in sitemap lastmod and JSON-LD
heroCaption: "Image credit or caption"       # optional. Shown under the hero image
draft: true                                  # optional. If true, the article is not built or listed
---
```

Body: plain markdown below the frontmatter. Do not repeat the title or dek in the body (the layout prints them). Start with the first paragraph of the story.

## Categories

Categories are created automatically from the `category` field. The menu and `/category/<slug>/` pages are generated for every category that has at least one article. Current categories: `Agents`, `Models`, `Policy`. Reuse the exact spelling to keep stories together. A new spelling creates a new menu item.

## Hero images

- 1280x720 (16:9) JPG, under about 300 KB. Larger images work but slow the page down.
- The hero is also the og:image and twitter:image used when the link is shared on Facebook or Instagram.
- Brand look: electric violet on a dark cosmic field. No text baked into the image.

## Style rules

- Narrative, New York Times feature voice.
- No em dashes anywhere. Use periods, commas, colons, or parentheses.
- No emoji, no hollow futurism.

## Publish

```bash
npm install          # first time only
npm start            # optional local preview at http://localhost:8080
npm run deploy       # clean build + deploy to Firebase Hosting (site: singularity-review)
git add -A && git commit -m "Add article: <title>" && git push
```

What updates automatically on build: homepage feed, category pages and menu, "More from" links, RSS (`/rss.xml`), sitemap (`/sitemap.xml`), Open Graph and Twitter tags, and JSON-LD.
