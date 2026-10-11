import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { parseDocument } from 'htmlparser2';
import { findAll, textContent } from 'domutils';
import { publishedArticles, articleUrl, verifyNavigation } from './verification-helpers.mjs';
import { checkHeroControls } from './hero-contract.mjs';
import { cssRules, styleAt, length } from './static-layout.mjs';
const read = file => fs.readFile(file, 'utf8');
const nodes = root => findAll(node => node.type === 'tag', root.children || []);
const hasClass = (node, value) => (node.attribs?.class || '').split(/\s+/).includes(value);
const classes = (root, value) => nodes(root).filter(node => hasClass(node, value));
const articles = await publishedArticles(process.cwd());
const headlines = articles.filter(article => article.section === 'news');
const featured = articles.filter(article => article.section === 'featured');
const css = await read('src/css/style.css'), rules = cssRules(css);
assert.equal(await read('_site/css/style.css'), css);
const titles = new Map([['index.html','Singularity headline news'], ['featured/index.html','Featured author articles'], ['what-is-singularity/index.html','What is singularity'], ['about/index.html','Who we are and our mission']]);
function checkFooter(dom) {
  const footer = classes(dom, 'site-footer')[0]; assert.ok(footer);
  assert.equal(classes(footer, 'footer-columns').length, 0);
  assert.equal(classes(footer, 'footer-description').length, 0);
  const links = nodes(footer).filter(node => node.name === 'a');
  assert.ok(!links.some(node => /^\/(category|authors|editorial-standards)\//.test(node.attribs.href)), 'No topic, author or standards links in footer');
  assert.ok(!nodes(footer).some(node => /^h[1-6]$/.test(node.name) && ['Topics','Sections','Follow','Legal'].includes(textContent(node))));
  const legal = classes(footer, 'footer-legal')[0];
  assert.deepEqual(nodes(legal).filter(node => node.name === 'a').map(node => [textContent(node), node.attribs.href]), [['Privacy','/privacy/'],['Cookies','/cookies/'],['Terms','/terms/'],['Contact','/contact/']]);
  const buttons = nodes(legal).filter(node => node.name === 'button');
  assert.equal(buttons.length, 1); assert.equal(textContent(buttons[0]), 'Cookie settings'); assert.ok(Object.hasOwn(buttons[0].attribs, 'data-consent-open'));
  assert.equal(nodes(footer).filter(node => node.name === 'h2').length, 1);
  assert.equal(textContent(nodes(footer).find(node => node.name === 'h2')), 'Get the newsletter');
  assert.equal(classes(footer, 'newsletter-embed').length, 1);
  const social = classes(footer, 'footer-social')[0];
  assert.deepEqual(nodes(social).filter(node => node.name === 'a').map(node => node.attribs['aria-label']), ['Singularity Review on Facebook', 'Singularity Review on Instagram', 'Singularity Review on Telegram', 'RSS']);
  assert.ok(textContent(footer).includes('2026 Singularity Review')); for (const text of ['Kitt Peak at Night','Marenfeld','CC BY 4.0']) assert.ok(!textContent(footer).includes(text), 'Skyline credit moved to /about/');
}
function checkHome(dom, preview = false) {
  const main = nodes(dom).find(node => node.name === 'main');
  const children = main.children.filter(node => node.type === 'tag');
  const expected = ['night-cover', 'card-row', ...(preview ? ['home-ad'] : []), ...(featured.length ? ['author-shelf'] : [])];
  assert.deepEqual(children.map(node => expected.find(name => hasClass(node, name)) || node.attribs?.class || node.name), expected, 'Homepage contains only approved components in order');
  assert.equal(classes(main, 'card-row').length, 1);
  const row = classes(main, 'card-row')[0];
  assert.equal(textContent(nodes(row).find(node => node.name === 'h2')), 'Singularity headline news');
  const links = classes(row, 'post-card-link');
  assert.deepEqual(links.map(node => node.attribs.href), headlines.slice(0,10).map(articleUrl));
  const all = classes(row, 'card-row-all');
  assert.equal(all.length, headlines.length > 10 ? 1 : 0);
  if (all.length) assert.equal(all[0].attribs.href, '/page/2/');
  if (featured.length) {
    const carousel = classes(main, 'author-shelf')[0];
    assert.equal(textContent(nodes(carousel).find(node => node.name === 'h2')), 'Featured author articles');
    const target = classes(carousel, 'shelf-all')[0]; assert.equal(target.attribs.href, '/featured/'); assert.equal(textContent(target), 'See all');
  }
  assert.equal(classes(main, 'post-grid').length, 0);
  assert.equal(classes(main, 'story-grid').length, 0);
  assert.equal(classes(main, 'card--lead').length, 0);
  assert.ok(!nodes(main).some(node => /^h[1-6]$/.test(node.name) && textContent(node) === 'Latest'));
}
const pages = (await fs.readdir('_site', { recursive: true })).filter(file => file.endsWith('.html'));
for (const file of (await fs.readdir('_site',{recursive:true})).filter(file => /(?:\.html|\.xml|llms\.txt)$/.test(file))) {
  assert.doesNotMatch(await read('_site/'+file), /Pinker/i, file + ': removed expert is absent');
}
assert.equal(await fs.access('_site/images/experts/steven-pinker.jpg').then(()=>true,()=>false),false,'Removed expert portrait is absent');
for (const file of pages) {
  const html = await read('_site/' + file), dom = parseDocument(html);
  const active = file.startsWith('featured/') || file.startsWith('authors/') || (file.startsWith('articles/') && /<p class="byline meta">By <a/.test(html)) ? '/featured/' : file.startsWith('about/') ? '/about/' : file.startsWith('what-is-singularity/') ? '/what-is-singularity/' : '/';
  verifyNavigation(html, active); checkFooter(dom);
  const headlineRoute = file === 'index.html' || file.startsWith('page/');
  if (headlineRoute) assert.equal(classes(dom,'story-block').length,0,file+': headline-only post cards');
  else { assert.equal(classes(dom,'post-card').length,0,file+': no headline cards'); assert.equal(classes(dom,'card-row').length,0,file+': no headline row'); }
  if (/^(featured|authors|category|articles)\//.test(file) && (file.startsWith('articles/') ? articles.length > 1 : !file.startsWith('featured/') || featured.length)) assert.ok(classes(dom,'story-block').length > 0,file+': approved story blocks');
  if (titles.has(file) || file.startsWith('page/')) {
    const title = titles.get(file) || 'Singularity headline news: Page ' + file.split('/')[1];
    assert.equal(textContent(nodes(dom).find(node => node.name === 'title')), title + ' | Singularity Review');
    assert.equal(nodes(dom).find(node => node.name === 'meta' && node.attribs.property === 'og:title').attribs.content, title + ' | Singularity Review');
    if (file !== 'index.html') assert.equal(textContent(nodes(dom).find(node => node.name === 'h1')), file.startsWith('page/') ? 'Singularity headline news' : title);
  }
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
  const trail = graph.find(node => node['@type'] === 'BreadcrumbList').itemListElement;
  assert.equal(trail[0].name, 'Singularity headline news');
  if (titles.has(file) && file !== 'index.html') assert.equal(trail.at(-1).name, titles.get(file));
  if (file.startsWith('page/')) assert.equal(trail.at(-1).name, 'Singularity headline news: Page ' + file.split('/')[1]);
}
const home = await read('_site/index.html'); checkHome(parseDocument(home)); checkHeroControls(home, css);
const about = parseDocument(await read('_site/about/index.html'));
assert.ok(nodes(nodes(about).find(node => node.name === 'main')).some(node => node.name === 'a' && node.attribs.href === '/editorial-standards/'));
for (const file of ['editorial-standards/index.html','privacy/index.html','cookies/index.html','terms/index.html','contact/index.html']) await fs.access('_site/' + file);
const llms = await read('_site/llms.txt'); for (const label of ['Singularity headline news','Featured author articles','What is singularity','Who we are']) assert.ok(llms.includes('[' + label + ']'));
for (const file of (await fs.readdir('src', { recursive: true })).filter(file => /\.(?:css|js|njk|md|json|html|svg|txt)$/.test(file))) assert.doesNotMatch(await read('src/' + file), /[\u2013\u2014]|&(?:ndash|mdash|#821[12]|#x201[34]);/i, file + ': no forbidden punctuation');
export function allowedRGB(rgb) {
  const [r,g,b] = rgb.map(x => x / 255), max = Math.max(r,g,b), min = Math.min(r,g,b), delta = max - min;
  if (delta === 0) return true;
  const hue = ((max === r ? (g-b)/delta : max === g ? (b-r)/delta + 2 : (r-g)/delta + 4) * 60 + 360) % 360;
  return hue < 255 || hue > 330;
}
function checkPalette(value) {
  assert.doesNotMatch(value, /\b(?:purple|violet|magenta|lavender|fuchsia|orchid|plum|thistle|rebeccapurple|mediumslateblue|darkslateblue|slateblue)\b/i);
  for (const [,hex] of value.matchAll(/#([a-f\d]{8}|[a-f\d]{6}|[a-f\d]{4}|[a-f\d]{3})\b/gi)) {
    const full = hex.length <= 4 ? [...hex].map(char => char + char).join('') : hex;
    assert.ok(allowedRGB([0,2,4].map(i => parseInt(full.slice(i,i+2),16))), '#' + hex);
  }
  for (const [,rgb] of value.matchAll(/rgba?\(([^)]+)\)/gi)) assert.ok(allowedRGB(rgb.split('/')[0].trim().split(/[\s,]+/).slice(0,3).map(x => parseFloat(x) * (x.includes('%') ? 2.55 : 1))));
  const angle = value => parseFloat(value) * (value.endsWith('turn') ? 360 : value.endsWith('rad') && !value.endsWith('grad') ? 180/Math.PI : value.endsWith('grad') ? .9 : 1);
  for (const [,type,parts] of value.matchAll(/(hsla?|oklch)\(([^)]+)\)/gi)) {
    const fields = parts.split('/')[0].trim().split(/[\s,]+/);
    const hue = (angle(fields[type.toLowerCase() === 'oklch' ? 2 : 0]) % 360 + 360) % 360;
    assert.ok(Number.isFinite(hue) && (hue < 255 || hue > 330), type + '(' + parts + ')');
  }
}
checkPalette(css);
for (const color of ['#800080','#ff00ff','hsl(255 1% 50%)','oklch(.5 .1 330)','rgb(128 0 128)']) assert.throws(() => checkPalette('a {color:' + color + '}'), 'Forbidden hue control');
checkPalette('a {color:#F2A93B;background:#1C1C1B}');
for (const width of [320,390,640,768,1024,1440,1920]) {
  const get = selector => styleAt(rules, selector, width, 900);
  assert.equal(get('.newsletter-embed')['min-width'], '0'); assert.equal(get('.newsletter-embed-frame')['border-radius'], '16px'); assert.equal(get('.newsletter-embed-frame').overflow, 'hidden');
  assert.equal(get('.newsletter-embed-frame iframe').width, '100%'); assert.equal(get('.newsletter-footer')['max-width'], '520px');
  assert.equal(get('.newsletter-footer').display, 'flex');
  assert.equal(get('.newsletter-footer')['flex-direction'], 'column');
  assert.equal(get('.newsletter-footer h2').position, 'static');
  assert.equal(get('.newsletter-footer h2')['text-align'], 'left');
  assert.ok(!['absolute', 'fixed'].includes(get('.newsletter-footer .newsletter-embed').position));
  const gutter = width < 640 ? 20 : 32;
  const available = Math.min(width - 2*gutter, 1248, 520);
  assert.ok(available - 8 - 105 >= 100, 'Email and button fit even at 320px');
  const variables = get(':root');
  const pageWidth = Math.min(length(get('.feed-width').width,width,900),1248);
  const trackLeft = (width-pageWidth)/2 - gutter;
  const trackWidth = length(get('.card-row-track').width,width,900,width,variables);
  assert.ok(Math.abs(trackLeft + trackWidth - width) < .01, 'Row ends at the viewport edge without document overflow');
  assert.equal(get('.site-footer')['margin-top'], width < 640 ? '48px' : '64px');
}
// Read-only Git comparison preserves the existing interactive hero and carousel behavior.
for (const file of ['src/js/carousel.js','src/_includes/share.njk','src/_includes/reactions.njk','src/robots.njk','src/rss.njk','src/atom.njk']) {
  const original = spawnSync('git',['show','HEAD:' + file],{encoding:'utf8'});
  assert.equal(original.status,0,original.stderr); assert.equal(await read(file),original.stdout,file + ': preserved contract');
}
const baseline = spawnSync('git',['show','HEAD:src/index.njk'],{encoding:'utf8'}).stdout;
const currentSource = await read('src/index.njk');
const heroSource = value => value.slice(value.indexOf('<div class="night-cover"'), value.indexOf('</div>\n', value.indexOf('data-motion-toggle')) + 6).trim();
assert.equal(heroSource(currentSource), heroSource(baseline), 'Hero template and its subline are unchanged');
for (const [before,after] of [['class="footer-top"','class="footer-columns"'], ['>Singularity headline news</a>','>News</a>'], ['class="card-row feed-width"','class="post-grid feed-width"']]) {
  const fixture = home.replace(before,after);
  assert.throws(() => { const dom = parseDocument(fixture); verifyNavigation(fixture); checkFooter(dom); checkHome(dom); }, 'Broken restored structure control');
}
console.log('Restore verification passed: exact navigation, titles, breadcrumbs, homepage, compact footer, palette, punctuation, input fit and preserved hero/carousel contracts.');
