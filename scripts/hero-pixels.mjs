// Decoded-pixel reconstruction. This models CSS and GLSL; it does not execute a GPU.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { fontAt, length } from './static-layout.mjs';
import { heroLines } from './hero-contract.mjs';

export const ink = [11, 12, 14], paper = [244, 241, 234], muted = [200, 205, 209];
export const luminance = rgb => rgb.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0);
export const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
export const clamp = x => Math.max(0, Math.min(1, x));
export const smooth = (a, b, x) => { x = clamp((x - a) / (b - a)); return x * x * (3 - 2 * x); };
const mix = (a, b, amount) => a.map((x, i) => x * (1 - amount) + b[i] * amount);
const screen = (a, b) => a.map((v, i) => 255 - (255 - v) * (1 - b[i] / 255));
const rotate = (p, angle) => [Math.cos(angle) * p[0] - Math.sin(angle) * p[1], Math.sin(angle) * p[0] + Math.cos(angle) * p[1]];
const cache = new Map();
export async function decode(url) {
  if (!cache.has(url)) cache.set(url, sharp('_site' + url).removeAlpha().raw().toBuffer({ resolveWithObject: true }));
  return cache.get(url);
}
function sample(image, x, y) {
  const { data, info } = image;
  x = clamp(x) * (info.width - 1); y = clamp(y) * (info.height - 1);
  const x0 = Math.floor(x), y0 = Math.floor(y), x1 = Math.min(x0 + 1, info.width - 1), y1 = Math.min(y0 + 1, info.height - 1);
  const pixel = (xx, yy) => { const p = (yy * info.width + xx) * info.channels; return [data[p], data[p + 1], data[p + 2]]; };
  return mix(mix(pixel(x0, y0), pixel(x1, y0), x - x0), mix(pixel(x0, y1), pixel(x1, y1), x - x0), y - y0);
}
export function fadeAt(y, bandHeight) {
  const stops = [[0, 1], [.62, 1], [.70, .92], [.80, .65], [.90, .25], [1, 0]], position = y / bandHeight;
  let index = 1; while (index < stops.length - 1 && position > stops[index][0]) index++;
  const [a, av] = stops[index - 1], [b, bv] = stops[index];
  return clamp(av + (bv - av) * (position - a) / (b - a));
}
export async function statementBoxes(layout, width, height) {
  assert.ok(layout.statement.top > Math.max(layout.diskBottom, layout.lensingRegionBottom), 'Statement clears static disk and lensing region');
  const output = path.resolve('.audit/hero-statement/static');
  await fs.mkdir(output + '/font-cache', { recursive: true });
  await fs.writeFile(output + '/fonts.conf', `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd"><fontconfig><dir>${path.resolve('_site/fonts')}</dir><cachedir>${output}/font-cache</cachedir></fontconfig>`);
  // Keep Fontconfig entirely within the ignored evidence directory.
  process.env.FONTCONFIG_FILE = output + '/fonts.conf';
  const result = [];
  let top = layout.statement.top;
  for (const [i, selector] of ['.hero-statement h1', '.hero-description'].entries()) {
    const style = layout.get(selector), font = fontAt(style, width, height);
    if (i) top += length(style.margin.split(' ')[0], width, height);
    const family = style.font.includes('--sans') ? 'Inter Tight' : 'Newsreader';
    const fontFile = path.resolve(`_site/fonts/${family === 'Inter Tight' ? 'inter-tight' : 'newsreader'}-latin-wght-${font.italic ? 'italic' : 'normal'}.woff2`);
    const tracking = (parseFloat(style['letter-spacing']) || 0) * font.fontSize;
    const boxWidth = style['max-width']?.endsWith('em') ? Math.min(layout.statement.width, parseFloat(style['max-width']) * font.fontSize) : layout.statement.width;
    const text = `<span letter_spacing="${Math.round(tracking * 1024)}">${heroLines[i]}</span>`;
    const { data, info } = await sharp({ text: { text, font: `${family} ${font.italic ? 'Italic' : font.weight === 500 ? 'Medium' : ''} ${font.fontSize}`, fontfile: fontFile, width: Math.floor(boxWidth), dpi: 72, rgba: true, wrap: 'word' } }).raw().toBuffer({ resolveWithObject: true });
    let count = 0, inside = false;
    for (let y = 0; y < info.height; y++) {
      let visible = false;
      for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3]) { visible = true; break; }
      if (visible && !inside) count++;
      inside = visible;
    }
    // Pango counts are an independent font metric model, not browser text-wrap: balance.
    const lineCount = Math.max(1, count), boxHeight = lineCount * font.lineHeight;
    result.push({ text: heroLines[i], ...font, modelLineCount: lineCount, left: layout.statement.left + (layout.statement.width - boxWidth) / 2, top, width: boxWidth, height: boxHeight, bottom: top + boxHeight });
    top += boxHeight;
  }
  return result;
}
// Evaluate the actual edgeless CSS scrim, rather than treating its plateau as a rectangle.
export function statementScrim(layout, boxes, width, height) {
  const style = layout.get('.hero-statement::before');
  const values = style.inset.split(/\s+/).map(value => length(value, width, height));
  const [top, right, bottom, left] = [values[0], values[1], values[2] ?? values[0], values[3] ?? values[1]];
  const rx = (layout.statement.width - left - right) / 2;
  const ry = (boxes.at(-1).bottom - layout.statement.top - top - bottom) / 2;
  const center = [layout.statement.left + left + rx, layout.statement.top + top + ry];
  const colors = [...style.background.matchAll(/rgb\(11 12 14 \/ ([.\d]+)\)(?: (\d+)%)?/g)];
  const stops = colors.map(([, opacity, percent], i) => [percent ? +percent / 100 : i === colors.length - 1 ? 1 : 0, +opacity]);
  assert.equal(stops.length, 4);
  return (x, y) => {
    const position = Math.hypot((x - center[0]) / rx, (y - center[1]) / ry);
    let index = 1; while (index < stops.length - 1 && position > stops[index][0]) index++;
    const [a, av] = stops[index - 1], [b, bv] = stops[index];
    return clamp(av + (bv - av) * clamp((position - a) / (b - a)));
  };
}
export async function surfaces(layout, width, skyUrl, artUrl) {
  const skyImage = await decode(skyUrl), artImage = await decode(artUrl), bandHeight = layout.bandHeight;
  const scale = Math.max(width / skyImage.info.width, bandHeight / skyImage.info.height);
  const skyWidth = skyImage.info.width * scale, skyHeight = skyImage.info.height * scale;
  const skyLeft = (width - skyWidth) * .5, skyTop = (bandHeight - skyHeight) * .6;
  const mobile = skyImage.info.width / skyImage.info.height < 1.1;
  const sourceOrigin = mobile ? [2100 / 5472, 500 / 3648] : [0, 0], sourceScale = mobile ? [2800 / 5472, 2800 / 3648] : [1, 1];
  const disk = layout.disk, radius = disk.width * .109;
  const center = [disk.left + disk.width * .51, disk.top + disk.height * .48];
  const boundary = x => {
    x = sourceOrigin[0] + x * sourceScale[0];
    const value = .84 - .08 * smooth(.38, .46, x) - .10 * Math.exp(-(((x - .61) / .05) ** 2)) - .18 * smooth(.80, .88, x);
    return (value - sourceOrigin[1]) / sourceScale[1];
  };
  const skyPixel = (u, v, bent = false) => sample(skyImage, u, bent ? Math.min(v, boundary(u) - .032) : v);
  const artPixel = (u, v, animated) => {
    if (u < 0 || u > 1 || v < 0 || v > 1) return [0, 0, 0];
    const pixel = sample(artImage, u, v);
    const light = pixel.reduce((s, x, i) => s + x * [.2126, .7152, .0722][i], 0);
    // The CSS radial mask and GLSL edge mask use their respective production shapes.
    const ellipse = Math.hypot((u - .51) / .70710678, (v - .48) / .70710678);
    const feather = animated ? smooth(0, .12, Math.min(u, 1 - u)) * smooth(0, .14, Math.min(v, 1 - v)) : 1 - clamp((ellipse - .58) / (.76 - .58));
    return pixel.map(x => (light * .28 + x * .72) * .78 * feather);
  };
  const photograph = (x, y, time = null) => {
    const u = (x - skyLeft) / skyWidth, v = (y - skyTop) / skyHeight;
    const originalSky = skyPixel(u, v);
    const artUV = [(x - disk.left) / disk.width, (y - disk.top) / disk.height];
    const p = [(x - center[0]) / radius, (y - center[1]) / radius], r = Math.hypot(...p);
    if (time == null) {
      const shadow = r < .114 / .109 ? [0, 0, 0] : originalSky;
      return screen(shadow, artPixel(...artUV, false));
    }
    const influence = 1 - smooth(2, 4.5, r), foreground = 1 - smooth(boundary(u) - .04, boundary(u) - .02, v), alpha = foreground * influence;
    if (!alpha) return originalSky;
    const skyMask = 1 - smooth(boundary(u) - .11, boundary(u) - .04, v);
    const direction = p.map(x => x / Math.max(r, .001)), deflection = 1.4 / Math.max(r, .25) * influence ** 3;
    const drift = [Math.sin(time * .018) * .04, (Math.cos(time * .015) - 1) * .04], units = [radius / skyWidth, radius / skyHeight];
    const displaced = [u, v].map((x, i) => x + (-direction[i] * deflection + drift[i] * influence) * units[i] * skyMask);
    const critical = Math.exp(-(((r - 1.18) / .12) ** 2)), tangent = [-direction[1], direction[0]];
    const smear = tangent.map((x, i) => x * units[i] * (.01 + critical * .035));
    let background = skyPixel(...displaced, true).map(x => x * .4);
    for (const [distance, weight] of [[1, .2], [-1, .2], [2, .1], [-2, .1]]) {
      const pixel = skyPixel(displaced[0] + smear[0] * distance, displaced[1] + smear[1] * distance, true);
      background = background.map((x, i) => x + pixel[i] * weight);
    }
    background = mix(originalSky, background, skyMask);
    const inclined = rotate(p, .22), plane = [inclined[0], inclined[1] / .24], diskRadius = Math.hypot(...plane);
    const orbitPlane = rotate(plane, -time * .025 / Math.max(diskRadius, 1.2) ** 1.5), orbitPoint = rotate([orbitPlane[0], orbitPlane[1] * .24], -.22);
    const original = artPixel(...artUV, true), movingPixel = artPixel(.51 + orbitPoint[0] * .109, .48 + orbitPoint[1] * .109 / .5625, true);
    const diskMask = (1 - smooth(.32, .72, Math.abs(inclined[1]))) * smooth(1.1, 1.6, diskRadius) * (1 - smooth(3.8, 5, diskRadius));
    const moving = diskMask * smooth(.04, .16, Math.abs(r - 1.14));
    // Bounded positive shimmer uses the shader's maximum noise contribution.
    const shimmer = (1 + .012 * Math.sin(time * .38 + plane[0] * .7) + .004) * (1 - .04 * plane[0] / Math.max(diskRadius, 1));
    const emission = mix(original, original.map((x, i) => x * .96 + movingPixel[i] * .04), moving).map(x => Math.max(0, Math.min(255, x * (1 - moving + moving * shimmer))));
    const aa = 1.5 / (Math.min(width < 640 ? 1.5 : 2, 2) * radius), shadow = smooth(1.04 - aa, 1.04 + aa, r);
    return mix(originalSky, screen(background.map(x => x * shadow), emission), alpha);
  };
  return { photograph, background: (x, y, time) => mix(ink, photograph(x, y, time), fadeAt(y, bandHeight)) };
}
