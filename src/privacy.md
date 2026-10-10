---
layout: layouts/base.njk
title: Privacy policy
description: How Singularity Review handles newsletter signups, reactions and site preferences.
updated: "2026-10-10T17:45:21.964Z"
permalink: /privacy/
eleventyExcludeFromCollections: true
---
<div class="legal-page reading-width prose">

# Privacy policy

<p class="legal-version">Last updated 10 October 2026. Version 2026-10-10.</p>

## Who we are

Singularity Review is the publication name. The controller responsible for personal data is [Company legal name], at [Registered address], established in [Country of establishment]. Contact: [Contact email]. Data protection officer: [Data protection officer, if any]. These bracketed details need confirmation before this draft is published as a final policy.

## What we collect

For a newsletter signup, we collect your email address, the consent text and its version, a server timestamp of your consent, the page where you signed up and whether you used the prompt, article form or footer. The stored subscription status initially says pending. The email address is trimmed and lowercased; its SHA-256 hash identifies the record. That hash is a record key, not anonymisation.

Reactions store aggregate counts against an article. Your own reaction choices are remembered on your device, without a site account or reader identifier in the reaction payload. Requests to load counts or change a reaction reach Google, which processes your IP address and request metadata. Counts normally load when the reaction block approaches the viewport, or on article load if that visibility feature is unavailable. We do not describe these requests as anonymous to Google.

Google Firebase Hosting serves this site and may process IP addresses and request metadata in hosting and security logs. Device storage remembers your animation setting, reaction choices, cookie settings and newsletter prompt choice. Session storage counts visible time across pages and records whether and when you have seen the prompt in the current tab. The [Cookie policy](/cookies/) lists those items.

We set no cookies and use no analytics, advertising, pixels or third-party scripts today. Fonts are served from this site's /fonts directory.

## Purposes and legal basis

We use your newsletter signup only to arrange a confirmation and, after confirmation, send the newsletter. The legal basis is your consent under Article 6(1)(a) of the GDPR. The required checkbox is separate from cookie settings. Rejecting optional cookie categories does not prevent a signup you request. No confirmation email or newsletter is sent by this site yet; the email workflow still needs to be connected.

Hosting, security and providing the reactions feature rely on legitimate interests under Article 6(1)(f): operating a reliable publication, protecting it from abuse and letting readers react to articles. You can object to this processing. Necessary device storage supports features and choices you request. Analytics and marketing settings currently control empty categories and do not activate any tools.

## Processors and international transfers

Google Firebase / Google Cloud processes hosting requests and the Firestore reaction and newsletter requests on our behalf. Firestore database location: [Firestore database location to confirm]. Email provider: [Email provider to be chosen]. No email provider is connected yet.

Data may be processed outside your country, including outside the European Economic Area. Google offers safeguards including the EU-US Data Privacy Framework for eligible transfers and Standard Contractual Clauses. The applicable Google entity, contracts, processing locations and transfer mechanism for this service must be confirmed before launch: [Google contracting entity and applicable transfer safeguards to confirm]. Choosing an email provider also requires a review of its processing terms and transfer safeguards.

## Retention

- Newsletter records: [Retention period for confirmed subscriptions and consent evidence]. We propose retaining an active subscription until you unsubscribe, then keeping only the consent evidence needed for [Retention period for consent evidence after unsubscribe]. These are proposals, not configured retention rules.
- Unconfirmed signups: [retention period for unconfirmed signups, proposed 30 days]. Deletion after 30 days is proposed; no automatic deletion job exists yet.
- Reaction counts: [Retention period for reaction counts]. Hosting and security logs: [Hosting and security log retention period to confirm].
- Device preferences remain until you clear them, except that a newsletter dismissal suppresses the prompt for 30 days. Cookie decisions must be renewed when our consent version changes. Session storage lasts for the tab's browsing session. Browser session restore may preserve it.

## Your rights

Where the GDPR applies, you have rights to access your personal data, correct it, request erasure, restrict processing, receive portable data where applicable and object to processing based on legitimate interests. You can withdraw newsletter consent anytime; withdrawal does not affect the lawfulness of earlier processing. Every future newsletter will include an unsubscribe link. Until that workflow is available, contact [Contact email].

You can complain to [Supervisory authority] or the competent data protection authority where you live, work or believe an infringement occurred.

## How to exercise your rights

Write to [Contact email] with your request. For newsletter data, give the email address you used. We may ask for proportionate information to verify ownership of that address. Local device preferences can be removed in your browser; clearing them does not delete a newsletter record or aggregate reaction counts stored in Firestore.

## Children

The newsletter is intended for adults. Please do not sign up if you are under 18. We do not intentionally solicit children's newsletter data. If you believe a child has provided an email address, contact [Contact email] so we can investigate and arrange deletion.

## Changes

We will update this page when our practices change and show the new date and version. Material changes to optional tools will require a new cookie decision. A new newsletter purpose will require appropriate consent before it is used.

</div>
