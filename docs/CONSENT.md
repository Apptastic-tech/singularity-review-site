# Consent controls

Version: 2026-10-10. The banner is a fixed, non-modal region on every HTML page. It has equally styled Accept all, Reject all and Settings buttons, does not steal focus on appearance and does not change document flow. The modal settings dialog uses native modal semantics, an explicit Tab trap, Escape handling and focus restoration. Necessary is disabled and on; Analytics and Marketing default to off. Ads remain disabled today. The planned advertising loader uses the decision gate described below.

`src/js/consent.js` keeps a `CONSENT_VERSION` constant. A missing, malformed or different-version record requires a fresh choice. `sr-consent` is necessary local storage with this record:

```json
{"version":"2026-10-10","necessary":true,"analytics":false,"marketing":false,"decidedAt":"2026-10-10T12:00:00.000Z"}
```

The version is part of the stored decision. `window.srConsent.get()` returns a copy of the current record or null until decided. `window.srConsent.open()` opens settings. `window.srConsent.onChange(callback)` listens for changes and returns an unsubscribe function; use `get()` for the initial value. The script also dispatches `sr:consent` on window with the decision, or null, in `event.detail`. Other tabs and restored pages refresh their record. If storage is blocked, a decision still works on the current page but cannot survive navigation.

Footer and Cookie policy controls reopen settings without a reload. They are hidden without JavaScript. Without JavaScript the banner stays hidden, no preferences are written and no reaction or newsletter requests run. Necessary scripts and self-hosted fonts remain ungated. No analytics tool is active. The advertising loader is absent from the default build.

## Advertising and regional CMP requirement

**Google requires a Google-certified CMP integrated with the IAB TCF before serving ads to visitors in the EEA, UK and Switzerland. Our own banner is not a certified CMP.** Enable AdSense Privacy & messaging, making this banner defer or hide duplicate choices, or adopt a certified CMP before that regional launch. Do not implement TCF ourselves. See [AdSense readiness](ADSENSE.md).

The normal deferred local ads.js is included only when adsense.client is set or ADSENSE_PREVIEW=1. It must not use data-consent="marketing", because a reject decision may still permit a non-personalised request with denied storage signals. It explicitly reads the current decision and listens on sr:consent. Before any Google tag it queues Consent Mode v2 default denied for ad_storage, ad_user_data, ad_personalization and analytics_storage, with wait_for_update 500.

Marketing true grants the three advertising signals; Analytics true grants analytics_storage separately. Before a decision no Google script loads. After any valid decision, enabled ads can load once. Marketing denied also sets adsbygoogle.requestNonPersonalizedAds=1 before loading, supplementing denied Consent Mode signals. Granting Marketing resets that flag to 0. Preview mode loads no Google resources and never fills a real ad, whatever the decision.

Revocation updates all signals and the non-personalised request flag. Removing a decision blocks new fills. Visible reservations and previously filled ads retain space; code already loaded cannot be unloaded. The future certified CMP integration must implement the applicable regional withdrawal and Google storage behavior, and must be checked before live ads. This scaffold does not claim TCF compliance.

The consent record version remains 2026-10-10 while production has no new active tools. Enabling live ads requires a renewed consent version, matching runtime fixtures and policies, and the certified CMP integration. Newsletter consent and Firestore behavior remain independent.

## Future script gate

Add a non-essential script only as an inert placeholder:

```html
<script type="text/plain" data-consent="analytics" data-src="/js/example-analytics.js"></script>
<script type="text/plain" data-consent="marketing" data-src="/js/example-marketing.js"></script>
```

The gate creates an executable script only after the relevant category is true for the current version. `data-script-type="module"` can request a module. Safe nonce, integrity, crossorigin and referrerpolicy attributes are copied. A placeholder runs once per page. Inline placeholders can also be used, although an audited local file is easier to maintain.

Adding tools requires updating the policies, privacy audit, storage inventory, exact static allowlist and consent version. Do not embed optional scripts as ordinary executable tags, preload their endpoints or make their requests before consent. Static checks reject unknown executable scripts and unknown inline code. Revoking consent prevents new activation; JavaScript already executed cannot be unloaded. Each future tool must implement its own teardown and stop tracking through `onChange`, including removal of its optional storage. If it cannot, use a reload after the new choice. The empty categories here need no teardown.

## Verification boundary

Run `npm run build`, then the static `scripts/verify-*.mjs` checks excluding filenames containing `browser`. `scripts/verify-consent.mjs` reads current source and built pages and exercises key consent and newsletter behavior in a Node VM with simulated storage, clock and requests. No browser or external request is used.

The prepared `scripts/verify-consent-browser.mjs` is for the owner to run. It uses an existing Playwright installation, routes all requests to local `_site` files or in-memory Firestore responses, and never takes screenshots. Default origin is http://localhost:8770. The prompt timer can be shortened with `?nl-delay=2` only for localhost, 127.0.0.1 or IPv6 loopback. Production ignores that query. It checks consent, accessibility behavior, prompt timing, cookies, fixed geometry, layout-shift entries and newsletter payloads. Browser and real Firestore/rules behavior were not run in this task.
