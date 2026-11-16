---
title: "Shane Legg's case that human intelligence is not the ceiling, and what it would take"
date: 2026-11-16T06:00:00Z
author: "Ararat Ovsepian"
category: "Analysis"
section: featured
summary: "Google DeepMind co-founder Shane Legg argues that human intelligence cannot be the upper limit, because brains trail data centres by six to eight orders of magnitude on energy, size, signal rate and signal speed. His route there starts with a minimal AGI he still puts at 50 percent by 2028, then needs fixes to continual learning and visual reasoning, and ends in open questions about safety, economics and what superintelligence even means."
description: "Shane Legg says human intelligence is not the ceiling. His argument, his 2028 forecast, the gaps that still have to close, and the caveats he states himself."
seoDescription: "Shane Legg argues human intelligence is not the ceiling for AI. His physical argument, his 2028 forecast and what it would take, with sources."
hero: /images/articles/shane-legg-human-intelligence-not-the-ceiling.jpg
heroAlt: "Linocut style illustration of a tall wooden ladder rising through a round opening in a stone ceiling toward a starry sky"
heroCaption: "Illustration: Singularity Review."
tags: ["Shane Legg", "Google DeepMind", "AGI", "Superintelligence", "Levels of AGI", "AI safety", "Continual learning"]
takeaways:
  - "The argument: Legg compares a brain (about 20 watts, a few pounds, signals of roughly 100 hertz travelling at about 30 metres a second) with a data centre (he suggests 200 megawatts, millions of pounds, 10 billion hertz, the speed of light). He counts six, seven or maybe eight orders of magnitude of headroom in each of four dimensions, and concludes the ceiling is not human."
  - "The timeline: he still gives minimal AGI, meaning an AI that can do the cognitive tasks people typically do, a 50 percent chance by 2028. In a University of Auckland profile published on 11 November he says it will probably arrive 'next year or the year after'. Full AGI, he said last December, would follow within a decade."
  - "What it would take: fixes to continual learning and visual reasoning that need new algorithms and architecture, not just bigger models; testing and monitoring because 100 percent reliability is not a thing; and a serious rethink of how a post-AGI economy shares out wealth."
  - "The caveat in his own words: whether some tasks will stay near human level because of computational complexity is an open question, and superintelligence has no definition he is happy with."
sources:
  - title: "The arrival of AGI | Shane Legg (co-founder of DeepMind)"
    publisher: Google DeepMind (podcast with Hannah Fry)
    url: https://www.youtube.com/watch?v=l3u_FAv33G0
    date: "2025-12-11"
  - title: "Google DeepMind founder returns to campus"
    publisher: University of Auckland
    url: https://www.auckland.ac.nz/en/news/2026/11/11/shane-legg-google-university-auckland-business-school.html
    date: "2026-11-11"
  - title: "Shane Legg: human intelligence is not the upper limit (Short)"
    publisher: Singularity Clips
    url: https://www.youtube.com/shorts/-o76ZIq0o6k
    date: "2026-11-15"
  - title: "Position: Levels of AGI for Operationalizing Progress on the Path to AGI"
    publisher: arXiv (Morris, Sohl-Dickstein, Fiedel, Warkentin, Dafoe, Faust, Farabet, Legg)
    url: https://arxiv.org/abs/2311.02462
    date: "2025-09-24"
  - title: "Universal Intelligence: A Definition of Machine Intelligence"
    publisher: arXiv (Legg and Hutter)
    url: https://arxiv.org/abs/0712.3329
    date: "2007-12-20"
  - title: "An Approach to Technical AGI Safety and Security"
    publisher: arXiv (Shah et al., including Legg)
    url: https://arxiv.org/abs/2504.01849
    date: "2025-04-02"
faq:
  - q: "What is Shane Legg's argument that human intelligence is not the ceiling?"
    a: "On the Google DeepMind podcast he compared a brain with a data centre on energy use, size, signal rate and signal speed, and said machines have six, seven or maybe eight orders of magnitude of headroom in all four at once. From that he concluded that human intelligence is 'absolutely not' the upper limit of what is possible."
  - q: "What does Legg mean by minimal AGI?"
    a: "An artificial agent that can at least do the kinds of cognitive things people can typically do. He distinguishes it from full AGI, which would match the full spectrum of human cognition including extraordinary feats, and from artificial superintelligence, which would go far beyond it."
  - q: "When does Legg expect AGI?"
    a: "He keeps a 50 percent chance of minimal AGI by 2028, and told the University of Auckland it will probably arrive next year or the year after. On the podcast he said full AGI could follow three to six years later and should come within a decade."
  - q: "What still has to be solved before AGI?"
    a: "Legg names continual learning and visual reasoning as remaining weaknesses. He says he sees no fundamental blockers and expects algorithmic and architectural changes, not simply more data or bigger models."
  - q: "Does Legg think superintelligence is certain?"
    a: "No. He says he thinks it will happen, but also asks whether some tasks might not improve much beyond human level because of computational complexity, and says that every definition of superintelligence he has tried has significant problems."
---

*Editor's note: this is analysis by the editor of Singularity Review. Where I quote Shane Legg, I use his own words from a transcript or page I opened, and I link to them. The section headed "Our view" is my opinion.*

Shane Legg is a co-founder of DeepMind, now Google DeepMind, and is credited with popularising the term artificial general intelligence, or AGI: an AI that is not built for one task but can do many. He has a short, blunt answer to a question many people treat as philosophy. Is human intelligence the upper limit of what is possible? "I think absolutely not," he said on the Google DeepMind podcast with Hannah Fry in December 2025.

The question is back in the news. On 11 November the University of Auckland, where Legg studied, announced that he will give a public lecture titled "AGI Incoming" on 4 December, and repeated his long-standing forecast. A 61-second clip of the key passage was posted on 15 November to the Singularity Clips channel. This article lays out the argument and what Legg says still has to happen.

[Watch the 61-second Short on Singularity Clips](https://www.youtube.com/shorts/-o76ZIq0o6k)

## The argument: a brain against a data centre

Legg does not argue from a benchmark score. He argues from physics. In the podcast, which I read in its auto-generated English transcript, he describes the brain as "a mobile processor" that "weighs a few pounds" and "consumes I think around 20 watts". The signals between neurons, he says, run at a frequency "on the channel" of about 100 hertz, or perhaps 200 in the cortex, and travel as electrochemical waves at "about 30 m/s".

Then the comparison. A data centre, he says, could draw 200 megawatts instead of 20 watts, and weigh "several million pounds" instead of a few. It could run at "10 billion hertz on the channel" instead of 100, and send signals at "the speed of light 300,000 kilometers/s" instead of 30 metres a second. In terms of energy consumption, space, bandwidth and speed of signal propagation, he says, "you've got six, seven, maybe eight orders of magnitude in all four dimensions simultaneously." An order of magnitude is a factor of ten, and his figures check out: 200 megawatts over 20 watts is ten million times, 10 billion hertz over 100 hertz is one hundred million times, and the speed of light over 30 metres a second is ten million times.

His conclusion follows in one line: "Is human intelligence going to be the upper limit of what's possible? I think absolutely not." The analogy he uses is to machines we already accept. Humans "can't outrun a top fuel dragster over 100 meters", cannot lift more than a crane, cannot see further than the Hubble telescope. "I think we'll see that in cognition as well," he adds, noting that for information storage, "you don't know more than Google".

## What the formal work says

In 2007 Legg and Marcus Hutter proposed a formal definition of machine intelligence: "Intelligence measures an agent's ability to achieve goals in a wide range of environments." The definition is deliberately not tied to human brains. It is meant to apply to "a wide range of systems", and it comes with a theoretical upper bound, an idealised agent called AIXI. The paper is frank that this bound cannot be computed, and that even if it could, working out its decisions "would be practically infeasible".

On humans, the same paper is cautious and surprisingly modest: "Perhaps the amount of universal machine intelligence that a human has is not that high compared to some machine learning algorithms? It is difficult to know without experimental results."

The Google DeepMind paper "Levels of AGI", first posted in 2023, revised in 2025 and co-written by Legg, turns the idea into a scale. Its top level, Level 5 "Superhuman", means outperforming 100 percent of humans. The paper says this already exists for narrow tasks: it lists AlphaFold, AlphaZero and Stockfish as Level 5 narrow systems. The general version, artificial superintelligence, it marks as "not yet achieved". So the ceiling claim has two parts. For individual tasks, machines have already passed the best humans. The question is whether one system can do that across the board.

## What it would take

Legg is clear that the physical headroom does not by itself deliver a superhuman mind. The route he describes has stages.

**Stage one: minimal AGI.** He defines it as "an artificial agent that can at least do the kinds of cognitive things people can typically do". He says today's systems are uneven: they speak around 150 languages and have phenomenal general knowledge, yet "they still fail to do things that we would expect people typically be able to do". His two named weak spots are continual learning, meaning picking up new skills over an extended period the way a new employee does, and reasoning about scenes and diagrams, for example saying which of two cars is bigger when perspective matters, or counting the spokes leaving one node of a graph.

His view is that these can be fixed. "I don't think there are fundamental blockers on any of these things," he says. The fix is not one thing. In some cases it is more of a particular kind of data. In others it needs "algorithmic and architectural changes": for continual learning, he sketches a retrieval system acting as an episodic memory, with that information later trained back into the underlying model.

His timeline has barely moved. Asked on the podcast whether he still holds a 50 percent chance of minimal AGI by 2028, he answered "Yes" and said it is visible on his blog from 2009. The Auckland profile says he made the prediction more than 20 years ago and quotes his current view: "I think we're getting very close and will probably reach this next year or the year after as some of the remaining cognitive weaknesses of our AI models are getting addressed." He adds that the models are "already clearly superhuman in many areas".

**Stage two: full AGI.** This would match "the full spectrum of what's possible with human cognition", including the rare feats of an Einstein or a great composer. Legg guesses this comes "some years later... three, four, five, six years later" and "within a decade".

**Stage three: beyond.** Here he is least certain. Artificial superintelligence, he says, has no clear definition: "Every definition I've ever come up with has some sort of significant problems." In vague terms it is an AGI so capable in general that it is "somehow far beyond" what humans can reach. He also asks whether it will arrive "quickly, slowly, never", and whether there are tasks where, "because of the computational complexity or whatever", an AI is "not actually going to be much better than humans". That is a real caveat, stated by the person making the argument.

## The conditions: safety and the economy

The same conversation spends much of its time on what has to be true for a superhuman system to be good news. Legg's safety agenda is what he calls "system two safety": using the visible chain of thought of reasoning models to check how a system reasons about ethics, and hoping that this reasoning can become "really really tight". He does not claim a guarantee. "You can't guarantee everything," he says, and "100% reliability is not a thing". Instead he lists testing before release, monitoring in deployment, interpretability, and the ability to "roll back and stop" a system when failure cases go beyond what is acceptable.

He is explicit about why this matters: "If we can't stop the development towards super intelligence because of competitive dynamics globally... then we need to think really hard about how do we make a super intelligence super ethical."

A 2025 Google DeepMind paper with Legg among its authors names four areas of risk: misuse, misalignment, mistakes and structural risks. It focuses on the first two, and proposes two lines of defence against misalignment: model-level mitigations such as amplified oversight and robust training, and system-level measures such as monitoring and access control that limit harm even if the model is misaligned.

On the economy, Legg says the change is large: "It means a massive transformation." The current system, in which people trade mental and physical labour for access to resources, "may not work the same anymore". The pie should get much bigger, he says, so the problem is distribution, and "there needs to be a lot more thought going into this of how a post AGI economy works". In the near term he expects AI to move from a useful tool to doing really valuable economic work, unevenly, starting with fields like software engineering.

Work that is not purely cognitive, such as plumbing, should be more protected. In the Auckland profile he adds that "most work isn't purely cognitive".

## Our view

This is opinion. Legg's argument is strong on one point and weaker on others.

It is strong on possibility. Nothing in neuroscience or physics suggests that the human brain sits at the maximum for intelligence, and Legg's own 2007 paper treats humans as just one agent among many. The orders-of-magnitude comparison is a fair way to show how much raw room there is.

It is weaker as a prediction. Headroom in watts and hertz is not the same as headroom in intelligence. A data centre running 10 billion cycles a second does not yet reason better than a person who runs at 100, and Legg himself says the missing pieces are algorithmic. The numbers are also his spoken estimates, not measurements, and he is the co-founder and chief AGI scientist of a company that is building these systems. That does not make him wrong, but his timelines deserve the weight of any insider's forecast.

I would give more weight to the testable parts of what he says. He proposes a way to find out: build a large suite of tasks where typical human performance is known, then, if an AI passes, let a team spend months probing it for a cognitive task people can do and it cannot. If they cannot find one, "most practical purposes, we're there". That is a falsifiable standard, which is rarer than it should be in this debate.

What to watch next: whether the two named weaknesses, continual learning and visual reasoning, close in the next year or so, as his 2028 date requires; what he says in Auckland on 4 December; and whether the work on distribution that he asks for appears before the capability does. The ceiling question matters because it changes what we have to prepare for. If the ceiling is not human, then the question stops being whether to prepare, and becomes how fast.
