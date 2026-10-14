#!/usr/bin/env node
// Relato de 14/10/2026: o SOBRE O JOGO do lobby mostrava 6 grupos, sem os Políticos,
// enquanto o elenco jogável (public/js/characters.js) tem 7. A grade de grupos do
// painel GERAL precisa listar exatamente os grupos que têm personagem no jogo.
// Uso: BASE=http://127.0.0.1:4562 node tools/eval/hub-factions-browser.mjs [--mutante=sem-politicos]
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
const playwright = await import(pathToFileURL(`${root}/playwright/index.js`).href);
const chromium = playwright.chromium || playwright.default?.chromium;
const base = process.env.BASE || 'http://127.0.0.1:4339';
// Mutante: tira um grupo da grade depois do render, como a lista fixa antiga fazia.
const mutant = process.argv.includes('--mutante=sem-politicos');
const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--headless=new', '--mute-audio'],
});
let failures = [];
try {
  const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
  await page.addInitScript(() => {
    localStorage.setItem('awpbr_nick', 'RUBAO');
    localStorage.setItem('cs_lang', 'pt');
  });
  await page.goto(`${base}/?home=hub&secao=sobre`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#hub-factions > *', { state: 'attached', timeout: 120000 });
  if (mutant) await page.evaluate(() => document.querySelector('#hub-factions [data-faction="P"]')?.remove());
  const result = await page.evaluate(async () => {
    const { CHARACTERS } = await import('/js/characters.js');
    const counts = {};
    for (const c of CHARACTERS) counts[c.team] = (counts[c.team] || 0) + 1;
    const shown = [...document.querySelectorAll('#hub-factions > *')].map((item) => ({
      id: item.dataset.faction || null, name: item.textContent.trim(), images: [...item.querySelectorAll('img')].map((img) => img.getAttribute('src')),
    }));
    return { counts, total: CHARACTERS.length, shown };
  });
  const expected = Object.keys(result.counts).sort();
  const shown = result.shown.map((item) => item.id ?? '?').sort();
  if (result.shown.length !== expected.length) failures.push(`grade com ${result.shown.length} grupos, o jogo tem ${expected.length}`);
  else if (expected.join() !== shown.join()) failures.push(`grade mostra [${shown}] mas o jogo tem [${expected}] (data-faction)`);
  for (const item of result.shown) {
    if (!item.name) failures.push(`${item.id}: sem nome`);
    if (!item.images.length) failures.push(`${item.id}: sem brasão`);
  }
  for (const src of new Set(result.shown.flatMap((item) => item.images))) {
    const response = await page.request.get(new URL(src, base).href);
    if (!response.ok()) failures.push(`brasão ${src} responde ${response.status()}`);
  }
  console.log(`Elenco: ${result.total} personagens em ${expected.length} grupos (${expected.map((id) => `${id}=${result.counts[id]}`).join(' ')})`);
  console.log(`Grade: ${result.shown.map((item) => item.name).join(' | ')}`);
} finally {
  await browser.close();
}
for (const failure of failures) console.error(`✗ ${failure}`);
console.log(`Grupos do SOBRE O JOGO: ${failures.length ? 'FAIL' : 'PASS'}${mutant ? ' (mutante sem-politicos)' : ''}`);
process.exitCode = failures.length ? 1 : 0;
