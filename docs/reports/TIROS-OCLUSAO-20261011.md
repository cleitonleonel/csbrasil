# Tiros nos vãos entre objetos — 11/10/2026

Objetivo: bala e linha de visão precisam seguir a massa visível do mapa. AABB de movimento não deve selar tiro no vazio. Definição de pronto local: `_fireHitscan` e autoridade `_scanHit` acertam alvo em vão real, bloqueiam massa real e têm regressão detectada por mutação. Multiplayer publicado exige pairing cliente/backend e observação numa partida real.

Checkout client: `worktrees/mapas-upa-tiros-grafites-20261011`, frente compartilhada UPA/grafites. Backend separado: `/Volumes/Zenith/Projects/game/corosolto/csbrasil-backend/wt/map-shots-20261011`, branch `codex/mp-map-shot-geometry-20261011`, base d52ff5f (`origin/main`). Sem merge/deploy. Nenhuma alteração em `game.js`.

## Evidência e causa

Sondagem inicial descartada como prova de ausência de bloqueios invisíveis: o predicado não considerava `colorWrite:false`, e a fixture inicial omitira os props globais herdados de `main.js`. Ela também substituía materiais GLB por material uniforme. Essas limitações foram corrigidas; os números iniciais não valem como aprovação de superfície visível. Texturas/alpha pixels e aprovação visual continuam no navegador.

Causa reproduzida: servidor Room usa Game headless sem preload dos props. Browser remove caixas procedurais e usa GLB; servidor continua disparando nos prismas de fallback. Comparação fallback vs GLB: Ferro 392/888, Loja H 105/960, Quebrada 275/888, Lajes 13/936, Córrego 6/936 raios parando mais de 15cm antes da superfície do client. UPA sem divergência nessa amostra. Os controles iniciais de Piscina/Brasília eram incompletos e não foram aceitos como conclusão. Logs auxiliares locais `/tmp/parity-shots-20261011.json` e `/tmp/probe-shots-20261011.log`.

Testemunho Ferro: olho (-30,1.3,-34), direção (1,0,1) normalizada. Caixa fallback a16.122m; superfície GLB a26.306m; inimigo a20m. Room antes: parede, dois checks vermelhos. Depois: personagem, parede real atrás continua bloqueando. `_fireHitscan` client antes/fallback: dano0, impacto16.122m; GLB: dano1, impacto19.576m (face dianteira do alvo). Mutante `caixa-no-vao` recria proxy oculto a17m e reprova os dois checks de vão.

Outro defeito em Havan: carros sorteados por navegador e yaw dependente de `Math.random` global (grafite no dedicado pula draws RNG). Autoridade e client viam modelos/rotações diferentes. `Room.mapSeed` fixa catálogo por partida e entra em meta; `main.startGame` o aplica antes do preload. As três rotações de vagas agora usam RNG local derivado do mesmo seed. `havanPropsPool()` fornece pool elegível do próprio mapa para preload/cache server.

## Mudanças e limites

- `prop-geometry-fixture.mjs` passa a importar GLTFLoader do mesmo módulo que `mapprops.js`: evita o patch da fixture interceptar outra cópia em worktrees com `node_modules` compartilhado.
- `shot-occlusion-check.mjs` mede `_fireHitscan` de produção em GLB real, com baseline fallback e mutação.
- Backend `map-prop-geometry.mjs` lê GLB uma vez do filesystem, retira referências de textura sem modificar geometria/semântica de material e registra no mapprops antes de disponibilizar Room. Falha em asset obrigatório impede startup, evitando fallback silencioso.
- Custo inicial full catálogo Havan foi rejeitado: 407MiB RSS, 107578052bytes GLB. Pool elegível medido com155assets/77233532bytes, ~4.35s/299MiB RSS antes de salas. Evidência local sob concorrência, não performance de produção. Geometria real adiciona custo CPU de raycast e memória; medir nós antes de promover.
- Cliente novo sem `meta.mapSeed` usa seed1, compatível com autoridade antiga. Autoridade nova com cliente antigo continua com seed aleatório no browser: publicar pareado.

## Reprodução

```sh
PATH=/opt/homebrew/bin:$PATH node tools/eval/shot-occlusion-check.mjs
PATH=/opt/homebrew/bin:$PATH node tools/eval/shot-occlusion-check.mjs --fallback-baseline
PATH=/opt/homebrew/bin:$PATH node tools/eval/shot-occlusion-check.mjs --mutante=caixa-no-vao
# No checkout backend pareado:
PATH=/opt/homebrew/bin:$PATH node game/map-shot-geometry-check.mjs
```

Os modos fallback/mutante devem sair1; modo normal deve sair0. Ledger backend guarda medições de cache, rotação, paridade por mapa e próximos passos. Os scripts não substituem validação visual/browser nem uma partida MP humana.

## Casos adicionais e contratos

Havan LOWQ removia carros, quatro carrinhos e metade das pilastras enquanto o servidor construía qualidade média. Baseline antes das duas últimas correções: 12/360 raios divergem mesmo com catálogo/seed iguais. Depois: 0/360, colliders idênticos, usando import independente do módulo após definir `localStorage.quality=low`. Carros, carrinhos e pilastras que bloqueiam balas agora têm presença invariável; detalhes sem colisão conservam corte de qualidade.

Piscina `OCULTO` usa `colorWrite:false, depthWrite:false`, mas `addBox` incluía essas caixas físicas em occluders. A mesma caixa de movimento permanece; apenas o registro de bala exclui o material invisível. GLB visível continua bloqueando. Régua `_fireHitscan` de produção atravessa vão real do armário: origem(-17.3579154234,0.08,-6.8102303271), dir(-.7071067812,0,-.7071067812), alvo4.11002524m. Baseline falhou no registro; mutante reintroduz os mesmos proxies originais e deve falhar no registro e no dano. A régua desliga somente batching de caixas para sondar proxies individuais; paridade backend usa batching padrão. Busca `colorWrite:false` nos demais `map_*.js` não encontrou outro proxy de bala equivalente.

`COMMON_MAP_PROPS` extrai sem alterar a lista antiga de preload opcional, e `mapview.html` usa a mesma fonte (antes só17, runtime23). Brasília agora declara seus12 GLBs em `BRASILIA_PROPS`/MAPS, corrigindo a ausência no registro. Preload obrigatório online usa exclusivamente `MAPS[currentMap].props`: falha num asset alheio não pode abortar UPA. Asset participante ausente aborta antes de criar Game, com feedback existente e retry; offline conserva fallback. O gate de lançamento continua10/10 com guardas de corrida antes/depois do await adicional.

Quebrada tinha3/288 diferenças na grade em x=-9.000000000000002, exatamente tangente ao muro minX=-9. Bounds de cliente/autoridade idênticos; x=-9.001 ambos livres, x=-9 e -8.999 ambos bloqueiam21.83m. Régua normaliza coordenadas da grade a9casas (perturbação~1e-15m), sem mudar engine ou tolerância de paridade.

Estado: fontes cliente em fechamento com root; pin Docker backend ainda aguarda hash concreto do checkpoint cliente. Sem merge/deploy. Próximo passo: checkpoint pareado, paridade todos mapas jogáveis/múltiplos seeds, bench headless com GLB, crítica final.
