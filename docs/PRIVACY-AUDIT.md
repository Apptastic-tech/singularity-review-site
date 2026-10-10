# Privacy audit

Audited source on 10 October 2026, stage branch rebrand-blackhole. Scope: every file under src/js, templates under src/_includes and src, eleventy.config.js, hosting configuration and current generated pages after the build. No browser, network request, hosting-log access, deployed-rules inspection or production mutation was performed.

## Device storage inventory

| Name | Location | Purpose and contents | Category | Duration | Provider |
| --- | --- | --- | --- | --- | --- |
| sr-sky-paused | localStorage | Boolean string for the reader's requested animation pause | Necessary / functional | Until cleared or changed; no automatic expiry | Singularity Review |
| sr-react:&lt;slug&gt;:&lt;key&gt; | localStorage | Reader's own reaction toggle, stored as 1 | Necessary / functional, user initiated | Until the reaction is removed or storage cleared | Singularity Review |
| sr-consent | localStorage | Version, necessary=true, analytics, marketing, decidedAt | Necessary / functional, consent preference | Until cleared or replaced; new version requires a fresh decision | Singularity Review |
| sr-newsletter | localStorage | Reader's dismissal or submitted subscription choice and its timestamp | Functional, reader choice | Dismissal suppresses 30 days; submitted subscription suppresses until cleared. Record itself remains until cleared or replaced | Singularity Review |
| sr-newsletter-session | sessionStorage | Cumulative visible milliseconds, seen flag and last appearance time across pages in this tab | Functional, prompt presentation | Tab browsing session; session restore may preserve it | Singularity Review |

The prompt does not add a persistent identifier or tracking cookie. Leaving a page while its invitation is still open is treated as dismissing it. The local subscribed value records a submitted signup, not completed double opt-in. Browser storage failure leaves only current-page state.

## Server requests and data

| Service or request | Data and trigger | Classification and processor | Evidence |
| --- | --- | --- | --- |
| Google Firebase Hosting | Site files; Google may process IP and request metadata in server/security logs | Necessary hosting/security; Google Firebase / Google Cloud | firebase.json hosting configuration and .firebaserc project mapping; source cannot establish actual log retention |
| Firestore sr_reactions reads | Aggregate counts by article slug; Google receives IP and request metadata | Necessary / functional, provision of reactions; Google Firebase / Google Cloud | src/js/article.js:39-40, 59-67, 103-111 |
| Firestore sr_reactions commits | Article slug, reaction field and numeric increment on a reader click; no reader id in payload | Necessary / functional, user initiated; Google Firebase / Google Cloud | src/js/article.js:70-81, 85-99 |
| Firestore sr_newsletter commits | Normalised email, exact consent text/version, server consent timestamp, source page/source and pending status; sent only after newsletter checkbox consent | Newsletter consent under Article 6(1)(a); Google Firebase / Google Cloud | src/js/newsletter.js:120-179; docs/NEWSLETTER.md specifies the exact final field set |
| Load more | Fetch of a same-origin next page; normal hosting request metadata | Necessary / functional; hosting by Google | src/js/site.js:175-183; next.origin is checked against location.origin before fetching |
| Self-hosted fonts | Local /fonts requests, normal hosting metadata | Necessary presentation; hosting by Google | src/css/style.css:2-4; eleventy.config.js:110-114 |

Correction to the supplied initial inventory: reaction reads normally start near the viewport through IntersectionObserver with a 600px margin, rather than unconditionally on article load. The fallback loads immediately. No consent gate is applied because the reactions feature is classified as necessary/functional in this brief.

## Source evidence and completeness

The repo was searched with these patterns across src/js, templates and eleventy.config.js:

```text
localStorage|sessionStorage|cookie|fetch\(|sendBeacon|XMLHttpRequest|indexedDB|serviceWorker
<script|https?://|@font-face
```

- Animation preference: src/js/site.js:132 reads sr-sky-paused; :155 writes it only after clicking the motion control.
- Reaction preference: src/js/article.js:41 constructs sr-react keys; :43 reads; :44 writes/removes on a reader's reaction. The Firestore endpoint is :39.
- Consent preference: src/js/consent.js:3-4 declares its version/key; :10-17 validates/reads; :56-57 stores the record. Only analytics and marketing category gates can activate optional scripts (:21-39).
- Newsletter preference and session state: src/js/newsletter.js:2-5 declares 60 seconds, 30 days and both keys; :18-22 reads state; :29-31 stores visible time/seen/last appearance; :33-41 evaluates and stores the reader's choice. :77-104 handles visibility, leaving the page and tab updates.
- All shipped site script tags are local, cache-busted files: src/_includes/layouts/base.njk:51-56 and src/_includes/layouts/article.njk:45. The only executable inline script is the existing legacy-host redirect in base.njk:15. JSON-LD at base.njk:57 is inert structured data. The consent activation gate exists for future scripts; no non-essential script placeholder is present today.
- Share code uses native sharing, the clipboard or a temporary textarea, with no new storage (src/js/article.js:3-32). Social and article reference links are links, not embeds, pixels or scripts. A reader following one leaves this site.
- Lensing, carousel and transitions have no storage write or external request. The only source fetch calls are same-origin page loading, reaction reads/commits and the new newsletter commit. No indexedDB, service worker, beacon, XMLHttpRequest, analytics, ad or pixel mechanism was found.
- No document.cookie assignment or cookie API use was found in shipped source. No site code sets cookies. HTTP response cookies and Google's live logs were not inspected. The owner-run browser check asserts zero cookies in an isolated intercepted test, which does not establish live hosting response behavior.

`scripts/verify-consent.mjs` rechecks the storage inventory, script allowlist, absence of cookie writes, current built assets and the client/rules field-set agreement. It includes positive controls so an unknown executable script or cookie write would fail.

The company controller details, database location, actual log/data retention and final transfer arrangements remain visible placeholders in [LEGAL-PLACEHOLDERS.md](LEGAL-PLACEHOLDERS.md). The Google safeguards described in the stage draft are subject to confirmation for the actual contracting entity and service configuration. Email delivery, confirmation, unsubscribe and deletion jobs are unimplemented plans, not existing collection mechanisms.
