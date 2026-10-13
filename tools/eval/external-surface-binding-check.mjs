// Executa os callbacks reais: derivados precisam corresponder ao albedo que terminou de carregar.
import { readFileSync } from 'node:fs';
import * as THREE from '../../public/vendor/three.module.js';

const files = ['map_campomorro.js', 'map_escadao.js'];
const extract = source => {
  const body = source.match(/const external = (\(mat, url, rx, ry\) => \{[\s\S]*?\n    \});/)?.[1];
  if (!body) throw Error('callback external não localizado');
  return body;
};
function measure(body, { details, roughness = .9, metalness = 0 } = {}) {
  const callbacks = [], tex = new THREE.Texture(), fallback = new THREE.Texture();
  const oldNormal = new THREE.Texture(), oldRough = new THREE.Texture();
  const loader = { load(_url, onLoad) { callbacks.push(onLoad); return tex; } };
  const external = new Function('loader', 'detailFor', 'THREE', `return (${body})`)(loader, () => details, THREE);
  const mat = new THREE.MeshStandardMaterial({ map: fallback, normalMap: oldNormal, roughnessMap: oldRough, roughness, metalness });
  external(mat, '/img/textures/probe.webp', 4, 3);
  const fallbackHeld = mat.map === fallback && mat.normalMap === oldNormal && mat.roughnessMap === oldRough;
  if (callbacks.length !== 1) throw Error('callback ausente ou duplicado');
  callbacks[0]();
  return {
    fallbackHeld, albedo: mat.map === tex,
    normal: mat.normalMap === (details?.normalMap || null),
    roughness: mat.roughnessMap === (details?.roughnessMap || null),
    mineralScale: !details?.normalMap || roughness < .8 || metalness >= .2 || mat.normalScale.toArray().every(v => v === .4),
    sampler: tex.repeat.equals(new THREE.Vector2(4, 3)) && tex.colorSpace === THREE.SRGBColorSpace && tex.wrapS === THREE.RepeatWrapping && tex.wrapT === THREE.RepeatWrapping,
    upload: mat.version > 0,
  };
}
function check(body) {
  const variants = [null, { normalMap: new THREE.Texture(), roughnessMap: new THREE.Texture() }, { normalMap: null, roughnessMap: new THREE.Texture() }];
  return variants.map(details => measure(body, { details }));
}
const green = cases => cases.every(row => Object.values(row).every(Boolean));
let failed = false;
for (const file of files) {
  const source = readFileSync(new URL(`../../public/js/${file}`, import.meta.url), 'utf8'), body = extract(source), cases = check(body);
  const pass = green(cases); console.log(JSON.stringify({ file, pass, cases })); failed ||= !pass;
  if (process.argv.includes('--self-test') && pass) {
    const mutants = {
      staleNormal: body.replace(/mat\.normalMap = [^;]+;/, 'mat.normalMap = mat.normalMap;'),
      staleRoughness: body.replace(/mat\.roughnessMap = [^;]+;/, 'mat.roughnessMap = mat.roughnessMap;'),
      swapBeforeLoad: body.replace('const tex = loader.load(url, () => {', 'mat.map = null; const tex = loader.load(url, () => {'),
      mineralScale: body.replace(/mat\.normalScale\.set\([^;]+\);/, 'mat.normalScale.set(.65, .65);'),
      missingUpload: body.replace('mat.needsUpdate = true;', ''),
    };
    for (const [name, mutated] of Object.entries(mutants)) {
      if (mutated === body || green(check(mutated))) throw Error(`${file}: mutante cego ${name}`);
      console.log(`${file}: mutante ${name} RED`);
    }
  }
}
if (failed) process.exitCode = 1;
