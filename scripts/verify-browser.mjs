import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { localBrowser, routeSite, localOrigin } from './browser-local.mjs';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { publishedArticles } from './verification-helpers.mjs';
import experts from '../src/_data/experts.js';

// Use an existing runtime. This script never installs packages or browsers.
if (process.argv.includes('--static')) {
  await import('./verify-static-pages.mjs');
} else {
const root=process.cwd();
const temp=await fs.mkdtemp(path.join(os.tmpdir(),'singularity-browser-'));
let browser;
try {
  await fs.cp(path.join(root,'src'),path.join(temp,'src'),{recursive:true});
  await fs.copyFile(path.join(root,'eleventy.config.js'),path.join(temp,'eleventy.config.js'));
  await fs.copyFile(path.join(root,'package.json'),path.join(temp,'package.json'));
  await fs.symlink(path.join(root,'node_modules'),path.join(temp,'node_modules'),'dir');
  for(let i=0;i<18;i++) {
    const slug=`browser-fixture-${i}`;
    await fs.writeFile(path.join(temp,`src/articles/2026-10-09-${slug}.md`),`---\ntitle: "Browser fixture ${i}"\ndescription: "A story used to verify progressive loading."\ndate: 2026-10-09T${String(23-i).padStart(2,'0')}:00:00Z\ncategory: Agents\nhero: /images/articles/when-the-agents-reach-for-the-open-web.jpg\nheroAlt: "Reference books between server racks"\nauthor: Singularity Review\ntags: ["Fixture"]\n---\nA complete story body for browser verification.\n`);
  }
  for (let i = 0; i < 4; i++) {
    const slug = `browser-author-${i}`;
    await fs.writeFile(path.join(temp, `src/articles/2026-10-09-${slug}.md`), `---\ntitle: "Author fixture ${i}"\ndescription: "A perspective on AI research."\ndate: 2099-01-01T${String(23-i).padStart(2, '0')}:00:00Z\ncategory: Agents\nhero: /images/articles/when-the-agents-reach-for-the-open-web.jpg\nheroAlt: "Reference books between server racks"\nauthor: Alex Example\n---\nA complete featured article.\n`);
  }
  const articles = await publishedArticles(temp);
  const headlineCount = articles.filter(article => article.section === 'news').length;
  const featuredCount = articles.filter(article => article.section === 'featured').length;
  const build=spawnSync(process.execPath,[path.join(root,'node_modules/@11ty/eleventy/cmd.cjs')],{cwd:temp,encoding:'utf8',timeout:60000});
  assert.equal(build.status,0,build.stdout+build.stderr);
  const out=path.join(temp,'_site');
  const url=localOrigin;
  browser=await localBrowser();
  const context=await browser.newContext({viewport:{width:390,height:844}});
  await routeSite(context,out);
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(() => {
    window.reworkPerformance = { cls: 0, lcp: null };
    if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) new PerformanceObserver(list => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.reworkPerformance.cls += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
    if (PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint')) new PerformanceObserver(list => {
      const entry = list.getEntries().at(-1);
      window.reworkPerformance.lcp = entry.element?.className;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await page.goto(url);
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('[data-card]').count(),10);
  const layout=await page.evaluate(()=>({
    overflow:document.documentElement.scrollWidth>innerWidth,
    header:document.querySelector('.header-inner').getBoundingClientRect().height,
    card:document.querySelector('.card').getBoundingClientRect().width,
    title:parseFloat(getComputedStyle(document.querySelector('.card-title')).fontSize)
  }));
  assert.equal(layout.overflow,false);assert.equal(layout.header,72);assert.equal(layout.card,390);assert.ok(layout.title>=38);
  await page.waitForFunction(() => window.reworkPerformance.lcp !== null);
  assert.equal(await page.evaluate(() => window.reworkPerformance.cls), 0, 'Homepage CLS is zero');
  for (const [width,height] of [[390,844],[768,1024],[1024,768],[1440,900],[1920,1080],[2560,1440]]) {
    await page.setViewportSize({width,height}); await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    const lead=await page.locator('.card--lead .card-title').boundingBox();
    assert.ok(lead.y < (width===390?900:height), `${width}: lead headline begins within the requested fold`);
    const disk=await page.locator('.cover-disk').boundingBox();
    assert.ok(disk.x>=24&&disk.x+disk.width<=width-24,`${width}: complete black hole in frame`);
    assert.equal(await page.locator('main h1').count(),1);
    assert.equal(await page.locator('.hero-statement').evaluate(e=>getComputedStyle(e).textAlign),'center');
    await page.waitForFunction(() => window.reworkPerformance.lcp !== null);
    assert.equal(await page.evaluate(() => window.reworkPerformance.cls),0,`${width}: zero CLS`);
  }
  // Headless Chromium renders WebGL in software, which the lensing guard (1aedfb9) rejects; force the shader so the motion toggle can be exercised.
  await page.setViewportSize({width:390,height:844}); await page.goto(new URL('?lensing=force', url).href);
  await page.locator('[data-motion-toggle]:not([hidden])').waitFor({ timeout: 15000 });
  const masthead = await page.evaluate(() => {
    const brand = document.querySelector('.brand').getBoundingClientRect();
    const toggle = document.querySelector('[data-menu-toggle]').getBoundingClientRect();
    return { left: brand.x, toggleWidth: toggle.width, toggleHeight: toggle.height };
  });
  assert.equal(masthead.left, 20, 'Wordmark is left aligned in the compact masthead');
  assert.ok(masthead.toggleWidth >= 44 && masthead.toggleHeight >= 44, 'Menu hit area');
  const coverHeight = await page.locator('.night-cover').evaluate(el => el.getBoundingClientRect().height);
  await page.locator('[data-motion-toggle]').click();
  assert.equal(await page.locator('[data-motion-toggle]').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('[data-motion-toggle]').getAttribute('aria-label'), 'Play sky animation');
  assert.equal(await page.locator('[data-motion-toggle]').textContent(), '');
  assert.equal(await page.locator('.cover-disk').evaluate(el => getComputedStyle(el).animationName), 'none');
  assert.equal(await page.locator('.night-cover').evaluate(el => el.getBoundingClientRect().height), coverHeight);
  await page.locator('[data-motion-toggle]').click();
  await page.locator('[data-menu-toggle]').click();
  assert.ok(await page.locator('.menu-links a').first().evaluate(el => parseFloat(getComputedStyle(el).fontSize) >= 32));
  assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'),'true');
  assert.equal(await page.evaluate(()=>document.querySelector('main').inert),true);
  assert.equal(await page.evaluate(()=>document.activeElement.textContent),'News');
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.evaluate(()=>document.activeElement.hasAttribute('data-menu-toggle')),true);
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.evaluate(()=>document.activeElement.textContent.trim()),'About');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'),'false');
  await page.waitForFunction(() => !document.querySelector('main').inert);
  assert.equal(await page.evaluate(()=>document.querySelector('main').inert),false);
  assert.equal(await page.evaluate(() => document.body.style.position), '');
  await page.locator('[data-menu-toggle]').click();
  assert.equal(await page.evaluate(() => document.body.style.position), 'fixed');
  await page.setViewportSize({width:1440,height:1000});
  await page.waitForFunction(() => document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded') === 'false');
  assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'),'false');
  await page.evaluate(()=>document.activeElement.blur());
  await page.evaluate(()=>window.scrollTo(0,800));
  await page.waitForFunction(()=>document.querySelector('[data-header]').classList.contains('is-hidden'));
  await page.evaluate(()=>window.scrollBy(0,-80));
  await page.waitForFunction(()=>!document.querySelector('[data-header]').classList.contains('is-hidden'));
  await fs.mkdir(path.join(root,'.audit/browser-check'),{recursive:true});
  for(const [name,width,height] of [['mobile',390,844],['tablet',1024,900],['desktop',1440,1000]]) {
    await page.setViewportSize({width,height});await page.goto(url);await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.screenshot({path:path.join(root,`.audit/browser-check/${name}.png`),fullPage:true});
  }
  await page.locator('[data-sentinel]').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelectorAll('[data-card]').length===20);
  await page.locator('[data-sentinel]').scrollIntoViewIfNeeded();
  await page.waitForFunction(expected=>document.querySelectorAll('[data-card]').length===expected, headlineCount);
  assert.equal(await page.locator('[data-load-more]').count(),0);
  assert.equal(await page.locator('.desktop-nav a').count(), 4);
  assert.equal(await page.locator('.desktop-nav [aria-current]').textContent(), 'News');
  const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  await routeSite(noJS,out);
  const fallback=await noJS.newPage();await fallback.goto(url);
  assert.ok(await fallback.locator('.card-image').first().isVisible());
  assert.equal(await fallback.locator('[data-motion-toggle]').isVisible(), false);
  await fallback.locator('[data-load-more]').click();
  assert.equal(new URL(fallback.url()).pathname,'/page/2/');await noJS.close();
  const noObserver=await browser.newContext();await noObserver.addInitScript(()=>{delete window.IntersectionObserver;});
  await routeSite(noObserver,out);
  const basic=await noObserver.newPage();await basic.goto(url);await basic.locator('[data-load-more]').click();
  assert.equal(new URL(basic.url()).pathname,'/page/2/');await noObserver.close();
  await page.goto(url);
  await page.route('**/page/2/',route=>route.fulfill({status:503,body:'Unavailable'}));
  await page.locator('[data-sentinel]').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('[data-load-status]').textContent.includes('Could not load'));
  assert.match(await page.locator('[data-load-more]').getAttribute('href'),/\/page\/2\/$/);
  assert.equal(await page.locator('[data-load-more]').getAttribute('aria-disabled'),null);
  await page.unroute('**/page/2/');
  await page.locator('[data-load-more]').click();await page.waitForFunction(()=>document.querySelectorAll('[data-card]').length>=20);
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url);
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollSnapType),'none');
  assert.equal(await page.locator('[data-header]').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
  assert.equal(await page.locator('.cover-sky-image').evaluate(el => getComputedStyle(el).animationName), 'none');
  assert.equal(await page.locator('[data-motion-toggle]').isVisible(), false);
  assert.ok(await page.locator('[data-reveal]').first().evaluate(el => Number(getComputedStyle(el).opacity) === 1));
  // Carousel timing uses the browser clock, without wall-clock sleeps.
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(`${url}/featured/`);
  assert.equal(await page.locator('[data-carousel-slide]').count(), featuredCount);
  await page.locator('[data-carousel-track]').focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => {
    const track = document.querySelector('[data-carousel-track]');
    const slides = track.querySelectorAll('[data-carousel-slide]');
    const step = slides[1].getBoundingClientRect().left - slides[0].getBoundingClientRect().left;
    return Math.abs(track.scrollLeft - step) < 5;
  });
  await page.locator('[data-carousel-prev]').click();
  await page.waitForFunction(() => document.querySelector('[data-carousel-track]').scrollLeft < 2);
  await page.locator('[data-carousel-play]').click();
  assert.equal(await page.locator('[data-carousel-play]').textContent(), 'Play auto-advance');
  await page.evaluate(() => document.activeElement.blur());
  await page.mouse.move(0, 0);
  await page.clock.install();
  await page.clock.runFor(32);
  await page.clock.fastForward(6000);
  assert.equal(await page.locator('[data-carousel-track]').evaluate(el => el.scrollLeft), 0);
  await page.locator('[data-carousel-play]').click();
  await page.evaluate(() => document.activeElement.blur());
  await page.mouse.move(0, 0);
  await page.clock.runFor(32);
  await page.clock.fastForward(6000);
  await page.clock.runFor(1000);
  // Native smooth scrolling follows compositor time, independently of the mock clock.
  await page.waitForFunction(() => {
    const track = document.querySelector('[data-carousel-track]');
    const slides = track.querySelectorAll('[data-carousel-slide]');
    const step = slides[1].getBoundingClientRect().left - slides[0].getBoundingClientRect().left;
    return Math.abs(track.scrollLeft - step) < 5;
  });
  assert.ok(await page.locator('[data-carousel-track]').evaluate(el => el.scrollLeft) > 10);
  await page.locator('[data-carousel-track]').focus();
  let held = await page.locator('[data-carousel-track]').evaluate(el => el.scrollLeft);
  await page.clock.fastForward(6000);
  assert.equal(await page.locator('[data-carousel-track]').evaluate(el => el.scrollLeft), held);
  await page.evaluate(() => document.activeElement.blur());
  await page.locator('[data-carousel-track]').hover();
  held = await page.locator('[data-carousel-track]').evaluate(el => el.scrollLeft);
  await page.clock.fastForward(6000);
  assert.equal(await page.locator('[data-carousel-track]').evaluate(el => el.scrollLeft), held);
  await page.mouse.move(0, 0);
  await page.evaluate(() => document.querySelector('[data-carousel-track]').dispatchEvent(new PointerEvent('pointerdown', {bubbles:true, pointerType:'touch'})));
  held = await page.locator('[data-carousel-track]').evaluate(el => el.scrollLeft);
  await page.clock.fastForward(6000);
  assert.equal(await page.locator('[data-carousel-track]').evaluate(el => el.scrollLeft), held);
  await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointerup', {pointerType:'touch'})));
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', {configurable:true, value:true});
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.fastForward(6000);
  assert.equal(await page.locator('[data-carousel-track]').evaluate(el => el.scrollLeft), held);
  await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(() => document.querySelector('[data-carousel-play]').textContent === 'Auto-advance off');
  assert.equal(await page.locator('[data-carousel-play]').textContent(), 'Auto-advance off');
  held = await page.locator('[data-carousel-track]').evaluate(el => el.scrollLeft);
  await page.clock.fastForward(6000);
  assert.equal(await page.locator('[data-carousel-track]').evaluate(el => el.scrollLeft), held);
  await page.locator('[data-carousel-next]').click();
  assert.notEqual(await page.locator('[data-carousel-track]').evaluate(el => el.scrollLeft), held);
  await page.clock.resume();

  for (const route of ['/featured/', '/what-is-singularity/', '/about/']) {
    for (const [name,width,height] of [['mobile',390,844],['tablet',1024,900],['desktop',1440,1000]]) {
      await page.setViewportSize({width,height}); await page.goto(`${url}${route}`); await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route} ${name}`);
      const headerGap = await page.evaluate(() => {
        const header = document.querySelector('.site-header').getBoundingClientRect();
        const heading = document.querySelector('main h1').getBoundingClientRect();
        const active = document.querySelector('.desktop-nav [aria-current]');
        return {
          gap: heading.top - header.bottom,
          activeDecoration: getComputedStyle(active).textDecorationLine,
          activeWeight: Number(getComputedStyle(active).fontWeight),
          activeAfter: getComputedStyle(active, '::after').content,
          navSize: parseFloat(getComputedStyle(active).fontSize)
        };
      });
      assert.ok(headerGap.gap >= (width >= 960 ? 36 : 20), `${route} ${name}: breathing room below masthead`);
      if (width >= 960) {
        assert.equal(headerGap.activeDecoration, 'none');
        assert.ok(['none', 'normal'].includes(headerGap.activeAfter), 'Current destination has no decorative rule');
        assert.equal(headerGap.activeWeight, 400, 'Navigation keeps the same regular weight');
        assert.equal(headerGap.navSize, 16, 'Short destination labels fit the single masthead row');
        assert.equal(await page.locator('.site-header').evaluate(el => el.getBoundingClientRect().height), 72);
        assert.equal(await page.locator('.site-header img').count(), 1); assert.equal(await page.locator('.site-header img.masthead-mark').count(), 1);
      }
      if (route === '/featured/') assert.equal(await page.locator('.shelf-heading h2').textContent(), 'Featured');
      if (route === '/what-is-singularity/' && experts.length) {
        const portraits = await page.locator('.expert-photo').evaluateAll(elements => elements.map(element => ({
          width: element.getBoundingClientRect().width,
          height: element.getBoundingClientRect().height,
          position: element.style.objectPosition
        })));
        assert.equal(portraits.length, experts.filter(expert => expert.photo).length);
        for (const [index, portrait] of portraits.entries()) {
          assert.equal(portrait.width, width >= 960 ? 104 : 96);
          assert.equal(portrait.height, portrait.width * 1.25);
          if (experts.filter(expert => expert.photo)[index].photo) assert.equal(portrait.position, experts.filter(expert => expert.photo)[index].photoPosition || 'center 25%');
        }
        const columns = await page.locator('.expert-grid').evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length);
        assert.equal(columns, width >= 960 ? 2 : 1);
        assert.equal(await page.locator('.explainer .photo-credit a').count(), experts.filter(expert => expert.photo && expert.credit).length * 3);
        assert.equal(await page.locator('.expert-photo--initials').count(), 0);
      }
      // Artifact only: very tall pages exceed the software renderer's capture limit, so fall back to the viewport.
      const shotPath = path.join(root, `.audit/browser-check/${route.split('/')[1]}-${name}.png`);
      await page.screenshot({path:shotPath,fullPage:true}).catch(() => page.screenshot({path:shotPath}));
    }
  }
  await page.goto(`${url}/articles/washington-names-an-intelligence-chief/`);
  assert.ok(await page.locator('.prose').evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=18));
  assert.equal(await page.locator('.read-next [data-card]').count(),4);
  assert.deepEqual(errors,[]);
  console.log('BROWSER VERIFIED: responsive feed, accessible menu, scroll header, infinite loading, fallbacks, retry, carousel controls and timing, new pages, and reduced motion');
} finally {
  await browser?.close();
  await fs.rm(temp,{recursive:true,force:true});
}
}
