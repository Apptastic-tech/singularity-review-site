import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

// Deterministic lifecycle and geometry checks. No server, browser, GPU or production requests.
// Actual driver compilation, pixels and frame rate remain the owner's rendered review.
const source = await fs.readFile('src/js/lensing.js', 'utf8');
const site = await fs.readFile('src/js/site.js', 'utf8');
const css = await fs.readFile('src/css/style.css', 'utf8');
function events(target = {}) {
  const listeners = new Map();
  target.addEventListener = (name, callback) => {
    const callbacks = listeners.get(name) || [];
    callbacks.push(callback); listeners.set(name, callbacks);
  };
  target.emit = (name, event = {}) => { for (const callback of listeners.get(name) || []) callback(event); };
  target.dispatchEvent = event => target.emit(event.type, event);
  return target;
}
function classes() {
  const values = new Set();
  return {
    contains: name => values.has(name),
    add: name => values.add(name), remove: name => values.delete(name),
    toggle: (name, on) => on ? values.add(name) : values.delete(name),
  };
}
function runtime(options = {}) {
  let timestamp = 0, nextId = 0, performanceTime = 0;
  const frames = new Map(), idle = new Map(), observers = [], resizes = [];
  const calls = { contexts: 0, draws: [], deleted: [], shaders: [], uniforms: new Map(), uploads: 0, mipmaps: 0, filters: [], resamples: [] };
  const noop = () => {};
  const gl = {
    VERTEX_SHADER: 1, FRAGMENT_SHADER: 2, COMPILE_STATUS: 3, LINK_STATUS: 4, NO_ERROR: 0,
    createShader: type => ({ type }), shaderSource: (shader, value) => calls.shaders.push({ type: shader.type, value }),
    compileShader: noop, getShaderParameter: () => !options.compileFailure,
    createProgram: () => ({}), attachShader: noop, linkProgram: noop,
    getProgramParameter: () => !options.linkFailure, useProgram: noop,
    createBuffer: () => ({}), createTexture: () => ({}),
    MAX_TEXTURE_SIZE: 10, TEXTURE0: 11, TEXTURE1: 12, TEXTURE_MIN_FILTER: 13, LINEAR: 14, LINEAR_MIPMAP_LINEAR: 15,
    getParameter: () => options.textureLimit || 4096,
    generateMipmap: () => { calls.mipmaps++; if (options.mipmapFailure) throw new Error('Mipmap failed'); },
    bindBuffer: noop, bufferData: noop, getAttribLocation: () => 0, enableVertexAttribArray: noop,
    vertexAttribPointer: noop, activeTexture: noop, bindTexture: noop, texParameteri: (target, parameter, value) => calls.filters.push([parameter, value]), pixelStorei: noop,
    texImage2D: () => {
      calls.uploads++;
      if (options.uploadFailure || (options.artUploadFailure && calls.uploads === 2)) throw new Error('Upload failed');
    },
    getUniformLocation: (program, name) => name,
    uniform1i: (name, value) => calls.uniforms.set(name, value),
    uniform1f: (name, value) => calls.uniforms.set(name, value),
    uniform2f: (name, x, y) => calls.uniforms.set(name, [x, y]), viewport: noop,
    drawArrays: () => { if (options.drawFailure) throw new Error('Draw failed'); calls.draws.push(calls.uniforms.get('uTime')); },
    getError: () => options.firstDrawError ? 1 : 0,
    isContextLost: () => !!gl.lost,
    deleteShader: value => calls.deleted.push(value), deleteProgram: value => calls.deleted.push(value),
    deleteBuffer: value => calls.deleted.push(value), deleteTexture: value => calls.deleted.push(value),
  };
  let width = options.width || 390;
  const height = () => width < 640 ? 610 : 660;
  const box = () => {
    const diskWidth = width < 640 ? Math.min(width, 640) : width < 960 ? width * 0.55 : Math.min(width * 0.26, 360);
    const diskHeight = diskWidth * 9 / 16;
    const left = width < 640 ? width * 1.04 - diskWidth : width < 960 ? width - diskWidth : width * 0.58 - diskWidth / 2;
    const top = width < 640 ? 10 : width < 960 ? 8 : height() * 0.22 - diskHeight / 2;
    return { left, top, width: diskWidth, height: diskHeight };
  };
  const fieldBox = () => {
    const disk = box();
    return { left: disk.left - disk.width * 0.4, top: disk.top + disk.height / 2 - disk.width * 0.9, width: disk.width * 1.8, height: disk.width * 1.8 };
  };
  const disk = { getBoundingClientRect: box };
  const diskImage = events({ naturalWidth: 1280, naturalHeight: 720, complete: true,
    decode: async () => { if (options.artDecodeFailure) throw new Error('Artwork decode failed'); },
  });
  const canvas = events({
    width: 1, height: 1, getBoundingClientRect: fieldBox,
    getContext: () => { calls.contexts++; return options.noWebGL ? null : gl; },
  });
  const skyline = events({
    naturalWidth: 1920, naturalHeight: 1018, complete: true,
    style: { transform: '' },
    decode: async () => { if (options.decodeFailure) throw new Error('Decode failed'); },
    getBoundingClientRect: () => ({ left: -width * 0.02, top: -height() * 0.02, width: width * 1.04, height: height() * 1.04 }),
  });
  const toggle = events({ hidden: true, attributes: new Map(), setAttribute(name, value) { this.attributes.set(name, value); } });
  const cover = events({
    classList: classes(), dataset: { skyMotion: 'running' },
    getBoundingClientRect: () => ({ top: options.offscreen ? 1000 : 0, bottom: options.offscreen ? 1610 : height() }),
    querySelector: selector => ({ '.cover-sky-image': skyline, '.cover-disk': disk, '.cover-disk-image': diskImage, '[data-lensing]': canvas, '[data-motion-toggle]': toggle })[selector],
  });
  const reduced = events({ matches: !!options.reducedMotion });
  const connection = events({ saveData: !!options.saveData });
  const document = events({
    createElement: () => ({ width: 0, height: 0, getContext: () => options.no2D ? null : { drawImage: (...args) => calls.resamples.push(args) } }),
    hidden: !!options.hidden,
    querySelector: selector => selector === '[data-cover]' && !options.noCover ? cover : null,
    querySelectorAll: () => [],
  });
  const context = events({
    document, navigator: { connection }, innerWidth: width, innerHeight: 844, scrollY: 0,
    devicePixelRatio: options.dpr || 3,
    matchMedia: query => query.includes('reduced-motion') ? reduced : events({ matches: false }),
    getComputedStyle: () => ({ objectPosition: width < 640 ? '80% 50%' : '50% 50%', transform: 'matrix(1.04, 0, 0, 1.04, -1, 0)' }),
    performance: { now: () => { performanceTime += options.drawCost || 0; return performanceTime; } },
    requestAnimationFrame: callback => { const id = ++nextId; frames.set(id, callback); return id; },
    cancelAnimationFrame: id => frames.delete(id),
    requestIdleCallback: callback => { const id = ++nextId; idle.set(id, callback); return id; },
    cancelIdleCallback: id => idle.delete(id),
    CustomEvent: class { constructor(type) { this.type = type; } },
    IntersectionObserver: class {
      constructor(callback) { this.callback = callback; observers.push(this); }
      observe(target) { this.target = target; } unobserve() {} disconnect() {}
    },
    ResizeObserver: class { constructor(callback) { resizes.push(callback); } observe() {} },
  });
  if (options.noObserver) delete context.IntersectionObserver;
  if (options.noIdle) { delete context.requestIdleCallback; delete context.cancelIdleCallback; }
  if (options.noDecode) { delete skyline.decode; delete diskImage.decode; }
  context.window = context;
  vm.createContext(context);
  if (options.withSite) vm.runInContext(site, context, { timeout: 1000 });
  vm.runInContext(source, context, { timeout: 1000 });
  const settle = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
  const step = async (delta = 1000 / 60) => {
    timestamp += delta;
    const pending = [...frames.values()]; frames.clear();
    pending.forEach(callback => callback(timestamp)); await settle();
  };
  const visibility = async on => {
    observers.filter(observer => observer.target).forEach(observer => observer.callback([{ isIntersecting: on, target: observer.target }])); await settle();
  };
  const flushIdle = async () => { const pending = [...idle.values()]; idle.clear(); pending.forEach(callback => callback()); await settle(); };
  const boot = async () => { await visibility(true); await step(); await step(); await flushIdle(); };
  return { context, document, cover, canvas, skyline, disk, diskImage, reduced, connection, toggle, calls, gl, frames, idle,
    step, boot, visibility, flushIdle, settle,
    resize: async newWidth => { width = newWidth; context.innerWidth = width; context.emit('resize'); await settle(); },
  };
}

const noCover = runtime({ noCover: true });
assert.equal(noCover.frames.size, 0); assert.equal(noCover.calls.contexts, 0);
for (const option of ['reducedMotion', 'saveData', 'hidden']) {
  const test = runtime({ [option]: true }); await test.boot();
  assert.equal(test.calls.contexts, 0, `${option} keeps original images without a GPU context`);
  assert.ok(!test.cover.classList.contains('has-lensing'));
}
for (const option of ['noWebGL', 'compileFailure', 'linkFailure', 'uploadFailure', 'artUploadFailure', 'mipmapFailure', 'decodeFailure', 'artDecodeFailure', 'no2D', 'drawFailure', 'firstDrawError']) {
  const test = runtime({ [option]: true }); await test.boot();
  assert.ok(!test.cover.classList.contains('has-lensing'), `${option} restores original art`);
  assert.equal(test.frames.size, 0, `${option} cannot leave a render loop running`);
  if (!['noWebGL', 'decodeFailure', 'artDecodeFailure'].includes(option)) assert.ok(test.calls.deleted.length, `${option} releases GPU objects`);
  const contexts = test.calls.contexts;
  await test.visibility(false); await test.visibility(true); await test.boot();
  assert.equal(test.calls.contexts, contexts, `${option} does not retry a broken renderer`);
}

const lazy = runtime();
assert.equal(lazy.frames.size, 0, 'No work before hero intersection');
await lazy.visibility(true); assert.equal(lazy.calls.contexts, 0);
await lazy.step(); assert.equal(lazy.calls.contexts, 0, 'Wait for first paint opportunity');
await lazy.step(); assert.equal(lazy.calls.contexts, 0, 'Wait for idle work');
await lazy.flushIdle(); assert.ok(lazy.cover.classList.contains('has-lensing'));
assert.equal(lazy.skyline.style.transform, 'matrix(1.04, 0, 0, 1.04, -1, 0)', 'Freeze the current sky pose without a handover jump');
assert.equal(lazy.calls.shaders.length, 2, 'Exactly one vertex and one fragment shader');
assert.equal(lazy.calls.uploads, 2, 'Reuse the decoded skyline and fallback artwork');
assert.equal(lazy.calls.mipmaps, 1, 'Photograph gets mipmaps');
assert.ok(lazy.calls.filters.some(([parameter, value]) => parameter === lazy.gl.TEXTURE_MIN_FILTER && value === lazy.gl.LINEAR_MIPMAP_LINEAR), 'Artwork uses trilinear minification');
assert.equal(lazy.calls.resamples[0][0], lazy.diskImage, 'Resample the existing fallback image without a request');
assert.deepEqual(lazy.calls.resamples[0].slice(3), [2048, 1024], 'Power-of-two artwork dimensions enable WebGL1 mipmaps');
assert.equal(lazy.calls.uniforms.get('uArtwork'), 1, 'Artwork and sky use separate texture units');
const limited = runtime({ textureLimit: 256 }); await limited.boot();
assert.deepEqual(limited.calls.resamples[0].slice(3), [256, 256], 'Artwork resampling respects the GPU texture limit');
assert.equal(lazy.canvas.width, 1053, 'Phone DPR capped at 1.5');
await lazy.resize(1440); await lazy.step();
assert.equal(lazy.canvas.width, 1296, 'Desktop DPR capped at 2');
await lazy.step(); assert.ok(lazy.calls.draws.at(-1) > 0, 'Simulation advances');

const active = runtime({ withSite: true }); await active.boot(); await active.step(); await active.step();
const pausedTime = active.calls.draws.at(-1);
active.toggle.emit('click');
assert.equal(active.toggle.attributes.get('aria-pressed'), 'true');
assert.equal(active.toggle.textContent, 'Resume sky motion');
assert.equal(active.cover.dataset.skyMotion, 'paused'); assert.equal(active.frames.size, 0);
await active.step(60000); assert.equal(active.calls.draws.at(-1), pausedTime, 'Pause draws no frames');
active.toggle.emit('click'); await active.step();
assert.equal(active.calls.draws.at(-1), pausedTime, 'Resume excludes time spent paused');
assert.equal(active.toggle.attributes.get('aria-pressed'), 'false');
await active.step(); assert.ok(active.calls.draws.at(-1) > pausedTime);
await active.visibility(false); assert.equal(active.frames.size, 0, 'Offscreen observer cancels RAF');
const offscreenTime = active.calls.draws.at(-1);
await active.step(60000); await active.visibility(true); await active.step();
assert.equal(active.calls.draws.at(-1), offscreenTime, 'Offscreen time is excluded');
active.document.hidden = true; active.document.emit('visibilitychange');
assert.equal(active.frames.size, 0, 'Hidden tab cancels RAF');
const hiddenTime = active.calls.draws.at(-1);
await active.step(60000); active.document.hidden = false; active.document.emit('visibilitychange'); await active.step();
assert.equal(active.calls.draws.at(-1), hiddenTime, 'Hidden time is excluded');
active.context.emit('pagehide'); assert.equal(active.frames.size, 0, 'Pagehide suspends for BFCache');
await active.step(60000); active.context.emit('pageshow'); await active.step();
assert.equal(active.calls.draws.at(-1), hiddenTime, 'BFCache restore does not jump');
active.reduced.matches = true; active.reduced.emit('change');
assert.ok(!active.cover.classList.contains('has-lensing')); assert.equal(active.frames.size, 0);
assert.equal(active.skyline.style.transform, '', 'Fallback restores the original sky styles');
assert.equal(active.toggle.hidden, true, 'Runtime reduced motion restores static cover');
active.reduced.matches = false; active.reduced.emit('change'); await active.boot();
assert.ok(active.cover.classList.contains('has-lensing'), 'Motion preference reversal can enhance again');
active.connection.saveData = true; active.connection.emit('change');
assert.ok(!active.cover.classList.contains('has-lensing')); assert.equal(active.frames.size, 0);
assert.equal(active.toggle.hidden, true, 'Save-Data also stops the original CSS motion');
active.connection.saveData = false; active.connection.emit('change'); await active.boot();
active.gl.lost = true; let prevented = false;
active.canvas.emit('webglcontextlost', { preventDefault() { prevented = true; } });
assert.ok(prevented); assert.ok(!active.cover.classList.contains('has-lensing')); assert.equal(active.frames.size, 0);

const pausedResize = runtime(); await pausedResize.boot();
pausedResize.cover.dataset.skyMotion = 'paused'; pausedResize.cover.emit('sky-motion-change');
await pausedResize.resize(1920);
assert.equal(pausedResize.canvas.width, 1296, 'A paused shader resizes once without resuming');
assert.equal(pausedResize.frames.size, 0);
pausedResize.skyline.emit('load'); await pausedResize.boot();
assert.equal(pausedResize.calls.uploads, 4, 'A responsive sky switch replaces both textures');
assert.equal(pausedResize.frames.size, 0, 'Responsive source changes preserve pause');
pausedResize.diskImage.emit('load'); await pausedResize.boot();
assert.equal(pausedResize.calls.uploads, 6, 'Responsive artwork switch also refreshes both textures');
assert.equal(pausedResize.frames.size, 0, 'Artwork refresh preserves pause');

for (const options of [{ noObserver: true, noIdle: true }, { noDecode: true }]) {
  const test = runtime(options); await test.boot();
  assert.ok(test.cover.classList.contains('has-lensing'), 'Older optional APIs retain a lazy enhancement path');
}
const pending = runtime(); await pending.visibility(true); await pending.step(); await pending.step();
await pending.visibility(false); await pending.flushIdle();
assert.equal(pending.calls.contexts, 0, 'Becoming offscreen before idle prevents initialization');
const pendingHide = runtime(); await pendingHide.visibility(true); await pendingHide.step(); await pendingHide.step();
pendingHide.context.emit('pagehide'); await pendingHide.flushIdle();
assert.equal(pendingHide.calls.contexts, 0, 'Pagehide cancels pending initialization');
let finishDecode;
const decoding = runtime();
decoding.skyline.decode = () => new Promise(resolve => { finishDecode = resolve; });
await decoding.boot(); decoding.context.emit('pagehide'); finishDecode(); await decoding.settle();
assert.equal(decoding.calls.contexts, 0, 'Pagehide during image decoding cannot create a late render loop');
const oldAPIOptions = { noObserver: true, offscreen: true };
const oldAPI = runtime(oldAPIOptions); await oldAPI.boot();
assert.equal(oldAPI.calls.contexts, 0, 'Without observers, an offscreen hero still defers initialization');
oldAPIOptions.offscreen = false; oldAPI.context.emit('scroll'); await oldAPI.boot();
assert.ok(oldAPI.cover.classList.contains('has-lensing'), 'Scroll visibility fallback can initialize');

for (const options of [{}, { drawCost: 20 }]) {
  const test = runtime(options); await test.boot();
  for (let i = 0; i < 60; i++) await test.step();
  const before = test.calls.draws.length;
  for (let i = 0; i < 60; i++) await test.step();
  const draws = test.calls.draws.length - before;
  assert.ok(options.drawCost ? draws >= 29 && draws <= 31 : draws >= 59, `Frame budget: ${draws} draws per simulated second`);
}
const slow = runtime(); await slow.boot();
for (let i = 0; i < 30; i++) await slow.step(40);
const slowBefore = slow.calls.draws.length;
for (let i = 0; i < 60; i++) await slow.step();
assert.ok(slow.calls.draws.length - slowBefore <= 31, 'Slow frame delivery lowers the render target to 30fps');

// Verify correspondence with the actual CSS rules and test conservative foreground exclusion.
assert.match(css, /\.night-cover \{[^}]*overflow: hidden;/);
assert.match(css, /\.cover-disk, \.cover-lensing \{ position: absolute; z-index: -1;/);
assert.match(css, /\.cover-lensing \{ width: calc\(var\(--disk-width\) \* 1\.8\);[^}]*aspect-ratio: 1; height: auto; opacity: 0; pointer-events: none;/);
assert.match(css, /\.night-cover\.has-lensing \.cover-disk \{ opacity: 0; transition: opacity 800ms ease;/);
assert.match(css, /--disk-left: calc\(58% - var\(--disk-width\) \/ 2\);[^}]*--disk-top: calc\(22% - var\(--disk-width\) \* 9 \/ 32\)/);
assert.match(source, /float deflection = 7\.0 \/ max\(r, 0\.25\) \* influence/);
assert.match(source, /float alpha = skyMask \* influence;/);
assert.match(source, /uv\.y = min\(uv\.y, skyBoundary\(uv\.x\) - 0\.032\)/);
assert.match(source, /texture2D\(uArtwork,/);
assert.match(source, /pow\(max\(diskRadius, 1\.2\), 1\.5\)/);
assert.match(source, /float photonLock/);
assert.match(source, /color = 1\.0 - \(1\.0 - color\) \* \(1\.0 - clamp\(emission/);
assert.doesNotMatch(source, /diskLight|radius \* (72|137|18|37)\.0/, 'No high-frequency procedural ring bands');
const boundary = x => x >= 0.625 && x <= 0.945 ? Math.min(0.64, 0.638 - 0.256 * Math.sqrt(Math.max(0, 1 - ((x - 0.785) / 0.16) ** 2))) : x > 0.945 ? 0.64 : 0.735;
const foregroundPoints = [[0.64, 0.64], [0.68, 0.48], [0.72, 0.42], [0.75, 0.40], [0.785, 0.392], [0.83, 0.48], [0.88, 0.60], [0.97, 0.66], [0.30, 0.78]];
assert.ok(0.20 < boundary(0.50) - 0.028, 'Mask positive control leaves open sky available');
for (const [x, y] of foregroundPoints) assert.ok(y >= boundary(x) - 0.012, `Dome and mountain point ${x},${y} is fully excluded`);
for (const width of [390, 1024, 1280, 1440, 1920]) {
  const test = runtime({ width }); await test.boot();
  const origin = test.calls.uniforms.get('uSkyOrigin'), scale = test.calls.uniforms.get('uSkyScale');
  const artOrigin = test.calls.uniforms.get('uArtOrigin'), artScale = test.calls.uniforms.get('uArtScale');
  const centerUV = [(0.51 - artOrigin[0]) / artScale[0], (0.48 - artOrigin[1]) / artScale[1]];
  const center = [origin[0] + scale[0] * centerUV[0], origin[1] + scale[1] * centerUV[1]];
  const field = test.canvas.getBoundingClientRect(), art = test.disk.getBoundingClientRect();
  assert.ok(Math.abs(field.width / art.width - 1.8) < 1e-9, `${width}: field is 2.4 times the artwork's roughly 75 percent luminous width`);
  assert.ok(Math.abs((field.left + centerUV[0] * field.width) - (art.left + 0.51 * art.width)) < 0.001, 'Field expansion preserves horizontal horizon position');
  assert.ok(Math.abs((field.top + centerUV[1] * field.height) - (art.top + 0.48 * art.height)) < 0.001, 'Field expansion preserves vertical horizon position');
  // The radial fade must be fully transparent before any square field edge.
  const edgeRadius = Math.min(centerUV[0], 1 - centerUV[0], centerUV[1], 1 - centerUV[1]) * field.width / (art.width * 0.109);
  assert.ok(edgeRadius > 8.0, `${width}: all rectangle edges are beyond the radial alpha falloff`);
  assert.ok(center[1] < boundary(center[0]) - 0.08, `${width}: horizon center stays in open sky`);
  // Sample the full shadow and upper arch, not only the center.
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16) {
    const x = center[0] + Math.cos(angle) * 0.109 * 1.48 * scale[0] / artScale[0];
    const y = center[1] + Math.sin(angle) * 0.109 * 1.48 * 16 / 9 * scale[1] / artScale[1];
    assert.ok(y < boundary(x) - 0.028, `${width}: horizon and arch clear the foreground`);
  }
}
console.log('LENSING VERIFIED: lazy start, failure cleanup, reduced motion, Save-Data, pause/resume, visibility, BFCache, two-texture reuse, mipmapped photograph, responsive source refresh, expanded field sizing, DPR caps, simulated 60/30fps pacing, shader contract and five-width foreground geometry');
