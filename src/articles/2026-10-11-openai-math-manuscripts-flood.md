---
title: "OpenAI released 722 maths papers in one day, and mathematicians are still sorting through them"
description: "OpenAI has published hundreds of manuscripts on open mathematical problems produced by an unreleased internal model. Some proofs are computer checked, about half were released unconfirmed, and three were withdrawn within a day."
date: 2026-10-11T12:02:00Z
category: Models
hero: /images/articles/openai-math-manuscripts-flood.jpg
heroAlt: "A pencil drawing of a small study crowded with towering stacks of bound manuscripts, a reading lamp over an open notebook on the desk and more stacks arriving on a trolley."
author: Singularity Review
tags: [OpenAI, Mathematics, Lean, Peer review, Science]
heroCaption: "Editorial illustration. No real logos depicted."
seoDescription: "OpenAI published 722 maths manuscripts from an internal model on 6 October. Mathematicians praised some ideas but criticised the scale and the verification."
takeaways:
  - On 6 October OpenAI published 722 manuscripts in 372 families of related results, produced by an unreleased internal model.
  - Many, but not all, come with proofs written in Lean, a language that lets a computer check a proof. OpenAI says unformalised results could contain errors.
  - Three manuscripts were withdrawn the next day because of a sign error, and 14 others were revised.
  - Leading mathematicians described both striking new ideas and serious frustration with how the work was released.
sources:
  - title: Sharing AI progress in mathematics
    publisher: OpenAI
    url: https://openai.com/index/sharing-ai-progress-in-mathematics/
    date: "2026-10-06"
  - title: openai/math repository
    publisher: OpenAI on GitHub
    url: https://github.com/openai/math
    date: "2026-10-06"
  - title: OpenAI withdraws three preprints a day after releasing 722 manuscripts on unsolved math problems
    publisher: Retraction Watch
    url: https://retractionwatch.com/2026/10/08/openai-withdraws-preprints-722-manuscripts-unsolved-math-problems/
    date: "2026-10-08"
  - title: "\"How much beauty have we lost?\" Mathematicians react with shock and disgust as OpenAI bulldozes their field"
    publisher: The Decoder
    url: https://the-decoder.com/how-much-beauty-have-we-lost-mathematicians-react-with-shock-and-disgust-as-openai-bulldozes-their-field/
    date: "2026-10-10"
  - title: "OpenAI Math manuscript index"
    publisher: "Independent community index (kisonecat)"
    url: https://kisonecat.github.io/openai-math/
    date: ""
updated: "2026-10-11T12:02:00Z"
section: news
---

On 6 October 2026 OpenAI published [722 mathematical manuscripts](https://github.com/openai/math) in a single GitHub repository. The company says they were produced by an unreleased internal model and grouped into 372 "families" of related papers. A family can contain a main result, companion arguments, consequences or alternative proofs.

The papers address open research problems, meaning questions that professional mathematicians had not yet answered. OpenAI says it began testing its models on such problems after they saturated its existing mathematics tests, in other words, after they started scoring close to the maximum.

According to the repository, the model was given roughly 4,000 problems over the course of the evaluation. The average result used about three hours of ChatGPT Pro "thinking" compute, the extended reasoning time OpenAI sells to its most expensive subscribers. OpenAI has not published how many of those 4,000 attempts failed.

## What the release contains

Each manuscript comes as a PDF with its source files. For many of them, OpenAI also supplies a formalisation in [Lean](https://openai.com/index/sharing-ai-progress-in-mathematics/), a programming language in which a proof can be written so precisely that a computer can check every step.

That matters because traditional proofs are checked by human referees, a slow process. A Lean proof removes the need to trust the author on the logic. It does not, however, guarantee that the formal statement says the same thing as the written paper. An [independent index of the collection](https://kisonecat.github.io/openai-math/) counts 162 papers for which OpenAI claims a Lean formalisation of the main result, and notes that it reports this claim without checking the code itself.

OpenAI's own repository is candid on this point. It says the collection "includes results at different stages of verification" and that "some of the unformalized results could have issues."

The company says it consulted the independent Advisory Group on Mathematics and Artificial Intelligence at the Institute for Advanced Study on how to release the work. An OpenAI spokesperson told [Retraction Watch](https://retractionwatch.com/2026/10/08/openai-withdraws-preprints-722-manuscripts-unsolved-math-problems/) that the group recommended releasing results without waiting for full formalisation, and that roughly 50 percent of the results were released unconfirmed.

## The first corrections

Less than a day later, on 7 October, OpenAI withdrew three manuscripts. A sign error invalidated an argument in one paper and the construction used by two papers that depended on it. The company also said it had revised 14 other manuscripts with proof repairs, corrected statements and clearer assumptions. The repository's contents page now lists 719 manuscripts.

Alex Townsend, an associate professor of mathematics at Cornell University, told Retraction Watch he expects more errors to surface. "Given the skepticism of AI in the mathematics community, I think that OpenAI should have announced the manuscripts that were lean verified first," he said.

Andrew Sutherland, a senior research scientist in mathematics at MIT, called the quick withdrawals "the responsible thing to do". He added: "I think the withdrawals and corrections will be viewed positively by the mathematics community, but it will take a lot more than that to earn back the trust they have lost."

Part of that lost trust dates from September, when OpenAI announced that an AI system had solved the Navier-Stokes problem, a famous open question about the equations that describe flowing liquids and gases. A group of leading researchers said that announcement left no time for a proper write-up or for crediting earlier work by others. Retraction Watch reports that more than 8,000 researchers have endorsed those concerns.

![A mathematician's hands mark a printed manuscript with a red pencil, beside a tall stack of papers, reading glasses and a cup of tea.](/images/articles/openai-math-manuscripts-flood-2.jpg)

## Mathematicians react

The maths blog Proofs and Prompts collected more than 100 responses from researchers, summarised by [The Decoder](https://the-decoder.com/how-much-beauty-have-we-lost-mathematicians-react-with-shock-and-disgust-as-openai-bulldozes-their-field/). Several were impressed by the content. Terence Tao wrote that the proofs appeared to "introduce clever new ideas that will be fruitful once digested", while saying he was "deeply frustrated" that there was nobody to discuss the work, present it or teach it.

Fields Medallist Peter Scholze urged patience: "We should remember that we are all in this together; mathematics is a marathon, not a sprint; and the goal is and always will be the human understanding of mathematics, which will invariably take time."

Others described the effect on their careers. A PhD student learned that the central problem of his dissertation had been claimed the same morning. Henry Wilton criticised OpenAI for withholding author names and failure rates. The Association for Human Mathematics went further: "Releasing over 700 files at once is not a demonstration of scholarship, but a demonstration of power."

## What happens next

OpenAI says it will keep adding Lean formalisations, correct errors promptly and fund workshops and conferences to help the community understand major AI-produced results. It also says it is working to release the model that produced them.

In our view, the release shows where the bottleneck in AI mathematics has moved. Producing candidate proofs is now fast and cheap for a frontier lab. Checking them, understanding them and connecting them to existing work still falls on a limited number of human experts, most of whom did not ask for this workload.

Two steps would help. Publishing the full record of the roughly 4,000 attempts, including failures, would let outsiders judge how selective the catalogue is. Separating fully formalised results from unconfirmed ones, as Townsend suggests, would tell readers which claims they can rely on today. Our conclusion is that a proof becomes part of mathematics only when people can read it, test it and build on it, and for most of these 722 manuscripts that work has only just begun.
