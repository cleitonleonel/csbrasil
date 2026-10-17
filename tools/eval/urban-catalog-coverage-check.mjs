#!/usr/bin/env node
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const evidenceRoot = join(root, 'tools/eval/asset-evidence/items/urban-catalog-fit');
const reportPath = join(evidenceRoot, 'report.json');
const evidencePath = join(evidenceRoot, 'evidence-manifest.json');
const reviewPath = join(evidenceRoot, 'visual-review.json');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const hashFile = path => sha(readFileSync(path));
const read = path => JSON.parse(readFileSync(join(root, path), 'utf8'));
const finite = value => typeof value === 'number' && Number.isFinite(value);
const same = (actual, expected, message) => assert.deepEqual([...actual].sort(), [...expected].sort(), message);
const MAX_OUTFIT_DRAW_CALLS = 40;
const MAX_OUTFIT_TRIANGLES = 50_000;
const MAX_FAMILY_DRAW_CALLS = 12;
const MAX_FAMILY_TRIANGLES = 8_000;

const apparelFamilies = new Set(['boxy-tee', 'oversized-tee', 'shell-jacket', 'cargo-pants', 'bermuda-shorts', 'low-sneaker', 'chunky-runner', 'boot']);
const rigidFamilies = new Set([
  'backpack-rolltop', 'backpack-triple-pocket', 'backpack-sling', 'backpack-drypack', 'backpack-modular', 'backpack-tote', 'backpack-duffel',
  'headwear-trucker', 'headwear-boina', 'headwear-beanie', 'headwear-bucket', 'headwear-balaclava', 'headwear-hair', 'headwear-helmet',
  'accessory-chain', 'accessory-bandana', 'accessory-earring', 'accessory-bracelet', 'accessory-modular', 'accessory-ring', 'accessory-belt', 'accessory-case',
]);
const eyewearFamilies = new Map([
  ['eyewear-frame', 'oval-90'],
  ['eyewear-safety', 'metal-de-rua'],
  ['eyewear-visor', 'visor-de-pista'],
  ['eyewear-wrap', 'ouro-de-quebrada'],
]);

function factoryFor(family) {
  if (apparelFamilies.has(family)) return {kind: 'apparel-proxy', factory: 'createUrbanApparelProxy', assetId: null};
  if (rigidFamilies.has(family)) return {kind: 'rigid-proxy', factory: 'mountUrbanRigidCandidate', assetId: null};
  if (eyewearFamilies.has(family)) return {kind: 'eyewear-glb-profile', factory: 'mountEyewearCandidate', assetId: eyewearFamilies.get(family)};
  return null;
}

function sourceHashes() {
  return {
    urbanCatalog: hashFile(join(root, 'tools/character-kit/garment/urban-catalog.json')),
    mintBatch: hashFile(join(root, 'tools/character-kit/garment/mint-urban-batch.json')),
    bodyCensus: hashFile(join(root, 'tools/character-kit/garment/body-census.json')),
    rigidFactory: hashFile(join(root, 'public/js/procedural-urban-rigid.js')),
    apparelFactory: hashFile(join(root, 'public/js/procedural-urban-apparel.js')),
    eyewearManifest: hashFile(join(root, 'public/models/items/eyewear-manifest.json')),
    eyewearRuntime: hashFile(join(root, 'public/js/eyewear.js')),
    faceLandmarks: hashFile(join(root, 'public/models/items/face-landmarks.json')),
    scene: hashFile(join(root, 'tools/eval/urban-catalog-fit-scene.mjs')),
    captureTool: hashFile(join(root, 'tools/eval/urban-catalog-fit-matrix.mjs')),
  };
}

function inputs() {
  return {
    catalog: read('tools/character-kit/garment/urban-catalog.json'),
    batch: read('tools/character-kit/garment/mint-urban-batch.json'),
    census: read('tools/character-kit/garment/body-census.json'),
    eyewear: read('public/models/items/eyewear-manifest.json'),
    report: JSON.parse(readFileSync(reportPath, 'utf8')),
    evidence: JSON.parse(readFileSync(evidencePath, 'utf8')),
    review: JSON.parse(readFileSync(reviewPath, 'utf8')),
  };
}

function rejectPromotion(value, path = 'root') {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (['approved', 'certified', 'runtimeEnabled', 'finalAsset'].includes(key)) assert.notEqual(child, true, `${path}.${key}: proxy candidate was promoted`);
    rejectPromotion(child, `${path}.${key}`);
  }
}

function assertFiniteBounds(row, label) {
  assert.equal(row.boundsFinite, true, `${label}: non-finite rendered bounds`);
  assert(row.bounds && row.bounds.min.length === 3 && row.bounds.max.length === 3, `${label}: rendered bounds missing`);
  assert([...row.bounds.min, ...row.bounds.max].every(finite), `${label}: rendered bounds contain non-finite values`);
  for (let axis = 0; axis < 3; axis++) assert(row.bounds.max[axis] > row.bounds.min[axis], `${label}: empty rendered bounds on axis ${axis}`);
}

function validate(data, {verifyFiles = true} = {}) {
  const {catalog, batch, census, eyewear, report, evidence, review} = data;
  assert.equal(catalog.items.length, 160, 'catalog must contain exactly 160 items');
  const safe = catalog.items.filter(item => item.rightsStatus === 'original-safe');
  const blocked = catalog.items.filter(item => item.rightsStatus === 'permission-needed');
  assert.equal(safe.length, 147, 'original-safe coverage changed');
  assert.equal(blocked.length, 13, 'permission-needed coverage changed');
  const families = [...new Set(catalog.items.map(item => item.geometryFamily))];
  assert.equal(families.length, 34, 'geometry-family coverage changed');
  assert.equal(apparelFamilies.size, 8);
  assert.equal(rigidFamilies.size, 22);
  assert.equal(eyewearFamilies.size, 4);
  same([...apparelFamilies, ...rigidFamilies, ...eyewearFamilies.keys()], families, 'factory map does not exactly cover catalog families');

  assert.equal(batch.provider, 'Mint');
  assert.equal(batch.submitted, false, 'Mint batch falsely submitted');
  assert.equal(batch.submissionStatus, 'not-submitted-no-credits', 'Mint submission status changed');
  assert.equal(batch.submittedAt, null);
  assert.equal(batch.providerBatchId, null);
  assert.equal(batch.costReceipt.status, 'not-submitted-no-credits');
  assert.equal(batch.costReceipt.chargedCost, 0);
  assert.equal(batch.costReceipt.creditsSpent, 0);
  same(batch.jobs.map(job => job.itemId), safe.map(item => item.id), 'Mint queue must cover only 147 original-safe records');
  same(batch.excluded.map(item => item.itemId), blocked.map(item => item.id), 'Mint exclusions must cover the 13 permission-needed records');

  assert.equal(report.schemaVersion, 'cs-urban-catalog-fit/1');
  assert.equal(report.status, 'fit-proxy-not-mint-asset');
  assert.deepEqual(report.sourceHashes, sourceHashes(), 'fit report source hashes are stale');
  assert.deepEqual(evidence.sourceHashes, sourceHashes(), 'evidence source hashes are stale');
  assert.equal(report.consoleErrors.length, 0, 'browser console errors were captured');
  assert.deepEqual(report.views, ['front', 'threeQuarter']);
  assert.deepEqual(report.summary, {catalogItems: 160, mountableSafe: 147, blockedPermissionNeeded: 13, bodiesObserved: 88, geometryFamiliesObserved: 34, certified: 0, mintSubmitted: false});
  rejectPromotion({catalog, batch, census, eyewear, report});

  const catalogById = new Map(catalog.items.map(item => [item.id, item]));
  assert.equal(report.catalog.length, 160, 'catalog resolution rows missing');
  same(report.catalog.map(row => row.itemId), catalogById.keys(), 'catalog resolution IDs diverge');
  for (const row of report.catalog) {
    const item = catalogById.get(row.itemId);
    assert(item, `${row.itemId}: orphan resolution row`);
    assert.equal(row.geometryFamily, item.geometryFamily, `${row.itemId}: geometry family changed during resolution`);
    assert.equal(row.rightsStatus, item.rightsStatus, `${row.itemId}: rights status changed during resolution`);
    assert.equal(row.mounted, false, `${row.itemId}: catalog rows are resolution-only, never runtime-mounted`);
    if (item.rightsStatus === 'permission-needed') {
      assert.equal(row.resolution, 'blocked-permission-needed', `${row.itemId}: protected item escaped blocking`);
      assert.equal(row.artIncluded, false, `${row.itemId}: protected card copied art`);
      assert.equal(row.status, 'blocked', `${row.itemId}: protected item lacks blocked status`);
      assert(!Object.hasOwn(row, 'factory'), `${row.itemId}: protected item reached a factory`);
    } else {
      const expected = factoryFor(item.geometryFamily);
      assert(expected, `${row.itemId}: safe item has no factory`);
      assert.equal(row.resolution, 'mountable-proxy', `${row.itemId}: safe item is not mountable`);
      assert.equal(row.fitStatus, 'fit-proxy-not-mint-asset', `${row.itemId}: proxy mislabeled as final asset`);
      assert.equal(row.factory, expected.factory, `${row.itemId}: wrong factory`);
      assert.equal(row.kind, expected.kind, `${row.itemId}: wrong factory kind`);
      assert.equal(row.assetId, expected.assetId, `${row.itemId}: wrong eyewear asset mapping`);
    }
  }

  assert.equal(census.bodies.length, 88, 'body census coverage changed');
  assert.equal(census.bodies.filter(body => body.fitProfile.status === 'unknown').length, 84, 'candidate census count changed');
  assert.equal(census.bodies.filter(body => body.fitProfile.status === 'incompatible').length, 4, 'incompatible census count changed');
  assert.equal(report.bodies.length, 88, 'body evidence omitted a census body');
  const bodiesById = new Map(census.bodies.map(body => [body.bodyId, body]));
  same(report.bodies.map(row => row.bodyId), bodiesById.keys(), 'body evidence IDs diverge from census');
  for (const row of report.bodies) {
    const body = bodiesById.get(row.bodyId);
    assert(body, `${row.bodyId}: orphan body observation`);
    assert.equal(row.path, body.path, `${row.bodyId}: body path changed`);
    assert.equal(row.bodySha256, body.sourceSha256, `${row.bodyId}: report body hash stale`);
    if (verifyFiles) {
      const path = join(root, body.path);
      assert(existsSync(path), `${row.bodyId}: GLB missing`);
      assert.equal(readFileSync(path).length, body.bytes, `${row.bodyId}: GLB byte count stale`);
      assert.equal(hashFile(path), body.sourceSha256, `${row.bodyId}: census GLB hash stale`);
    }
    assert.equal(row.fitStatus, 'fit-proxy-not-mint-asset', `${row.bodyId}: body evidence promoted proxy`);
    assert.equal(row.familiesRequested.length, 7, `${row.bodyId}: deterministic outfit is incomplete`);
    assertFiniteBounds(row, row.bodyId);
    assert(row.evidence?.sheet && row.evidence.views?.length === 2, `${row.bodyId}: front/3/4 evidence missing`);
    assert(evidence.files[row.evidence.sheet], `${row.bodyId}: referenced body sheet absent from evidence manifest`);
    if (body.fitProfile.status === 'incompatible') {
      assert.equal(row.status, 'incompatible', `${row.bodyId}: known incompatible body was dressed`);
      assert.equal(row.familiesMounted.length, 0, `${row.bodyId}: incompatible body reached the mounter`);
      assert(row.failures.includes(`census-incompatible:${body.fitProfile.reason}`), `${row.bodyId}: incompatible reason was hidden`);
      assert.equal(row.reason, body.fitProfile.reason, `${row.bodyId}: incompatible reason changed`);
    } else if (row.status === 'candidate') {
      assert.equal(row.familiesMounted.length, 7, `${row.bodyId}: candidate outfit is partial`);
      assert.deepEqual(row.failures, [], `${row.bodyId}: candidate hides mount failures`);
      assert.equal(row.noHit, true, `${row.bodyId}: proxy entered hit/raycast surfaces`);
    } else {
      assert.equal(row.status, 'fail-closed', `${row.bodyId}: unknown body result status`);
      assert(row.failures.length > 0, `${row.bodyId}: fail-closed result lacks factual reason`);
      assert(row.familiesMounted.length < 7, `${row.bodyId}: complete outfit mislabeled fail-closed`);
    }
    assert(row.drawCalls >= 0 && row.drawCalls <= MAX_OUTFIT_DRAW_CALLS, `${row.bodyId}: draw-call budget exceeded`);
    assert(row.triangles >= 0 && row.triangles <= MAX_OUTFIT_TRIANGLES, `${row.bodyId}: triangle budget exceeded`);
    assert.equal(row.clipping?.method, 'conservative-body-vertices-inside-proxy-world-aabb', `${row.bodyId}: clipping observation missing`);
    assert.equal(row.clipping?.certified, false, `${row.bodyId}: clipping was falsely certified`);
    if (row.status === 'candidate') {
      assert(row.clipping.sampledVertices > 0, `${row.bodyId}: no vertices sampled for clipping observation`);
      assert(finite(row.clipping.overlapPct), `${row.bodyId}: clipping percentage not finite`);
      assert(['potential-contact-review-required', 'no-aabb-overlap-detected'].includes(row.clipping.classification), `${row.bodyId}: invalid clipping classification`);
    }
  }

  assert.equal(report.families.length, 34, 'family gallery coverage changed');
  same(report.families.map(row => row.family), families, 'family gallery omitted or invented a family');
  for (const row of report.families) {
    const expected = factoryFor(row.family);
    assert(expected, `${row.family}: no factory mapping`);
    assert.equal(row.factory, expected.factory, `${row.family}: gallery used wrong factory`);
    assert.equal(row.assetId, expected.assetId, `${row.family}: gallery used wrong eyewear asset`);
    assert.equal(row.fitStatus, 'fit-proxy-not-mint-asset', `${row.family}: gallery mislabeled proxy`);
    assert.equal(row.noHit, true, `${row.family}: gallery proxy entered hit surfaces`);
    assertFiniteBounds(row, row.family);
    assert(row.drawCalls > 0 && row.drawCalls <= MAX_FAMILY_DRAW_CALLS, `${row.family}: draw-call budget exceeded`);
    assert(row.triangles > 0 && row.triangles <= MAX_FAMILY_TRIANGLES, `${row.family}: triangle budget exceeded`);
    assert(evidence.files[row.evidence?.sheet], `${row.family}: family screenshot missing`);
    if (expected.assetId) {
      const entry = eyewear.eyewear[expected.assetId];
      assert(entry, `${row.family}: mapped eyewear asset missing`);
      assert.equal(row.assetSha256, entry.sha256, `${row.family}: eyewear asset hash stale`);
      assert.equal(row.profileBodySha256, entry.profiles.capitao.bodySha256, `${row.family}: eyewear profile hash stale`);
      if (verifyFiles) assert.equal(hashFile(join(root, `public${entry.model}`)), entry.sha256, `${row.family}: eyewear GLB hash stale`);
    }
  }

  assert.equal(report.blockedCards.length, 13, 'blocked-card gallery coverage changed');
  same(report.blockedCards.map(row => row.itemId), blocked.map(item => item.id), 'blocked cards diverge from protected catalog rows');
  for (const row of report.blockedCards) {
    assert.equal(row.mounted, false, `${row.itemId}: permission-needed card was mounted`);
    assert.equal(row.artIncluded, false, `${row.itemId}: permission-needed card copied art`);
    assert(evidence.files[row.evidence?.sheet], `${row.itemId}: blocked card screenshot missing`);
  }

  const bodySheets = new Set(report.bodies.map(row => row.evidence.sheet));
  assert.equal(bodySheets.size, 4, '88 bodies must be split across four contact sheets');
  const familySheets = new Set(report.families.map(row => row.evidence.sheet));
  const blockedSheets = new Set(report.blockedCards.map(row => row.evidence.sheet));
  assert.equal(familySheets.size, 1, 'family gallery screenshot missing');
  assert.equal(blockedSheets.size, 1, 'blocked gallery screenshot missing');
  const requiredSheets = new Set([...bodySheets, ...familySheets, ...blockedSheets]);
  same(Object.keys(evidence.files), requiredSheets, 'evidence manifest contains missing or unreferenced sheets');
  for (const [file, expected] of Object.entries(evidence.files)) {
    assert.match(expected.sha256, /^[a-f0-9]{64}$/, `${file}: screenshot hash missing`);
    assert(expected.bytes > 0 && expected.width > 0 && expected.height > 0, `${file}: screenshot dimensions/bytes invalid`);
    if (verifyFiles) {
      const path = join(evidenceRoot, file);
      assert(existsSync(path), `${file}: screenshot absent`);
      const bytes = readFileSync(path);
      assert.equal(bytes.length, expected.bytes, `${file}: screenshot bytes changed`);
      assert.equal(sha(bytes), expected.sha256, `${file}: screenshot hash changed`);
    }
  }

  assert.deepEqual(report.budgets, {
    maximumBodyDrawCalls: Math.max(...report.bodies.map(row => row.drawCalls)),
    maximumBodyTriangles: Math.max(...report.bodies.map(row => row.triangles)),
    maximumFamilyDrawCalls: Math.max(...report.families.map(row => row.drawCalls)),
    maximumFamilyTriangles: Math.max(...report.families.map(row => row.triangles)),
  }, 'render budgets are stale');
  assert(report.budgets.maximumBodyDrawCalls <= MAX_OUTFIT_DRAW_CALLS && report.budgets.maximumBodyTriangles <= MAX_OUTFIT_TRIANGLES, 'outfit budget exceeded');
  assert(report.budgets.maximumFamilyDrawCalls <= MAX_FAMILY_DRAW_CALLS && report.budgets.maximumFamilyTriangles <= MAX_FAMILY_TRIANGLES, 'family budget exceeded');

  assert.equal(review.schemaVersion, 'cs-urban-catalog-fit-visual-review/1');
  assert.equal(review.reviewMode, 'blind-subagent');
  assert(['approved', 'approved-with-notes'].includes(review.verdict), 'blind visual review did not approve evidence');
  assert.equal(review.evidenceManifestSha256, hashFile(evidencePath), 'blind review targets stale evidence');
  assert.deepEqual(review.sourceHashes, report.sourceHashes, 'blind review targets stale source hashes');
  same(review.sheetsReviewed, requiredSheets, 'blind reviewer did not inspect every contact sheet');
  assert(Array.isArray(review.findings) && review.findings.length > 0, 'blind review contains no visual observations');

  return {
    items: report.catalog.length,
    safeMountable: report.catalog.filter(row => row.resolution === 'mountable-proxy').length,
    blocked: report.catalog.filter(row => row.resolution === 'blocked-permission-needed').length,
    bodies: report.bodies.length,
    candidates: report.bodies.filter(row => row.status === 'candidate').length,
    failClosed: report.bodies.filter(row => row.status === 'fail-closed').length,
    incompatible: report.bodies.filter(row => row.status === 'incompatible').length,
    families: report.families.length,
    sheets: Object.keys(evidence.files).length,
    consoleErrors: report.consoleErrors.length,
    certified: 0,
  };
}

function mutants() {
  const cases = {
    'item-without-factory': data => {
      const row = data.report.catalog.find(candidate => candidate.rightsStatus === 'original-safe');
      row.resolution = 'missing-factory';
      row.factory = null;
    },
    'permission-needed-mounted': data => {
      const row = data.report.catalog.find(candidate => candidate.rightsStatus === 'permission-needed');
      row.mounted = true;
      row.resolution = 'mountable-proxy';
      row.factory = 'createUrbanApparelProxy';
    },
    'body-omitted': data => { data.report.bodies.pop(); },
    'hash-stale': data => { data.report.sourceHashes.bodyCensus = '0'.repeat(64); },
    'proxy-certified': data => { data.report.families[0].certified = true; },
    'mint-falsely-submitted': data => {
      data.batch.submitted = true;
      data.batch.submissionStatus = 'submitted';
      data.batch.submittedAt = '2026-10-17T00:00:00Z';
      data.batch.providerBatchId = 'fake';
    },
    'screenshot-missing': data => { delete data.evidence.files[data.report.bodies[0].evidence.sheet]; },
  };
  const killed = [];
  for (const [name, mutate] of Object.entries(cases)) {
    const data = structuredClone(inputs());
    const before = JSON.stringify(data);
    mutate(data);
    assert.notEqual(JSON.stringify(data), before, `${name}: mutation did not apply`);
    let reason = '';
    try { validate(data, {verifyFiles: false}); } catch (error) { reason = error.message; }
    assert(reason, `${name}: mutant survived`);
    killed.push({name, killed: true, reason});
  }
  return killed;
}

const mutationMode = process.argv.includes('--mutate') || process.argv.includes('--mutations');
const result = validate(inputs());
const mutationResults = mutationMode ? mutants() : [];
console.log(`urban-catalog-coverage ${mutationMode ? 'mutate' : 'check'}: ${JSON.stringify({...result, mutants: mutationResults})}`);
