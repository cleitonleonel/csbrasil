# Referências físicas e abstrações do arsenal

A ficha em `public/js/data/weapon-profiles.js` separa referência, cartucho, ação
mecânica, conveniência de segurar o botão, perfil de dano e saque. São referências
adotadas para representar o arsenal, não identificação das malhas. Os nomes
fictícios continuam no jogo. A [matriz gerada](ARMAS-MATRIZ.md) mede a configuração
executada; não converte energia, calibre ou capacidade de ferimento em HP.

A PT-38 fictícia usa a PT-938 .380 ACP como referência; a carabina usa a Rossi R92
.357 Magnum; a LMG usa a Minimi 5.56; a Rem700 usa o Model 700 .308. A SCAR fica
explicitamente na família H, em 7,62×51. A M400 representa a configuração militar
com seleção de tiro, e não a TREAD civil exclusivamente semiautomática. O revólver
.38 continua genérico: não se atribui uma variante específica à malha.

## O que os perfis preservam

Ação física e entrada são coisas distintas. SVD e SKS representam armas
semiautomáticas, mas conservam a repetição por botão mantido adotada no jogo.
O perfil da G3SG1 também conserva essa conveniência. A M3 representa o modo pump;
o modelo real também oferece operação semiautomática. O saque é tempo de gameplay,
não medição de uma pessoa manipulando a arma real.

Luneta não escolhe o perfil de dano. Rem700, G3SG1 e M400 declaram `rifle`
explicitamente para preservar a configuração vigente, apesar de possuírem luneta.
AWP, Mosin, SVD e SKS preservam o perfil `sniper`. Uma eventual migração exige
comparar BTK/TTK e a função da arma; não decorre automaticamente do nome ou da mira.
A ficha da faca mantém a compatibilidade do resolvedor de tiros, enquanto seu
combate offline e a matriz usam o caminho próprio de corpo a corpo.

Cadências, pentes, recargas, spread, dano e recuo continuam sendo escolhas de FPS.
A FAMAS conserva a redução intencional de cadência em relação à referência física;
a MP5 e a P90 têm referências de cadência documentadas pelos fabricantes. Isso
não transforma o ritmo do jogo em uma medição de cadência prática de combate.
Pentes da PT-38, UZI e M400 são abstrações da configuração atual. Ferrolho não
implica retirar automaticamente a luneta; a convenção visual vigente é preservada.

## Procedência

Os documentos abaixo orientam as famílias e variantes; não fornecem os valores de
HP, spread, mola de câmera ou queda de dano do jogo. URLs e catálogos foram
consultados em 14/10/2026. Referências históricas de variantes devem ser conferidas
novamente antes de qualquer ajuste físico mais específico.

- [Taurus, ficha da PT-938](https://taurusarmas.com.br/download/detalhes/fichas-tecnicas-pistolas/arquivo/235): referência .380.
- [Rossi, catálogo 2023](https://rossiusa.com/images/catalog/Rossi_2023_Catalog.pdf): família R92 em .357.
- [FN, Minimi 5.56 Mk3](https://fnherstal.com/app/uploads/sites/2/technical-data-fn-minimi-556-mk3.pdf), [SCAR-H PR](https://fnherstal.com/app/uploads/technical-data-fn-scar-h-pr_0.pdf) e [P90](https://fnherstal.com/app/uploads/sites/2/technical-data-fn-p90_0.pdf): famílias e cartuchos distintos.
- [Remington, história do Model 700](https://www.remarms.com/firearm-history/model-700-history): família de ferrolho e configuração .308.
- [SIG, catálogo militar 2021](https://www.sigsauer.com/media/sigsauer/resources/2021_GDS_CATLOG.pdf) e [manual M400 TREAD](https://www.sigsauer.com/media/sigsauer/resources/OM-M400-TREAD-1703485-01_REV_04_PENDING_WEB_UPDATE_1.pdf): a variante precisa preceder a escolha de ação.
- [Benelli, manual M3](https://www.benelliusa.com/sites/default/files/content/media/manuals/2019-10/M3%20Convertible%20Semi-Auto%20Pump%20Shotgun%20Product%20Manual.pdf): os dois modos de funcionamento.
- [HK, MP5](https://www.heckler-koch.com/en/Products/Military%20and%20Law%20Enforcement/Submachine%20guns/MP5): cartucho e cadência da família.
- [Exército dos EUA, M4A1](https://cpeground.army.mil/Equipment/Equipment-Portfolio/PM-SL-Portfolio/M4A1-Carbine/), [Marines, manual de equipamento estrangeiro](https://www.govinfo.gov/content/pkg/GOVPUB-D214-PURL-LPS42016/pdf/GOVPUB-D214-PURL-LPS42016.pdf) e [Infantry, julho/agosto de 2006](https://www.benning.army.mil/infantry/magazine/issues/2006/JUL-AUG/pdfs/JUL-AUG2006.pdf): referências de famílias M4, AK/SKS e Mosin.
- [Ministério da Defesa, catálogo de defesa brasileiro 2019](https://www.gov.br/defesa/pt-br/assuntos/industria-de-defesa/seprod/servicos-e-informacoes/arquivos/Guia_de_empresas_e_produtos_de_defesa_2019.pdf): IMBEL e família MD97.
- [Defesa francesa, FAMAS](https://www.defense.gouv.fr/en/node/1654): referência de cadência física; a redução do jogo é deliberada.
- [IWI, catálogo 2020](https://iwi.net/wp-content/uploads/2021/03/IWI-2020-Catalog-Web-Ready.pdf) e [Tavor CTAR](https://iwi.us/?p=99669): famílias UZI e Tavor; a ficha não transfere dados de UZI Pro para variantes antigas.
- [Magnum Research, ficha técnica](https://magnumresearch.com/PDF/ST0313.pdf): Desert Eagle Mark XIX em .50 AE.

A ficha AW/AWP e as variantes históricas G3/G3SG1 ainda precisam de documentação
primária histórica acessível para detalhar versão, cano ou cadência. Nenhuma
recalibração desses parâmetros é justificada pela documentação disponível aqui.
Não se atribuem velocidades iniciais ou coeficientes balísticos a malhas genéricas.

## Limites da simulação

O tiro é hitscan: decide interseção por raio, enquanto o traçante é efeito visual.
Não há trajetória física com tempo de voo, gravidade, arrasto ou zeragem. A queda
de dano por distância é uma curva de gameplay e não queda vertical do projétil.
Os perfis explicitam decisões; não acrescentam uma simulação física externa.

## Travessia conservadora

A autorização continua limitada à AWP e às superfícies configuradas em
`public/js/data/weapons.js`. A espessura é medida ao longo do raio no espaço
local da malha, preservando metros do mundo mesmo com rotação e escala não
uniforme. Só caixas completas, de material único e geometria canônica, são
autorizadas. Caixas abertas, deformadas, com recorte de drawRange, instâncias,
skinning ou morfologia desconhecida bloqueiam. A saída não pode ser confundida
com uma entrada observada de dentro da própria caixa.

Outra caixa delimitadora que toque o trecho atravessado bloqueia conservadoramente.
Isso evita atravessar um segundo sólido cuja entrada esteja antes da saída do
primeiro. Em malhas irregulares ou unidas, a caixa delimitadora pode bloquear
um corredor que os triângulos deixariam livre; não há inferência de espessura
nesses volumes ambíguos. Depois da saída, o próximo bloqueador continua vencendo
um combatente mais distante. Só o primeiro combatente recebe dano.

O cliente online continua sem aplicar dano ou prever travessia local. A consulta
não resolve genericamente um atirador já dentro de uma malha arbitrária quando
o combatente aparece antes da primeira superfície raycastada; o resolvedor
de travessia rejeita entrada interna, sem afirmar que substitui o sistema de
colisão ou toda consulta de mundo.

`eval:penetration-geometry` mede o consumidor de tiro real em cenas primitivas,
sem carregar mapas. A régua cobre rotação, pai transformado, escala, incidência
oblíqua, malha aberta/deformada, material em array, recorte de faces, dois sólidos
sobrepostos/adjacentes, primeiro alvo e as guardas de arma/modo online.
