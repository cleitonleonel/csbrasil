// The four textured empenas require another wall behind them; their own boxes cannot prove mounting.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const args = process.argv.slice(2), option = name => args.find(a => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const quality = option('quality') || 'med';
assert.ok(['med', 'low'].includes(quality));
globalThis.localStorage = { getItem: () => JSON.stringify({ quality }) };
const { THREE, MAPS, initTextures, seedRandom } = await import('./harness.mjs');
const { preloadPropGeometry } = await import('./prop-geometry-fixture.mjs');
const { COMMON_MAP_PROPS } = await import('../../public/js/mapprops.js');
const { criarSuporteGrafite, superficieGrafitavel } = await import('../../public/js/graffiti_surface.js');
const { retanguloGrafiteDesenhado } = await import('../../public/js/graffiti_pass.js');
const { measureGraffitiArea } = await import('./graffiti-area-audit.mjs');
const diagnoseArea = new Function(`return (${measureGraffitiArea.toString().replace(
  'obstacles.push({ polygon: penetrated, depth }); penetration = true;',
  `obstacles.push({ polygon: penetrated, depth }); penetration = true;
   if (globalThis.__mountPenetration.length < 256) globalThis.__mountPenetration.push({
     mesh: mesh.name, geometry: geometry.type, instance: mesh.isInstancedMesh ? instance : null,
     vertices: [v0.toArray(), v1.toArray(), v2.toArray()], normal: normal.toArray(),
     clippedArea: Math.abs(polygonArea(penetrated)), eligible,
     ancestry: (() => { const names=[]; for(let node=mesh;node;node=node.parent) names.push(node.name); return names; })()
   });`)});`)();
const path = '/img/textures/corrego_streetart_pixo.webp', placements = [[1, -28], [-1, 24], [1, 8], [-1, -12]];
const asset = readFileSync(new URL(`../../public${path}`, import.meta.url));
assert.ok(asset.length > 1000 && asset.toString('ascii', 0, 4) === 'RIFF' && asset.toString('ascii', 8, 12) === 'WEBP');
const props = [...new Set([...COMMON_MAP_PROPS, ...MAPS.corrego.props])];
await preloadPropGeometry(props);
const loader = THREE.TextureLoader.prototype.load;
let pixoTexture;
THREE.TextureLoader.prototype.load = function (...args) {
  const texture = loader.apply(this, args); texture.userData.mountFixturePath = String(args[0]);
  if (String(args[0]) === path) pixoTexture = texture;
  return texture;
};
const build = builder => { seedRandom(12345); const world = builder(new THREE.Scene(), initTextures()); world.root.updateMatrixWorld(true); return world; };
const artMeshes = root => {
  const result = [];
  root.traverse(mesh => {
    if (!mesh.isMesh) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    if (materials.some(material => material?.map?.userData.mountFixturePath === path)) result.push(mesh);
  });
  return result;
};
function boxFaces(mesh) {
  const { width, height, depth } = mesh.geometry.parameters;
  assert.equal(width, .05); assert.equal(height, 4.6); assert.equal(depth, 6);
  return [-1, 1].map(side => {
    const local = new THREE.Matrix4().makeRotationY(side * Math.PI / 2);
    local.setPosition(side * width / 2, 0, 0);
    const geometry = new THREE.PlaneGeometry(depth, height);
    const piece = retanguloGrafiteDesenhado(geometry, mesh.matrixWorld.clone().multiply(local));
    geometry.dispose(); assert.ok(piece); return piece;
  });
}
function firstHits(root, piece) {
  const meshes = []; root.traverse(mesh => {
    if (!mesh.isMesh || !(mesh.layers.mask & 1)) return;
    for (let ancestor = mesh; ancestor; ancestor = ancestor.parent)
      if (!ancestor.visible || /^(decal:|mural:)/.test(ancestor.name)) return;
    meshes.push(mesh);
  });
  const nx = Math.sin(piece.ry), nz = Math.cos(piece.ry), ux = Math.cos(piece.ry), uz = -Math.sin(piece.ry);
  const ray = new THREE.Raycaster(), direction = new THREE.Vector3(-nx, 0, -nz), hits = [];
  ray.far = .07;
  for (const u of [-.49, -.245, 0, .245, .49]) for (const v of [-.49, -.245, 0, .245, .49]) {
    ray.set(new THREE.Vector3(piece.x + ux * u * piece.w + nx * .02, piece.y + v * piece.h, piece.z + uz * u * piece.w + nz * .02), direction);
    const hit = ray.intersectObjects(meshes, false).find(hit => {
      const material = Array.isArray(hit.object.material) ? hit.object.material[hit.face.materialIndex] : hit.object.material;
      return material?.visible !== false && material?.colorWrite !== false && material?.opacity > 0;
    });
    if (!hit) { hits.push({ supported: false, reason: 'no-hit' }); continue; }
    const matrix = hit.object.matrixWorld.clone();
    if (hit.object.isInstancedMesh) { const instance = new THREE.Matrix4(); hit.object.getMatrixAt(hit.instanceId, instance); matrix.multiply(instance); }
    const normal = hit.face.normal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(matrix)).normalize();
    const alignment = -normal.dot(direction), depth = hit.distance - .02;
    const externalWall = Math.abs(Math.abs(hit.point.x) - 23.75) < 1e-5;
    hits.push({ supported: superficieGrafitavel(hit.object) && alignment >= .98 && depth >= -.001 && depth <= .05 && externalWall,
      point: hit.point.toArray(), normal: normal.toArray(), depth, alignment, externalWall,
      mesh: hit.object.name, geometry: hit.object.geometry.type, instance: hit.instanceId });
  }
  return { supported: hits.every(hit => hit.supported), samples: hits.length, hits };
}
async function measure(world, label, dimensions = { w: 6, h: 3.6, y: 5.2 }) {
  const meshes = artMeshes(world.root);
  assert.equal(meshes.length, 4, `${label}: all four real pixo panels must exist`);
  const entries = meshes.map(mesh => ({ mesh, parent: mesh.parent, matrix: mesh.matrixWorld.clone() }));
  for (const { mesh, parent } of entries) parent.remove(mesh);
  world.root.updateMatrixWorld(true);
  const support = criarSuporteGrafite(world.root), pieces = [];
  try {
    for (const { mesh, matrix } of entries) {
      mesh.matrixWorld.copy(matrix);
      const placement = placements.find(([side, z]) => Math.abs(mesh.position.z - z) < 1e-8 && Math.sign(mesh.position.x) === side);
      assert.ok(placement, `${label}: exact declared panel center`);
      const [side, z] = placement;
      const nominal = { x: side * 23.738, y: dimensions.y, z, ry: -side * Math.PI / 2, w: dimensions.w, h: dimensions.h };
      const drawn = mesh.geometry.type === 'PlaneGeometry' ? [retanguloGrafiteDesenhado(mesh.geometry, matrix)] : boxFaces(mesh);
      assert.ok(drawn.every(Boolean));
      const nominalArea = await measureGraffitiArea(world.root, nominal, THREE, superficieGrafitavel);
      const faces = [];
      for (const piece of drawn) {
        const area = await measureGraffitiArea(world.root, piece, THREE, superficieGrafitavel), first = firstHits(world.root, piece);
        globalThis.__mountPenetration = [];
        if (!area.supported) await diagnoseArea(world.root, piece, THREE, superficieGrafitavel);
        faces.push({ piece, production: support(piece), independent: area, firstHits: first, penetrationTriangles: globalThis.__mountPenetration });
      }
      const transformFits = drawn.length === 1 && Math.abs(drawn[0].x - nominal.x) < 1e-8
        && Math.abs(drawn[0].y - nominal.y) < 1e-8 && Math.abs(drawn[0].z - nominal.z) < 1e-8
        && Math.abs(drawn[0].w - nominal.w) < 1e-6 && Math.abs(drawn[0].h - nominal.h) < 1e-6
        && Math.abs(Math.sin(drawn[0].ry - nominal.ry)) < 1e-8;
      pieces.push({ center: mesh.position.toArray(), geometry: mesh.geometry.type, nominal,
        nominalProduction: support(nominal), nominalIndependent: nominalArea, transformFits, faces,
        mounted: transformFits && support(nominal) && nominalArea.supported && faces.every(face => face.production && face.independent.supported && face.firstHits.supported) });
    }
  } finally { for (const { mesh, parent } of entries) parent.add(mesh); world.root.updateMatrixWorld(true); }
  return { label, pieces: pieces.length, mounted: pieces.filter(piece => piece.mounted).length, details: pieces };
}

const current = build(MAPS.corrego.build), report = { gate: 'corrego-art-mount', quality, propsLoaded: props.length,
  texture: { path, bytes: asset.length, sha256: createHash('sha256').update(asset).digest('hex') }, nodeGeometryOnly: true };
console.log(JSON.stringify({ phase: 'built', artMeshes: artMeshes(current.root).length,
  namedPanels: current.root.children.filter(mesh => mesh.name.includes('corrego_streetart')).map(mesh => ({ name: mesh.name, provenance: mesh.material?.map?.userData })) }));
if (artMeshes(current.root).length === 4) report.current = await measure(current, 'current');
else {
  report.current = { label: 'current', pieces: artMeshes(current.root).length, mounted: 0, reason: 'missing-required-pixo-panels' };
  assert.equal(artMeshes(current.root).length, 0, 'partial art inventory requires an explicit diagnosis');
  assert.ok(pixoTexture, 'real pixo texture loader was invoked');
  for (const [side, z] of placements) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(6, 4.6), new THREE.MeshStandardMaterial({ map: pixoTexture }));
    mesh.position.set(side * 23.738, 3.7, z); mesh.rotation.y = -side * Math.PI / 2;
    current.root.add(mesh);
  }
  current.root.updateMatrixWorld(true);
  report.probes = await measure(current, 'original-proposal-only-not-emitted', { w: 6, h: 4.6, y: 3.7 });
}
if (option('out')) writeFileSync(option('out'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ phase: 'mount-measured', current: report.current.mounted, probes: report.probes?.details.map(piece => ({ center: piece.center,
  production: piece.nominalProduction, independent: piece.nominalIndependent, firstFailure: piece.faces[0].firstHits.hits.find(hit => !hit.supported) })) }));
if (args.includes('--search')) {
  const removed = artMeshes(current.root).map(mesh => ({ mesh, parent: mesh.parent }));
  for (const { mesh, parent } of removed) parent.remove(mesh);
  report.candidates = [];
  for (const [w, h, y] of [[6, 4.6, 4.7], [6, 4.6, 5], [6, 3.6, 5.2], [6, 3.6, 5.3], [4.8, 3.68, 5.1], [4.8, 3.68, 5.4]]) {
    assert.ok(y + h / 2 <= 7.300000001, 'candidate stays below the minimum wall top');
    const panels = placements.map(([side, z]) => {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: pixoTexture }));
      mesh.position.set(side * 23.738, y, z); mesh.rotation.y = -side * Math.PI / 2; current.root.add(mesh); return mesh;
    });
    current.root.updateMatrixWorld(true);
    const result = await measure(current, `candidate-${w}x${h}-y${y}`, { w, h, y });
    report.candidates.push({ dimensions: { w, h, y }, ...result });
    for (const mesh of panels) { mesh.removeFromParent(); mesh.geometry.dispose(); }
  }
  for (const { mesh, parent } of removed) parent.add(mesh);
  if (option('out')) writeFileSync(option('out'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ phase: 'search', candidates: report.candidates.map(candidate => ({ ...candidate.dimensions, mounted: candidate.mounted })) }));
}
if (option('baseline-ref')) {
  const mapURL = new URL('../../public/js/map_corrego.js', import.meta.url);
  const source = execFileSync('git', ['show', `${option('baseline-ref')}:public/js/map_corrego.js`], { encoding: 'utf8' });
  assert.ok(source.includes('addBox(0.05, 4.6, 6.0, TEX.pixo, x, 1.4, z'));
  const resolved = source.replace(/(\bfrom\s*)(['"])([^'"\n]+)\2/g, (_full, prefix, _quote, specifier) =>
    prefix + JSON.stringify(specifier.startsWith('.') ? new URL(specifier, mapURL).href : import.meta.resolve(specifier)));
  const previous = await import(`data:text/javascript,${encodeURIComponent(resolved)}`);
  report.baseline = await measure(build(previous.buildCorrego), option('baseline-ref'));
  assert.equal(report.baseline.mounted, 0, 'actual previous source must reproduce all four unsupported panels');
  assert.ok(report.baseline.details.every(piece => piece.faces.every(face => !face.production && !face.independent.supported)), 'old rendered large faces fail both independent and production wall coverage');
}
if (args.includes('--self-test')) {
  for (const mesh of artMeshes(current.root)) {
    mesh.geometry = new THREE.BoxGeometry(.05, 4.6, 6);
    mesh.position.x = Math.sign(mesh.position.x) * 23.72;
    mesh.position.y = 3.7;
  }
  current.root.updateMatrixWorld(true);
  report.mutant = await measure(current, 'old-perpendicular-box');
  assert.equal(report.mutant.mounted, 0, 'real geometry mutant must make all four panels invalid');
  assert.ok(report.mutant.details.every(piece => piece.faces.every(face => !face.production && !face.independent.supported)), 'mutant real rendered faces must fail both measurements');
  report.geometryMutationDetected = true;
}
report.ok = report.current.mounted === 4;
if (option('out')) writeFileSync(option('out'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ gate: report.gate, quality, propsLoaded: props.length, current: `${report.current.mounted}/4`, baseline: report.baseline ? `${report.baseline.mounted}/4` : undefined,
  mutant: report.mutant ? `${report.mutant.mounted}/4` : undefined, geometryMutationDetected: report.geometryMutationDetected, output: option('out'), ok: report.ok }));
THREE.TextureLoader.prototype.load = loader;
if (!report.ok) process.exitCode = 1;
