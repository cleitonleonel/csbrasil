/* MATCH-OPTIONS-CHECK — o seletor de rounds governa a duração real da partida.

   A tela de mapas oferece 1/3/5/7 rounds. Esta régua instancia a classe Game de produção
   nos dois modos e prova que o número escolhido é a quantidade disputada, não uma série
   "melhor de N" que termina assim que um lado alcança maioria. Os padrões históricos
   continuam 5 no mata-mata e 3 no captura quando a opção não é informada.

   A regressão visual/de-wiring é cobrada por UIR33 em redesign-check.mjs. Aqui o mutante
   `fixo` descarta a escolha antes de construir o jogo; `maioria` restaura o encerramento
   antecipado em 3 × 0 quando o jogador escolheu 5. Ambos precisam deixar a régua vermelha.

   MULTIPLAYER: o servidor (Room do backend) cria o Game SEM roundsMax, então a sala online
   joga o padrão 5 / 3 e o fim chega pelo estado `matchEnd` dele. O cliente não pode passar
   o teto LOCAL (1–15) na sessão online, senão o HUD mostra "RODADA 1 / 15" numa partida que
   acaba na 5ª. Cláusula de fonte; o mutante `mp-local` restaura o teto local no online.

   Uso: npm run eval:matchoptions
        node tools/eval/match-options-check.mjs --mutante=fixo
        node tools/eval/match-options-check.mjs --mutante=maioria
        node tools/eval/match-options-check.mjs --mutante=mp-local
*/
import { readFileSync } from 'node:fs';
import { bootGame, initTextures } from './harness.mjs';

const MUT = (process.argv.find((a) => a.startsWith('--mutante=')) || '').split('=')[1] || '';
const textures = initTextures();
const failures = [];
const rows = [];

function expect(ok, message) {
  if (!ok) failures.push(message);
}

for (const ctf of [false, true]) {
  for (const selected of [1, 2, 3, 5, 7, 9, 15]) {
    const g = bootGame('praca_poderes', {
      textures,
      ctf,
      roundsMax: MUT === 'fixo' ? undefined : selected,
      seed: 29200 + selected + (ctf ? 100 : 0),
    });
    const mode = ctf ? 'ctf' : 'mata-mata';
    const maioria = Math.floor(selected / 2) + 1;

    if (MUT === 'maioria') {
      g._fimDaPartida = function fimPorMaioria() {
        return this.roundsWon.E >= this.roundsToWin || this.roundsWon.B >= this.roundsToWin
          || this.roundNum >= this.roundsMax || (this.ctf && this.ctfMatchLeft <= 0);
      };
    }

    expect(g.roundsMax === selected, `${mode}/${selected}: Game publicou roundsMax=${g.roundsMax}`);
    g.roundsWon.E = maioria;
    g.roundsWon.B = 0;
    g.roundNum = selected - 1;
    g.ctfMatchLeft = Infinity;
    expect(!g._fimDaPartida(), `${mode}/${selected}: fechou com ${maioria} vitórias antes de disputar o último round`);
    g.roundNum = selected;
    expect(g._fimDaPartida(), `${mode}/${selected}: não fechou no teto de rounds`);
    rows.push(`${mode.padEnd(10)} selecionado=${selected} maioria=${maioria} disputados=${g.roundsMax}`);
    g.dispose?.();
  }
}

for (const [ctf, expected] of [[false, 5], [true, 3]]) {
  const g = bootGame('praca_poderes', { textures, ctf, seed: 29299 + +ctf });
  expect(g.roundsMax === expected, `${ctf ? 'ctf' : 'mata-mata'} padrão=${g.roundsMax}, esperado=${expected}`);
  g.dispose?.();
}

/* MP: o `roundsMax` passado ao Game do lançamento tem que ceder ao servidor na sessão online. */
{
  let main = readFileSync(new URL('../../public/js/main.js', import.meta.url), 'utf8');
  if (MUT === 'mp-local') main = main.replace(/roundsMax:\s*sessao\s*\?\s*undefined\s*:\s*matchRounds\(\)/, 'roundsMax: matchRounds()');
  const linhas = main.match(/^\s*roundsMax:.*$/gm) || [];
  expect(linhas.length === 1, `main.js: esperado 1 roundsMax no new Game, achei ${linhas.length}`);
  expect(linhas.every((l) => /roundsMax:\s*sessao\s*\?\s*undefined\s*:\s*matchRounds\(\)/.test(l)),
    `main.js: no online o teto de rounds é do servidor, mas o Game recebe o local (${(linhas[0] || '').trim()})`);
  rows.push(`multiplayer       roundsMax ${linhas.length === 1 && /sessao/.test(linhas[0]) ? 'cede ao servidor' : 'LOCAL'}`);
}

console.log('┌─ MATCH-OPTIONS-CHECK');
for (const row of rows) console.log(`│ ${row}`);
console.log('└─');

if (MUT) {
  if (failures.length) {
    console.log(`\n✓ mutante ${MUT}: ${failures.length} cláusulas ficaram VERMELHAS; a régua morde`);
    process.exit(0);
  }
  console.error(`\n✗ mutante ${MUT} passou; a régua não percebeu a opção descartada`);
  process.exit(1);
}

if (failures.length) {
  console.error(`\nVERMELHA (${failures.length}):`);
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}
console.log('\nVERDE — 1–15 (incluindo pares) são rounds disputados nos dois modos; padrões 5/3 preservados.');
