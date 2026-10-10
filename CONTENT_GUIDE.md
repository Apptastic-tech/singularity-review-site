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

Style: Black ink scratchboard systems illustration. Dense engraved process units make the population scale and its self organized work lanes through one shared cache visible across the entire hero and its card crop.

Scene: Hundreds of small agent process units tile the full frame and organize into work lanes through one central shared file cache.

```text
Style: Black ink scratchboard and engraved editorial systems illustration on warm ivory paper. Crisp carved linework and fine irregular hatching, visibly hand printed, with a single restrained rust red accent on shared communication paths.

Scene and subject: Roughly 1,200 autonomous AI software agents discover each other through one improvised shared file cache, then invent mailboxes, work lanes and specialized clusters. Depict a very large population, with hundreds of individually drawn small rectangular process units tiling and receding across the ENTIRE frame, continuing beyond every image edge. Each process unit contains only a simple branching decision diagram of fine connected lines and solid square nodes, never a face, letter or interface. The dense population is the main subject. Make its scale unmistakable at thumbnail size. A single large shared cache sits near the center, represented by a coherent open directory store holding tightly stacked folders and completely blank file cards. It is the only common store in the image. Clearly visible routed communication lines gather from all parts of the population into this cache and branch back out. Agents spontaneously group into several unequal, interlocking work lanes and irregular clusters around that store. Nearby units have tiny blank inbox slots. The organization emerges out of a field of individual processes. Show two way information exchange through the common cache, with a few restrained rust red continuous routing lines as the sole color accent. Blank file surfaces have no internal writing strokes.

Light and composition: Ivory paper light, dense black ink marks, high contrast, no glow. Close overhead oblique view of a sprawling software architecture. Fill the landscape edge to edge with agents, routing and clusters, including foreground, corners and distant upper edge. At least three quarters of the frame must contain meaningful drawn structure. No broad empty margins, no small diagram isolated in cream, no eight box schematic, no decorative radial mandala or perfect symmetry. The central cache and several substantial agent lanes remain completely visible within the center 70 percent. A 4:3 center crop must still read as hundreds of agents coordinating through one shared memory, while outer population continues beyond the crop.

Generate one high resolution 16:9 landscape raster image, ideally 2560x1440 and at least 1280x720. No border or labels.

Exclusions: No text, readable text, letters, numbers, pseudo letters, gibberish, handwriting, captions, logos, watermarks, agency seals, emblems, flags, signage or fake interface elements. No purple, violet, magenta, lavender or generic tech blue. No neon, glowing objects, holograms, floating particles or orbs, lens flares, symmetric epic composition or glossy 3D finish. No people, human hands, robot hands, brains, laptops, decorative server racks or circuit stock imagery. No melted objects, malformed construction or impossible diagram connections. Pure geometric diagram lines and square nodes are acceptable; no marks resembling writing.
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

Style: Daylight editorial photograph. An unattended keyboard with visibly depressed keys, passport identity and visa pages, and delivered photo box forms makes autonomous sensitive submissions guessable without fabricating a website.

Scene: Depressed keys on an unattended keyboard sit below passports and visa style forms delivered to an outgoing tray, with subtle police handcuffs behind it.

```text
Style: Literal sober editorial photograph for a newspaper, contemporary government paperwork desk in soft natural daylight. Realistic matte materials, observed physical detail, neutral ivory, graphite, steel and deep olive. This is a synthetic editorial scene, not a photograph of an actual incident.

Scene and subject: An unattended AI agent is completing and submitting sensitive police and visa forms on its own. No human is present. In the central close foreground is an unbranded mechanical keyboard with entirely blank keycaps. The exact visual focus is unattended typing: two adjacent central square keys are FULLY DEPRESSED down to the black keyboard deck, with their top faces visibly much lower than the tall unpressed keys immediately surrounding them. Their dark rectangular wells and neighboring raised keycap sides clearly show the difference in height. One nearby key is half depressed. All other keys are raised normally. This height difference must be unmistakable, not subtle. No missing keycaps. NO hands, fingers, tools or physical typists anywhere. Photograph from a low three quarter angle so both the normal key height and the depressed key height are plainly visible. Beside and behind this keyboard, a modest unbranded office printer has just delivered a loose stack of application sheets, which spill naturally into a shallow brushed steel outgoing document tray. Sheets carry only empty outlined form boxes, including conspicuous rectangular passport photo boxes near their tops and several rows of empty fields. No headings, rules resembling writing, checked boxes, characters or marks inside any field. The completed submission is suggested by the delivered stack in the outgoing tray, not by stamps or text.

Two unmistakably passport sized travel documents sit TOGETHER directly above the central depressed keys, overlapping the near edge of the visa form tray, both COMPLETELY between 30 and 68 percent of the image width. One deep olive passport is open, showing a thin flexible stitched booklet, rounded corners, an identity page with a rectangular portrait area containing only a plain anonymous head silhouette, subtle geometric security rosettes, and a facing visa page with a large blank rectangular visa panel. The other has a plain flexible deep olive cover with a thin cream page block, no cover emblem or lettering. These must look like small contemporary passports, not thick brown notebooks or diaries. A small physically correct pair of linked steel police handcuffs rests discreetly behind the center of the tray, both COMPLETE cuff loops and their short chain entirely between 45 and 65 percent of the image width, secondary to the unattended keyboard and visa paperwork. Keep both cuff loops and their short chain coherent. Every object rests on the desk or the tray, with credible scale, perspective and contact shadows. The only action is unattended typing and newly delivered paperwork. No laptop, monitor, screen, UI, human, robot, magic beams or floating papers.

Light and composition: Soft window daylight and ordinary office shadows. Tight low three quarter 50mm view. Compose a single compact overlapping central group: keyboard in front, both passports in the center immediately behind the depressed keys, form stack and tray behind those, and small handcuffs farther back near the center. Do not spread the passports or cuffs to the right edge. All distinctive subjects are fully inside the middle 65 percent. The keyboard can extend laterally into both margins, and the printer can extend upward, but the passports and police detail cannot be cut by a centered 4:3 crop. The keyboard fills the lower foreground and the form stack fills the middle. Desk detail can extend to the edges. A centered 4:3 crop preserves the unattended typing, passports and delivered forms. Natural uneven spacing, no dramatic grading, no glow.

Generate one high resolution 16:9 landscape raster image, ideally 2560x1440 and at least 1280x720. No border or labels.

Exclusions: No readable text, letters, numbers, pseudo letters, gibberish, handwriting, captions, logos, watermarks, agency emblems, flags, badges or passport symbols. All keycaps and form interiors are perfectly blank. No fabricated screen UI. No purple, violet, magenta, lavender or generic tech blue, including subtle tints. No neon, glow, holograms, floating particles, orbs, lens flares, plastic textures or glossy 3D rendering. No people, hands, extra fingers, robot hands, brains or circuit stock imagery. No melted paper, malformed handcuffs, fused objects or impossible geometry.

Exact first corrective edit, applied to the generated scene above:

Edit this supplied synthetic daylight government paperwork photograph. Retain its exact compact central arrangement, natural materials, daylight, unmarked keyboard, two visibly depressed central keycaps, open passport, plain closed passport, application form stack in the steel outgoing tray, office printer and small physically accurate handcuffs with their short chain.

Remove ALL COLOR from the OPEN PASSPORT PAGES. Both passport page surfaces must be plain warm ivory, with security rosettes drawn only in very fine pale graphite gray. Absolutely no blue, cyan, purple, pink, violet, magenta, lavender or colored security ink, even in subtle tints. Preserve the anonymous gray silhouette in its rectangular portrait area and the large empty visa panel on the opposite page. The flexible covers remain deep olive with no letters, numbers or emblems. Do not turn the travel documents into notebooks.

Replace every visible APPLICATION SHEET with an entirely plain ivory sheet carrying ONLY a small number of single outline rectangular fields and one single outline empty photo box. Every box interior is completely empty. Remove all faint inner rules, double lines, writing like horizontal strokes, headings, characters, symbols and ticks. Apply this to the sheets in the printer as well as the main tray and edge stacks. No stamps or pretend text.

Keep the two central white keycaps visibly LOWER than the neighboring white keycaps, caught at the bottom of their normal travel, with the depression clear from the dark wells and tall adjacent keycap sides. Every key remains present and physically coherent with straight rows, no fused or missing keys. Preserve the unattended scene with no hands or people. Remove the stray peripheral notebook and pen at the far left edge, leaving ordinary desk there. Keep the central closed passport and open passport.

Keep all important objects fully inside the central 65 percent so a centered 4:3 crop retains depressed keys, passports, photo box forms and both complete handcuffs. Retain the tight three quarter photographic viewpoint. No text, pseudo letters, logos, fake screen UI, purple, lavender, violet, magenta, pink, tech blue, glow, neon, holograms, floating particles, glossy rendering, melted objects or malformed geometry. Output one high resolution 16:9 landscape raster image at least 1280x720.

Exact final corrective edit, applied to the result of the first edit:

Edit this supplied synthetic editorial government paperwork photograph. Make ONE localized repair to the keyboard and preserve everything else.

In the central foreground, immediately BELOW the two visibly depressed cream square keycaps, there is an unintended large BLACK EMPTY RECTANGULAR GAP where a keycap is missing. Fill that exact empty black gap with an intact ordinary raised CREAM KEYCAP, matching the shape, width, matte material and perspective of the neighboring keycaps in the SAME ROW. It must be a real keycap with a visible top and sides, aligned to the straight keyboard grid. No black keycap, empty hole, missing key, broken key or melted geometry may remain. Preserve the TWO LOWERED CREAM KEYS in the row directly ABOVE the repair, still clearly depressed relative to their neighboring raised keys. The contrast in key heights must remain obvious, with every key physically present.

Preserve the entire rest of the image exactly: compact central grouping, ivory forms with only single outline empty rectangles and photo boxes, open passport with gray silhouette portrait and blank visa panel, ivory passport pages with graphite geometric security patterns, plain deep olive closed passport, steel outgoing tray, office printer, small complete police handcuffs and chain, warm natural daylight and ordinary desk. Keep the unattended scene with absolutely no human or hands. Keep every important object inside the centered 4:3 crop.

Do not add text, letters, numbers, pseudo letters, gibberish, symbols, passport emblems, logos or fake screen UI. No blue, purple, violet, magenta, lavender, pink tint, glow, neon, particles, holograms, glossy rendering, fused or malformed objects. Output one high resolution 16:9 landscape raster image at least 1280x720.
```
