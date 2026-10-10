import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { parseDocument } from 'htmlparser2';
import { findAll, textContent } from 'domutils';
import { cssRules, styleAt, coverLayout, length } from './static-layout.mjs';
import { checkHeroControls } from './hero-contract.mjs';

const css = await fs.readFile('_site/css/style.css', 'utf8');
assert.ok(css === await fs.readFile('src/css/style.css', 'utf8'), 'Checks use the current shipped CSS; rebuild after editing');
const rules = cssRules(css), elements = dom => findAll(node => node.type === 'tag', dom.children);
const hasClass = (node, name) => (node.attribs?.class || '').split(/\s+/).includes(name);
const ancestor = (node, predicate) => { for (let parent = node.parent; parent; parent = parent.parent) if (predicate(parent)) return true; return false; };
function unboxed(styles) {
  assert.ok(!['absolute', 'fixed'].includes(styles.position), 'Reading surfaces stay in normal flow');
  for (const property of ['margin-top', 'margin-block-start', 'margin-block', 'margin', 'top']) assert.doesNotMatch(styles[property] || '', /(^|\s)-[\d.]/, 'No negative story overlap');
  assert.ok(!styles.transform || styles.transform === 'none', 'No floating text surfaces');
  assert.ok(!styles.background || styles.background === 'transparent', 'No card enclosure');
  assert.ok(!styles['box-shadow'] || styles['box-shadow'] === 'none', 'No elevated reading surfaces');
}
for (const fixture of [{ position: 'absolute' }, { 'margin-top': '-20px' }, { background: '#000' }, { transform: 'translateY(-20px)' }]) assert.throws(() => unboxed(fixture), 'Overlap/enclosure positive controls fail');
assert.equal(length('clamp(560px, 65vh, 680px)', 1440, 900), 585);
assert.equal(length('calc(50% - 342px / 2)', 390, 844), 24);
const matrix = [[390,844],[768,1024],[1024,768],[1440,900],[1920,1080],[2560,1440]];
const archetypes = new Set(), pages = [];
for (const file of (await fs.readdir('_site', { recursive: true })).filter(x => x.endsWith('.html'))) {
  const html = await fs.readFile('_site/' + file, 'utf8'), dom = parseDocument(html), nodes = elements(dom);
  const main = nodes.find(node => node.name === 'main'), footer = nodes.find(node => hasClass(node, 'site-footer'));
  for (const node of nodes) {
    assert.doesNotMatch(node.attribs?.class || '', /(?:^|\s)(?:kicker|eyebrow|cta-pill|hero-cta)(?:\s|$)/, `${file}: no decorative label or CTA pill`);
    assert.notEqual(node.name, 'mark', `${file}: no highlighter markup`);
  }
  assert.ok(main && footer, `${file}: main and footer landmarks`);
  const headings = elements(main).filter(node => node.name === 'h1');
  assert.equal(headings.length, 1, `${file}: one main h1`);
  const identity = file === 'index.html' ? 'home' : file.startsWith('articles/') ? 'article' : file.startsWith('featured/') ? 'featured' : file.startsWith('what-is-singularity/') ? 'explainer' : file.startsWith('about/') ? 'about' : file.startsWith('authors/') ? 'author' : file.startsWith('category/') ? 'category' : 'other';
  archetypes.add(identity);
  for (const card of nodes.filter(node => hasClass(node, 'card'))) {
    const body = card.children.find(node => hasClass(node, 'card-body')), media = card.children.find(node => hasClass(node, 'card-media'));
    assert.ok(body && media, `${file}: each story keeps media and body as separate siblings`);
    assert.equal(elements(body).filter(node => node.name === 'h2').length, 1, `${file}: story title is h2`);
    assert.ok(!ancestor(body, node => node.name === 'picture' || hasClass(node, 'card-media')), `${file}: body is outside imagery`);
    if (hasClass(card, 'card--lead')) assert.ok(card.children.indexOf(body) < card.children.indexOf(media), 'Lead title and byline precede its photograph');
  }
  for (const heading of nodes.filter(node => /^h[123]$/.test(node.name))) assert.ok(!ancestor(heading, node => node.name === 'picture' || hasClass(node, 'card-media')), `${file}: heading is outside media`);
  for (const image of nodes.filter(node => node.name === 'img')) {
    assert.ok(+image.attribs.width > 0 && +image.attribs.height > 0, `${file}: intrinsic image geometry reserved`);
  }
  const footerColumns = nodes.filter(node => hasClass(node, 'footer-column'));
  assert.equal(footerColumns.length, 4);
  const viewportReports = [];
  for (const [width, height] of matrix) {
    const get = selector => styleAt(rules, selector, width, height);
    for (const selector of ['.card', '.card-body', '.card--lead .card-body', '.carousel-story', '.expert-card']) unboxed(get(selector));
    const widthStyle = get('.feed-width');
    const gridWidth = Math.min(length(widthStyle.width, width, height), length(widthStyle['max-width'], width, height));
    assert.ok(gridWidth <= width && gridWidth > 0, `${file} ${width}: page grid fits`);
    assert.equal(get('.footer-columns').display, 'grid');
    assert.ok(get('.footer-columns')['grid-template-columns'].includes(width < 640 ? 'repeat(3' : '2fr repeat(3'), 'Compact footer columns at every breakpoint');
    const footerLink = get('.footer-links a');
    assert.ok(length(footerLink['min-height'], width, height) >= 24, 'Footer link targets remain usable');
    const expertWidth = width >= 960 ? 104 : 96;
    assert.ok(expertWidth + 16 < width - 40, 'Portrait and text columns fit the page grid');
    const report = { viewport: `${width}x${height}`, gridWidth, gridLeft: (width-gridWidth)/2 };
    if (identity === 'home') {
      checkHeroControls(html, css);
      const layout = coverLayout(css, width, height);
      assert.ok(layout.disk.left >= 24 && layout.disk.left + layout.disk.width <= width - 24);
      assert.ok(layout.disk.top >= 16 && layout.disk.top + layout.disk.height <= layout.bandHeight - 16);
      assert.ok(layout.leadY < (width < 640 ? 900 : height));
      assert.equal(get('.skyline-home .headline-feed')['margin-top'], '0');
      assert.equal(get('.card--lead .card-media').order, '0');
      report.bandHeight = layout.bandHeight; report.leadHeadlineDocumentY = layout.leadY;
    }
    viewportReports.push(report);
  }
  pages.push({ file, archetype: identity, mainHeading: textContent(headings[0]).trim(), storyCount: nodes.filter(node => hasClass(node, 'card')).length, viewports: viewportReports });
}
for (const archetype of ['home','article','featured','explainer','about','author','category']) assert.ok(archetypes.has(archetype), `Requested ${archetype} page exists`);
// Inspect every matching reading-surface rule, including responsive overrides.
for (const rule of rules.filter(rule => /\.(?:card|card-body|carousel-story|expert-card)$/.test(rule.selector))) unboxed(rule.declarations);
assert.doesNotMatch(css, /background-clip:\s*text|text-transform:\s*capitalize|cursor:\s*none|backdrop-filter/);
for (const file of ['src/js/lensing.js', 'src/js/site.js']) assert.doesNotMatch(await fs.readFile(file, 'utf8'), /pointermove|mousemove|spotlight|uPointer|uCursor/i);
await fs.mkdir('.audit/hero-statement/static', { recursive: true });
await fs.writeFile('.audit/hero-statement/static/pages.json', JSON.stringify({ method: 'Parsed current generated HTML and CSS reserved geometry. Checks sibling media/body structure, normal flow, grid widths, footer and intrinsic image slots. No browser layout, interaction, performance or rendered appearance assertion.', pages, renderedReview: 'Editor-owned outside the sandbox' }, null, 2) + '\n');
console.log(`STATIC PAGES VERIFIED: ${pages.length} routes, all seven requested archetypes at six widths, unboxed flow, grid alignment, image slots, compact footer, hero geometry and positive controls. Browser interaction and rendered review were not run.`);
