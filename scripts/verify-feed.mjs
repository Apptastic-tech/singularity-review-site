import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

// Run the production loading code with in-memory DOM and response fixtures.
// No browser, server or real network request is used.
const source = await fs.readFile('src/js/site.js', 'utf8');
const settle = () => new Promise(resolve => setImmediate(resolve));
function runtime(sectionHeading) {
  const observers = [], responses = [], requests = [], navigations = [];
  const element = () => {
    const attributes = new Map(), events = new Map();
    return {
      attributes, events, removed: false,
      setAttribute: (name, value) => attributes.set(name, value),
      removeAttribute: name => attributes.delete(name),
      getAttribute: name => attributes.get(name),
      addEventListener: (name, callback) => events.set(name, callback),
      remove() { this.removed = true; },
      classList: { add() {}, remove() {}, toggle() {} }
    };
  };
  const card = (href, tag = 'h2') => {
    const block = element(), story = element(), image = element();
    story.setAttribute('href', href);
    story.focus = () => { story.focused = true; };
    block.heading = { tagName: tag.toUpperCase(), className: 'story-block-title', textContent: href };
    block.heading.replaceWith = replacement => { block.heading = replacement; };
    block.querySelector = selector => selector === '.story-block-link' ? story : selector === '.story-block-title' ? block.heading : selector === 'img' ? image : null;
    block.querySelectorAll = () => [];
    block.matches = selector => selector === '[data-reveal]';
    return block;
  };
  const feed = element();
  feed.cards = [card('/articles/existing/', sectionHeading ? 'h3' : 'h2')];
  feed.querySelectorAll = selector => selector === '.story-block-link' ? feed.cards.map(block => block.querySelector(selector)) : [];
  feed.closest = () => sectionHeading ? {} : null;
  feed.append = block => feed.cards.push(block);
  const link = element(), sentinel = element(), status = element();
  link.href = 'https://example.org/page/2/';
  const document = {
    querySelector: selector => ({ '.story-grid[data-feed]': feed, '[data-load-more]': link, '[data-sentinel]': sentinel, '[data-load-status]': status })[selector] || null,
    querySelectorAll: () => [],
    createElement: tag => ({ tagName: tag.toUpperCase() }),
    addEventListener() {}
  };
  const responsePage = (cards, next) => ({
    querySelectorAll: selector => {
      assert.equal(selector, '.story-grid[data-feed] > .story-block[data-card]', 'Fetched items are direct grid children');
      return cards;
    },
    querySelector: selector => {
      assert.equal(selector, '[data-load-more]');
      return next ? { getAttribute: () => next } : null;
    }
  });
  const context = {
    document, URL, scrollY: 0,
    location: { href: 'https://example.org/', origin: 'https://example.org', assign: href => navigations.push(href) },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    addEventListener() {},
    IntersectionObserver: class {
      constructor(callback, options) { this.callback = callback; this.options = options; this.watched = new Set(); observers.push(this); }
      observe(target) { this.watched.add(target); }
      unobserve(target) { this.watched.delete(target); }
      disconnect() { this.watched.clear(); this.disconnected = true; }
    },
    DOMParser: class { parseFromString(doc) { return doc; } },
    fetch: async (url, options) => {
      requests.push({ url, options });
      const response = responses.shift();
      assert.ok(response, 'Each fixture request has a queued response');
      return { ok: response.ok !== false, text: async () => response.doc };
    }
  };
  context.window = context;
  vm.runInNewContext(source, context, { timeout: 1000 });
  const loader = observers.find(observer => observer.options.rootMargin);
  assert.ok(loader?.watched.has(sentinel), 'Loader observes the current page sentinel');
  const click = (overrides = {}) => {
    const event = { button: 0, preventDefault() { this.prevented = true; }, ...overrides };
    link.events.get('click')(event);
    return event;
  };
  return { feed, link, sentinel, status, card, responsePage, responses, requests, navigations, loader, click };
}

for (const underHeading of [true, false]) {
  const test = runtime(underHeading);
  const first = test.card('/articles/first/');
  test.responses.push({ doc: test.responsePage([test.card('/articles/existing/'), first, test.card('/articles/first/')], '/page/3/') });
  const modified = test.click({ ctrlKey: true });
  assert.equal(modified.prevented, undefined, 'Modified clicks retain native page navigation');
  assert.equal(test.requests.length, 0);
  const click = test.click();
  assert.equal(click.prevented, true);
  assert.equal(test.feed.attributes.get('aria-busy'), 'true', 'Loading announces busy state');
  assert.equal(test.link.attributes.get('aria-disabled'), 'true');
  test.click();
  assert.equal(test.requests.length, 1, 'In-flight requests cannot overlap');
  await settle();
  assert.equal(test.feed.cards.length, 2, 'Existing and repeated fetched URLs are skipped');
  assert.equal(first.heading.tagName, underHeading ? 'H3' : 'H2', 'Appended headline matches the destination section');
  assert.equal(first.querySelector('.story-block-link').focused, true, 'Manual loading focuses the first new story');
  assert.equal(first.querySelector('img').loading, 'lazy');
  assert.equal(first.querySelector('img').attributes.get('fetchpriority'), 'auto');
  assert.equal(test.link.href, 'https://example.org/page/3/');
  assert.equal(test.status.textContent, '1 more stories loaded.');
  assert.equal(test.feed.attributes.has('aria-busy'), false);
  assert.equal(test.link.attributes.has('aria-disabled'), false);
  assert.equal(test.requests[0].options.credentials, 'same-origin');

  test.responses.push({ ok: false });
  test.loader.callback([{ isIntersecting: true }]);
  await settle();
  assert.match(test.status.textContent, /Could not load more stories/);
  assert.equal(test.link.removed, false);
  assert.equal(test.link.href, 'https://example.org/page/3/', 'Failure keeps a usable page link');
  assert.equal(test.feed.attributes.has('aria-busy'), false);
  assert.equal(test.link.attributes.has('aria-disabled'), false);
  test.loader.callback([{ isIntersecting: true }]);
  assert.equal(test.requests.length, 2, 'Automatic loading pauses after a failed request');

  const last = test.card('/articles/last/');
  test.responses.push({ doc: test.responsePage([last], null) });
  test.click();
  await settle();
  assert.equal(test.feed.cards.length, 3, 'Manual retry appends to the same grid');
  assert.equal(last.heading.tagName, underHeading ? 'H3' : 'H2');
  assert.equal(test.link.removed, true);
  assert.equal(test.sentinel.removed, true);
  assert.equal(test.loader.disconnected, true);
  assert.equal(test.status.textContent, '1 more stories loaded. You are all caught up.');
  assert.equal(test.navigations.length, 0);
}
const failure = runtime(true);
failure.responses.push({ ok: false });
failure.click();
await settle();
assert.deepEqual(failure.navigations, ['https://example.org/page/2/'], 'Failed manual loading falls back to the actual page');
const foreign = runtime(false);
foreign.link.href = 'https://elsewhere.example/page/2/';
foreign.loader.callback([{ isIntersecting: true }]);
await settle();
assert.equal(foreign.requests.length, 0, 'Foreign next-page origins are rejected before fetching');
assert.match(foreign.status.textContent, /Could not load/);
console.log('FEED VERIFIED: grid appends on home and later pages, heading levels, deduplication, click focus, busy status, native modified clicks, retry and same-origin fallback. No browser or network was used.');
