# Newsletter architecture

Stage only, version newsletter-2026-10-10. No emails are sent now. The browser writes only a pending signup; the confirmation workflow is still a plan.

## Forms and prompt

`src/_includes/newsletter.njk` supplies the same form for `prompt`, `article-end` and `footer`. Each has an email label, unticked required consent checkbox, separate Privacy policy link and hidden website honeypot. Fieldsets start disabled, preventing any fallback request without JavaScript. `src/js/newsletter.js` enables them and handles validation and submission. The checkbox sentence is exactly:

> Send me the Singularity Review newsletter. Unsubscribe anytime.

The prompt appears after 60 seconds of cumulative visible time in the tab, across pages. Hidden time does not count. `sr-newsletter-session` stores the visible milliseconds, whether it has appeared and its last appearance time. It waits for a current cookie decision of any kind, and for settings and the mobile menu to close. It never appears on /privacy/ or /cookies/. It announces politely without moving focus. Clicking its non-interactive copy can focus its heading. Close or Escape dismisses it; navigating away with it still open also counts as dismissing the invitation. There is no backdrop or scroll lock. Mobile height is capped at 45% of the viewport, with internal overflow for small screens or enlarged text. Desktop width is 360px. Reduced motion removes its appearance animation.

`sr-newsletter` stores `{ "state": "dismissed" | "subscribed", "at": "ISO timestamp" }`. Dismissal suppresses invitations for 30 days, while a submitted subscription suppresses until storage is cleared. "Subscribed" here means the reader submitted the form; the Firestore status remains pending until server-side confirmation. Expired dismissal records are ignored rather than automatically deleted. A session that has already shown the prompt keeps it suppressed for that tab session; the appearance flag can expire after 30 days in a long-lived or restored tab. Inline forms remain available. Clearing local storage does not unsubscribe an address. Storage failure falls back to current-page memory.

## Commit payload

Endpoint: `https://firestore.googleapis.com/v1/projects/apptastic-mobi/databases/(default)/documents:commit`. No Firebase SDK or third-party script is loaded. Credentials are omitted and no referrer is sent. A 15-second abort gives a retry message for a hung request.

The email is trimmed, lowercased, checked against a basic email pattern and limited to 254 characters. Web Crypto SHA-256 of its UTF-8 bytes becomes the lowercase 64-character hex document id in `sr_newsletter`. The hash is not anonymisation. The required checkbox grants consent independently of cookie settings.

The exact final Firestore field set is:

| Field | Value |
| --- | --- |
| email | Trimmed, lowercased email string |
| consentAt | Server timestamp via updateTransforms, setToServerValue REQUEST_TIME |
| consentTextVersion | newsletter-2026-10-10 |
| consentText | Send me the Singularity Review newsletter. Unsubscribe anytime. |
| sourcePage | location.pathname, truncated to 200 characters |
| source | prompt, article-end or footer |
| status | pending |

The commit contains one update, six string fields, the consentAt transform and `currentDocument: { exists: false }`. No read is made to check whether an address exists. A successful create or an existing-document precondition failure shows the same neutral message:

> Thanks. We'll email you to confirm your subscription before sending anything.

ALREADY_EXISTS and FAILED_PRECONDITION are treated neutrally because this write has only the exists=false precondition. Other errors, including permission denial, show "Could not subscribe. Please try again shortly." No address or server details are exposed in that error. A honeypot entry produces the neutral result without a request. The public create endpoint still needs abuse protection; the honeypot is only a basic filter.

## Rules handoff

The prepared rule is [sr_newsletter.rules.snippet](../firestore/sr_newsletter.rules.snippet). Paste the `match /sr_newsletter/{id}` block inside the existing `match /databases/{database}/documents` service block in `~/Apptastic-markup-site/firestore.rules`. That file has another person's uncommitted WIP. It was not opened or edited here. A human must reconcile that work, merge this block, validate it with the Firestore emulator and deploy it separately. Do not replace the existing rules file with this snippet.

The block permits creates with exactly the seven fields above, validates types, lengths, lowercase email, its SHA-256 id, the exact consent sentence, server request time, allowed source and pending status. Reads, updates and deletes are denied to clients. Firestore rules provide `hashing.sha256(...).toHexString()` and string `lower()` for the id check; this prepared use still needs compiler/emulator validation in the target rules environment. No emulator or deployment was run here. Privileged Admin SDK server code can confirm or delete entries under separately controlled credentials.

According to the supplied deployment brief, the current catch-all deny rule rejects these writes until the newsletter create rule is deployed, so forms will show the retry message. That live rule state has not been inspected or tested. Firestore allow rules are additive; retain the catch-all deny and inspect other matching allow rules so they do not grant newsletter reads or updates.

App Check is recommended along with server-side rate limits and abuse monitoring. The REST client currently sends no App Check token. Evaluate App Check support and enforcement for this REST-only web flow in the target Firebase setup; add token acquisition and verification before enforcing it. A protected server endpoint may be a better place for bot checks, rate limiting and email delivery.

Database location remains [Firestore database location to confirm]. Email processor remains [Email provider to be chosen].

## Double opt-in plan

1. A Cloud Function on creation of an sr_newsletter document sends a confirmation email with a signed, expiring token link. Use a secret from managed server configuration, bind the token to the document and intended action, and make retries idempotent so duplicate function deliveries do not spam the reader. Confirm the document is still pending before sending. Keep email credentials off the client.
2. A confirmation endpoint verifies the signature, expiry and document binding, then changes status to confirmed and writes confirmedAt using the Admin SDK. Replays should show a neutral already-confirmed result. Only confirmed records enter newsletter delivery.
3. A scheduled job deletes unconfirmed pending records after [retention period for unconfirmed signups, proposed 30 days]. This is proposed and not implemented. Approve [Retention period for confirmed subscriptions and consent evidence] and [Retention period for consent evidence after unsubscribe] before setting the remaining retention rules.
4. Every email includes a signed unsubscribe link. The unsubscribe endpoint stops delivery promptly, records withdrawal with only the approved evidence, and handles repeated requests neutrally.

## Provider options

| Provider | Required setup |
| --- | --- |
| Resend | API key stored server-side; verified sending domain with SPF, DKIM and DMARC DNS records; email templates; sending and bounce handling |
| Brevo | API key stored server-side; sender domain verification; list id; templates; opt-in and unsubscribe handling |
| Mailchimp | API key stored server-side; audience id; mapped signup fields and consent evidence; its own double opt-in can replace our confirmation function and endpoint |

Choose and verify the provider's processing terms, locations, transfer safeguards and deletion behavior before connecting it. No provider, secret, function, confirmation endpoint, deletion job or DNS record is configured by this work.
