#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import * as THREE from 'three';
import {
  URBAN_RIGID_FAMILIES,
  URBAN_RIGID_FAMILY_IDS,
  URBAN_RIGID_TRIANGLE_LIMIT,
  URBAN_RIGID_VERSION,
  auditUrbanRigidCandidate,
  mountUrbanRigidCandidate,
} from '../../public/js/procedural-urban-rigid.js';

const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const rounded = value => Math.round(value * 1e7) / 1e7;

function corners(min, max) {
  const values = [];
  for (const x of [min[0], max[0]]) for (const y of [min[1], max[1]]) for (const z of [min[2], max[2]]) values.push([x, y, z]);
  return values;
}

function syntheticBody({ omit = null, noWeights = false, duplicateBody = false } = {}) {
  const model = new THREE.Group();
  model.name = 'synthetic-rigid-preview';
  const bones = {};
  const bone = (name, parent, position) => {
    const item = new THREE.Bone();
    item.name = name === omit ? `${name}-missing` : name;
    item.position.set(...position);
    (parent || model).add(item);
    bones[name] = item;
    return item;
  };
  const hips = bone('Hips', null, [0, 0.9, 0]);
  const spine = bone('Spine', hips, [0, 0.24, 0]);
  const chest = bone('Spine02', spine, [0, 0.31, 0]);
  bone('Head', chest, [0, 0.35, 0]);
  const leftArm = bone('LeftArm', chest, [-0.34, 0.02, 0]);
  bone('LeftHand', leftArm, [-0.32, -0.3, 0]);
  const rightArm = bone('RightArm', chest, [0.34, 0.02, 0]);
  bone('RightHand', rightArm, [0.32, -0.3, 0]);
  model.updateMatrixWorld(true);
  const ordered = ['Hips', 'Spine', 'Spine02', 'Head', 'LeftArm', 'LeftHand', 'RightArm', 'RightHand'].map(name => bones[name]);
  const regions = [
    ['Hips', [-0.2, 0.76, -0.12], [0.2, 1.08, 0.12]],
    ['Spine', [-0.23, 1.05, -0.13], [0.23, 1.3, 0.13]],
    ['Spine02', [-0.27, 1.27, -0.15], [0.27, 1.57, 0.15]],
    ['Head', [-0.125, 1.56, -0.115], [0.125, 1.84, 0.115]],
    ['LeftArm', [-0.59, 1.16, -0.075], [-0.25, 1.38, 0.075]],
    ['LeftHand', [-0.72, 0.92, -0.065], [-0.58, 1.08, 0.065]],
    ['RightArm', [0.25, 1.16, -0.075], [0.59, 1.38, 0.075]],
    ['RightHand', [0.58, 0.92, -0.065], [0.72, 1.08, 0.065]],
  ];
  const positions = [], indices = [], weights = [];
  for (const [name, min, max] of regions) {
    const index = ordered.indexOf(bones[name]);
    for (const point of corners(min, max)) {
      positions.push(...point);
      indices.push(index, 0, 0, 0);
      weights.push(1, 0, 0, 0);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(indices, 4));
  if (!noWeights) geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(weights, 4));
  const body = new THREE.SkinnedMesh(geometry, new THREE.MeshBasicMaterial());
  body.name = 'SyntheticBody';
  body.bind(new THREE.Skeleton(ordered));
  model.add(body);
  if (duplicateBody) {
    const duplicate = new THREE.SkinnedMesh(geometry.clone(), new THREE.MeshBasicMaterial());
    duplicate.bind(body.skeleton);
    model.add(duplicate);
  }
  model.updateMatrixWorld(true);
  return { model, body, bones };
}

function meshes(root) {
  const values = [];
  root.traverse(object => { if (object.isMesh) values.push(object); });
  return values;
}

function deterministicSignature(root, includeMaterial = true) {
  root.updateMatrixWorld(true);
  return hash(meshes(root).map(mesh => ({
    type: mesh.geometry.type,
    position: Array.from(mesh.geometry.getAttribute('position').array, rounded),
    index: mesh.geometry.index ? Array.from(mesh.geometry.index.array) : null,
    transform: [...mesh.position.toArray(), ...mesh.rotation.toArray().slice(0, 3), ...mesh.scale.toArray()].map(rounded),
    material: includeMaterial ? [mesh.material.color.getHex(), rounded(mesh.material.roughness), rounded(mesh.material.metalness)] : undefined,
  })));
}

function visualSignature(root) {
  root.updateMatrixWorld(true);
  return hash(meshes(root).map(mesh => {
    mesh.geometry.computeBoundingBox();
    const box = mesh.geometry.boundingBox;
    return {
      type: mesh.geometry.type,
      triangles: (mesh.geometry.index?.count ?? mesh.geometry.getAttribute('position').count) / 3,
      size: box.getSize(new THREE.Vector3()).toArray().map(rounded),
      center: box.getCenter(new THREE.Vector3()).toArray().map(rounded),
      transform: [...mesh.position.toArray(), ...mesh.rotation.toArray().slice(0, 3), ...mesh.scale.toArray()].map(rounded),
    };
  }));
}

function resources(candidate) {
  const geometries = new Set(), materials = new Set();
  for (const mesh of meshes(candidate.group)) {
    geometries.add(mesh.geometry);
    for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) materials.add(material);
  }
  return { geometries, materials };
}

function expectAuditFailure(candidate, pattern) {
  assert.throws(() => auditUrbanRigidCandidate(candidate), pattern);
}

function checkMetadata() {
  assert.equal(URBAN_RIGID_VERSION, 'cs-urban-rigid-candidate/1');
  assert.equal(URBAN_RIGID_FAMILY_IDS.length, 16);
  assert.deepEqual(Object.keys(URBAN_RIGID_FAMILIES), URBAN_RIGID_FAMILY_IDS);
  for (const id of URBAN_RIGID_FAMILY_IDS) {
    const family = URBAN_RIGID_FAMILIES[id];
    assert.equal(family.id, id);
    assert.equal(family.geometryFamily, id);
    assert.equal(family.status, 'candidate');
    assert.equal(family.approved, false);
    assert.equal(family.certified, false);
    assert.equal(family.finalAsset, false);
    assert.equal(family.branded, false);
    assert.equal(family.triangleLimit, URBAN_RIGID_TRIANGLE_LIMIT);
    assert.ok(['Head', 'Spine02', 'LeftHand', 'RightHand'].includes(family.socket));
    assert.ok(Object.isFrozen(family));
  }
}

function checkFamilies() {
  const visual = new Set(), report = [];
  for (const id of URBAN_RIGID_FAMILY_IDS) {
    const firstRig = syntheticBody(), secondRig = syntheticBody();
    const first = mountUrbanRigidCandidate(firstRig.model, id);
    const second = mountUrbanRigidCandidate(secondRig.model, id);
    assert.ok(first && second, `${id}: candidate should mount`);
    assert.equal(first.group.parent, first.socket, `${id}: canonical socket parent`);
    assert.equal(first.socket.name, URBAN_RIGID_FAMILIES[id].socket);
    assert.deepEqual(auditUrbanRigidCandidate(first), { ...first.renderMetrics, socket: first.socket.name, family: id });
    assert.ok(first.renderMetrics.triangles <= URBAN_RIGID_TRIANGLE_LIMIT, `${id}: triangle budget`);
    assert.equal(first.group.userData.renderMetrics.drawCalls, first.renderMetrics.drawCalls);
    assert.equal(first.group.userData.renderMetrics.triangles, first.renderMetrics.triangles);
    assert.equal(deterministicSignature(first.group), deterministicSignature(second.group), `${id}: deterministic geometry`);
    const shape = visualSignature(first.group);
    assert.ok(!visual.has(shape), `${id}: geometry must be visually distinct`);
    visual.add(shape);
    for (const mesh of meshes(first.group)) {
      assert.equal(mesh.userData.noHit, true);
      assert.equal(mesh.castShadow, false);
      assert.equal(mesh.receiveShadow, false);
      assert.equal(mesh.material.map, null, `${id}: no texture/logo map`);
      assert.doesNotMatch(mesh.name, /logo|brand|marca/i);
      const hits = [];
      mesh.raycast(new THREE.Raycaster(), hits);
      assert.deepEqual(hits, []);
    }
    const a = resources(first), b = resources(second);
    for (const geometry of a.geometries) assert.ok(!b.geometries.has(geometry), `${id}: geometry shared across clones`);
    for (const material of a.materials) assert.ok(!b.materials.has(material), `${id}: material shared across clones`);
    const sampleA = [...a.materials][0], sampleB = [...b.materials][0], originalB = sampleB.color.getHex();
    sampleA.color.setHex(0x010203);
    assert.equal(sampleB.color.getHex(), originalB, `${id}: material mutation leaked`);
    const before = new THREE.Vector3();
    first.group.getWorldPosition(before);
    first.socket.position.x += 0.137;
    firstRig.model.updateMatrixWorld(true);
    const after = new THREE.Vector3();
    first.group.getWorldPosition(after);
    assert.ok(Math.abs(after.x - before.x - 0.137) < 1e-6, `${id}: socket transform did not propagate`);
    const geometryDisposals = new Map([...a.geometries].map(item => [item, 0]));
    const materialDisposals = new Map([...a.materials].map(item => [item, 0]));
    for (const item of a.geometries) item.addEventListener('dispose', () => geometryDisposals.set(item, geometryDisposals.get(item) + 1));
    for (const item of a.materials) item.addEventListener('dispose', () => materialDisposals.set(item, materialDisposals.get(item) + 1));
    first.dispose(); first.dispose();
    assert.equal(first.group.parent, null);
    assert.equal(first.group.userData.disposed, true);
    assert.ok([...geometryDisposals.values()].every(count => count === 1), `${id}: geometry disposal not idempotent`);
    assert.ok([...materialDisposals.values()].every(count => count === 1), `${id}: material disposal not idempotent`);
    second.dispose();
    firstRig.body.geometry.dispose(); firstRig.body.material.dispose();
    secondRig.body.geometry.dispose(); secondRig.body.material.dispose();
    report.push({ id, ...first.renderMetrics });
  }
  assert.equal(visual.size, URBAN_RIGID_FAMILY_IDS.length);
  return report;
}

function checkParameters() {
  const baseRig = syntheticBody(), customRig = syntheticBody();
  const base = mountUrbanRigidCandidate(baseRig.model, 'backpack-rolltop');
  const custom = mountUrbanRigidCandidate(customRig.model, 'backpack-rolltop', { size: 1.1, width: 1.2, height: 0.82, depth: 1.15, detail: 1.25, primary: '#173d4a', accent: '#d78235' });
  assert.notEqual(deterministicSignature(base.group), deterministicSignature(custom.group));
  assert.throws(() => mountUrbanRigidCandidate(syntheticBody().model, 'backpack-rolltop', { size: 2 }), /outside/);
  const leftRig = syntheticBody(), left = mountUrbanRigidCandidate(leftRig.model, 'accessory-bracelet', { side: 'left' });
  assert.equal(left.socket.name, 'LeftHand');
  base.dispose(); custom.dispose(); left.dispose();
}

function checkFailClosed() {
  for (const socket of ['Head', 'Spine02', 'LeftHand', 'RightHand']) {
    const family = URBAN_RIGID_FAMILY_IDS.find(id => URBAN_RIGID_FAMILIES[id].socket === socket);
    assert.ok(family);
    assert.equal(mountUrbanRigidCandidate(syntheticBody({ omit: socket }).model, family), null, `${socket}: missing socket accepted`);
  }
  assert.equal(mountUrbanRigidCandidate(syntheticBody({ noWeights: true }).model, 'headwear-beanie'), null, 'missing bounds accepted');
  assert.equal(mountUrbanRigidCandidate(syntheticBody({ duplicateBody: true }).model, 'headwear-beanie'), null, 'ambiguous body accepted');
}

function checkMutants() {
  const socketRig = syntheticBody(), socket = mountUrbanRigidCandidate(socketRig.model, 'backpack-rolltop');
  socketRig.model.add(socket.group);
  expectAuditFailure(socket, /socket attachment/);
  socket.dispose();

  const hitRig = syntheticBody(), hit = mountUrbanRigidCandidate(hitRig.model, 'headwear-bucket');
  const hitMesh = meshes(hit.group)[0];
  hitMesh.userData.noHit = false;
  hitMesh.raycast = THREE.Mesh.prototype.raycast;
  expectAuditFailure(hit, /hit isolation/);
  hit.dispose();

  const performanceRig = syntheticBody(), performance = mountUrbanRigidCandidate(performanceRig.model, 'accessory-chain');
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array((URBAN_RIGID_TRIANGLE_LIMIT + 1) * 9), 3));
  const material = new THREE.MeshBasicMaterial();
  const overload = new THREE.Mesh(geometry, material);
  overload.userData.noHit = true;
  overload.castShadow = false;
  overload.receiveShadow = false;
  performance.group.add(overload);
  expectAuditFailure(performance, /performance budget/);
  performance.dispose();
}

try {
  checkMetadata();
  const items = checkFamilies();
  checkParameters();
  checkFailClosed();
  checkMutants();
  const totals = items.reduce((sum, item) => ({ triangles: sum.triangles + item.triangles, drawCalls: sum.drawCalls + item.drawCalls }), { triangles: 0, drawCalls: 0 });
  console.log(`✓ URBAN-RIGID 16 famílias determinísticas, mutantes socket/hit/performance mordidos: ${JSON.stringify({ limit: URBAN_RIGID_TRIANGLE_LIMIT, maxTriangles: Math.max(...items.map(item => item.triangles)), maxDrawCalls: Math.max(...items.map(item => item.drawCalls)), totals })}`);
} catch (error) {
  console.error(`✗ URBAN-RIGID ${error.stack || error.message}`);
  process.exitCode = 1;
}
