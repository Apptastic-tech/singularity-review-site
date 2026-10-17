---
title: "Claude cracked the NIST curve seed mystery. The answer was a 1997 clock."
description: "For 25 years nobody could say where the seeds behind P-256 and the other NIST elliptic curves came from. Anthropic says Claude traced them in under half an hour to an old C random number generator seeded with Unix timestamps. No backdoor, no break, and a $36,864 bounty for Let's Encrypt."
date: 2026-10-17T05:10:00Z
category: Research
hero: /images/articles/nist-curve-seeds-claude.jpg
heroAlt: "A heavy steel vault door swung open in a dark concrete room, revealing only a small beige 1990s desk clock and a floppy disk on a shelf inside."
heroCaption: "Illustration. The big secret turned out to be ordinary."
author: Singularity Review
tags: [Anthropic, Claude, Cryptography, NIST, NSA, Elliptic curves, ECDSA, P-256, Let's Encrypt]
seoDescription: "Anthropic says Claude found how the NSA-supplied NIST P-256, P-384, P-521, P-224 and P-192 curve seeds were generated: lrand48 output seeded with 1997 to 1998 Unix timestamps. What was found, what it means for backdoor fears, and what is still unexplained."
takeaways:
  - "Strong claim: The seeds for NIST P-192, P-224, P-256, P-384 and P-521 were produced by the lrand48 random number generator seeded with Unix timestamps from May 1997 to April 1998. Anthropic published code that reproduces them, and bounty organizer Filippo Valsorda independently reimplemented and verified it."
  - "Strong claim: This is not an attack or a weakness. Anthropic says no action is needed, and Valsorda says the findings rule out the seed-manipulation technique behind years of backdoor theories."
  - "Open question: Some valid candidate curves were skipped for reasons nobody can explain, one binary seed (B-163) is still unsolved, and the base points of P-224, P-256, P-384 and P-521 remain unexplained."
sources:
  - title: "Claude reveals ECDSA curve origins"
    publisher: Anthropic
    url: https://www.anthropic.com/research/ecdsa-curve-origins
    date: "2026-10-16"
  - title: "The NIST Elliptic Curves Seeds Bounty Has Been Claimed"
    publisher: Filippo Valsorda
    url: https://words.filippo.io/seeds-solved/
    date: "2026-10-16"
  - title: "Anthropic says Claude solved 25-year cryptography mystery in 30 minutes"
    publisher: Investing.com
    url: https://www.investing.com/news/economy-news/anthropic-says-claude-solved-25year-cryptography-mystery-in-30-minutes-4954741
    date: "2026-10-16"
  - title: "Claude traces NIST P-256 seed to a 1997 random number generator run"
    publisher: Crypto Briefing
    url: https://cryptobriefing.com/claude-traces-nist-p256-seed-origins/
    date: "2026-10-16"
updated: "2026-10-17T05:10:00Z"
section: news
---

For a quarter of a century, one string of hex sat at the heart of internet security with no explanation attached. `C49D3608 86E70493 6A6678E1 139D26B7 819F7E90` is the seed behind NIST P-256, the elliptic curve that signs and protects a huge share of web traffic. The NSA handed it over in 1997. Nobody outside could say where it came from. This week Anthropic said its Claude model worked it out in under half an hour. The answer is almost funny: the seed came from a clock.

## The riddle

![A dusty late-1990s office at night with a beige PC tower, keyboard, desk lamp and analog wall clock, cold light through the blinds](/images/articles/nist-curve-seeds-claude-2.jpg)

When NIST standardized its elliptic curves in FIPS 186-2 in 2000, each curve came with a "seed." The seed is hashed, and the hash sets one of the curve's coefficients. The idea is that a random-looking seed proves nobody hand-picked a curve with hidden weaknesses. The catch: the seeds themselves came from the NSA with no account of how they were chosen. That gap fed years of suspicion that the agency could have shopped for seeds that produced curves only it knew how to break.

The best story on record came from NSA mathematician Jerry Solinas, who said in 2015 that the seeds were hashes of a joke phrase, something like "Give Bob and Jerry a raise." He did not remember the details, and no archive turned up. Solinas died in 2023. Cryptographer Filippo Valsorda put up a bounty for anyone who could find the real origin. Several people, including Anthropic staff, chased the passphrase and came up empty.

## What Claude did differently

According to Anthropic's write-up, an employee asked an internal research model to figure out how the seeds were generated, without steering it toward the passphrase clue. Claude bet on a different idea: the 1997 software probably used one of the weak random number generators that shipped with C libraries of that era, and weak generators leave fingerprints.

It wrote a scanner that slid along each seed bit by bit, testing 34 combinations of old generators and output slices. Then it noticed something: in four of the ten published seeds, the top bit of every 32-bit word was zero. By chance, that happens roughly once in 5,810 tries. It is the signature of `lrand48`, a POSIX generator that only returns the top 31 bits of a 48-bit state. For the prime-curve seeds, which kept fewer bits per output, Claude treated state recovery as a lattice problem and solved it with the LLL algorithm, a standard tool for this kind of math.

Because this generator runs backward as easily as forward, Claude stepped each recovered state back to its starting value. Every one of the ten prime-curve starting values decoded to a Unix timestamp between May 1997 and April 1998. For P-256, the generator was started at 01:52:34 UTC on August 16, 1997, and the published seed was its 1,842nd 20-byte candidate.

## Verified, not just claimed

Two things make this more than a neat story. First, Anthropic published short code that regenerates all the seeds from those timestamps. A 160-bit match from a 32-bit starting value plus a small index does not happen by coincidence, ten times over. Second, Valsorda, who ran the bounty, reimplemented the method in Go and confirmed it. The team claimed the full bounty on October 15. Choosing to donate it to ISRG, the nonprofit behind Let's Encrypt, tripled the prize to $36,864.

## What it means for backdoor fears

Strong claim: this is not a break. Anthropic says plainly that there is no new attack, no weakness and nothing anyone needs to change. If anything, it argues the curves are cleaner than critics feared.

The sharper point comes from Valsorda. A 2017 technique described by Daniel Bernstein and Tanja Lange would have needed about 70 bits of freedom in choosing a seed to target a hypothetical class of weak curves. With seeds pinned to a clock and a short run of candidates, the NSA would have had about 30 bits of freedom at most, even being generous. That is not enough to aim for weak curves or plant a backdoor only the agency could use. Valsorda now says he would personally recommend the NIST curves over Curve25519, just as the industry starts moving to post-quantum signatures.

## What is still unexplained

Moderately strong claim, with gaps. Not every viable candidate made it into the standard. For P-256, candidate 876 from the same run would also have produced a valid curve, yet the 1,842nd was published. Other runs skipped more. Valsorda found one undocumented filter that explains part of this, but roughly twice as many valid seeds exist as were published, and nobody knows why. Anthropic and Valsorda both read the skips as too few to hide a deliberate weak-curve search. One binary-curve seed, B-163, still fits nothing. The base points for P-224, P-256, P-384 and P-521 also remain unexplained, although Claude traced six other base points to the generator in Arjen Lenstra's FreeLIP library.

## Our view

Take as fact that the NIST prime-curve seeds are reproducible output of `lrand48` seeded with late-1990s timestamps, because anyone can now rerun the code. Take as well-argued, not proven, that this closes the door on a seed-level backdoor. Take the skipped candidates and missing base points as the remaining loose threads.

The bigger story is the method. People spent years hunting a forgotten phrase. A model reframed the question as "what software would a 1997 engineer have used?" and found the answer in about 30 minutes, then stopped to check whether it was being tested before trusting its own result. That is what useful AI research help looks like: a fresh angle, a checkable result and code anyone can run.
