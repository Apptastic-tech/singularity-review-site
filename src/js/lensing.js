// A local WebGL1 enhancement of the supplied cover. The original pictures stay in the DOM.
const vertexSource = `
attribute vec2 aPosition;
varying vec2 vUV;
void main() {
  vUV = vec2(aPosition.x * 0.5 + 0.5, 0.5 - aPosition.y * 0.5);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const fragmentSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vUV;
uniform sampler2D uSky;
uniform sampler2D uArtwork;
uniform vec2 uArtOrigin;
uniform vec2 uArtScale;
uniform vec2 uSkyOrigin;
uniform vec2 uSkyScale;
uniform vec2 uResolution;
uniform float uTime;
const vec3 amber = vec3(0.949, 0.663, 0.231);
const vec3 paper = vec3(1.0, 0.949, 0.843);
const vec3 ground = vec3(0.04314, 0.04706, 0.05490);

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  // A bounded hash avoids large arguments on mediump mobile fragment processors.
  vec3 h = fract(vec3(i.x, i.y, i.x) * 0.1031);
  h += dot(h, h.yzx + 19.19);
  float a = fract((h.x + h.y) * h.z);
  h = fract(vec3(i.x + 1.0, i.y, i.x + 1.0) * 0.1031);
  h += dot(h, h.yzx + 19.19);
  float b = fract((h.x + h.y) * h.z);
  h = fract(vec3(i.x, i.y + 1.0, i.x) * 0.1031);
  h += dot(h, h.yzx + 19.19);
  float c = fract((h.x + h.y) * h.z);
  h = fract(vec3(i.x + 1.0, i.y + 1.0, i.x + 1.0) * 0.1031);
  h += dot(h, h.yzx + 19.19);
  float d = fract((h.x + h.y) * h.z);
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Conservative Kitt Peak silhouette in the new photograph's source UV coordinates.
// The white dome is at x .61, y .70; the right tree starts above the mountain.
float skyBoundary(float x) {
  float mountain = 0.84 - 0.08 * smoothstep(0.38, 0.46, x);
  float domeDistance = (x - 0.61) / 0.05;
  float dome = 0.10 * exp(-domeDistance * domeDistance);
  float tree = 0.18 * smoothstep(0.80, 0.88, x);
  return mountain - dome - tree;
}

vec3 sky(vec2 uv) {
  uv.y = min(uv.y, skyBoundary(uv.x) - 0.032);
  return texture2D(uSky, clamp(uv, 0.001, 0.999)).rgb * 0.76 + ground * 0.24;
}

vec2 rotate(vec2 p, float angle) {
  float c = cos(angle), s = sin(angle);
  return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

vec3 artwork(vec2 uv) {
  vec2 inside = step(vec2(0.0), uv) * step(uv, vec2(1.0));
  return texture2D(uArtwork, clamp(uv, 0.0, 1.0)).rgb * inside.x * inside.y;
}

void main() {
  // Map the larger field back to the unchanged photograph's 16:9 source frame.
  vec2 artUV = uArtOrigin + vUV * uArtScale;
  vec2 p = (artUV - vec2(0.51, 0.48)) * vec2(1.0, 0.5625) / 0.109;
  float r = length(p);
  vec2 direction = p / max(r, 0.001);
  vec2 baseUV = uSkyOrigin + vUV * uSkyScale;
  float skyMask = 1.0 - smoothstep(skyBoundary(baseUV.x) - 0.11,
    skyBoundary(baseUV.x) - 0.04, baseUV.y);
  // Circular falloff reaches zero before the square canvas edges, even off center.
  float influence = 1.0 - smoothstep(4.8, 8.0, r);
  float alpha = skyMask * influence;

  // The lens equation's critical radius lies outside the shadow, in visible sky.
  float deflection = 7.0 / max(r, 0.25) * influence;
  vec2 bent = p - direction * deflection;
  vec2 skyUnits = vec2(0.109, 0.109 / 0.5625) / uArtScale * uSkyScale;
  vec2 drift = vec2(sin(uTime * 0.018), cos(uTime * 0.015) - 1.0) * 0.9;
  vec2 displacedUV = baseUV + (bent - p + drift * influence) * skyUnits * skyMask;
  vec2 tangent = vec2(-direction.y, direction.x);
  // Several linear samples smear drifting stars tangentially near the critical curve.
  float criticalDistance = (r - 2.65) / 0.32;
  float critical = exp(-criticalDistance * criticalDistance);
  vec2 smear = tangent * skyUnits * (0.02 + critical * 0.22);
  vec3 background = sky(displacedUV) * 0.4;
  background += (sky(displacedUV + smear) + sky(displacedUV - smear)) * 0.2;
  background += (sky(displacedUV + smear * 2.0) + sky(displacedUV - smear * 2.0)) * 0.1;
  // A faint warm Einstein arc follows actual lensed sky detail, without striped noise.
  vec3 einstein = mix(amber, paper, 0.3) * critical * (0.012 + max(0.0, background.r - ground.r) * 0.32);

  // Rotate texture coordinates along the inclined plane. Inner matter orbits faster.
  vec2 inclined = rotate(p, 0.22);
  vec2 plane = vec2(inclined.x, inclined.y / 0.24);
  float diskRadius = length(plane);
  float orbit = uTime * 0.16 / pow(max(diskRadius, 1.2), 1.5);
  vec2 orbitPlane = rotate(plane, -orbit);
  vec2 orbitPoint = rotate(vec2(orbitPlane.x, orbitPlane.y * 0.24), -0.22);
  vec2 orbitUV = vec2(0.51, 0.48) + orbitPoint * vec2(0.109, 0.109 / 0.5625);
  vec3 original = artwork(artUV);
  vec3 orbitLight = artwork(orbitUV);
  float diskMask = (1.0 - smoothstep(0.32, 0.72, abs(inclined.y)))
    * smoothstep(1.1, 1.6, diskRadius) * (1.0 - smoothstep(3.8, 5.0, diskRadius));
  // Preserve the photographed silhouette, lensed upper arch and crisp photon ring.
  float photonLock = 1.0 - smoothstep(0.04, 0.16, abs(r - 0.96));
  float moving = diskMask * (1.0 - photonLock);
  vec3 emission = mix(original, original * 0.80 + orbitLight * 0.20, moving);
  float shimmer = 1.0 + 0.045 * sin(uTime * 0.38 + plane.x * 0.7)
    + 0.025 * (noise(plane * 0.55 + vec2(uTime * 0.025, 0.0)) - 0.5);
  float approaching = 1.0 - 0.075 * plane.x / max(diskRadius, 1.0);
  emission *= mix(1.0, shimmer * approaching, moving);

  float aa = 1.5 * uArtScale.x / (uResolution.x * 0.109);
  float shadow = smoothstep(0.86 - aa, 0.86 + aa, r);
  vec3 color = background * shadow + einstein * shadow;
  // Screen composite the real emission over the sky; source black contributes no light.
  color = 1.0 - (1.0 - color) * (1.0 - clamp(emission, 0.0, 1.0));
  // Premultiply explicitly so transparent mask edges cannot leak bright RGB.
  gl_FragColor = vec4(clamp(color, 0.0, 1.0) * alpha, alpha);
}`;

const cover = document.querySelector('[data-cover]');
if (cover) enhanceCover(cover);

function enhanceCover(cover) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const skyline = cover.querySelector('.cover-sky-image');
  const canvas = cover.querySelector('[data-lensing]');
  const disk = cover.querySelector('.cover-disk');
  const diskImage = cover.querySelector('.cover-disk-image');
  if (!skyline || !canvas || !disk || !diskImage) return;
  const originalSkyTransform = skyline.style.transform;

  let visible = false;
  let failed = false;
  let awaitingSource = false;
  let initializing = false;
  let renderer = null;
  let frame = 0;
  let idle = 0;
  let paint = 0;
  let time = 0;
  let previous = 0;
  let lastDraw = 0;
  let interval = 1000 / 60;
  let slowFrames = 0;
  let slowDraws = 0;
  let geometryDirty = true;
  let pageActive = true;
  const eligible = () => !failed && !awaitingSource && !reducedMotion.matches && !connection?.saveData;
  const running = () => eligible() && pageActive && visible && !document.hidden && cover.dataset.skyMotion === 'running';

  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    lastDraw = 0;
  };
  const fallback = () => {
    stop();
    cover.classList.remove('has-lensing');
    skyline.style.transform = originalSkyTransform;
    renderer?.dispose();
    renderer = null;
    geometryDirty = true;
  };
  const fail = error => {
    // Resizing can precede the browser's larger responsive image loading.
    // Keep the sharp photo until that source arrives, then allow enhancement again.
    if (error?.code === 'SKY_SOURCE_PENDING') awaitingSource = true;
    else failed = true;
    fallback();
  };

  const draw = timestamp => {
    frame = 0;
    if (!renderer || !running()) { stop(); return; }
    const delta = previous ? timestamp - previous : 0;
    previous = timestamp;
    // Pauses and long browser stalls cannot advance the simulation in a single jump.
    time += Math.min(delta, 100) / 1000;
    if (interval < 30 && delta > 24 && delta < 250) slowFrames++;
    else slowFrames = Math.max(0, slowFrames - 1);
    if (slowFrames >= 24) interval = 1000 / 30;
    if (!lastDraw || timestamp - lastDraw >= interval - 1) {
      try {
        if (geometryDirty) { renderer.resize(); geometryDirty = false; }
        const started = performance.now();
        renderer.draw(time);
        if (performance.now() - started > 12) slowDraws++;
        else slowDraws = Math.max(0, slowDraws - 1);
        if (slowDraws >= 24) interval = 1000 / 30;
        lastDraw = timestamp;
      } catch (error) { fail(error); return; }
    }
    frame = requestAnimationFrame(draw);
  };

  const initialize = async () => {
    if (renderer || initializing || !eligible() || !pageActive || !visible || document.hidden) return;
    initializing = true;
    try {
      // Reuse the responsive sky image after paint; the lead story photo retains LCP priority.
      const decode = async image => {
        if (typeof image.decode === 'function') await image.decode();
        else if (!image.complete) await new Promise((resolve, reject) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', reject, { once: true });
        });
        if (!image.naturalWidth) throw new Error('Cover image unavailable');
      };
      await Promise.all([decode(skyline), decode(diskImage)]);
      if (!eligible() || !pageActive || !visible || document.hidden) return;
      renderer = createRenderer(canvas, skyline, disk, diskImage);
      // Stop the CSS sky and disk drift only once a valid renderer can replace them.
      // Capture the current sky transform so stars outside the patch cannot jump at handover.
      skyline.style.transform = getComputedStyle(skyline).transform;
      cover.classList.add('has-lensing');
      renderer.resize();
      renderer.draw(time);
      if (renderer.gl.getError() !== renderer.gl.NO_ERROR) throw new Error('First draw failed');
      geometryDirty = false;
      if (running()) frame = requestAnimationFrame(draw);
    } catch (error) { fail(error); }
    finally { initializing = false; }
  };

  const schedule = () => {
    if (!eligible()) { fallback(); return; }
    if (!pageActive || !visible || document.hidden) { stop(); return; }
    if (renderer) {
      geometryDirty = true;
      if (!running()) stop();
      else if (!frame) frame = requestAnimationFrame(draw);
      return;
    }
    if (idle || paint || initializing) return;
    // Two animation frames leave a paint opportunity before requesting idle work.
    paint = requestAnimationFrame(() => {
      paint = requestAnimationFrame(() => {
        paint = 0;
        if ('requestIdleCallback' in window) idle = requestIdleCallback(() => { idle = 0; initialize(); }, { timeout: 1200 });
        else initialize();
      });
    });
  };

  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); fail(); });
  cover.addEventListener('sky-motion-change', schedule);
  reducedMotion.addEventListener('change', schedule);
  connection?.addEventListener?.('change', schedule);
  document.addEventListener('visibilitychange', schedule);
  const refreshTexture = () => {
    // A responsive source switch needs a fresh texture, including when the shader is paused.
    if (failed) return;
    awaitingSource = false;
    fallback();
    schedule();
  };
  skyline.addEventListener('load', refreshTexture);
  diskImage.addEventListener('load', refreshTexture);
  const resize = () => {
    geometryDirty = true;
    if (awaitingSource) { awaitingSource = false; schedule(); return; }
    if (renderer && pageActive && !running() && eligible() && visible && !document.hidden) {
      try { renderer.resize(); renderer.draw(time); } catch (error) { fail(error); }
    }
  };
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(cover);
  window.addEventListener('resize', resize, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }).observe(cover);
  } else {
    const checkVisibility = () => {
      const rect = cover.getBoundingClientRect();
      visible = rect.bottom > 0 && rect.top < innerHeight;
      schedule();
    };
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });
    checkVisibility();
  }
  window.addEventListener('pagehide', () => {
    pageActive = false;
    stop();
    cancelAnimationFrame(paint);
    paint = 0;
    if (idle) cancelIdleCallback(idle);
    idle = 0;
  });
  window.addEventListener('pageshow', () => { pageActive = true; schedule(); });
}

function createRenderer(canvas, skyline, disk, diskImage) {
  // A null context or any compile/link/upload error leaves both original pictures untouched.
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
  if (!gl) throw new Error('No WebGL');
  const shaders = [];
  let program, buffer;
  const textures = [];
  // Responsive images report density-corrected natural dimensions. Texture upload
  // uses the decoded resource pixels, so recover the selected width descriptor.
  const sourcePixels = image => {
    const namedWidth = image.currentSrc?.split('?')[0].match(/-(\d+)\.(?:avif|webp|jpe?g)$/)?.[1];
    let width = Number(namedWidth) || 0;
    if (!width && image.currentSrc) {
      const sources = [image, ...(image.closest?.('picture')?.querySelectorAll('source') || [])];
      for (const source of sources) {
        for (const candidate of (source.getAttribute?.('srcset') || '').split(', ')) {
          const match = candidate.match(/^(.+)\s+(\d+)w$/);
          if (match && new URL(match[1], document.baseURI).href === image.currentSrc) width = Number(match[2]);
        }
      }
    }
    width ||= image.naturalWidth;
    return { width, height: Math.round(width * image.naturalHeight / image.naturalWidth) };
  };
  const dispose = () => {
    if (gl.isContextLost()) return;
    shaders.forEach(shader => gl.deleteShader(shader));
    if (program) gl.deleteProgram(program);
    if (buffer) gl.deleteBuffer(buffer);
    textures.forEach(texture => gl.deleteTexture(texture));
  };
  try {
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Shader unavailable');
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Shader compile failure');
      return shader;
    };
    program = gl.createProgram();
    if (!program) throw new Error('Program unavailable');
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Shader link failure');
    gl.useProgram(program);
    buffer = gl.createBuffer();
    if (!buffer) throw new Error('GPU resources unavailable');
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const upload = (image, unit, mipmaps = false) => {
      const texture = gl.createTexture();
      if (!texture) throw new Error('Texture unavailable');
      textures.push(texture);
      gl.activeTexture(unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      let pixels = image;
      if (mipmaps) {
        // WebGL1 needs power-of-two dimensions for complete mipmapped textures.
        // Resample the already loaded photo locally, without any new image request.
        const limit = Math.min(2048, gl.getParameter(gl.MAX_TEXTURE_SIZE));
        const powerOfTwo = value => Math.min(limit, 2 ** Math.ceil(Math.log2(value)));
        pixels = document.createElement('canvas');
        const original = sourcePixels(image);
        pixels.width = powerOfTwo(original.width);
        pixels.height = powerOfTwo(original.height);
        const context = pixels.getContext('2d');
        if (!context) throw new Error('Artwork resampling unavailable');
        context.drawImage(image, 0, 0, pixels.width, pixels.height);
      }
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mipmaps ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      if (mipmaps) gl.generateMipmap(gl.TEXTURE_2D);
    };
    upload(skyline, gl.TEXTURE0);
    upload(diskImage, gl.TEXTURE1, true);
    const uniforms = Object.fromEntries(['uSky', 'uArtwork', 'uArtOrigin', 'uArtScale', 'uSkyOrigin', 'uSkyScale', 'uResolution', 'uTime'].map(name => [name, gl.getUniformLocation(program, name)]));
    gl.uniform1i(uniforms.uSky, 0);
    gl.uniform1i(uniforms.uArtwork, 1);
    return {
      gl, dispose,
      resize() {
        const box = canvas.getBoundingClientRect();
        const skyBox = skyline.getBoundingClientRect();
        const diskBox = disk.getBoundingClientRect();
        gl.uniform2f(uniforms.uArtOrigin, (box.left - diskBox.left) / diskBox.width, (box.top - diskBox.top) / diskBox.height);
        gl.uniform2f(uniforms.uArtScale, box.width / diskBox.width, box.height / diskBox.height);
        const dpr = Math.min(window.devicePixelRatio || 1, innerWidth < 640 ? 1.5 : 2);
        const width = Math.max(1, Math.round(box.width * dpr));
        const height = Math.max(1, Math.round(box.height * dpr));
        if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
        gl.viewport(0, 0, width, height);
        gl.uniform2f(uniforms.uResolution, width, height);
        // Reproduce object-fit: cover, object-position and the existing sky's scale transform.
        const original = sourcePixels(skyline);
        const scale = Math.max(skyBox.width / original.width, skyBox.height / original.height);
        const imageWidth = original.width * scale;
        const imageHeight = original.height * scale;
        const position = getComputedStyle(skyline).objectPosition.split(' ').map(value => parseFloat(value) / 100);
        const left = skyBox.left + (skyBox.width - imageWidth) * position[0];
        const top = skyBox.top + (skyBox.height - imageHeight) * position[1];
        if (original.width > gl.getParameter(gl.MAX_TEXTURE_SIZE) || original.height > gl.getParameter(gl.MAX_TEXTURE_SIZE)) {
          throw new Error('Sky texture exceeds this GPU texture limit');
        }
        if (scale * dpr > 1.01) {
          throw Object.assign(new Error('Waiting for a sky source that covers this pixel density'), { code: 'SKY_SOURCE_PENDING' });
        }
        gl.uniform2f(uniforms.uSkyOrigin, (box.left - left) / imageWidth, (box.top - top) / imageHeight);
        gl.uniform2f(uniforms.uSkyScale, box.width / imageWidth, box.height / imageHeight);
      },
      draw(time) {
        if (gl.isContextLost()) throw new Error('WebGL context lost');
        gl.uniform1f(uniforms.uTime, time);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      },
    };
  } catch (error) { dispose(); throw error; }
}
