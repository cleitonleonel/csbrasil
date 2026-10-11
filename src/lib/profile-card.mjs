const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const number=v=>Number.isFinite(Number(v))&&Number(v)>=0?Number(v).toLocaleString('pt-BR'):'—';
export function profileCardSvg(p,character=null,portrait=null){
 if(p?.source!=='server_verified' || p.visibility!=='public')throw Error('Public verified profile required');
 const cells=[['PONTOS',number(p.points)],['POSIÇÃO',p.position?'#'+number(p.position):'—'],['ABATES',number(p.kills)],['MORTES',number(p.deaths)],['K/D',number(p.kd)],['HORAS ATIVAS',number(Math.round(Number(p.play_seconds)/36)/100)]];
 const image=character&&portrait&&/^data:image\/png;base64,[a-zA-Z0-9+/=]+$/.test(portrait)?`<image href="${portrait}" x="840" y="140" width="300" height="365" preserveAspectRatio="xMidYMid meet"/>`:'';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
 <rect width="1200" height="630" fill="#0c0e11"/><rect width="1200" height="8" fill="#e03232"/><rect y="622" width="1200" height="8" fill="#1faa4d"/>
 <path d="M820 8H1200V622H760Z" fill="#ffd23f" opacity=".06"/>
 <g font-family="DejaVu Sans"><text x="60" y="75" font-size="27" font-weight="bold" letter-spacing="5" fill="#ffd23f">CORO SOLTO</text>
 <text x="60" y="168" font-size="58" font-weight="bold" fill="#f2ead8">${esc(String(p.nick).slice(0,24))}</text>
 <text x="60" y="212" font-size="23" fill="#b8d94a">${p.handle?'@'+esc(p.handle):'Na resenha'} · Nível ${number(p.level)}</text>
 <text x="60" y="259" font-size="19" fill="#8a8064">ESTATÍSTICAS CONFIRMADAS NA ARENA</text>
 ${cells.map(([label,value],i)=>{const x=60+i%3*247,y=290+Math.floor(i/3)*109;return `<rect x="${x}" y="${y}" width="232" height="93" fill="#12160e" stroke="#3a3325"/><text x="${x+16}" y="${y+43}" font-size="32" font-weight="bold" fill="#ffd23f">${esc(value)}</text><text x="${x+16}" y="${y+73}" font-size="15" fill="#d8cfae">${label}</text>`;}).join('')}
 ${image}<text x="990" y="545" font-size="21" text-anchor="middle" fill="#f2ead8">${character?esc(character.nome):'BORA PRA TRETA?'}</text>
 <text x="990" y="574" font-size="14" text-anchor="middle" fill="#8a8064">${character?(image?'ÚLTIMO PERSONAGEM JOGADO':'RETRATO AINDA INDISPONÍVEL'):'PERSONAGEM NÃO COMPARTILHADO'}</text>
 <text x="60" y="591" font-size="20" fill="#8a8064">www.corosolto.com.br</text></g></svg>`;
}
