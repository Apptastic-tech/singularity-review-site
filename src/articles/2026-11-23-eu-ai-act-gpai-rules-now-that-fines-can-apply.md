---
title: "The EU AI Act's rules for general-purpose models, now that fines can apply"
date: 2026-11-23T15:20:00Z
author: "Ararat Ovsepian"
category: "Analysis"
section: featured
summary: "Since 2 August 2026, the European Commission has said it will enforce full compliance, including with fines, for the AI Act's duties on providers of general-purpose AI models. Those duties have been on the books since 2 August 2025, with a first-year period in which the AI Office said it would work closely with companies that signed the voluntary General-Purpose AI Code of Practice. This explainer sets out what the Act requires, what the Code does and does not do, which models are treated as posing systemic risk, and which deadlines still lie ahead."
description: "The EU AI Act's general-purpose model rules, explained now that the Commission can enforce them with fines: the Code of Practice, systemic risk, the 10^25 FLOP presumption, and the 2027 deadline for older models."
seoDescription: "EU AI Act general-purpose AI rules after 2 August 2026: what the Code of Practice covers, the systemic-risk threshold, who has signed, and which duties still have later deadlines."
hero: /images/articles/eu-ai-act-gpai-rules-now-that-fines-can-apply.jpg
heroAlt: "The curved glass facade of the Berlaymont building in Brussels, with a line of European Union flags in front"
heroCaption: "Photo by KenSwe72 (CC BY 4.0, via Wikimedia Commons)."
tags: ["EU AI Act", "General-purpose AI", "Code of Practice", "AI Office", "Systemic risk", "Policy", "Analysis"]
takeaways:
  - "The AI Act's obligations for providers of general-purpose AI models began to apply on 2 August 2025. In a Commission Q&A on the Code of Practice, the AI Office said that from 2 August 2026 it would 'enforce full compliance with all obligations for providers of general-purpose AI models with fines.'"
  - "The General-Purpose AI Code of Practice, published on 10 July 2025 and later assessed as adequate by the Commission and the AI Board, is a voluntary way to demonstrate compliance. It does not create extra legal duties. Providers who do not sign still have to comply, and to show how they do so by other means."
  - "The Code has three chapters. Transparency and Copyright are written for all general-purpose model providers, and map to Article 53 of the Act. Safety and Security is written only for providers of models with systemic risk, and maps to Article 55. The Commission Q&A says the Act currently presumes that models trained with more than 10^25 floating-point operations have high-impact capabilities."
  - "Our view: signing the Code is not a waiver, and the end of the first-year collaboration period is not the end of every deadline. Models already on the market before 2 August 2025 have until 2 August 2027 to comply. The live question is whether enforcement now looks at how signatories follow the Code, and at how non-signatories document their alternative measures, rather than at whether a company appeared on a signature list."
sources:
  - title: "The General-Purpose AI Code of Practice"
    publisher: European Commission (Shaping Europe's digital future)
    url: https://digital-strategy.ec.europa.eu/en/policies/contents-code-gpai
    date: "Checked November 23, 2026"
  - title: "Questions and answers on the code of practice for General-Purpose AI"
    publisher: European Commission (Shaping Europe's digital future)
    url: https://digital-strategy.ec.europa.eu/en/faqs/questions-and-answers-code-practice-general-purpose-ai
    date: "Checked November 23, 2026"
  - title: "Commission Opinion on the assessment of the General-Purpose AI Code of Practice"
    publisher: European Commission
    url: https://digital-strategy.ec.europa.eu/en/library/commission-opinion-assessment-general-purpose-ai-code-practice
    date: "2025-08-01"
  - title: "Guidelines on the scope of obligations for providers of general-purpose AI models under the AI Act"
    publisher: European Commission
    url: https://digital-strategy.ec.europa.eu/en/library/guidelines-scope-obligations-providers-general-purpose-ai-models-under-ai-act
    date: "2025-07-18"
  - title: "Signatory Taskforce of the General-Purpose AI Code of Practice"
    publisher: European Commission (Shaping Europe's digital future)
    url: https://digital-strategy.ec.europa.eu/en/policies/signatory-taskforce-gpai-code-practice
    date: "Checked November 23, 2026"
faq:
  - q: "When did the EU's general-purpose AI rules start to apply?"
    a: "Providers placing general-purpose AI models on the market have had to comply since 2 August 2025. The Commission has said that from 2 August 2026 it will enforce full compliance with those obligations, including with fines. Models that were already on the market before 2 August 2025 have until 2 August 2027."
  - q: "Is the General-Purpose AI Code of Practice legally binding?"
    a: "No. The Commission describes it as a voluntary tool to help providers demonstrate compliance with duties that already exist in the AI Act. The Commission's Q&A says the Code 'does not impose obligations' and does not extend the Act. Providers who do not sign must still comply, and must show how they do so by other adequate means."
  - q: "What is a general-purpose AI model with systemic risk?"
    a: "Under the Act, systemic risk is tied to high-impact capabilities that match or exceed those of the most advanced general-purpose models and that have a significant impact on the Union market. The Commission's Q&A on the Code says the Act currently presumes that models trained with a cumulative amount of compute greater than 10^25 floating-point operations possess high-impact capabilities."
  - q: "Do all signatories follow every chapter of the Code?"
    a: "Not necessarily. The Commission's Code page, as checked on 23 November 2026, lists many companies as signatories and notes that xAI signed up only to the Safety and Security chapter, and therefore has to demonstrate compliance with the transparency and copyright obligations by other adequate means."
  - q: "If a company signed the Code, is it automatically in compliance?"
    a: "No. Signing signals an intent to use the Code as the way to demonstrate compliance. The Commission has said that, for providers who adhere, it will focus enforcement on monitoring that adherence. The legal duties remain those in the Act, and a signature is not itself a finding that every measure is already in place."
---

The most important date in the European Union's general-purpose AI rules is easy to miss, because it is not the day the AI Act was agreed and not the day its first model-provider duties began to apply.

On 2 August 2025, providers placing general-purpose AI models on the EU market had to start complying with the relevant parts of the Act. For a year after that, the AI Office said it would work closely with companies that had signed the voluntary General-Purpose AI Code of Practice, and would treat incomplete implementation of the Code as a good-faith problem to solve rather than, automatically, a breach. [In its Q&A on the Code](https://digital-strategy.ec.europa.eu/en/faqs/questions-and-answers-code-practice-general-purpose-ai), the Commission is explicit about what happens next: "from 2 August 2026 onwards, the Commission will enforce full compliance with all obligations for providers of general-purpose AI models with fines."

That second date has now been in force for more than three months. This piece is a field guide to the rules as they stand today, not a prediction of who will be fined.

## What the Act requires, and what the Code is for

The Code does not replace the Act. The Commission repeats this in several places, and it is the first distinction worth getting right. [The Code page](https://digital-strategy.ec.europa.eu/en/policies/contents-code-gpai) describes the Code as "a voluntary tool, prepared by independent experts in a multi-stakeholder process, designed to help industry comply with the AI Act's obligations for providers of general-purpose AI models." The Q&A is blunter: "The Code does not impose obligations." It is a way to show compliance with duties that already exist, "without creating new ones, extending existing ones, or imposing additional burdens."

Those duties sit mainly in two articles, which the Code is organised to follow.

Article 53, in the Commission's account of the Code, is the general set of obligations for providers of general-purpose AI models. The Code's Transparency and Copyright chapters are the suggested way to demonstrate compliance with that article. The Transparency chapter includes a Model Documentation Form. The Copyright chapter is described as offering "practical solutions to meet the AI Act's obligation to put in place a policy to comply with EU copyright law."

Article 55 is narrower. It applies to providers of general-purpose AI models "with systemic risk." The Code's Safety and Security chapter is written only for that group, and is described as outlining "concrete state-of-the-art practices for managing systemic risks, i.e. risks from the most advanced models."

A company can therefore be in scope of the Act as a general-purpose model provider without being in scope of the safety chapter. That is not a loophole in the Code. It is how the Act itself was written.

On 1 August 2025, [the Commission and the AI Board assessed the Code as "an adequate voluntary tool"](https://digital-strategy.ec.europa.eu/en/library/commission-opinion-assessment-general-purpose-ai-code-practice) for providers to demonstrate compliance. The legal effect of that finding, as the Code page explains it, is practical rather than magical: a provider that signs and follows the Code can use that adherence as its demonstration, with less administrative burden than inventing a parallel method. A provider that does not sign still has to demonstrate compliance through other means, and, the Commission says, to explain how its measures compare with those in the Code.

## Who counts as a provider, and what counts as systemic risk

On 18 July 2025 the Commission published [guidelines on the scope of the obligations](https://digital-strategy.ec.europa.eu/en/library/guidelines-scope-obligations-providers-general-purpose-ai-models-under-ai-act) for general-purpose AI model providers, ahead of the 2 August 2025 start date. The accompanying Q&A on the Code says those guidelines were meant to clarify three points: when a model is a general-purpose AI model, when it is one with systemic risk, and who is considered the provider.

The systemic-risk test is easy to sloganise and easy to get slightly wrong. The Q&A says the Act "defines systemic risk as specific to high-impact capabilities, i.e. capabilities that match or exceed the capabilities of the most advanced general-purpose AI models, that have a significant impact on the Union market." It then adds the number most often quoted in commentary: "The AI Act currently presumes that models trained with a cumulative amount of compute greater than 10^25 floating-point operations possess high-impact capabilities."

A presumption is not the same as a unique definition. A model below that compute level could still be found to have high-impact capabilities, and a model above it is presumed to have them unless that presumption is displaced in the way the Act allows. This article does not try to decide which named models sit on which side of the line. The useful caution is simpler: "systemic risk" in this law is a legal category with a compute presumption attached, not a synonym for "any powerful model."

Providers of models in that category have a further duty that starts as soon as the model is to be placed on the EU market: they "must notify the AI Office of general-purpose AI models with systemic risk to be placed on the EU market without delay."

## The calendar that is still in motion

Three dates matter, and they apply to different models.

2 August 2025 is when the obligations began for providers placing general-purpose models on the market. From that day, in the first year, the AI Office said it would collaborate closely with Code signatories, and would not automatically treat a signatory as having broken the Code, or violated the Act, if some commitments were not fully in place on day one.

2 August 2026 is when that first-year posture ends and, in the Commission's words, full compliance is enforced "with fines."

2 August 2027 is still ahead. "Models placed on the market before 2 August 2025 must comply with the AI Act obligations by 2 August 2027." A system that a European customer was already using in mid-2025 is not, on that wording, automatically in the same enforcement bucket as a model first placed on the market after the 2025 start date. Anyone writing that "the AI Act now applies in full to every model" is flattening a deadline the Commission has kept in the Q&A.

The Code itself is also not frozen. The Q&A says the AI Office will review it at least every two years and may update it as the technology and the risk landscape change.

## Who has signed, and what a signature means

[The Commission's Code page](https://digital-strategy.ec.europa.eu/en/policies/contents-code-gpai), checked on 23 November 2026, lists a set of signatories that includes Amazon, Anthropic, Google, IBM, Microsoft, Mistral AI, OpenAI and others, and it warns that the list may lag confirmations. It also records a partial signature: "xAI signed up to the Safety and Security Chapter; this means that it will have to demonstrate compliance with the AI Act's obligations concerning transparency and copyright via alternative adequate means."

That sentence is more instructive than the length of the list. A signature can be chapter-specific. A company can accept the systemic-risk playbook and still have to prove its transparency and copyright compliance some other way. The list is not a certificate of complete adherence, and absence from the list is not, by itself, a finding of non-compliance.

Signatories who want to discuss how they apply the Code have a [Signatory Taskforce](https://digital-strategy.ec.europa.eu/en/policies/signatory-taskforce-gpai-code-practice), chaired by the AI Office. The Commission's taskforce page, as opened for this article, records four meetings in 2026, the most recent on 17 July 2026. That is a coordination forum, not an enforcement decision.

## Our view

The tempting way to write about this moment is to treat 2 August 2026 as a switch that turned "voluntary" into "compulsory." That is not what the documents say. The Act's obligations were already compulsory for in-scope providers a year earlier. What changed in August 2026 is the Commission's description of its enforcement stance: the first-year collaboration period, in which incomplete Code implementation would be handled as a work in progress, is over, and fines are on the table.

The Code remains what it has been since the Commission and the AI Board issued their opinion on 1 August 2025: a voluntary, officially adequate path for showing compliance, not a second statute. Companies that signed it should be judged on whether they follow it. Companies that did not should be judged on whether they can show, in the Commission's phrase, "other adequate means." A name on the signatory list is a useful fact. It is not a conclusion.

Two other simplifications are worth resisting. The first is to treat every general-purpose model as a systemic-risk model. The Act and the Code both distinguish the two, and the 10^25 floating-point-operation figure is a presumption about high-impact capabilities, not a casual measure of importance. The second is to talk as if every model in use in Europe is already at the same deadline. The 2 August 2027 date for models placed on the market before 2 August 2025 is still part of the official calendar.

The test of this regime over the next year will not be how many logos appear under "signatories." It will be whether the AI Office's assessments, and any enforcement that follows, make the difference between a filled-in documentation form and a real transparency, copyright or safety practice visible from outside the firms.
