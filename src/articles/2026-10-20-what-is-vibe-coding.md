---
title: "What is vibe coding, and why does it matter?"
description: "Vibe coding, also called agentic coding, means describing software in plain words and letting an AI write it. It is already how most of the world's top teams work. Here is what it is, how much faster it can be, why it is not replacing developers, and why it matters for new businesses."
date: 2026-10-20T12:23:00Z
category: Agents
hero: /images/articles/what-is-vibe-coding.jpg
heroAlt: "A baker in a flour-dusted apron, seen from behind, sits on an upturned crate at a steel worktable, working on a cheap laptop between trays of cooling bread."
heroCaption: "Illustration. Software that once needed a team can now start as a conversation."
author: Singularity Review
tags: [Vibe coding, Agentic coding, AI coding agents, Software development, Startups]
seoDescription: "What vibe coding (agentic coding) is and why it matters: sourced figures on speed, how Google, Anthropic and most developers already use it, why the data does not show it replacing developers, and how it is lowering the cost of starting a business."
takeaways:
  - "Strong claim: AI now writes most new code at some of the world's largest software teams. Google says 75% of its new code is AI-generated and reviewed by engineers."
  - "Caveat: speed gains are real in controlled tests but uneven in practice. One careful 2025 study found experienced developers were slower with AI tools, though its authors now say that result is out of date."
  - "Open question: the data shows no broad loss of developer jobs, but hiring of the youngest workers in AI-exposed jobs has fallen behind. Whether that is AI, and whether it lasts, is not settled."
sources:
  - title: "There's a new kind of coding I call 'vibe coding'"
    publisher: Andrej Karpathy on X
    url: https://x.com/karpathy/status/1886192184808149383
    date: "2025-02-02"
  - title: "The Impact of AI on Developer Productivity: Evidence from GitHub Copilot"
    publisher: arXiv (Peng, Kalliamvakou, Cihon, Demirer)
    url: https://arxiv.org/abs/2302.06590
    date: "2023-02-13"
  - title: "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity"
    publisher: METR
    url: https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
    date: "2025-07-10"
  - title: "We are changing our developer productivity experiment design"
    publisher: METR
    url: https://metr.org/blog/2026-02-24-uplift-update/
    date: "2026-02-24"
  - title: "Google says 75% of the company's new code is AI-generated"
    publisher: Business Insider
    url: https://www.businessinsider.com/google-ai-generated-code-75-gemini-agents-software-2026-4
    date: "2026-04-22"
  - title: "Google says 75 percent of all its new code is AI-generated"
    publisher: The Verge
    url: https://www.theverge.com/tech/917163/google-says-75-percent-of-all-its-new-code-is-ai-generated
    date: "2026-04-22"
  - title: "Stack Overflow Developer Survey 2026: AI"
    publisher: Stack Overflow
    url: https://survey.stackoverflow.co/2026/ai/data
    date: "2026-10-06"
  - title: "How are developers using AI? Inside Google's 2025 DORA report"
    publisher: Google
    url: https://blog.google/innovation-and-ai/technology/developers-tools/dora-report-2025/
    date: "2025-09-23"
  - title: "Industry and occupational employment projections overview and highlights, 2024 to 34"
    publisher: U.S. Bureau of Labor Statistics
    url: https://www.bls.gov/opub/mlr/2026/article/industry-and-occupational-employment-projections-overview.htm
    date: "2026"
  - title: "No widespread displacement, but the AI employment gap for young workers has widened to 19%"
    publisher: Stanford Digital Economy Lab
    url: https://digitaleconomy.stanford.edu/news/canariesaug26/
    date: "2026-08"
  - title: "A quarter of startups in YC's current cohort have codebases that are almost entirely AI-generated"
    publisher: TechCrunch
    url: https://techcrunch.com/2025/03/06/a-quarter-of-startups-in-ycs-current-cohort-have-codebases-that-are-almost-entirely-ai-generated/
    date: "2025-03-06"
  - title: "Lovable says it has hit $500M in annualized revenue, with 1 million new projects a week"
    publisher: TechCrunch
    url: https://techcrunch.com/2026/06/09/lovable-says-it-has-hit-500m-in-annualized-revenue-with-1-million-new-projects-a-week/
    date: "2026-06-09"
  - title: "Lovable's annualized revenue crosses $600M as vibe coding takes off"
    publisher: TechCrunch
    url: https://techcrunch.com/2026/09/24/lovables-annualized-revenue-crosses-600m-as-vibe-coding-takes-off/
    date: "2026-09-24"
  - title: "2026 GenAI Code Security Report"
    publisher: Veracode
    url: https://www.veracode.com/blog/2026-genai-code-security-report-ai-risk/
    date: "2026-07-28"
updated: "2026-10-20T12:23:00Z"
section: news
draft: false
---

*Editor's note: Many of our readers had not heard about vibe coding, also called agentic coding, so our editors felt it was important to bring it to our readers' attention. It is changing how software is made and how we live, and keeping our readers informed is our mission. That is why we prepared this piece.*

When we asked about vibe coding in a [poll on our Telegram channel](https://t.me/singularityreview/54), 30 percent of those who voted picked the same answer: "What is vibe coding?" That is a fair question, and an important one. The idea has gone from a joke on social media to the normal way software gets built at some of the largest companies in the world in under two years. Most people outside the industry have barely noticed.

## What vibe coding is

The name comes from Andrej Karpathy, a founding member of OpenAI and former head of AI at Tesla. On 2 February 2025 he described "a new kind of coding I call 'vibe coding'", in which a person stops worrying about the details and almost forgets "that the code even exists."

The idea is simple. For seventy years, making software meant writing precise instructions in a programming language, line by line. With vibe coding, we describe what we want in ordinary sentences instead. An AI agent, a program that can plan and carry out a task by itself, writes the code, runs it, checks the result and fixes its own mistakes. A person stays in charge: deciding what to build, judging whether it works, and saying what to change.

Inside the industry the same shift is usually called agentic coding, because an AI agent does the writing. Karpathy himself has since said he prefers "agentic engineering" for the careful, professional version. The labels differ in tone, not in substance, and we treat them as one topic here. The core change is the same: the main skill moves from typing code to describing, directing and checking it.

## How much faster it is

Speed is the first thing people notice, and the evidence is strong but not uniform.

The best known controlled test came from Microsoft Research, GitHub and MIT. They gave 95 professional programmers the same job: build a small web server. Half could use an AI assistant. Those who used it finished in an average of 71 minutes, against 161 minutes for the group without it. That is 55.8 percent faster. The researchers also found that less experienced programmers benefited the most.

![A developer in a hoodie, seen from behind, sits back in a worn chair at dawn watching a laptop and a second screen, with empty coffee cups and a wall clock nearby](/images/articles/what-is-vibe-coding-2.jpg)

Company figures point the same way at a much larger scale. In April 2026 Google chief executive Sundar Pichai wrote that a particularly complex code migration, done by AI agents and engineers working together, was completed six times faster than was possible a year earlier with engineers alone.

Not every study agrees, and the exception is worth knowing. In 2025 the research group METR ran a careful trial with 16 experienced open source developers working on their own large projects. With the AI tools of early 2025, they were 19 percent slower, even though they believed they were faster. In February 2026 METR said that result is now out of date. Developers in its newer study told researchers they were more sped up than before, and so many refused to work without AI that a clean comparison became hard to run. The honest summary: the gains are large on well defined tasks, smaller and more variable on messy real world work, and growing as the tools improve.

## The world's top teams already work this way

Vibe coding is not a fringe habit. It is quickly becoming the default.

- **Google** said in April 2026 that 75 percent of its new code is now generated by AI and reviewed by human engineers, up from about a quarter in October 2024 and half in autumn 2025.
- **Anthropic**, the company behind Claude, was writing 70 to 90 percent of its code with its own Claude Code agent as of February 2026, according to The Verge.
- **Microsoft** chief executive Satya Nadella said in April 2025 that 20 to 30 percent of the code in some of the company's projects was written by AI. Business Insider has also reported internal targets at Meta and a figure of at least 65 percent of new code at Snap.

Surveys of ordinary developers show the same picture. In Stack Overflow's 2026 Developer Survey of more than 17,000 working technologists, 83 percent use at least one AI tool at work, 66 percent use AI coding assistants or agents, and 73 percent of those use them every day. Google's 2025 DORA research, based on nearly 5,000 technology professionals, found 90 percent using AI at work and more than 80 percent saying it made them more productive.

![A large open-plan engineering floor late in the evening, mostly empty, with a small group of engineers seen from behind leaning over one screen](/images/articles/what-is-vibe-coding-3.jpg)

## It is not replacing developers

The most common fear is that if AI writes the code, nobody needs programmers. So far, the data does not show that happening.

Look again at Google's figure: the code is generated by AI and reviewed by engineers. The people did not disappear. Their work moved up a level, from typing every line to deciding what should be built, steering the agents and checking what comes back. Y Combinator, the startup accelerator, said in March 2025 that for a quarter of its newest batch, 95 percent of the code was written by AI. Its partners stressed that these founders were highly technical, and that judging good code from bad remained an essential skill.

The jobs numbers point the same way. The U.S. Bureau of Labor Statistics projects employment of software developers to grow 15.8 percent between 2024 and 2034, more than five times the average for all jobs, adding about 267,700 positions. Stanford's Digital Economy Lab, which tracks AI and employment using payroll data, reported in August 2026 that it sees no widespread, economy wide job displacement from AI.

There is one warning sign we should not skip. The same Stanford team found that employment of workers aged 22 to 25 in the most AI-exposed occupations, a group that includes young software developers, is now about 19 percent below where it would have been, mostly because companies are hiring fewer of them. Experienced workers show no such gap. The researchers say they cannot yet prove AI is the cause. What the evidence supports today is not replacement but a shift: each developer can do much more with the same time and budget, and the entry level path into the profession is changing.

## Lower barriers, new businesses

The biggest change may be outside the software industry altogether.

Building even a simple app used to mean hiring a developer or a small agency, often for weeks. Now a shop owner, a teacher or a nurse with an idea can describe it and get a working first version in an afternoon. Lovable, a European vibe coding platform founded in late 2023, said in June 2026 that more than 50 million projects had been built on it, at a rate of one million new projects a week. The company said its users are mostly non-technical: founders, designers and salespeople building websites, online shops and internal tools such as stock trackers and customer lists. By September its annual revenue run rate had passed 600 million dollars, and it said apps made by its users were attracting close to a billion visits a month.

![A young woman at an outdoor market after closing, seen from behind, packing parcels on a folding table with a phone propped against cardboard boxes](/images/articles/what-is-vibe-coding-4.jpg)

That is real economic value created by people who, two years ago, could not have built software at all. It means more ideas get tested, more small businesses get the tools they need, and the cost of trying something new keeps falling.

## What it does not change

None of this makes software automatically good or safe. In Veracode's 2026 tests, about 44 percent of AI coding tasks introduced a security flaw. Apps that look finished can still leak data. Anything that handles payments, passwords, health records or large numbers of users still needs people who understand what is happening under the surface. Vibe coding lowers the cost of starting; it does not remove the responsibility of getting it right.

## Why it matters

Vibe coding matters for three reasons. First, it is not replacing developers; there is no broad data showing that. It is helping them do far more with the same time and resources, so small teams now ship what once took large ones. Second, it lowers the barrier to entry: people with an idea and no engineering team can now build a working product and start a business. Third, that combination is generating a huge amount of new value, in new tools, new companies and work that simply would not have been built before. For readers who had never heard the term, that is the short version: software is starting to be written in plain words, and that will touch almost everything we use.
