# Clãs v1: continuidade

## Limpeza da fila (13/10/2026)

- Branch atualizada com a main alpha.76 (merge). Social da main preservado: a página
  `/u` é a da main; a tag volta lendo `profile.clan`, que o backend#72 inclui na
  resposta de `social?action=profile` (uma chamada, mesma privacidade social).
- `/api/clans` vai pelo proxy do site com sessão (cookie + origin), como o social;
  saiu da lista de geo. 404 do backend sem a rota vira 503 no rollout.
- Página de clãs pede `me` sem exigir uid+token: conta Auth usa o cookie; convidado
  continua por uid+token. Régua `eval:clans-sessao` (4 mutantes RED).
- Aceite local no Chromium (Playwright, SwiftShader): duas contas Auth criaram clã,
  convidaram, aceitaram, viram `[TAG]` no perfil e no placar de uma partida MP real
  num nó `game/index.js` local. Capturas em
  `private-assets/pr-cleanup-20261013/817/`. Não substitui partida humana em produção.
- Backend pareado: backend#72 precisa de migration 057 e deploy antes deste PR.

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
- Build Astro final passou (7m41s nesta máquina sob carga). API smoke,
  mp-ticket-check e game/security-smoke passaram.
- Crítico independente fechou blockers de JSON-LD/XSS, CSS dinâmico, hidden
  members, saída com contagem antiga e perfil com ranking desligado.
- Check:deploy: 47/48 passaram na rodada completa (609,8s); único vermelho
  foi a lista de rotas do eval:geoproxy. Lista corrigida, rerun verde.
  Rodada final docs:check + arch:check + eval:geoproxy + eval:ssr passou 4/4
  (25,2s). Os 48 gates estão verdes combinando a rodada completa e os reruns;
  não houve uma segunda execução completa de todos os gates.
- Gitleaks nos commits desta branch: nenhum segredo encontrado.
- Browser final sequencial passou com saída 0: cadastro, criação, convite, reload,
  membros, perfil SSR, transferência, saída/encerramento, placar e nome
  adversarial/JSON-LD, em viewport 1536×1024. Listas pública/privada têm 2 membros.
- Load bloqueia controles até completar leituras. Tentativas anteriores tiveram
  timeout de navegação durante build concorrente e clique sem POST de transferência;
  teste passou após aguardar explicitamente load e confirmar resposta da operação.
- Revisor independente não encontrou blockers de produto no último delta.
  Sugestão de Promise.all para tratar também eventual falha do clique foi aplicada
  ao teste após a rodada verde e validada por node --check (Node 23).
- Capturas renovadas com scroll no topo; member/profile inspecionadas sem a
  sobreposição do cabeçalho fixo. Isso não substitui aprovação visual humana.
- O gate funcional usa o
  fallback da página sem WebGL decorativo; artefatos de build ignorados pelo watcher.
  Máquina com load91–351 atrasou Chromium/SwiftShader e a inicialização do Astro.

## Checkpoints

- Cliente: c5dc8fedb (UI/rotas), 13f93a1ac (perfil/placar), 5d7e6576e (índices),
  4ba45f55d (controle de carregamento e checker SSR), 04c1c0f89 (índices finais).
- Backend: 963f52e (migration/API/MP), 0a38a97 (testes locais),
  94b89ff (browser/fallback), c071257 (sincronização e capturas do teste).
- JSON-LD e eval:netcode passaram; checker SSR foi adaptado ao caminho do
  handler em .vc-config.json e ao 404 com corpo da sala de exemplo inexistente.
- Todos na branch feat/clans-v1-20261011; nenhum push/merge/deploy.

## Ambiente e reprodução

Banco local: `csbr-clans-db-20261011`, PostgREST `csbr-clans-rest-20261011`,
rede `csbr-clans-test-20261011`; somente REST exposto em 127.0.0.1:54329.
Fixture `test/clans-bootstrap.sql` + migration 038 + migration 040; NÃO usar
fixture em banco de produção. Tests integration/browser truncam somente o banco dedicado.

Na worktree backend, com Node recente:

```sh
npm run test:clans
npm run test:clans:mp
CLANS_CLIENT_DIR=/Volumes/Zenith/Projects/game/corosolto/csbrasil/worktrees/clans-v1-20261011 npm run test:clans:browser
```

Runtime cria credenciais efêmeras na memória, usa portas livres e verifica a
identidade do serviço antes de writes. Capturas em `artifacts/clans-v1/` no cliente
(ignoradas no Git); painel de convite mascarado. Logs gerais em
`/tmp/csbr-clans-build-final.log`, `/tmp/csbr-clans-final-check.log` e
`/tmp/csbr-clans-deploy-check.log`. Containers dedicados ficaram disponíveis para
reprodução; os processos Astro/backend criados pelo último browser foram encerrados.

Capturas finais (fullPage, viewport 1536×1024), SHA-256:

- guest-3x2.png, 306824 bytes: `a7f14cf2b37d33110b6e2338056268514e85391745fe0f5562d2df78a2544ca8`
- leader-3x2.png, 324653 bytes: `628ffaa3c58324c24f04171b689571faabc1634377ebe2d6c24def5212754cd9`
- member-3x2.png, 343788 bytes: `dfb7789771fc0b6f5fbb3a71f7fbc9364c1e25da4ddf3e400b9dd98be2ab85a3`
- profile-3x2.png, 307491 bytes: `d067cb170f3490d7456097d5ded66891d91c65e6d41902eb431575171db244e0`

## Ocorrência local e limites

Uma tentativa MP/browser encontrou outro backend local na antiga porta fixa 8096.
Duas chamadas register sintéticas ocorreram naquele serviço antes do /api/clans 404;
o browser anterior pode ter criado mais um perfil sintético. Serviço social-community
preservado; não foram apagados perfis sem identificação exata. Testes corrigidos
para portas livres + health/serverSha, reruns no banco dedicado passaram.

## Pendências e próximo passo

Implementação e validação local concluídas, com checkpoints Git recuperáveis.
Próximo passo: revisar os diffs destas branches para release: aplicar 040 antes de publicar API, publicar backend
HTTP e nós MP, então frontend. Merge/migration pública/deploy não autorizados.
A aprovação visual do usuário, navegador com fundo 3D sob carga normal e
uma partida humana real permanecem pendentes.
Ranking de clãs e desafios fora desta v1.

## PRs autorizados e abertos — 12/10/2026

Dono autorizou abrir PRs em todos os chats. Coordenação confirmou checkpoints limpos e publicou client/backend sem migration ou deploy. Frontend draft https://github.com/corosolto/client/pull/817 (base main); backend draft https://github.com/corosolto/backend/pull/72 (base main). Push do frontend passou hooks normais sem bypass; evidência /tmp/csbr-clans-client-pr-push.log. Checkpoints publicados client09871950d e backend6581b70 antes deste registro.

Revisar em conjunto com #807/#70: migration040_clans e040_social_community pertencem a frentes independentes e precisam de sequência/schema conciliados antes do release. Backend deve anteceder client; aprovação visual/partida humana e limpeza identificada dos perfis sintéticos continuam pendentes. Próximo: revisão dos drafts, sem merge, migration produtiva ou deploy nesta autorização.
