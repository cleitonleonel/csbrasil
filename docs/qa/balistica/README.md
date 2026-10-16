# Diagnóstico visual de balística

Capturas da classe Game real, em 3:2 e 16:9, com Chromium/SwiftShader e viewmodel legado explícito. O personagem GLB carregou. O manifesto registra o SHA do código capturado, pontos de nove raios da escopeta, quatro rastros e ausência de pageerror. O cenário foi isolado: mundo oculto, grade auxiliar, câmera fixa, dano desativado e volumes desenhados por diagnóstico. Banners transitórios foram ocultados.

Inspeção: o volume rosa envolve uma região mais larga que o corpo visível; a esfera azul da cabeça não coincide precisamente com a cabeça animada. Ao mudar crouchF, os volumes baixam enquanto a malha permanece na mesma animação. As figuras comprovam a diferença entre geometria uniforme e aparência; não aprovam sua correspondência artística. Os rastros visíveis se sobrepõem parcialmente no ângulo escolhido; sua contagem vem também do manifesto. O bot de cada proporção pode usar um personagem diferente.

Não é partida completa, benchmark, validação de ADS/spray, agachamento animado nem aceite do runtime autorado. Faltam assets privados de viewmodel e áudio local; o diagnóstico emite aviso de importação duplicada de Three.js ao adicionar a sobreposição. Essas limitações exigem QA e playtest antes de produção.

Para repetir, na raiz do cliente, inicie Astro em 127.0.0.1:4387 com devToolbar desativada e rode `NODE_OPTIONS=--max-old-space-size=768 node docs/qa/balistica/capture.mjs`. O script abre um único navegador, processa as proporções sequencialmente e grava em /tmp/corosolto-balistica-qa. Observe as figuras; não use apenas o manifesto como aceite.

![Em pé, 3:2](1200x800-em-pe.png)
![Postura analítica agachada, 3:2](1200x800-agachado.png)
![Em pé, 16:9](1280x720-em-pe.png)
![Postura analítica agachada, 16:9](1280x720-agachado.png)


## Rerrota após destino inalcançável

![Trajetória do Room antes e depois](reroute-before-after.png)

Trilhas de 109–120 s do mesmo bot, mapa e semente da régua autoritativa.
Rosa indica as amostras de rota unitária. O mutante restaura somente o prazo
antigo e reproduz a permanência nesse estado; a correção mantém deslocamento
contínuo e não produz essas amostras. As trajetórias completas divergem porque
as decisões de rerrota mudam a partida. É inspeção da simulação, sem renderizar
personagens; não aprova animações ou substitui o QA com assets autorados.

## QA posterior com assets autorados

A rodada de 15/10/2026 passou a usar os 63 arquivos autorados verificados,
156 capturas, agachamento animado, ensaio automatizado de TTK/dispersão e
trace completo das três rajadas curtas. O [relatório e os dados](autorado/README.md)
registram a correção de postura e as pendências visuais; não substituem este
registro histórico nem aprovam todas as empunhaduras.
