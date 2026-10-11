# Revisão independente dos rigs Mint

Data: 11/10/2026. Fonte: `/Volumes/Zenith/Projects/game/corosolto/csbrasil/private-assets/treta-store/mint/`.

Escopo: GLBs privados Idle, somente leitura; inspeção binária/JSON, vínculo mesh–skin, joints/weights e variação dos canais. Não é validação Khronos completa, compatibilidade com os rigs do jogo ou aceite de gameplay.

| Asset | Bytes | Juntas / nodes mesh+skin | Vértices ponderados | Erro máximo soma pesos | Clip / duração | Canais variáveis / total | Juntas influentes com movimento | Resultado |
|---|---:|---|---:|---:|---|---|---:|---|
| bolsonaro-drip-idle.glb | 3,892,872 | 24 / 1 | 6,948 | 1.34e-07 | Armature\|Idle\|baselayer / 4.000000 s | 23 / 66 | 22 | APROVADO nestes checks |
| michelle-idle.glb | 3,203,000 | 24 / 1 | 6,622 | 1.12e-07 | Armature\|Idle\|baselayer / 4.000000 s | 23 / 66 | 22 | APROVADO nestes checks |
| lula-drip-idle.glb | 3,458,564 | 24 / 1 | 3,504 | 1.32e-07 | Armature\|Idle\|baselayer / 4.000000 s | 23 / 66 | 21 | APROVADO nestes checks |
| janja-idle.glb | 3,087,108 | 24 / 1 | 6,602 | 1.34e-07 | Armature\|Idle\|baselayer / 4.000000 s | 23 / 66 | 22 | APROVADO nestes checks |
| senador-idle.glb | 3,252,396 | 24 / 1 | 7,094 | 1.14e-07 | Armature\|Idle\|baselayer / 4.000000 s | 23 / 66 | 22 | APROVADO nestes checks |

Conferências: cabeçalho glTF v2 e comprimento; JSON válido; chunks/bufferViews/accessors em alcance; skin com 24 juntas únicas na cena ativa e 24 inverse bind matrices finitas; malhas vinculadas à skin com JOINTS_0/WEIGHTS_0 VEC4 e counts iguais a POSITION; índices em 0–23; pesos finitos em [0,1] e soma próxima de 1; tempos crescentes; quaternions não nulos; variação de rotação medida com equivalência q/−q; canais variáveis atingindo juntas com influência real nos pesos.

Tempos dos cinco Idle: primeira chave 0,033333 s; última chave 4,033333 s; duração efetiva 4,000000 s. O endpoint não é a duração. Todos os accessors foram lidos, com verificação de limites e valores finitos; índices da geometria também estão no alcance de POSITION. Lula tem a junta `Spine` sem pesos diretos; isso não invalida a skin de 24 juntas.

Amplitude relativa à primeira chave (unidades locais de cada junta):
- bolsonaro-drip-idle.glb: maior desvio angular 56.257849°, maior delta de translação 2.541797; erro máximo da norma quaternion 3.94e-08; pesos somam 0.999999866–1.000000127.
- michelle-idle.glb: maior desvio angular 56.257850°, maior delta de translação 2.554739; erro máximo da norma quaternion 3.97e-08; pesos somam 0.999999896–1.000000112.
- lula-drip-idle.glb: maior desvio angular 56.257849°, maior delta de translação 2.531141; erro máximo da norma quaternion 3.64e-08; pesos somam 0.999999868–1.000000104.
- janja-idle.glb: maior desvio angular 56.257850°, maior delta de translação 2.557454; erro máximo da norma quaternion 4.01e-08; pesos somam 0.999999881–1.000000134.
- senador-idle.glb: maior desvio angular 56.257849°, maior delta de translação 2.543829; erro máximo da norma quaternion 3.91e-08; pesos somam 0.999999886–1.000000104.

Identidade dos arquivos SHA256:
- `bolsonaro-drip-idle.glb`: `0e91e3e378f923aed78f5350c923f0920038af1266e5dfa4b14e3a1fb03cf1b3`
- `michelle-idle.glb`: `446032a287c4505003239dbdccdf66ae282d7e1c31313b61b67528419a9d486b`
- `lula-drip-idle.glb`: `40d9de728add08f1a0d13bb46c694e54c78b5758b8f7c5200ab09576ff6b3b35`
- `janja-idle.glb`: `eee9a275085c60bd8db8b9695f6d7912ffa355c4ff1a846f33fc2223a67da55e`
- `senador-idle.glb`: `278e128c97e08028c6f9f3da6201a4d5cb590885584847f28c6e7ee6605db4d9`

Arquivos avaliados: 5. Ausentes no momento da leitura: nenhum.

Limites: somente Idle local; existência dos outros cinco clips no Mint não foi verificada por estes GLBs. Capturas com playhead/poses corroboram reprodução no visualizador, mas não comprovam ciclo completo, continuidade, grip, retarget, colisão, gameplay ou funcionamento no engine. Sem alteração dos GLBs.
