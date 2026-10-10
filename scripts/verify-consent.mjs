import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { parseDocument } from 'htmlparser2';
import { findAll, textContent } from 'domutils';
import site from '../src/_data/site.js';
import { cssRules, styleAt } from './static-layout.mjs';
import { verifyConsentRuntime } from './consent-runtime.mjs';

const read = file => fs.readFile(file, 'utf8');
const consent = await read('src/js/consent.js');
const newsletter = await read('src/js/newsletter.js');
const css = await read('src/css/style.css');
const rules = await read('firestore/sr_newsletter.rules.snippet');
const nodes = root => findAll(node => node.type === 'tag' || node.type === 'script', root.children || []);
const hook = (root, name) => nodes(root).filter(node => Object.hasOwn(node.attribs || {}, name));
const hasClass = (node, name) => (node.attribs?.class || '').split(/\s+/).includes(name);
const sentence = 'Send me the Singularity Review newsletter. Unsubscribe anytime.';
const fields = ['email', 'consentAt', 'consentTextVersion', 'consentText', 'sourcePage', 'source', 'status'].sort();
const allowedScripts = new Set(['transitions', 'site', 'lensing', 'carousel', 'article', 'consent', 'newsletter'].map(name => `/js/${name}.js`));
if (site.adsense.client || site.adsense.preview) allowedScripts.add('/js/ads.js');
const redirect = `(function(l,h,t){if(h.indexOf(l.hostname)>-1&&l.hostname!==t.replace(/^https?:\\/\\//,"")){l.replace(t+l.pathname+l.search+l.hash)}})(location,${JSON.stringify(site.legacyHosts)},${JSON.stringify(site.url)})`;
function checkScripts(html) {
  for (const script of nodes(parseDocument(html)).filter(node => node.name === 'script')) {
    const attrs = script.attribs;
    if (attrs.type === 'application/ld+json') { JSON.parse(textContent(script)); continue; }
    if (attrs.type === 'text/plain') {
      assert.ok(['analytics', 'marketing'].includes(attrs['data-consent']), 'Inert optional scripts need a category gate');
      assert.equal(attrs.src, undefined, 'Inert scripts use data-src');
      continue;
    }
    if (attrs.src) {
      assert.ok(allowedScripts.has(attrs.src.split('?')[0]), `Unknown executable script: ${attrs.src}`);
      if (attrs.src.startsWith('/js/ads.js')) {
        assert.equal(attrs['data-consent'], undefined, 'Ads use an explicit any-decision gate');
        assert.equal(attrs['data-ad-client'], site.adsense.client);
        assert.equal(attrs['data-ad-preview'], String(site.adsense.preview));
      }
      assert.match(attrs.src, /\?v=[a-f0-9]{10}$/);
    } else assert.equal(textContent(script), redirect, 'Only the existing exact host redirect may execute inline');
  }
}
const cookieWrite = /(?:document\s*(?:\.\s*cookie|\[\s*['"]cookie['"]\s*\])\s*=|cookieStore\s*\.\s*(?:set|delete)\s*\()/;
assert.ok(cookieWrite.test('document.cookie = "x=1"'));
assert.ok(cookieWrite.test('document["cookie"] = "x=1"'));
assert.throws(() => checkScripts('<script src="https://example.org/tracker.js"></script>'));
assert.throws(() => checkScripts('<script>fetch("/track")</script>'));
assert.throws(() => checkScripts('<script type="text/plain" data-src="/tracker.js"></script>'));
checkScripts('<script type="text/plain" data-consent="analytics" data-src="/tracker.js"></script>');

for (const file of ['consent', 'newsletter']) assert.equal(await read(`_site/js/${file}.js`), await read(`src/js/${file}.js`));
assert.equal(await read('_site/css/style.css'), css, 'Build must contain current CSS');
const sourceFiles = (await fs.readdir('src', { recursive: true })).filter(file => /\.(js|njk|md|html|css)$/.test(file)).map(file => 'src/' + file);
sourceFiles.push('eleventy.config.js');
for (const file of sourceFiles) assert.doesNotMatch(await read(file), cookieWrite, `${file}: no cookie writes`);
const storageFiles = sourceFiles.filter(file => file.endsWith('.js'));
const storageUsers = [];
for (const file of storageFiles) if (/\b(?:localStorage|sessionStorage)\b/.test(await read(file))) storageUsers.push(file);
assert.deepEqual(storageUsers.sort(), ['src/js/article.js', 'src/js/consent.js', 'src/js/newsletter.js', 'src/js/site.js']);
const storageSource = (await Promise.all(storageUsers.map(read))).join('\n');
const declaredKeys = new Set([...storageSource.matchAll(/['"`](sr-[^'"`]+)['"`]/g)].map(match => match[1]));
assert.deepEqual([...declaredKeys].sort(), ['sr-consent', 'sr-newsletter', 'sr-newsletter-session', 'sr-react:${slug}:${k}', 'sr-sky-paused'].sort(), 'Storage inventory must be updated for any new key');
assert.match(consent, /const CONSENT_VERSION = '2026-10-10'/);
assert.match(consent, /value\.version === CONSENT_VERSION/);
for (const text of ["'sr-consent'", 'window.srConsent', "CustomEvent('sr:consent'", 'onChange(callback)', 'dialog.showModal()', "event.key !== 'Tab'", "'cancel'"]) assert.ok(consent.includes(text));
assert.match(newsletter, /NEWSLETTER_DELAY_MS = 60 \* 1000/);
assert.match(newsletter, /NEWSLETTER_DISMISS_MS = 30 \* 24 \* 60 \* 60 \* 1000/);
assert.ok(newsletter.includes("['localhost', '127.0.0.1', '[::1]']"));
assert.ok(newsletter.includes("'visibilitychange'"));
assert.ok(newsletter.includes('document.hidden'));
assert.ok(newsletter.includes('crypto.subtle.digest'));
assert.ok(newsletter.includes('currentDocument: { exists: false }'));
assert.ok(newsletter.includes("setToServerValue: 'REQUEST_TIME'"));
assert.ok(newsletter.includes("credentials: 'omit'"));
assert.ok(newsletter.includes(sentence));

function checkForm(form) {
  const descendants = nodes(form), checkbox = descendants.find(node => node.attribs?.name === 'newsletterConsent');
  assert.ok(checkbox && checkbox.attribs.type === 'checkbox');
  assert.ok(Object.hasOwn(checkbox.attribs, 'required'));
  assert.equal(checkbox.attribs.checked, undefined);
  const label = descendants.find(node => node.name === 'label' && node.attribs.for === checkbox.attribs.id);
  assert.equal(textContent(label).trim(), sentence);
  assert.ok(descendants.some(node => node.name === 'a' && node.attribs.href === '/privacy/' && textContent(node) === 'Privacy policy'));
  const email = descendants.find(node => node.attribs?.name === 'email');
  assert.equal(email.attribs.type, 'email');
  assert.equal(email.attribs.autocomplete, 'email');
  assert.equal(email.attribs.maxlength, '254');
  assert.ok(Object.hasOwn(email.attribs, 'required'));
  assert.equal(textContent(descendants.find(node => node.name === 'label' && node.attribs.for === email.attribs.id)), 'Email address');
  assert.ok(descendants.some(node => node.attribs?.name === 'website' && node.parent.attribs?.hidden === ''));
  assert.ok(hook(form, 'data-newsletter-fields').every(node => Object.hasOwn(node.attribs, 'disabled')));
}
const pages = (await fs.readdir('_site', { recursive: true })).filter(file => file.endsWith('.html'));
for (const file of pages) {
  const html = await read('_site/' + file), dom = parseDocument(html);
  checkScripts(html);
  for (const script of ['consent', 'newsletter']) assert.match(html, new RegExp(`src="/js/${script}\\.js\\?v=[a-f0-9]{10}" defer`));
  const [banner] = hook(dom, 'data-consent-banner');
  assert.ok(banner && banner.attribs.role === 'region' && banner.attribs['aria-label'] === 'Cookie consent');
  assert.ok(Object.hasOwn(banner.attribs, 'hidden'));
  const buttons = nodes(banner).filter(node => node.name === 'button');
  assert.deepEqual(buttons.map(node => textContent(node)), ['Accept all', 'Reject all', 'Settings']);
  assert.equal(new Set(buttons.map(node => node.attribs.class)).size, 1);
  assert.equal(hook(dom, 'data-consent-dialog')[0].name, 'dialog');
  for (const category of ['analytics', 'marketing']) {
    const input = nodes(dom).find(node => node.attribs?.name === category);
    assert.ok(input && input.attribs.type === 'checkbox' && input.attribs.checked === undefined);
  }
  const necessary = nodes(dom).find(node => node.attribs?.name === 'necessary');
  assert.ok(Object.hasOwn(necessary.attribs, 'checked') && Object.hasOwn(necessary.attribs, 'disabled'));
  const footer = nodes(dom).find(node => hasClass(node, 'site-footer'));
  assert.ok(hook(footer, 'data-consent-open').some(node => textContent(node) === 'Cookie settings'));
  for (const link of ['/privacy/', '/cookies/']) assert.ok(nodes(footer).some(node => node.attribs?.href === link));
  const forms = hook(dom, 'data-newsletter-form');
  const sources = forms.map(node => node.attribs['data-source']).sort();
  assert.deepEqual(sources, file.startsWith('articles/') ? ['article-end', 'footer', 'prompt'] : ['footer', 'prompt']);
  forms.forEach(checkForm);
  const prompt = hook(dom, 'data-newsletter-prompt')[0];
  assert.ok(Object.hasOwn(prompt.attribs, 'hidden'));
  assert.equal(prompt.attribs.role, 'region');
  assert.ok(hook(prompt, 'data-newsletter-close').some(node => node.attribs['aria-label'] === 'Close'));
  if (file.startsWith('articles/')) {
    assert.ok(html.indexOf('data-reactions') < html.indexOf('data-source="article-end"'));
    assert.ok(html.indexOf('class="share-end"') < html.indexOf('data-source="article-end"'));
  }
}
const requiredHeadings = {
  privacy: ['Privacy policy', 'Who we are', 'What we collect', 'Purposes and legal basis', 'Processors and international transfers', 'Retention', 'Your rights', 'How to exercise your rights', 'Children', 'Changes'],
  cookies: ['Cookie policy', 'Cookies today', 'Storage on your device', 'How to change your choice', 'How to clear storage', 'Without JavaScript'],
};
for (const [page, headings] of Object.entries(requiredHeadings)) {
  const html = await read(`_site/${page}/index.html`), dom = parseDocument(html);
  const actual = nodes(dom).filter(node => /^h[12]$/.test(node.name)).map(node => textContent(node));
  headings.forEach(heading => assert.ok(actual.includes(heading), heading));
  assert.ok(html.includes('Last updated 11 October 2026'));
  assert.ok((await read('_site/sitemap.xml')).includes(`/${page}/</loc>`));
}
const placeholderDoc = await read('docs/LEGAL-PLACEHOLDERS.md');
const listed = new Set([...placeholderDoc.matchAll(/\| (\[[^\]\n]+\]) \|/g)].map(match => match[1]));
const legalFiles = ['src/about.md', 'src/contact.md', 'src/terms.md', 'src/privacy.md', 'src/cookies.md', 'src/editorial-standards.md', 'docs/ADSENSE.md', 'docs/CONSENT.md', 'docs/NEWSLETTER.md', 'docs/PRIVACY-AUDIT.md'];
const corpus = (await Promise.all(legalFiles.map(read))).join('\n');
const placeholders = new Set([...corpus.matchAll(/(?<!!)\[([^\]\n]+)\](?!\()/g)].map(match => match[0]));
assert.deepEqual([...listed].sort(), [...placeholders].sort(), 'Every legal placeholder is listed, with no stale entries');
const legalOutput = await read('_site/about/index.html') + await read('_site/contact/index.html') + await read('_site/terms/index.html') + await read('src/_data/site.js') + await read('_site/privacy/index.html') + await read('_site/cookies/index.html') + await read('_site/editorial-standards/index.html');
for (const placeholder of listed) assert.ok(legalOutput.includes(placeholder), `Visible legal placeholder: ${placeholder}`);
for (const method of ['hasOnly', 'hasAll']) {
  const array = rules.match(new RegExp(`${method}\\(\\[([^\\]]+)\\]\\)`))?.[1];
  assert.ok(array);
  assert.deepEqual([...array.matchAll(/'([^']+)'/g)].map(match => match[1]).sort(), fields);
}
assert.ok(rules.includes(sentence));
for (const text of ['hashing.sha256', '.toHexString().lower()', 'consentAt == request.time', 'allow read, update, delete: if false', 'email.size() <= 254', 'sourcePage.size() <= 200', "['prompt', 'article-end', 'footer']"]) assert.ok(rules.includes(text));
const parsedCSS = cssRules(css);
for (const width of [390, 640, 1440]) {
  for (const selector of ['.consent-banner', '.consent-dialog', '.newsletter-prompt']) assert.equal(styleAt(parsedCSS, selector, width, 844).position, 'fixed');
  assert.equal(styleAt(parsedCSS, '.consent-choice', width, 844)['min-height'], '44px');
}
assert.equal(styleAt(parsedCSS, '.newsletter-prompt', 390, 844)['max-height'], '45dvh');
assert.equal(styleAt(parsedCSS, '.newsletter-prompt', 1440, 900).width, '360px');
assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.newsletter-prompt \{ animation: none; transition: none;/);
await verifyConsentRuntime({ consent, newsletter, fields, sentence });
console.log(`CONSENT VERIFIED: ${pages.length} pages, equal consent classes, gated script allowlist, no cookie writes, defaults/version/API, footer controls, legal headings, ${listed.size} visible placeholders, forms, fixed geometry, client/rules fields and Node behavior. Browser checks were not run.`);
