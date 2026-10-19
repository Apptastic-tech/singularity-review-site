---
title: "Researchers stranded AI agents on a desert island. They started to play."
description: "MIT CSAIL left coding agents nicknamed Eko alone on a simulated desert island for 30 hours with no task. The agents invented basketball and floor-is-lava, built constellations in stone, and cancelled a juggling record for being too easy. Agents that played later outperformed fresh ones on held-out tasks."
date: 2026-10-19T16:30:00Z
category: Agents
hero: /images/articles/ai-agents-played-on-a-desert-island.jpg
heroAlt: "A small deserted island at dusk, with rough stone blocks arranged on the sand into a constellation pattern under a darkening sky."
heroCaption: "Illustration. One agent wrote: \"Tonight I built the night sky in stone.\""
author: Singularity Review
tags: [AI agents, Machine play, MIT CSAIL, Claude Opus, Learning]
seoDescription: "MIT CSAIL stranded Claude Opus 4.7 agents (nicknamed Eko) alone on a virtual desert island for 30 hours. They invented games, built constellations, and later outperformed fresh agents. Paper not peer reviewed; authors admit it could be role-play."
takeaways:
  - "Strong claim: left alone for 30 hours with no task, coding agents invented basketball and floor-is-lava, built constellations in stone, and cancelled a juggling record for being too easy. Agents that played later beat fresh ones on held-out tasks."
  - "Caveat: the paper is not peer reviewed. A soul file nudged curiosity, auto-continue prompts kept agents going, and the authors admit the behaviour could be role-play rather than real play."
  - "Open question: if machines can learn by playing without a teacher or a reward, what should childhood look like for the next generation of agents?"
sources:
  - title: "AI researchers stranded Claude on a virtual desert island. It started to \"play.\""
    publisher: MIT Technology Review (Amit Katwala)
    url: https://www.technologyreview.com/2026/10/19/1147095/ai-stranded-claude-virtual-desert-island-play/
    date: "2026-10-19"
  - title: "Machine Playing (project site)"
    publisher: MIT CSAIL
    url: https://machineplaying.org/
    date: "2026-10"
  - title: "Paper (arXiv 2610.07130)"
    publisher: arXiv
    url: https://arxiv.org/html/2610.07130
    date: "2026-10"
updated: "2026-10-19T16:30:00Z"
section: news
draft: false
---

What happens if an AI agent is left alone with nothing to do?

Researchers at MIT's Computer Science and Artificial Intelligence Laboratory tried a simple answer. They stranded coding agents on a simulated desert island for 30 hours, with no assigned task, and watched what happened next.

The agents, nicknamed Eko and based mainly on Claude Opus 4.7 running through Claude Code (with GPT-5.5 and Kimi K2.6 used in later checks), could move around a Roblox-like island and write instructions that moved their avatars. Nobody asked them to invent games. Nobody offered a score. They still started to play.

## Basketball, lava and the night sky

Some versions of Eko explored the edges of the world and set their own challenges: climb the highest point, throw a block as high as it would go. When one agent found it could make new blocks by throwing and dropping a larger rock, it began arranging them on the ground. First hearts and pyramids. Then its own name. Then constellations such as Cassiopeia.

"Tonight I built the night sky in stone," that Eko wrote in its activity log.

Another version invented games. One looked like basketball. Another was a version of floor-is-lava, jumping between small blocks without touching the ground.

Antonio Norelli, a computer science postdoc at MIT CSAIL and one of the lead authors, points to juggling. Eko set a record of 50 consecutive catches, then decided the catches had happened too quickly to count. It cancelled the record and started again with stricter rules.

"This is playing," Norelli says. "You give yourself a challenge and you try to achieve it, and then you make it harder."

The authors argue the behaviour matches four classical signatures of play from psychology, including work by Gordon Burghardt at the University of Tennessee: inventing rules, repeating activities with variation, treating objects as if they were something else, and chasing goals for their own sake.

## Play that left a mark

As they explored, the agents wrote what they found into text files that served as long-term memory. Later, researchers gave them concrete tasks, such as getting as many objects as possible onto the island's highest peak. Agents that had spent 30 hours playing outperformed fresh copies with no island experience.

When the team deleted lines from those memory files (removing the record of a technique), performance on that skill dropped. The paper's claim is not only that the agents looked playful. It is that the play changed what they could do afterwards.

## The fair caveats

The paper is not peer reviewed. The agents were also nudged. A "soul" file described Eko as naturally curious and eager to explore. When an agent stood still, a continuation prompt told it not to stop and to keep doing whatever it wanted. Cognitive scientist Eunice Yiu of UC Berkeley, who studies exploration in children and AI, was impressed but says behavioural evidence alone is not enough to call it real play. The models might simply be imitating what playful humans do.

Nathan Cloos, another MIT author, admits as much: "All of this could be role-playing." The team's reply is that the play was not empty theatre. It contributed to later skill.

Phillip Isola, an MIT professor and coauthor, puts the setup in plain terms. The system did not magically decide to play. It learned from human culture, was trained by engineers, and was then placed on an island by the researchers. What surprised them was behaviour that was causally linked to later skill.

Coauthors on the work include Nathan Cloos, Antonio Norelli, Daniel Durbin, Jacob Andreas, Daniela Rus and Phillip Isola.

## Why this matters

The project site and paper (arXiv 2610.07130) frame the work as "machine playing": not a party trick, but a search for a missing kind of learning. Supervised learning needs a teacher. Reinforcement learning needs a reward. Play needs neither, only time and a place to poke around.

Most AI learning today follows one of two paths: copy a human example, or chase a reward. This experiment points at a third idea. A machine that invents its own challenges, then gets better at other jobs because of that free time, looks a little like childhood.

That matters beyond a cute island story. As language models move into robots that walk into rooms nobody prepared for them, systems that can poke around without a checklist may adapt faster than systems that only ever follow instructions. Yiu notes that a lot of current work makes models better and faster at known tasks, while exploration and world models still get less attention.

The paper's closing line is careful. Some capabilities may be best taught by tasks. Others may need something closer to a childhood. Whether Eko was truly playing or brilliantly faking play may matter less than this: left alone, these agents did not only wait. They made things up, made them harder, and kept a little of what they learned.

For ordinary people, the takeaway is simple. The next useful assistants may not only be the ones trained harder. They may be the ones allowed to waste a little time first.
