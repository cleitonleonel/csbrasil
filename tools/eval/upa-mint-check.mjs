/* Contrato da ficha 27: GLB clínico real substitui o helper inteiro, sem proxy de tiro. */
import { existsSync, readFileSync } from 'node:fs';
import { THREE, MAPS, initTextures } from './harness.mjs';
import { UPA_PROPS } from '../../public/js/map_upa.js';
import { placeProp } from '../../public/js/mapprops.js';
import { grafiteNoDedicado } from '../../public/js/graffiti_pass.js';
import { preloadPropGeometry } from './prop-geometry-fixture.mjs';

const spec = readFileSync(new URL('../../plans/27-UPA-CLINICAL-MINT.md', import.meta.url), 'utf8');
const expected = [...spec.matchAll(/^\| `(upa_[a-z_]+)` \|/gm)].map(match => match[1]);
if (expected.length !== 9) throw new Error('Ficha UPA não permite medir o inventário clínico de nove props');
const checks = [];
const add = (id, pass, note) => checks.push([id, pass, note]);
add('UPAM1', expected.every(id => UPA_PROPS.includes(id)), `preload clínico ${UPA_PROPS.length}/${expected.length}; faltam ${expected.filter(id => !UPA_PROPS.includes(id)).join(', ') || '0'}`);
let loaded = true;
const missing = expected.filter(id => !existsSync(new URL(`../../public/models/props/${id}.glb`, import.meta.url)));
try {
  if (missing.length) throw new Error(`GLBs públicos ausentes: ${missing.join(', ')}`);
  await preloadPropGeometry(expected);
}
catch (error) { loaded = false; add('UPAM2', false, error.message); }
if (loaded) add('UPAM2', true, `${expected.length} GLBs reais carregados do diretório público`);

if (loaded) {
  const sourceGeometry = new Map(expected.map(id => {
    const geometry = new Set();
    placeProp(id).traverse(mesh => { if (mesh.isMesh) geometry.add(mesh.geometry); });
    return [id, geometry];
  }));
  grafiteNoDedicado(true);
  const world = MAPS.upa_24h.build(new THREE.Scene(), await initTextures());
  world.root.updateMatrixWorld(true);
  const instances = [];
  world.root.traverse(object => { if (object.userData.upaProp) instances.push(object); });
  const present = new Set(instances.map(object => object.userData.upaProp.id));
  add('UPAM3', expected.every(id => present.has(id)), `${instances.length} instâncias clínicas; faltam ${expected.filter(id => !present.has(id)).join(', ') || '0'}`);
  const defects = [];
  for (const object of instances) {
    const { id, ry } = object.userData.upaProp;
    if (!expected.includes(id)) defects.push(`${object.name}: id fora da ficha`);
    if (object.userData.geometryFixtureAsset !== id) defects.push(`${object.name}: fonte GLB ausente`);
    const scale = object.scale;
    if (Math.abs(scale.x - scale.y) > 1e-6 || Math.abs(scale.y - scale.z) > 1e-6) defects.push(`${object.name}: escala deformada`);
    if (Math.abs(scale.x - 1) > 1e-6 || Math.abs(scale.y - 1) > 1e-6 || Math.abs(scale.z - 1) > 1e-6) defects.push(`${object.name}: GLB normalizado escalado em runtime`);
    const angle = Math.atan2(Math.sin(object.rotation.y - ry), Math.cos(object.rotation.y - ry));
    if (!Number.isFinite(angle) || Math.abs(angle) > 1e-6 || object.rotation.x !== 0 || object.rotation.z !== 0) defects.push(`${object.name}: orientação divergente`);
    const bounds = new THREE.Box3().setFromObject(object);
    const collider = world.colliders.find(candidate => candidate.tag === object.name);
    if (!collider || ['X', 'Y', 'Z'].some(axis => Math.abs(collider[`min${axis}`] - bounds.min[axis.toLowerCase()]) > 1e-5 || Math.abs(collider[`max${axis}`] - bounds.max[axis.toLowerCase()]) > 1e-5)) defects.push(`${object.name}: movement fora do envelope real`);
    const meshes = [];
    object.traverse(mesh => { if (mesh.isMesh) meshes.push(mesh); });
    if (!meshes.length || meshes.some(mesh => !mesh.geometry?.attributes.position?.count || !world.occluders.includes(mesh))) defects.push(`${object.name}: malha real ausente dos tiros`);
    if (meshes.some(mesh => !sourceGeometry.get(id)?.has(mesh.geometry))) defects.push(`${object.name}: malha extra fora do GLB fonte`);
  }
  add('UPAM4', instances.length > 0 && defects.length === 0, defects.slice(0, 8).join(' · ') || `${instances.length} instâncias usam GLB, escala uniforme, envelope real e malhas de tiro`);
}
for (const [id, pass, note] of checks) console.log(`${pass ? '✓' : '✗'} ${id} ${note}`);
if (checks.some(([, pass]) => !pass)) process.exit(1);
console.log('UPA-MINT OK — geometria; aparência e vãos de tiro exigem revisão dos assets finais');
