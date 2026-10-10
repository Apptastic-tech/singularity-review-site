import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import { checkHeroControls } from './hero-contract.mjs';
import { verifyNavigation, publishedArticles } from './verification-helpers.mjs';
import navigation from '../src/_data/navigation.js';

const expected = ['News', 'Featured', 'Explainer', 'About'];
assert.deepEqual(navigation.map(item => item.label), expected);
const legacy = /(?:author-avatar|expert-photo--initials|brand-mark|\binitials\b|\beyebrow\b|\bkicker\b)/;
const sectionCopy = /Singularity headline news|Featured author articles|What is singularity|Who we are|Explore Singularity Review|From our authors|IDEAS, ANALYSIS|THE LATEST DEVELOPMENTS IN AI/;
const plain = value => value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const markup = (html, tag, name) => html.match(new RegExp(`<${tag} class="${name}"[^>]*>([\\s\\S]*?)</${tag}>`))?.[1];
function checkChrome(html, file) {
  const header = markup(html, 'header', 'site-header');
  assert.ok(header, `${file}: header exists`);
  // Owner's tenth note: the AI black hole mark returns beside the one-typeface serif wordmark.
  assert.equal((header.match(/<img/g) || []).length, 1, 'Exactly one header image: the AI black hole mark');
  assert.match(header, /<img class="masthead-mark"[^>]*alt=""/);
  assert.doesNotMatch(header, /<picture|<svg|<em|<strong/);
  assert.match(header, /<span class="brand-wordmark">Singularity Review<\/span>/);
  assert.match(header, /class="header-inner">[\s\S]*class="desktop-nav"[\s\S]*class="menu-toggle"[\s\S]*<\/div>\s*<nav class="mobile-menu"/, 'Navigation and menu button occupy the masthead row');
  assert.doesNotMatch(html, legacy, `${file}: no avatar, icon or decorative heading markup`);
  // The privacy policy has the required plain-language "Who we are" section.
  assert.doesNotMatch(file === 'privacy/index.html' ? html.replace('<h2>Who we are</h2>', '') : html, sectionCopy, `${file}: current publication labels`);
  const menu = markup(html, 'nav', 'mobile-menu');
  assert.equal((menu.match(/<a\b/g) || []).length, 4, 'Mobile sheet contains only the four sections');
  assert.doesNotMatch(menu, /<p|<h[1-6]|menu-social/);
  const footer = markup(html, 'footer', 'site-footer');
  assert.ok(footer);
  assert.equal((footer.match(/class="footer-column(?: footer-identity)?"/g) || []).length, 4);
  assert.doesNotMatch(footer, /<img|<picture|<em/);
  assert.equal(plain(markup(footer, 'a', 'footer-brand')), 'Singularity Review');
  assert.equal(plain(markup(footer, 'p', 'footer-description')), 'AI news, research, and analysis');
  assert.deepEqual([...footer.matchAll(/<h2 class="footer-heading"[^>]*>([^<]+)<\/h2>/g)].map(item => item[1]), ['Sections', 'Topics', 'Follow']);
  assert.deepEqual([...markup(footer, 'nav', 'footer-social').matchAll(/<span>([^<]+)<\/span>/g)].map(item => item[1]), ['Facebook', 'Instagram', 'RSS']);
  assert.match(footer, /&copy; \d{4} Singularity Review[\s\S]*href="\/about\/">About/);
  for (const text of ['Kitt Peak at Night', 'KPNO/NOIRLab/NSF/AURA/P. Marenfeld', 'CC BY 4.0']) assert.ok(footer.includes(text));
  for (const [, byline] of html.matchAll(/<p class="(?:byline meta|card-byline meta(?: lead-byline)?|carousel-byline meta)">([\s\S]*?)<\/p>/g)) {
    assert.match(plain(byline), /^By .+ · [A-Z][a-z]+ \d{1,2}, \d{4}(?: · \d+ min read)?$/);
    assert.match(byline, /<time datetime="[^"]+">/);
    assert.doesNotMatch(byline, /<img|<a[^>]+href="\/articles\//);
  }
  assert.doesNotMatch(html, /<a\b[^>]*>(?:(?!<\/a>)[\s\S])*?<a\b/, 'No nested links');
}
const pages = (await fs.readdir('_site', { recursive: true })).filter(file => file.endsWith('.html'));
for (const file of pages) {
  const html = await fs.readFile('_site/' + file, 'utf8');
  checkChrome(html, file);
  const active = file.startsWith('featured/') || file.startsWith('authors/') || (file.startsWith('articles/') && /<p class="byline meta">By <a/.test(html)) ? '/featured/' : file.startsWith('about/') ? '/about/' : file.startsWith('what-is-singularity/') ? '/what-is-singularity/' : '/';
  verifyNavigation(html, active);
}
const home = await fs.readFile('_site/index.html', 'utf8');
// Mutations prove the absence checks reject the very markup they are intended to catch.
for (const [oldValue, newValue] of [
  ['<span class="brand-wordmark">', '<img src="/favicon-32.png"><span class="brand-wordmark">'],
  ['class="footer-column footer-identity"', 'class="missing-column"'],
  ['Singularity Review</span>', 'Singularity Review</span><span class="author-avatar">AO</span>'],
  ['class="footer-description"', 'class="eyebrow"'],
  ['>News</a>', '>Old news label</a>'],
]) assert.throws(() => { const fixture = home.replace(oldValue, newValue); checkChrome(fixture, 'negative control'); verifyNavigation(fixture); });
assert.match(home, /id="carousel-heading">Featured<\/h2>/);
assert.deepEqual([...markup(home, 'nav', 'footer-topics').matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map(item => item[1]), ['Agents', 'Models', 'Policy']);
for (const [file, title, heading] of [['index.html','News',null], ['featured/index.html','Featured','Featured'], ['about/index.html','About','About'], ['what-is-singularity/index.html','Explainer','What is the singularity?']]) {
  const html = await fs.readFile('_site/' + file, 'utf8');
  if (file === 'index.html') assert.match(html, /<title>Singularity Review: AI news, research, and analysis<\/title>/);
  else assert.match(html, new RegExp(`<title>${title} \\| Singularity Review</title>`));
  if (heading) assert.ok(html.includes(`<h1>${heading}</h1>`));
}
for (const article of await publishedArticles(process.cwd())) {
  const html = await fs.readFile(`_site/articles/${article.slug}/index.html`, 'utf8');
  assert.match(plain(markup(html, 'p', 'byline meta')), / · \d+ min read$/);
  if (article.author !== 'Singularity Review') assert.match(html, /class="byline-author" href="\/authors\/[^"]+\/" rel="author"/);
}
const css = await fs.readFile('src/css/style.css', 'utf8');
assert.doesNotMatch(css, legacy);
for (const selector of ['.desktop-nav > a[aria-current]', '.menu-links > a[aria-current]', '.footer-links a[aria-current]', '.footer-topics a[aria-current]']) {
  const rule = css.slice(css.indexOf(selector)).match(/^[^{]+\{([^}]+)\}/)?.[1];
  assert.match(rule, /color: #fff;/);
  assert.doesNotMatch(rule, /signal|font-weight|text-decoration|border/);
}
assert.match(css, /\.desktop-nav > a \{[^}]*color: rgb\(255 255 255 \/ \.63\)/);
assert.match(css, /\.brand-wordmark \{[^}]*font: 500 28px\/1 var\(--serif\)/);
assert.match(css, /\.brand-wordmark \{ font-size: 38px; \}/);
assert.doesNotMatch(css, /--header-height: (?!72px)\d+px|is-condensed|\.header-inner::before/);
assert.match(css, /\.footer-columns \{ grid-template-columns: 2fr repeat\(3, minmax\(0, 1fr\)\);/);
assert.doesNotMatch(css, /(?:\.byline|\.article-header|\.shelf-heading|\.section-title|\.feed-intro|\.site-footer|\.footer-columns)[^{]*\{[^}]*border-(?:top|bottom|block):\s*[1-9]/);
assert.doesNotMatch(css, /(?:category-label|plain-label|footer-heading|brand-wordmark)[^{]*\{[^}]*letter-spacing/);
for (const [path, size] of [['src/favicon-32.png',32], ['src/favicon-48.png',48], ['src/images/brand/apple-touch-icon.png',180], ['src/images/brand/social-avatar.png',512]]) {
  const info = await sharp(path).metadata(); assert.equal(info.width,size); assert.equal(info.height,size);
}
const guide = await fs.readFile('CONTENT_GUIDE.md', 'utf8');
const outdated = guide.split('\n').flatMap((line, index) => /Singularity headline news|Featured author articles|Without a photo,.*initials|amber circle|Self-hosted avatar|Shown as plain small caps|Article kicker links/.test(line) ? [index+1] : []);
console.log(`CHROME VERIFIED: ${pages.length} routes, exact navigation, text masthead, linked dot-separated bylines, plain headings, four footer columns, crop dimensions and negative controls. Protected guide lines for owner follow-up: ${outdated.join(', ')}.`);

checkHeroControls(home, css);
