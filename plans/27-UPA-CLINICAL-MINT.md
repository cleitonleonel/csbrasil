<!-- spec:mapa -->
# 27 — UPA: mobiliário clínico Mint.gg

Objetivo: restaurar e reestruturar a UPA como frente visual comparável à Piscina,
substituindo caixas de mobiliário por modelos 3D gerados no Mint.gg. Esta ficha cobre
o lote de nove props; o layout e a integração pertencem à frente principal.
Concluído significa GLBs com procedência, aparência revista no jogo, cobertura e
circulação coerentes, falha de carregamento testada e revisão adversarial independente.

Vetos: objetos genéricos sem marca, pessoa, paciente, sangue ou gore; nenhuma textura
de terceiros copiada. As imagens oficiais são consulta de contexto, não textura do jogo.

## Local real

UPA pública brasileira fictícia. O Programa Arquitetônico Mínimo do Ministério da
Saúde lista recepção/espera, guarda de macas e cadeiras de rodas, classificação de
risco, consultórios, emergência e observação. Isso ancora os tipos e os setores,
sem pretender reproduzir uma unidade específica ou certificar projeto assistencial.
Fontes e referência visual consultada: [FONTE](upa-clinical-mint/FONTE.md).

## Layout

Base inspecionada: `0ce634f848ad7e11b02bf3378efc1753dd0bf777`,
`public/js/map_upa.js`, símbolos `HALF_X`, `HALF_Z`, `CEIL`, `wallZ`, `wallX`.
Reproduzir a leitura com `git show 0ce634f84:public/js/map_upa.js`.
O mapa define salão interno, corredor central e seis setores. A frente principal
pode reautorar o arranjo; deve medir novamente circulação, spawns, CTF e oclusão.

As dimensões abaixo são **alvos de autoria em metros**, derivados dos envelopes
dos helpers do mapa e ajustados para reconhecer rodas, encostos e bases. Não são
dimensões normativas. X=largura, Y=altura, Z=profundidade; Y positivo para cima,
pivô no chão e centro do footprint. Assento/tela/portas voltados para +Z.

| ID proposto | Alvo X × Y × Z | Uso / orientação |
|---|---|---|
| `upa_maca` | 0,90 × 1,15 × 2,00 | transporte/observação; cabeceira em −Z |
| `upa_monitor` | 0,50 × 1,50 × 0,48 | monitor de sinais vitais em carrinho; tela +Z |
| `upa_soro` | 0,45 × 1,90 × 0,45 | haste de soro; base baixa compacta |
| `upa_oxigenio` | 0,40 × 1,25 × 0,40 | cilindro verde preso ao carrinho |
| `upa_biombo` | 0,40 × 1,80 × 2,20 | plano opaco longitudinal Z; pé transversal X |
| `upa_longarina` | 2,20 × 0,85 × 0,55 | três lugares, assentos em X; frente +Z |
| `upa_cadeira_rodas` | 0,68 × 0,95 × 1,00 | rodas laterais X; apoios dos pés +Z |
| `upa_armario` | 1,20 × 2,40 × 0,60 | aço fechado, portas +Z; farmácia/consultórios |
| `upa_balcao` | 6,20 × 1,20 × 1,10 | recepção, comprimento X; frente pública +Z |

Escalar uniformemente primeiro. Esticar eixos independentemente, como faz o helper
`encaixa` da Piscina, pode deformar rodas, tela e tubos; corrigir orientação e
footprint offline quando necessário. Não encaixar a cadeira em um cubo curto nem
achatar o encosto da longarina para preservar a altura da antiga caixa.

## Cobertura (cover)

Macas, armários, balcão e biombos formam cobertura reconhecível por setor. Longarinas
oferecem obstáculo baixo; a haste de soro e o cilindro não viram muralha invisível.
Preservar a associação entre cobertura clínica e colisor na reautoria. O GLB é
visual; a lógica de colisão deve continuar determinística também no arnês node.

Riscos observados nos helpers da base: `soro` usa haste estreita sem footprint de
rodízios; `banco` é caixa baixa sem encosto; `cadeiraRodas` tem colisor quadrado curto
para apoios dos pés; `biombo` não inclui pés largos; monitor e oxigênio têm alturas
distintas dos alvos. Medir colisão e tiro contra o volume **desenhado** após integrar.
Não esconder caixas oclusoras antigas atrás de rodas/tubos abertos se elas fizerem
o tiro parar em espaço que a imagem mostra vazio.

## Linhas de visão

O corredor precisa continuar legível entre setores. Não acrescentar props no vão
de porta ou spawn por conveniência de geração. Maca mantém colchão baixo e suporte
aberto; armário e biombo são sólidos; monitor permanece um equipamento pequeno.
Revisar em altura de olho e movimento as duas direções de cada rota, incluindo
frente/costas dos assentos e enquadramento entre macas.

## Referências

- [FONTE e imagem oficial](upa-clinical-mint/FONTE.md): contexto UPA,
  recepção/espera, longarinas e equipamentos genéricos de clínica pública.
- [Prompts prontos](upa-clinical-mint/PROMPTS.md): um objeto por geração no Mint.gg.
- `public/js/map_piscina.js`, `PISCINA_PROPS`, `temProp`, `encaixa`: caminho existente
  de GLB com fallback, colisão separada e sombra controlada; reutilizar o padrão.
- `.claude/skills/csbrasil/SKILL.md`: portões; `tools/spec.mjs`: validação da ficha.
- `/Volumes/Zenith/Projects/game/corosolto/csbrasil/progress/docs/LICOES.md`, lições 5, 11, 12, 14: ausência visível,
  orçamento medido, clone limpo e IDs estáveis. `prompts/GAME.md` não existe nesta lane.

## Régua de aceite

1. `node tools/spec.mjs check plans/27-UPA-CLINICAL-MINT.md` e `check --mutante`.
2. Cada GLB registra Mint asset/task ID, prompt exato, data, arquivo, tamanho, hash,
   licença/termos aplicáveis e transformação offline. Preview não comprova download.
3. Rodar inspeção GLB: bounds, eixos, materiais/texturas incorporadas, normais e
   custo real. Budgets novos só com evidência da Piscina e medição equivalente.
4. Mostrar cada objeto isolado e no mapa com a iluminação real; registrar o que
   foi visto. Conferir rodas, três assentos, haste, quatro rodízios da maca, mãos de
   direção da cadeira e escala clínica, sem geometria fundida ou objetos extras.
5. Estender os checks UPA existentes para carregamento, setores/cobertura, bounds,
   spawn/rota e tiro; mutações devem detectar prop ausente, orientação errada e
   colisor que bloqueia vão visual. Node não comprova GLB carregado em browser.
6. Asset-review independente com contexto limpo e aprovação visual do usuário
   continuam pendentes até ver o resultado. Validar disponibilidade em clone limpo.

## Continuidade deste lote

Branch: `codex/mapas-upa-tiros-grafites-20261011`; base acima. Pesquisa, referência
oficial observada e prompts concluídos. Ficha validada e mutante rejeitado em
2026-10-11. Root enviou o pedido dos pilotos maca e longarina; UI informou
“Understanding request”. Evidência local comunicada pelo root:
`/Volumes/Zenith/Projects/game/corosolto/csbrasil/launch-media/2026-10-11-mapas/mint/pilotos-pedido.jpg`.
Isso comprova despacho, não GLB concluído. Nenhum asset aceito ou integrado por
esta subtarefa. Próximo passo: root acompanhar os pilotos, registrar task/asset ID,
baixar e revisar escala/material antes do restante do lote. Revisão visual,
browser/gameplay e integração estão abertos.

Documentação rastreável em `plans/upa-clinical-mint/`. Imagem/PDF em
`references/upa-clinical-mint/` são insumos locais ignorados; hashes no FONTE.
Links locais `prompts/upa-clinical-mint.md` e `references/upa-clinical-mint/FONTE.md`
apontam à documentação canônica. Projeto Mint criado pelo root:
https://mint.gg/project/zd7b0v30hn2xpc5yxfcg8t5sz18g34wt — “CS BRASIL UPA props”.
