import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const root=process.cwd();
const temp=await fs.mkdtemp(path.join(os.tmpdir(),'singularity-content-'));
const build=()=>spawnSync(process.execPath,[path.join(root,'node_modules/@11ty/eleventy/cmd.cjs')],{cwd:temp,encoding:'utf8',timeout:60000});
try {
  await fs.cp(path.join(root,'src'),path.join(temp,'src'),{recursive:true});
  await fs.copyFile(path.join(root,'eleventy.config.js'),path.join(temp,'eleventy.config.js'));
  await fs.copyFile(path.join(root,'package.json'),path.join(temp,'package.json'));
  await fs.symlink(path.join(root,'node_modules'),path.join(temp,'node_modules'),'dir');
  await sharp({create:{width:320,height:180,channels:3,background:'#131518'}}).jpeg().toFile(path.join(temp,'src/images/articles/small-fixture.jpg'));
  const body = (slug,date,extra='') => `---\ntitle: "Fixture ${slug}"\ndescription: "Future content pipeline verification."\ndate: ${date}\ncategory: Agents\nhero: /images/articles/${slug==='fixture-00' ? 'small-fixture' : 'when-the-agents-reach-for-the-open-web'}.jpg\nheroAlt: "A server aisle with books"\nauthor: Singularity Review\ntags: ["Fixture"]\n${extra}---\nA future story written without any configuration change.\n`;
  for(let i=0;i<18;i++) await fs.writeFile(path.join(temp,`src/articles/2026-10-09-fixture-${String(i).padStart(2,'0')}.md`),body(`fixture-${String(i).padStart(2,'0')}`,`2099-01-01T${String(23-i).padStart(2,'0')}:00:00Z`, i===0 ? 'updated: 2026-10-10T09:00:00Z\nheroCaption: "Original editorial image"\n' : '').replace('category: Agents', i===17 ? 'category: Research' : 'category: Agents'));
  await fs.writeFile(path.join(temp,'src/articles/2026-10-09-draft-fixture.md'),body('draft-fixture','2099-01-01T23:59:00Z','draft: true\n'));
  // Real published articles count toward pagination, so derive expectations from them.
  const realCount=(await Promise.all((await fs.readdir(path.join(root,'src/articles'))).filter(f=>f.endsWith('.md')).map(f=>fs.readFile(path.join(root,'src/articles',f),'utf8')))).filter(t=>!/^draft:\s*true/m.test(t)).length;
  const total=realCount+18;
  let result=build();assert.equal(result.status,0,result.stdout+result.stderr);
  const home=await fs.readFile(path.join(temp,'_site/index.html'),'utf8');
  const second=await fs.readFile(path.join(temp,'_site/page/2/index.html'),'utf8');
  const third=await fs.readFile(path.join(temp,'_site/page/3/index.html'),'utf8');
  const links = value => [...value.matchAll(/class="card-link" href="([^"]+)"/g)].map(x=>x[1]);
  assert.equal(links(home).length,10);assert.equal(links(second).length,10);assert.equal(links(third).length,Math.min(10,total-20));
  const all=[...links(home),...links(second),...links(third)];assert.equal(new Set(all).size,Math.min(30,total));assert.equal(all[0],'/articles/fixture-00/');
  assert.match(home,/href="\/page\/2\/" data-load-more/);assert.match(second,/href="\/page\/3\/" data-load-more/);if(total<=30) assert.ok(!third.includes('data-load-more'));
  assert.match(second,/rel="canonical" href="[^" ]+\/page\/2\/"/);
  assert.equal(await fs.access(path.join(temp,'_site/articles/draft-fixture')).then(()=>true,()=>false),false);
  const small=await fs.readFile(path.join(temp,'_site/articles/fixture-00/index.html'),'utf8');
  const smallHero=small.match(/<img[^>]*class="hero-image"[^>]*>/)[0];
  assert.match(smallHero,/width="320" height="180"/);
  assert.match(small,/<figcaption>Original editorial image<\/figcaption>/);
  const ld=JSON.parse(small.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);assert.equal(ld.dateModified,'2026-10-10T09:00:00.000Z');
  const research=await fs.readFile(path.join(temp,'_site/category/research/index.html'),'utf8');assert.match(research,/href="\/category\/research\/" aria-current="page"/);
  assert.ok(!/480w|800w|1280w/.test(smallHero));
  assert.match(await fs.readFile(path.join(temp,'_site/sitemap.xml'),'utf8'),/\/page\/3\//);
  await fs.writeFile(path.join(temp,'src/articles/2026-10-09-missing-hero.md'),body('missing-hero','2026-10-09T23:58:00Z').replace('/images/articles/when-the-agents-reach-for-the-open-web.jpg','/images/articles/missing-hero.jpg'));
  result=build();assert.notEqual(result.status,0);assert.match(result.stdout+result.stderr,/Missing hero for article/);assert.match(result.stdout+result.stderr,/missing-hero/);
  console.log(`CONTENT VERIFIED: ${total} published posts (${realCount} real + 18 fixtures),`+' paginated, ten per page, draft exclusion, small-image no-upscale, and clear missing-hero failure');
} finally { await fs.rm(temp,{recursive:true,force:true}); }
