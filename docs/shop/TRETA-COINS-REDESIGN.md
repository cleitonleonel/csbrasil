# Moedas TRETA$: redesign após rejeição do dono

Em 11/10/2026, o dono rejeitou o design das sete moedas portrait-v2. A aprovação
técnica/visual anterior não representa aceite do dono. Os arquivos públicos v2
continuam preservados, mas não são a direção aprovada para produção.

## Escopo deste checkpoint

Um protótipo Saci/1, com rosto integrado em baixo-relevo e valor/T$ no reverso.
Fonte do retrato: `references/treta-coins/saci.webp`, avatar do próprio jogo;
SHA256 `e043898e7446a78fc321f5e2a2d62a76bfc01be26a60bffa9c650afa3aa726a6`.
O primeiro protótipo foi reprovado pelo crítico por expressão fraca, contorno
serrilhado, campo cobre e T$ pequeno; está preservado em `rejected-first-direction`.

O segundo estudo recupera a expressão do avatar, suaviza a transição para o
campo, usa tons de ouro próximos e amplia a tipografia do reverso. Ainda não
foi aceito pelo dono nem replicado nos outros seis personagens. A nova revisão
independente aprovou somente a direção deste Saci/1: expressão/identidade,
cunhagem/material e valor/T$ legíveis nos ícones observados.

## Artefatos e reprodução

Diretório persistente privado:
`/Volumes/Zenith/Projects/game/corosolto/csbrasil/private-assets/treta-store/coins/minted-v3`.

- `coin-1.blend`, `coin-1.glb`, `coin-1.json`, `saci-gold-die.png`.
- `saci-front.png`, `saci-back.png`, `saci-angle.png`, `prototype-board.png`.
- `runtime-front.png`, `runtime-back.png`, `runtime-reveal-peak.png` e `browser-report.json`.
- `design-review.md`: parecer independente do estudo atual.
- `preview.html`, `preview-server.py`, `browser-check.cjs`: comparação local reproduzível.

Gerador canônico: `tools/blender/prototype_treta_minted_coin.py`; executar no
Blender headless com `--root` desta lane e `--output` para o diretório privado.
Não modifica a cena Blender aberta nem substitui os modelos públicos.

GLB: 1.893.216 bytes; SHA256
`8b618c8a57f22f4c7e179d140f10a917ba5d482aa5727f5cdc64515318ea0133`;
77.888 triângulos, três materiais, uma textura embutida, CoinSpin/PurchaseReveal.
Esta geometria é de estudo: requer simplificação/bake antes de produzir o lote.

## Evidência e limites

TretaStage real em página isolada, captura 1200×800 (3:2): sete estágios, incluindo
comparação justa dos modelos v2 e protótipo em 64/82 px e recompensa simulada.
Sem erros de página. AnimationMixer alterou rotação no giro e escala no reveal;
captura no pico do reveal preserva a moeda inteira nos ícones. O crítico mediu
aproximadamente 1 px de margem direita no ícone de 82 px: aumentar a folga antes
de produção e conferir o ciclo completo. A exposição das
moedas e enquadramento foram ajustados; o caminho de skins mantém seus valores.
Sintaxe Python/ES module, ficha e `git diff --check` passaram.

Isso não verifica partida real, compra/saldo, integração da loja nem desempenho
em celular. Não houve nova geração paga, alteração da outra lane, merge ou deploy.
Próximo passo: considerar o feedback visual do dono sobre esta prévia; ampliar
a folga do reveal e otimizar/bake, antes de repetir a direção nas sete. Não
confundir o parecer favorável do protótipo com aprovação do lote/publicação.
