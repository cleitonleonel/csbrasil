import {chromium} from 'playwright';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const sourceGameSha256=createHash('sha256').update(readFileSync(new URL('../../../../public/js/game.js',import.meta.url))).digest('hex');
import {WEAPONS} from '../../../../public/js/data/weapons.js';
const out=(process.env.BALLISTICS_QA_OUT || '/tmp/corosolto-authored-qa');mkdirSync(out,{recursive:true});
const ids=process.argv.includes('--pilot')?['ak','deagle']:Object.keys(WEAPONS);const results=[];
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--mute-audio','--js-flags=--max-old-space-size=768']});
try{for(const [width,height] of [[1200,800],[1280,720]])for(let off=0;off<ids.length;off+=4){
 const page=await browser.newPage({viewport:{width,height}}),errors=[];await page.addInitScript(()=>{localStorage.setItem('awpbr_settings',JSON.stringify({quality:'low',allyBots:0,enemyBots:1,menuMusic:false,speech:false}));const t=setInterval(()=>{const g=window.__game;if(!g||g.__qaWrapped)return;g.__qaWrapped=true;const u=g.update;g.update=function(dt){if(this.state!=='live')return u.call(this,dt,false);};clearInterval(t);},10);});page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4387/?debug=1&auto=E,mst&map=piscina_treta&vmauthored=1&bloom=0',{waitUntil:'domcontentloaded'});
 console.log('loading',width,height,off);await page.waitForFunction(()=>window.__game?.state==='live',null,{timeout:120000});
 await page.evaluate(()=>{const g=window.__game;g.update=()=>{};g.el.banner.style.display='none';document.getElementById('aviso-software')?.remove();g.world.root.visible=false;for(const c of g.scene.children)if(!c.isLight)c.visible=false;g.renderer.shadowMap.enabled=false;g.player.hp=100;g.player.alive=true;for(const b of g.bots){b.alive=false;b.mesh.group.visible=false;}const n=document.createElement('div');n.id='qa-label';n.style='position:fixed;left:20px;top:20px;background:#111d;color:white;padding:12px;font:16px sans-serif;z-index:99999';document.body.appendChild(n);
 window.__step=(n=1)=>{for(let i=0;i<n;i++){g.time+=1/60;g._updatePlayer(1/60);g._updateFx(1/60);}g._updateHud();g.renderer.autoClear=true;g.renderer.render(g.scene,g.camera);g.renderer.autoClear=false;g.renderer.clearDepth();g.renderer.render(g.vmScene,g.vmCamera);g.renderer.autoClear=true;};});
 for(const id of ids.slice(off,off+4)){
  await page.evaluate(id=>{const g=window.__game;g._switchWeapon(id);window.__step(90);},id);
  await page.waitForFunction(id=>id==='knife'?window.__game.vm.melee?.active:window.__game.vm.authored?.active(id),id,{timeout:60000});
  for(const mode of ['hip','ads','spray']){
   const r=await page.evaluate(({id,mode})=>{const g=window.__game,p=g.player;p.yaw=0;p.pitch=0;g._scope(mode==='ads',true);window.__step(60);let shots=0;if(mode==='spray'){const a=p.ammo[id];const before=a?.mag;for(let i=0;i<360;i++){const mag=a?.mag;g._tryShoot();if(a&&a.mag<mag)shots++;window.__step();if(shots>=Math.min(10,Math.max(1,(before||2)-1))||id==='knife')break;}}document.getElementById('qa-label').textContent=`${id} · ${mode} · assets autorados · QA automatizado`;window.__step();const e=g.vm.authored?.entry(id);return {id,mode,authored:id==='knife'?!!g.vm.melee?.active:g.vm.authored.active(id),key:e?.key,hands:e?.handMeshes?.length,state:e?.state,scoped:p.scoped,fov:g.camera.fov,shots,heapMB:performance.memory?.usedJSHeapSize/1048576,gl:g.renderer.info.memory};},{id,mode});
   if(r.heapMB>350)throw Error('limite de heap '+r.heapMB);const file=`${width}x${height}-${id}-${mode}.png`;await page.screenshot({path:`${out}/${file}`});results.push({sourceGameSha256,width,height,file,...r});writeFileSync(`${out}/manifest.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(r));
  }
 }
 results.push({width,height,batch:off,errors});await page.close();
}}finally{await browser.close();writeFileSync(`${out}/manifest.json`,JSON.stringify(results,null,2));}
