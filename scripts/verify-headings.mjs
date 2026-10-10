import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import experts from '../src/_data/experts.js';
import orgs from '../src/_data/singularityOrgs.js';
import { publishedArticles } from './verification-helpers.mjs';
import { properWords } from '../src/_lib/editorial.js';
import { parseDocument } from 'htmlparser2';
import { findAll, textContent } from 'domutils';
const names = [...experts.map(x => x.name), ...orgs.map(x => x.name), ...(await publishedArticles(process.cwd())).map(x => x.author)].filter(Boolean);
export function sentenceHeading(text) {
  for (const name of names) text = text.replaceAll(name, 'name');
  return [...text.matchAll(/\b[A-Z][a-z]+\b/g)].every(x => x.index === 0 || properWords.has(x[0]));
}
assert.ok(!sentenceHeading('All Featured Articles'), 'Title case positive control fails');
assert.ok(!sentenceHeading('When the Agents Reach for the Open Web'));
assert.ok(sentenceHeading('What Claude and OpenAI mean for Europe and Washington'));
assert.ok(sentenceHeading('How Mistral, Anthropic, Wikimedia and Wikipedia cover AI for Singularity Review'));
assert.ok(sentenceHeading('John von Neumann'));
for (const file of (await fs.readdir('_site', { recursive: true })).filter(x => x.endsWith('.html'))) {
  const html = await fs.readFile('_site/' + file, 'utf8');
  const dom = parseDocument(html);
  for (const heading of findAll(node => node.type === 'tag' && /^h[123]$/.test(node.name), dom.children)) {
    const text = textContent(heading).replace(/\s+/g, ' ').trim();
    assert.ok(sentenceHeading(text), `${file}: sentence case: ${text}`);
  }
}
assert.doesNotMatch(await fs.readFile('src/css/style.css', 'utf8'), /text-transform:\s*capitalize/);
console.log('HEADINGS VERIFIED: all rendered h1/h2/h3 use sentence case with proper names and negative controls');
