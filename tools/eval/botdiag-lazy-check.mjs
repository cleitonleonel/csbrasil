#!/usr/bin/env node
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const mutante = process.argv.find((arg) => arg.startsWith('--mutante='))?.slice(10) || '';
if (mutante && mutante !== 'sem-await') {
  console.error(`mutante desconhecido: ${mutante}`);
  process.exit(2);
}

const botdiagUrl = new URL('./botdiag.mjs', import.meta.url);
let execUrl = botdiagUrl;
let tempUrl = null;

function executa(dificuldade, mapa = 'all') {
  return spawnSync(process.execPath, [fileURLToPath(execUrl), '1', mapa], {
    cwd: fileURLToPath(new URL('../..', import.meta.url)),
    encoding: 'utf8',
    timeout: 120_000,
    env: {
      ...process.env,
      SIM_DUEL: '1',
      SIM_SEEDS: '12345',
      SIM_QS: dificuldade === 'hard' ? '?diff=hard' : '',
      SIM_TRACE: mutante ? '1' : '',
    },
  });
}

function linhasJson(stdout) {
  const marcador = stdout.lastIndexOf('\n[\n');
  const inicio = marcador >= 0 ? marcador + 1 : stdout.indexOf('[\n');
  const fim = stdout.indexOf('\n]', inicio);
  if (inicio < 0 || fim < inicio) throw new Error(`saída sem matriz JSON: ${stdout.slice(0, 300)}`);
  return JSON.parse(stdout.slice(inicio, fim + 2));
}

try {
  if (mutante) {
    const original = readFileSync(botdiagUrl, 'utf8');
    const ancora = '  await carregaMapa(mapId);';
    if (!original.includes(ancora)) throw new Error('mutante sem-await não encontrou o await de carregaMapa');
    const alterado = original.replace(ancora, '  carregaMapa(mapId);');
    tempUrl = new URL(`./.botdiag-sem-await-${process.pid}.mjs`, import.meta.url);
    writeFileSync(tempUrl, alterado);
    execUrl = tempUrl;

    const resultado = executa('normal', 'praca_poderes');
    const causal = /TypeError: MAPS\[this\._mapId\]\.build is not a function/.test(resultado.stderr)
      && /"err":\s*"TypeError: MAPS\[this\._mapId\]\.build is not a function @12345"/.test(resultado.stdout);
    if (!causal) {
      console.error(resultado.stderr || resultado.stdout);
      throw new Error('MUTAÇÃO SOBREVIVEU: retirar o await não expôs o TypeError causal');
    }
    console.log('MUTANTE MORDIDO: sem-await -> TypeError causal antes de new Game concluir.');
  } else {
    const esperados = ['praca_poderes', 'piscina_treta', 'loja_h', 'ferro_velho'];
    for (const dificuldade of ['normal', 'hard']) {
      const resultado = executa(dificuldade);
      if (resultado.error) throw resultado.error;
      if (resultado.status !== 0) throw new Error(resultado.stderr || resultado.stdout);
      const linhas = linhasJson(resultado.stdout);
      if (linhas.length !== esperados.length) throw new Error(`${dificuldade}: ${linhas.length}/${esperados.length} mapas`);
      for (let i = 0; i < esperados.length; i++) {
        const linha = linhas[i];
        if (linha.map !== esperados[i]) throw new Error(`${dificuldade}: ordem/identidade divergente em ${esperados[i]}`);
        if (linha.err) throw new Error(`${dificuldade}/${linha.map}: ${linha.err}`);
        if (linha.ttkN === 0 && linha.janelaAteMorrer !== null) throw new Error(`${dificuldade}/${linha.map}: TTK sem evento não foi rotulado como null`);
        if (linha.ttkN > 0 && !Number.isFinite(linha.janelaAteMorrer)) throw new Error(`${dificuldade}/${linha.map}: TTK amostrado não é finito`);
      }
      console.log(`BOTDIAG ${dificuldade}: ${linhas.length}/4 mapas carregados sob demanda; TTK ausente = null.`);
    }
  }
} finally {
  if (tempUrl) rmSync(tempUrl, { force: true });
}
