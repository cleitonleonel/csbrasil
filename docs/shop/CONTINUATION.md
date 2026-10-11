# Loja TRETA$ e skins: continuidade

## Objetivo e definição de pronto

Entregar loja dentro do jogo, imediatamente depois de JOGAR, com direção visual de shooter estilizado semelhante à referência Fortnite, moeda TRETA$ (T$), carteira/inventário autoritativos, compras de T$ 800 por skin, login social/email e dois modais de entrada. Campanha de primeiro mês configurável: email verificado, indicação convertida em partida e conclusão de single player/multiplayer. Criar no Mint e finalizar no Blender Lula do Drip, Bolsonaro do Drip, Senador do Drip/Zero Um, Janja e Michelle Bolsonaro; preparar expansão Daniel Vorcaro e Donald Trump. Criar sete moedas douradas 3D animadas (1/Saci, 5/Curupira, 10/Caipora, 50/Lobisomem, 100/Zé Gotinha, 200/Canarinho Pistola, 1000/Zumbi dos Palmares), cada uma com rosto/cabeça em relevo no anverso e valor/T$ no reverso (pedido atualizado), e animação na compra. Preparar roteiro/captura para vídeos de skins e da loja. Pronto exige assets reais revistos, equipamento jogável, validação de transações/replay/concorrência/abuso e capturas desktop/mobile. Implementação local não equivale a publicação.

## Decisões

- Pedido atual do dono autoriza as figuras públicas e a venda cosmética em T$, substituindo a orientação editorial antiga para esta lane. Não atribuir crimes às figuras na descrição comercial.
- T$ 800 é preço da skin dentro do jogo, não orçamento de geração Mint.
- Valores propostos, aguardando preferência opcional: email 200 (uma vez), indicação 100 após primeira partida válida, SP 10, MP 25; limite diário e janela de 30 dias configurada explicitamente no rollout.
- Nenhuma alteração de saldo/inventário aceita do navegador. Partidas remuneradas precisam de evidência do nó autoritativo; o SP offline atual não possui essa evidência.
- Pedido atualizado em 11/10: preparar packs de T$ comprados em BRL. 1.000 T$ = R$10 definido pelo dono; demais quantidades/preços em proposta na ficha UI-LOJA-TRETA.md. Cobrança real ainda não configurada/ativada.

## Checkpoint 2026-10-11

- Client isolado: `worktrees/treta-skin-store`, branch `codex/treta-skin-store-20261011`, base main `261cf59a7` alpha.67, avançada por fast-forward até comunidade `34edf6558`. Dependência do PR social #807 preservada; sem merge público.
- Backend isolado: `csbrasil-backend/wt/treta-skin-store`, mesma branch, base social `9c88c25` (dependência #70). Primary sujos preservados.
- Mint MCP da configuração local respondeu 401 `missing_bearer`; catálogo de plugins não retornou integração. Chrome tem sessão Mint autenticada, verificada na página de assets; caminho UI disponível.
- Blender instalado em `/Applications/Blender.app/Contents/MacOS/Blender`; serviço MCP 9876 sem listener. Usar processo headless isolado sem tocar a cena aberta.
- Supabase social local está em Docker, independente de produção. Nenhuma migration remota/deploy/merge autorizado por esta solicitação.

## Estado atual e próximo passo

Implementação client em `f3cb79f2d`; backend em `48d2e35` (economia `5a790de`/`bd5df0e`). Sete moedas portrait-v2 rejeitadas pelo dono por design: rosto/cabeça na frente, valor/T$ atrás, ouro e dois clipes mantidos; checks técnicos anteriores aprovados, mas insuficientes para aceite estético. Redesign em curso com protótipo de baixo-relevo integrado, superfícies suaves, contraste e tipografia revisados antes de repetir nas sete. Fontes/ficha em `507864bc1`, assets em `4acce51a4`; relatório `TRETA-COINS-PORTRAIT-REVIEW.md`. Wallet/toasts WebGL anteriormente validados em fixtures locais. Cinco skins Drip com rigs/30 clipes Mint e cinco Idle GLBs privados verificados; oito skins do lote2 com rigs/48 clipes Mint e oito Idle GLBs offline/ZIP verificados. Nova UI/loja, proposta de packs BRL e acessórios no chat solicitado `01a12cc7-e78d-7ec1-b2e3-3210df5efd6b`. Próximo objetivo amplo: consumir os novos assets na lane UI, retarget/equipamento real e performance mobile, depois vídeos/expansão Trump/Vorcaro. Campanha inativa até janela de lançamento; sem migration remota, merge/deploy ou publicação. Relatos históricos abaixo são superados por este estado e marcos mais recentes.

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

## Retomada Mint autorizada

Em11/10, o dono instruiu: “Só gere elas no mint. Podemos usar os créditos”. Uso dos créditos existentes autorizado para as cinco skins; esta etapa se concentra em geração Mint, com prompts e entregas separadas. Não comprar novos créditos nem contratar assinatura. Conferir saldo/custo no fluxo, registrar jobs/assets e cobranças efetivas. Estado inicial: nenhuma geração nova executada; projeto zd782bweh7fqxhtyryrcg32ryx8g2zhc, chat de orçamento ph7b90qeyqn4mqe6tr6zhbgryx8g2q0g.

Saldo observado no Mint antes da geração:30.580 créditos (19.215 do plano +11.365 usage); plano cancelado, uso restante permitido até18/10. Sem ressubscrição ou compra de créditos. Navegação do Studio em recuperação após controles de sidebar não mudarem a rota.

## Marco: cinco prévias solicitadas no Mint

Cinco chats separados com pedidos reais de3D Model preview, qualidade Standard, criados no projeto TRETA. URLs e prompts completos em docs/shop/MINT-JOBS.json. Lula ph7azn60zfk9j2amd87f06vhdd8g3kcv; Bolsonaro ph7f4qjk9ww0n3533j9911nc198g2cck; Senador ph7ba48kge0gsw267a8dvtzbpd8g38s9; Janja ph7cnh5y7g71netxwjajjyg2gh8g3fkx; Michelle ph7fr1dc9v0wv4z2vfk16swh5d8g2je9. UI mostrou Creating preview / start_model_generation. Prévia ainda não avaliada; não afirmar GLB final pronto. Próximo: inspecionar prévias, finalizar modelo, registrar ids/custos e exportar arquivos. Nenhuma compra de créditos/assinatura.

## Marco: revisão das prévias Mint

Capturas reais em private-assets/treta-store/mint. Crítico independente aprovou Lula A (Burgundy Goldbraid Boss Preview) e Bolsonaro como direção visual. Lula B perdeu barba/bigode e foi rejeitado; segunda solicitação duplicada causada por atraso da UI, reconhecida ao dono, não finalizar ambas. Senador: rosto genérico com mandíbula/sobrancelhas exageradas; Janja: aparência jovem genérica com olhos grandes. Corrigir reconhecimento antes do3D. Prévias não comprovam topologia, dedos ou rig. Modelo selecionado na UI: Tripo P1. Créditos por etapa ainda sem valor confirmado.

## Marco: primeiros modelos em geração

Generate acionado uma vez para Lula A e Bolsonaro; UI confirmou3D MODEL TRIPO_P1, nomes Burgundy Goldbraid Boss e Emerald Varsity Dripster, progresso75% com tempo exibido~12min. Não equivale a conclusão. Correção Senador enviada com captura do retrato oficial do Senado; Janja enviada com referência Pablo Valadares/Câmara dos Deputados (CC BY3.0), URL no JSON. Michelle também rejeitada pelo rosto genérico semelhante à Janja anterior. Anexo inicial do Senador foi rejeitado por extensão PNG em bytesJPEG; corrigido para.jpg e enviado com sucesso. Falha de navegador no primeiro fluxo de anexo exigiu recuperação dos handles; sem repetir geração. Próximo: concluir correção Michelle, avaliar prévias corrigidas e finalizar três restantes.

## Marco: três correções faciais aprovadas

Senador, Janja e Michelle corrigidos com referências faciais e aprovados pelo crítico independente para avançar à geração3D. Capturas privadas senador-preview-corrected.jpg, janja-preview-corrected.jpg e michelle-preview-corrected.jpg em private-assets/treta-store/mint. Generate acionado uma vez para Michelle e Senador; UI confirmou TRIPO_P1 com os nomes Michelle Bolsonaro Corrected Face e Flavio Face Corrected. Janja ainda aguarda acionamento. Aprovação da prévia não comprova modelo final ou rig. Próximo: gerar Janja, verificar conclusão dos cinco, baixar GLBs e registrar metadados.

## Marco: cinco modelos3D solicitados

Janja Generate acionado uma vez; UI confirmou Janja Mature Face Corrected, TRIPO_P1. Cinco pedidos finais confirmados, sem segunda finalização do Lula B. Ainda em processamento na UI; próximo verificar conclusão/asset real e exportar.

## Marco: primeiros assets finais concluídos

Lula, Bolsonaro e Senador exibem cards finais3D e abrem o Asset viewer do Mint. Identificadores/URLs em MINT-JOBS.json. Malhas reportadas pelo Mint: Lula4.642faces/3.610v/2,8MB; Bolsonaro4.951faces/6.932v/3,3MB; Senador4.876faces/6.290v/2,5MB. Prévias aprovadas não equivalem a aceite dos modelos: crítico pediu close dos grillz do Lula porque a captura final mostrou dentes claros. Exportação Lula acionada, mas nenhum GLB local confirmado; waitForEvent download expirou. Tentativa chrome://downloads bloqueada pela política do navegador, sem contorno. Fontes continuam no Mint. Próximo: confirmar Janja/Michelle, capturar modelos e closeLula, registrar saldo/custos disponíveis. Não inferir rig/topologia local ou integração.

## Marco: cinco modelos finais concluídos no Mint

Cinco cards finais TRIPO_P1 confirmados, com controles Download model/Animate e assets distintos: Lula p973vsch5wvrxhzqgs84d7bxa98g2fr3; Bolsonaro p97a7w9nkmqgs3aa7ztm4twqpx8g3y96; Senador p97at9cp8yxbxmee0784t0ecys8g3y86; Janja p97bw80b5vw0qdbcmtcg29bx7h8g3ay2; Michelle p97096kq8s8mqajjzva3k0s75x8g2a80. Janja4.986faces/6.717v/2,7MB reportados; Michelle2,7MB. Capturas modelo real em private-assets/treta-store/mint/*-model-mint.jpg. Crítico do modelo real: Bolsonaro preserva direção geral; correntes Senador parecem mais finas, pedir close; Janja mostra lentes brancas ocultando olhos, conferir ângulo/material; Lula grillz parecem claros, pedir close. Geração concluída é distinta de aceite visual/jogabilidade. Sem GLBs locais, rig ou animação de skins comprovados. Dono pediu sóMint nesta etapa; fontes/links preservados, nenhum Blender ou deploy executado nesta retomada. Próximo: fechar evidências Mint e saldo; retomada futura trata acabamento/rig/equipamento.

## Fechamento da etapa Mint autorizada

Cinco modelos finais concluídos e verificados no visualizador3D; galeria filtrada do projeto contém exatamente os cinco. Evidência five-models-mint.jpg. Michelle4.862faces/6.602v/2,7MB informados. CloseLula em lula-model-mouth.jpg confirma dentes claros; material grillz precisa correção. Controle Model action do Mint oferece Animate/Retopo/Optimize, sem ajuste pontual de material nesse fluxo; não regenerar corpo só por isso. CríticoMichelle preserva direção geral, sem falha material inequívoca na captura. Saldo final observado18.515 (7.150 plano +11.365 usage); delta global12.065 inclui trabalho paralelo em outro projeto, custo exclusivo das skins desconhecido. Relatório docs/shop/MINT-DELIVERY.md com links de cada asset e limitações. Próximo passo do objetivo amplo: acabamento grillz/lentes/correntes, obtenção dos GLBs, rig/animações, equipamento e revisão real; somente a geração Mint pedida nesta retomada está concluída. Nenhum catálogo ativo, Blender, publicação ou deploy nesta etapa.

## Retomada: finalizar acabamento no Mint

Dono pediu “Termine a geração então”. Escopo atual continua sóMint com créditos existentes. Reabertos acabamento dos grillz/Lula e lentes/Janja; conferir correntes/Senador e opções de rig/animação suportadas. Aba Mint estava crashed (Error code5), recuperada pelo Reload visível do Chrome. Pedido de edição/retextura dos dentes do asset Lula original enviado uma vez com o próprio modelo selecionado; UI confirmou Understanding request. Não repetir o pedido durante atraso. Resultado ainda não inspecionado. Próximo: corrigir lentes/Janja, acompanhar resultados e finalizar os modelos revisados.

## Marco: animações básicas em processamento

Mint Run Animate abriu Animation Catalog, Basic Movement(6) seleciona Idle, Casual Walk inplace, run fast3 inplace, Regular Jump, Idle Turn Left/Right. Apply confirmado uma vez para Bolsonaro; card Animation · Idle+5 / Animating exibido. Michelle recebeu o mesmo pacote, aguardando card de processamento. Não afirmar rig concluído só pelo pedido. Correções Lula/Janja enviadas uma vez com os respectivos assets selecionados. Próximo: conferir resultado dos ajustes, finalizar modelos corrigidos e completar animações dos cinco.

## Marco: Bolsonaro rigado e seis clipes Mint concluídos

Animation batch w574pr4pn17n7yvb002spj1ds58g2m61 concluído; visualizador enumera seis clipes. Link Download Idle GLB funciona via downloadMedia, ao contrário de botões de download. Arquivo real privado bolsonaro-drip-idle.glb salvo(3.892.872B), JSON GLB confirma skin Armature24joints e clip Armature|Idle|baselayer66channels,4,033333s. SHA no MINT-JOBS.json. Caminhada selecionada no visualizador mas screenshot foi capturado durante Loading; não usar como evidência de movimento. Botão Download caminhada não gerou arquivo observável nem evento; seis clipes disponíveis no Mint, apenas Idle local. Prévias corrigidas Lula/Janja aprovadas pelo crítico e Generate acionado uma vez para cada. Senador recebeu ajuste correntes pesadas preservando rosto/roupa; aguarda prévia. Próximo: conferir modelos revisados e completar animações restantes.

## Marco: Lula corrigido aceito visualmente no3D

Novo asset p978szcm8y7h62zwzaq86a2w6h8g2gq2(4.812faces/3.504v/3MB). Close da malha em lula-model-grillz-corrected.jpg confirma dourado; crítico aprovou grillz e direção preservada. Não é apenas prévia. BasicMovement6 Apply acionado uma vez nesse asset corrigido; card Animating confirmado. Próximo: completar Janja/Senador revisados, salvar GLBs rigados e confirmar seis clipes dos cinco no Mint.

## Marco: Janja corrigida aceita visualmente no3D

Asset p97f2vydpmmj5jkjtxpdp5p6a58g21pw Burgundy Hoop Executive,4.813faces/6.595v/2,6MB. Crítico confirmou ambos os olhos visíveis, lentes opacas corrigidas, direção preservada. Prova janja-model-lenses-corrected.jpg. BasicMovement6 Apply acionado uma vez nesse asset. Senador prévia Violet Chain Street Baron aprovada como direção com três camadas de elos largos. Próximo: Generate Senador, completar os pacotes animados e salvar GLBs privados.

## Marco: quatro pacotes animados concluídos

Bolsonaro, Michelle, Lula corrigido e Janja corrigida têm seis clipes BasicMovement concluídos no Mint. Um GLB Idle local por skin, todos com Armature24joints,66channels e4,033333s; hashes e batches no JSON. Michelle e Lula reproduzidos no visualizador com playhead ativo e pose deformada preservada nas capturas *-animated-idle.jpg; gameplay não validado. Senador corrigido Generate acionado uma vez, em processamento. Próximo: finalizar revisão modeloSenador/Animate e fechar relatório com os cinco ativos corretos.

## Marco: Senador corrigido aceito visualmente no3D

Asset p97bdwctkpvh37hn2zkct5sykn8g31x3 Violet Chain Street Baron,4.824faces/7.068v/2,7MB. Crítico aprovou três camadas de correntes pesadas legíveis e direção preservada. Prova senador-model-chains-corrected.jpg. BasicMovement6 Apply acionado uma vez nesse asset. Próximo: confirmar quinto pacote/baixar GLB Idle, verificar os cinco arquivos e fechar relatório.

## Marco final: cinco skins corrigidas, rigadas e30clipes concluídos noMint

Finalização pedida pelo dono concluída: Lula p978szcm8y7h62zwzaq86a2w6h8g2gq2, Bolsonaro p97a7w9nkmqgs3aa7ztm4twqpx8g3y96, Senador p97bdwctkpvh37hn2zkct5sykn8g31x3, Janja p97f2vydpmmj5jkjtxpdp5p6a58g21pw, Michelle p97096kq8s8mqajjzva3k0s75x8g2a80. Todos têm seis clipes BasicMovement na UI. Senador Idle reproduzido com playhead ativo, screenshot senador-animated-idle.jpg; enumeração senador-animations-six-final.jpg. Cinco GLBs Idle locais,24juntas cada; crítica independente confirmou header/accessors/pesos/canais fisicamente variáveis. Intervalo0,033333→4,033333 tem duração4s; endpoint não é duração. MINT-RIG-REVIEW.md registra resultado/limites e hashes.

Pacote privado private-assets/treta-store/mint/treta-skins-mint-rigged-idle.zip contém cinco modelos rigados com Idle, README,manifest e crítica. Outros25clipes disponíveis noMint, não baixar/prometer estes noZIP. Relatório/links finais MINT-DELIVERY.md; IDs/batches/hashes MINT-JOBS.json. Saldo15.918após os pedidos, delta global desta retomada2.597sem custo exclusivo comprovado. Nada comprado/ressubscrito. Checkout preservado, sódocs nesta retomada.

Definição de pronto da geração somenteMint atingida. Objetivo amplo continua aberto: integração/retarget das skins noengine, grip/clips de combate, equipamento e partida real, aceite humano, campanha real/datas, vídeos, expansãoTrump/Vorcaro; catálogo continua fechado até esses gates. Nenhum Blender, merge/deploy/publicação. Próximo passo autorizado nesta unidade é entrega dos links/arquivos; eventual integração precisa continuidade do objetivo amplo.

## Novo lote autorizado: oito skins Cyborg/Mandrake

Lula na Regua, Lula Cyborg, Bolsonaro Cyborg, Aljuiz da Toga Mandrake, Lula Mandrake, Bolsonaro Mandrake, Michelle Bolsonaro Mandrake, Zero Um Mandrake. Michelle repetida normalizada. Referencias do dono copiadas sem edicao ao diretorio privado batch2-cyborg-mandrake/references, hashes no MINT-BATCH2-JOBS.json; fichas plans/TRETA-SKINS-BATCH2.md. Escopo somente Mint e creditos existentes, sem compra/Blender/integracao. DoD: oito modelos revisados, rigs e seis clipes Mint por skin, GLB Idle local verificado, provas e pacote privado. HEAD inicial 2255da632, branch codex/treta-skin-store-20261011 limpa. Lote anterior preservado. Proximo: enviar oito previas com referencias, critica independente e Generate uma vez por previa aceita.

## Marco lote2: oito previas geradas, seis aceitas e duas correcoes

Oito chats com referencias do dono e previas Mint concluídas; IDs/URLs no MINT-BATCH2-JOBS.json, capturas privadas. Critica MINT-BATCH2-PREVIEW-REVIEW.md aceitou seis para direcao. Aljuiz reprovado lentes pretas/simbolo tenis; Zero Um reprovado duas correntes/rosto quadrado. Correcoes enviadas uma vez com preview selecionada. Generate acionado uma vez nas seis aceitas (Lula na Regua, dois Cyborgs, Lula/Bolsonaro Mandrake e Michelle); nao declarar malha pronta pelo pedido. Saldo atual14.534após8previas, sem custo exclusivo por skin comprovado. Proximo: revisar duas correcoes e malhas finais antes rig/BasicMovement.

## Marco lote2: oito malhas revisadas, seis aceitas

Oito modelos reais gerados, capturas models/*-model.jpg e metadados noJSON. Crítico MINT-BATCH2-MODEL-REVIEW.md aceitou seis; Jair Mandrake perdeu correntes e Zero Um perdeu terceira curva. Correcoes enviadas e previas novas prontas. Zero Um aceita; Jair restaurou ouro mas veio com tres camadas. Ajuste de ficha de 2 para 2ou3 permitido: quantidade2era escolha nossa de prompt, dono pediu correntes/estilo; nao gastar regeneracao apenas para remover adorno pertinente. Ficha atualizada antes parecer final. BasicMovement6 Apply uma vez nos seis aceitos; Lula naRegua já mostra AnimationIdle+5 mas downloadMediaIdletimeout20s nesta rodada; diagnosticar acesso download sem repetir gasto. Proximo: finalizar malhas com correntes restauradas, completar oito rigs e baixar arquivos.

## Marco lote2: seis rigs e36clipes Mint concluídos

Lula naRegua, Lula Cyborg, Bolsonaro Cyborg, Aljuiz, Lula Mandrake e Michelle enumeram6clipesBasicMovement e reproduzemIdle com playhead/Pauseanimation no viewer. Capturas animations/*-six-clips.jpg; IDs/batches em animationUrl JSON. Nao existem GLBs locais deste lote ainda: Chrome informa bloqueio de multiplos downloads automaticos para mint.gg. Pergunta especifica ao dono viaasync sobre Alwaysallowpendente; nao alterarconfig nem contornar. Corrigidos Jair/ZeroUm gerados e aguardam revisao malha. Próximo: revisar2correcoes, Animate6emcada, fechar48clipes; baixar/verificar/pacotear quando permissao chegar.

## Marco lote2: oito malhas finais aceitas, ultimos dois pacotes pedidos

Jair corrigido p9796a1e30etp3xncgs1czbbg18g3wz0 e ZeroUm corrigido p978c5gpbzttzf0e62j2cm1bg18g3hks aceitos na critica3D, preservadas correntes e identidade. Modelproofs corrigidos privados,8/8aprovados visualmente. BasicMovement6Apply uma vez nos dois, Jair exibe AnimatingIdle+5. IDs/batches dos seis concluidos noJSON; entrega MINT-BATCH2-DELIVERY.md checkpointparcial. Proximo: aguardar2pacotes, confirmarenum6/playback, atualizarentrega; downloads dependem resposta permissao Chrome.

## Marco lote2: sete pacotes concluidos, ultimo na fila

ZeroUm corrigido exibe6clips e Idle reproduzido. JSON7animationUrls, entrega atualizada com provas3D e links finais. Jair corrigido continuaAnimatingset6, nao reacionarApply. Saldo5532globalaposrequests, nada comprado. ExportlocalbloqueadoporpermissionChromepergunta pendente. Proximo: aguardarJair, confirmar6/playback, entregargeracaoMint; exportbinario/pacoteoffline ainda dependem permissao e nao podemser afirmadosconcluidos.

## Marco lote2: geração Mint concluída — oito modelos e48clipes

Oito finais aprovados visualmente, oitoBasicMovement6concluídos noMint, Idle reproduzido/6enumerados emcada viewer. Jair corrigido agora concluído (reload da página expôs card pronto; não houve novoApply). JSON registra finalAssetId/animationBatchId, URLs finais e SHA256provas, entrega atualizada com8links. Capturas privadasanimations/*-six-clips.jpg, models/*model.jpg. AbaMint mantida como deliverable e viewerfinalpausado/fechado para reduzirGPU. Saldo5532globalaposrequests.

A geração solicitada somenteMint está concluída. Exportação offline ainda NÃO concluída: Chromebloqueiamúltiplosdownloads, perguntaao dono sobre Alwaysallowmint.ggpendente, nenhuma configuraçãoalterada. Não há GLBs locais/ZIP/validaçãobinária novos. Próximo concretoparaexport: receberpermissãoseescolhida, habilitarviaUIChrome, downloadMediaIdleporcadachatURL, salvarglb/<slug>-idle.glb, criticarjuntas/pesos/movimento e criarZIPprivado. Se dono mantiverbloqueado, entrega pelos8linksMintjápronta. Objetivoamplo loja/economia/retarget/gameplay/vídeos/Trump/Vorcaro continua ledgeroriginal, semcodemutation/Blender/deployneste lote.

## Marco: downloads autorizados e novo chat de UI/loja

Dono autorizou permissão Mint múltiplos downloads e pediu rigs, nova UI inspirada em espaçamento/tipografia Fortnite mantendo identidade, loja, opinião sobre bonés e packs BRL. Allow aplicado no prompt nativo Chrome somente mint.gg; downloads GLB agora funcionam. Exportação dos oito Idle em andamento, sem novos pedidos Generate/Animate. Sete moedas conferidas nos arquivos reais public/models/treta: todas têm CoinSpin/PurchaseReveal.

Ficha plans/UI-LOJA-TRETA.md checkpoint bea564e96. Novo chat solicitado criado: 01a12cc7-e78d-7ec1-b2e3-3210df5efd6b (local), título UI e loja TRETA com referência Fortnite, atividade confirmada por wait_threads. Instruído a criar lane própria baseada bea564e96, preservar esta lane/primary/backend original, UI primeiro e capturas desktop/mobile; três packs iniciais propostos e quarto futuro, apenas1000/R$10 preço definido pelo dono. Não há cobrança real ativa nem preços adicionais aprovados. Próximo nesta lane: completar oito exports, crítica binária independente e pacote privado; no chat novo: implementar e validar UI/loja conforme ficha.

## Marco: oito Idle GLBs locais exportados

Exportado um Idle GLB de cada asset final correto pela UI Mint/downloadMedia. Oito arquivos privados batch2-cyborg-mandrake/glb/<slug>-idle.glb, 3,21–4,51MB; headers glTF2/comprimentos/JSON conferidos e todos têm uma mesh, uma skin24juntas, osso Head e um clip Armature|Idle|baselayer. Paths/tamanhos/SHA256 no MINT-BATCH2-JOBS.json. Mesmo nome Mint GoldChainMandrake tratado com rename por slug antes de sobrescrever; Jair usa final corrigido p9796a1e30etp3xncgs1czbbg18g3wz0. Crítica binária independente do agente treta_coin_critic solicitada pela skill asset-review antes do aceite. Próximo: receber avaliação pesos/canais/tempos, registrar relatório e ZIP privado; gameplay/retarget ainda pendentes.

## Marco final lote2: export e pacote rigado verificados

Crítica independente MINT-BATCH2-RIG-REVIEW.md aprovou8/8 nos checks estruturais:24juntas, pesos/índices/IBMs válidos,23/66canais variáveis reais com q/-q tratados, Idle4s, FK121keys e skinning amostrado256v×16frames não constantes. Head animado/ponderado em todos;1mesh/primitive/material sem adornos como nodes separados, sem ossos individuais dos dedos. Arquivos originais preservados.

Pacote privado /Volumes/Zenith/Projects/game/corosolto/csbrasil/private-assets/treta-store/mint/batch2-cyborg-mandrake/treta-skins-batch2-rigged-idle.zip,11entradas (8GLBs+README+manifest+crítica), 27037214B; CRC e hashes internos conferidos. Identidade SHA256 b573aa6b57b8cd367431b288bd83034e43b3a103962021f0295d58592844f7c1. MINT-BATCH2-JOBS.json/DELIVERY atualizados. Existem48clipes Mint, apenas8Idle noZIP. Download offline resolvido; rig geração/validação estrutural dos8 concluídos. Não é integração/gameplay ou qualidade do ciclo completo. Moedas7GLBs atuais também conferidas por SHA contra JSON privado; CoinSpin/PurchaseReveal presentes e330089triângulos no total. Contact-sheet privado antigo não representa últimas correções, preferir posters public/img/treta atuais. Próximo objetivo amplo: UI/loja no novo chat, retarget/clipes de combate/equipamento real e desempenho mobile em etapa própria antes catálogo, vídeos/expansão posteriores. Sem nova geração paga/Blender/deploy nesta retomada.

## Retomada: moedas com rosto na frente e valor no verso

Pedido do dono substitui composição corpo+arma por rosto/cabeça sozinho no anverso e denominação/T$ no reverso. Preservar7valores/personagens, ouro, giro/reveal e paths consumidos pela UI. Branch codex/treta-skin-store-20261011, HEAD inicial066c9621a limpo. Ficha plans/TRETA-COINS-SKINS.md atualizada antes geração. Originals GLB/PNG/JSON preservados privados em coins/rejected-fullbody-20261011. Novas fontes/renders/JSON em coins/portrait-v2, script build_treta_coins.py recorta cabeça das malhas fonte existentes sem regeneração paga. Protótipo Saci/1 produzido e inspecionado frente/verso;306KB aproximadamente, sem corpo/arma/texto frontal,1T$ legível atrás. Lote7 em produção; ainda não aprovado independente. Próximo: revisão dos7retratos, correções de identidade se necessárias, contato de frames dos2clipes, GLTFLoader e crítica independente; não integrar na outra lane UI ou publicar sem evidência.

## Marco: sete moedas retrato produzidas e clipes validados

Sete GLBs/posts atualizados nos mesmos paths public/models/treta e public/img/treta. Corte plano inicial rejeitado: deixava ombros/artefato lateral; provas em portrait-v2/rejected-plane-crop. Recorte corrigido pela influência Head e plano inferior; Caipora ganhou máscara facial de ouro escuro ajustada à superfície por BVH, preservando olhos. Valores isolados grandes no verso, sem marca/valor na frente. Ouro/borda mantidos.

GLTFLoader vendorizado parseou7/7:3meshes/material, giro4.03s/reveal2s e rotação/escala reais;3/3 mutações animação detectadas. Geometria total103210triângulos contra330089anteriores (~69%menos), sem benchmark mobile inferido. Frente/verso14renders512px inspecionados, contato de9framesCoinSpin e5PurchaseReveal do Saci em portrait-v2. Relatórios de diferença alertam mudanças grandes, esperadas pelo giro frente/verso e crescimento do reveal; qualidade final ainda sob crítica independente coin_portrait_review. Próximo: parecer, eventuais correções, checkpoint/package e entrega da nova composição. Outra lane UI permanece separada; atualização não equivale a deploy.

## Marco: correção fina da Caipora e revisão dos dois lados

Crítico aprovou7anversos/7versos após retirar pescoço central da Caipora. Corte horizontal global em y358 rejeitado por amputar queixo/cabelo; seleção por pesoHead>.95 também rejeitada localmente por recorte irregular da face/cabelo. Final usa região central inferior y≈387–409, preservando mandíbula até≈385 e cabelo lateral; máscara em ouro escuro mantida. Sete contatos com10frames cada (5Spin+5Reveal),70frames512px no total, em portrait-v2/coin-*-motion-sheet.png e motion/coin-*-*.png. Crítica final das animações em andamento. Builder final regenera lote inteiro para provar composição3meshes com materialdark passado explicitamente, evitando lookup de material antigo do primeiro build. Próximo: concluir geração reprodutível, GLTFLoader/mutações/hashes finais, incorporar crítica e commitar fontes/assets separadamente pelos limites da casa.


## Marco final: sete moedas retrato concluídas

Geração headless final reprodutível e crítica independente concluídas. Sete frentes, sete versos e CoinSpin/PurchaseReveal de cada moeda aprovados em amostras visuais; 70 frames finais preservados. Loader Three.js 7/7 e mutações 3/3 aprovados após regeneração; hashes contra JSON/manifest conferidos. Lote final 103199triângulos,2832208B,3meshes/materials por GLB; redução68,7% de geometria, sem inferir desempenho mobile. CoinSpin4,03s/PurchaseReveal2s com transformações reais. py_compile/ficha aprovados.

Commits fonte/ficha/proveniência507864bc1 e assets4acce51a4 nesta branch. Fontes Blender, JSONs, manifest, renders dos versos, galerias frente/verso e folhas por moeda em private-assets/treta-store/coins/portrait-v2. Crítica incorporada em docs/shop/TRETA-COINS-PORTRAIT-REVIEW.md com verificação final do responsável. Anteriores corpo+arma em rejected-fullbody-20261011 e primeiro recorte em portrait-v2/rejected-plane-crop. Sem gasto Mint, cena nativa, outra lane, merge ou deploy. Pedido desta composição concluído; próximo passo amplo é integração UI e evidência de gameplay/mobile na lane adequada.


## Retomada: dono rejeitou o design portrait-v2

Pedido: “O design dessas coins estao horriveis”. Rejeição visual do dono supera aprovação anterior do crítico. V2 preservada como rejeitada: cabeças salientes, superfícies facetadas, pouco contraste e aparência de peça colada no disco. Não tratar polycount/loader como aceite estético. HEAD inicial157ba2c36 limpo nesta lane. Próximo: um protótipo Saci cunhado em baixo-relevo, superfície contínua, leitura frontal/oblíqua e nos tamanhos UI; revisão independente e comparação com v2 antes de repetir a direção. Preservar os sete valores/personagens, ouro, rosto na frente/valor atrás e animações; nenhuma nova geração paga/alteração da outra lane/deploy.
