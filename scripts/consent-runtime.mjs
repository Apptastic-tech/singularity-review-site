import assert from 'node:assert/strict';
import vm from 'node:vm';
import { createHash, webcrypto } from 'node:crypto';

// In-memory behavior checks. No browser, socket or real request is available here.
function surface() {
  const events = new Map();
  return {
    events, hidden: false, isConnected: true, dataset: {},
    addEventListener(type, callback) { if (!events.has(type)) events.set(type, []); events.get(type).push(callback); },
    removeEventListener(type, callback) { events.set(type, (events.get(type) || []).filter(value => value !== callback)); },
    dispatchEvent(event) { for (const callback of events.get(event.type) || []) callback(event); },
    emit(type, extra = {}) { this.dispatchEvent({ type, preventDefault() {}, ...extra }); },
    contains(element) { return element === this; }, closest() { return null; },
    focus() { this.document.activeElement = this; },
  };
}
function environment(options = {}) {
  const window = surface(), document = surface();
  const clock = { time: 0, wall: Date.parse('2026-10-10T12:00:00Z') }, timers = new Map();
  let nextTimer = 0;
  const storage = initial => {
    const values = new Map(Object.entries(initial || {}));
    return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key), values };
  };
  const localStorage = storage(options.local), sessionStorage = storage(options.session);
  const requests = [], responses = [];
  const main = surface(), heading = surface(), banner = surface(), dialog = surface(), consentForm = surface();
  const closeSettings = surface(), open = surface(), accept = surface(), reject = surface();
  accept.dataset.consentChoice = 'accept'; reject.dataset.consentChoice = 'reject';
  consentForm.elements = { analytics: { checked: false }, marketing: { checked: false } };
  dialog.open = false;
  dialog.showModal = () => { dialog.open = true; };
  dialog.close = () => { dialog.open = false; dialog.emit('close'); };
  const controls = [closeSettings, consentForm.elements.analytics, consentForm.elements.marketing, accept, reject];
  dialog.querySelector = selector => selector === '#consent-heading' ? heading : closeSettings;
  dialog.querySelectorAll = () => controls;
  const prompt = surface(), promptHeading = surface(), promptClose = surface(), announcement = surface();
  prompt.hidden = true;
  prompt.querySelector = selector => selector === 'h2' ? promptHeading : promptClose;
  const forms = ['prompt', 'article-end', 'footer'].map(source => {
    const form = surface(), fields = { disabled: true }, status = { textContent: '' };
    form.dataset.source = source;
    form.elements = { email: { ...surface(), value: '' }, newsletterConsent: { ...surface(), checked: false }, website: { value: '' } };
    form.querySelector = selector => selector === '[data-newsletter-fields]' ? fields : status;
    return form;
  });
  const placeholders = (options.gates || []).map(category => {
    const placeholder = surface(); placeholder.dataset.consent = category; placeholder.dataset.src = `/test-${category}.js`;
    placeholder.hasAttribute = () => false;
    placeholder.after = script => { placeholder.activated = script; };
    return placeholder;
  });
  document.querySelector = selector => ({
    '#main': main, '[data-consent-banner]': banner, '[data-consent-dialog]': dialog, '[data-consent-form]': consentForm,
    '[data-newsletter-prompt]': prompt, '[data-newsletter-announcement]': announcement,
  })[selector];
  document.querySelectorAll = selector => ({
    '[data-consent-open]': [open], '[data-consent-choice]': [accept, reject], '[data-newsletter-form]': forms,
    'script[type="text/plain"][data-consent]': placeholders,
  })[selector] || [];
  document.createElement = () => ({ dataset: {}, setAttribute() {} });
  document.documentElement = { classList: { contains: () => false } };
  document.hidden = false;
  document.activeElement = main;
  const elements = [main, heading, banner, dialog, closeSettings, open, accept, reject, prompt, promptHeading, promptClose, ...forms.flatMap(form => [form, form.elements.email, form.elements.newsletterConsent])];
  elements.forEach(element => { element.document = document; });
  class ClockDate extends Date {
    constructor(...args) { super(...(args.length ? args : [clock.wall + clock.time])); }
    static now() { return clock.wall + clock.time; }
  }
  Object.assign(window, {
    window, document, localStorage, sessionStorage, Date: ClockDate, URLSearchParams,
    performance: { now: () => clock.time }, crypto: webcrypto, TextEncoder, AbortController,
    location: { hostname: options.hostname || 'localhost', search: options.search || '', pathname: options.pathname || '/' },
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init.detail; } },
    setTimeout(callback, delay) { const id = ++nextTimer; timers.set(id, { callback, at: clock.time + delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    fetch: async (url, init) => { requests.push({ url, init, body: JSON.parse(init.body) }); return responses.shift() || { ok: true }; },
  });
  const context = vm.createContext(window);
  const run = code => vm.runInContext(code, context, { timeout: 1000 });
  const advance = milliseconds => {
    const end = clock.time + milliseconds;
    for (;;) {
      const next = [...timers].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      clock.time = next[1].at; timers.delete(next[0]); next[1].callback();
    }
    clock.time = end;
  };
  const submit = async (source = 'footer', email = ' Reader@Example.COM ', checked = true) => {
    const form = forms.find(value => value.dataset.source === source);
    form.elements.email.value = email; form.elements.newsletterConsent.checked = checked;
    await form.events.get('submit')[0]({ preventDefault() {} });
    return form.querySelector('[data-newsletter-status]').textContent;
  };
  return { window, document, run, advance, localStorage, sessionStorage, requests, responses, banner, dialog, consentForm, main, heading, open, accept, reject, closeSettings, prompt, promptHeading, promptClose, forms, placeholders, submit };
}

export async function verifyConsentRuntime({ consent, newsletter, fields, sentence }) {
  const initial = environment({ gates: ['analytics', 'marketing'] });
  initial.run(consent);
  assert.equal(initial.banner.hidden, false);
  assert.equal(initial.document.activeElement, initial.main, 'First banner does not steal focus');
  assert.equal(initial.window.srConsent.get(), null);
  let changed = 0;
  const remove = initial.window.srConsent.onChange(() => changed++);
  initial.reject.emit('click');
  const record = JSON.parse(initial.localStorage.getItem('sr-consent'));
  assert.deepEqual(Object.keys(record).sort(), ['version', 'necessary', 'analytics', 'marketing', 'decidedAt'].sort());
  assert.equal(record.analytics, false); assert.equal(record.marketing, false);
  assert.equal(record.version, '2026-10-10'); assert.equal(record.necessary, true);
  assert.equal(initial.placeholders.filter(value => value.activated).length, 0);
  assert.equal(changed, 1); remove();
  initial.open.emit('click');
  assert.equal(initial.dialog.open, true);
  assert.equal(initial.consentForm.elements.analytics.checked, false);
  assert.equal(initial.consentForm.elements.marketing.checked, false);
  assert.equal(initial.document.activeElement, initial.heading);
  initial.dialog.emit('cancel'); assert.equal(initial.dialog.open, false);
  initial.accept.emit('click');
  assert.equal(changed, 1, 'Unsubscribe removes the listener');
  assert.equal(initial.placeholders.filter(value => value.activated).length, 2);
  initial.reject.emit('click'); initial.accept.emit('click');
  assert.equal(initial.placeholders.filter(value => value.activated).length, 2);
  const stale = environment({ local: { 'sr-consent': JSON.stringify({ ...record, version: 'old' }) } });
  stale.run(consent); assert.equal(stale.banner.hidden, false);
  const returning = environment({ local: { 'sr-consent': JSON.stringify(record) } });
  returning.run(consent); assert.equal(returning.banner.hidden, true);

  const timer = environment(); timer.run(consent); timer.run(newsletter);
  timer.advance(61000); assert.equal(timer.prompt.hidden, true, 'Consent must be resolved first');
  timer.reject.emit('click'); assert.equal(timer.prompt.hidden, false, 'Visible time still accumulates before deciding');
  assert.equal(timer.document.activeElement, timer.main, 'Prompt appearance does not steal focus');
  timer.promptClose.emit('click'); timer.advance(100000);
  assert.equal(timer.prompt.hidden, true);
  assert.equal(JSON.parse(timer.localStorage.getItem('sr-newsletter')).state, 'dismissed');
  const fresh = () => { const test = environment({ local: { 'sr-consent': JSON.stringify(record) } }); test.run(consent); test.run(newsletter); return test; };
  const visible = fresh(); visible.advance(30000);
  visible.document.hidden = true; visible.document.emit('visibilitychange'); visible.advance(120000);
  visible.document.hidden = false; visible.document.emit('visibilitychange'); visible.advance(29999);
  assert.equal(visible.prompt.hidden, true); visible.advance(1); assert.equal(visible.prompt.hidden, false);
  const firstPage = fresh(); firstPage.advance(30000); firstPage.window.emit('pagehide');
  const secondPage = environment({ local: { 'sr-consent': JSON.stringify(record) }, session: Object.fromEntries(firstPage.sessionStorage.values) });
  secondPage.run(consent); secondPage.run(newsletter); secondPage.advance(30000); assert.equal(secondPage.prompt.hidden, false, 'Time counts across pages');
  for (const pathname of ['/privacy/', '/cookies/']) {
    const test = environment({ pathname, local: { 'sr-consent': JSON.stringify(record) } });
    test.run(consent); test.run(newsletter); test.advance(90000); assert.equal(test.prompt.hidden, true);
  }
  for (const hostname of ['localhost', 'singularityreview.com']) {
    const test = environment({ hostname, search: '?nl-delay=2', local: { 'sr-consent': JSON.stringify(record) } });
    test.run(consent); test.run(newsletter); test.advance(2000); assert.equal(test.prompt.hidden, hostname !== 'localhost');
  }
  for (const [state, at, expected] of [
    ['dismissed', '2026-10-09T12:00:00Z', true], ['dismissed', '2026-09-09T12:00:00Z', false], ['subscribed', '2025-01-01T12:00:00Z', true],
  ]) {
    const test = environment({ local: { 'sr-consent': JSON.stringify(record), 'sr-newsletter': JSON.stringify({ state, at }) } });
    test.run(consent); test.run(newsletter); test.advance(61000); assert.equal(test.prompt.hidden, expected);
  }
  const restored = environment({
    local: { 'sr-consent': JSON.stringify(record), 'sr-newsletter': JSON.stringify({ state: 'dismissed', at: '2026-09-01T12:00:00Z' }) },
    session: { 'sr-newsletter-session': JSON.stringify({ visibleMs: 60000, seen: true, shownAt: Date.parse('2026-09-01T12:00:00Z') }) },
  });
  restored.run(consent); restored.run(newsletter);
  assert.equal(restored.prompt.hidden, false, 'A restored session can show again after the 30-day suppression expires');
  for (const source of ['prompt', 'article-end', 'footer']) {
    const test = fresh(); const message = await test.submit(source);
    assert.equal(message, "Thanks. We'll email you to confirm your subscription before sending anything.");
    assert.equal(test.requests.length, 1);
    const request = test.requests[0], write = request.body.writes[0];
    assert.equal(request.init.credentials, 'omit');
    assert.deepEqual(Object.keys(write).sort(), ['update', 'updateTransforms', 'currentDocument'].sort());
    assert.equal(write.currentDocument.exists, false);
    assert.deepEqual([...Object.keys(write.update.fields), ...write.updateTransforms.map(value => value.fieldPath)].sort(), fields);
    assert.equal(write.updateTransforms[0].setToServerValue, 'REQUEST_TIME');
    assert.equal(write.update.fields.email.stringValue, 'reader@example.com');
    assert.equal(write.update.fields.consentText.stringValue, sentence);
    assert.equal(write.update.fields.consentTextVersion.stringValue, 'newsletter-2026-10-10');
    assert.equal(write.update.fields.source.stringValue, source);
    assert.equal(write.update.fields.status.stringValue, 'pending');
    assert.equal(write.update.fields.sourcePage.stringValue, '/');
    assert.equal(write.update.name.split('/').at(-1), createHash('sha256').update('reader@example.com').digest('hex'));
    assert.equal(JSON.parse(test.localStorage.getItem('sr-newsletter')).state, 'subscribed');
  }
  for (const status of ['ALREADY_EXISTS', 'FAILED_PRECONDITION', 'PERMISSION_DENIED']) {
    const test = fresh(); test.responses.push({ ok: false, json: async () => ({ error: { status } }) });
    const result = await test.submit();
    assert.equal(result, status === 'PERMISSION_DENIED' ? 'Could not subscribe. Please try again shortly.' : "Thanks. We'll email you to confirm your subscription before sending anything.");
    if (status === 'PERMISSION_DENIED') assert.equal(test.localStorage.getItem('sr-newsletter'), null);
  }
  const invalid = fresh();
  await invalid.submit('footer', 'invalid'); await invalid.submit('footer', 'x'.repeat(255) + '@example.com');
  await invalid.submit('footer', 'reader@example.com', false);
  assert.equal(invalid.requests.length, 0, 'Validation rejects invalid or unconsented signups');
  invalid.forms.find(form => form.dataset.source === 'footer').elements.website.value = 'bot';
  await invalid.submit(); assert.equal(invalid.requests.length, 0, 'Honeypot never submits');
}
