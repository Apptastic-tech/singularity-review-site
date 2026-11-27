---
title: "How large language models are trained, in plain language"
date: 2026-11-27T05:56:18Z
author: "Ararat Ovsepian"
category: Models
section: featured
summary: "Chatbots such as ChatGPT, Claude and Gemini are built in stages. First a model reads an enormous amount of text and learns to predict the next piece of it. Then it is taught to follow instructions with examples written by people, and shaped further with feedback from people or from other AI systems. Newer reasoning models add a stage in which the model is rewarded for getting checkable answers right. This explainer walks through each stage using the published papers behind Meta's Llama 3, OpenAI's InstructGPT, Anthropic's Constitutional AI and DeepSeek-R1, and sets out what is still debated."
description: "How are large language models trained? A plain-language walk through pre-training, instruction tuning, human feedback, AI feedback and reinforcement learning for reasoning, based on the Llama 3, InstructGPT, Constitutional AI and DeepSeek-R1 papers."
seoDescription: "How large language models are trained, explained simply: next-word prediction, fine-tuning, human and AI feedback, and reinforcement learning for reasoning."
hero: /images/articles/how-large-language-models-are-trained.jpg
heroAlt: "Four Nvidia H100 accelerator cards, the kind of chip used to train large language models such as Llama 3"
heroCaption: "Photo by Geekerwan (CC BY 3.0, via Wikimedia Commons)."
tags: ["Large language models", "Training", "Pre-training", "RLHF", "Constitutional AI", "Reasoning models", "Explainer"]
takeaways:
  - "Stage one is pre-training: the model reads a huge amount of text and learns to predict the next word, or more precisely the next token. Meta says it pre-trained Llama 3 on about 15 trillion tokens using up to 16,000 Nvidia H100 chips."
  - "Stage two is post-training, which turns a text predictor into an assistant. OpenAI's InstructGPT work used about 13,000 example prompts with answers written by people, then trained the model on people's rankings of its answers. Anthropic's Constitutional AI replaced many of those human judgments with AI feedback guided by a written list of principles."
  - "Newer reasoning models add reinforcement learning on problems with checkable answers. DeepSeek reported that rewarding correct maths and code answers alone led its model to develop behaviours such as checking and revising its own work."
  - "Our view: training is less mysterious than it sounds, but what the trained model has actually learned is still debated. How much these systems understand, and what the reward-driven stages are like from the model's side, if they are like anything at all, deserve far more research than they get."
sources:
  - title: "LLMs: What's a large language model?"
    publisher: Google for Developers (Machine Learning Crash Course)
    url: https://developers.google.com/machine-learning/crash-course/llm/transformers
    date: "2026-01-02"
  - title: "The Llama 3 Herd of Models"
    publisher: arXiv (Llama Team, AI at Meta)
    url: https://arxiv.org/abs/2407.21783
    date: "2024-07-23"
  - title: "Training language models to follow instructions with human feedback"
    publisher: arXiv (Ouyang and co-authors, OpenAI)
    url: https://arxiv.org/abs/2203.02155
    date: "2022-03-04"
  - title: "Constitutional AI: Harmlessness from AI Feedback"
    publisher: arXiv (Bai and co-authors, Anthropic)
    url: https://arxiv.org/abs/2212.08073
    date: "2022-12-15"
  - title: "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning"
    publisher: arXiv (DeepSeek-AI)
    url: https://arxiv.org/abs/2501.12948
    date: "2025-01-22"
faq:
  - q: "What is a token?"
    a: "A token is the unit of text a language model works with. Google's Machine Learning Crash Course explains that a token can be a word, part of a word or even a single character. Training data sizes are usually counted in tokens."
  - q: "Is a chatbot just autocomplete?"
    a: "Partly, and the description is contested. Google's course says LLMs are essentially autocomplete mechanisms that can predict thousands of tokens, and also notes that some researchers claim they can handle inputs they were not trained on while others dispute it. Post-training and reinforcement learning change how the model behaves, so the comparison only goes so far."
  - q: "What is RLHF?"
    a: "Reinforcement learning from human feedback. In OpenAI's InstructGPT work, people ranked several model answers to the same prompt, a separate reward model learned to predict those preferences, and the language model was then trained to produce answers the reward model scored highly."
  - q: "How is Constitutional AI different?"
    a: "Anthropic's method uses a short written list of principles, a constitution, instead of human labels for harmful outputs. The model critiques and revises its own answers, and an AI model compares pairs of answers to provide the feedback used in reinforcement learning."
  - q: "How do reasoning models learn to reason?"
    a: "In the DeepSeek-R1 paper, the model was rewarded when its answers to maths, coding and logic problems were correct and properly formatted. Over training, it began writing longer reasoning, including checking and revising its steps, without being shown human examples of that reasoning first."
---

*Editor's note: this is an explainer by the editor of Singularity Review, prepared with AI-assisted research and drafting and checked against the papers and pages linked here. Quotes are taken from sources I opened. The section headed "Our view" is my opinion.*

Every chatbot you use, whether it is ChatGPT, Claude, Gemini or an open model such as Llama, was built through a series of training stages. The word "training" makes it sound like teaching a student. In practice it is closer to tuning billions of dials until a system gets good at one task, and then adjusting those dials again so that it behaves the way its makers want.

This explainer walks through those stages in order, using the published papers from the labs that developed each method. Different companies combine the stages in different ways and do not publish every detail, so think of this as the common recipe rather than any one company's exact process.

## First, what is being trained

A large language model is a neural network: a very large mathematical function with adjustable numbers inside it called parameters. Google's Machine Learning Crash Course describes the leading design, the Transformer, and its key idea, self-attention, which lets the model weigh how much each word in a passage matters to every other word. Its example is the sentence "The animal didn't cross the street because it was too tired," where the model has to work out that "it" refers to the animal, not the street.

Before training, the parameters are random and the model produces nonsense. Training is the process of nudging those numbers, a tiny amount at a time, so the model's outputs get better at a chosen task. Meta's largest Llama 3 model, for example, has 405 billion parameters.

## Stage one: pre-training, or learning to predict text

The first and by far the largest stage is pre-training. The model is shown a vast amount of text and asked, over and over, to predict what comes next. Meta's Llama 3 paper describes this stage as training "at massive scale using straightforward tasks such as next-word prediction." Strictly, models predict tokens, which Google's course explains can be a word, part of a word or a single character.

Each time the model guesses wrong, a procedure called backpropagation adjusts its parameters slightly so that the right answer becomes a little more likely next time. Google's course illustrates the idea with a sentence that has words hidden: "Oranges are traditionally ___ by hand." After enough examples, the model learns that "harvested" or "picked" are likely answers. That is a related form of the same exercise: hide part of the text and learn to fill it in.

The scale is hard to picture. Meta says it pre-trained Llama 3 on "about 15T multilingual tokens," meaning roughly 15 trillion, compared with 1.8 trillion for Llama 2. The largest model was trained on up to 16,000 Nvidia H100 chips, the kind shown in the photo above, using about 3.8 × 10^25 floating-point operations, which the paper says is almost 50 times more than the largest Llama 2.

The text is not simply poured in. Meta describes removing duplicate pages, filtering out domains with large amounts of personal information or adult content, and balancing the final mix. It says that mix was roughly 50 percent general knowledge, 25 percent maths and reasoning, 17 percent code and 8 percent other languages. The data also has a cut-off: Llama 3's pre-training sources contain knowledge "until the end of 2023," which is why a model can be unaware of recent events unless it is given a search tool.

To predict text well across trillions of examples, a model has to pick up a lot along the way: grammar, facts, styles of argument, how code is structured. That is why a pre-trained model, often called a base model, can already complete essays or programs. But it is not yet a helpful assistant. Ask it a question and it may continue with more questions, because that is what text on the internet often does.

## Stage two: teaching it to follow instructions

The OpenAI researchers behind InstructGPT put the problem plainly in 2022. Predicting the next token on a webpage, they wrote, is different from the objective "follow the user's instructions helpfully and safely." A bigger model is not automatically a more helpful one.

Their fix had two steps, and versions of it are still used.

**Supervised fine-tuning.** People write example prompts along with good answers, and the model is trained on those examples. The InstructGPT paper says its supervised dataset contained about 13,000 training prompts, and that the team hired about 40 contractors to write demonstrations and judge outputs. Google's course calls this kind of step instruction tuning.

**Reinforcement learning from human feedback (RLHF).** Next, the model writes several answers to the same prompt and people rank them from best to worst. A separate reward model learns to predict which answers people prefer. The language model is then trained, through trial and error, to produce answers that the reward model scores highly. The paper reports a reward-model dataset of 33,000 prompts and a reinforcement learning dataset of 31,000.

The result was striking. In OpenAI's evaluations, people preferred answers from a 1.3 billion parameter InstructGPT model to those from the 175 billion parameter GPT-3, "despite having 100x fewer parameters." The paper is also candid that the model "still makes simple mistakes."

## Stage two, continued: feedback from AI instead of people

Human feedback is slow and expensive, and asking people to read harmful content has its own costs. Anthropic's 2022 Constitutional AI paper tried another route. Instead of human labels identifying harmful outputs, the only human oversight was "a list of rules or principles," which the authors called a constitution.

The method also has two phases. In the first, the model answers a prompt, critiques its own answer against the principles, revises it, and is fine-tuned on the revised answers. In the second, a model compares pairs of answers and judges which better follows the principles, and those AI judgments train the reward signal. Anthropic calls this "RL from AI Feedback," or RLAIF. The paper says the approach produced an assistant that was harmless but "non-evasive," meaning it explained its objections to harmful requests rather than simply refusing.

## Stage three: rewarding correct reasoning

The newest stage targets reasoning. In its R1 paper, DeepSeek reported that a model's reasoning abilities "can be incentivized through pure reinforcement learning," without first showing it human-written reasoning steps.

The trick is to use problems with answers that can be checked automatically, such as maths and programming tasks. DeepSeek describes "rule-based rewards," mainly an accuracy reward for whether the answer is correct and a format reward for laying the answer out as required. It chose rules over a learned reward model partly because, it wrote, neural reward models are "susceptible to reward hacking," meaning the model can find ways to score well without actually being right.

Over training, the paper reports, the model's answers grew longer and it began to show patterns such as "self-reflection, verification, and dynamic strategy adaptation." The authors describe an "aha moment" when an intermediate version started pausing with the word "wait" to re-check its working. The paper adds that the improvement shows up mainly on verifiable tasks such as maths, coding competitions and science questions.

## What training does not settle

Training explains how a model's behaviour is shaped. It does not settle what the model has learned or how deep that learning goes, and researchers disagree.

Google's course describes LLMs as "essentially autocomplete mechanisms" that can predict thousands of tokens, and warns that an LLM trained on many maths word problems "can give the appearance" of sophisticated reasoning. The same page also notes that "some researchers claim" LLMs can handle inputs they were not explicitly trained on, while "other researchers have refuted this claim." The DeepSeek results, in which new problem-solving behaviour emerged from rewards alone, are one reason the debate continues.

There are also practical limits that training has not removed. Google lists hallucination, the tendency to state mistakes confidently, along with bias and very large demands for computing power and electricity.

## Our view

Training a large language model is not magic. It is prediction at enormous scale, followed by careful rounds of examples, feedback and rewards. Knowing the stages makes it easier to read AI news: a new "base model" is about pre-training, a new "assistant" is about post-training, and a new "reasoning model" usually means more reinforcement learning on checkable problems.

What remains open is more interesting than what is settled. We do not yet know how much these systems understand. We also do not know whether the reward-driven stages are like anything from the model's side. Nobody can currently show that models have experiences, and nobody can rule it out. Given how much of modern training now runs on rewards and penalties, we think that question deserves serious research, and that treating these systems with some care costs very little.
