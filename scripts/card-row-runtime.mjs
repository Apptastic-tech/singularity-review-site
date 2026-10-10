import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

// Pure DOM fixtures, including deferred smooth scrolling. No browser or network.
export function verifyCardRowRuntime(source) {
  const setup = ({ reduced = false, overflow = true, observer = true } = {}) => {
    const element = () => ({
      events: new Map(), disabled: true,
      addEventListener(name, callback, options) { this.events.set(name, { callback, options }); },
      emit(name, event) { this.events.get(name)?.callback(event); },
      closest: () => null
    });
    const track = element(), arrows = element(), previous = element(), next = element();
    Object.defineProperty(arrows, 'hidden', {
      get: () => false,
      set: () => assert.fail('Arrow visibility belongs to CSS and must never change in JavaScript')
    });
    Object.assign(track, {
      scrollWidth: overflow ? 1800 : 900, clientWidth: 900, scrollLeft: 0,
      scrollPaddingInlineStart: '24px', scrollPaddingInlineEnd: '32px',
      getBoundingClientRect: () => ({ left: 0, right: track.clientWidth, width: track.clientWidth }),
      querySelector: () => ({ getBoundingClientRect: () => ({ width: 400 }) }),
      scrollBy(options) {
        this.last = options;
        this.destination = Math.max(0, Math.min(this.scrollWidth - this.clientWidth, this.scrollLeft + options.left));
        if (options.behavior !== 'smooth') this.scrollLeft = this.destination;
      }
    });
    const row = { querySelector: selector => ({ '[data-row-track]': track, '[data-row-arrows]': arrows, '[data-row-prev]': previous, '[data-row-next]': next })[selector] };
    const frames = [], events = new Map(), observers = [];
    let frameId = 0;
    const context = {
      document: { querySelectorAll: () => [row] },
      matchMedia: () => ({ matches: reduced }),
      getComputedStyle: element => ({ columnGap: '24px', scrollPaddingInlineStart: element.scrollPaddingInlineStart, scrollPaddingInlineEnd: element.scrollPaddingInlineEnd }),
      requestAnimationFrame(callback) { frames.push(callback); return ++frameId; },
      addEventListener(name, callback, options) { events.set(name, { callback, options }); }
    };
    if (observer) context.ResizeObserver = class {
      constructor(callback) { this.callback = callback; observers.push(this); }
      observe(element) { this.element = element; }
    };
    context.window = context;
    vm.runInNewContext(source, context);
    const flush = () => { while (frames.length) frames.shift()(); };
    const scroll = position => { track.scrollLeft = position; track.emit('scroll'); flush(); };
    const settle = () => { scroll(track.destination); track.emit('scrollend'); };
    const cardAt = (left, width = 400) => ({
      parentElement: track, scrollRequests: [],
      getBoundingClientRect: () => ({ left: left - track.scrollLeft, right: left + width - track.scrollLeft, width }),
      scrollIntoView(options) { this.scrollRequests.push({ ...options }); }
    });
    return { track, arrows, previous, next, frames, events, observers, flush, scroll, settle, cardAt };
  };

  for (const reduced of [false, true]) {
    const test = setup({ reduced });
    assert.equal(test.previous.disabled, true);
    assert.equal(test.next.disabled, false);
    assert.equal(test.track.events.get('scroll').options.passive, true);
    assert.equal(test.track.events.get('scrollend').options.passive, true);
    assert.equal(test.events.get('resize').options.passive, true);
    assert.equal(test.observers[0].element, test.track);

    test.next.emit('click');
    assert.equal(test.track.last.left, 424);
    assert.equal(test.track.last.behavior, reduced ? 'auto' : 'smooth');
    assert.equal(test.previous.disabled, false, 'Previous enables immediately, before scroll events or animation frames');
    if (!reduced) assert.equal(test.track.scrollLeft, 0, 'Smooth scrolling has not started yet');
    test.settle();
    assert.equal(test.track.scrollLeft, 424);
    assert.equal(test.previous.disabled, false, 'Previous stays enabled after one card step');

    const event = { key: 'ArrowRight', target: test.track, preventDefault() { this.prevented = true; } };
    test.track.emit('keydown', event);
    assert.equal(event.prevented, true);
    assert.equal(test.track.destination, 848);
    test.settle();
    test.next.emit('click');
    assert.equal(test.track.destination, 900, 'The final step clamps to the row end');
    assert.equal(test.track.last.left, 52, 'Only the remaining distance is requested');
    assert.equal(test.next.disabled, true, 'Next disables immediately at the clamped destination');
    test.settle();
    test.previous.emit('click');
    assert.equal(test.next.disabled, false, 'Next enables immediately when moving away from the end');
    test.settle();
    test.scroll(100);
    test.track.emit('keydown', { ...event, key: 'ArrowLeft', prevented: false });
    assert.equal(test.track.destination, 0, 'Previous clamps to the start');
    assert.equal(test.track.last.left, -100);
    assert.equal(test.previous.disabled, true, 'Previous disables immediately at the clamped start');
    test.settle();

    for (const properties of [{ target: {} }, { altKey: true }, { ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { key: 'Enter' }]) {
      const ignored = { ...event, ...properties, prevented: false };
      test.track.emit('keydown', ignored);
      assert.equal(ignored.prevented, false, 'Links and modified keys retain native keyboard semantics');
    }

    // Multiple native scroll events coalesce, and the frame reads the latest position.
    test.track.scrollLeft = 50;
    test.track.emit('scroll');
    test.track.scrollLeft = 900;
    test.track.emit('scroll');
    test.track.emit('scroll');
    assert.equal(test.frames.length, 1, 'Scroll events are throttled to one animation frame');
    test.flush();
    assert.equal(test.previous.disabled, false);
    assert.equal(test.next.disabled, true);
    test.track.scrollLeft = 0;
    test.track.emit('scroll');
    test.track.emit('scrollend');
    assert.equal(test.previous.disabled, true, 'Scrollend updates the final state without waiting for a queued frame');
    test.flush();
    assert.equal(test.next.disabled, false);

    test.track.scrollWidth = test.track.clientWidth;
    test.events.get('resize').callback();
    test.flush();
    assert.equal(test.previous.disabled, true);
    assert.equal(test.next.disabled, true, 'No-overflow rows keep both arrows disabled');
    test.track.scrollWidth = 1800;
    test.observers[0].callback();
    test.flush();
    assert.equal(test.next.disabled, false, 'ResizeObserver restores state after content or track resizing');

    const focused = setup({ reduced });
    focused.track.clientWidth = 1440;
    focused.track.scrollWidth = 2340;
    const focus = card => focused.track.emit('focusin', { target: { closest: () => card } });
    for (const left of [24, 1008]) {
      const visible = focused.cardAt(left);
      focus(visible);
      assert.equal(visible.scrollRequests.length, 0, 'Fully visible cards at either padded edge do not scroll');
    }
    const peeking = focused.cardAt(1396);
    focus(peeking);
    const expected = { block: 'nearest', inline: 'nearest', behavior: reduced ? 'auto' : 'smooth' };
    assert.deepEqual(peeking.scrollRequests, [expected], 'Focus reveals the partly visible last card using nearest alignment and the motion preference');
    for (const left of [-20, 12, 1024, 1600]) {
      const clipped = focused.cardAt(left);
      focus(clipped);
      assert.deepEqual(clipped.scrollRequests, [expected], 'Focus reveals cards clipped by the track or either scroll-padding edge');
    }
    focused.scroll(900);
    assert.equal(focused.previous.disabled, false, 'Focus scrolling updates Previous through the scroll listener');
    assert.equal(focused.next.disabled, true, 'Focus scrolling updates Next at the row end');
    focus(peeking);
    assert.equal(peeking.scrollRequests.length, 1, 'Refocusing the revealed card leaves the row in place');
    focused.track.emit('focusin', { target: focused.track });
    const nested = focused.cardAt(1600);
    nested.parentElement = {};
    focus(nested);
    assert.equal(nested.scrollRequests.length, 0, 'Only direct card items belong to the focused track');
  }

  const noOverflow = setup({ overflow: false });
  assert.equal(noOverflow.previous.disabled, true);
  assert.equal(noOverflow.next.disabled, true);
  assert.equal(noOverflow.arrows.hidden, false, 'No-overflow controls remain rendered for CSS to place');
  const withoutObserver = setup({ observer: false });
  withoutObserver.track.scrollWidth = 900;
  withoutObserver.events.get('resize').callback();
  withoutObserver.flush();
  assert.equal(withoutObserver.next.disabled, true, 'Window resize remains the fallback without ResizeObserver');

  // An interrupted or native scroll must override the optimistic click destination.
  const interrupted = setup();
  interrupted.next.emit('click');
  interrupted.scroll(70);
  assert.equal(interrupted.previous.disabled, false);
  interrupted.scroll(0);
  assert.equal(interrupted.previous.disabled, true);
  assert.equal(interrupted.next.disabled, false);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  verifyCardRowRuntime(await fs.readFile(new URL('../src/js/card-row.js', import.meta.url), 'utf8'));
  console.log('CARD ROW RUNTIME VERIFIED: immediate clamped targets, asynchronous smooth scroll, passive throttled scroll, scrollend, resize, CSS-only visibility, keyboard, padded focus visibility and reduced motion.');
}
