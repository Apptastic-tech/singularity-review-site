---
title: "What is AGI? The competing definitions, from DeepMind's levels to OpenAI's charter"
date: 2026-11-18T06:00:38Z
author: "Ararat Ovsepian"
category: "Analysis"
section: featured
summary: "Artificial general intelligence has no single agreed meaning. OpenAI's charter defines it by economic work, Google DeepMind's researchers by levels of performance and breadth, a 2025 paper led by Dan Hendrycks by a psychometric score against a well-educated adult, and François Chollet by how efficiently a system learns new skills. Anthropic's Dario Amodei avoids the word altogether. Meanwhile, the term now carries legal weight in the Microsoft and OpenAI agreement. This explainer sets the definitions side by side and offers a checklist for reading any AGI claim."
description: "AGI has no single agreed meaning. The main definitions side by side, from OpenAI's charter and DeepMind's levels to a psychometric score and Chollet's learning test, and how to read an AGI claim."
seoDescription: "What is AGI? OpenAI's charter, Google DeepMind's Levels of AGI, the Hendrycks AGI score, Chollet's skill-acquisition test and the Microsoft deal, compared with sources."
hero: /images/articles/what-is-agi-competing-definitions.jpg
heroAlt: "Ornate metal chess pieces stand in two rows on a polished wooden board, softly out of focus toward the back"
heroCaption: "Photo by Lou Levit (CC0, via Wikimedia Commons)."
tags: ["AGI", "Definitions", "Google DeepMind", "OpenAI", "Levels of AGI", "Benchmarks", "Explainer"]
takeaways:
  - "There is no single definition. OpenAI's charter defines AGI as highly autonomous systems that outperform humans at most economically valuable work. Google DeepMind researchers rate systems on levels of performance and generality. A 2025 paper led by Dan Hendrycks scores them against a well-educated adult across ten cognitive domains. François Chollet defines intelligence as skill-acquisition efficiency."
  - "The definitions measure different things: economic output, percentile performance across tasks, a psychometric profile, or how fast a system learns something new. A system can meet one and fail another, which is why claims that AGI has or has not arrived often talk past each other."
  - "The word now has legal weight. Under the October 2025 Microsoft and OpenAI agreement, an AGI declaration by OpenAI must be verified by an independent expert panel, and several of Microsoft's rights run until that verification."
  - "Our view: treat AGI as a family of thresholds, not one finish line. Any claim should say which definition it uses, how it was measured and who checked it."
sources:
  - title: "OpenAI Charter"
    publisher: OpenAI
    url: https://openai.com/charter/
    date: "2018-04-09"
  - title: "Levels of AGI for Operationalizing Progress on the Path to AGI"
    publisher: arXiv (Morris, Sohl-Dickstein, Fiedel, Warkentin, Dafoe, Faust, Farabet, Legg)
    url: https://arxiv.org/abs/2311.02462
    date: "2025-09-24"
  - title: "A Definition of AGI"
    publisher: arXiv (Hendrycks and 32 co-authors)
    url: https://arxiv.org/abs/2510.18212
    date: "2025-12-03"
  - title: "On the Measure of Intelligence"
    publisher: arXiv (François Chollet)
    url: https://arxiv.org/abs/1911.01547
    date: "2019-11-25"
  - title: "Machines of Loving Grace"
    publisher: Dario Amodei
    url: https://www.darioamodei.com/essay/machines-of-loving-grace
    date: "2024-10"
  - title: "The next chapter of the Microsoft-OpenAI partnership"
    publisher: Microsoft
    url: https://blogs.microsoft.com/blog/2025/10/28/the-next-chapter-of-the-microsoft-openai-partnership/
    date: "2025-10-28"
faq:
  - q: "What is AGI in simple terms?"
    a: "Artificial general intelligence usually means an AI that is not built for one task but can handle a wide range of tasks at roughly human level or better. Beyond that core idea, definitions differ on what to measure: economic work, performance across tasks, a psychometric profile, or the ability to learn new skills efficiently."
  - q: "How does OpenAI define AGI?"
    a: "OpenAI's charter defines AGI as 'highly autonomous systems that outperform humans at most economically valuable work'. The definition focuses on what systems can do, not how they work."
  - q: "What are Google DeepMind's levels of AGI?"
    a: "A paper by Google DeepMind researchers rates systems by performance and generality. Its levels are Emerging (equal to or somewhat better than an unskilled human), Competent (at least the 50th percentile of skilled adults), Expert (90th percentile), Exceptional (99th percentile) and Superhuman (outperforms 100 percent of humans). Its table lists Competent AGI and every level above it as not yet achieved."
  - q: "Has anyone measured how close current AI is to AGI?"
    a: "One attempt is 'A Definition of AGI', a 2025 paper led by Dan Hendrycks. It scores models across ten cognitive domains against a well-educated adult and reports GPT-4 at 27 percent and GPT-5 at 57 percent. That is one framework's score, not a consensus measurement."
  - q: "Who decides when AGI has been reached?"
    a: "There is no general authority. In one contract, the October 2025 Microsoft and OpenAI agreement, an AGI declaration by OpenAI must be verified by an independent expert panel before certain terms change."
---

*Editor's note: this explainer is written by the editor of Singularity Review. Where I quote a definition, I use the exact words from the document I opened, and I link to it. The section headed "Our view" is my opinion.*

AGI, short for artificial general intelligence, is the most used and least agreed term in AI. Labs name it as their goal, investors price it, and critics say it is a moving target. Yet when you put the main definitions side by side, they are not measuring the same thing. One counts economic work. One rates performance across tasks. One gives a psychometric score. One asks how quickly a system learns something new. This explainer sets them out, shows where they disagree, and ends with a short checklist for reading any claim that AGI is near, here, or far away.

On 16 November we looked at Shane Legg's argument that human intelligence is not the ceiling, and his own forecast. This piece is the reference guide behind that debate: what people actually mean when they use the word.

## Where the term came from

A paper by Google DeepMind researchers, "Levels of AGI", traces the original use of "artificial general intelligence" to a 1997 article about military technologies by Mark Gubrud. Gubrud described "AI systems that rival or surpass the human brain in complexity and speed, that can acquire, manipulate and reason with general knowledge". The paper credits Shane Legg, one of its co-authors, and Ben Goertzel with popularising the term among computer scientists in 2001, as a machine able to do the cognitive tasks that people can typically do.

The core idea has stayed stable: an AI that is general, not built for one task. What has never settled is how to tell when a system is general enough, and good enough, to count.

## Definition 1: economically valuable work

OpenAI's charter gives the best known one-line definition. Its mission is to ensure that AGI, "by which we mean highly autonomous systems that outperform humans at most economically valuable work", benefits all of humanity.

This definition is practical. It judges a system by results and ignores how it works inside. It also has limits, which the DeepMind paper spells out. Some things associated with intelligence, such as artistic creativity or emotional intelligence, may not have a well-defined economic value. And framing AGI by economic value seems to imply that a system must be deployed to count, when a system could be capable of important work and still not be used for legal, ethical or social reasons.

## Definition 2: levels of performance and generality

The "Levels of AGI" paper, first posted in November 2023 and last revised in September 2025, does not give one threshold. It reviews nine earlier definitions and proposes six principles any useful definition should meet. In short, a definition should focus on capabilities rather than processes, on generality and performance together, on cognitive and metacognitive tasks rather than physical ones, on potential rather than deployment, on ecologically valid tasks that people actually value, and on the path to AGI rather than a single endpoint.

From those principles it builds a grid. One axis is breadth, narrow or general. The other is depth, in five levels:

- **Level 1, Emerging:** equal to or somewhat better than an unskilled human.
- **Level 2, Competent:** at least the 50th percentile of skilled adults.
- **Level 3, Expert:** at least the 90th percentile of skilled adults.
- **Level 4, Exceptional:** at least the 99th percentile of skilled adults. Earlier versions called this level "Virtuoso".
- **Level 5, Superhuman:** outperforms 100 percent of humans.

In the paper's own table, chatbots such as ChatGPT, Bard, Llama 2 and Gemini were placed at Emerging AGI, while Competent AGI and everything above it were marked "not yet achieved". The value of this approach is that it replaces a yes or no question with a scale. The cost is that someone still has to choose which tasks count and how to test them, and the paper says those benchmarks remain a challenge.

## Definition 3: a psychometric score

In October 2025 a group of 33 authors led by Dan Hendrycks published "A Definition of AGI". It states the target plainly: "AGI is an AI that can match or exceed the cognitive versatility and proficiency of a well-educated adult."

To make that measurable, the authors borrow from human psychology. They use the Cattell-Horn-Carroll theory of cognitive abilities, which they describe as the most empirically validated model of human cognition, and split general intelligence into ten domains, each weighted equally at 10 percent: general knowledge, reading and writing, mathematical ability, on-the-spot reasoning, working memory, long-term memory storage, long-term memory retrieval, visual processing, auditory processing and speed.

Applied to current models, the framework produces a single score. The paper reports GPT-4 at 27 percent and GPT-5 at 57 percent. It also describes the profile as "jagged". Models are strong in knowledge, reading and writing, and maths, but weak in what the authors call foundational cognitive machinery. Long-term memory storage, which they describe as the ability to continually learn, scores near zero.

This is the most concrete definition on the list. It is also the most dependent on its choices: which ten domains, which tests, and the decision to weight them equally.

## Definition 4: how efficiently a system learns

François Chollet came at the problem from the other side in his 2019 paper "On the Measure of Intelligence", which also introduced the ARC benchmark (the Abstraction and Reasoning Corpus). He argues that measuring skill at a given task is not enough, because skill "is heavily modulated by prior knowledge and experience". With unlimited priors or training data, he writes, experimenters can "buy" arbitrary levels of skill, which hides how well the system actually generalises.

His alternative defines intelligence as "skill-acquisition efficiency": how much a system can learn from a given amount of experience and prior knowledge. On this view, a model that scores highly because it has seen almost everything is not necessarily more intelligent than one that learns a new task from a handful of examples. This is a definition of intelligence rather than of AGI, but it shapes how many researchers judge AGI claims.

## Definition 5: avoid the word

Some leaders prefer not to use the term. In his October 2024 essay "Machines of Loving Grace", Anthropic's chief executive Dario Amodei writes about "powerful AI" instead, adding in a footnote: "I find AGI to be an imprecise term that has gathered a lot of sci-fi baggage and hype." His description of powerful AI is a system that "is smarter than a Nobel Prize winner across most relevant fields", which he summarises as a "country of geniuses in a datacenter".

That sets a higher bar than the "well-educated adult" of the Hendrycks paper, and it is framed by what the system could do rather than by a test score.

## Definition 6: a contract term

The word now has legal consequences. On 28 October 2025, Microsoft described its new agreement with OpenAI. Under it, once AGI is declared by OpenAI, "that declaration will now be verified by an independent expert panel". Microsoft's rights to OpenAI's research IP run until the panel verifies AGI or through 2030, whichever comes first, and the revenue share remains until the panel verifies AGI.

The announcement does not say which definition the panel will use. But it shows why the question is no longer academic. Billions of dollars and the control of research now turn on how a small group of experts reads the word.

## Why the definitions disagree

Put side by side, the definitions answer different questions:

- **What does it produce?** OpenAI's charter: economic work.
- **How well and how widely does it perform?** The DeepMind levels: percentiles across a range of tasks.
- **How does its profile compare with a person's?** The Hendrycks score: ten cognitive domains.
- **How fast does it learn?** Chollet: efficiency from limited experience.
- **What could it do for the world?** Amodei: a country of geniuses.

These can come apart. A system trained on vast data might do a lot of economically valuable work while still scoring poorly on learning efficiency. Another might reach Competent level on many tasks and still fail long-term memory tests. That is why one person can say AGI is close and another can say it is far away, and both can be right about their own definition.

## How to read an AGI claim

When a company, researcher or headline says AGI has arrived or is a few years away, these questions help:

1. **Which definition?** Economic, levels, psychometric, learning efficiency, or something unstated.
2. **Measured how?** A benchmark, a set of tasks, a deployment record, or a forecast.
3. **Compared with whom?** An unskilled person, a skilled adult, a well-educated adult, or the best experts.
4. **Checked by whom?** The company itself, independent researchers, or a panel such as the one in the Microsoft agreement.
5. **What is missing?** Most frameworks admit gaps, such as continual learning or physical tasks.

## Our view

My view is that AGI is better treated as a family of thresholds than as a single finish line. The DeepMind levels and the Hendrycks score are useful precisely because they replace a yes or no argument with a map of where systems are strong and where they are not. Chollet's point is a needed check on both: a high score earned by memorising the world is not the same as the ability to learn something new.

The definition I would watch most closely is the least scientific one: the contract. When an expert panel decides whether AGI has been reached for commercial purposes, its reading of the word will shape public expectations far more than any paper. Readers should ask any AGI claim to name its definition, show its measurements and say who checked it. If it cannot do all three, it is a forecast, not a finding.
