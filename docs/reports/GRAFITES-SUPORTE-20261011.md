# Grafites apoiados na geometria final — 11/10/2026

A arte só permanece quando todo o retângulo desenhado tem superfície visível e pintável até 5 cm atrás. Plantas, folhagens, lonas/faixas, vidro, água, placas e colisores invisíveis não recebem grafite. A regra cobre passada viva, layout assado, murais e arte manual nos 18 mapas registrados, inclusive mapas ainda parados.

## Causas corrigidas

- O baseline Ferro Velho tinha 539 peças; o auditor antigo contou 43 no ar e 14 tapadas. Uma captura mostra tags desenhadas sobre planos de folhas e sucata vazada. Evidência preservada em `launch-media/2026-10-11-mapas/baseline/`.
- 25 raios não bastavam: frestas e folhas estreitas entre amostras passavam. Produção valida a união dos triângulos reais sob toda a área do quad, incluindo drawRange, materiais por face, ancestrais visíveis e transformações/instâncias. Orçamento numérico único 1e-10×max(1,área), sem descarte de pequenos triângulos individualmente. Planta de 1 mm² tessellada em 3200 triângulos continua rejeitada.
- O primeiro bake completo foi rejeitado: validava posição/tamanho antes de arredondar os números gravados a 3 casas; muitas peças desapareciam quando carregadas. `quantizarGrafite` valida/desenha/salva os mesmos números. Margem total de 2 mm ou maior só é usada quando necessária, sem esticar a arte.
- Float32 também muda as bordas dos vértices: peça nominal de 0,4 m em x=40 se torna 0,4000015259 m. A produção valida também o retângulo lido da geometria realmente desenhada. Murais usam a transformação local; tags usam os vértices já transformados antes da junção. Arte manual mede sua geometria/matrixWorld, não apenas parâmetros declarados.
- Piscina validava antes de agrupar paredes em InstancedMesh. O agrupamento abria uma fresta de 0,596 µm após a aprovação. Batch agora precede pintura e conserva elegibilidade num flag separado; colliders/spawns/pickups e 800 raios físicos permanecem iguais. Régua causal restaura ordem antiga em memória e reproduz peça sem suporte.

## Evidência e guardas

Checkpoint desenho `f90e075b7`, robustez numérica `c0342d628`; comentáriosPT/docs `6fddd2c62`. Suporte: 58 fixtures atuais; mutante que remove guarda reprova 39 casos em cinco caminhos; mutante que remove só área exata reprova 13 casos. Auditor de área independente: 21 fixtures serializadas + 3 controles de produção. Runner de suporte/área/Pool: 3/3 verde.

O auditor navegador implementa amostragem e matemática de área próprias. Compartilha somente a classificação de superfícies. Lê vértices reais do desenho, exige textura carregada e compara inventário completo por arquivo/quad contra o bake. Verifica índices, drawRange e material único: manter metadados de uma peça ausente não pode produzir verde. `--self-test` modifica desenho real de batch e mural/manual, mantendo seus metadados, e exige quatro regressões detectadas.

O gerador revalida fontes, produtores de textura/props e hashes do acervo antes de aceitar cada mapa/final; preserva checkpoint externo por mapa. Pass global diferente exige regeneração dos 14 mapas com grafitar; quatro mapas restantes não declaram pintura automática.

## Diferenças de qualidade e robustez numérica

O recorte de triângulos gerava vértices consecutivos separados por 2,22e-16 m. Uma aresta invertida quase nula descartava um triângulo inteiro. Normalizar vértices consecutivos em até oito ULPs corrige dois casos do Ferro e as perdas de inventário em baixa qualidade de outros cinco mapas. O orçamento de área continua 1e-10; frestas de 1 mm e uma planta de 1 mm² continuam reprovando. O mutante que desliga essa normalização recupera exatamente os dois descartes falsos das fixtures do Ferro.

No Ferro, LOWQ mudava altura, giro e posição das chapas da cerca:211 painéis em média contra119 em baixa. As chapas agora são as mesmas211 em um drawcall. Reduzir cacos e tufos alterava o RNG do capim e criava plantas em novos lugares no low. As duas qualidades agora consomem a mesma sequência: baixa emite4/9cacos e3/7tufos. Os156planos de capim low são subconjunto Float32 exato dos364med, mantendo plantas como obstáculo de pintura.

Os mourões low i%3 também criavam36posições ausentes na média i%2 e descartavam14das151peças assadas. Baixa i%4 mantém55mourões como subconjunto dos106med. A geometria média permanece idêntica. O gate permanente mede todos os151quads assados nominais e Float32 na produção e no auditor independente, além dos102testemunhos extras. Os três mutantes restauram separadamente chapas antigas, RNG antigo e mourões antigos; o último reproduz exatamente as14perdas da auditoria r5-low.

No Córrego, networkidle chegava antes de TextureLoader fornecer image/source.data. O diagnóstico mediu261 peças sem imagem; um segundo depois todas carregadas, sem404. O auditor espera a textura decodificada até60s e depois continua reprovando ausência, faltou, material invisível ou desenho incompleto.

## Auditoria final

Cliente runtime `89b74eaef0b88d9cd35bca1eb102b3ee50a35fc5`; gate completo Ferro `cfa5c0638`. Bake14 r4 aprovado e rebakes apenas Ferro r5/r6 preservados:2455tags+1mural, globalpass79fa930ed975ca52. Manifesto fresco/coerente.

Rodada r6 média:18/18mapas aprovados,2460desenhos,4269,70m², zero rejeições e inventário assado integral. Quatro mutações de desenho real detectadas. Receipt `launch-media/2026-10-11-mapas/audit-r6/receipt.json`. Baixa r6 também aprovou18/18mapas,2460desenhos,4269,70m², zero rejeições, zero peças assadas ausentes e quatro mutações detectadas (audit-r6-low/receipt.json). Ferro conserva151/151assadas nas duas qualidades mais uma peça manual,152desenhos. Os hashes de todas as fontes nos dois receipts coincidem com a fonte final. As rodadas `audit-final/`, `audit-r3-low/` e `audit-r5-low/` preservam resultados REPROVADOS anteriores, sem exclusão de peças para forçar verde.

Build e gates estáticos/SEO finais passaram. Os gates específicos não equivalem a checkfast completo: MAPID tem12achados comprovados na base; audio:check não tem o acervo ignorado nesta worktree; editorial mantém4achados anteriores. A nova inserção DOLLY no Córrego foi corrigida no pool nominal e nas substituições, preservando o veto editorial do mapa.

Acervo local completo foi preservado do checkout original, inclusive arquivos já gitignored; nenhuma arte nova/licença foi criada ou atribuída nesta mudança. Build/publicação ainda precisam usar o acervo autorizado do projeto. Sem merge/deploy nem aprovação visual humana.
