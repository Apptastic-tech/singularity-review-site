# AdSense readiness

Last updated 11 October 2026. Stage preparation only. Ads are disabled by default, no publisher ID is configured and no live Google requests were made during verification.

## Regional CMP requirement

**Before serving ads to visitors in the EEA, UK and Switzerland, Google requires a Google-certified CMP integrated with the IAB TCF. Our banner is not a certified CMP.** Enable AdSense Privacy & messaging and make our banner defer its duplicated choices to that flow, or adopt another certified CMP. Do not implement TCF ourselves. The scaffold does not implement that regional integration and must not be enabled for those visitors until it exists.

## Configuration

In src/_data/site.js, adsense.client is an empty string. Empty means no slot markup, labels, reservations or loader tags on generated pages. Later use the approved ca-pub publisher ID. adsense.verificationMeta is also empty; set the account value requested by Google. The base layout renders google-adsense-account only when verificationMeta or client is set, preferring verificationMeta and otherwise using client. An HTML comment marks the disabled location.

adsense.slots contains articleA, articleB and homeGrid, each initially [AdSense ad unit ID]. Replace each with its numeric AdSense unit ID. The loader deliberately refuses to submit placeholders. The publisher placeholder pub-XXXXXXXXXXXXXXXX in src/ads.njk also needs replacement, retaining the exact Google seller record and text/plain header.

## Placement and reserved geometry

Article slots follow the third and seventh top-level paragraph of the rendered article body, only when a later top-level paragraph exists. Paragraphs inside quotations, lists and other containers are excluded. Takeaways, sources and the headline are outside the filter input. The homepage slot follows the third story block in Latest and spans all grid columns. It occupies its own row on smaller grids too. No ads are above the lead headline, in the skyline band, in the header or footer, sticky or anchored.

Each slot has a muted Inter Tight Advertisement label and a fixed reserved container. Article containers are 280px on mobile and 250px from 640px width. The homepage container is 250px at all widths. Height equals min-height and overflowing creative content is contained, so a fill cannot move following content. The label adds a reserved 26px. All reservations are present in the initial HTML when enabled.

A MutationObserver watches data-ad-status on the slot and its descendants. An unfilled slot collapses only while it has never intersected the real viewport and still lies below it. Slots seen before, currently visible or above the reader keep their reservation. This avoids a visible collapse or a change in the reader's scroll position. Rejection or revocation never removes visible reservations. Real CLS requires the prepared browser check; static geometry is a model.

## Consent and loader behavior

ads.js is a normal deferred local file only in enabled or preview builds. It is intentionally not data-consent=marketing: non-personalised requests can run after a reader rejects Marketing. Before any Google tag, the local bootstrap queues Consent Mode v2 default denied for ad_storage, ad_user_data, ad_personalization and analytics_storage, with wait_for_update 500. It reads window.srConsent.get() for a saved decision and listens for sr:consent updates.

Marketing true grants all three advertising signals. Analytics true grants only analytics_storage. Missing or withdrawn decisions deny all four. Before any decision, Google loads nothing. After any valid decision, the loader may insert the AdSense script once. With Marketing denied it explicitly sets adsbygoogle.requestNonPersonalizedAds to 1 before loading and keeps Consent Mode advertising signals denied. Granting Marketing changes that flag to 0. This supplements Consent Mode instead of relying on denied signals alone. Rejection does not grant advertising cookie storage.

IntersectionObserver uses rootMargin 600px to fill nearby slots after the Google script is ready, inserting responsive ins elements and pushing once per slot. A separate real-viewport observer records whether the reader has seen a slot. The scroll/resize fallback maintains the same distance and visibility rules. Consent changes update signals and block new filling without a valid decision. Previously loaded Google code cannot be unloaded, and filled ads are not silently refreshed; the certified CMP integration must handle Google's regional revocation and storage behavior before launch.

Preview mode renders neutral reservations with a 1px line border and the Advertisement label. It queues only local consent state and never inserts ins elements, loads the Google script or requests Google resources, even after accept or reject.

## Go-live checklist

- Obtain AdSense approval: original content, substantial About, Contact, Editorial standards, Privacy, Cookies and Terms pages, clear navigation and compliance with Google's content and advertising policies. Replace all legal placeholders and confirm actual practices before final publication.
- Add the approved publisher ID to adsense.client and replace the ads.txt publisher placeholder. Set verificationMeta if Google asks for account verification separately.
- Create ad units and replace articleA, articleB and homeGrid IDs.
- Enable Privacy & messaging or a certified CMP for EEA, UK and Switzerland, including deferral or removal of duplicate local choices. Do this before any ads reach those regions.
- Check Consent Mode v2 defaults, saved decisions, accept, reject, mixed choices and revocation with the configured CMP. Ensure Google is absent before a decision.
- Run default and preview static verification. Run the owner-operated browser verifier at 1440px and 390px, confirm CLS 0 and reservation heights. Repeat with real ads and the CMP on stage before release.
- Validate the final ads.txt in AdSense and confirm its public URL and text/plain Content-Type.
- Keep placement below headlines with no skyline, header, footer, sticky or anchor ads. Disable any account-level Auto ads configuration that would violate these placements.
- Firestore is unaffected: ad code never reads or writes reactions, subscriptions, rules or database configuration.

## Local preview and checks

Use ADSENSE_PREVIEW=1 npm run build to produce an ad layout preview without a client. Default npm run build disables ads. For a separate output use ADSENSE_PREVIEW=1 node node_modules/@11ty/eleventy/cmd.cjs --output=.audit/adsense/preview-site. Both the generated images and sitemap respect that output directory.

Run node scripts/verify-ads.mjs for default and isolated preview artifacts, parser fixtures and consent runtime simulations. The verifier performs no network requests. scripts/verify-ads-browser.mjs is prepared for an owner-run preview server, default http://localhost:8770. It uses the runtime selected by BROWSER_RUNTIME_ROOT, defaulting to /Users/araratovsepian/Agent-RSOC-Platform/Agent-RSOC-Platform/investor-deck. It was not executed in this task.
