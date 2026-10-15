/* Liga as telas Treta Pop. Uma tela que falha não derruba as outras nem o jogo. */
import { ligar as lobby } from './lobby.js';
import { ligar as modos } from './modos.js';
import { ligar as carregamento } from './carregamento.js';
import { ligar as hud } from './hud.js';
import { ligar as resultado } from './resultado.js';
import { ligar as loja } from './loja.js';
import { ligar as perfil } from './perfil.js';
import { ligar as social } from './social.js';
import { ligar as servidores } from './servidores.js';
import { ligar as ajustes } from './ajustes.js';

export function ligarTelas() {
  for (const [nome, ligar] of Object.entries({ lobby, modos, carregamento, hud, resultado, loja, perfil, social, servidores, ajustes })) {
    try { ligar(); } catch (e) { console.error(`[treta-pop] ${nome}`, e); }
  }
}
