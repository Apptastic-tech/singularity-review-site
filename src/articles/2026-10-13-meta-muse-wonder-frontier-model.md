---
title: Meta says Muse Wonder finally puts it among frontier AI labs
description: On Oct. 12 Meta released Muse Wonder and Muse Wonder Full, its first models it calls frontier-class. Independent scores put Wonder Full near the top tier, still short of Anthropic's best, as the company prices the API model like Opus 5.5.
date: 2026-10-13T13:05:00Z
category: Models
hero: /images/articles/meta-muse-wonder-frontier-model.jpg
heroAlt: "A climber in dark gear plants an orange flag on a snowy summit under storm clouds, with orange flags already flying on the neighbouring peaks"
tags: [Meta, Muse Wonder, Muse Wonder Full, Alexandr Wang, Artificial Analysis, Frontier models]
heroCaption: Editorial photograph. No real logos depicted.
author: Singularity Review
seoDescription: "Meta's Muse Wonder and Muse Wonder Full are its first frontier AI models, scoring near the top tier on independent tests and priced like Claude Opus 5.5."
takeaways:
  - "On Oct. 12 Meta released Muse Wonder and Muse Wonder Full, the first models it calls frontier-class."
  - "Artificial Analysis scored Wonder Full at 56 and Wonder at 52 on its Intelligence Index, up from 48 for Muse Spark 1.3, but still short of Anthropic's best."
  - "Wonder costs $4 per million input tokens and $20 per million output tokens on the API, matching Claude Opus 5.5."
  - "Meta is pitching personal agents with Active Memory and Active Focus rather than coding, and plans cheaper distillations for its free users."
sources:
  - title: "Muse Wonder"
    publisher: "Meta"
    url: https://research.meta.ai/blog/muse-wonder
    date: "2026-10-12"
  - title: "Meta says new Muse model reaches AI frontier after aggressive push"
    publisher: "The Business Times"
    url: https://www.businesstimes.com.sg/companies-markets/meta-says-new-muse-model-reaches-ai-frontier-after-aggressive-push
    date: "2026-10-13"
  - title: "Muse Wonder"
    publisher: "Artificial Analysis"
    url: https://artificialanalysis.ai/articles/muse-wonder
    date: "2026-10-12"
  - title: "Meta releases its first frontier model, Muse Wonder"
    publisher: "TechCrunch"
    url: https://techcrunch.com/2026/10/12/meta-releases-its-first-frontier-model-muse-wonder/
    date: "2026-10-12"
  - title: "Muse Wonder Model Card"
    publisher: "Meta"
    url: https://research.meta.ai/static/muse-wonder-model-card
    date: "2026-10-12"
updated: "2026-10-13T13:05:00Z"
section: news
---

Fourteen months after Mark Zuckerberg tore up Meta's AI organisation and bet tens of billions on catching OpenAI and Anthropic, the company says it has arrived. On Oct. 12 Meta released [Muse Wonder and Muse Wonder Full](https://research.meta.ai/blog/muse-wonder), a pair of models it describes as its first frontier systems. In a research blog post and a companion model card, Meta cast the launch as the payoff from rebuilding its stack from first principles, training at its Prometheus data centre in Ohio, and hiring Scale AI founder Alexandr Wang to run the new Superintelligence Labs unit.

The claim matters because Meta spent 2025 apologising for Llama releases that Silicon Valley treated as mid-pack. Muse Spark, the lighter precursor, was useful and fast. It was not what researchers meant by frontier. Wonder is the first Meta model since that overhaul that the company is willing to put beside Claude and GPT in public marketing. Wang told [The Business Times](https://www.businesstimes.com.sg/companies-markets/meta-says-new-muse-model-reaches-ai-frontier-after-aggressive-push) the models are "true frontier models" and "competitive with the best models out there," especially on personal and professional agent work. Meta's shares rose as much as 4.7 percent on the news.

Independent numbers give the claim partial cover. [Artificial Analysis](https://artificialanalysis.ai/articles/muse-wonder) scored Muse Wonder Full at 56 and Muse Wonder at 52 on its Intelligence Index v4.3 at maximum reasoning effort. Muse Spark 1.3 sat at 48 six weeks earlier. Wonder Full placed in the top three on six of the ten index evaluations, with its biggest jump on Terminal-Bench 4.0 (33 percent to 57 percent). That is a real climb. It is not an undisputed lead. Reporting that cites the same index puts Anthropic's Claude Opus 5.5 a couple of points higher. Meta's own model card compares Wonder and Wonder Full with GPT-6 Astra and Claude Fable 5.1 under shared settings and reports parity on several agent and coding suites. Outside labs will keep arguing about harnesses. The direction of travel is clearer than the ranking fight: Meta is no longer shipping a clearly second-tier flagship.

What Meta wants to sell is not a chat window. It is a personal agent that lives across messages, calendars and documents. The research post leans on two branded behaviours. Active Memory is meant to carry what matters about a user across days and weeks and retrieve it when a later task needs it. Active Focus is meant to keep working when a job gets hard: try another approach, recover from errors, ask for clarification, check in before irreversible steps. Both models take text, image, video and audio as input, emit text, and expose a one-million-token context window. Muse Wonder is available today through the Meta Model API and Muse Code. Muse Wonder Full is limited to Muse Code subscribers and is not sold by the token. Wonder will soon power the Muse consumer agent, starting with paid users, [TechCrunch reported](https://techcrunch.com/2026/10/12/meta-releases-its-first-frontier-model-muse-wonder/).

Pricing puts Meta in the expensive lane. Wonder costs $4 per million input tokens and $20 per million output tokens on the API, matching Opus 5.5 and far above Spark's earlier rates. Artificial Analysis estimates about $4.52 per Intelligence Index task for Wonder at max effort, nearly three times Spark 1.3's $1.60, driven by higher prices and heavier input use. Knowledge remains a soft spot: on AA-Omniscience, Wonder Full scores 30 and Wonder 25, well behind Opus 5.5 and GPT-6 Astra. Meta offsets that with low hallucination rates. Wonder Full's hallucination rate fell to 23 percent on that suite, among the best of models scoring 45 or higher on the index.

Safety language tracks Meta's Superintelligence Scaling Framework. The [model card](https://research.meta.ai/static/muse-wonder-model-card) says unmitigated chemical and biological risk could not be ruled out as high, so the company applied post-training and classifiers and judges residual risk, with system safeguards, at moderate or lower across catastrophic domains. Cyber and loss-of-control evals in the card are presented as moderate or lower even before those mitigations. A fuller safety report is promised. None of that settles how a personal agent with calendar and document access should be governed in practice. It does show Meta writing the same style of risk paperwork its peers now publish before a frontier drop.

The strategic bet is consumer scale rather than coding-agent supremacy. Wang argued that rivals obsess over software engineers while Meta is building for ambiguous everyday work: insurance claims, leases, finances, long errands across apps. That is why Active Memory and Active Focus get top billing, and why Wonder Full stays inside Muse Code for now. Specialised, cheaper distillations are already in progress so billions of free users can eventually feel some of the same capability. If those distillations hold quality, Meta's distribution through Facebook, Instagram, WhatsApp and a dedicated Muse app becomes the real moat. If they do not, Meta will have bought a costly seat at the frontier table without a product that fits its audience.

For the industry, Oct. 12 closes a narrative gap. After the Scale AI stake, the Superintelligence Labs reorg and the Prometheus campus, Meta needed a model that outsiders would not dismiss as late Llama. Wonder and Wonder Full are that model on present evidence: near the top of an independent composite, priced like a frontier API, wrapped in agent marketing, and still short of a clean win on knowledge and on Anthropic's best score. The race did not end. Meta is back in it.
