export const TRETA_SYMBOL = 'T$';
export const TRETA_COINS = [
  {value:1,character:'saci',name:'Saci'},
  {value:5,character:'curupira',name:'Curupira'},
  {value:10,character:'caipora',name:'Caipora'},
  {value:50,character:'lobisomem',name:'Lobisomem'},
  {value:100,character:'gotinha',name:'Zé Gotinha'},
  {value:200,character:'canarinho',name:'Canarinho Pistola'},
  {value:1000,character:'zumbi',name:'Zumbi dos Palmares'},
];
export const TRETA_SKINS = [
  {id:'lula-drip',name:'Lula do Drip',character:'barbudo',color:'#e44465',series:'DRIP DO PLANALTO',description:'Streetwear vinho, tranças, grillz e anéis de ouro. O drip chegou ao Planalto.',price:800,ready:false},
  {id:'bolsonaro-drip',name:'Bolsonaro do Drip',character:'capitao',color:'#43c69b',series:'DRIP DO PLANALTO',description:'Jaqueta varsity verde e azul, cargo bege e correntes de ouro. Outra combinação, a mesma ostentação.',price:800,ready:false},
  {id:'senador-drip',name:'Senador do Drip',character:'senador',color:'#ae80ff',series:'DRIP DO PLANALTO',description:'Zero Um de preto e violeta, correntes pesadas e tênis branco. Estilo próprio no plenário.',price:800,ready:false},
  {id:'janja',name:'Janja',character:'dama',color:'#e77f95',series:'PRIMEIRAS-DAMAS',description:'Óculos, cabelo castanho e um visual urbano vinho e creme.',price:800,ready:false},
  {id:'michelle-bolsonaro',name:'Michelle Bolsonaro',character:'julia-zanatta',color:'#77baff',series:'PRIMEIRAS-DAMAS',description:'Um visual urbano azul e verde, com detalhes dourados.',price:800,ready:false},
];
export const TRETA_NEXT = ['Daniel Vorcaro','Donald Trump'];
export const TRETA_DEFAULT_REWARDS = {email_reward:200,referral_reward:100,sp_reward:10,mp_reward:25,daily_match_cap:100,referral_cap:10,starts_at:null,ends_at:null};

export function tretaChange(amount) {
  if(!Number.isSafeInteger(amount) || amount<0)throw new RangeError('invalid_treta_amount');
  const coins=[];
  for(const coin of [...TRETA_COINS].reverse()) {
    const count=Math.floor(amount/coin.value);
    if(count)coins.push({...coin,count});
    amount%=coin.value;
  }
  return coins;
}
