# TRETA lote 2 — revisão independente dos oito GLBs Idle

**APROVADO nos checks binários delimitados para os oito arquivos.** Aplicada asset-review, com o veto antigo a figuras públicas substituído pelo pedido nominal atual conforme a ficha. Esta etapa não reabre a direção visual já aceita; capturas de modelos e animations/*six-clips.jpg servem apenas como contexto.

Arquivos lidos somente: ../glb/*.glb. Parser e resultados salvos somente neste diretório privado, sem editar assets, JSON/ledger do projeto, Mint/UI ou Blender.

| Arquivo | Vértices / triângulos | Juntas com peso / juntas em movimento global | Canais variáveis / total | Idle | Erro máximo soma pesos | Veredito |
|---|---:|---:|---:|---:|---:|---|
| aljuiz-toga-mandrake-idle.glb | 6822 / 4920 | 24 / 24 | 23 / 66 | 4 s | 1.215e-07 | APROVADO |
| bolsonaro-cyborg-idle.glb | 3384 / 4902 | 24 / 24 | 23 / 66 | 4 s | 1.192e-07 | APROVADO |
| bolsonaro-mandrake-idle.glb | 6650 / 4933 | 24 / 24 | 23 / 66 | 4 s | 1.285e-07 | APROVADO |
| lula-cyborg-idle.glb | 3414 / 4862 | 24 / 24 | 23 / 66 | 4 s | 1.267e-07 | APROVADO |
| lula-mandrake-idle.glb | 6791 / 4954 | 24 / 24 | 23 / 66 | 4 s | 1.248e-07 | APROVADO |
| lula-na-regua-idle.glb | 6940 / 4971 | 24 / 24 | 23 / 66 | 4 s | 1.267e-07 | APROVADO |
| michelle-mandrake-idle.glb | 7353 / 4981 | 24 / 24 | 23 / 66 | 4 s | 1.197e-07 | APROVADO |
| zero-um-mandrake-idle.glb | 6958 / 4915 | 24 / 24 | 23 / 66 | 4 s | 1.220e-07 | APROVADO |

## Checks efetivamente realizados

- GLB magic glTF/version 2/length exata; duas chunks JSON+BIN alinhadas; JSON asset 2.0; buffer embutido e padding consistente; todos os bufferViews/accessors dentro dos limites; stride/alinhamento/componentes/count e valores finitos. Sem extensões obrigatórias, sparse ou buffers externos nesses arquivos.
- Um node de malha vinculado à skin no scene ativo, juntas únicas e alcançáveis, hierarquia sem ciclo/parent duplicado. InverseBindMatrices FLOAT MAT4 com 24 matrizes finitas e não singulares.
- POSITION/JOINTS_0/WEIGHTS_0 possuem contagens coincidentes; JOINTS_0 VEC4 inteiro não normalizado, índices 0–23; WEIGHTS_0 VEC4 FLOAT finitos, não negativos e até 1; somas próximas de 1, sem vértice de soma zero. Índices de triângulos válidos. Cabeçalhos das três imagens embutidas PNG/JPEG reconhecidos.
- Um único clipe local Armature|Idle|baselayer por arquivo; 66 canais LINEAR com targets válidos e únicos, outputs TRS compatíveis e 121 tempos compartilhados estritamente crescentes. Primeiro tempo 0,033333335 s, último 4,033333302 s: duração calculada por último menos primeiro, aproximadamente 4 segundos.
- Quaternions normalizados; maior erro de norma do lote 4,113e-8. A variação rotacional foi medida por ângulo com abs(dot(q0,q)), tratando q e -q como a mesma rotação; não conta mera troca de sinal como movimento. Nenhuma troca adjacente de sinal detectada neste lote.
- 23 canais variáveis: 22 juntas com peso variam localmente; a composição da hierarquia transmite movimento global às 24 juntas com influência positiva. FK calculado nos 121 keyframes. Skinning calculado em 256 vértices distribuídos e 16 frames por arquivo demonstrou deslocamento não nulo: máximos de 0,674 a 0,834 unidades do espaço GLB, sem afirmar escala do engine ou qualidade de Idle.

## Montagem e Head

Todos: um objeto de malha char1, um mesh, uma primitive, um material e três imagens. Corpo/roupas/adornos não aparecem como nodes/meshes acessórios independentes. Isso demonstra montagem em um objeto único; não certifica solda topológica, conectividade de todas as peças ou quais pixels/triângulos pertencem a cada acessório. Remover boné/óculos/correntes individualmente não é uma operação de esconder um node dedicado nesta exportação.

Head existe como node 2, índice 5 da skin, é animado e tem pesos positivos em todos os arquivos: é um ponto estrutural observável para anexar um novo item à cabeça. Offset, orientação, escala e resultado visual de um item anexado ainda exigem teste. O rig tem mãos, mas não ossos individuais dos dedos; não é prova de animação de dedos.

| Arquivo | Slots de influência positiva no Head |
|---|---:|
| aljuiz-toga-mandrake-idle.glb | 2149 |
| bolsonaro-cyborg-idle.glb | 874 |
| bolsonaro-mandrake-idle.glb | 2190 |
| lula-cyborg-idle.glb | 535 |
| lula-mandrake-idle.glb | 2005 |
| lula-na-regua-idle.glb | 2029 |
| michelle-mandrake-idle.glb | 2278 |
| zero-um-mandrake-idle.glb | 2052 |

## Identificação dos arquivos

| Arquivo | Bytes | SHA-256 |
|---|---:|---|
| aljuiz-toga-mandrake-idle.glb | 3589272 | `953a43b33547f9f1738b5c2b1cff78f7464fb91b980b05f8fa7a4e38a482dd74` |
| bolsonaro-cyborg-idle.glb | 3401484 | `267862859a058d71742fb2f751304f2e7883785317e96c770358654d1031c679` |
| bolsonaro-mandrake-idle.glb | 4514952 | `0aea95c67f8da82947cff19c3037ae4a28a3ebb2d46dc412bb9e74df8e116212` |
| lula-cyborg-idle.glb | 4009960 | `541bcd7c149c3c7b4ee51db12ac6ebac31b706dab597d6d4de73727fd82268fd` |
| lula-mandrake-idle.glb | 3612068 | `ebef952f5e59bc971c1e2fd3d00aa56c7c3980ccbdda82d59fa50963e6c82a10` |
| lula-na-regua-idle.glb | 3312944 | `91a1f6a9ba1a4fef5ba23be85b79a6e66458fb730df4534259ba395c3a40413c` |
| michelle-mandrake-idle.glb | 3213428 | `7d69804a955cca5412959c3763f2ae6487059b558a557320abbc1827e1eed393` |
| zero-um-mandrake-idle.glb | 3807800 | `34b1581e2c4942d4a2154c1341ded186c22e516d609902f8487abd39a635cb9d` |

## Limites

Somente oito Idle estão presentes/localmente analisados. As capturas da UI mostram ANIMATIONS (6), mas não comprovam seis clipes dentro de cada GLB nem 48 arquivos baixados. Não foram analisados os demais clipes, retarget, skeleton mapping do engine, root motion/loop seamless, transições, deformação visual ao longo do movimento, colisão, ground contact, desempenho mobile ou gameplay. Não foi executado Khronos glTF Validator completo nem decoder de pixels/validação completa de imagens; os checks de estrutura são os explicitamente listados. A prova binária de movimento não equivale à aprovação de qualidade da animação.

Reprodução: python3 inspect_idle.py; resultados completos em results.json.
