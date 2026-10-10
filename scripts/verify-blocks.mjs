import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { parseDocument } from 'htmlparser2';
import { findAll, textContent } from 'domutils';
import { cssRules, styleAt } from './static-layout.mjs';
import { publishedArticles, articleUrl } from './verification-helpers.mjs';
import { sentenceTitle } from '../src/_lib/editorial.js';

// Source and generated-file checks only. This script never starts a browser or server.
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
const sizes = '(min-width: 1312px) 400px, (min-width: 960px) calc((100vw - 128px) / 3), (min-width: 640px) calc((100vw - 96px) / 2), 100vw';

function checkGrid(dom, expected, heading, label) {
  const grids = byClass(dom, 'story-grid');
  assert.equal(grids.length, 1, `${label}: one story grid`);
  const grid = grids[0];
  assert.ok(Object.hasOwn(grid.attribs, 'data-feed'), `${label}: loading targets the grid`);
  const blocks = grid.children.filter(node => hasClass(node, 'story-block'));
  assert.equal(blocks.length, expected.length, `${label}: exact block count`);
  assert.equal(byClass(dom, 'story-block').length, blocks.length, `${label}: every block is a direct grid child`);
  assert.equal(grid.children.filter(node => node.type === 'tag').length, blocks.length, `${label}: the grid contains only story blocks`);
  assert.deepEqual(blocks.map(block => byClass(block, 'story-block-link')[0]?.attribs.href), expected.map(articleUrl), `${label}: article order and links`);
  blocks.forEach((block, index) => {
    const item = expected[index];
    assert.equal(block.name, 'article');
    for (const hook of ['data-card', 'data-reveal']) assert.ok(Object.hasOwn(block.attribs, hook), `${label}: ${hook}`);
    const [media, body] = block.children.filter(node => node.type === 'tag');
    assert.ok(hasClass(media, 'story-block-media') && hasClass(body, 'story-block-body'), `${label}: image first, text below`);
    assert.equal(nodes(media).filter(node => node.name === 'picture').length, 1);
    const images = nodes(media).filter(node => node.name === 'img');
    assert.equal(images.length, 1, `${label}: one image per block`);
    const image = images[0];
    assert.equal(image.attribs.alt, item.heroAlt);
    assert.equal(image.attribs.loading, 'lazy');
    assert.equal(image.attribs.fetchpriority, 'auto');
    assert.equal(image.attribs.sizes, sizes);
    assert.ok(+image.attribs.width > 0 && +image.attribs.height > 0, 'Intrinsic image slot');
    const sources = nodes(media).filter(node => node.name === 'source');
    assert.deepEqual(sources.map(node => node.attribs.type), ['image/avif', 'image/webp']);
    for (const source of sources) assert.equal(source.attribs.sizes, sizes);
    const categories = byClass(body, 'story-block-category');
    assert.equal(categories.length, 1);
    assert.equal(categories[0].name, 'a');
    assert.equal(categories[0].attribs.href, `/category/${slugify(item.category)}/`);
    assert.equal(textContent(categories[0]).trim(), item.category, 'Category keeps frontmatter casing');
    assert.notEqual(categories[0].attribs.tabindex, '-1', 'Category remains focusable');
    const links = byClass(body, 'story-block-link');
    assert.equal(links.length, 1);
    assert.equal(links[0].name, 'a');
    assert.ok(Object.hasOwn(links[0].attribs, 'data-story-link'), 'Image transitions retain the story hook');
    assert.notEqual(links[0].attribs.tabindex, '-1');
    const titles = byClass(links[0], 'story-block-title');
    assert.equal(titles.length, 1);
    assert.equal(titles[0].name, heading, `${label}: correct heading level`);
    assert.equal(textContent(titles[0]), sentenceTitle(item.title));
    const deks = byClass(body, 'story-block-dek');
    assert.equal(deks.length, 1);
    assert.equal(textContent(deks[0]), item.description);
    const times = byClass(body, 'story-block-date');
    assert.equal(times.length, 1);
    assert.equal(times[0].name, 'time');
    assert.equal(times[0].attribs.datetime, item.date.toISOString());
    assert.equal(textContent(times[0]), item.date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }));
    assert.equal(nodes(body).filter(node => node.name === 'a').length, 2, 'One story link and a separate category link');
    assert.equal(nodes(body).filter(node => node.name === 'img' || node.name === 'picture').length, 0, 'Text panel has no imagery');
    assert.doesNotMatch(textContent(block), /Read story|[\u2190-\u2193]/, 'No CTA or arrows');
    assert.ok(!nodes(block).some(node => /byline|avatar|initials/.test(node.attribs?.class || '')), 'Blocks have no author decoration');
  });
  return grid;
}

const home = await readPage('index.html');
if (headlines.length) {
  const all = nodes(home);
  const cover = byClass(home, 'night-cover')[0];
  const lead = byClass(home, 'card--lead');
  const latest = all.find(node => node.name === 'h2' && node.attribs.id === 'latest-heading');
  const grid = checkGrid(home, headlines.slice(1, 10), 'h3', 'Homepage');
  assert.ok(cover && latest, 'Statement band and Latest heading exist');
  assert.equal(lead.length, 1, 'Exactly one unchanged lead');
  assert.ok(byClass(cover, 'hero-statement').length === 1);
  assert.ok(all.indexOf(cover) < all.indexOf(lead[0]));
  if (featured.length) {
    const carousel = byClass(home, 'author-shelf');
    assert.equal(carousel.length, 1);
    assert.ok(all.indexOf(lead[0]) < all.indexOf(carousel[0]) && all.indexOf(carousel[0]) < all.indexOf(latest), 'Lead, carousel, Latest order');
  } else assert.ok(all.indexOf(lead[0]) < all.indexOf(latest));
  assert.equal(textContent(latest), 'Latest');
  assert.ok(all.indexOf(latest) < all.indexOf(grid));
  assert.equal(latest.parent.attribs['aria-labelledby'], 'latest-heading');
  assert.equal(latest.parent.children.filter(node => node.type === 'tag').length, 2, 'Latest has a plain heading and grid only');
  assert.equal(byClass(home, 'card').length, 1, 'Only the lead uses the old card include');
}
for (let page = 2; page <= Math.ceil(headlines.length / 10); page++) {
  const dom = await readPage(`page/${page}/index.html`);
  const grid = checkGrid(dom, headlines.slice((page - 1) * 10, page * 10), 'h2', `Page ${page}`);
  const heading = nodes(dom).find(node => node.name === 'h1');
  assert.equal(textContent(heading), 'News');
  assert.ok(nodes(dom).indexOf(heading) < nodes(dom).indexOf(grid));
  assert.equal(byClass(dom, 'card--lead').length, 0);
  assert.equal(byClass(dom, 'author-shelf').length, 0);
}
const archive = await readPage('featured/index.html');
if (featured.length) {
  const grid = checkGrid(archive, featured, 'h3', 'Featured');
  const all = nodes(archive), title = all.find(node => node.attribs.id === 'featured-archive');
  assert.equal(title?.name, 'h2');
  assert.equal(textContent(title), 'All featured articles');
  assert.ok(all.indexOf(byClass(archive, 'author-shelf')[0]) < all.indexOf(title) && all.indexOf(title) < all.indexOf(grid));
  assert.equal(byClass(archive, 'card').length, 0);
}
for (const category of new Set(articles.map(item => item.category))) {
  const dom = await readPage(`category/${slugify(category)}/index.html`);
  checkGrid(dom, articles.filter(item => item.category === category), 'h2', `Category ${category}`);
  assert.equal(byClass(dom, 'card').length, 0);
}
for (const author of new Set(articles.map(item => item.author).filter(author => author !== 'Singularity Review'))) {
  const dom = await readPage(`authors/${slugify(author)}/index.html`);
  checkGrid(dom, articles.filter(item => item.author === author), 'h2', `Author ${author}`);
  assert.equal(byClass(dom, 'card').length, 0);
}

for (const article of articles) {
  const dom = await readPage(`articles/${article.slug}/index.html`);
  const more = articles.filter(item => item.slug !== article.slug).slice(0, 4);
  const grid = checkGrid(dom, more, 'h3', `Read next: ${article.slug}`);
  const section = grid.parent;
  assert.ok(hasClass(section, 'read-next') && hasClass(section, 'feed-width'));
  assert.equal(section.attribs['aria-labelledby'], 'next-heading');
  assert.equal(plainHeading(section), 'Read next');
  assert.equal(byClass(dom, 'card').length, 0, 'Read next uses story blocks');
}

function plainHeading(section) {
  const heading = section.children.find(node => node.name === 'h2');
  assert.equal(heading?.attribs.id, 'next-heading');
  return textContent(heading);
}

for (const width of [390, 639, 640, 768, 959, 960, 1440]) {
  const get = selector => styleAt(rules, selector, width, 900);
  const grid = get('.story-grid'), block = get('.story-block'), category = get('.story-block-category');
  assert.equal(grid.display, 'grid');
  assert.equal(grid.gap, '32px 24px');
  assert.equal(grid['grid-template-columns'], width < 640 ? 'minmax(0, 1fr)' : `repeat(${width < 960 ? 2 : 3}, minmax(0, 1fr))`);
  assert.equal(block.background, 'var(--ink-1)');
  assert.equal(block.display, 'flex');
  assert.equal(block['flex-direction'], 'column');
  assert.equal(block.overflow, 'hidden');
  assert.ok(!['absolute', 'fixed'].includes(block.position), 'Block stays in flow');
  assert.equal(block.margin, '0');
  assert.equal(block['border-radius'], width < 640 ? '0' : '6px');
  if (width < 640) assert.equal(block['border-inline'], '0', 'Mobile has no side borders');
  else assert.equal(block.border, '1px solid var(--line)');
  assert.equal(get('.story-block-media')['aspect-ratio'], '3 / 2');
  assert.equal(get('.story-block-image')['object-fit'], 'cover');
  assert.equal(get('.story-block-body').padding, '20px');
  assert.equal(get('.story-block-body').flex, '1');
  assert.equal(get('.story-block-date')['margin-top'], 'auto');
  assert.equal(get('.story-block-dek')['-webkit-line-clamp'], '2');
  assert.equal(get('.story-block-title')['font-size'] || '26px', width < 640 ? '26px' : '28px');
  assert.equal(category['text-transform'], 'none');
  assert.equal(category['letter-spacing'], 'normal');
  assert.equal(category.color, 'var(--muted)');
  assert.equal(category.background, 'transparent');
  assert.ok(Number(category['z-index']) > Number(get('.story-block-link::after')['z-index']), 'Category sits above stretched link');
  assert.equal(get('.story-block-link::after').inset, '0');
  assert.match(get('.story-block-link:focus-visible::after').outline, /2px solid var\(--signal\)/);
  assert.doesNotMatch(get('.archive-title').font, /var\(--sans\)/, 'Section heading is serif');
}
for (const rule of rules.filter(rule => /\.story-block/.test(rule.selector))) {
  assert.ok(!rule.declarations['box-shadow'] || rule.declarations['box-shadow'] === 'none');
  assert.doesNotMatch(rule.declarations.background || '', /gradient|url\(/);
  if (rule.selector === '.story-block-category') {
    assert.ok(!rule.declarations['text-transform'] || rule.declarations['text-transform'] === 'none');
    assert.ok(!rule.declarations['letter-spacing'] || ['normal', '0'].includes(rule.declarations['letter-spacing']));
  }
}
assert.ok(rules.some(rule => rule.media === '(hover: hover)' && rule.selector === '.story-block:hover .story-block-image' && rule.declarations.transform === 'scale(1.02)'));
assert.ok(rules.some(rule => rule.media === '(hover: hover)' && rule.selector === '.story-block:hover .story-block-title' && rule.declarations.color === 'var(--signal)'));
assert.ok(rules.some(rule => rule.media === '(prefers-reduced-motion: reduce)' && rule.selector === '.story-block:hover .story-block-image' && rule.declarations.transform === 'none'));

function allowedHue(rgb) {
  const values = rgb.map(value => value / 255), max = Math.max(...values), min = Math.min(...values), delta = max - min;
  if (delta < .01) return true;
  const lightness = (max + min) / 2, saturation = delta / (1 - Math.abs(2 * lightness - 1));
  const [red, green, blue] = values;
  const hue = ((max === red ? (green - blue) / delta : max === green ? (blue - red) / delta + 2 : (red - green) / delta + 4) * 60 + 360) % 360;
  return saturation < .08 || hue < 240 || hue > 335;
}
assert.equal(allowedHue([128, 0, 128]), false, 'Forbidden hue positive control');
assert.equal(allowedHue([242, 169, 59]), true, 'Existing signal is allowed');
assert.doesNotMatch(css, /\b(?:purple|violet|magenta|lavender|fuchsia|orchid|plum|thistle|rebeccapurple|mediumslateblue|darkslateblue|slateblue)\b/i);
for (const [, hex] of css.matchAll(/#([a-f\d]{8}|[a-f\d]{6}|[a-f\d]{4}|[a-f\d]{3})\b/gi)) {
  const full = hex.length <= 4 ? [...hex].map(char => char + char).join('') : hex;
  assert.ok(allowedHue([0, 2, 4].map(index => parseInt(full.slice(index, index + 2), 16))), `Allowed CSS hue: #${hex}`);
}
for (const [, value] of css.matchAll(/rgba?\(([^)]+)\)/gi)) {
  const rgb = value.split('/')[0].trim().split(/[\s,]+/).slice(0, 3).map(part => parseFloat(part) * (part.includes('%') ? 2.55 : 1));
  assert.ok(rgb.every(Number.isFinite) && allowedHue(rgb), `Allowed CSS hue: rgb(${value})`);
}
for (const [, hue, saturation] of css.matchAll(/hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%/gi)) {
  const normal = Number(hue) % 360;
  assert.ok(Number(saturation) < 8 || normal < 240 || normal > 335, 'Allowed HSL hue');
}
for (const file of (await fs.readdir('_site', { recursive: true })).filter(file => /\.(html|css|js|json|xml|svg|txt)$/.test(file))) {
  const content = await fs.readFile('_site/' + file, 'utf8');
  assert.doesNotMatch(content, /[\u2013\u2014]|&(?:ndash|mdash|#821[12]|#x201[34]);/i, `No forbidden punctuation in output: ${file}`);
}
console.log('BLOCKS VERIFIED: listing order, exact article grids, panel anatomy, responsive 1/2/3 columns, focus, hover, reduced motion, output punctuation and CSS palette. Browser geometry was not run.');
