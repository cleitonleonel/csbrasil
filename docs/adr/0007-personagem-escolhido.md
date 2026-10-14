# 0007. O personagem escolhido vale em toda partida

Status: aceita (13/10/2026)

## Contexto

O dono relatou em 13/10 que o jogo atribuía personagem sozinho e
ignorava a escolha. Medido no navegador com nó local:

- No multiplayer o pedido do personagem lia só o `localStorage`. Quem
  chegou por `?personagem=` entrava com o corpo do bot que herdou.
- Personagem que não joga no lado dado pelo nó era descartado calado.
- Ao sair da sala, o SP seguinte usava o corpo emprestado pela sala.

O pool por lado é o do #771: categoria E só na Esquerda, categoria B só
na Direita, as outras nos dois, e `lados` explícito vence a categoria
(`podeNoLado` em `public/js/characters.js`). O nó valida o pedido com a
mesma função desde o #772 (`trocarPersonagem` no `room.js`).

## Decisão

1. **A escolha** é o último personagem que o jogador escolheu: escalação
   do hub, link `?personagem=` e a tecla M dentro da partida. Hub e M
   gravam em `csbr-home-character` e `csbr-home-side`. O link vale para
   a sessão e não sobrescreve o que está salvo, para um link de amigo
   não apagar a escolha de quem abre.
2. **Singleplayer**: joga com a escolha. O lado segue o personagem: na
   escalação o lado é escolhido junto, e no `startGame` um personagem
   fora do lado vai para o primeiro lado dele.
3. **Multiplayer** (JOGO RÁPIDO, sala pública, JOGAR COM AMIGOS por
   convite, sala criada): o nó escolhe o lado. Se a escolha joga nesse
   lado, o cliente pede o personagem e o nó troca o corpo. Se não joga,
   o jogo **avisa** ("Dama da Mandioca não joga na DIREITA") e
   **oferece** duas saídas na pausa: IR PARA o outro lado ou ESCOLHER
   OUTRO. Nada troca sem o jogador pedir. Lado cheio volta com aviso.
4. **Troca de lado ou de mapa**: a cada slot e a cada partida nova da
   sala o pedido se repete, com a mesma regra do item 3.
5. **Saída da sala**: o personagem, o lado, o mapa e o modo do SP voltam
   ao que eram antes de entrar. A sala só empresta o corpo.

## Consequências

- Decisão pura em `decidirPersonagemMp` (`public/js/net.js`). Réguas:
  `tools/eval/personagem-escolhido-check.mjs` (check:fast) e
  `tools/eval/personagem-escolhido-browser.mjs` (manual, nó local).
- Perfil logado não guarda personagem. `last_character` do perfil é
  só exibição. Guardar a escolha na conta precisa de backend (coluna ou
  preferência no perfil e leitura no boot); fica fora desta decisão.
- O nó ainda entrega o corpo do bot primeiro e troca depois do pedido:
  por um instante o jogador aparece com outro personagem. Mandar o
  personagem no connect resolveria, e também é backend.
