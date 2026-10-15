import assert from 'node:assert/strict';
import { environment } from './consent-runtime.mjs';

// Vendor libraries are never executed. All insertions and consent queues are simulated.
export function verifyAnalyticsRuntime({ consent, analytics, ads }) {
  const ga4Id = 'G-ABC1234567', clarityId = 'abc1234567';
  const record = { version: '2026-10-10', necessary: true, analytics: true, marketing: false, decidedAt: '2026-10-10T12:00:00Z' };
  const boot = ({ saved, config = { ga4Id, clarityId } } = {}) => {
    const test = environment({ analyticsConfig: config, local: saved === undefined ? {} : { 'sr-consent': typeof saved === 'string' ? saved : JSON.stringify(saved) } });
    test.run(consent); test.run(analytics); return test;
  };
  const commands = test => Array.from(test.window.dataLayer, command => Array.from(command));
  const lastSignal = test => commands(test).filter(command => command[0] === 'consent').at(-1)[2].analytics_storage;
  const initial = boot();
  assert.equal(initial.vendorScripts.length, 0, 'No third-party analytics before acceptance');
  assert.equal(initial.localStorage.values.size, 0, 'No new storage before a decision');
  assert.deepEqual(initial.cookieWrites, []);
  assert.deepEqual(JSON.parse(JSON.stringify(commands(initial)[0])), ['consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied',
  }]);
  assert.equal(lastSignal(initial), 'denied');
  initial.reject.emit('click');
  assert.equal(initial.vendorScripts.length, 0, 'Decline loads neither tool');
  assert.equal(initial.window.clarity, undefined);
  assert.equal(initial.window['ga-disable-' + ga4Id], true);
  initial.accept.emit('click');
  assert.deepEqual(initial.vendorScripts.map(script => script.src), [
    'https://www.googletagmanager.com/gtag/js?id=' + ga4Id,
    'https://www.clarity.ms/tag/' + clarityId,
  ]);
  for (const script of initial.vendorScripts) {
    assert.equal(script.async, true);
    assert.equal(script.commandsAtInsertion.filter(command => command[0] === 'consent').at(-1)[2].analytics_storage, 'granted', 'Grant must precede insertion');
  }
  const claritySignal = initial.vendorScripts[1].clarityAtInsertion[0];
  assert.equal(claritySignal[0], 'consentv2');
  assert.equal(claritySignal[1].analytics_Storage, 'granted');
  assert.equal(claritySignal[1].ad_Storage, 'denied');
  assert.equal(initial.window['ga-disable-' + ga4Id], false);
  initial.accept.emit('click');
  initial.window.emit('pageshow', { persisted: true });
  initial.window.emit('storage', { key: 'sr-consent' });
  assert.equal(initial.vendorScripts.length, 2, 'Repeated events never duplicate tags');
  assert.equal(commands(initial).filter(command => command[0] === 'config').length, 1);
  assert.deepEqual([...initial.localStorage.values.keys()], ['sr-consent'], 'Only the existing preference key is written');
  assert.equal(boot({ saved: record }).vendorScripts.length, 2, 'Returning Analytics acceptance loads immediately without Marketing');
  for (const saved of [{ ...record, analytics: false }, { ...record, version: 'old' }, { ...record, analytics: 'yes' }, { ...record, decidedAt: 'invalid' }, '{invalid']) {
    const test = boot({ saved });
    assert.equal(test.vendorScripts.length, 0, 'Declined, stale and malformed records never load analytics');
  }
  for (const config of [{ ga4Id: 'G-XXXXXXX', clarityId: 'XXXXXXX' }, { ga4Id: '', clarityId: '' }, {}, { ga4Id: 'invalid/id', clarityId: 'invalid/id' }]) {
    const test = boot({ saved: record, config });
    assert.equal(test.vendorScripts.length, 0, 'Placeholder, empty and malformed IDs are skipped');
    assert.equal(commands(test).some(command => command[0] === 'config'), false);
  }
  for (const [config, expected] of [[{ ga4Id, clarityId: 'XXXXXXX' }, 'googletagmanager.com'], [{ ga4Id: 'G-XXXXXXX', clarityId }, 'clarity.ms']]) {
    const test = boot({ saved: record, config });
    assert.equal(test.vendorScripts.length, 1); assert.ok(test.vendorScripts[0].src.includes(expected));
  }
  // Settings withdrawal disables GA4 and signals Clarity before reloading.
  initial.open.emit('click');
  initial.consentForm.elements.analytics.checked = false;
  initial.consentForm.elements.marketing.checked = true;
  initial.consentForm.emit('submit');
  assert.equal(JSON.parse(initial.localStorage.getItem('sr-consent')).analytics, false);
  assert.equal(JSON.parse(initial.localStorage.getItem('sr-consent')).marketing, true);
  assert.equal(initial.navigation.reloads, 1);
  assert.equal(lastSignal(initial), 'denied');
  assert.equal(initial.window['ga-disable-' + ga4Id], true);
  assert.equal(initial.window.clarity.q.at(-1)[1].analytics_Storage, 'denied');
  assert.equal(boot({ saved: initial.localStorage.getItem('sr-consent') }).vendorScripts.length, 0, 'Withdrawal survives reload');
  for (const event of ['storage', 'pageshow']) {
    const test = boot({ saved: record });
    test.localStorage.removeItem('sr-consent');
    test.window.emit(event, { key: null, persisted: true });
    assert.equal(test.navigation.reloads, 1, 'Withdrawal in another tab or a restored page stops loaded tools');
  }
  const blocked = environment({ analyticsConfig: { ga4Id, clarityId } });
  blocked.localStorage.getItem = () => { throw new Error('Storage blocked'); };
  blocked.localStorage.setItem = () => { throw new Error('Storage blocked'); };
  blocked.run(consent); blocked.run(analytics);
  assert.equal(blocked.vendorScripts.length, 0);
  blocked.accept.emit('click'); assert.equal(blocked.vendorScripts.length, 2, 'Blocked storage retains acceptance on this page');
  blocked.reject.emit('click'); assert.equal(blocked.navigation.reloads, 1);
  // Both bootstraps share one default in either execution order, preserving ads signals.
  for (const adsFirst of [false, true]) {
    const test = environment({ local: { 'sr-consent': JSON.stringify({ ...record, marketing: true }) } });
    test.run(consent);
    const runAnalytics = () => { test.document.currentScript.dataset = { ga4Id, clarityId }; test.run(analytics); };
    const runAds = () => { test.document.currentScript.dataset = { adClient: '', adPreview: 'false' }; test.run(ads); };
    if (adsFirst) { runAds(); runAnalytics(); } else { runAnalytics(); runAds(); }
    const signals = commands(test).filter(command => command[0] === 'consent');
    assert.equal(signals.filter(command => command[1] === 'default').length, 1, 'Ads never reset accepted Analytics defaults');
    const state = Object.assign({}, ...signals.map(command => command[2]));
    assert.equal(state.analytics_storage, 'granted'); assert.equal(state.ad_storage, 'granted');
    assert.equal(test.window.adsbygoogle.requestNonPersonalizedAds, 0);
    assert.equal(test.vendorScripts.length, 2);
  }
}
