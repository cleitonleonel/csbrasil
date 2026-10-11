# Produção Mint / Blender — coleção TRETA$

Projeto: https://mint.gg/project/zd782bweh7fqxhtyryrcg32ryx8g2zhc. Uso dos créditos existentes autorizado pelo dono em11/10 (“Só gere elas no mint. Podemos usar os créditos”). Preview e final têm cobranças separadas; conferir saldo e registrar custos, sem comprar créditos ou assinatura. Estado dos jobs no ledger CONTINUATION.md. T$800 é o preço no jogo.

## Prompt comum

Create an original, stylized adult 3D character for a colorful multiplayer shooter. Strong readable silhouette, expressive caricature likeness, detailed face, clean PBR materials and sculpted clothing, original streetwear shapes, chunky sneakers and natural adult proportions. Full body, centered neutral A pose, hands open with distinct fingers, feet on the same ground plane, no weapon fused into the mesh, no logos or text, no background geometry. Separate gold jewelry should remain readable without changing the silhouette dramatically. Prepare for humanoid rigging and animation; preserve eyes, mouth and facial features in the final mesh. This is a cosmetic character: no gameplay powers or stats.

## Cinco variantes

- **lula-drip / barbudo:** Lula caricature, gray beard and braided gray hair, visible gold grillz, several gold rings, burgundy streetwear jacket, cream oversized T-shirt, black cargo pants and cream/red sneakers. Gold jewelry and braids must be modeled, not merely painted highlights.
- **bolsonaro-drip / capitao:** Jair Bolsonaro caricature, short dark/graying hair, navy/green varsity jacket, beige cargo pants, green/cream sneakers and layered gold chains with a design distinct from Lula.
- **senador-drip / senador:** Flávio Bolsonaro/Zero Um caricature, black/violet oversized streetwear, distinct heavy gold chains, dark cargo pants and white sneakers. Face and outfit must be distinct from Bolsonaro's variant.
- **janja / dama:** Janja caricature, long brown hair and recognizable glasses, burgundy/cream urban outfit, subtle gold accessories and sneakers. Adult natural proportions. Independent face and hair rather than recoloring the Dama.
- **michelle / julia-zanatta:** Michelle Bolsonaro caricature, medium-length dark brown hair, blue/green urban outfit, distinct subtle gold jewelry and sneakers. Adult natural proportions. Independent face and hair rather than recoloring Julia.

## Entrega e ativação

1. Registrar ids Mint, custo efetivo, originais e referências em FONTE.md; manter fontes Blender fora do Git. Avaliar preview de frente/lado/costas antes do final pago.
2. Importar GLB no Blender, conferir materiais, mãos, chão, escala, direção e silhueta. Retarget dos clips da base só quando rig tiver sido medido como compatível; caso contrário exportar os oito estados próprios (idle/walk/run/shoot/death/crouch/crouchwalk/jump).
3. Exportar para `/models/skins/<id>-<hash>.glb`, poster final e ficha. Revisão independente obrigatória. Não marcar `approved` nem catálogo `available` com placeholders.
4. Manifesto: cada entrada usa `character`, `model`, `poster`, `approved`; opcional `animationNames` para clips próprios, ou `rigCompatibleWith` somente depois da inspeção real. `character` e caminho precisam coincidir com catálogo autoritativo.
5. Testar equipamento por jogador, troca de conta/personagem, FP/TP, dois perfis reais no MP, celular e compra/recibo. Bot e adversário não herdam a skin da conta local. Ativar campanha com janela explícita de 30 dias somente quando loja estiver pronta.

## Vídeos de lançamento

- **Nova skin (12–15s, vertical):** rosto/joias → corpo completo em giro → corrida/tiro de gameplay real → card nome + T$800 → tela de compra/equipamento.
- **TRETA$ (10–15s):** moeda cunhada em giro → conta confirmada/convite/partida com valor ganho → saldo no topo → loja. Valores devem refletir a campanha realmente ativa.
- **Loja (15–20s):** JOGAR → LOJA → coleção → inspeção 3D → compra com quatro moedas de200 → armário → skin equipada em partida. Créditos simulados devem ser identificados em qualquer captura de teste.

Daniel Vorcaro e Donald Trump permanecem como expansão; preço, ficha e geração ainda não aprovados como entrega final.
