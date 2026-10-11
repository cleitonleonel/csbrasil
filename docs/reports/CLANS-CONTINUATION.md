# Clãs v1 — continuidade

## Objetivo e definição de pronto

Criar clã com nome/tag/descrição, compartilhar convite, entrar, sair e transferir
liderança. Um clã por jogador. Página pública com membros e tag no perfil e no
placar SP/MP, vinculada à identidade validada pelo backend. Ranking de clãs e
desafios ficam para uma próxima etapa.

Pronto localmente quando o fluxo browser → API → Postgres → tela passar,
incluindo autenticação, concorrência de associação, liderança e convites revogados;
build e revisão independente precisam passar. Merge, migration e deploy públicos
são uma etapa separada, pendente de autorização.

## Checkouts

- Cliente: `worktrees/clans-v1-20261011`, branch `feat/clans-v1-20261011`,
  base `261cf59a7bbc0a7e50352a84d6ba5cb8313eec95` (alpha.67).
- Backend: `../csbrasil-backend/wt/clans-v1-20261011`, mesma branch,
  base `d52ff5fe6b1d42577ef84f86a14fff40c1043580`.
- Checkouts principais preservados. Alterações em UI/HUD; sem armas, mapas ou áudio.

## Decisões

- UID + token existente autentica; nick continua atributo.
- Convite é uma capacidade de ingresso, compartilhada no fragmento da URL.
  Banco guarda somente hash; líder pode revogar gerando outro link.
- Líder transfere liderança antes de sair; se for o último membro, sair encerra o clã.
- Sem mudança de pontuação individual nem ranking de clãs nesta versão.

## Estado validado (2026-10-11)

- Migration 040 idempotente aplicada duas vezes em Postgres 16 dedicado local.
- 32 verificações API HTTP → PostgREST → Postgres passaram: identidade,
  convite/hash/revogação, unicidade, associação concorrente, transferência,
  saída, ocultação e permissões dos roles anon/authenticated.
- MP local passou API → associação → ticket assinado → WebSocket/snapshots:
  tag, nick canônico, espectador, retorno ao time e restauração do bot.
- Build Astro passou; API smoke, mp-ticket-check e game/security-smoke passaram.
- Crítico independente fechou blockers de JSON-LD/XSS, CSS dinâmico, hidden
  members, saída com contagem antiga e perfil com ranking desligado.
- Em andamento: browser funcional/capturas e check:deploy completo.

## Ambiente e reprodução

Banco local: `csbr-clans-db-20261011`, PostgREST `csbr-clans-rest-20261011`,
rede `csbr-clans-test-20261011`; somente REST exposto em 127.0.0.1:54329.
Fixture `test/clans-bootstrap.sql` + migration 038 + migration 040; NÃO usar
fixture em banco de produção. Tests integration truncam somente o banco dedicado.

Na worktree backend, com Node recente:

```sh
npm run test:clans
npm run test:clans:mp
CLANS_CLIENT_DIR=/Volumes/Zenith/Projects/game/corosolto/csbrasil/worktrees/clans-v1-20261011 npm run test:clans:browser
```

Runtime cria credenciais efêmeras na memória, usa portas livres e verifica a
identidade do serviço antes de writes. Capturas em `artifacts/clans-v1/` no cliente
(ignoradas no Git); painel de convite mascarado. Logs gerais em
`/tmp/csbr-clans-build.log` e `/tmp/csbr-clans-deploy-check.log`.

## Ocorrência local e limites

Uma tentativa MP/browser encontrou outro backend local na antiga porta fixa8096.
Duas chamadas register sintéticas ocorreram naquele serviço antes do /api/clans404;
o browser anterior pode ter criado mais um perfil sintético. Serviço social-community
preservado; não foram apagados perfis sem identificação exata. Testes corrigidos
para portas livres + health/serverSha, reruns no banco dedicado passaram.

## Pendências e próximo passo

Concluir browser/capturas/check:deploy e registrar SHAs do checkpoint.
Depois revisar diff para release: aplicar040 antes de publicar API, publicar backend
HTTP e nós MP, então frontend. Merge/migration pública/deploy não autorizados.
A aprovação visual do usuário e uma partida humana real permanecem pendentes.
Ranking de clãs e desafios fora desta v1.
