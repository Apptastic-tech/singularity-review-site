# SEO follow-up

This is stage-only work. No browser, network, git writes or deployment were used. Static verification checks generated files. It does not establish search indexing, rich-result eligibility, source accuracy, browser appearance or measured CLS.

- No Twitter handle is known. `twitter:site` is omitted until an editor supplies a confirmed handle.
- The site has no search. The WebSite graph deliberately has no SearchAction.
- Reader consent controls visitor features and optional tools. It does not control crawler access to public content. The explicit allowed crawler groups therefore do not conflict with the consent banner. A robots rule expresses a crawling preference; it does not prove crawler compliance.
- Confirm the publication's operator, country of establishment and contact email. The editorial standards page reuses the legal placeholders and adds the pending AI-tool and ownership/funding disclosures listed in LEGAL-PLACEHOLDERS.md.
- Confirm who receives and reviews correction requests. The corrections page describes a proposed procedure; a monitored contact address and correction notes for future substantive corrections need editor review.
- No biography or personal sameAs links are available for Ararat Ovsepian in the site data. The author page shows only his name and articles. Add confirmed details to src/_data/authorProfiles.js when supplied.
- Research and link the opinion essay's named selected sources. It has no linked source and intentionally has no added Sources section. See .audit/sources-missing.json.
- The Europe, Washington and open-web source entries are copied exactly from the user-supplied .audit/sources-research.json. This run did not open or independently verify those pages or reconcile every article claim with them. The Washington source note says no federal charter is published; its 120-day deadline is attributed to Clayton in both the body and takeaways.
- Five source dates are unknown: VentureBeat's Large 4 report, Mistral's model documentation, Ars Technica's Wikimedia report, The Seattle Times' visa-form report and The Verge's Anthropic report. Dates are omitted from their visible citations and structured data. See .audit/sources-to-date.json.
- The Claude article's seven source titles use its existing link labels. Confirm the publishers' exact page titles before replacing those labels; the supplied material does not establish all of them.
- RSS and Atom retain the existing 50-article feed limit. llms.txt lists all published articles. The optional llms-full.txt is not generated.
- Sitemap lastmod uses explicit content modification dates or the latest known article update for collections and pagination. Future pages without a confirmed publication or modification date omit lastmod. Do not infer an editorial date from file timestamps or a deployment date.
- Images retain intrinsic dimensions and normal-flow content reserves its space. Confirm measured CLS of 0, responsive appearance and interaction in a separate editor-run browser review; no browser was permitted for this work.
- Confirm legal and editorial placeholders before publishing these draft policies as final pages. Existing privacy, consent and newsletter follow-up requirements still apply.

The Europe article now attributes the release timing: Mistral promises weights by the end of October; October 27 is attributed to VentureBeat. The later paragraph says "Once the weights are out". Other body text is preserved.

The static rich-result checks implement the requested Article, BreadcrumbList, FAQPage, ProfilePage and Organization property contracts from the brief. No live Google documentation or validation service was consulted because network use was prohibited. Structured data alone does not establish rich-result eligibility.
