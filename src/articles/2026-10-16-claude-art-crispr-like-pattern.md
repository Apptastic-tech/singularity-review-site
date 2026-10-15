---
title: "Claude spotted a CRISPR-like pattern. That is not the same as inventing the next CRISPR."
description: "Anthropic's agents found an overlooked DNA repeat array in jumbo phages. The search method is the real story; the CRISPR comparison and the word 'discovered' are running ahead of the biology."
date: 2026-10-16T05:00:00Z
category: Science
hero: /images/articles/claude-art-crispr-like-pattern.jpg
heroAlt: "A vintage natural-history watercolour plate of a bacteriophage above an unspooled DNA strand marked with a row of evenly spaced rust-coloured repeats beside two larger green gene blocks."
heroCaption: "Scientific illustration. Not to scale."
author: Singularity Review
tags: [Anthropic, Claude, Biology, CRISPR, AI in science]
seoDescription: "Anthropic says Claude agents found ART, a CRISPR-like repeat system in jumbo phages. Our analysis: the genome-mining speed is real; the CRISPR comparison and autonomy claims are not yet earned."
takeaways:
  - "Strong claim: AI agents can mine genome databases for overlooked gene neighbourhoods in a day rather than months."
  - "Unproven claim: that ART is a CRISPR-class tool. Its function is unknown and the work is an unreviewed preprint."
  - "Overstated claim: that Claude 'discovered' it autonomously. Expert humans framed the search, the enzyme was known since 2021, and repeat runs did not reliably find the array."
sources:
  - title: Claude discovers a novel enzyme system with CRISPR-like repeats
    publisher: Anthropic
    url: https://www.anthropic.com/news/claude-discovers-novel-enzyme-system
    date: "2026-09-23"
  - title: Anthropic Says It Discovered a Crispr-Like System. Now What?
    publisher: Wired
    url: https://www.wired.com/story/anthropic-says-it-discovered-a-crispr-like-system-now-what/
    date: "2026-09-29"
  - title: Has Anthropic's Claude really made a discovery comparable to CRISPR?
    publisher: New Scientist
    url: https://www.newscientist.com/article/2590769-has-anthropics-claude-really-made-a-discovery-comparable-to-crispr/
    date: "2026-09-25"
  - title: Claude just found a CRISPR-like DNA pattern, but even Anthropic's scientists aren't sure what it does
    publisher: Scientific American
    url: https://www.scientificamerican.com/article/claude-just-found-a-crispr-like-dna-pattern-but-even-anthropics-scientists-arent-sure-what-it-does/
  - title: A biologist queries whether AI borrowed his work to make major discovery. An expert explains the rules
    publisher: The Conversation
    url: https://theconversation.com/a-biologist-queries-whether-ai-borrowed-his-work-to-make-major-discovery-an-expert-explains-the-rules-293529
updated: "2026-10-16T05:00:00Z"
section: news
---

Strip away the headline and Anthropic's ART announcement contains three different claims bundled as one. The first is that a swarm of AI agents can comb public DNA databases and surface something experts had walked past. The second is that what they surfaced resembles CRISPR closely enough to matter. The third is that Claude did this as a scientist would, more or less on its own. These claims deserve very different levels of confidence, and most of the confusion around the story comes from treating them as a package.

## What was actually found

![Enlarged crop of a DNA strand with evenly spaced rust-coloured repeat marks from a vintage scientific plate](/images/articles/claude-art-crispr-like-pattern-2.jpg)

Some background, briefly. Bacteriophages, or phages, are viruses that infect bacteria; "jumbo" phages are unusually large ones with big genomes. A reverse transcriptase (RT) is an enzyme that copies RNA back into DNA. Bacteria use several RT-based systems as part of their immune defences. CRISPR, the basis of modern gene editing, was first noticed as a CRISPR array: a run of short, identical DNA repeats separated by evenly spaced unique segments, sitting next to a set of genes.

In an announcement on 23 September 2026, Anthropic said its new life sciences lab had run roughly 950 Claude agents for about 21 hours, consuming some 210 million tokens, searching sequence databases for unusual RTs. One agent noticed a tandem repeat array sitting beside an odd-looking RT and flagged the layout as CRISPR-like. The lab calls the system array-associated reverse transcriptases, or ART: the RT, a neighbouring partner gene of unknown function, and a long array of evenly spaced repeats, found mainly in jumbo phages.

Two details narrow the claim. The RT itself is not new; Wired notes it was described in a 2021 paper on jumbo phages by Jason Gill of Texas A&M and colleagues, and Anthropic acknowledges it "had been identified in previous studies". What Anthropic claims is that Claude was the first to link the RT with the repeat array and the accessory protein as one system. And the biology is at an early stage: the company's first experiments show the array is expressed as a set of distinct short RNAs, a hint, as in CRISPR, that the repeats are doing something. What that something is, nobody yet knows. The work is a preprint, not peer-reviewed.

## Claim one: agents can mine genomes fast. Fairly strong.

This is the part outside scientists accept most readily. Seth Shipman of the Gladstone Institutes told Wired that identifying new RTs can take months of manual database mining, so doing it in a day is impressive. Le Cong of Stanford credited the team with picking a problem well suited to a pattern-seeking model, likening it to scanning a beach for a diamond. Feng Zhang, a CRISPR pioneer who reviewed the preprint, called RNA-repeat arrays associated with RTs "genuinely intriguing" and said they merit further investigation.

The cost is also modest by frontier-AI standards. Two hundred million tokens across a day is cheap relative to a postdoc-year. If the approach generalises, the bottleneck in comparative genomics moves from finding candidates to testing them.

## Claim two: ART is a CRISPR-class tool. Unproven.

Here the framing outruns the evidence. "CRISPR-like" describes a layout in DNA, not a capability. Shipman doubts ART is a new CRISPR system at all; in his view the novel thing is how it was found, not what it is, and it may turn out to be closer to retrons, another family of bacterial RT systems. New Scientist put the honest comparison well: this resembles noticing the odd repeats in 1987, not Doudna and Charpentier showing in 2012 that CRISPR could be programmed to cut DNA. Twenty-five years separated those two moments. Cong's summary was blunter: the experiments are still in the queue, but the PR is already live.

It is worth keeping proportion on the AI side too. AlphaFold changed how structural biologists work every day. ART, so far, is one well-chosen hypothesis.

## Claim three: Claude discovered it autonomously. Overstated.

The search was designed by expert humans; Anthropic's own scientists told Scientific American that the prompt was "not a prompt an amateur biologist would have written". Humans then judged the hit worth pursuing and ran the lab work. Anthropic also reports that across ten follow-up search runs the array was not always found, which is a reminder that a stochastic agent swarm surfacing something once is different from a reliable discovery engine. And one biologist publicly asked whether unpublished work he had discussed with Claude could have influenced the find; Anthropic says it does not train on user conversations, and there is no evidence that it did here, but the episode shows how thin the line between "found" and "retrieved" can look from outside.

## Our view

The interesting result is methodological. A large, cheap agent swarm reading raw sequence data surfaced a gene neighbourhood that specialists had not connected, and the lab has early evidence it is transcribed. That is a real, repeatable-in-principle capability, and it will make computational biology faster.

What it is not, yet, is a new CRISPR, or proof of an autonomous AI scientist. ART has no known function, no peer review, and no demonstration that it can be engineered into anything. The right test of the "AI discovers" narrative is not the press release but the next two papers: one that says what ART does, and one in which an agent swarm, run blind, finds it reliably. Until then, credit the search, and hold the superlatives.
