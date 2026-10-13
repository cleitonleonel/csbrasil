/* pos-cena-check.mjs — o pós-processamento solta a cena quando a partida morre?
 *
 * `enableLightBloom` cria um EffectComposer por cena e o guarda num Map. Sem liberação,
 * cada partida (e cada fundo de menu) deixava a cena inteira e os render targets de tela
 * cheia presos para sempre. Medido no navegador (swiftshader, 1536×1024, piscina_treta):
 * `renderer.info.memory.textures` no menu subia ~47 por ciclo sair→jogar e o heap ~5 MB.
 *
 *   PC1  depois de `Game.dispose()`, todo render target que o pós usou na cena da partida
 *        recebeu `dispose`;
 *   PC2  e o pós não conhece mais a cena (`alvoDoPos` devolve null);
 *   PC3  o REINICIAR descarta a partida e aguarda o preload com `game` ainda apontando para
 *        ela, então o loop continua desenhando a cena morta: o pós não pode adotá-la de novo.
 *
 * Mutações (sai 1 se a mutação PASSAR):
 *   --mutante=sem-chamada   remonta `Game.prototype.dispose` sem a linha que libera o pós
 *   --mutante=libera-vazio  troca a liberação instalada pelo bloom por uma função vazia
 *
 *   node tools/eval/pos-cena-check.mjs
 */
import { renderer, bootGame, initTextures, Game } from './harness.mjs';
import { enableLightBloom, alvoDoPos } from '../../public/js/bloom.js';

const MUTANTE = (process.argv.find((a) => a.startsWith('--mutante=')) || '').split('=')[1] || '';
if (!['', 'sem-chamada', 'libera-vazio'].includes(MUTANTE)) {
  console.error(`mutante desconhecido: ${MUTANTE}`);
  process.exit(1);
}

enableLightBloom(renderer, { quality: 'med' });
if (MUTANTE === 'libera-vazio') renderer.liberaPosDaCena = () => {};
if (MUTANTE === 'sem-chamada') {
  const fonte = Game.prototype.dispose.toString();
  const mutada = fonte.replace(/^.*liberaPosDaCena.*$/m, '');
  if (mutada === fonte) { console.error('MUTANTE NAO APLICOU: sem-chamada'); process.exit(1); }
  Game.prototype.dispose = new Function(`return ({ ${mutada} }).dispose;`)();
}

const usados = new Set();
renderer.setRenderTarget = (rt) => { if (rt) usados.add(rt); };

const g = bootGame('praca_poderes', { textures: initTextures() });
usados.clear();
renderer.render(g.scene, g.camera);
const vivos = new Set(usados);
for (const rt of usados) rt.addEventListener('dispose', () => vivos.delete(rt));
const nUsados = usados.size;
const antes = alvoDoPos(g.scene);
g.dispose();
const depois = alvoDoPos(g.scene);
renderer.render(g.scene, g.camera);
const readotada = alvoDoPos(g.scene);

const res = [
  ['PC1', 'render targets do pós liberados no dispose da partida',
    nUsados > 0 && vivos.size === 0, `${nUsados - vivos.size}/${nUsados} liberados`],
  ['PC2', 'o pós esquece a cena da partida descartada',
    !!antes && depois === null, `antes=${JSON.stringify(antes)} depois=${JSON.stringify(depois)}`],
  ['PC3', 'desenhar a cena descartada não recria o composer',
    readotada === null, `depois de desenhar=${JSON.stringify(readotada)}`],
];
for (const [id, desc, ok, evid] of res) console.log(`${ok ? '✓' : '✗'} ${id}  ${desc} — ${evid}`);
const falhou = res.some(([, , ok]) => !ok);
if (MUTANTE) {
  console.log(falhou ? `✓ mutante ${MUTANTE} ficou vermelho` : `✗ mutante ${MUTANTE} PASSOU — régua cega`);
  process.exit(falhou ? 0 : 1);
}
process.exit(falhou ? 1 : 0);
