# Loja TRETA$ e skins: continuidade

## Objetivo e definição de pronto

Entregar loja dentro do jogo, imediatamente depois de JOGAR, com direção visual de shooter estilizado semelhante à referência Fortnite, moeda TRETA$ (T$), carteira/inventário autoritativos, compras de T$ 800 por skin, login social/email e dois modais de entrada. Campanha de primeiro mês configurável: email verificado, indicação convertida em partida e conclusão de single player/multiplayer. Criar no Mint e finalizar no Blender Lula do Drip, Bolsonaro do Drip, Senador do Drip/Zero Um, Janja e Michelle Bolsonaro; preparar expansão Daniel Vorcaro e Donald Trump. Criar sete moedas douradas 3D animadas (1/Saci, 5/Curupira, 10/Caipora, 50/Lobisomem, 100/Zé Gotinha, 200/Canarinho Pistola, 1000/Zumbi dos Palmares), cada uma com personagem e arma em relevo, e animação na compra. Preparar roteiro/captura para vídeos de skins e da loja. Pronto exige assets reais revistos, equipamento jogável, validação de transações/replay/concorrência/abuso e capturas desktop/mobile. Implementação local não equivale a publicação.

## Decisões

- Pedido atual do dono autoriza as figuras públicas e a venda cosmética em T$, substituindo a orientação editorial antiga para esta lane. Não atribuir crimes às figuras na descrição comercial.
- T$ 800 é preço da skin dentro do jogo, não orçamento de geração Mint.
- Valores propostos, aguardando preferência opcional: email 200 (uma vez), indicação 100 após primeira partida válida, SP 10, MP 25; limite diário e janela de 30 dias configurada explicitamente no rollout.
- Nenhuma alteração de saldo/inventário aceita do navegador. Partidas remuneradas precisam de evidência do nó autoritativo; o SP offline atual não possui essa evidência.
- Sem pagamento em dinheiro real solicitado/configurado; skins usam T$ adquirido por atividade.

## Checkpoint 2026-10-11

- Client isolado: `worktrees/treta-skin-store`, branch `codex/treta-skin-store-20261011`, base main `261cf59a7` alpha.67, avançada por fast-forward até comunidade `34edf6558`. Dependência do PR social #807 preservada; sem merge público.
- Backend isolado: `csbrasil-backend/wt/treta-skin-store`, mesma branch, base social `9c88c25` (dependência #70). Primary sujos preservados.
- Mint MCP da configuração local respondeu 401 `missing_bearer`; catálogo de plugins não retornou integração. Chrome tem sessão Mint autenticada, verificada na página de assets; caminho UI disponível.
- Blender instalado em `/Applications/Blender.app/Contents/MacOS/Blender`; serviço MCP 9876 sem listener. Usar processo headless isolado sem tocar a cena aberta.
- Supabase social local está em Docker, independente de produção. Nenhuma migration remota/deploy/merge autorizado por esta solicitação.

## Estado atual e próximo passo

Implementação client em `f3cb79f2d`; backend em `48d2e35` (economia `5a790de`/`bd5df0e`). Sete moedas corrigidas e aprovadas na vista frontal, wallet/toasts WebGL validados em fixtures locais, contrato cosmético assinado e gates locais aprovados. A geração das cinco skins reais continua pendente do teto em créditos Mint; prompts/roteiros prontos. Próximo passo: executar Mint dentro do teto aprovado, finalizar/rigar no Blender, testar equipamento real e produzir capturas/vídeos. Campanha inativa até janela de lançamento; sem migration remota, merge/deploy ou publicação. Relatos abaixo preservam a evolução e os resultados rejeitados, e são superados pelo estado atual quando indicado.

## Marco: carteira SQL validada

Migration048 e `test/treta-economy.sql` no backend passaram no Supabase Docker local com rollback de fixtures. Proteções e evidência detalhadas no ledger backend. UI em implementação com aba LOJA logo depois de JOGAR, cards, filtro/armário, regras de recompensa, indicação, modais e estágio Three.js lazy.
Projeto Mint criado: `https://mint.gg/project/zd782bweh7fqxhtyryrcg32ryx8g2zhc` (CORO SOLTO Loja TRETA). Enviado somente pedido de plano/cotação; Mint informou que preview e final são cobrados separadamente e custo aparece no fluxo. Nenhuma geração paga iniciada. Pergunta de teto em créditos enviada ao dono, pendente. Moedas em geração headless, fontes Blender fora do Git em `private-assets/treta-store/coins`. Ficha `plans/TRETA-COINS-SKINS.md`.

## Marco: economia, loja e feedback de recompensa

Backend `5a790de`: carteira, inventário, campanha, compras atômicas e recompensas verificadas. Testes locais posteriores: API 18 assertivas; concorrência com duas compras simultâneas pelo saldo de uma; mutações 6/6 detectadas (email, partida completa, tempo ativo, limite, preço, disponibilidade); telemetria 26/26. Logs em `/tmp/treta-{api-test,db-test,mutations,concurrency}.log`; fixtures removidas/rollback. Dependência social: client `34edf6558` e backend `9c88c25`. Branch em ambos `codex/treta-skin-store-20261011`; checkout original preservado.

Pedido adicional do dono (implementado e validado no marco abaixo): cada crédito mostra moeda girando + valor/motivo; saldo fica no topo do menu. `treta-rewards.js` consome somente ledger positivo do servidor, fila após modais/entrada, dedup por conta e limpeza ao sair. Teste comportamental aprovado; WebGL real ainda pendente. Loja recebe saldo/catálogo/armário da API; assets não aprovados não podem ser comprados. Build anterior aprovado, repetir após os últimos ajustes.

Sete moedas GLB/PNG e fontes `.blend` criadas, com CoinSpin/PurchaseReveal. Crítico independente aprovou visualmente 1/5/50/100 e reprovou 10/200/1000 por perda de identidade facial no relevo. Não fechar como aprovadas sem correção e revisão. Contact sheet e fontes em `csbrasil/private-assets/treta-store/coins`; primeiro T-pose rejeitado preservado em `private-assets/treta-store/rejected`. Fontes reais existentes, não novas gerações Mint. Cinco referências visuais ainda precisam ser copiadas. Sem avaliação de animação/reverso até aqui.

Bloqueio externo restrito às cinco skins pagas: projeto Mint pronto, orçamento de geração pendente do dono (prévia/final cobrados separadamente). Não reduzir objetivo às moedas/UI; skins reais, animações, equipamento e vídeos continuam na definição de pronto.

## Marco: sete moedas revistas e notificações em execução

Após corrigir profundidade facial/pose e cunhar máscara/manchas da Caipora, o crítico independente aprovou as sete vistas frontais de512px. Referências completas em `references/treta-coins/`. Não equivale a aprovação humana ou performance em celulares. GLBs reais parseados pelo GLTFLoader vendorizado: sete modelos, três malhas/material por moeda, 330.089 triângulos total; CoinSpin4,03s e PurchaseReveal2s executam rotação/escala reais no AnimationMixer. Mutantes raiz minúscula, giro congelado e reveal ausente detectados3/3. Reverso em vídeo ainda pendente.

Navegador local: giro WebGL, recompensa +T$25/MP e +T$100/convite com saldo no topo, compra de800 com quatro moedas de200. Capturas `private-assets/treta-store/{store-mobile.jpg,reward-mobile-390.jpg,purchase-animation.jpg}`. Recompensas dessas capturas são fixtures explicitamente marcadas TESTE VISUAL LOCAL, não partidas reais. Harness reproduzível `tools/eval/treta-visual.html`, servido temporariamente no dev e removido depublic antes do build. Teste comportamental de fila/dedup/logout/valores inválidos e três mutações passou.

Integração cosmética adicionada: manifesto aprovado com base/modelo compatíveis, rig/clips exigidos; cache separado por skin e def por jogador, sem alterar personagens gratuitos. Backend assina skin equipada/propriedade validada no ingresso; roster associa por slot/conta/personagem. API local29 assertivas passou, incluindo skin forjada ignorada, conta anônima e catálogo indisponível. Backend checkpoint econômico `bd5df0e`; teste novo de contrato cosmético aprovado. Assets Mint continuam ausentes e catálogo continua fechado: equipamento com skin nova real não validado. Prompts e roteiro em `docs/shop/MINT-PRODUCTION.md`.

## Marco: carteira na UI real e assinatura cosmética validada

Backend checkpoint `48d2e35` fecha assinatura de skin/equipamento por conta e roster. Client: TP5/TP6 passam ao trocar/remover skin da mesma base; mutante skin-cache-cega reprovado nesses dois cenários. Launch race 10/10 passou com playerSkinId opcional no Game. Syntax/spec preenchido e docs/arch atualizados; build passou após header mobile, build final aprovado após aumento do texto/pausa frontal. Logs /tmp/treta-{client-personagem,tp-mutation,launchrace,syntax-final,spec,docs-final,arch-final,build-approved}.log.

Conta temporária de teste autenticou pelo fluxo local existente, leu wallet/ledger via API8096, recebeu avisos de créditos sintéticos positivos (email/referral/solo/MP) e atualizou saldo no menu. Não houve campanha real nem partida completada. Em390px, cabeçalho autenticado termina em105px e loja começa em110px, sem sobreposição; música permaneceu desligada. Captura estável inicial /Volumes/Zenith/Projects/game/corosolto/csbrasil/private-assets/treta-store/store-reward-server-fixture-mobile-final.jpg. Crítico independente pediu texto maior e pausa frontal: implementados12px/11px e700ms antes de CoinSpin; referência frontal das sete moedas aprovada, vídeo/reverso e performance mobile ainda não comprovados. Navegação móvel mantém scroll horizontal herdado.

O objetivo completo segue aberto: cinco skins novas de800T$ ainda sem geração paga, rig, aprovação e equipamento real; teto de créditos Mint aguarda resposta. Prompts, contrato de asset e storyboards concretos em MINT-PRODUCTION.md. Campanha nasce inativa/sem datas, catálogo indisponível; nenhuma geração cobrada, migration remota, merge/deploy ou publicação de vídeo. Próximo passo externo: obter teto e executar no projeto Mint já criado; depois finalizar Blender e validar partida com dois perfis. Conta temporária e seus dados locais removidos; logout efetuado, viewport reset solicitado e harness fechado. Loja local permanece aberta para revisão, sem música. Captura final /Volumes/Zenith/Projects/game/corosolto/csbrasil/private-assets/treta-store/store-reward-server-fixture-mobile-approved.jpg foi aprovada pelo crítico para saldo, valor, motivo e composição. Mostra crédito sintético, não partida real. Backend limpo em48d2e35. Grafo de módulos e seu mutante passaram; paridade simulação client↔nó verde (0 falhas). Checkpoints recuperáveis na branch codex/treta-skin-store-20261011. Os dois checkouts originais e suas alterações foram preservados.
