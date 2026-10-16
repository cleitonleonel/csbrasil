import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const source=execFileSync('git',['rev-parse','HEAD'],{cwd:process.cwd(),encoding:'utf8'}).trim();
const out='/tmp/corosolto-balistica-qa'; mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--mute-audio','--js-flags=--max-old-space-size=768']});
const results=[];
try {
 for(const [width,height] of [[1200,800],[1280,720]]) {
  const page=await browser.newPage({viewport:{width,height}}), errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4387/?debug=1&auto=E,mst&map=praca_poderes&vmauthored=0&bloom=0',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__game?.state==='live',null,{timeout:120000});
  await page.waitForTimeout(3000);
  await page.evaluate(async()=>{
   const T=await import('/vendor/three.module.js'), g=window.__game;
   window.__qaT=T;g.update=()=>{};g.el.banner.style.display='none';document.getElementById('aviso-software')?.remove();g.world.root.visible=false;g.world.occluders=[];g.player.alive=false;
   for(const b of g.bots){b.alive=false;b.mesh.group.visible=false;}
   const alvo=g.bots[0];alvo.alive=true;alvo.team='B';alvo.pos.set(0,0,0);alvo.mesh.group.position.copy(alvo.pos);alvo.mesh.group.visible=true;
   g.camera.position.set(3,2.3,5);g.camera.lookAt(0,.8,0);
   g._damage=()=>{};for(const k of ['_fleshImpact','_bloodSpatter','_noteHit'])g[k]=()=>{};
   const grid=new T.GridHelper(12,24,0x475569,0x334155);g.scene.add(grid);
   window.__qaAlvo=alvo;window.__qaObjects=[];
   const nota=document.createElement('div');nota.id='qa-nota';nota.style='position:fixed;top:12px;left:12px;z-index:99999;background:#111c;color:white;padding:10px;font:16px sans-serif';document.body.appendChild(nota);
  });
  for(const postura of [0,1]){
   const runtime=await page.evaluate(postura=>{
    const T=window.__qaT,g=window.__game,alvo=window.__qaAlvo;
    for(const obj of window.__qaObjects)g.scene.remove(obj);window.__qaObjects=[];
    for(const t of g.tracers)g.scene.remove(t.m);g.tracers=[];
    alvo.crouchF=postura;document.getElementById('qa-nota').textContent='Hitbox analítica + personagem GLB; VM legada: '+(postura?'postura agachada (sem animar a malha)':'em pé');
    const add=o=>{g.scene.add(o);window.__qaObjects.push(o);};
    const head=new T.Mesh(new T.SphereGeometry(.25,16,12),new T.MeshBasicMaterial({color:0x22d3ee,wireframe:true,depthTest:false}));
    head.position.set(0,1.6-.52*postura,0);add(head);
    const body=new T.Mesh(new T.CylinderGeometry(.45,.45,1.15-.52*postura,16),new T.MeshBasicMaterial({color:0xf472b6,wireframe:true,depthTest:false}));
    body.position.set(0,(.2+1.35-.52*postura)/2,0);add(body);
    const pe=new T.Mesh(new T.SphereGeometry(.45,16,12),body.material);pe.position.set(0,.2,0);add(pe);
    const b={pos:new T.Vector3(0,0,5),team:'E',weapon:'shotgun',mag:8,skill:1,mesh:{isGLB:false}};
    const origem=g._origemTiroBot(b),dir=g._miraTiroBot(alvo).sub(origem).normalize();
    let seed=973;const old=Math.random;Math.random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
    let shot;try{shot=g._dispararBot(b,origem,dir,{dmg:14,pellets:9,spreadHip:.06,short:'M3'},false);g._rastroTiroBot(origem,dir,shot.point,shot);}finally{Math.random=old;}
    g._updateFx(.025);g.renderer.render(g.scene,g.camera);
    return {postura,authored:!!g.vm.authored?.active,characterGLB:!!alvo.mesh.isGLB,raios:shot.raios.length,rastros:g.tracers.length,pontos:shot.raios.map(r=>r.point.toArray())};
   },postura);
   const file=`${width}x${height}-${postura?'agachado':'em-pe'}.png`;
   await page.screenshot({path:`${out}/${file}`});results.push({file,width,height,source,...runtime});
  }
  results.push({width,height,errors});await page.close();
 }
}finally{await browser.close();writeFileSync(`${out}/manifest.json`,JSON.stringify(results,null,2));}
console.log(JSON.stringify(results.map(({pontos,...r})=>r)));
