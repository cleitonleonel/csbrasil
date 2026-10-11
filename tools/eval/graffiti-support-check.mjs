#!/usr/bin/env node
/** Geometry fixtures exercise production placement and pruning without a browser.
 * --self-test imports an in-memory mutant of graffiti_surface.js where the actual
 * support function always accepts. The SAME expectations must detect invalid
 * baked tags, baked murals, manual art and live placement in that mutant.
 * No repository source is patched and no fixture metadata is used as a mutation.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { THREE } from './harness.mjs';
import * as production from '../../public/js/graffiti_pass.js';
import { criarSuporteGrafite } from '../../public/js/graffiti_surface.js';

const texture = new THREE.Texture();
const T = { decalFiles: ['fixture.png'], decals: [texture], decalAspects: [1],
  posterFiles: [], posterImgs: [], posterAspects: [] };
const row = [0, 0, 2, .13, 0, 2, 2];
const box = (w = 4, h = 4, d = .2) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshLambertMaterial());
  mesh.position.y = h / 2; mesh.name = 'fixture-concrete'; return mesh;
};
const plane = (z, name = '', material = new THREE.MeshLambertMaterial(), w = 4, h = 4) => {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
  mesh.position.set(0, 2, z); mesh.name = name; return mesh;
};
const grouped = (...objects) => { const root = new THREE.Group(); if (objects.length) root.add(...objects); return root; };
const liveConfig = root => ({ id: '__graffiti_support_fixture__', root, T,
  waypoints: [{ x: -2, z: 4 }, { x: 0, z: 4 }, { x: 2, z: 4 }], seed: 7,
  passo: .8, alcance: 8, raios: 16, minLarg: .3, maxLarg: 2, exigeChao: false,
  bandas: [{ y0: .5, y1: 2.8, larg: 1, alturas: [.7], chance: 100, pool: [0], exigeChao: false }] });

function suite(api, quiet = false) {
  const cases = [];
  function test(name, category, body) {
    try { body(); cases.push({ name, category, ok: true }); if (!quiet) console.log(`PASS ${name}`); }
    catch (error) { cases.push({ name, category, ok: false, error: error.message });
      if (!quiet) console.error(`FAIL ${name}: ${error.message.split('\n')[0]}`); }
  }
  function baked(name, makeRoot, artRow, expected) {
    test(name, 'baked', () => {
      const root = makeRoot(); root.updateMatrixWorld(true);
      const result = api.aplicarGrafite(root, T, { arquivos: ['fixture.png'], pecas: [artRow] });
      assert.equal(result.pecas, expected, 'rendered baked piece count');
      assert.equal(root.userData.graffitiPecas?.length || 0, expected, 'inventoried piece count');
      let emitted = 0; root.traverse(o => { if (o.isMesh && o.name === 'decal:fixture.png') emitted++; });
      assert.equal(emitted, expected, 'actual rendered decal mesh count');
    });
  }
  baked('wall retains baked paint', () => grouped(box()), row, 1);
  baked('empty air rejects baked paint', () => grouped(), row, 0);
  const wallRect = (x0, x1, y0 = 0, y1 = 4, z = .1, name = 'concrete-wall') => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, y1 - y0), new THREE.MeshLambertMaterial());
    mesh.name = name; mesh.position.set((x0 + x1) / 2, (y0 + y1) / 2, z); return mesh;
  };
  baked('joined coplanar walls retain paint across their exact seam', () => grouped(wallRect(-2, .25), wallRect(.25, 2)), row, 1);
  for (const width of [.1, .001]) {
    baked(`unsampled ${width}m slit between coplanar walls rejects paint`, () => grouped(wallRect(-2, .2), wallRect(.2 + width, 2)), row, 0);
  }
  baked('unsampled interior hole rejects paint', () => grouped(
    wallRect(-2, .2), wallRect(.3, 2), wallRect(.2, .3, 0, 2.2), wallRect(.2, .3, 2.3, 4)), row, 0);
  baked('L shaped wall cannot support its missing quadrant', () => grouped(wallRect(-2, .2), wallRect(.2, 2, 0, 2.2)), row, 0);
  baked('outermost unsampled edge cannot overhang wall', () => grouped(wallRect(-.99, 2)), row, 0);
  for (const name of ['samambaia', 'glass-window']) {
    baked(`unsampled narrow foreground ${name} rejects paint`, () => grouped(box(), wallRect(.2, .3, 1, 3, .115, name)), row, 0);
  }
  baked('unsampled narrow penetrating concrete rejects paint', () => grouped(box(), wallRect(.2, .3, 1, 3, .14)), row, 0);
  baked('plant behind actual wall does not erase supported paint', () => grouped(box(), wallRect(.2, .3, 1, 3, .09, 'samambaia')), row, 1);
  baked('undrawn geometry triangles cannot bridge a slit', () => {
    const left = wallRect(-2, .2), right = wallRect(.3, 2);
    const fake = wallRect(.2, .3); fake.geometry.setDrawRange(0, 0);
    return grouped(left, right, fake);
  }, row, 0);
  baked('mesh on an invisible render layer cannot bridge a slit', () => {
    const left = wallRect(-2, .2), right = wallRect(.3, 2);
    const fake = wallRect(.2, .3); fake.layers.set(1);
    return grouped(left, right, fake);
  }, row, 0);
  baked('tessellated wall retains exact support', () => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(4, 4, 32, 32), new THREE.MeshLambertMaterial());
    mesh.name = 'tessellated-concrete'; mesh.position.set(0, 2, .1); return grouped(mesh);
  }, row, 1);

  baked('distant wall rejects floating paint', () => grouped(box()), [0, 0, 2, .5, 0, 2, 2], 0);
  baked('paint cannot overhang wall edges', () => grouped(box(1)), row, 0);
  baked('nonSolidSurface rejects support', () => { const m = box(); m.userData.nonSolidSurface = true; return grouped(m); }, row, 0);
  baked('opaque samambaia rejects support', () => { const m = box(); m.name = 'samambaia'; return grouped(m); }, row, 0);
  baked('plant ancestor rejects support', () => { const parent = grouped(box()); parent.name = 'planta'; return grouped(parent); }, row, 0);
  baked('suspended opaque faixa cannot support wall graffiti', () => grouped(plane(.1, 'faixa:eternamente')), row, 0);
  baked('opacity .2 rejects support even without transparency flag', () => { const m = box(); m.material.opacity = .2; return grouped(m); }, row, 0);
  baked('invisible material cannot support paint', () => { const m = box(); m.material.visible = false; return grouped(m); }, row, 0);
  baked('colorWrite false collision box cannot support paint', () => {
    const m = box(); m.material.colorWrite = false; m.material.depthWrite = false; return grouped(m);
  }, row, 0);
  baked('hidden ancestor cannot support paint', () => { const hidden = grouped(box()); hidden.visible = false; return grouped(hidden); }, row, 0);
  baked('alpha cutout cannot support paint', () => { const m = box(); m.material.alphaTest = .4; return grouped(m); }, row, 0);
  baked('transparent glass cannot support paint', () => { const m = box(); m.material.transparent = true; return grouped(m); }, row, 0);
  baked('nearest foreground plant blocks otherwise valid wall', () => {
    const plant = plane(.115, 'samambaia'); plant.userData.nonSolidSurface = true;
    return grouped(box(), plant);
  }, row, 0);
  baked('paint penetrating nearest foreground surface is rejected', () => grouped(box(), plane(.14, 'concrete-front')), row, 0);
  baked('hidden foreground plane does not invalidate visible wall', () => {
    const hidden = plane(.14); hidden.material.visible = false; return grouped(box(), hidden);
  }, row, 1);
  baked('colorWrite false foreground proxy does not invalidate visible wall', () => {
    const hidden = plane(.14); hidden.material.colorWrite = false; hidden.material.depthWrite = false;
    return grouped(box(), hidden);
  }, row, 1);
  baked('oblique normal cannot support flat paint', () => {
    const m = plane(.1, 'concrete-oblique', undefined, 4, 4); m.rotation.y = .25; return grouped(m);
  }, [0, 0, 2, .13, 0, .1, .5], 0);
  const yaw = Math.PI / 3;
  baked('rotated actual wall retains paint', () => { const m = box(); m.rotation.y = yaw; return grouped(m); },
    [0, Math.sin(yaw) * .13, 2, Math.cos(yaw) * .13, yaw, 2, 2], 1);
  test('scaled rotated InstancedMesh wall retains paint', 'baked', () => {
    const root = new THREE.Group(), parent = new THREE.Group(); parent.rotation.y = .7;
    const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(4, 4, .2), new THREE.MeshLambertMaterial(), 2);
    mesh.name = 'concrete-instanced';
    const matrix = new THREE.Matrix4().compose(new THREE.Vector3(2, 2, -1),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), .3), new THREE.Vector3(1.3, 1, .8));
    mesh.setMatrixAt(0, matrix); mesh.setMatrixAt(1, new THREE.Matrix4().makeTranslation(20, 2, 20));
    parent.add(mesh); root.add(parent); root.updateMatrixWorld(true);
    const center = new THREE.Vector3(2, 2, -1).applyMatrix4(parent.matrixWorld);
    const artYaw = 1, gap = .11;
    const result = api.aplicarGrafite(root, T, { arquivos: ['fixture.png'],
      pecas: [[0, center.x + Math.sin(artYaw) * gap, center.y, center.z + Math.cos(artYaw) * gap, artYaw, 2, 2]] });
    assert.equal(result.pecas, 1);
    assert.equal(criarSuporteGrafite(root, production.gradeEspacial)(root.userData.graffitiPecas[0]), true);
  });
  test('unsupported baked mural is rejected', 'mural', () => {
    const root = grouped();
    const result = api.aplicarGrafite(root, T, { arquivos: [], pecas: [], murais: [['fixture', 0, 2, .13, 0, 2, 2]] }, { fixture: texture });
    assert.equal(result.murais, 0); assert.equal(root.children.length, 0);
  });
  test('supported baked mural remains rendered', 'mural', () => {
    const root = grouped(box());
    const result = api.aplicarGrafite(root, T, { arquivos: [], pecas: [], murais: [['fixture', 0, 2, .13, 0, 2, 2]] }, { fixture: texture });
    assert.equal(result.murais, 1); assert.ok(root.children.some(o => o.name === 'mural:fixture'));
  });
  function manual(name, makeRoot, expectedAttached) {
    test(name, 'manual', () => {
      const { root, art } = makeRoot();
      const oldLive = window.__grafiteLive; window.__grafiteLive = true;
      try { api.grafitar({ ...liveConfig(root), waypoints: [] }); }
      finally { window.__grafiteLive = oldLive; }
      assert.equal(art.parent === root, expectedAttached, 'manual artwork attachment after real grafitar');
    });
  }
  manual('manual unsupported decal is pruned before live placement', () => { const art = plane(.13, 'decal:fixture'); return { root: grouped(art), art }; }, false);
  manual('manual supported decal is preserved', () => { const art = plane(.13, 'decal:fixture', undefined, 2, 2); return { root: grouped(box(), art), art }; }, true);
  manual('rolled manual quad cannot claim an upright footprint', () => {
    const art = plane(.13, 'decal:fixture', undefined, 2, 2); art.rotation.z = Math.PI / 4;
    return { root: grouped(box(2.1, 2.1), art), art };
  }, false);
  test('live posters retain their actual texture identity after batching', 'live', () => {
    const root = grouped(box()), cfg = liveConfig(root);
    const posterT = { ...T, posterFiles: ['fixture.jpg'], posterImgs: [texture], posterAspects: [1] };
    const result = api.pintarParedes({ ...cfg, T: posterT, bandas: cfg.bandas.map(b => ({ ...b, fonte: 'poster' })) });
    assert.ok(result.pecas > 0);
    assert.ok(root.userData.graffitiPecas.every(p => p.f === 'poster:fixture.jpg'));
    assert.ok(root.children.some(o => o.name === 'decal:poster:fixture.jpg'));
  });
  manual('manual mural overhang is pruned', () => { const art = plane(.13, 'mural:fixture', undefined, 2, 2); return { root: grouped(box(1), art), art }; }, false);
  manual('manual decal on opaque samambaia is pruned', () => {
    const plant = box(); plant.name = 'samambaia'; const art = plane(.13, 'decal:fixture', undefined, 2, 2);
    return { root: grouped(plant, art), art };
  }, false);
  manual('nonvertical manual artwork is pruned', () => {
    const art = plane(.13, 'decal:fixture', undefined, 2, 2); art.rotation.x = Math.PI / 2;
    return { root: grouped(box(), art), art };
  }, false);
  test('live generation preserves supported wall artwork', 'live', () => {
    const root = grouped(box(8)); const result = api.pintarParedes(liveConfig(root));
    assert.ok(result.pecas > 0, 'live wall must receive artwork');
    const actual = root.userData.graffitiPecas || [];
    assert.equal(actual.length, result.pecas);
    const independent = criarSuporteGrafite(root, production.gradeEspacial);
    assert.ok(actual.every(p => independent(p)), 'all live pieces satisfy unmutated support measurement');
  });
  test('live generation rejects translucent plant directly in front of wall', 'live', () => {
    const plant = plane(.115, 'samambaia', new THREE.MeshLambertMaterial({ transparent: true, opacity: .7 }), 8, 4);
    plant.userData.nonSolidSurface = true;
    const root = grouped(box(8), plant); const result = api.pintarParedes(liveConfig(root));
    assert.equal(result.pecas, 0, 'live placement must not bridge nearest plant');
    assert.equal(root.userData.graffitiPecas?.length || 0, 0);
  });
  test('live mural generation preserves supported artwork', 'live-mural', () => {
    const root = grouped(box(8));
    const result = api.pendurarMurais({ ...liveConfig(root), texturas: [texture], nomes: ['fixture'], larg: 3, alt: 2, minLarg: 2 });
    assert.ok(result.murais > 0, 'live wall must retain a mural');
  });
  test('live mural generation rejects foreground plant', 'live-mural', () => {
    const plant = plane(.115, 'samambaia', new THREE.MeshLambertMaterial({ transparent: true, opacity: .7 }), 8, 4);
    plant.userData.nonSolidSurface = true;
    const root = grouped(box(8), plant);
    const result = api.pendurarMurais({ ...liveConfig(root), texturas: [texture], nomes: ['fixture'], larg: 3, alt: 2, minLarg: 2 });
    assert.equal(result.murais, 0, 'mural must not bridge nearest plant');
  });
  return cases;
}

const cases = suite(production);
const failures = cases.filter(c => !c.ok);
if (failures.length) process.exitCode = 1;
console.log(JSON.stringify({ fixtures: cases.length, passed: cases.length - failures.length, failed: failures.length }));

if (process.argv.includes('--self-test')) {
  // Rebase the original imports into absolute URLs so the mutant is evaluated by
  // Node without a temporary source file, loader mocks or editing dependencies.
  const surfaceURL = new URL('../../public/js/graffiti_surface.js', import.meta.url);
  const passURL = new URL('../../public/js/graffiti_pass.js', import.meta.url);
  const source = readFileSync(surfaceURL, 'utf8');
  const passSource = readFileSync(passURL, 'utf8');
  const absoluteImports = (text, owner, overrides = {}) => text.replace(
    /(\bfrom\s*|\bimport\s*)(['"])([^'"\n]+)\2/g,
    (full, prefix, quote, specifier) => {
      const target = overrides[specifier] || (specifier.startsWith('.') ? new URL(specifier, owner).href : import.meta.resolve(specifier));
      return `${prefix}${JSON.stringify(target)}`;
    });
  const marker = 'export function criarSuporteGrafite(root, grade) {';
  assert.equal(source.split(marker).length, 2, 'mutant must patch exactly the current production support function');
  const mutatedSource = source.slice(0, source.indexOf(marker))
    + 'export function criarSuporteGrafite(root, grade) { return (piece) => true; }\n';
  const surfaceData = `data:text/javascript,${encodeURIComponent(absoluteImports(mutatedSource, surfaceURL))}`;
  const passData = `data:text/javascript,${encodeURIComponent(absoluteImports(passSource, passURL, { './graffiti_surface.js': surfaceData }))}`;
  let mutant;
  try { mutant = await import(passData); }
  catch (error) { console.error(`FAIL in-memory production mutant import: ${error.message.slice(0, 300)}`); process.exit(1); }
  const mutantCases = suite(mutant, true);
  const detected = mutantCases.filter(c => !c.ok);
  const detectedCategories = new Set(detected.map(c => c.category));
  for (const category of ['baked', 'mural', 'manual', 'live', 'live-mural']) {
    assert.ok(detectedCategories.has(category), `same fixtures must detect the disabled production support guard in ${category} path`);
  }
  assert.ok(mutantCases.find(c => c.name === 'wall retains baked paint')?.ok, 'mutant must preserve positive control');
  assert.equal(readFileSync(surfaceURL, 'utf8'), source, 'production support source must remain untouched');
  assert.equal(readFileSync(passURL, 'utf8'), passSource, 'production placement source must remain untouched');
  const exactMarker = 'return covers(piece, candidates);';
  assert.equal(source.split(exactMarker).length, 2, 'must disable the actual exact-area production guard once');
  const raysOnly = source.replace(exactMarker, 'return true;');
  const raysOnlyData = `data:text/javascript,${encodeURIComponent(absoluteImports(raysOnly, surfaceURL))}`;
  const raysOnlyPass = `data:text/javascript,${encodeURIComponent(absoluteImports(passSource, passURL, { './graffiti_surface.js': raysOnlyData }))}`;
  let raysOnlyAPI;
  try { raysOnlyAPI = await import(raysOnlyPass); }
  catch (error) { console.error(`FAIL exact-area mutant import: ${error.message.slice(0, 300)}`); process.exit(1); }
  const raysOnlyCases = suite(raysOnlyAPI, true), exactDetected = raysOnlyCases.filter(c => !c.ok);
  for (const name of [
    'unsampled 0.1m slit between coplanar walls rejects paint',
    'unsampled 0.001m slit between coplanar walls rejects paint',
    'unsampled interior hole rejects paint',
    'outermost unsampled edge cannot overhang wall',
    'unsampled narrow foreground samambaia rejects paint',
    'unsampled narrow foreground glass-window rejects paint',
    'unsampled narrow penetrating concrete rejects paint'
  ]) assert.ok(exactDetected.some(c => c.name === name), `25-ray-only mutant must fail: ${name}`);
  assert.ok(raysOnlyCases.find(c => c.name === 'joined coplanar walls retain paint across their exact seam')?.ok);
  console.log(JSON.stringify({ exactAreaSelfTest: 'passed', mutation: 'production exact-area guard bypassed, original 25 rays retained',
    rejectedFixtures: exactDetected.length, detected: exactDetected.map(c => c.name) }));
  console.log(JSON.stringify({ selfTest: 'passed', mutation: 'production criarSuporteGrafite always accepts',
    sourceSha256: createHash('sha256').update(source).digest('hex'),
    rejectedFixtures: detected.length, categories: [...detectedCategories], detected: detected.map(c => c.name) }));
}
