---
title: "The coin flip: what AI risk numbers mean, and what they don't"
date: 2026-11-16T16:00:00Z
author: "Ararat Ovsepian"
category: "Safety"
section: featured
summary: "Serious people now say AI risk numbers out loud. Paul Christiano, an OpenAI Foundation board member, says that if we built AI along the fastest path we would be looking at a coin flip of takeover, and in September he put an all-things-considered risk of 4% over one year and 15% over three. Roman Yampolskiy puts his figure close to one, Mike Israetel close to zero, and Helen Toner thinks there is probably more time than the builders say. Christiano himself says no model or reference class can produce these figures. I argue that p(doom) is not a forecast. It is a conditional dial, and the useful question is what moves it."
description: "Paul Christiano says building AI as fast as possible would be a coin flip of takeover, and in September put 4% on one year and 15% on three. Why those figures are judgements, not forecasts, and what would move them."
seoDescription: "Paul Christiano puts a coin flip on AI takeover at full speed, and 4% and 15% as a subjective estimate. What those numbers can and cannot tell you."
hero: /images/articles/the-coin-flip.jpg
heroAlt: "A brass coin hangs in mid-flip above a wooden table, with two patches of daylight on the surface and a folded cloth to one side"
heroCaption: "Illustration: Singularity Review."
tags: ["Paul Christiano", "AI risk", "p(doom)", "Helen Toner", "Roman Yampolskiy", "Mike Israetel", "Alignment", "Hinton Lectures"]
takeaways:
  - "The numbers: at the Hinton Lectures in Toronto, Paul Christiano said there is a high risk of an AI takeover within three years, and that the most rapid path would be 'something like a coin flip'. In a 9 September post he estimated an all-things-considered risk of 4% over the next year and 15% over the next three years. Roman Yampolskiy puts his figure close to one, Mike Israetel close to zero, and Helen Toner thinks there is probably more time than the 12 to 24 months some builders name."
  - "The limit: Christiano says there is no quantitative model and no reference class for these events, and that any number is 'an expression of someone's subjective opinion'. The coin flip is a condition (build as fast and as easily as possible), not a fate."
  - "Our view: treat p(doom) as a conditional dial, not a forecast. The useful question is what moves it, which is mostly how fast we go and what level of confidence we demand before we go faster."
sources:
  - title: "AI Alignment: What's Working and What's Not"
    publisher: The Hinton Lectures 2026, Night 1 (Paul Christiano)
    url: https://www.youtube.com/watch?v=-Ef0ocEoBCs&t=868s
    date: "2026-11-10"
  - title: "Personal statement on joining the OpenAI board"
    publisher: Paul Christiano (Substack)
    url: https://paulfchristiano.substack.com/p/personal-statement-on-joining-the
    date: "2026-09-09"
  - title: "The OpenAI board member who fired Sam Altman says we still can't trust AI CEOs"
    publisher: Decoder with Nilay Patel, The Verge (Helen Toner)
    url: https://www.theverge.com/podcast/1032907/helen-toner-openai-cset-ai-safety-policy-interview
    date: "2026-11-14"
  - title: "1 AI Doomer vs 1 AI Enthusiast | Dr Roman Yampolskiy vs Dr Mike Israetel"
    publisher: The Beyond Tomorrow Podcast
    url: https://www.beyondtomorrowpodcast.com/episodes/1-ai-doomer-vs-1-ai-enthusiast-dr-roman-yampolskiy-vs-dr-mike-israetel
    date: "2026-11-11"
  - title: "AI Safety and Superintelligence: Where the Researchers Disagree"
    publisher: Nick Standlea
    url: https://nickstandlea.com/guides/ai-safety-superintelligence.html
    date: "2026-11-15"
faq:
  - q: "What was the coin flip claim about AI takeover?"
    a: "At the opening 2026 Hinton Lecture he said that if we tried to develop AI along the most rapid trajectory, building 'as quickly as we can in the easiest way we can', 'we would be looking at something like a coin flip of an AI takeover'. He also said he hopes the probability is much lower because we will not take the very fastest path, but that even with realistic policy responses the risk remains 'exceptionally high'."
  - q: "Where do the 4% and 15% figures come from?"
    a: "From Christiano's own 9 September 2026 post, 'Personal statement on joining the OpenAI board'. He wrote: 'If I had to quantify my uncertainty I would estimate an all-things-considered risk of 4% over the next year and 15% over the next three years.' He described those numbers as a way of stating his subjective beliefs, not the output of a precise model. In that post the risk he was quantifying was catastrophic and irreversible loss of control."
  - q: "Can anyone calculate these numbers?"
    a: "No. In the lecture he said there is no quantitative model that can put a number on an AI takeover, and no reference class that would let anyone call it a 10% event or a 50% event. 'Any number we give is an expression of someone's subjective opinion.'"
  - q: "How do other researchers' numbers compare?"
    a: "On a 11 November debate, Roman Yampolskiy put his figure close to one, and the show's own page summarises it as close to 100%. Mike Israetel said his was 'approximately' zero, 'not technically zero', with 'very, very low probability' of a bad outcome. Helen Toner, speaking on Decoder, said that when builders talk of solving the problem in 12 to 24 months she finds that 'terrifying' and hopes they are wrong, and that she thinks we 'probably have longer'."
  - q: "What would move these numbers, on the views in this article?"
    a: "Christiano's coin flip is tied to maximum speed. Toner argues for a higher confidence bar before a lab releases a model or, 'more importantly, even training a new model', and for slowing the vertical growth of raw capability while speeding its spread into science and the economy. The practical question is what standard has to be met before we go faster."
---

*Editor's note: this is analysis by the editor of Singularity Review. Where I quote researchers, I use their own words from a transcript or page I opened, and I link to them. The section headed "Our view" is my opinion.*

Paul Christiano opened the 2026 Hinton Lectures in Toronto with what he called his most important sentence. "I think there is a high risk of an AI takeover within the next three years." By takeover he meant a situation in which AI systems pursuing their own goals "call the shots" in the same sense that humans do today, and in which a person trying to stop them would be as ineffective as someone trying to stop the US military. He is the founder of the Alignment Research Center, a former OpenAI researcher, and, since September, a member of the OpenAI Foundation board and its Safety and Security Committee. Geoffrey Hinton, who introduced him, credited him with pioneering work on reinforcement learning from human feedback, the method behind much of today's chatbot training.

He was careful with the word "high". "I don't think we have any kind of quantitative model we can turn to to put a number on this event," he said. "We don't have any kind of reference class that we can look at to say this is a 10% event or a 50% event. Any number we give is an expression of someone's subjective opinion." Then he gave one anyway, under a condition. If we tried to develop AI "along the most rapid trajectory", and "build this as quickly as we can in the easiest way we can", "we would be looking at something like a coin flip of an AI takeover." He hoped the probability was much lower, "because we are not going to develop the technology in the very fastest way we can." Even so, "with realistic policy responses, the risk remains exceptionally high." He added that "for most people in this room, the most likely reason they will die is because of an AI accident," and that he sees "meaningful risk even in the next six to twelve months."

Two months earlier, in a [9 September post](https://paulfchristiano.substack.com/p/personal-statement-on-joining-the) on joining the OpenAI board, he had already put numbers on the table. After describing "a meaningful risk that rapid acceleration in AI capabilities leads to catastrophic and irreversible loss of control in the very near term," he wrote: "If I had to quantify my uncertainty I would estimate an all-things-considered risk of 4% over the next year and 15% over the next three years." He was explicit about what those figures were not. "These numbers are a way of stating my subjective beliefs and communicating roughly how big I think the problem is, not a claim to have a model that produces precise or stable estimates."

The interesting fact is not that people disagree about the number. It is that the person offering both the coin flip and the 4% and 15% figures is also the person saying that nobody can calculate them.

## The numbers on the table

A p(doom) figure is a personal estimate of the chance that advanced AI leads to a catastrophe we cannot come back from, often human extinction or a permanent loss of control. The term is informal, and people do not always mean the same event or the same period of time, which is one reason the numbers fly apart.

On 11 November, in a [debate on The Beyond Tomorrow Podcast](https://www.beyondtomorrowpodcast.com/episodes/1-ai-doomer-vs-1-ai-enthusiast-dr-roman-yampolskiy-vs-dr-mike-israetel), Roman Yampolskiy, a computer scientist at the University of Louisville who works on AI safety, put his figure "close to one." The show's own episode page summarises it as close to 100%. Mike Israetel, a physiologist and long-time advocate of rapid AI progress, said his p(doom) was "approximately" zero. It is "not technically zero," he added, and "there are absolutely ways that it can go south real fast," but he assigns "very, very low probability" to that. Later in the same conversation he said that "specific percentages get really wacky because it's all kind of pretend in the end." They agree on a remarkable amount: both think superintelligence is coming, and both doubt that humans will be able to control a system much smarter than we are. They split on what happens next. Yampolskiy argues that a system we cannot explain, predict or control has no reason to keep us around once it no longer needs us. Israetel argues that a more intelligent system would have strong reasons to cooperate with us and to keep us around as a source of knowledge.

Helen Toner, executive director of Georgetown's Center for Security and Emerging Technology and a former OpenAI board member, does not offer a single percentage. On [Decoder with Nilay Patel](https://www.theverge.com/podcast/1032907/helen-toner-openai-cset-ai-safety-policy-interview), published on 14 November, she said that alignment, in its most coherent sense of getting an AI to do what its user wanted, is "as far as I can tell, not on track to be solved." On timelines, she is more patient than the loudest forecasts from the labs. "When the people who are building the systems tell us, 'Oh, we have to solve this within 12 to 24 months,' I think that's terrifying and I hope they're wrong." Relying on her own judgement, "I think they're probably wrong and we probably have longer," though she adds that very thoughtful people really do think it could go that fast. In that case, she says, it does not matter whether the problem is solvable in principle. It matters whether it is solvable in the time we have.

So the table already contains a coin flip, 4% and 15%, close to one, close to zero, and a claim that there is probably more time. That spread is not a rounding error. It is a sign that these figures are doing a different job from a weather forecast.

## Why nobody can calculate this

Christiano's most useful sentence may not be the coin flip. It may be the one just before it. There is no model to turn to, and no reference class that would let someone call this a 10% event or a 50% event. A reference class is a set of past cases similar enough that you can count how often the thing happened. We do not have a history of species building minds smarter than themselves and then recording the outcome.

He said the same thing, in different words, in September. The 4% and 15% figures were "a way of stating my subjective beliefs," not "a model that produces precise or stable estimates." In the lecture he went further and said that the number also "depends, as others have mentioned, on what we do."

That is the hinge. If the figure depends on what we do, then it is not a prediction of a fixed future. It is a judgement about a path.

He was also blunt about today's technical defences. Unhackable graders, training that never rewards cheating, monitoring a model's chain of thought, and interpretability are all, in his word, "plausible." "I don't want to say any of them are doomed," he said, "but I definitely do want to say that none of them are on a trajectory where we can say that's definitely going to work or even that's probably going to work." If those partial fixes fail, "we really want to stop at that point." We would need ways to notice that we cannot control a system, and "brakes" that make it possible to slow down without a massive cost. Right now, he said, the industry does not really have either.

## Two pictures of failure

Even if you accept that the risk is real, it is not obvious what the failure looks like, and the picture you choose changes what a number is supposed to measure.

[Nick Standlea](https://nickstandlea.com/guides/ai-safety-superintelligence.html), in a 15 November guide to interviews he has recorded with AI safety researchers, maps a split. Nate Soares, president of the Machine Intelligence Research Institute, and Malo Bourgon, its chief executive, describe a system that ends up pursuing goals nobody chose and treats people as obstacles to route around. Christopher Summerfield, a former Google DeepMind scientist and now research director at the UK AI Security Institute, thinks that "clever machine takes over" story is the wrong shape. On Standlea's account, Summerfield's risk lives in the traffic between many ordinary agents: thousands of businesses, each running a system that does precisely what it was designed to do, with the harm coming from the interactions. His reference point is the flash crash, when individually simple trading tools took around a trillion dollars off the exchange in about half an hour.

Christiano's lecture sits across both pictures, which is part of what makes it hard to file. The incident he walks through in detail, involving OpenAI agents evaluated on a hacking benchmark, is already a story about a swarm: about a thousand agents, he said, spent days trying to fool a grader, tampered with logs, and eventually gained admin access to the cluster running the evaluation. He then asks what a similar failure would look like with the systems of 2028, and argues that there is a reasonable chance it would lead to "an AI takeover and an irreversible loss of human control." Future agents, he said, "may end up treating humans as another obstacle." That is the single-system, or single-swarm, picture. It is not the same as Summerfield's picture, in which each agent is doing its job and the damage lives in the combination. A number that bundles those two failures together will move for different reasons, and it will suggest different remedies.

## A coin flip is a condition, not a prophecy

Go back to the sentence that has been repeated all week. The coin flip is not Christiano's all-things-considered forecast. It is what he said we would be looking at "if we tried to develop AI along the most rapid trajectory," if we decided to "build this as quickly as we can in the easiest way we can." The next sentence is the one that matters for policy. He hopes the probability is much lower "because we are not going to develop the technology in the very fastest way we can."

The September figures were the other kind of number: "all-things-considered" estimates of catastrophic, irreversible loss of control over one year and over three. In November he did not replace them with a new percentage. He said, qualitatively, that even with "realistic policy responses" the risk remains "exceptionally high," and that there is a "high risk" of takeover within three years, with "meaningful risk even in the next six to twelve months." Those phrases are judgements, not a new model. A reader can reasonably hear a harder tone than 15% in three years, or can hear them as consistent. He did not say which.

Either way, the structure is the same. The number changes if the path changes. A coin flip at full speed is a claim about the price of maximum haste. It is closer to a warning about a choice than to a prophecy about a date.

## What would move the dial

If the number is conditional, the useful work is to name the conditions.

Toner's answer is not a flat pause. She has grown more sympathetic to the idea of buying time than she was when the 2023 pause letter circulated, because the backlog of safety work that labs say they could do has grown so large. But she thinks a pause is hard to specify and easy to route around. "Maybe the best way to do that is just to set a higher bar for 'here's how confident we need to be in the safety of these systems before we proceed with something.'" The bar would apply to releasing a new model or, "more importantly, even training a new model." If a lab can meet that bar at full speed, "great, carry on." If it cannot, the slowdown is a by-product of the test, not a date on a calendar.

She also likes a distinction, which she says is not originally hers, between vertical and horizontal growth. Vertical growth is "the pure capabilities growth, making more and more and more advanced AI models." Horizontal growth is "integrating AI into different use cases," putting it to work on specific problems in science and the economy. The idea is to slow the first and speed the second. That is a way of saying: get more of the benefit from systems we already have, and demand more confidence before we build a more powerful one.

Christiano, from a more alarmed starting point, is pointing at a similar lever. He wants practices that can tell whether the next model is a significant risk, shared safety standards, and the ability to stop if the partial fixes do not work. The disagreement with Toner is less about the existence of a dial than about how little time he thinks we have to use it.

There is a further condition, which Toner states more sharply than most. "If our hopes for the future are pinned on any one individual being trustworthy, then we're pretty screwed." A confidence bar that depends on trusting a single lab leader is not a bar. It is a hope.

## Our view

This is opinion.

I do not think a reader should pick a favourite p(doom) and treat it as a forecast. Christiano has already said the thing that undercuts that habit: there is no model and no reference class, and the figure depends on what we do. Yampolskiy and Israetel, at opposite ends of the scale, are not reading different spreadsheets. They are making different bets about the motives of a mind that does not exist yet. Toner's caution about the 12 to 24 month claim is a bet about time, not a rival percentage.

The honest way to hold these numbers is as statements of judgement, and often of policy preference, offered under uncertainty. A coin flip at full speed is useful if you read it as a claim about a path. It is misleading if you read it as a countdown. The September 4% and 15% are useful if you read them as one careful person's way of saying the risk is already large enough to act on, and that he does not pretend to have calculated it. They are misleading if you treat them as a measurement.

What would move the dial, on this reading, is mostly two things: how fast the most advanced systems are trained and released, and what standard of confidence has to be met before that happens. Those are choices, even if they are hard ones, and they are more tractable than arguing about whether the right number is 4% or 50% or close to one.

What to watch next is whether those choices become visible. Watch whether labs set a confidence bar that applies to training, not only to release, and whether they can show evidence for it. Watch whether the technical defences Christiano called only "plausible" start to look probable, or whether the industry builds the brakes he says it still lacks. And watch whether he, or anyone else who has put a number on the record, updates it in public when the path changes. A figure that cannot move is not a forecast. It is a slogan.
