#!/usr/bin/env node
/*
 * BUG-40 (09/08): o Release alpha.47 saiu como "CORO SOLTO" e as notas feitas
 * de `git log --oneline` não ligaram o PR #119 a @EmersonGarrido. O GitHub
 * documenta que `--generate-notes` inclui PRs e contribuidores; esta régua cobra
 * isso em todo caminho que chama `gh release create`.
 *
 * RLS3: o alpha.56 entrou sem trailer; cobra DCO em todo commit automático de release.
 *
 * RLS4: o bump reconstrói e versiona o site estático de documentação.
 *
 * RLS5: uma falha do release local restaura os arquivos antes de sair.
 *
 * RLS6: release não dispara um segundo deploy; o fallback fica manual.
 * RLS8: o push do bot não cancela o run que ainda publica o Release e avisa o backend.
 * RLS9: TREM DE RELEASE (13/10/2026). Produção só builda em commit `chore(release):`
 *       (vercel.json → ignoreCommand → scripts/ci/vercel-ignore.sh, executado aqui de
 *       verdade com as três mensagens que importam) e o release.yml não volta a disparar
 *       por push na main — 126 releases em 130 merges era o motor do churn de bot.
 *
 * RLS10: GERADO VELHO NÃO TRAVA O TREM (13/10/2026, c2ca685). Dois PRs testados sobre bases
 *       diferentes mesclam limpo e deixam contagem velha na main; com o DOCS1 reprovando o push,
 *       o embarque (que exige pr-fast verde) nunca saía, e o trem é quem regenera. No push da
 *       main, docs:check, arch:check e a autoria só rodam no commit `chore(release):`; no PR
 *       docs:check e arch:check continuam valendo sempre, e o release regenera os dois.
 *
 * Mutações: --mutante=nome-antigo | semcreditos | semdco | semdocs | semrollback | deploy-duplo | deploy-yaml | sem-anims-deploy | cancelar-bot | trem-por-push | ignora-sem-filtro | gerado-trava-trem | gerado-fora-do-pr | autoria-trava-trem | release-sem-arch.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const mutante = process.argv.find((arg) => arg.startsWith('--mutante='))?.split('=')[1];
const arquivos = ['.github/workflows/release.yml', '.github/workflows/ci.yml'];
let workflowRelease = readFileSync('.github/workflows/release.yml', 'utf8');
let workflowDeploy = readFileSync('.github/workflows/deploy-prod.yml', 'utf8');
let workflowSources = readdirSync('.github/workflows')
  .filter((arquivo) => /\.ya?ml$/.test(arquivo))
  .map((arquivo) => [arquivo, readFileSync(`.github/workflows/${arquivo}`, 'utf8')]);
const workflowsProd = () => workflowSources
  .filter(([, source]) => /vercel\s+deploy[\s\S]{0,240}?--prod/.test(source))
  .map(([arquivo]) => arquivo);
const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
let scriptRelease = readFileSync('scripts/release.mjs', 'utf8');
let comandos = arquivos.flatMap((arquivo) => readFileSync(arquivo, 'utf8')
  .split('\n')
  .filter((linha) => /(?:^\s*|run:\s*)gh release create/.test(linha))
  .map((linha) => ({ arquivo, linha })));
let commitsRelease = workflowRelease
  .split('\n')
  .filter((linha) => /^\s*git commit(?:\s|$)/.test(linha));
commitsRelease.push(...scriptRelease
  .split('\n')
  .filter((linha) => /(?:spawnSync|roda)\(['"]git['"],\s*\[['"]commit['"]/.test(linha)));

const temDco = (linha) =>
  /(?:^|\s)(?:-s|--signoff)(?=\s|$)/.test(linha)
  || /['"](?:-s|--signoff)['"]/.test(linha);
let docsRelease = [
  workflowRelease.includes('npm run build:site') && /git add[^\n]*public\/docs/.test(workflowRelease),
  scriptRelease.includes("'build:site'")
    && /ARQUIVOS_RELEASE\s*=\s*\[[\s\S]*?'public\/docs'/.test(scriptRelease)
    && /roda\('git', \['add', \.\.\.ARQUIVOS_RELEASE\]\)/.test(scriptRelease),
];
let rollbackRelease = /const desfazRelease\s*=/.test(scriptRelease)
  && /update-ref', 'HEAD'/.test(scriptRelease)
  && /git', \['restore'/.test(scriptRelease)
  && /git', \['clean'/.test(scriptRelease)
  && /catch \(erro\)[\s\S]*desfazRelease\(/.test(scriptRelease);
const gatilhos = (workflow) => {
  const linhas = workflow.split('\n');
  const inicio = linhas.findIndex((linha) => linha.trim() === 'on:');
  if (inicio < 0) return [];
  const bloco = [];
  for (let i = inicio + 1; i < linhas.length && (linhas[i] === '' || /^\s/.test(linhas[i])); i++) bloco.push(linhas[i]);
  return bloco.flatMap((linha) => linha.match(/^  ([\w-]+):/)?.slice(1) || []);
};
const validaCaminhoProd = () => {
  const eventos = gatilhos(workflowDeploy);
  return vercel.git?.deploymentEnabled?.main === true
    && eventos.length === 1
    && eventos[0] === 'workflow_dispatch'
    && workflowsProd().length === 1
    && workflowsProd()[0] === 'deploy-prod.yml'
    && /^permissions:\n  contents: read\s*$/m.test(workflowDeploy)
    && /^concurrency:\n  group: deploy-prod\n  cancel-in-progress: false\s*$/m.test(workflowDeploy)
    && /^\s+ref:\s*refs\/tags\/\$\{\{\s*github\.event\.inputs\.tag\s*\}\}\s*$/m.test(workflowDeploy);
};
let caminhoProdUnico = validaCaminhoProd();
let animacoesNoDeploy = /(?:^|\s)anims:check(?:\s|$)/.test(packageJson.scripts['check:deploy'] || '')
  && /(?:^|\s)anims:merge:check(?:\s|$)/.test(packageJson.scripts['check:deploy'] || '');
const validaConcorrenciaRelease = () => /^concurrency:\n  group: release-main\n  cancel-in-progress: \$\{\{ !startsWith\(github\.event\.head_commit\.message, 'chore\(release\):'\) \}\}$/m.test(workflowRelease);
let concorrenciaRelease = validaConcorrenciaRelease();

/* RLS9 — o filtro roda de verdade: o que importa é o código de saída que a Vercel vê. */
let scriptIgnora = (() => { try { return readFileSync('scripts/ci/vercel-ignore.sh', 'utf8'); } catch { return ''; } })();
const saidaIgnora = (env, msg) => spawnSync('bash', ['-c', scriptIgnora], {
  env: { PATH: process.env.PATH, VERCEL_ENV: env, VERCEL_GIT_COMMIT_MESSAGE: msg }, encoding: 'utf8',
}).status;
const validaTrem = () => {
  const comandoOk = vercel.ignoreCommand === 'bash scripts/ci/vercel-ignore.sh';
  const filtroOk = scriptIgnora !== ''
    && saidaIgnora('production', 'chore(release): v9.9.9-alpha.1') === 1   // release builda
    && saidaIgnora('production', 'feat: qualquer merge') === 0             // merge espera o trem
    && saidaIgnora('preview', 'feat: qualquer PR') === 1;                  // preview não muda
  const eventos = gatilhos(workflowRelease);
  const semPush = !eventos.includes('push') && eventos.includes('schedule') && eventos.includes('workflow_dispatch');
  const esperaVerde = /gh run list[^\n]*--workflow ci\.yml/.test(workflowRelease) && /needs: embarque/.test(workflowRelease);
  return comandoOk && filtroOk && semPush && esperaVerde;
};
let tremRelease = validaTrem();

/* RLS10 — o passo de gerado roda no PR sempre e, no push, só no commit do release. */
let workflowCi = readFileSync('.github/workflows/ci.yml', 'utf8');
const SO_PR_OU_RELEASE = "if: github.event_name == 'pull_request' || startsWith(github.event.head_commit.message, 'chore(release):')";
const validaGerados = () => {
  const passo = (script) => new RegExp(`- name: [^\\n]+\\n\\s+(if: [^\\n]+)\\n\\s+run: npm run ${script}\\n`).exec(workflowCi)?.[1];
  const autoria = /^  autoria-na-main:\n    (if: [^\n]+)$/m.exec(workflowCi)?.[1] || '';
  return passo('docs:check') === SO_PR_OU_RELEASE
    && passo('arch:check') === SO_PR_OU_RELEASE
    && autoria.includes("startsWith(github.event.head_commit.message, 'chore(release):')")
    && /node tools\/gen-docs\.mjs/.test(workflowRelease)
    && /node tools\/gen-arch\.mjs/.test(workflowRelease);
};
let geradosNoTrem = validaGerados();

if (mutante) {
  const antes = JSON.stringify([comandos, commitsRelease, docsRelease, rollbackRelease, caminhoProdUnico, animacoesNoDeploy, concorrenciaRelease, tremRelease, geradosNoTrem]);
  if (mutante === 'nome-antigo') comandos[0].linha = comandos[0].linha.replace('"CSBR ', '"CORO SOLTO ');
  else if (mutante === 'semcreditos') comandos[0].linha = comandos[0].linha.replace(' --generate-notes', '');
  else if (mutante === 'semdco') {
    const i = commitsRelease.findIndex(temDco);
    if (i >= 0) commitsRelease[i] = commitsRelease[i]
      .replace(/\s(?:-s|--signoff)(?=\s|$)/, '')
      .replace(/['"](?:-s|--signoff)['"]\s*,?\s*/, '');
  }
  else if (mutante === 'semdocs') docsRelease[0] = false;
  else if (mutante === 'semrollback') rollbackRelease = false;
  else if (mutante === 'deploy-duplo') {
    workflowDeploy = workflowDeploy.replace('on:\n', 'on:\n  release:\n    types: [published]\n');
    caminhoProdUnico = validaCaminhoProd();
  }
  else if (mutante === 'deploy-yaml') {
    workflowSources.push(['segundo-deploy.yaml', 'steps:\n  - run: vercel deploy --prebuilt --prod']);
    caminhoProdUnico = validaCaminhoProd();
  }
  else if (mutante === 'sem-anims-deploy') animacoesNoDeploy = false;
  else if (mutante === 'cancelar-bot') {
    workflowRelease = workflowRelease.replace(/^  cancel-in-progress: .*$/m, '  cancel-in-progress: true');
    concorrenciaRelease = validaConcorrenciaRelease();
  }
  else if (mutante === 'trem-por-push') {
    workflowRelease = workflowRelease.replace('on:\n', 'on:\n  push:\n    branches: [main]\n');
    tremRelease = validaTrem();
  }
  else if (mutante === 'ignora-sem-filtro') {
    scriptIgnora = scriptIgnora.replace(/^exit 0$/m, 'exit 1');
    tremRelease = validaTrem();
  }
  else if (mutante === 'gerado-trava-trem') {
    workflowCi = workflowCi.replace(`${SO_PR_OU_RELEASE}\n        run: npm run docs:check`, 'run: npm run docs:check');
    geradosNoTrem = validaGerados();
  }
  else if (mutante === 'gerado-fora-do-pr') {
    workflowCi = workflowCi.replace(`${SO_PR_OU_RELEASE}\n        run: npm run arch:check`, "if: startsWith(github.event.head_commit.message, 'chore(release):')\n        run: npm run arch:check");
    geradosNoTrem = validaGerados();
  }
  else if (mutante === 'autoria-trava-trem') {
    workflowCi = workflowCi.replace(/^(  autoria-na-main:\n    if: github\.event_name == 'push').*$/m, '$1');
    geradosNoTrem = validaGerados();
  }
  else if (mutante === 'release-sem-arch') {
    workflowRelease = workflowRelease.replace(/node tools\/gen-arch\.mjs/g, 'true');
    geradosNoTrem = validaGerados();
  }
  else throw new Error(`mutante desconhecido: ${mutante}`);
  if (JSON.stringify([comandos, commitsRelease, docsRelease, rollbackRelease, caminhoProdUnico, animacoesNoDeploy, concorrenciaRelease, tremRelease, geradosNoTrem]) === antes) throw new Error(`MUTANTE NAO APLICOU: ${mutante}`);
}

const nomes = comandos.filter(({ linha }) => /--title "CSBR \$/.test(linha)).length;
const creditos = comandos.filter(({ linha }) => linha.includes('--generate-notes')).length;
const total = comandos.length;
const dco = commitsRelease.filter(temDco).length;
const totalCommits = commitsRelease.length;
const docsOk = docsRelease.filter(Boolean).length;
const ok = total > 0 && nomes === total && creditos === total && totalCommits > 0 && dco === totalCommits && docsOk === docsRelease.length && rollbackRelease && caminhoProdUnico && animacoesNoDeploy && concorrenciaRelease && tremRelease && geradosNoTrem;

console.log(`${nomes === total && total ? '✓' : '✗'} RLS1 título CSBR: ${nomes}/${total} caminhos`);
console.log(`${creditos === total && total ? '✓' : '✗'} RLS2 notas com contribuidores: ${creditos}/${total} caminhos`);
console.log(`${dco === totalCommits && totalCommits ? '✓' : '✗'} RLS3 commits automáticos com DCO: ${dco}/${totalCommits} caminhos`);
console.log(`${docsOk === docsRelease.length ? '✓' : '✗'} RLS4 site de docs reconstruído e versionado: ${docsOk}/${docsRelease.length} caminhos`);
console.log(`${rollbackRelease ? '✓' : '✗'} RLS5 falha local restaura a árvore de trabalho`);
console.log(`${caminhoProdUnico ? '✓' : '✗'} RLS6 produção tem um caminho automático e fallback manual`);
console.log(`${animacoesNoDeploy ? '✓' : '✗'} RLS7 deploy valida manifesto e GLBs mesclados de animação`);
console.log(`${concorrenciaRelease ? '✓' : '✗'} RLS8 push do bot não cancela publicação e dispatch`);
console.log(`${tremRelease ? '✓' : '✗'} RLS9 produção só sai no trem de release, e o trem só sai com a main verde`);
console.log(`${geradosNoTrem ? '✓' : '✗'} RLS10 bloco gerado velho na main não trava o trem; o PR e o commit do release conferem`);
if (!ok) {
  console.error('Release inválido: preserve créditos, DCO, docs, concorrência segura e um único caminho automático de produção.');
  process.exit(1);
}
