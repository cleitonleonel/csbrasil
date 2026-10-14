/* Convite de login depois da partida (dono, 14/10/2026): nada abre antes da 1ª partida terminar.
 * Não bloqueia, 1x por visita; recusado volta após 3 partidas ou 24 h. Régua: tools/eval/login-prompt-check.mjs. */
import {analyticsAllowed,privacyChoice} from './privacy-preferences.js';
import {PROVIDER_ICONS,socialApi,guestProof,accountError,leaveTo} from './account-entry.js';

export const LOGIN_PROMPT_KEY='cs_login_prompt';
export const LOGIN_PROMPT_SESSION_KEY='cs_login_prompt_seen';
export const LOGIN_PROMPT_MATCHES=3;
export const LOGIN_PROMPT_COOLDOWN_MS=24*60*60*1000;
const PROVIDERS=[['google','Google'],['discord','Discord'],['x','X'],['linkedin_oidc','LinkedIn']];

let sessionSeen=false;
function readRecord() {
  try{const v=JSON.parse(localStorage.getItem(LOGIN_PROMPT_KEY) || 'null');return v && Number.isFinite(v.dismissedAt)?{dismissedAt:v.dismissedAt,matches:Number.isFinite(v.matches)?v.matches:0}:null;}catch{return null;}
}
function writeRecord(value) {
  try{localStorage.setItem(LOGIN_PROMPT_KEY,JSON.stringify(value));}catch{ /* sem storage: vale só a trava da visita */ }
}
function seenThisVisit() {
  if(sessionSeen)return true;
  try{return sessionStorage.getItem(LOGIN_PROMPT_SESSION_KEY)==='1';}catch{return false;}
}
function markSeen() {
  sessionSeen=true;
  try{sessionStorage.setItem(LOGIN_PROMPT_SESSION_KEY,'1');}catch{}
}
/* Partida começada conta para o retorno do convite recusado (main.js, _startGame). */
export function noteLoginPromptMatch() {
  const r=readRecord();
  if(r)writeRecord({...r,matches:r.matches+1});
}
export function isEmbedded() {
  try{return new URLSearchParams(location.search).get('embed')==='1' || document.documentElement.dataset.embedded==='true';}catch{return false;}
}
export function inMatch() {
  return !!document.getElementById('main-menu')?.classList.contains('hidden');
}
/* Decisão pura: cada guarda é uma linha para o mutante da régua conseguir apagá-la. */
export function loginPromptDue({auth,config,ended,embedded,playing,accountBusy,seen,record,now=Date.now()}) {
  if(!ended)return false;
  if(auth?.authenticated)return false;
  if(embedded)return false;
  if(playing)return false;
  if(accountBusy)return false;
  if(seen)return false;
  if(!config?.providers?.length && !config?.email)return false;
  if(record && record.matches<LOGIN_PROMPT_MATCHES && now-record.dismissedAt<LOGIN_PROMPT_COOLDOWN_MS)return false;
  return true;
}
function emit(track,step,data) {
  if(!analyticsAllowed())return;
  try{track(step,data);}catch{ /* medição nunca derruba o convite */ }
}
const providerId=(id,config)=>id==='x' && config.providers?.includes('twitter') && !config.providers?.includes('x')?'twitter':id;

export function initLoginPrompt({auth=null,config=null,accountBusy=()=>false,skip=false,track=()=>{}}={}) {
  const dialog=document.getElementById('login-prompt');
  if(!dialog || skip)return;
  const list=document.getElementById('login-prompt-providers'),status=document.getElementById('login-prompt-status');
  let previousFocus=null,ended=false,owed=false;
  // Fim da decisão pós-partida (mostrou e fechou, ou não era a vez): a apresentação da loja vem depois.
  const settle=()=>{if(!owed)return;owed=false;document.dispatchEvent(new CustomEvent('cs-pos-partida'));};
  const hide=reason=>{
    if(!dialog.open)return;
    if(reason){writeRecord({dismissedAt:Date.now(),matches:0});emit(track,'login_prompt_dismissed',{reason});}
    dialog.close();previousFocus?.focus?.();
  };
  const button=(cls,label,provider,fn)=>{
    const b=document.createElement('button');b.type='button';b.className=cls;b.dataset.provider=provider;
    if(PROVIDER_ICONS[provider]){const i=document.createElement('span');i.className='account-provider-icon';i.innerHTML=PROVIDER_ICONS[provider];b.append(i);}
    b.append(document.createTextNode(label));
    b.onclick=async()=>{b.disabled=true;emit(track,'login_prompt_provider_click',{provider});try{await fn();}catch(e){status.textContent=accountError(e);b.disabled=false;}};
    return b;
  };
  const draw=()=>{
    list.replaceChildren();status.textContent='';
    for(const [id,name] of PROVIDERS) {
      const provider=providerId(id,config);
      if(!config.providers?.includes(provider))continue;
      list.append(button('account-button account-provider login-prompt-provider',`Continuar com ${name}`,provider,async()=>{
        const choice=privacyChoice();
        const out=await socialApi('/api/social-auth',{action:'start',provider,returnTo:'game',newsletter:false,...(choice?{analytics:choice.analytics}:{}),...(guestProof()?{guest:guestProof()}:{})});
        leaveTo(out.url);
      }));
    }
    // E-mail pede a escolha de newsletter e o link de confirmação: segue no passo de entrada completo.
    if(config.email)list.append(button('account-button account-provider login-prompt-email','Continuar com e-mail','email',async()=>{dialog.close();document.getElementById('hub-account-login')?.click();}));
  };
  const maybeShow=()=>{
    if(document.getElementById('boot-splash'))return;
    dialog.dataset.ready='true';   // decidiu com a splash fora; a régua espera isto
    if(!ended || inMatch())return;   // espera a volta ao menu depois da tela de resultado
    if(document.querySelector('dialog[open]'))return;   // não empilha (passo de entrada, loja TRETA)
    const due=loginPromptDue({auth,config,ended,embedded:isEmbedded(),playing:inMatch(),accountBusy:accountBusy(),seen:seenThisVisit(),record:readRecord()});
    ended=false;owed=true;
    if(!due){settle();return;}
    markSeen();draw();previousFocus=document.activeElement;
    dialog.showModal();
    list.querySelector('button')?.focus();
    emit(track,'login_prompt_shown',{});
  };
  document.getElementById('login-prompt-close').onclick=()=>hide('close');
  document.getElementById('login-prompt-guest').onclick=()=>hide('guest');
  dialog.addEventListener('cancel',e=>{e.preventDefault();hide('esc');});
  dialog.addEventListener('click',e=>{if(e.target===dialog)hide('backdrop');});
  dialog.addEventListener('close',settle);
  document.addEventListener('cs-match-end',()=>{ended=true;});
  document.addEventListener('cs-account-change',e=>{auth=e.detail;if(auth?.authenticated && dialog.open)dialog.close();});
  new MutationObserver(maybeShow).observe(document.body,{childList:true});
  const menu=document.getElementById('main-menu');
  if(menu)new MutationObserver(maybeShow).observe(menu,{attributes:true,attributeFilter:['class']});
  maybeShow();
}
