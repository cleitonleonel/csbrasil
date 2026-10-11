// Real renderer/embedded font/current roster. Fixture image is not match evidence.
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,writeFileSync,mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import sharp from 'sharp';
import {Resvg} from '@resvg/resvg-js';
let source=readFileSync('src/lib/profile-card.mjs','utf8');
const mutant=process.argv.find(s=>s.startsWith('--mutant='))?.split('=')[1];
if(mutant){
 const patches={'unsafe-source':["p?.source!=='server_verified' || p.visibility!=='public'","false"],'no-portrait':["const image=character&&portrait&&",'const image=false&&character&&portrait&&']};
 if(mutant!=='no-font'){assert(patches[mutant],'Unknown mutant');const [from,to]=patches[mutant];assert(source.includes(from),'Mutation must apply');source=source.replace(from,to);}
}
const {profileCardSvg}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const font=readFileSync('src/lib/font-data.ts','utf8');
const dir=mkdtempSync(path.join(tmpdir(),'profile-contract-')),file=path.join(dir,'bold.ttf');
writeFileSync(file,Buffer.from([...font.matchAll(/'([A-Za-z0-9+/=]+)'/g)].map(m=>m[1]).join(''),'base64'));
const rosterSource=readFileSync('public/js/characters.js','utf8').match(/export const CHARACTERS = ([\s\S]*?\n\]);/);assert(rosterSource);
const roster=vm.runInNewContext(rosterSource[1],{}, {timeout:20000});
const config=readFileSync('astro.config.mjs','utf8');
const prepare=config.slice(config.indexOf('const roster='),config.indexOf('/* MANIFESTO'));
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const {characters,portraits}=await new AsyncFunction('readFileSync','existsSync','sharp',prepare+';return {characters:SOCIAL_CHARACTERS,portraits:SOCIAL_PORTRAITS}')(readFileSync,(await import('node:fs')).existsSync,sharp);
assert.deepEqual(Object.keys(characters).sort(),Array.from(roster,c=>c.id).sort(),'share roster differs from game');
for(const c of roster){assert.equal(characters[c.id].nome,c.name);assert(portraits[c.id]?.startsWith('data:image/png;base64,'),'missing encoded PNG: '+c.id);}
const p={source:'server_verified',visibility:'public',nick:'OG Fixture',handle:'treta_fixture',level:3,points:248,position:17,kills:180,deaths:92,kd:1.96,play_seconds:7380};
const render=svg=>new Resvg(svg,{font:{fontFiles:mutant==='no-font'?[]:[file],loadSystemFonts:false,defaultFontFamily:'DejaVu Sans'},background:'#0c0e11'}).render();
const svg=profileCardSvg(p,characters.canarinho,portraits.canarinho),actual=render(svg),without=render(profileCardSvg(p,characters.canarinho,null));
assert.equal(actual.width,1200);assert.equal(actual.height,630);
const pixels=actual.pixels,blank=without.pixels;
let imagePixels=0,textPixels=0;
for(let y=140;y<505;y++)for(let x=840;x<1140;x++){const i=(y*1200+x)*4;if(pixels[i]!==blank[i] || pixels[i+1]!==blank[i+1] || pixels[i+2]!==blank[i+2])imagePixels++;}
for(let y=110;y<180;y++)for(let x=60;x<800;x++){const i=(y*1200+x)*4;if(pixels[i]>200&&pixels[i+1]>200&&pixels[i+2]>180)textPixels++;}
assert(imagePixels>0,'portrait missing from rendered pixels');assert(textPixels>0,'embedded font does not render nickname');
assert.throws(()=>profileCardSvg({...p,source:'browser'}));assert.throws(()=>profileCardSvg({...p,visibility:'private'}));
assert(!profileCardSvg({...p,nick:'<script>"&'}).includes('<script>'),'nickname escapes XML');
assert(!profileCardSvg(p,characters.canarinho,'https://evil.test/image').includes('https://evil.test'),'no arbitrary image fetch');
mkdirSync('artifacts/social',{recursive:true});writeFileSync('artifacts/social/profile-card-fixture.png',actual.asPng());
console.log(`PASS roster ${roster.length}/${roster.length}; actual portrait ${imagePixels} pixels; embedded nickname ${textPixels} pixels; public verified source; XML/URL guards; PNG1200x630`);
