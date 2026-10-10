import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseDocument } from 'htmlparser2';
import { findAll, textContent } from 'domutils';
import { insertArticleAds } from '../src/_lib/ads.js';
import { cssRules, styleAt } from './static-layout.mjs';
import { verifyAdsRuntime } from './ads-runtime.mjs';
import site from '../src/_data/site.js';
import nunjucks from 'nunjucks';

const root = process.cwd(), read = p => fs.readFile(p, 'utf8');
const nodes = root => findAll(node => ['tag', 'script'].includes(node.type), root.children || []);
const hasClass = (node, name) => (node.attribs?.class || '').split(/\s+/).includes(name);
const slots = dom => nodes(dom).filter(node => node.name === 'aside' && node.attribs['data-ad-slot']);
const exact = 'google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0';
const checkAdsTxt = value => {
  const lines = value.trim().split(/\r?\n/);
  assert.deepEqual(lines.filter(line => !line.startsWith('#')), [exact]);
  assert.ok(lines.some(line => /^# TODO:/.test(line)));
};
checkAdsTxt(await read('_site/ads.txt'));
assert.throws(() => checkAdsTxt(exact)); assert.throws(() => checkAdsTxt('# TODO: configure\n' + exact.replace('DIRECT', 'RESELLER')));
assert.equal(site.adsense.client, ''); assert.equal(site.adsense.verificationMeta, ''); assert.equal(site.adsense.preview, false, 'Run the verifier against the default build');
const header = JSON.parse(await read('firebase.json')).hosting[0].headers.find(item => item.source === '/ads.txt');
assert.equal(header.headers.find(item => item.key === 'Content-Type').value, 'text/plain; charset=utf-8');
const footerRoutes = ['/about/', '/contact/', '/editorial-standards/', '/privacy/', '/cookies/', '/terms/'];
function footer(html) {
  const dom = parseDocument(html), legal = nodes(dom).find(node => hasClass(node, 'footer-legal'));
  assert.ok(legal); assert.deepEqual(nodes(legal).filter(node => node.name === 'a').map(node => node.attribs.href), footerRoutes);
  assert.ok(nodes(legal).some(node => node.name === 'button' && node.attribs['data-consent-open'] !== undefined && textContent(node) === 'Cookie settings'));
}
assert.equal(await fs.access('_site/js/ads.js').then(() => true, () => false), false, 'Default build omits the ad loader file too');
const defaultFiles = (await fs.readdir('_site', { recursive: true })).filter(file => file.endsWith('.html'));
for (const file of defaultFiles) {
  const html = await read('_site/' + file); footer(html);
  assert.equal(slots(parseDocument(html)).length, 0, 'Disabled builds reserve zero ad space');
  assert.doesNotMatch(html, /src="[^"]*\/js\/ads\.js|<meta name="google-adsense-account"|class="ad-slot/);
}
const css = await read('_site/css/style.css'), rules = cssRules(css);
for (const width of [390, 768, 1440]) {
  const article = styleAt(rules, '.ad-slot-reserved', width, 900);
  assert.equal(article['min-height'], width < 640 ? '280px' : '250px'); assert.equal(article.height, article['min-height']);
  const home = styleAt(rules, '.ad-slot--homeGrid .ad-slot-reserved', width, 900);
  assert.equal(home['min-height'], '250px'); assert.equal(home.height, '250px');
  assert.equal(styleAt(rules, '.ad-slot--homeGrid', width, 900)['grid-column'], '1 / -1');
}
assert.equal(styleAt(rules, '.ad-slot-label', 390, 844)['font'], '400 12px/1.5 var(--sans)');
assert.equal(styleAt(rules, '.ad-slot[data-ad-preview="true"] .ad-slot-reserved', 390, 844).border, '1px solid var(--line)');
const adSource = await read('src/js/ads.js');
for (const key of ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage']) assert.match(adSource, new RegExp(key + ": 'denied'"));
assert.match(adSource, /gtag\('consent', 'default'/); assert.match(adSource, /gtag\('consent', 'update'/);
assert.match(adSource, /addEventListener\('sr:consent'/); assert.match(adSource, /rootMargin: '600px'/);
assert.match(adSource, /if \(preview \|\| !decision \|\| requested/);
assert.doesNotMatch(adSource, /fetch\(|document\.cookie|firestore|data-consent=/);
verifyAdsRuntime(adSource);

// Top-level-only parser fixtures, including nested paragraph traps and threshold boundaries.
const para = n => '<p>Paragraph ' + n + '</p>';
const a = '<aside data-ad-slot="articleA"></aside>', b = '<aside data-ad-slot="articleB"></aside>';
for (const count of [0, 3, 4, 7, 8]) {
  const body = '<blockquote><p>Nested quote</p></blockquote><ul><li><p>Nested list</p></li></ul>' + Array.from({ length: count }, (_, i) => para(i + 1)).join('');
  const result = insertArticleAds(body, { preview: true }, a, b);
  assert.equal(result.includes(a), count > 3); assert.equal(result.includes(b), count > 7);
  if (count > 3) assert.ok(result.includes(para(3) + '\n' + a)); if (count > 7) assert.ok(result.includes(para(7) + '\n' + b));
  assert.equal(insertArticleAds(body, { client: '', preview: false }, a, b), body);
}

await fs.mkdir('.audit/adsense', { recursive: true });
const temp = await fs.mkdtemp(path.join(root, '.audit/adsense/preview-'));
try {
  const result = spawnSync(process.execPath, ['node_modules/@11ty/eleventy/cmd.cjs', '--output=' + temp], { cwd: root, env: { ...process.env, ADSENSE_PREVIEW: '1' }, encoding: 'utf8', timeout: 120000 });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const files = (await fs.readdir(temp, { recursive: true })).filter(file => file.endsWith('.html'));
  let articleA = 0, articleB = 0;
  for (const file of files) {
    const html = await read(path.join(temp, file)), dom = parseDocument(html), all = nodes(dom), renderedSlots = slots(dom);
    footer(html); assert.doesNotMatch(html, /<meta name="google-adsense-account"/);
    assert.match(html, /src="\/js\/ads\.js\?v=[a-f0-9]{10}" data-ad-client="" data-ad-preview="true" defer/);
    for (const slot of renderedSlots) {
      assert.equal(slot.attribs['aria-label'], 'Advertisement'); assert.equal(slot.attribs['data-ad-preview'], 'true');
      assert.equal(textContent(slot).trim(), 'Advertisement');
      assert.ok(nodes(slot).some(node => hasClass(node, 'ad-slot-reserved')));
      for (let parent = slot.parent; parent; parent = parent.parent) assert.ok(!['night-cover','article-header','article-takeaways','article-sources','site-header','site-footer'].some(name => hasClass(parent, name)));
    }
    if (file.startsWith('articles/')) {
      const body = all.find(node => hasClass(node, 'article-body'));
      const children = body.children.filter(node => node.type === 'tag');
      const paragraphs = children.filter(node => node.name === 'p');
      assert.equal(renderedSlots.length, Number(paragraphs.length > 3) + Number(paragraphs.length > 7));
      for (const [count, name] of [[3, 'articleA'], [7, 'articleB']]) if (paragraphs.length > count) {
        const at = children.indexOf(paragraphs[count - 1]); assert.equal(children[at + 1].attribs['data-ad-slot'], name);
        if (name === 'articleA') articleA++; else articleB++;
      }
    } else if (file === 'index.html') {
      const grid = all.find(node => hasClass(node, 'story-grid'));
      const children = grid.children.filter(node => node.type === 'tag');
      assert.ok(children.filter(node => hasClass(node, 'story-block')).length >= 3, 'Current homepage has a full first row');
      assert.equal(renderedSlots.length, 1); assert.equal(children[3].attribs['data-ad-slot'], 'homeGrid');
      assert.ok(children.slice(0, 3).every(node => hasClass(node, 'story-block')));
      assert.ok(html.indexOf('data-ad-slot="homeGrid"') > html.indexOf('class="card-title"'));
    } else assert.equal(renderedSlots.length, 0);
  }
  assert.ok(articleA > 0 && articleB > 0, 'Actual long articles cover both insertion locations');
  assert.equal(await read(path.join(temp, 'js/ads.js')), adSource, 'Preview includes the current local bootstrap');
  checkAdsTxt(await read(path.join(temp, 'ads.txt'))); await fs.access(path.join(temp, 'sitemap.xml'));
  // Output-isolated preview builds cannot leave preview markup in the default artifact.
  assert.doesNotMatch(await read('_site/index.html'), /data-ad-slot="/);
} finally { await fs.rm(temp, { recursive: true, force: true }); }

const required = {
  about: ['What we cover', 'Who runs Singularity Review', 'How we publish', 'Contact the publication'],
  contact: ['General enquiries', 'Corrections', 'Privacy requests', 'Advertising enquiries', 'Postal address'],
  privacy: ['Advertising', 'Planned advertising storage'], cookies: ['Advertising category', 'Planned Google AdSense'],
  terms: ['Acceptance', 'Who we are', 'Use of content', 'User submissions and newsletter', 'No professional advice', 'Accuracy and corrections', 'Third-party links and advertising', 'Liability', 'Changes', 'Governing law and jurisdiction', 'Contact'],
  'editorial-standards': ['Sources and links', 'Corrections', 'Opinion', 'AI tools in production', 'Independence and funding', 'Ads never influence coverage'],
};
const sitemap = await read('_site/sitemap.xml'), llms = await read('_site/llms.txt');
for (const [page, sections] of Object.entries(required)) {
  const html = await read('_site/' + page + '/index.html');
  assert.ok(html.includes('Last updated 11 October 2026')); sections.forEach(section => assert.ok(html.includes(section), page + ': ' + section));
  assert.ok(sitemap.includes('/' + page + '/</loc>')); assert.ok(llms.split('## Policies')[1].includes('/' + page + '/'));
  if (['privacy','cookies'].includes(page)) {
    for (const url of ['https://policies.google.com/technologies/ads','https://policies.google.com/technologies/cookies','https://adssettings.google.com','https://www.aboutads.info']) assert.ok(html.includes('href="' + url + '"'));
    assert.ok(html.includes('Ads are not active yet') || html.includes('not active yet'));
  }
  if (page === 'contact') assert.equal(nodes(nodes(parseDocument(html)).find(node => node.name === 'main')).some(node => node.name === 'form'), false);
}
for (const file of ['docs/ADSENSE.md', 'docs/CONSENT.md']) {
  const text = await read(file); for (const phrase of ['EEA, UK and Switzerland','Google-certified CMP','IAB TCF','Privacy & messaging']) assert.ok(text.includes(phrase)); assert.match(text, /not (?:a )?certified CMP/);
}
const meta = await read('src/_includes/layouts/base.njk');
assert.match(meta, /if site.adsense.verificationMeta or site.adsense.client/);
assert.match(meta, /content="{{ site.adsense.verificationMeta or site.adsense.client }}"/);
const metaBranch = meta.match(/{% if site\.adsense\.verificationMeta or site\.adsense\.client %}[\s\S]*?{% endif %}/)[0];
for (const [verificationMeta, client, expected] of [['','',null], ['ca-pub-111','', 'ca-pub-111'], ['', 'ca-pub-222', 'ca-pub-222'], ['ca-pub-111', 'ca-pub-222', 'ca-pub-111']]) {
  const rendered = nunjucks.renderString(metaBranch, { site: { adsense: { verificationMeta, client } } });
  if (expected) assert.equal(rendered, '<meta name="google-adsense-account" content="' + expected + '">');
  else assert.doesNotMatch(rendered, /<meta/);
}
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'));
const slotTemplate = '{% from "ad-slot.njk" import adSlot %}{{ adSlot("articleA", site) }}';
assert.equal(env.renderString(slotTemplate, { site }).trim(), '');
const enabled = { ...site, adsense: { ...site.adsense, client: 'ca-pub-1234567890123456', preview: false, slots: { articleA: '1234567890' } } };
const enabledSlot = env.renderString(slotTemplate, { site: enabled });
assert.match(enabledSlot, /data-ad-unit="1234567890" data-ad-preview="false"/);
assert.equal(slots(parseDocument(enabledSlot)).length, 1);
const scriptBranch = meta.match(/{% if site\.adsense\.client or site\.adsense\.preview %}[\s\S]*?{% endif %}/)[0];
env.addFilter('asset', value => value + '?v=0000000000');
assert.equal(env.renderString(scriptBranch, { site }), '');
assert.match(env.renderString(scriptBranch, { site: enabled }), /data-ad-client="ca-pub-1234567890123456" data-ad-preview="false"/);
const tracked = ['src','scripts','docs'];
for (const dir of tracked) for (const file of (await fs.readdir(dir, { recursive: true })).filter(file => /\.(?:js|mjs|njk|md|json|css)$/.test(file))) {
  assert.doesNotMatch(await read(dir + '/' + file), /[\u2013\u2014]/, dir + '/' + file + ': no forbidden dashes');
}
console.log('ADS VERIFIED: disabled and isolated preview builds, exact seller record, placements, fixed reservations, policy links, default-denied v2 consent, reject/accept/revoke, no preview requests and placeholder guards. Browser checks were not run.');
