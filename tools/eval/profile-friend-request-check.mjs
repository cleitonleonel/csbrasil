/* profile-friend-request-check.mjs · "PEDIR AMIZADE" RESPONDE AO LADO DO BOTÃO?
   Bug do dono (14/10/2026, alpha.92): clicar em PEDIR AMIZADE no perfil do #13 não fazia nada.
   Causa: social_action (backend, migration 040) só aceita alvo com conta (`auth_user is not
   null`); perfil de histórico sem conta responde 404 not_found. O cliente não tinha texto para
   not_found e escrevia o erro genérico no #social-status, que fica no topo da comunidade, fora
   da tela quando o perfil está rolado. Sucesso também só aparecia lá em cima.

     FR1 · alvo sem conta (404 not_found): aviso ao lado do botão explica, e o botão some
     FR2 · alvo com conta: pedido sai uma vez, aviso "enviado" ao lado, botão vira CANCELAR PEDIDO
     FR3 · falha de rede ou servidor: o erro aparece ao lado do botão, não só no topo

   Roda o public/js/community.js real numa DOM mínima, com a API social simulada.
   Uso: node tools/eval/profile-friend-request-check.mjs [--mutate] */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const read = (f) => readFileSync(path.join(ROOT, f), 'utf8');
const MUTATE = process.argv.includes('--mutate');
const EU = '11111111-1111-4111-8111-1111111111aa', ALVO = '22222222-2222-4222-8222-2222222222bb';

class El {
  constructor(tag) { this.tagName = tag.toUpperCase(); this.children = []; this.attrs = {}; this.dataset = {}; this.textContent = ''; this.className = ''; this.hidden = false; this.disabled = false; }
  append(...n) { this.children.push(...n); } replaceChildren(...n) { this.children = n; this.textContent = ''; }
  setAttribute(k, v) { this.attrs[k] = String(v); } getAttribute(k) { return this.attrs[k] ?? null; } removeAttribute(k) { delete this.attrs[k]; }
  addEventListener() {} querySelector(sel) { return todos(this).find((n) => n.tagName === sel.toUpperCase()) || null; } focus() {} closest() { return null; }
}
const todos = (n) => [n, ...n.children.filter((x) => x && typeof x === 'object').flatMap(todos)];
const semImport = (src) => src.replace(/^import[^\n]*\n/gm, '');
function carregar(ctx, src) {
  const nomes = [...src.matchAll(/export (?:async )?(?:function|const) (\w+)/g)].map((m) => m[1]);
  Object.assign(ctx, vm.runInContext(`(()=>{${semImport(src).replace(/export /g, '')};return {${nomes.join(',')}}})()`, ctx));
}
const esperar = async () => { for (let n = 0; n < 20; n++) await new Promise((r) => setImmediate(r)); };

// `pedido` responde ao POST request: {status, body}. A relação do alvo muda conforme o servidor aceitou.
async function abrir(community, pedido) {
  const ids = Object.fromEntries(['community', 'social-status', 'social-account', 'social-content', 'social-unread', 'hub-social-unread'].map((id) => [id, new El('div')]));
  ids.community.dataset = { profile: ALVO, tab: 'profile' };
  let relacao = null; const posts = [];
  const perfil = () => ({ id: ALVO, nick: 'Kogos', url: `/u/${ALVO}`, visibility: 'public', source: 'historical_plus_server_verified', relationship: relacao,
    points: 2772, kills: 2763, deaths: 149, kd: 18.54, matches: 39, round_wins: 52, round_losses: 6, level: 28, next_level_points: 28, position: 13,
    bio: '', socials: [], avatar_url: null, last_character: null, account_verified: false, achievements: [], favorites: [], history: [], play_seconds: 0, legacy_points: 1928, verified_points: 844 });
  const estado = { profile: { id: EU, nick: 'Eu' }, friends: [], requests: [], notifications: [], blocks: [], feed: [], invites: [], inbox: { conversations: [] } };
  const ctx = vm.createContext({
    document: { createElement: (t) => new El(t), createTextNode: (t) => t, getElementById: (id) => ids[id] || null, querySelectorAll: () => [], addEventListener() {} },
    URL, URLSearchParams, console, location: { origin: 'http://localhost', href: 'http://localhost/', search: '' }, AbortSignal: { timeout: () => null }, setInterval: () => 1,
    navigator: { clipboard: { writeText: async () => {} } }, CustomEvent: class {},
    fetch: async (alvo, opts = {}) => {
      if (opts.method === 'POST') {
        const body = JSON.parse(opts.body); posts.push(body);
        if (body.action !== 'request') return { ok: true, json: async () => ({ ok: true }) };
        const r = await pedido(body);
        if (r.status === 200 && r.body?.state) relacao = r.body.state === 'accepted' ? 'friend' : 'outgoing';
        return { ok: r.status < 400, status: r.status, json: async () => r.body };
      }
      const a = new URL(alvo, 'http://localhost').searchParams.get('action');
      return { ok: true, json: async () => (a === 'profile' ? { profile: perfil() } : estado) };
    },
    mountAccountEntry() {}, mountProfilePreferences() {}, mountAccountIntegrations() {}, acceptAccount() {}, logoutAccount() {},
    loadAccount: async () => ({ authenticated: true, profile: { id: EU, nick: 'Eu' } }), loadAuthOptions: async () => ({ providers: [] }),
  });
  for (const f of ['profile-character-catalog', 'career-rank', 'account-verified', 'community-inbox', 'profile-character', 'ranking-player']) carregar(ctx, read(`public/js/${f}.js`));
  vm.runInContext(semImport(community), ctx, { timeout: 1000 });
  await esperar();
  const raiz = ids['social-content'];
  const botao = (t) => todos(raiz).find((n) => n.tagName === 'BUTTON' && n.textContent === t);
  const aviso = () => todos(raiz).find((n) => n.className === 'social-inline-status');
  return { raiz, botao, aviso, posts, topo: ids['social-status'], clicar: async (t) => { await botao(t).onclick(); await esperar(); } };
}

const CASOS = [
  ['FR1 · alvo sem conta: explica ao lado e tira o botão', async (c) => {
    const u = await abrir(c, async () => ({ status: 404, body: { error: 'not_found' } }));
    if (!u.botao('PEDIR AMIZADE')) return 'perfil sem PEDIR AMIZADE na fixture';
    await u.clicar('PEDIR AMIZADE');
    if (u.posts.filter((p) => p.action === 'request').length !== 1) return 'pedido não saiu';
    if (!/não tem conta/.test(u.aviso()?.textContent || '')) return `aviso ao lado: "${u.aviso()?.textContent || ''}"`;
    if (u.botao('PEDIR AMIZADE')) return 'botão continua oferecendo uma ação que o servidor recusa';
    return null;
  }],
  ['FR2 · alvo com conta: enviado ao lado e vira CANCELAR PEDIDO', async (c) => {
    const u = await abrir(c, async () => ({ status: 200, body: { ok: true, state: 'pending' } }));
    await u.clicar('PEDIR AMIZADE');
    if (!/Pedido de amizade enviado/.test(u.aviso()?.textContent || '')) return `aviso ao lado: "${u.aviso()?.textContent || ''}"`;
    if (!u.botao('CANCELAR PEDIDO')) return 'botão não mudou para CANCELAR PEDIDO';
    if (u.posts.filter((p) => p.action === 'request').length !== 1) return 'pedido duplicado';
    return null;
  }],
  ['FR3 · falha do servidor aparece ao lado do botão', async (c) => {
    const u = await abrir(c, async () => ({ status: 503, body: { error: 'social_unavailable' } }));
    const antes = u.aviso();
    await u.botao('PEDIR AMIZADE').onclick(); await esperar();
    if (!/fora do ar/.test(antes?.textContent || '')) return `erro só no topo: aviso="${antes?.textContent || ''}" topo="${u.topo.textContent}"`;
    return null;
  }],
];

const rodar = async (c) => { const out = []; for (const [nome, f] of CASOS) { let erro; try { erro = await f(c); } catch (e) { erro = `exceção: ${e.message}`; } out.push({ nome, erro }); } return out; };
const fonte = read('public/js/community.js');

if (MUTATE) {
  const MUTANTES = [
    ['FR1', 'sem texto para not_found', fonte.replace("if(e.message!=='not_found')throw e;", 'throw e;')],
    ['FR1', 'botão não some', fonte.replace("else if(!noAccountTargets.has(p.id))buttons.append(button('PEDIR AMIZADE'", "else buttons.append(button('PEDIR AMIZADE'")],
    ['FR2', 'volta ao action() sem aviso', fonte.replace("()=>requestFriend(p)", "()=>action('request',p.id)")],
    ['FR3', 'erro só no topo', fonte.replace('if(feedback)feedback.textContent=t;', '')],
  ];
  let cegas = 0;
  console.log('PEDIR AMIZADE (MUTANTES: cada um tem que FALHAR)\n');
  for (const [alvo, nome, src] of MUTANTES) {
    if (src === fonte) { console.error(`✗ MUTANTE NÃO APLICOU: ${nome}`); process.exit(1); }
    const mordeu = (await rodar(src)).some((r) => r.nome.startsWith(alvo) && r.erro);
    if (!mordeu) cegas++;
    console.log(` ${mordeu ? '✓' : '✗'} ${alvo} · ${nome}`);
  }
  if (cegas) { console.error(`\n✗ RÉGUA CEGA: ${cegas} mutante(s) passaram.`); process.exit(1); }
  console.log(`\n✓ a régua MORDE: os ${MUTANTES.length} mutantes ficaram vermelhos.`);
  process.exit(0);
}
const res = await rodar(fonte);
for (const r of res) console.log(` ${r.erro ? '✗' : '✓'} ${r.nome}${r.erro ? '\n     ' + r.erro : ''}`);
const falhas = res.filter((r) => r.erro).length;
console.log(`\n${falhas ? '✗' : '✓'} pedir amizade ${res.length - falhas}/${res.length}`);
process.exit(falhas ? 1 : 0);
