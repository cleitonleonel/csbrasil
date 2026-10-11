// Constrói o mapa completo com GLBs reais em processos de qualidade separados.
// A igualdade das chapas não substitui o suporte do quad no root completo.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const option = name => process.argv.find(value => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const worker = option('worker');
if (worker) {
  globalThis.localStorage = { getItem: () => JSON.stringify({ quality: worker }) };
  const { THREE, initTextures, seedRandom } = await import('./harness.mjs');
  const { preloadPropGeometry } = await import('./prop-geometry-fixture.mjs');
  const { COMMON_MAP_PROPS } = await import('../../public/js/mapprops.js');
  const production = await import('../../public/js/map_ferrovelho.js');
  const { grafiteNoDedicado, gradeEspacial, quantizarGrafite, retanguloGrafiteDesenhado } = await import('../../public/js/graffiti_pass.js');
  const { criarSuporteGrafite, superficieGrafitavel } = await import('../../public/js/graffiti_surface.js');
  const { measureGraffitiArea } = await import('./graffiti-area-audit.mjs');
  const mapURL = new URL('../../public/js/map_ferrovelho.js', import.meta.url);
  const source = readFileSync(mapURL, 'utf8');
  let build = production.buildFerroVelho;
  if (option('mutant')) {
    const replaceOnce = (text, before, after) => {
      assert.equal(text.split(before).length, 2, `mutation must replace actual marker exactly once: ${before}`);
      return text.replace(before, after);
    };
    let mutated = source;
    if (option('mutant') === 'old-low-step') {
      mutated = replaceOnce(mutated, 'const step = 1.25;', 'const step = LOWQ ? 2.2 : 1.25;');
    } else if (option('mutant') === 'old-quality-rng') {
      mutated = replaceOnce(mutated, 'for (const [cx, cz] of spots) for (let k = 0; k < 9; k++)',
        'for (const [cx, cz] of spots) for (let k = 0; k < per; k++)');
      mutated = replaceOnce(mutated, 'for (const [cx, cz] of clumps) {\n        for (let k = 0; k < 7; k++)',
        'for (const [cx, cz] of clumps) {\n        for (let k = 0; k < perClump; k++)');
      mutated = replaceOnce(mutated, 'if (LOWQ && k >= 4) continue;', '');
      mutated = replaceOnce(mutated, 'if (LOWQ && k >= 3) continue;', '');
    } else throw Error(`unknown mutant: ${option('mutant')}`);
    mutated = mutated
      .replace(/from\s+(['"])([^'"]+)\1/g, (_, quote, specifier) => {
        const absolute = specifier.startsWith('.') ? new URL(specifier, mapURL).href : import.meta.resolve(specifier);
        return `from ${quote}${absolute}${quote}`;
      });
    build = (await import(`data:text/javascript,${encodeURIComponent(mutated)}`)).buildFerroVelho;
  }
  const props = [...new Set([...COMMON_MAP_PROPS, ...production.FERRO_PROPS])];
  await preloadPropGeometry(props);
  const textures = await initTextures();
  seedRandom(12345); grafiteNoDedicado(true);
  const scene = new THREE.Scene(), world = build(scene, textures);
  scene.updateMatrixWorld(true);
  const candidates = [];
  world.root.traverse(mesh => {
    const p = mesh.geometry?.parameters;
    if (mesh.isInstancedMesh && p?.width === 1 && p.height === 1 && p.depth === .05) candidates.push(mesh);
  });
  assert.equal(candidates.length, 1, 'actual map must expose one zinc panel lot');
  const panels = candidates[0], matrices = [], matrix = new THREE.Matrix4();
  if (option('mutant') !== 'old-low-step') assert.equal(panels.count, 211, 'actual stable zinc substrate must retain 211 panels');
  for (let i = 0; i < panels.count; i++) { panels.getMatrixAt(i, matrix); matrices.push(matrix.toArray()); }
  const support = criarSuporteGrafite(world.root, gradeEspacial);
  const drawnRectangle = piece => {
    const geometry = new THREE.PlaneGeometry(piece.w, piece.h);
    geometry.rotateY(piece.ry); geometry.translate(piece.x, piece.y, piece.z);
    const drawn = retanguloGrafiteDesenhado(geometry); geometry.dispose(); return drawn;
  };
  const reference = option('reference') ? JSON.parse(readFileSync(option('reference'), 'utf8')) : null;
  const panelRay = new THREE.Raycaster(), panelOrigin = new THREE.Vector3(), panelDirection = new THREE.Vector3();
  const allMeshes = []; world.root.traverse(mesh => { if (mesh.isMesh && mesh.layers.mask & 1) allMeshes.push(mesh); });
  const hitsPanel = piece => {
    const nx = Math.sin(piece.ry), nz = Math.cos(piece.ry), ux = Math.cos(piece.ry), uz = -Math.sin(piece.ry);
    panelDirection.set(-nx, 0, -nz); panelRay.far = .07;
    for (const su of [-.49, -.245, 0, .245, .49]) for (const sv of [-.49, -.245, 0, .245, .49]) {
      panelOrigin.set(piece.x + ux * su * piece.w + nx * .02, piece.y + sv * piece.h,
        piece.z + uz * su * piece.w + nz * .02); panelRay.set(panelOrigin, panelDirection);
      if (panelRay.intersectObjects(allMeshes, false)[0]?.object !== panels) return false;
    }
    return true;
  };
  const witnesses = reference?.witnesses || matrices.flatMap(values => {
    const normal = new THREE.Vector3(values[8], 0, values[10]).normalize();
    const piece = quantizarGrafite({ x: values[12] + normal.x * .055, y: values[13],
      z: values[14] + normal.z * .055, ry: Math.atan2(normal.x, normal.z), w: .6, h: .6 }, support);
    return piece && hitsPanel(piece) ? [piece] : [];
  });
  assert.ok(witnesses.length, 'visible real zinc panels must support artwork witnesses');
  const diagnostics = [];
  for (const piece of witnesses) {
    const drawn = drawnRectangle(piece);
    diagnostics.push({ piece, productionNominal: support(piece), productionDrawn: !!drawn && support(drawn),
      nominal: await measureGraffitiArea(world.root, piece, THREE, superficieGrafitavel),
      drawn: drawn ? await measureGraffitiArea(world.root, drawn, THREE, superficieGrafitavel) : null });
  }
  const lostDiagnostics = diagnostics.filter(result => !result.productionNominal || !result.productionDrawn
    || !result.nominal.supported || !result.drawn?.supported);
  const lostSupport = lostDiagnostics.map(({ piece }) => piece);
  const grass = [];
  world.root.traverse(mesh => {
    if (!mesh.isInstancedMesh || mesh.geometry.type !== 'PlaneGeometry' || mesh.material.alphaTest !== .4
      || !mesh.userData.nonSolidSurface) return;
    for (let i = 0; i < mesh.count; i++) {
      mesh.getMatrixAt(i, matrix); const transform = mesh.matrixWorld.clone().multiply(matrix);
      const color = new THREE.Color(); mesh.getColorAt(i, color);
      grass.push(JSON.stringify([transform.toArray(), color.toArray()]));
    }
  });
  assert.ok(grass.length, 'actual map must retain its tall-grass lot');
  const availableGrass = new Map();
  for (const key of reference?.grass || grass) availableGrass.set(key, (availableGrass.get(key) || 0) + 1);
  const novelGrass = grass.filter(key => {
    const count = availableGrass.get(key) || 0;
    if (!count) return true; availableGrass.set(key, count - 1); return false;
  });
  const matricesEqual = !reference || JSON.stringify(matrices) === JSON.stringify(reference.matrices);
  const report = { quality: worker, mutant: option('mutant') || null, assets: props.length,
    panels: panels.count, matricesEqual, supported: witnesses.length - lostSupport.length,
    witnesses, lostSupport, lostDiagnostics, diagnostics, matrices, grass, novelGrass };
  writeFileSync(option('out'), JSON.stringify(report));
  assert.equal(readFileSync(mapURL, 'utf8'), source, 'production map source must remain untouched');
  world.ambience?.dispose?.();
  console.log(JSON.stringify({ quality: worker, mutant: report.mutant, panels: panels.count,
    witnesses: witnesses.length, lostSupport: lostSupport.length, matricesEqual,
    grass: grass.length, novelGrass: novelGrass.length }));
  process.exitCode = matricesEqual && lostSupport.length === 0 && novelGrass.length === 0 ? 0 : 1;
} else {
  const directory = mkdtempSync(join(tmpdir(), 'ferro-graffiti-quality-'));
  console.log(`Artifacts: ${directory}`);
  const file = fileURLToPath(import.meta.url), records = [];
  for (const [quality, mutant] of [['med', null], ['low', null], ['low', 'old-low-step'], ['low', 'old-quality-rng']]) {
    const out = join(directory, `${quality}${mutant ? '-mutant' : ''}.json`);
    const args = [file, `--worker=${quality}`, `--out=${out}`];
    if (records.length) args.push(`--reference=${join(directory, 'med.json')}`);
    if (mutant) args.push(`--mutant=${mutant}`);
    const result = spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 1024 * 1024 });
    process.stdout.write(result.stdout || ''); process.stderr.write(result.stderr || '');
    assert.equal(result.status, mutant ? 1 : 0, `${quality}/${mutant || 'normal'} must have its expected causal verdict`);
    records.push(JSON.parse(readFileSync(out, 'utf8')));
  }
  assert.equal(records[0].panels, records[1].panels);
  assert.ok(records[2].lostSupport.length > 0, 'old low step must remove real support, not merely change an inventory count');
  assert.ok(records[3].novelGrass.length > 0 && records[3].lostDiagnostics.some(({ nominal, drawn }) =>
    !nominal.supported && nominal.reason === 'foreground-penetration'
    && !drawn?.supported && drawn?.reason === 'foreground-penetration'),
  'old quality RNG must create novel foliage and independently proven nominal/drawn foreground penetration');
  const report = option('report') || join(directory, 'summary.json');
  writeFileSync(report, JSON.stringify({ passed: true, directory, normalPanels: records[0].panels,
    witnesses: records[0].witnesses.length, mutantPanels: records[2].panels,
    mutantLostSupport: records[2].lostSupport.length, oldRngLostSupport: records[3].lostSupport.length,
    grassMed: records[0].grass.length, grassLow: records[1].grass.length,
    oldRngNovelGrass: records[3].novelGrass.length }, null, 2) + '\n');
  console.log(`PASS Ferro graffiti quality: real GLBs, identical panels, grass subset, rendered full-root support, two causal mutations; ${report}`);
}
