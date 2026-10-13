// Sonda de materiais efetivamente usados; rollbacks R3 seguem os pixels independentes.
// Não aprova aparência: contexto, crops e regressões em R3-MATERIAL-CORRECTIONS.md.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const { THREE, MAPS, initTextures, seedRandom } = await import('./harness.mjs');
const {registerDetail,detailFor} = await import('../../public/js/textures.js');
const { preloadPropGeometry } = await import('./prop-geometry-fixture.mjs');
globalThis.localStorage = {getItem:()=>'{"quality":"medium"}',setItem(){}};
let fail = 0;
for (const id of ['escadao','mansao','penitenciaria','corrego','amazonia']) {
  await preloadPropGeometry(MAPS[id].props); seedRandom(12345);
  let serragemSource;
  const load = THREE.TextureLoader.prototype.load;
  if(id==='amazonia') THREE.TextureLoader.prototype.load=function(url,...args){
    const texture=load.call(this,url,...args);
    if(url==='/img/textures/tex_madeira_serragem.webp')serragemSource=texture.source;
    return texture;
  };
  let world;
  try { const scene=new THREE.Scene(); world=MAPS[id].build(scene,initTextures()); }
  finally { THREE.TextureLoader.prototype.load=load; }
  const meshes=[];world.root.traverse(o=>{if(o.isMesh)meshes.push(o);});
  let material;
  if(id==='escadao') material=meshes.find(o=>Math.abs(o.position.x-1.5)<.0001 && Math.abs(o.position.y-.6)<.0001 && Math.abs(o.position.z-14.5)<.0001)?.material;
  if(id==='mansao') material=meshes.find(o=>o.userData.mansaoFeature==='interior-surface' && o.userData.surfaceType==='floor')?.material;
  if(id==='penitenciaria') material=meshes.find(o=>o.material?.map?.name==='penitenciaria-poca')?.material;
  if(id==='corrego') material=meshes.find(o=>o.material?.color?.getHex()===0xffffff && o.material?.roughness===.97 && Math.abs((o.material?.map?.repeat?.x||0)-1.6)<.001)?.material;
  if(id==='amazonia') material=meshes.find(o=>o.material?.color?.getHex()===0x76604a && o.material?.roughness===1 && o.material?.map?.repeat?.x===5)?.material;
  assert.ok(material,`Cannot measure runtime material: ${id}`);
  const measure = m => id==='escadao' ? !!m.map && m.map.image?.width===128 : id==='mansao' ? m.map?.image?.width===256 && m.roughness===.58 : id==='corrego' ? m.map?.name==='corrego-directed-plaster' && m.map.image?.width===256 : id==='amazonia' ? !!serragemSource && m.map?.source===serragemSource && m.map.repeat.x===5 && m.map.repeat.y===4 && m.color.getHex()===0x76604a && m.roughness===1 : m.roughness===.07 && m.metalness===.4;
  const data={id,map:material.map?.name,size:material.map?.image?.width,roughness:material.roughness,metalness:material.metalness,...(id==='amazonia'?{usesLoadedSerragem:material.map?.source===serragemSource,repeat:material.map?.repeat?.toArray()}:{}),pass:measure(material)};
  console.log(JSON.stringify(data));if(!data.pass)fail++;
  if(process.argv.includes('--self-test') && data.pass){
    const mutant=material.clone();
    if(id==='escadao' || id==='corrego')mutant.map=null;
    if(id==='amazonia'){
      const rejected=execFileSync('git',['show','bd7ec16336204211b2a18c31ddc3eef95b1b2c19:public/js/map_surface_finish.js'],{encoding:'utf8'});
      const create=new Function('THREE','registerDetail','detailFor',rejected.replace(/^import[^\n]*\n/gm,'').replace(/\bexport\s+(?=(?:function|const|let)\b)/g,'')+';return forestLeafLitter;')(THREE,registerDetail,detailFor);
      const leaf=create(5,4);leaf.name=material.map.name;
      mutant.map=leaf;assert.notEqual(mutant.map.source,material.map.source,'R2 leaf replacement did not apply');
    }
    if(id==='mansao')mutant.map=new THREE.DataTexture(new Uint8Array(16*16*4),16,16);
    if(id==='penitenciaria'){mutant.roughness=.34;mutant.metalness=.04;}
    assert.ok(!measure(mutant),`Blind runtime mutation: ${id}`);console.log('Mutante morto: '+id);
  }
}
assert.equal(fail,0,'Runtime fabrication gaps remain; this probe does not judge appearance.');
