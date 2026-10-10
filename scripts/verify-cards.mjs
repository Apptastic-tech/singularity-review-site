import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { parseDocument } from 'htmlparser2';
import { findAll, textContent } from 'domutils';
import { cssRules, styleAt, length } from './static-layout.mjs';
import { publishedArticles, articleUrl } from './verification-helpers.mjs';
import { sentenceTitle } from '../src/_lib/editorial.js';
import { verifyCardRowRuntime } from './card-row-runtime.mjs';

const css = await fs.readFile('_site/css/style.css', 'utf8');
assert.equal(css, await fs.readFile('src/css/style.css', 'utf8'), 'Rebuild before checking shipped styles');
const rules = cssRules(css);
const hasClass = (node, name) => (node.attribs?.class || '').split(/\s+/).includes(name);
const nodes = root => findAll(node => node.type === 'tag', root.children || []);
const byClass = (root, name) => nodes(root).filter(node => hasClass(node, name));
const slugify = value => value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const readPage = async file => parseDocument(await fs.readFile('_site/' + file, 'utf8'));
const articles = await publishedArticles(process.cwd());
const headlines = articles.filter(item => item.section === 'news');
const featured = articles.filter(item => item.section === 'featured');
const gridSizes = '(min-width: 1312px) 400px, (min-width: 960px) calc((100vw - 112px) / 3), (min-width: 640px) calc((100vw - 88px) / 2), calc(100vw - 40px)';
const rowSizes = '(min-width: 960px) clamp(300px, 28vw, 400px), (min-width: 640px) 45vw, 84vw';
function checkCards(root, expected, heading, sizes, eager = true) {
  const cards = byClass(root, 'post-card');
  assert.equal(cards.length, expected.length, 'Exact card count');
  assert.deepEqual(cards.map(card => byClass(card, 'post-card-link')[0]?.attribs.href), expected.map(articleUrl), 'Article order and links');
  cards.forEach((card, index) => {
    const item = expected[index];
    assert.equal(card.name, 'article');
    assert.ok(Object.hasOwn(card.attribs, 'data-card'));
    const [media, body, extra] = card.children.filter(node => node.type === 'tag');
    assert.equal(extra, undefined);
    assert.ok(hasClass(media, 'post-card-media') && hasClass(body, 'post-card-body'), 'Image first, body second');
    const image = nodes(media).find(node => node.name === 'img');
    assert.ok(image && +image.attribs.width > 0 && +image.attribs.height > 0, 'Intrinsic image geometry');
    assert.equal(image.attribs.alt, item.heroAlt);
    assert.equal(image.attribs.loading, eager && index === 0 ? 'eager' : 'lazy');
    assert.equal(image.attribs.fetchpriority, eager && index === 0 ? 'high' : 'auto');
    assert.equal(image.attribs.sizes, sizes);
    const sources = nodes(media).filter(node => node.name === 'source');
    assert.deepEqual(sources.map(node => node.attribs.type), ['image/avif', 'image/webp']);
    sources.forEach(source => { assert.equal(source.attribs.sizes, sizes); assert.ok(source.attribs.srcset); });
    const [meta, title, excerpt] = body.children.filter(node => node.type === 'tag');
    assert.ok(hasClass(meta, 'post-card-meta'));
    const [category, date] = meta.children.filter(node => node.type === 'tag');
    assert.ok(hasClass(category, 'post-card-category'));
    assert.equal(textContent(category), item.category);
    assert.equal(date.name, 'time');
    assert.equal(date.attribs.datetime, item.date.toISOString());
    assert.equal(textContent(date), item.date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }));
    assert.equal(title.name, heading);
    assert.ok(hasClass(title, 'post-card-title'));
    assert.equal(textContent(title), sentenceTitle(item.title));
    assert.ok(hasClass(excerpt, 'post-card-excerpt'));
    assert.equal(textContent(excerpt), item.description);
    const links = nodes(card).filter(node => node.name === 'a');
    assert.equal(links.length, 1, 'Whole card has one article link');
    assert.ok(Object.hasOwn(links[0].attribs, 'data-story-link'));
    assert.equal(nodes(body).filter(node => ['img','picture'].includes(node.name)).length, 0);
    assert.doesNotMatch(textContent(card), /Read story|[\u2190-\u2193]/);
    assert.ok(!nodes(card).some(node => /byline|avatar|initials/.test(node.attribs?.class || '')));
  });
  return cards;
}
function checkGrid(dom, expected, heading) {
  const grids = byClass(dom, 'post-grid');
  assert.equal(grids.length, 1);
  assert.ok(Object.hasOwn(grids[0].attribs, 'data-feed'));
  const cards = checkCards(grids[0], expected, heading, gridSizes);
  assert.equal(grids[0].children.filter(node => node.type === 'tag').length, cards.length);
  assert.ok(cards.every(card => card.parent === grids[0]), 'Cards are direct grid children');
  return grids[0];
}
function checkRow(dom, expected, label, eager = false) {
  const rows = byClass(dom, 'card-row');
  assert.equal(rows.length, 1);
  const row = rows[0], header = byClass(row, 'card-row-header')[0], title = nodes(header).find(node => node.name === 'h2');
  assert.equal(textContent(title), label);
  assert.equal(row.attribs['aria-labelledby'], title.attribs.id);
  const track = byClass(row, 'card-row-track')[0];
  assert.equal(track.name, 'ul'); assert.equal(track.attribs.role, 'list'); assert.equal(track.attribs.tabindex, '0');
  assert.equal(track.attribs['aria-label'], label + ' (scrollable)');
  const arrows = byClass(row, 'card-row-arrow');
  assert.deepEqual(arrows.map(node => node.attribs['aria-label']), ['Previous', 'Next']);
  assert.ok(arrows.every(node => node.attribs['aria-controls'] === track.attribs.id));
  const cards = checkCards(track, expected, 'h3', rowSizes, eager);
  assert.ok(cards.every(card => card.parent.name === 'li' && card.parent.parent === track));
  return row;
}
const home = await readPage('index.html');
if (headlines.length) checkRow(home, headlines.slice(0, 10), 'Singularity headline news', true);
assert.equal(byClass(home, 'post-grid').length, 0);
assert.equal(byClass(home, 'card--lead').length, 0);
assert.equal(byClass(home, 'story-grid').length, 0);
assert.ok(!nodes(home).some(node => /^h[1-6]$/.test(node.name) && textContent(node) === 'Latest'));
for (let page = 2; page <= Math.ceil(headlines.length / 10); page++) {
  const dom = await readPage('page/' + page + '/index.html');
  checkGrid(dom, headlines.slice((page - 1) * 10, page * 10), 'h2');
  assert.equal(textContent(nodes(dom).find(node => node.name === 'h1')), 'Singularity headline news');
  assert.equal(byClass(dom, 'card-row').length, 0); assert.equal(byClass(dom, 'author-shelf').length, 0);
}
const archive = await readPage('featured/index.html');
if (featured.length) {
  const grid = checkGrid(archive, featured, 'h3');
  const all = nodes(archive), title = all.find(node => node.attribs.id === 'featured-archive');
  assert.equal(title.name, 'h2'); assert.equal(textContent(title), 'All featured articles');
  assert.ok(all.indexOf(byClass(archive, 'author-shelf')[0]) < all.indexOf(title) && all.indexOf(title) < all.indexOf(grid));
}
for (const category of new Set(articles.map(item => item.category))) checkGrid(await readPage('category/' + slugify(category) + '/index.html'), articles.filter(item => item.category === category), 'h2');
for (const author of new Set(articles.map(item => item.author).filter(author => author !== 'Singularity Review'))) checkGrid(await readPage('authors/' + slugify(author) + '/index.html'), articles.filter(item => item.author === author), 'h2');
for (const article of articles) {
  const dom = await readPage('articles/' + article.slug + '/index.html'), more = articles.filter(item => item.slug !== article.slug).slice(0,4);
  if (more.length) checkRow(dom, more, 'Read next'); else assert.equal(byClass(dom, 'card-row').length, 0);
}
for (const width of [320,390,639,640,768,959,960,1440,1920]) {
  const get = selector => styleAt(rules, selector, width, 900);
  const card = get('.post-card'), track = get('.card-row-track');
  assert.equal(get('.post-grid')['grid-template-columns'], width < 640 ? 'minmax(0, 1fr)' : 'repeat(' + (width < 960 ? 2 : 3) + ', minmax(0, 1fr))');
  assert.equal(card.background, 'var(--card-surface)'); assert.equal(card['border-radius'], '24px'); assert.equal(card.overflow, 'hidden'); assert.equal(card.border, '0'); assert.equal(card['box-shadow'], 'var(--soft-shadow)');
  assert.equal(get('.post-card-media')['aspect-ratio'], '16 / 9');
  assert.equal(get('.post-card-body').padding, width < 640 ? '22px' : '28px');
  assert.equal(get('.post-card-image')['object-fit'], 'cover');
  assert.match(get('.post-card-title').font, /700 22px\/1.15 var\(--sans\)/);
  assert.equal(get('.post-card-title')['font-size'] || '22px', width < 640 ? '22px' : '24px');
  assert.equal(get('.post-card-meta').display, 'flex'); assert.equal(get('.post-card-meta')['white-space'], 'nowrap');
  assert.equal(get('.post-card-category')['text-transform'], 'uppercase'); assert.equal(get('.post-card-category')['letter-spacing'], '.09em');
  assert.equal(get('.post-card-category').color, 'var(--signal)');
  assert.equal(get('.post-card-link')['-webkit-line-clamp'], '3'); assert.equal(get('.post-card-excerpt')['-webkit-line-clamp'], '3');
  assert.equal(get('.post-card-link::after').inset, '0'); assert.match(get('.post-card-link:focus-visible::after').outline, /2px solid var\(--signal\)/);
  assert.equal(track.display, 'flex'); assert.equal(track.gap, '24px'); assert.equal(track['overflow-x'], 'auto'); assert.equal(track['scroll-snap-type'], 'x mandatory'); assert.equal(track['scroll-padding-inline'], 'var(--page-gutter)'); assert.equal(track['overscroll-behavior-x'], 'contain');
  assert.equal(get('.card-row-track > li')['scroll-snap-align'], 'start');
  const cardWidth = length(get('.card-row-track > li').width, width, 900);
  if (width < 640) { assert.equal(cardWidth, width * .84); assert.ok(cardWidth + 24 + 20 < width, 'Mobile next-card peek'); }
  assert.equal(get('.card-row-track > li').flex, '0 0 auto');
}
assert.ok(rules.some(rule => rule.media === '(hover: none)' && rule.selector === '.card-row-arrows' && rule.declarations.display === 'none'));
assert.ok(rules.some(rule => rule.media === '(hover: hover)' && rule.selector === '.post-card:hover' && rule.declarations.transform === 'translateY(-2px)'));
assert.ok(rules.some(rule => rule.media === '(prefers-reduced-motion: reduce)' && rule.selector === '.post-card:hover' && rule.declarations.transform === 'none'));
assert.ok(rules.some(rule => rule.media === '(prefers-reduced-motion: reduce)' && rule.selector === '.post-card:hover .post-card-image' && rule.declarations.filter === 'none'));
if (headlines.length) {
  const fixture = await fs.readFile('_site/index.html', 'utf8');
  for (const [from,to] of [['tabindex="0" aria-label="Singularity headline news','tabindex="-1" aria-label="Singularity headline news'], ['aria-controls="headline-news-track"','aria-controls="wrong-track"'], ['class="post-card-meta"','class="missing-meta"']]) assert.throws(() => checkRow(parseDocument(fixture.replace(from,to)), headlines.slice(0,10), 'Singularity headline news', true), 'Broken row/card positive control fails');
}
verifyCardRowRuntime(await fs.readFile('src/js/card-row.js', 'utf8'));
console.log('CARDS VERIFIED: exact image-first cards, inline metadata, responsive grids, homepage and read-next rows, focus, peeking, arrows, keyboard, reduced motion and Node runtime controls. Browser geometry was not run.');
