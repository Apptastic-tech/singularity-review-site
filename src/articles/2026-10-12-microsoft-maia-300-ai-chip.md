---
title: Microsoft unveils Maia 300, a home-grown AI chip meant to run most of its AI from 2027
description: Microsoft's third-generation Maia chip is built to run AI models rather than train them. The company says it will become the main engine behind Copilot and its other AI services, cutting its reliance on Nvidia and AMD hardware.
date: 2026-10-12T19:16:00Z
category: Hardware
hero: /images/articles/microsoft-maia-300-ai-chip.jpg
heroAlt: A screenprint-style illustration of a small square chip glowing warm orange at the centre of a vast power grid of pylons and cables
tags: [Microsoft, Maia, AI chips, Nvidia, Datacenters, Inference]
heroCaption: Editorial illustration. No real logos depicted.
author: Singularity Review
seoDescription: "Microsoft's Maia 300 AI chip promises 40% more tokens per megawatt than GPUs and will run most of Microsoft's AI, including Copilot, from 2027."
takeaways:
  - "On Oct. 12 Microsoft announced Maia 300, the third generation of its in-house AI accelerator, built to run models rather than train them."
  - "Microsoft says Maia will become the primary inference system for its products, at multi-gigawatt scale, starting in 2027."
  - "The company claims 40% more tokens per megawatt than leading GPU systems and up to seven times the rack throughput of Maia 200."
  - "These are Microsoft's own projections. No independent tests have been published, and more details are due at Ignite next month."
sources:
  - title: "Microsoft to expand Azure Maia system to multi-gigawatt deployments"
    publisher: "Official Microsoft Blog"
    url: https://blogs.microsoft.com/blog/2026/10/12/microsoft-to-expand-azure-maia-system-to-multi-gigawatt-deployments/
    date: "2026-10-12"
  - title: "Microsoft's new AI chip makes it less reliant on Nvidia's GPUs"
    publisher: "The Verge"
    url: https://www.theverge.com/news/1009465/microsoft-maia-300-chip-improvements-rollout
    date: "2026-10-12"
updated: "2026-10-12T19:16:00Z"
section: news
---

Every time someone asks Copilot a question, a chip somewhere has to do the arithmetic that produces the answer. On Oct. 12 Microsoft said that, from 2027, most of that arithmetic will happen on chips it designs itself. The company announced [Azure Maia 300](https://blogs.microsoft.com/blog/2026/10/12/microsoft-to-expand-azure-maia-system-to-multi-gigawatt-deployments/), the third generation of its in-house AI accelerator, and said it will scale the Maia family to "multi-gigawatt deployments starting in 2027, making Maia the primary inference system for Microsoft products and services," in the words of Scott Guthrie, the executive vice president who runs its cloud and AI group.

That sentence carries a lot of jargon, so it is worth unpacking. An accelerator is a specialised chip built to do the huge amounts of parallel maths that AI models need. Inference is the work of running a model that has already been trained: answering a prompt, writing code, summarising a meeting. Training a model happens once, at enormous cost. Inference happens billions of times a day, every time anyone uses it, and for a company with products used by hundreds of millions of people it is where the electricity bill keeps growing. A gigawatt is roughly the output of a large power station. Talking about several of them is a measure of how much AI Microsoft expects to serve.

## What Microsoft is claiming

Microsoft says Maia 300 will deliver 40% more tokens per megawatt than "leading GPU-based systems." A token is a small chunk of text, often a piece of a word, that a model reads or writes. Tokens per megawatt is therefore a simple efficiency score: how much AI output you get from a fixed amount of power. GPUs, or graphics processing units, are the chips, mostly sold by Nvidia, that power most of the AI industry today.

The company also says a full rack of 96 Maia 300 accelerators delivers up to seven times the token throughput of a rack of the previous chip, Maia 200. According to the [Microsoft blog](https://blogs.microsoft.com/blog/2026/10/12/microsoft-to-expand-azure-maia-system-to-multi-gigawatt-deployments/), each rack runs within a 167-kilowatt power envelope and holds 27.6 terabytes of high-bandwidth memory, the very fast memory that sits next to the chip and feeds it data. Microsoft describes the design as "inference-first," tuned for long-context reasoning, quick back-and-forth conversation and "sustained, multi-step agentic tasks," meaning AI agents that work through long jobs on their own.

These are the company's own projections. Maia 300 does not begin production deployments until 2027, and no independent tests of the chip have been published.

![Two dark funnels pour streams of small white cubes beneath an orange lightning bolt, with power pylons on the hills behind](/images/articles/microsoft-maia-300-ai-chip-2.jpg)

## Why build your own chip

Maia 200 was announced only in January and is already running real workloads, including Microsoft Copilot, according to [The Verge](https://www.theverge.com/news/1009465/microsoft-maia-300-chip-improvements-rollout). Microsoft says it delivers up to 1.7 times more tokens per watt than leading GPU infrastructure for AI features in Teams and Copilot. The chips run OpenAI models, Microsoft's own MAI models and popular open-source models.

The Verge's reading is direct: the efficiency gains will let Microsoft rely mainly on its own chips rather than buying from Nvidia and AMD. That matters for cost, since GPUs are expensive and supply has been tight, and for control. Mustafa Suleyman, chief executive of Microsoft AI, framed it as a matter of building the whole stack. "We have to work across the full stack, all the way down to the silicon," he told The Verge, adding that running Microsoft's own models on Maia is "a critical focus" for his team.

What stands out is the stated scale: not a side project for a few services, but the default engine for Microsoft's AI products.

## What to watch

The announcement is a plan, not a delivered product. Microsoft says it will share more at its Ignite conference in San Francisco next month. The useful questions for the next year are simple. Do the efficiency numbers hold up once real customers are using the chips? Does Microsoft actually shift most of its AI work off rented and purchased GPUs? And does cheaper inference show up as lower prices or more generous free tiers for people using Copilot, or mainly as better margins for Microsoft?

For ordinary users, none of this changes anything today. But the cost of running AI, more than the cost of building it, is what decides how much of it companies can afford to give away. A chip that squeezes 40% more out of every megawatt, if it works as promised, is one of the levers that sets that price.
