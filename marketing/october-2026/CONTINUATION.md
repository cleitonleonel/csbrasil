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
