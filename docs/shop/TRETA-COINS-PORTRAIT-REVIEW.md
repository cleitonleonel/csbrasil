# Revisão independente das moedas portrait-v2

Data: 2026-10-11. Revisão somente leitura dos assets e da lane; este relatório privado é a única gravação. Sem interação com Blender aberto, UI ou Mint.

Contrato usado: pedido atualizado do dono, seção 6 de `plans/TRETA-COINS-SKINS.md` e `.claude/skills/asset-review/SKILL.md` da lane `worktrees/treta-skin-store`. Referências: sete WebPs e `references/treta-coins/FONTE.md`. Os vetos editoriais foram interpretados conforme a ficha atual, que substitui explicitamente o antigo veto a figuras públicas; estas moedas não acrescentam retratos contemporâneos.

## Veredito por moeda

Os vereditos abaixo cobrem a composição e legibilidade nas capturas entregues. Não constituem aprovação do catálogo em produção.

| Valor/personagem | Frente | Verso | Conferência concreta |
|---|---|---|---|
| 1/Saci | APROVADO | APROVADO | Gorro longo com dobra/aba, orelhas pontudas e rosto sorrindo reconhecíveis. Sem corpo, arma ou denominação no anverso. Verso 1 e T$ orientados corretamente. |
| 5/Curupira | APROVADO | APROVADO | Cabelo em chamas/pontas ocupa a parte superior e o sorriso largo permanece. Recorte termina na cabeça. Verso 5 e T$ correto. |
| 10/Caipora | APROVADO após correção | APROVADO | Cabelo, rosto e máscara ocular preservam identificação; captura final tem queixo completo e não tem pescoço residual. Verso 10 e T$ correto. |
| 50/Lobisomem | APROVADO | APROVADO | Orelhas, focinho e mandíbula aberta com presas identificam o lobisomem. Sem tronco. Verso 50 e T$ correto. |
| 100/Gotinha | APROVADO | APROVADO | Cabeça arredondada, chapéu com ponta e sorriso preservam a silhueta da referência. Olhos têm contraste mais baixo do que a referência, mas a identidade permanece pela combinação da cabeça/chapéu/boca. Verso 100 e T$ correto. |
| 200/Canarinho | APROVADO | APROVADO | Crista triangular, bico e olhos inclinados mantêm a identidade de ave da referência. Verso 200 e T$ correto. |
| 1000/Zumbi | APROVADO | APROVADO | Faixa horizontal, cabelo curto, orelhas e expressão séria preservados. Sem peito ou roupa. Verso 1000 e T$ correto. |

### Divergência corrigida e resultados rejeitados

Em `public/img/treta/coin-10.png`, 512 × 512 px, a região aproximadamente x=199–296, y=357–409 contém uma extensão de pescoço em forma de bloco/trapézio sob o queixo, distinguível da mandíbula pelo degrau de contorno e pela superfície exposta. A ficha pede somente rosto/cabeça e recorte abaixo da cabeça. Não há torso ou arma; a reprovação é especificamente pelo pescoço residual.

Primeira correção rejeitada: uma bisecção horizontal aproximadamente em y=358 retirou o pescoço, porém também removeu a ponta do queixo e nivelou a base do cabelo. A região citada acima era uma área de inspeção, não uma linha indicada para bisecção.

Correção final aceita: remoção regional central abaixo da mandíbula, aproximadamente y=387 na captura original. A nova `coin-10.png` mantém a ponta do queixo perto de y=385, deixa o cabelo chegar mais baixo nas laterais e não contém o antigo bloco de pescoço. A captura frontal original de 512 px e `coin-10-motion-sheet.png` foram examinadas depois desta correção. Não resta divergência visual bloqueadora nesse item.

## Material, borda e enquadramento

As sete capturas frontais de 512 px mantêm disco e retrato dentro do quadro, sem corte externo. A moeda ocupa aproximadamente x/y=38–474, deixando cerca de 38 px de margem. Ouro com reflexos e anel exterior em todas; estrias confirmadas no perfil do Saci em `motion/CoinSpin-031.png` e nos oblíquos da folha de giro. Na leitura estrutural, todos os GLBs têm três primitivas/materiais, sem imagens/texturas externas nem skins. Ouro usa metallic=1 por padrão glTF, relevo e ouro interno metallic=0,92; roughness de 0,26 a 0,35.

Os GLBs pesam 302.076–486.656 bytes; triângulos entre 10.994 (Saci) e 17.502 (Canarinho), vértices entre 7.101 e 11.678. Isto confirma assets reais e compactos, sem provar orçamento da cena ou desempenho do runtime. Não foi realizado teste no engine.

## Animações: conferência e limite exato

| Asset/animação | Veredito | Evidência e limite |
|---|---|---|
| 1/Saci: CoinSpin e PurchaseReveal | APROVADOS nas amostras | Gorro inteiro; verso 1/T$ correto; perfil estriado e retorno à frente coerentes. |
| 5/Curupira: CoinSpin e PurchaseReveal | APROVADOS nas amostras | Cabelo inteiro; verso 5/T$ correto; perfil e retorno coerentes. |
| 10/Caipora: CoinSpin e PurchaseReveal | APROVADOS nas amostras finais | Queixo e cabelo preservados; ausência do pescoço; verso 10/T$ correto. |
| 50/Lobisomem: CoinSpin e PurchaseReveal | APROVADOS nas amostras | Orelhas, focinho e presas inteiros; verso 50/T$ correto. |
| 100/Gotinha: CoinSpin e PurchaseReveal | APROVADOS nas amostras | Chapéu/cabeça/sorriso inteiros; verso 100/T$ correto. |
| 200/Canarinho: CoinSpin e PurchaseReveal | APROVADOS nas amostras | Crista e bico inteiros; verso 200/T$ correto. |
| 1000/Zumbi: CoinSpin e PurchaseReveal | APROVADOS nas amostras | Faixa e cabeça inteiras; verso 1000/T$ correto. |

Exame final: 70 frames únicos, dez por moeda nas sete `coin-<valor>-motion-sheet.png`: CoinSpin 001/031/061/091/121 (5 de 121 exportados) e PurchaseReveal 001/010/020/032/060 (5 de 60). São 320 px por célula na folha, com originais de 512 px disponíveis. Todos os discos permanecem inteiros, com versos legíveis na face voltada à câmera. Nenhum valor espelhado nas amostras. Em todas as moedas o overshoot 020 chega perto do topo sem corte; 032/060 já estão assentados. Spin 001/121 concorda visualmente. Além dessas 70 amostras finais, foram vistos quatro oblíquos adicionais do Saci na folha inicial (016/046/076/106).

Todos os GLBs lidos exportam `CoinSpin` com 121 amostras entre 0,0333 e 4,0333 s e `PurchaseReveal` com 60 amostras entre 0,0333 e 2 s, duas trilhas neste último. Comparação binária dos buffers de tempo e transformação: CoinSpin SHA256 prefixo `c81ab975f179d368` e PurchaseReveal `477ad45951613db8`, iguais nas sete moedas. A igualdade dos movimentos é comprovada. O construtor está regenerando o lote final; as métricas estruturais acima documentam os arquivos lidos durante a revisão, e a equivalência/hash final após regeneração pertence à verificação de integração do responsável.

Inspeção visual: quatro folhas iniciais e sete folhas finais por moeda; sete capturas frontais originais 512 px, incluindo as duas recapturas da Caipora; versos originais 10/100/1000 em 512 px e demais versos na folha de contato; perfil 031 do Saci e reveal 020 de Saci/Curupira/Lobisomem/Gotinha em 512 px. As outras amostras foram examinadas nas folhas a 320 px por célula. Não há exame contínuo de todos os frames, runtime Three.js, viewport 3:2 da loja nem reconhecimento em dispositivo real. A validação estrutural foi leitura de GLB, sem alterar fontes `.blend`.

Conclusão: as sete composições finais e as duas animações de cada moeda passam na evidência visual amostrada. O aceite da Caipora depende da versão corrigida; as duas versões anteriores ficam rejeitadas conforme descrito. O relatório não afirma ausência de flicker entre os frames observados nem aprovação do runtime/mobile/catálogo.

## Identificação das capturas finais examinadas

| Captura | SHA256 |
|---|---|
| coin-1-motion-sheet.png | 0efa10495a6c5fca8051ac9a62d12655df902d57292a650a0e5eab18b6e14e95 |
| coin-5-motion-sheet.png | 408ba44cd8d2ee1c88bde8ebbd7f6fb296b2f776fd174c8efb5d4cfec8f838bf |
| coin-10-motion-sheet.png | 55f2f433bccb887670ac06648140ad37d88aeb83e52ba4855ec3dba787caeec9 |
| coin-50-motion-sheet.png | 96de23c1b9bce7669adc7c89504f215b950ac83a42489d2cdc72d26ed3911727 |
| coin-100-motion-sheet.png | 11490190c1546e91d6cdf6f7d7ae9dcf9882116adf67b386ec6bee8f041abd86 |
| coin-200-motion-sheet.png | b8890044c6c3d7b7e8f840094a236bc75ac3c253b5c8f51276e012cb483449ac |
| coin-1000-motion-sheet.png | 7e2f32bd29d9393a288853d88d7f1d26008d1fb4461f383ede3bbb7d00e6f99a |
| coin-10.png | 48a9c01c88e125f30bfe9a78721b4e0afd4b11a63d06be1e31b656db788fc28f |

## Verificação final do responsável após regeneração

Lote final reprodutível: sete GLBs, 103.199 triângulos e 2.832.208 bytes somados. Redução de 68,7% de triângulos sobre os 330.089 anteriores. Todos têm três meshes/materials; SHA256 de cada GLB confere com coin-<valor>.json e manifest.json privados. O loader Three.js vendorizado parseou 7/7; AnimationMixer comprovou rotação e escala reais, CoinSpin 4,03 s e PurchaseReveal 2 s. O teste de mutações detectou 3/3 falhas (raiz diminuta, giro congelado, reveal ausente). Builder passou py_compile; ficha passou tools/spec.mjs check.

Fontes: private-assets/treta-store/coins/portrait-v2/coin-<valor>.blend. Galerias finais front-contact-sheet.png e back-contact-sheet.png nesse mesmo diretório privado. Sete folhas de dez frames e originais documentados acima preservados. Sem nova geração paga ou alteração da cena Blender aberta. Checks finais: /tmp/treta-portrait-v2-final-engine.log e /tmp/treta-portrait-v2-final.log. Evidência não inclui benchmark mobile, partida real, integração na outra lane UI ou deploy.

Fontes/ficha/proveniência registradas em 507864bc1; sete GLBs e sete posters frontais em 4acce51a4, branch codex/treta-skin-store-20261011. Os mesmos paths públicos continuam válidos para o consumidor. Versões anteriores permanecem preservadas fora do Git.
