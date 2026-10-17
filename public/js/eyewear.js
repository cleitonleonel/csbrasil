import {TRETA_ITEMS_ENABLED} from './treta-features.js';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const templates=new Map(),requests=new Map(),CHANNELS=['getX','getY','getZ','getW'];
let fitRequest=null,landmarkRegistry=null;

const profileKey=def=>def?.skinId || def?.id;
const finiteProfile=profile=>profile && [profile.width,profile.height,profile.depth,profile.lensY].every(Number.isFinite);
function fitContext(entry,def,registry=landmarkRegistry) {
  const key=profileKey(def),profile=entry?.profiles?.[key],landmark=registry?.bodies?.[key];
  if(!finiteProfile(profile) || profile.bodyId!==landmark?.bodyId || profile.profileId!==landmark?.profileId || profile.bodySha256!==landmark?.bodySha256)return null;
  if(profile.source!=='gpt-pilot+human-candidate' || landmark.origin!=='gpt-pilot+human-candidate' || landmark.eyewear?.status!=='measured')return null;
  return {key,profile,landmark};
}
export function eyewearCandidateProfile(entry,def,registry=landmarkRegistry) {
  const context=fitContext(entry,def,registry);
  return context && ['candidate','certified'].includes(context.profile.status)?context:null;
}
export function eyewearProfile(entry,def,registry=landmarkRegistry) {
  if(!TRETA_ITEMS_ENABLED || entry?.approved!==true)return null;
  const context=eyewearCandidateProfile(entry,def,registry);
  return context?.profile.certified===true?context.profile:null;
}
export function eyewearFitCount(entry,registry=landmarkRegistry) {
  return Object.keys(entry?.profiles || {}).filter(id=>eyewearProfile(entry,{id},registry)).length;
}
export async function loadEyewearFitData() {
  fitRequest ??=Promise.all([
    fetch('/models/items/eyewear-manifest.json').then(response=>{if(!response.ok)throw new Error('eyewear_manifest');return response.json();}),
    fetch('/models/items/face-landmarks.json').then(response=>{if(!response.ok)throw new Error('eyewear_landmarks');return response.json();}),
  ]).then(([manifest,landmarks])=>{landmarkRegistry=landmarks;return {manifest,landmarks};}).catch(error=>{fitRequest=null;console.warn(`[eyewear] ${error.message}`);return {manifest:{eyewear:{}},landmarks:null};});
  return fitRequest;
}
export async function preloadEyewearAssets(ids=[]) {
  if(!TRETA_ITEMS_ENABLED)return;
  if(!ids.some(Boolean))return;
  const {manifest}=await loadEyewearFitData();
  await Promise.all([...new Set(ids.filter(Boolean))].map(async id=>{
    const entry=manifest.eyewear?.[id];
    if(entry?.approved!==true || !/^\/models\/items\/[a-z0-9-]+\.glb$/.test(entry.model || '') || !Object.keys(entry.profiles || {}).some(key=>eyewearProfile(entry,{id:key})))return;
    if(templates.has(id))return;if(requests.has(id))return requests.get(id);
    const request=new GLTFLoader().loadAsync(entry.model).then(gltf=>templates.set(id,{entry,model:gltf.scene})).catch(error=>console.warn(`[eyewear] ${id}: ${error.message}`)).finally(()=>requests.delete(id));requests.set(id,request);return request;
  }));
}
function hingeZ(array,box) {
  const half=(box.max.x-box.min.x)/2,center=(box.max.x+box.min.x)/2,depth=box.max.z-box.min.z,bins=new Array(100).fill(false);
  for(let i=0;i<array.length;i+=3)if(Math.abs(array[i]-center)<half*.6){const bin=Math.min(99,Math.floor((box.max.z-array[i+2])/depth*100));bins[bin]=true;}
  let bin=0;while(bin<100&&bins[bin])bin++;return box.max.z-depth*bin/100;
}
function deformTemples(accessory,profile) {
  let mesh;accessory.traverse(object=>{if(!mesh&&object.isMesh)mesh=object;});if(!mesh)return null;
  mesh.geometry=mesh.geometry.clone();const source=mesh.geometry.getAttribute('position'),original=new Float32Array(source.count*3);
  for(let i=0;i<source.count;i++){original[i*3]=source.getX(i);original[i*3+1]=source.getY(i);original[i*3+2]=source.getZ(i);}
  const position=new THREE.BufferAttribute(original.slice(),3);mesh.geometry.setAttribute('position',position);
  const box=new THREE.Box3();for(let i=0;i<original.length;i+=3)box.expandByPoint(new THREE.Vector3(original[i],original[i+1],original[i+2]));
  const hinge=hingeZ(original,box),array=position.array,templeScale=profile.templeScale??1,lift=profile.templeLift??0,half=(box.max.x-box.min.x)/2,center=(box.max.x+box.min.x)/2,denominator=hinge-box.min.z;
  for(let i=0;i<array.length;i+=3)if(original[i+2]<hinge){const distance=hinge-original[i+2],fraction=distance/denominator,side=Math.sign(original[i]-center),spread=side>0?(profile.templeSpreadL??0):(profile.templeSpreadR??0);array[i+2]=hinge-distance*templeScale;array[i]=original[i]+side*spread*half*fraction;array[i+1]=original[i+1]+lift*(box.max.y-box.min.y)*fraction;}
  position.needsUpdate=true;mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();return {mesh,original,hinge};
}
function headBounds(body,index) {
  const position=body.geometry.getAttribute('position'),skinIndex=body.geometry.getAttribute('skinIndex'),skinWeight=body.geometry.getAttribute('skinWeight');if(!position || !skinIndex || !skinWeight)return null;
  const bounds=new THREE.Box3(),point=new THREE.Vector3();
  for(let i=0;i<position.count;i++){let weight=0;for(let channel=0;channel<4;channel++)if(skinIndex[CHANNELS[channel]](i)===index)weight+=skinWeight[CHANNELS[channel]](i);if(weight>.65)bounds.expandByPoint(point.fromBufferAttribute(position,i));}
  return bounds.isEmpty()?null:bounds;
}
export function mountEyewearCandidate(model,accessory,profile,landmark,itemId='candidate') {
  let body;model.traverse(object=>{if(!body&&object.isSkinnedMesh&&object.skeleton.bones.some(bone=>bone.name==='Head'))body=object;});if(!body)return null;
  const index=body.skeleton.bones.findIndex(bone=>bone.name==='Head'),head=body.skeleton.bones[index],bounds=headBounds(body,index);if(!bounds)return null;
  const assetBox=new THREE.Box3().setFromObject(accessory),size=bounds.getSize(new THREE.Vector3()),assetSize=assetBox.getSize(new THREE.Vector3());if(assetSize.x<=0)return null;
  const deformation=deformTemples(accessory,profile),scale=size.x*profile.width/assetSize.x,center=assetBox.getCenter(new THREE.Vector3()),lensY=assetBox.min.y+assetSize.y*profile.lensY;
  accessory.scale.setScalar(scale);accessory.position.set(-center.x*scale,-lensY*scale,-assetBox.max.z*scale);
  accessory.traverse(object=>{if(object.isMesh){object.userData.noHit=true;object.raycast=()=>{};object.castShadow=false;object.receiveShadow=true;}});
  const normalizedEyeY=landmark?.eyewear?.eyeLineY,eyeY=Number.isFinite(normalizedEyeY)&&model.scale.y!==0?(normalizedEyeY-model.position.y)/model.scale.y:null;
  const anchor=new THREE.Group();anchor.name='TRETA-eyewear';anchor.userData={eyewearId:itemId,certified:profile.certified===true,fitSource:Number.isFinite(eyeY)?'landmarks':'bounds-fallback'};
  anchor.position.set(bounds.getCenter(new THREE.Vector3()).x,Number.isFinite(eyeY)?eyeY:bounds.min.y+size.y*profile.height,bounds.max.z+size.z*profile.depth);
  anchor.updateMatrix();anchor.matrix.premultiply(new THREE.Matrix4().copy(body.skeleton.boneInverses[index]).multiply(body.bindMatrix));anchor.matrixAutoUpdate=false;anchor.add(accessory);head.add(anchor);
  return {anchor,accessory,body,head,headIndex:index,bounds,deformation,profile,landmark};
}
export function mountEyewear(model,def) {
  if(!TRETA_ITEMS_ENABLED)return null;
  const template=templates.get(def.eyewearId),context=eyewearCandidateProfile(template?.entry,def);
  if(!context || template.entry.approved!==true || context.profile.certified!==true)return null;
  return mountEyewearCandidate(model,template.model.clone(true),context.profile,context.landmark,def.eyewearId)?.anchor || null;
}
