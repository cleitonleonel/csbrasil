#!/usr/bin/env node
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../../',import.meta.url)),read=path=>JSON.parse(readFileSync(join(root,path))),hash=path=>createHash('sha256').update(readFileSync(join(root,path))).digest('hex');
const eyewearPath='public/models/items/eyewear-manifest.json',landmarksPath='public/models/items/face-landmarks.json',factoryPath='tools/character-kit/garment/wearables-manifest.json',reportPath='tools/eval/asset-evidence/items/fit-matrix/report.json';
const coveredItems=['metal-de-rua','ouro-de-quebrada','oval-90','visor-de-pista'],coveredBodies=['capitao','esquerdomacho'],coveredCaps=['capitao','esquerdomacho','barbudo'],poses=['idle','walk','run','crouch','shoot','walkfire'];
const finite=value=>typeof value==='number'&&Number.isFinite(value),same=(actual,expected,message)=>assert.deepEqual([...actual].sort(),[...expected].sort(),message);
function inputs(){return {eyewear:read(eyewearPath),landmarks:read(landmarksPath),factory:read(factoryPath),report:read(reportPath)};}
function rejectApprovalTrue(value,path='root'){
  if(!value||typeof value!=='object')return;
  for(const [key,child]of Object.entries(value)){assert(!(key==='approved'&&child===true),`${path}.${key}: approved:true prohibited in candidate lane`);rejectApprovalTrue(child,`${path}.${key}`);}
}
function validate({eyewear,landmarks,factory,report}){
  assert.equal(eyewear.schema,1);assert.equal(landmarks.schemaVersion,'cs-face-landmarks/1');assert.equal(landmarks.status,'candidate');assert.equal(landmarks.runtimeEnabled,false);assert.equal(landmarks.provenance.origin,'gpt-pilot+human-candidate');
  rejectApprovalTrue(eyewear);same(Object.keys(landmarks.bodies),coveredCaps,'landmark body coverage changed');
  for(const bodyId of coveredCaps){const landmark=landmarks.bodies[bodyId];assert.equal(landmark.bodySha256,hash(`public${landmark.model}`),`${bodyId}: stale landmark body hash`);assert.equal(landmark.profileId,`${landmark.bodyId}@${landmark.bodySha256.slice(0,12)}`);assert(landmark.headwear?.dimensions&&landmark.headwear.motions.length===3,`${bodyId}: cap proof profile missing`);}
  for(const bodyId of coveredBodies){const eye=landmarks.bodies[bodyId].eyewear;assert.equal(eye.calibration,'integrated-real-browser-visual-review');assert(finite(eye.pilotEyeLineY)&&eye.pilotEyeLineY-eye.eyeLineY>=.03,`${bodyId}: uncorrected pilot eye line`);}
  for(const itemId of coveredItems){const entry=eyewear.eyewear[itemId];assert(entry&&entry.approved===false,`${itemId}: candidate asset must stay unapproved`);same(Object.keys(entry.profiles),coveredBodies,`${itemId}: measured body coverage changed`);
    for(const bodyId of coveredBodies){const profile=entry.profiles[bodyId],landmark=landmarks.bodies[bodyId];assert.equal(profile.status,'candidate');assert.equal(profile.certified,false);assert.equal(profile.source,'gpt-pilot+human-candidate');assert.equal(profile.bodyId,landmark.bodyId,`${itemId}/${bodyId}: profile transferred to another body`);assert.equal(profile.profileId,landmark.profileId);assert.equal(profile.bodySha256,landmark.bodySha256,`${itemId}/${bodyId}: stale profile hash`);assert.equal(landmark.origin,'gpt-pilot+human-candidate');assert.equal(landmark.eyewear?.status,'measured',`${itemId}/${bodyId}: body without measured landmarks`);
      assert([profile.width,profile.height,profile.depth,profile.lensY,profile.templeScale,profile.templeSpreadL,profile.templeSpreadR,profile.templeLift].every(finite),`${itemId}/${bodyId}: non-finite fit profile`);same(profile.metrics.poses,poses,`${itemId}/${bodyId}: pose coverage changed`);for(const key of ['lensEyeAbsMaxCm','templeEarAbsMaxCm','templeVerticalAbsMaxCm','frameInsideMaxPct','templeSunkMaxFraction'])assert(finite(profile.metrics[key])&&profile.metrics[key]>=0,`${itemId}/${bodyId}: invalid ${key}`);
      if(profile.classification==='candidate-for-human-approval'){assert(profile.metrics.lensEyeAbsMaxCm<=.5,`${itemId}/${bodyId}: lens below eye limit`);assert(profile.metrics.templeEarAbsMaxCm<=.75,`${itemId}/${bodyId}: short temple cannot be a passing candidate`);assert(profile.metrics.templeVerticalAbsMaxCm<=.75,`${itemId}/${bodyId}: temple vertical mismatch`);}else if(profile.classification==='blocked-baked-eyewear')assert.equal(landmark.eyewear.bakedEyewearConflict,true);else assert.equal(profile.classification,'needs-adjustment');
    }
  }
  for(const itemId of ['rebite-roxo','arco-orbital']){const entry=eyewear.eyewear[itemId];assert.equal(entry.approved,false);assert.deepEqual(entry.profiles,{},`${itemId}: rejected item gained a body profile`);}
  assert.equal(report.schemaVersion,'cs-fit-matrix/1');assert.equal(report.certifiedPairs,0);assert.equal(report.eyewear.length,8);assert.equal(report.headwear.length,3);same(report.views,['front','threeQuarter','profile']);assert.equal(report.summary.assetAndPipeline.state,'ready');assert.deepEqual(report.summary.candidatePairs,{eyewear:8,headwear:3});assert.deepEqual(report.summary.humanDecision,{state:'pending',certifiedPairs:0,storeEnabled:false});
  for(const row of report.eyewear){const entry=eyewear.eyewear[row.itemId],profile=entry?.profiles?.[row.bodyId],landmark=landmarks.bodies[row.bodyId];assert(profile&&landmark,'orphan eyewear matrix row');assert.equal(row.bodySha256,landmark.bodySha256);assert.equal(row.assetSha256,entry.sha256);assert.equal(row.profileStatus,'candidate');assert.equal(row.classification,profile.classification);assert.equal(row.certified,false);same(row.poses.map(sample=>sample.pose),poses);for(const sample of row.poses){assert(sample.metrics&&finite(sample.metrics.lensEyeCm)&&finite(sample.metrics.clippingPct),'eyewear measurements missing');for(const side of ['left','right']){const metric=sample.metrics[side],ends=[metric?.templeEarCm,metric?.templeEarVerticalCm];assert(metric&&finite(metric.sunkFraction),'temple sunk measurement missing');if(profile.classification==='blocked-baked-eyewear')assert(ends.every(finite)||ends.every(value=>value===null),'blocked body has partial temple measurement');else assert(ends.every(finite),'temple measurements missing');}}}
  const cap=factory.items.find(item=>item.id==='treta-cap-procedural-v1');assert(cap&&cap.inventoryStatus==='versioned');assert.equal(cap.asset.sha256,hash(cap.asset.path));assert.equal(cap.asset.bytes,readFileSync(join(root,cap.asset.path)).length);assert.equal(cap.runtimeEnabled,false);assert(Object.values(cap.approvals).every(value=>value===false));assert.deepEqual(cap.certifiedBodies,[]);assert.deepEqual(cap.certifiedFamilies,[]);same(cap.fitProfiles.map(profile=>profile.bodyId),coveredCaps.map(id=>`character:${id}`));
  for(const profile of cap.fitProfiles){const bodyId=profile.bodyId.slice('character:'.length),landmark=landmarks.bodies[bodyId];assert.equal(profile.status,'candidate');assert.equal(profile.profileId,landmark.profileId,`${bodyId}: cap profile transferred or stale`);}
  for(const row of report.headwear){assert(coveredCaps.includes(row.bodyId));assert.equal(row.bodySha256,landmarks.bodies[row.bodyId].bodySha256);assert.equal(row.profileStatus,'candidate');assert.equal(row.classification,'candidate-for-human-approval',`${row.bodyId}: brim still covers the front eye line in a captured pose`);assert(row.minimumBrimEyeClearancePx>=8,`${row.bodyId}: front brim-eye clearance below 8 px`);assert(finite(row.minimumProjectedAcrossViewsPx));assert.equal(row.certified,false);assert.equal(row.samples.length,9);for(const sample of row.samples){assert(finite(sample.metrics.brimEyeClearancePx));assert(finite(sample.metrics.headAndHairOutsideCrownPct)&&sample.metrics.headAndHairOutsideCrownPct>=0&&sample.metrics.headAndHairOutsideCrownPct<=100,`${row.bodyId}: invalid crown containment metric`);assert(finite(sample.metrics.crownClearanceCm),`${row.bodyId}: missing crown clearance metric`);assert.equal(sample.metrics.drawCalls,1,`${row.bodyId}: procedural cap exceeds one draw call`);assert(Number.isSafeInteger(sample.metrics.triangles)&&sample.metrics.triangles<=5000,`${row.bodyId}: procedural cap exceeds 5k triangles`);assert(sample.metrics.stability<=1e-7,`${row.bodyId}: cap anchor unstable`);}}
  return {eyewearPairs:report.eyewear.length,capPairs:report.headwear.length,certified:0};
}
function mutants(){
  const cases={
    'lens-low':data=>{data.eyewear.eyewear['metal-de-rua'].profiles.capitao.metrics.lensEyeAbsMaxCm=3;},
    'uncorrected-eye-line':data=>{data.landmarks.bodies.capitao.eyewear.eyeLineY=data.landmarks.bodies.capitao.eyewear.pilotEyeLineY;},
    'temple-short':data=>{data.eyewear.eyewear['ouro-de-quebrada'].profiles.capitao.metrics.templeEarAbsMaxCm=3;},
    'stale-hash':data=>{data.eyewear.eyewear['metal-de-rua'].profiles.capitao.bodySha256='0'.repeat(64);},
    'body-without-landmark':data=>{data.landmarks.bodies.capitao.eyewear=null;},
    'brim-over-eye':data=>{data.report.headwear[0].minimumBrimEyeClearancePx=-1;data.report.headwear[0].classification='blocked-brim-over-eye';},
    'profile-transferred':data=>{data.eyewear.eyewear['metal-de-rua'].profiles.capitao.bodyId='character:barbudo';},
  },result=[];
  for(const [name,mutate]of Object.entries(cases)){const data=structuredClone(inputs());mutate(data);let killed=false,reason='';try{validate(data);}catch(error){killed=true;reason=error.message;}assert(killed,`${name} mutant survived`);result.push({name,killed,reason});}
  return result;
}
const mutation=process.argv.includes('--mutate');const result=validate(inputs()),killed=mutation?mutants():[];console.log(`eyewear-fit ${mutation?'mutate':'check'}: ${JSON.stringify({...result,mutants:killed})}`);
