import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import matter from 'gray-matter';

export async function publishedArticles(root) {
  const files = (await fs.readdir(path.join(root, 'src/articles'))).filter(file => file.endsWith('.md'));
  const result = [];
  for (const file of files) {
    const source = await fs.readFile(path.join(root, 'src/articles', file), 'utf8');
    const { data } = matter(source);
    if (data.draft) continue;
    const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
    const author = data.author || 'Singularity Review';
    result.push({ ...data, file, source, slug, author, date: new Date(data.date),
      section: data.section || (author === 'Singularity Review' ? 'news' : 'featured') });
  }
  return result.sort((a, b) => b.date - a.date);
}

export const cardLinks = html => [...html.matchAll(/class="card-link" href="([^"]+)"/g)].map(match => match[1]);
export const carouselLinks = html => [...html.matchAll(/class="carousel-story" href="([^"]+)"/g)].map(match => match[1]);
export const articleUrl = article => `/articles/${article.slug}/`;

const menu = [
  ['/', 'Singularity headline news'],
  ['/featured/', 'Featured author articles'],
  ['/what-is-singularity/', 'What is singularity'],
  ['/about/', 'Who we are'],
];
export function verifyNavigation(html, active = '/') {
  for (const className of ['desktop-nav', 'menu-links', 'no-js-nav', 'footer-links']) {
    const markup = html.match(new RegExp(`<(?:nav|div) class="${className}"[^>]*>(.*?)</(?:nav|div)>`, 's'))?.[1];
    assert.ok(markup, `${className} exists`);
    const links = [...markup.matchAll(/<a href="([^"]+)"([^>]*)>([^<]+)<\/a>/g)];
    assert.deepEqual(links.map(([, url, , label]) => [url, label]), menu, className);
    assert.deepEqual(links.filter(([, , attrs]) => attrs.includes('aria-current="page"')).map(([, url]) => url), [active], `${className} active state`);
  }
  assert.ok(!html.includes('chip-bar'), 'Category chips removed from header');
}
