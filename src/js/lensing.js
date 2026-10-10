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

// Conservative silhouette in the original skyline's UV coordinates, including a sky margin.
float skyBoundary(float x) {
  if (x >= 0.625 && x <= 0.945) {
    float cap = (x - 0.785) / 0.16;
    return min(0.64, 0.638 - 0.256 * sqrt(max(0.0, 1.0 - cap * cap)));
  }
  if (x > 0.945) return 0.64;
  return 0.735;
}

vec3 sky(vec2 uv) {
  uv.y = min(uv.y, skyBoundary(uv.x) - 0.032);
  return texture2D(uSky, clamp(uv, 0.001, 0.999)).rgb * 0.76 + ground * 0.24;
}

vec3 diskLight(float radius, float angle) {
  float orbit = angle - uTime * 0.12 / pow(max(radius, 1.0), 0.7);
  // Use periodic angular coordinates so rotating noise has no atan seam.
  float turbulence = noise(vec2(radius * 18.0 + cos(orbit) * 2.0, sin(orbit) * 3.0));
  float bands = 0.60 + 0.23 * sin(radius * 72.0 + turbulence * 8.0 + sin(orbit) * 3.0);
  bands += 0.12 * sin(radius * 137.0 - cos(orbit) * 7.0 + turbulence * 4.0);
  float filaments = 0.6 + 0.4 * noise(vec2(radius * 37.0, cos(orbit) * 7.0 + sin(orbit) * 5.0));
  float approaching = 0.82 - 0.30 * cos(angle);
  float heat = exp(-(radius - 1.15) * 0.65);
  return mix(amber, paper, heat * 0.85) * bands * filaments * approaching * heat * 1.8;
}

void main() {
  // Match the center and size of the supplied 16:9 black hole photograph.
  float aspect = uResolution.y / uResolution.x;
  vec2 p = (vUV - vec2(0.51, 0.48)) * vec2(1.0, aspect) / 0.109;
  float r = length(p);
  vec2 direction = p / max(r, 0.001);
  vec2 baseUV = uSkyOrigin + vUV * uSkyScale;
  float skyMask = 1.0 - smoothstep(skyBoundary(baseUV.x) - 0.028,
    skyBoundary(baseUV.x) - 0.012, baseUV.y);
  vec2 edge = min(vUV, 1.0 - vUV);
  float softEdge = smoothstep(0.0, 0.06, edge.x) * smoothstep(0.0, 0.06, edge.y);
  float influence = 1.0 - smoothstep(2.6, 4.1, r);
  float alpha = softEdge * skyMask * influence;

  // Schwarzschild-style radial deflection k/r, smoothly confined to this sky patch.
  float deflection = 0.82 / max(r, 0.12) * influence;
  vec2 bent = p - direction * deflection;
  vec2 drift = vec2(sin(uTime * 0.013), cos(uTime * 0.011) - 1.0) * 0.012 * influence;
  vec2 displacedUV = baseUV + (bent - p) * vec2(0.109, 0.109 / aspect) * uSkyScale + drift;
  vec2 tangent = vec2(-direction.y, direction.x);
  vec2 smear = tangent * vec2(0.109, 0.109 / aspect) * uSkyScale * 0.045 / max(r * r, 1.0);
  vec3 background = sky(displacedUV) * 0.5 + sky(displacedUV + smear) * 0.25 + sky(displacedUV - smear) * 0.25;

  float aa = 1.5 / (uResolution.x * 0.109);
  float shadow = smoothstep(1.0 - aa, 1.0 + aa, r);
  vec3 color = background * shadow;
  float photonRing = exp(-abs(r - 1.055) * 65.0);
  color += mix(amber, paper, 0.8) * photonRing * shadow * 0.7;

  // Inclined disk, with the approaching left side brighter. Front matter crosses the shadow.
  vec2 inclined = vec2(p.x * 0.976 - p.y * 0.218, p.x * 0.218 + p.y * 0.976);
  vec2 plane = vec2(inclined.x, inclined.y / 0.24);
  float diskRadius = length(plane);
  float diskMask = smoothstep(1.12, 1.30, diskRadius) * (1.0 - smoothstep(2.9, 3.5, diskRadius));
  float front = smoothstep(-0.025, 0.025, inclined.y);
  color += diskLight(diskRadius, atan(plane.y, plane.x + 0.0001)) * diskMask * mix(shadow, 1.0, front);

  // The back of the disk is lensed into an arch over the top of the horizon.
  float archRadius = length(vec2(p.x, p.y / 1.10));
  float archMask = smoothstep(1.04, 1.13, archRadius) * (1.0 - smoothstep(1.30, 1.48, archRadius));
  archMask *= 1.0 - smoothstep(-0.06, 0.10, p.y);
  color += diskLight(1.25 + (archRadius - 1.13) * 4.0, atan(p.y, p.x + 0.0001)) * archMask * shadow;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), alpha);
}`;

const cover = document.querySelector('[data-cover]');
if (cover) enhanceCover(cover);

function enhanceCover(cover) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const skyline = cover.querySelector('.cover-sky-image');
  const canvas = cover.querySelector('[data-lensing]');
  if (!skyline || !canvas) return;
  const originalSkyTransform = skyline.style.transform;

  let visible = false;
  let failed = false;
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
  const eligible = () => !failed && !reducedMotion.matches && !connection?.saveData;
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
  const fail = () => { failed = true; fallback(); };

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
      } catch { fail(); return; }
    }
    frame = requestAnimationFrame(draw);
  };

  const initialize = async () => {
    if (renderer || initializing || !eligible() || !pageActive || !visible || document.hidden) return;
    initializing = true;
    try {
      // Reuse the eager LCP image; never intercept, replace or postpone its loading.
      if (typeof skyline.decode === 'function') await skyline.decode();
      else if (!skyline.complete) await new Promise((resolve, reject) => {
        skyline.addEventListener('load', resolve, { once: true });
        skyline.addEventListener('error', reject, { once: true });
      });
      if (!eligible() || !pageActive || !visible || document.hidden) return;
      if (!skyline.naturalWidth) throw new Error('Skyline unavailable');
      renderer = createRenderer(canvas, skyline);
      // Stop the CSS sky and disk drift only once a valid renderer can replace them.
      // Capture the current sky transform so stars outside the patch cannot jump at handover.
      skyline.style.transform = getComputedStyle(skyline).transform;
      cover.classList.add('has-lensing');
      renderer.resize();
      renderer.draw(time);
      if (renderer.gl.getError() !== renderer.gl.NO_ERROR) throw new Error('First draw failed');
      geometryDirty = false;
      if (running()) frame = requestAnimationFrame(draw);
    } catch { fail(); }
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
  skyline.addEventListener('load', () => {
    // A responsive source switch needs a fresh texture, including when the shader is paused.
    if (renderer) { fallback(); schedule(); }
  });
  const resize = () => {
    geometryDirty = true;
    if (renderer && pageActive && !running() && eligible() && visible && !document.hidden) {
      try { renderer.resize(); renderer.draw(time); } catch { fail(); }
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

function createRenderer(canvas, skyline) {
  // A null context or any compile/link/upload error leaves both original pictures untouched.
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
  if (!gl) throw new Error('No WebGL');
  const shaders = [];
  let program, buffer, texture;
  const dispose = () => {
    if (gl.isContextLost()) return;
    shaders.forEach(shader => gl.deleteShader(shader));
    if (program) gl.deleteProgram(program);
    if (buffer) gl.deleteBuffer(buffer);
    if (texture) gl.deleteTexture(texture);
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
    texture = gl.createTexture();
    if (!buffer || !texture) throw new Error('GPU resources unavailable');
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skyline);
    const uniforms = Object.fromEntries(['uSky', 'uSkyOrigin', 'uSkyScale', 'uResolution', 'uTime'].map(name => [name, gl.getUniformLocation(program, name)]));
    gl.uniform1i(uniforms.uSky, 0);
    return {
      gl, dispose,
      resize() {
        const box = canvas.getBoundingClientRect();
        const skyBox = skyline.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, innerWidth < 640 ? 1.5 : 2);
        const width = Math.max(1, Math.round(box.width * dpr));
        const height = Math.max(1, Math.round(box.height * dpr));
        if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
        gl.viewport(0, 0, width, height);
        gl.uniform2f(uniforms.uResolution, width, height);
        // Reproduce object-fit: cover, object-position and the existing sky's scale transform.
        const scale = Math.max(skyBox.width / skyline.naturalWidth, skyBox.height / skyline.naturalHeight);
        const imageWidth = skyline.naturalWidth * scale;
        const imageHeight = skyline.naturalHeight * scale;
        const position = getComputedStyle(skyline).objectPosition.split(' ').map(value => parseFloat(value) / 100);
        const left = skyBox.left + (skyBox.width - imageWidth) * position[0];
        const top = skyBox.top + (skyBox.height - imageHeight) * position[1];
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
