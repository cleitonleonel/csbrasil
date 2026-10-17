#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import {
  authoredFrameFor,
  VM_FRAME,
  VM_SIDE_CONTRACT,
  VM_WEAPON,
  viewmodelPlan,
} from '../../public/js/data/vmconfig.js';
import { WEAPON_IDS, weaponCFG } from '../../public/js/weapons.js';
import { main as runMintAudit } from './vm-mint-audit.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PRIVATE_ROOT = '/Users/ruben/csbrasil-private-assets/generated/viewmodels';
const REPORT_FILE = path.join(ROOT, 'tools/eval/vm_side_contract.json');
const FIREARMS = WEAPON_IDS.filter((id) => id !== 'knife');
const HAND_MATERIAL = /CoroSolto_(?:FP_(?:Hand|Gloves?|Cloth)|Mandrake_Sleeves)/i;
const MUTANT = process.argv.find((arg) => arg.startsWith('--mutante='))?.slice(10) || '';
const MUTANTS = new Set(['topo', 'fora', 'sem-contato']);

if (MUTANT && !MUTANTS.has(MUTANT)) {
  throw new Error(`mutante desconhecido: ${MUTANT}`);
}

function geometryOnlyGlb(file) {
  const source = fs.readFileSync(file);
  if (source.readUInt32LE(0) !== 0x46546c67) throw new Error(`${file}: não é GLB`);
  const chunks = [];
  let offset = 12;
  while (offset + 8 <= source.length) {
    const length = source.readUInt32LE(offset);
    const type = source.readUInt32LE(offset + 4);
    chunks.push({ type, data: source.subarray(offset + 8, offset + 8 + length) });
    offset += 8 + length;
  }
  const jsonChunk = chunks.find((chunk) => chunk.type === 0x4e4f534a);
  const binChunk = chunks.find((chunk) => chunk.type === 0x004e4942);
  if (!jsonChunk || !binChunk) throw new Error(`${file}: chunks JSON/BIN ausentes`);
  const json = JSON.parse(jsonChunk.data.toString('utf8'));
  for (const material of json.materials || []) {
    if (material.pbrMetallicRoughness) {
      delete material.pbrMetallicRoughness.baseColorTexture;
      delete material.pbrMetallicRoughness.metallicRoughnessTexture;
    }
    delete material.normalTexture;
    delete material.occlusionTexture;
    delete material.emissiveTexture;
    delete material.extensions;
  }
  delete json.images;
  delete json.textures;
  delete json.samplers;
  if (json.extensionsUsed) {
    json.extensionsUsed = json.extensionsUsed.filter((name) => !['EXT_texture_webp', 'KHR_texture_basisu'].includes(name));
    if (!json.extensionsUsed.length) delete json.extensionsUsed;
  }
  if (json.extensionsRequired) {
    json.extensionsRequired = json.extensionsRequired.filter((name) => !['EXT_texture_webp', 'KHR_texture_basisu'].includes(name));
    if (!json.extensionsRequired.length) delete json.extensionsRequired;
  }
  const encoded = Buffer.from(JSON.stringify(json));
  const jsonLength = Math.ceil(encoded.length / 4) * 4;
  const paddedJson = Buffer.alloc(jsonLength, 0x20);
  encoded.copy(paddedJson);
  const out = Buffer.alloc(12 + 8 + jsonLength + 8 + binChunk.data.length);
  out.writeUInt32LE(0x46546c67, 0);
  out.writeUInt32LE(2, 4);
  out.writeUInt32LE(out.length, 8);
  out.writeUInt32LE(jsonLength, 12);
  out.writeUInt32LE(0x4e4f534a, 16);
  paddedJson.copy(out, 20);
  const binHeader = 20 + jsonLength;
  out.writeUInt32LE(binChunk.data.length, binHeader);
  out.writeUInt32LE(0x004e4942, binHeader + 4);
  binChunk.data.copy(out, binHeader + 8);
  return out;
}

async function loadGeometry(file) {
  const bytes = geometryOnlyGlb(file);
  const arrayBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  return await new Promise((resolve, reject) => new GLTFLoader().parse(arrayBuffer, '', resolve, reject));
}

function materialsOf(object) {
  return Array.isArray(object.material) ? object.material : [object.material];
}

function utilityDescendant(object) {
  for (let current = object; current; current = current.parent) {
    if (/^UTILITY_/.test(current.name)) return true;
  }
  return false;
}

function handSide(object, index) {
  if (/lhand/i.test(object.name)) return 'left';
  if (/rhand/i.test(object.name)) return 'right';
  if (!object.isSkinnedMesh) return '';
  const indices = object.geometry.getAttribute('skinIndex');
  const weights = object.geometry.getAttribute('skinWeight');
  if (!indices || !weights) return '';
  const joints = new THREE.Vector4().fromBufferAttribute(indices, index);
  const influences = new THREE.Vector4().fromBufferAttribute(weights, index);
  let left = 0;
  let right = 0;
  for (let lane = 0; lane < 4; lane += 1) {
    const bone = object.skeleton.bones[joints.getComponent(lane)]?.name || '';
    const weight = influences.getComponent(lane);
    if (/(?:^|[_ .])L(?:_|$)|Left/i.test(bone)) left += weight;
    if (/(?:^|[_ .])R(?:_|$)|Right/i.test(bone)) right += weight;
  }
  return left > right ? 'left' : right > left ? 'right' : '';
}

function sampleHands(object, maxPoints) {
  const position = object.geometry?.getAttribute('position');
  const result = { left: [], right: [] };
  if (!position) return result;
  const step = Math.max(1, Math.ceil(position.count / maxPoints));
  if (object.isSkinnedMesh) object.skeleton.update();
  for (let index = 0; index < position.count; index += step) {
    const side = handSide(object, index);
    if (!side) continue;
    const point = new THREE.Vector3().fromBufferAttribute(position, index);
    if (object.isSkinnedMesh) object.applyBoneTransform(index, point);
    result[side].push(point.applyMatrix4(object.matrixWorld));
  }
  return result;
}

function sampleMesh(object, maxPoints) {
  const position = object.geometry?.getAttribute('position');
  if (!position) return [];
  const step = Math.max(1, Math.ceil(position.count / maxPoints));
  const points = [];
  for (let index = 0; index < position.count; index += step) {
    const point = new THREE.Vector3().fromBufferAttribute(position, index);
    if (object.isSkinnedMesh) object.applyBoneTransform(index, point);
    points.push(point.applyMatrix4(object.matrixWorld));
  }
  return points;
}

function boundsOf(points) {
  const box = new THREE.Box3();
  for (const point of points) box.expandByPoint(point);
  return box;
}

function centerOf(points) {
  const center = new THREE.Vector3();
  for (const point of points) center.add(point);
  return center.multiplyScalar(1 / Math.max(points.length, 1));
}

function principalAxis(points) {
  const center = centerOf(points);
  const covariance = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const point of points) {
    const x = point.x - center.x;
    const y = point.y - center.y;
    const z = point.z - center.z;
    covariance[0] += x * x; covariance[1] += x * y; covariance[2] += x * z;
    covariance[3] += x * y; covariance[4] += y * y; covariance[5] += y * z;
    covariance[6] += x * z; covariance[7] += y * z; covariance[8] += z * z;
  }
  let axis = new THREE.Vector3(1, 0.3, 0.1).normalize();
  for (let iteration = 0; iteration < 20; iteration += 1) {
    axis.set(
      covariance[0] * axis.x + covariance[1] * axis.y + covariance[2] * axis.z,
      covariance[3] * axis.x + covariance[4] * axis.y + covariance[5] * axis.z,
      covariance[6] * axis.x + covariance[7] * axis.y + covariance[8] * axis.z,
    ).normalize();
  }
  return axis;
}

function rotatePackageToTop(packagePoints) {
  const axis = principalAxis(packagePoints.weapon);
  const rotation = new THREE.Quaternion().setFromUnitVectors(axis, new THREE.Vector3(0, 0, -1));
  const center = centerOf(packagePoints.weapon);
  for (const points of [packagePoints.weapon, packagePoints.left, packagePoints.right]) {
    for (const point of points) point.sub(center).applyQuaternion(rotation).add(center);
  }
}

function translate(points, x, y, z) {
  for (const point of points) {
    point.x += x;
    point.y += y;
    point.z += z;
  }
}

function minimumDistance(a, b) {
  let bestSquared = Infinity;
  for (const left of a) {
    for (const right of b) {
      const distance = left.distanceToSquared(right);
      if (distance < bestSquared) bestSquared = distance;
    }
  }
  return Math.sqrt(bestSquared);
}

function screenMetrics(points, fov, aspect) {
  const camera = new THREE.PerspectiveCamera(fov, aspect, 0.01, 50);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  const projected = [];
  let visible = 0;
  for (const point of points) {
    const ndc = point.clone().project(camera);
    if (point.z < -camera.near && ndc.z >= -1 && ndc.z <= 1
      && ndc.x >= -1 && ndc.x <= 1 && ndc.y >= -1 && ndc.y <= 1) {
      visible += 1;
      projected.push(new THREE.Vector2(ndc.x * aspect, ndc.y));
    }
  }
  let direction = null;
  if (projected.length >= 3) {
    const center = projected.reduce((sum, point) => sum.add(point), new THREE.Vector2())
      .multiplyScalar(1 / projected.length);
    let xx = 0;
    let xy = 0;
    let yy = 0;
    for (const point of projected) {
      const x = point.x - center.x;
      const y = point.y - center.y;
      xx += x * x;
      xy += x * y;
      yy += y * y;
    }
    direction = 0.5 * Math.atan2(2 * xy, xx - yy) * 180 / Math.PI;
  }
  const axis = direction == null ? null : Math.min(Math.abs(direction), 180 - Math.abs(direction));
  return {
    visible: visible / Math.max(points.length, 1),
    axisDeg: axis,
    directionDeg: direction,
  };
}

async function goldsrcMetrics(id) {
  const file = path.join(PRIVATE_ROOT, 'goldsrc-vm', `${id}-runtime.glb`);
  const gltf = await loadGeometry(file);
  const scene = gltf.scene;
  scene.updateMatrixWorld(true);
  let authoredCamera = null;
  scene.traverse((object) => {
    if (!authoredCamera && object.isPerspectiveCamera) authoredCamera = object;
  });
  if (!authoredCamera) throw new Error(`${id}: VIEWMODEL camera ausente`);
  authoredCamera.updateMatrixWorld(true);
  const cameraFov = authoredCamera.fov;
  scene.applyMatrix4(authoredCamera.matrixWorld.clone().invert());
  authoredCamera.removeFromParent();

  const mixer = new THREE.AnimationMixer(scene);
  const idle = gltf.animations.find((clip) => clip.name === 'idle');
  if (!idle) throw new Error(`${id}: clip idle ausente`);
  mixer.clipAction(idle).play();
  mixer.setTime(idle.duration * 0.5);
  scene.updateMatrixWorld(true);

  const handMeshes = [];
  const weaponMeshes = [];
  scene.traverse((object) => {
    if (!object.isMesh || utilityDescendant(object)) return;
    const hand = materialsOf(object).some((material) => HAND_MATERIAL.test(material?.name || ''));
    (hand ? handMeshes : weaponMeshes).push(object);
  });
  if (!handMeshes.length || !weaponMeshes.length) throw new Error(`${id}: pacote sem mãos ou arma`);

  const initialWeapon = weaponMeshes.flatMap((mesh) => sampleMesh(mesh, 3000));
  const weaponSize = boundsOf(initialWeapon).getSize(new THREE.Vector3());
  const weaponLength = Math.max(weaponSize.x, weaponSize.y, weaponSize.z);
  const targetLength = weaponCFG(id).len || 0.9;
  const normalization = weaponLength / targetLength > 1.5 ? targetLength / weaponLength : 1;
  const frame = authoredFrameFor(id, VM_WEAPON[id].family, `gs#${id}`, cameraFov);
  const mount = new THREE.Group();
  mount.add(scene);
  mount.position.set(frame.x, frame.y, frame.z);
  mount.rotation.set(...(frame.rotDeg || [0, 0, 0]).map((degree) => THREE.MathUtils.degToRad(degree)));
  mount.scale.set(-normalization, normalization, normalization);
  mount.updateMatrixWorld(true);
  scene.updateMatrixWorld(true);

  const packagePoints = { weapon: [], left: [], right: [] };
  for (const mesh of weaponMeshes) packagePoints.weapon.push(...sampleMesh(mesh, 3000));
  for (const mesh of handMeshes) {
    const points = sampleHands(mesh, 1400);
    packagePoints.left.push(...points.left);
    packagePoints.right.push(...points.right);
  }
  if (!packagePoints.left.length || !packagePoints.right.length) {
    throw new Error(`${id}: mãos esquerda/direita não identificadas`);
  }

  if (id === 'ak' && MUTANT === 'topo') rotatePackageToTop(packagePoints);
  if (id === 'ak' && MUTANT === 'fora') {
    for (const points of Object.values(packagePoints)) translate(points, 8, 0, 0);
  }
  if (id === 'ak' && MUTANT === 'sem-contato') {
    translate(packagePoints.left, 0.20, 0, 0);
    translate(packagePoints.right, 0.20, 0, 0);
  }

  const axis = principalAxis(packagePoints.weapon);
  const profile = Math.hypot(axis.x, axis.y);
  const aspects = Object.fromEntries(VM_SIDE_CONTRACT.aspects.map((aspect) => [
    aspect === 3 / 2 ? '3:2' : '16:9',
    screenMetrics(packagePoints.weapon, Math.max(cameraFov, frame.fov), aspect),
  ]));
  return {
    file,
    idleSampleSeconds: idle.duration * 0.5,
    profile,
    contact: {
      left: minimumDistance(packagePoints.left, packagePoints.weapon),
      right: minimumDistance(packagePoints.right, packagePoints.weapon),
    },
    aspects,
  };
}

function localAsset(url) {
  if (url.startsWith('/private-assets/viewmodels/')) {
    return path.join(PRIVATE_ROOT, url.slice('/private-assets/viewmodels/'.length));
  }
  return path.join(ROOT, 'public', url.split('?')[0]);
}

function round(value, digits = 4) {
  return Number.isFinite(value) ? Number(value.toFixed(digits)) : value;
}

async function main() {
  const log = console.log;
  console.log = () => {};
  try {
    runMintAudit();
  } finally {
    console.log = log;
  }
  const mint = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/eval/vm_mint_audit.json'), 'utf8'));
  const failures = [];
  const matrix = {};
  const goldsrc = {};

  const mapped = Object.keys(VM_WEAPON);
  const missing = FIREARMS.filter((id) => !mapped.includes(id));
  const extra = mapped.filter((id) => !FIREARMS.includes(id));
  if (missing.length || extra.length || new Set(mapped).size !== mapped.length) {
    failures.push(`matriz: cobertura inválida (faltam=${missing.join(',') || '-'} sobram=${extra.join(',') || '-'})`);
  }

  for (const id of FIREARMS) {
    const active = viewmodelPlan(id);
    const cs16 = viewmodelPlan(id, 'goldsrc');
    const activeFile = localAsset(active.asset);
    const cs16File = localAsset(cs16.asset);
    matrix[id] = {
      family: active.family,
      active: active.pipeline,
      fallback: active.fallback,
      fallbackUsed: active.fallbackUsed,
      result: active.result,
      asset: active.asset,
      license: active.license,
      frame: active.pipeline === 'legacy'
        ? { source: 'VM_FRAME.cls', class: VM_FRAME.classOf[id] }
        : active.pipeline === 'golden'
          ? { source: 'embedded-camera' }
          : { source: 'VM_AUTHORED_FRAME.family', value: authoredFrameFor(id, active.family) },
      goldsrcFrame: authoredFrameFor(id, active.family, `gs#${id}`, 74),
      assetLimit: active.assetLimit,
      cs16: { pipeline: cs16.pipeline, asset: cs16.asset, exists: fs.existsSync(cs16File) },
    };
    if (!fs.existsSync(activeFile)) failures.push(`${id}: asset ativo ausente (${active.asset})`);
    if (!fs.existsSync(cs16File)) failures.push(`${id}: asset goldsrc ausente (${cs16.asset})`);

    const legacy = mint.armas[id];
    if (!legacy) {
      failures.push(`${id}: não exercitada por eval:vm`);
    } else {
      for (const [aspect, measurement] of Object.entries(legacy.aspectos)) {
        const angle = measurement.anguloEixoGraus;
        if (angle < VM_SIDE_CONTRACT.axisDeg[0] || angle > VM_SIDE_CONTRACT.axisDeg[1]) {
          failures.push(`${id} ${aspect}: perfil-lateral legacy ${angle}°`);
        }
        if (measurement.areaPct < 2.5 || measurement.areaPct > VM_SIDE_CONTRACT.areaPct[1]) {
          failures.push(`${id} ${aspect}: enquadramento legacy ${measurement.areaPct}%`);
        }
      }
    }

    const measurement = await goldsrcMetrics(id);
    goldsrc[id] = {
      profile: round(measurement.profile),
      contact: { left: round(measurement.contact.left), right: round(measurement.contact.right) },
      aspects: Object.fromEntries(Object.entries(measurement.aspects).map(([aspect, value]) => [aspect, {
        visible: round(value.visible),
        axisDeg: round(value.axisDeg, 2),
        directionDeg: round(value.directionDeg, 2),
      }])),
    };
    if (measurement.profile < VM_SIDE_CONTRACT.profileMin) {
      failures.push(`${id}: perfil-lateral goldsrc ${measurement.profile.toFixed(3)}`);
    }
    if (measurement.contact.left > VM_SIDE_CONTRACT.contactMaxM
      || measurement.contact.right > VM_SIDE_CONTRACT.contactMaxM) {
      failures.push(`${id}: contato skinned L=${measurement.contact.left.toFixed(3)} R=${measurement.contact.right.toFixed(3)} m`);
    }
    for (const [aspect, value] of Object.entries(measurement.aspects)) {
      if (value.visible < VM_SIDE_CONTRACT.visibleMin) {
        failures.push(`${id} ${aspect}: pacote fora do quadro (${(value.visible * 100).toFixed(1)}% visível)`);
      }
      if (!Number.isFinite(value.axisDeg)) {
        failures.push(`${id} ${aspect}: eixo goldsrc ausente`);
      } else if (value.axisDeg < VM_SIDE_CONTRACT.axisDeg[0]
        || value.axisDeg > VM_SIDE_CONTRACT.axisDeg[1]) {
        failures.push(`${id} ${aspect}: eixo goldsrc ${value.axisDeg.toFixed(2)}°`);
      }
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    contract: VM_SIDE_CONTRACT,
    mutant: MUTANT || null,
    firearms: FIREARMS,
    matrix,
    goldsrc,
    failures,
  };

  if (MUTANT) {
    const expected = MUTANT === 'topo' ? 'perfil-lateral goldsrc'
      : MUTANT === 'fora' ? 'pacote fora do quadro'
        : 'contato skinned';
    if (!failures.some((failure) => failure.includes(expected))) {
      console.error(`MUTANTE NÃO DETECTADO: ${MUTANT} deveria violar ${expected}`);
      process.exitCode = 2;
      return;
    }
    console.error(`MUTANTE DETECTADO: ${MUTANT} -> ${expected}`);
    process.exitCode = 1;
    return;
  }
  fs.writeFileSync(REPORT_FILE, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`VM-SIDE matriz: ${Object.keys(matrix).length}/${FIREARMS.length} armas de fogo`);
  console.log(`VM-SIDE skinned: ${Object.keys(goldsrc).length}/${FIREARMS.length} pacotes GoldSrc`);
  if (failures.length) {
    for (const failure of failures) console.error(`  ✗ ${failure}`);
    process.exitCode = 1;
  } else {
    console.log('VM-SIDE verde: perfil lateral, quadro e contato de duas mãos');
  }
}

await main();
