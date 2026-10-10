import assert from 'node:assert/strict';
import { coverLayout } from './static-layout.mjs';
export const heroLines = [
  'The singularity is already here.',
  "So many AI breakthroughs land every day that it's hard to keep up. We help you focus on what matters and leave out the noise.",
];
export const plain = value => value.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
export function verifyHero(html, css) {
  const hero = html.match(/<header class="hero-statement">([\s\S]*?)<\/header>/)?.[1];
  assert.ok(hero, 'Exact publication statement exists');
  const children = [...hero.matchAll(/<(h1|p)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/g)];
  assert.deepEqual(children.map(x => plain(x[2])), heroLines, 'Hero contains exactly the two approved lines, in order');
  assert.deepEqual(children.map(x => x[1]), ['h1', 'p']);
  for (const [width, height] of [[320,844],[390,844],[639,844],[640,900],[768,1024],[1024,768],[1440,900],[1920,1080],[2560,1440]]) {
    const layout = coverLayout(css, width, height);
    assert.ok(layout.statement.top > layout.diskBottom, width + ': statement below the complete static disk');
    assert.ok(layout.statement.top > layout.lensingRegionBottom, width + ': statement below the full lensing influence region');
  }
  assert.equal((html.match(/<h1\b/g) || []).length, 1, 'Homepage has one h1');
  const band = html.slice(html.indexOf('<div class="night-cover"'), html.indexOf('<section class="feed'));
  const visibleText = plain(band.replace(/<svg\b[\s\S]*?<\/svg>/g, ''));
  assert.equal(visibleText, heroLines.join(' '), 'No extra hero slogan, eyebrow or CTA');
  assert.doesNotMatch(band, /<a\b|<strong\b|<mark\b/);
  assert.match(css, /\.hero-statement \{[^}]*text-align: center/);
  assert.match(css, /\.hero-statement h1 \{[^}]*text-wrap: balance/);
  assert.doesNotMatch(css, /background-clip:\s*text|text-transform:\s*capitalize|cursor:\s*none|\.kicker|\.eyebrow/);
}
export function checkHeroControls(html, css) {
  verifyHero(html, css);
  for (const [old, replacement] of [[heroLines[0], 'A different headline'], [heroLines[1], heroLines[1] + '<p>Another slogan</p>'], ['<h1>', '<h2>']]) {
    assert.throws(() => verifyHero(html.replace(old, replacement), css), 'Changed/extra copy and wrong semantics fail');
  }
}
