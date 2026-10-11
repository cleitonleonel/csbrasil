# UI e loja TRETA — continuação autorizada em novo chat

Pedido do dono em 11/10/2026: interface mais limpa, com espaçamentos e tipografia inspirados em https://interfaceingame.com/games/fortnite/, preservando identidade, cores e humor do CORO SOLTO. Abrir novo chat para executar este workflow, incluindo loja de skins e exploração de itens cosméticos. Rig das oito skins do lote 2 e exportação continuam na lane de assets original.

## Ownership e base

Não alterar primary nem a lane de assets `worktrees/treta-skin-store`. Criar checkout isolado client a partir de `codex/treta-skin-store-20261011`; repositório comum `csbrasil/client/.git`. Inspecionar branch, HEAD, status, AGENTS e o ledger antes de escrever. Backend existente `csbrasil-backend/wt/treta-skin-store` também deve ser preservado; se precisar, criar lane própria partindo de `48d2e35` após verificar estado atual. Atualizar ledger na nova lane e checkpoints DCO sem binários privados ou segredos.

## Resultado esperado

- UI primeiro: grid de espaçamento consistente, títulos legíveis e fortes, corpo legível, mais respiro, menos bordas/ruído, foco claro e contraste/acessibilidade, mantendo paleta e marca existentes. Referência é direção de composição; sem copiar marcas ou assets Fortnite.
- LOJA imediatamente após JOGAR. Saldo T$ sempre no menu. Cards com preço, propriedade e ação claros; detalhe com preview 3D lazy e armário. Preservar compra de skin por 800 T$, autenticação, carteira autoritativa e contrato cosmético existentes.
- Cada crédito de email/indicação/partida deve mostrar valor e motivo com moeda girando; confirmação de compra anima moeda e item. Preservar fila/dedup/logout e modais de entrada, sem modais redundantes ou bloqueio desnecessário.
- Separar cosméticos (skins/acessórios) de packs T$. Bonés são viáveis como meshes separados presos ao osso Head, com transformação de encaixe por personagem. Hats/correntes já fundidos nas skins Mint não são removíveis por configuração; planejar variantes/compatibilidade. Considerar mochilas, wraps e emotes sem vantagem competitiva. Não gerar novos itens pagos sem necessidade nesta fase de UI.
- Validar telas reais desktop 3:2 e mobile 390px: menu, loja, detalhe, armário, carteira, prêmio e compra; evidenciar carregamento, vazio, erro e saldo insuficiente. Usar fixtures claramente identificadas, nunca alegar transação ou partida real a partir delas. Medir carga 3D mobile; moedas atuais somam cerca de 330 mil triângulos e não têm performance celular aprovada.

## Packs em dinheiro — proposta para revisão

Dono fixou 1.000 T$ = R$ 10 e citou 3.000, 5.000 e 10.000 apesar de falar em três packs. Proposta inicial: três cards de 1.000/R$10, 3.000/R$27 e 5.000/R$40; 10.000/R$75 como quarta opção futura. Apenas o primeiro preço veio do dono; os demais são recomendações, não preços aprovados. Representar como proposta/config local revisável, sem ativar cobrança real. Mostrar total creditado e BRL de forma inequívoca. Skin de 800 T$ equivale a R$8 na tarifa base, antes de descontos/recompensas.

Se preparar contrato: BRL em centavos, T$ inteiros, pacote/preço definido no servidor, ledger persistente, crédito somente por confirmação assinada do provedor, idempotência, rejeição de pagamento pendente/cancelado, tratamento de reembolso, testes de replay/concorrência. Escolha do provedor e publicação/ativação ficam pendentes; não presumir credenciais ou pagamento real. Campanha atual continua inativa até datas de lançamento; proposta histórica email200/referral100/SP10/MP25 não constitui campanha ativa.

## Assets e evidência existentes

Leia `docs/shop/CONTINUATION.md`, `MINT-JOBS.json`, `MINT-BATCH2-JOBS.json`, entregas e críticas. Cinco skins Drip do lote1 têm Idle GLB privado verificado; oito do lote2 têm rig e 48 clipes completos no Mint, com exportação local em andamento na lane original. Não repetir geração/Animate. Fontes privadas em `csbrasil/private-assets/treta-store/mint`, sem publicar automaticamente. Integração real/retarget/combate ainda precisa validação.

Sete moedas reais `public/models/treta/coin-{1,5,10,50,100,200,1000}.glb`, cada uma com `CoinSpin` e `PurchaseReveal`; fontes Blender privadas `csbrasil/private-assets/treta-store/coins`. Personagens: Saci, Curupira, Caipora, Lobisomem, Zé Gotinha, Canarinho Pistola e Zumbi dos Palmares, nessa ordem. Aprovação frontal técnica existe; não equivale a aprovação humana do ciclo/reverso ou performance mobile.

DoD deste workflow: implementação local reviewable da UI/loja, capturas e validação do caminho real, economia/contratos preservados, packs propostos sem cobrança ativa, limitações explícitas e ledger atualizado. Sem merge, deploy, migration remota ou publicação nesta autorização.
