/* LP1 a LP9 e LB1 a LB8: convite de login na abertura (pedido do dono, 14/10/2026). Ver public/js/login-prompt.js.
 * Parte rápida (padrão, entra no check:fast): roda o login-prompt.js REAL num vm e confere a fiação em
 * main.js e account-entry.js. Parte de browser (`--browser`, exige BASE): abre o jogo com a API social
 * simulada e mede o popup de verdade (deslogado, logado, embed, partida, consentimento, intervalo, foco,
 * Esc, telemetria) e grava as capturas em SHOTS se definido.
 * Mutantes (cada um tem de ficar VERMELHO): --mutante=sem-login | sem-embed | sem-partida | sem-conta |
 * sem-sessao | sem-intervalo | sem-perfil | sem-contagem | empilha | telemetria-sem-consentimento */
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
const arg = (k) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || '').split('=').slice(1).join('=');
const MUT = arg('mutante');
const BROWSER = process.argv.includes('--browser');

const MUTANTES = {
  'sem-login': ['login-prompt', '  if(auth?.authenticated)return false;\n', ''],
  'sem-embed': ['login-prompt', '  if(embedded)return false;\n', ''],
  'sem-partida': ['login-prompt', '  if(playing)return false;\n', ''],
  'sem-conta': ['login-prompt', '  if(accountBusy)return false;\n', ''],
  'sem-sessao': ['login-prompt', '  if(seen)return false;\n', ''],
  'sem-intervalo': ['login-prompt', '  if(record && record.matches<LOGIN_PROMPT_MATCHES && now-record.dismissedAt<LOGIN_PROMPT_COOLDOWN_MS)return false;\n', ''],
  'empilha': ['login-prompt', "    if(document.querySelector('dialog[open]'))return;", ''],
  'sem-perfil': ['main', "onReady:ready=>initLoginPrompt({...ready,skip:Boolean(inspectionScreen || testMode || params.get('sala') || params.get('perfil'))", "onReady:ready=>initLoginPrompt({...ready,skip:Boolean(inspectionScreen || testMode || params.get('sala'))"],
  'sem-contagem': ['main', '  if (!continuaPartida) noteLoginPromptMatch();', ''],
  'telemetria-sem-consentimento': ['login-prompt', '  if(!analyticsAllowed())return;\n  try{track(step,data);}', '  try{track(step,data);}'],
};
if (MUT && !MUTANTES[MUT]) { console.error(`mutante desconhecido: ${MUT}`); process.exit(2); }
const muta = (alvo, fonte) => {
  if (!MUT || MUTANTES[MUT][0] !== alvo) return fonte;
  const [, velho, novo] = MUTANTES[MUT];
  const n = fonte.replace(velho, novo);
  if (n === fonte) { console.error(`MUTANTE ${MUT} NAO APLICOU`); process.exit(2); }
  return n;
};

let falhas = 0;
const caso = async (id, nome, fn) => {
  try { await fn(); console.log(`PASS ${id} ${nome}`); }
  catch (e) { falhas++; console.log(`RED  ${id} ${nome}: ${String(e.message).split('\n')[0]}`); }
};

const fontePrompt = muta('login-prompt', read('public/js/login-prompt.js'));
const fonteMain = muta('main', read('public/js/main.js'));
const fonteConta = read('public/js/account-entry.js');

/* ---------- parte rápida: o módulo real num vm ---------- */
function carrega({ consent = null, search = '', embedded = false, menuHidden = false, session = new Map(), store = new Map() } = {}) {
  const corpo = fontePrompt.replace(/^import .*$/gm, '').replace(/^export /gm, '');
  const ctx = {
    analyticsAllowed: () => consent === true,
    privacyChoice: () => (consent === null ? null : { analytics: consent }),
    PROVIDER_ICONS: {}, leaveTo: () => {}, socialApi: async () => ({}), guestProof: () => undefined, accountError: (e) => e.message,
    localStorage: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) },
    sessionStorage: { getItem: (k) => session.get(k) ?? null, setItem: (k, v) => session.set(k, String(v)) },
    location: { search },
    document: { documentElement: { dataset: embedded ? { embedded: 'true' } : {} }, getElementById: (id) => (id === 'main-menu' ? { classList: { contains: (c) => c === 'hidden' && menuHidden } } : null) },
    URLSearchParams, JSON, Number, Date,
  };
  vm.runInNewContext(`${corpo}\n;globalThis.__api={loginPromptDue,noteLoginPromptMatch,isEmbedded,inMatch,emit,readRecord,seenThisVisit,markSeen,LOGIN_PROMPT_KEY,LOGIN_PROMPT_SESSION_KEY,LOGIN_PROMPT_MATCHES,LOGIN_PROMPT_COOLDOWN_MS};`, ctx);
  return { api: ctx.__api, store, session };
}
const CONFIG = { providers: ['google', 'discord', 'x', 'linkedin_oidc'], email: true };
const base = (m, extra = {}) => ({ auth: { authenticated: false }, config: CONFIG, embedded: m.isEmbedded(), playing: m.inMatch(), accountBusy: false, seen: m.seenThisVisit(), record: m.readRecord(), ...extra });

await caso('LP1', 'deslogado com nick, fora de partida: o convite aparece', () => {
  const { api } = carrega();
  assert.equal(api.loginPromptDue(base(api)), true);
});
await caso('LP2', 'logado: não aparece', () => {
  const { api } = carrega();
  assert.equal(api.loginPromptDue(base(api, { auth: { authenticated: true, profile: { nick: 'x' } } })), false);
});
await caso('LP3', '?embed=1 (ou html[data-embedded]) não mostra', () => {
  for (const o of [{ search: '?embed=1' }, { embedded: true }]) { const { api } = carrega(o); assert.equal(api.isEmbedded(), true); assert.equal(api.loginPromptDue(base(api)), false); }
});
await caso('LP4', 'dentro de partida (menu escondido) não mostra', () => {
  const { api } = carrega({ menuHidden: true });
  assert.equal(api.inMatch(), true);
  assert.equal(api.loginPromptDue(base(api)), false);
});
await caso('LP5', 'passo de entrada/consentimento aberto ou pendente tem prioridade', () => {
  const { api } = carrega();
  assert.equal(api.loginPromptDue(base(api, { accountBusy: true })), false);
});
await caso('LP6', 'uma vez por visita', () => {
  const { api, session } = carrega();
  api.markSeen();
  assert.equal(session.get(api.LOGIN_PROMPT_SESSION_KEY), '1');
  const outra = carrega({ session });
  assert.equal(outra.api.loginPromptDue(base(outra.api)), false);
});
await caso('LP7', 'recusa: volta só com 3 partidas ou 24 h', () => {
  const agora = Date.UTC(2026, 9, 14, 12);
  const { api, store } = carrega();
  store.set(api.LOGIN_PROMPT_KEY, JSON.stringify({ dismissedAt: agora - 3600e3, matches: 0 }));
  assert.equal(api.loginPromptDue(base(api, { now: agora })), false, '1 h depois e 0 partidas');
  api.noteLoginPromptMatch(); api.noteLoginPromptMatch();
  assert.equal(api.loginPromptDue(base(api, { now: agora })), false, '2 partidas');
  api.noteLoginPromptMatch();
  assert.equal(api.readRecord().matches, 3);
  assert.equal(api.loginPromptDue(base(api, { now: agora })), true, '3 partidas');
  store.set(api.LOGIN_PROMPT_KEY, JSON.stringify({ dismissedAt: agora - api.LOGIN_PROMPT_COOLDOWN_MS, matches: 0 }));
  assert.equal(api.loginPromptDue(base(api, { now: agora })), true, '24 h');
  store.set(api.LOGIN_PROMPT_KEY, 'quebrado');
  assert.equal(api.readRecord(), null, 'storage corrompido não trava o jogo');
});
await caso('LP8', 'telemetria só com consentimento de analytics', () => {
  for (const consent of [null, false, true]) {
    const enviados = [];
    const { api } = carrega({ consent });
    api.emit((s, d) => enviados.push([s, d]), 'login_prompt_shown', {});
    api.emit((s, d) => enviados.push([s, d]), 'login_prompt_provider_click', { provider: 'google' });
    assert.equal(enviados.length, consent === true ? 2 : 0, `consent=${consent}`);
    if (consent) assert.deepEqual(enviados[1], ['login_prompt_provider_click', { provider: 'google' }]);
  }
  for (const nome of ['login_prompt_shown', 'login_prompt_dismissed', 'login_prompt_provider_click']) assert(fontePrompt.includes(`'${nome}'`), nome);
});
await caso('LP10', 'perfil compartilhado (/u/<perfil> abre o jogo em iframe com ?perfil=) pula o convite', () => {
  const skip = fonteMain.match(/onReady:ready=>initLoginPrompt\(\{\.\.\.ready,skip:Boolean\((.*?)\),track:/)?.[1] || '';
  assert(skip.includes("params.get('perfil')"), `skip do convite: ${skip || 'não achado'}`);
  assert(skip.includes("params.get('sala')"), 'convite de sala');
});
await caso('LP9', 'fiação: partida conta, conta vem antes, mesmo pipeline do funil', () => {
  const ini = fonteMain.indexOf('async function _startGame('), fim = fonteMain.indexOf('\n}\n', ini);
  assert(/if \(!continuaPartida\) noteLoginPromptMatch\(\);/.test(fonteMain.slice(ini, fim)), '_startGame não conta a partida');
  assert(/onReady:ready=>initLoginPrompt\(\{\.\.\.ready,skip:Boolean\(inspectionScreen \|\| testMode \|\| params\.get\('sala'\)(?: \|\| params\.get\('perfil'\))?\)/.test(fonteMain), 'convite não pendurado no onReady da conta');
  assert(/sendJsonKeepalive\('\/api\/funnel', \{ step, sessionId: getSessionId\(\), \.\.\.data \}\)/.test(fonteMain), 'transporte fora do funil');
  const h = fonteConta.indexOf('  await hydrate();\n'), r = fonteConta.indexOf('onReady({auth,config,accountBusy:()=>dialog.open || dismissed || wantsPrompt()});');
  assert(h > 0 && r > h, 'onReady tem de vir depois do hydrate (e do maybePrompt dele)');
});

/* ---------- parte de browser ---------- */
if (BROWSER) {
  const BASE = process.env.BASE;
  if (!BASE) { console.error('--browser exige BASE=http://localhost:<porta>'); process.exit(2); }
  const SHOTS = process.env.SHOTS || '';
  if (SHOTS) mkdirSync(SHOTS, { recursive: true });
  const gRoot = execSync('npm root -g').toString().trim();
  const pw = await import(pathToFileURL(`${gRoot}/playwright/index.js`).href);
  const chromium = pw.chromium || pw.default?.chromium;
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--headless=new', '--mute-audio'],
  });
  const GUEST = { authenticated: false };
  const LOGADO = { authenticated: true, profile: { nick: 'Logado' }, identities: ['google'] };
  async function abre({ auth = GUEST, nick = 'Visitante', consent = true, query = '', seed = null, viewport = { width: 1440, height: 900 }, antes = null } = {}) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: viewport.width < 500 ? 2 : 1 });
    await ctx.addInitScript(({ nick, consent, seed }) => {
      try {
        if (sessionStorage.getItem('__lp_seeded')) return;
        sessionStorage.setItem('__lp_seeded', '1');
        if (nick) localStorage.setItem('awpbr_nick', nick);
        if (consent !== null) localStorage.setItem('cs_privacy', JSON.stringify({ version: 'corosolto-analytics-v1', analytics: consent, updatedAt: new Date(0).toISOString() }));
        if (seed) localStorage.setItem('cs_login_prompt', JSON.stringify(seed));
        localStorage.setItem('cs_treta_intro', 'v1');   // apresentação da loja já vista; o LB9 cobre o empilhamento
      } catch {}
    }, { nick, consent, seed });
    const funil = [];
    let liberaAuth;
    const authPronta = antes ? new Promise((r) => { liberaAuth = r; }) : Promise.resolve();
    await ctx.route('**/api/social-auth**', async (rota) => {
      const url = rota.request().url();
      if (url.includes('action=providers')) return rota.fulfill({ json: { providers: ['google', 'discord', 'x', 'linkedin_oidc'], email: true, linking: true } });
      if (rota.request().method() === 'POST') return rota.fulfill({ status: 400, json: { error: 'provider_unavailable' } });
      await authPronta;
      return rota.fulfill({ json: auth });
    });
    await ctx.route('**/api/social?action=profile', (r) => r.fulfill({ json: { profile: { avatar_url: 'x', socials: ['x'] } } }));
    await ctx.route('**/api/funnel', (r) => { try { funil.push(JSON.parse(r.request().postData() || '{}')); } catch {} return r.fulfill({ json: { ok: true, stored: false } }); });
    if (MUT && MUTANTES[MUT][0] === 'main') {
      await ctx.route('**/js/main.js*', (rota) => rota.fulfill({ status: 200, body: fonteMain, contentType: 'text/javascript' }));
    }
    if (MUT && MUTANTES[MUT][0] === 'login-prompt') {
      await ctx.route('**/js/login-prompt.js*', (rota) => rota.fulfill({ status: 200, body: fontePrompt, contentType: 'text/javascript' }));
    }
    const page = await ctx.newPage();
    page.__falhas = [];
    page.on('requestfailed', (r) => { if (r.url().includes('/api/social')) page.__falhas.push(`${r.url().split('/api/')[1]} ${r.failure()?.errorText}`); });
    await page.goto(`${BASE}/${query}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForFunction(() => window.__CS_MAIN_READY__ === true, null, { timeout: 120000 });
    // `antes` roda logo no MAIN_READY e solta a sessão em seguida: segurar mais que 12 s estoura o timeout do socialApi.
    if (antes) { await antes(page); liberaAuth(); }
    if (await page.locator('#boot-splash').count()) await page.locator('#boot-splash').click({ timeout: 30000 }).catch(() => {});
    await page.waitForFunction(() => document.getElementById('login-prompt')?.dataset.ready === 'true' || new URLSearchParams(location.search).get('embed') === '1', null, { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(300);
    return { ctx, page, funil };
  }
  const aberto = (page) => page.evaluate(() => document.getElementById('login-prompt')?.open === true);
  const estado = (page) => page.evaluate(() => ({ dialogs: [...document.querySelectorAll('dialog[open]')].map((d) => d.id), ready: document.getElementById('login-prompt')?.dataset.ready || null, conta: document.getElementById('hub-account-login')?.textContent, menuEscondido: document.getElementById('main-menu')?.classList.contains('hidden') }));
  const esperaAberto = async (page, msg = 'popup não abriu') => {
    try { await page.waitForFunction(() => document.getElementById('login-prompt')?.open === true, null, { timeout: 20000 }); }
    catch { throw new Error(`${msg} ${JSON.stringify({ ...(await estado(page)), falhasApi: page.__falhas })}`); }
  };
  const shot = async (page, nome) => { if (!SHOTS) return; await page.mouse.move(2, 2); await page.waitForTimeout(150); await page.screenshot({ path: `${SHOTS}/${nome}.png` }); };

  await caso('LB1', 'browser: deslogado vê o convite, foco no Google, aria-modal, Esc fecha e grava a recusa', async () => {
    const { ctx, page, funil } = await abre();
    try {
      await esperaAberto(page, 'popup não abriu');
      assert.equal(await page.getAttribute('#login-prompt', 'aria-modal'), 'true');
      assert.equal(await page.evaluate(() => document.activeElement?.dataset.provider), 'google', 'foco inicial');
      const nomes = await page.$$eval('#login-prompt-providers button', (bs) => bs.map((b) => b.textContent.trim()));
      assert.deepEqual(nomes, ['Continuar com Google', 'Continuar com Discord', 'Continuar com X', 'Continuar com LinkedIn', 'Continuar com e-mail']);
      assert.equal(await page.evaluate(() => document.getElementById('account-entry-dialog').open), false, 'empilhou com o passo de entrada');
      await shot(page, 'desktop-1440x900');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
      assert.equal(await aberto(page), false, 'Esc não fechou');
      const rec = await page.evaluate(() => JSON.parse(localStorage.getItem('cs_login_prompt')));
      assert(rec && rec.matches === 0 && Date.now() - rec.dismissedAt < 60000, 'recusa não gravada');
      await page.waitForTimeout(300);
      const steps = funil.map((f) => f.step);
      assert(steps.includes('login_prompt_shown') && steps.includes('login_prompt_dismissed'), `funil: ${steps}`);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.__CS_MAIN_READY__ === true, null, { timeout: 120000 });
      if (await page.locator('#boot-splash').count()) await page.locator('#boot-splash').click().catch(() => {});
      await page.waitForFunction(() => document.getElementById('login-prompt')?.dataset.ready === 'true', null, { timeout: 60000 });
      assert.equal(await aberto(page), false, 'voltou na mesma visita');
    } finally { await ctx.close(); }
  });
  await caso('LB2', 'browser: logado não vê', async () => {
    const { ctx, page } = await abre({ auth: LOGADO, nick: 'Logado' });
    try { assert.equal(await aberto(page), false); } finally { await ctx.close(); }
  });
  await caso('LB3', 'browser: ?embed=1 não vê', async () => {
    const { ctx, page } = await abre({ query: '?embed=1' });
    try { assert.equal(await aberto(page), false); } finally { await ctx.close(); }
  });
  await caso('LB4', 'browser: sessão resolvida durante a partida não abre o convite', async () => {
    const { ctx, page } = await abre({ antes: (p) => p.evaluate(() => document.getElementById('main-menu').classList.add('hidden')) });
    try {
      assert.equal(await page.evaluate(() => document.getElementById('main-menu').classList.contains('hidden')), true, 'menu não ficou escondido');
      await page.evaluate(() => document.body.append(document.createElement('div')));
      await page.waitForTimeout(300);
      assert.equal(await aberto(page), false);
      // não vale passar no vazio: de volta ao menu, o mesmo carregamento abre o convite
      await page.evaluate(() => { document.getElementById('main-menu').classList.remove('hidden'); document.body.append(document.createElement('div')); });
      await esperaAberto(page, 'não abriu depois');
    } finally { await ctx.close(); }
  });
  await caso('LB5', 'browser: 1a visita sem nick mostra o passo de entrada (cookies) e não o convite', async () => {
    const { ctx, page } = await abre({ nick: null, consent: null });
    try {
      assert.equal(await page.evaluate(() => document.getElementById('account-entry-dialog').open), true, 'passo de entrada não abriu');
      assert.equal(await aberto(page), false, 'convite empilhou sobre o consentimento');
      await page.click('#account-entry-dialog .account-guest');
      await page.evaluate(() => document.body.append(document.createElement('div')));
      await page.waitForTimeout(300);
      assert.equal(await aberto(page), false, 'convite veio logo depois do passo de entrada');
    } finally { await ctx.close(); }
  });
  await caso('LB6', 'browser: recusa recente segura o convite; 3 partidas liberam', async () => {
    const a = await abre({ seed: { dismissedAt: Date.now() - 3600e3, matches: 2 } });
    try { assert.equal(await aberto(a.page), false, 'recusa de 1 h com 2 partidas'); } finally { await a.ctx.close(); }
    const b = await abre({ seed: { dismissedAt: Date.now() - 3600e3, matches: 3 } });
    try { await esperaAberto(b.page, '3 partidas'); } finally { await b.ctx.close(); }
  });
  await caso('LB7', 'browser: sem consentimento nenhum evento sai; clique manda o provedor', async () => {
    const a = await abre({ consent: false });
    try {
      await esperaAberto(a.page);
      await a.page.click('#login-prompt-guest');
      await a.page.waitForTimeout(300);
      assert.equal(a.funil.filter((f) => String(f.step).startsWith('login_prompt')).length, 0, 'evento sem consentimento');
    } finally { await a.ctx.close(); }
    const b = await abre();
    try {
      await b.page.click('#login-prompt [data-provider=discord]');
      await b.page.waitForTimeout(300);
      assert(b.funil.some((f) => f.step === 'login_prompt_provider_click' && f.provider === 'discord'), 'provider_click sem provedor');
      await esperaAberto(b.page, 'erro do provedor fechou o convite');
    } finally { await b.ctx.close(); }
  });
  await caso('LB9', 'browser: outro diálogo aberto (apresentação da loja) adia o convite', async () => {
    const { ctx, page } = await abre({ antes: (p) => p.evaluate(() => { const d = document.createElement('dialog'); d.id = 'lp-outro'; document.body.append(d); d.show(); }) });
    try {
      assert.equal(await aberto(page), false, 'empilhou sobre outro diálogo');
      await page.evaluate(() => { document.getElementById('lp-outro').close(); document.body.append(document.createElement('div')); });
      await esperaAberto(page, 'não abriu depois');
    } finally { await ctx.close(); }
  });
  await caso('LB10', 'browser: perfil compartilhado (?perfil=, o iframe de /u/<perfil>) não vê', async () => {
    const { ctx, page } = await abre({ query: '?secao=comunidade&social=profile&perfil=fulano' });
    try {
      await page.evaluate(() => document.body.append(document.createElement('div')));
      await page.waitForTimeout(500);
      assert.equal(await aberto(page), false, 'convite abriu sobre o perfil compartilhado');
      assert.equal(await page.evaluate(() => document.getElementById('login-prompt').dataset.ready ?? null), null, 'convite não foi pulado');
    } finally { await ctx.close(); }
  });
  await caso('LB8', 'browser: mobile 390x844 cabe sem rolagem lateral', async () => {
    const { ctx, page } = await abre({ viewport: { width: 390, height: 844 } });
    try {
      await esperaAberto(page);
      const r = await page.evaluate(() => { const b = document.getElementById('login-prompt').getBoundingClientRect(); return { l: b.left, r: b.right, t: b.top, bt: b.bottom, sw: document.getElementById('login-prompt').scrollWidth, cw: document.getElementById('login-prompt').clientWidth }; });
      assert(r.l >= 0 && r.r <= 390 && r.t >= 0 && r.bt <= 844, `fora da tela ${JSON.stringify(r)}`);
      assert(r.sw <= r.cw, 'rolagem lateral');
      const alturas = await page.$$eval('#login-prompt button', (bs) => bs.map((b) => b.getBoundingClientRect().height));
      assert(alturas.every((h) => h >= 44), `alvo de toque < 44px: ${alturas}`);
      await shot(page, 'mobile-390x844');
    } finally { await ctx.close(); }
  });
  await browser.close();
}

console.log(falhas ? `\n${falhas} RED${MUT ? ` [mutante ${MUT}]` : ''}` : `\nlogin-prompt: tudo verde${MUT ? ` [mutante ${MUT} NÃO pegou]` : ''}`);
process.exit(falhas ? 1 : (MUT ? 3 : 0));
