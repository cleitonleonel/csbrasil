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
- Diagnóstico anterior por `sharp.metadata()`: loading-1 era 1536×1024; os demais eram
  1672×941. O `contain` de splash/loading expõe laterais no primeiro.
- Wallpapers de menu existentes são 1536×1024 (3:2); conservar essa proporção.
- Referências: GLBs e retratos versionados do elenco, sem buscar rostos externos.
- Geração 2D deste lote: GPT integrado autorizado explicitamente pelo dono em
  11/10/2026, após HTTP 402 do OpenRouter. Sprites: render do GLB real.
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
- Aceitos pelo crítico independente: 19 wallpapers GPT, 1536×1024 (3:2),
  identidade, arma e corpo/marca inteiros nas capturas 3:2 e 5120×2880.
- Primeira Maria Bonita rejeitada por cortar chapéu e marca em 5K; revisão GPT
  recuou o enquadramento e foi aprovada nas capturas atualizadas às 12:50.
- Rejeitada a primeira recomposição do palhaço por tocar a borda com o chapéu;
  segunda versão preserva margem acima dele, aprovada em 1664×936.
- Loading-2..6 normalizados na mesma dimensão 16:9, sem esticar; originais em
  `previous-loading-N.webp` no diretório de masters.
- Loading-1 aprovado: full-bleed em 5120×2880, sem faixas ou estiramento.
- Loading-2..6 aprovados: composição anterior preservada após normalização.
- As capturas do lote são fixtures com CSS/URLs reais; não equivalem à aprovação
  humana do dono. Masters têm 1536×1024; preencher tela 5K não é resolução nativa 5K.

## Próximo passo

Lote visual aceito, pronto para revisão do dono no checkout isolado. Concluir
a captura adicional do menu completo e o checkpoint final. Nenhum merge ou deploy
autorizado; publicação fica fora deste escopo.

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
- `roster-media-check.mjs`: lote completo de 19 personagens, zero falhas;
  mutações `sprite-esticado` e `palhaco-3x2` reprovam os contratos correspondentes.
- Manifesto e variantes 3:2 atualizados: 37 wallpapers + 6 loadings, ambos gates
  passaram. Os novos 19 wallpapers entram pela lista que o runtime busca.
- Navegador no menu real: wallpaper mudou após 22 s; com movimento reduzido
  permaneceu igual após 22 s; nenhum erro de página. Screenshot em
  `evidence/menu-3x2-rotation.png`.
- Cabeçalho Astro servido: sprites completos desktop/mobile, largura reservada
  estável; `prefers-reduced-motion` selecionou `-still.webp`.
- `npm run docs:check` passou após regeneração dos blocos; fonte pública PT/EN
  explica o contrato dos sprites e a rotação.
- Primeiro build Docusaurus PT/EN passou. Artefato preservado fora do Git em
  `launch-media/2026-10-11-wallpapers/docs-build/`, log `evidence/docs-build.log`;
  árvore pública gerada nesta execução foi restaurada. Segundo build PT/EN com a
  documentação dos wallpapers também passou, com saída direta externa;
  `evidence/docs-build-final.log`.
- Build Astro final passou: `evidence/build-final.log`. Após refinar somente a
  imagem de Maria Bonita, gates do lote e das 37 variantes voltaram a passar.
- 38 capturas CSS dos 19 wallpapers em dois formatos e loading-1 em 5K estão
  em `evidence/wallpapers/`; pranchas `wallpapers-3x2-preview.png` e
  `wallpapers-5k-preview.png`. Revisão: `evidence/REVIEW.md`.
- Captura 5120×2880 em `evidence/loading-palhaco-5k-before.png` confirma a faixa
  lateral atual. Isso é diagnóstico, não evidência de correção.

## Provedor e retomada

OpenRouter retornou HTTP 402: exige saldo mínimo de US$ 1 para saída de imagens.
O dono autorizou: “Voce pode gerar os wallpapers via gpt mesmo”. Usar a ferramenta
integrada, uma geração por asset, preservar masters e referências no workspace.
20 masters finais persistidos no workspace. Os prompts efetivos e caminhos de
geração e revisão Maria Bonita estão em `gpt-prompts.json`; `prompts.json` preserva a preparação padrão.
Preparação retomável: `node tools/gen-roster-wallpapers.mjs --prepare-only`.
O comando sem essa flag continua sendo o pipeline OpenRouter original.
