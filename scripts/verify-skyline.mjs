import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { checkHeroControls } from './hero-contract.mjs';
import { coverLayout, fontAt } from './static-layout.mjs';
import { ink, paper, muted, contrast, fadeAt, statementBoxes, statementScrim, surfaces } from './hero-pixels.mjs';
const css = await fs.readFile('src/css/style.css', 'utf8');
const home = await fs.readFile('_site/index.html', 'utf8');
const shader = await fs.readFile('src/js/lensing.js', 'utf8');
assert.ok(css === await fs.readFile('_site/css/style.css', 'utf8'), 'Pixel oracle uses the current shipped CSS');
assert.ok(shader === await fs.readFile('_site/js/lensing.js', 'utf8'), 'Pixel oracle models the current shipped shader');
checkHeroControls(home, css);
assert.match(css, /\.night-cover \{[^}]*height: max\(640px, calc\(var\(--disk-width\) \* \.7605 \+ 240px\)\); margin: 0;/);
assert.match(css, /height: clamp\(720px, 70vh, 780px\)/);
assert.match(css, /\.skyline-home \.headline-feed \{[^}]*margin-top: 0/);
assert.match(css, /\.card--lead \.card-body \{[^}]*background: transparent/);
assert.doesNotMatch(css, /(?:\.headline-feed|\.card[^{}]*)\s*\{[^}]*margin-(?:top|block-start):\s*-/);
assert.match(css, /\.cover-atmosphere \{[^}]*mask-image: linear-gradient/);
assert.match(css, /rgb\(0 0 0 \/ \.25\) 90%, transparent 100%/);
assert.match(css, /\.cover-sky-image \{[^}]*opacity: 1/);
assert.doesNotMatch(css.match(/\.cover-sky-image \{([^}]+)\}/)[1], /filter|blend|background/);
assert.doesNotMatch(shader, /pointermove|mousemove|uPointer|uCursor|spotlight|vec3 amber/i);
assert.match(shader, /original \* 0\.96 \+ orbitLight \* 0\.04/);
assert.match(shader, /smoothstep\(1\.04 - aa, 1\.04 \+ aa, r\)/);
assert.match(shader, /min\(uv\.x, 1\.0 - uv\.x\)/, 'Artwork edges feather rather than forming an image box');
assert.match(css, /\.footer-columns \{ display: grid; grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
assert.match(css, /\.footer-links a, \.footer-topics a, \.footer-social \.social-link \{ min-height: 32px/);
const picture = home.match(/<div class="cover-sky"[^>]*>(.*?)<\/div>/s)[1];
const sources = [...picture.matchAll(/<source\b([^>]+)>/g)].map(([,s])=>({mobile:/media=/.test(s),type:s.match(/type="([^"]+)"/)[1],variants:[...s.matchAll(/([^", ]+) (\d+)w/g)].map(([,url,w])=>({url,width:+w}))}));
const image = picture.match(/<img\b([^>]+)>/)[1];
sources.push({mobile:false,type:'image/jpeg',variants:[...image.matchAll(/([^", ]+) (\d+)w/g)].map(([,url,w])=>({url,width:+w}))});
for(const source of sources){
 assert.deepEqual(source.variants.map(v=>v.width),source.mobile?[1280,1920,2560]:[1440,1920,2880,3840]);
 for(const v of source.variants){const meta=await sharp('_site'+v.url).metadata();assert.equal(meta.width,v.width);assert.ok(Math.abs(meta.width/meta.height-(source.mobile?1:1.5))<.002);assert.ok(meta.width<=(source.mobile?2800:5472));if(source.type==='image/jpeg')assert.equal(meta.chromaSubsampling,'4:4:4');}
}
assert.match(picture,/sizes="\(max-width: 639px\) 640px, 100vw"/);
// The mobile <source> needs height-aware sizes too, not just the fallback <img>.
assert.ok([...picture.matchAll(/<source media="[^>]+>/g)].every(([s])=>s.includes('sizes="640px"')));
assert.equal(contrast([0,0,0],[255,255,255]),21);
// Edgeless radial scrim (owner: no boxes over imagery). Text sits inside the broad plateau; gate that stop against a white pixel.
const opacity=Number(css.match(/\.hero-statement::before \{[^}]*radial-gradient\(closest-side, [^)]*\)[^)]*rgb\(11 12 14 \/ ([.\d]+)\) 80%/)[1]);
const white=ink.map(v=>v*opacity+255*(1-opacity));
assert.ok(contrast(paper,white)>=3&&contrast(muted,white)>=4.5,'Neutral text scrim passes even under an animated white pixel');
assert.ok(contrast(muted,[255,255,255])<4.5,'Removing the scrim fails the positive contrast control');
// Bind the reconstructed surface to the production masks and grading parameters.
assert.match(css, /#000 62%, rgb\(0 0 0 \/ \.92\) 70%, rgb\(0 0 0 \/ \.65\) 80%, rgb\(0 0 0 \/ \.25\) 90%, transparent 100%/);
assert.match(css, /\.cover-disk picture \{[^}]*mask-image: radial-gradient\(closest-side at 51% 48%, #000 58%, rgb\(0 0 0 \/ \.6\) 80%, transparent 100%\)/, 'Static artwork mask reaches full transparency inside its box, so no rectangle shows in the fallback');
assert.match(css, /filter: saturate\(\.72\) brightness\(\.78\)/);
assert.match(css, /\.hero-statement::before \{[^}]*inset: -140px -400px -220px;[^}]*radial-gradient\(closest-side,[^}]*rgb\(11 12 14 \/ 0\)\)/, 'Scrim fades to fully transparent inside its own bounds, so no edge can show');
assert.doesNotMatch(css, /\.hero-statement::before \{[^}]*mask-composite/);
assert.match(css, /\.cover-sky-image \{[^}]*object-position: 50% 60%/);
const diskPicture=home.match(/<div class="cover-disk"[^>]*>(.*?)<\/div>/s)[1];
const diskVariants=[...diskPicture.match(/<source type="image\/avif"[^>]*>/)[0].matchAll(/([^", ]+) (\d+)w/g)].map(([,url,w])=>({url,width:+w}));
assert.ok(!fadeAt(640,640),'Photograph is completely transparent at the page boundary');
assert.ok(fadeAt(639.5,640)<.002,'The final visible row converges to the page colour');
assert.ok(fadeAt(320,640)>0,'A hard cutoff fails the fade positive control');
const report=[];
for(const [width,height,dpr] of [[320,844,1],[390,844,3],[639,844,1],[640,900,1],[768,1024,1],[1024,768,2],[1440,900,1],[1440,900,2],[1920,1080,1],[2560,1440,1]]){
 const layout=coverLayout(css,width,height),{bandHeight,disk,leadY}=layout,mobile=width<640;
 const requiredWidth=Math.max(width,bandHeight*(mobile?1:1.5))*dpr;
 const request=(mobile?640:width)*dpr;
 const candidates=sources.find(s=>s.mobile===mobile&&s.type==='image/avif').variants;
 const chosen=candidates.find(v=>v.width>=request)||candidates.at(-1);
 assert.ok(chosen.width>=requiredWidth,`${width}@${dpr}: selected source covers both crop dimensions`);
 assert.ok(disk.left>=24&&disk.left+disk.width<=width-24&&disk.top>=16&&disk.top+disk.height<=bandHeight-16,`${width}: complete artwork frame fits with comfortable margin`);
 assert.ok(leadY<(mobile?900:height+80),`${width}: lead headline begins within the required fold`);
 const art=diskVariants.find(v=>v.width>=disk.width*dpr)||diskVariants.at(-1);
 const boxes=await statementBoxes(layout,width,height);
 assert.ok(boxes.at(-1).bottom<bandHeight-16,`${width}: statement fits inside the reserved band`);
 assert.ok(layout.statement.top > layout.diskBottom && layout.statement.top > layout.lensingRegionBottom, width + ': statement clears both artwork and shader region');
 if(width>=960)assert.equal(boxes[0].modelLineCount,1,'Short desktop headline occupies one modeled line');
 assert.ok(boxes[1].fontSize>=19,'Subline remains readable');
 const surface=await surfaces(layout,width,chosen.url,art.url),perLine=[],scrim=statementScrim(layout,boxes,width,height);
 for(const [i,box] of boxes.entries()){
   const minimum={fallback:Infinity,shaderModel0:Infinity,shaderModel60:Infinity};
   const cornerAlpha = Math.min(...[box.left, box.left+box.width].flatMap(x=>[box.top,box.bottom].map(y=>scrim(x,y))));
   const boundPixel=ink.map(value=>value*cornerAlpha+255*(1-cornerAlpha));
   const whitePixelBound=contrast(i===1?muted:paper,boundPixel);
   assert.ok(whitePixelBound>=(i===1?4.5:3), width+': complete text envelope clears the white-pixel bound with actual scrim geometry');
   for(let y=Math.floor(box.top);y<Math.ceil(box.bottom);y++)for(let x=Math.floor(box.left);x<Math.ceil(box.left+box.width);x++){
     for(const [name,time] of [['fallback',null],['shaderModel0',0],['shaderModel60',60]]){
       const opacity=scrim(x+.5,y+.5);
       const background=surface.background(x+.5,y+.5,time).map((v,j)=>v*(1-opacity)+ink[j]*opacity);
       minimum[name]=Math.min(minimum[name],contrast(i===1?muted:paper,background));
     }
   }
   assert.ok(Object.values(minimum).every(value=>value>=(i===1?4.5:3)),`${width}: composed pixels pass line ${i+1}`);
   perLine.push({...box,minimumScrimOpacity:cornerAlpha,whitePixelBound,contrast:minimum});
 }
 // Neutral white-pixel bounds cover every wrapping choice and animation frame,
 // including glyph pixels outside the Pango line-envelope model.
 const boundaryPixel=surface.background(width/2,bandHeight,null);
 assert.ok(boundaryPixel.every((v,i)=>Math.abs(v-ink[i])<1e-9),'No edge or step at the photograph boundary');
 report.push({viewport:`${width}x${height}@${dpr}`,bandHeight,leadHeadlineDocumentY:leadY,chosenSkyWidth:chosen.width,requiredSkyWidth:requiredWidth,chosenArtworkWidth:art.width,disk,diskBottom:layout.diskBottom,lensingRegionBottom:layout.lensingRegionBottom,statementTop:layout.statement.top,perLine});
}
await fs.mkdir('.audit/skyline',{recursive:true});
const fingerprints = {};
for(const file of ['src/index.njk','src/css/style.css','src/js/lensing.js','eleventy.config.js','scripts/hero-pixels.mjs','scripts/static-layout.mjs','scripts/verify-skyline.mjs','src/images/brand/skyline-kittpeak.jpg','src/images/brand/blackhole-wide.jpg','_site/index.html']) fingerprints[file]=createHash('sha256').update(await fs.readFile(file)).digest('hex');
await fs.writeFile('.audit/skyline/measurements.json',JSON.stringify({method:'Current built AVIF pixels composed with the production photograph, artwork, neutral scrim and photographic fade. Per-line envelopes use Sharp/Pango and the shipped fonts. GLSL frames are a CPU reconstruction with a conservative shimmer bound, not GPU execution. Lead Y and artwork bounds derive from current CSS reserved geometry, not browser measurements. Independent white-pixel bounds cover all animation and wrapping choices.',fingerprints,report,animationBound:{headline:contrast(paper,white),description:contrast(muted,white)},renderedReview:'Assigned to the editor; no browser or application was launched.'},null,2)+'\n');
console.log('SKYLINE VERIFIED: exact centered statement, clean fade, separate unboxed lead, feathered artwork, no pointer effects, CSS-derived bounds and fold positions, sharp sources, composed per-line pixels, animation bounds and compact footer');
for(const r of report)console.log(`${r.viewport}: band ${r.bandHeight}px, lead Y ${r.leadHeadlineDocumentY}px, source ${r.chosenSkyWidth}w, contrast fallback ${r.perLine.map(line=>line.contrast.fallback.toFixed(2)).join('/')}, shader model ${r.perLine.map(line=>Math.min(line.contrast.shaderModel0,line.contrast.shaderModel60).toFixed(2)).join('/')}`);

// Static fallback: the disk art screens over the sky as a whole (no dark halo), and the opaque shadow sits beneath it.
assert.match(css, /\.cover-disk \{ mix-blend-mode: screen;/, 'Static disk must screen over the skyline so its black background never darkens the sky');
assert.doesNotMatch(css.match(/\.cover-disk picture \{([^}]+)\}/)[1], /mix-blend-mode/, 'Blend belongs on .cover-disk, not the picture inside it');
assert.match(css, /\.cover-atmosphere::before \{[^}]*z-index: -1;[^}]*border-radius: 50%; background: #000;/, 'Opaque event-horizon shadow drawn beneath the screened disk');
assert.doesNotMatch(css, /\.cover-disk::before/, 'Shadow inside the screened disk would turn transparent');
