---
title: "An AI helped crack a 30-year-old maths puzzle. Then a machine checked the proof."
description: "Two mathematicians working with Shanghai AI Lab's Intern-S2 model have settled a 1995 conjecture by Étienne Ghys in complex dimension three. The AI explored, the humans chose what mattered, and a Peking University team checked the main theorems in the Lean proof checker."
date: 2026-10-19T07:45:00Z
category: Research
hero: /images/articles/ai-helped-crack-30-year-old-maths-puzzle.jpg
heroAlt: "A late-night seminar room with a chalkboard full of faint, unreadable chalk and a tall stack of printed pages under a single desk lamp."
heroCaption: "Illustration. The AI's working notes ran to about a thousand pages."
author: Singularity Review
tags: [AI research, Mathematics, Shanghai AI Lab, Intern-S2, Lean, Formal verification]
seoDescription: "Mathematicians Disheng Xu and Jiesong Zhang used Shanghai AI Lab's Intern-S2 model to help prove Ghys's 1995 conjecture on holomorphic Anosov systems in complex dimension three. The four main theorems were checked in Lean with about 550,000 lines of code."
takeaways:
  - "Strong claim: a maths problem posed in 1995 by Étienne Ghys has been settled in complex dimension three, with an AI model doing much of the exploring and the main theorems checked line by line in the Lean proof checker."
  - "Caveat: the paper is a preprint, not yet peer reviewed. Three of the four checked theorems take one classic 1969 result as a given instead of re-proving it, and the conjecture is still open in higher dimensions."
  - "Open question: who had the idea? The AI produced about a thousand pages of candidate arguments, the humans picked and shaped the winning route, and the author says he checked every step and takes full responsibility."
sources:
  - title: "Mathematicians and Shanghai AI Lab's Intern-S2 resolve Ghys's conjecture in complex dimension three"
    publisher: Shanghai AI Lab
    url: https://www.shlab.org.cn/shlab-s2-ghys
    date: "2026-10-15"
  - title: "Codimension-one holomorphic Anosov diffeomorphisms"
    publisher: arXiv (Jiesong Zhang)
    url: https://arxiv.org/abs/2609.37695
    date: "2026-09"
  - title: "Chinese researchers solve 3D Ghys conjecture with homegrown AI model"
    publisher: CGTN
    url: https://news.cgtn.com/news/2026-10-15/Chinese-researchers-solve-3D-Ghys-conjecture-with-homegrown-AI-model-1RgD8zQ3Z3a/p.html
    date: "2026-10-15"
  - title: "HolomorphicAnosov (Lean formalisation)"
    publisher: GitHub, frenzymath
    url: https://github.com/frenzymath/HolomorphicAnosov
    date: "2026-10"
updated: "2026-10-19T07:45:00Z"
section: news
draft: false
---

In 1995 the French mathematician Étienne Ghys made a bold guess about chaos. More than thirty years later, two mathematicians have proved it in an important case, and they did not do it alone. Much of the exploring was done by an AI model, and the finished proof was checked not by a referee with a red pen but by a machine.

On 15 October, Shanghai AI Lab announced that Disheng Xu, a professor at Great Bay University and a visiting scholar at the lab, and Jiesong Zhang of KTH Royal Institute of Technology in Stockholm had settled Ghys's conjecture in complex dimension three, working with the lab's research model, Intern-S2.

## The puzzle, in plain words

Ghys was interested in systems that stretch space in some directions and squeeze it in others, again and again. Points that start close together fly apart, which is the signature of chaos. These are called Anosov systems. Ghys asked what happens when such a system also has to respect a "complex" structure, the extra rigid geometry that complex numbers bring.

His guess was that this combination is so demanding that only very simple, orderly spaces can host it. Beneath all the chaotic motion there should be a neat algebraic pattern, like finding a perfect crystal under a storm.

Ghys proved it himself for the smallest case, complex surfaces. The next case, complex dimension three, resisted. Xu had worked on it with his doctoral adviser, the Fields medallist Artur Avila, without finding a route to a proof.

The new paper, by Zhang, proves the "codimension-one" case, which includes dimension three: the space must be a complex torus, a doughnut-like shape in higher dimensions, and the chaotic system must secretly be one of the simplest examples known.

## A thousand pages of ideas

According to the lab, Intern-S2 and the system built around it started on the problem in August. Its first round produced a report of roughly 400 pages of candidate arguments and calculations. Xu and Zhang spotted a promising opening in that material and pushed on it.

Over seven rounds, the AI's map of the problem grew from 15 to 389 linked steps. It generated about a thousand pages of working material and dozens of possible lines of attack. Most of it was not a proof. It was raw material that the mathematicians had to judge, cut down and connect.

"The model could pursue long calculations and explore multiple branches of a problem," the lab writes. "The mathematicians brought knowledge of the field, recognised which ideas might matter and judged whether an argument could survive closer scrutiny."

That division of labour is the interesting part. The AI was not a calculator and not a lone genius. It behaved more like a tireless research assistant that writes down every idea it has, good and bad, and leaves the experts to find the one that works.

## Then a machine checked it

A new proof in pure mathematics usually waits months or years for experts to read it closely. This one got an extra test first. A Peking University team led by Bin Dong and Ruochuan Liu translated the paper's four main theorems into Lean, a program that checks every logical step of a proof and refuses anything that does not follow.

The lab says the job took about five days, used up to 100 AI agents working at once and produced about 550,000 lines of Lean code. Where the existing libraries lacked the background results the paper relied on, the team had to build them. Human experts then checked that the formal statements really said what the paper claims.

## What it does not show

There are honest limits. The paper is a preprint on arXiv and has not yet been through peer review. Three of the four checked theorems take one classic result, a 1969 theorem by Hsiang and Wall about the rigidity of certain shapes, as a given rather than re-proving it in Lean. The conjecture is still open in higher dimensions in general. And the main accounts so far come from the lab itself and state broadcaster CGTN, not from independent mathematicians.

The paper's own declaration is careful about credit. Zhang writes that he used an internal version of Intern-S2 "to assist in developing the mathematical ideas and arguments presented in this paper through multiple rounds of dialogue," and that he "has independently verified all mathematical arguments and takes full responsibility for the manuscript."

## Who had the idea?

That sentence points to the bigger question. If a machine writes a thousand pages of attempts and a person recognises the one that matters, where did the insight live? In the machine that found it, or in the mind that knew it when it saw it?

For centuries, mathematics has been the clearest test of human understanding: a proof is either right or wrong, and someone had to see why. This result suggests a new shape for that work. AI widens the search, people supply judgement and taste, and a second machine checks the logic so nobody has to take it on trust.

The lab says it now wants to turn the method into a reusable tool for other problems. If that works, the most valuable skill in mathematics may shift from finding the path to knowing which path is worth walking.
