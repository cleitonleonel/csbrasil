import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from '/vendor/meshopt_decoder.module.js';
import {createUrbanApparelProxy, URBAN_APPAREL_STATUS} from '/js/procedural-urban-apparel.js';
import {mountUrbanRigidCandidate} from '/js/procedural-urban-rigid.js';
import {mountEyewearCandidate} from '/js/eyewear.js';

export const APPAREL_FAMILIES = Object.freeze({
  tops: Object.freeze(['boxy-tee', 'oversized-tee']),
  outer: Object.freeze(['shell-jacket']),
  legs: Object.freeze(['cargo-pants', 'bermuda-shorts']),
  feet: Object.freeze(['low-sneaker', 'chunky-runner', 'boot']),
});
export const RIGID_FAMILIES = Object.freeze({
  head: Object.freeze(['headwear-trucker', 'headwear-boina', 'headwear-beanie', 'headwear-bucket', 'headwear-balaclava', 'headwear-hair', 'headwear-helmet']),
  back: Object.freeze(['backpack-rolltop', 'backpack-triple-pocket', 'backpack-sling', 'backpack-drypack', 'backpack-modular', 'backpack-tote', 'backpack-duffel']),
  accessory: Object.freeze(['accessory-chain', 'accessory-bandana', 'accessory-earring', 'accessory-bracelet', 'accessory-modular', 'accessory-ring', 'accessory-belt', 'accessory-case']),
});
export const EYEWEAR_FAMILY_ASSETS = Object.freeze({
  'eyewear-frame': 'oval-90',
  'eyewear-safety': 'metal-de-rua',
  'eyewear-visor': 'visor-de-pista',
  'eyewear-wrap': 'ouro-de-quebrada',
});

const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: false, preserveDrawingBuffer: true});
renderer.setSize(420, 560, false);
renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.92;
renderer.shadowMap.enabled = false;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111927);
scene.add(new THREE.HemisphereLight(0xdbe9ff, 0x4a3a29, 2.3));
for (const [color, intensity, position] of [
  [0xffe4bc, 3.6, [3.5, 5.5, 5]],
  [0x83aaff, 2.1, [-4, 3, 1]],
  [0xffffff, 1.4, [0, 4, -5]],
]) {
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(...position);
  scene.add(light);
}
const floor = new THREE.Mesh(
  new THREE.CircleGeometry(1.3, 48),
  new THREE.MeshStandardMaterial({color: 0x29364a, roughness: 1, metalness: 0}),
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.006;
scene.add(floor);

const camera = new THREE.PerspectiveCamera(27, 420 / 560, 0.01, 100);
const pivot = new THREE.Group();
scene.add(pivot);
const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const [eyewearManifest, faceLandmarks] = await Promise.all([
  fetch('/models/items/eyewear-manifest.json').then(response => response.json()),
  fetch('/models/items/face-landmarks.json').then(response => response.json()),
]);
let current = null;

function finiteBox(box) {
  return !box.isEmpty() && [...box.min.toArray(), ...box.max.toArray()].every(Number.isFinite);
}

function modelBody(model) {
  const bodies = [];
  model.traverse(object => { if (object.isSkinnedMesh) bodies.push(object); });
  return bodies.length === 1 ? bodies[0] : null;
}

function normalizeModel(model) {
  model.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(model);
  if (!finiteBox(bounds)) throw new Error('body bounds are not finite');
  const size = bounds.getSize(new THREE.Vector3());
  if (!Number.isFinite(size.y) || size.y <= 0) throw new Error('body has no measurable height');
  const scale = 1.76 / size.y;
  const center = bounds.getCenter(new THREE.Vector3());
  model.scale.multiplyScalar(scale);
  model.position.x -= center.x * scale;
  model.position.y -= bounds.min.y * scale;
  model.position.z -= center.z * scale;
  model.updateMatrixWorld(true);
  return scale;
}

function outfitFor(index) {
  return {
    tee: APPAREL_FAMILIES.tops[index % APPAREL_FAMILIES.tops.length],
    jacket: APPAREL_FAMILIES.outer[0],
    legs: APPAREL_FAMILIES.legs[Math.floor(index / 2) % APPAREL_FAMILIES.legs.length],
    shoes: APPAREL_FAMILIES.feet[index % APPAREL_FAMILIES.feet.length],
    headwear: RIGID_FAMILIES.head[index % RIGID_FAMILIES.head.length],
    backpack: RIGID_FAMILIES.back[Math.floor(index / 3) % RIGID_FAMILIES.back.length],
    accessory: RIGID_FAMILIES.accessory[Math.floor(index / 5) % RIGID_FAMILIES.accessory.length],
  };
}

function mountedMeshes(mounts) {
  const meshes = [];
  for (const mount of mounts) {
    const root = mount.group || mount.anchor || mount.accessory || null;
    if (root?.traverse) root.traverse(object => { if (object.isMesh) meshes.push(object); });
    if (Array.isArray(mount.parts)) meshes.push(...mount.parts.filter(part => part?.isMesh));
  }
  return [...new Set(meshes)];
}

function mountOutfit(model, index) {
  const requested = outfitFor(index);
  const mounts = [], failures = [], mounted = [];
  for (const [slot, family] of Object.entries(requested)) {
    try {
      const candidate = ['tee', 'jacket', 'legs', 'shoes'].includes(slot)
        ? createUrbanApparelProxy(model, family)
        : mountUrbanRigidCandidate(model, family, {side: index % 2 ? 'left' : 'right'});
      if (!candidate) failures.push(`${slot}:${family}:factory-returned-null`);
      else {
        mounts.push(candidate);
        mounted.push(family);
      }
    } catch (error) {
      failures.push(`${slot}:${family}:${error.message}`);
    }
  }
  return {requested, mounts, mounted, failures};
}

function conservativeClipping(body, mounts) {
  const proxies = mountedMeshes(mounts);
  const boxes = proxies.map(mesh => new THREE.Box3().setFromObject(mesh)).filter(finiteBox);
  const position = body?.geometry?.getAttribute?.('position');
  if (!body || !position || boxes.length !== proxies.length) return {
    method: 'conservative-body-vertices-inside-proxy-world-aabb',
    sampledVertices: 0,
    overlappingVertices: 0,
    overlapPct: null,
    classification: 'not-measurable',
    certified: false,
  };
  const stride = Math.max(1, Math.floor(position.count / 1800));
  const point = new THREE.Vector3();
  let sampledVertices = 0, overlappingVertices = 0;
  for (let index = 0; index < position.count; index += stride) {
    body.getVertexPosition(index, point);
    point.applyMatrix4(body.matrixWorld);
    sampledVertices++;
    if (boxes.some(box => box.containsPoint(point))) overlappingVertices++;
  }
  const overlapPct = Number((100 * overlappingVertices / Math.max(1, sampledVertices)).toFixed(3));
  return {
    method: 'conservative-body-vertices-inside-proxy-world-aabb',
    sampledVertices,
    overlappingVertices,
    overlapPct,
    classification: overlappingVertices > 0 ? 'potential-contact-review-required' : 'no-aabb-overlap-detected',
    certified: false,
  };
}

function auditCurrent(body, mounts) {
  pivot.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(current.model);
  const meshes = mountedMeshes(mounts);
  let triangles = 0;
  for (const mesh of meshes) triangles += (mesh.geometry?.index?.count ?? mesh.geometry?.getAttribute?.('position')?.count ?? 0) / 3;
  return {
    boundsFinite: finiteBox(bounds),
    bounds: finiteBox(bounds) ? {min: bounds.min.toArray(), max: bounds.max.toArray()} : null,
    noHit: meshes.length > 0 && meshes.every(mesh => mesh.userData?.noHit === true && mesh.raycast !== THREE.Mesh.prototype.raycast),
    drawCalls: meshes.length,
    triangles: Math.round(triangles),
    clipping: conservativeClipping(body, mounts),
  };
}

async function loadBody(record, index) {
  pivot.clear();
  const gltf = await loader.loadAsync(`/${record.path.replace(/^public\//, '')}`);
  const model = gltf.scene;
  pivot.add(model);
  normalizeModel(model);
  const body = modelBody(model);
  const incompatible = record.fitProfile?.status === 'incompatible';
  let outfit = {requested: outfitFor(index), mounts: [], mounted: [], failures: []};
  if (incompatible) outfit.failures.push(`census-incompatible:${record.fitProfile.reason}`);
  else if (!body) outfit.failures.push('body:expected-exactly-one-skinned-mesh');
  else outfit = mountOutfit(model, index);
  model.updateMatrixWorld(true);
  current = {kind: 'body', model, body, record, mounts: outfit.mounts};
  const audit = auditCurrent(body, outfit.mounts);
  const status = incompatible ? 'incompatible' : outfit.failures.length ? 'fail-closed' : 'candidate';
  return {
    bodyId: record.bodyId,
    status,
    reason: incompatible ? record.fitProfile.reason : outfit.failures.join('; ') || 'all-deterministic-proxy-factories-mounted',
    familiesRequested: Object.values(outfit.requested),
    familiesMounted: outfit.mounted,
    failures: outfit.failures,
    fitStatus: 'fit-proxy-not-mint-asset',
    approved: false,
    certified: false,
    runtimeEnabled: false,
    ...audit,
  };
}

async function loadFamily({family, anchorPath = 'public/models/characters/capitao.glb', anchorBodyId = 'character:capitao'}) {
  pivot.clear();
  const gltf = await loader.loadAsync(`/${anchorPath.replace(/^public\//, '')}`);
  const model = gltf.scene;
  pivot.add(model);
  normalizeModel(model);
  const body = modelBody(model);
  if (!body) throw new Error(`${family}: anchor has no unique skinned mesh`);
  model.traverse(object => {
    if (!object.isMesh) return;
    const materials = (Array.isArray(object.material) ? object.material : [object.material]).map(material => {
      const clone = material.clone();
      clone.transparent = true;
      clone.opacity = 0.12;
      clone.depthWrite = false;
      clone.wireframe = true;
      clone.color?.setHex(0x71819a);
      return clone;
    });
    object.material = Array.isArray(object.material) ? materials : materials[0];
  });
  let candidate, factory;
  if (Object.values(APPAREL_FAMILIES).flat().includes(family)) {
    factory = 'createUrbanApparelProxy';
    candidate = createUrbanApparelProxy(model, family);
  } else if (Object.values(RIGID_FAMILIES).flat().includes(family)) {
    factory = 'mountUrbanRigidCandidate';
    candidate = mountUrbanRigidCandidate(model, family);
  } else if (Object.hasOwn(EYEWEAR_FAMILY_ASSETS, family)) {
    factory = 'mountEyewearCandidate';
    const itemId = EYEWEAR_FAMILY_ASSETS[family];
    const entry = eyewearManifest.eyewear[itemId];
    const profile = entry?.profiles?.capitao;
    const accessory = (await loader.loadAsync(entry.model)).scene;
    candidate = mountEyewearCandidate(model, accessory, profile, faceLandmarks.bodies.capitao, itemId);
  } else throw new Error(`${family}: no real factory mapping`);
  if (!candidate) throw new Error(`${family}: ${factory} returned null`);
  model.updateMatrixWorld(true);
  current = {kind: 'family', family, model, body, mounts: [candidate]};
  return {
    family,
    anchorBodyId,
    factory,
    assetId: EYEWEAR_FAMILY_ASSETS[family] || null,
    fitStatus: 'fit-proxy-not-mint-asset',
    approved: false,
    certified: false,
    runtimeEnabled: false,
    ...auditCurrent(body, [candidate]),
  };
}

function proxyBounds(mounts) {
  const bounds = new THREE.Box3();
  for (const mount of mounts) {
    const roots = mount.group ? [mount.group]
      : mount.anchor ? [mount.anchor]
        : mount.accessory ? [mount.accessory]
          : Array.isArray(mount.mounts) ? mount.mounts : [];
    for (const root of roots) bounds.expandByObject(root);
  }
  if (!finiteBox(bounds)) return bounds;
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  for (const axis of ['x', 'y', 'z']) {
    const half = Math.max(size[axis] * 0.5, 0.18);
    bounds.min[axis] = center[axis] - half;
    bounds.max[axis] = center[axis] + half;
  }
  return bounds;
}

function render(view = 'front') {
  if (!current) throw new Error('nothing loaded');
  const gallery = view === 'gallery';
  const rear = gallery && current.family?.startsWith('backpack-');
  pivot.rotation.y = rear ? Math.PI * 0.75 : view === 'threeQuarter' || gallery ? -Math.PI / 4 : 0;
  pivot.updateMatrixWorld(true);
  const bounds = gallery ? proxyBounds(current.mounts) : new THREE.Box3().setFromObject(current.model);
  if (!finiteBox(bounds)) throw new Error(`${current.family || current.record?.bodyId}: view bounds are not finite`);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  if (gallery) {
    const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));
    const distance = Math.max(
      size.y / (2 * tangent) * 1.28,
      size.x / (2 * tangent * camera.aspect) * 1.28,
      size.z * 1.8,
      0.65,
    );
    camera.position.set(center.x, center.y, center.z + distance);
    camera.lookAt(center);
  } else {
    const distance = Math.max(3.25, size.y * 2.05, size.x * 2.7);
    camera.position.set(0, center.y + size.y * 0.015, distance);
    camera.lookAt(0, center.y, 0);
  }
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
  return {view, boundsFinite: true};
}

window.urbanCatalogFit = {loadBody, loadFamily, render, outfitFor};
window.urbanCatalogFitReady = true;
