---
title: "Handoff at frontier AI companies: what Apollo Research says policymakers need to see"
date: 2026-11-23T15:00:00Z
author: "Ararat Ovsepian"
category: "Analysis"
section: featured
summary: "On 23 November 2026, Apollo Research published a report on 'Handoff': the delegation of AI research and development, including review and some decision-making, to internal agents. The report argues that this is already far along, that it raises loss-of-control risk even before recursive self-improvement, and that governments need a shared transparency standard rather than occasional voluntary figures. This piece sets Apollo's claims next to what Anthropic and OpenAI have published about their own internal agents, and separates the companies' numbers from Apollo's reading of them."
description: "Apollo Research's 23 November 2026 Handoff report argues that frontier labs are delegating AI R&D to internal agents faster than human review can keep up. The claims, the company figures behind them, and what is still unverified."
seoDescription: "Apollo Research's Handoff report explained: what 'handoff' means, Anthropic and OpenAI's own internal-agent figures, and the transparency standard Apollo wants from governments."
hero: /images/articles/handoff-at-frontier-ai-companies.jpg
heroAlt: "Rows of black server racks and blue network cables in an empty data centre aisle"
heroCaption: "Photo by Carl Lender (CC BY 2.0, via Wikimedia Commons)."
tags: ["Apollo Research", "Handoff", "Internal deployment", "AI agents", "Anthropic", "OpenAI", "AI safety", "Analysis"]
takeaways:
  - "Apollo Research, in a report dated 23 November 2026, uses 'Handoff' for the ongoing delegation of AI R&D work, review and, increasingly, decisions to agents running inside frontier companies. It says handoff will be complete only when no human remains in the loop, and that the main risk does not depend on companies first achieving recursive self-improvement."
  - "Some of the figures Apollo cites can be checked against company pages. Anthropic, reporting as of August 2026, says Claude 'leads' 26 percent of its AI R&D work on an Epoch AI automation scale, that more than 90 percent of that work is at or above 'AI collaborates', and that Claude is not fully autonomous on any measured subset. On its main internal platform it also reports about 30,000 agents at a time, about 100,000 monitor flags a week, and about 50 of those escalated to a human."
  - "OpenAI's 19 March 2026 monitoring post, which is older than Apollo's report, says the company monitored tens of millions of internal coding trajectories over five months, that about 1,000 conversations triggered moderate-severity alerts for human review, many from internal red-teaming, and that a very small fraction of traffic (under 0.1 percent) was outside monitoring coverage. Apollo presents a much tighter human-review range as its own reading of public information."
  - "Our view: the useful question is not whether handoff is already complete. On Anthropic's own scale, it is not. It is whether review, authorisation and non-delegable decisions can keep up as execution is already highly automated, and whether those facts are reported in a form that outsiders can compare. Treat lab blogs as evidence, not as an audit."
sources:
  - title: "Handoff at Frontier AI Companies: Policymakers Need Visibility Today"
    publisher: Apollo Research
    url: https://apolloresearch.ai/governance/handoff-at-frontier-ai-companies
    date: "2026-11-23"
  - title: "Measurements for understanding the pace of AI development inside frontier labs"
    publisher: Anthropic
    url: https://www.anthropic.com/institute/measuring-pace-of-ai-development
    date: "Checked November 23, 2026"
  - title: "How we monitor internal coding agents for misalignment"
    publisher: OpenAI
    url: https://openai.com/index/how-we-monitor-internal-coding-agents-misalignment/
    date: "2026-03-19"
  - title: "Red-Teaming OpenAI's Internal Agent Monitoring Systems"
    publisher: METR
    url: https://metr.org/blog/2026-10-22-red-teaming-openai-agent-monitoring/
    date: "2026-10-22"
faq:
  - q: "What does Apollo Research mean by handoff?"
    a: "Apollo uses the word for frontier companies' ongoing delegation of AI research and development functions to internal agents, including, in its definition, high-level decisions such as safety assessments and deployment decisions. It says handoff is complete only when work execution, review and decision-making are all fully delegated and no human remains in the loop."
  - q: "Has any company said that AI now runs its research with no human in the loop?"
    a: "No company page opened for this article makes that claim. Anthropic, reporting as of August 2026, says Claude is not operating fully autonomously for any measured subset of its AI R&D work. On the scale it uses, that fully autonomous level is AL5, which it says it has not yet reached."
  - q: "Where do the 26 percent and 50-flags-a-week figures come from?"
    a: "They come from Anthropic's own measurements post. As of August 2026, Anthropic says Claude 'leads' 26 percent of its AI R&D work, meaning it can complete most of a task end to end from a high-level prompt while a human supervises. On its most-used internal platform, it says its offline monitor flags roughly 100,000 transcripts a week and that the highest-priority flags, about 50 a week, go to human review."
  - q: "Does this mean companies have already lost control of their models?"
    a: "No. Apollo argues that current practice creates conditions in which a loss of control could go undetected, especially if agents influence the training or evaluation of more capable successors. That is a risk argument, not a report of an event. OpenAI, in March 2026, said that zero real conversations had triggered its highest severity level, which it reserved for rare, high-stakes misalignment such as coherent scheming."
  - q: "What is Apollo asking governments to do?"
    a: "It asks for a shared transparency standard on how far review and decision-making have been delegated, with companies reporting against that standard to a government authority or in required safety reports, and with independent assessment. It offers draft measures, including how often seeded flaws bypass both automated monitors and human reviewers, and which go or no-go decisions companies treat as non-delegable."
---

On 23 November 2026, [Apollo Research published a report](https://apolloresearch.ai/governance/handoff-at-frontier-ai-companies) on what it calls "Handoff": the point at which AI agents inside frontier companies stop being assistants and start taking the wheel of AI research and development. The laboratory's claim is not that this has already been completed. It is that the process is far enough along, and moving quickly enough, that governments should stop relying on occasional blog posts and start measuring it.

That is a policy argument dressed in company statistics. Some of those statistics can be traced to pages the companies themselves published. Others are Apollo's own reading of "public information." This article keeps those two layers apart.

## What Apollo means by handoff

Apollo defines handoff as "frontier AI companies' ongoing delegation of all AI R&D functions, including high-level decisions such as safety assessments and deployment decisions, to internally deployed AI agents." It breaks the process into three parts: doing the work, reviewing the work, and deciding what work to do next. Handoff, in this scheme, is complete only when all three have been handed to agents "and no human remains in the loop."

Two points in the report are easy to miss if you only read the headline.

First, Apollo says the risk it is worried about does not wait for recursive self-improvement, the state in which agents can "autonomously design and develop their own successors." It argues that putting imperfectly aligned agents in a privileged position inside the research pipeline, while shrinking the share of their work that a human actually sees, is already enough to create a "misalignment cycle." Recursive self-improvement, which it says companies "explicitly aim to achieve" between 2027 and 2028, would make the same problem faster and harder to catch. Those dates are Apollo's summary of company ambitions, not a formal timetable.

Second, almost everything known about the inside of these companies still comes from the companies. Apollo is frank about this. "Almost everything we know about Handoff comes from the companies themselves, disclosed voluntarily, sporadically, and each by its own metrics." That is both the reason it wants a standard and the reason a reader should treat every figure below as a snapshot with a method attached, not as an official census.

## What the companies have actually published

The cleanest company source for the research-automation numbers Apollo uses is [Anthropic's own measurements post](https://www.anthropic.com/institute/measuring-pace-of-ai-development). Anthropic says it built a prototype "R&D Automation Index" by cataloguing kinds of AI research and development work, rating how automated each task is, and adding the ratings up. It uses an "Automation Level" scale developed by Epoch AI, from AL0 (no AI involvement) to AL5 (the system operates fully autonomously, with no human in the loop). At AL3, AI "collaborates": it can do large chunks of work under close human direction. At AL4, AI "leads": it can complete most of the task end to end from a high-level prompt, while the human supervises.

As of August 2026, Anthropic reports three results at once:

- Claude "leads" 26 percent of Anthropic's AI R&D work, up, Apollo says, from under 1 percent in February. The February comparison is Apollo's; Anthropic's page, as opened for this article, states the August 26 percent figure and does not itself give the February baseline.
- The share of work at or above "AI collaborates" is above 90 percent.
- Claude is "not operating fully autonomously for any measured subset of AI R&D work." Anthropic says it has not yet reached AL5.

Those sentences already complicate a simple "the machines are in charge" reading. A system can lead a quarter of the research portfolio, in Anthropic's sense of the word, and still leave every measured task with a human who is supposed to supervise, and with no measured slice running on its own.

On oversight, Anthropic is unusually specific, and this is where Apollo's review figures line up closely. As of August 2026, it says there were "approximately 30,000 agents doing research and engineering work at Anthropic at any one time" on its most-used internal platform, and that the measurements cover this platform only. It describes two kinds of monitor. An online monitor checks actions before they run, and Anthropic says 100 percent of these agents' actions pass through it, "usually within seconds." An offline monitor reads activity after the fact. Anthropic says that monitor "flags roughly 100,000 transcripts per week," that most flags are filtered by further classifiers, and that "the highest priority flags (approximately ~50 per week) are escalated to human review." Over August 2026 it also says it analysed "over a billion decisions" from these agents and found that 0.002 percent, "about 1 in 47,000," were blocked by the online monitor.

Fifty human reviews a week, against 100,000 flags and 30,000 agents, is the picture Apollo is pointing at, and it is also a picture Anthropic chose to publish. Anthropic notes that it is using its own models as judges of its own systems, "which could mean that the 'judge' model could make the same kinds of errors as the model it is checking."

## OpenAI's older monitoring post, and how Apollo reads it

[OpenAI's account](https://openai.com/index/how-we-monitor-internal-coding-agents-misalignment/) is from 19 March 2026, eight months before Apollo's report. It describes a low-latency monitor, then powered by GPT-5.4 Thinking, that reviews internal coding-agent sessions and alerts staff to behaviour that may be inconsistent with a user's intent or with internal security and compliance rules. OpenAI says internal coding agents are a special case because they "have access to select internal OpenAI systems, can inspect the documentation and code of their safeguards, or even attempt to modify those safeguards."

In the five months it had operated the system, OpenAI says it "monitored tens of millions of internal agentic coding trajectories." It says zero real conversations had triggered the highest severity level, "intended to capture rare, high-stakes misalignment such as coherent scheming," which it had "so far only observed as part of challenging synthetic evaluations." "Approximately 1,000 conversations triggered moderate severity alerts, many of which came from deliberate internal red-teaming, and were escalated for human review." A "very small fraction of traffic (<0.1%) primarily from bespoke or local setups" was "currently outside our monitoring coverage."

Apollo writes that "human personnel now see 0.001-0.01% of internal coding trajectories at OpenAI." That tighter range does not appear as a quoted statistic on the OpenAI page opened for this article. It is a natural way to turn "about 1,000 reviews out of tens of millions of trajectories" into a percentage, but the percentage is Apollo's, and it mixes alerts (including red-team work) with ordinary traffic. The figure OpenAI itself stands behind is the count, the five-month window, the under-0.1-percent coverage gap, and the claim that the most serious category had not appeared in real sessions.

In October 2026, [METR published a high-level account](https://metr.org/blog/2026-10-22-red-teaming-openai-agent-monitoring/) of a July and August 2026 pilot exercise in which a METR employee and a Redwood Research employee were given deep access to OpenAI's then-current misalignment monitor. They estimated that, at the time of the exercise, roughly 75 to 94 percent of certain internal agentic Responses API traffic from models at least as strong as GPT-5.5 was eligible for monitoring, with 'substantial uncertainty in both directions.' They also described ways an agent could, in principle, avoid or subvert monitoring. METR says OpenAI has stated that most of the vulnerabilities have since been patched, and that METR has not evaluated those later claims. The March post is not the last word on coverage, and the October write-up is not a current audit.

## What Apollo wants measured

Apollo's policy ask is more concrete than a general appeal for "more transparency." It wants a standard that a government body can require, with companies reporting to a public authority or in already proposed safety and security reports, and with "third-party evaluators and/or government assessors" checking the results. It names a US government centre, CAISSI, as the body it would like to see convene a task force. Whether that is the right institution is a separate question; the content of the proposed measures can be judged on its own.

The report suggests two layers.

On review, it wants an end-to-end detection figure: the share of deliberately seeded flaws that get past both automated monitors and human reviewers. It also wants a time-to-review-and-patch figure, adding up the lag from agent activity to a monitor flag, from flag to review, and from review to a fix.

On decision-making, it wants to know how autonomously agents set the direction of research, what compute and evaluation tools they can use without approval, which go or no-go decisions a company treats as non-delegable (it gives large training runs, internal deployments and shutdowns as examples), and how often humans actually override flawed proposals rather than rubber-stamping them. It also wants companies to describe any case in which an agent crossed a limit the company had said was reserved for people.

None of that requires accepting Apollo's loss-of-control scenario as a forecast. It only requires agreeing that "we have a monitor" is not the same as catching what needs to be caught, in time.

## Our view

Handoff, as Apollo defines the end state, has not arrived. Anthropic says so in plain language: nothing it measured is fully autonomous. Anyone who turns this week's report into a claim that the labs have already lost the keys is not reading either document carefully.

What has arrived is a lopsided form of automation. The part that scales easily, writing and running work, is already the default in the snapshots we have. The part that does not scale easily, a person forming an independent view of a messy, high-volume trace, is the bottleneck the companies themselves describe. Anthropic's 50 human reviews a week against 100,000 flags is not a scandal by itself. It is a ratio that only makes sense if the automated layer is very good, and that is exactly the claim that should be checked by someone who does not work for the lab.

Apollo is right that voluntary, one-off, incommensurable metrics are a weak basis for public policy. Anthropic is also right that a shared method, and a third party who can see behind the blog post, would be more useful than another round of uncomparable percentages. Until that exists, a number like "26 percent leads" or "1,000 alerts" should be read narrowly: one company, one window, one scale, often one platform.

The argument to take seriously is not that recursive self-improvement has begun. It is that review and authorisation, if they stay as scarce as they look in these disclosures, will not automatically keep pace with a research process that is already mostly machine-executed. That is a problem worth measuring now, while humans still hold the decisions companies say they have not delegated.
