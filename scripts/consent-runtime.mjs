import assert from 'node:assert/strict';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

// In-memory behavior checks. No browser, socket or real request is available here.
function surface() {
  const events = new Map();
  return {
    events, hidden: false, isConnected: true, dataset: {},
    classList: { values: new Set(), add(value) { this.values.add(value); }, remove(value) { this.values.delete(value); }, contains(value) { return this.values.has(value); } },
    addEventListener(type, callback) { if (!events.has(type)) events.set(type, []); events.get(type).push(callback); },
    removeEventListener(type, callback) { events.set(type, (events.get(type) || []).filter(value => value !== callback)); },
    dispatchEvent(event) { for (const callback of events.get(event.type) || []) callback(event); },
    emit(type, extra = {}) { this.dispatchEvent({ type, preventDefault() {}, ...extra }); },
    contains(element) { return element === this; }, closest() { return null; },
    focus() { this.document.activeElement = this; },
  };
}
export function environment(options = {}) {
  const window = surface(), document = surface();
  const clock = { time: 0, wall: Date.parse('2026-10-10T12:00:00Z') }, timers = new Map();
  let nextTimer = 0;
  const storage = initial => {
    const values = new Map(Object.entries(initial || {}));
    return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key), values };
  };
  const localStorage = storage(options.local), sessionStorage = storage(options.session);
  const requests = [], responses = [];
  const vendorScripts = [], navigation = { reloads: 0 };
  document.currentScript = { dataset: options.analyticsConfig || {} };
  document.head = { appendChild(script) {
    script.commandsAtInsertion = Array.from(window.dataLayer || [], command => Array.from(command));
    script.clarityAtInsertion = Array.from(window.clarity?.q || [], command => Array.from(command));
    vendorScripts.push(script);
  } };
  const main = surface(), heading = surface(), banner = surface(), dialog = surface(), consentForm = surface();
  const closeSettings = surface(), open = surface(), accept = surface(), reject = surface();
  accept.dataset.consentChoice = 'accept'; reject.dataset.consentChoice = 'reject';
  consentForm.elements = { analytics: { checked: false }, marketing: { checked: false } };
  banner.hidden = true;
  dialog.open = false;
  dialog.showModal = () => { dialog.open = true; };
  dialog.close = () => { dialog.open = false; dialog.emit('close'); };
  const controls = [closeSettings, consentForm.elements.analytics, consentForm.elements.marketing, accept, reject];
  dialog.querySelector = selector => selector === '#consent-heading' ? heading : closeSettings;
  dialog.querySelectorAll = () => controls;
  const prompt = surface(), promptHeading = surface(), promptClose = surface(), announcement = surface();
  prompt.hidden = true;
  prompt.querySelector = selector => selector === 'h2' ? promptHeading : promptClose;
  // beehiiv embed slots: the frame records appended loader scripts; a test can place a sized iframe in it.
  const forms = ['prompt', 'article-end', 'footer'].map(source => {
    const embed = surface(), frame = { scripts: [], iframe: null };
    embed.dataset.source = source;
    frame.appendChild = script => frame.scripts.push(script);
    frame.querySelector = selector => selector.startsWith('iframe') && frame.iframe && (selector === 'iframe' || frame.iframe.sized) ? frame.iframe : null;
    embed.frame = frame;
    embed.querySelector = selector => selector === '[data-newsletter-frame]' ? frame : selector === 'iframe' ? frame.querySelector('iframe') : null;
    return embed;
  });
  const cookieWrites = [];
  let cookieJar = options.cookie || '';
  Object.defineProperty(document, 'cookie', { get: () => cookieJar, set: value => { cookieWrites.push(value); }, configurable: true });
  const observers = { intersection: [], mutation: [] };
  class IntersectionObserverMock {
    constructor(callback) { this.callback = callback; this.targets = new Set(); observers.intersection.push(this); }
    observe(target) { this.targets.add(target); }
    unobserve(target) { this.targets.delete(target); }
    reveal(target) { if (this.targets.has(target)) this.callback([{ target, isIntersecting: true }]); }
  }
  class MutationObserverMock {
    constructor(callback) { this.callback = callback; this.active = false; observers.mutation.push(this); }
    observe() { this.active = true; }
    disconnect() { this.active = false; }
    fire() { if (this.active) this.callback([]); }
  }
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
    '[data-consent-open]': [open], '[data-consent-choice]': [accept, reject], '[data-newsletter-embed]': forms,
    'script[type="text/plain"][data-consent]': placeholders,
  })[selector] || [];
  document.createElement = () => { const element = surface(); element.attributes = {}; element.setAttribute = (name, value) => { element.attributes[name] = value; }; element.hasAttribute = () => false; element.after = () => {}; return element; };
  document.documentElement = { classList: { contains: () => false } };
  document.hidden = false;
  document.activeElement = main;
  const elements = [main, heading, banner, dialog, closeSettings, open, accept, reject, prompt, promptHeading, promptClose, ...forms];
  elements.forEach(element => { element.document = document; });
  class ClockDate extends Date {
    constructor(...args) { super(...(args.length ? args : [clock.wall + clock.time])); }
    static now() { return clock.wall + clock.time; }
  }
  Object.assign(window, {
    window, document, localStorage, sessionStorage, Date: ClockDate, URLSearchParams,
    matchMedia: () => ({ matches: options.reducedMotion === true }),
    performance: { now: () => clock.time }, crypto: webcrypto, TextEncoder, AbortController,
    location: { hostname: options.hostname || 'localhost', search: options.search || '', pathname: options.pathname || '/', reload() { navigation.reloads++; } },
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } },
    setTimeout(callback, delay) { const id = ++nextTimer; timers.set(id, { callback, at: clock.time + delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    fetch: async (url, init) => { requests.push({ url, init }); return responses.shift() || { ok: true }; },
    IntersectionObserver: IntersectionObserverMock, MutationObserver: MutationObserverMock,
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
  const embed = source => forms.find(value => value.dataset.source === source);
  const reveal = source => observers.intersection.forEach(observer => observer.reveal(embed(source)));
  const size = source => { embed(source).frame.iframe = { sized: true, contentWindow: { source } }; observers.mutation.forEach(observer => observer.fire()); };
  return { window, document, run, advance, localStorage, sessionStorage, requests, responses, banner, dialog, consentForm, main, heading, open, accept, reject, closeSettings, prompt, promptHeading, promptClose, forms, placeholders, embed, reveal, size, cookieWrites, vendorScripts, navigation };
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
  timer.reject.emit('click');
  assert.equal(timer.prompt.hidden, true, 'Newsletter waits during the consent exit animation');
  assert.equal(timer.banner.classList.contains('is-leaving'), true);
  timer.advance(239); assert.equal(timer.prompt.hidden, true);
  timer.advance(1); assert.equal(timer.banner.hidden, true);
  assert.equal(timer.prompt.hidden, false, 'Visible time still accumulates before deciding');
  assert.equal(timer.document.activeElement, timer.main, 'Prompt appearance does not steal focus');
  timer.promptClose.emit('click'); timer.advance(100000);
  assert.equal(timer.prompt.hidden, true);
  assert.equal(JSON.parse(timer.localStorage.getItem('sr-newsletter')).state, 'dismissed');
  const fresh = (analytics = false) => { const test = environment({ local: { 'sr-consent': JSON.stringify({ ...record, analytics }) } }); test.run(consent); test.run(newsletter); return test; };
  const overlapping = fresh(); overlapping.advance(61000);
  assert.equal(overlapping.prompt.hidden, false);
  overlapping.open.emit('click');
  assert.equal(overlapping.prompt.hidden, true, 'Opening settings hides an already-visible newsletter');
  assert.equal(overlapping.dialog.open, true);
  overlapping.advance(5000); assert.equal(overlapping.prompt.hidden, true);
  const guarded = fresh(); guarded.banner.hidden = false; guarded.advance(61000);
  assert.equal(guarded.prompt.hidden, true, 'Explicit visible-banner guard applies even after a saved decision');
  const reduced = environment({ reducedMotion: true }); reduced.run(consent); reduced.run(newsletter); reduced.advance(61000); reduced.reject.emit('click');
  assert.equal(reduced.banner.hidden, true); assert.equal(reduced.prompt.hidden, false, 'Reduced motion skips exit delay');
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
  const loader = 'https://subscribe-forms.beehiiv.com/v3/loader.js', formId = 'e785ea2e-cba3-470a-8d47-87fb1c73e623';
  const scripts = (test, source) => test.embed(source).frame.scripts;
  // No beehiiv requests or cookie writes before acceptance or after Decline,
  // including inline slots, the timed prompt and the observer fallback.
  for (const declined of [false, true]) {
    const test = environment(); test.run(consent); test.run(newsletter);
    if (declined) test.reject.emit('click');
    for (const source of ['footer', 'article-end']) test.reveal(source);
    test.advance(61000);
    assert.equal(test.forms.flatMap(embed => embed.frame.scripts).length, 0);
    assert.equal(test.requests.length, 0); assert.deepEqual(test.cookieWrites, []);
    test.accept.emit('click');
    assert.equal(scripts(test, 'footer').length, 1, 'Accept mounts an already approached signup');
    assert.equal(scripts(test, 'article-end').length, 1);
  }
  const fallback = environment(); delete fallback.window.IntersectionObserver;
  fallback.run(consent); fallback.run(newsletter);
  assert.equal(fallback.forms.flatMap(embed => embed.frame.scripts).length, 0, 'No observer still requires acceptance');
  // Accepted visitors still load only a signup that is shown or near view.
  const lazy = fresh(true);
  for (const source of ['prompt', 'article-end', 'footer']) { assert.equal(scripts(lazy, source).length, 0, source + ': no loader before shown'); assert.equal(lazy.embed(source).dataset.state, 'idle'); }
  lazy.reveal('footer');
  assert.equal(scripts(lazy, 'footer').length, 1); assert.equal(scripts(lazy, 'article-end').length, 0); assert.equal(scripts(lazy, 'prompt').length, 0);
  const [footerScript] = scripts(lazy, 'footer');
  assert.equal(footerScript.src, loader); assert.equal(footerScript.async, true); assert.equal(footerScript.attributes['data-beehiiv-form'], formId);
  assert.equal(lazy.embed('footer').dataset.state, 'loading');
  lazy.reveal('footer'); assert.equal(scripts(lazy, 'footer').length, 1, 'Mounted once');
  lazy.advance(61000); assert.equal(lazy.prompt.hidden, false);
  assert.equal(scripts(lazy, 'prompt').length, 1, 'Prompt mounts the loader when it appears');
  assert.equal(lazy.requests.length, 0, 'No Firestore or other fetch');
  lazy.size('prompt'); assert.equal(lazy.embed('prompt').dataset.state, 'ready');
  // Footer never sized: falls back to the beehiiv page link after 10 seconds.
  assert.equal(lazy.embed('footer').dataset.state, 'fallback');
  const slow = fresh(true); slow.reveal('footer'); slow.embed('footer').frame.iframe = { sized: false, contentWindow: {} }; slow.advance(10000);
  assert.equal(slow.embed('footer').dataset.state, 'slow', 'An unsized iframe stays visible beside the fallback link');
  const failing = fresh(true); failing.reveal('article-end'); scripts(failing, 'article-end')[0].emit('error');
  assert.equal(failing.embed('article-end').dataset.state, 'fallback');
  // Completed signup reported by the beehiiv iframe suppresses the prompt.
  const signup = fresh(true); signup.advance(61000); signup.size('prompt');
  const frameWindow = signup.embed('prompt').frame.iframe.contentWindow;
  signup.window.emit('message', { origin: 'https://example.org', data: { type: 'beehiiv:submitted' }, source: frameWindow });
  assert.equal(signup.localStorage.getItem('sr-newsletter'), null, 'Other origins are ignored');
  signup.window.emit('message', { origin: 'https://subscribe-forms.beehiiv.com', data: { type: 'beehiiv:submitted' }, source: {} });
  assert.equal(signup.localStorage.getItem('sr-newsletter'), null, 'Only the mounted iframe counts');
  signup.window.emit('message', { origin: 'https://subscribe-forms.beehiiv.com', data: { type: 'beehiiv:submitted' }, source: frameWindow });
  assert.equal(JSON.parse(signup.localStorage.getItem('sr-newsletter')).state, 'subscribed');
  // Attribution cookies survive only with Analytics consent.
  for (const analytics of [false, true]) {
    const test = environment({ cookie: 'bhv_attribution=%7B%7D; other=1', local: { 'sr-consent': JSON.stringify({ ...record, analytics }) } });
    test.run(consent); test.run(newsletter); test.reveal('footer'); scripts(test, 'footer')[0]?.emit('load');
    assert.deepEqual(test.cookieWrites, analytics ? [] : ['bhv_attribution=; Max-Age=0; path=/; SameSite=Lax']);
  }
  const clean = fresh(true); clean.reveal('footer'); scripts(clean, 'footer')[0].emit('load');
  assert.deepEqual(clean.cookieWrites, [], 'No cookie write when no attribution cookie exists');
}
