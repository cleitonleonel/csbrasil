#!/usr/bin/env node
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  createUrbanApparelProxy,
  URBAN_APPAREL_FAMILIES,
  URBAN_APPAREL_STATUS,
} from '../../public/js/procedural-urban-apparel.js';

const BONE_LAYOUT = Object.freeze([
  ['Hips', null, [0, 0.9, 0]],
  ['Spine', 'Hips', [0, 0.25, 0]],
  ['Spine02', 'Spine', [0, 0.3, 0]],
  ['LeftUpperArm', 'Spine02', [0.35, 0, 0]],
  ['RightUpperArm', 'Spine02', [-0.35, 0, 0]],
  ['LeftLowerLeg', 'Hips', [0.14, -0.45, 0]],
  ['RightLowerLeg', 'Hips', [-0.14, -0.45, 0]],
  ['LeftFoot', 'LeftLowerLeg', [0, -0.4, 0.08]],
  ['RightFoot', 'RightLowerLeg', [0, -0.4, 0.08]],
]);
const BODY_REGIONS = Object.freeze([
  ['Hips', [0, 0.94, 0], [0.42, 0.28, 0.25]],
  ['Spine', [0, 1.18, 0], [0.44, 0.3, 0.25]],
  ['Spine02', [0, 1.48, 0], [0.54, 0.34, 0.29]],
  ['LeftUpperArm', [0.4, 1.42, 0], [0.2, 0.44, 0.2]],
  ['RightUpperArm', [-0.4, 1.42, 0], [0.2, 0.44, 0.2]],
  ['LeftLowerLeg', [0.14, 0.47, 0], [0.2, 0.7, 0.21]],
  ['RightLowerLeg', [-0.14, 0.47, 0], [0.2, 0.7, 0.21]],
  ['LeftFoot', [0.14, 0.09, 0.1], [0.22, 0.16, 0.44]],
  ['RightFoot', [-0.14, 0.09, 0.1], [0.22, 0.16, 0.44]],
]);

function fixture({ omit = null, scale = [1, 1, 1] } = {}) {
  const model = new THREE.Group();
  model.name = 'synthetic-urban-apparel-body';
  const bones = new Map();
  for (const [name, parentName, position] of BONE_LAYOUT) {
    if (name === omit) continue;
    const bone = new THREE.Bone();
    bone.name = name;
    bone.position.fromArray(position);
    bones.set(name, bone);
    const parent = bones.get(parentName);
    (parent || model).add(bone);
  }
  const ordered = [...bones.values()];
  const boneIndex = new Map(ordered.map((bone, index) => [bone.name, index]));
  const positions = [], indices = [], weights = [];
  for (const [name, center, size] of BODY_REGIONS) {
    if (!boneIndex.has(name)) continue;
    const box = new THREE.BoxGeometry(...size).toNonIndexed();
    box.translate(...center);
    const source = box.getAttribute('position');
    for (let vertex = 0; vertex < source.count; vertex++) {
      positions.push(source.getX(vertex), source.getY(vertex), source.getZ(vertex));
      indices.push(boneIndex.get(name), 0, 0, 0);
      weights.push(1, 0, 0, 0);
    }
    box.dispose();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(indices, 4));
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(weights, 4));
  const body = new THREE.SkinnedMesh(geometry, new THREE.MeshBasicMaterial());
  body.name = 'SyntheticBody';
  body.scale.fromArray(scale);
  model.add(body);
  model.updateMatrixWorld(true);
  body.bind(new THREE.Skeleton(ordered));
  model.updateMatrixWorld(true);
  return { model, body, bones };
}

function rigSnapshot(body) {
  return body.skeleton.bones.map((bone, index) => ({
    bone,
    parent: bone.parent,
    position: bone.position.toArray(),
    quaternion: bone.quaternion.toArray(),
    scale: bone.scale.toArray(),
    inverse: body.skeleton.boneInverses[index].toArray(),
  }));
}

function assertRigUnchanged(body, before) {
  assert.equal(body.skeleton.bones.length, before.length, 'proxy changed skeleton bone count');
  before.forEach((entry, index) => {
    const bone = body.skeleton.bones[index];
    assert.equal(bone, entry.bone, 'proxy replaced a skeleton bone');
    assert.equal(bone.parent, entry.parent, `${bone.name}: proxy reparented a bone`);
    assert.deepEqual(bone.position.toArray(), entry.position, `${bone.name}: proxy changed rest position`);
    assert.deepEqual(bone.quaternion.toArray(), entry.quaternion, `${bone.name}: proxy changed rest rotation`);
    assert.deepEqual(bone.scale.toArray(), entry.scale, `${bone.name}: proxy changed rest scale`);
    assert.deepEqual(body.skeleton.boneInverses[index].toArray(), entry.inverse, `${bone.name}: proxy changed inverse bind`);
  });
}

function pairMap(proxy) {
  const pairs = new Map();
  for (const mesh of proxy.parts) {
    const pairId = mesh.userData.pairId;
    if (!pairId) continue;
    if (!pairs.has(pairId)) pairs.set(pairId, []);
    pairs.get(pairId).push(mesh);
  }
  return pairs;
}

function validateProxy(proxy, family) {
  assert(proxy, `${family}: compatible body did not receive proxy`);
  assert.equal(proxy.family, family);
  assert.equal(proxy.status, URBAN_APPAREL_STATUS);
  assert.equal(proxy.certified, false);
  assert.equal(proxy.dimensions.source, 'weighted-skinned-mesh-bind-space');
  assert.equal(proxy.renderMetrics.drawCalls, proxy.parts.length);
  assert(proxy.renderMetrics.drawCalls > 0 && proxy.renderMetrics.drawCalls <= 8, `${family}: draw-call budget exceeded`);
  assert(proxy.renderMetrics.triangles > 0 && proxy.renderMetrics.triangles <= 8000, `${family}: triangle budget exceeded`);
  assert(proxy.material.isMeshStandardMaterial && proxy.material.map === null, `${family}: proxy material is not solid/replaceable`);
  assert.equal(proxy.material.userData.materialKind, 'solid-replaceable-proxy');
  assert.equal(new Set(proxy.mounts.map(mount => mount.userData.bone)).size, proxy.mounts.length, `${family}: duplicate bone mount`);
  for (const mount of proxy.mounts) {
    assert.equal(mount.parent?.name, mount.userData.bone, `${family}: mount is not bone-local`);
    assert.equal(mount.userData.space, 'bone-local');
    assert.equal(mount.userData.status, URBAN_APPAREL_STATUS);
  }
  for (const mesh of proxy.parts) {
    assert.equal(mesh.userData.family, family);
    assert.equal(mesh.userData.status, URBAN_APPAREL_STATUS);
    assert.equal(mesh.userData.noHit, true);
    assert.equal(mesh.userData.replaceWithMintGlb, true);
    assert(Object.hasOwn(mesh, 'raycast'), `${family}/${mesh.name}: raycast override missing`);
    assert.notEqual(mesh.raycast, THREE.Mesh.prototype.raycast, `${family}/${mesh.name}: raycast enabled`);
    const hits = [];
    mesh.raycast({}, hits);
    assert.deepEqual(hits, [], `${family}/${mesh.name}: proxy entered raycast results`);
    assert(mesh.geometry.boundingBox && mesh.geometry.boundingSphere, `${family}/${mesh.name}: geometry bounds missing`);
    assert(mesh.userData.dimensions.every(value => Number.isFinite(value) && value > 0), `${family}/${mesh.name}: invalid measured dimensions`);
  }
  const pairs = pairMap(proxy);
  assert(pairs.size > 0, `${family}: no coherent left/right pair`);
  for (const [pairId, meshes] of pairs) {
    assert.equal(meshes.length, 2, `${family}/${pairId}: pair cardinality changed`);
    assert.deepEqual(meshes.map(mesh => mesh.userData.side).sort(), ['left', 'right'], `${family}/${pairId}: side identity changed`);
    assert.deepEqual(meshes[0].userData.dimensions, meshes[1].userData.dimensions, `${family}/${pairId}: left/right dimensions diverged`);
  }
}

function worldVertex(mesh) {
  const position = mesh.geometry.getAttribute('position');
  return new THREE.Vector3(position.getX(0), position.getY(0), position.getZ(0)).applyMatrix4(mesh.matrixWorld);
}

function assertFollowsSyntheticPose(entry, proxy) {
  entry.model.updateMatrixWorld(true);
  const before = new Map(proxy.parts.map(mesh => [mesh, worldVertex(mesh)]));
  entry.bones.get('Hips').position.x += 0.08;
  entry.bones.get('Spine').rotation.z = 0.13;
  entry.bones.get('Spine02').rotation.z = -0.18;
  entry.bones.get('LeftUpperArm').rotation.z = 0.45;
  entry.bones.get('RightUpperArm').rotation.z = -0.45;
  entry.bones.get('LeftLowerLeg').rotation.x = 0.5;
  entry.bones.get('RightLowerLeg').rotation.x = -0.35;
  entry.bones.get('LeftFoot').rotation.x = -0.3;
  entry.bones.get('RightFoot').rotation.x = 0.22;
  entry.model.updateMatrixWorld(true);
  for (const mesh of proxy.parts) {
    const distance = worldVertex(mesh).distanceTo(before.get(mesh));
    assert(distance > 1e-4, `${proxy.family}/${mesh.userData.partId}: part did not follow synthetic pose`);
  }
}

function silhouetteSignature(proxy) {
  const height = proxy.dimensions.body[1];
  return proxy.parts.map(mesh => [
    mesh.userData.shape,
    mesh.userData.bone,
    ...mesh.userData.dimensions.map(value => Number((value / height).toFixed(4))),
  ].join(':')).sort().join('|');
}

function baseCheck() {
  assert.deepEqual(URBAN_APPAREL_FAMILIES, [
    'boxy-tee', 'oversized-tee', 'shell-jacket', 'cargo-pants',
    'bermuda-shorts', 'low-sneaker', 'chunky-runner', 'boot',
  ], 'canonical urban apparel families changed');
  const rows = [], signatures = new Set();
  for (const family of URBAN_APPAREL_FAMILIES) {
    const entry = fixture(), before = rigSnapshot(entry.body);
    const proxy = createUrbanApparelProxy(entry.model, family);
    validateProxy(proxy, family);
    assertRigUnchanged(entry.body, before);
    const signature = silhouetteSignature(proxy);
    assert(!signatures.has(signature), `${family}: silhouette duplicates another family`);
    signatures.add(signature);
    assertFollowsSyntheticPose(entry, proxy);
    rows.push({ family, ...proxy.renderMetrics, mounts: proxy.mounts.length, silhouette: proxy.silhouette });
    proxy.dispose();
    assert(proxy.mounts.every(mount => mount.parent === null), `${family}: dispose left a bone attachment`);
    entry.body.geometry.dispose();
    entry.body.material.dispose();
  }
  assert.equal(signatures.size, 8, 'eight distinct silhouettes required');
  return rows;
}

function mutants() {
  const results = [];
  {
    const entry = fixture({ omit: 'RightUpperArm' });
    const proxy = createUrbanApparelProxy(entry.model, 'boxy-tee');
    assert.equal(proxy, null, 'missing-bone mutant survived');
    results.push({ name: 'missing-bone', killed: true });
  }
  {
    const entry = fixture({ scale: [100, 0.001, 100] });
    const proxy = createUrbanApparelProxy(entry.model, 'cargo-pants');
    assert.equal(proxy, null, 'extreme-scale mutant survived');
    results.push({ name: 'extreme-scale', killed: true });
  }
  {
    const entry = fixture(), proxy = createUrbanApparelProxy(entry.model, 'low-sneaker');
    const mesh = proxy.parts[0], original = mesh.raycast;
    mesh.raycast = THREE.Mesh.prototype.raycast;
    assert.notEqual(mesh.raycast, original, 'raycast mutation did not apply');
    let killed = false, reason = '';
    try { validateProxy(proxy, 'low-sneaker'); } catch (error) { killed = true; reason = error.message; }
    assert(killed, 'raycast mutant survived');
    results.push({ name: 'raycast-enabled', killed, reason });
    proxy.dispose();
  }
  {
    const entry = fixture(), proxy = createUrbanApparelProxy(entry.model, 'chunky-runner');
    const right = proxy.parts.find(mesh => mesh.userData.side === 'right');
    assert(right, 'side mutation target missing');
    right.userData.side = 'left';
    let killed = false, reason = '';
    try { validateProxy(proxy, 'chunky-runner'); } catch (error) { killed = true; reason = error.message; }
    assert(killed, 'side-identity mutant survived');
    results.push({ name: 'side-identity', killed, reason });
    proxy.dispose();
  }
  return results;
}

const rows = baseCheck();
const mutationResults = process.argv.includes('--mutate') ? mutants() : [];
console.log(`urban-apparel ${mutationResults.length ? 'mutate' : 'check'}: ${JSON.stringify({ status: URBAN_APPAREL_STATUS, families: rows, mutants: mutationResults })}`);
