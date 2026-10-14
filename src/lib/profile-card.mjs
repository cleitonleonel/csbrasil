import {careerRank} from '../../public/js/career-rank.js';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const number=v=>Number.isFinite(Number(v))&&Number(v)>=0?Number(v).toLocaleString('pt-BR'):'—';
const pngData=s=>typeof s==='string'&&/^data:image\/png;base64,[a-zA-Z0-9+/=]+$/.test(s);
// Same palette as src/styles/career-rank.css, so the card badge matches the site badge.
const TIERS={bronze:['#d8c59b','#28271d'],silver:['#dae4e9','#20282d'],gold:['#ffe19b','#332b17']};
const STAR='M0 -9L2.6 -3.3L8.6 -2.8L4 1.2L5.4 7.3L0 4.1L-5.4 7.3L-4 1.2L-8.6 -2.8L-2.6 -3.3Z';
const LOGO_HEIGHT=150,LOGO_WIDTH=218;
// DejaVu Sans Bold advance widths in em, coarse buckets: keeps the nickname clear of the portrait.
const nickEm=s=>[...s].reduce((w,c)=>w+(/[iljI.,;:!|' ]/.test(c)?0.36:/[MW@mw]/.test(c)?0.95:/[A-Z0-9]/.test(c)?0.76:0.64),0);
function rankBadge(rank){
 if(!rank)return '';
 const [color,fill]=TIERS[rank.tier],stars=[[[325,151,1.2]],[[315,151,.95],[335,151,.95]],[[325,141,.85],[315,160,.85],[335,160,.85]]][rank.marks-1];
 const marks=Array.from({length:rank.marks},(_,i)=>{
  const offset=(i-(rank.marks-1)/2);
  return rank.symbol==='star'?`<path class="mark" d="${STAR}" transform="translate(${stars[i][0]} ${stars[i][1]}) scale(${stars[i][2]})" fill="${color}"/>`:`<path class="mark" d="M-10 -5L0 5L10 -5" transform="translate(325 ${152+offset*10})" fill="none" stroke="${color}" stroke-width="4"/>`;
 }).join('');
 return `<g data-rank="${rank.id}"><rect x="300" y="126" width="50" height="50" rx="3" fill="${fill}" stroke="${color}" stroke-width="2"/>${marks}</g>`;
}
export function profileCardSvg(p,character,portrait,site,logo){
 if(!['server_verified','historical_plus_server_verified'].includes(p?.source) || p.visibility!=='public')throw Error('Public ranking profile required');
 const cells=[['PONTOS',number(p.points)],['POSIÇÃO',p.position?'#'+number(p.position):'—'],['ABATES',number(p.kills)],['MORTES',number(p.deaths)],['K/D',number(p.kd)],['HORAS ATIVAS',number(Math.round(Number(p.verified_play_seconds ?? p.play_seconds)/36)/100)]];
 const image=character&&portrait&&pngData(portrait)?`<image href="${portrait}" x="650" y="8" width="550" height="614" preserveAspectRatio="xMidYMid meet"/>`:'';
 const logoImage=logo&&pngData(logo)?`<image href="${logo}" x="56" y="34" width="${LOGO_WIDTH}" height="${LOGO_HEIGHT}" preserveAspectRatio="xMidYMid meet"/>`:'';
 const nick=String(p.nick).slice(0,24),nickSize=Math.round(Math.min(56,350/Math.max(1,nickEm(nick))));
 const level=number(p.level);
 const rank=careerRank(p.points),badgeX=rank?362:300,[rankColor]=TIERS[rank?.tier]??['#d8cfae'];
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
 <rect width="1200" height="630" fill="#0c0e11"/>
 <path d="M820 0H1200V630H650Z" fill="#ffd23f" opacity=".06"/>
 ${image}<rect width="1200" height="8" fill="#e03232"/><rect y="622" width="1200" height="8" fill="#1faa4d"/>
 ${logoImage}
 <g font-family="DejaVu Sans">${logoImage?'':'<text x="60" y="80" font-size="27" font-weight="bold" letter-spacing="5" fill="#ffd23f">CORO SOLTO</text>'}
 <text x="300" y="${Math.round(76+nickSize*0.36)}" font-size="${nickSize}" font-weight="bold" fill="#f2ead8">${esc(nick)}</text>
 ${rankBadge(rank)}
 <text x="${badgeX}" y="158" font-size="32" font-weight="bold" fill="#ffd23f">NÍVEL ${level}</text>
 <text x="${badgeX}" y="180" font-size="14" font-weight="bold" letter-spacing="2" fill="${rankColor}">${rank?esc(rank.label.toUpperCase()):''}</text>
 <text x="60" y="224" font-size="21" fill="#b8d94a">${p.handle?'@'+esc(p.handle):'Na resenha'}</text>
 <text x="60" y="252" font-size="15" fill="#8a8064">${p.source==='historical_plus_server_verified'?'HISTÓRICO + PARTIDAS CONFIRMADAS':'ESTATÍSTICAS CONFIRMADAS NA ARENA'}</text>
 ${cells.map(([label,value],i)=>{const x=60+i%2*277,y=266+Math.floor(i/2)*86;return `<rect x="${x}" y="${y}" width="258" height="76" fill="#12160e" stroke="#3a3325"/><text x="${x+16}" y="${y+35}" font-size="32" font-weight="bold" fill="#ffd23f">${esc(value)}</text><text x="${x+16}" y="${y+62}" font-size="15" fill="#d8cfae">${label}</text>`;}).join('')}
 <text x="60" y="540" font-size="18" fill="#f2ead8">${character?(image?'ÚLTIMO PERSONAGEM: ':'RETRATO INDISPONÍVEL: ')+esc(character.nome):'PERSONAGEM NÃO COMPARTILHADO'}</text>
 <text x="60" y="570" font-size="20" fill="#8a8064">${esc(new URL(site).host)}</text></g></svg>`;
}
