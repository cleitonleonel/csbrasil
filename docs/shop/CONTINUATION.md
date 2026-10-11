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

## Próximo passo

Implementar carteira/catálogo/recompensas/compras com SQL transacional e API usando a sessão social; criar loja/modais no client e os prompts/fichas/geração das moedas no Blender. Gerar skins via sessão Mint, verificar o custo apresentado antes de comprometer gasto sem teto definido.
