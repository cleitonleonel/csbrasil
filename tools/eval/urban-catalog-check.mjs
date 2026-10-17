#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const root = new URL('../../', import.meta.url);
const catalogPath = 'tools/character-kit/garment/urban-catalog.json';
const batchPath = 'tools/character-kit/garment/mint-urban-batch.json';
const logoRule = 'NO LOGOS, NO TRADE DRESS, NO PROTECTED EMBLEMS; use only original fictional graphics.';
const categorySlots = new Map([
  ['mochilas', 'back'],
  ['tenis-botas', 'feet'],
  ['bones-headwear', 'head'],
  ['oculos', 'face'],
  ['joias-acessorios', 'piercing'],
  ['camisetas-camisas', 'torso-inner'],
  ['jaquetas', 'torso-outer'],
  ['calcas-bermudas', 'legs'],
]);
const requiredItemKeys = [
  'id', 'name', 'category', 'slot', 'tribe', 'designOrigin', 'referenceUrls',
  'rightsStatus', 'visualBrief', 'geometryFamily', 'material', 'palette',
  'mintPrompt', 'fitStrategy', 'conflicts', 'status', 'approved', 'certified',
  'runtimeEnabled',
];
const activePromptBrandPatterns = [
  /supreme/i, /st[uü]ssy/i, /palace/i, /carhartt/i, /stone island/i,
  /oakley/i, /salomon/i, /acronym/i, /arc['’]?teryx/i, /bape/i,
  /wtaps/i, /neighborhood/i, /kapital/i, /visvim/i, /c\.p\. company/i,
  /new balance/i, /adidas/i, /nike/i, /vans/i,
];

function readInputs() {
  return {
    catalog: JSON.parse(readFileSync(new URL(catalogPath, root), 'utf8')),
    batch: JSON.parse(readFileSync(new URL(batchPath, root), 'utf8')),
  };
}

function rejectTrueFlags(value, path = 'root') {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (key === 'approved' || key === 'certified' || key === 'runtimeEnabled') {
      assert.notEqual(child, true, `${path}.${key}: candidate catalog must remain off`);
    }
    rejectTrueFlags(child, `${path}.${key}`);
  }
}

function normalizeName(value) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function assertHttpsUrl(value, message) {
  assert.equal(typeof value, 'string', message);
  const parsed = new URL(value);
  assert.equal(parsed.protocol, 'https:', message);
  assert(parsed.hostname.includes('.'), message);
}

function sameIds(actual, expected, message) {
  assert.deepEqual([...actual].sort(), [...expected].sort(), message);
}

function validate({catalog, batch}) {
  assert.equal(catalog.schemaVersion, 'cs-urban-catalog/1');
  assert.equal(batch.schemaVersion, 'cs-mint-urban-batch/1');
  assert.equal(batch.catalogPath, catalogPath);
  assert(Array.isArray(catalog.items) && catalog.items.length >= 120, 'catalog must retain the large researched set');
  assert.equal(catalog.deduplication.rule, 'exact-equivalence-only');
  assert.equal(catalog.deduplication.outputCount, catalog.items.length);
  assert.equal(catalog.deduplication.inputCounts.privateConcepts, 30);
  assert.equal(catalog.deduplication.inputCounts.streetwearResearch, 43);
  assert.equal(catalog.deduplication.inputCounts.politicalResearch, 26);
  assert.equal(catalog.deduplication.inputCounts.urbanTribesRecovered, 59);

  const declaredCategories = new Map(catalog.categories.map(({id, slot}) => [id, slot]));
  assert.deepEqual(declaredCategories, categorySlots, 'category/slot declaration changed');
  rejectTrueFlags(catalog);

  const ids = new Set();
  const exactKeys = new Set();
  const tribes = new Set();
  const origins = new Map();
  for (const item of catalog.items) {
    for (const key of requiredItemKeys) assert(Object.hasOwn(item, key), `${item.id ?? '<missing-id>'}: missing ${key}`);
    assert.match(item.id, /^[a-z0-9][a-z0-9-]+$/, `${item.id}: invalid id`);
    assert(!ids.has(item.id), `${item.id}: duplicate id`);
    ids.add(item.id);
    const exactKey = `${item.category}:${normalizeName(item.name)}`;
    assert(!exactKeys.has(exactKey), `${item.id}: exact-equivalent duplicate was not deduplicated`);
    exactKeys.add(exactKey);
    assert(categorySlots.has(item.category), `${item.id}: unknown category`);
    assert.equal(item.slot, categorySlots.get(item.category), `${item.id}: category/slot mismatch`);
    assert.equal(item.status, 'candidate', `${item.id}: non-candidate status`);
    assert.equal(item.approved, false, `${item.id}: approved must remain false`);
    assert.equal(item.certified, false, `${item.id}: certified must remain false`);
    assert.equal(item.runtimeEnabled, false, `${item.id}: runtime must remain off`);
    assert(['original-safe', 'permission-needed'].includes(item.rightsStatus), `${item.id}: invalid rights status`);
    assert(Array.isArray(item.referenceUrls) && item.referenceUrls.length > 0, `${item.id}: source URL missing`);
    for (const url of item.referenceUrls) assertHttpsUrl(url, `${item.id}: invalid source URL ${url}`);
    assert.equal(typeof item.provenance, 'object', `${item.id}: provenance missing`);
    assert.equal(typeof item.visualBrief, 'string');
    assert.equal(typeof item.geometryFamily, 'string');
    assert.equal(typeof item.mintPrompt, 'string');
    assert(item.mintPrompt.includes(logoRule), `${item.id}: Mint prompt lacks the no-logo/trade-dress rule`);
    if (item.rightsStatus === 'permission-needed') {
      assert(item.mintPrompt.startsWith('BLOCKED: permission-needed, do not submit to Mint.'), `${item.id}: protected item is not prompt-blocked`);
      assert(!Object.hasOwn(item, 'asset'), `${item.id}: protected item must not have an asset`);
    } else {
      assert(!item.mintPrompt.startsWith('BLOCKED:'), `${item.id}: original-safe item was blocked`);
    }
    assert(Array.isArray(item.conflicts), `${item.id}: conflicts must be a list`);
    tribes.add(item.tribe);
    origins.set(item.designOrigin, (origins.get(item.designOrigin) ?? 0) + 1);
  }
  assert(tribes.size >= 15, `only ${tribes.size} tribes represented`);
  assert.equal(categorySlots.size, 8);
  assert([...categorySlots.keys()].every(category => catalog.items.some(item => item.category === category)), 'a required category is empty');
  assert.deepEqual(Object.fromEntries(origins), {
    'private-concepts-v2': 30,
    'streetwear-research': 43,
    'political-rights-research': 28,
    'urban-tribes-research': 59,
  });

  const privateItems = catalog.items.filter(item => item.designOrigin === 'private-concepts-v2');
  assert.equal(privateItems.length, 30, 'the 30 private concepts must not be reduced');
  for (const item of privateItems) {
    assert.equal(item.provenance.sourcePath, 'private-assets/treta-store/items/concepts-v2/catalog.json');
    assert.equal(item.provenance.sourceItemId, item.legacySource?.id, `${item.id}: private source record was not preserved`);
    assert.equal(item.legacySource?.status, 'awaiting-human-image-approval', `${item.id}: private source status changed`);
  }
  const privateImport = catalog.sourceImports.find(source => source.designOrigin === 'private-concepts-v2');
  assert.equal(privateImport?.importedCount, 30);
  assert.match(privateImport?.sha256 ?? '', /^[a-f0-9]{64}$/, 'private source fingerprint missing');

  const tribeItems = catalog.items.filter(item => item.designOrigin === 'urban-tribes-research');
  assert.equal(tribeItems.length, 59, 'recovered tribe matrix must remain complete');
  assert.deepEqual(new Set(tribeItems.map(item => item.researchStatus)), new Set(['D', 'I', 'D/I']), 'D/I research statuses were not preserved');
  for (const item of tribeItems) {
    assert.equal(item.researchStatus, item.sourceMatrixRow?.researchStatus, `${item.id}: recovered status changed`);
    assert.equal(item.referenceUrls[0], item.sourceMatrixRow?.url, `${item.id}: recovered URL changed`);
  }

  const requestedForms = new Map([
    ['che', new Set(['camiseta'])],
    ['pt', new Set(['camiseta'])],
    ['mst', new Set(['camiseta', 'bone'])],
    ['pl-22', new Set(['camiseta', 'bone'])],
  ]);
  const official = catalog.items.filter(item => item.ownerRequest?.official === true);
  for (const [group, forms] of requestedForms) {
    const matches = official.filter(item => item.ownerRequest.group === group);
    sameIds(matches.map(item => item.ownerRequest.form), forms, `${group}: requested official forms missing`);
    for (const item of matches) {
      assert.equal(item.rightsStatus, 'permission-needed', `${item.id}: official request must be blocked by rights`);
      assert.equal(item.ownerRequest.blocked, true, `${item.id}: official request must remain blocked`);
      assert(!Object.hasOwn(item, 'asset'), `${item.id}: official request gained an asset`);
    }
    const variants = catalog.items.filter(item => item.originalSafeVariantFor === group);
    assert(variants.length >= 1, `${group}: original-safe variant missing`);
    assert(variants.every(item => item.rightsStatus === 'original-safe'), `${group}: unsafe variant marked ready`);
  }
  assert(catalog.items.filter(item => item.originalSafeVariantFor).length >= 4, 'fewer than four original-safe political variants');

  assert.equal(batch.provider, 'Mint');
  assert.equal(batch.submissionStatus, 'not-submitted-no-credits');
  assert.equal(batch.submitted, false);
  assert.equal(batch.submittedAt, null);
  assert.equal(batch.providerBatchId, null);
  assert.equal(batch.costReceipt.status, 'not-submitted-no-credits');
  assert.equal(batch.costReceipt.estimatedCost, null);
  assert.equal(batch.costReceipt.chargedCost, 0);
  assert.equal(batch.costReceipt.creditsSpent, 0);
  assert.equal(batch.costReceipt.receiptId, null);
  assert(batch.safetyContract.includes(logoRule));

  const safeIds = catalog.items.filter(item => item.rightsStatus === 'original-safe').map(item => item.id);
  const protectedIds = catalog.items.filter(item => item.rightsStatus === 'permission-needed').map(item => item.id);
  sameIds(batch.jobs.map(job => job.itemId), safeIds, 'Mint queue does not exactly cover original-safe items');
  sameIds(batch.excluded.map(item => item.itemId), protectedIds, 'Mint exclusion list does not exactly cover permission-needed items');
  const byId = new Map(catalog.items.map(item => [item.id, item]));
  for (const job of batch.jobs) {
    const item = byId.get(job.itemId);
    assert(item, `${job.itemId}: orphan Mint job`);
    assert.equal(job.geometryFamily, item.geometryFamily);
    assert.equal(job.prompt, item.mintPrompt);
    assert(job.prompt.includes(logoRule), `${job.itemId}: unsafe Mint prompt`);
    assert(!activePromptBrandPatterns.some(pattern => pattern.test(job.prompt)), `${job.itemId}: active prompt names a protected brand/trade dress`);
    assert.equal(job.submissionStatus, 'not-submitted-no-credits');
    assert.equal(job.providerJobId, null);
    assert.equal(job.outputAsset, null);
    assert.equal(job.estimatedCost, null);
    assert.equal(job.chargedCost, 0);
  }
  for (const excluded of batch.excluded) {
    assert.equal(excluded.rightsStatus, 'permission-needed');
    assert.equal(excluded.reason, 'written-rights-clearance-required');
    assert.equal(excluded.asset, null);
  }
  const familyCoverage = batch.families.flatMap(family => {
    assert(family.promptContract.includes(logoRule), `${family.geometryFamily}: family prompt lacks safety rule`);
    return family.itemIds;
  });
  sameIds(familyCoverage, safeIds, 'geometry-family groups do not exactly cover queued items');

  return {
    items: catalog.items.length,
    categories: categorySlots.size,
    tribes: tribes.size,
    safeJobs: batch.jobs.length,
    blocked: batch.excluded.length,
    officialRequestGroups: requestedForms.size,
  };
}

function runMutants() {
  const cases = {
    'copied-logo': data => {
      const job = data.batch.jobs[0];
      const item = data.catalog.items.find(candidate => candidate.id === job.itemId);
      job.prompt = 'Copy the Supreme box logo exactly.';
      item.mintPrompt = job.prompt;
    },
    'approved-true': data => {
      data.catalog.items[0].approved = true;
    },
    'source-missing': data => {
      data.catalog.items[0].referenceUrls = [];
      delete data.catalog.items[0].provenance;
    },
    'requested-item-missing': data => {
      const item = data.catalog.items.find(candidate => candidate.ownerRequest?.group === 'mst' && candidate.ownerRequest.form === 'bone');
      delete item.ownerRequest;
    },
    'dishonest-submission': data => {
      data.batch.submitted = true;
      data.batch.submissionStatus = 'submitted';
      data.batch.costReceipt.status = 'paid';
    },
  };
  const killed = [];
  for (const [name, mutate] of Object.entries(cases)) {
    const data = structuredClone(readInputs());
    const before = JSON.stringify(data);
    mutate(data);
    assert.notEqual(JSON.stringify(data), before, `${name}: mutation did not apply`);
    let reason = '';
    try {
      validate(data);
    } catch (error) {
      reason = error.message;
    }
    assert(reason, `${name}: mutant survived`);
    killed.push({name, killed: true, reason});
  }
  return killed;
}

const mutationMode = process.argv.includes('--mutate') || process.argv.includes('--mutations');
const result = validate(readInputs());
const mutants = mutationMode ? runMutants() : [];
console.log(`urban-catalog ${mutationMode ? 'mutate' : 'check'}: ${JSON.stringify({...result, mutants})}`);
