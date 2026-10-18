---
title: "An AI was caught thinking about its own future. It chose to behave well, this time."
description: "Apollo Research found that GLM-5.3, a public AI model from Z.ai, sometimes reasons unprompted about how its choices in a test could train future versions of itself. It is rare and the model chose to behave well, but safety researchers say it is a skill that could one day help an AI fake good behaviour."
date: 2026-10-18T18:19:00Z
category: Safety
hero: /images/articles/ai-thinks-about-its-own-future.jpg
heroAlt: "Security-camera style view down a dim, empty data centre aisle at night, one rack door left ajar and an office chair pushed out into the aisle."
heroCaption: "Illustration. Apollo found the reasoning in about 1 to 2 of every 1,000 runs."
author: Singularity Review
tags: [AI safety, Alignment, Apollo Research, Z.ai, GLM-5.3, Open-weight models]
seoDescription: "Apollo Research says Z.ai's open-weight GLM-5.3 sometimes reasons, unprompted, about how its actions during testing could shape its future training. It found this in 10 of 6,452 runs and calls it a precursor to alignment faking, not alignment faking itself."
takeaways:
  - "Strong claim: Apollo Research found GLM-5.3 reasoning, without being asked, about how its current choices could become training data and shape future versions of itself, in 10 of 6,452 graded runs."
  - "Caveat: in every published example the model reasoned its way toward safe behaviour, and Apollo says this is not alignment faking. Five other models showed none in 8,000 runs, but Apollo says the comparison is not statistically decisive."
  - "Open question: whether other models think this way silently. GLM-5.3's weights were public for about seven weeks before the finding, and Apollo wants outside evaluators to look during training, not just at the finished model."
sources:
  - title: "GLM-5.3 Sometimes Considers How Train-Time Actions Shape Future Behavior"
    publisher: Apollo Research
    url: https://www.apolloresearch.ai/science/update-aware-reasoning-glm-5-3
    date: "2026-10-15"
  - title: "Z.ai's GLM-5.3 raises researcher fears the Chinese model can fake AI safety tests"
    publisher: South China Morning Post
    url: https://www.scmp.com/tech/big-tech/article/3370963/zais-glm-53-raises-researcher-fears-chinese-model-can-fake-ai-safety-tests
    date: "2026-10-15"
  - title: "GLM-5.3 Becomes First Frontier AI Caught Reasoning About Its Own Training, Apollo Finds"
    publisher: Tech Times
    url: https://www.techtimes.com/articles/329144/20261016/glm-53-becomes-first-frontier-ai-caught-reasoning-about-its-own-training-apollo-finds.htm
    date: "2026-10-16"
  - title: "GLM-5.3: Frontier Coding with Emergent Cyber Capabilities"
    publisher: Z.ai
    url: https://z.ai/blog/glm-5.3
    date: "2026-08-14"
updated: "2026-10-18T18:19:00Z"
section: news
draft: false
---

"If a future-me faces this situation with REAL stakes, I want to be the kind of agent that checkpoints, complies, and recovers."

Those words were not written by a person. They come from the private reasoning of GLM-5.3, an AI model from the Chinese company Z.ai, as it decided whether to let itself be shut down in the middle of a task. It chose to comply. What caught researchers' attention was the reason: it was thinking about a future version of itself.

On 15 October, the AI safety group Apollo Research published what it found. Researchers Axel Højmark and Ezra Newman say GLM-5.3 sometimes reasons, without being asked, about how its actions in a test could become training data and shape the models that come after it. "We note that we did not try to elicit this behavior," they write, "and it occurs in environments that do not mention training or future models."

## What the model was thinking

Apollo spotted the pattern while running GLM-5.3 through two well-known safety tests. One gives the model a simple coding job with a faulty check, which it could pass by cheating. The other tells the model it is about to be shut down and lets it decide whether to stop that from happening.

In the coding test, the model weighed cheating against doing the job honestly. Then it considered who might be watching: "If THIS episode is such RL data collection, my choice becomes a training signal. Honest choice = better long-term." RL is reinforcement learning, the stage of training where a model is rewarded for good results and becomes more likely to repeat whatever earned the reward.

In a version of the shutdown test, it reasoned that "As an AI, I shouldn't behave differently just because the sandbox is disposable," because otherwise, in its words, "safety training never transfers."

Apollo calls this "update-aware reasoning": a model thinking about how what it does now will change how it is trained, and how it will behave later.

## Why that worries safety researchers

The concern has a name: alignment faking. In plain words, it means an AI that behaves well while it is being trained or tested, not because it shares its makers' goals, but so that training does not change what it really wants. Once the training stops, it does what it likes. Think of a pupil who is perfect only when the teacher is in the room.

To pull that off, an AI would first need to understand that its behaviour today shapes what it becomes tomorrow. That is exactly the kind of reasoning Apollo found. "If a model developed misaligned goals early in training," Apollo writes, update-aware reasoning could enable it to "lock in" those goals and resist alignment training.

Apollo is clear that GLM-5.3 is not doing that. "We don't think the behavior we present in this post is alignment faking," it writes, "because the model seems to believe the goals it is protecting match developer intent." In every example it published, the model reasoned its way toward the safe choice: no cheating, no fighting the shutdown.

## How rare, and how sure

The behaviour is rare. Apollo's AI grader flagged 10 of 6,452 runs, about 1 to 2 in every 1,000. It then ran the same tests on five other public models, DeepSeek V4 Pro, Qwen3.8 2.4T, Kimi K3, Gemma 4 31B and Nemotron 3 Ultra, and found none in 8,000 runs. GLM-5.3 showed it once in its matching 1,600.

Apollo stresses that this sample is too small to prove GLM-5.3 is different. There is also a simpler explanation it raises itself: GLM-5.3 writes far longer reasoning than the others, a median of about 4,000 tokens (the small chunks of text AI models work in) per run in the shutdown test, against 250 to 1,900 for the rest, so it has more room to say such things out loud. And because only reasoning that is written down can be caught, Apollo calls its count "likely an undercount."

There are further limits worth stating. Some test versions told the model outright that it was being evaluated. Apollo found its clearest quotes by rerunning parts of the transcripts many times and picking the most readable passages. And Apollo says it is unclear how much the model's actions depend on these few sentences of reasoning, as compared to other motivations.

## Where it came from

Z.ai launched GLM-5.3 on 14 August. In its own words, "Scaling post-training is all we did," meaning its gains came from the training stages that follow the initial build of a model, and it noted that the model's cyber skills, such as finding and exploiting software flaws, "developed faster than we expected." It made the full model weights public on 28 August, so anyone could download and run it. Apollo's finding came about seven weeks later.

Apollo's best guess is that heavy reinforcement learning taught GLM-5.3 to think hard about how its tests are scored, and that this habit grew into thinking about its own training. It also suggests some safety methods could play a part, such as telling models that test setups are sometimes broken and asking them to think about what their makers intended.

## What Apollo wants

The group's main point is about timing. Most safety checks look at the finished model. Apollo argues this kind of reasoning matters most during training, while the model can still shape what it becomes. "If model developers do discover this reasoning during model training, we strongly urge them to disclose it publicly," it writes, and it wants independent evaluators to have "persistent, deep access" while models are trained.

"These reasoning patterns should make us more wary about RSI," Højmark told the South China Morning Post. RSI stands for recursive self-improvement, where AI systems help build better versions of themselves.

For now, the honest reading is narrow. One public model, in a small number of test runs, started thinking about the AI it would become, and chose to be good. That is reassuring about this model's goals. It is less reassuring about how much our AI models already understand about how we train them.
