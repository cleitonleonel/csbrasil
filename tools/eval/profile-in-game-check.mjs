/* profile-in-game-check.mjs — /u/<perfil> ABRE DENTRO DO JOGO SEM PERDER O SEO?
   Pedido do dono (14/10/2026): quem abre /u/<perfil> cai no hub do jogo com o perfil aberto,
   pronto para jogar, sem o clique em "VER PERFIL NO JOGO". A resposta SSR continua sendo a
   página (crawler, prévia de link e quem está sem JS); o jogo sobe por cima num iframe da
   mesma origem e a URL /u/<perfil> fica.

   Mede o ARTEFATO: o handler SSR de `.vercel/output` com o backend interceptado, e executa
   os scripts inline da resposta num DOM mínimo.
     PG1 · perfil público: 200, title, description, canonical, og:url, og:image, twitter:image,
           og:type=profile e hreflang no host decidido; o perfil SSR legível com o nick
     PG2 · no topo, o JS monta UM iframe da mesma origem em /?secao=comunidade&social=profile&
           perfil=<id>, com fullscreen; o conteúdo SSR fica inert; o documento não navega
     PG3 · já dentro de um quadro (top !== self) não monta outro jogo
     PG4 · perfil privado: 404, noindex, sem og:image, sem iframe, com a entrada ao jogo
     PG5 · link do jogo que sai da rota "/" abre fora do quadro; rota do jogo fica no quadro
     PG6 · o jogo: o convite de conta não cobre o perfil compartilhado, o painel da conta
           começa recolhido e o login social sai do quadro da mesma origem

   Uso: npm run build && node tools/eval/profile-in-game-check.mjs [--mutate]
   --mutate desfaz cada garantia numa cópia do artefato/fonte e exige vermelho. */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';

const CANONICO = 'https://www.corosolto.com.br';
const ID = '11111111-1111-4111-8111-1111111111aa';
const PRIVADO = '22222222-2222-4222-8222-2222222222bb';
const HANDLE = 'treta_fixture';
const PERFIL = { id: ID, handle: HANDLE, nick: 'Fixture Treta', url: `/u/${HANDLE}`, visibility: 'public', source: 'server_verified',
  points: 321, kills: 45, deaths: 6, kd: 7.5, round_wins: 9, level: 4, next_level_points: 79, position: 12, bio: 'Bio da fixture',
  socials: [], avatar_url: null, last_character: null, account_verified: false };
const ROOT = process.cwd();
const FUNC = path.join(ROOT, '.vercel/output/functions/_render.func');
const MUTATE = process.argv.includes('--mutate');
const read = (f) => readFileSync(path.join(ROOT, f), 'utf8');

async function coletar() {
  const cfg = path.join(FUNC, '.vc-config.json');
  const entry = existsSync(cfg) && path.join(FUNC, JSON.parse(readFileSync(cfg, 'utf8')).handler);
  if (!entry || !existsSync(entry)) return null;
  process.chdir(FUNC);
  const { default: handler } = await import(pathToFileURL(entry).href);
  const fetchReal = globalThis.fetch;
  globalThis.fetch = async (alvo, init) => {
    const url = String(alvo?.url ?? alvo);
    if (url.includes(`action=profile&id=${HANDLE}`)) return Response.json({ profile: PERFIL });
    if (url.includes(`action=profile&id=${PRIVADO}`)) return Response.json({ profile: { ...PERFIL, id: PRIVADO, visibility: 'private' } });
    return fetchReal(alvo, init);
  };
  const pedir = async (rota) => {
    const r = await handler.fetch(new Request(`${CANONICO}${rota}`, { headers: { 'x-forwarded-for': '127.0.0.1' } }));
    return { status: r.status, html: await r.text() };
  };
  const pub = await pedir(`/u/${HANDLE}`), priv = await pedir(`/u/${PRIVADO}`);
  globalThis.fetch = fetchReal;
  process.chdir(ROOT);
  return { pub, priv, main: read('public/js/main.js'), entry: read('public/js/account-entry.js'), community: read('public/js/community.js') };
}

const head = (html) => html.slice(0, Math.max(0, html.search(/<\/head>/i)));
const meta = (html, chave) => head(html).match(new RegExp(`<meta\\b[^>]*(?:property|name)="${chave}"[^>]*content="([^"]*)"`))?.[1]
  ?? head(html).match(new RegExp(`<meta\\b[^>]*content="([^"]*)"[^>]*(?:property|name)="${chave}"`))?.[1];
const link = (html, rel) => head(html).match(new RegExp(`<link\\b[^>]*rel="${rel}"[^>]*href="([^"]*)"`))?.[1];
const scripts = (html) => [...html.slice(html.search(/<body\b/i)).matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);

// DOM mínimo: o bastante para os scripts inline da página, e nada que navegue sem registro.
function executar(html, { emQuadro = false } = {}) {
  const navegou = [], classes = new Set();
  let foco = null;
  const no = (tag) => ({ tagName: tag.toUpperCase(), attrs: {}, children: [], listeners: {}, inert: false,
    setAttribute(k, v) { this.attrs[k] = String(v); }, getAttribute(k) { return this.attrs[k] ?? null; },
    addEventListener(t, f) { (this.listeners[t] ||= []).push(f); }, focus() { foco = this; } });
  const body = no('body');
  body.children.push(no('a'), no('header'), no('main'), no('footer'));
  body.append = (...n) => body.children.push(...n);
  const location = { origin: CANONICO, pathname: `/u/${HANDLE}`,
    get href() { return `${CANONICO}/u/${HANDLE}`; }, set href(v) { navegou.push(['href', v]); },
    replace(v) { navegou.push(['replace', v]); }, assign(v) { navegou.push(['assign', v]); }, reload() { navegou.push(['reload']); } };
  const window = { location };
  window.self = window;
  window.top = emQuadro ? { location: { origin: CANONICO } } : window;
  const document = { body, documentElement: { classList: { add: (c) => classes.add(c) } }, createElement: no };
  for (const s of scripts(html)) vm.runInNewContext(s, { window, document, location, URL, Array, console });
  const quadros = body.children.filter((n) => n.tagName === 'IFRAME');
  const ssr = body.children.filter((n) => n.tagName !== 'IFRAME');
  return { navegou, classes, quadros, ssr, foco: () => foco };
}

const CASOS = [
  ['PG1 · perfil público mantém status, metas e o perfil SSR', (b) => {
    const { status, html } = b.pub;
    if (status !== 200) return `status ${status}`;
    const titulo = html.match(/<title>([^<]*)<\/title>/)?.[1] || '';
    if (!titulo.includes(PERFIL.nick)) return `title sem o nick: ${titulo}`;
    if (!/321 pontos/.test(meta(html, 'description') || '')) return `description sem os pontos: ${meta(html, 'description')}`;
    const esperado = CANONICO + PERFIL.url, img = `${CANONICO}/api/profile-card/${HANDLE}.png`;
    if (link(html, 'canonical') !== esperado) return `canonical ${link(html, 'canonical')}`;
    if (meta(html, 'og:url') !== esperado) return `og:url ${meta(html, 'og:url')}`;
    if (meta(html, 'og:image') !== img) return `og:image ${meta(html, 'og:image')}`;
    if (meta(html, 'twitter:image') !== img) return `twitter:image ${meta(html, 'twitter:image')}`;
    if (meta(html, 'og:type') !== 'profile') return `og:type ${meta(html, 'og:type')}`;
    if (!new RegExp(`<link\\b[^>]*hreflang="pt-BR"[^>]*href="${esperado}"`).test(head(html))) return 'hreflang pt-BR ausente';
    if (/name="robots" content="noindex/.test(html)) return 'perfil público marcado noindex';
    if (!/<article\b[^>]*profile-sheet[\s\S]*Fixture Treta[\s\S]*<\/article>/.test(html)) return 'perfil SSR legível ausente';
    return null;
  }],
  ['PG2 · no topo, monta o jogo da mesma origem com este perfil aberto', (b) => {
    const r = executar(b.pub.html);
    if (r.navegou.length) return `o documento navegou: ${JSON.stringify(r.navegou)}`;
    if (r.quadros.length !== 1) return `${r.quadros.length} iframe(s) montados; esperado 1`;
    const f = r.quadros[0], url = new URL(f.src, CANONICO + '/');
    if (url.origin !== CANONICO || url.pathname !== '/') return `iframe fora do jogo: ${f.src}`;
    for (const [k, v] of [['secao', 'comunidade'], ['social', 'profile'], ['perfil', ID]])
      if (url.searchParams.get(k) !== v) return `iframe sem ${k}=${v}: ${f.src}`;
    if (!/\bfullscreen\b/.test(f.allow || '')) return `iframe sem fullscreen: ${f.allow}`;
    if (!f.title) return 'iframe sem title';
    if (r.ssr.some((n) => !n.inert)) return 'conteúdo SSR atrás do jogo continua focável';
    if (!r.classes.has('profile-in-game')) return 'documento não trava a rolagem atrás do jogo';
    for (const fn of f.listeners.load || []) fn();
    if (r.foco() !== f) return 'o jogo não recebe o foco ao carregar';
    return null;
  }],
  ['PG3 · dentro de um quadro, não monta outro jogo', (b) => {
    const r = executar(b.pub.html, { emQuadro: true });
    if (r.quadros.length) return 'montou um jogo dentro do jogo';
    if (r.navegou.length) return `navegou dentro do quadro: ${JSON.stringify(r.navegou)}`;
    return null;
  }],
  ['PG4 · perfil privado segue indisponível, sem jogo montado por cima', (b) => {
    const { status, html } = b.priv;
    if (status !== 404) return `status ${status}`;
    if (!/name="robots" content="noindex/.test(html)) return 'privado sem noindex';
    if (meta(html, 'og:image')) return 'privado expõe og:image';
    if (html.includes(PERFIL.nick)) return 'privado vaza o nick';
    const r = executar(html);
    if (r.quadros.length) return 'privado montou o jogo com o perfil';
    if (!r.navegou.some(([tipo, alvo]) => tipo === 'replace' && /secao=comunidade/.test(alvo))) return 'privado perdeu a entrada ao jogo';
    return null;
  }],
  ['PG5 · link que sai do jogo abre fora do quadro', (b) => {
    const r = executar(b.pub.html), f = r.quadros[0];
    if (!f) return 'sem iframe';
    let captura = null;
    f.contentDocument = { baseURI: `${CANONICO}/?secao=comunidade`, addEventListener: (t, fn, c) => { if (t === 'click' && c === true) captura = fn; } };
    for (const fn of f.listeners.load || []) fn();
    if (!captura) return 'o quadro não observa os cliques de link';
    const clique = (href, target = '') => { const a = { href: new URL(href, CANONICO).href, target }; captura({ target: { closest: () => a } }); return a.target; };
    for (const href of ['/privacidade', '/u/outro_perfil', 'https://x.com/corosolto'])
      if (clique(href) !== '_top') return `${href} ficaria preso no quadro`;
    for (const href of ['/?secao=jogar', '/?secao=comunidade&social=ranking'])
      if (clique(href) !== '') return `${href} sairia do jogo`;
    if (clique('/privacidade', '_blank') !== '_blank') return 'link com target próprio foi reescrito';
    return null;
  }],
  ['PG6 · o jogo recebe o perfil compartilhado: sem convite por cima, conta recolhida, login fora do quadro', (b) => {
    const skip = b.main.match(/initAccountEntry\(\{skipPrompt:(Boolean\([^\n]*?\)),onSession/)?.[1];
    if (!skip) return 'skipPrompt do initAccountEntry não encontrado';
    const avalia = (q) => vm.runInNewContext(skip, { inspectionScreen: null, testMode: false, params: new URLSearchParams(q), Boolean });
    if (avalia('?secao=comunidade&social=profile&perfil=' + ID) !== true) return 'convite de conta cobre o perfil compartilhado';
    if (avalia('?secao=jogar') !== false) return 'convite de conta sumiu da entrada comum';
    const recolhe = b.community.match(/^\s*(if\(new URLSearchParams\(location\.search\)\.get\('perfil'\)\)[^\n]*)$/m)?.[1];
    if (!recolhe) return 'painel da conta não recolhe no perfil compartilhado';
    const painel = { open: true, removeAttribute(k) { if (k === 'open') this.open = false; } };
    vm.runInNewContext(recolhe, { URLSearchParams, location: { search: '?perfil=' + ID }, account: { closest: (s) => (s === 'details' ? painel : null) } });
    if (painel.open) return 'painel da conta continua aberto por cima do perfil';
    const leave = b.entry.match(/^const leaveTo=[^\n]*$/m)?.[0];
    if (!leave) return 'account-entry sem saída do quadro para o login social';
    if (/location\.assign\(out\.url\)/.test(b.entry) || (b.entry.match(/leaveTo\(out\.url\)/g) || []).length < 2) return 'login social ainda navega dentro do quadro';
    const ida = (cenario) => {
      const log = [], location = { origin: CANONICO, assign: (u) => log.push(['quadro', u]) };
      const self = {};
      const top = cenario === 'topo' ? self : cenario === 'mesma' ? { location: { origin: CANONICO, assign: (u) => log.push(['topo', u]) } }
        : { get location() { throw new Error('SecurityError'); } };
      vm.runInNewContext(`${leave};leaveTo('https://accounts.example/oauth')`, { location, top, self });
      return log.map(([onde]) => onde).join();
    };
    if (ida('mesma') !== 'topo') return 'login dentro do iframe de /u não sai do quadro';
    if (ida('topo') !== 'quadro') return 'login fora de quadro mudou de destino';
    if (ida('outra') !== 'quadro') return 'portal de outra origem quebrou o login';
    return null;
  }],
];

const rodar = (b) => CASOS.map(([nome, f]) => { let erro; try { erro = f(b); } catch (e) { erro = `exceção: ${e.message}`; } return { nome, erro }; });
const build = await coletar();
if (!build) { console.error('✗ sem build: rode `npm run build` antes (precisa de .vercel/output).'); process.exit(1); }

if (MUTATE) {
  const pub = (b, f) => ({ ...b, pub: { ...b.pub, html: f(b.pub.html) } });
  const montagem = (html) => scripts(html).find((s) => s.includes('profile-game')) || '';
  const MUTANTES = [
    ['PG1', 'canonical some do perfil', (b) => pub(b, (h) => h.replace(/<link rel="canonical"[^>]*>/, ''))],
    ['PG1', 'og:image some do perfil', (b) => pub(b, (h) => h.replace(/<meta property="og:image" [^>]*>/, ''))],
    ['PG1', 'canonical vira a home', (b) => pub(b, (h) => h.replace(`<link rel="canonical" href="${CANONICO}/u/${HANDLE}"`, `<link rel="canonical" href="${CANONICO}/"`))],
    ['PG1', 'perfil SSR some e só o jogo fica', (b) => pub(b, (h) => h.replace(/<article\b[\s\S]*?<\/article>/, ''))],
    ['PG2', 'página sem a montagem do jogo', (b) => pub(b, (h) => h.replace(montagem(h), ''))],
    ['PG2', 'iframe aponta para fora do site', (b) => pub(b, (h) => h.replace('frame.src=game', "frame.src='https://evil.example/'+game"))],
    ['PG2', 'perfil público redireciona em vez de montar', (b) => pub(b, (h) => h.replace(montagem(h), 'location.replace(game);'))],
    ['PG2', 'conteúdo SSR continua focável atrás do jogo', (b) => pub(b, (h) => h.replace('node.inert=true;', ''))],
    ['PG3', 'sem a guarda de quadro', (b) => pub(b, (h) => h.replace('if(window.top!==window.self)return;', ''))],
    ['PG4', 'privado também monta o jogo', (b) => ({ ...b, priv: { ...b.priv, html: b.priv.html.replace('</body>', `<script>${montagem(b.pub.html).replace(/const game = [^;]*;/, `const game = "/?secao=comunidade&social=profile&perfil=${PRIVADO}";`)}</script></body>`) } })],
    ['PG5', 'link que sai do jogo fica preso no quadro', (b) => pub(b, (h) => h.replace("a.target='_top'", 'void 0'))],
    ['PG6', 'convite de conta cobre o perfil compartilhado', (b) => ({ ...b, main: b.main.replace(" || params.get('perfil')", '') })],
    ['PG6', 'painel da conta aberto por cima do perfil', (b) => ({ ...b, community: b.community.replace(/^\s*if\(new URLSearchParams\(location\.search\)\.get\('perfil'\)\)[^\n]*\n/m, '') })],
    ['PG6', 'login social navega dentro do quadro', (b) => ({ ...b, entry: b.entry.replace(/^const leaveTo=[^\n]*$/m, 'const leaveTo=url=>location.assign(url);') })],
  ];
  let cegas = 0;
  console.log('PERFIL NO JOGO (MUTANTES: cada um tem que FALHAR)\n');
  for (const [alvo, nome, aplica] of MUTANTES) {
    const m = aplica(build);
    if (JSON.stringify(m) === JSON.stringify(build)) { console.error(`✗ MUTANTE NÃO APLICOU: ${nome}`); process.exit(1); }
    const mordeu = rodar(m).some((r) => r.nome.startsWith(alvo) && r.erro);
    if (!mordeu) cegas++;
    console.log(` ${mordeu ? '✓' : '✗'} ${alvo} · ${nome}`);
  }
  if (cegas) { console.error(`\n✗ RÉGUA CEGA: ${cegas} mutante(s) passaram.`); process.exit(1); }
  console.log(`\n✓ a régua MORDE: os ${MUTANTES.length} mutantes ficaram vermelhos.`);
  process.exit(0);
}

const res = rodar(build);
for (const r of res) console.log(` ${r.erro ? '✗' : '✓'} ${r.nome}${r.erro ? '\n     ' + r.erro : ''}`);
const falhas = res.filter((r) => r.erro).length;
console.log(`\n${falhas ? '✗' : '✓'} perfil no jogo ${res.length - falhas}/${res.length}`);
process.exit(falhas ? 1 : 0);
