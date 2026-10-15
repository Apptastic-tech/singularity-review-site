import { pathToFileURL } from 'node:url';

const sources = ['telegram', 'instagram', 'facebook', 'threads', 'meta_ads'];

export function utmLinks(input, slug, source) {
  const url = new URL(input);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('URL must use http or https.');
  if (!slug?.trim()) throw new Error('A campaign slug is required.');
  if (source !== undefined && !sources.includes(source)) throw new Error('Source must be one of: ' + sources.join(', '));
  return (source === undefined ? sources : [source]).map(name => {
    const link = new URL(url);
    link.searchParams.set('utm_source', name);
    link.searchParams.set('utm_medium', name === 'meta_ads' ? 'paid_social' : 'social');
    link.searchParams.set('utm_campaign', slug.trim());
    return link.href;
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const [url, slug, source, ...extra] = process.argv.slice(2);
    if (!url || !slug || extra.length) throw new Error('Usage: node scripts/utm-link.mjs <url> <slug> [source]');
    console.log(utmLinks(url, slug, source).join('\n'));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
