# Coleção comum TRETA$: 30 itens

Pesquisa de 12/10/2026. Todos são conceitos, sem preço, GLB, compra ou compatibilidade liberada. O preço de 800 T$ das skins de personagem não define preço de roupas. A ficha JSON é a fonte dos 30 IDs; o painel HTML mostra estudos vetoriais de cor, forma e texto.

## Direção visual

Bonés de aba curva, camisetas de corte solto, partes inferiores com volumes claros e tênis de silhueta original. Estampa grande e poucos detalhes para leitura no jogo. As cinco camisetas regionais usam as frases do usuário; cada uma tem paleta própria. Reutilizar malhas entre variações de cor e estampa. Os símbolos ilustrados e bordados finais ainda precisam ser produzidos.

## Catálogo

| Nº | Nome | Categoria | Direção |
| --- | --- | --- | --- |
| 01 | Boné O Brasil é dos brasileiros | boné | Bordado branco frontal; lateral com pequeno T$. |
| 02 | Boné Make America Great Again | boné | Bordado frontal em duas linhas; mesma base geométrica do boné Brasil. |
| 03 | Boné Banco Master | boné | Proposta tipográfica azul escura; desenho de marca definitivo pendente de referência visual. |
| 04 | Boné SUS | boné | Branco, letras azuis grandes, aba azul. |
| 05 | Boné Zé Gotinha | boné | Frente com patch do personagem; desenho final ainda a produzir. |
| 06 | Boné TRETA$ | boné | Preto com bordado dourado e detalhe de costura. |
| 07 | Boné Canarinho | boné | Amarelo com aba verde; símbolo original a desenhar. |
| 08 | Boné Respawn Brasil | boné | Cru com tipografia azul e etiqueta verde. |
| 09 | Meu país é o Nordeste | camiseta | Areia e terracota; pequeno sol original na manga. |
| 10 | Meu país é o Sul | camiseta | Verde escuro e letras claras; faixa fina no ombro. |
| 11 | Meu país é o Centro-Oeste | camiseta | Ocre e grafite; detalhe geométrico original. |
| 12 | Meu país é o Norte | camiseta | Verde floresta com azul discreto na gola. |
| 13 | Meu país é o Sudeste | camiseta | Azul ardósia e creme; detalhe urbano abstrato. |
| 14 | Salve o SUS | camiseta | Frase do usuário em azul grande; símbolo final separado da arte da referência. |
| 15 | Vacina no peito | camiseta | Patch Zé Gotinha no peito e frase nas costas; ilustração final pendente. |
| 16 | Feito no Brasil | camiseta | Amarelo, gola verde e pequeno T$ na barra. |
| 17 | Respawn Brasil | camiseta | Branco e azul; marca original do jogo. |
| 18 | Não é bug, é treta | camiseta | Preto com frase amarela; leitura forte no torso. |
| 19 | Coro Solto | camiseta | Vinho e creme; assinatura do jogo nas costas. |
| 20 | Canarinho de plantão | camiseta | Verde e amarelo; emblema original de pássaro ainda a desenhar. |
| 21 | Calça Cargo Cerrado | calça | Bolsos laterais largos, joelhos articulados e barra estreita. |
| 22 | Calça Asfalto | calça | Cargo preta, faixa cinza nas laterais; sem alteração de proteção. |
| 23 | Calça Jeans de Rua | calça | Jeans azul com costura dourada, corte reto. |
| 24 | Bermuda Jeans | bermuda | Denim claro, barra sobre o joelho e bolsos frontais. |
| 25 | Bermuda Bloco Brasil | bermuda | Amarelo com bloco lateral verde e detalhe azul. |
| 26 | Bermuda de Quadra | bermuda | Roxa escura, painel lilás e cordão claro. |
| 27 | Tênis Branco de Rua | tênis | Par de cano baixo com sola clara e detalhes cinza. |
| 28 | Tênis Corre Brasil | tênis | Par verde e amarelo, sola azul; silhueta original. |
| 29 | Tênis Vermelho de Quadra | tênis | Par de cano médio, biqueira clara e cadarço branco. |
| 30 | Tênis Noite da Treta | tênis | Par preto e roxo com sola violeta; sem marcas comerciais. |

## Como equipar nos personagens atuais

Auditoria estrutural de 16 GLBs (Esquerdomacho, Barbudo, Capitão e 13 skins novas): todos têm um mesh, uma primitive e um material. Ossos Head e dos pés existem em todos; corpos base usam 24 ou 26 joints e as 13 skins usam 26. Ainda não há peças de roupa nomeadas e removíveis. A contagem não comprova conectividade da topologia nem corpo completo sob a roupa. Evidência: docs/shop/ITEM-COMPATIBILITY-AUDIT.json.

- **Boné:** peça rígida ligada ao osso Head da instância do personagem. Guardar posição, rotação e escala por corpo. Cabelo e boné original exigem máscara de região ou versão de cabeça sem boné. Mandrakes com boné fundido precisam dessa adaptação.
- **Camiseta:** SkinnedMesh usando o esqueleto real do personagem e pesos transferidos/ajustados para torso e braços. Cobrir/ocultar a camiseta antiga por faces, com máscara testada por corpo. Esconder o material atual inteiro esconderia o personagem. Não sobrepor duas camisetas sem preparar a base.
- **Calça ou bermuda:** mesmo slot bottom; selecionar uma substitui a outra. Malha deformável ajustada a quadril, pernas e joelhos, com corpo visível consistente sob a bermuda.
- **Tênis:** um item equivale ao par. Encaixar nos ossos dos pés e, quando necessário, deformar tornozelos com pesos. Validar sola, altura e contato com o chão.
- **Armas:** acabamentos de cor/material podem vir em coleção própria. Clonar materiais por instância e preservar geometria funcional, stats, recuo, grip e ADS. Não fazem parte destes 30.

No runtime, glbchars.js já clona o esqueleto por personagem e localiza Head para ancoragem. Usar esse ponto como base, com perfil de encaixe por corpo; nomes de ossos iguais não garantem medidas ou bind pose iguais. Evitar novo esqueleto independente em cada camiseta.

## Armário e multiplayer propostos

Fluxo: selecionar personagem → selecionar categoria → experimentar na prévia → comprar → equipar. Slots head, top, bottom e feet; cada slot oferece Restaurar original. Trocar personagem remove ou sinaliza peças incompatíveis, sem encaixe automático improvisado. No MP, aplicar o conjunto no spawn ou próximo respawn, preservando a partida em andamento.

Hoje a API persiste uma skin de personagem. A composição por slots ainda precisa de catálogo/inventário/equipamento no servidor, validação de propriedade e compatibilidade, versão do conjunto e IDs assinados no ticket/roster. Nunca aceitar caminho GLB ou item declarado pelo navegador como prova de posse. Recarregar a conta e outros jogadores devem receber o mesmo conjunto. Roupas comuns são cosméticas e não alteram atributos.

## Produção por fases

1. Preparar o Esquerdomacho como corpo piloto: regiões head/top/bottom/feet e base sem as roupas substituíveis. Preservar versão original. Ainda não afirmar corpo modular pronto.
2. Produzir um conjunto: boné SUS, camiseta Nordeste, bermuda de quadra e tênis branco. Validar ajuste em idle, corrida, agachamento, salto, morte e arma empunhada.
3. Liberar os quatro slots em ambiente de teste, com duas contas MP, propriedade, exclusividade de bottom, persistência e retorno ao original. Medir carga de assets e render no mobile.
4. Derivar as 30 variações usando cerca de 7 famílias de geometria: cap-curvo, tee-solta, pants-cargo, pants-jeans, shorts-solta, shoe-low e shoe-high. Criar ajustes por família de corpo, não prometer os 16 com uma peça universal.
5. Aprovar imagens e movimentos por revisão independente antes de ativar compra. Registrar matriz item × corpo × animação, com falhas explícitas.

O schema tools/spec.mjs só aceita time/mapa, com papel/arma/mecânica. Esta é uma ficha de itens e pesquisa, sem marcador falso de time e sem alegar os portões de asset gerado. Antes de Mint/Blender, formalizar o contrato de item e os portões de encaixe. Nenhum crédito Mint consumido nesta pesquisa.

## Referências visuais e procedência

Fotos consultadas ficam em references/treta-common-30, ignorada pelo Git, com FONTE.md e hashes. As ilustrações do painel são estudos originais e simplificados. Não reproduzem fotos como texturas. Banco Master é sugestão de boné; produto real não foi confirmado. Manual SUS completo e aplicação de marca ainda não revisados.

### Boné O Brasil é dos brasileiros

[Consultar fonte](https://www.poder360.com.br/poder-governo/apos-ministros-lula-posa-com-bone-o-brasil-e-dos-brasileiros/)

Foto consultada: boné azul vivo, aba curva e frase branca em duas linhas.

### Boné MAGA: referência de vendedor

[Consultar fonte](https://trumpstoreamerica.com/products/trump-red-make-america-great-again-hat)

Foto consultada: vermelho, aba curva, frase branca em duas linhas. Não verificada afiliação oficial do vendedor.

### Meu Lugar personalizável: Brazi

[Consultar fonte](https://www.usebrazi.com.br/brazi/product/meu-lugar-personalizavel)

Página de produto consultada: permite cidade, estado ou região. As cinco frases Meu país é... são propostas do usuário. Foto do produto não carregou.

### Marcas: Ministério da Saúde

[Consultar fonte](https://www.gov.br/saude/pt-br/centrais-de-conteudo/manual-de-marcas)

Índice oficial de marcas localizado; manual completo não inspecionado.

### Zé Gotinha: Ministério da Saúde

[Consultar fonte](https://www.gov.br/saude/pt-br/campanhas-da-saude/vacinacao/imagens/ze-gotinha-1.png/view)

Imagem oficial consultada: personagem branco com topo de gota, olhos grandes e SUS azul no peito.

### Banco Master: documento institucional

[Consultar fonte](https://www.bancomaster.com.br/arquivos/Relatorio_de_Ouvidoria_2o_semestre_2024.pdf)

Documento institucional localizado como referência para marca. Boné real não confirmado; conceito de boné proposto pelo usuário. PDF não inspecionado visualmente.
