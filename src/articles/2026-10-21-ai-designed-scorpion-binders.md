---
title: "Five people with no biology training asked an AI for an antivenom. Seventeen proteins worked."
description: "An investment research firm and Anthropic set Claude loose on scorpion neurotoxins. It produced 318,484 protein designs in 64 hours, two labs tested 211 of them, and 17 bound their targets. Nobody has shown they stop the venom."
date: 2026-10-21T20:34:00Z
category: Agents
hero: /images/articles/ai-designed-scorpion-binders.jpg
heroAlt: "A night clinic corridor in a hot country, a parent carrying a child towards a treatment room, seen from behind."
heroCaption: "Illustration. Scorpion stings kill more than 3,250 people a year, most of them children."
author: Singularity Review
tags: [Claude, Anthropic, Protein design, Drug discovery, Agents, Global health]
seoDescription: "Anthropic and Citrini Research used an internal Claude model to design protein binders against five scorpion neurotoxins. Of 211 lab-tested designs, 17 bound their toxin. What the result proves, and what it does not."
takeaways:
  - "Strong claim: an AI agent ran a drug design campaign almost alone. Five human messages produced the first 180 designs, and the strongest binder holds its toxin as tightly as a good antibody."
  - "Caveat: binding is not blocking. No design has been tested in cells or animals, so this is not an antivenom, and the report has not been peer reviewed."
  - "Open question: the moonshot failed. Of 151 designs aimed at several toxins at once, the cheap universal treatment the world actually needs, none bound more than one."
sources:
  - title: "How Claude designed protein binders against scorpion neurotoxins"
    publisher: Anthropic
    url: https://www.anthropic.com/research/claude-scorpion-toxin-binder-design
    date: "2026-10-20"
  - title: "De novo design of protein binders against scorpion toxins with Claude"
    publisher: Anthropic (technical report)
    url: https://www-cdn.anthropic.com/31ac578806cffd8b3d92d8affe6edc4c04d502e1.pdf
    date: "2026-10-20"
  - title: "Scorpion toxin binder design: data release"
    publisher: Anthropic on Hugging Face
    url: https://huggingface.co/datasets/Anthropic/scorpion-toxin-binder-design
    date: "2026-10-20"
  - title: "We wanted to use Claude to create a new drug. Here's what happened."
    publisher: Citrini Research
    url: https://www.citriniresearch.com/p/citrini-therapeutics
    date: "2026-10-20"
  - title: "Citrini Research is backing life sciences stocks after using Claude to design proteins"
    publisher: Quartz
    url: https://qz.com/citrini-research-life-sciences-stocks-claude-protein-design-102026
    date: "2026-10-20"
  - title: "Claude designs protein binders against scorpion toxins"
    publisher: Technology.org
    url: https://www.technology.org/2026/10/21/claude-scorpion-toxin-protein-binders-anthropic/
    date: "2026-10-21"
updated: "2026-10-21T20:34:00Z"
section: news
draft: false
---

Scorpions sting at least 1.2 million people a year. More than 3,250 of them die, mostly children, mostly in places where the nearest hospital is hours away and may have nothing on the shelf when they arrive. The treatment that exists is made by milking venom from live scorpions, injecting it into horses, and purifying the antibodies from the horses' blood. It takes months, it covers only a few toxins, and it is expensive. Researchers call scorpion envenomation a neglected tropical disease because almost nobody can make money fixing it.

![A horse in a dim wooden stable with a blood collection bag taped to its neck, a handler's hands steadying the halter](/images/articles/ai-designed-scorpion-binders-2.jpg)

On 20 October, Anthropic published what happened when five people with almost no background in biology asked an AI to do something about that.

## Who did this, and why

The five work at Citrini Research, an investment research firm that writes about stocks. In June they went looking for an area the market had given up on, settled on life sciences, and ran into a problem: the experts they called disagreed about everything. Some said AI had never produced an important drug and never would. Others said it would cure disease within five years. So the firm decided to find out by doing it, and budgeted 200,000 dollars of its own money.

Their reasoning was blunt. If a group with no drug development experience could design a molecule that did something real in a test tube, then something had genuinely changed. Without AI, they write, there was no chance this group would design anything that worked at all.

Anthropic's life sciences team agreed to help. Because Citrini wanted an internal research model more capable than the public one, and because asking an AI to design molecules that bind neurotoxins trips a biosecurity filter, the prompting had to happen in person, on Anthropic's machines, in its offices. A questionnaire of more than 60 security questions made that clear.

## What the AI actually did

Over a day in Anthropic's offices, the team used Claude to write a prompt for Claude: roughly 35 pages setting out targets, design rules, scoring tools and how many candidates to make. They chose five neurotoxins from four regions, including Cn2 from Mexico and Ts1 from Brazil, and aimed every design at the part of the toxin that latches onto sodium channels in nerve cells. That is the mechanism that makes a sting dangerous: nerves fire at the wrong time, the body floods with stress chemicals, and in severe cases the heart fails.

Then they pressed enter and went home.

Over the next 64 hours, the model searched structure databases, picked the toxin structures to work from, chose which amino acid positions to target, set its own quality thresholds, decided how heavily to lean on each of 12 design tools, and generated 318,484 candidate proteins. It discarded any that resembled a toxin or a known protein, then predicted the shape of 553,052 design and toxin pairs together. The run used more than 10,000 GPU hours and spawned hundreds of sub-agents.

It also sent email. At the team's request, and under supervision, Claude wrote to a procurement scientist at the lab that would build the proteins, asking a numbered list of questions about which construct formats the lab could physically make. The messages said Claude had written them. It paused part of the design work until the answers came back hours later, then carried on using what it had learned.

The first 180 designs came out of five human messages in total. Four follow-up prompts, mostly pushing it towards a harder goal, brought the pool to 211.

## What the labs found

This is the part that makes it more than a demo. Two contract research organisations, Adaptyv Bio and Twist Bioscience, physically built all 211 proteins and measured whether they stuck to their toxins. One grew them in a cell-free system, the other in human kidney cells, as a cross-check. Both used surface plasmon resonance, which washes the toxin over the design and watches in real time how fast it attaches and lets go.

![Gloved hands lifting a tray of small sample tubes from a bench-top instrument on a cluttered lab bench, with a second technician out of focus behind](/images/articles/ai-designed-scorpion-binders-4.jpg)

The bar was deliberately high. To count, a design had to show binding in every replicate at both labs, hold its toxin at a strength of one micromolar or tighter, and show no stickiness towards an unrelated human protein.

Seventeen designs cleared it: seven against Cn2, four against AaH II, four against AaH I, two against LqhIII, and none at all against Ts1. Among the 60 designs aimed at a single toxin, 11 succeeded, a rate of 18 percent that Anthropic calls normal for this kind of campaign. The two best, called Cn2-B1 and Cn2-B2, grip Cn2 in the single-digit nanomolar range, which is tight. Competition tests suggest they land on or near the same spot as LR, an antibody already shown to neutralise Cn2 in mice. The lab bill came to just under 150,000 dollars, and the compute to just under 50,000.

## What failed

The ambitious part did not work. A single molecule that neutralises several toxins at once would be the thing that matters most, because a universal antivenom cocktail made of fewer parts is cheaper and works across regions. Claude warned the team in advance that this was very likely to fail, and it did. Of the designs aimed at two or more toxins, none met the criteria against more than one.

The bigger caveat is the one both Anthropic and Citrini put in writing. Binding is not blocking. Nobody has yet tested whether any of these proteins stops a toxin from disrupting a nerve cell, let alone whether it protects an animal. The toxins used were grown in the lab from their genes, not drawn from venom. Antibodies that bind more tightly and are already proven in mice remain the standard to beat. The technical report has not been through peer review. Anthropic is explicit: it does not claim to have produced an antivenom.

![An empty pharmacy storeroom in a small hospital, a hand in a white coat reaching towards bare metal shelves, with a closed cold box on the floor](/images/articles/ai-designed-scorpion-binders-5.jpg)

Two outside scientists who reviewed the work called it a promising first step. Susana Vázquez Torres of the Spanish National Cancer Research Centre put the state of the field plainly: designing a binder against almost any target no longer seems unrealistic, and binding itself is no longer the main bottleneck. The hard part, she said, is turning binders into molecules that are safe, affordable and actually available where the stings happen.

## Why it matters

The useful thing here is not the 17 proteins. It is the shape of the week that produced them: five messages, 64 hours, two outside labs, and a final report the model wrote itself, from a team that could not have done any of it by hand. Anthropic has released all 211 designs and their binding data, failures included, so the claim can be checked rather than taken on trust.

That changes which problems are worth starting. Scorpion antivenom has been neglected because the first step, finding molecules that might work, was slow and expensive for a market too poor to repay it. If that step now costs a weekend of compute and a few hundred thousand dollars, the reason to ignore it gets weaker. What has not changed is everything after: the cell tests, the animal studies, the safety work, the manufacturing, and the funders and clinicians needed to get a vial to a clinic in Sonora or the Sahel at a price a public hospital can pay. Claude compressed the part that was already the cheapest. The rest of the path is still built for humans, and still unfunded.
