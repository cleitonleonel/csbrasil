// Guias no lobby; as mesmas URLs continuam navegáveis sem JavaScript.
import { LANG, resolveGeoLang } from './i18n.js';
await resolveGeoLang();
const pairs = { '/personagens': '/characters', '/como-jogar': '/how-to-play', '/armas': '/weapons', '/mapas': '/maps', '/sobre': '/about', '/changelog': '/whats-new' };
if (LANG === 'en') {
  for (const link of document.querySelectorAll('.hub-link-grid a, a.hub-changelog, .hub-content-tabs a')) {
    const translated = pairs[link.getAttribute('href')];
    if (translated) link.setAttribute('href', translated);
  }
  for (const node of document.querySelectorAll('#game-faq [data-en]')) node.textContent = node.dataset.en;
  for (const node of document.querySelectorAll('[data-content-en]')) node.textContent = node.dataset.contentEn;
}
const tabs = [...document.querySelectorAll('.hub-content-tabs [role="tab"]')];
const overview = document.getElementById('hub-about-overview');
const panel = document.getElementById('hub-about-content');
const frame = document.getElementById('hub-guide-frame');
const loading = panel?.querySelector('[role="status"]');
let observer;
let currentUrl;
const contentPaths = new Set([...Object.keys(pairs), ...Object.values(pairs), '/mapa', '/apoie']);
function select(tab, syncUrl = true) {
  const general = tab.dataset.guide === 'overview';
  const pageUrl = new URL(location.href);
  pageUrl.searchParams.set('guia', tab.dataset.guide);
  if (syncUrl) history.replaceState(history.state, '', pageUrl);
  for (const item of tabs) {
    item.setAttribute('aria-selected', String(item === tab));
    item.tabIndex = item === tab ? 0 : -1;
  }
  overview.hidden = !general;
  panel.hidden = general;
  if (general) return;
  panel.setAttribute('aria-labelledby', tab.id);
  const url = new URL(tab.href);
  url.searchParams.set('embed', '1');
  if (url.href !== currentUrl) {
    observer?.disconnect();
    frame.hidden = true;
    loading.hidden = false;
    loading.textContent = LANG === 'en' ? 'LOADING GUIDE…' : 'CARREGANDO GUIA…';
    frame.title = tab.textContent.trim();
    currentUrl = url.href;
    frame.src = url.href;
  }
}
for (const tab of tabs) {
  tab.addEventListener('click', event => { event.preventDefault(); select(tab); });
  tab.addEventListener('keydown', event => {
    const index = tabs.indexOf(tab);
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    tabs[next].focus();
    select(tabs[next]);
  });
}
frame?.addEventListener('load', () => {
  const doc = frame.contentDocument;
  if (!doc?.body) return;
  currentUrl = frame.contentWindow.location.href;
  loading.hidden = true;
  frame.hidden = false;
  const resize = () => {
    const height = `${Math.ceil(doc.body.getBoundingClientRect().height) + 2}px`;
    if (frame.style.height !== height) requestAnimationFrame(() => { frame.style.height = height; });
  };
  observer?.disconnect();
  observer = new ResizeObserver(resize);
  observer.observe(doc.body);
  resize();
  doc.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link || link.target === '_blank' || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href);
    const current = new URL(frame.contentWindow.location.href);
    if (url.hash && url.pathname === current.pathname && url.origin === current.origin) {
      const target = doc.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (target) {
        event.preventDefault();
        const top = window.scrollY + frame.getBoundingClientRect().top + target.getBoundingClientRect().top;
        window.scrollTo({ top: Math.max(0, top - 16), behavior: 'smooth' });
        return;
      }
    }
    if (url.origin !== location.origin) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      return;
    }
    if (url.pathname === '/') {
      event.preventDefault();
      document.querySelector('.hub-tabs [data-hub-tab="jogar"]')?.click();
    } else if (contentPaths.has(url.pathname) || url.pathname.startsWith('/faccoes/')) {
      if (LANG === 'en' && pairs[url.pathname]) url.pathname = pairs[url.pathname];
      url.searchParams.set('embed', '1');
      link.href = url.href;
    }
  });
});
// Cards de guias e changelog abrem a subtab correspondente dentro do lobby.
for (const link of document.querySelectorAll('.hub-link-grid a, a.hub-changelog, #hub-ui a[href="/mapa"], .menu-footer a')) {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || new URLSearchParams(location.search).get('home') === 'legacy') return;
    const url = new URL(link.href);
    if (LANG === 'en' && pairs[url.pathname]) url.pathname = pairs[url.pathname];
    const tab = tabs.find(item => item.href === url.href);
    if (!tab) return;
    event.preventDefault();
    document.querySelector('.hub-tabs [data-hub-tab="sobre"]')?.click();
    select(tab);
    tab.focus();
  });
}

const requested = new URLSearchParams(location.search).get('guia');
const initialTab = tabs.find(tab => tab.dataset.guide === requested);
if (initialTab) select(initialTab);
window.addEventListener('popstate', () => {
  const guide = new URLSearchParams(location.search).get('guia');
  select(tabs.find(tab => tab.dataset.guide === guide) ?? tabs[0], false);
});
