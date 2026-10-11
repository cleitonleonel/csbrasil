# Continuação — transparência Lajes e nova auditoria de mapas

Objetivo completo: restaurar a UPA reestruturada, corrigir tiros bloqueados por caixas invisíveis e manter grafite integralmente sobre paredes, sem plantas, lonas, veículos ou pintura suspensa. A etapa atual corrige o cartão opaco do mural de Lajes, preserva fotos opacas e exige novo bake e inventário integral nos 18 mapas, em média e baixa. Revisão visual, gates geométricos e partida real são evidências distintas; não há autorização de merge/deploy.

Branch: `codex/mapas-upa-tiros-grafites-20261011`. Checkpoint de material e gate: `115eb360b`; inventário e montagem Córrego: `7b8825d14`; Córrego/mapprops congelados no `c12f6416d`. Coordenação: root possui Córrego/mapprops e assets UPA; este agente possui graffiti_pass, Lajes, suas réguas e layouts gerados. Browser local Playwright autorizado e coordenado; Mint/Chrome CUA permanece com root.

## Baseline validado

O PNG real `public/img/decals/pixo-lajes-01.png` mede 288×512 RGBA, SHA256 `c6798a5e42d2ae1edfc5d1936935bfdb681a62963d0603da6c030ae0c65a075e`. Dos 147.456 pixels, 68.098 têm alpha0, 69.942 alpha255 e 9.416 alpha parcial. Seu primeiro pixel é [76,105,113,0]: RGB azul oculto, não fundo que deveria aparecer.

`graffiti-mural-alpha-check.mjs` constrói malhas reais pelos dois caminhos de produção, aplicarGrafite e pendurarMurais. Ambos desenham o PNG com transparent=false, alphaTest0 e depthWrite=true, e reprovam antes de alterar a produção. Dois controles com o JPG real do Chorão permanecem corretos e opacos. Log externo `/tmp/graffiti-mural-alpha-before.log`.

## Plano e pendências

Helper comum aos dois caminhos, limitado ao nome `pixo-lajes-01.png`: transparent=true, alphaTest0.24 (mesmo corte usado por tags PNG), depthWrite=false. Fotografias mantêm configuração opaca. A mutação em memória deve restaurar a decisão antiga e reprovar as duas montagens sem remover arte.

Capturas antes/depois em `launch-media/2026-10-11-mapas/others-review/lajes-alpha/`, com frente3:2, oblíqua16:9 e baixa3:2. Nenhuma imagem PNG será alterada.

## Milestone de material validado

Helper aplicado nos dois caminhos. Gate real ficou verde: duas montagens pixo com transparent=true, alphaTest0.24, depthWrite=false; dois controles JPG com transparent=false, alphaTest0 e depthWrite=true. Mutante em memória desliga a decisão do helper e reproduz o cartão azul em ambos os caminhos. `graffiti-support-check.mjs --self-test` também terminou exit0, preservando seus controles de área e obstáculos.

Seis capturas reais salvas, três antes e três depois, com zero pageerrors e textura real decodificada288×512. Receipts incluem parâmetros de material e hash da passada. O agente viu frente3:2, oblíqua16:9 e baixa3:2: antes havia cartão azul, depois os vazios mostram o mesmo tijolo e a tinta continua desenhada. Browser local fechado. Arte, geometria e fotos não foram editadas. Essa revisão técnica não é aprovação visual do usuário.

Próximo passo: checkpoint focado e freeze dos assets UPA/demais fontes, seguido do bake14 recuperável e auditoria18 med/low com detector ampliado. A mudança da passada invalida o fingerprint global; o layout atual ainda não pode ser chamado final. Auditoria expandida piloto anterior está REPROVADA por inventário assado ausente depois da exclusão de veículos; não relaxar contagens nem tratar como final.

Plano executável de validação preparado em `launch-media/2026-10-11-mapas/others-review/final-validation-plan.json`:10etapas,18mapas nas duas qualidades,4mutantes de desenho em cada auditoria, gate Ferro sobre layout novo e quatro poses do Córrego acima dos beirais. As poses antigas devem ser reassociadas às peças reais do novo receipt, pois retirar pintura de veículos muda índices. A assinatura do receipt agora inclui o próprio auditor e o detector ampliado de arte.
