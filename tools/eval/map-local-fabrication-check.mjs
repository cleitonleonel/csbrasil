// R1 MED32 Escadão a: cover cube without finish; Mansão floor's 16px slab has
// wide grout; Penitenciária c: low-roughness metal puddle produces large gold glare.
// Runtime material/data probe only. Independent renderer A/B owns visual verdict.
import assert from 'node:assert/strict';
const { THREE, MAPS, initTextures, seedRandom } = await import('./harness.mjs');
const { preloadPropGeometry } = await import('./prop-geometry-fixture.mjs');
globalThis.localStorage = {getItem:()=>'{"quality":"medium"}',setItem(){}};
let fail = 0;
for (const id of ['escadao','mansao','penitenciaria','corrego','amazonia']) {
  await preloadPropGeometry(MAPS[id].props); seedRandom(12345);
  const scene = new THREE.Scene(), world = MAPS[id].build(scene,initTextures());
  const meshes=[];world.root.traverse(o=>{if(o.isMesh)meshes.push(o);});
  let material;
  if(id==='escadao') material=meshes.find(o=>Math.abs(o.position.x-1.5)<.0001 && Math.abs(o.position.y-.6)<.0001 && Math.abs(o.position.z-14.5)<.0001)?.material;
  if(id==='mansao') material=meshes.find(o=>o.userData.mansaoFeature==='interior-surface' && o.userData.surfaceType==='floor')?.material;
  if(id==='penitenciaria') material=meshes.find(o=>o.material?.map?.name==='penitenciaria-poca')?.material;
  if(id==='corrego') material=meshes.find(o=>o.material?.color?.getHex()===0xffffff && o.material?.roughness===.97 && Math.abs((o.material?.map?.repeat?.x||0)-1.6)<.001)?.material;
  if(id==='amazonia') material=meshes.find(o=>o.material?.color?.getHex()===0x76604a && o.material?.roughness===1 && o.material?.map?.repeat?.x===5)?.material;
  assert.ok(material,`Cannot measure runtime material: ${id}`);
  const measure = m => id==='escadao' ? !!m.map && m.map.image?.width===128 : id==='mansao' ? m.map?.image?.width===256 && m.roughness===.58 : id==='corrego' ? m.map?.name==='corrego-directed-plaster' && m.map.image?.width===256 : id==='amazonia' ? m.map?.name==='forest-leaf-litter' && m.map.image?.width===256 : m.roughness===.34 && m.metalness===.04;
  const data={id,map:material.map?.name,size:material.map?.image?.width,roughness:material.roughness,metalness:material.metalness,pass:measure(material)};
  console.log(JSON.stringify(data));if(!data.pass)fail++;
  if(process.argv.includes('--self-test') && data.pass){
    const mutant=material.clone();
    if(id==='escadao' || id==='corrego' || id==='amazonia')mutant.map=null;
    if(id==='mansao')mutant.map=new THREE.DataTexture(new Uint8Array(16*16*4),16,16);
    if(id==='penitenciaria')mutant.roughness=.07;
    assert.ok(!measure(mutant),`Blind runtime mutation: ${id}`);console.log('Mutante morto: '+id);
  }
}
assert.equal(fail,0,'Runtime fabrication gaps remain; this probe does not judge appearance.');
