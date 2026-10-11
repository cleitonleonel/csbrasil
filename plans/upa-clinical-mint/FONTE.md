# UPA clínica — procedência para o lote Mint

Consulta em 2026-10-11. Referências primárias para tipos genéricos, materiais e
contexto. Nenhum modelo comercial, marca de equipamento ou paciente é reproduzido.

| Ref. | Origem | Uso |
|---|---|---|
| R1 | [Ministério da Saúde — Programa Arquitetônico Mínimo UPA 24h, versão 3.0/2021](https://www.gov.br/saude/pt-br/composicao/saes/arquivos/2021/programa-arquitetonico-minimo-upa-24-h-versao-3-0_2021.pdf) | Setores e tipos clínicos; programa e lista de equipamentos. Não fornece as dimensões de autoria escolhidas. |
| R2 | [Ministério da Saúde — perspectivas UPA 24h](https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/u/upa-24h/projetos-de-referencia/imagens-perspectivas-da-upa-24h) | Página 2: espera e recepção; assentos verdes separados sobre longarina metálica, paredes claras, circulação central, balcão simples ao fundo. |
| R3 | [BEC/SP — longarina de três lugares, item 6447716](https://www.bec.sp.gov.br/BEC_Catalogo_ui/CatalogDetalheNovo.aspx?cod_id=6447716&origem=CatalogoPesquisa3) | Tipologia pública de longarina, assentos individuais, estrutura tubular e braços; não copiar fabricante. |
| R4 | [ANVISA / Novo PAC Saúde — relatório técnico UBS tipo IV](https://www.gov.br/anvisa/pt-br/assuntos/servicosdesaude/novo-pac-saude/ubs-porte-iv/relatorio_tecnico_ubs_tipo-iv-rev_-tma_amcl_00.pdf) | Contexto complementar de clínica pública: balcão, armário, suporte de soro, maca e biombo. UBS não é UPA. |

Arquivos locais em `references/upa-clinical-mint/`: `ms-upa-perspectivas.pdf`,
documento R2 completo; `ms-upa-interior.png`, página 2 rasterizada sem recorte ou
alteração do conteúdo. São ignorados pelo projeto, preservados nesta lane.
Comando de reprodução: `pdftoppm -f 2 -singlefile -scale-to 1400 -png ms-upa-perspectivas.pdf ms-upa-interior`.
PDF SHA-256: `5647a0a5d20acd7835b85e95f7f0ac86bff8ee9185860d18fd7e2ecec0f702e1`.
PNG SHA-256: `1cef984d158c8104ebdd52fc7a1f492df1ce2607fc884ed16f60ca08c61ce41d`.

Imagem observada: render arquitetônico, sem pacientes; duas fileiras de assentos
verdes, travessas/pés cinza, ambiente claro, cadeiras de rodas junto ao balcão.
Não se inferem medidas exatas, norma de circulação ou detalhes clínicos invisíveis.

A página oficial [Projetos de Referência](https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/u/upa-24h/projetos-de-referencia)
identifica estes documentos e declara CC BY-ND 3.0 para o conteúdo do portal.
Guardar como referência documental atribuída; não usar pixels em materiais, não
reenviar como arte a transformar e não tratar o documento como licença dos GLBs.
Prompts descrevem tipos funcionais genéricos e a direção própria do jogo.

Projeto Mint criado pelo root: [CS BRASIL UPA props](https://mint.gg/project/zd7b0v30hn2xpc5yxfcg8t5sz18g34wt).
Proveniência de cada geração pendente: asset/task ID, URL, prompt exato, modelo/preset,
data, termos/licença, download original, hash e alterações offline. Sem GLB obtido
não há asset concluído. Registro definitivo do asset deve acompanhar sua pasta.
