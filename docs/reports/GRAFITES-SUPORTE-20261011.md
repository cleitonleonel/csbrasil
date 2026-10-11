# Grafites apoiados na geometria final — 11/10/2026

A arte só permanece quando todo o retângulo desenhado tem superfície visível e pintável até5cm atrás. Plantas, folhagens, lonas/faixas, vidro, água, placas e colisores invisíveis não recebem grafite. A regra cobre passado vivo, layout assado, murais e arte manual nos18mapas registrados, inclusive mapas ainda parados.

## Causas corrigidas

- O baseline Ferro Velho tinha539peças; o auditor antigo contou43noar e14tapadas. Uma captura mostra tags desenhadas sobre planos de folhas e sucata vazada. Evidência preservada em `launch-media/2026-10-11-mapas/baseline/`.
-25raios não bastavam: frestas e folhas estreitas entre amostras passavam. Produção valida a união dos triângulos reais sob toda a área do quad, incluindo drawRange, materiais por face, ancestrais visíveis e transformações/instâncias. Orçamento numérico único1e-10×max(1,área), sem descarte de pequenos triângulos individualmente. Planta1mm² tessellada em3200triângulos continua rejeitada.
- O primeiro bake completo foi rejeitado: validava posição/tamanho antes de arredondar os números gravados a3casas; muitas peças desapareciam quando carregadas. `quantizarGrafite` valida/desenha/salva os mesmos números. Margem total de2mm ou maior só é usada quando necessária, sem esticar a arte.
- Float32 também muda as bordas dos vértices: peça nominal0,4m em x40 se torna0,4000015259m. A produção valida também o retângulo lido da geometria realmente desenhada. Murais usam a transformação local; tags usam os vértices já transformados antes da junção. Arte manual mede sua geometria/matrixWorld, não apenas parâmetros declarados.
- Piscina validava antes de agrupar paredes em InstancedMesh. O agrupamento abria uma fresta0,596µm após a aprovação. Batch agora precede pintura e conserva elegibilidade num flag separado; colliders/spawns/pickups e800raios físicos permanecem iguais. Régua causal restaura ordem antiga em memória e reproduz peça sem suporte.

## Evidência e guardas

Checkpoint produção `f90e075b7`; comentáriosPT/docs `6fddd2c62`. Suporte:56fixtures atuais; mutante que remove guarda reprova39casos em cinco caminhos; mutante que remove só área exata reprova13casos. Auditor de área independente:21fixtures serializadas +3controles de produção. Runner de suporte/área/Pool3/3verde.

O auditor navegador implementa amostragem e matemática de área próprias. Compartilha somente a classificação de superfícies. Lê vértices reais do desenho, exige textura carregada e compara inventário completo por arquivo/quad contra o bake. Verifica índices, drawRange e material único: manter metadados de uma peça ausente não pode produzir verde. `--self-test` modifica desenho real de batch e mural/manual, mantendo seus metadados, e exige quatro regressões detectadas.

O gerador revalida fontes, produtores de textura/props e hashes do acervo antes de aceitar cada mapa/final; preserva checkpoint externo por mapa. Pass global diferente exige regeneração dos14mapas com grafitar; quatro mapas restantes não declaram pintura automática.

## Rodada final ainda em validação

Bake14 em curso com checkpoint `launch-media/2026-10-11-mapas/bake-state-r3.json`, log `/tmp/mapas-graffiti-rendered-bake.log`. Auditor18, mutações reais, imagens finais e aceite visual pendentes. O diretório `audit-final/` preserva a primeira rodada REPROVADA e não é evidência de aprovação.

Acervo local completo foi preservado do checkout original, inclusive arquivos já gitignored; nenhuma arte nova/licença foi criada ou atribuída nesta mudança. Build/publicação ainda precisam usar o acervo autorizado do projeto. Sem merge/deploy nem aprovação visual humana.
