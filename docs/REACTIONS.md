# Share bar and reactions

## Share bar
`src/_includes/share.njk` renders plain share links (Facebook, X, LinkedIn, Threads, WhatsApp, Telegram, Reddit, Email) plus Copy link and a native Share button that `src/js/article.js` reveals only when `navigator.share` exists. No third-party SDKs or trackers. Every link shares the canonical `site.url` article URL. Brand icons come from `simple-icons` (CC0) at build time via `src/_data/shareIcons.js`.

## Reactions
- Data: Firestore `(default)` database in project `apptastic-mobi`, collection `sr_reactions`, one document per article slug, integer fields `like`, `up`, `fire`, `mind`, `think`, `sad`.
- Client: `src/js/article.js` reads the document via the Firestore REST API when the reactions block nears the viewport and writes with an atomic `increment` field transform (+1 or -1). No SDK, no auth. localStorage (`sr-react:<slug>:<key>`) remembers this browser's votes so a second tap toggles off.
- Rules: the project's Firestore rules live in the dashboard repo (`Apptastic-markup-site/firestore.rules`), not here. Deploy them from that repo with `firebase deploy --only firestore:rules --project apptastic-mobi`. The Singularity Review block is:

```
    // Singularity Review (singularityreview.com) anonymous article reactions.
    // Public read of single docs; writes may only move one known counter by exactly 1, never below 0.
    function srReactionKeys() {
      return ['like', 'up', 'fire', 'mind', 'think', 'sad'];
    }

    function srChanged() {
      return request.resource.data.diff(resource.data).affectedKeys();
    }

    function srKeyOk(k) {
      return !(k in srChanged()) || srStepOk(k);
    }

    function srStepOk(k) {
      return k in request.resource.data
        && request.resource.data[k] is int
        && request.resource.data[k] >= 0
        && (request.resource.data[k] == resource.data.get(k, 0) + 1
            || request.resource.data[k] == resource.data.get(k, 0) - 1);
    }

    match /sr_reactions/{slug} {
      allow get: if slug.matches('^[a-z0-9-]{1,120}$');
      allow list: if false;
      allow create: if slug.matches('^[a-z0-9-]{1,120}$')
        && request.resource.data.keys().hasOnly(srReactionKeys())
        && request.resource.data.keys().size() == 1
        && request.resource.data[request.resource.data.keys()[0]] == 1;
      allow update: if request.resource.data.keys().hasOnly(srReactionKeys())
        && srChanged().size() == 1
        && srChanged().hasOnly(srReactionKeys())
        && srKeyOk('like') && srKeyOk('up') && srKeyOk('fire')
        && srKeyOk('mind') && srKeyOk('think') && srKeyOk('sad');
      allow delete: if false;
    }
```
