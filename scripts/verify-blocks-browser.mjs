import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
// Owner-run only. Verify headline post cards and rows, plus the approved story blocks.
// Run: node scripts/verify-blocks-browser.mjs http://localhost:8770
const require = createRequire(path.join(process.env.BROWSER_RUNTIME_ROOT || '/Users/araratovsepian/Agent-RSOC-Platform/Agent-RSOC-Platform/investor-deck', 'package.json'));
const { chromium } = require('playwright');
const base = new URL(process.argv[2] || 'http://localhost:8770');
const files = (await fs.readdir('_site', { recursive: true })).filter(file => file.endsWith('/index.html') && /^(?:featured|category|authors|articles|page)\//.test(file));
const routes = ['/', ...files.map(file => '/' + file.slice(0, -'index.html'.length))];
const browser = await chromium.launch({ headless: true });
const reports = [];
const setup = async options => {
  const context = await browser.newContext({ reducedMotion: 'reduce', ...options });
  await context.route('**/*', route => new URL(route.request().url()).origin === base.origin ? route.continue() : route.abort());
  await context.addInitScript(() => {
    localStorage.setItem('sr-consent', JSON.stringify({ version:'2026-10-10', necessary:true, analytics:false, marketing:false, decidedAt:new Date().toISOString() }));
    localStorage.setItem('sr-newsletter', JSON.stringify({state:'dismissed',at:new Date().toISOString()}));
    window.rowCLS = 0;
    if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.rowCLS += entry.value; }).observe({type:'layout-shift',buffered:true});
  });
  return context;
};
try {
  for (const [width,height,columns] of [[320,844,1],[390,844,1],[639,844,1],[768,1024,2],[1024,900,3],[1440,900,3],[1920,1080,3]]) {
    const context = await setup({ viewport:{width,height}, hasTouch:width < 640, isMobile:width < 640 });
    const page = await context.newPage(), errors = [];
    page.on('pageerror',error => errors.push(error.message));
    for (const route of routes) {
      await page.goto(new URL(route,base).href,{waitUntil:'load'}); await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => {
        const rect = element => { const r=element.getBoundingClientRect(); return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}; };
        const cards=[...document.querySelectorAll('.post-card')].map(card => ({box:rect(card),media:rect(card.querySelector('.post-card-media')),meta:rect(card.querySelector('.post-card-meta')),title:rect(card.querySelector('.post-card-title')),excerpt:rect(card.querySelector('.post-card-excerpt')),category:rect(card.querySelector('.post-card-category')),date:rect(card.querySelector('time')),radius:getComputedStyle(card).borderRadius,headline:getComputedStyle(card.querySelector('.post-card-title')).fontWeight}));
        const stories=[...document.querySelectorAll('.story-block')].map(card=>({box:rect(card),media:rect(card.querySelector('.story-block-media')),category:rect(card.querySelector('.story-block-category')),title:rect(card.querySelector('.story-block-title')),excerpt:rect(card.querySelector('.story-block-dek')),date:rect(card.querySelector('time')),radius:getComputedStyle(card).borderRadius,headline:getComputedStyle(card.querySelector('.story-block-title')).fontWeight,font:getComputedStyle(card.querySelector('.story-block-title')).fontFamily,transform:getComputedStyle(card.querySelector('.story-block-category')).textTransform}));
        const grid=document.querySelector('.post-grid,.story-grid');
        return {cards,stories,grid:grid ? {box:rect(grid),columns:getComputedStyle(grid).gridTemplateColumns.split(' ').length,gap:getComputedStyle(grid).gap} : null,overflow:document.documentElement.scrollWidth>innerWidth};
      });
      assert.equal(layout.overflow,false,route+' '+width+': no page overflow');
      const headers = await page.locator('.card-row-header,.shelf-heading').evaluateAll(elements => elements.map(element => {
        const heading = element.querySelector('h2'), style = getComputedStyle(heading);
        return { height:element.getBoundingClientRect().height, visible:!heading.classList.contains('sr-only'), headingHeight:heading.getBoundingClientRect().height, lineHeight:parseFloat(style.lineHeight), nowrap:style.whiteSpace, fits:heading.scrollWidth<=heading.clientWidth+1 };
      }));
      for (const header of headers) {
        assert.equal(header.height,44,route+' '+width+': header has one reserved control line');
        if (header.visible) {
          assert.equal(header.nowrap,'nowrap');
          assert.ok(Math.abs(header.headingHeight-header.lineHeight)<1,'Heading keeps a single line box');
          if (width<640) assert.ok(header.fits,'Both approved mobile headings fit without ellipsis');
        }
      }
      const headlineRoute=route==='/' || route.startsWith('/page/');
      if(headlineRoute)assert.equal(layout.stories.length,0,'Headline routes use post cards');
      else {assert.equal(layout.cards.length,0,'Featured, author, category and read-next use story blocks');assert.equal(await page.locator('.card-row').count(),0);}
      for(const story of layout.stories) {
        assert.ok(Math.abs(story.media.width/story.media.height-3/2)<.01);
        assert.equal(story.radius,width<640?'0px':'6px');assert.equal(story.headline,'500');assert.match(story.font,/Newsreader/);assert.equal(story.transform,'none');
        assert.ok(story.category.top>=story.media.bottom && story.title.top>=story.category.bottom-.5 && story.excerpt.top>=story.title.bottom-.5 && story.date.top>=story.excerpt.bottom-.5);
      }
      if (layout.grid) { assert.equal(layout.grid.columns,columns); assert.equal(layout.grid.gap,'32px 24px'); assert.ok(layout.grid.box.width<=1248 && layout.grid.box.left>=19); }
      for (const card of layout.cards) {
        assert.ok(Math.abs(card.media.width/card.media.height-16/9)<.01);
        assert.equal(card.radius,'24px'); assert.equal(card.headline,'700');
        assert.ok(card.meta.top>=card.media.bottom-.5 && card.title.top>=card.meta.bottom-.5 && card.excerpt.top>=card.title.bottom-.5);
        assert.ok(Math.abs(card.category.top-card.date.top)<8,'Category and date share one metadata line');
        assert.ok(Math.abs(card.category.left-card.meta.left)<1,'Category starts at the metadata left edge');
        assert.ok(Math.abs(card.date.left-card.category.right-10)<1,'Date immediately follows category with a 10px gap');
        for (const text of [card.meta,card.title,card.excerpt]) assert.ok(text.left>=card.box.left && text.right<=card.box.right+.5);
      }
      if (layout.grid) {
        const items=layout.cards.length?layout.cards:layout.stories;
        for (let i=0;i<items.length;i+=columns) {
          const row=items.slice(i,i+columns);
          for (const card of row) { assert.ok(Math.abs(card.box.top-row[0].box.top)<1); assert.ok(Math.abs(card.box.bottom-row[0].box.bottom)<1); }
        }
      }
      const track=page.locator('[data-row-track]');
      if (await track.count()) {
        await track.scrollIntoViewIfNeeded();
        const geometry=await track.evaluate(element => ({width:element.clientWidth,total:element.scrollWidth,step:element.querySelector('li').getBoundingClientRect().width+24,snap:getComputedStyle(element).scrollSnapType,align:getComputedStyle(element.querySelector('li')).scrollSnapAlign,tabindex:element.tabIndex,heights:[...element.querySelectorAll('.post-card')].map(card=>card.getBoundingClientRect().height)}));
        assert.equal(geometry.snap,'x mandatory'); assert.equal(geometry.align,'start'); assert.equal(geometry.tabindex,0);
        assert.ok(geometry.heights.every(h=>Math.abs(h-geometry.heights[0])<1),'Row cards have equal heights');
        const end=Math.max(0,geometry.total-geometry.width), previous=page.locator('[data-row-prev]'), next=page.locator('[data-row-next]');
        assert.equal(await page.locator('[data-row-arrows]').isVisible(),width>=640,'CSS owns arrow visibility, independent of overflow');
        if (end>1) {
          assert.equal(await previous.isDisabled(),true);
          if (width===1440) {
            assert.equal(await next.isVisible(),true); await next.click();
            await page.waitForFunction(expected => Math.abs(document.querySelector('[data-row-track]').scrollLeft-expected)<3,Math.min(end,geometry.step));
            assert.equal(await previous.isDisabled(),false);
          }
          await track.evaluate(element=>element.scrollTo({left:0,behavior:'instant'}));
          await track.focus(); await page.keyboard.press('ArrowRight');
          await page.waitForFunction(expected => Math.abs(document.querySelector('[data-row-track]').scrollLeft-expected)<3,Math.min(end,geometry.step));
          await track.evaluate(element=>element.scrollTo({left:element.scrollWidth,behavior:'instant'}));
          await page.waitForFunction(()=>document.querySelector('[data-row-next]').disabled);
          assert.equal(await next.isDisabled(),true);
          await track.evaluate(element=>element.scrollTo({left:0,behavior:'instant'}));
          await page.waitForFunction(()=>document.querySelector('[data-row-prev]').disabled);
          if (width===390) {
            assert.equal(await next.isVisible(),false,'Touch devices hide arrows');
            const peek=await track.evaluate(element=>{const cards=element.querySelectorAll('li');const a=cards[0].getBoundingClientRect(),b=cards[1].getBoundingClientRect();return {first:a.left,firstWidth:a.width,next:b.left,nextRight:b.right};});
            assert.ok(Math.abs(peek.first-20)<1); assert.ok(Math.abs(peek.firstWidth-width*.84)<1);
            assert.ok(peek.next<width && peek.nextRight>width,'Next card peeks at the mobile edge');
            const box=await track.boundingBox(), y=Math.max(80,Math.min(height-40,box.y+80));
            const cdp=await context.newCDPSession(page);
            await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:310,y}]});
            for (const x of [280,240,200,160,120,80]) await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y}]});
            await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
            await page.waitForFunction(()=>document.querySelector('[data-row-track]').scrollLeft>10);
            await page.waitForTimeout(800);
            const snapped=await track.evaluate(element=>element.scrollLeft);
            assert.ok(Math.abs(snapped-end)<3 || Math.abs(snapped/geometry.step-Math.round(snapped/geometry.step))<.02,'Touch swipe settles on a snap or the row end');
            await cdp.detach();
          }
          const last=track.locator('.post-card-link').last(); await last.focus();
          await page.waitForFunction(()=>{const element=document.activeElement,track=element.closest('[data-row-track]');const a=element.getBoundingClientRect(),b=track.getBoundingClientRect();return a.left>=b.left && a.right<=b.right;});
          assert.ok(await track.evaluate(element=>element.scrollLeft)>0,'Focusing a card brings it into view');
        } else {
          assert.equal(await previous.isDisabled(),true,'No-overflow rows retain disabled previous arrows');
          assert.equal(await next.isDisabled(),true,'No-overflow rows retain disabled next arrows');
        }
        await track.focus(); await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('post-card-link')),true);
        assert.equal(await page.evaluate(()=>getComputedStyle(document.activeElement,'::after').outlineStyle),'solid','Keyboard focus ring is visible');
      }
      assert.equal(await page.evaluate(()=>window.rowCLS),0,route+' '+width+': CLS zero');
      reports.push({route,width,cards:layout.cards.length,stories:layout.stories.length,columns:layout.grid?.columns||null});
    }
    assert.deepEqual(errors,[]); await context.close();
  }
  // Force the browser's native fallback fonts on cold loads across the same widths.
  for (const width of [320,390,639,768,1024,1440,1920]) {
    const context=await setup({viewport:{width,height:900},hasTouch:width<640,isMobile:width<640});
    await context.route('**/fonts/*.woff2',route=>route.abort());
    const page=await context.newPage();
    await page.goto(base.href,{waitUntil:'load'});
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(300);
    const headers=await page.locator('.card-row-header,.shelf-heading').evaluateAll(elements=>elements.map(element=>{
      const heading=element.querySelector('h2');
      return {height:element.getBoundingClientRect().height,fits:heading.scrollWidth<=heading.clientWidth+1,headingHeight:heading.getBoundingClientRect().height,lineHeight:parseFloat(getComputedStyle(heading).lineHeight)};
    }));
    for (const header of headers) {
      assert.equal(header.height,44,width+': fallback font preserves header geometry');
      assert.ok(Math.abs(header.headingHeight-header.lineHeight)<1,'Fallback heading stays on one line');
      if(width<640)assert.ok(header.fits,'Fallback font fits both approved mobile headings');
    }
    assert.equal(await page.evaluate(()=>window.rowCLS),0,width+': fallback-font CLS zero');
    await context.close();
  }
  const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  await noJS.route('**/*',route=>new URL(route.request().url()).origin===base.origin?route.continue():route.abort());
  const page=await noJS.newPage(); await page.goto(base.href);
  assert.ok(await page.locator('.post-card').first().isVisible());
  const fallback=page.locator('.card-row-all');
  if (await fallback.count()) { await fallback.click(); assert.equal(new URL(page.url()).pathname,'/page/2/'); assert.ok(await page.locator('.post-grid > .post-card').count()>0); }
  await noJS.close();
  console.log('BROWSER CARDS VERIFIED:',JSON.stringify(reports));
} finally { await browser.close(); }
