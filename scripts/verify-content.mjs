import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { publishedArticles, cardLinks, carouselLinks, articleUrl, verifyNavigation } from './verification-helpers.mjs';

const root = process.cwd();
const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'singularity-content-'));
const out = path.join(temp, '_site');
const html = route => fs.readFile(path.join(out, route), 'utf8');
const build = () => spawnSync(process.execPath, [path.join(root, 'node_modules/@11ty/eleventy/cmd.cjs')], { cwd: temp, encoding: 'utf8', timeout: 60000 });
const rebuild = () => {
  const result = build();
  assert.equal(result.status, 0, result.stdout + result.stderr);
};
const body = (slug, date, extra = '', author = 'Singularity Review') => `---\ntitle: "Fixture ${slug}"\ndescription: "Future content pipeline verification."\ndate: ${date}\ncategory: Agents\nhero: /images/articles/${slug === 'fixture-00' ? 'small-fixture' : 'when-the-agents-reach-for-the-open-web'}.jpg\nheroAlt: "A server aisle with books"\nauthor: ${author}\ntags: ["Fixture"]\n${extra}---\nA future story written without any configuration change.\n`;
const fixture = (slug, extra = '', author = 'Singularity Review') => fs.writeFile(path.join(temp, `src/articles/2026-10-09-${slug}.md`), body(slug, '2099-01-02T12:00:00Z', extra, author));
try {
  await fs.cp(path.join(root, 'src'), path.join(temp, 'src'), { recursive: true });
  await fs.copyFile(path.join(root, 'eleventy.config.js'), path.join(temp, 'eleventy.config.js'));
  await fs.copyFile(path.join(root, 'package.json'), path.join(temp, 'package.json'));
  await fs.symlink(path.join(root, 'node_modules'), path.join(temp, 'node_modules'), 'dir');
  await sharp({ create: { width: 320, height: 180, channels: 3, background: '#131518' } }).jpeg().toFile(path.join(temp, 'src/images/articles/small-fixture.jpg'));
  for (let i = 0; i < 18; i++) {
    const slug = `fixture-${String(i).padStart(2, '0')}`;
    const value = body(slug, `2099-01-01T${String(23-i).padStart(2, '0')}:00:00Z`, i === 0 ? 'updated: 2026-10-10T09:00:00Z\nheroCaption: "Original editorial image"\n' : '');
    await fs.writeFile(path.join(temp, `src/articles/2026-10-09-${slug}.md`), value.replace('category: Agents', i === 17 ? 'category: Research' : 'category: Agents'));
  }
  await fixture('author-auto', 'authorPhoto: /images/brand/apple-touch-icon.png\n', 'Ada Example');
  await fixture('house-featured', 'section: featured\n');
  await fixture('named-news', 'section: news\n', 'Ada Example');
  await fixture('draft-fixture', 'draft: true\nsection: featured\n', 'Draft Author');

  // These fixture data files only exist in the isolated temporary checkout.
  const experts = ['pioneer', 'proponent', 'skeptic'].map((stanceType, index) => ({
    slug: `expert-${index}`, name: `Expert ${index}`, role: 'Researcher', stanceType,
    stance: 'A measured fixture stance.', photo: index === 2 ? null : '/images/brand/apple-touch-icon.png', photoAlt: 'Fixture portrait',
    credit: index === 2 ? null : { author: 'Fixture Photographer', authorUrl: 'https://example.org/photographer', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Example.jpg' },
    works: [{ title: 'Original work', year: 1993, url: 'https://example.org/work' }],
  }));
  await fs.writeFile(path.join(temp, 'src/_data/experts.js'), `export default ${JSON.stringify(experts)};\n`);
  await fs.writeFile(path.join(temp, 'src/_data/singularityOrgs.js'), 'export default [{name:"Example Organisation", description:"Research and public education.", url:"https://example.org/organisation"}];\n');
  rebuild();
  const articles = await publishedArticles(temp);
  const headlines = articles.filter(article => article.section === 'news');
  const featured = articles.filter(article => article.section === 'featured');
  const totalPages = Math.ceil(headlines.length/10);
  const seen = [];
  for (let page = 1; page <= totalPages; page++) {
    const content = await html(page === 1 ? 'index.html' : `page/${page}/index.html`);
    assert.deepEqual(cardLinks(content), headlines.slice((page-1)*10, page*10).map(articleUrl));
    seen.push(...cardLinks(content));
    verifyNavigation(content);
    assert.match(content, new RegExp(`rel="canonical" href="[^" ]+${page === 1 ? '/' : `/page/${page}/`}"`));
    if (page < totalPages) assert.match(content, new RegExp(`href="/page/${page+1}/" data-load-more`));
    else assert.ok(!content.includes('data-load-more'));
    if (page > 1) assert.ok(!content.includes('/js/carousel.js'));
    assert.equal(content.includes('/js/lensing.js'), page === 1, 'Only the homepage loads lensing, including with future pagination');
  }
  assert.equal(new Set(seen).size, headlines.length);
  assert.equal(seen[0], '/articles/named-news/');
  const archive = await html('featured/index.html');
  assert.deepEqual(cardLinks(archive), featured.map(articleUrl));
  assert.deepEqual(carouselLinks(archive), featured.map(articleUrl));
  assert.deepEqual(carouselLinks(await html('index.html')), featured.map(articleUrl));
  assert.match(archive, /data-carousel-controls/);
  assert.match(archive, /aria-label="1 of \d+"/);
  assert.match(archive, /class="author-avatar" src="\/images\/brand\/apple-touch-icon.png"/);
  assert.match(archive, /class="author-avatar" aria-hidden="true">SR</);
  assert.ok(!archive.includes('/articles/draft-fixture/'));
  verifyNavigation(archive, '/featured/');
  verifyNavigation(await html('articles/house-featured/index.html'), '/');
  verifyNavigation(await html('articles/named-news/index.html'), '/featured/');
  verifyNavigation(await html('authors/ada-example/index.html'), '/featured/');
  assert.deepEqual(cardLinks(await html('authors/ada-example/index.html')).sort(), ['/articles/author-auto/', '/articles/named-news/']);
  assert.equal(await fs.access(path.join(out, 'articles/draft-fixture')).then(() => true, () => false), false);
  const small = await html('articles/fixture-00/index.html');
  const smallHero = small.match(/<img[^>]*class="hero-image"[^>]*>/)[0];
  assert.match(smallHero, /width="320" height="180"/);
  assert.ok(!/480w|800w|1280w/.test(smallHero));
  assert.match(small, /<figcaption>Original editorial image<\/figcaption>/);
  assert.equal(JSON.parse(small.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]).dateModified, '2026-10-10T09:00:00.000Z');
  const research = await html('category/research/index.html');
  assert.match(research, /href="\/category\/research\/" aria-current="page"/);
  const sitemap = await html('sitemap.xml');
  const rss = await html('rss.xml');
  for (const item of articles) { assert.ok(sitemap.includes(articleUrl(item))); assert.ok(rss.includes(articleUrl(item))); }
  for (let page = 2; page <= totalPages; page++) assert.ok(sitemap.includes(`/page/${page}/`));
  for (const route of ['/featured/', '/what-is-singularity/']) assert.ok(sitemap.includes(route));
  assert.ok(!sitemap.includes('/articles/draft-fixture/') && !rss.includes('/articles/draft-fixture/'));
  const explainer = await html('what-is-singularity/index.html');
  for (const label of ['Pioneer', 'Proponent', 'Skeptic', 'Example Organisation', 'Photo:', 'Wikimedia Commons']) assert.ok(explainer.includes(label));
  assert.match(explainer, /href="https:\/\/example.org\/photographer" rel="noopener"/);
  assert.match(explainer, /href="https:\/\/creativecommons.org\/licenses\/by\/4.0\/" rel="noopener"/);
  assert.match(explainer, /href="https:\/\/example.org\/organisation" rel="noopener"/);

  // Empty sections must retain their public routes, metadata, and usable fallbacks.
  await fs.writeFile(path.join(temp, 'src/_data/experts.js'), 'export default [];\n');
  await fs.writeFile(path.join(temp, 'src/_data/singularityOrgs.js'), 'export default [];\n');
  for (const article of featured) await fs.unlink(path.join(temp, 'src/articles', article.file));
  rebuild();
  assert.equal(carouselLinks(await html('index.html')).length, 0);
  assert.ok(!(await html('index.html')).includes('/js/carousel.js'));
  assert.match(await html('featured/index.html'), /Our authors' next articles will appear here/);
  assert.match(await html('what-is-singularity/index.html'), /Profiles will be added here/);
  for (const file of (await fs.readdir(path.join(temp, 'src/articles'))).filter(file => file.endsWith('.md'))) await fs.unlink(path.join(temp, 'src/articles', file));
  await fixture('only-featured', 'section: featured\n');
  rebuild();
  assert.match(await html('index.html'), /No headline articles are published yet/);
  assert.match(await html('index.html'), /<h1>Latest news<\/h1>/);
  assert.equal(carouselLinks(await html('index.html')).length, 1, 'A homepage without headlines still displays featured articles');
  assert.match(await html('index.html'), /src="\/js\/carousel\.js\?v=[^"]+" defer/);
  assert.ok(!(await html('featured/index.html')).includes('data-carousel-controls'));
  await fs.unlink(path.join(temp, 'src/articles/2026-10-09-only-featured.md'));
  rebuild();
  assert.equal(cardLinks(await html('index.html')).length, 0);
  assert.equal(carouselLinks(await html('index.html')).length, 0);

  await fixture('invalid-section', 'section: opinion\n');
  let result = build();
  assert.notEqual(result.status, 0); assert.match(result.stdout+result.stderr, /Invalid section/);
  await fs.unlink(path.join(temp, 'src/articles/2026-10-09-invalid-section.md'));
  await fs.writeFile(path.join(temp, 'src/articles/2026-10-09-missing-hero.md'), body('missing-hero', '2099-01-01T23:58:00Z').replace('/images/articles/when-the-agents-reach-for-the-open-web.jpg', '/images/articles/missing-hero.jpg'));
  result = build();
  assert.notEqual(result.status, 0); assert.match(result.stdout+result.stderr, /Missing hero for article/); assert.match(result.stdout+result.stderr, /missing-hero/);
  console.log(`CONTENT VERIFIED: ${headlines.length} headlines paginated ten per page, ${featured.length} featured, section overrides, drafts, author archives, populated and empty data, image regressions`);
} finally { await fs.rm(temp, { recursive: true, force: true }); }
