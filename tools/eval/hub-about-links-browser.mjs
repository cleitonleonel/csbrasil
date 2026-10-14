#!/usr/bin/env node
// Relato de 14/10/2026: no SOBRE O JOGO do lobby, PRIVACIDADE e TERMOS DE USO
// tiravam o jogador do jogo. Cada link do painel GERAL e do rodapé do hub precisa abrir no próprio
// lobby (iframe ?embed=1, sem o cabeçalho do site) ou, se for de outra origem,
// em nova aba. A régua clica de verdade, como o jogador.
// Uso: BASE=http://127.0.0.1:4561 node tools/eval/hub-about-links-browser.mjs [--mutante=termos-fora]
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
const playwright = await import(pathToFileURL(`${root}/playwright/index.js`).href);
const chromium = playwright.chromium || playwright.default?.chromium;
const base = process.env.BASE || 'http://127.0.0.1:4339';
// Mutante: devolve o bug original para /termos (o clique segue a navegação do navegador).
const mutant = process.argv.includes('--mutante=termos-fora');
const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--headless=new', '--mute-audio'],
});
const failures = [];
try {
  const context = await browser.newContext({ viewport: { width: 1536, height: 1024 } });
  await context.addInitScript((mutate) => {
    localStorage.setItem('awpbr_nick', 'RUBAO');
    localStorage.setItem('cs_lang', 'pt');
    if (mutate) document.addEventListener('click', (event) => {
      if (event.target.closest?.('a[href="/termos"]')) event.stopImmediatePropagation();
    }, true);
  }, mutant);
  const page = await context.newPage();
  const openAbout = async () => {
    await page.goto(`${base}/?home=hub`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#hub-ui:not([hidden])', { timeout: 120000 });
    for (let i = 0; i < 120 && await page.$('#boot-splash'); i++) {
      await page.evaluate(() => document.getElementById('boot-splash')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
      await page.waitForTimeout(500);
    }
    await page.addStyleTag({ content: 'astro-dev-toolbar{display:none!important}' });
    await page.click('[data-hub-tab="sobre"]');
    await page.waitForSelector('#hub-about-overview:not([hidden])');
  };
  await openAbout();
  // Painel GERAL inteiro + rodapé do hub. /docs/ é a documentação de desenvolvimento
  // (Docusaurus, outro app), fora do lobby de propósito.
  const selector = '#hub-about-overview a[href], #hub-ui .hub-footer > a[href]:not([href^="/docs"])';
  const links = await page.$$eval(selector, (items) => items.map((a, index) => ({ index, href: a.href, label: a.textContent.trim().replace(/\s+/g, ' ') })));
  if (links.length < 10) failures.push(`painel GERAL com ${links.length} links; esperado ao menos 10`);
  for (const link of links) {
    await openAbout();
    const url = new URL(link.href);
    const popup = context.waitForEvent('page', { timeout: 3000 }).catch(() => null);
    await page.locator(selector).nth(link.index).click({ noWaitAfter: true });
    if (url.origin !== new URL(base).origin) {
      const opened = await popup;
      const stayed = new URL(page.url()).pathname === '/';
      if (!opened || !stayed) failures.push(`${link.label}: link externo deveria abrir em nova aba`);
      else console.log(`  ok ${link.label}: nova aba (${url.host})`);
      await opened?.close();
      continue;
    }
    await page.waitForTimeout(400);
    const state = await page.waitForFunction((pathname) => {
      const frame = document.getElementById('hub-guide-frame');
      const doc = frame?.contentDocument;
      if (location.pathname !== '/' || !frame?.src || frame.hidden || !doc?.body) return location.pathname !== '/' ? { left: location.pathname } : null;
      const src = new URL(frame.src);
      const header = doc.querySelector('body > header');
      return {
        path: src.pathname, embed: src.searchParams.get('embed'), wanted: pathname,
        embedded: doc.documentElement.dataset.embedded === 'true',
        siteHeader: Boolean(header && getComputedStyle(header).display !== 'none'),
        panel: !document.getElementById('hub-about-content').hidden,
      };
    }, url.pathname, { timeout: 45000 }).then((handle) => handle.jsonValue()).catch(() => {
      const pathname = new URL(page.url()).pathname;
      return pathname === '/' ? { stuck: true } : { left: pathname };
    });
    if (state.left) failures.push(`${link.label}: saiu do jogo para ${state.left}`);
    else if (state.stuck) failures.push(`${link.label}: ficou no lobby, mas o guia não abriu`);
    else if (!state.panel || state.path !== url.pathname || state.embed !== '1') failures.push(`${link.label}: iframe em ${state.path}?embed=${state.embed}`);
    else if (!state.embedded || state.siteHeader) failures.push(`${link.label}: página aberta no lobby com o cabeçalho do site`);
    else console.log(`  ok ${link.label}: lobby ${state.path}?embed=1`);
  }
} finally {
  await browser.close();
}
for (const failure of failures) console.error(`✗ ${failure}`);
console.log(`Links do SOBRE O JOGO dentro do jogo: ${failures.length ? 'FAIL' : 'PASS'}${mutant ? ' (mutante termos-fora)' : ''}`);
process.exitCode = failures.length ? 1 : 0;
