import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

// Exercise menu state and close cancellation without starting a server or accessing production services.
const source = await fs.readFile('src/js/site.js', 'utf8');
function menuRuntime() {
  const makeEvents = target => {
    const listeners = new Map();
    target.addEventListener = (name, callback) => {
      const callbacks = listeners.get(name) || []; callbacks.push(callback); listeners.set(name, callbacks);
    };
    target.emit = (name, event = {}) => { for (const callback of listeners.get(name) || []) callback(event); };
    return target;
  };
  const classes = () => {
    const values = new Set();
    return {
      add: (...names) => names.forEach(name => values.add(name)),
      remove: (...names) => names.forEach(name => values.delete(name)),
      contains: name => values.has(name),
      toggle: (name, on) => { if (on) values.add(name); else values.delete(name); },
    };
  };
  let document;
  const element = () => makeEvents({
    classList: classes(), attributes: new Map(), inert: false, hidden: false,
    setAttribute(name, value) { this.attributes.set(name, value); },
    getAttribute(name) { return this.attributes.get(name); },
    focus() { document.activeElement = this; },
    closest: () => null, querySelector: () => null, querySelectorAll: () => [],
    getBoundingClientRect: () => ({ width: 390, height: 700 }),
  });
  const header = element(), toggle = element(), menu = element();
  const links = Array.from({ length: 7 }, element);
  menu.hidden = true;
  menu.querySelector = () => links[0]; menu.querySelectorAll = () => links;
  menu.contains = target => links.includes(target);
  const activeNav = element(); header.querySelector = selector => selector.startsWith('.desktop-nav') ? activeNav : null;
  const regions = Array.from({ length: 4 }, element);
  const bodyStyle = {
    get cssText() { return this.saved || '--starfield: initial'; },
    set cssText(value) { this.saved = value; this.position = ''; this.top = ''; this.width = ''; this.overflow = ''; this.paddingRight = ''; },
  };
  document = makeEvents({
    activeElement: null, hidden: false, documentElement: { classList: classes(), clientWidth: 390 },
    body: { style: bodyStyle },
    querySelector: selector => ({ '[data-header]': header, '[data-menu-toggle]': toggle, '[data-menu]': menu })[selector] || null,
    querySelectorAll: selector => selector.startsWith('main,') ? regions : [],
  });
  const desktop = makeEvents({ matches: false }), reduced = makeEvents({ matches: false });
  const timers = new Map(); let timerId = 0;
  const context = makeEvents({
    document, scrollY: 640, innerWidth: 390, URL, location: { origin: 'https://example.org', pathname: '/' },
    matchMedia: query => query.includes('960px') ? desktop : reduced,
    requestAnimationFrame: callback => callback(),
    setTimeout: callback => { const id = ++timerId; timers.set(id, callback); return id; },
    clearTimeout: id => timers.delete(id),
  });
  context.window = context;
  context.scrollTo = ({ top }) => { context.scrollY = top; };
  vm.runInNewContext(source, context, { timeout: 1000 });
  return { document, context, header, menu, toggle, links, regions, desktop, reduced, timers,
    settle: () => { const pending = [...timers.values()]; timers.clear(); pending.forEach(callback => callback()); } };
}
const runtime = menuRuntime();
const { toggle, menu, document, regions, reduced, desktop, timers, links } = runtime;
assert.equal(toggle.hidden, false, 'Menu control is enhanced even without IntersectionObserver');
toggle.emit('click');
assert.equal(menu.hidden, false); assert.ok(menu.classList.contains('is-open'));
assert.equal(toggle.getAttribute('aria-expanded'), 'true');
assert.equal(document.body.style.position, 'fixed'); assert.equal(document.body.style.top, '-640px');
assert.ok(regions.every(region => region.inert)); assert.equal(document.activeElement, links[0]);
let prevented = false;
// A normal reverse tab from the first menu link reaches the toggle through browser tab order.
toggle.focus();
document.emit('keydown', { key: 'Tab', shiftKey: true, preventDefault() { prevented = true; } });
assert.ok(prevented); assert.equal(document.activeElement, links.at(-1));
document.emit('keydown', { key: 'Escape', preventDefault() {} });
assert.ok(menu.classList.contains('is-closing')); assert.equal(menu.hidden, false, 'Close animation has time to render');
assert.equal(menu.inert, true); assert.equal(document.activeElement, toggle); assert.equal(timers.size, 1);
// Reverse closing before its timer fires. Stale cleanup must not hide the reopened sheet.
toggle.emit('click');
assert.equal(timers.size, 0); assert.ok(menu.classList.contains('is-open')); assert.equal(menu.inert, false);
runtime.settle(); assert.equal(menu.hidden, false); assert.ok(regions.every(region => region.inert));
toggle.emit('click'); runtime.settle();
assert.equal(menu.hidden, true); assert.equal(document.body.style.position, '');
assert.equal(document.body.style.cssText, '--starfield: initial'); assert.equal(runtime.context.scrollY, 640);
assert.ok(regions.every(region => !region.inert));
reduced.matches = true; toggle.emit('click'); toggle.emit('click');
assert.equal(menu.hidden, true); assert.equal(timers.size, 0, 'Reduced motion closes immediately');
reduced.matches = false; toggle.emit('click'); toggle.emit('click');
reduced.matches = true; reduced.emit('change');
assert.equal(menu.hidden, true); assert.equal(timers.size, 0, 'Preference changes settle an in-flight close');
reduced.matches = false; toggle.emit('click');
desktop.matches = true; desktop.emit('change');
assert.equal(menu.hidden, true); assert.equal(document.body.style.position, '');
assert.ok(regions.every(region => !region.inert));

// Check shared names, duplicated previews, snapshot cleanup and reduced motion separately from rendering.
const transitionListeners = new Map();
const images = [{ style: {} }, { style: {} }, { style: {} }];
const storyLinks = images.slice(0, 2).map(image => ({ getAttribute: () => '/articles/example/', querySelector: () => image }));
let articleHero = null;
const transitionPreference = { matches: false };
const transitionDocument = {
  activeElement: { closest: () => storyLinks[1] },
  querySelector: () => articleHero,
  querySelectorAll: selector => selector === '[data-story-link]' ? storyLinks : images,
};
const transitionContext = {
  document: transitionDocument, URL, location: { origin: 'https://example.org', pathname: '/' },
  navigation: { activation: { from: { url: 'https://example.org/articles/example/' } } },
  matchMedia: () => transitionPreference,
  addEventListener: (event, callback) => transitionListeners.set(event, callback),
};
transitionContext.window = transitionContext;
vm.runInNewContext(await fs.readFile('src/js/transitions.js', 'utf8'), transitionContext, { timeout: 1000 });
let resolveTransition;
let transitionFinished = new Promise(resolve => { resolveTransition = resolve; });
const swap = transitionListeners.get('pageswap');
swap({ viewTransition: { finished: transitionFinished }, activation: { entry: { url: 'https://example.org/articles/example/' } } });
assert.equal(images[0].style.viewTransitionName, 'none');
assert.equal(images[1].style.viewTransitionName, 'article-photo', 'Focused duplicate is the chosen photograph');
assert.equal(images.filter(image => image.style.viewTransitionName === 'article-photo').length, 1);
resolveTransition(); await transitionFinished;
assert.equal(images[1].style.viewTransitionName, 'none', 'Outgoing snapshot names clear for BFCache');
articleHero = images[2];
transitionFinished = new Promise(resolve => { resolveTransition = resolve; });
transitionListeners.get('pagereveal')({ viewTransition: { finished: transitionFinished } });
assert.equal(images[2].style.viewTransitionName, 'article-photo', 'Incoming article hero is shared');
resolveTransition(); await transitionFinished;
assert.equal(images[2].style.viewTransitionName, 'none');
transitionPreference.matches = true;
let skipped = 0;
swap({ viewTransition: { skipTransition: () => skipped++ } });
transitionListeners.get('pagereveal')({ viewTransition: { skipTransition: () => skipped++ } });
assert.equal(skipped, 2, 'Reduced motion skips both transition phases');
swap({}); transitionListeners.get('pagereveal')({});

// Inspect built routes rather than only the template conditional.
for (const file of await fs.readdir('_site', { recursive: true })) {
  if (!file.endsWith('.html')) continue;
  const html = await fs.readFile(`_site/${file}`, 'utf8');
  const scripts = [...html.matchAll(/<script\b[^>]*src="\/js\/lensing\.js[^" ]*"[^>]*>/g)];
  assert.equal(scripts.length, file === 'index.html' ? 1 : 0, `Homepage-only lensing: ${file}`);
  if (file === 'index.html') {
    assert.match(scripts[0][0], /type="module"/);
    assert.match(scripts[0][0], /lensing\.js\?v=[a-f0-9]{10}/);
    assert.match(html, /<canvas class="cover-lensing" data-lensing aria-hidden="true" width="1" height="1">/);
  }
}
const lensing = await fs.readFile('src/js/lensing.js', 'utf8');
assert.equal(await fs.readFile('_site/js/lensing.js', 'utf8'), lensing, 'Lensing module is shipped');
for (const hook of ['prefers-reduced-motion: reduce', 'saveData', "getContext('webgl'", 'if (!gl)', 'COMPILE_STATUS', 'LINK_STATUS', 'webglcontextlost', 'sky-motion-change', 'requestIdleCallback', 'IntersectionObserver', 'document.hidden', 'skyBoundary', 'texture2D', '1000 / 30']) {
  assert.ok(lensing.includes(hook), `Lensing contract: ${hook}`);
}
assert.ok(source.includes("cover.dispatchEvent(new CustomEvent('sky-motion-change'))"), 'Existing motion control publishes its state');
assert.ok(source.includes("cover.dataset.skyMotion = running ? 'running' : 'paused'"), 'Late module initialization reads current pause state');
const longDash = /[\u2013\u2014]/;
const excludedPalette = /\b(?:purple|violet|magenta|lavender)\b|#(?:9b5cff|c9a6ff|7b3dff|a76bff)\b/i;
assert.ok(longDash.test(String.fromCodePoint(0x2013)), 'Dash check positive control');
assert.ok(excludedPalette.test(String.fromCharCode(112, 117, 114, 112, 108, 101)), 'Palette check positive control');
for (const file of ['src/js/lensing.js', 'src/css/style.css', 'src/index.njk', 'docs/DESIGN.md', 'docs/REBRAND_V4_REPORT.md']) {
  const value = await fs.readFile(file, 'utf8');
  assert.ok(!longDash.test(value), `Lensing punctuation: ${file}`);
  assert.ok(!excludedPalette.test(value), `Lensing palette: ${file}`);
}

for (const file of ['docs/DESIGN.md', 'docs/UX_REFERENCE.md', 'docs/REBRAND_V4_REPORT.md']) {
  const text = await fs.readFile(file, 'utf8');
  assert.ok(text.includes('black hole') && text.includes('skyline'), `Theme documented: ${file}`);
  assert.ok(/reduced motion/i.test(text), `Motion access documented: ${file}`);
  assert.ok(/owner/i.test(text), `Review responsibility documented: ${file}`);
}
assert.equal(await fs.access('src/images/brand/observatory-thumbnail-ref.png').then(() => true, () => false), false, 'Old logo reference is not shipped');
const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
assert.deepEqual(Object.keys(packageJson.devDependencies).sort(), ['@11ty/eleventy', '@11ty/eleventy-img', '@fontsource-variable/inter-tight', '@fontsource-variable/newsreader', 'sharp', 'simple-icons'].sort(), 'No new dependencies');
console.log('REBRAND VERIFIED: menu timing, reversal, focus, scroll restoration, motion preferences, desktop cleanup, shared photos, snapshot cleanup, homepage-only hashed lensing, fallback hooks, pause wiring, palette, punctuation, documentation and dependencies');
