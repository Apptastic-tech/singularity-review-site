---
title: "Researchers teach existing language models to read raw bytes instead of tokens"
description: "A paper in Nature shows that ordinary language models can be converted to work directly on bytes using less than 1% of a normal training budget, fixing some long-standing blind spots."
date: 2026-10-11T16:23:00Z
category: Research
hero: /images/articles/language-models-learn-to-read-bytes.jpg
heroAlt: "A flat diagram of many small square tiles in a row, grouped by thin brackets into patches of different lengths that feed into one large rectangular block."
author: Singularity Review
tags: [Tokenization, Language models, Ai2, Open source, Nature]
heroCaption: "Explanatory diagram. Not to scale."
seoDescription: "A Nature paper shows how to convert token-based language models to read raw bytes for under 1% of normal training cost."
takeaways:
  - Most language models read text through a fixed vocabulary of word pieces called tokens, which makes tasks like counting letters surprisingly hard.
  - A team led by researchers at Ai2 and the University of Cambridge converted existing token-based models to read raw bytes, using less than 1% of a typical pretraining budget.
  - Their Bolmo 7B model outperforms an earlier byte-level model of the same size by 16.5 points on science and maths tests and improves sharply on character-level tasks.
  - The code and models are public, but results on programming were mixed and the method still needs the original token-based model as a starting point.
sources:
  - title: Retrofitting language models to operate over bytes
    publisher: Nature
    url: https://www.nature.com/articles/s41586-026-11111-4
    date: "2026-10-07"
  - title: bolmo-core repository
    publisher: Ai2 on GitHub
    url: https://github.com/allenai/bolmo-core
    date: "2026-10-07"
updated: "2026-10-11T16:23:00Z"
section: news
---

Ask a chatbot how many times the letter "r" appears in a long word and it may still get the answer wrong. The reason is not a lack of intelligence in the usual sense. It is that most language models never see letters at all.

Before text reaches a model, a component called a tokenizer chops it into tokens: common words, pieces of words or punctuation, drawn from a fixed vocabulary that usually holds between 30,000 and 300,000 entries. The model then works with token numbers rather than characters. This is efficient, but it leaves models partly blind to spelling, sensitive to small typing variations and less effective in languages the vocabulary handles poorly.

A paper [published in Nature on 7 October 2026](https://www.nature.com/articles/s41586-026-11111-4) describes a cheap way around the problem. Researchers from Ai2 (the Allen Institute for AI), the University of Cambridge, the University of Washington, Imperial College London and LMU Munich show how to convert an existing token-based model into one that reads raw bytes, the basic units computers use to store text.

## Why bytes have been hard

Byte-level models are not new. The obstacle has been cost. Text written in bytes is several times longer than the same text in tokens, so models must do more work per sentence. Previous byte-level systems, such as Meta's Byte Latent Transformer (BLT), also had to be trained from scratch, an expensive undertaking that left them behind the best token-based models.

The new work, which the authors call "byteification", starts from a model that has already been trained. It keeps most of that model and adds a small byte-level front end and back end around it.

## How the conversion works

The front end groups bytes into patches of varying length. A small component called a boundary predictor decides where each patch should end. It is allowed to look one byte ahead, which the authors found makes its decisions far more accurate. Each patch is then passed to the large original model, which does most of the reasoning, much as it previously handled tokens.

Training happens in two stages. First, only the new parts are trained so that they learn to imitate the original model's behaviour while the original stays frozen. Then the whole system is trained together. In total the process used 49.1 billion tokens of training data, which the authors put at less than 1% of a typical pretraining budget.

The team released several converted models. Bolmo 7B and Bolmo 1B come from Ai2's own open Olmo models. To show the method is not tied to one family, they also built Bwen 8B from Alibaba's Qwen3 and Blama 8B from Meta's Llama 3.

![A flat diagram of irregular coloured blocks passing through a perforated circular filter into a grid of dots that resolve into one solid square.](/images/articles/language-models-learn-to-read-bytes-2.jpg)

## What the results show

According to the paper, Bolmo 7B outperforms BLT 7B, the earlier byte-level model of similar size, by 16.5 percentage points on a set of science, technology, engineering and maths tests. The converted models come close to the token-based models they started from on most tasks, with slight drops in some categories. Bwen 8B, built on the stronger Qwen3 model, sometimes surpassed its source. All of them improved strongly on character understanding, the kind of task where token-based models stumble.

The results on programming were mixed. On code tests that count how often the first answer is correct, Bolmo was clearly worse than a token-based model trained on the same data. When it was given 16 attempts and judged on whether any one succeeded, it did better. The authors caution against reading this as proof that byte models produce more varied answers.

Speed is the other question. Because patch length can be adjusted, a model can be made to compress more text into each step. The paper reports that Bolmo overtakes the original Olmo 3 model in prefill speed, the time it takes to read in a prompt, at around 6.6 bytes per patch, and that adjusting this trade-off is easier than changing a tokenizer's vocabulary.

The authors also show a shortcut for adding skills after training. Instead of repeating fine-tuning for the byte model, they transfer the changes from an already fine-tuned token model using task arithmetic, a technique that adds the difference between two sets of model weights to a third.

## Limits

Byteification still depends on a strong token-based model to start from, so it does not remove tokenizers from the training pipeline entirely. The models tested have 1 billion to 8 billion parameters, small by current frontier standards, and the paper does not test the method at the scale of the largest commercial systems. The authors have released the [code](https://github.com/allenai/bolmo-core) and model weights, which makes independent testing possible.

## Why it matters

In our view, the most important claim here is about cost. If converting a model to bytes takes less than 1% of the original training budget, then labs that have already spent heavily on a token-based model can try byte-level versions without starting over. That lowers the price of fixing problems that come from tokenization, including weaknesses in spelling, unusual text and many under-served languages.

Our conclusion is that tokenizers are not about to disappear, but the case for keeping them forever has become weaker. The open release means others can now check whether these gains survive at larger scale.
