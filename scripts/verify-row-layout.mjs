// Reserved CSS geometry and font metrics only, not measured browser CLS.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { parseDocument } from 'htmlparser2';
import { findAll } from 'domutils';
import { cssRules, styleAt, length } from './static-layout.mjs';

const css = await fs.readFile('src/css/style.css', 'utf8');
assert.equal(await fs.readFile('_site/css/style.css', 'utf8'), css, 'Check the current built styles');
const source = await fs.readFile('src/js/card-row.js', 'utf8');
assert.equal(await fs.readFile('_site/js/card-row.js', 'utf8'), source, 'Check the current built row script');
assert.doesNotMatch(source, /\.hidden\s*=|\.style\b|setAttribute\(\s*['"](?:hidden|style|class)['"]|classList\./, 'Row enhancement never changes layout or control visibility');
const rules = cssRules(css);
const hasClass = (node, value) => (node.attribs?.class || '').split(/\s+/).includes(value);
const home = parseDocument(await fs.readFile('_site/index.html', 'utf8'));
const arrows = findAll(node => hasClass(node, 'card-row-arrows'), home.children);
for (const group of arrows) assert.ok(!Object.hasOwn(group.attribs, 'hidden'), 'Arrow space exists in the original HTML');
assert.ok(rules.some(rule => rule.selector === '.card-row-arrows' && rule.media === '(hover: none)' && rule.declarations.display === 'none'), 'Touch-only devices hide arrows using CSS');
assert.equal(styleAt(rules, '.carousel-controls[hidden]', 1440, 900).display, 'flex !important');
assert.equal(styleAt(rules, '.carousel-controls[hidden]', 1440, 900).visibility, 'hidden', 'Carousel controls reserve space before enhancement');
assert.equal(styleAt(rules, '.carousel-controls .carousel-play', 320, 844)['white-space'], 'nowrap', 'Changing play labels cannot add a line');
for (const block of css.matchAll(/@font-face\s*\{([^}]+)\}/g)) assert.match(block[1], /font-display:\s*optional/, 'No delayed font swap changes home text geometry');

for (const width of [320,390,639,640,768,1024,1440,1920]) {
  const get = selector => styleAt(rules, selector, width, 900);
  assert.equal(get('.card-row-arrows').display, width < 640 ? 'none' : 'flex', width + ': CSS decides arrow visibility before paint');
  for (const header of ['.card-row-header', '.shelf-heading']) {
    const style = get(header);
    assert.equal(style['min-height'], '44px');
    if (width < 640) assert.equal(style.height, '44px', 'Mobile headers reserve exactly one control line');
    const heading = get(header + ' h2');
    assert.equal(heading['white-space'], 'nowrap');
    assert.equal(heading.overflow, 'hidden');
    assert.equal(heading['text-overflow'], 'ellipsis');
    if (width < 640) {
      assert.match(heading['font-size'], /^clamp\(/);
      assert.equal(heading['line-height'], '32px');
      assert.ok(length(heading['font-size'], width, 900) <= 26);
    }
  }
  assert.equal(get('.card-row-header h2')['min-width'], '0');
  assert.equal(get('.shelf-heading > div')['min-width'], '0');
  for (const link of ['.card-row-all', '.shelf-all']) assert.equal(get(link)['white-space'], 'nowrap');
  assert.equal(get('.cover-motion').position, 'absolute', 'Motion visibility never changes document flow');
  for (const popup of ['.consent-banner', '.consent-dialog', '.newsletter-prompt']) assert.equal(get(popup).position, 'fixed', 'Popup insertion never changes document flow');
}

// Use an isolated, writable Fontconfig cache. Never touch system or user caches.
const modelRoot = path.resolve('.audit/card-rows');
await fs.mkdir(modelRoot + '/fonts', { recursive: true });
await fs.mkdir(modelRoot + '/font-cache', { recursive: true });
const fallbackFiles = [process.env.ROW_FALLBACK_FONT, '/System/Library/Fonts/Supplemental/Georgia.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'].filter(Boolean);
let fallback;
for (const file of fallbackFiles) {
  if (await fs.access(file).then(() => true, () => false)) { fallback = file; break; }
}
assert.ok(fallback, 'Provide a local fallback serif font via ROW_FALLBACK_FONT when Georgia or DejaVu Serif is unavailable');
const fallbackFile = modelRoot + '/fonts/' + path.basename(fallback);
await fs.copyFile(fallback, fallbackFile);
const config = modelRoot + '/fonts.conf';
await fs.writeFile(config, `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd"><fontconfig><dir>${path.resolve('_site/fonts')}</dir><dir>${modelRoot}/fonts</dir><cachedir>${modelRoot}/font-cache</cachedir></fontconfig>`);
process.env.FONTCONFIG_FILE = config;
const fonts = [
  { family: 'Newsreader Medium', file: path.resolve('_site/fonts/newsreader-latin-wght-normal.woff2') },
  { family: /Georgia/i.test(fallback) ? 'Georgia' : 'DejaVu Serif', file: fallbackFile }
];
const measure = async (text, family, size, file) => {
  const { info } = await sharp({ text: { text, font: family + ' ' + size, fontfile: file, dpi: 72, rgba: true } }).raw().toBuffer({ resolveWithObject: true });
  return info.width;
};
const metrics = [];
for (const width of [320,390,639]) {
  const style = styleAt(rules, '.card-row-header h2', width, 900);
  const size = length(style['font-size'], width, 900);
  const gap = length(styleAt(rules, '.card-row-header', width, 900).gap, width, 900);
  // Reserve a conservative 60px for See all in either sans font, plus its gap.
  const available = width - 40 - 60 - gap;
  for (const text of ['Singularity headline news', 'Featured author articles']) {
    for (const font of fonts) {
      const textWidth = await measure(text, font.family, size, font.file);
      assert.ok(textWidth + 4 <= available, `${width}: ${text} fits with See all in ${font.family}, ${textWidth + 4} <= ${available}`);
      metrics.push({ width, text, family: font.family, fontSize: size, textWidth, available });
    }
  }
}
await fs.writeFile(modelRoot + '/header-metrics.json', JSON.stringify({ method: 'Sharp/Pango glyph widths with a 4px buffer and 60px See all reservation. CSS boxes are static models, not browser geometry or CLS.', metrics }, null, 2) + '\n');
console.log('ROW LAYOUT VERIFIED: CSS-only arrows, single-line reserved headers at eight widths, mobile fallback and web-font fit, reserved carousel controls and fixed popups. Browser CLS remains owner-run.');
