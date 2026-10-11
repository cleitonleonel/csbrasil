# Wallpapers e sprites — continuidade

## Objetivo e pronto

Entregar arte dos políticos e míticos do elenco atual, corrigir o palhaço vermelho
no loading 5K, manter proporções consistentes por superfície e variar a mídia
durante a visita. Validar dimensões, rotação, movimento reduzido e screenshots
em 5120×2880 e 3:2; revisão independente antes de aceitar os assets.

## Estado

- Branch: `codex/wallpapers-roster-5k-20261011`, base `261cf59a7` (alpha.67).
- Worktree: `client/worktrees/wallpapers-roster-5k-20261011`.
- Checkout principal contém mudanças alheias e foi preservado.
- Confirmado por `sharp.metadata()`: loading-1 é 1536×1024; os demais são
  1672×941. O `contain` de splash/loading expõe laterais no primeiro.
- Wallpapers de menu existentes são 1536×1024 (3:2); conservar essa proporção.
- Referências: GLBs e retratos versionados do elenco, sem buscar rostos externos.
- Geração 2D: pipeline OpenRouter do AGENTS.md; sprites: render do GLB real.
- Checkpoint técnico: `7440abebc` (rotação, geradores, fichas e gates).
- Checkpoint dos 19 pares de sprites e procedência: `5655c2e13`.
- Artefatos persistidos em
  `/Volumes/Zenith/Projects/game/corosolto/csbrasil/launch-media/2026-10-11-wallpapers/`:
  `references/`, `sprites/`, `sprites-preview.png`, `prompts.json` e `evidence/`.

## Aceitos e rejeitados

- Aceito: uniformizar loading em 16:9 e menu em 3:2, cada lote com contrato próprio.
- Rejeitado: esticar o palhaço, recortar a marca ou inventar personagens por texto.
- Rejeitado: usar o checkout principal antigo como base da implementação.
- Aceito pelo crítico independente `/root/media_review`: 19 sprites do cabeçalho,
  192×192 com alpha e 24 quadros; todos os quadros foram medidos sem contato com
  a borda. Capturas servidas de Barbudo desktop/mobile e Lobisomem desktop foram
  aprovadas no tamanho real. A apresentação sem arma adicional foi aceita.
- Wallpapers: ainda não gerados nem aprovados.

## Próximo passo

Após resposta sobre o provedor, gerar os 19 wallpapers e a recomposição 16:9 do
palhaço vermelho. Inspecionar e revisar antes de substituir loading-1; normalizar
loading-2..6 em 16:9 exato, regenerar manifestos/variantes de menu e rodar o gate
completo de mídia com mutação `palhaco-3x2`. Capturar o loading corrigido em
5120×2880 e o menu em 3:2; pedir crítica independente do lote. Nenhum merge ou
deploy autorizado. O objetivo completo permanece pendente até esse marco.

## Marco técnico validado

- `npm run syntax` passou.
- `tools/eval/media-rotation-check.mjs` passou; a mutação `sem-guardas`
  reprovou a rotação em aba oculta, como esperado.
- Gates existentes de wallpapers, manifesto de mídia e variantes 3:2 passaram.
- `npm run build` passou (log local `/tmp/cs-wallpapers-5k/build.log`).
- Revisão independente encontrou mudança da largura do header após decode.
  Corrigida mantendo a largura reservada e confirmada em captura servida.
- As referências são renders sem arma adicional, como o charvideo atual. A ficha
  foi corrigida para não prometer montagem que esse pipeline não produz.
- `roster-media-check.mjs --sprites-only`: 19 personagens, zero falhas;
  mutação `sprite-esticado` reprovou. O gate completo continua vermelho de forma
  esperada pelos wallpapers ausentes e loading ainda fora do contrato 16:9.
- Navegador no menu real: wallpaper mudou após 22 s; com movimento reduzido
  permaneceu igual após 22 s; nenhum erro de página. Screenshot em
  `evidence/menu-3x2-rotation.png`.
- Cabeçalho Astro servido: sprites completos desktop/mobile, largura reservada
  estável; `prefers-reduced-motion` selecionou `-still.webp`.
- `npm run docs:check` passou após regeneração dos blocos; fonte pública PT/EN
  explica o contrato dos sprites e a rotação.
- Build Docusaurus público iniciado (`npm run build:site` em `docs/`), ainda em
  compilação no checkpoint de documentação. Sessão local 53367, PID 41580;
  log `/tmp/cs-wallpapers-5k/docs-build.log`. Não declarar esse build aprovado
  sem observar saída 0. A saída gerada de `public/docs/` deve ser preservada fora
  do Git em `launch-media/2026-10-11-wallpapers/docs-build/` após conclusão,
  restaurando somente a árvore gerada desta execução: a instrução global do dono
  veta bulk gerado nos checkpoints. Fonte de documentação fica versionada.
- Captura 5120×2880 em `evidence/loading-palhaco-5k-before.png` confirma a faixa
  lateral atual. Isso é diagnóstico, não evidência de correção.

## Bloqueio de geração

OpenRouter retornou HTTP 402: exige saldo mínimo de US$ 1 para saída de imagens.
Nenhum wallpaper novo foi gerado e loading-1 ainda não foi substituído.
Foi enviada ao dono a escolha entre repor saldo e usar a geração integrada do
Codex para este lote. Não mudar o provedor enquanto essa escolha estiver pendente.
Prompts persistidos em `launch-media/2026-10-11-wallpapers/prompts.json` no workspace.
Pipeline retomável: `node tools/gen-roster-wallpapers.mjs` na branch desta frente.
