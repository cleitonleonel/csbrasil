#!/usr/bin/env node
/* ============================================================================
   perfil-mobile-check.mjs — O PERFIL MOBILE EXISTE, É RASTEIRO E MORDE?
   ----------------------------------------------------------------------------
   O CASO (lane glm/peso, item 4): 20% das amostras de FPS em campo abaixo de 30
   (BUG-157) e nada foi medido em aparelho real. O perfil mobile (pointer:coarse)
   entra num degrau sustentável e cobra teto de textura.

   O QUE MEDE (node puro):
   P1  o degrau inicial do perfil tem o que a lane pediu: DPR menor (≤0,7),
       sombra 'baixa', sem SSAO, menos folhagem (mato ≤0,5);
   P2  tetoTextura: pointer comum devolve 0 (desktop não mexe); coarse devolve
       min(1024, MAX_TEXTURE_SIZE) — aparelho de 512 fica em 512, teto da lane
       em 1024, sem limite vira 1024;
   P3  perfilInicial: software continua no fundo; coarse entra no degrau do
       perfil; desktop em 0;
   P4  o clampTexturasGL do GLTFLoader vendido reduz imagem acima do teto e NÃO
       toca nada sem a flag (prova funcional com document/canvas falsos).

   MUTAÇÃO: `--mutante=teto-frouxo` sobe o texturaMax da política pra 4096 e
   EXIGE que P2 acenda (a régua não pode deixar teto virar opinião).

   Uso: node tools/eval/perfil-mobile-check.mjs [--mutante=teto-frouxo]
   ============================================================================ */
import { existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '../..');
const mutante = process.argv.find((a) => a.startsWith('--mutante='))?.split('=')[1];
if (mutante && mutante !== 'teto-frouxo') throw new Error(`mutante desconhecido: ${mutante}`);

// o mesmo shim de three do invariants.mjs: o GLTFLoader vendido importa 'three'
const shim = join(ROOT, 'node_modules/three');
if (!existsSync(join(shim, 'index.js'))) {
  mkdirSync(shim, { recursive: true });
  writeFileSync(join(shim, 'package.json'), JSON.stringify({ name: 'three', version: '0.160.0', type: 'module', main: 'index.js', exports: { '.': './index.js', './addons/*': './addons/*' } }));
  symlinkSync(join(ROOT, 'public/vendor/three.module.js'), join(shim, 'index.js'));
  try { symlinkSync(join(ROOT, 'public/vendor/addons'), join(shim, 'addons'), 'dir'); } catch { /* já existe */ }
}

const origemQualidade = join(ROOT, 'public/js/qualidade-adaptativa.js');
if (mutante === 'teto-frouxo') {
  const src = readFileSync(origemQualidade, 'utf8');
  const solto = src.replace('texturaMax: 1024', 'texturaMax: 4096');
  if (solto === src) throw new Error('mutante não aplicou: texturaMax mudou de forma');
  writeFileSync(origemQualidade, solto);
}

let qualidade, clampTexturasGL;
const restaurar = [];
try {
  // import com cache-bust: mutante escreveu no disco, o ESM cacheia por URL
  qualidade = await import(`file://${origemQualidade}?m=${mutante ? 'mut' : 'base'}`);
  ({ clampTexturasGL } = await import(`file://${join(ROOT, 'public/vendor/addons/loaders/GLTFLoader.js')}?m=${mutante ? 'mut' : 'base'}`));

  const falhas = [];
  const { PERFIL_MOBILE, DEGRAUS, tetoTextura, perfilInicial } = qualidade;

  const d = DEGRAUS[PERFIL_MOBILE.degrauInicial];
  if (!(d.dpr <= 0.7)) falhas.push(`P1: dpr do degrau inicial é ${d.dpr}, queria ≤0,7`);
  if (d.sombra !== 'baixa') falhas.push(`P1: sombra do degrau inicial é ${d.sombra}, queria 'baixa'`);
  if (d.ssao !== false) falhas.push('P1: degrau inicial do mobile com SSAO ligado');
  if (!(d.mato <= 0.5)) falhas.push(`P1: mato do degrau inicial é ${d.mato}, queria ≤0,5`);

  const casos = [
    [{ pointerCoarse: false }, 0, 'desktop'],
    [{ pointerCoarse: true, maxTextureSize: 4096 }, 1024, 'coarse sem limite menor'],
    [{ pointerCoarse: true, maxTextureSize: 512 }, 512, 'coarse em aparelho de 512'],
    [{ pointerCoarse: true, maxTextureSize: Infinity }, 1024, 'coastre sem limite'],
  ];
  for (const [args, esperado, nome] of casos) {
    const t = tetoTextura(args);
    if (t !== esperado) falhas.push(`P2: tetoTextura(${nome}) devolveu ${t}, queria ${esperado}`);
  }
  if (tetoTextura({ pointerCoarse: true, maxTextureSize: 1024 }) !== 1024) falhas.push('P2: teto 1024 não atravessa');
  if (tetoTextura({ pointerCoarse: true, maxTextureSize: 4096 }) > 1024) falhas.push('P2: teto da lane (1024) virou opinião: aparelho grande liberou mais');

  if (perfilInicial({ software: true }) !== DEGRAUS.length - 1) falhas.push('P3: software deixou de nascer no fundo');
  if (perfilInicial({ pointerCoarse: true }) !== PERFIL_MOBILE.degrauInicial) falhas.push('P3: coarse não entra no degrau do perfil');
  if (perfilInicial({}) !== 0) falhas.push('P3: desktop não entra no degrau 0');

  // P4: clamp funcional com canvas falso
  const desenhos = [];
  globalThis.document = {
    createElement: () => {
      const c = { width: 0, height: 0 };
      c.getContext = () => ({ drawImage: (img, x, y, w, h) => { c.width = w; c.height = h; desenhos.push([img.width, img.height, w, h]); } });
      return c;
    },
  };
  globalThis.__CS_TEXTURA_MAX__ = 1024;
  const texGrande = { isTexture: true, image: { width: 2048, height: 1024 } };
  const texOk = { isTexture: true, image: { width: 512, height: 512 } };
  const material = { map: texGrande, normalMap: texOk };
  const gltf = { scene: { traverse: (fn) => fn({ material }) } };
  clampTexturasGL(gltf);
  if (texGrande.image.width !== 1024 || texGrande.image.height !== 512) falhas.push(`P4: 2048x1024 virou ${texGrande.image.width}x${texGrande.image.height}, queria 1024x512`);
  if (texOk.image.width !== 512) falhas.push('P4: mexeu em textura dentro do teto');
  delete globalThis.__CS_TEXTURA_MAX__;
  const imagemAposFlagOff = texGrande.image;
  clampTexturasGL(gltf);
  if (texGrande.image !== imagemAposFlagOff) falhas.push('P4: clamp rodou sem a flag');
  delete globalThis.document;

  if (mutante === 'teto-frouxo') {
    const morde = falhas.length > 0 && falhas.every((f) => f.startsWith('P2:'));
    if (morde) {
      console.log(`mutante teto-frouxo reprovado como devia: ${falhas[0]}`);
      falhas = [];
    } else {
      console.error('MUTAÇÃO PASSOU — teto 4096 não foi visto pela régua.');
    }
  } else if (falhas.length) {
    console.error('perfil mobile reprovado:');
    for (const f of falhas) console.error(`  ✗ ${f}`);
    process.exitCode = 1;
  } else {
    console.log(`perfil mobile confere: degrau ${PERFIL_MOBILE.degrauInicial} (${d.nome}), teto de textura ${PERFIL_MOBILE.texturaMax} respeitando MAX_TEXTURE_SIZE, clamp do loader funcional.`);
  }
} finally {
  if (mutante === 'teto-frouxo') {
    const solto = readFileSync(origemQualidade, 'utf8');
    writeFileSync(origemQualidade, solto.replace('texturaMax: 4096', 'texturaMax: 1024'));
  }
}
process.exit(process.exitCode || 0);
