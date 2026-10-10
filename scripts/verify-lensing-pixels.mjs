// Decoded-image regression model only. This does not execute WebGL or establish GPU acceptance.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {coverLayout} from './static-layout.mjs';
import {surfaces,statementBoxes,statementScrim,ink,smooth} from './hero-pixels.mjs';
const html=await fs.readFile('_site/index.html','utf8'),css=await fs.readFile('src/css/style.css','utf8');
assert.equal(css,await fs.readFile('_site/css/style.css','utf8'));
assert.equal(await fs.readFile('src/js/lensing.js','utf8'),await fs.readFile('_site/js/lensing.js','utf8'));
const shader=await fs.readFile('src/js/lensing.js','utf8');
assert.match(shader,/smoothstep\(3\.8, 4\.5, r\)/);
assert.match(shader,/0\.18 \* smoothstep\(1\.5, 2\.5, r\)/);
const layout=coverLayout(css,1440,900);
const url=(name)=>{const variants=html.match(new RegExp('<div class="'+name+'"[^>]*>(.*?)</div>','s'))[1].match(/<source type="image\/avif"[^>]*srcset="([^\"]+)"/)[1].split(', ').map(value=>value.split(' '));return (variants.find(([,width])=>parseInt(width)>=1440)||variants.at(-1))[0];};
const surface=await surfaces(layout,1440,url('cover-sky'),url('cover-disk'));
const boxes=await statementBoxes(layout,1440,900),scrim=statementScrim(layout,boxes,1440,900);
const point=(x,y,time)=>{if(y<0)return ink;const alpha=scrim(x,y),pixel=surface.background(x,y,time);return pixel.map((value,i)=>value*(1-alpha)+ink[i]*alpha);};
const disk=layout.disk,center=[disk.left+disk.width*.51,disk.top+disk.height*.48];
const ridge=x=>.84-.08*smooth(.38,.46,x)-.18*Math.exp(-(((x-.64)/.064)**2))-.18*smooth(.8,.88,x);
const counts={total:0,one:0,three:0,shadowTotal:0,shadowChanged:0,foregroundTotal:0,foregroundChanged:0};
// DPR 1, every second pixel, document y 50 to 610. Above the cover is treated as unchanged.
for(let y=50-layout.mastheadHeight;y<610-layout.mastheadHeight;y+=2)for(let x=0;x<1440;x+=2){
 const a=point(x+.5,y+.5,0),b=point(x+.5,y+.5,1),c=point(x+.5,y+.5,3),diff=p=>p.reduce((sum,value,i)=>sum+Math.abs(value-a[i]),0);
 const one=diff(b),three=diff(c);counts.total++;if(one>30)counts.one++;if(three>30)counts.three++;
 const radius=Math.hypot(x+.5-center[0],y+.5-center[1])/(disk.width*.109);
 if(radius<1){counts.shadowTotal++;if(three>.01)counts.shadowChanged++;}
 const sourceX=(layout.sky.crop.left+(x+.5-layout.sky.left)/layout.sky.width*layout.sky.crop.width)/5472;
 const sourceY=(layout.sky.crop.top+(y+.5-layout.sky.top)/layout.sky.height*layout.sky.crop.height)/3648;
 if(sourceX>=0 && sourceX<=1 && sourceY>=ridge(sourceX)-.02 && sourceY<=1){counts.foregroundTotal++;if(three>30)counts.foregroundChanged++;}
}
const onePercent=100*counts.one/counts.total,threePercent=100*counts.three/counts.total;
assert.ok(onePercent>=1.5,'CPU motion model: '+onePercent.toFixed(2)+' percent at 1s; require 1.5');
assert.ok(threePercent>=4,'CPU motion model: '+threePercent.toFixed(2)+' percent at 3s; require 4');
assert.equal(counts.shadowChanged,0,'The shadow remains unchanged in the model');
assert.ok(counts.foregroundTotal>10000,'The foreground sample covers the ridge and dome');
assert.equal(counts.foregroundChanged,0,'The protected ridge, dome and lower foreground remain unchanged in the model');
await fs.mkdir('.audit/skyline',{recursive:true});
await fs.writeFile('.audit/skyline/motion-model.json',JSON.stringify({method:'CPU reconstruction, two-pixel sample stride, decoded shipped AVIF, CSS fade and scrim. Shimmer uses a conservative noise bound. No WebGL or GPU is executed. Real GPU acceptance is owner-run.',...counts,onePercent,threePercent},null,2)+'\n');
console.log('LENSING PIXEL MODEL VERIFIED: '+onePercent.toFixed(2)+' percent at 1s, '+threePercent.toFixed(2)+' percent at 3s, unchanged shadow and lower foreground. Real GPU measurements are still required.');
