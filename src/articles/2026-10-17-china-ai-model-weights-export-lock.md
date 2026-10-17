---
title: "China just put its biggest AI models under export lock. APIs stay open."
description: "Beijing's draft export catalogue would restrict the weights, code and training methods of models above 10^26 FLOPs, 2 trillion parameters or a global top 10 rank, plus large agent systems. Selling access by API, app or SaaS stays allowed."
date: 2026-10-17T14:10:00Z
category: Policy
hero: /images/articles/china-ai-model-weights-export-lock.jpg
heroAlt: "A huge red steel vault door closing in a dark concrete hall, with shelves of hard drives wrapped in chains, padlocks and red wax seals behind it."
heroCaption: "Illustration. The model files stay in the vault."
author: Singularity Review
tags: [China, Export controls, AI policy, Model weights, AI agents, Open source, Geopolitics]
seoDescription: "China's October 16 draft adds 23 AI technologies to its export ban and restriction catalogue: frontier model weights above 10^26 FLOPs, 2 trillion parameters or top 10 rank, large agent systems and big compute clusters. API, app and SaaS access are exempt. Comments close November 15."
takeaways:
  - "Strong claim: China's commerce and science ministries proposed adding 40 technologies to the export catalogue on October 16, 23 of them in AI. Exporters must already register covered deals."
  - "Strong claim: core technology of a large model (weights, checkpoints, source code, architecture, training and inference methods) is restricted if it hits 10^26 training FLOPs, 2 trillion parameters, or a global top 10 ranking."
  - "Open question: whether the thresholds and the API and SaaS carve out survive the comment period, which closes November 15."
sources:
  - title: "MOFCOM and MOST Announcement 2026 No. 48 (draft revision of the Catalogue of Technologies Prohibited or Restricted from Export)"
    publisher: Ministry of Commerce of the PRC
    url: https://www.mofcom.gov.cn/zcfb/blgg/gg/2026/art/2026/art_05e2643a8ca04eb9adf9dd0542991fe4.html
    date: "2026-10-16"
  - title: "China's draft export list controls model files and chip blueprints, not APIs"
    publisher: CTOL Digital Solutions
    url: https://www.ctol.digital/news/china-draft-technology-export-catalogue-ai-model-weights-chip-design/
    date: "2026-10-16"
  - title: "China proposes export controls on 23 AI technologies"
    publisher: AICoder
    url: https://aicoder.com/news/news-20261017-china-ai-export-control-draft-2t-params-agents-open-source-exempt
    date: "2026-10-17"
  - title: "China moves to curb tech exports including for AI and solar"
    publisher: AP News
    url: https://apnews.com/article/china-export-restrictions-ai-chips-solar-us-5ac381c0c6d6628bbea2e0da7d855a5b
    date: "2026-10-16"
updated: "2026-10-17T14:10:00Z"
section: news
---

For three years the export control story in AI has been about Washington keeping chips away from Beijing. On Friday, October 16, Beijing wrote its own list, and it aims at something more valuable than chips: the models themselves.

China's Ministry of Commerce and Ministry of Science and Technology published Announcement No. 48, a draft revision of the country's Catalogue of Technologies Prohibited or Restricted from Export. It adds 40 technologies across three fields: 23 in artificial intelligence, 5 in biomedicine and 12 in solar. According to the ministry's spokesperson, 14 of the 40 would be banned outright and 26 would need a licence. Registration for covered deals started the same day.

## The three lines that lock a model

The draft annex defines core large model technology as the weights, key checkpoints, source code, architecture, and training or inference methods. That package is restricted if the model meets any one of three conditions:

- training compute of 10^26 floating point operations or more,
- 2 trillion parameters or more, or
- a place in the global top 10 on mainstream public evaluations at the time of export.

The third line is the interesting one. Compute and size are fixed numbers that the frontier will race past. A top 10 rank moves with the frontier, so whatever China's best models are next year, they would be covered.

Models trained on data China classes as "core" are on the prohibited list. Models trained on "important data" are restricted, with a narrow exception for trace use that cannot lift the model's capability.

## Agents, clusters and chip designs too

The AI list goes beyond models. Agent systems are restricted above concrete thresholds, including breaking an instruction into 20 or more sub-tasks with at least 90% average success, running 60 or more agents together, or plugging into 200 or more third-party tools. AI-driven malware generation and mutation is on the prohibited list. AI-assisted vulnerability discovery above a benchmark bar is restricted.

Hardware know-how is covered as designs, not finished products. AI processor design is caught at 14 nanometres or finer among other conditions, and cluster technology is restricted at interconnects of 800 gigabytes a second, with a large cluster defined as more than 10,000 accelerator cards.

## The door that stays open

The carve outs matter as much as the controls. The ministry says offering a restricted model abroad through an API, an app or web interface, a SaaS product, or a lightweight on-device deployment is not a technology export. Technology already released as open source or published in papers is out of scope. Five activities, including open sourcing and running a company's own compute centres abroad, are slated for automatic licensing.

In plain terms: Chinese labs can keep selling their models to the world. What a foreign buyer cannot easily do is take the files home. Deploying a restricted model on a customer's own servers overseas counts as an export and needs registration.

## Why it matters

This is a mirror of the American playbook with a twist. Washington restricts the hardware that trains models. Beijing is restricting the trained result while keeping the sales channel open. Reuters, as cited by CTOL, reads the API carve out as a way for developers such as DeepSeek and Alibaba to keep expanding abroad while Beijing gains oversight. The ministry calls the change routine trade management that targets no country.

It also sets a precedent the rest of the world will study. If the top 10 rank rule survives, "frontier" becomes a legal category in China, defined by leaderboards.

## What happens next

Public comments close on November 15, 2026. Until the catalogue is finalised, exporters must register covered technology deals before they happen, including deals already underway. The big unknown is whether the 10^26 FLOPs and 2 trillion parameter lines, and the API exemption, make it into the final text.
