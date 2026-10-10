// Decoded-image regression model only. This does not execute WebGL or establish GPU acceptance.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {coverLayout} from './static-layout.mjs';
import {surfaces,statementBoxes,statementScrim,ink,smooth,luminance} from './hero-pixels.mjs';
import {createHash} from 'node:crypto';
const html=await fs.readFile('_site/index.html','utf8'),css=await fs.readFile('src/css/style.css','utf8');
assert.equal(css,await fs.readFile('_site/css/style.css','utf8'));
assert.equal(await fs.readFile('src/js/lensing.js','utf8'),await fs.readFile('_site/js/lensing.js','utf8'));
const shader=await fs.readFile('src/js/lensing.js','utf8');
assert.match(shader,/smoothstep\(3\.8, 4\.5, r\)/);
assert.match(shader,/1\.0 - smoothstep\(1\.6, 2\.6, r\)/);
function checkFlowContract(source) {
  const compact = source.replace(/\/\/[^\n]*/g, '').replace(/\s+/g, '');
  for (const snippet of [
    'float breathing = 1.0 + 0.08 * sin(uTime * 0.785398);',
    'float deflection = 1.4 / max(r, 0.25) * influence * influence * influence * breathing;',
    'float swirlMask = 1.0 - smoothstep(1.6, 2.6, r);',
    'float dragAngle = 0.35 * 1.69 / max(r * r, 1.69) * sin(uTime * 1.570796) * swirlMask;',
    'vec2 bent = rotate(p - direction * deflection, dragAngle);',
    'vec2 displacement = (bent - p + drift * swirlMask) * skyMask;',
    'offset.y = min(offset.y, 1.2);',
    'return offset * min(1.0, 0.9 / max(length(offset), 0.001));',
    'uv = baseUV + boundedOffset((uv - baseUV) / skyUnits) * skyUnits;',
    'float orbit = uTime * 1.0 / pow(max(diskRadius, 1.2), 1.5);',
    'float moving = max(diskMask, swirlMask) * (1.0 - photonLock);',
    'vec3 emission = mix(original, original * 0.10 + orbitLight * 0.90, moving);',
    'vec3(-0.023529), vec3(0.023529)',
    'emission = mix(emission, quietEmission, smoothstep(2.2, 2.6, r));',
  ]) assert.ok(compact.includes(snippet.replace(/\s+/g, '')), 'CPU model equation matches shader: ' + snippet);
  assert.ok(!/dragAngle=uTime|dragRate/.test(compact), 'No accumulating rotation or outer advection');
}
checkFlowContract(shader);
for (const [from, to] of [['0.35 * 1.69','uTime * 1.69'], ['smoothstep(1.6, 2.6, r)','smoothstep(1.6, 4.5, r)'], ['0.9 / max(length(offset)','9.0 / max(length(offset)'], ['0.08 * sin(uTime','0.12 * sin(uTime']]) {
  assert.throws(() => checkFlowContract(shader.replace(from, to)), 'Unsafe shader equation positive control fails');
}
const layout=coverLayout(css,1440,900);
const url=(name)=>{const variants=html.match(new RegExp('<div class="'+name+'"[^>]*>(.*?)</div>','s'))[1].match(/<source type="image\/avif"[^>]*srcset="([^\"]+)"/)[1].split(', ').map(value=>value.split(' '));return (variants.find(([,width])=>parseInt(width)>=1440)||variants.at(-1))[0];};
const surface=await surfaces(layout,1440,url('cover-sky'),url('cover-disk'));
const boxes=await statementBoxes(layout,1440,900),scrim=statementScrim(layout,boxes,1440,900);
const point=(x,y,time)=>{if(y<0)return ink;const alpha=scrim(x,y),pixel=surface.background(x,y,time);return pixel.map((value,i)=>value*(1-alpha)+ink[i]*alpha);};
const disk=layout.disk,center=[disk.left+disk.width*.51,disk.top+disk.height*.48];
const ridge=x=>.84-.08*smooth(.38,.46,x)-.18*Math.exp(-(((x-.64)/.064)**2))-.18*smooth(.8,.88,x);
const counts={total:0,one:0,three:0,innerOne:0,innerThree:0,shadowTotal:0,shadowChanged:0,foregroundTotal:0,foregroundChanged:0};
// DPR 1, every second pixel, document y 50 to 610. Above the cover is treated as unchanged.
for(let y=50-layout.mastheadHeight;y<610-layout.mastheadHeight;y+=2)for(let x=0;x<1440;x+=2){
 const a=point(x+.5,y+.5,0),b=point(x+.5,y+.5,1),c=point(x+.5,y+.5,3),diff=p=>p.reduce((sum,value,i)=>sum+Math.abs(value-a[i]),0);
 const one=diff(b),three=diff(c);counts.total++;if(one>30)counts.one++;if(three>30)counts.three++;
 const radius=Math.hypot(x+.5-center[0],y+.5-center[1])/(disk.width*.109);
 if(radius<2.6){if(one>30)counts.innerOne++;if(three>30)counts.innerThree++;}
 if(radius<1){counts.shadowTotal++;if(three>.01)counts.shadowChanged++;}
 const sourceX=(layout.sky.crop.left+(x+.5-layout.sky.left)/layout.sky.width*layout.sky.crop.width)/5472;
 const sourceY=(layout.sky.crop.top+(y+.5-layout.sky.top)/layout.sky.height*layout.sky.crop.height)/3648;
 if(sourceX>=0 && sourceX<=1 && sourceY>=ridge(sourceX)-.02 && sourceY<=1){counts.foregroundTotal++;if(three>30)counts.foregroundChanged++;}
}
const onePercent=100*counts.one/counts.total,threePercent=100*counts.three/counts.total;
assert.ok(onePercent>=1.5,'CPU motion model: '+onePercent.toFixed(2)+' percent at 1s; require 1.5');
assert.ok(threePercent>=4,'CPU motion model: '+threePercent.toFixed(2)+' percent at 3s; require 4');
assert.ok(counts.innerOne>counts.one/2 && counts.innerThree>counts.three/2, 'Most motion comes from inside the bounded flow region');
assert.equal(counts.shadowChanged,0,'The shadow remains unchanged in the model');
assert.ok(counts.foregroundTotal>10000,'The foreground sample covers the ridge and dome');
assert.equal(counts.foregroundChanged,0,'The protected ridge, dome and lower foreground remain unchanged in the model');
// Compare the unmasked photograph field so the CSS fade and text scrim cannot hide a seam.
// Check both sky alone and the full supplied-artwork composite against its static fallback.
const holeRadius = disk.width * .109;
const inViewport = (x, y) => x >= 0 && x < 1440 && y >= 0 && y < layout.bandHeight;
const difference = (a, b) => a.reduce((sum, value, i) => sum + Math.abs(value - b[i]), 0) / 3;
function checkSeam(rows) {
  assert.ok(rows.length > 0);
  for (const row of rows) {
    assert.ok(row.count > 100, 'Each seam circle has a substantial visible arc');
    assert.ok(row.compositeMAE < 6 && row.skyMAE < 6,
      'Seam at ' + row.time + 's, r=' + row.radius.toFixed(2) + ': ' + row.compositeMAE.toFixed(3) + '/255 composite, ' + row.skyMAE.toFixed(3) + '/255 sky');
  }
}
const seam = [];
for (const time of [0, 5, 30, 120, 600]) for (let index = 0; index <= 38; index++) {
  const radius = 2.6 + index * .05;
  let count = 0, compositeDifference = 0, skyDifference = 0;
  for (let angle = 0; angle < 360; angle++) {
    const theta = angle * Math.PI / 180;
    const x = center[0] + Math.cos(theta) * holeRadius * radius;
    const y = center[1] + Math.sin(theta) * holeRadius * radius;
    if (!inViewport(x, y)) continue;
    compositeDifference += difference(surface.photograph(x, y, time), surface.photograph(x, y, null));
    skyDifference += difference(surface.skyPhotograph(x, y, time), surface.skyPhotograph(x, y, null));
    count++;
  }
  seam.push({time, radius, count, compositeMAE: compositeDifference / count, skyMAE: skyDifference / count});
}
checkSeam(seam);
assert.throws(() => checkSeam([{count:360,time:600,radius:3,compositeMAE:6.01,skyMAE:0}]), 'Known seam control fails');

// Cartesian samples have equal pixel area. Linear sRGB luminance avoids hiding a bright disc in encoded-byte averages.
const annulus = [];
for (let y = 0; y < layout.bandHeight; y += 4) for (let x = 0; x < 1440; x += 4) {
  const radius = Math.hypot(x + .5 - center[0], y + .5 - center[1]) / holeRadius;
  if (radius >= 1.6 && radius <= 4.5) annulus.push([x + .5, y + .5]);
}
assert.ok(annulus.length > 10000, 'Annulus has broad equal-area pixel coverage');
const average = values => values.reduce((sum, value) => sum + value, 0) / values.length;
const staticCompositeLuminance = average(annulus.map(([x, y]) => luminance(surface.photograph(x, y, null))));
const staticSkyLuminance = average(annulus.map(([x, y]) => luminance(surface.skyPhotograph(x, y, null))));
const winding = [];
for (let time = 0; time <= 600; time += 10) {
  const compositeMean = average(annulus.map(([x, y]) => luminance(surface.photograph(x, y, time))));
  const skyMean = average(annulus.map(([x, y]) => luminance(surface.skyPhotograph(x, y, time))));
  winding.push({time, compositeMean, skyMean, compositeDeltaPercent:100 * (compositeMean / staticCompositeLuminance - 1), skyDeltaPercent:100 * (skyMean / staticSkyLuminance - 1)});
}
function checkWinding(rows) {
  assert.ok(rows.length > 0);
  for (const row of rows) assert.ok(Math.abs(row.compositeDeltaPercent) <= 4 && Math.abs(row.skyDeltaPercent) <= 4,
    'No winding at ' + row.time + 's: ' + row.compositeDeltaPercent.toFixed(3) + '% composite, ' + row.skyDeltaPercent.toFixed(3) + '% sky');
}
checkWinding(winding);
assert.throws(() => checkWinding([{time:600,compositeDeltaPercent:4.01,skyDeltaPercent:0}]), 'Known winding control fails');

// Every visible DPR-1 pixel outside the flow, including the area past the influence edge.
let outerCount = 0, outerMaxRGBSum = 0, outerChanged = 0, outerSkyMaxRGBSum = 0;
for (let y = 0; y < layout.bandHeight; y++) for (let x = 0; x < 1440; x++) {
  const radius = Math.hypot(x + .5 - center[0], y + .5 - center[1]) / holeRadius;
  if (radius <= 2.6) continue;
  const delta = 3 * difference(surface.photograph(x + .5, y + .5, 600), surface.photograph(x + .5, y + .5, 0));
  const skyDelta = 3 * difference(surface.skyPhotograph(x + .5, y + .5, 600), surface.skyPhotograph(x + .5, y + .5, 0));
  outerCount++; outerMaxRGBSum = Math.max(outerMaxRGBSum, delta); outerSkyMaxRGBSum = Math.max(outerSkyMaxRGBSum, skyDelta);
  if (delta > 40) outerChanged++;
}
function checkOuter(changed, maximum) { assert.equal(changed, 0); assert.ok(maximum <= 40, 'Outer time-600 RGB sum is at most 40/765'); }
checkOuter(outerChanged, outerMaxRGBSum);
assert.throws(() => checkOuter(1, 40.01), 'Known long-time outer motion control fails');

let maxSampleDisplacement = 0, maxHorizonOffset = -Infinity, maxInnerSampleAngle = 0, sampleCount = 0;
for (const time of [0, 1, 3, 5, 30, 120, 600]) for (const radius of [.5,1,1.3,1.6,2,2.59,2.6,3,4,4.49]) for (let angle = 0; angle < 360; angle += 3) {
  const theta = angle * Math.PI / 180, x = center[0] + Math.cos(theta) * holeRadius * radius, y = center[1] + Math.sin(theta) * holeRadius * radius;
  if (!inViewport(x, y)) continue;
  for (const offset of surface.samples(x, y, time)) {
    maxSampleDisplacement = Math.max(maxSampleDisplacement, Math.hypot(...offset));
    maxHorizonOffset = Math.max(maxHorizonOffset, offset[1]); sampleCount++;
    if (radius === 1.3) {
      const p = [Math.cos(theta) * radius, Math.sin(theta) * radius], bent = p.map((value, i) => value + offset[i]);
      maxInnerSampleAngle = Math.max(maxInnerSampleAngle, Math.abs(Math.atan2(p[0] * bent[1] - p[1] * bent[0], p[0] * bent[0] + p[1] * bent[1])));
    }
  }
}
assert.ok(sampleCount > 20000);
assert.ok(maxInnerSampleAngle <= .35, 'Actual sample angle at r=1.3 stays within .35 radians, including drift and smear');
assert.ok(maxSampleDisplacement <= .9 + 1e-12 && maxHorizonOffset <= 1.2, 'Every sampled tap includes foreground clipping and smear within its budget');

const summary = {
  onePercent, threePercent,
  seamMaxComposite: Math.max(...seam.map(row => row.compositeMAE)),
  seamMaxSky: Math.max(...seam.map(row => row.skyMAE)),
  windingMaxCompositePercent: Math.max(...winding.map(row => Math.abs(row.compositeDeltaPercent))),
  windingMaxSkyPercent: Math.max(...winding.map(row => Math.abs(row.skyDeltaPercent))),
  outerCount, outerChanged, outerMaxRGBSum, outerSkyMaxRGBSum,
  sampleCount, maxSampleDisplacement, maxHorizonOffset, maxInnerSampleAngle,
};
await fs.mkdir('.audit/skyline',{recursive:true});
const fingerprints = {};
for (const file of ['src/js/lensing.js','src/css/style.css','scripts/hero-pixels.mjs','scripts/verify-lensing-pixels.mjs','_site/index.html', '_site' + url('cover-sky'), '_site' + url('cover-disk')]) fingerprints[file] = createHash('sha256').update(await fs.readFile(file)).digest('hex');
await fs.writeFile('.audit/skyline/motion-model.json',JSON.stringify({
  method:'CPU reconstruction of decoded shipped AVIF and shader equations, including the exact noise function. No WebGL or GPU is executed. Motion uses the CSS scrim/fade, DPR 1 and a two-pixel stride in document y 50 to 610. Seam uses 39 circles, 360 angles and the unmasked photograph field. No winding uses a four-pixel equal-area stride and linear sRGB luminance every 10 seconds. Outer motion checks every visible DPR-1 pixel. Static composite means the photograph plus supplied stationary artwork, and the sky-only checks independently compare with the unchanged photograph. Real GPU and CLS acceptance are owner-run.',
  fingerprints, ...counts, ...summary, staticCompositeLuminance, staticSkyLuminance, annulusSampleCount:annulus.length, seam, winding,
},null,2)+'\n');
console.log('LENSING PIXEL MODEL VERIFIED: ' + onePercent.toFixed(2) + '% at 1s, ' + threePercent.toFixed(2) + '% at 3s; seam ' + summary.seamMaxComposite.toFixed(3) + '/255 composite and ' + summary.seamMaxSky.toFixed(3) + '/255 sky; no-winding max ' + summary.windingMaxCompositePercent.toFixed(3) + '% composite and ' + summary.windingMaxSkyPercent.toFixed(3) + '% sky; time-600 outer max ' + outerMaxRGBSum.toFixed(3) + '/765, ' + outerChanged + ' pixels over 40/765; max sample displacement ' + maxSampleDisplacement.toFixed(3) + ' hole radii. Shadow and foreground unchanged. Real GPU acceptance remains owner-run.');
