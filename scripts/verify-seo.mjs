import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { parseDocument } from 'htmlparser2';
import { findAll, textContent } from 'domutils';
import { parseXml } from './xml.mjs';
import { publishedArticles, articleUrl } from './verification-helpers.mjs';
import site from '../src/_data/site.js';
import authorProfiles from '../src/_data/authorProfiles.js';

// Static artifact checks only. No browser, network or live validation service.
const read = file => fs.readFile(path.join('_site', file), 'utf8');
const nodes = root => findAll(node => ['tag', 'script'].includes(node.type), root.children || []);
const hasClass = (node, name) => (node.attribs?.class || '').split(/\s+/).includes(name);
const plain = node => textContent(node).replace(/\s+/g, ' ').trim();
const absolute = url => { assert.match(url, /^https:\/\//); return new URL(url); };
const rootUrl = site.url + '/', orgId = site.url + '/#organization', websiteId = site.url + '/#website';
const files = (await fs.readdir('_site', { recursive: true })).filter(file => file.endsWith('.html')).sort();
const articles = await publishedArticles(process.cwd());
const titles = new Set(), descriptions = new Set(), indexable = new Map(), seenArticles = new Set();
const date = value => { assert.equal(typeof value, 'string'); assert.match(value, /^\d{4}-\d{2}-\d{2}(?:T.*(?:Z|[+-]\d{2}:\d{2}))?$/); assert.ok(Number.isFinite(Date.parse(value))); };
const required = (object, properties, label) => properties.forEach(key => assert.ok(object?.[key] !== undefined && object[key] !== '', `${label}: ${key} is required`));

for (const file of files) {
  const html = await read(file), dom = parseDocument(html), all = nodes(dom);
  const named = name => all.filter(node => node.name === name);
  const meta = key => {
    const matches = named('meta').filter(node => node.attribs.name === key || node.attribs.property === key);
    assert.equal(matches.length, 1, `${file}: one ${key} meta tag`);
    return matches[0].attribs.content;
  };
  const link = predicate => {
    const matches = named('link').filter(predicate);
    assert.equal(matches.length, 1, `${file}: one matching head link`);
    return matches[0].attribs.href;
  };
  assert.equal(named('html')[0].attribs.lang, 'en', `${file}: English document language`);
  assert.equal(named('title').length, 1);
  const title = plain(named('title')[0]), description = meta('description');
  assert.ok(!titles.has(title), `${file}: unique title`); titles.add(title);
  assert.ok(!descriptions.has(description), `${file}: unique description`); descriptions.add(description);
  assert.ok(description.length >= 70 && description.length <= 160, `${file}: description length ${description.length}`);
  const route = file === 'index.html' ? '/' : '/' + file.replace(/index\.html$/, '');
  const canonical = link(node => node.attribs.rel === 'canonical');
  assert.equal(canonical, new URL(route, site.url).href, `${file}: absolute self-referential canonical`);
  absolute(canonical);
  if (route === '/') assert.equal(title, 'Singularity Review: AI news, research, and analysis');
  else assert.ok(title.endsWith(' | Singularity Review'));
  const pagination = route.match(/^\/page\/(\d+)\/$/);
  if (pagination) {
    assert.ok(title.includes(`Page ${pagination[1]}`));
    assert.ok(description.includes(`Page ${pagination[1]}`));
  }
  for (const language of ['en', 'x-default']) assert.equal(link(node => node.attribs.rel === 'alternate' && node.attribs.hreflang === language), canonical);
  for (const [type, url] of [['application/rss+xml', '/rss.xml'], ['application/atom+xml', '/atom.xml']]) {
    assert.equal(new URL(link(node => node.attribs.rel === 'alternate' && node.attribs.type === type), canonical).pathname, url);
  }
  assert.equal(meta('og:site_name'), site.title);
  assert.equal(meta('og:url'), canonical);
  assert.equal(meta('og:title'), title);
  assert.equal(meta('og:description'), description);
  assert.equal(meta('twitter:title'), title);
  assert.equal(meta('twitter:description'), description);
  assert.equal(meta('twitter:card'), 'summary_large_image');
  assert.equal(meta('og:image'), meta('twitter:image'));
  absolute(meta('og:image'));
  assert.ok(meta('og:image:alt').trim());
  assert.equal(meta('og:image:alt'), meta('twitter:image:alt'));
  const imageInfo = await sharp(path.join('_site', new URL(meta('og:image')).pathname)).metadata();
  assert.equal(Number(meta('og:image:width')), imageInfo.width);
  assert.equal(Number(meta('og:image:height')), imageInfo.height);
  assert.equal(named('meta').filter(node => node.attribs.name === 'twitter:site').length, 0, 'No invented Twitter handle');

  const blocks = named('script').filter(node => node.attribs.type === 'application/ld+json');
  assert.equal(blocks.length, 1, `${file}: a single JSON-LD graph`);
  assert.ok(!textContent(blocks[0]).includes('<'), 'JSON escapes less-than characters');
  const jsonld = JSON.parse(textContent(blocks[0]));
  assert.equal(jsonld['@context'], 'https://schema.org');
  assert.ok(Array.isArray(jsonld['@graph']));
  assert.ok(!JSON.stringify(jsonld).includes('SearchAction'), 'No search feature exists');
  const graph = jsonld['@graph'], resolve = ref => graph.find(item => item['@id'] === ref?.['@id']);
  assert.equal(new Set(graph.map(item => item['@id'])).size, graph.length, `${file}: stable, unique node IDs`);
  for (const entity of graph) { absolute(entity['@id']); required(entity, ['@type', '@id'], file); }
  const organization = graph.find(item => item['@type'] === 'Organization');
  required(organization, ['name', 'url', 'logo', 'sameAs'], `${file}: Organization`);
  assert.equal(organization['@id'], orgId);
  assert.equal(organization.name, site.title); assert.equal(organization.url, rootUrl);
  assert.deepEqual(organization.sameAs, [site.facebook, site.instagram]);
  assert.equal(organization.address, undefined); assert.equal(organization.telephone, undefined);
  const logo = await sharp(path.join('_site', absolute(organization.logo.url).pathname)).metadata();
  assert.equal(logo.format, 'png'); assert.equal(logo.width, 512); assert.equal(logo.height, 512);
  const website = graph.find(item => item['@type'] === 'WebSite');
  required(website, ['name', 'url', 'publisher', 'inLanguage'], `${file}: WebSite`);
  assert.equal(website['@id'], websiteId); assert.equal(website.url, rootUrl);
  assert.equal(website.publisher['@id'], orgId); assert.equal(website.inLanguage, 'en');
  const page = graph.find(item => item['@id'] === canonical + '#webpage');
  required(page, ['url', 'name', 'description', 'isPartOf', 'breadcrumb', 'inLanguage'], `${file}: WebPage`);
  const type = route.startsWith('/authors/') ? 'ProfilePage' : ['/about/', '/editorial-standards/'].includes(route) ? 'AboutPage' : route === '/' || route === '/featured/' || route.startsWith('/category/') || pagination ? 'CollectionPage' : 'WebPage';
  assert.equal(page['@type'], type);
  assert.equal(page.url, canonical); assert.equal(page.description, description); assert.equal(page.name, title);
  assert.equal(page.isPartOf['@id'], websiteId); assert.equal(page.inLanguage, 'en');
  if (type === 'AboutPage') assert.equal(page.about['@id'], orgId);
  const breadcrumb = resolve(page.breadcrumb);
  required(breadcrumb, ['itemListElement'], `${file}: BreadcrumbList`);
  assert.equal(breadcrumb['@type'], 'BreadcrumbList');
  assert.equal(breadcrumb['@id'], canonical + '#breadcrumb');
  assert.ok(breadcrumb.itemListElement.length > 0);
  breadcrumb.itemListElement.forEach((item, i) => {
    required(item, ['position', 'name', 'item'], `${file}: ListItem`);
    assert.equal(item['@type'], 'ListItem'); assert.equal(item.position, i + 1);
    assert.ok(item.name.trim()); absolute(item.item);
  });
  assert.equal(breadcrumb.itemListElement[0].item, rootUrl);
  assert.equal(breadcrumb.itemListElement.at(-1).item, canonical);
  assert.equal(breadcrumb.itemListElement.length, route === '/' ? 1 : route.startsWith('/articles/') ? 3 : 2);
  if (page.dateModified) date(page.dateModified);
  const noindex = named('meta').some(node => node.attribs.name === 'robots' && /\bnoindex\b/.test(node.attribs.content));
  if (route === '/404.html') assert.ok(noindex);
  if (!noindex) indexable.set(canonical, page.dateModified);

  assert.equal(named('h1').length, 1, `${file}: one h1`);
  assert.equal(named('main').length, 1, `${file}: one main`);
  let level = 0;
  for (const heading of all.filter(node => /^h[1-6]$/.test(node.name))) {
    const next = Number(heading.name[1]);
    assert.ok(next <= level + 1, `${file}: heading levels do not skip`); level = next;
  }
  for (const nav of named('nav')) assert.ok(nav.attribs['aria-label']?.trim(), `${file}: navigation has an aria-label`);
  for (const image of named('img')) {
    assert.ok(Object.hasOwn(image.attribs, 'alt'), `${file}: image has alt`);
    const decorative = hasClass(image, 'masthead-mark') || hasClass(image, 'cover-sky-image') || hasClass(image, 'cover-disk-image');
    assert.ok(decorative ? image.attribs.alt === '' : image.attribs.alt.trim().length > 0, `${file}: content images have meaningful alt, brand images are decorative`);
    assert.ok(Number(image.attribs.width) > 0 && Number(image.attribs.height) > 0, `${file}: reserved image dimensions`);
  }
  for (const time of named('time')) date(time.attribs.datetime);
  for (const caption of named('figcaption')) assert.equal(caption.parent.name, 'figure');

  if (type === 'ProfilePage') {
    const person = resolve(page.mainEntity);
    required(person, ['name', 'url', 'worksFor'], `${file}: Person`);
    assert.equal(person['@type'], 'Person'); assert.equal(person['@id'], canonical + '#person');
    assert.equal(person.url, canonical); assert.equal(person.worksFor['@id'], orgId);
    const profile = authorProfiles.find(item => item.name === person.name || canonical.includes(`/authors/${item.slug}/`));
    assert.equal(person.description, profile?.bio);
    assert.equal(all.filter(node => hasClass(node, 'author-bio')).length, profile?.bio ? 1 : 0);
    if (profile?.bio) assert.equal(plain(all.find(node => hasClass(node, 'author-bio'))), profile.bio);
    assert.deepEqual(person.sameAs, profile?.sameAs?.length ? profile.sameAs : undefined);
  }
  if (route === '/what-is-singularity/') {
    const faq = graph.find(item => item['@type'] === 'FAQPage');
    required(faq, ['mainEntity', 'url', 'isPartOf'], 'FAQPage');
    assert.equal(faq['@id'], canonical + '#faq');
    assert.equal(page.hasPart['@id'], faq['@id']);
    assert.equal(faq.isPartOf['@id'], page['@id']);
    const visible = all.filter(node => hasClass(node, 'faq-item'));
    assert.ok(visible.length >= 5 && visible.length <= 7);
    assert.equal(visible.length, faq.mainEntity.length);
    visible.forEach((item, i) => {
      const question = faq.mainEntity[i], children = nodes(item);
      required(question, ['name', 'acceptedAnswer'], 'Question'); assert.equal(question['@type'], 'Question');
      required(question.acceptedAnswer, ['text'], 'Answer'); assert.equal(question.acceptedAnswer['@type'], 'Answer');
      assert.equal(question.name, plain(children.find(node => node.name === 'h3')));
      assert.equal(question.acceptedAnswer.text, plain(children.find(node => node.name === 'p')));
    });
    assert.ok(named('p').some(node => plain(node).startsWith("This is Singularity Review's editorial opinion, and it is speculative.")));
  }
  if (route.startsWith('/articles/')) {
    const article = articles.find(item => articleUrl(item) === route);
    assert.ok(article, `${file}: published source article exists`); seenArticles.add(route);
    assert.equal(meta('og:type'), 'article');
    const news = graph.find(item => item['@type'] === 'NewsArticle');
    required(news, ['headline', 'description', 'image', 'datePublished', 'dateModified', 'author', 'publisher', 'mainEntityOfPage', 'articleSection', 'keywords', 'inLanguage', 'isAccessibleForFree', 'wordCount', 'citation'], `${file}: NewsArticle`);
    assert.equal(news['@id'], canonical + '#article');
    assert.equal(news.headline, plain(named('h1')[0])); assert.ok(news.headline.length <= 110);
    assert.equal(news.description, description); date(news.datePublished); date(news.dateModified);
    assert.equal(news.datePublished, article.date.toISOString());
    assert.equal(news.dateModified, new Date(article.updated || article.date).toISOString());
    assert.equal(meta('article:published_time'), news.datePublished);
    assert.equal(meta('article:modified_time'), news.dateModified);
    assert.equal(meta('article:section'), article.category);
    assert.equal(news.articleSection, article.category); assert.equal(news.inLanguage, 'en');
    assert.deepEqual(news.keywords, article.tags);
    assert.equal(news.isAccessibleForFree, true);
    assert.equal(news.publisher['@id'], orgId);
    assert.equal(news.mainEntityOfPage['@id'], page['@id']); assert.equal(page.mainEntity['@id'], news['@id']);
    const byline = resolve(news.author);
    required(byline, ['name', 'url'], 'Article author');
    if (article.author === site.defaultAuthor) {
      assert.equal(byline['@type'], 'Organization'); assert.equal(byline['@id'], orgId);
      assert.equal(meta('article:author'), site.url + '/about/');
    } else {
      assert.equal(byline['@type'], 'Person'); assert.equal(byline.name, article.author);
      assert.equal(byline['@id'], byline.url + '#person');
      assert.ok(new URL(byline.url).pathname.startsWith('/authors/'));
      assert.equal(meta('article:author'), byline.url);
    }
    assert.equal(breadcrumb.itemListElement[1].name, article.category);
    const body = all.find(node => hasClass(node, 'article-body'));
    assert.equal(news.wordCount, textContent(body).trim().split(/\s+/u).filter(Boolean).length);
    assert.ok(news.wordCount > 0);
    assert.ok(Array.isArray(news.image) && news.image.length > 0);
    const hero = all.find(node => hasClass(node, 'hero-image'));
    const variants = (hero.attribs.srcset || '').split(',').map(value => value.trim().split(/\s+/)).filter(([, width]) => parseInt(width) >= 1200);
    if (variants.length) assert.ok(variants.some(([url]) => new URL(url, site.url).href === news.image[0]), 'Structured image uses a wide generated hero');
    else assert.equal(news.image[0], new URL(article.hero, site.url).href);
    for (const url of news.image) await fs.access(path.join('_site', absolute(url).pathname));
    const section = all.find(node => hasClass(node, 'article-takeaways'));
    assert.ok(section); assert.equal(plain(nodes(section).find(node => node.name === 'h2')), 'Key takeaways');
    assert.ok(article.takeaways?.length >= 3 && article.takeaways.length <= 4);
    assert.deepEqual(nodes(section).filter(node => node.name === 'li').map(plain), article.takeaways);
    assert.ok(all.indexOf(section) > all.indexOf(all.find(node => hasClass(node, 'byline'))) && all.indexOf(section) < all.indexOf(body));
    const sourcesSection = all.find(node => hasClass(node, 'article-sources'));
    if (article.sources?.length) {
      assert.ok(sourcesSection); assert.equal(plain(nodes(sourcesSection).find(node => node.name === 'h2')), 'Sources');
      const list = nodes(sourcesSection).find(node => node.name === 'ol');
      const items = nodes(list).filter(node => node.name === 'li');
      assert.equal(items.length, article.sources.length);
      assert.equal(news.citation.length, items.length);
      const newsletter = all.find(node => hasClass(node, 'newsletter-article'));
      assert.ok(all.indexOf(sourcesSection) > all.indexOf(body) && all.indexOf(sourcesSection) < all.indexOf(newsletter));
      items.forEach((item, i) => {
        const source = article.sources[i], citation = news.citation[i];
        const anchor = nodes(item).find(node => node.name === 'a');
        assert.equal(anchor.attribs.href, source.url); absolute(source.url);
        assert.equal(plain(item), `${source.publisher ? source.publisher + ', ' : ''}${source.title}${source.date ? ', ' + source.date : ''}`);
        assert.equal(citation['@type'], 'CreativeWork'); assert.equal(citation.url, source.url); assert.equal(citation.name, source.title);
        assert.equal(citation.publisher?.name, source.publisher || undefined);
        assert.equal(citation.datePublished, source.date || undefined);
        if (source.date) date(source.date);
      });
    } else {
      assert.equal(article.opinion, true, 'Only an explicitly labelled unsourced opinion may omit Sources');
      assert.equal(sourcesSection, undefined); assert.deepEqual(news.citation, []);
      assert.ok(html.includes('<p class="plain-label">Opinion</p>'));
      assert.ok(article.takeaways.every(value => value.startsWith('The author ')), 'Essay takeaways describe the author\'s argument');
    }
  } else assert.equal(meta('og:type'), 'website');
}
assert.equal(seenArticles.size, articles.length);

const sitemap = parseXml(await read('sitemap.xml'), 'Sitemap');
const sitemapNodes = nodes(sitemap);
assert.equal(sitemapNodes[0].name, 'urlset');
assert.equal(sitemapNodes[0].attribs.xmlns, 'http://www.sitemaps.org/schemas/sitemap/0.9');
const urls = sitemapNodes.filter(node => node.name === 'url');
const sitemapUrls = urls.map(node => plain(nodes(node).find(item => item.name === 'loc')));
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length);
assert.deepEqual([...sitemapUrls].sort(), [...indexable.keys()].sort(), 'Sitemap covers every indexable HTML page and excludes 404');
for (const url of urls) {
  const children = nodes(url), location = plain(children.find(node => node.name === 'loc'));
  const target = absolute(location).pathname;
  await fs.access(path.join('_site', target.endsWith('/') ? target + 'index.html' : target));
  const lastmod = children.find(node => node.name === 'lastmod'), expected = indexable.get(location);
  assert.equal(lastmod ? plain(lastmod) : undefined, expected?.slice(0, 10), 'Sitemap lastmod is derived from page data');
}
for (const route of ['/privacy/', '/cookies/', '/editorial-standards/']) assert.ok(sitemapUrls.includes(site.url + route));
const robots = await read('robots.txt');
const groups = robots.trim().split(/\n\s*\n/);
for (const name of ['*', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot']) {
  const group = groups.find(value => value.split('\n')[0] === `User-agent: ${name}`);
  assert.ok(group, `Robots: explicit ${name} group`); assert.ok(group.split('\n').includes('Allow: /'));
  assert.ok(!group.includes('Disallow:'));
}
assert.ok(robots.includes(`Sitemap: ${site.url}/sitemap.xml`));

const atom = parseXml(await read('atom.xml'), 'Atom'), rss = parseXml(await read('rss.xml'), 'RSS');
const atomNodes = nodes(atom), rssNodes = nodes(rss);
assert.equal(atomNodes[0].name, 'feed'); assert.equal(atomNodes[0].attribs.xmlns, 'http://www.w3.org/2005/Atom');
assert.equal(rssNodes[0].name, 'rss'); assert.equal(rssNodes[0].attribs.version, '2.0');
const children = node => node.children.filter(item => item.type === 'tag');
const child = (node, name) => children(node).find(item => item.name === name);
const feed = atomNodes[0];
for (const name of ['title', 'id', 'updated', 'author']) assert.ok(child(feed, name), `Atom feed: ${name}`);
date(plain(child(feed, 'updated')));
assert.equal(plain(child(feed, 'id')), site.url + '/atom.xml');
const entries = atomNodes.filter(node => node.name === 'entry'), items = rssNodes.filter(node => node.name === 'item');
assert.equal(entries.length, items.length); assert.equal(entries.length, Math.min(50, articles.length));
entries.forEach((entry, i) => {
  const article = articles[i];
  for (const name of ['title', 'id', 'updated', 'published', 'author', 'summary', 'link']) assert.ok(child(entry, name), `Atom entry: ${name}`);
  assert.equal(plain(child(entry, 'title')), article.title);
  assert.equal(plain(child(entry, 'id')), site.url + articleUrl(article));
  assert.equal(plain(child(entry, 'updated')), new Date(article.updated || article.date).toISOString());
  date(plain(child(entry, 'updated'))); date(plain(child(entry, 'published')));
  assert.equal(plain(child(child(entry, 'author'), 'name')), article.author);
  assert.equal(plain(child(entry, 'summary')), article.description);
  assert.equal(child(entry, 'link').attribs.href, site.url + articleUrl(article));
  const item = items[i];
  for (const name of ['title', 'link', 'guid', 'pubDate', 'description', 'content:encoded']) assert.ok(child(item, name), `RSS item: ${name}`);
  assert.equal(plain(child(item, 'title')), article.title);
  assert.equal(plain(child(item, 'link')), site.url + articleUrl(article));
  assert.equal(plain(child(item, 'guid')), plain(child(item, 'link')));
  assert.ok(Number.isFinite(Date.parse(plain(child(item, 'pubDate')))));
  assert.equal(plain(child(item, 'description')), article.description);
  assert.ok(textContent(child(item, 'content:encoded')).trim());
});
const firebase = JSON.parse(await fs.readFile('firebase.json', 'utf8'));
for (const [url, type] of [['/atom.xml', 'application/atom+xml; charset=utf-8'], ['/rss.xml', 'application/rss+xml; charset=utf-8']]) {
  const header = firebase.hosting[0].headers.find(entry => entry.source === url);
  assert.equal(header.headers.find(value => value.key === 'Content-Type').value, type);
}
const llms = await read('llms.txt');
assert.ok(llms.startsWith('# Singularity Review\n')); assert.match(llms, /\n> [^\n]+\n/);
for (const heading of ['Articles', 'Explainer', 'About', 'Feeds', 'Policies']) assert.ok(llms.includes(`## ${heading}\n`));
for (const article of articles) assert.ok(llms.includes(`[${article.title}](${site.url}${articleUrl(article)}): ${article.seoDescription || article.description}`), 'llms.txt includes current article title, URL and summary');
for (const route of ['/rss.xml', '/atom.xml', '/sitemap.xml', '/privacy/', '/cookies/', '/editorial-standards/']) assert.ok(llms.includes(site.url + route));
const audit = JSON.parse(await fs.readFile('.audit/sources-to-date.json', 'utf8'));
const missing = JSON.parse(await fs.readFile('.audit/sources-missing.json', 'utf8'));
const researched = JSON.parse(await fs.readFile('.audit/sources-research.json', 'utf8'));
const explainerSource = await fs.readFile('src/what-is-singularity.njk', 'utf8');
for (const article of articles) {
  const record = audit.find(item => item.article === article.file); assert.ok(record);
  assert.deepEqual(record.sources.map(({ dateKnown, provenance, ...source }) => { assert.equal(dateKnown, Boolean(source.date)); assert.ok(provenance); return source; }), article.sources);
  assert.equal(missing.some(item => item.article === article.file), article.sources.length === 0);
  if (researched[article.file]) assert.deepEqual(article.sources, researched[article.file], 'Research entries must be copied exactly');
  else for (const source of article.sources) assert.ok(article.source.includes(`](${source.url})`) || explainerSource.includes(`href="${source.url}"`), 'Other source URLs come from existing content links');
}

for (const file of (await fs.readdir('_site', { recursive: true })).filter(file => /\.(?:html|xml|txt|json|css|js|svg)$/.test(file))) {
  assert.doesNotMatch(await read(file), /[\u2013\u2014]|&(?:ndash|mdash|#821[12]|#x201[34]);/i, `${file}: no forbidden punctuation`);
}
// Positive controls ensure the strict XML guard rejects common feed regressions.
for (const invalid of ['<feed><entry></feed>', '<rss a="1" a="2"/>', '<feed>&unknown;</feed>', '<feed><title>bad & text</title></feed>', '<feed/>trailing', '<feed><atom:link/></feed>']) assert.throws(() => parseXml(invalid));
console.log(`SEO VERIFIED: ${files.length} HTML pages, ${indexable.size} sitemap entries, ${articles.length} articles, matching RSS/Atom entries, current llms.txt, metadata, graph properties, FAQs, source provenance and semantic/image checks. No browser or network was used.`);
