# Consent controls

Version: 2026-10-10, retained so existing saved choices continue to apply. The consent popup is a fixed, non-modal popup-card on every HTML page, titled Cookies and privacy. It has equally styled Accept, Decline and Settings buttons, does not steal focus on appearance and does not change document flow. It shares a neutral surface, 24px corners, 24px padding, layered shadow, 20px semibold sans title and 14.5px body with the newsletter prompt. All popup buttons have 12px corners and a 44px height. The consent card is bottom-left, 24px from desktop edges and at most 400px wide; the newsletter sits bottom-right. Phones use full-width bottom sheets, top-only rounded corners, safe-area padding and internal scrolling at a 60dvh maximum. Both cards enter with a 16px slide and fade over 240ms, disabled with reduced motion. The consent card also animates out after a decision. The centered desktop modal settings dialog uses the same popup-card and native modal semantics, an explicit Tab trap, Escape handling and focus restoration. Necessary is disabled and on; Analytics and Marketing default to off. Accept grants both categories; Decline denies both. Ads remain disabled today. The planned advertising loader uses the decision gate described below.

`src/js/consent.js` keeps a `CONSENT_VERSION` constant. A missing, malformed or different-version record requires a fresh choice. `sr-consent` is necessary local storage with this record:

```json
{"version":"2026-10-10","necessary":true,"analytics":false,"marketing":false,"decidedAt":"2026-10-10T12:00:00.000Z"}
```

The version is part of the stored decision. `window.srConsent.get()` returns a copy of the current record or null until decided. `window.srConsent.open()` opens settings. `window.srConsent.onChange(callback)` listens for changes and returns an unsubscribe function; use `get()` for the initial value. The script also dispatches `sr:consent` on window with the decision, or null, in `event.detail`. Other tabs and restored pages refresh their record. If storage is blocked, a decision still works on the current page but cannot survive navigation.

Footer and Cookie policy controls reopen settings without a reload. The newsletter cannot appear while either the consent popup or settings dialog is visible, including during the exit animation. Reopening settings hides an already-visible newsletter immediately through sr:consent-ui, a presentation-only event that does not replace sr:consent. The existing 60-second visible-time timer, once-per-session behavior and 30-day suppression remain unchanged. Without JavaScript the banner stays hidden, no preferences are written and no reaction or newsletter requests run. Necessary scripts and self-hosted fonts remain ungated. Hosting and functional Firestore reactions are independent of analytics. The advertising loader is absent from the default build.

## Google Analytics 4 and Microsoft Clarity

Both public IDs live in one place, `src/_data/site.js`:

```js
analytics: { GA4_ID: 'G-XXXXXXX', CLARITY_ID: 'XXXXXXX' }
```

Replace either placeholder to enable that tool. Empty values, placeholders and malformed IDs disable the corresponding tool independently. The template passes escaped IDs as data attributes on the deferred local `/js/analytics.js` bootstrap. Built HTML contains no GA4 or Clarity script src, iframe, preload or preconnect. The bootstrap queues the four Consent Mode v2 defaults before any Google tag is inserted:

```js
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied',
  ad_personalization: 'denied', analytics_storage: 'denied'
});
```

This is [Google's basic consent mode](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic): no vendor script or analytics request before acceptance, and none after Decline on a fresh page. Analytics acceptance queues `analytics_storage: 'granted'`, then injects gtag.js and configures GA4 once. GA4 measures visits, interactions and campaign sources. Clarity supplies heatmaps and session recordings; its [ConsentV2 API](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2) receives `analytics_Storage: 'granted'` and `ad_Storage: 'denied'` before its script is inserted. The analytics bootstrap does not grant advertising signals. A saved Analytics acceptance loads configured tools immediately on later pages. No new preference key or cookie is introduced by our code.

Turning Analytics off, clearing the saved decision in another tab, or restoring a page with a withdrawn decision disables GA4 collection, signals denied consent to loaded tools and reloads the page. Reload discards running libraries and pending loads so cookieless tracking does not continue in a denied mode. Already transmitted data is not erased, and existing vendor cookies may remain until expiry or browser removal. Opening or closing settings alone does not reload. The reload also stops previously activated beehiiv attribution and embeds.

The beehiiv embed loader now requires Analytics acceptance as well as a visible or approached signup. Without acceptance, the signup link remains available on beehiiv's own site. This prevents the embed from making third-party script requests or setting cookies before acceptance or after Decline. The newsletter prompt can still present that link after a decision, with the same timing and exclusive popup rules.

## Advertising and regional CMP requirement

**Google requires a Google-certified CMP integrated with the IAB TCF before serving ads to visitors in the EEA, UK and Switzerland. Our own banner is not a certified CMP.** Enable AdSense Privacy & messaging, making this banner defer or hide duplicate choices, or adopt a certified CMP before that regional launch. Do not implement TCF ourselves. See [AdSense readiness](ADSENSE.md).

The normal deferred local ads.js is included only when adsense.client is set or ADSENSE_PREVIEW=1. It must not use data-consent="marketing", because a reject decision may still permit a non-personalised request with denied storage signals. It explicitly reads the current decision and listens on sr:consent. Both bootstraps share `srGoogleConsentInitialized` so defaults run once and cannot overwrite a returning visitor's granted state. When used without analytics.js, ads.js queues the same four denied defaults with wait_for_update 500 before any Google tag.

Marketing true grants the three advertising signals; Analytics true grants analytics_storage separately. Before a decision no Google script loads. After any valid decision, enabled ads can load once. Marketing denied also sets adsbygoogle.requestNonPersonalizedAds=1 before loading, supplementing denied Consent Mode signals. Granting Marketing resets that flag to 0. Preview mode loads no Google resources and never fills a real ad, whatever the decision.

Revocation updates all signals and the non-personalised request flag. Removing a decision blocks new fills. Visible reservations and previously filled ads retain space; code already loaded cannot be unloaded. The future certified CMP integration must implement the applicable regional withdrawal and Google storage behavior, and must be checked before live ads. This scaffold does not claim TCF compliance.

The consent record version remains 2026-10-10 to preserve returning visitors' saved choices. Enabling live ads requires the certified CMP integration, matching runtime fixtures and policies. Newsletter subscription still requires submitting a signup; Accept alone never subscribes anyone.

## Future script gate

Add a non-essential script only as an inert placeholder:

```html
<script type="text/plain" data-consent="analytics" data-src="/js/example-analytics.js"></script>
<script type="text/plain" data-consent="marketing" data-src="/js/example-marketing.js"></script>
```

The gate creates an executable script only after the relevant category is true for the current version. `data-script-type="module"` can request a module. Safe nonce, integrity, crossorigin and referrerpolicy attributes are copied. A placeholder runs once per page. Inline placeholders can also be used, although an audited local file is easier to maintain.

Adding tools requires reviewing the policies, privacy audit, storage inventory, exact static allowlist and consent version. Do not embed optional vendor scripts as ordinary executable tags, preload their endpoints or make their requests before consent. Static checks reject unknown executable scripts and unknown inline code. Revoking consent prevents new activation; JavaScript already executed cannot be unloaded. Use teardown or reload after saving the new choice to stop loaded tools, as the Analytics bootstrap does.

## Verification boundary

Run `npm run build`, then the static `scripts/verify-*.mjs` checks excluding filenames containing `browser`. There are currently 19 matching entry points, including the suite runner. `scripts/verify-consent.mjs` reads current source and built pages and exercises consent, analytics, ads compatibility, newsletter behavior and UTM links in Node. VM fixtures simulate storage, script insertion, clocks and requests. They cover pre-consent and declined loads, saved acceptance, placeholder IDs, insertion order, duplicate events, withdrawal, blocked storage and both ads/bootstrap orders. No browser or external request is used.

The prepared `scripts/verify-consent-browser.mjs` is for the owner to run. It uses an existing Playwright installation, routes all requests to local `_site` files or in-memory Firestore responses, and never takes screenshots. Default origin is http://localhost:8770. The prompt timer can be shortened with `?nl-delay=2` only for localhost, 127.0.0.1 or IPv6 loopback. Production ignores that query. It checks consent, accessibility behavior, prompt timing, cookies, fixed geometry, layout-shift entries and newsletter payloads. Browser and real Firestore/rules behavior were not run in this task.

The optional sr-lensing-debug storage flag is read only by the local hero diagnostic badge. The site never writes it automatically, sends it or adds tracking. Setting it manually to 1 enables renderer/state/fps/cost text; removing it disables the badge. The consent API and version remain unchanged.
