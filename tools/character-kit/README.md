# Character kit offline — v1 draft

Ferramentas Node sem dependências novas. Nenhum comando modifica o jogo, publica itens,
ativa acessórios, compra geração ou concede propriedade de catálogo.

```sh
# Node moderno; neste ambiente /opt/homebrew/bin/node é 23.6.
/opt/homebrew/bin/node --test tools/character-kit/kit.test.mjs
/opt/homebrew/bin/node tools/character-kit/example.mjs /tmp/coro-character-example-UNIQUE
/opt/homebrew/bin/node tools/character-kit/cli.mjs validate /tmp/coro-character-example-UNIQUE/package.json
/opt/homebrew/bin/node tools/character-kit/cli.mjs plan /tmp/coro-character-example-UNIQUE/package.json test-glasses test-shirt
/opt/homebrew/bin/node tools/character-kit/cli.mjs inspect /absolute/path/character.glb
```

`example.mjs` gera GLBs de triângulo, manifesto e SOURCE.md **sintéticos**. A roupa e o
corpo reutilizam o mesmo triângulo por intenção de teste. Isso não é um humanoide,
produto, template artístico, licença comercial ou demonstração de fit. O comando
recusa sobrescrever qualquer arquivo de exemplo existente, inclusive symlinks
pendentes, e usa criação exclusiva (`wx`) em cada escrita.

Para contribuir: gere o exemplo numa pasta nova, troque cada asset/procedência,
preencha identidade e perfis reais, calcule SHA-256 dos GLBs e valide. Edite o
manifesto com base no contrato em [CHARACTER-KIT.md](../../docs/visual-factory/CHARACTER-KIT.md).
Não copie o digest fictício de rest pose para um asset real. O schema executável
é `validatePackage` em `kit.mjs`; campos desconhecidos são recusados. O formato de
contribuição não é o manifesto de runtime atual.

`validate` e `plan` recebem um `package.json`; sua pasta é a raiz permitida para
assets e evidência. Só arquivos locais relativos, sem `..`, absolutos, URLs,
backslashes ou symlinks para fora. O CLI imprime JSON e retorna exit code 1 em
falhas. Não importa scripts do pacote. Trabalhe sobre uma cópia estável; isto não
é um sandbox contra outro processo que altera arquivos simultaneamente.

`inspect` lê apenas container e metadados GLB v2: comprimento, BIN embutido,
nomes de joints, presença de atributos de skin, materiais, animações e extensões
requeridas. Recursos externos/data URI são recusados; não há rede nem execução de
extensões. Não decodifica texturas, compressão, pesos ou curvas; não mede polígonos,
FPS, deformação, offsets reais ou qualidade visual. Use o validador glTF de
Khronos e a suíte de poses/render para aceitação posterior. Os limites de 1 MiB
para manifesto e 256 MiB para leitura GLB são proteções de memória da ferramenta,
não budgets artísticos ou aprovação de assets grandes.

`plan` valida o pacote inteiro, combina apenas itens dessa contribuição e entrega
um plano **draft**, com ocultação proposta do corpo. Não aplica máscaras ao mesh.
Perfis incompatíveis exigem outro pacote/variante de fit. Exclusões podem nomear
IDs externos, mas o CLI não resolve catálogo global. Nenhuma saída aprova fit.

## Empunhadura humana, pata e mascote

O sidecar `cs-grip-profile/1` é opcional e separado do pacote v1. A anatomia
(`human`, `paw`, `mascot`) não determina se a mão tem fechamento assado,
atuadores ponderados ou nenhuma capacidade de fechar. O contrato fixa identidade
de corpo/fit/rig/arma, arquivos com hashes, regiões de contato declaradas,
espaços/unidades, política de apoio e fases de animação.

```sh
/opt/homebrew/bin/node tools/character-kit/grip-example.mjs /absolute/real-parent/NEW_DIRECTORY
/opt/homebrew/bin/node tools/character-kit/grip-cli.mjs /absolute/real-parent/NEW_DIRECTORY/grip-profile.json /absolute/real-parent/NEW_DIRECTORY/package.json
/opt/homebrew/bin/node --test tools/character-kit/grip-profile.test.mjs tools/character-kit/kit.test.mjs
```

O gerador exige pasta nova com ancestrais reais, sem symlinks. Produz somente
triângulos sintéticos; o mock de arma e os nomes de clipes não representam arte,
animações reais ou uma pega utilizável. Serve para testar a contribuição.

O leitor recusa JSON com chaves repetidas, inclusive escapes equivalentes,
arquivos JSON acima de 1 MiB e fontes acima de 256 MiB. A composição explícita também
valida o pacote legado; um pacote inválido não vira ausência de pacote.
Uma arma de uma mão exige pose livre da outra mão; apoio `unsupported` registra
incapacidade, sem aprovar a exigência de duas mãos. IK com constraints ainda é
recusado por esta versão.

Essa validação é **estrutural**: índices, pesos, canais, bind, receita de
normalização e contato/clipping reais não são verificados. A saída lista fases
ausentes e mantém `runtimeEnabled`, `contactApproved`, `fitApproved` e
`supportRequirementSatisfied` falsos. Rotular vértices e ter hashes corretos não
aprova o encaixe; render, deformação e revisão artística continuam necessários.
