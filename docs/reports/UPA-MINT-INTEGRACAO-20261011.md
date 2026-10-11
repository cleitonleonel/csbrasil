# Integração clínica Mint na UPA

Objetivo: integrar o lote completo da [ficha 27](../../plans/27-UPA-CLINICAL-MINT.md) com escala uniforme, cobertura e circulação reais. Esta frente é dona apenas de `map_upa.js` e gates UPA. Root entrega os nove GLBs aprovados, normalização, procedência e revisão visual; não haverá integração parcial dos pilotos.

Branch `codex/mapas-upa-tiros-grafites-20261011`, retomada em `7b8825d14`. Continuidade geral: `/Volumes/Zenith/Projects/game/corosolto/csbrasil/progress/docs/reports/MAPAS-UPA-TIROS-GRAFITES-20261011.md`. O relatório anterior [UPA-RETORNO](UPA-RETORNO-20261011.md) cobre o retorno procedural, sem comprovar esta substituição clínica.

## Plano de integração

1. Declarar os nove IDs em `UPA_PROPS` após liberação do lote; `hasProp`/`placeProp` reutilizam o loader do jogo. GLBs centrados no footprint, Y para cima e chão zero, já normalizados offline; runtime usa escala1 e yaw, sem reenquadrar ou deformar eixos.
2. Cada helper clínico tenta o GLB antes de executar seu fallback atual. Havendo GLB, não criar a caixa visual antiga, nem suas malhas oclusoras. Fallback serve a falta de asset/offline; o loader online requerido é responsabilidade do fluxo geral existente.
3. Os tiros usam somente meshes do GLB. AABB serve apenas a movimento. Cada instância recebe `userData.upaProp={id,ry}`, nome único e collider etiquetado com o mesmo nome. Bounds são calculados após a transformação real; nenhum proxy oculto será acrescentado aos tiros.
4. Longarina usa o envelope aprovado do modelo, sem esticar para a caixa antiga ou multiplicar assentos dentro do mesmo objeto. As filas atuais podem mudar de quatro caixas para três assentos reconhecíveis; posições dos helpers e os acessos continuam os mesmos.
5. Monitores da emergência exigem contato real com as macas, ou vão que comporte o diâmetro usado por `Game._collide`. Os envelopes preliminares indicam contato no offset atual, mas a decisão final vem dos bounds dos GLBs aprovados. AABB próxima ao biombo, cadeira de rodas e soro também precisa respeitar bases e pés reais.
6. Adaptar UPA5 para aceitar Group GLB reconhecível, mantendo todas as coberturas e setores. Executar UPA1–6, retorno, contrato, spawn, pickups e CTF com o lote real carregado; incluir a geometria de cada fonte nos receipts.

## Régua antes da integração

`tools/eval/upa-mint-check.mjs` lê o inventário da ficha e exige preload completo, arquivos públicos carregáveis e instâncias clínicas reais. Mede escala uniforme, orientação de instância, AABB do GLB transformado e inclusão das meshes nos occluders. Falta de arquivo ou metadata é vermelho; não aprovar fallback como Mint.

Preparação não declara aceite. Após receber o lote, serão acrescentados raios testemunhos atravessando os vazios reais da maca, rodas, carrinho do monitor e haste de soro, escolhidos pela inspeção dos assets finais. Mutações: apagar um asset/instância, girar um equipamento, deformar um eixo e inserir caixa oclusora no vão. A régua deve matar cada mudança pela cláusula correspondente antes do checkpoint.

Node carrega as meshes reais, preserva os parâmetros de material e omite apenas imagens/texturas na fixture. Não comprova aparência, transparência de textura, PNG no browser ou aprovação humana. Root continua único dono do navegador e da crítica independente.

Próximo passo: receber liberação explícita dos nove arquivos finais. Até isso, `map_upa.js` e os templates/binários permanecem sem integração clínica Mint nesta frente.

Marco validado de preparação: `node --check tools/eval/upa-mint-check.mjs` verde; execução real com Node23 reprovou `UPAM1` (preload 0/9) e `UPAM2` (os nove GLBs públicos ausentes). Esse resultado rejeita a conclusão de que a UPA procedural atual já contém mobiliário Mint. Testes de mutação e integração permanecem pendentes da entrega completa.

Baseline de circulação revalidado na retomada: `upa-structure-check.mjs` UPA1–6 e `upa-return-check.mjs` UPAR1–5 verdes. As coberturas atuais, os acessos e a fresta fechada dos monitores são o comportamento que a integração deve preservar; esses gates ainda medem os helpers procedurais.

## Envelopes entregues para preparação

Root entregou aprovação independente dos pilotos em cima do checkpoint cliente `c12f6416d`: maca `frame-r1`, envelope0.8258317×1.1516047×2m, colchãoY0.944–0.957 e cabeceira−Z; longarina1.772857×0.85×0.565510m. Transformações pertencem aos arquivos finais; nenhum piloto foi integrado isoladamente. Os sete restantes foram baixados, mas revisão de spec/PNG permanece aberta.

Propostas de encaixe ainda não aplicadas: balcão uniformeH1.2 fornece módulo~3.144×1.2×0.929m; dois módulos justapostos podem cobrir a recepção sem distorção. BiomboH1.8 tem footprint~0.828×2.389m, exigindo rever distância às paredes do corredor. SoroH1.9 tem base~0.77×0.74m; nas posições junto às macas os envelopes estimados deixam gapX~0.20m/gapZ~0.03m, sem passagem de corpo. A colocação será medida nos GLBs finais e aproximada do canto da maca se necessário, preservando rotas. Nenhuma dessas estimativas é aceite visual ou mudança já executada.
