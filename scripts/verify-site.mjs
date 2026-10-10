import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { sentenceTitle } from '../src/_lib/editorial.js';
import { checkHeroControls } from './hero-contract.mjs';
import { publishedArticles, cardLinks, carouselLinks, articleUrl, verifyNavigation } from './verification-helpers.mjs';

const root = process.cwd();
const out = path.join(root, '_site');
const text = file => fs.readFile(path.join(root, file), 'utf8');
const html = file => fs.readFile(path.join(out, file), 'utf8');
const articles = await publishedArticles(root);
for (const { source, slug, author } of articles) {
  const page = await html(`articles/${slug}/index.html`);
  assert.match(source, new RegExp(`^hero: /images/articles/${slug}\\.jpg$`, 'm'));
  assert.match(page, /<picture><source type="image\/avif"/);
  assert.match(page, /type="image\/webp"/);
  assert.match(page, /class="hero-image"[^>]*width="\d+" height="\d+"/);
  assert.match(page, /<h1 class="article-title">/);
  assert.match(page, /Read next/);
  const jsonld = JSON.parse(page.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(jsonld['@type'], 'NewsArticle');
  assert.equal(new URL(jsonld.mainEntityOfPage).pathname, `/articles/${slug}/`);
  assert.equal(new URL(jsonld.image[0]).pathname, `/images/articles/${slug}.jpg`);
  assert.match(jsonld.publisher.logo.url, /apple-touch-icon\.png$/);
  assert.match(page, new RegExp(`property="og:image" content="[^"]*/images/articles/${slug}\\.jpg"`));
  assert.match(page, /rel="preload" as="image" type="image\/avif"/);
  const hero = await sharp(`src/images/articles/${slug}.jpg`).metadata();
  assert.equal(hero.width, 1280); assert.equal(hero.height, 720); assert.equal(hero.isProgressive, true);
  await fs.access(path.join(out, 'images/articles', `${slug}.jpg`));
  verifyNavigation(page, author === 'Singularity Review' ? '/' : '/featured/');
  assert.match(page, /class="share-bar/);
  assert.match(page, /data-reactions/);
}
const headlines = articles.filter(article => article.section === 'news');
const featured = articles.filter(article => article.section === 'featured');
const home = await html('index.html');
const cards = cardLinks(home);
assert.deepEqual(cards, headlines.slice(0,10).map(articleUrl));
if (headlines.length) {
  const lead = headlines[0];
  assert.match(home, /class="card card--featured card--lead"/);
  assert.match(home, /<h2 class="card-title"/);
  assert.ok(home.includes(sentenceTitle(lead.source.match(/^title: (.+)$/m)[1].replace(/^"|"$/g, ''))), 'Lead is the actual newest news story');
  const firstCard = home.slice(home.indexOf('<article class="card'), home.indexOf('</article>', home.indexOf('<article class="card')));
  assert.ok(firstCard.indexOf('class="card-title"') < firstCard.indexOf('class="card-media"'), 'Lead headline precedes the photo');
  assert.match(firstCard, /class="card-byline meta lead-byline"/);
  assert.match(firstCard, /<time datetime=/);
}
assert.doesNotMatch(home, /<h1>Singularity headline news<\/h1>/);
const retiredImage = ['skyline', 'clean'].join('-');
const retiredCopy = ['An observatory for the AI beat', 'AI news for people living through the singularity'];
for (const phrase of retiredCopy) assert.ok(!home.toLowerCase().includes(phrase.toLowerCase()), `No obsolete homepage copy: ${phrase}`);
assert.doesNotMatch(home, /class="kicker"|class="cover-dek"|class="cover-copy"/);
const motion = home.match(/<button[^>]*data-motion-toggle[^>]*>([\s\S]*?)<\/button>/);
assert.ok(motion, 'Motion icon control exists');
assert.match(motion[0], /aria-label="Pause sky animation"/);
assert.match(motion[0], /aria-pressed="false"/);
assert.match(motion[1], /<svg[^>]+aria-hidden="true"/);
assert.equal(motion[1].replace(/<[^>]*>/g, '').trim(), '', 'Motion control has no visible text');
assert.ok(!home.includes(retiredImage));
verifyNavigation(home);
if (headlines.length) assert.match(home, /loading="eager" fetchpriority="high" class="card-image"/);
assert.equal((home.match(/loading="lazy" fetchpriority="auto" class="story-block-image"/g) || []).length, Math.max(0,cards.length-1));
if (headlines.length) assert.match(home, /rel="preload" as="image" type="image\/avif"/);
assert.deepEqual(carouselLinks(home), featured.map(articleUrl));
const featuredPage = await html('featured/index.html');
assert.deepEqual(cardLinks(featuredPage), featured.map(articleUrl));
assert.deepEqual(carouselLinks(featuredPage), featured.map(articleUrl));
verifyNavigation(featuredPage, '/featured/');
verifyNavigation(await html('about/index.html'), '/about/');
const explainer = await html('what-is-singularity/index.html');
verifyNavigation(explainer, '/what-is-singularity/');
assert.equal(JSON.parse(explainer.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@type'], 'WebPage');
for (const route of ['about/index.html','featured/index.html','what-is-singularity/index.html','404.html','rss.xml','sitemap.xml','robots.txt']) await fs.access(path.join(out,route));
for (const category of new Set(articles.map(article => article.category))) {
  const slug = category.toLowerCase().replace(/[^a-z0-9]+/g,'-');
  const page = await html(`category/${slug}/index.html`);
  assert.match(page, new RegExp(`href="/category/${slug}/" aria-current="page"`));
  assert.equal((page.match(/data-card/g)||[]).length, articles.filter(article => article.category===category).length);
}
const totalPages = Math.max(1, Math.ceil(headlines.length/10));
for(let page=2;page<=totalPages;page++) {
  const content = await html(`page/${page}/index.html`);
  assert.deepEqual(cardLinks(content), headlines.slice((page-1)*10,page*10).map(articleUrl));
  verifyNavigation(content);
  assert.ok(!content.includes('/js/carousel.js'), 'Carousel script only on carousel pages');
}
if(totalPages<=1) assert.equal(await fs.access(path.join(out,'page')).then(()=>true,()=>false),false);
const formats = new Map();
for (const entry of await fs.readdir(path.join(out,'img'), { withFileTypes: true })) {
  if (entry.isDirectory()) { assert.equal(entry.name, 'brand', 'Only brand variants have a separate directory'); continue; }
  const meta = await sharp(path.join(out,'img',entry.name)).metadata();
  const widths = formats.get(meta.format)||new Set(); widths.add(meta.width); formats.set(meta.format,widths);
}
for (const format of ['heif','webp','jpeg']) assert.deepEqual([...formats.get(format)].sort((a,b)=>a-b),[480,800,1280]);
for (const font of ['newsreader-latin-wght-normal','newsreader-latin-wght-italic','inter-tight-latin-wght-normal']) await fs.access(path.join(out,'fonts',`${font}.woff2`));
const icon = await sharp(path.join(out,'images/brand/apple-touch-icon.png')).metadata();assert.equal(icon.width,180);assert.equal(icon.height,180);
const og = await sharp(path.join(out,'images/brand/og-default.jpg')).metadata();assert.equal(og.width,1200);assert.equal(og.height,630);
for (const size of [32, 48]) {
  const icon = await sharp(path.join(out, `favicon-${size}.png`)).metadata();
  assert.equal(icon.width, size); assert.equal(icon.height, size); assert.equal(icon.format, 'png');
  assert.match(home, new RegExp(`href="/favicon-${size}\\.png\\?v=[a-f0-9]{10}" type="image/png" sizes="${size}x${size}"`));
}
const favicon = await text('src/favicon.svg');
assert.match(favicon, /<image[^>]+href="data:image\/png;base64,/);
assert.ok(!/<(?:circle|ellipse|path)\b/.test(favicon), 'Favicon embeds the real photographic crop');
assert.doesNotMatch(await text('src/images/brand/wordmark.svg'), /<image|font-style="italic"/);
assert.doesNotMatch(home, /class="brand-mark"/);
assert.equal((home.match(/class="masthead-mark"/g) || []).length, 1, 'Owner approved AI black hole mark sits once beside the serif wordmark');
assert.match(home, /<img class="masthead-mark"[^>]*alt=""[^>]*>/, 'Decorative mark; the link label names the site');
assert.match(home, /class="night-cover" data-cover/);
assert.match(home, /class="cover-sky-image"[^>]+width="\d+" height="\d+"/);
const coverSky = home.match(/<img[^>]*class="cover-sky-image"[^>]*>/)?.[0];
assert.ok(coverSky, 'Skyline image exists');
assert.match(coverSky, /loading="eager"/); assert.match(coverSky, /fetchpriority="low"/);
assert.match(coverSky, /sizes="\(max-width: 639px\) 640px, 100vw"/);
assert.match(home.slice(home.lastIndexOf('<source', home.indexOf(coverSky))), /3840w/);
assert.match(home, /class="cover-disk-image"/);
assert.match(home, /data-motion-toggle/);
const brandFormats = new Map();
for (const file of await fs.readdir(path.join(out, 'img/brand'))) {
  const meta = await sharp(path.join(out, 'img/brand', file)).metadata();
  assert.ok(meta.width <= 3840 && meta.height > 0);
  const widths = brandFormats.get(meta.format) || new Set(); widths.add(meta.width); brandFormats.set(meta.format, widths);
  assert.ok((await fs.stat(path.join(out, 'img/brand', file))).size < 2500000, `High quality brand budget: ${file}`);
}
for (const format of ['heif', 'webp', 'jpeg']) assert.deepEqual([...brandFormats.get(format)].sort((a,b) => a-b), [480,800,1280,1440,1920,2560,2880,3840]);
const skyOriginal = await sharp('src/images/brand/skyline-kittpeak.jpg').metadata();
assert.equal(skyOriginal.width, 5472); assert.equal(skyOriginal.height, 3648);
for (const folder of ['src/images/brand', '_site/images/brand']) {
  const names = await fs.readdir(folder);
  assert.ok(names.every(name => !name.includes(retiredImage) && !name.startsWith('starfield')), 'No retired photo or derivatives');
}
const css = await text('src/css/style.css');
const forbiddenTreatment = /text-decoration(?:-line)?\s*:[^;}]*\bunderline\b|text-underline|border-radius\s*:\s*(?:999|[2-9]\d{2})px|backdrop-filter/i;
assert.ok(forbiddenTreatment.test('a { text-decoration: underline; }'), 'Style absence check positive control');
assert.ok(!forbiddenTreatment.test(css), 'No link lines, capsules or glass surfaces');
assert.ok(!/\.desktop-nav\s*>\s*a[^{}]*::after/.test(css), 'Navigation has no decorative active rule');
assert.match(css, /\.reaction\s*\{[^}]*border:\s*0;[^}]*background:\s*transparent;/);
assert.doesNotMatch(css, /\.tags li\s*\{[^}]*letter-spacing/);
assert.match(css, /\.feed-width\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*1248px/);
assert.match(css, /@view-transition\s*\{\s*navigation:\s*auto;/);
assert.match(css, /view-transition-name:\s*masthead/);
assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
assert.match(css, /animation:\s*none\s*!important/);
const siteScript = await text('src/js/site.js');
for (const hook of ['observeReveals(card)', 'is-revealed', 'is-closing']) assert.ok(siteScript.includes(hook), `Motion enhancement: ${hook}`);
const transitionScript = await text('src/js/transitions.js');
for (const hook of ['pageswap', 'pagereveal', 'article-photo', 'skipTransition', 'clearAfter']) assert.ok(transitionScript.includes(hook), `Transition enhancement: ${hook}`);
for (const old of ['avatar.jpg','cover.jpg']) assert.equal(await fs.access(path.join(out,'images/brand',old)).then(()=>true,()=>false),false);
const rss = await html('rss.xml'); const sitemap = await html('sitemap.xml');
for (const route of ['/featured/', '/what-is-singularity/', '/about/']) assert.ok(sitemap.includes(`${route}</loc>`));
for(const article of articles) { assert.ok(rss.includes(`/articles/${article.slug}/`));assert.ok(sitemap.includes(`/articles/${article.slug}/`)); }
assert.match(rss,/images\/brand\/apple-touch-icon\.png/);
for (const file of await fs.readdir(out,{recursive:true})) {
  if (!file.endsWith('.html')) continue;
  const page = await html(file);
  assert.match(page, /rel="canonical" href="https?:/);
  assert.match(page, /name="theme-color" content="#0B0C0E"/);
  assert.match(page, /name="twitter:image"/);
  assert.equal((page.match(/as="font"/g)||[]).length,1);
  assert.equal((page.match(/<script[^>]+src="https?:/g)||[]).length,0);
  assert.match(page, /href="\/css\/style\.css\?v=[a-f0-9]{10}"/);
  assert.match(page, /src="\/js\/site\.js\?v=[a-f0-9]{10}"/);
  assert.match(page, /<script src="\/js\/transitions\.js\?v=[a-f0-9]{10}"><\/script>/, 'Transition listener registers before first render');
  assert.match(page, /l\.replace\(t\+l\.pathname\+l\.search\+l\.hash\)/, 'Legacy redirect preserves path, query and fragment');
  assert.match(page, /Kitt Peak at Night/);
  assert.match(page, /KPNO\/NOIRLab\/NSF\/AURA\/P\. Marenfeld/);
  assert.match(page, /https:\/\/creativecommons\.org\/licenses\/by\/4\.0\//);
  assert.ok(!page.includes(retiredImage), `No retired skyline references: ${file}`);
  assert.doesNotMatch(page, /class="kicker"|Explore Singularity Review|From our authors|AI news for people living through the singularity|Stay in the loop|Follow the stories that matter/);
  if (!page.includes('class="hero-image"')) assert.match(page, /property="og:image" content="[^" ]+\/images\/brand\/og-default\.jpg"/);
  assert.ok(page.includes('https://www.facebook.com/profile.php?id=61595278645448'));
  assert.ok(page.includes('https://www.instagram.com/singularityreview/'));
  assert.ok(!page.includes('More from'));
  const hasCarousel = page.includes('data-carousel-track');
  assert.equal(/src="\/js\/carousel\.js\?v=[^"]+" defer/.test(page), hasCarousel);
  if (hasCarousel) {
    assert.match(page, /aria-roledescription="carousel"/);
    assert.equal((page.match(/data-carousel-slide/g)||[]).length, featured.length);
    if (featured.length === 1) assert.ok(!page.includes('data-carousel-controls'));
  }
  const ids = [...page.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `Unique IDs: ${file}`);
  for (const [,url] of page.matchAll(/(?:href|src)="(\/(?!\/)[^"?#]*)/g)) {
    const target=path.join(out,url.endsWith('/') ? `${url}index.html` : url);
    await fs.access(target);
  }
}
const banned = /\b(?:violet|purple|magenta|lavender)\b|#(?:9b5cff|c9a6ff|7b3dff|a76bff|07051a|0e0a2b|120c33)\b|rgba\(\s*(?:155\s*,\s*92\s*,\s*255|88\s*,\s*48\s*,\s*200)/i;
assert.ok(banned.test(String.fromCharCode(118,105,111,108,101,116)), 'Absence check positive control');
const emDash = String.fromCodePoint(0x2014);
assert.ok(emDash.includes(String.fromCodePoint(0x2014)), 'Character check positive control');
async function scan(dir) {
  for (const entry of await fs.readdir(dir,{withFileTypes:true})) {
    if (['node_modules','_site','.git','.firebase','.audit'].includes(entry.name)) continue;
    const file = path.join(dir,entry.name);
    if (entry.isDirectory()) { await scan(file); continue; }
    if (!/\.(?:md|json|js|mjs|njk|css|svg|yml|yaml|html|txt)$/.test(entry.name) && !entry.name.startsWith('.')) continue;
    const value=await fs.readFile(file,'utf8');
    assert.ok(!value.includes(emDash), `Forbidden character: ${file}`);
    assert.ok(!value.includes(String.fromCodePoint(0x2013)), `Forbidden punctuation: ${file}`);
    if (file.startsWith(path.join(root,'src')) || file===path.join(root,'eleventy.config.js')) assert.ok(!banned.test(value), `Forbidden source palette: ${file}`);
  }
}
await scan(root);
console.log(`SITE VERIFIED: ${articles.length} articles (${headlines.length} headlines, ${featured.length} featured), ${totalPages} headline page(s), four-item navigation, all assets and metadata present`);

checkHeroControls(home, css);
