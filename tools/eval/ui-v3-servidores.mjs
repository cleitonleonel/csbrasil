#!/usr/bin/env node
/* Régua de Servidores (tela 16 de design/treta-pop-2026-10-14) e de Ajustes (#settings-panel) na Treta Pop.
     BASE=http://127.0.0.1:9429 node tools/eval/ui-v3-servidores.mjs [--mutantes]
   Os três nós são simulados por page.route (br 25 ms, us 140 ms, eu fora); nada sai para a rede real. */
import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const BASE = process.env.BASE || 'http://127.0.0.1:9429';
const OUT = process.env.OUT || 'tools/eval/out/ui-v3-servidores';
const VIEWPORTS = [[1536, 1024], [1920, 1080], [1280, 720], [844, 390]];
const gRoot = execSync('npm root -g').toString().trim();
const pw = await import(pathToFileURL(`${gRoot}/playwright/index.js`).href);
const chromium = pw.chromium || pw.default?.chromium;
const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--headless=new', '--mute-audio'],
});

const sala = (o) => ({ solo: false, spectators: 0, private: false, oficial: false, senha: false, ctf: false, mapas: null, nomeE: 'ESQUERDA', nomeB: 'DIREITA', ...o });
const SALAS_BR = [
  sala({ id: 'funk-x-palhaco', codigo: 'FUNK', convite: 'BR-FUNK', name: 'ESQUERDA × DIREITA', map: 'piscina_treta', mapNome: 'Piscina da Treta', players: 4, spectators: 1, max: 6, oficial: true, livre: { E: 1, B: 1 } }),
  sala({ id: 'captura', codigo: 'CTF', convite: 'BR-CTF', name: 'CAPTURA · MAPAS SORTEADOS', map: 'posto_treta', mapNome: 'Posto da Treta', ctf: true, players: 0, max: 6, oficial: true, livre: { E: 3, B: 3 } }),
  sala({ id: 'r9', codigo: 'R9QX', convite: 'BR-R9QX', name: 'LOTADA NA PRAÇA', map: 'praca_poderes', mapNome: 'Praça dos Três Poderes', players: 10, spectators: 2, max: 10, livre: { E: 0, B: 0 } }),
  sala({ id: 'r7', codigo: 'R7KM', convite: 'BR-R7KM', name: 'SALA DO ZÉ', map: 'escadao', mapNome: 'Escadão', players: 3, max: 8, private: true, senha: true, livre: { E: 1, B: 2 } }),
];
const SALAS_US = [sala({ id: 'funk-x-palhaco', codigo: 'FUNK', convite: 'US-FUNK', name: 'ESQUERDA × DIREITA', map: 'quebrada', mapNome: 'Quebrada', players: 0, max: 6, oficial: true, livre: { E: 3, B: 3 } })];
const NOS_OK = {
  br: { ms: 25, health: { ok: true, rooms: 4, players: 17, regiao: 'br', salaConvite: true }, rooms: SALAS_BR },
  us: { ms: 140, health: { ok: true, rooms: 1, players: 0, regiao: 'us', salaConvite: true }, rooms: SALAS_US },
  eu: null,
};
const NOS_FORA = { br: null, us: null, eu: null };

async function simularNos(ctx, nos) {
  await ctx.route(/^https:\/\/(br|us|eu)\.corosolto\.com\.br\//, async (rt) => {
    const u = new URL(rt.request().url());
    const no = nos[u.hostname.slice(0, 2)];
    if (!no) return rt.abort('connectionrefused');
    await new Promise((r) => setTimeout(r, no.ms));
    const corpo = u.pathname === '/health' ? no.health : u.pathname === '/rooms' ? { rooms: no.rooms } : u.pathname === '/maps' ? { maps: ['piscina_treta', 'escadao'] } : {};
    await rt.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(corpo) });
  });
}

/* Mutantes reescrevem o arquivo servido; cada um prova que aplicou. */
const MUTANTES = {
  'sem-ping': ['/js/tp/servidores.js', (t) => t.replace("`${n.ping} ms`", "'—'"), 'SV1'],
  'sem-miniatura': ['/js/tp/servidores.js', (t) => t.replace("img.src = posterDoMapa(r.map);", ''), 'SV2'],
  'filtro-cego': ['/js/tp/servidores.js', (t) => t.replace("if (filtro.modo === 'ctf' && !r.ctf) return false;", ''), 'SV3'],
  'dois-primarios': ['/js/tp/servidores.js', (t) => t.replace("amigos.className = 'tp-btn tp-srv__criar';", "amigos.className = 'tp-btn tp-btn--primario tp-srv__criar';"), 'SV4'],
  'erro-triplo': ['/css/tp/servidores.css', (t) => t.replace(':root[data-ui="v3"] .tp-srv[data-fora="todos"] #mp-erro{display:none}', ''), 'SV5'],
  'sem-tr': ['/js/i18n.js', (t) => t.replace("'SALAS ABERTAS': 'OPEN ROOMS',", ''), 'SV6'],
  'transborda': ['/css/tp/servidores.css', (t) => t.replaceAll('grid-template-columns:var(--tp-srv-colunas)', 'grid-template-columns:92px 420px 260px 110px 70px 260px'), 'SV7'],
  'vaza-sem-flag': ['/js/main.js', (t) => t.replace("if (document.documentElement.dataset.ui === 'v3') {\n  import('./splash-v3.js')", "{\n  import('./splash-v3.js')"), 'SV8'],
  'titulo-pequeno': ['/css/tp/servidores.css', (t) => t.replace('.tp-srv__titulo{font-size:56px', '.tp-srv__titulo{font-size:36px'), 'SV9'],
  'vivo-inventado': ['/js/tp/servidores.js', (t) => t.replace('jogando += n.jogadores | 0;', 'jogando += 100;'), 'SV10'],
  'toque-pequeno': ['/css/tp/servidores.css', (t) => t.replace('@media (pointer:coarse){', '@media (pointer:fine){'), 'SV11'],
  'sem-mira': ['/js/tp/ajustes.js', (t) => t.replace("['mira', 'MIRA'],", ''), 'AJ1'],
  'motion-volatil': ['/js/tp/ajustes.js', (t) => t.replace("document.dispatchEvent(new CustomEvent('tp-ajuste', { detail: { chave: 'motion', valor } }));", ''), 'AJ2'],
  'ignora-sistema': ['/js/tp/ajustes.js', (t) => t.replace("const sistema = matchMedia('(prefers-reduced-motion: reduce)').matches;", 'const sistema = false;'), 'AJ3'],
  'privacidade-dupla': ['/css/tp/ajustes.css', (t) => t.replace(':root[data-ui="v3"] #profile-preferences{display:none}', ''), 'AJ4'],
  'aba-sem-tr': ['/js/i18n.js', (t) => t.replace("'ACESSIBILIDADE': 'ACCESSIBILITY',", ''), 'AJ5'],
};

async function contexto(mutante, opcoes = {}, nos = NOS_OK) {
  const ctx = await browser.newContext({ viewport: { width: 1536, height: 1024 }, ...opcoes });
  await ctx.addInitScript(() => { try { localStorage.setItem('awpbr_nick', 'EMERSON'); } catch { /* sem storage */ } });
  await simularNos(ctx, nos);
  const m = MUTANTES[mutante];
  if (m) {
    await ctx.route((u) => u.pathname === m[0], async (rt) => {
      const res = await rt.fetch();
      const antes = await res.text();
      const depois = m[1](antes);
      if (depois === antes) throw new Error(`mutante ${mutante} não aplicou em ${m[0]}`);
      await rt.fulfill({ response: res, body: depois });
    });
  }
  return ctx;
}

async function entrar(page, caminho) {
  await page.goto(`${BASE}${caminho}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => window.__CS_MAIN_READY__ === true, null, { timeout: 90000 });
  for (let i = 0; i < 60 && await page.$('#boot-splash'); i++) {
    await page.evaluate(() => document.getElementById('boot-splash')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
    await page.waitForTimeout(400);
  }
  await page.evaluate(() => { for (const d of document.querySelectorAll('dialog[open]')) d.close(); });
  await page.waitForTimeout(2500);
}

const medirServidores = () => {
  const vis = (e) => !!e && e.checkVisibility({ visibilityProperty: true, opacityProperty: true });
  const caixa = (e) => { const b = e.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom, w: b.width, h: b.height }; };
  const raiz = document.querySelector('.tp-srv');
  const regioes = [...document.querySelectorAll('.tp-srv__regiao')].filter(vis).map((b) => ({
    id: b.dataset.no, sel: b.getAttribute('aria-checked') === 'true', ms: b.querySelector('.tp-srv__ms')?.textContent.trim() || '',
    barras: b.querySelectorAll('.tp-srv__barras i').length, sub: b.querySelector('.tp-srv__sub')?.textContent.trim() || '', h: b.getBoundingClientRect().height,
  }));
  const linhas = [...document.querySelectorAll('.tp-srv__sala')].filter(vis);
  const salas = linhas.map((l) => {
    const img = l.querySelector('img.tp-srv__mapa');
    const cols = [...l.children].map((c) => Math.round(c.getBoundingClientRect().left));
    return { nome: l.querySelector('.tp-srv__nome b')?.textContent.trim() || '', img: !!img && img.complete && img.naturalWidth > 0, imgW: img ? img.getBoundingClientRect().width : 0, imgH: img ? img.getBoundingClientRect().height : 0,
      sit: l.querySelector('.tp-srv__sit')?.textContent.trim() || '', lot: l.querySelector('.tp-srv__lot')?.textContent.trim() || '', ping: l.querySelector('.tp-srv__ping')?.textContent.trim() || '',
      botoes: [...l.querySelectorAll('.tp-srv__entrar button')].filter(vis).map((b) => b.textContent.trim() || b.getAttribute('aria-label')), h: l.getBoundingClientRect().height, cols };
  });
  const cab = [...document.querySelectorAll('.tp-srv__cab > *')].map((c) => Math.round(c.getBoundingClientRect().left));
  const primarios = [...document.querySelectorAll('#mp-panel .tp-btn--primario, #main-menu .tp-btn--primario')].filter(vis).map((b) => b.id || b.className);
  const avisos = [...document.querySelectorAll('#mp-panel .tp-srv__aviso, #mp-panel #mp-erro, #mp-panel #mp-estado, #mp-panel .mp-vazio')].filter(vis).map((e) => e.className || e.id);
  const vermelhos = [...(raiz || document.body).querySelectorAll('*')].filter((e) => vis(e) && e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())).filter((e) => {
    const m = getComputedStyle(e).color.match(/\d+/g).map(Number); return m[0] > 170 && m[1] < 120 && m[2] < 120;
  }).map((e) => e.textContent.trim().slice(0, 30));
  const aviso = document.querySelector('.tp-srv__aviso');
  const titulo = document.querySelector('.tp-srv__titulo');
  const quick = document.getElementById('mp-quick');
  const lado = document.querySelector('.tp-srv__lado'), lista = document.querySelector('.tp-srv__salas');
  const alvos = [...(raiz || document.body).querySelectorAll('button, input, summary, select, a')].filter(vis).map((e) => ({ id: e.id || e.className || e.tagName, w: e.getBoundingClientRect().width, h: e.getBoundingClientRect().height }));
  const painel = lista ? getComputedStyle(lista).backgroundColor : '';
  return {
    existe: vis(raiz), regioes, salas, cab, primarios, avisos, vermelhos,
    aviso: vis(aviso) ? aviso.innerText : '', avisoBotoes: vis(aviso) ? [...aviso.querySelectorAll('button')].filter(vis).map((b) => b.textContent.trim()) : [],
    texto: raiz ? raiz.innerText : '', vivo: document.querySelector('[data-vivo]')?.textContent.trim() || '',
    titulo: titulo ? { px: parseFloat(getComputedStyle(titulo).fontSize), fam: getComputedStyle(titulo).fontFamily } : null,
    quick: quick ? { ...caixa(quick), bg: getComputedStyle(quick).backgroundColor, vis: vis(quick) } : null,
    lado: lado && vis(lado) ? caixa(lado) : null, lista: lista && vis(lista) ? caixa(lista) : null, painel,
    alvos, coarse: matchMedia('(pointer: coarse)').matches,
    vw: innerWidth, sw: document.documentElement.scrollWidth,
  };
};

async function servidores(mutante) {
  const r = [];
  const add = (id, ok, msg) => r.push({ id, ok: !!ok, msg });
  mkdirSync(OUT, { recursive: true });

  /* SV1-SV4, SV9, SV10: 3:2 com BR 25 ms, EUA 140 ms e Europa fora. */
  const ctx = await contexto(mutante);
  const p = await ctx.newPage();
  await entrar(p, '/jogar/multiplayer?ui=v3&lang=pt');
  const m = await p.evaluate(medirServidores);
  if (!mutante) await p.screenshot({ path: `${OUT}/servidores-1536x1024-pt.png` });
  const br = m.regioes.find((x) => x.id === 'br'), us = m.regioes.find((x) => x.id === 'us'), eu = m.regioes.find((x) => x.id === 'eu');
  add('SV1', m.regioes.length === 3 && br?.sel && !us?.sel && /^\d+ ms$/.test(br?.ms) && /^\d+ ms$/.test(us?.ms) && br.barras === 3 && eu && !/\d/.test(eu.ms) && m.regioes[0].id === 'br',
    !m.regioes.length ? 'nenhuma região Treta Pop na tela' : `regiões ${m.regioes.map((x) => `${x.id}${x.sel ? '*' : ''}:${x.ms || '-'}`).join(' ')} (quer br escolhida e primeira, ping em ms nos vivos, eu sem número)`);
  const semImg = m.salas.filter((s) => !s.img || Math.round(s.imgW) !== 92 || Math.round(s.imgH) !== 56).map((s) => s.nome);
  const desalinhada = m.salas.filter((s) => s.cols.length !== m.cab.length || s.cols.some((x, i) => Math.abs(x - m.cab[i]) > 2)).map((s) => s.nome);
  const incompleta = m.salas.filter((s) => !s.sit || !/^\d+\/\d+$/.test(s.lot) || !/^\d+$/.test(s.ping) || !s.botoes.length).map((s) => s.nome);
  add('SV2', m.salas.length === 4 && !semImg.length && !desalinhada.length && !incompleta.length,
    m.salas.length !== 4 ? `${m.salas.length} salas na tabela (o nó simulado manda 4)` : semImg.length ? `sem miniatura 92×56: ${semImg.join(', ')}` : desalinhada.length ? `colunas fora do cabeçalho: ${desalinhada.join(', ')}` : incompleta.length ? `linha sem situação, lotação, ping ou ação: ${incompleta.join(', ')}` : '4 salas com mapa 92×56, situação, n/máx, ping e ação, alinhadas ao cabeçalho');
  const lotada = m.salas.find((s) => /LOTADA/.test(s.nome));
  const vazia = m.salas.find((s) => /CAPTURA/.test(s.nome));
  add('SV2b', lotada && lotada.botoes.length === 1 && /ASSISTIR/i.test(lotada.botoes[0]) && /Lotada/.test(lotada.sit) && vazia && /Esperando/.test(vazia.sit),
    lotada ? `lotada: ${lotada.sit} [${lotada.botoes.join('|')}]; vazia: ${vazia?.sit}` : 'sala lotada não apareceu');

  const filtros = {};
  for (const [rot, sel] of [['captura', '[data-filtro-modo="ctf"]'], ['semSenha', '[data-filtro="aberta"]'], ['comVaga', '[data-filtro="vaga"]']]) {
    const b = await p.$(sel);
    if (!b) { filtros[rot] = -1; continue; }
    await b.click(); await p.waitForTimeout(150);
    filtros[rot] = await p.evaluate(() => [...document.querySelectorAll('.tp-srv__sala')].filter((e) => e.checkVisibility()).length);
    await (rot === 'captura' ? p.click('[data-filtro-modo="todos"]') : b.click()); await p.waitForTimeout(150);
  }
  add('SV3', filtros.captura === 1 && filtros.semSenha === 3 && filtros.comVaga === 3, `salas com filtro: captura ${filtros.captura} (quer 1), sem senha ${filtros.semSenha} (quer 3), com vaga ${filtros.comVaga} (quer 3)`);

  /* entrar delega ao botão do legado: o clique no lado E da 1ª sala chega no .mp-entrar[data-lado=E] da 1ª sala */
  const delega = await p.evaluate(() => {
    const alvo = document.querySelector('#mp-salas .mp-sala .mp-entrar[data-lado="E"]');
    let chegou = false;
    alvo?.addEventListener('click', (e) => { chegou = true; e.stopImmediatePropagation(); }, { capture: true, once: true });
    document.querySelector('.tp-srv__sala .tp-srv__entrar button[data-lado="E"]')?.click();
    return chegou;
  });
  add('SV4', m.primarios.length === 1 && m.primarios[0] === 'mp-quick' && delega, `primários lima na tela: ${m.primarios.join(', ') || 'nenhum'} (quer só #mp-quick); ENTRAR ${delega ? 'chega' : 'não chega'} no botão do legado`);
  add('SV9', m.titulo && m.titulo.px === 56 && /Anton/.test(m.titulo.fam) && m.quick && Math.abs(m.quick.h - 64) <= 2 && m.quick.bg === 'rgb(180, 217, 46)' && /rgb\(19, 20, 24\)/.test(m.painel) && m.salas.every((s) => Math.abs(s.h - 76) <= 4) && br && Math.abs(br.h - 64) <= 8,
    `título ${m.titulo?.px}px ${m.titulo?.fam?.split(',')[0]}, JOGO RÁPIDO ${m.quick?.h?.toFixed(0)}px ${m.quick?.bg}, painel ${m.painel}, linhas ${m.salas.map((s) => s.h.toFixed(0)).join('/')}px, região ${br?.h?.toFixed(0)}px (pacote: 56, 64 lima, #131418, 76, 64)`);
  const nums = (m.vivo.match(/\d+/g) || []).map(Number);
  add('SV10', nums.length === 2 && nums[0] === 17 && nums[1] === 5, `linha ao vivo "${m.vivo}" (os nós simulados somam 17 jogando em 5 salas)`);
  const avisoParcial = m.aviso;

  /* clique numa região troca a escolhida pelo caminho do legado */
  await p.click('.tp-srv__regiao[data-no="us"]').catch(() => {});
  await p.waitForTimeout(900);
  const trocou = await p.evaluate(() => document.querySelector('.tp-srv__regiao[data-no="us"]')?.getAttribute('aria-checked') === 'true' && document.querySelectorAll('.tp-srv__sala').length === 1);
  await ctx.close();

  /* SV5: tudo fora do ar vira UM aviso, com retentativa e treino contra bots, e nada em vermelho. */
  const cf = await contexto(mutante, {}, NOS_FORA);
  const pf = await cf.newPage();
  await entrar(pf, '/jogar/multiplayer?ui=v3&lang=pt');
  const f = await pf.evaluate(medirServidores);
  if (!mutante) await pf.screenshot({ path: `${OUT}/fora-do-ar-1536x1024-pt.png` });
  await cf.close();
  add('SV5', f.existe && f.avisos.length === 1 && /\d+ s/.test(f.aviso) && f.avisoBotoes.some((b) => /TREINAR CONTRA BOTS/i.test(b)) && f.avisoBotoes.some((b) => /TENTAR/i.test(b)) && !f.vermelhos.length && /Europa/.test(avisoParcial) && trocou,
    `fora do ar: ${f.avisos.length} aviso(s) visíveis [${f.avisos.join(', ')}], botões [${f.avisoBotoes.join(' | ')}], vermelho: ${f.vermelhos.join(' / ') || 'nenhum'}; Europa caída avisa: ${/Europa/.test(avisoParcial) ? 'sim' : 'não'}; troca de região: ${trocou ? 'ok' : 'não troca'}`);

  /* SV6: EN sem PT, PT sem EN. */
  const ce = await contexto(mutante);
  const pe = await ce.newPage();
  await entrar(pe, '/jogar/multiplayer?ui=v3&lang=en');
  const e = await pe.evaluate(medirServidores);
  if (!mutante) await pe.screenshot({ path: `${OUT}/servidores-1536x1024-en.png` });
  await ce.close();
  const PT = /\b(SALAS ABERTAS|JOGO RÁPIDO|CRIAR SALA|jogando|Esperando|Lotada|Com vaga|REGIÃO|ESCOLHIDA|fora do ar|VOLTAR|ATUALIZAR|TODOS OS MODOS|MATA-MATA|SEM SENHA|Atualiza|ESQUERDA|DIREITA|Brasil|Europa|EUA|SITUAÇÃO|JOGADORES|MAPA|SALA)\b/;
  const EN = /\b(OPEN ROOMS|QUICK PLAY|playing|Waiting|Full|REGION|BACK|REFRESH|LEFT|RIGHT|JOIN|Brazil|Europe|PLAYERS|ROOM)\b/;
  const vazaEn = (e.texto.match(PT) || [])[0], vazaPt = (m.texto.match(EN) || [])[0];
  add('SV6', e.texto && m.texto && !vazaEn && !vazaPt, !e.texto ? 'sem tela v3 para medir' : vazaEn || vazaPt ? `idioma misturado: "${vazaEn || vazaPt}" ${vazaEn ? 'em EN' : 'em PT'}` : 'PT e EN sem string do outro idioma');

  /* SV7/SV11: quatro telas; nada vaza para o lado, JOGO RÁPIDO inteiro, lista não invade a coluna; toque >= 44 px no celular. */
  const falhas = [], toque = [];
  for (const [w, h] of VIEWPORTS) {
    const movel = w < 900;
    const cv = await contexto(mutante, { viewport: { width: w, height: h }, ...(movel ? { hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : {}) });
    const pv = await cv.newPage();
    await entrar(pv, '/jogar/multiplayer?ui=v3&lang=pt');
    const g = await pv.evaluate(medirServidores);
    if (!mutante) await pv.screenshot({ path: `${OUT}/servidores-${w}x${h}-pt.png` });
    if (!mutante && movel) {
      await pv.evaluate(() => { const s = document.querySelector('.tp-srv'); if (s) s.scrollTop = s.scrollHeight; });
      await pv.waitForTimeout(300);
      await pv.screenshot({ path: `${OUT}/servidores-${w}x${h}-pt-rolado.png` });
    }
    await cv.close();
    if (!g.existe) { falhas.push(`${w}×${h}: sem tela v3`); continue; }
    if (g.sw > g.vw) falhas.push(`${w}×${h}: página rola de lado (${g.sw} > ${g.vw})`);
    if (!g.quick?.vis || g.quick.l < 0 || g.quick.r > g.vw || g.quick.t < 0) falhas.push(`${w}×${h}: JOGO RÁPIDO fora da tela`);
    if (!movel && g.lado && g.lista && g.lado.r > g.lista.l) falhas.push(`${w}×${h}: lista invade a coluna das regiões`);
    const cortada = g.salas.filter((s) => s.cols.some((x) => x > g.vw)).length;
    if (cortada) falhas.push(`${w}×${h}: ${cortada} sala(s) com coluna fora da tela`);
    if (movel) {
      if (!g.coarse) toque.push('emulação sem pointer: coarse');
      for (const a of g.alvos) if (a.h < 44 || a.w < 44) toque.push(`${a.id.slice(0, 24)} ${a.w.toFixed(0)}×${a.h.toFixed(0)}`);
    }
  }
  add('SV7', !falhas.length, falhas.length ? falhas.join('; ') : `${VIEWPORTS.map(([w, h]) => `${w}×${h}`).join(', ')}: sem rolagem lateral, JOGO RÁPIDO inteiro, colunas no lugar`);
  add('SV11', !toque.length && !falhas.some((x) => /sem tela v3/.test(x)), toque.length ? `alvo de toque abaixo de 44 px em 844×390: ${toque.slice(0, 5).join(', ')}${toque.length > 5 ? ` (+${toque.length - 5})` : ''}` : '844×390 com toque: todo alvo >= 44 px');

  /* SV8: sem a flag o multiplayer é o de hoje. */
  const cl = await contexto(mutante);
  const pl = await cl.newPage();
  await entrar(pl, '/jogar/multiplayer?lang=pt');
  const l = await pl.evaluate(() => ({
    tp: [...document.querySelectorAll('#mp-panel [class*="tp-"]')].length,
    host: document.getElementById('mp-panel')?.parentElement?.id,
    quick: document.getElementById('mp-quick')?.className,
    estado: document.getElementById('mp-estado')?.checkVisibility(),
  }));
  if (!mutante) await pl.screenshot({ path: `${OUT}/hoje-servidores-1536x1024.png` });
  await cl.close();
  add('SV8', !l.tp && l.host === 'hub-mp-host' && /mp-quick/.test(l.quick) && l.estado, `sem flag: ${l.tp} elemento(s) tp no painel, painel em #${l.host}, JOGO RÁPIDO "${l.quick}", chip de estado ${l.estado ? 'visível' : 'sumiu'}`);
  return r;
}

const medirAjustes = () => {
  const vis = (e) => !!e && e.checkVisibility({ visibilityProperty: true, opacityProperty: true });
  const painel = document.getElementById('settings-panel');
  const abas = [...painel.querySelectorAll('.set-tab')].filter(vis).map((t) => ({ id: t.dataset.tab, txt: t.textContent.trim(), h: t.getBoundingClientRect().height, w: t.getBoundingClientRect().width }));
  return { abas, aberto: vis(painel), vw: innerWidth, sw: document.documentElement.scrollWidth, wrap: painel.querySelector('.settings-wrap')?.getBoundingClientRect().right };
};

async function abrirAjustes(page) {
  await page.evaluate(() => document.getElementById('hub-settings')?.click());
  await page.waitForTimeout(500);
}
const naAba = (page, id) => page.evaluate(async (aba) => {
  const vis = (e) => !!e && e.checkVisibility({ visibilityProperty: true, opacityProperty: true });
  document.querySelector(`#settings-panel .set-tab[data-tab="${aba}"]`)?.click();
  await new Promise((r) => setTimeout(r, 200));
  const p = document.getElementById('settings-panel');
  return {
    xhair: vis(document.getElementById('set-xhair')), previa: vis(p.querySelector('.tp-mira-previa')),
    motion: vis(document.getElementById('tp-set-motion')?.closest('.set-row')), treino: vis(document.getElementById('set-training')?.closest('.set-row')),
    analytics: vis(p.querySelector('input[name="analytics"]')), news: vis(p.querySelector('input[name="newsletter"]')),
    linhas: [...p.querySelectorAll('.set-row')].filter(vis).length, texto: p.querySelector('.set-list')?.innerText || '',
  };
}, id);

async function ajustes(mutante) {
  const r = [];
  const add = (id, ok, msg) => r.push({ id, ok: !!ok, msg });
  const ctx = await contexto(mutante);
  const p = await ctx.newPage();
  await entrar(p, '/?ui=v3&lang=pt');
  await abrirAjustes(p);
  const a = await p.evaluate(medirAjustes);
  const mira = await naAba(p, 'mira');
  if (!mutante) await p.screenshot({ path: `${OUT}/ajustes-mira-1536x1024-pt.png` });
  const acess = await naAba(p, 'acessibilidade');
  if (!mutante) await p.screenshot({ path: `${OUT}/ajustes-acessibilidade-1536x1024-pt.png` });
  const priv = await naAba(p, 'privacidade');
  if (!mutante) await p.screenshot({ path: `${OUT}/ajustes-privacidade-1536x1024-pt.png` });
  const jog = await naAba(p, 'gameplay');
  const ids = a.abas.map((x) => x.id).join(',');
  add('AJ1', ids === 'video,audio,gameplay,controls,mira,acessibilidade,privacidade' && mira.xhair && mira.previa && acess.motion && !acess.xhair && priv.treino && priv.analytics && priv.news && !jog.xhair && !jog.treino,
    `abas ${ids || 'nenhuma'}; mira: cor ${mira.xhair ? 'ok' : 'não'}, prévia ${mira.previa ? 'ok' : 'não'}; acessibilidade: reduzir animações ${acess.motion ? 'ok' : 'não'}; privacidade: treino ${priv.treino ? 'ok' : 'não'}, cookies ${priv.analytics ? 'ok' : 'não'}, novidades ${priv.news ? 'ok' : 'não'}; jogabilidade sem mira/treino ${!jog.xhair && !jog.treino ? 'ok' : 'não'}`);

  /* AJ2: liga, persiste nas settings e sobrevive à recarga; desliga e some. */
  await naAba(p, 'acessibilidade');
  await p.evaluate(() => document.getElementById('tp-set-motion')?.click());
  await p.waitForTimeout(200);
  const ligado = await p.evaluate(() => ({ ds: document.documentElement.dataset.motion || '', mov: getComputedStyle(document.documentElement).getPropertyValue('--tp-mov').trim(), salvo: JSON.parse(localStorage.getItem('awpbr_settings') || '{}').motion }));
  await entrar(p, '/?ui=v3&lang=pt');
  const recarga = await p.evaluate(() => ({ ds: document.documentElement.dataset.motion || '', marcado: !!document.getElementById('tp-set-motion')?.checked }));
  await abrirAjustes(p); await naAba(p, 'acessibilidade');
  await p.evaluate(() => document.getElementById('tp-set-motion')?.click());
  await p.waitForTimeout(200);
  const desligado = await p.evaluate(() => ({ ds: document.documentElement.dataset.motion || '', salvo: JSON.parse(localStorage.getItem('awpbr_settings') || '{}').motion }));
  add('AJ2', ligado.ds === 'reduzido' && ligado.mov === '0' && ligado.salvo === 'reduzido' && recarga.ds === 'reduzido' && recarga.marcado && !desligado.ds && desligado.salvo !== 'reduzido',
    `liga: data-motion=${ligado.ds || '-'} --tp-mov=${ligado.mov} salvo=${ligado.salvo}; recarga: ${recarga.ds || '-'} marcado=${recarga.marcado}; desliga: ${desligado.ds || '-'} salvo=${desligado.salvo}`);
  const perfil = await p.evaluate(() => getComputedStyle(document.getElementById('profile-preferences')).display);
  add('AJ4', perfil === 'none', `#profile-preferences no perfil em v3: display ${perfil} (quer none; a escolha mora em Ajustes > Privacidade)`);
  await ctx.close();

  /* AJ3: o sistema pedindo menos movimento já vale, e o controle mostra isso sem mentir. */
  const cr = await contexto(mutante, { reducedMotion: 'reduce' });
  const pr = await cr.newPage();
  await entrar(pr, '/?ui=v3&lang=pt');
  await abrirAjustes(pr); await naAba(pr, 'acessibilidade');
  const sis = await pr.evaluate(() => ({ marcado: !!document.getElementById('tp-set-motion')?.checked, travado: !!document.getElementById('tp-set-motion')?.disabled, mov: getComputedStyle(document.documentElement).getPropertyValue('--tp-mov').trim(), nota: document.querySelector('.tp-aj-nota')?.textContent || '' }));
  await cr.close();
  add('AJ3', sis.marcado && sis.travado && sis.mov === '0' && sis.nota, `prefers-reduced-motion: controle ${sis.marcado ? 'marcado' : 'desmarcado'}${sis.travado ? ' e travado' : ''}, --tp-mov=${sis.mov}, nota "${sis.nota.slice(0, 50)}"`);

  /* AJ5: EN sem PT nas abas e linhas novas. */
  const ce = await contexto(mutante);
  const pe = await ce.newPage();
  await entrar(pe, '/?ui=v3&lang=en');
  await abrirAjustes(pe);
  const ae = await pe.evaluate(medirAjustes);
  const textos = [];
  for (const aba of ['mira', 'acessibilidade', 'privacidade']) textos.push((await naAba(pe, aba)).texto);
  if (!mutante) await pe.screenshot({ path: `${OUT}/ajustes-privacidade-1536x1024-en.png` });
  await ce.close();
  const novas = ae.abas.filter((x) => ['mira', 'acessibilidade', 'privacidade'].includes(x.id)).map((x) => x.txt).join(' ');
  const PTA = /\b(MIRA|ACESSIBILIDADE|PRIVACIDADE|REDUZIR|ANIMAÇÕES|Prévia|LIGADO|DESLIGADO|COR DA MIRA|Seu sistema|movimento|Permitir|armazenamento)\b/;
  const vaza = ((novas + ' ' + textos.join(' ')).match(PTA) || [])[0];
  add('AJ5', novas.split(' ').length >= 3 && !vaza, vaza ? `PT vaza no EN: "${vaza}"` : `abas novas em EN: ${novas || 'nenhuma'}`);

  /* AJ6: celular deitado com toque: abas >= 44 px e painel sem rolar de lado. */
  const cm = await contexto(mutante, { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const pm = await cm.newPage();
  await entrar(pm, '/?ui=v3&lang=pt');
  await abrirAjustes(pm);
  const am = await pm.evaluate(medirAjustes);
  await naAba(pm, 'acessibilidade');
  if (!mutante) await pm.screenshot({ path: `${OUT}/ajustes-acessibilidade-844x390-pt.png` });
  await cm.close();
  const baixas = am.abas.filter((x) => x.h < 44).map((x) => `${x.id} ${x.h.toFixed(0)}px`);
  add('AJ6', am.abas.length === 7 && !baixas.length && am.sw <= am.vw && am.wrap <= am.vw, `844×390: ${am.abas.length} abas, baixas: ${baixas.join(', ') || 'nenhuma'}, largura ${am.sw}/${am.vw}`);

  /* AJ7: sem a flag, quatro abas e a privacidade continua no perfil. */
  const cl = await contexto(mutante);
  const pl = await cl.newPage();
  await entrar(pl, '/?lang=pt');
  await abrirAjustes(pl);
  const al = await pl.evaluate(medirAjustes);
  const perfilHoje = await pl.evaluate(() => getComputedStyle(document.getElementById('profile-preferences')).display);
  if (!mutante) await pl.screenshot({ path: `${OUT}/hoje-ajustes-1536x1024.png` });
  await cl.close();
  add('AJ7', al.abas.map((x) => x.id).join(',') === 'video,audio,gameplay,controls' && perfilHoje !== 'none', `sem flag: abas ${al.abas.map((x) => x.id).join(',')}, privacidade no perfil ${perfilHoje}`);
  return r;
}

/* mutante de uma cláusula só mede a metade dela: cada metade sobe o jogo várias vezes */
const medir = async (mutante = '', alvo = '') => [...(!alvo || alvo.startsWith('SV') ? await servidores(mutante) : []), ...(!alvo || alvo.startsWith('AJ') ? await ajustes(mutante) : [])];

let sair = 0;
if (process.argv.includes('--mutantes')) {
  for (const [mut, [, , alvo]] of Object.entries(MUTANTES).filter(([k]) => !process.env.SO || process.env.SO === k)) {
    const c = (await medir(mut, alvo)).find((x) => x.id === alvo);
    if (c.ok) sair = 1;
    console.log(`${c.ok ? 'CEGO  ' : 'MORDE '} ${alvo} (${mut})  ${c.msg}`);
  }
} else {
  const r = await medir();
  for (const c of r) console.log(`${c.ok ? 'VERDE   ' : 'VERMELHO'} ${c.id}  ${c.msg}`);
  sair = r.every((c) => c.ok) ? 0 : 1;
  console.log(`\nservidores v3: ${r.filter((c) => c.ok).length}/${r.length}  (capturas em ${OUT})`);
}
await browser.close();
process.exit(sair);
