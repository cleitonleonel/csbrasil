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
- Fontes e evidências locais: `/tmp/cs-wallpapers-5k/` durante a execução;
  masters persistidos no workspace antes da conclusão.

## Aceitos e rejeitados

- Aceito: uniformizar loading em 16:9 e menu em 3:2, cada lote com contrato próprio.
- Rejeitado: esticar o palhaço, recortar a marca ou inventar personagens por texto.
- Rejeitado: usar o checkout principal antigo como base da implementação.

## Próximo passo

Renderizar referências e sprites do elenco atual, gerar os wallpapers, integrar
rotação e executar validação visual. Nenhum merge ou deploy autorizado.

## Marco técnico validado

- `npm run syntax` passou.
- `tools/eval/media-rotation-check.mjs` passou; a mutação `sem-guardas`
  reprovou a rotação em aba oculta, como esperado.
- Gates existentes de wallpapers, manifesto de mídia e variantes 3:2 passaram.
- `npm run build` passou (log local `/tmp/cs-wallpapers-5k/build.log`).
- Revisão independente preliminar encontrou mudança da largura do header após
  decode. Corrigida mantendo a largura reservada; captura servida ainda pendente.
- As referências são renders sem arma adicional, como o charvideo atual. A ficha
  foi corrigida para não prometer montagem que esse pipeline não produz.

## Bloqueio de geração

OpenRouter retornou HTTP 402: exige saldo mínimo de US$ 1 para saída de imagens.
Nenhum wallpaper novo foi gerado e loading-1 ainda não foi substituído.
Foi enviada ao dono a escolha entre repor saldo e usar a geração integrada do
Codex para este lote. Não mudar o provedor enquanto essa escolha estiver pendente.
Prompts persistidos em `launch-media/2026-10-11-wallpapers/prompts.json` no workspace.
Pipeline retomável: `node tools/gen-roster-wallpapers.mjs` na branch desta frente.
