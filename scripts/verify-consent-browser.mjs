import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

// Owner-run only. Never run this in a browser-prohibited task.
// node scripts/verify-consent-browser.mjs http://localhost:8770
// All requests are intercepted; no server, external network or screenshots are used.
const require = createRequire('/Users/araratovsepian/Agent-RSOC-Platform/Agent-RSOC-Platform/investor-deck/package.json');
const { chromium } = require('playwright');
const base = new URL(process.argv[2] || 'http://localhost:8770');
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(base.hostname), 'Use a localhost origin for the test timer override');
const output = path.resolve('_site');
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'application/xml' };
const fieldSet = ['email', 'consentAt', 'consentTextVersion', 'consentText', 'sourcePage', 'source', 'status'].sort();
const sentence = 'Send me the Singularity Review newsletter. Unsubscribe anytime.';
const successText = "Thanks. We'll email you to confirm your subscription before sending anything.";
const decision = { version: '2026-10-10', necessary: true, analytics: false, marketing: false, decidedAt: '2026-10-10T12:00:00.000Z' };
const browser = await chromium.launch({ headless: true });
const contexts = [];
async function setup({ viewport = { width: 1440, height: 1000 }, seed = {}, javaScriptEnabled = true, reducedMotion = 'reduce' } = {}) {
  const context = await browser.newContext({ viewport, javaScriptEnabled, reducedMotion, serviceWorkers: 'block' });
  contexts.push(context);
  const requests = [], results = [];
  await context.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.origin === 'https://firestore.googleapis.com') {
      if (request.method() === 'POST') {
        const body = request.postDataJSON();
        if (body.writes?.[0]?.update?.name?.includes('/sr_newsletter/')) {
          requests.push(body);
          const result = results.shift() || { status: 200, body: { writeResults: [{ updateTime: '2026-10-10T12:00:00Z' }] } };
          return route.fulfill({ status: result.status, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': base.origin }, body: JSON.stringify(result.body) });
        }
        return route.fulfill({ contentType: 'application/json', body: '{"writeResults":[]}', headers: { 'Access-Control-Allow-Origin': base.origin } });
      }
      if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': base.origin, 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
      return route.fulfill({ contentType: 'application/json', body: '{"fields":{}}', headers: { 'Access-Control-Allow-Origin': base.origin } });
    }
    if (url.origin !== base.origin || !['GET', 'HEAD'].includes(request.method())) return route.abort();
    try {
      let file = path.resolve(output, '.' + decodeURIComponent(url.pathname));
      if (file !== output && !file.startsWith(output + path.sep)) throw new Error('Path leaves output directory');
      if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html');
      return route.fulfill({ body: await fs.readFile(file), contentType: mime[path.extname(file)] || 'text/plain' });
    } catch { return route.fulfill({ status: 404, body: 'Not found' }); }
  });
  await context.addInitScript(({ seed, origin }) => {
    if (location.origin !== origin) return;
    // Seed each origin only once so tests can exercise navigation persistence.
    if (!sessionStorage.getItem('consent-test-seeded')) {
      for (const [key, value] of Object.entries(seed)) localStorage.setItem(key, JSON.stringify(value));
      sessionStorage.setItem('consent-test-seeded', '1');
    }
    window.testCLS = 0;
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.testCLS += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
  }, { seed, origin: base.origin });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  return { context, page, requests, results, errors };
}
const goto = (page, route = '/') => page.goto(new URL(route, base).href, { waitUntil: 'load' });
const consentGet = page => page.evaluate(() => JSON.parse(localStorage.getItem('sr-consent')));
const waitPrompt = page => page.locator('[data-newsletter-prompt]').waitFor({ state: 'visible', timeout: 5000 });
async function noCookies(context) { assert.deepEqual(await context.cookies(), []); }
async function assertCLS(page) {
  await page.waitForTimeout(250);
  assert.equal(await page.evaluate(() => window.testCLS), 0, 'Consent and newsletter surfaces produce zero cumulative layout shift');
}
async function fill(page, source, email = ' Reader@Example.COM ') {
  const form = page.locator(`[data-newsletter-form][data-source="${source}"]`);
  assert.equal(await form.locator('input[type="checkbox"]').isChecked(), false);
  await form.locator('input[type="email"]').fill(email);
  await form.locator('input[type="checkbox"]').check();
  await form.getByRole('button', { name: 'Subscribe', exact: true }).click();
  return form;
}
function assertPayload(body, source, sourcePage) {
  assert.deepEqual(Object.keys(body), ['writes']);
  assert.equal(body.writes.length, 1);
  const write = body.writes[0];
  assert.deepEqual(Object.keys(write).sort(), ['update', 'updateTransforms', 'currentDocument'].sort());
  assert.deepEqual(Object.keys(write.update).sort(), ['fields', 'name']);
  assert.deepEqual(write.currentDocument, { exists: false });
  assert.deepEqual([...Object.keys(write.update.fields), ...write.updateTransforms.map(transform => transform.fieldPath)].sort(), fieldSet);
  assert.deepEqual(write.updateTransforms, [{ fieldPath: 'consentAt', setToServerValue: 'REQUEST_TIME' }]);
  const strings = Object.fromEntries(Object.entries(write.update.fields).map(([key, value]) => {
    assert.deepEqual(Object.keys(value), ['stringValue']); return [key, value.stringValue];
  }));
  assert.deepEqual(strings, { email: 'reader@example.com', consentTextVersion: 'newsletter-2026-10-10', consentText: sentence, sourcePage, source, status: 'pending' });
  assert.match(write.update.name, /^projects\/apptastic-mobi\/databases\/\(default\)\/documents\/sr_newsletter\/[a-f0-9]{64}$/);
}

try {
  const test = await setup();
  await goto(test.page, '/?nl-delay=2');
  const banner = test.page.locator('[data-consent-banner]');
  assert.equal(await banner.isVisible(), true);
  const sizes = await banner.locator('button').evaluateAll(buttons => buttons.map(button => {
    const rect = button.getBoundingClientRect(), css = getComputedStyle(button);
    return { width: rect.width, height: rect.height, weight: css.fontWeight, background: css.backgroundColor, border: css.border, fontSize: css.fontSize };
  }));
  assert.equal(sizes.length, 3);
  sizes.slice(1).forEach(size => {
    // Grid tracks can distribute one subpixel across otherwise equal columns.
    assert.ok(Math.abs(size.width - sizes[0].width) < .1);
    assert.equal(size.height, sizes[0].height);
    assert.deepEqual({ ...size, width: 0 }, { ...sizes[0], width: 0 });
  });
  assert.equal(await test.page.evaluate(() => document.activeElement.closest('[data-consent-banner], [data-newsletter-prompt]')), null, 'No appearance focus theft');
  await noCookies(test.context);
  await test.page.waitForTimeout(2300);
  assert.equal(await test.page.locator('[data-newsletter-prompt]').isVisible(), false, 'Timer alone cannot bypass consent');
  await assertCLS(test.page);
  await banner.getByRole('button', { name: 'Reject all', exact: true }).click();
  assert.equal((await consentGet(test.page)).analytics, false);
  assert.equal((await consentGet(test.page)).marketing, false);
  await noCookies(test.context);
  await waitPrompt(test.page);
  await assertCLS(test.page);
  const footerControl = test.page.locator('.site-footer [data-consent-open]');
  await footerControl.click();
  const dialog = test.page.locator('[data-consent-dialog]');
  assert.equal(await dialog.isVisible(), true);
  assert.equal(await dialog.locator('[name="analytics"]').isChecked(), false);
  assert.equal(await dialog.locator('[name="marketing"]').isChecked(), false);
  assert.equal(await dialog.locator('[name="necessary"]').isDisabled(), true);
  await test.page.keyboard.press('Shift+Tab');
  assert.equal(await dialog.getByRole('button', { name: 'Reject all', exact: true }).evaluate(button => button === document.activeElement), true, 'Reverse Tab wraps inside settings');
  await test.page.keyboard.press('Tab');
  assert.equal(await dialog.locator('[data-consent-close]').evaluate(button => button === document.activeElement), true, 'Tab wraps inside settings');
  await test.page.keyboard.press('Escape');
  assert.equal(await dialog.isVisible(), false);
  assert.equal(await footerControl.evaluate(button => button === document.activeElement), true);
  await footerControl.click();
  await dialog.getByRole('button', { name: 'Accept all', exact: true }).click();
  assert.equal((await consentGet(test.page)).analytics, true);
  assert.equal((await consentGet(test.page)).marketing, true);
  await noCookies(test.context);
  await test.page.locator('[data-newsletter-close]').click();
  assert.equal(await test.page.evaluate(() => JSON.parse(localStorage.getItem('sr-newsletter')).state), 'dismissed');
  await goto(test.page, '/?nl-delay=2'); await test.page.waitForTimeout(2300);
  assert.equal(await test.page.locator('[data-newsletter-prompt]').isVisible(), false, 'Dismissal survives navigation');
  assert.deepEqual(test.errors, []);

  // Prompt appears after a delay following consent, beyond the recent-input CLS window.
  const delay = await setup(); await goto(delay.page, '/?nl-delay=2');
  await delay.page.locator('[data-consent-banner]').getByRole('button', { name: 'Reject all', exact: true }).click();
  assert.equal(await delay.page.locator('[data-newsletter-prompt]').isVisible(), false);
  await waitPrompt(delay.page); await assertCLS(delay.page);
  await delay.page.keyboard.press('Escape');
  assert.equal(await delay.page.locator('[data-newsletter-prompt]').isVisible(), false);
  assert.deepEqual(delay.errors, []);

  const mobile = await setup({ viewport: { width: 390, height: 844 }, seed: { 'sr-consent': decision } });
  await goto(mobile.page, '/?nl-delay=2'); await waitPrompt(mobile.page);
  const sheet = await mobile.page.locator('[data-newsletter-prompt]').boundingBox();
  assert.ok(sheet.height < 844 * .5 && Math.abs(sheet.width - 390) < 1);
  assert.ok(Math.abs(sheet.y + sheet.height - 844) < 1);
  assert.equal(await mobile.page.evaluate(() => document.body.style.overflow), '', 'No prompt scroll lock');
  await assertCLS(mobile.page);
  assert.deepEqual(mobile.errors, []);

  const articles = (await fs.readdir('_site/articles')).filter(name => !name.startsWith('.'));
  assert.ok(articles.length);
  for (const source of ['prompt', 'footer', 'article-end']) {
    const subscription = await setup({ seed: { 'sr-consent': decision } });
    const pathname = source === 'article-end' ? `/articles/${articles[0]}/` : '/';
    await goto(subscription.page, pathname + '?nl-delay=2');
    if (source === 'prompt') await waitPrompt(subscription.page);
    const form = await fill(subscription.page, source);
    await subscription.page.waitForFunction(({ source, text }) => document.querySelector(`[data-newsletter-form][data-source="${source}"] [data-newsletter-status]`).textContent === text, { source, text: successText });
    assert.equal(subscription.requests.length, 1); assertPayload(subscription.requests[0], source, pathname);
    const expectedId = await subscription.page.evaluate(async () => {
      const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('reader@example.com'));
      return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, '0')).join('');
    });
    assert.equal(subscription.requests[0].writes[0].update.name.split('/').at(-1), expectedId);
    assert.equal(await form.locator('[data-newsletter-status]').textContent(), successText);
    await goto(subscription.page, '/?nl-delay=2'); await subscription.page.waitForTimeout(2300);
    assert.equal(await subscription.page.locator('[data-newsletter-prompt]').isVisible(), false, 'Submitted signup suppresses the prompt');
    await noCookies(subscription.context); assert.deepEqual(subscription.errors, []);
  }
  for (const status of ['ALREADY_EXISTS', 'PERMISSION_DENIED']) {
    const failure = await setup({ seed: { 'sr-consent': decision } });
    failure.results.push({ status: status === 'ALREADY_EXISTS' ? 409 : 403, body: { error: { status } } });
    await goto(failure.page, '/'); const form = await fill(failure.page, 'footer');
    const message = status === 'ALREADY_EXISTS' ? successText : 'Could not subscribe. Please try again shortly.';
    await failure.page.waitForFunction(text => document.querySelector('[data-source="footer"] [data-newsletter-status]').textContent === text, message);
    assert.equal(await form.locator('[data-newsletter-status]').textContent(), message);
  }
  for (const route of ['/privacy/', '/cookies/']) {
    const legal = await setup({ seed: { 'sr-consent': decision } });
    await goto(legal.page, route + '?nl-delay=2'); await legal.page.waitForTimeout(2300);
    assert.equal(await legal.page.locator('[data-newsletter-prompt]').isVisible(), false);
    if (route === '/cookies/') {
      await legal.page.locator('.legal-page [data-consent-open]').click();
      assert.equal(await legal.page.locator('[data-consent-dialog]').isVisible(), true);
    }
  }
  const stale = await setup({ seed: { 'sr-consent': { ...decision, version: 'old' } } });
  await goto(stale.page); assert.equal(await stale.page.locator('[data-consent-banner]').isVisible(), true);
  const noJS = await setup({ javaScriptEnabled: false }); await goto(noJS.page);
  assert.equal(await noJS.page.locator('[data-consent-banner]').isVisible(), false);
  assert.equal(await noJS.page.locator('[data-source="footer"] input[type=email]').isDisabled(), true, 'No-JS footer form is inert (fieldset disabled)');
  await noCookies(noJS.context);
  console.log('CONSENT BROWSER VERIFIED: isolated intercepted pages, equal button sizes, zero cookies, consent settings/focus, prompt gating/delay/dismissal, CLS 0, mobile sheet, all payload sources, duplicates/retry, legal exclusions, version renewal and no-JS fallback. No external request was made.');
} finally {
  for (const context of contexts) await context.close();
  await browser.close();
}
