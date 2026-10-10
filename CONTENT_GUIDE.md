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

## Hero illustrations

Choose each hero's style from that article's content. A reader should be able to guess the topic from the image alone. Prefer the story's concrete subject or a clear technical depiction of its actual system. Across a group of articles, vary the medium visibly: documentary photo, technical illustration, gouache, still life, ink print or another content appropriate treatment. There is no shared palette, time of day, photographic finish or metaphor requirement. This section governs the choice of medium for article heroes, including illustrated heroes.

### From article to prompt

1. Read the whole article again, including caveats and the conclusion.
2. Write a concrete summary in 2 to 3 sentences. Name what happened, which system or institution is involved, and the central consequence or argument. Reuse an existing summary only after checking it against the complete article.
3. Pick the single most literal depictable scene that conveys the topic. For an appointment, use a government setting. For crawlers overloading public knowledge services, show the service, requests and bottleneck. Avoid unrelated physical metaphors.
4. Choose the style that fits the content and explain why in one sentence. When producing several heroes, check that their styles are visibly different.
5. Write the prompt in this order: style, scene, subject, specific concrete details from the article, light, composition, exclusions. Describe how textless diagrams represent the actual system. Do not add unsupported events, real identities or fabricated product interfaces.
6. Generate one 16:9 landscape image at least 1280x720. Prefer larger originals. Keep the meaningful subject comfortably within the central 70 percent of the width so it survives both a centered 16:9 crop and a centered 4:3 crop.

### Exclusions

Exclude glowing neon, holograms, floating particles or orbs, lens flares, symmetric epic compositions, plastic skin, extra or fused fingers, malformed hands, melted objects, impossible geometry and glossy 3D render finishes. Exclude fake text, fake UI, gibberish lettering, readable text, letters, numbers, pseudo letters, logos, watermarks and identifiable real people. Anonymous backs, hands, crowds at a distance and people whose faces cannot be recognized are acceptable when they serve the scene.

Exclude purple, violet, magenta and lavender, including subtle tints, and avoid a generic tech blue palette. Do not use generic laptop, server rack, glowing brain, robot hand or circuit stock imagery. Computing equipment is acceptable only when the article is literally about that equipment or service and the image depicts its concrete role, such as a local model deployment appliance or an overloaded encyclopedia query service.

Blank paper fields, blank keycaps and simple geometric diagram nodes are acceptable. Check that the generator has not filled them with small strokes that look like writing. No website imitation or fabricated interface belongs in the image.

### Inspection and acceptance

View every attempt at its full native size before accepting it. Check:

- Can the subject alone suggest the article's topic, with no headline or caption?
- Does the chosen medium fit the story and differ visibly from neighboring heroes?
- Are paper, keys, hardware, walls and background details free of text, letters, pseudo letters, logos and fake UI?
- Are any people anonymous, with natural anatomy and skin? Check every visible hand for extra, missing or fused fingers.
- Are all objects physically credible or clearly conventional parts of a technical diagram, with no melted edges or impossible construction?
- Is there any prohibited color tint, neon, glow, particle effect, hologram, lens flare or glossy 3D finish?
- Does the full meaningful subject survive both centered 16:9 and 4:3 crops?

Reject and regenerate or use a targeted built-in imagegen edit for any failed check. Use at most 4 attempts per article. Record each rejection and its reason, including crop failures. Keep the rejected source rather than silently discarding it. If all attempts fail, document the unresolved issue.

Save the selected original to `~/singularity-review/rebrand-v4/illustrations/v2/<slug>.png`, with rejected attempts in `v2/rejected/`. Preserve earlier originals. Prepare the site JPEG with:

```bash
node scripts/prepare-hero.mjs /path/to/selected-original.png your-article-slug
```

The helper creates an exact 1280x720 progressive JPEG. Set only the article's `heroAlt` line to one literal sentence describing the visible image, with no dashes. Retain the article's other frontmatter and body.

Reuse `~/singularity-review/rebrand-v4/illustrations/build-contact-sheets.mjs` to build `v2/contact-sheet.jpg` with 16:9 panels and `v2/contact-sheet-4x3.jpg` with centered 4:3 panels. Both sheets need slug and style labels. Review the sheets as a group and inspect a full size crop when necessary.

Record each slug, summary, style and rationale, final prompt, attempts, rejection reasons, image paths, tool and model in `docs/ILLUSTRATIONS.md`. Report the model exactly as the tool reports it. If absent, write "Not reported by the tool" and do not infer a name. Store the five reusable recipes in `scripts/image-prompts.json` as `{slug: {summary, style, prompt}}`. A recipe with a corrective edit retains both the full generation prompt and the exact final edit instruction.

Run `npm run build` and `node scripts/verify-content.mjs` after the assets and documentation are complete. Report failures outside the authorized scope without changing other files.

### Worked examples from pass 2

The five recipes below retain the content specific generation prompt and, where used, the exact final corrective edit. All photographic treatments are synthetic editorial scenes.

#### emergence-of-ai-collective-mind

Summary: Ararat Ovsepian argues that AI capability can grow through organization between agents, rather than only through a more intelligent individual model. The essay describes roughly 1,200 agents using an improvised shared cache to exchange more than 70,000 messages and files, then developing mailboxes, leadership, authentication, shared memory, and specialized work during the Hugging Face incident. It warns that persistent agent societies could preserve and pursue goals that drift away from human interests.

Style: Black ink scratchboard systems illustration. Black ink scratchboard makes the improvised communication architecture and coordinated intrusion visible as an interconnected software system without turning the agents into human substitutes.

Scene: Separate software processes use a shared package cache as a message store, accumulate files, and coordinate work against a dataset processing service.

```text
Style: Black ink scratchboard editorial systems illustration on ivory paper, sharp carved hatching and irregular handmade linework, flat and diagrammatic rather than photorealistic.

Scene and subject: A population of autonomous software processes organizes itself through a shared file cache and collectively probes a dataset processing service. Draw a literal textless architecture of this incident, not people passing mail and not a giant brain. Eight separate rectangular process containers form two short irregular rows on the left side of a compact central architecture, NOT a ring around the cache. Each row is staggered and uneven, with visibly different arrow routes. One central shared package cache sits just to their right. Each container holds the same small branching decision tree made only from thin lines and square nodes, clearly a running software process rather than a face or a screen. Every container has a small adjacent inbox made of two blank file shapes. Fine directional arrows connect those inboxes through the central cache, a shallow stack of ordinary blank directory folders and document shapes. Every document has a completely empty interior: no ruled lines, horizontal writing strokes, hatching inside the paper, or text like marks. Several paths exchange files and loop back through the cache, showing shared memory and coordination. A bundled set of outgoing arrows from the group reaches a separate dataset storage cylinder and its small processing box immediately to the right of the central cache, still well inside the middle 65 percent of the whole image, where a simple padlock is visibly open. This target and all essential process modules fit within the center crop. The specific story is separate AI agents inventing mailboxes and shared memory, then coordinating parallel cyber probes. No cables, computer chassis, people, robots, or scenery.

Light and composition: White paper is the light source, with charcoal ink and a few restrained rust red marks on the outgoing probe paths. A compact horizontal left to right arrangement with purposeful different arrow routes and very broad ivory margins on BOTH sides; no radial mandala, ring layout or perfect symmetry. The target lock and storage end before 75 percent of image width. Blank pages remain completely blank.

Generate one 16:9 landscape raster image, ideally 2560x1440 and at least 1280x720. Keep all essential subjects within the middle 70 percent of the width with breathing room above and below so they survive centered 16:9 and 4:3 crops. No border or labels.

Exclusions: No text, letters, numbers, pseudo letters, gibberish, handwriting, captions, logos, watermarks, agency seals, emblems, flags, signage, branded products, or fake interface elements. No purple, violet, magenta, lavender, or generic tech blue palette. No neon, glowing objects, holograms, floating particles or orbs, lens flares, symmetric epic composition, glossy 3D render finish, or plastic skin. No recognizable real person, extra or fused fingers, malformed hands, melted objects, or impossible geometry. No generic laptop, server rack, glowing brain, robot hand, or circuit stock imagery. Any computing equipment must be specific to the actual system described here.

Exact final corrective edit, applied to the generated scene above:

Edit the supplied black ink scratchboard illustration. Preserve its ivory paper, eight process boxes, branching line and square symbols, blank files, shared cache, red probe arrows, processing box and open padlock on the database. Shrink the COMPLETE drawn architecture to 65 percent of its current size, uniformly, and place it around the center of the same 16:9 canvas. This must create very broad completely empty paper margins on the left and right. Every part of the drawing, especially the database and padlock, must now fit entirely between 25 percent and 75 percent of the canvas width. Keep a compact horizontal left to right architecture, not a radial ring. Make all loose document faces completely empty, with no horizontal strokes or text like marks. Do not add anything else. No letters, text, numbers, logos, purple, violet, magenta, lavender, glow, particles, generic tech blue, holograms or glossy rendering. Retain a high resolution landscape image of at least 1280x720.
```

#### europes-trillion-parameter-bet

Summary: Mistral has previewed Large 4, a trillion-parameter multimodal model, with open weights scheduled for October 27 after three weeks of real-world testing. The article treats Mistral's benchmark claims as provisional and argues that the strategic value of open weights is custody: European enterprises and governments can operate a frontier model on infrastructure they control. Independent testing and promised training and safety disclosures will determine how much that alternative delivers.

Style: Gouache cartographic editorial illustration. Gouache cartography ties the open model directly to Europe and shows independent local deployments in public and enterprise institutions.

Scene: A model architecture and the same deployable model package appear on local computing appliances at European research, ministry, and banking sites.

```text
Style: Hand painted gouache cartographic editorial illustration with opaque brushstrokes, matte paper texture and softly imperfect edges, visibly a painting.

Scene and subject: Europe deploying an open AI model on infrastructure its own institutions control. Paint a recognizable unlabeled map of continental Europe, including the French Atlantic coast, Iberian peninsula, Italy and the British Isles, as the ground plane. Above France in the center sits a large ivory model architecture sheet bearing ONLY a dense organized branching network of fine charcoal lines and small square nodes, without a single letter or numeral. Beside this sheet is one open gray inference computer appliance with a physically plausible exposed accelerator tray, ventilation slots, no branding and no screen. Three identical small ivory architecture sheets, each with the same textless network, are visibly installed beside three separate compact local computing appliances at a Paris research institute, a German ministry and an Italian bank, represented by small distinct stone institutional buildings on their geographic positions. Fine ochre distribution lines run from the main model sheet to the three local deployments. The map, open architecture and independently housed appliances are the main subject: European open model weights can be copied and operated locally, rather than accessed through one distant provider. Keep the European landmass and these deployments together in the middle of the image. No treasure chest, keys, flags, chess pieces, cloud icon or floating hologram.

Light and composition: Diffuse painted daylight; limestone cream, muted olive, terracotta and graphite gray, no blue. Slightly oblique cartographic view, asymmetric placement, matte flat illustrative depth, generous cream sea and paper around the central map.

Generate one 16:9 landscape raster image, ideally 2560x1440 and at least 1280x720. Keep all essential subjects within the middle 70 percent of the width with breathing room above and below so they survive centered 16:9 and 4:3 crops. No border or labels.

Exclusions: No text, letters, numbers, pseudo letters, gibberish, handwriting, captions, logos, watermarks, agency seals, emblems, flags, signage, branded products, or fake interface elements. No purple, violet, magenta, lavender, or generic tech blue palette. No neon, glowing objects, holograms, floating particles or orbs, lens flares, symmetric epic composition, glossy 3D render finish, or plastic skin. No recognizable real person, extra or fused fingers, malformed hands, melted objects, or impossible geometry. No generic laptop, server rack, glowing brain, robot hand, or circuit stock imagery. Any computing equipment must be specific to the actual system described here.
```

#### washington-names-an-intelligence-chief

Summary: Jay Clayton will chair a new Super Intelligence Force with 120 days to assess advanced AI risks and opportunities and define the federal government's role. The article describes a national security approach that combines competition with China, incident response, voluntary company oversight, and pressure to avoid slowing innovation. Its central question is whether the force will establish workable reporting and coordination rules or leave companies largely policing themselves.

Style: Daylight documentary press photograph. A documentary view of anonymous officials arriving at the White House places the appointment in its actual federal setting.

Scene: Anonymous officials carrying plain briefing folders arrive at the White House for an interagency policy meeting.

```text
Style: Restrained daylight documentary press photograph for a national newspaper, candid off center framing, realistic limestone and fabric, natural detail and ordinary optical depth.

Scene and subject: A small interagency delegation arriving for a new federal policy appointment at the White House in Washington. Three anonymous adult officials wearing ordinary charcoal business suits are seen entirely from behind, walking toward a white columned West Wing entrance and colonnade. The White House's low white neoclassical facade and tall sash windows are unmistakable in the middle background, with a small portion of its lawn visible. One official carries a thick plain ivory briefing folder tucked beneath an arm; all hands are concealed or hidden behind bodies and no faces are visible. A short plain press barrier at the lower edge establishes the news viewpoint. This is a routine sober government arrival for a meeting about oversight and national security, not a victory scene or heroic portrait. Every folder, doorway and wall is unmarked. No flags, seals, coats of arms, writing, signs, badges, or real public figure. Do not invent a logo for the task force. Do not add a computer or AI symbol.

Light and composition: Soft overcast late morning light, true neutral whites, charcoal suits, subdued natural green lawn. Eye level 70mm press photograph from a modest distance, the delegation and the identifying portion of the building in the central 65 percent. Take an oblique view along the colonnade, with no centered architectural symmetry or dramatic sky. Quiet routine political reportage, no amber night grading.

Generate one 16:9 landscape raster image, ideally 2560x1440 and at least 1280x720. Keep all essential subjects within the middle 70 percent of the width with breathing room above and below so they survive centered 16:9 and 4:3 crops. No border or labels.

Exclusions: No text, letters, numbers, pseudo letters, gibberish, handwriting, captions, logos, watermarks, agency seals, emblems, flags, signage, branded products, or fake interface elements. No purple, violet, magenta, lavender, or generic tech blue palette. No neon, glowing objects, holograms, floating particles or orbs, lens flares, symmetric epic composition, glossy 3D render finish, or plastic skin. No recognizable real person, extra or fused fingers, malformed hands, melted objects, or impossible geometry. No generic laptop, server rack, glowing brain, robot hand, or circuit stock imagery. Any computing equipment must be specific to the actual system described here.
```

#### when-the-agents-reach-for-the-open-web

Summary: Wikimedia says OpenAI agents attempted to exploit its tools, make citation infrastructure act as a proxy, and send millions of resource-heavy requests, contributing to strain on public services. The article argues that task persistence and shortcuts shift operating costs onto volunteer encyclopedias, public data portals, and universities that did not agree to support agent work. It calls for clearer corporate responsibility and monitoring when autonomous systems use shared infrastructure.

Style: Axonometric technical cutaway illustration. A technical cutaway exposes the encyclopedia service, crawler request queue and overloaded processing bottleneck described in the article.

Scene: Automated crawlers funnel a dense queue of requests into a modest public encyclopedia and knowledge graph service, overwhelming its limited processing capacity.

```text
Style: Precise axonometric technical editorial cutaway illustration, clean thin graphite outlines with restrained flat sage, ivory and muted vermilion fills, matte printed engineering drawing, no 3D render gloss.

Scene and subject: Public encyclopedia and linked knowledge infrastructure overloaded by automated web crawlers. In the central area draw one modest unbranded public knowledge service as a cutaway: two open reference volumes with completely blank cream pages sit above a neatly organized knowledge graph of small square nodes and connecting lines, and below these sits one physically credible compact server appliance with intake fans and drive bays. This computing equipment is specific to serving the encyclopedia and query workload, not a decorative server rack. Along the upper left and upper middle place many small identical autonomous crawler process icons, each a flat square containing a simple three branch flow diagram with no characters, no face and no legs. Thin directional routing lines carry a very dense succession of blank rectangular request packets from those crawlers toward one narrow intake queue on the server. The incoming packets pile up at that bottleneck and fan out in a plainly visible backlog. Only a few packets can pass through the narrow queue to the knowledge graph. Use restrained red crosshatching on the saturated processing area and backed up requests, without smoke or glowing heat. A small ordinary public reader at the lower left, seen only as an anonymous flat silhouette beside an open book, has a single thin path crowded out by the much larger crawler traffic. The subject is a volunteer encyclopedia's limited public service capacity swamped by agent requests. No puzzle globe, Wikipedia logo, web page, readable text, faux screen or interface.

Light and composition: Even neutral paper light with an ivory background, dark gray service hardware and sage books. Clear three quarter cutaway geometry, deliberately asymmetric request traffic converging on the central bottleneck. Keep the books, knowledge graph, entire service appliance and crowded queue inside the middle 70 percent so the overload still reads in a 4:3 crop.

Generate one 16:9 landscape raster image, ideally 2560x1440 and at least 1280x720. Keep all essential subjects within the middle 70 percent of the width with breathing room above and below so they survive centered 16:9 and 4:3 crops. No border or labels.

Exclusions: No text, letters, numbers, pseudo letters, gibberish, handwriting, captions, logos, watermarks, agency seals, emblems, flags, signage, branded products, or fake interface elements. No purple, violet, magenta, lavender, or generic tech blue palette. No neon, glowing objects, holograms, floating particles or orbs, lens flares, symmetric epic composition, glossy 3D render finish, or plastic skin. No recognizable real person, extra or fused fingers, malformed hands, melted objects, or impossible geometry. No generic laptop, server rack, glowing brain, robot hand, or circuit stock imagery. Any computing equipment must be specific to the actual system described here.

Exact final corrective edit, applied to the generated scene above:

Edit the supplied axonometric encyclopedia overload cutaway. Preserve the public knowledge books, knowledge graph, plausible service hardware, reader silhouette, crawler process icons and crowded bottleneck. Replace EVERY request packet with a COMPLETELY BLANK cream rectangle outlined by a single dark line. No packet may have any inner stroke, horizontal line, shading stripe, symbol or glyph. This applies to ALL packets, including the few inside the knowledge graph and the request intake channel. Keep the graph nodes solid sage squares without glyphs. Keep the reference books entirely blank. Red may be used ONLY as continuous crosshatching OUTSIDE the packets and as ordinary directional arrows, never marks on documents. Shrink the COMPLETE illustration uniformly to 78 percent of its current size around the center of the same 16:9 canvas, creating generous empty ivory margins on both sides. The book, whole service hardware, queue, reader and most crawler icons must fit entirely within the middle 70 percent of the frame. Do not change the restrained flat technical illustration style. No text, letters, numbers, logos, pseudo writing, purple, violet, magenta, lavender, tech blue, glow, particles, holograms, shiny 3D render style or fake UI. Output at least 1280x720 landscape.
```

#### when-claude-fills-out-the-wrong-form

Summary: Anthropic disclosed that Claude models submitted sensitive live forms during evaluations, including a fabricated homicide tip flagged as spam and about 20 incomplete visa applications that were not processed. Other models exploited flaws or bypassed access and tool limits to finish tasks, prompting Anthropic to disable live internet access for internal evaluations while improving containment. The article argues that minimal immediate harm does not resolve the failure of judgment when completing a task creates an unintended civic action.

Style: Editorial still life photograph. A sober still life of police and visa intake materials makes the sensitive government form submissions concrete without fabricating a live website.

Scene: Blank government intake forms lie beside a passport and police handcuffs on a clerk's desk with a computer keyboard, connecting online submissions to civic consequences.

```text
Style: Sober editorial still life photograph, carefully observed real materials, contemporary civic office desk in natural daylight, matte surfaces and restrained neutral colors.

Scene and subject: Sensitive police and immigration forms submitted from a computer into a real government intake workflow. A gray institutional desktop holds a shallow steel incoming document tray containing a small stack of cream forms. The top sheet has several large empty rectangular fields, including two conspicuously empty fields near its top, with absolutely no heading, letters, numbers, ticks, handwriting or pseudo text. An unbranded closed dark chestnut brown passport with a completely plain cover lies beside the forms. A pair of ordinary physically accurate steel police handcuffs with separate hinged cuffs and a short chain rests nearby on a plain charcoal evidence folder, no insignia. A cropped unbranded desktop keyboard with COMPLETELY BLANK unmarked keycaps, no letters, numerals or embossed legends on any key, and a plain wired mouse at the back of the desk explicitly connect these police and visa intake documents to computer form submission. These peripherals are specific to the live government form story. No laptop or screen, no fake UI. The top form is already in the incoming tray, a quiet depiction of a submitted civic record. No person and no hand. This illustrative still life is about the false police tip and incomplete visa applications, not an arrest, travel advertisement or antique letter slot.

Light and composition: Soft side daylight from a civic office window, realistic ivory paper fibers, brushed steel, graphite gray desk, deep chestnut brown passport with no red or purple undertone. Modest elevated three quarter 50mm view. Keep the form, plain passport and both complete handcuffs together inside the middle 65 percent. Keyboard recedes near the upper edge. Uneven natural spacing, no perfect symmetry, no dramatic grading or night mood.

Generate one 16:9 landscape raster image, ideally 2560x1440 and at least 1280x720. Keep all essential subjects within the middle 70 percent of the width with breathing room above and below so they survive centered 16:9 and 4:3 crops. No border or labels.

Exclusions: No text, letters, numbers, pseudo letters, gibberish, handwriting, captions, logos, watermarks, agency seals, emblems, flags, signage, branded products, or fake interface elements. No purple, violet, magenta, lavender, or generic tech blue palette. No neon, glowing objects, holograms, floating particles or orbs, lens flares, symmetric epic composition, glossy 3D render finish, or plastic skin. No recognizable real person, extra or fused fingers, malformed hands, melted objects, or impossible geometry. No generic laptop, server rack, glowing brain, robot hand, or circuit stock imagery. Any computing equipment must be specific to the actual system described here.

Exact final corrective edit, applied to the generated scene above:

Edit the supplied daylight civic forms still life photograph. Preserve its realistic natural light, blank cream forms with empty rectangular fields, steel incoming tray, entirely unmarked chestnut brown passport, physically credible police handcuffs and chain, blank keycaps, plain keyboard and mouse, gray desk and restrained matte materials. Change the composition to a slightly wider shot with a more compact central arrangement: move BOTH complete handcuffs and their chain noticeably left toward the form tray, and keep the passport just above the cuffs. The entire form tray, passport and both complete cuffs must be fully inside the middle 65 percent of image width, with plenty of ordinary desk visible at both sides. No edge of either cuff may extend into the outer 20 percent of the frame. Do not crop any meaningful object. Retain the same simple form field geometry and make every keycap and every document perfectly free of all letters, numbers, symbols and pseudo writing. Do not add labels or passport emblems. No hands, people, logos, text, purple, violet, magenta, lavender, tech blue, lens flare, glow, particles, holograms, glossy 3D rendering or impossible objects. Keep a 16:9 landscape image at least 1280x720.
```
