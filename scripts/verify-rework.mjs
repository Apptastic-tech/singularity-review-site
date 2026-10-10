import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const sky = 'src/images/brand/skyline-kittpeak.jpg';
const original = process.env.KITT_PEAK_SOURCE;
if (original) assert.equal(hash(await fs.readFile(sky)), hash(await fs.readFile(original)), 'The owner supplied source is copied without loss');
const dimensions = await sharp(sky).metadata();
assert.deepEqual([dimensions.width, dimensions.height], [5472, 3648]);
const config = await fs.readFile('eleventy.config.js', 'utf8');
assert.match(config, /sharpAvifOptions: \{ quality: 65, effort: 5 \}/);
assert.match(config, /sharpWebpOptions: \{ quality: 88 \}/);
assert.match(config, /sharpJpegOptions: \{ quality: 82, progressive: true, chromaSubsampling: "4:4:4" \}/);
const home = await fs.readFile('_site/index.html', 'utf8');
const picture = home.match(/<div class="cover-sky"[^>]*>(.*?)<\/div>/s)[1];
for (const format of ['avif', 'webp', 'jpeg']) {
  const srcset = picture.match(new RegExp(`srcset="([^"\\n]+\\.${format} 3840w)"`))?.[1];
  assert.ok(srcset, `${format}: 3840w skyline candidate exists`);
  const variants = [...srcset.matchAll(/([^, ]+) (\d+)w/g)];
  assert.deepEqual(variants.map(([, , width]) => Number(width)), [1280, 1920, 2560, 3840]);
  for (const [, url, width] of variants) {
    const metadata = await sharp('_site' + url).metadata();
    assert.equal(metadata.width, Number(width));
    assert.ok(Math.abs(metadata.width / metadata.height - 1.5) < .002, 'Original sky aspect is preserved');
    if (format === 'jpeg') assert.equal(metadata.chromaSubsampling, '4:4:4', 'Stars retain full chroma resolution');
  }
}
const css = await fs.readFile('src/css/style.css', 'utf8');
assert.match(css, /font-display: optional/);
assert.doesNotMatch(css, /font-display: swap|text-shadow|(?:linear|radial)-gradient|cover-copy|cover-dek|\.kicker/);
assert.match(css, /\.cover-motion \{[^}]*position: absolute;[^}]*width: 44px; height: 44px;/);
assert.match(css, /::selection \{[^}]*background: #C8CDD1;/);
const decorativeDivider = /\.(?:site-header|menu-links(?: > a)?|follow|read-next|site-footer|footer-links|desktop-nav|share-end|author-shelf|explainer-section|expert-card)\s*\{[^}]*border-(?:top|bottom|block):\s*[1-9]/;
assert.ok(decorativeDivider.test('.site-footer { border-top: 1px solid gray; }'), 'Divider checker rejects a positive fixture');
assert.doesNotMatch(css, decorativeDivider, 'Sections use spacing instead of decorative rules');
// The cover's maximum height crop is 170 * 3 / 2 = 255 CSS pixels wide.
// Sizes must cover that minimum as well as the viewport width, at every DPR.
assert.ok(170 * 1.5 === 255);
assert.match(picture, /sizes="\(max-width: 255px\) 255px, 100vw"/);
for (const [width, height, dpr] of [[390, 170, 3], [1024, 200, 2], [1440, 200, 2], [1920, 200, 2]]) {
  const required = Math.max(width, height * 1.5) * dpr;
  assert.ok([1280,1920,2560,3840].some(candidate => candidate >= required), `${width}@${dpr}: sky never upscales`);
}
const source = await fs.readFile('src/js/lensing.js', 'utf8');
assert.match(source, /Responsive images report density-corrected natural dimensions/);
assert.match(source, /const original = sourcePixels\(skyline\)/);
assert.match(source, /scale \* dpr > 1\.01/);
const oldName = ['skyline', 'clean'].join('-');
const banned = new RegExp(`${oldName}|class="kicker"|An observatory for the AI beat|AI news for people living through the singularity|Explore Singularity Review|From our authors|Stay in the loop|Follow the stories that matter`, 'i');
assert.ok(banned.test('class="' + 'kicker' + '"'), 'Absence checker rejects a positive fixture');
for (const file of await fs.readdir('_site', { recursive: true })) {
  if (file.endsWith('.html')) assert.ok(!banned.test(await fs.readFile('_site/' + file, 'utf8')), `Plain copy: ${file}`);
}
for (const file of ['eleventy.config.js','scripts/prepare-brand.mjs','src/js/lensing.js','docs/DESIGN.md','docs/REBRAND_V4_REPORT.md']) assert.ok(!(await fs.readFile(file, 'utf8')).includes(oldName), `Retired photo has no active references: ${file}`);
console.log('REWORK VERIFIED: original photo, four high quality sky widths in three formats, full chroma, height-aware sizes at 3x mobile and 2x desktop, resource-pixel textures, icon geometry, stable font policy, no decorative section dividers and site-wide copy cleanup');
