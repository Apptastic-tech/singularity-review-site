import fs from 'node:fs/promises';
import path from 'node:path';
const output = path.resolve('.audit/hero-statement/native');
await fs.mkdir(output, { recursive: true });
const mime = { avif:'image/avif',webp:'image/webp',jpeg:'image/jpeg',jpg:'image/jpeg',png:'image/png',svg:'image/svg+xml',woff2:'font/woff2' };
const data = async url => { const file = url.split('?')[0]; const bytes = await fs.readFile('_site' + file);return `data:${mime[file.split('.').at(-1)]};base64,${bytes.toString('base64')}`; };
let css = await fs.readFile('_site/css/style.css', 'utf8');
for (const match of [...css.matchAll(/url\("(\/[^" ]+)"\)/g)]) css = css.replace(match[0], `url("${await data(match[1])}")`);
const metrics = `
(async()=>{
 const errors=[];addEventListener('error',e=>errors.push(e.message));
 if(PerformanceObserver.supportedEntryTypes.includes('layout-shift')) new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.previewCLS=(window.previewCLS||0)+e.value}).observe({type:'layout-shift',buffered:true});
 await document.fonts.ready; await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));
 for(let n=0;n<100;n++)await new Promise(requestAnimationFrame);
 const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y+scrollY,width:r.width,height:r.height,bottom:r.bottom+scrollY}};
 const band=document.querySelector('.night-cover'),sky=document.querySelector('.cover-sky-image'),disk=document.querySelector('.cover-disk'),shader=document.querySelector('[data-lensing]');
 const result={viewport:innerWidth+'x'+innerHeight,dpr:devicePixelRatio,overflow:document.documentElement.scrollWidth>innerWidth,cls:window.previewCLS||0,errors,headings:[...document.querySelectorAll('h1,h2,h3')].map(e=>e.textContent.trim())};
 if(band){
 result.band=box(band);result.disk=box(disk);result.lead=box(document.querySelector('.card--lead .card-title'));result.photo=box(document.querySelector('.card--lead .card-media'));result.statement=box(document.querySelector('.hero-statement'));result.lensingRegionBottom=result.disk.y+result.disk.height*.48+result.disk.width*.109*4.5;if(result.statement.y<=Math.max(result.disk.bottom,result.lensingRegionBottom))errors.push('Statement overlaps disk or lensing region');if(document.querySelector('.hero-statement h1').textContent!=='The singularity is already here.'||document.querySelectorAll('.hero-statement p').length!==1||document.querySelector('.hero-description').textContent!=="So many AI breakthroughs land every day that it's hard to keep up. We help you focus on what matters and leave out the noise.")errors.push('Hero copy contract failed');result.shader=band.classList.contains('has-lensing');
 const surface=document.createElement('canvas');surface.width=innerWidth;surface.height=result.band.height;const ctx=surface.getContext('2d');
 const lum=rgb=>rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
 const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
 const sb=result.statement;const scrim=(x,y)=>{const r=Math.hypot((x-sb.x-sb.width/2)/(sb.width/2+400),(y-sb.y-(sb.height+80)/2)/((sb.height+360)/2));const s=[[0,.8],[.8,.74],[.94,.38],[1,0]];let j=1;while(j<s.length-1&&r>s[j][0])j++;const t=Math.max(0,Math.min(1,(r-s[j-1][0])/(s[j][0]-s[j-1][0])));return s[j-1][1]+t*(s[j][1]-s[j-1][1])};
  const ink=[11,12,14],stops=[[0,1],[.62,1],[.70,.92],[.80,.65],[.90,.25],[1,0]];
 const read=(animated)=>{
 ctx.clearRect(0,0,surface.width,surface.height);ctx.globalCompositeOperation='source-over';ctx.filter='none';
 const scale=Math.max(innerWidth/sky.naturalWidth,surface.height/sky.naturalHeight);const sw=sky.naturalWidth*scale,sh=sky.naturalHeight*scale;
 ctx.drawImage(sky,(innerWidth-sw)/2,(surface.height-sh)*.6,sw,sh);
 const d=result.disk;const dy=d.y-result.band.y;
 if(animated){const cb=shader.getBoundingClientRect();ctx.drawImage(shader,cb.x,cb.y+scrollY-result.band.y,cb.width,cb.height)}
 else {ctx.fillStyle='#000';ctx.beginPath();ctx.arc(d.x+d.width*.51,dy+d.height*.48,d.width*.114,0,Math.PI*2);ctx.fill();ctx.globalCompositeOperation='screen';ctx.filter='saturate(.72) brightness(.78)';ctx.drawImage(document.querySelector('.cover-disk-image'),d.x,dy,d.width,d.height);ctx.filter='none';ctx.globalCompositeOperation='source-over'}
 const raw=ctx.getImageData(0,0,surface.width,surface.height).data;
 return [...document.querySelectorAll('.hero-statement h1,.hero-description')].map(e=>{const b=box(e),color=getComputedStyle(e).color.match(/[\\d.]+/g).slice(0,3).map(Number);let minimum=Infinity;for(let y=Math.ceil(b.y-result.band.y);y<b.bottom-result.band.y;y++){const f=y/surface.height;let j=1;while(j<stops.length-1&&f>stops[j][0])j++;const t=(f-stops[j-1][0])/(stops[j][0]-stops[j-1][0]);const alpha=stops[j-1][1]+t*(stops[j][1]-stops[j-1][1]);for(let x=Math.ceil(b.x);x<b.x+b.width;x++){const p=(y*surface.width+x)*4;const opacity=scrim(x,y+result.band.y);const bg=ink.map((v,i)=>(raw[p+i]*alpha+v*(1-alpha))*(1-opacity)+v*opacity);minimum=Math.min(minimum,ratio(color,bg));}}return {text:e.textContent,box:b,minimum}});
 };
 result.fallback=read(false);if(result.shader)result.staticFrame=read(true);
 }
 parent.document.querySelector('pre').textContent=JSON.stringify(result,null,2);
 parent.document.querySelector('textarea').value=JSON.stringify({viewport:result.viewport,overflow:result.overflow,cls:result.cls,band:result.band?.height,disk:result.disk,statementTop:result.statement?.y,lensingRegionBottom:result.lensingRegionBottom,leadY:result.lead?.y,photoY:result.photo?.y,shader:result.shader,fallback:result.fallback?.map(x=>+x.minimum.toFixed(2)),frame:result.staticFrame?.map(x=>+x.minimum.toFixed(2)),errors:result.errors});
 parent.document.querySelector('[data-footer]').onclick=()=>window.scrollTo(0,document.body.scrollHeight);
 parent.document.querySelector('[data-top]').onclick=()=>window.scrollTo(0,0);
 parent.document.querySelector('[data-featured]').onclick=()=>document.querySelector('.author-shelf,.explainer-section,.prose')?.scrollIntoView();
})();`;
for (const [name,route] of [['home','index.html'],['article','articles/when-claude-fills-out-the-wrong-form/index.html'],['featured','featured/index.html'],['explainer','what-is-singularity/index.html'],['about','about/index.html'],['author','authors/ararat-ovsepian/index.html'],['category','category/agents/index.html']]) {
 for (const [width,height] of name==='home'?[[390,844],[768,1024],[1024,768],[1440,900],[1920,1080],[2560,1440]]:[[390,844],[1024,900],[1440,1000]]) {
  let html=await fs.readFile('_site/'+route,'utf8');
  html=html.replace(/<script>\(function\(l,h,t\)[\s\S]*?<\/script>/,'').replace(/<link rel="preload"[^>]+>/g,'').replace(/<link[^>]+href="\/css\/[^>]+>/,`<style>${css}</style>`);
  // One chosen generated image per picture. Data URLs make canvas pixel reads local and untainted.
  for(const match of [...html.matchAll(/<picture>([\s\S]*?)<\/picture>/g)]){
   const image=match[1].match(/<img\b[^>]+>/)[0];const mobile=width<640;const sources=[...match[1].matchAll(/<source\b[^>]+>/g)].map(m=>m[0]);const source=sources.find(s=>s.includes('image/avif')&&(mobile?s.includes('media=')||!sources.some(s=>s.includes('media=')):!s.includes('media=')));
   const variants=[...source.matchAll(/([^", ]+) (\d+)w/g)].map(m=>({url:m[1],width:+m[2]}));
   const chosen=variants.find(v=>v.width>=Math.max(width,name==='home'&&mobile?640:0)*2)||variants.at(-1);
   const tag=image.replace(/\ssrcset="[^"]*"|\ssizes="[^"]*"/g,'').replace(/src="[^"]*"/,`src="${await data(chosen.url)}"`).replace('loading="lazy"','loading="eager"');html=html.replace(match[0],`<picture>${tag}</picture>`);
  }
  for(const match of [...html.matchAll(/<script([^>]*?)src="(\/js\/[^" ]+)"([^>]*)><\/script>/g)]){let js=await fs.readFile('_site'+match[2].split('?')[0],'utf8');if(match[2].includes('lensing'))js=js.replace('alpha: true, premultipliedAlpha','preserveDrawingBuffer: true, alpha: true, premultipliedAlpha');html=html.replace(match[0],`<script${' type="module"'}>${js}</script>`)}
  for(const match of [...html.matchAll(/<img\b[^>]*src="(\/[^" ]+)"[^>]*>/g)]) html=html.replace(match[0],match[0].replace(match[1],await data(match[1])));
  html=html.replace('</body>',`<script>${metrics}</script></body>`);
  const fallbackScript="<script>if(parent.location.search.includes('fallback')){const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl'?null:get.call(this,type,...args)}}<\/script>";
  html=html.replace('<head>','<head>'+fallbackScript);
  const scale=width<=1024?1:1200/width;
  const caseWidth=width<640?390:width<1200?1024:1440;
  html=html.replace(/href="(\/(?:featured|about|what-is-singularity|category\/agents|authors\/ararat-ovsepian|articles\/when-claude-fills-out-the-wrong-form)?\/)"/g,(m,url)=>{const routeName=url.startsWith('/featured')?'featured':url.startsWith('/about')?'about':url.startsWith('/what-is')?'explainer':url.startsWith('/category')?'category':url.startsWith('/authors')?'author':url.startsWith('/articles')?'article':'home';return `href="${routeName}-${caseWidth}.html" target="_top"`});
  const escaped=html.replaceAll('&','&amp;').replaceAll('"','&quot;');
  await fs.writeFile(path.join(output,`${name}-${width}.html`),`<!doctype html><html><head><title>Local review ${name} ${width}</title><style>body{margin:0;background:#222;color:#fff;font:14px system-ui}iframe{border:0;display:block;width:${width}px;height:${height}px;transform:scale(${scale});transform-origin:top left}pre{white-space:pre-wrap}button{padding:8px;margin:8px}textarea{width:100%;height:180px}</style></head><body><a href="home-390.html" style="color:white;margin:8px">Mobile</a><a href="home-1024.html" style="color:white;margin:8px">Tablet</a><a href="home-1440.html" style="color:white;margin:8px">Desktop</a><a href="home-1920.html" style="color:white;margin:8px">Wide</a><a href="home-768.html" style="color:white;margin:8px">768</a><a href="home-2560.html" style="color:white;margin:8px">2560</a><a href="${name}-${width}.html?fallback" style="color:white;margin:8px">Static fallback</a><br><button data-top>Top</button><button data-featured>Next section</button><button data-footer>Footer</button><div style="width:${width*scale}px;height:${height*scale}px"><iframe srcdoc="${escaped}"></iframe></div><textarea aria-label="Measured preview results"></textarea><pre>Rendering local assets</pre></body></html>`);
 }
}
console.log('NATIVE PREVIEWS GENERATED: seven page archetypes, required widths, source pixels and actual DOM geometry; shader buffer retained for measurement only');
