# Tiros nos vãos entre objetos — 11/10/2026

Objetivo: bala e linha de visão precisam seguir a massa visível do mapa. AABB de movimento não deve selar tiro no vazio. Definição de pronto local: `_fireHitscan` e autoridade `_scanHit` acertam alvo em vão real, bloqueiam massa real e têm regressão detectada por mutação. Multiplayer publicado exige pairing cliente/backend e observação numa partida real.

Checkout client: `worktrees/mapas-upa-tiros-grafites-20261011`, frente compartilhada UPA/grafites. Backend separado: `/Volumes/Zenith/Projects/game/corosolto/csbrasil-backend/wt/map-shots-20261011`, branch `codex/mp-map-shot-geometry-20261011`, base d52ff5f (`origin/main`). Sem merge/deploy. Nenhuma alteração em `game.js`.

## Evidência e causa

Sondagem inicial descartada como prova de ausência de bloqueios invisíveis: o predicado não considerava `colorWrite:false`, e a fixture inicial omitira os props globais herdados de `main.js`. Ela também substituía materiais GLB por material uniforme. Essas limitações foram corrigidas; os números iniciais não valem como aprovação de superfície visível. Texturas/alpha pixels e aprovação visual continuam no navegador.

Causa reproduzida: servidor Room usa Game headless sem preload dos props. Browser remove caixas procedurais e usa GLB; servidor continua disparando nos prismas de fallback. Comparação fallback vs GLB: Ferro 392/888, Loja H 105/960, Quebrada 275/888, Lajes 13/936, Córrego 6/936 raios parando mais de 15cm antes da superfície do client. UPA sem divergência nessa amostra. Os controles iniciais de Piscina/Brasília eram incompletos e não foram aceitos como conclusão. Logs auxiliares locais `/tmp/parity-shots-20261011.json` e `/tmp/probe-shots-20261011.log`.

Testemunho Ferro: olho (-30,1.3,-34), direção (1,0,1) normalizada. Caixa fallback a 16.122 m; superfície GLB a 26.306 m; inimigo a 20 m. Room antes: parede, dois checks vermelhos. Depois: personagem, parede real atrás continua bloqueando. `_fireHitscan` client antes/fallback: dano 0, impacto 16.122 m; GLB: dano 1, impacto 19.576 m (face dianteira do alvo). Mutante `caixa-no-vao` recria proxy oculto a 17 m e reprova os dois checks de vão.

Outro defeito em Havan: carros sorteados por navegador e yaw dependente de `Math.random` global (grafite no dedicado pula draws RNG). Autoridade e client viam modelos/rotações diferentes. `Room.mapSeed` fixa catálogo por partida e entra em meta; `main.startGame` o aplica antes do preload. As três rotações de vagas agora usam RNG local derivado do mesmo seed. `havanPropsPool()` fornece pool elegível do próprio mapa para preload/cache server.

## Mudanças e limites

- `prop-geometry-fixture.mjs` passa a importar GLTFLoader do mesmo módulo que `mapprops.js`: evita o patch da fixture interceptar outra cópia em worktrees com `node_modules` compartilhado.
- `shot-occlusion-check.mjs` mede `_fireHitscan` de produção em GLB real, com baseline fallback e mutação.
- Backend `map-prop-geometry.mjs` lê GLB uma vez do filesystem, retira referências de textura sem modificar geometria/semântica de material e registra no mapprops antes de disponibilizar Room. Falha em asset obrigatório impede startup, evitando fallback silencioso.
- Custo inicial full catálogo Havan foi rejeitado: 407 MiB RSS, 107.578.052 bytes GLB. Pool elegível medido com 155 assets / 77.233.532 bytes, ~4.35 s / 299 MiB RSS antes de salas. Evidência local sob concorrência, não performance de produção. Geometria real adiciona custo CPU de raycast e memória; medir nós antes de promover.
- Cliente novo sem `meta.mapSeed` usa seed 1, compatível com autoridade antiga. Autoridade nova com cliente antigo continua com seed aleatório no browser: publicar pareado.

## Reprodução

```sh
PATH=/opt/homebrew/bin:$PATH node tools/eval/shot-occlusion-check.mjs
PATH=/opt/homebrew/bin:$PATH node tools/eval/shot-occlusion-check.mjs --fallback-baseline
PATH=/opt/homebrew/bin:$PATH node tools/eval/shot-occlusion-check.mjs --mutante=caixa-no-vao
# No checkout backend pareado:
PATH=/opt/homebrew/bin:$PATH node game/map-shot-geometry-check.mjs
```

Os modos fallback/mutante devem sair 1; modo normal deve sair 0. Ledger backend guarda medições de cache, rotação, paridade por mapa e próximos passos. Os scripts não substituem validação visual/browser nem uma partida MP humana.

## Casos adicionais e contratos

Havan LOWQ removia carros, quatro carrinhos e metade das pilastras enquanto o servidor construía qualidade média. Baseline antes das duas últimas correções: 12/360 raios divergem mesmo com catálogo/seed iguais. Depois: 0/360, colliders idênticos, usando import independente do módulo após definir `localStorage.quality=low`. Carros, carrinhos e pilastras que bloqueiam balas agora têm presença invariável; detalhes sem colisão conservam corte de qualidade.

Piscina `OCULTO` usa `colorWrite:false, depthWrite:false`, mas `addBox` incluía essas caixas físicas em occluders. A mesma caixa de movimento permanece; apenas o registro de bala exclui o material invisível. GLB visível continua bloqueando. Régua `_fireHitscan` de produção atravessa vão real do armário: origem(-17.3579154234,0.08,-6.8102303271), dir(-.7071067812,0,-.7071067812), alvo4.11002524m. Baseline falhou no registro; mutante reintroduz os mesmos proxies originais e deve falhar no registro e no dano. A régua desliga somente batching de caixas para sondar proxies individuais; paridade backend usa batching padrão. A auditoria posterior do registro real encontrou outros proxies invisíveis por `visible:false`: 5 na Mansão, 15 no Escadão e 10 no Parque. Por isso o filtro deixou de depender apenas do material OCULTO da Piscina.

`COMMON_MAP_PROPS` extrai sem alterar a lista antiga de preload opcional, e `mapview.html` usa a mesma fonte (antes só 17, runtime 23). Brasília agora declara seus 12 GLBs em `BRASILIA_PROPS`/MAPS, corrigindo a ausência no registro. Preload obrigatório online usa exclusivamente `MAPS[currentMap].props`: falha num asset alheio não pode abortar UPA. Asset participante ausente aborta antes de criar Game, com feedback existente e retry; offline conserva fallback. O gate de lançamento continua 10/10 com guardas de corrida antes/depois do await adicional.

Quebrada tinha 3/288 diferenças na grade em x=-9.000000000000002, exatamente tangente ao muro minX=-9. Bounds de cliente/autoridade idênticos; x=-9.001 ambos livres, x=-9 e -8.999 ambos bloqueiam 21.83 m. Régua normaliza coordenadas da grade a 9 casas (perturbação~1e-15m), sem mudar engine ou tolerância de paridade.

Brasília também cortava mobiliário colidente em LOWQ: postes alternados, grades/bins/cones de um lado e três palmeiras. Baseline fresh-process antes do fix: colliders 232 vs 217 e 173/336 raios divergentes; `_fireHitscan` para alvo atrás de lixeira(-7.2,-38) diferia. O fix mantém presença dos objetos físicos em ambas qualidades, preservando redução de capim/folhas. Depois: 232/232 e 0/336, dano/impacto iguais. Mutante retira somente as lixeiras de LOWQ: 48/336 divergências e dano diferente. `shot-brasilia-quality-check.mjs --self-test` só sai 0 quando normal verde e mutante vermelho; comprovado `/tmp/client-shot-brasilia-self-test-final.log`. `shot-map-contract-check.mjs --self-test` também executa normal e mutante do proxy Piscina: `/tmp/client-shot-contract-self-test-final.log`.

Checkpoint cliente final de runtime e gates: `4136baf7d18bdfb2a59d13dcb96d45f33aaa9224`; Docker backend fixado nesse SHA e capacidade dos exports confirmada por `git show` local. Ainda sem push/build Docker/merge/deploy. Inventário final das 18 rotas, fresh med/low: 0/5.184 raios divergentes e colisores idênticos. Paridade Room real dos 12 jogáveis × 2 seeds: 0/6.912 raios divergentes. Registro final sem nós/material invisíveis, colorWrite:false ou opacidade zero. Benchmark headless Ferro foi interrompido sem resultado: host concorrente não terminou nem aquecimento; nenhum número de performance aceito. Promoção requer medir nós em ambiente adequado e partida MP humana.


## Guarda final de superfícies e fechamento

`MAPS.build` envolve os construtores com `withVisibleShotOccluders`, preservando `build.name`. O registro é normalizado de Group para malhas filhas visíveis, deduplicadas; raycast é protegido por ancestor visível e pelo material de `hit.face.materialIndex`, inclusive mudanças após o build. Opacidade deve ser maior que zero. A guarda não modifica colliders, geometria, transformações ou materiais; filtra os hits anexados no próprio array, sem array temporário por occluder. `nonSolidSurface` não foi excluído globalmente porque também marca chão físico de Lajes. `alphaTest` é inventariado, não interpretado sozinho como defeito.

Mansão registrava folhagens GLB como se fossem carros: redução LOWQ produzia 11/288 diferenças, todas contra samambaias/ixoras/helicônias. PB_FOLHAS agora conserva as mesmas instâncias/posições/qualidade visual num grupo decorativo fora da bala, com identidade de folhagem; carros, palmeira imperial e cerâmica permanecem no lote sólido.

Escadão/Parque escondiam proxies ao substituir por GLB, mas também faltava registrar malhas visíveis de casas/atrações/lote estático. Esses registros foram acrescentados, mantendo massa real de bala após remover proxies. Os testemunhos iniciais nesses dois mapas comparavam apenas occluders e foram descartados como prova de vão visual. A busca final mede TODAS as malhas visíveis: Escadão origem (12, 10.1524999833, -30), direção -z, proxy a 1m e próxima massa visível a 80m; Parque quiosque origem (13, .3900000334, 21.8999999762), direção -z, proxy a 1m e superfície real a 62.7706525m. `_fireHitscan` passa a acertar alvo a 3m. Mansão origem (-15.2, 2.4, 28.4400000036), direção -z, proxy a 1.06m e próxima massa a 80m. Massas GLB também bloqueiam alvos atrás; remover só seu registro expõe o alvo, comprovando causalidade.

`shot-visible-surface-check --self-test` executa normal e mutante de proxies originais: normal verde e mutante vermelho. Também mede face invisível diante de alvo, face sólida posterior do mesmo mesh, visibility/opacity dinâmicas, Group deduplicado com vão entre filhos e remoção causal da massa. Replay completo final: `/tmp/client-shot-visible-surface-self-test-with-groups.log`, normal verde e mutante com 4 falhas esperadas. Unidade Group/face/dinâmica: `/tmp/client-shot-surface-unit-group-final.log`, 10 checks verdes. Inventário final aprovado em `/tmp/client-shot-quality-inventory-with-groups.log` e `/tmp/shot-quality-inventory-with-groups-summary.json`. Flags alphaTest presentes em Havan, Posto e Atacadão são inventário; pixels alpha não foram avaliados nesta fixture.

O único raio divergente Escadão em qualidade era tangência: sin(π)=1.22e-16 desviava a direção cardinal na borda x=-10.5. Direção canônica (0,0,-1) mede os mesmos impactos med/low em x=-10.501, -10.5, -10.499: 2.52m, 2.52m, 1.72m; sem alteração no runtime do degrau. Inventário usa zero exato nas componentes cardinais próximas de zero, conservando tolerância 1e-6.

Fechamento local: fonte de runtime e tools congelada no checkpoint cliente acima; backend na branch `codex/mp-map-shot-geometry-20261011`, checkpoint recuperável inicial `89e940359a25990224ad327c3c744d2b8efd36c8`, fechamento pareado `8bead03a08783c7dd0c831c983f3ef07f29e50aa` nesta branch (worktree backend limpa). Logs finais: `/tmp/client-shot-quality-inventory-with-groups.log`, `/tmp/backend-map-shots-all-live-with-groups.log`, `/tmp/backend-map-prop-buffer-check-with-groups.log` (166 templates iguais ao parser independente). Protocolo 23/23 e contrato de Room C1/C2 passaram na fonte final.

Mansão runtime passou com o manifesto original `/Volumes/Zenith/Projects/game/corosolto/csbrasil/progress/archive/docs/maps/MANSAO-RECOVERY-ASSETS.json` exposto por symlink temporário no antigo caminho `docs/maps`; o trap removeu o link. Log `/tmp/client-shot-mansao-runtime-original-manifest.log`. O gate padrão ainda depende da migração desse caminho de docs, sem editar hashes nem aceitar capturas antigas como aprovação da fonte atual. `mapcontrato` anterior começou antes da expansão Group; replay final passou MC1/MC2/MC3 em `/tmp/client-shot-mapcontrato-with-groups.log`, mantendo o teto conhecido de nós ilhados.

Memória: preload final 166 modelos / 80.183.112 bytes GLB. RSS ao fim do sweep de 24 builds foi 699 MiB sem GC forçado, e não comprova steady de duas salas. Sonda separada com GC: startup 321,5 MiB; duas Rooms Ferro + UPA 339,1 MiB; após rotação Ferro → UPA 346,8 MiB, catálogo/bytes constantes. Log `/tmp/backend-map-shots-two-rooms-gc.log`. Custo de memória é material; não há resultado de capacidade/tick de produção. A tentativa de copiar buffers foi rejeitada por aumentar arrayBuffers de 57,4 para 109,6 MB; parser final conserva buffers originais.

Todos os 166 modelos obrigatórios estão tracked no pin cliente e coincidem byte a byte por hash Git com os GLBs usados nas réguas: 80.183.112 bytes, missing/divergent vazios. `/tmp/client-shot-required-assets-tracked-pin.log` e `/tmp/client-shot-required-assets-tracked-pin-summary.json`.

Próximo passo: crítica independente do pairing e medição de memória/tick em nós apropriados antes de promover. Docker só pode buscar esse pin após sua publicação pelo coordenador. Sem build Docker, merge, deploy, pixels alpha ou partida MP humana comprovados nesta frente. Grafites e validação de navegador ficam com o coordenador.
