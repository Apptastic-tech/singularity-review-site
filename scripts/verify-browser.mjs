import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

// Use an existing runtime. This script never installs packages or browsers.
const root=process.cwd();
const runtime=path.resolve(process.env.BROWSER_RUNTIME_ROOT || root);
const require=createRequire(path.join(runtime,'package.json'));
let chromium;
try { ({chromium}=require('playwright')); } catch {
  try { ({chromium}=require('@playwright/test')); } catch {
    throw new Error('Browser verification needs an existing Playwright runtime. Set BROWSER_RUNTIME_ROOT to its project directory.');
  }
}
const temp=await fs.mkdtemp(path.join(os.tmpdir(),'singularity-browser-'));
let server, browser;
try {
  await fs.cp(path.join(root,'src'),path.join(temp,'src'),{recursive:true});
  await fs.copyFile(path.join(root,'eleventy.config.js'),path.join(temp,'eleventy.config.js'));
  await fs.copyFile(path.join(root,'package.json'),path.join(temp,'package.json'));
  await fs.symlink(path.join(root,'node_modules'),path.join(temp,'node_modules'),'dir');
  for(let i=0;i<18;i++) {
    const slug=`browser-fixture-${i}`;
    await fs.writeFile(path.join(temp,`src/articles/2026-10-09-${slug}.md`),`---\ntitle: "Browser fixture ${i}"\ndescription: "A story used to verify progressive loading."\ndate: 2026-10-09T${String(23-i).padStart(2,'0')}:00:00Z\ncategory: Agents\nhero: /images/articles/when-the-agents-reach-for-the-open-web.jpg\nheroAlt: "Reference books between server racks"\nauthor: Singularity Review\ntags: ["Fixture"]\n---\nA complete story body for browser verification.\n`);
  }
  const build=spawnSync(process.execPath,[path.join(root,'node_modules/@11ty/eleventy/cmd.cjs')],{cwd:temp,encoding:'utf8',timeout:60000});
  assert.equal(build.status,0,build.stdout+build.stderr);
  const out=path.join(temp,'_site');
  const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.avif':'image/avif','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.xml':'application/xml'};
  server=http.createServer(async(req,res)=>{
    try {
      let file=path.resolve(out,`.${decodeURIComponent(new URL(req.url,'http://localhost').pathname)}`);
      if (!file.startsWith(`${out}${path.sep}`) && file!==out) throw new Error('Invalid path');
      if((await fs.stat(file)).isDirectory()) file=path.join(file,'index.html');
      res.setHeader('Content-Type',types[path.extname(file)]||'text/plain');
      res.end(await fs.readFile(file));
    } catch {res.statusCode=404;res.end('Not found');}
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  const url=`http://127.0.0.1:${server.address().port}`;
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('[data-card]').count(),10);
  const layout=await page.evaluate(()=>({
    overflow:document.documentElement.scrollWidth>innerWidth,
    header:document.querySelector('.header-inner').getBoundingClientRect().height,
    card:document.querySelector('.card').getBoundingClientRect().width,
    title:parseFloat(getComputedStyle(document.querySelector('.card-title')).fontSize),
    floating:getComputedStyle(document.querySelector('.floating-social')).display
  }));
  assert.equal(layout.overflow,false);assert.equal(layout.header,56);assert.equal(layout.card,374);assert.ok(layout.title>=30);assert.equal(layout.floating,'none');
  await page.locator('[data-menu-toggle]').click();
  assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'),'true');
  assert.equal(await page.evaluate(()=>document.querySelector('main').inert),true);
  assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Latest');
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.evaluate(()=>document.activeElement.hasAttribute('data-menu-toggle')),true);
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.evaluate(()=>document.activeElement.textContent.trim()),'RSS');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'),'false');
  assert.equal(await page.evaluate(()=>document.querySelector('main').inert),false);
  await page.locator('[data-menu-toggle]').click();
  await page.setViewportSize({width:1440,height:1000});
  assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'),'false');
  await page.evaluate(()=>document.activeElement.blur());
  await page.evaluate(()=>window.scrollTo(0,800));
  await page.waitForFunction(()=>document.querySelector('[data-header]').classList.contains('is-hidden'));
  await page.evaluate(()=>window.scrollBy(0,-80));
  await page.waitForFunction(()=>!document.querySelector('[data-header]').classList.contains('is-hidden'));
  await fs.mkdir(path.join(root,'.audit/browser-check'),{recursive:true});
  for(const [name,width,height] of [['desktop',1440,1000],['tablet',1024,900],['mobile',390,844]]) {
    await page.setViewportSize({width,height});await page.goto(url);await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.screenshot({path:path.join(root,`.audit/browser-check/${name}.png`),fullPage:true});
  }
  await page.locator('[data-sentinel]').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelectorAll('[data-card]').length===20);
  await page.locator('[data-sentinel]').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelectorAll('[data-card]').length===21);
  assert.equal(await page.locator('[data-load-more]').count(),0);
  const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const fallback=await noJS.newPage();await fallback.goto(url);await fallback.locator('[data-load-more]').click();
  assert.equal(new URL(fallback.url()).pathname,'/page/2/');await noJS.close();
  const noObserver=await browser.newContext();await noObserver.addInitScript(()=>{delete window.IntersectionObserver;});
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
  await page.goto(`${url}/articles/washington-names-an-intelligence-chief/`);
  assert.ok(await page.locator('.prose').evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=18));
  assert.equal(await page.locator('.read-next [data-card]').count(),4);
  assert.deepEqual(errors,[]);
  console.log('BROWSER VERIFIED: responsive feed, accessible menu, scroll header, infinite loading, fallbacks, retry, and reduced motion');
} finally {
  await browser?.close();
  if(server?.listening) await new Promise(resolve=>server.close(resolve));
  await fs.rm(temp,{recursive:true,force:true});
}
