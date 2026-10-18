#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const cli = path.join(ROOT, 'tools/fabrica/weapon-skins.mjs');
const lib = path.join(ROOT, 'tools/fabrica/weapon-skins-lib.mjs');
const catalogFile = path.join(ROOT, 'tools/fabrica/skins/weapon-skins.v1.json');
for (const file of [cli, lib, catalogFile]) assert(fs.existsSync(file), `weapon skins: fonte unificada ausente (${path.relative(ROOT, file)})`);

const api = await import(pathToFileURL(lib));
const catalog = api.loadCatalog(catalogFile);
const runtimeIds = await api.runtimeWeaponIds();
assert.deepEqual(Object.keys(catalog.coverage).sort(), [...runtimeIds].sort(), 'cobertura não enumera exatamente as armas do runtime');
assert(Object.values(catalog.coverage).every((entry) => ['supported', 'unknown', 'incompatible'].includes(entry.status)), 'status de cobertura inválido');
assert(Object.values(catalog.coverage).filter((entry) => entry.status === 'supported').length > 0, 'nenhum par 1P↔3P suportado');
assert(Object.values(catalog.factoryRecipes).every((recipe) => recipe.source?.fingerprints && recipe.partMappings), 'receita sem fonte/partes rastreáveis');
for (const family of Object.values(catalog.families)) {
  assert.equal(family.approved, false, `${family.id}: approved só muda após crítica humana`);
  assert.equal(family.store, false, `${family.id}: store só muda após backend`);
}

const out = fs.mkdtempSync(path.join(os.tmpdir(), 'weapon-skins-gate-'));
try {
  const first = await api.buildVariants({ catalogFile, outputDir: out, runtimeIds });
  const snapshot = api.directoryDigest(out);
  const second = await api.buildVariants({ catalogFile, outputDir: out, runtimeIds });
  assert.deepEqual(second, first, 'build repetida mudou o manifesto');
  assert.equal(api.directoryDigest(out), snapshot, 'build repetida não foi determinística byte a byte');
  const supported = Object.entries(catalog.coverage).filter(([, entry]) => entry.status === 'supported');
  assert.equal(first.outputs.length, supported.length * 2, 'cada arma suportada precisa de saída 1P e 3P');
  await api.verifyVariantDirectory(out, { writeAppliedDir: null });

  if (process.argv.includes('--mutations')) {
    const patches = first.outputs.map((entry) => api.readJSON(path.join(out, entry.file)));
    const pair = patches.filter((patch) => patch.weaponId === supported[0][0]);
    assert.equal(pair.length, 2, 'fixture de par ausente');
    await api.expectMutation('source-digest', pair[0], out);
    await api.expectMutation('uv-binding', pair[0], out);
    await api.expectMutation('rig', pair.find((patch) => patch.perspective === '1p'), out);
    await api.expectMutation('animation', pair.find((patch) => patch.perspective === '1p'), out);
    await api.expectMutation('off-by-one', pair[0], out);
    await api.expectMutation('identity-parity', pair, out);
    const magazine = patches.find((patch) => patch.perspective === '1p' && patch.invariants.magazineParts.length);
    assert(magazine, 'fixture de carregador ausente');
    await api.expectMutation('magazine', magazine, out);
    console.log('PASS: 7/7 mutantes de digest, UV/binding, rig, animação, off-by-one, identidade e carregador detectados');
  } else {
    console.log(`PASS: ${runtimeIds.length} armas censadas; ${supported.length} pares suportados; ${first.outputs.length} variantes materiais determinísticas; rigs/clipes/pesos/UVs/carregadores intactos`);
  }
} finally {
  fs.rmSync(out, { recursive: true, force: true });
}
