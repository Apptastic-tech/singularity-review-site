import assert from 'node:assert/strict';
import vm from 'node:vm';

// Simulated DOM and observers only. This never opens a browser or fetches a URL.
export function verifyAdsRuntime(source) {
  function runtime({ preview = false, saved = null, unit = '1234567890', observer = true } = {}) {
    const handlers = {}, scripts = [], observers = [], mutations = [], slots = [];
    const window = { dataLayer: [], srConsent: { get: () => saved }, addEventListener: (name, cb) => { handlers[name] = cb; } };
    function slot(top) {
      const classes = new Set(), ads = [];
      const value = { dataset: { adUnit: unit }, top,
        getBoundingClientRect() { return { top: this.top, bottom: this.top + 306 }; },
        classList: { contains: name => classes.has(name), add: name => classes.add(name) },
        querySelector: selector => selector === '.ad-slot-reserved' ? { appendChild: ad => ads.push(ad) } : ads.find(ad => ad.dataset.adStatus === 'unfilled'),
        closest: () => value, ads, classes };
      slots.push(value); return value;
    }
    const visible = slot(100), below = slot(5000);
    const document = { currentScript: { dataset: { adPreview: String(preview), adClient: 'ca-pub-1234567890123456' } },
      querySelectorAll: () => slots,
      createElement: name => ({ name, dataset: {}, closest: () => below }),
      head: { appendChild: script => scripts.push(script) } };
    class IO { constructor(callback, options) { this.callback = callback; this.options = options; observers.push(this); } observe() {} }
    class MO { constructor(callback) { mutations.push(callback); } observe() {} }
    if (observer) window.IntersectionObserver = IO;
    vm.runInNewContext(source, { window, document, innerHeight: 844, ...(observer ? { IntersectionObserver: IO } : {}), MutationObserver: MO, encodeURIComponent });
    const decide = (marketing, analytics = false) => handlers['sr:consent']({ detail: marketing === null ? null : { necessary: true, marketing, analytics } });
    const approach = target => observers.find(value => value.options?.rootMargin === '600px').callback([{ target, isIntersecting: true }]);
    const status = target => { target.dataset.adStatus = 'unfilled'; mutations[0]([{ target }]); };
    return { window, scripts, observers, slots, visible, below, decide, approach, status, handlers };
  }
  const env = runtime();
  assert.equal(env.scripts.length, 0, 'Nothing loads before a decision');
  assert.deepEqual({ ...env.window.dataLayer[0][2] }, { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });
  env.approach(env.visible); assert.equal(env.visible.ads.length, 0);
  env.decide(false); assert.equal(env.scripts.length, 1, 'Reject is a decision and permits a denied, non-personalised request');
  assert.equal(env.window.adsbygoogle.requestNonPersonalizedAds, 1);
  assert.ok(env.scripts[0].src.startsWith('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-'));
  assert.equal(env.visible.ads.length, 0, 'Filling waits for script readiness');
  env.scripts[0].onload(); assert.equal(env.visible.ads.length, 1);
  assert.equal(env.visible.ads[0].name, 'ins'); assert.equal(env.visible.ads[0].dataset.adSlot, '1234567890');
  assert.equal(env.visible.ads[0].dataset.fullWidthResponsive, 'true');
  env.approach(env.visible); assert.equal(env.visible.ads.length, 1, 'Fill is idempotent');
  env.decide(true, true); assert.equal(env.scripts.length, 1); assert.equal(env.window.adsbygoogle.requestNonPersonalizedAds, 0);
  assert.deepEqual({ ...env.window.dataLayer.at(-1)[2] }, { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
  env.decide(false, true); assert.equal(env.window.dataLayer.at(-1)[2].analytics_storage, 'granted'); assert.equal(env.window.dataLayer.at(-1)[2].ad_storage, 'denied');
  env.decide(null); env.approach(env.below); assert.equal(env.below.ads.length, 0, 'No new fill after decision removal');
  env.status(env.visible); assert.ok(!env.visible.classes.has('ad-slot--collapsed'), 'Visible unfilled slot retains space');
  env.status(env.below); assert.ok(env.below.classes.has('ad-slot--collapsed'), 'Unseen slot below viewport may collapse');
  const seen = runtime(); seen.observers[0].callback([{ target: seen.below, isIntersecting: true }]); seen.status(seen.below); assert.ok(!seen.below.classes.has('ad-slot--collapsed'), 'Previously seen slot retains space');
  for (const saved of [null, { necessary: true, marketing: false, analytics: false }, { necessary: true, marketing: true, analytics: true }]) {
    const test = runtime({ preview: true, saved }); test.approach(test.visible); test.decide(true); test.decide(false);
    assert.equal(test.scripts.length, 0, 'Preview makes no Google request with any decision'); assert.equal(test.visible.ads.length, 0);
  }
  const returning = runtime({ saved: { necessary: true, marketing: true, analytics: false } });
  assert.equal(returning.scripts.length, 1); assert.equal(returning.window.dataLayer[0][1], 'default', 'Default precedes saved-decision tag load');
  const placeholder = runtime({ unit: '[AdSense ad unit ID]' }); placeholder.approach(placeholder.visible); placeholder.decide(true); placeholder.scripts[0].onload(); assert.equal(placeholder.visible.ads.length, 0);
  const fallback = runtime({ observer: false }); fallback.decide(false); fallback.scripts[0].onload(); assert.equal(fallback.visible.ads.length, 1); assert.equal(fallback.below.ads.length, 0);
  fallback.below.top = 1000; fallback.handlers.scroll(); assert.equal(fallback.below.ads.length, 1);
}
