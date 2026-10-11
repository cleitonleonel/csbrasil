# Moedas: referência de cunhagem clássica

O dono enviou a foto `1000190033.jpg` depois da prévia frontal v3. A direção passa
a ser retrato de perfil esculpido, campo liso, letras serifadas em arco, aro fino
e ouro da mesma liga; luz/sombra devem definir os detalhes. A referência é de
acabamento/composição, não um pedido de copiar retrato real, inscrições ou textura.
Continuam rosto/personagem na frente e denominação/T$ no verso, sete valores e
personagens, CoinSpin/PurchaseReveal. Não equivale a aprovação do protótipo v3.

## Estudo anterior v4, reprovado

Gerador de estudo: `tools/blender/prototype_treta_profile_coin.py`, executado no
Blender headless isolado. Retrato analítico original inspirado no avatar Saci;
o `.webp` é referência, não textura de rosto. Material de ouro uniforme com
sombreamento de cavidades derivado da geometria para o renderizador sem sombras
de contato nos ícones. Não usa pixels do retrato/texto da moeda fornecida.

Artefatos persistentes em
`/Volumes/Zenith/Projects/game/corosolto/csbrasil/private-assets/treta-store/coins/profile-v4`:
foto e `reference_manifest.json`, `source_analysis/style.json`, fonte `.blend`,
GLB/JSON, renders frente/verso/ângulo, preview/checks de browser e parecer privado.
Metadados atuais em `coin-1.json` registram hashes, bytes e triângulos; confirmar
contra o binário antes de consumir. Referência de personagem:
`references/treta-coins/saci.webp`, SHA256
`e043898e7446a78fc321f5e2a2d62a76bfc01be26a60bffa9c650afa3aa726a6`.

Estudo atual: 2.703.908 bytes, 112.592 triângulos, dois materiais, uma imagem
embutida, dois clipes; SHA256 do GLB
`f1d88c7ad4897692c263bd44087cafa27a2f32217d0220cba7358d18b219528f`.
Geometria para estudo de superfície, mais pesada que os assets anteriores.
Não é candidato de performance aprovado para carteira, toast ou mobile.

Perfil extraído da malha existente rejeitado internamente por perder a face:
`rejected-source-profile`. Primeiro perfil analítico reprovado pelo crítico por
face genérica/derretida, campo com degraus, valor apagado e retrato pequeno:
parecer/capturas em `rejected-soft-profile`. Composição clássica aproveitável,
mas não repetir o lote com essa escultura. Revisões seguintes corrigem o arco
tipográfico, transformações do mesh para enquadramento, fechamento circular do
campo e sulcos/sombreamento. Parecer final privado `design-review.md` reprova
a frente por identidade genérica e o verso por reflexo que apaga o 1 em 64/82px.
Enquadramento aprovado somente nas 392 amostras e 18 frames verificados.

## Verificação

Preview real TretaStage local em `http://127.0.0.1:5189/`, separada do jogo e sem
saldo real. Script `browser-check.cjs` captura frente/verso/reveal em 1200×800;
`cycle-check.cjs` percorre 49 amostras por clipe em quatro tamanhos/estágios,
salva 392 medidas de borda e 18 frames. Contact sheet e relatórios são evidência
de amostras desktop, não uma aprovação estética ou benchmark de aparelho móvel.
Última execução: sem erros de página, transformações reais dos dois clipes,
392 amostras sem pixels tocando a borda (mínimo 2 px). Fonte Python, ficha e
`git diff --check` passaram; bytes/hash/imagem embutida/clipes conferidos.

Somente um estudo Saci/1 privado. As sete moedas públicas não foram substituídas;
acabamento facial, leitura, geometria para produção e desempenho continuam
pendentes. Nenhuma nova geração paga, cena Blender nativa, outra lane, merge ou
deploy neste estudo. Próximo: gerar uma única base de escultura no Mint com
os créditos já autorizados, preservando identidade Saci e a cunhagem de perfil;
revisar antes de repetir nas sete e otimizar antes de produção.


## Prova atual: Mint + relevo reconstruido

A previa Mint lateral `saci-fresh-profile-preview.webp` passou identidade/perfil
somente como direcao. Tripo P1 perdeu definicao; Rodin v2.5 gerou uma matriz de
500000triangulos/61375400B. Ambas as conversoes3D tiveram acabamento reprovado
independentemente. Fontes e pareceres permanecem em `coins/mint-classic-v5`.

A prova atual em `coins/mint-classic-v5/reference-locked-final` reconstrui o
contorno e detalhe monocromatico da previa Mint como superficie rasa continua
no Blender; nao e aceite da malha3D convertida nem mera colagem de imagem em um
disco plano. Profundidade e inferida, com campo limpo, arco serifado, aro fino e
verso realmente escavado com `1 T$`. Nao copia retrato/textura da moeda real.
Gerador `tools/blender/prototype_treta_mint_profile_coin.py` com `--rodin` e
`--preview-relief`; mantem originais e materiais em mesma familia de ouro.

GLB atual: 3513200B,122614triangulos,2meshes/2materiais/2imagens embutidas,
CoinSpin4,03s/PurchaseReveal2s, SHA256
`76c39a4092b4babc244fba071e3f49b8f8578866c05809bf2ccc830b26f7342f`.
Fonte `.blend`, JSON, frente/verso/angulo/borda, prototype-board.png e preview
real TretaStage em `http://127.0.0.1:5194/`. Checks de loader/transformacoes sem
erros;392amostras/18frames sem cortar o disco, margem minima2px. Mascara do
relevo contra contorno tracado da propria previa: IoU0,9778, centro1,40px de
grade; nao prova igualdade fotometrica/profundidade ou1:1 com a moeda do dono.
Parecer atual em `design-review.md` privado; status no registro de jobs.

Somente Saci/1 para revisao visual. As sete moedas publicas continuam rejeitadas;
nenhum lote, desempenho mobile, economia real ou compra integrada foi aprovado.
O ativo precisa otimizacao/bake/LOD antes producao. Proximos: feedback visual do
dono, acabamento se necessario, producao dos outros6perfis e medicao no jogo;
UI/loja seguem no chat proprio. Sem alterar outros checkouts, merge ou deploy.
