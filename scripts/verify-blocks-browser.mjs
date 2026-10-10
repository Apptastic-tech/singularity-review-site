import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

// Owner-run only. No package installation, screenshots or external-origin requests.
// Run: node scripts/verify-blocks-browser.mjs http://localhost:8770
const require = createRequire('/Users/araratovsepian/Agent-RSOC-Platform/Agent-RSOC-Platform/investor-deck/node_modules/story-block-verifier.cjs');
const { chromium } = require('playwright');
const base = new URL(process.argv[2] || 'http://localhost:8770');
assert.ok(['http:', 'https:'].includes(base.protocol), 'Supply an HTTP base URL');
const browser = await chromium.launch({ headless: true });
const matrix = [[1440, 900, 3], [768, 1024, 2], [390, 844, 1]];
const reports = [];
try {
  const context = await browser.newContext({ reducedMotion: 'reduce', deviceScaleFactor: 1 });
  await context.route('**/*', route => new URL(route.request().url()).origin === base.origin ? route.continue() : route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const routes = new Set(['/']);
  // Collect the actual archives and pagination routes from generated links.
  for (const route of ['/', '/featured/']) {
    await page.goto(new URL(route, base).href, { waitUntil: 'load' });
    const discovered = await page.locator('a[href]').evaluateAll(links => links.map(link => new URL(link.href).pathname).filter(path => /^\/(?:category|authors|page)\//.test(path)));
    discovered.forEach(path => routes.add(path));
    if (await page.locator('.story-grid').count()) routes.add(route);
  }
  // Follow the page links so pages 3 and onward are checked too, when published.
  for (const route of routes) {
    if (!route.startsWith('/page/')) continue;
    await page.goto(new URL(route, base).href, { waitUntil: 'load' });
    const pages = await page.locator('.pagination a[href]').evaluateAll(links => links.map(link => new URL(link.href).pathname).filter(path => path.startsWith('/page/')));
    pages.forEach(path => routes.add(path));
  }
  for (const [width, height, columns] of matrix) {
    await page.setViewportSize({ width, height });
    for (const route of routes) {
      await page.goto(new URL(route, base).href, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => {
        const rect = element => {
          const box = element.getBoundingClientRect();
          return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height };
        };
        const grid = document.querySelector('.story-grid');
        if (!grid) return null;
        const blocks = [...grid.querySelectorAll(':scope > .story-block')].map(block => ({
          box: rect(block),
          media: rect(block.querySelector('.story-block-media')),
          image: rect(block.querySelector('img')),
          text: [...block.querySelectorAll('.story-block-category, .story-block-title, .story-block-dek, .story-block-date')].map(element => ({ name: element.className, ...rect(element) }))
        }));
        const style = getComputedStyle(grid);
        return {
          grid: rect(grid), columns: style.gridTemplateColumns.trim().split(/\s+/).length,
          columnGap: parseFloat(style.columnGap), rowGap: parseFloat(style.rowGap), blocks,
          carousel: document.querySelector('[data-carousel]') ? rect(document.querySelector('[data-carousel]')) : null,
          overflow: document.documentElement.scrollWidth > innerWidth
        };
      });
      if (!layout) {
        assert.equal(route, '/', 'Only an empty homepage can omit its story grid');
        continue;
      }
      const label = `${route} at ${width}px`;
      assert.equal(layout.columns, columns, `${label}: grid columns`);
      assert.equal(layout.columnGap, 24, `${label}: column gap`);
      assert.equal(layout.rowGap, 32, `${label}: row gap`);
      assert.equal(layout.overflow, false, `${label}: no horizontal page overflow`);
      assert.ok(layout.grid.width <= 1248 && layout.grid.left >= -.5 && layout.grid.right <= width + .5, `${label}: feed width fits`);
      const overlaps = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > .5 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > .5;
      const blocks = layout.blocks;
      for (let start = 0; start < blocks.length; start += columns) {
        const row = blocks.slice(start, start + columns);
        row.forEach((block, index) => {
          assert.ok(Math.abs(block.box.top - row[0].box.top) <= 1, `${label}: row tops align`);
          assert.ok(Math.abs(block.box.bottom - row[0].box.bottom) <= 1, `${label}: row heights align`);
          const date = block.text.find(text => text.name === 'story-block-date');
          const firstDate = row[0].text.find(text => text.name === 'story-block-date');
          assert.ok(Math.abs(date.bottom - firstDate.bottom) <= 1, `${label}: row dates align`);
          if (index) assert.ok(Math.abs(block.box.left - row[index - 1].box.right - 24) <= 1, `${label}: row gap aligns`);
        });
        if (start >= columns) assert.ok(Math.abs(row[0].box.top - blocks[start - columns].box.bottom - 32) <= 1, `${label}: rows have the specified gap`);
      }
      blocks.forEach((block, index) => {
        assert.ok(Math.abs(block.media.width / block.media.height - 1.5) <= .01, `${label}: 3:2 image slot`);
        for (const text of block.text) {
          assert.ok(text.top >= block.media.bottom - .5, `${label}: ${text.name} sits below the image`);
          assert.ok(!overlaps(text, block.image), `${label}: text never overlays imagery`);
          assert.ok(text.left >= block.box.left - .5 && text.right <= block.box.right + .5, `${label}: text stays inside its panel`);
        }
        for (const other of blocks.slice(index + 1)) assert.ok(!overlaps(block.box, other.box), `${label}: blocks never overlap`);
        if (layout.carousel) assert.ok(!overlaps(block.box, layout.carousel), `${label}: blocks never overlap the carousel`);
        if (width === 390) {
          for (const box of [block.box, block.media, block.image]) {
            assert.ok(Math.abs(box.left) <= .5 && Math.abs(box.right - 390) <= .5, `${label}: mobile image and block span 0 to 390`);
          }
        }
      });
      if (layout.carousel) assert.ok(layout.grid.top >= layout.carousel.bottom - .5, `${label}: grid follows the carousel`);
      reports.push({ route, width, columns: layout.columns, blocks: blocks.length });
    }
  }
  assert.deepEqual(errors, [], 'No page script errors');
  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await noJS.route('**/*', route => new URL(route.request().url()).origin === base.origin ? route.continue() : route.abort());
  const fallback = await noJS.newPage();
  await fallback.goto(new URL('/', base).href, { waitUntil: 'load' });
  if (await fallback.locator('.story-block').count()) {
    assert.ok(await fallback.locator('.story-block').first().isVisible(), 'Blocks stay visible without JavaScript');
    const image = await fallback.locator('.story-block img').first().boundingBox();
    assert.ok(Math.abs(image.x) <= .5 && Math.abs(image.width - 390) <= .5, 'No-JS mobile imagery fills the viewport');
  }
  if (await fallback.locator('[data-load-more]').count()) {
    const target = await fallback.locator('[data-load-more]').getAttribute('href');
    await fallback.locator('[data-load-more]').click();
    assert.equal(new URL(fallback.url()).pathname, new URL(target, base).pathname, 'No-JS pagination follows the real page link');
    assert.equal(await fallback.locator('.card--lead').count(), 0, 'Pagination has no lead');
    assert.ok(await fallback.locator('.story-grid > .story-block').count() > 0, 'Pagination still has blocks without JavaScript');
  }
  await noJS.close();
  console.log('BROWSER BLOCKS VERIFIED:', JSON.stringify(reports));
} finally {
  await browser.close();
}
