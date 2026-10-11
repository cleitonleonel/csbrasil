# Retorno da UPA, 11/10/2026

`upa_24h` volta ao menu normal, à rotação e aos catálogos PT/EN. A reestruturação clínica R1 já está integrada na base `261cf59a7` (`v2.1.0-alpha.67`): seis setores, doze acessos internos e 52 coberturas. O retorno aproveita essa geometria e corrige uma fresta enganosa entre os monitores e as macas da emergência.

## Objetivo e fonte

- Branch: `codex/mapas-upa-tiros-grafites-20261011`.
- Fonte final `public/js/map_upa.js`: SHA-256 `e0171dcb1f5f5fc4170b3e0227109ee1f3710bab1e3a4758599ddcdbdeb39768`.
- Escopo desta frente: liberação da UPA, cobertura clínica na emergência, catálogo PT/EN e gates específicos. Commit, browser, bake de grafites, tiros e integração pertencem à frente principal.
- Continuidade geral: `progress` do projeto. O contrato antigo está em `progress/archive/docs/maps/MAPAS-PARADOS.md`; `docs/maps/MAPAS-PARADOS.md` foi migrado e não foi recriado.
- Definição de pronto técnica desta frente: UPA acessível sem oficina, setores/acessos/coberturas preservados, frestas incapazes de prender o corpo eliminadas e regressões reproduzíveis por mutação. A captura e o playtest continuam sendo verificações próprias.

## Alterações aceitas

- Remoção de `upa_24h` de `MAPAS_PARADOS`, preservando o construtor, o id e CTF como modo inicial.
- Devolução da descrição clínica em `src/data/jogo.ts` e da tradução em `src/pages/maps.astro`.
- Monitores das três macas de emergência aproximados das macas. O colisor maior do carrinho agora se sobrepõe à maca em 0,04 m, formando uma cobertura contínua. A malha também encosta no leito, sem um corredor visual vazio entre os dois.
- Identificação dos gabinetes dos monitores na cena para medir seus colisores reais.
- Id da passada de grafite corrigido de `upa_treta` para `upa_24h`, permitindo utilizar o layout assado do id registrado. O bake pertence à frente principal.

## Evidência causal

`upa-structure-check.mjs` mede a cena e os colisores da UPA. UPA1 a UPA5 continuam verdes: zero props comerciais, 6/6 placas, 12/12 passagens, três decisões de rota por quadrante e 52/52 coberturas físicas. UPA6 acrescenta o teste das três frestas entre carrinho e maca: cobertura contínua passa; uma fresta aberta precisa permitir a passagem usando `Game.prototype._collide` com o raio de 0,38 m empregado pelos bots.

O ajuste intermediário do monitor em `mx - 0.75` deixou uma fresta física de 0,06 m e foi rejeitado por UPA6. O ajuste final em `mx - 0.65` produz três sobreposições de 0,04 m e passa. O mutante `monitor-solto` afasta um carrinho e seus colisores em 0,55 m: a fresta real sobe para 0,51 m, o corpo não cabe e somente UPA6 reprova. Os cinco mutantes anteriores continuam derrubando somente suas cláusulas previstas.

`upa-return-check.mjs` ficou vermelho antes da liberação em quatro cláusulas: parada, menu, rotação e abertura por URL/pin. Depois da remoção de `MAPAS_PARADOS`, as cinco cláusulas passam. Seu mutante recoloca a UPA entre os mapas parados e reprova a abertura por URL/pin.

## Verificações

- `node tools/eval/upa-structure-check.mjs`: UPA1 a UPA6 verdes.
- `node tools/eval/upa-structure-check.mjs --self-test`: seis mutantes causais mortos, com as cláusulas exatas previstas.
- `node tools/eval/upa-return-check.mjs` e `--self-test`: cinco cláusulas e a mutação de parada verdes.
- `node tools/eval/mapas-parados-check.mjs`: seis mapas ainda parados, doze jogáveis.
- `node tools/eval/map-rotation-check.mjs`: URL, pin, fila e oficina verdes.
- Replay inicial de `map-check.mjs upa_24h`: MAP1 a MAP6 e CTF1/CTF2 verdes; 149 occluders com malha visível, espaçamento máximo de 6,79 m e duas rotas separadas nas travessias longas. A fonte final deve ser conferida novamente na integração.
- Replay inicial de `map-contrato-check.mjs --json`: UPA com 363/363 nós alcançados, 1.812 arestas e contrato completo.
- Replay de `ctf-win-check.mjs`: as três bandeiras da UPA encerram a rodada na terceira captura.
- Sintaxe dos arquivos JS/gates editados e `git diff --check`: verdes.

As execuções usam Node 23 em `/opt/homebrew/bin/node`. A régua de estrutura desliga a pintura de grafites por `grafiteNoDedicado(true)`, pois mede móveis, acessos e colisão. Os grafites são verificados separadamente no browser pela frente principal.

## Simulação e limites

O diagnóstico inicial de CTF 5×5, 30 s por nove sementes, mediu 6,133% de amostras de travamento. Um probe temporário encontrou 290 amostras no entorno de `(7, 21)`, à frente do primeiro monitor da emergência. A aproximação intermediária dos carrinhos derrubou essa amostra para 1,944%, mas deixou a fresta física e foi rejeitada por UPA6.

As mudanças simultâneas na passada de grafite alteraram o consumo de RNG na montagem da cena: a mesma geometria intermediária mediu depois 2,167%, e o monitor antigo passou a medir 2,789%. Mesmo com o reset do RNG depois da montagem, o elenco e a posição inicial dos bots já podem ter sido sorteados antes dele. Portanto o novo gate baseado apenas no teto amostral de 4% foi descartado: seu mutante não reprovava de forma estável. UPA6 protege a causa geométrica com física de produção e não depende dessa amostra.

Verificação no Chrome local em 1440×960: UPA habilitada no menu normal, selecionada por cartão, confirmada e iniciada em estado `live`, `online=false`. O teste percorreu 6,558 m usando W e disparou a pistola (12→11 munições), com oito combatentes e 158 colisores. Receipt `launch-media/2026-10-11-mapas/review/upa-offline-receipt.json`; entrada, corredor e emergência capturados e inspecionados. A captura final da partida foi inspecionada com pose horizontal, sem alterar a posição do jogador medida no teste. O enquadramento foi ajustado depois da medição do movimento e do disparo.

O modo debug1 dispensa registro da partida e pointer-lock. As sondagens do hub para APIs públicas ainda ocorreram e falharam por CORS no servidor local. Áudio e um GLB privado de faca ausentes geram404 no console; o fallback procedural de faca foi mantido. O receipt não teve exceções de página, mas registra essas falhas de rede e assets. Os gates locais e a partida automatizada não afirmam aceite visual humano, teste16:9 ou partida multiplayer real de duas pessoas.
