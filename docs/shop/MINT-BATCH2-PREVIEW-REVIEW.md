# TRETA lote 2 — revisão independente de prévias

Escopo: oito **prévias de direção visual**, conferidas por imagem e contra a ficha `plans/TRETA-SKINS-BATCH2.md` e as referências indicadas em `docs/shop/MINT-BATCH2-JOBS.json`. Aplicada `.claude/skills/asset-review/SKILL.md`. A autorização nominal atual para as figuras reais consta na ficha e prevalece sobre o veto antigo da skill.

Resultado: **6 APROVADOS para avançar a geração 3D; 2 REPROVADOS nesta prévia**. Estes vereditos não aprovam modelos finais, rig, animações ou compatibilidade com o engine.

Raiz das imagens inspecionadas: `/Volumes/Zenith/Projects/game/corosolto/csbrasil/private-assets/treta-store/mint/batch2-cyborg-mandrake/`. Caminhos abaixo são relativos a essa raiz.

| Skin | Veredito de direção | Conferência e evidência visível | Correção mínima |
|---|---|---|---|
| Lula na Régua | **APROVADO** | `previews/lula-na-regua.webp`, ref. 01: Lula idoso reconhecível, barba cinza, cabelo curto cinza com linha frontal reta/quadrada e têmporas mais claras; terno azul-marinho, camisa branca, gravata escura fina, pin brasileiro e tênis pretos com sola branca. Sem chapéu ou óculos. | Nenhuma divergência material frontal bloqueante. O perfil completo do fade e o acabamento lateral da barba não são demonstrados pela vista frontal. |
| Lula Cyborg | **APROVADO** | `previews/lula-cyborg.webp`, refs. 02/04: cabelo/barba e metade natural do rosto preservam Lula; outra metade tem placas metálicas e um olho vermelho. Pescoço mecânico, pistões, corpo preto/cinza/cromado, reator vermelho, faixa verde/amarela diagonal e estrela em relevo. Corpo mais robusto que o de Bolsonaro. Sem sangue, rasgos de carne ou símbolo de personagem protegido visível. | Nenhuma correção visual bloqueante nesta direção. |
| Bolsonaro Cyborg | **APROVADO** | `previews/bolsonaro-cyborg-proof.jpg`, ref. 03: rosto adulto de Jair, cabelo repartido, metade metálica e olho vermelho; corpo alto/esguio, armadura angular azul-escura/prata, linhas verdes, marcas geométricas amarelas nos ombros. Sem barba/faixa; distinto do Lula Cyborg. | Nenhuma correção visual bloqueante nesta direção. |
| Aljuiz da Toga Mandrake | **REPROVADO** | `previews/aljuiz-toga-mandrake-proof.jpg`, ref. 05: identidade calva, expressão severa, toga aberta, abas brancas judiciais, grafismo preto/branco, meias e tênis roxo/teal aparecem. **As lentes são pretas/cinza-escuras, enquanto ficha e ref. 05 pedem douradas espelhadas.** O tênis também exibe um símbolo branco lateral muito semelhante ao símbolo de marca da ref. 05. A toga termina junto à linha dos joelhos e encobre quase todo o comprimento lateral da bermuda; a imagem não permite afirmar que ultrapassa o joelho. | Trocar só as lentes por ouro/amarelo espelhado e substituir o símbolo lateral dos tênis por painel geométrico original. Recomendado encurtar a toga para expor mais a bermuda; não tratar a posição exata da barra como falha anatômica comprovada. Preservar as abas judiciais. |
| Lula Mandrake | **APROVADO** | `previews/lula-mandrake-proof.jpg`, refs. 06/09: Lula com barba cheia cinza, boné preto invertido com regulador bege, lentes amarelas, moletom preto com desenho branco, bermuda vermelha larga, meias brancas e tênis roxos. Duas correntes cubanas grossas separadas, grande pingente retangular dourado e anéis legíveis. Silhueta própria, diferente de terno e cyborg. | Nenhuma correção material bloqueante. O desenho branco parece uma composição estilizada de rosto/crânio com respingos; não há texto ou personagem protegido identificável na imagem. |
| Bolsonaro Mandrake | **APROVADO** | `previews/bolsonaro-mandrake-proof.jpg`, refs. 07/10: Jair adulto sem barba, boné branco sem logo, lentes douradas, camiseta larga e bermuda combinando azul-claro/branco/carvão com formas abstratas. Duas correntes de comprimentos distintos, relógio/anéis, meias brancas e tênis azul/lilás. Só um homem; grafismo não reproduz os personagens/textos da ref. 10. | Nenhuma correção visual bloqueante nesta direção. |
| Michelle Bolsonaro Mandrake | **APROVADO** | `previews/michelle-mandrake-proof.jpg`, mulher da ref. 07: rosto feminino adulto, cabelo preto comprido/liso, óculos vermelhos estreitos, camiseta preta ampla com rosas vermelhas/folhas verdes, bermuda cargo preta até joelhos, meias brancas e tênis vermelho/preto. Correntes prateadas em camadas, pingente pequeno, pulseiras/anéis e tatuagem discreta no antebraço. Só uma mulher; proporções adultas equilibradas. | Nenhuma correção visual bloqueante nesta direção. Óculos ocultam os olhos; o reconhecimento facial aprovado é o possível nessa caricatura frontal com acessórios. |
| Zero Um Mandrake | **REPROVADO** | `previews/zero-um-mandrake-proof.jpg`, ref. 11: boné preto lateral, lentes douradas, conjunto preto com filetes dourados, calça solta, tênis preto/ouro, relógio, anéis grandes e medalhão geométrico legíveis. **Há duas curvas de correntes cubanas grossas discerníveis no peito; não três camadas distintas como exige a ficha.** O rosto também tem mandíbula muito quadrada e expressão severa, enquanto a ref. 11 tem contorno mais oval/arredondado; a direção facial aproxima-se de uma caricatura genérica da família. | Adicionar uma terceira corrente grossa com queda própria entre as duas existentes, sem fundir as camadas. Ajustar somente a cabeça: mandíbula menos quadrada, bochechas/contorno mais ovais conforme ref. 11, preservando idade adulta e distinção de Jair. |

## Limites da prova

- Todos os oito sujeitos aparecem da cabeça às solas, em vista frontal com mãos vazias e braços afastados. Nenhuma captura necessita recaptura por corte da modal.
- As duas imagens WEBP originais têm 1024×1024. As seis capturas JPEG têm 2560×1214 e mostram o sujeito em uma modal Mint; a UI ao redor pertence à captura, não foi tratada como textura do asset.
- A projeção frontal permite ver dedos/polegares e silhuetas, mas não prova separação geométrica de todos os dedos, ausência de interseções, costas, contato real dos pés ou geometria dos adornos.
- Brasil/cultura: os rostos solicitados, faixa presidencial e combinações Mandrake são reconhecíveis nesta apresentação. Não foi realizado teste na distância de jogo nem em proporção 3:2 do gameplay.
- Nenhum GLB deste lote foi analisado nesta revisão. Polycount, materiais exportados, pivô, escala, skin weights, rig, animações, custo mobile e compatibilidade do engine permanecem sem validação.

## Identificação do lote revisado

SHA-256 das imagens de entrada, para não confundir uma correção posterior com esta revisão:

| Slug | SHA-256 |
|---|---|
| lula-na-regua | `f4d91c302bc0012f19c66bca011198ff87199688ddbafe7781f1dee993546300` |
| lula-cyborg | `dece230085914970c305e8881be839efb452eccb35e526b7980e506f5737fff5` |
| bolsonaro-cyborg | `1edd15107ad3a9e951b5c63e277085d681b513b78a17a793721b5220b2438591` |
| aljuiz-toga-mandrake | `7cc36215e4bd20d2419b06e270688bd1e1e0f440396ab253c7904e8a144a00c9` |
| lula-mandrake | `cddfb2186c1ec1f33db3aff2fddfe39535260201987e2cbd62fed3154b5bbb7c` |
| bolsonaro-mandrake | `1a28e0dca2fd5e2cd42b21a7249996780b1bd4c460c4d56f6e5eb8b497d84aab` |
| michelle-mandrake | `fa7ea07f6f9714b82a30bf96054860ce59e60c813453b24f0a35762361822f08` |
| zero-um-mandrake | `7ccd9dad2af217011a00cc7436ffea53341a73198032381930d70994db96121b` |
