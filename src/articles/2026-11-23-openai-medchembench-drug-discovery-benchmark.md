---
title: "OpenAI's MedChemBench: what the drug-discovery benchmark measures, and what it does not"
date: 2026-11-23T14:42:30Z
author: "Ararat Ovsepian"
category: "Analysis"
section: featured
summary: "On 20 November 2026 OpenAI published MedChemBench, a 99-problem test of whether AI models can read molecular structures, interpret experiments and choose what compound to test next. The strongest models in OpenAI's own scoring reconstruct molecules well, but they are much weaker at selecting compounds and predicting measurements. OpenAI and the accompanying preprint are clear that this is a retrospective test, not evidence that a model can discover a drug. This piece sets out what the benchmark measures, where the scores are high and low, and what the company's own caveats, plus an independent review of AI in drug discovery, imply."
description: "OpenAI's MedChemBench tests AI models on 99 medicinal-chemistry problems. What the benchmark measures, how GPT-6.2 Astra scored, where selection and prediction still lag, and why OpenAI says this does not show that models can discover drugs."
seoDescription: "MedChemBench explained: OpenAI's 99-task medicinal chemistry benchmark, the 20 November 2026 scores, the gap between structure reconstruction and compound selection, and the official caveats."
hero: /images/articles/openai-medchembench-drug-discovery-benchmark.jpg
heroAlt: "The OpenAI logo"
heroCaption: "Logo: OpenAI (public domain, via Wikimedia Commons)."
tags: ["MedChemBench", "OpenAI", "Drug discovery", "Medicinal chemistry", "GPT-6", "Analysis"]
takeaways:
  - "MedChemBench, published by OpenAI on 20 November 2026, is a retrospective benchmark of 99 problems drawn from 117 papers and patents, covering 761 molecular structures. It tests whether a model can reconstruct molecules, explain evidence, rank or select compounds, and predict measured properties."
  - "On the company blog, GPT-6.2 Astra earned 84.5 percent of available credit at the xhigh reasoning setting. A preprint dated 9 November 2026, before that model was listed, reported a high of 83.83 percent for GPT-6 Astra at max effort. Both sources say models are much stronger at reconstructing structures than at selecting compounds or predicting numbers; the blog says Astra earned only about half the credit in those last two categories."
  - "Our view: MedChemBench is a useful test of whether a model can follow a historical medicinal-chemistry case. It is not evidence that today's models can discover drugs. OpenAI says so itself. The result that matters is the gap between drawing the molecule correctly and deciding what to make next."
sources:
  - title: "Can AI help scientists identify promising drug candidates?"
    publisher: OpenAI
    url: https://openai.com/index/introducing-medchembench/
    date: "2026-11-20"
  - title: "MedChemBench: Evaluating complex multimodal reasoning in medicinal chemistry"
    publisher: OpenAI (preprint)
    url: https://cdn.openai.com/pdf/09c4ec60-a32e-4652-837b-1811368a3bb0/medchembench-paper.pdf
    date: "2026-11-09"
  - title: "Artificial Intelligence in Small-Molecule Drug Discovery: A Critical Review of Methods, Applications, and Real-World Outcomes"
    publisher: Pharmaceuticals (Sarfaraz K. Niazi)
    url: https://pmc.ncbi.nlm.nih.gov/articles/PMC12472608/
    date: "2025-08-26"
faq:
  - q: "What is MedChemBench?"
    a: "It is OpenAI's benchmark of 99 medicinal-chemistry problems, built from published papers and patents. A model is given the context of a research programme at a chosen point, including structures and selected experimental results, and is asked to reconstruct molecules, explain evidence, choose or rank compounds, and predict properties."
  - q: "Did the best model ace the test?"
    a: "No. On the 20 November blog, GPT-6.2 Astra scored 84.5 percent at the xhigh setting. The harder parts are not structure drawing. The blog says that at xhigh, Astra earned 95.4 percent of the structure credit but only about half the credit for selecting compounds and predicting numerical properties."
  - q: "Does a high score mean the model can discover a new drug?"
    a: "OpenAI says no. The blog states that the results do not establish whether models can discover new drugs or improve laboratory decisions. The tasks are retrospective, each response is a single attempt without tools or new experiments, and prior exposure to the published sources cannot be ruled out."
  - q: "Why do the preprint and the blog report slightly different top scores?"
    a: "The preprint is dated 9 November 2026 and reports a high of 83.83 percent for GPT-6 Astra at max effort, with an xhigh range of 35.02 to 83.33 percent across eleven GPT models. The blog, published eleven days later, adds GPT-6.2 Astra at 84.5 percent and gives GPT-6 Astra 83.3 percent at xhigh. They are consistent on the older model and the later post includes a newer one."
  - q: "What is your view?"
    a: "MedChemBench is worth taking seriously as a test of evidence integration, because it is built from real cases and because OpenAI published its own limits. It should not be read as a claim that AI is now doing medicinal chemistry. The interesting finding is how much harder selection and prediction still are than reconstructing a structure."
---

*Editor's note: this is analysis by the editor of Singularity Review, prepared with AI-assisted research and drafting and checked against the sources linked here. Where I quote OpenAI or an independent review, I use words from a page or paper I opened. The section headed "Our view" is my opinion.*

On 20 November 2026, OpenAI asked a question in the title of a research post and then, to its credit, refused to answer it with a victory lap. "Can AI help scientists identify promising drug candidates?" The post introduces MedChemBench, a benchmark of 99 problems drawn from medicinal-chemistry research, and reports that GPT-6.2 Astra earned 84.5 percent of the available credit at a high reasoning setting. Further down the same page, the company writes that the results "do not establish whether models can discover new drugs or improve laboratory decisions."

That pairing is the story. A new test exists. The scores are high enough to be interesting, and uneven enough to be more interesting still. The benchmark's authors have already said what the numbers should not be used to prove.

## What medicinal chemistry is being asked to do

Medicinal chemistry is the work of turning a promising molecule into one that might become a medicine. OpenAI's post describes the hard part clearly. Improving one property can make another worse. A compound might act strongly against a disease-related protein and still be poorly absorbed, or it might break down too quickly in the body. Chemists work through those trade-offs by designing, making and testing related compounds, then deciding what to try next.

MedChemBench tries to test whether a model can take part in that kind of reasoning, not merely name a molecule. The post says the benchmark draws on 117 papers and patents and includes 761 distinct molecular structures. For most problems, the model receives the context available at a chosen point in a research programme: the biological target, the researchers' goals, the compounds studied so far, and selected experimental findings.

It then grades four components. Can the model reconstruct molecular structures, including atom connections and stereochemistry, from the drawings and groups it is given? Can it explain the supplied evidence, such as why one compound was chosen over another? Can it rank or select compounds that meet the stated requirements? Can it predict numerical values and categories reported in the source, including measured and calculated properties?

The accompanying preprint, "MedChemBench: Evaluating complex multimodal reasoning in medicinal chemistry," is dated 9 November 2026. It describes the same 99 problems as a retrospective, multimodal, case-based test, and it groups the work into seven categories across hit finding, lead optimization and candidate selection, including a large block of integrated lead-selection tasks. The test, in both documents, is historical. The model is not running a lab. It is being asked to follow a case that has already been published.

One example in the blog is typical of the intended difficulty. In a problem drawn from research on PRMT5 inhibitors, the model sees earlier structures and results and must predict how three related compounds will behave in cells, how readily they cross a cell barrier, and how quickly liver enzymes break them down. Later experiments, withheld from the model, showed a trade-off: one compound blocked the target at a lower concentration, while another crossed the barrier more readily and broke down more slowly. Stronger activity did not come as a set with better properties. That is the kind of joint prediction the benchmark is trying to catch.

## The scores, and the gap inside them

Two official documents, eleven days apart, report the headline numbers, and they should be kept distinct.

The preprint of 9 November evaluated eleven models in the GPT family. The highest mean score was 83.83 percent, achieved by GPT-6 Astra at max reasoning effort. At xhigh, the highest reasoning setting shared by all eleven models, scores ranged from 35.02 percent to 83.33 percent. Raising the test-time compute helped every model, by between about 9 and 33 percentage points, but large gaps between models remained. Structure reconstruction was the most spread-out component: GPT-6 Astra earned 95.37 percent of the structure credit at xhigh, against 47.31 percent for GPT-5.6 Sol.

The 20 November blog is consistent with those Astra figures and adds a newer model. At xhigh, it says, GPT-6.2 Astra earned 84.5 percent of the available credit, compared with 83.3 percent for GPT-6 Astra, 82.0 percent for GPT-6.1 Sol, and 58.2 percent for GPT-5.6 Sol. GPT-6 Astra, the post says, was strongest at reconstructing structures and explaining experimental evidence. Selecting compounds and predicting numerical properties proved harder. In the component breakdown, Astra earned 95.4 percent of the structure credit at xhigh, but only about half the credit for selection and for numerical prediction.

That split is more informative than the headline percentage. A model can assemble a complex ring correctly, as the blog illustrates with an 18-atom ring that GPT-6 Astra reconstructed in all ten responses and that two earlier models failed, and still be only about as good as a coin toss, on OpenAI's own grading, at choosing what to make next or at guessing the measured value. The post itself says there is substantial room to improve predictions and compound choices.

The preprint's discussion is equally cautious about what a high score means. Performance, it says, primarily measures agreement with a single historical case under the stated conditions, which may not be fully representative. Contamination or memorization remains a potential concern: a small average benefit from adding explicit source identifiers does not rule out training-data exposure. The benchmark is also close to saturation in its current form, given Astra's 83.83 percent at max effort, and future versions will need to be more challenging if they are to keep distinguishing models.

## What this does not show

OpenAI's blog ends with the limits that a launch post might have been tempted to bury. The results do not establish whether models can discover new drugs or improve laboratory decisions. Prior exposure to the published sources cannot be ruled out. Each response was a single attempt without tools, feedback or new experiments. The benchmark evaluates reasoning from historical evidence rather than real-world drug discovery.

Those are not minor footnotes. A retrospective test on published cases is a different activity from proposing a new analogue, making it, and being right about a property no paper has reported. Agreement with a case that may have been in the training data is a different activity again. OpenAI says all of this in public, which is one reason the benchmark is worth taking seriously.

An independent review, published in the journal Pharmaceuticals on 26 August 2025 and opened for this article on PubMed Central, is useful here as context rather than as a verdict on MedChemBench, which did not yet exist. Sarfaraz K. Niazi argues that AI is a complementary tool in small-molecule discovery, not a replacement for medicinal chemists, experimental validation or quality data. He notes both apparent successes and failures, including an AI-assisted compound, DSP-1181, that was discontinued after Phase I despite a favourable safety profile, as evidence that a faster discovery timeline does not guarantee clinical success. The review's caution matches the shape of OpenAI's own caveats: pattern recognition on past data is not the same as a drug.

## Our view

MedChemBench should be read as a skills test, not as a discovery claim. It is a genuine attempt to grade the parts of medicinal chemistry that are more than structure naming: reading a case, keeping the molecule's identity straight, and making a choice under competing constraints. The official scores suggest that today's strongest models, at least inside OpenAI's own family, are becoming reliable at the first of those tasks and remain clearly limited at the last.

That is not a reason to dismiss the work. It is a reason to keep the title question open. A model that can reconstruct an 18-atom ring and still score about half marks on what to synthesise next is closer to a careful reading assistant than to a chemist. OpenAI has not claimed otherwise. The useful public service of the launch is that it measured the gap, and then described it.
