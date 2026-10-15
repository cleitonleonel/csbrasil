# Contrato de backend da Treta Pop (fase 2)

A interface Treta Pop (`?ui=v3`) desenha XP, quests, passe, party, presença, meta de clã e MVP. Nenhum desses números pode nascer no cliente. Este documento diz, item por item, o que o backend já entrega, o que falta, quem calcula e o que a tela mostra enquanto o dado não existe.

Lido em `corosolto/backend` `origin/main` `7f18ab9` (PR #114) e no cliente da lane (`feat/ui-treta-pop`). As rotas moram em `api/index.ts` (mapa `ROTAS`); as migrations em `db/migrations`, a partir da 037.

## Regras que valem para todos os itens

- **O servidor calcula, o cliente desenha.** XP, progresso de quest, nível do passe, sequência e MVP saem de dado verificado pelo nó (`game/round-telemetry.js`) ou do ledger. O cliente nunca soma localmente nem "adianta" um número.
- **Enquanto o campo não vem, ele não aparece.** A tela esconde o bloco ou mostra um estado vazio desenhado. Nada de número de exemplo.
- **Identidade:** conta pelo cookie `cs_social` via proxy Astro (`src/pages/api/[rota].ts`); convidado por `uid` + `token` (`api/_lib/player-identity.ts`). Todo endpoint novo aceita os dois quando fizer sentido para convidado, como o `api/clans.ts` já faz.
- **Ordem de deploy:** o dono aplica a migration, depois o backend mescla, depois o cliente liga a tela. Toda mudança de recompensa passa por `treta_settle`, que já é a única porta de crédito de T$.
- **Dia do jogo:** hoje o teto diário usa dia UTC (`058_treta_identity_eligibility.sql:90-93`). O reset da loja pedido no redesign é às 21h de Brasília, que é 00h UTC. Os dois relógios batem, e o contrato fixa **UTC 00:00** como virada do dia para tudo.

## 1. XP e nível por partida

**Existe:** pontos de carreira acumulados, sem registro por partida. `points = verified_kills + least(bonus_kills, verified_kills)` na view `player_ranking_totals` (`049_ranking_history.sql:70-107`). Nível `1 + floor(points/100)` e `next_level_points` em `social_profile` (`049:177`), lidos por `GET /api/social?action=profile|state`. As patentes do cliente (`public/js/career-rank.js`) usam a mesma curva.

**Falta:** XP ganho na partida, com o motivo de cada parcela, e a resposta disso no fim da partida.

**Proposta:**
- Tabela `player_match_xp(match_id, player_id, xp, parcelas jsonb, created_at)`, escrita pelo backend quando a rodada verificada fecha. As parcelas são as que o nó já mede: abates verificados, headshots, vitória, tempo ativo.
- `GET /api/social?action=match_xp&match=<id>` → `{ xp, parcelas:[{chave, xp}], nivelAntes, nivelDepois, pontosNoNivel, pontosParaProximo }`.
- O nível continua sendo o de `social_profile`. Uma curva nova muda a view, e o cliente só lê.

**Até lá a tela:** o anel de nível do lobby usa `social_profile.level` e `next_level_points`, que já existem. A barra de XP do resultado fica escondida.

## 2. Quests diárias e semanais

**Existe:** as "quests" são tipos de crédito da campanha `launch-month` (`email`, `referral`, `singleplayer`, `multiplayer`; `054_treta_store.sql:43`), com progresso em `treta_quest_progress` (`056`) e crédito em `treta_settle` (`058:54-103`). Os cards do cliente são fixos (`public/js/treta-store.js:90-110`).

**Falta:** definição de quest com condição, recorte diário e semanal, reroll, primeira vitória do dia em dobro, e vitória como condição (hoje só "concluir" conta).

**Proposta:**
- `quest_def(id, recorte 'diaria'|'semanal', condicao jsonb, alvo int, recompensa_tretas int, recompensa_xp int, ativa)`.
- `player_quest(player_id, quest_id, periodo date, progresso int, concluida_em, rerolada bool)`, com no máximo 3 diárias e 3 semanais por período.
- O progresso sai das rodadas verificadas (`verified_kills`, `result`, mapa, arma quando o nó mandar) no mesmo ponto em que `treta_settle` roda hoje.
- `GET /api/treta` ganha `quests: { diarias:[...], semanais:[...], rerollDisponivel, primeiraVitoria:{feita, multiplicador} }`.
- `POST /api/treta {action:'reroll', questId}`: uma vez por dia, só em quest não concluída.
- "Primeira vitória do dia em dobro" é uma regra de `treta_settle`, não um card. O teto diário de 250 continua valendo, e a regra precisa dizer se o dobro conta para ele (decisão do dono).

**Até lá a tela:** mostra os 4 cards de hoje com o progresso real de `treta_quest_progress`, sem reroll e sem selo semanal.

## 3. Rotação da loja e raridade

**Existe:** `GET /api/treta` com `catalog[]`, carteira, inventário, ledger e quests; `POST` para `purchase`, `equip`, `referral` e `refresh` (`api/treta.ts`). As 12 skins custam 800 (`055`, `057`). Não há raridade nem rotação. Os óculos a 200 existem só no cliente e estão desligados (`public/js/treta-catalog.js:40-47`, `TRETA_ITEMS_ENABLED=false`).

**Falta:** raridade por item, vitrine diária com reset, destaque quinzenal, preço por item e itens além de skin no servidor.

**Proposta:**
- `treta_catalog` ganha `raridade` ('comum'|'incomum'|'raro'|'epico'|'lendario'|'mitico'|'gambiarra') e `slot` ('visual'|'fuzil'|'pistola'|'faca'|'spray'|'fala'|'banner'|'titulo'). O preço já é coluna; ele passa a variar por raridade, com a tabela de preços aprovada pelo dono.
- `treta_vitrine(dia date, item_id, posicao, destaque bool)`, gerada por job à 00:00 UTC. O destaque troca a cada 14 dias.
- `GET /api/treta` ganha `vitrine: { itens:[{id, posicao, destaque}], resetaEm (ISO), destaqueAte (ISO) }`. O timer da tela conta até `resetaEm` e nunca inventa um horário.
- Sem compra de moeda: `topUpsEnabled` continua `false`.

**Até lá a tela:** card sem raridade (ou com a raridade "comum" visual sem o rótulo) e **sem timer**. O armário mostra só o slot "visual", que é o único que o servidor suporta.

## 4. Passe de temporada e sequência de 7 dias

**Existe:** nada. O único recorte é a janela da campanha (`057:24`, 12/10 a 01/11/2026).

**Proposta:**
- `temporada(id, inicio, fim)` e `passe_nivel(temporada_id, nivel 1..20, xp_necessario, recompensa jsonb)`, só trilha gratuita.
- O XP do passe é o mesmo do item 1, somado no período da temporada. "XP turbinado" é um multiplicador por janela, configurado no servidor.
- `player_sequencia(player_id, dias int, ultimo_dia date)`: conta o dia em que houve partida verificada; um dia sem partida zera.
- `GET /api/social?action=passe` → `{ temporada, nivel, xpNoNivel, xpParaProximo, recompensas:[{nivel, item, resgatada}], sequencia:{dias, hojeFeito} }`.

**Até lá a tela:** a aba PASSE não aparece.

## 5. Party, convites e presença

**Existe:**
- Presença de conta com validade de 75 s (`POST /api/social {action:'presence'}`, `040_social_community.sql:139-142`) e presença em partida com validade de 25 s, enviada pelo nó (`api/mp-social-presence.ts`, `041:13-22`).
- `social_profile.presence{online, game{node, code, map, mode}}` só para amigos com `presence_visibility='friends'` (`048:113-116`).
- Convite para sala que já existe: `invite`, `invite_accept`, `invite_decline` e `invite_cancel` (`api/social.ts:117-133`), com validade de 2 min.

**Falta:** party persistente com líder, até 4 membros, prontidão e fila conjunta; um estado "no menu" separado de "em partida"; e convite sem sala aberta.

**Proposta:**
- `party(id, lider, criada_em)` e `party_membro(party_id, player_id, pronto bool, entrou_em)`, com no máximo 4 membros.
- `POST /api/social {action:'party_criar'|'party_convidar'|'party_aceitar'|'party_sair'|'party_pronto'}`.
- `social_state` ganha `party:{ id, lider, membros:[{playerId, nick, pronto, presenca}] }`.
- A presença ganha `estado: 'menu'|'fila'|'partida'`, gravado pelo cliente no heartbeat que já existe; "partida" continua vindo do nó.
- O líder entra no matchmaking; o ticket MP (`api/mp-ticket.ts`) leva a party inteira para o mesmo lado.

**Até lá a tela:** um slot de party (o seu); "+ CONVIDAR" abre o convite de sala que já existe. Amigos online só com `presence.online` verdadeiro e visibilidade de amigos; sem isso, estado vazio.

## 6. Meta semanal do clã

**Existe:** `api/clans.ts` com diretório, membros, criar, entrar por link, sair, novo link e transferir liderança (`060_clans.sql`). A tag vai no ticket MP (`api/mp-ticket.ts:63`).

**Falta:** pontuação e meta semanal, e convite direcionado a um jogador.

**Proposta:**
- `clan_semana(clan_id, semana date, pontos int, meta int)`. Os pontos são a soma do item 1 dos membros na semana (segunda 00:00 UTC). A meta é fixa por tamanho de clã, definida pelo dono.
- O `GET /api/clans?id=` ganha `semana:{pontos, meta, terminaEm}` e `membros[].pontosSemana`.
- O convite direcionado reusa `player_invite` com `kind='clan'`.

**Até lá a tela:** clã com membros e link de convite, sem barra de meta.

## 7. MVP, dano e HS% no fim da partida

**Existe:** o `POST /api/submit-match` só devolve `{ok}` (`api/submit-match.ts:104-106`) e aceita só convidado. O nó verifica, por participante, `verifiedKills/Deaths/Headshots`, `bonusKills`, `activeSpans`, `result` e `characterId` (`game/round-telemetry.js:96-114`). O servidor aplica dano (`game/room.js:365-369`), mas não registra.

**Falta:** dano por jogador, MVP, HS% devolvido, e o resumo de recompensas no fim da partida.

**Proposta:**
- O nó soma `danoCausado` por participante, no mesmo lugar em que conta `verifiedKills`, e grava junto da rodada.
- MVP calculado no backend, por rodada e por partida: maior `verifiedKills` e, no empate, maior dano, depois menos mortes. A regra fica documentada no SQL.
- `GET /api/social?action=match_summary&match=<id>` → `{ jogadores:[{playerId, nick, abates, mortes, hsPct, dano, mvp}], recompensas:{ xp (item 1), tretas, questsConcluidas:[...] } }`.
- O SP continua local. No modo solo o resultado mostra só o que o próprio cliente mediu, sem MVP.

**Até lá a tela:** MP e SP mostram abates, mortes, headshots e tempo, que o cliente já tem. MVP, dano, XP, T$ e quests ficam escondidos.

## O que já está pronto e só precisa ser lido

| Dado | Fonte |
|---|---|
| Nível e pontos até o próximo | `social_profile.level`, `next_level_points` |
| Saldo de T$ e catálogo | `GET /api/treta` |
| Progresso das 4 quests da campanha | `GET /api/treta`, `quests` |
| Recompensas: e-mail 200, convite 100 (até 10), solo 10, MP 25, teto 250/dia, skin 800 | `057:25`, `054`, `055`; espelho em `public/js/treta-catalog.js:27` |
| Amigos e presença online | `social_state.friends[].profile.presence` |
| Clã, membros e link | `GET /api/clans` |

## Achado no caminho

O cliente envia `POST /api/social {action:'profile_view'}` (`public/js/community.js:117`), e essa ação não existe no backend `7f18ab9`. Confira se o PR de visualizações de perfil do backend já entrou antes de contar com esse número.

## Decisões do dono

1. A primeira vitória do dia em dobro conta para o teto diário de 250?
2. Tabela de preço por raridade.
3. A curva de XP continua em 100 por nível?
4. Meta semanal do clã: valor fixo ou proporcional ao número de membros?
