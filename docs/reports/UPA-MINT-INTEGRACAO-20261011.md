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

Na etapa preparatória, a integração aguardou liberação da geometria completa. O checkpoint dos dois arquivos preparatórios é `c4238f9af`; source/runtime desta integração evoluem no marco abaixo.

Marco validado de preparação: `node --check tools/eval/upa-mint-check.mjs` verde; execução real com Node23 reprovou `UPAM1` (preload 0/9) e `UPAM2` (os nove GLBs públicos ausentes). Esse resultado rejeita a conclusão de que a UPA procedural atual já contém mobiliário Mint. Testes de mutação e integração permanecem pendentes da entrega completa.

Baseline de circulação revalidado na retomada: `upa-structure-check.mjs` UPA1–6 e `upa-return-check.mjs` UPAR1–5 verdes. As coberturas atuais, os acessos e a fresta fechada dos monitores são o comportamento que a integração deve preservar; esses gates ainda medem os helpers procedurais.

## Envelopes entregues para preparação

Root entregou aprovação independente dos pilotos em cima do checkpoint cliente `c12f6416d`: maca `frame-r1`, envelope0.8258317×1.1516047×2m, colchãoY0.944–0.957 e cabeceira−Z; longarina1.772857×0.85×0.565510m. Transformações pertencem aos arquivos finais; nenhum piloto foi integrado isoladamente. Os sete restantes foram baixados, mas revisão de spec/PNG permanece aberta.

Propostas de encaixe ainda não aplicadas: balcão uniformeH1.2 fornece módulo~3.144×1.2×0.929m; dois módulos justapostos podem cobrir a recepção sem distorção. BiomboH1.8 tem footprint~0.828×2.389m, exigindo rever distância às paredes do corredor. SoroH1.9 tem base~0.77×0.74m; nas posições junto às macas os envelopes estimados deixam gapX~0.20m/gapZ~0.03m, sem passagem de corpo. A colocação será medida nos GLBs finais e aproximada do canto da maca se necessário, preservando rotas. Nenhuma dessas estimativas é aceite visual ou mudança já executada.

## Integração source e final-public

Root autorizou integração source com a geometria estável do lote completo, depois entregou os nove arquivos `public/models/props/upa_*.glb` após aprovação independente dos isolados. O final R3 divide materiais em duas primitivas apenas no balcão e na cadeira; o helper percorre todas as meshes e não presume uma primitiva por arquivo. Procedência, tamanho e hashes são canônicos em `mint-assets.json`; esta frente não copia binários nem duplica o inventário.

Os nove tipos substituem os helpers completos. `clinicalProp` retorna Group de GLB, força escala1 dos arquivos já normalizados e cria somente AABB de movimento pelos bounds transformados. Tiros recebem as meshes reais; as antigas caixas dos helpers não são criadas nesse ramo. Fallback procedural continua quando não há template. Balcões de recepção e farmácia têm dois módulos finais justapostos pela largura real; emergência e ilhas usam um módulo, sem deformação. A largura do balcão R2 mudou em relação à proposta inicial acima; o encaixe calcula a largura do arquivo real.

O biombo da observação foi aproximado da lateral do corredor quando seu GLB existe. Dez soros das observações/emergência usam a base real para colocar o pé junto ao canto da maca; três monitores da emergência usam largura real para contato de2cm com o leito. Esse contato é decisão de autoria, não teto de qualidade: os gates medem que não ficou fresta bloqueada. Fallback preserva as posições anteriores.

Validação candidato R2: `UPAM1–7` verdes, 85instâncias;52covers/12acessos preservados;358/358nós alcançáveis; zero colisões de spawns/bandeiras/nós e das amostras das arestas usando `Game._collide` com raio0.38. `Game._fireHitscan` real bloqueou alvos atrás das nove massas e acertou alvos em cinco vazios geométricos reais. Receipt fora Git: `launch-media/2026-10-11-mapas/mint/upa-integration/upa-candidate-r2.json`, explicitamente `candidate-external`.

Reexecução final-public R3: mesmos sete checks verdes; sete mutantes causais mortos por suas cláusulas esperadas (template ausente, occluder removido, eixo deformado, yaw trocado, caixa AABB de tiro, soro afastado e spawn bloqueado). UPA1–6, seus seis mutantes e UPAR1–5/retorno por URL continuam verdes com o lote real. Receipt final: `launch-media/2026-10-11-mapas/mint/upa-integration/upa-final-public.json`, contendo hashes dos nove GLBs/source e raios testemunhos. Sintaxe e diffcheck verdes.

`upa-structure-check.mjs` agora mede grupos e os bounds combinados dos módulos; carrega os GLBs públicos quando o lote inteiro está disponível. `--mint` exige os arquivos; `--asset-manifest=...` é candidato externo. Sem lote completo e sem exigir Mint, o gate anuncia `procedural-fallback`; não é prova de conteúdo Mint. `upa-mint-check.mjs` sempre exige lote completo e suporta `--self-test` e receipt.

Browser final-public: partida offline5×5CTF iniciou pelo hub visível em1536×1024/WebGL2,85instâncias/9tipos/escala1. Nenhum pageerror ou404 dos modelos UPA. Primeiro receipt mediu p95=16.9ms,zero frames>100ms,658drawcalls e1.066.875triângulos máximos, dentro dos tetos já existentes no gate browser. Gate completo permanece vermelho por53eventos inesperados herdados:26HTTP404de viewmodels privados e27console. Nenhuma allowlist foi ampliada para converter esse resultado em verde.

Seis imagens foram abertas e observadas: recepção tem três assentos por longarina e balcão de gavetas em dois módulos; farmácia tem armários de portas e puxadores; consultórios têm biombos de três painéis com rodas; observação/emergência mostram colchões baixos, estruturas abertas e rodízios das macas, haste/base/bolsa dos soros e carrinhos dos monitores. A pose de triagem enquadra principalmente a balança procedural e parede, portanto não demonstra sozinha todo o equipamento do setor. Nas poses olhando norte, monitores mostram sua face posterior; telas devem ser vistas também de frente na revisão independente. Plantas, balança, respirador e crashcart fora do lote mantêm seus helpers existentes.

Artefatos em `launch-media/2026-10-11-mapas/mint/upa-integration/browser-final/`: receipt `upa-ctf-5-1536x1024.json` e seisPNG com sufixos recepcao/farmacia/consultorios/triagem/observacao/emergencia. O erro de faca privada criou overlaydebug sobre as fotos. Uma repetição em `browser-final-clean/` fecha esse aviso pelo próprio clique da interface depois de registrar o receipt; os erros continuam no JSON e continuam reprovando o gate. Isso melhora a leitura das fotos e não é correção do erro ou aceite do gate completo.

Próximo passo root: crítica independente da cena e código, interação offline comW+tiro, hashes dos downloads, bake atualizado e validações client/backend pareadas. Grafo e amostras de movimento não constituem playtest humano; aprovação dos isolados não equivale a aceite humano do mapa integrado.
