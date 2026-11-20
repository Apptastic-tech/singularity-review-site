---
title: "Will MacAskill's 'a century of progress in a decade': the argument and its critics"
date: 2026-11-20T05:55:59Z
author: "Ararat Ovsepian"
category: "Analysis"
section: featured
summary: "Philosopher Will MacAskill and Fin Moorhouse argue that AI able to do research could compress a hundred years of technological progress into ten, and that this is more likely than not on the current path. Their case rests on how fast AI research effort can grow compared with human researchers, with recursive improvement as an accelerant. Critics, including Arvind Narayanan and Sayash Kapoor and Epoch AI's Ege Erdil, say real-world bottlenecks, slow adoption and the limits of a software-only feedback loop make change far slower. This piece sets out both sides with sources."
description: "Will MacAskill argues AI could bring a century of technological progress in a decade. The argument, the numbers behind it, the three feedback loops, and what critics say about speed limits and bottlenecks."
seoDescription: "Will MacAskill's 'century in a decade' AI argument explained: the research-effort maths, recursive improvement, and critiques from AI as Normal Technology and Epoch AI."
hero: /images/articles/will-macaskill-century-of-progress-in-a-decade.jpg
heroAlt: "A brass hourglass with white sand stands beside a small brass wheel ornament on a wooden table against a green wall"
heroCaption: "Photo by Suohros (CC0, via Wikimedia Commons)."
tags: ["Will MacAskill", "Intelligence explosion", "Forethought", "AI progress", "AI as Normal Technology", "Epoch AI", "Analysis"]
takeaways:
  - "Will MacAskill and Fin Moorhouse argue, in a March 2025 paper, that AI which can substitute for human researchers would drive a century of technological progress in less than a decade. They write that this is more likely than not on a default path where AI keeps scaling."
  - "The core is arithmetic. Human research effort grows by about 4 to 5 percent a year. The paper estimates a century in a decade needs total research effort to rise around 600-fold over ten years, roughly doubling each year, and argues AI research effort could grow far faster than that even without recursive self-improvement."
  - "Critics dispute the speed, not the direction. Arvind Narayanan and Sayash Kapoor argue that economic and social impact comes from adoption and diffusion, which takes decades. Ege Erdil, writing on Epoch AI's blog, doubts a software-only feedback loop because of bottlenecks in experimental compute and real-world data."
  - "Our view: the argument is strongest for fields that run on thinking and simulation, and weakest where progress needs physical experiments, regulators and people to change habits. Read 'a century in a decade' as a scenario to prepare for, not a forecast to bank on."
sources:
  - title: "Preparing for the Intelligence Explosion"
    publisher: Forethought (William MacAskill and Fin Moorhouse)
    url: https://www.forethought.org/research/preparing-for-the-intelligence-explosion
    date: "2025-03-11"
  - title: "Three Types of Intelligence Explosion"
    publisher: Forethought (Tom Davidson, Rose Hadshar and William MacAskill)
    url: https://www.forethought.org/research/three-types-of-intelligence-explosion
    date: "2025-03-17"
  - title: "Will MacAskill on AI causing a 'century in a decade', and how we're completely unprepared"
    publisher: The 80,000 Hours Podcast
    url: https://80000hours.org/podcast/episodes/will-macaskill-century-in-a-decade-navigating-intelligence-explosion/
    date: "2025-03-11"
  - title: "Will MacAskill: a century of progress in a decade #shorts"
    publisher: Singularity Clips
    url: https://www.youtube.com/shorts/eRmuPOAp5HU
    date: "2026-11-15"
  - title: "AI as Normal Technology"
    publisher: Knight First Amendment Institute (Arvind Narayanan and Sayash Kapoor)
    url: https://knightcolumbia.org/content/ai-as-normal-technology
    date: "2025-04-14"
  - title: "The case for multi-decade AI timelines"
    publisher: Epoch AI, Gradient Updates (Ege Erdil)
    url: https://epoch.ai/gradient-updates/the-case-for-multi-decade-ai-timelines
    date: "2025-04-26"
faq:
  - q: "What does 'a century of progress in a decade' mean?"
    a: "It is Will MacAskill and Fin Moorhouse's shorthand for the claim that AI able to do research could produce, in about ten years, the scientific and technological change we would otherwise expect over the next hundred years. Their thought experiment is to imagine everything from 1925 to 2025, from nuclear weapons to the internet, arriving in ten years instead."
  - q: "Why do they think it could happen?"
    a: "Because AI research effort can grow much faster than the number of human researchers. MacAskill says human research effort grows by about 4 or 5 percent a year. The paper estimates that a century in a decade needs total research effort to grow around 600-fold in ten years, and argues that AI could supply far more than that once it reaches rough parity with human researchers."
  - q: "What is the recursive improvement part?"
    a: "AI that improves the inputs to AI. A companion paper by Tom Davidson, Rose Hadshar and MacAskill describes three feedback loops: AI improving software, AI designing better chips, and AI and robots building more chips. MacAskill argues the century in a decade could happen even without these loops, and that the loops would speed things up further."
  - q: "Who disagrees, and why?"
    a: "Arvind Narayanan and Sayash Kapoor argue in 'AI as Normal Technology' that transformative impacts will play out over decades, because real-world use depends on building applications and on adoption, both of which are slow. Ege Erdil, writing on Epoch AI's Gradient Updates blog, doubts a software-only feedback loop because of bottlenecks in experimental compute and real-world data, and puts his median for full automation of remote work at about 20 years."
  - q: "Does MacAskill think it is certain?"
    a: "No. His paper says it is more likely than not on the current path. On the 80,000 Hours podcast he notes that his colleague Tom Davidson is only 50/50 on a strong software feedback loop, and that it is 'totally on the table' that one does not happen."
---

*Editor's note: this is analysis by the editor of Singularity Review, prepared with AI-assisted research and drafting and checked against the sources linked here. Where I quote Will MacAskill or his critics, I use their words from a paper or transcript I opened. The section headed "Our view" is my opinion.*

On 15 November the Singularity Clips channel posted a 65-second clip of the philosopher Will MacAskill making one of the boldest claims in the debate about advanced AI: that it could bring a century of technological progress in a decade. The clip comes from his 2025 conversation with Rob Wiblin on The 80,000 Hours Podcast. The idea itself comes from a paper he wrote with Fin Moorhouse at Forethought, a research nonprofit focused on preparing for rapid AI-driven change.

This piece sets out the argument as they make it, the numbers it rests on, and the strongest published objections. It does not try to settle who is right. It tries to show exactly where they disagree.

{% youtubePlayer "https://www.youtube.com/shorts/eRmuPOAp5HU", "Will MacAskill: a century of progress in a decade. A 65-second Short from the Singularity Clips channel.", "/images/articles/will-macaskill-century-of-progress-in-a-decade-short.jpg" %}

## The thought experiment

The paper, "Preparing for the Intelligence Explosion", was published on 11 March 2025. It opens with a picture of what compression would feel like. Take every discovery, technology and idea between 1925 and 2025. On the podcast, MacAskill lists some of them: "satellites, biological and chemical weapons, the atomic bomb, the hydrogen bomb", alongside game theory, computers, the internet and AI itself. Now imagine all of that arriving between 1925 and 1935.

The paper then asks the reader to do the same for the future: picture the developments you would expect by 2125 if progress continued at the pace of the last century, and imagine them happening over just ten years. Its claim is that this "is not just a thought experiment". The authors argue it is likely that advanced AI will drive a hundred years' worth of technological development in less than a decade.

## The arithmetic behind it

The argument is about research effort, meaning the amount of skilled thinking aimed at science and technology. MacAskill puts the human baseline simply on the podcast: "research effort is growing by 4% or 5% per year." That is limited by how fast we can train new scientists.

AI research effort is different, because you can copy a trained model and run more of it on more chips. The paper estimates how fast that effort could grow over the next decade by combining three trends: more training compute, better algorithms and more computing power used to run models. It argues AI could reach rough parity with human research labour within the next decade or two, and calls that "fairly likely".

From there the maths does the work. Under the paper's simple model, a century of progress in a decade requires total research effort to grow by a factor of about 600 over the decade, which is around one doubling a year. In what the authors call a conservative scenario, with no further scale-up of training runs and no software feedback loop, AI research effort still grows about fivefold a year after parity. Over ten years that is a factor of ten million, which the paper says would be enough for more than three hundred years' worth of progress at current rates.

The authors then build in headwinds. Progress in many fields needs physical experiments and capital, not just thinking. To allow for that, they assume ten times more research effort is needed, a 10,000-fold increase. Their projections for AI research capability after parity range from ten billion-fold to a hundred trillion-fold, so even after the adjustment they conclude that "a century of technological progress in a decade" is "more likely than not".

## Recursive improvement as an accelerant

The clip focuses on a second step. MacAskill says: "Previously I was arguing that even if you didn't have this recursive improvement, just the sheer rate of progress at the moment would be enough to drive forward a century in a decade. But in fact, I think we will have this recursive improvement, and that will speed things up even more."

The mechanism is set out in a companion paper, "Three Types of Intelligence Explosion", by Tom Davidson, Rose Hadshar and MacAskill, published on 17 March 2025. It describes three feedback loops:

- **Software:** AI improves training methods, data and other software, which makes better AI.
- **Chip technology:** AI designs better computer chips.
- **Chip production:** AI and robots build more chips and the factories that make them.

The software loop would likely be automated first and has the shortest lag, since training a new frontier model takes around three months. Chip production would likely come last and has the longest lags, because it means building new chip factories. The paper estimates that, before hitting effective physical limits, the software loop could raise effective compute by about 13 orders of magnitude, chip technology by about 6 more, and chip production by about 5 more.

## Why it matters to them

The point of the paper is not prediction for its own sake. MacAskill and Moorhouse argue that compressed progress would bring "grand challenges" in rapid succession, decisions that are consequential and hard to reverse. Their examples include new weapons of mass destruction, races to grab resources beyond Earth, digital beings that may deserve moral consideration, and dangerous concentrations of power, alongside large opportunities to improve lives. Their worry is that institutions built for slower change would not keep up, so preparation has to start now.

## The critics: speed limits in the real world

The best-known counterargument is "AI as Normal Technology", an essay by Arvind Narayanan and Sayash Kapoor published by the Knight First Amendment Institute on 14 April 2025. They do not say AI will be minor. They compare it with electricity and the internet. But they argue that "transformative economic and societal impacts will be slow (on the timescale of decades)".

Their reason is a distinction between three things: inventing new AI methods, building useful applications, and getting people and organisations to adopt them. Methods can move quickly. Applications and adoption run into safety testing, regulation, limits on sharing data and the tacit knowledge inside organisations. Their historical example is electrification: electric dynamos were "everywhere but in the productivity statistics" for nearly 40 years after Edison's first central generating station.

Their essay also challenges the research step directly. Pushing knowledge forward, they write, will often require experiments on people or organisations, "ranging from drug testing to economic policy", and "societies probably will not (and should not) allow the rapid scaling of experiments for AI development."

## The critics: the feedback loop may stall

A second line of criticism targets the recursive step. Ege Erdil, then at Epoch AI, set out his reasons for longer timelines on Epoch's Gradient Updates blog on 26 April 2025. The blog notes that such posts represent the views of their authors, not Epoch as a whole.

Erdil writes that he does not "buy the software-only singularity as a plausible mechanism", mostly because he puts "much more weight on bottlenecks coming from experimental compute and real-world data." He also argues that intuitions about how many fast AI workers we could run, drawn from coding and writing tasks, are misleading, because agentic, multimodal and long-context work is slower and more expensive. His median for full automation of remote work is about 20 years, and he gives about a 30 percent chance to it happening within ten.

Notably, MacAskill acknowledges part of this. On the podcast he says his Forethought colleague Tom Davidson is "only 50/50" that the software feedback loop takes off, and that it is "totally on the table" that it does not, giving a step forward "that will then fizzle out".

## How MacAskill answers the bottleneck point

MacAskill's reply is that bottlenecks differ by field. Areas "that you can do in the armchair", such as mathematics or philosophy, "could go extremely fast", while others are held back. Overall progress, he argues, is the sum across fields rather than the pace of the slowest. The paper adds that simulation can stand in for some physical experiments, and that existing data can be reused. He also points out that diminishing returns are already built into any forecast of where we would be by 2125.

## Where the real disagreement lies

Read side by side, the two camps are often answering different questions. MacAskill and Moorhouse measure progress in research capability: how much thinking can be done, and how fast ideas appear. Narayanan and Kapoor measure impact: when ideas become products, and when products change how people live and work. Erdil focuses on the bottleneck between them, the compute and data needed to test ideas.

It is possible for both to be partly right. A burst of discovery could happen in theory-heavy fields while hospitals, courts and factories change on their usual schedule.

## Our view

My view is that "a century in a decade" is best read as a planning scenario, and a useful one. The arithmetic is transparent and the authors state their assumptions, including the generous ones about scaling and research parity. The critics are right that the step from more thinking to more change in the world is where most of the friction sits, and that friction has historically been measured in decades.

What I find most persuasive in the paper is not the headline number but the conclusion it draws: if change could come this fast, the time to prepare is before it starts. What I find most persuasive in the critics is the reminder to watch adoption, not just benchmarks. A sensible reader can hold both: take the scenario seriously enough to prepare, and judge progress by what changes in the world, not by what changes in the lab.
