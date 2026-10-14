// Valor VOLÁTIL dentro de bloco gerado (contagem, tamanho, linha): só o release o reescreve.
// No PR, `mesclar` mantém o valor que já está commitado e confere só o resto da linha.
const ABRE = '\u0001';
const FECHA = '\u0002';
export const v = (x) => `${ABRE}${x}${FECHA}`;
export const limpa = (t) => t.replace(/[\u0001\u0002]/g, '');

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const esqueleto = (linha) => new RegExp(`^${linha.split(/\u0001[^\u0002]*\u0002/).map(esc).join('.*?')}$`);

/* Alinha o modelo com o texto atual linha a linha, em ordem: linha com valor volátil cujo
   esqueleto casa uma linha atual fica com a atual; sem par, sai com o valor medido. */
export function mesclar(modelo, atual) {
  const antigas = (atual || '').split('\n');
  let cursor = 0;
  return modelo.split('\n').map((linha) => {
    if (!linha.includes(ABRE)) {
      const i = antigas.indexOf(linha, cursor);
      if (i >= 0) cursor = i + 1;
      return linha;
    }
    const re = esqueleto(linha);
    for (let i = cursor; i < antigas.length; i++) {
      if (re.test(antigas[i])) { cursor = i + 1; return antigas[i]; }
    }
    return limpa(linha);
  }).join('\n');
}
