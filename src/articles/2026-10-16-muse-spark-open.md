---
title: "Meta opens Muse Spark Open: 816B weights, two Mac Studios, and a US claim worth parsing"
description: "Meta Superintelligence Labs released Muse Spark Open, an open-weight multimodal MoE built for coding and agents. The specs are real. The 'most capable US open-weight' line is Meta's marketing, and the desktop story needs two expensive machines."
date: 2026-10-16T09:10:00Z
category: Models
hero: /images/articles/muse-spark-open.jpg
heroAlt: "Two silver desktop workstations on a dark oak desk under soft window light, thick cables linking them, empty chairs, no screens readable."
heroCaption: "Illustrative photograph. Not Meta or Apple hardware in use."
author: Singularity Review
tags: [Muse Spark Open, Meta, Open weights, MoE, Apple MLX, Agentic AI]
seoDescription: "Muse Spark Open is Meta's 816B-total / ~42B-active open-weight multimodal MoE with 1M context. What the release actually ships, what 'desktop supercomputer' means, and how it sits next to Qwen, Kimi, and GLM."
takeaways:
  - "Strong claim: Meta released open weights for an 816B-total, ~42B-active multimodal MoE with 1M-token context, plus hosted APIs and broad inference support."
  - "Moderately strong claim: the model is aimed at coding and long-horizon agent work, with on-device demos Meta describes (Ice Cubes iOS changes, DaVinci Resolve crop)."
  - "Weak claim so far: that it is 'the most capable US open-weight model to date' in any absolute sense. That is Meta's framing; Chinese open-weight leaders still set the bar the release is racing."
sources:
  - title: "Introducing Muse Spark Open, The Most Capable US Open-Weight Model to Date"
    publisher: Meta AI Research
    url: https://research.meta.ai/blog/muse-spark-open
    date: "2026-10-15"
  - title: "Meta releases Muse Spark Open, a new open-weight AI model"
    publisher: The Guardian
    url: https://www.theguardian.com/technology/2026/oct/16/meta-releases-muse-spark-open-a-new-open-weight-ai-model
    date: "2026-10-16"
  - title: "Welcome Muse Spark Open"
    publisher: Hugging Face
    url: https://huggingface.co/blog/meta-muse-spark-open
    date: "2026-10-15"
  - title: "Muse-Spark-Open-816B-A42B"
    publisher: Hugging Face
    url: https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B
    date: "2026-10-15"
updated: "2026-10-16T09:10:00Z"
section: news
---

Meta released the weights for Muse Spark Open on October 15, 2026, and spent the next day telling the industry what that is supposed to mean. The model is open-weight, natively multimodal, and enormous on paper: 816 billion total parameters, about 42 billion active per token, and a one-million-token context window. It takes text, image, video, and audio. It answers in text. Meta Superintelligence Labs, with Alexandr Wang fronting the message, calls it "the most capable US open-weight model to date." That last phrase is a claim, not a measurement. The rest of the package is concrete enough to inspect.

## What actually shipped

![Two linked desktop workstations on a clean desk, warm side light, calm dark foreground for overlay](/images/articles/muse-spark-open-2.jpg)

Muse Spark Open is a mixture-of-experts transformer with a perception encoder for images and video and a separate audio tower. Hugging Face's technical write-up puts 256 experts in each MoE block, with eight selected per token, which is how an 816B-parameter model runs closer to a 42B compute budget. Checkpoints sit on Hugging Face as `meta-models/Muse-Spark-Open-816B-A42B` and an NVFP4 variant aimed at NVIDIA Blackwell. Weights also show up through Amazon SageMaker, Google Cloud Model Garden, and Microsoft Foundry. Hosted APIs are live at Baseten, Fireworks, Groq, Modal, Nebius, OpenRouter, and Together AI. Inference recipes cover SGLang, vLLM, TensorRT-LLM, Hugging Face Transformers, Apple MLX, llama.cpp, and Unsloth, with silicon notes for NVIDIA, AMD, Intel, and Apple.

The license is the Muse Model License. Many developers can use it free. Commercial Model-as-a-Service at scale has limited terms that push larger API businesses into a separate Meta agreement. That is open weights with strings, not a blank check.

## Built for agents, demonstrated on desks

Meta is not selling this as a chat companion. The pitch is coding and agentic work: long-horizon tasks, multi-step reasoning, tool use, and software engineering that stretches across files and sessions. The company describes on-device demos powered by Muse Code on Muse Spark Open: shipping real iOS changes to Ice Cubes, an open-source Mastodon client, and driving DaVinci Resolve through frame review and vertical crop. Those are Meta's demos. They are useful as existence proofs of the workflow Meta wants you to imagine. They are not independent benchmarks.

Safety gets its own paragraph in the launch. Meta says the open-weight build got extra post-training because weights travel without Meta's product guardrails, and that the model met thresholds in the company's Superintelligence Scaling Framework. The model card on Hugging Face walks through content safety, agentic risk, privacy, and preparedness categories. Treat that as Meta's self-evaluation until outsiders reproduce it.

## The desktop "supercomputer" caveat

The headline hardware story is Apple. Muse Spark Open is optimized to run via MLX on Mac Studio machines with M5 Ultra. Meta's preferred setup is two Studios with 512 GB unified memory each, or four with 256 GB. Unified memory plus roughly 1.2 TB/s bandwidth is how Meta frames two boxes as a desktop "supercomputer" that can hold the whole model and still feed tokens. That is a real engineering path for people who already live in Apple silicon. It is also not a consumer laptop story. Two high-end Mac Studios are a capital purchase. Four smaller-memory units are still a rack of desks, not a backpack. If your baseline for "runs on desktop" is a single machine under a monitor, read the fine print before the marketing lands.

## Where it sits against Chinese open weights

The Guardian's coverage correctly places the release in a race Meta has been losing in open weights. Alibaba's Qwen line, Moonshot's Kimi K3, and Z.ai's GLM family have been the models developers actually download and fine-tune. Meta's own blog and model card put Muse Spark Open next to those names on agentic, coding, and multimodal suites. Some cells look strong. Some do not lead. That is the honest read: a serious US open-weight attempt that is competing, not crowning itself by geography.

The timing matters too. Muse Spark Open lands days after Meta's closed Muse Wonder / Wonder Full push. Open and closed in the same week is a portfolio move. It lets Meta talk about "personal superintelligence for everyone" while still selling closed frontier access elsewhere.

## Our view

Take the weights, the modalities, the 1M context, and the inference ecosystem as fact. Take the agentic positioning as Meta's product intent, backed by demos Meta controls. Treat "most capable US open-weight" as branding aimed at a Chinese-led open-weight market. Treat the Mac Studio story as impressive and expensive. If you are evaluating Muse Spark Open for production agents, the next useful artifacts are third-party SWE and computer-use scores, license counsel for your revenue shape, and a sober bill for the hardware or API path you will actually run. The release is large. The slogan is optional.
