// Owner-run browser verification only. Prepared but not executed in the stage-only task.
import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(path.join(process.env.BROWSER_RUNTIME_ROOT || '/Users/araratovsepian/Agent-RSOC-Platform/Agent-RSOC-Platform/investor-deck', 'package.json'));
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8770';
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, reducedMotion: 'reduce' });
    const google = [];
    await context.route('**/*', route => {
      const hostname = new URL(route.request().url()).hostname;
      if (/googlesyndication|doubleclick|googleadservices/.test(hostname)) { google.push(route.request().url()); return route.abort(); }
      return route.continue();
    });
    await context.addInitScript(() => {
      window.adCLS = 0;
      if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) new PerformanceObserver(entries => {
        for (const entry of entries.getEntries()) if (!entry.hadRecentInput) window.adCLS += entry.value;
      }).observe({ type: 'layout-shift', buffered: true });
    });
    const page = await context.newPage();
    await page.goto(base); await page.evaluate(() => document.fonts.ready);
    const home = page.locator('[data-ad-slot="homeGrid"]'); assert.equal(await home.count(), 1);
    assert.equal(await home.getAttribute('data-ad-preview'), 'true', 'Requires ADSENSE_PREVIEW=1 build');
    assert.equal(await home.locator('.ad-slot-reserved').evaluate(node => node.getBoundingClientRect().height), 250);
    assert.equal(google.length, 0, 'No Google requests before consent');
    await page.locator('[data-consent-choice="reject"]').first().click();
    await home.scrollIntoViewIfNeeded(); await page.waitForTimeout(1000);
    assert.equal(await page.evaluate(() => window.adCLS), 0, width + ': homepage CLS zero');
    assert.equal(google.length, 0, 'Preview requests nothing after reject');
    const article = await page.locator('.card--lead .card-link').getAttribute('href');
    await page.goto(new URL(article, base).href); await page.evaluate(() => document.fonts.ready);
    const slots = page.locator('.article-body [data-ad-slot]'); assert.ok(await slots.count() > 0);
    const before = await slots.locator('.ad-slot-reserved').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().height));
    assert.ok(before.every(height => height === (width < 640 ? 280 : 250)));
    await page.locator('.footer-legal [data-consent-open]').click();
    await page.locator('.consent-dialog [data-consent-choice="accept"]').click();
    for (const slot of await slots.all()) { await slot.scrollIntoViewIfNeeded(); await page.waitForTimeout(100); }
    await page.waitForTimeout(1000);
    assert.deepEqual(await slots.locator('.ad-slot-reserved').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().height)), before);
    assert.equal(await page.evaluate(() => window.adCLS), 0, width + ': article CLS zero');
    assert.equal(google.length, 0, 'Preview requests nothing after accept or saved decisions');
    assert.equal(await page.locator('ins.adsbygoogle').count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await context.close();
  }
  console.log('ADS BROWSER VERIFIED: preview CLS zero, reserved heights stable and no Google requests before or after choices at 1440 and 390.');
} finally { await browser.close(); }
