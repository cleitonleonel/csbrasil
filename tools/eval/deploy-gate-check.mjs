#!/usr/bin/env node
/* ============================================================================
   deploy-gate-check.mjs — QUEM BLOQUEIA O PR É O CI, NÃO A VERCEL
   ----------------------------------------------------------------------------
   MEDIDO EM 21/08/2026: Vercel vermelha em 13 dos 14 PRs vindos de fork, sempre
   com `Authorization required to deploy.` - a proteção de fork da própria Vercel,
   que não se resolve por commit nenhum. E em 4 PRs de casa o vermelho era build
   real, uma vez por `fetch-decals.sh` não ter baixado o acervo (196 de 197
   decalques faltando) num soluço de rede.

   Para poder tirar a Vercel do caminho crítico do PR, duas coisas precisam valer:

   DG1 · o CI constrói o site no próprio PR. Sem isso, tirar a Vercel do bloqueio
         deixaria o PR sem NENHUMA prova de que o site compila.
   DG2 · nenhum download do caminho do build corre sem retry. `set -e` mais um
         `curl` sem `--retry` transforma soluço de rede em PR vermelho, e o autor
         não tem o que consertar - é o mesmo dano do portão que não pode medir.
   DG3 · o preview de fork roda sem pedir aprovação a ninguém, porque quem compila
         não tem segredo e quem tem segredo não compila. Os dois arquivos existem e o
         contrato deles é guardado em detalhe pelo `scripts/ci/workflow_security_check.py`
         (PRV1/PRV2/PRV3); aqui só se confere que o par não sumiu.
   DG4 · o contexto obrigatório `build` da main sai de UM job só, o `build` do
         ci.yml (pr-fast). O ruleset exige o contexto pelo NOME, sem amarrar a
         workflow, então qualquer outro job chamado `build` conta para ele. Medido
         em 13/10: o job do preview-build.yml também se chamava `build`, e o PR
         ficava com dois `build` (um deles só o build do preview) no mesmo contexto.
   DG5 · o `build` do ci.yml é AGREGADOR (14/10/2026: as invariantes custavam 6,5 a 9 min
         de um job de 9 a 12, em série com todo o resto) e responde por todos:
         `needs:` cita todo job do pr-fast que roda no PR (menos o `dco`, que é contexto
         obrigatório próprio, e os de push/tag), roda com `if: always()` e reprova se
         qualquer resultado não for `success`. Sem o `always()`, job necessário vermelho
         deixa o agregador SKIPPED, e o ruleset aceita contexto obrigatório pulado como
         verde: o PR passaria com as invariantes vermelhas.

   Uso: node tools/eval/deploy-gate-check.mjs [--mutante=<nome>]
   ============================================================================ */
import { readFileSync, readdirSync } from 'node:fs';

const MUT = (process.argv.find((a) => a.startsWith('--mutante=')) || '').split('=')[1] || '';
const MUTANTES = {
  'ci-sem-build': 'DG1', 'download-sem-retry': 'DG2', 'preview-sem-par': 'DG3', 'preview-vira-build': 'DG4',
  'agregador-sem-job': 'DG5', 'agregador-pula': 'DG5', 'agregador-cego': 'DG5', 'build-sem-agregador': 'DG5',
};
if (MUT && !MUTANTES[MUT]) { console.error(`mutante desconhecido: ${MUT}`); process.exit(2); }

const ler = (p) => { try { return readFileSync(p, 'utf8'); } catch { return ''; } };
const falhas = [];

/* ---- DG1: o CI constrói no PR ---- */
let ci = ler('.github/workflows/ci.yml');
if (MUT === 'ci-sem-build') ci = ci.replace('run: npm run build', 'run: echo pulei o build');
const on = (ci.match(/^on:\n([\s\S]*?)(?=^\S)/m) || [])[1] || '';
if (!/^\s{2}pull_request:/m.test(on) || !/run:\s*npm run build/.test(ci)) {
  falhas.push('DG1 ci.yml não constrói o site em pull_request — sem isso a Vercel não pode sair do bloqueio');
}

/* ---- DG2: download do build com retry ---- */
const FETCHERS = readdirSync('scripts').filter((f) => /^fetch-.*\.sh$/.test(f));
for (const f of FETCHERS) {
  let sh = ler(`scripts/${f}`);
  if (MUT === 'download-sem-retry' && f === 'fetch-decals.sh') {
    sh = sh.replace(/curl --retry \d+[^"]*-fsSL/, 'curl -fsSL');
  }
  for (const linha of sh.split('\n')) {
    if (!/^\s*curl\s/.test(linha)) continue;
    if (!/--retry\b/.test(linha)) {
      falhas.push(`DG2 scripts/${f}: curl sem --retry no caminho do build — soluço de rede vira PR vermelho`);
    }
  }
}
if (!FETCHERS.length) falhas.push('DG2 nenhum scripts/fetch-*.sh encontrado — a régua perdeu o alvo');

/* ---- DG3: a etiqueta do preview nasce com quem a usa ---- */
let preview = ler('.github/workflows/preview-bot.yml');
if (MUT === 'preview-sem-par') preview = preview.replace(/ensure_labels\.py preview-autorizado/, 'ensure_labels.py');
const temBuild = ler('.github/workflows/preview-build.yml');
const temDeploy = ler('.github/workflows/preview-deploy.yml');
if (MUT === 'preview-sem-par') { /* nome antigo do mutante: agora derruba o par */ }
const par = (MUT === 'preview-sem-par') ? '' : (temBuild && temDeploy);
if (!par) {
  falhas.push('DG3 falta preview-build.yml ou preview-deploy.yml — sem o par, preview de fork volta a depender de aprovação humana');
}

/* ---- DG4: só o pr-fast responde pelo contexto obrigatório `build` ---- */
/* Nome do check run = `name:` do job, ou o id do job quando não há `name:`. Lido por
   indentação, como a wftimeout: id com 2 espaços dentro de `jobs:`, chaves com 4. */
const nomesDeJob = (fonte) => {
  const nomes = [];
  let dentro = false;
  for (const linha of fonte.split('\n')) {
    if (/^jobs:\s*$/.test(linha)) { dentro = true; continue; }
    if (!dentro) continue;
    if (/^\S/.test(linha)) { dentro = false; continue; }
    const id = /^ {2}([A-Za-z0-9_-]+):\s*$/.exec(linha);
    if (id) { nomes.push(id[1]); continue; }
    const nome = /^ {4}name:\s*['"]?([^'"#\n]+?)['"]?\s*$/.exec(linha);
    if (nome) nomes[nomes.length - 1] = nome[1];
  }
  return nomes;
};
for (const arq of readdirSync('.github/workflows').filter((f) => /\.ya?ml$/.test(f))) {
  let fonte = ler(`.github/workflows/${arq}`);
  if (MUT === 'preview-vira-build' && arq === 'preview-build.yml') fonte = fonte.replace(/^ {2}preview:\s*$/m, '  build:');
  const nomes = nomesDeJob(fonte);
  if (arq === 'ci.yml' && !nomes.includes('build')) falhas.push('DG4 ci.yml não tem mais o job `build` — o contexto obrigatório da main ficaria sem dono');
  if (arq !== 'ci.yml' && nomes.includes('build')) falhas.push(`DG4 ${arq} tem um job \`build\` — ele conta para o contexto obrigatório \`build\` da main junto com o pr-fast`);
}

/* ---- DG5: o `build` agregador responde por todo job do pr-fast ---- */
/* Corpo de cada job por indentação, como o nomesDeJob acima. */
const corposDeJob = (fonte) => {
  const corpos = {};
  let dentro = false;
  let atual = null;
  for (const linha of fonte.split('\n')) {
    if (/^jobs:\s*$/.test(linha)) { dentro = true; continue; }
    if (!dentro) continue;
    if (/^\S/.test(linha)) { dentro = false; continue; }
    const id = /^ {2}([A-Za-z0-9_-]+):\s*$/.exec(linha);
    if (id) { atual = id[1]; corpos[atual] = ''; continue; }
    if (atual) corpos[atual] += `${linha}\n`;
  }
  return corpos;
};
{
  let fonte = ci;
  if (MUT === 'build-sem-agregador') fonte = fonte.replace(/^ {2}build:\s*$/m, '  build-antigo:');
  const corpos = corposDeJob(fonte);
  /* Fora do agregador: o próprio build, o dco (contexto obrigatório separado) e quem só
     roda em push/tag (`if:` que exige push ou ref de tag). */
  const soPushOuTag = (c) => /^ {4}if:[^\n]*(github\.event_name == 'push'|startsWith\(github\.ref, 'refs\/tags\/)/m.test(c);
  const devidos = Object.entries(corpos)
    .filter(([n, c]) => n !== 'build' && n !== 'dco' && !soPushOuTag(c))
    .map(([n]) => n);
  let build = corpos.build || '';
  if (MUT === 'agregador-sem-job') build = build.replace(/^( {4}needs:\s*\[)([^\]]*)\]/m, (_, a, b) => `${a}${b.split(',').map((x) => x.trim()).slice(1).join(', ')}]`);
  if (MUT === 'agregador-pula') build = build.replace(/^ {4}if: always\(\)\s*\n/m, '');
  /* O alvo é a checagem DENTRO do laço: é ela que reprova o resultado ruim. */
  if (MUT === 'agregador-cego') build = build.replace(/(\[ "\$r" = success \] \|\| \{[^}\n]*)exit 1; \}/, '$1exit 0; }');
  if (!build) falhas.push('DG5 ci.yml não tem o job `build` — o contexto obrigatório ficaria sem dono');
  else if (!/^ {4}needs:/m.test(build)) falhas.push('DG5 o `build` não é agregador (sem `needs:`): as invariantes (6,5 a 9 min) seguram o resto do pr-fast em série, num job só');
  else {
    const needs = (/^ {4}needs:\s*\[([^\]]*)\]/m.exec(build)?.[1] || '').split(',').map((x) => x.trim()).filter(Boolean);
    for (const n of devidos) if (!needs.includes(n)) falhas.push(`DG5 o job \`${n}\` roda no PR e o \`build\` não o cita em \`needs:\` — vermelho nele não chega ao contexto obrigatório`);
    if (!/^ {4}if: always\(\)\s*$/m.test(build)) falhas.push('DG5 o `build` agregador não roda com `if: always()` — job necessário vermelho o deixa SKIPPED, e contexto obrigatório pulado conta como verde');
    if (!/RESULTADOS: \$\{\{ join\(needs\.\*\.result, ' '\) \}\}/.test(build) || !/\[ "\$r" = success \] \|\| \{[^}\n]*exit 1; \}/.test(build)) {
      falhas.push('DG5 o `build` agregador não reprova quando algum `needs.*.result` não é `success`');
    }
  }
}

for (const f of falhas) console.log(`  \x1b[31m✗\x1b[0m ${f}`);
if (!falhas.length) console.log(`  \x1b[32m✓\x1b[0m DG o PR é bloqueado pelo build do CI; download tem retry (${FETCHERS.length} fetchers); preview de fork sem aprovação`);
if (MUT && !falhas.length) {
  console.log(`  \x1b[31m✗\x1b[0m MUTAÇÃO '${MUT}' não acendeu nenhuma cláusula — portão cego`);
  falhas.push('mutacao-cega');   // prova que não morde é vermelho, não aviso (MC1)
}
process.exit(falhas.length ? 1 : 0);
