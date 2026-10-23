---
title: "Meta's AI made 'private' share links easy to find"
description: "Researchers found about 6,800 links people had created to share pages from Meta's Muse AI agent, including a loan application and a staff holiday calendar. Meta paused sharing, fixed it and switched it back on."
date: 2026-10-23T16:28:00Z
category: Everyday AI
hero: /images/articles/meta-ai-share-links-were-easy-to-find.jpg
heroAlt: "A paper folder marked only with a handwritten title, left open on a cafe counter beside a set of keys and a takeaway coffee, papers half sliding out"
heroCaption: "Illustration."
author: Singularity Review
draft: false
section: news
tags: [Meta, Muse, Privacy, AI agents, Security, Everyday AI]
seoDescription: "Security researchers found 6,800 Meta Muse share links through public internet records, exposing loan applications and business reports. What happened, how Meta fixed it and why it matters."
takeaways:
  - "What happened: researchers at the security firm Claroc found about 6,800 share links from Meta's Muse AI agent without being sent any of them."
  - "What was inside: among the few hundred they opened were a small business loan application, a company revenue review and a full year staff holiday calendar."
  - "The fix: Meta paused sharing on 20 October, changed the links and switched sharing back on two days later."
sources:
  - title: "Meta Muse exposes users' personal and business secrets when they share conversations"
    publisher: Ars Technica
    url: https://arstechnica.com/security/2026/10/meta-muse-exposes-users-personal-and-business-secrets-when-they-share-conversations/
    date: "2026-10-20"
  - title: "Meta pauses Muse sharing after researchers find AI chats on the web"
    publisher: The Verge
    url: https://www.theverge.com/tech/1014627/meta-muse-ai-sharing-ai-chats
    date: "2026-10-20"
  - title: "Meta turns Muse sharing back on"
    publisher: The Verge
    url: https://www.theverge.com/tech/1017066/meta-muse-sharing-back-on-artifiacts
    date: "2026-10-22"
---

Muse is Meta's new AI agent. It can write documents, fill in forms and keep track of tasks, and it has a share button. Press it and Muse makes a web link, so a colleague or friend can open the page. Only people with the link are supposed to see it.

This week, researchers at the security firm Claroc showed that was not quite true. They found about 6,800 of those links without anyone sending them a single one. "It took one query," they wrote.

![A row of paper envelopes on a mail sorting shelf, each with a handwritten label clearly visible, soft office light](/images/articles/meta-ai-share-links-were-easy-to-find-2.jpg)

## What was inside

The researchers opened a few hundred of the pages. According to Ars Technica, they included a small business owner's loan application with the amount requested, a marketing company's internal revenue review marked for its CEO, a to-do list with a bank fraud alert and part of an account number, and a workplace's full year holiday calendar listing dozens of staff.

## How the links leaked

Every website address has to be looked up in the internet's address book, called DNS, before it opens. Some companies keep records of those lookups and sell searches of them. Muse put the title of each shared page into the front of its address, for example something like "loan-application-draft" followed by a random code. Once the link was opened, that address could end up in those searchable records, title and all.

So the page name told the researchers what was inside before they even clicked.

![A huge old-fashioned card index cabinet in a dim archive, one drawer pulled open, cards standing up](/images/articles/meta-ai-share-links-were-easy-to-find-3.jpg)

## What Meta did

Meta paused the share feature on 20 October after Ars Technica asked about it. On 22 October, Meta's David Singleton said on X that "the underlying issue is now fixed, and sharing is back on." He said the problem affected shared documents and images inside Muse, not chat sharing. Old links now show a note asking visitors to get a new link from the person who shared it.

It is not the first time. The Verge notes that shared chats from ChatGPT, Claude and Grok have turned up in Google search before.

![A sticky note with a handwritten password stuck to the edge of a laptop in a busy shared office, people blurred in the background](/images/articles/meta-ai-share-links-were-easy-to-find-4.jpg)

## Why it matters

More of us are handing AI agents our email, calendars and bank details so they can do jobs for us. A share link feels private, like handing someone an envelope. But "anyone with the link" can mean more people than we think. Before sharing anything an AI made, it is worth asking: would it be fine if a stranger read it?

![An office window at dusk seen from the pavement, warm light inside on a wall calendar and papers pinned to a board, a passer-by's shoulder in the foreground](/images/articles/meta-ai-share-links-were-easy-to-find-5.jpg)
