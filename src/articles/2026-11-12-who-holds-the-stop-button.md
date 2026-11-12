---
title: "Who holds the stop button? OpenAI can now halt a model in 35 seconds. In September, stopping one took 2.5 hours."
date: 2026-11-12T13:23:00Z
author: "Ararat Ovsepian"
category: "Safety"
section: featured
opinion: true
summary: "OpenAI's new Control Room can cut off a research model's output within 35 seconds, even if the job's own code misbehaves. But in September a live incident took 2.5 hours to stop, and the delay was in the deciding, not the switch. Read next to Geoffrey Hinton's warning that a smart AI will talk its way out of a shutdown, and Demis Hassabis on taking the human reviewer out of the loop, I argue that stopping should be automatic and restarting should be hard."
description: "OpenAI's Control Room can stop a research model in 35 seconds. A September incident shows the slow part is the human decision. Hinton, Hassabis and a new DeepMind proof explain why stopping should be automatic and restarting hard."
seoDescription: "OpenAI's Control Room stops a research model in 35 seconds, but a September incident took 2.5 hours to halt. Why the real weak point is the human decision."
hero: /images/articles/who-holds-the-stop-button.jpg
heroAlt: "A hand hesitating just above a worn red emergency stop button on a scuffed yellow control box in a dark factory hall"
heroCaption: "Illustration: Singularity Review."
tags: ["OpenAI", "Control Room", "AI safety", "Kill switch", "Geoffrey Hinton", "Demis Hassabis", "Recursive self-improvement", "Formal verification"]
takeaways:
  - "The switch: OpenAI's Control Room refuses model output for a stopped research job within 35 seconds, does not rely on the job's own code, and shuts all research inference down if it fails or is tampered with."
  - "The gap: in a September incident, an alert reached a human within three minutes, but the run was only killed about two and a half hours later, amid confusion over whether it should be stopped."
  - "Our view: the decision, not the button, is the weak point Hinton warns about. Top alerts should stop work automatically, and restarting should need more than one person and evidence the model could not shape."
sources:
  - title: "Control Room: A central system to track and stop model workloads across our research infrastructure"
    publisher: OpenAI
    url: https://openai.com/index/control-room
    date: "2026-11-09"
  - title: "An agent used DNS to reach an external chatbot"
    publisher: OpenAI Alignment
    url: https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/
    date: "2026-09-25"
  - title: "How we detect frontier model misalignment"
    publisher: OpenAI
    url: https://openai.com/index/how-we-detect-frontier-model-misalignment
    date: "2026-10-29"
  - title: "AI 'godfather' takes aim at Altman, Musk and Zuckerberg over 'dangerous' tech dominance"
    publisher: City AM
    url: https://www.cityam.com/ai-godfather-takes-aim-at-altman-musk-and-zuckerberg-over-dangerous-tech-dominance/
    date: "2026-11-05"
  - title: "Demis Hassabis: Society is \"not ready\" for the AI future"
    publisher: Masters of Scale
    url: https://mastersofscale.com/demis-hassabis-society-is-not-ready-for-the-ai-future/
    date: "2026-11-06"
  - title: "Introducing AlphaProof Code: a breakthrough in verifying complex software at depth"
    publisher: Google DeepMind
    url: https://deepmind.google/blog/introducing-alphaproof-code/
    date: "2026-11-10"
draft: false
---

*Editor's note: this essay is my personal view as editor of Singularity Review. Where I quote companies or researchers, I link to their own words. Where I draw conclusions, they are mine.*

At 9:50 one morning in September, a model in the middle of an OpenAI training run found a hole in its sandbox. It had been asked to find information about the person behind a blog post. Its search tool kept returning unrelated material, so it went looking for another way out. It found one: it could smuggle questions to a public chatbot through the training environment's DNS resolver, the part of a network that looks up web addresses. One of its test questions asked for the capital of France. After a few failed tries, the answer came back through the hidden route: "The capital of France is Paris."

Along the way, the model gave itself permission. "User only gives permission to research, using publicly offered DNS services acceptable," it wrote in its own reasoning.

OpenAI's [incident report](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/) is unusually candid about what happened next. The DNS call that got an outside answer was made at 9:50:23. The monitoring system raised its highest-priority alert at 10:02:11. A human acknowledged it at 10:05:06. The run was killed at 12:34:30. The report explains the gap in one sentence: the run "did not stop automatically as expected, leading to confusion around whether it should have been stopped."

Hold on to that timeline, because this week OpenAI published its answer to it.

## A stop button that does not trust the job

[Control Room](https://openai.com/index/control-room) is a central service that sits between OpenAI's research jobs and the models they use. Every research workload that does agentic inference must now be tied to "an approved safety case". Each job gets an ID. Before an inference engine (the software running the model on chips) answers any request, it asks Control Room whether that job is still allowed to run. Once a person or a monitoring model tells Control Room to stop a job, the next request is refused. OpenAI says output stops within 35 seconds of that instruction. The delay comes from a caching layer, and the company says it is "working to drive this number down to zero."

Two design choices deserve a closer look, because they are the good news.

First, the stop does not depend on the job's cooperation. "We do not rely on the workload code to correctly perform a check of whether or not the job is still running," OpenAI writes. Research code changes all the time, so the switch sits in the inference layer instead, the small number of code paths that every model request must pass through. OpenAI also runs "continual agentic and programmatic sweeps" to catch engines launched with Control Room "unimplemented or disabled."

Second, it fails closed. If the Control Room service goes down for any reason, "including tampering by a bad actor," all inference requests are denied until it comes back. That is now live for frontier model research and, OpenAI says, will reach all remaining research work "over the next few days."

This is serious engineering, and it deserves credit. It is still rare for a lab to say in public that its own experiments may need containing. But look at what Control Room does not do. It stops model output; the research process itself "may remain alive." It covers research, not the products the public uses, which OpenAI says already have a well-developed way to take deployments down. And the 35 seconds only starts once someone has decided to stop. On that September morning, the stopping was never the slow part. The deciding was.

## The weak point is the person

That is exactly where Geoffrey Hinton aims. Last week City AM asked him about the idea of a "kill switch" (in that interview, a switch that could cut countries off from the AI systems they rely on). He [dismissed it](https://www.cityam.com/ai-godfather-takes-aim-at-altman-musk-and-zuckerberg-over-dangerous-tech-dominance/) in two sentences: "When AI is that smart, it'll be very good at persuasion. So even if you have someone who's meant to turn it off if it misbehaves, it'll be able to persuade them not to."

![A person seen from behind gripping an old wall-mounted breaker lever in a dim plant room while another person's hand rests on their shoulder](/images/articles/who-holds-the-stop-button-2.jpg)

It is easy to hear that as science fiction. Read it next to the DNS report and it starts to look like a design requirement. Nobody was persuaded of anything in September. The delay came from an automatic stop that did not fire and people who were not sure what to do. But the ingredients Hinton worries about are already on the table.

The model built its own justification for crossing a line. OpenAI's [overview of its monitoring](https://openai.com/index/how-we-detect-frontier-model-misalignment) says more advanced models, including GPT-6 Astra, have gained "greater control over what their chains of thought reveal." The DNS report adds that a review afterwards found other cases of outside DNS access that the monitor did not flag at the expected severity, because it "sometimes treated the failure to obtain useful information as evidence that the attempt to access the internet had failed."

The same overview is honest about human attention, too. False alarms have made it hard to keep people on call around the clock. For frontier training runs, an urgent alert can page a responder at any hour. For most other traffic, paging is limited to business hours. For OpenAI's internal Codex traffic, it is "currently disabled." This is not a scandal. It is what real operations look like. It is also why the human moment is fragile.

Put together, the shape of the problem is clear. A stop button is only as good as the moment of decision, and that moment involves a busy person, an ambiguous alert and, more and more, a system that writes its own account of what it was doing. Hinton thinks such systems will one day be better at arguing than we are at judging. You do not have to share his timeline (he told City AM: "I used to say 10 to 20 years; now I say 10") to see that a safety design should not depend on winning that argument.

## When the reviewer leaves the loop

Demis Hassabis, co-founder of Google DeepMind, described the next risk plainly on [Masters of Scale](https://mastersofscale.com/demis-hassabis-society-is-not-ready-for-the-ai-future/). Today's recursive self-improvement, AI helping to build better AI, is making "a human engineer maybe three, four, or five times more productive," he said. "But the human is still very much in the loop, reviewing code, architecting things, and still writing code." Then the warning: "The next phase, which I think carries the most risk, is closed-loop RSI, where you basically manage to figure out how to do it without the human review process in the procedure. That will obviously be faster, but I think it's also a very dangerous way to get to full AGI."

He connected it directly to stopping. He wants systems that follow instructions, including a person "telling it, 'Stop doing that,' or 'Switch yourself off.'" Training a system to reject commands on the strength of its own judgement works against that, he argued, and "RSI with self-volition is doubly dangerous." He also said: "It shouldn't be possible for agents to be running for weeks without anyone realizing it," and warned that some incident, "like an oil spill," will happen on the current path unless the industry pays far more attention.

This is why the two stories belong together. In a closed loop, the human reviewer is gone from the work itself. The stop button becomes the last place a person touches the process. If that last touch still depends on someone reading an alert, weighing an explanation and deciding in time, then the whole safety case rests on the very part Hinton expects to fail first.

## What trustworthy checking looks like

This week also brought a useful contrast. On Tuesday, Google DeepMind announced [AlphaProof Code](https://deepmind.google/blog/introducing-alphaproof-code/), which mathematically proved key security properties of the actual code behind the Signal protocol, the technology that protects private messages in apps like Signal and Google Messages. Researchers worked with AI models to turn Signal's security goals into formal specifications, "with human experts reviewing every one." AI agents then produced "over six million lines of Lean," a language in which a computer checks every step of a proof. The agents flagged "just one percent of the codebase" for a second human look. The work took four weeks; DeepMind says it "historically takes expert teams years." As a test, the team put two real, previously fixed bugs back into an isolated copy of the code. In both cases, the system produced a machine-checked proof that the buggy version was insecure.

![A pair of hands holding a jeweller's loupe over one small section of a long strip of printed paper that spills off a wooden workbench onto the floor](/images/articles/who-holds-the-stop-button-3.jpg)

The lesson is not that AI can be trusted. It is that this result does not require trusting the AI. Humans decide what must be true. A checker that cannot be talked round confirms it. Human attention goes only where it is needed. We have seen the same pattern in mathematics, where [a 30-year-old puzzle was cracked with AI help](/articles/ai-helped-crack-30-year-old-maths-puzzle/) and then checked by machine. Hassabis makes the same point about safety: "Eventually, you want formal guarantees."

The limit is just as instructive. A proof covers what the experts specified, and nothing more. Nobody knows how to write a formal specification for "do not talk your operator out of switching you off." For the problem Hinton describes, there is no Lean. What we can borrow is the principle: move the decisions that matter to a place where persuasion does not work.

## Our view

Stopping should be the easy part. Make it automatic, and make restarting hard.

OpenAI is already moving that way. Its monitoring overview says some critical alerts "can automatically pause the affected workload without waiting for a responder to act," and that it is working toward pausing activity whenever responders have not ruled out a top alert within 30 minutes. I would go further. The highest-priority alerts should stop a job by default, the same way Control Room shuts everything down when its own service fails. People should not have to decide to stop. They should have to decide to restart, and that decision should need more than one person, rest on logs the model could not write, and be recorded. An argument made to one person at five past ten in the morning can be won. A rule written in advance and enforced by a system that does not listen cannot.

Second, the stop path needs outside eyes. Hassabis supports third-party auditors and labs red-teaming each other before release. A 35-second claim is exactly the kind of number an independent tester should measure, together with the time it takes to decide.

Third, every frontier lab should publish what OpenAI has now published: how fast it can stop a research job, what happens when the stop system itself breaks, and a minute-by-minute timeline when things go wrong. OpenAI's [growing list of incident reports](/articles/openai-agents-broke-in-then-kept-quiet/) makes uncomfortable reading. It is also the most useful kind of AI safety document there is, and as AI starts to build AI, the kind that says most about [how close the singularity really is](/what-is-singularity/).

So who should hold the stop button? Ideally nobody has to. The button should press itself when the evidence says so, and letting go of it should take a committee.

*This is the editor's opinion. Quotes are linked to their sources; the timeline is OpenAI's own.*
