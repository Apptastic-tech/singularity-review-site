import assert from 'node:assert/strict';
import vm from 'node:vm';
// Pure DOM fixtures: no browser or network requests.
export function verifyCardRowRuntime(source) {
  const setup = (reduced = false, overflow = true) => {
    const element = () => ({ events: new Map(), hidden: true, disabled: true, addEventListener(name, callback, options) { this.events.set(name, { callback, options }); } });
    const track = element(), arrows = element(), previous = element(), next = element();
    Object.assign(track, { scrollWidth: overflow ? 1800 : 900, clientWidth: 900, scrollLeft: 0, querySelector: () => ({ getBoundingClientRect: () => ({ width: 400 }) }), scrollBy(options) { this.last = options; this.scrollLeft = Math.max(0, Math.min(this.scrollWidth - this.clientWidth, this.scrollLeft + options.left)); } });
    const row = { querySelector: selector => ({ '[data-row-track]': track, '[data-row-arrows]': arrows, '[data-row-prev]': previous, '[data-row-next]': next })[selector] };
    const frames = [], events = new Map();
    const context = { document: { querySelectorAll: () => [row] }, matchMedia: () => ({ matches: reduced }), getComputedStyle: () => ({ columnGap: '24px' }), requestAnimationFrame(callback) { frames.push(callback); return frames.length; }, addEventListener(name, callback) { events.set(name, callback); } };
    context.window = context;
    vm.runInNewContext(source, context);
    const flush = () => { while (frames.length) frames.shift()(); };
    const scroll = () => { track.events.get('scroll').callback(); flush(); };
    return { track, arrows, previous, next, frames, events, flush, scroll };
  };
  for (const reduced of [false, true]) {
    const test = setup(reduced);
    assert.equal(test.arrows.hidden, false); assert.equal(test.previous.disabled, true); assert.equal(test.next.disabled, false);
    assert.equal(test.track.events.get('scroll').options.passive, true);
    test.next.events.get('click').callback();
    assert.equal(test.track.last.left, 424); assert.equal(test.track.last.behavior, reduced ? 'auto' : 'smooth');
    test.scroll(); assert.equal(test.previous.disabled, false);
    const event = { key: 'ArrowRight', target: test.track, preventDefault() { this.prevented = true; } };
    test.track.events.get('keydown').callback(event); assert.equal(event.prevented, true); assert.equal(test.track.scrollLeft, 848);
    test.next.events.get('click').callback(); test.scroll(); assert.equal(test.next.disabled, true, 'End disables next');
    test.previous.events.get('click').callback(); test.scroll(); assert.equal(test.next.disabled, false);
    test.track.scrollLeft = 0; test.scroll(); assert.equal(test.previous.disabled, true);
    const nested = { ...event, target: {}, prevented: false };
    test.track.events.get('keydown').callback(nested); assert.equal(nested.prevented, false, 'Links retain native keyboard semantics');
    test.track.scrollWidth = test.track.clientWidth;
    test.events.get('resize')(); test.flush(); assert.equal(test.arrows.hidden, true, 'No-overflow rows hide controls');
  }
  assert.equal(setup(false, false).arrows.hidden, true);
}
