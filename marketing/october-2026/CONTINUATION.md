# Conteúdo CORO SOLTO: outubro e comunidade

Objetivo: atrair e trazer de volta jogadores e devs em outubro, mantendo comunidade após 25/10. Entregar kit reutilizável com identidade atual, três apoios do principal V9 (troca de tiros, escolha de personagem, mapas), bastidor dev, convite a testar, legendas por canal, calendário de 15 dias, quatro semanas de comunidade, fila de aprovação, UTMs e welcome compatível com consentimento existente. Apresentação transferida pelo dono para novembro. Não esperar novos trailers.

Definição de pronto: fontes visuais rastreáveis; templates editáveis e exportações olhadas; revisão independente; chamadas apoiadas no produto público/fonte real; fila publicável mediante aprovação. Vídeos dependem da frente mídia. Publicação/envio/compra/merge/deploy seguem fora desta autorização.

Lane: `codex/marketing-october-kit-20261010`, base `261cf59a7bbc0a7e50352a84d6ba5cb8313eec95` (origin/main). Worktree própria (checkout ampliado para os gates locais) em `worktrees/marketing-october-kit`. App create_worktree falhou porque agregador não é Git; criada pelo Git no child client. Somente `marketing/october-2026/` é superfície de escrita. Nenhum arquivo de jogo/social/docs/trailer alterado.

## Fontes e decisões validadas

- Tokens de `public/style.css`: fundo #090704, texto #f0f0ed, acento #b4d92e, âmbar #f3b958, linha #34302b; Bebas Neue, Barlow Condensed e ST Mono; cortes e escala de espaçamento existentes. Conferida captura local social `community-game-ui.png` apenas como referência, sem copiar perfil ou métricas para peças.
- Assets são bytes do commit base, não da primary suja. Previews Amazônia e Velho Oeste conferidos contra SHA-256 de recibos versionados. Velho Oeste da primary diferia do recibo e foi rejeitado. Arte Canarinho tem rótulo explícito de arte; não é captura de combate.
- Correção direta do dono em 11/10/2026: URL pública SEMPRE https://www.corosolto.com.br/. O domínio antigo do código foi rejeitado como referência de divulgação. Todos os CTAs e rodapés, inclusive dev/welcome, usam o domínio do dono; Código permanece acessível pelo menu Sobre o jogo. Fonte da URL centralizada em tokens.json. Leitura de página não prova partida funcional.
- Dados confirmou source/medium/campaign e first-touch por navegador. `utm_content` não é persistido. Campanha distinta por peça. Retorno não reatribui first-touch. Sem métricas públicas autorizadas.
- Welcome: contrato lido em `worktrees/social-community/docs/social/OPERACAO.md`: escolha separada inicialmente desmarcada, confirmação de email, retirada e cancelamento de pendência, SMTP produção pendente. Social dona única do fluxo. Sem coleta/importação/envio pela lane marketing.
- Roteiros aceitos do dono: visita eleitoral à favela e debate online. Propostas anteriores rejeitadas. Produção nas próximas semanas, sem geração paga nesta lane.

## Milestones

1. Fontes extraídas em `assets/` e `SOURCES.json`; fontes TTF derivadas das WOFF2 para exportador local. Nenhuma geração AI ou crédito externo.
2. Template SVG reutilizável e cinco peças em três formatos exportados. Três apoios prioritários olhados: fonte correta, chanfro, logo proporcional, arte/captura identificadas. Corrigidos kicker sobre título e glifo de seta ausente. Ajuste de story/landscape e revisão independente em curso. Exports gerados permanecem fora do Git; template/assets tornam recuperação reproduzível.
3. Calendário de 11 a 25/10 e quatro semanas de comunidade 26/10 a 22/11, copy por canal e fila local de 63 rascunhos preparada. Sem agenda/post criado. Welcome HTML e contrato separados, sem envio.

Checkpoint `fc1f6cad8`: assets e procedência, 15 arquivos/128 linhas, Signed-off-by e Agent: Codex. Ferramentas/cards/textos em preparação para segundo checkpoint. Servidor de revisão somente loopback http://127.0.0.1:4417/ com HTTP200. IAB também timeout na abertura local; controles da fila ainda sem teste visual/interação por browser. Tipografia corpo renderiza o nome interno Barlow Condensed Medium para corresponder ao peso500 da fonte do jogo. Exports e fila regenerados após correção.

## Limitações e próximo passo

IAB público apresentou timeout; nenhuma captura nova/gameplay foi certificada. Previews WebGL históricos rotulados com data, sem afirmar fidelidade à produção atual. Até revisão humana, status é pronto para revisão, não aprovado/publicado. Próximo: concluir revisão independente, validar integridade dos arquivos/UTMs e UI local possível, corrigir achados, checkpoints e draft PR. Metricool encontrado na busca de plugins mas não instalado; permissão global low-risk não prova acesso aos perfis sociais. Sem conexão/OAuth de publicação certificado.

## Correção do domínio e retomada em 11/10

O dono perguntou a origem das imagens e corrigiu a URL. São rascunhos com arte existente de Canarinho e capturas históricas de mapas, não frames novos do trailer. Rerenderizar todos os PNGs/SVGs para www.corosolto.com.br e regenerar legendas/fila. Aprovações anteriores devem ser invalidadas por SHA/URL/baseCaption. Checkpoint assets fc1f6cad8 preservado. Processos/checks anteriores perderam sessão; não presumir gates concluídos. Dados tem ownership do IAB nesta rodada, sem competir por browser. Próximo: gates locais, revisão final da correção de domínio e checkpoint template/fila/draft.

Domínio corrigido e validado em todos os 15 rodapés SVG/PNG e63URLs de fila: www.corosolto.com.br. Utms preservadas inclusive LinkedIn/dev; destino oficial centralizado em tokens.json. PNG prioritário rerenderizado e olhado com domínio correto. eval:mapcontrato MC1/MC2/MC3 passou. Check:deploy em curso, já aponta falha vm-serving-config fora da superfície marketing. Revisão independente clean-context retomada porque agente anterior não sobreviveu à rodada interrompida.

## Validação final local em 11/10

check:deploy passou48/48 em31,7s após corrigir dependências da própria lane. eval:mapcontrato MC1/MC2/MC3 passou. Falha42/48 inicial era ambiental, não um defeito atribuído ao jogo. Fonte/arte/15exports/63URLs/hash e lógica de revisão confirmados independentemente, sem P0/P1/P2/P3 pendente. Revisão em REVIEW.md. A fila invalida aprovação imediatamente ao editar legenda e após regenerar arte/link/copy. Sem IAB/produção/social/email real certificados.

Checkpoints: fc1f6cad8 assets/fontes;7afec811d template/cards/tool;288dc8db2copy/calendar/welcome;0aba3766a fila63;0d7461d70 invalidação/aviso. Exports ignorados,27MB locais regeneráveis. Próximo: registrar review/gates/checkpoint e enviar branch ao fork para PRdraft sem bypass. Somente marketing no diff; status fora da lane limpo depois dos mutantes dos gates.

## Entrega revisável e próxima ação

PR draft #811: https://github.com/corosolto/client/pull/811. Implementação publicada em 6e4714f72; checkpoint do ledger publicado em c57d4033c, confirmado tanto no PR quanto no ref do fork em 11/10. Branch exclusiva no fork rubenmarcus/client. Pre-push completo passou em 38s e novamente em 37s com Node 23. Tentativa anterior com Node 16 foi recusada, sem bypass; runtime explicitado na nova tentativa. Nenhum merge/deploy/publicação/envio/compra. Servidor local reiniciado em 127.0.0.1:4417 e HTTP 200; página/arquivo abertos no Codex com retorno queued, sem afirmar que foram vistos pelo dono.

Fonte complementar da frente dev: /Volumes/Zenith/Projects/game/corosolto/csbrasil/worktrees/dev-community-progress-20261010/reports/growth-devs-2026-10/ATIVACAO.md (checkpoint6870db0, PRdraft810). Próximas pautas: quickstart, Game/arnês/Agent, SIM_HASH. Recortes54/327/296 exigem reconsulta de status/PRs e mantenedor antes de chamada; não anunciar instalação como partida validada. Reusar card04 do kit para esses desdobramentos.

Milestone concluído: template,5peças/15exports,legendas/fila,15dias e4semanas,welcome e revisão independente. Pendente: revisão humana dos rascunhos/URLs e escolha do primeiro lote; vídeos pela mídia; UI no IAB, transporte welcome e plataformas sociais continuam não certificados. Próxima ação concreta: dono revisar três apoios prioritários na fila local e escolher lote/canais. Aprovação de conteúdo não concede merge/deploy/envio; cada publicação precisa do escopo explícito já previsto no plano. Manter worktree e exports locais para correções.

## Snapshot remoto após entrega (11/10/2026)

PR #811 OPEN / DRAFT / BLOCKED no head publicado c57d4033c. Vercel: FAILURE, preview remoto falho/indisponível. Build, classify e DCO ainda em execução na consulta; ratchet, bot-token e verificações de versão já SUCCESS. AutoMergeRequest é null. Estes estados são o snapshot consultado, não previsão do resultado final.

O preview remoto não está verde. Revisão permanece nos arquivos/exportações e fila local, sem aprovação ou publicação inferidas. IAB pertence à mídia nesta rodada. Por direção da coordenação, gates locais já 48/48 não foram repetidos para este registro. Somente este ledger foi alterado e recebe checkpoint local; template/fila/arte permanecem no head publicado. A nota pode subir com a próxima alteração autorizada, mantendo o pre-push obrigatório, sem reexecutá-lo agora.
