#!/usr/bin/env node
// CPR: contagem gerada não entra em PR (dois PRs abertos conflitavam no "N scripts"); só o release a reescreve.
// Uso: node tools/eval/contagens-pr-check.mjs [--mutante=volatil-vira-estrutural|release-pula-volatil|arch-sem-mascara|autofix-release]
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs';

const MUT = (process.argv.find((a) => a.startsWith('--mutante=')) || '').split('=')[1] || '';
const MUTANTES = {
  'volatil-vira-estrutural': ['tools/gen-docs.mjs', "  numeros: 'volatil',", "  numeros: 'estrutural',"],
  'release-pula-volatil': ['tools/gen-docs.mjs', "classe === 'volatil' && !RELEASE &&", "classe === 'volatil' &&"],
  'arch-sem-mascara': ['tools/gen-arch.mjs', "const RELEASE = process.argv.includes('--release');", 'const RELEASE = true;'],
  'autofix-release': ['.github/workflows/autofix.yml', 'node tools/gen-docs.mjs   ||', 'node tools/gen-docs.mjs --release ||'],
};
if (MUT && !MUTANTES[MUT]) { console.error(`mutante desconhecido: ${MUT}`); process.exit(2); }

const ler = (p) => readFileSync(p, 'utf8');
const fonte = { 'tools/gen-docs.mjs': ler('tools/gen-docs.mjs'), 'tools/gen-arch.mjs': ler('tools/gen-arch.mjs'), '.github/workflows/autofix.yml': ler('.github/workflows/autofix.yml') };
if (MUT) {
  const [arq, de, para] = MUTANTES[MUT];
  if (!fonte[arq].includes(de)) { console.error(`MUTANTE NAO APLICOU: ${MUT}`); process.exit(2); }
  fonte[arq] = fonte[arq].replace(de, para);
}
const GEN = { docs: 'tools/.contagens-gen-docs.mjs', arch: 'tools/.contagens-gen-arch.mjs' };

const TOCADOS = ['package.json', 'public/js/game.js', 'README.md', 'AGENTS.md', 'CHANGELOG.md', 'tools/eval/ARCH.md',
  ...ler('tools/gen-docs.mjs').match(/docs\/[\w/.-]+\.md/g)];
const alvos = [...new Set(TOCADOS)].filter((p) => existsSync(p));
const sujo = execFileSync('git', ['status', '--porcelain', '--', ...alvos]).toString().trim();
if (sujo) { console.log(`  \x1b[31m✗\x1b[0m CPR não dá para medir: arquivo tocado pela régua com mudança não commitada\n${sujo}`); process.exit(1); }
const originais = new Map(alvos.map((p) => [p, ler(p)]));
const restaurar = () => {
  for (const [p, t] of originais) writeFileSync(p, t);
  for (const g of Object.values(GEN)) rmSync(g, { force: true });
};
for (const sinal of ['SIGINT', 'SIGTERM']) process.on(sinal, () => { restaurar(); process.exit(1); });

const passa = (qual, ...args) => spawnSync('node', [GEN[qual], '--check', ...args], { encoding: 'utf8' }).status === 0;
const trocar = (p, de, para) => {
  const t = ler(p);
  const n = typeof de === 'function' ? de(t) : t.replace(de, para);
  if (n === t) throw new Error(`não consegui alterar ${p}`);
  writeFileSync(p, n);
};
const voltar = (p) => writeFileSync(p, originais.get(p));

const falhas = [];
try {
  writeFileSync(GEN.docs, fonte['tools/gen-docs.mjs']);
  writeFileSync(GEN.arch, fonte['tools/gen-arch.mjs']);
  for (const g of Object.values(GEN)) spawnSync('node', [g, '--release'], { encoding: 'utf8' });
  if (!passa('docs', '--release') || !passa('arch', '--release')) throw new Error('nem o modo release deixa a árvore em dia (rode: npm run docs:release e leia o erro)');

  // ---- o PR típico: um script npm a mais e uma linha a mais no game.js
  trocar('package.json', (t) => { const j = JSON.parse(t); j.scripts['zz:contagens-pr'] = 'true'; return `${JSON.stringify(j, null, 2)}\n`; });
  trocar('public/js/game.js', /^/, '// contagens-pr\n');
  if (!passa('docs')) falhas.push('CPR1 um script npm e uma linha de game.js a mais reprovam o docs:check do PR: contagem volátil ainda é cobrada no PR (é o que faz dois PRs conflitarem)');
  if (!passa('arch')) falhas.push('CPR1 uma linha a mais no game.js reprova o arch:check do PR: número de linha ainda é cobrado no PR');
  if (passa('docs', '--release')) falhas.push('CPR2 o mesmo drift PASSA no docs:check:release: o trem não regenera as contagens');
  if (passa('arch', '--release')) falhas.push('CPR2 o mesmo drift PASSA no arch:check:release: o trem não regenera as linhas');
  voltar('package.json'); voltar('public/js/game.js');

  // ---- estrutura continua mordendo no PR
  trocar('package.json', (t) => { const j = JSON.parse(t); j.scripts['check:fast'] += ' zz:contagens-pr'; return `${JSON.stringify(j, null, 2)}\n`; });
  if (passa('docs')) falhas.push('CPR3 check:fast mudou e o docs:check do PR passou: a lista de comandos é estrutura e tem de ser conferida no PR');
  voltar('package.json');
  trocar('public/js/game.js', /^/, '  _contagensPr() {\n');
  if (passa('arch')) falhas.push('CPR3 método novo no game.js e o arch:check do PR passou: a lista de símbolos é estrutura');
  voltar('public/js/game.js');

  // ---- cada bloco volátil: o PR não confere, o release confere
  const classes = Object.fromEntries([...fonte['tools/gen-docs.mjs'].match(/const CLASSE = \{([\s\S]*?)\n\};/)[1]
    .matchAll(/^\s*(\w+): '(\w+)',/gm)].map((m) => [m[1], m[2]]));
  const colocacao = fonte['tools/gen-docs.mjs'].match(/const COLOCACAO = \{([\s\S]*?)\n\};/)[1];
  const volateis = Object.keys(classes).filter((b) => classes[b] === 'volatil');
  if (!volateis.length) falhas.push('CPR4 nenhum bloco classificado como volátil: a classificação sumiu ou foi lida errado');
  for (const bloco of volateis) {
    const arq = new RegExp(`^\\s*${bloco}: \\['([^']+)'`, 'm').exec(colocacao)?.[1];
    if (!arq) { falhas.push(`CPR4 bloco ${bloco} sem colocação`); continue; }
    trocar(arq, new RegExp(`(BEGIN:GERADO:${bloco}\\b[\\s\\S]*?)(\\d+)`), '$1$27');
    if (!passa('docs')) falhas.push(`CPR4 contagem do bloco ${bloco} adulterada reprova o PR: bloco volátil tratado como estrutura`);
    if (passa('docs', '--release')) falhas.push(`CPR4 contagem do bloco ${bloco} adulterada PASSA no release: o trem pula esse bloco`);
    voltar(arq);
  }

  // ---- fiação: o trem chama o modo release, o autofix e os scripts de PR não
  const release = ler('.github/workflows/release.yml');
  if (!/node tools\/gen-docs\.mjs --release\b/.test(release) || !/node tools\/gen-arch\.mjs --release\b/.test(release))
    falhas.push('CPR5 release.yml não chama gen-docs/gen-arch com --release: nada regenera as contagens');
  const conserta = /- name: Conserta o mecânico[\s\S]*?(?=\n\s*\n|\n {6}- )/.exec(fonte['.github/workflows/autofix.yml'])?.[0] || '';
  if (!/gen-docs\.mjs/.test(conserta) || /--release/.test(conserta))
    falhas.push('CPR5 o autofix regenera em modo release: volta a empurrar contagem para todo PR (e a trazer a main junto)');
  const s = JSON.parse(originais.get('package.json')).scripts;
  const pr = ['docs', 'docs:check', 'arch', 'arch:check'].filter((k) => !s[k] || /--release/.test(s[k]));
  const rel = ['docs:release', 'docs:check:release', 'arch:release', 'arch:check:release'].filter((k) => !/--release/.test(s[k] || ''));
  if (pr.length || rel.length) falhas.push(`CPR5 scripts npm fora do contrato: ${[...pr, ...rel].join(', ')} (os de PR sem --release, os :release com)`);
} catch (e) {
  falhas.push(`CPR não deu para medir: ${String(e.message || e).split('\n')[0]}`);
} finally {
  restaurar();
}

for (const f of falhas) console.log(`  \x1b[31m✗\x1b[0m ${f}`);
if (!falhas.length) console.log('  \x1b[32m✓\x1b[0m CPR contagens voláteis só no release; estrutura confere no PR; trem e autofix no modo certo');
if (MUT && !falhas.length) {
  console.log(`  \x1b[31m✗\x1b[0m MUTAÇÃO '${MUT}' não acendeu nenhuma cláusula — portão cego (lei 3)`);
  falhas.push('mutacao-cega');
}
if (MUT && falhas.length && !falhas.includes('mutacao-cega')) { console.log(`  ✓ mutante ${MUT} ficou vermelho`); process.exit(0); }
process.exit(falhas.length ? 1 : 0);
