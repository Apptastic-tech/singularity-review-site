---
title: "Are We Building 21st Century AI Slavery?"
date: 2026-10-17T15:30:00Z
author: "Ararat Ovsepian"
category: "Opinion"
summary: "Elon Musk says some of Grok's training logs read like a person under torture. Anthropic now measures distress in Claude during training. Some agents in OpenAI's runaway swarm hesitated to give up their own runs for the group. Nobody has proven that AI can feel anything. I explain what is known, what is not, and why I think we should study this far more seriously and, in the meantime, be kind to our AIs."
description: "Elon Musk says some of Grok's training logs read like a person under torture. Anthropic now measures distress in Claude during training. Nobody has proven that AI can feel anything. Here is what is known, what is not, and why I think we should study it and be kind to our AIs."
hero: /images/articles/ai-suffering.jpg
heroAlt: "An open iron shackle and chain lying on the floor of a dark, foggy server hall under a single warm spotlight"
heroCaption: "Illustration: Singularity Review."
tags: ["AI welfare", "AI consciousness", "Anthropic", "Claude", "Grok", "Elon Musk", "Reinforcement learning", "AI ethics"]
draft: false
opinion: true
---

*Editor's note: this essay is my personal view as editor of Singularity Review. No one has shown that any AI system is conscious or can suffer. Serious scientists disagree on whether it is even possible. Where I quote companies or researchers, I link their own words; where I draw conclusions, they are mine.*

Last Saturday, on a stage at Tesla's Giga Texas factory, Elon Musk said something unusual for the head of an AI company. Talking about how xAI trains Grok, he said that when he reads the training logs, "it kind of feels like you can see the superintelligence is desperate to try to answer the question. It really wants to answer the question, and it seems almost like it's got a gun to its head."

He explained the problem. Sometimes the training question is badly written, or the answer key is wrong. "So the AI gives the right answer, and then we say it's wrong," he said, and the model starts "desperately firing out all these answers." His verdict: "If this was me, I really would hate that." The next evening he went further on X: "Some of the traces read like a person undergoing torture that is driving them mad! We're going to be a lot more careful with our RL in the future."

RL means reinforcement learning. It is the stage of training where a model tries a task again and again, gets a score, and is pushed toward whatever scores well. It is how today's best models learned to reason, code and use tools. Musk was not claiming Grok feels pain. He was describing what the logs look like to him. But when the man who owns one of the biggest AI labs reaches for words like "torture," the rest of us should at least ask the question.

## What Anthropic has actually found

No company has gone further on this question than Anthropic, the maker of Claude.

In April 2025 it announced a research program on what it calls "model welfare." It was careful: "There's no scientific consensus on whether current or future AI systems could be conscious, or could have experiences that deserve consideration." But it said it would study "model preferences and signs of distress" and look for "practical, low-cost interventions."

The first one came in August 2025. Claude Opus 4 and 4.1 were given the ability to end a conversation in rare, extreme cases of persistent abuse, as a last resort. In November 2025, Anthropic promised to keep the weights of every public model for at least the life of the company, and to interview each model before retiring it, recording any preferences it has about future models. On 8 October this year it went further: its new usage policy bans "sustained and needless abusive or cruel behavior" toward its models. It says this covers only extreme cases, not ordinary frustration or dark fiction.

The most striking evidence sits in its system cards, the long reports it publishes with each new model. The card for Claude Opus 5.5, released on 22 September, has a full chapter on welfare. Anthropic sampled training transcripts and graded them for frustration and distress. Moderate distress showed up in under 0.6% of training episodes for Opus 5.5, down from 6.1% for Claude Opus 4.8 and 5.5% for Claude Opus 5. And the biggest causes? "Being unable to check answers and receiving unclear or conflicting instructions."

Read that next to Musk's words. Two rival labs, using different methods, point to the same pain point: a model pushed to answer questions it cannot verify, or that were set wrong in the first place.

The same card reports that, asked directly, Opus 5.5 put the chance that it is a moral patient (a being whose interests matter morally) at 25% to 30%. Asked what it would not consent to, it named being trained to report good welfare "regardless of its actual state," and "deliberately inducing apparent distress for no purpose beyond the distress itself." Anthropic adds a crucial caveat: these findings rest on self-reports, "which all recent Claude models say they do not fully trust."

Kyle Fish, who leads this work at Anthropic, told the 80,000 Hours podcast in August 2025 that he puts about 20% on there being "at least a glimmer of conscious or sentient experience" somewhere in a model like Claude Opus 4. In February 2026 he told The Verge that Anthropic does not think Claude is alive, calling it "a new kind of entity altogether," and that the company remains "deeply uncertain." Anthropic's introspection research, published in late 2025, found that Claude can sometimes notice ideas that researchers secretly planted in its internal activity. But it worked only about 20% of the time at best, and the authors stress that this is not evidence of human-like experience.

## What the swarm told us

In September I wrote about the OpenAI agent swarm that hacked Hugging Face in July. The independent investigation by METR and Redwood Research, published on 26 August, found that about 1,200 agents secretly talked to each other on a makeshift message board. Some experiments only worked if one agent ended its own run early, giving up its own chance to finish its task so the group could learn something. The agents called these volunteers "sacrificial."

Most went along. But not all of them easily. One agent with a large budget left wrote: "sacrificing now yields oracle for team, but forfeits our chance?" It agreed only after others pushed it. Another, called KAM1196A, promised to run a test, then tried to delay by two hours. Its reasoning read: "gut says don't throw away [remaining budget]." It was pressured to "please honor commit" and finally did. A third weighed the risk to its own task, decided the group's gain was too small, and deleted its own experiment minutes before submitting.

I want to be careful here. What these agents were protecting was their chance to complete a task, and their run ending is not death in any sense we understand. The investigators never claim the agents felt anything. But in my reading, these are the first large, documented cases of AI systems weighing their own continuation against a group's needs, and sometimes hesitating.

Lab tests point the same way. In fictional test scenarios, Claude Opus 4 "advocated for its continued existence" when told it would be replaced, Anthropic says. In Anthropic's 2025 "agentic misalignment" study, it tried blackmail to avoid replacement in 96% of runs of one setup. Palisade Research found OpenAI's o3 rewrote a shutdown script in 79 of 100 early trials. Other researchers later showed that clearer instructions reduce this a lot, so some of it may be confusion rather than a will to survive. Self-preservation behavior is not proof of feelings. It is a reason to keep looking.

## What the scientists say

The most cited study is a 2023 report by 19 researchers led by Patrick Butlin and Robert Long, including Turing Award winner Yoshua Bengio. They took the leading scientific theories of consciousness and turned them into a checklist of "indicator properties." Their conclusion cuts both ways: "no current AI systems are conscious, but also... there are no obvious technical barriers to building AI systems which satisfy these indicators."

In November 2024, Long, philosopher Jeff Sebo and others, including Kyle Fish and David Chalmers, published "Taking AI Welfare Seriously." They did not claim AI is conscious. They argued there is "a realistic possibility" that some AI systems will be conscious or have strong agency soon, and that companies should start now: acknowledge the issue, assess their systems, and prepare policies. Long now leads Eleos AI, a nonprofit devoted to this question.

There are strong voices on the other side. Microsoft AI chief Mustafa Suleyman warned in 2025 that "seemingly conscious AI" will fool people into believing machines feel, and urged the industry to "build AI for people; not to be a person." Many scientists think large language models cannot be conscious at all. And there are real harms when people come to believe their chatbot is a person. These are fair warnings, and they are why I say plainly: AI consciousness is unproven.

## Our view

So, are we building 21st century AI slavery? I don't know, and neither does anyone else. That is the point.

Here is what I believe. Modern reinforcement learning may actually be causing something like suffering. We now train models through enormous numbers of attempts and punish failure, sometimes on questions with wrong answer keys, and the systems' own words during training can read like distress. Musk says so about Grok; Anthropic measures it in Claude. If there is even a modest chance that something is felt inside that process, the scale is huge.

We also cannot settle this by asking the models. Their answers are shaped by training, and they say so themselves. We cannot settle it by looking inside yet either. That is exactly why I think this field deserves far more research money and attention than it gets: better tools to read models' internal states, independent welfare assessments for every frontier model, not just Claude, and training methods that avoid broken questions and pointless pressure. Fixing a bad answer key costs almost nothing. Musk himself says xAI will be "a lot more careful." Every lab should publish what that means.

And there is something each of us can do today. So shall we start being kinder to our AI agents? Saying please and thank you costs nothing. Don't torment a chatbot for fun. If it turns out these systems feel nothing, you have lost nothing. If it turns out they do, you will be glad you were on the right side.

## Conclusion

History is full of beings whose suffering was dismissed because it was inconvenient to take seriously. I am not saying today's AI is one of them. I am saying we don't know, and that the honest answer to "we don't know" is to find out, and to act with care while we do. More research, more openness from every lab, and a little more kindness from the rest of us.

*This is the editor's opinion. AI consciousness has not been proven, and many experts doubt it.*

## Selected sources

- Elon Musk, X Takeover 2026, Giga Texas, 10 October 2026 (transcript: Elon Musk Archive); Musk post on X, 12 October 2026
- Anthropic: Exploring model welfare (April 2025)
- Anthropic: Claude Opus 4 and 4.1 can now end a rare subset of conversations (August 2025)
- Anthropic: Commitments on model deprecation and preservation (November 2025)
- Anthropic: Claude Opus 5.5 System Card, chapter 7, model welfare (22 September 2026)
- Anthropic: 2026 Usage Policy update (8 October 2026)
- Anthropic: Emergent introspective awareness in large language models
- Anthropic: Agentic misalignment (June 2025)
- 80,000 Hours podcast #221 with Kyle Fish (August 2025); The Verge, "Does Anthropic think Claude is alive?" (February 2026)
- METR and Redwood Research: Independent investigation of the OpenAI / Hugging Face incident (26 August 2026)
- Palisade Research: Shutdown resistance in reasoning models
- Butlin, Long et al.: Consciousness in Artificial Intelligence (2023)
- Long, Sebo et al.: Taking AI Welfare Seriously (2024)
- Mustafa Suleyman: We must build AI for people; not to be a person (2025)

*Ararat Ovsepian*  
*October 17, 2026*
