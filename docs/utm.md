# Campaign share links

Run `node scripts/utm-link.mjs <url> <slug> [source]` with an absolute http or https URL. Quote URLs containing `&` so your shell passes the whole address.

```sh
node scripts/utm-link.mjs 'https://singularityreview.com/articles/example/?ref=home#story' autumn-reading
node scripts/utm-link.mjs 'https://singularityreview.com/articles/example/' autumn-reading telegram
```

Without a source, the command prints five links in order: telegram, instagram, facebook, threads and meta_ads. With a source, it prints just that link. Each includes `utm_source`, `utm_medium=social` and `utm_campaign=<slug>`. The meta_ads source uses `utm_medium=paid_social`. Existing query parameters and fragments are preserved; existing values for these three UTM parameters are replaced.

Use a short, consistent campaign slug. Do not put personal information in links. GA4 can attribute accepted visits to these campaigns; UTM parameters do not bypass the Analytics consent gate.
