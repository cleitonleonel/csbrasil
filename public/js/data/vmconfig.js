import { VM_FRAME as VM_WEAPON_FRAME } from './vmframe.js';
import { VM_FABRICA_POS } from './vmfabrica.js';

// Tabela pura do viewmodel autorado (BUG-75): famílias KINEMATION + as 26 armas.
// `ready` é portão por arma; produção só liga com VM_LAUNCH e todas prontas (vmlaunch.js).

// O dono autorizou as mãos novas por padrão em 27/09. O build publicado precisa
// servir os GLBs privados antes do merge; com qualquer arma fora de `ready`, o runtime cai no legado.
export const VM_LAUNCH = true;

// A faca não tem família de fogo: o portão dela mora aqui (meleevm.js). `true`
// preserva o veredito do dono registrado no #618 (faca, pistola e AK).
export const VM_MELEE = {
  knife: { ready: true },
};

// Por família: mount (socket→gun-space, +Z=cano, autorado no editor), equip
// (par General rifle|pistol), camShake (preset do recoil.json), reloadStyle.
export const VM_FAMILY = {
  // mount/trim = resíduo arma↔mão; inclinação do pacote vive em VM_AUTHORED_FRAME.
  // cs16 = máquina de 6 estados dos QC (cadências: tools/viewmodels/cs16-timings.json).
  ak:       { ready: true, mount: { pos: [0, 0, 0], rotDeg: [0, 0, 0], scale: 1 }, equip: 'rifle', camShake: 'Rifle_Light', reloadStyle: 'mag', cs16: { draw: 1.0, reload: 2.432, shoot: 0.8 } },
  ar:       { ready: true, mount: { pos: [0, 0, 0], rotDeg: [0, 0, 0], scale: 1 }, equip: 'rifle', camShake: 'Rifle_Light', reloadStyle: 'mag', cs16: { draw: 1.0, reload: 3.054, shoot: 1.5 } },
  mp5:      { ready: true, mount: { pos: [0, 0, 0], rotDeg: [0, 0, 0], scale: 1 }, equip: 'rifle', camShake: 'Rifle_Light', reloadStyle: 'mag', cs16: { draw: 0.857, reload: 2.632, shoot: 0.667 } },
  smg:      { ready: true, mount: { pos: [0, 0, 0], rotDeg: [0, 0, 0], scale: 1 }, equip: 'rifle', camShake: 'Rifle_Light', reloadStyle: 'mag', cs16: { draw: 0.909, reload: 3.143, shoot: 0.926 } },
  p90:      { ready: true, mount: { pos: [0, 0, 0], rotDeg: [0, 0, 0], scale: 1 }, equip: 'rifle', camShake: 'Rifle_Light', reloadStyle: 'mag', cs16: { draw: 1.0, reload: 3.375, shoot: 0.467 } },
  // g3/marksman/svd: doador COMPARTILHADO v_g3sg1 (não existem no CS 1.6).
  g3:       { ready: true, mount: { pos: [0, 0, 0], rotDeg: [0, 0, 0], scale: 1 }, equip: 'rifle', camShake: 'Rifle_Heavy', reloadStyle: 'mag', cs16: { draw: 1.0, reload: 4.667, shoot: 0.5 } },
  marksman: { ready: true, mount: { pos: [0, 0, 0], rotDeg: [0, 0, 0], scale: 1 }, equip: 'rifle', camShake: 'Rifle_Heavy', reloadStyle: 'mag', cs16: { draw: 1.0, reload: 4.667, shoot: 0.5 } },
  svd:      { ready: true, mount: { pos: [0, 0, 0], rotDeg: [0, 0, 0], scale: 1 }, equip: 'rifle', camShake: 'Rifle_Heavy', reloadStyle: 'mag', cs16: { draw: 1.0, reload: 4.667, shoot: 0.5 } },
  sniper:   { ready: true, mount: { pos: [0, 0, 0], rotDeg: [0, 0, 0], scale: 1 }, equip: 'rifle', camShake: 'Sniper', reloadStyle: 'mag', cs16: { draw: 1.0, reload: 2.9, shoot: 1.171 } },
  bolt:     { ready: true, mount: { pos: [0, 0, 0], rotDeg: [0, 0, 0], scale: 1 }, equip: 'rifle', camShake: 'Sniper', reloadStyle: 'bolt_loop', cs16: { draw: 1.0, reload: 2.0, shoot: 1.286 } },
  deagle:   { ready: true, mount: { pos: [0, 0, 0], rotDeg: [0, 0, 0], scale: 1 }, equip: 'pistol', camShake: 'Pistol_Heavy', reloadStyle: 'mag', cs16: { draw: 1.0, reload: 2.167, shoot: 0.575 } },
  pistol:   { ready: true, mount: { pos: [0, 0, 0], rotDeg: [0, 0, 0], scale: 1 }, equip: 'pistol', camShake: 'Pistol', reloadStyle: 'mag', cs16: { draw: 1.0, reload: 2.703, shoot: 1.0 } },
  revolver: { ready: true, mount: { pos: [0, 0, 0], rotDeg: [0, 0, 0], scale: 1 }, equip: 'pistol', camShake: 'Pistol_Heavy', reloadStyle: 'cylinder' },
  shotgun:  { ready: true, mount: { pos: [0, 0, 0], rotDeg: [0, 0, 0], scale: 1 }, equip: 'rifle', camShake: 'Shotgun', reloadStyle: 'pump_loop', cs16: { draw: 1.0, shoot: 1.156 } },
  // belt: a M249 alimenta por cinto/caixa — não há pente destacável para a mão
  // buscar, e cobrar um da régua seria cobrar mentira.
  lmg:      { ready: true, mount: { pos: [0, 0, 0], rotDeg: [0, 0, 0], scale: 1 }, equip: 'rifle', camShake: 'Rifle_Heavy', reloadStyle: 'belt', cs16: { draw: 1.0, reload: 4.667, shoot: 0.5 } },
  // A granada já funcionava antes deste conserto (bind no hand_r, sem o bug do
  // socket) — nasce ready para não regredir o arremesso que o jogo usa hoje.
  grenade:  { ready: true, mount: { pos: [0, 0, 0], rotDeg: [0, 0, 0], scale: 1 }, equip: 'rifle', camShake: 'Pistol', reloadStyle: 'mag' },
};

// Por arma (faca fica no melee): trim = ajuste fino do wrap Mint no socket;
// ads = auto (alça medida) + resíduo; parts = Tier 2 (carregador/ferrolho móveis).
const W = (family, extra = {}) => ({
  family,
  trim: { pos: [0, 0, 0], rotDeg: [0, 0, 0], scale: 1 },
  ads: { auto: true, off: [0, 0, 0], rotDeg: [0, 0, 0], pull: 0.05, fovScale: 1 },
  recoilScale: 1,
  parts: null,
  eject: null,
  ...extra,
});

export const VM_WEAPON = {
  // Produto K (KINEMATION, 67 juntas) assado por arma no catálogo privado:
  // <família>/<arma>-baked-runtime.glb; `runtime:'family'` usa <família>/<família>-runtime.glb.
  awp: W('sniper', { baked: true, frame: 'family' }),
  // AK = golden aprovada no quadril (rota gold#ak, eval:vm-launch VL7).
  // ADS de foco deixa a cruz livre; alça/massa são medidas no Rifle_metarig (VM-FABRICA §8.3).
  ak: W('ak', { baked: true, golden: true, parts: { mag: { box: { min: [-0.022, -0.145, 0.005], max: [0.022, 0.02, 0.2] }, bone: 'Mag' } },
    ads: { auto: true, off: [0, -0.10, 0], rotDeg: [0, 0, 0], pull: 0, fovScale: 1, alivio: 0.35, estilo: 'foco',
      golden: { osso: 'Rifle_metarig', alca: [-0.0064, 0.167, 0.0588], massa: [-0.0064, 0.507, 0.0546], cima: [0, 0, 1] } } }),
  // `frame` aceita override manual; a medida gerada por arma vive em `vmframe.js`.
  // Evidência: docs/reports/VIEWMODEL-ENQUADRAMENTO-ESCALA-2026-09-18.md.
  m4: W('ar', { baked: true, ads: { auto: true, off: [-0.0053, -0.0533, 0], rotDeg: [0, 0, 0], pull: 0.05, fovScale: 1 } }),
  // Quadril: +18° de rolagem deita o cano (eixo na tela 141° → 149°, AK 155°; o crítico via
  // "pitch 39° vs 26°"). ADS desfaz a rolagem e o resíduo leva o aro da massa à cruz (eval:vm-mira 44 → 0 px).
  mp5: W('mp5', { baked: true, runtime: 'family', timing: 'gameplay', assetLimit: 'mint-sem-pente; weaponModel adiciona MAG procedimental', frame: { rotDeg: [-10.1, 0, 18] },
    ads: { auto: true, off: [-0.0925, 0.0245, 0], rotDeg: [0, 0, -18], pull: 0.05, fovScale: 1 } }),
  // KSG girada no produto (shotgun-k-fix.mjs): pacote 5× recua ao tamanho da AK e a alça
  // fica acima do cano; o resíduo de ADS põe alça e massa na cruz (vmads-sim.mjs).
  shotgun: W('shotgun', { baked: true, timing: 'gameplay',
    frame: { x: 0.65, y: -0.72, z: -1.0, rotDeg: [8, 4, -5] },
    ads: { auto: true, off: [-0.005, 0.238, 0], rotDeg: [-9.74, 0.62, -4], pull: 0.05, fovScale: 1,
      linhaDeMira: { ref: 'RIG_WEAPON_SHOTGUN', alca: [0, 13.6, -5.5], massa: [0, 13.8, 21.5] } } }),
  // anchor/namedParts valem só na montagem ao vivo (eval authored-attach-check).
  deagle: W('deagle', { baked: true, runtime: 'family', timing: 'gameplay', recoilScale: 0.45,
    frame: { x: 0.1, y: -0.1, z: -0.25, fov: 55, rotDeg: [-5, 15, -5] },
    ads: { auto: true, off: [0.006, -0.024, 0], rotDeg: [0, 0, 0], pull: 0.05, fovScale: 1 },
    // Frame de curta contra a PT-38 aprovada (docs/reports/VM-INTEGRACAO-K.md).
    anchor: 'neutral_bone', namedParts: {
      magazine: { mesh: 'GEO-deagle-magazine', bone: 'Mag' },
      slide: { mesh: 'GEO-deagle-slide', bone: 'Slider' },
      slideLiner: { mesh: 'GEO-deagle-slide-liner-reconstructed', bone: 'Slider' },
      hammer: { mesh: 'GEO-deagle-hammer', bone: 'Hammer' },
    } }),
  // PT-38 no enquadramento APROVADO (FAMILY_FRAME.pistol); a reescala do #631 foi revertida.
  // As curtas medem-se contra ela: ARMAS_CURTAS em tools/eval/lib/vm-limiares.mjs.
  pistol: W('pistol', { baked: true, runtime: 'family', timing: 'gameplay' }),
  // M92: arma até o
  // punho (grip-support.mjs), cabo na borda e ADS pela alça tangente (sockets 10° fora da linha).
  m92: W('ak', { baked: true, ready: true, assetLimit: 'pente-fundido-na-malha Mint',
    frame: { x: 0.0948, y: 0.0409, z: -0.1014, fov: 57, rotDeg: [6, 15, 2] },
    ads: { auto: true, off: [-0.0007, 0.0526, 0], rotDeg: [-10.89, -0.77, 0], pull: 0.05, fovScale: 1,
      linhaDeMira: { ref: 'MINT_WEAPON_M92', alca: [0.04, 0.188, 0.021], massa: [-0.3, 0.193, 0.021] } } }),
  akm: W('ak', { baked: true, ready: true,
    frame: { x: 0.065, y: 0.04, z: -0.203, fov: 57, rotDeg: [1.69, 7.69, 6.19] },
    ads: { auto: true, off: [0.0106, -0.0035, 0], rotDeg: [-5.49, -0.64, 0], pull: 0.05, fovScale: 1,
      linhaDeMira: { ref: 'MINT_WEAPON_AKM', alca: [-0.06, 0.15, 0.012], massa: [-0.48, 0.152, 0.012] } } }),
  g3: W('g3', { baked: true, frame: { y: -0.015, fov: 78, rotDeg: [8, -0.2, 18] }, ads: { auto: true, off: [-0.01, -0.107, 0], rotDeg: [0, 0, 0], pull: 0.05, fovScale: 1 } }),
  // Pose de duas mãos aponta ~55° para cima no frame da família: o pacote gira (yaw 16°, cano
  // ~15° como a PT-38) no fov da pistola; o ADS usa o clipe `ads` do produto (ads-pose.mjs).
  revolver38: W('revolver', { baked: true, runtime: 'family', timing: 'gameplay',
    frame: { x: 0.2, y: -0.08, z: -0.4, fov: 55, rotDeg: [-10, 16, -5] },
    ads: { auto: true, off: [-0.0129, -0.0099, 0], rotDeg: [0.5, -1.33, 0], pull: 0.46, fovScale: 1,
      linhaDeMira: { ref: 'RIG_WEAPON_REVOLVER', alca: [0, 1.55, -1.0], massa: [0, 1.85, -14.15] } },
    anchor: 'neutral_bone', namedParts: {
      cartridge0: { mesh: 'GEO-Cartridge0', bone: 'Cartridge0' },
      cartridge0_Case: { mesh: 'GEO-Cartridge0_Case', bone: 'Cartridge0' },
      cartridge1: { mesh: 'GEO-Cartridge1', bone: 'Cartridge1' },
      cartridge1_Case: { mesh: 'GEO-Cartridge1_Case', bone: 'Cartridge1' },
      cartridge2: { mesh: 'GEO-Cartridge2', bone: 'Cartridge2' },
      cartridge2_Case: { mesh: 'GEO-Cartridge2_Case', bone: 'Cartridge2' },
      cartridge3: { mesh: 'GEO-Cartridge3', bone: 'Cartridge3' },
      cartridge3_Case: { mesh: 'GEO-Cartridge3_Case', bone: 'Cartridge3' },
      cartridge4: { mesh: 'GEO-Cartridge4', bone: 'Cartridge4' },
      cartridge4_Case: { mesh: 'GEO-Cartridge4_Case', bone: 'Cartridge4' },
      cartridge5: { mesh: 'GEO-Cartridge5', bone: 'Cartridge5' },
      cartridge5_Case: { mesh: 'GEO-Cartridge5_Case', bone: 'Cartridge5' },
      drum: { mesh: 'GEO-Drum', bone: 'Drum' },
      drumCore: { mesh: 'GEO-Drum_InnerCore', bone: 'Drum' },
      ejector: { mesh: 'GEO-Ejector', bone: 'Ejector' },
      ejectorShaft: { mesh: 'GEO-Ejector_Shaft', bone: 'Ejector' },
      crane: { mesh: 'GEO-CraneArm_Link', bone: 'CraneArm' },
      hammer: { mesh: 'GEO-Hammer', bone: 'Hammer' },
      trigger: { mesh: 'GEO-Trigger', bone: 'Trigger' },
    } }),
  // Recuo de viewmodel abaixo de 4% da própria arma não se lê (P7 do gauntlet):
  // as duas armas mais leves do REC_DEG precisam de amplitude no mount.
  md97: W('ar', { baked: true, recoilScale: 1.8, assetLimit: 'mint-sem-pente; weaponModel adiciona MAG procedimental', frame: { fov: 90, rotDeg: [-4, -4, -12] },
    // linhaDeMira = alça e massa (nó + ponto local): o socket `sight` fica abaixo da alça.
    ads: { auto: true, off: [-0.006, 0, 0], rotDeg: [-4.31, 0.51, 0], pull: 0.05, fovScale: 1,
      linhaDeMira: { ref: 'MINT_WEAPON_MD97', alca: [0.24, 0.112, -0.0095], massa: [-0.265, 0.107, -0.010] } } }),
  carbine: W('ar', { baked: true }),
  m400: W('sniper', { baked: true, frame: 'family' }),
  mosin: W('bolt', { baked: true }),
  // Candidata DMR assada por arma. `frame:family` preserva o enquadramento
  // medido desta base; a câmera embutida do doador não é usada como frame.
  rem700: W('bolt', { baked: true, frame: 'family' }),
  // ADS automático (alça medida no eixo). Frame: opção B do #632, decisão do dono (0,877× da AK;
  // faixa própria em FAIXA_ESCALA.lmg, vm-limiares.mjs).
  lmg: W('lmg', { baked: true, timing: 'gameplay', frame: { z: -0.375 }, ads: { auto: true, off: [-0.022, -0.003, 0], rotDeg: [0, 0, 0], pull: 0.05, fovScale: 1 } }),
  scar: W('ar', { baked: true, assetLimit: 'pente-fundido-na-malha Mint', ads: { auto: true, off: [0.0109, -0.0464, 0], rotDeg: [0, 0, -14], pull: 0.05, fovScale: 1 } }),
  tavor: W('ar', { baked: true, ads: { auto: true, off: [0, -0.051, 0], rotDeg: [0, 0, 0], pull: 0.05, fovScale: 1 } }),
  famas: W('ar', { baked: true, ads: { auto: true, off: [-0.0019, -0.063, 0], rotDeg: [0, 0, 0], pull: 0.05, fovScale: 1 } }),
  uzi: W('smg', { baked: true, timing: 'gameplay', ads: { auto: true, off: [-0.02, -0.03, 0], rotDeg: [0, 0, -15], pull: 0.05, fovScale: 1 } }),
  // ADS: o anel da óptica ficava ~60 px acima da cruz (crítico L1 50–55; eval:vm-mira 60 → 3 px). A
  // rolagem do quadril (−60° no FAMILY_FRAME) fica: −40° desenquadrou a arma e borrou o anel no A/B cego.
  p90: W('p90', { baked: true, timing: 'gameplay', recoilScale: 1.6,
    ads: { auto: true, off: [-0.0058, -0.068, 0], rotDeg: [0, 0, 0], pull: 0.05, fovScale: 1 } }),
  svd: W('svd', { baked: true }),
  g3sg1: W('g3', { baked: true, frame: 'family' }),
  sks: W('marksman', { baked: true }),
};

// Fábrica (docs/reports/VM-FABRICA.md): padrão no lançamento; revisão por arma ainda aceita query.
// Frame único = o da AK K (ajustado contra a golden); a curta usa o da PT-38 aprovada.
export const VM_FABRICA_FRAME = Object.freeze({ x: 0.065, y: 0.04, z: -0.203, fov: 57, rotDeg: [1.69, 7.69, 6.19] });
// alivio = distância olho→alça no ADS, do aimPointOffset do Settings do pack (m).
const F = (familia, chassi, extra = {}) => ({
  familia, chassi, manga: false, recoilScale: 1, timing: 'gameplay',
  ads: { auto: true, off: [0, 0, 0], rotDeg: [0, 0, 0], pull: 0, fovScale: 1, alivio: 0.3 },
  ...extra,
});
// A 'ak' fica fora: o dono manteve a golden aprovada (24/09); o chassi AK do pack serve a 'akm'.
// Foco com cruz livre: a arma fica abaixo da linha de tiro em vez de cobrir o alvo.
const A = (alivio) => ({ auto: true, off: [0, -0.08, 0], rotDeg: [0, 0, 0], pull: 0, fovScale: 1, alivio, estilo: 'foco' });
// A luneta oculta o viewmodel durante o ADS; ela não usa a mira de foco.
const S = (alivio) => ({ ...A(alivio), estilo: 'luneta' });
const CURTA = { x: 0.1, y: -0.1, z: -0.22, fov: 55, rotDeg: [0, 15, -5], drawDrop: 0.34 };
// recoilScale é só a mola visual; o recuo do tiro vive em game.js.
export const VM_FABRICA = Object.freeze({
  akm: F('ak', 'AK', { recoilScale: 4.5, recoilLoc: 1.5, ads: A(0.3) }),
  m4: F('ar', 'MX16A4', { recoilScale: 4.5, recoilLoc: 1.5, ads: A(0.3) }),
  famas: F('ar', 'MX16A4', { variante: true, recoilScale: 1.0, recoilLoc: 0.8, ads: A(0.28) }),
  tavor: F('ar', 'MX16A4', { variante: true, recoilScale: 1.0, recoilLoc: 0.8, frame: { x: 0.235, y: -0.06, z: -0.24 }, ads: A(0.28) }),
  // manga:true: a troca do pente só fica no quadro com o pacote longe, e aí a boca da manga
  // entra; nesses dois a extensão não fura a câmera (crítico, rodada 1).
  g3: F('g3', 'G3', { manga: true, recoilScale: 9, recoilLoc: 1.5, frame: { x: 0.195, y: -0.07, z: -0.353, rotDeg: [1.69, 7.69, 4.7] }, ads: A(0.22) }),
  svd: F('svd', 'SVD', { manga: true, recoilScale: 3, recoilLoc: 1.5, ads: S(0.34) }),
  awp: F('sniper', 'L96X', { recoilScale: 3.5, frame: { x: 0.21, y: -0.05, z: -0.3, fov: 44, rotDeg: [1.69, 4, 6.19] }, ads: S(0.12) }),
  mosin: F('bolt', 'Kar98K', { recoilScale: 3.3, frame: { x: 0.14, y: -0.05, z: -0.123, fov: 50, rotDeg: [-2, 7.69, 6.19] }, ads: S(0.4) }),
  mp5: F('mp5', 'MPS5', { recoilScale: 0.85, recoilLoc: 0.5, ads: A(0.3) }),
  p90: F('p90', 'PDW90', { recoilScale: 0.85, recoilLoc: 0.6, ads: A(0.5) }),
  lmg: F('lmg', 'MGX5', { recoilScale: 4, recoilLoc: 1.5, frame: { x: 0.335, y: -0.04, z: -0.15, rotDeg: [1.69, 0, -8] }, ads: S(0.3) }),
  shotgun: F('shotgun', 'KXG12', { recoilScale: 2.8, recoilLoc: 1.2, ads: A(0.1) }),
  pistol: F('pistol', 'X18', { frame: CURTA, ads: { ...A(0.38), auto: false, off: [0, 0.04, 0], estilo: 'foco' } }),
  deagle: F('deagle', 'DGL50', { recoilScale: 0.45, frame: CURTA, ads: { ...A(0.38), auto: false, off: [0, 0.04, 0], estilo: 'foco' } }),
  revolver38: F('revolver', 'Viper-357', { frame: { ...CURTA, y: -0.07, rotDeg: [-10, 0, -5] }, ads: A(0.38) }),
  m92: F('ak', 'AK', { variante: true, recoilScale: 4.5, recoilLoc: 1.5, ads: A(0.3) }),
  md97: F('ar', 'MX16A4', { variante: true, recoilScale: 4.5, recoilLoc: 1.5, ads: A(0.3) }),
  m400: F('ar', 'MX16A4', { variante: true, recoilScale: 4.5, recoilLoc: 1.5, ads: S(0.3) }),
  g3sg1: F('g3', 'G3', { variante: true, recoilScale: 7, recoilLoc: 1.5, ads: S(0.1) }),
  scar: F('marksman', 'Mk14EBR', { variante: true, recoilScale: 3, frame: { x: 0.2, y: -0.06, z: -0.3, rotDeg: [-2.5, 7.69, 6.19] }, ads: A(0.3) }),
  sks: F('marksman', 'Kar98K', { variante: true, recoilScale: 3.3, frame: { x: 0.2, y: -0.05, z: -0.2, fov: 50, rotDeg: [1.69, -10, 6.19], scale: 1.8 }, ads: S(0.4) }),
  rem700: F('bolt', 'Kar98K', { variante: true, recoilScale: 3.3, frame: { x: 0.14, y: -0.05, z: -0.123, fov: 50, rotDeg: [-2, 7.69, 6.19] }, ads: S(0.4) }),
  carbine: F('bolt', 'Kar98K', { variante: true, recoilScale: 3.3, frame: { x: 0.115, y: -0.04, z: -0.123, fov: 50 }, ads: A(0.35) }),
  uzi: F('smg', 'X18', { variante: true, manga: true, recoilScale: 3, frame: { ...CURTA, x: 0.26, y: -0.2, z: -0.55, rotDeg: [21, 15, -5] }, ads: A(0.4) }),
});
/* ===================== ENQUADRAMENTO DO VIEWMODEL MINT (G3-R1) =====================
   PORQUÊ existe: os 26 GLBs da Mint voltaram a ser a fonte do viewmodel de 1ª pessoa
   (antes: 8 GLBs-herói Tripo de 18 MB + kit de textura-variante sobre ~5 malhas base —
   "várias armas com visuais iguais"). Enquadrar 26 armas com uma TABELA POR ARMA seria
   26 chances de errar; aqui o enquadramento é DERIVADO do que weapons.js já mede
   (len / gripZ / vm) e de 5 números por CLASSE. Uma arma nova entra sem tuning.

   O modelo (câmera do VM na origem olhando -Z, grip do GLB na origem do grupo):
     back = escalaVM · |bboxMin.z|            coronha atrás do grip, em metros
     fwd  = escalaVM · bocaZ                  cano à frente do grip = gripZ·len (gripZ é
                                              medido A PARTIR DA BOCA — ver weapons.js)
     Zg   = max(back + clear, minz, fwd/fwdTan)
                                              profundidade do grip. 1ª cláusula: a coronha
                                              NUNCA cruza a lente (era isso que dava "arma
                                              cortada"/geometria invertida). 3ª cláusula:
                                              teto de segurança do ângulo que o cano ocupa
                                              (não morde em nenhuma das 26 hoje; existe pra
                                              uma arma futura de cano absurdo não explodir).
     gx   = Zg · tanH                         => o GRIP CAI SEMPRE NO MESMO PIXEL, arma
                                              qualquer (é a CONSISTÊNCIA que o dono pediu)
     gy   = -gx · tanBarrel                   => o ângulo do cano na tela é atan(|gy|/gx),
                                              INDEPENDENTE do aspecto (provado em
                                              tools/eval/vm-mint-audit.mjs) — 16:9 e 3:2
                                              leem o mesmo ângulo, que é o bug 3:2 morto.
   O que varia por arma é só o quanto o cano avança na tela = len·(1-gripZ) — que é
   exatamente a identidade que a Mint traz (SMG curta, sniper longa).
   (O kill-switch ?tripovm=1 que voltava ao pipeline Tripo foi removido em 07/08/2026 —
   junto com os arms_*.glb de public/models/fpvm. O histórico está no git.)              */
export const VM_FRAME = {
  vmScale: 0.72,        // escala global do GLB no viewmodel (invariante ao enquadramento — não encolhe a arma na tela)
  /* tanBarrel 0,28 -> 0,22 (RODADA DA REFERENCIA MEDIDA).
     ATENCAO AO QUE ESTE NUMERO NAO E: ele NAO e "o angulo do cano na tela". atan(0,22)=12,4°
     e a direcao em que o GRUPO da arma foi deslocado dentro do vm.root, ignorando o
     VM_OFF[1] — que e o termo que domina a posicao na tela. O angulo que o olho ve (e que a
     VM3 passou a medir) e o PCA da silhueta em pixel, e ele estava em 33-61° enquanto este
     campo dizia 15,64°. Ver o comentario da VM3 em tools/eval/invariants.mjs.
     0,22 sai da busca do vm-solve com a lente nova (V0=42): e o valor que, junto com
     tanH 0,20, poe o eixo da silhueta dos rifles em 24-31° — a faixa medida no CS 1.6
     (27,3° na AK do dust, 34,8° na M4 do dust2). Continua sendo o unico termo que depende
     do aspecto na altura do grip (Delta VM10 = 0,0931·tanH·tanBarrel = 0,004, bem abaixo
     do teto 0,03). */
  tanBarrel: 0.22,      // par do tanH 0,20 e da lente V0=42 — os tres so funcionam juntos
  adsPullZ: 0.02,       // ADS traz a arma 2 cm em direção à lente (sem cruzar a coronha)
  /* LOOK FINAL ESCOLHIDO PELO DONO (08/2026): CS 1.6 — medido frame a frame no vídeo de
     referência (aim_ak-colt). A arma fica BAIXA (boca a ~0,66H, ABAIXO da mira — é
     "segurada relaxada", não "apontada pro crosshair"), mostra o FLANCO, e a coronha
     termina no canto inferior-direito INTEIRA (no máximo beijando a borda). O trio que
     faz o look: lente moderada (V0=80 no vmFovForAspect) + arma mais longe (recuoZ 1,10)
     + VM_OFF y −0,23 (game.js), que desce a arma até a boca ficar abaixo da mira.
     ATUALIZAÇÃO (rodada do vm-solve): O OFFSET VERTICAL MUDOU DE FORMA, NÃO DE VALOR.
     VM_OFF[1] = −0,23 continua sendo o número do look, mas agora vale NA REFERÊNCIA 16:9;
     o offset REAL aplicado ao vm.root é −0,23 · V(aspecto)/V(16:9) = −0,23 · (16/9)/aspecto
     (game.js, `vmOffY`). Em 16:9 nada muda — em 3:2 o offset vira −0,2726, que é o mesmo
     deslocamento EM FRAÇÃO DE ALTURA DE TELA. Isso não é tuning, é a única forma que fecha:
     com offset constante em metros, (gripY − 0,5) escala com o aspecto na razão fixa
     (16/9)/(3/2) = 1,1852, então grip a ≥ 0,84 nos dois aspectos (VM9) implica Δ ≥ 0,0630
     entre eles, contra o teto de 0,03 da VM10 — VM9 e VM10 eram IMPOSSÍVEIS juntas, para
     qualquer valor de recuoZ/tanH/minz/zMul/vmScale/V0. A prova numérica e a busca estão em
     tools/eval/vm-solve.mjs. O look medido (boca ABAIXO da mira, VM12) fica PRESERVADO:
     a boca do cano vai a 0,667-0,803 da altura, contra o teto de 0,66.
     A rodada anterior foi o look Quake 4 (lente 92, recuoZ 0,75, nearX 1,35, tanH 0,80 —
     arma grande, por trás, coronha cortada); o dono comparou e escolheu CS. Quake fica
     reproduzível: ?vmfov=92&vmzmul=0.75&vmnearx=1.35&vmtanh=0.80&vmtanb=0.30&vmoff=0.03,-0.10,0
     Tunáveis ao vivo: ?vmzmul= ?vmnearx= (mais ?vmfov= ?vmtanh= ?vmtanb= ?vmoff=). */
  /* recuoZ 1,10 -> 1,00 e nearX 1,05 -> 6,00 (RODADA DA REFERENCIA MEDIDA).
     recuoZ: era o multiplicador global de Zg. Com o minz por classe resolvido pelo solver
       (o valor JA e o Zg alvo), um multiplicador extra so obrigaria a dividir os seis minz
       por 1,10 e esconder o numero. 1,00 = "o minz da classe E a profundidade do grip".
     nearX: ERA UMA TRAVA ASSERIDA, e ela contradizia a foto. "A coronha pode projetar no
       maximo 1,05 da meia-largura" e a mesma afirmacao do doc antigo ("a coronha termina no
       canto INTEIRA, no maximo beijando a borda") que o dono desmentiu: nos 3 frames de
       referencia a silhueta CRUZA a borda direita (ref_viewmodel.json ->
       faixas.cruzaBordaDireita: true) e sai pela base (fatiaBaixo 0,383 e 0,480). Com a
       lente fechada (V0=42) a coronha fica angularmente grande e a trava de 1,05 empurrava
       o grip para Zg 0,46 — FORA da janela da VM9 — em g3/lmg/carbine.
       O que substitui a trava, com numero medido em vez de asserido:
         VM8  (invariants.mjs) — coronha <= -0,05 no PICO DO COICE: e ela que impede a
              coronha de atravessar a lente, que era o perigo real.
         VM16 (invariants.mjs) — fatia na borda direita entre 0,02 e 0,20 da altura
              (ref 0,053-0,095): e ela que impede a arma de sair pela lateral em vez de
              raspar a quina, que era o perigo estetico.
       6,00 e "praticamente solta": o piso que ela impoe vira back·1,051, abaixo do minz de
       todas as classes. Nao foi zerada para o parametro continuar existindo e tunavel
       (?vmnearx=) — quem quiser o comportamento antigo poe 1,05 e ve a arma encolher. */
  /* ══ recuoZ 1,00 -> 1,50 (RODADA DA ESCALA — pedido do dono, 04/08) ══════════════════
     PEDIDO, nas palavras dele: "o ângulo das armas está muito bom, mas a escala está
     grande ainda — digamos que as armas estão 1,5x do tamanho que deveriam. Eu vejo isso
     pq o cano da arma pra mira no centro da tela a distância é minúscula."

     ELE DEU O SINTOMA CERTO, E O SINTOMA É MENSURÁVEL — MAS NÃO É ÁREA. Medido no RENDER
     (diff on/off do vm-quake-capture, 1200x800 = 3:2, o aspecto dele) contra a referência
     medida (ref_viewmodel.json, `python3 tools/eval/ref-measure.py --masks`):

       DISTÂNCIA BOCA -> MIRA, em fração de ALTURA de tela   (hypot((bocaX-0,5)*asp; bocaY-0,5))
         referência   CS 1.6 AK 0,103 · CS 1.6 M4 0,131 · Valorant Vandal 0,277
         nós (1,00)   ak 0,073 · m4 0,093 · awp 0,110 · deagle 0,148   <- AK e M4 ABAIXO
                                                                          do MÍNIMO medido
         nós (1,50)   ak 0,137 · m4 0,154 · awp 0,157 · deagle 0,183   <- todas DENTRO

       ÁREA na tela (a grandeza que a VM5 gateia), MESMAS capturas:
         referência   9,76 · 9,78 · 13,09 %
         nós (1,00)   ak 7,95 · m4 8,63 · awp 6,81 · deagle 5,05 %  <- JÁ ABAIXO da ref
         nós (1,50)   ak 5,44 · m4 6,30 · awp 4,09 · deagle 4,16 %

     Ou seja: a arma NUNCA tomou mais área que a do CS 1.6. O que ela fazia era entrar no
     quadro com 82% da malha FORA dele (foraPct da ak, 3:2) — o que sobrava na tela era um
     pedaço AMPLIADO de cano e guarda-mão, com a boca a 0,073 da mira. Área igual, arma ~2x
     maior. É por isso que a régua de área dizia "dentro da faixa" enquanto o olho do dono
     dizia "grande": areaPct NÃO É UMA RÉGUA DE ESCALA quando o recorte muda (VM5 mede o
     que aparece; foraPct diz que aparece um quinto).

     POR QUE recuoZ E NÃO vmScale/V0/tanH: o enquadramento é INVARIANTE À ESCALA DA MALHA
     (back, fwd e gx crescem todos com vmScale — game.js, bloco RECUO DE TAMANHO APARENTE),
     então mexer em vmScale não muda um pixel. recuoZ multiplica só o Zg: encolhe o tamanho
     aparente por 1/recuoZ EM TORNO DO GRIP, que fica no MESMO pixel (gx = Zg·tanH escala
     junto). Consequência direta: a boca se afasta da mira sozinha, que é o sintoma que ele
     nomeou. E o que ele elogiou fica: eixo da silhueta em PIXEL medido no render
     1,00 -> 1,50: ak 34,8° -> 33,3° · m4 34,7° -> 31,3° (VM3 = 22-42°), e pitch/yaw/roll,
     tanBarrel e knifeRot não foram tocados.

     O QUE EU VI (capturas em /tmp/vmscale/z{1.0,1.1765,1.3333,1.5}, 5 armas cada):
       1,00  ak = cano + guarda-mão ampliados, coronha e pente fora do quadro; a faca é uma
             lâmina gigante atravessando a tela inteira, ponta em x=0,32.
       0,85  boca já sai de cima da mira (dBoca 0,099), mas o pente da ak ainda é cortado.
       0,75  bom; pente ainda cortado pela base.
       0,67  a AK INTEIRA lê — guarda-mão de madeira, tubo de gás, pente curvo, receiver — e
             a coronha sai pela quina inferior direita, que é a assinatura do CS 1.6 (VM16)
             e o enquadramento do references/viewmodel/cs16_ak_dust.jpg. A faca vira uma
             faca (cabo + guarda + lâmina) com a MESMA direção de lâmina de antes.
     CUSTO MEDIDO, declarado: a silhueta inteira anda ~0,04 para a direita, então a borda
     esquerda (VM1, faixa 0,50-0,60 sobre ref medida 0,520-0,565) fica mais apertada, e a
     área cai abaixo do piso de 6% da VM5 — piso que o próprio comentário da VM5 declara
     como extrapolação sem pixel ("DÍVIDA DE MEDIÇÃO, não licença"). Ver VM5/VM20. */
  recuoZ: 1.50,         // recuo de tamanho aparente: multiplica o Zg do enquadramento (?vmzmul=)
  nearX: 6.00,          // trava de borda: coronha pode projetar até esta fração da meia-largura (?vmnearx=)
  cls: {
    // tanH  = tangente do ângulo horizontal do grip. 0,800 (Quake) → 0,670 (CS 1.6): arma
    //         mais longe e lente mais fechada pedem menos ângulo pra borda esquerda do VM
    //         ficar em ~0,62-0,66 W (medido no vídeo do CS 1.6). MESMO valor nas 6 classes
    //         (validado em captura) — a variação de tamanho por classe vem de len/gripZ/zMul.
    // clear = folga em metros entre a coronha e a lente
    // minz  = profundidade mínima do grip (alcance do braço FP: ombro→grip ≤ 0,60 m).
    //         0,4200 nas 6 classes (era 0,230-0,360, uma por classe). PORQUÊ UNIFORME: com o
    //         offset vertical em fração de altura, gripY = 0,5 + 0,5·c/Zg + k·tanH·tanBarrel,
    //         e a VM9 (grip entre 0,84 e 0,92 nos DOIS aspectos) vira uma janela ESTREITA de
    //         Zg — [0,445 ; 0,558] com c = 0,23·(16/9)/H. Zg fora dela = grip fora da banda,
    //         não importa a arma: a faca e as pistolas iam a Zg 0,25 e o grip caía a 1,16 da
    //         altura (mão FORA da tela). 0,42·recuoZ = 0,462 põe as 26 dentro (Zg 0,462-0,503,
    //         VM9 0,873-0,886, folga 0,0116).
    //         POR QUE 0,42 E NÃO 0,4545 (que daria folga 0,027 na VM9): acima de 0,4245 o grip
    //         de TODAS as 26 passa a ficar a menos de 2 cm do limite do braço direito, e o
    //         vm-mint-audit passa a acusar "MÃO SOLTA NO AR" em 26 armas em vez das 5 que já
    //         acusava. Isso não entra em nenhuma invariante do portão (os braços FP estão
    //         desligados por padrão — WEAPON_ONLY em game.js), então seria uma regressão
    //         INVISÍVEL para a régua e visível com ?hands=1. 0,42 mantém o alcance do braço
    //         EXATAMENTE como estava (5 armas acusadas, as mesmas de antes) e ainda deixa a
    //         VM9 com 23× a resolução do JSON. Medido em tools/eval/vm-solve.mjs.
    // fwdTan = teto de (cano à frente do grip)/(profundidade do grip) — trava o tamanho
    //         aparente das atarracadas sem achatar a identidade das longas
    // roll   = cant (rad) em torno do EIXO DA CÂMERA. É de graça no que importa: girar em Z
    //         não move a direção do cano (0,0,-1) nem 1 grau, então a arma continua apontada
    //         exatamente pra mira — só mostra o topo do receiver, como no CS.
    /* pitch/yaw = INCLINAÇÃO PRÓPRIA DA ARMA (RODADA DO GRIP + PITCH). Euler XYZ em rad,
       aplicado ao MESMO grupo do roll (game.js `_vmFrame`), então a ordem é RX·RY·RZ e com
       pitch=yaw=0 a cadeia inteira volta a ser exatamente a de antes.
         pitch > 0  levanta a BOCA (ponto em z=-d vai para y=+d·sin(pitch))
         yaw   > 0  leva a BOCA para a ESQUERDA (x = -d·sin(yaw)), ou seja em direção à mira

       POR QUE ISTO PRECISOU EXISTIR — é uma IMPOSSIBILIDADE, não um gosto. Com o cano
       paralelo ao eixo da câmera (só roll), a boca fica rigidamente amarrada ao grip:
           bocaY − 0,5 = (gripY − 0,5)·Zg/(Zg + S·fwd) − 0,5·S·mzY/((Zg + S·fwd)·V)
       Com a VM9 MEDIDA (grip ≥ 0,90 — ref-measure.py) e a VM12 MEDIDA (boca ≤ 0,62), e com
       a VM8 exigindo Zg ≥ S·back + 0,05 (a coronha não cruza a lente), sai a condição
           0,05 ≤ S·( (3/7)·mzZ − back )
       que é NEGATIVA para as 26 armas do arsenal (a AK, por exemplo: (3/7)·0,539 = 0,231
       contra back 0,334). Ou seja: a interseção VM8 ∩ VM9 ∩ VM12 é VAZIA para QUALQUER
       vmScale, V0, tanH, tanBarrel, offY, minz ou zMul. Prova reproduzível em
       `node tools/eval/vm-solve.mjs --prova-vazio`.
       O CS 1.6 escapa disso porque o v_model dele TEM inclinação própria: por isso ele
       consegue grip fora da tela E boca em 0,513 no mesmo frame. É a explicação literal do
       "o ângulo, a perspectiva, a escala, o tamanho está tudo diferente".

       E O CANO CONTINUA APONTANDO PRA ONDE A BALA VAI? A bala nunca saiu do cano: a direção
       do tiro é `camera.quaternion` (game.js `_tryShoot`) e a do clarão é
       `camera.getWorldDirection()` — o viewmodel é DECORATIVO, como no CS 1.6. O que segue
       a arma é só a ORIGEM do clarão/tracer (`_vmMuzzleExt[id]`, derivada de `rw.localToWorld`
       DENTRO deste grupo), e ela acompanha o pitch/yaw de graça, que é o comportamento
       certo: o fogo nasce na boca desenhada e o tiro vai pro centro da mira.
       NO ADS o pitch/yaw são ZERADOS (game.js `vmAdsRot`, invariante VM17): com a arma
       inclinada, mirar deixaria a alça fora do eixo. O roll NÃO é zerado — ele não desalinha
       nada e já era assim. */
    /* RODADA DA REFERENCIA MEDIDA — tanH 0,670 -> 0,200, clear 0,040 -> 0,030 e minz
       DE VOLTA A SER POR CLASSE (era 0,4200 uniforme).
       tanH: com a lente fechada (V0=42) o mesmo tanH jogava a arma pra FORA do quadro pela
         direita — a borda esquerda da silhueta ia a 0,63-0,69 e a referencia medida da
         0,520-0,565 (ref-measure.py). 0,20 poe os rifles em 0,58-0,60.
       minz: o 0,4200 uniforme da rodada passada foi escolhido pra uniformizar profundidade e
         custou 77% do tamanho angular da faca e 67% do das pistolas. Com a boca subindo para
         0,50-0,62 a restricao muda de sinal, entao ele volta a ser por classe. A VARIACAO E
         PEQUENA DE PROPOSITO: a VM9 (grip entre 0,84 e 0,92, intocada) fecha uma janela de Zg
         de [0,2936 ; 0,3651] — so 24% de ponta a ponta — e cada classe fica no ponto DELA
         dentro dessa janela (tools/eval/vm-solve.mjs escolhe maximizando a soma das margens
         das armas da classe). "Faca perto do rosto, sniper longe" cabe ai dentro; mais que
         isso tira o grip da banda da VM9.
       clear: 0,030 abre 1 cm de aproximacao. A VM8 (coronha <= -0,05 no pico do coice)
         continua sendo quem trava — e continua verde. */
    /* RODADA DO GRIP + PITCH — pitch/yaw RESOLVIDOS (tools/eval/vm-solve.mjs + a varredura
       por classe descrita no relatório), e tanH 0,200 -> 0,360 junto com eles.
       Os números em GRAUS, que é como se compara com a foto (rad = graus·π/180):
         rifle    pitch  9°  yaw 16°      shotgun  pitch  6°  yaw 20°
         sniper   pitch  9°  yaw 12°      pistol   pitch 15°  yaw 28°
         smg      pitch 24°  yaw 28°      knife    n/a (usa knifeRot)
       POR QUE tanH SUBIU JUNTO: yaw>0 leva a BOCA para a esquerda e a CORONHA para a
       direita. Com tanH 0,20 a coronha ia para a direita mas parava antes da borda, e a
       VM16 (a coronha tem que RASPAR a quina — 0,02 a 0,20 da altura) continuava em 0,000
       em 26/26. Com tanH 0,36 as medidas fora de banda da VM16 caem de 42/52 para 21/52 e
       as da VM3 (eixo da silhueta) de 35/52 para 2/52. Os dois SÓ funcionam juntos: tanH
       0,36 sozinho (sem yaw) joga a borda esquerda da silhueta para fora da VM1.
       EFEITO MEDIDO NO CONJUNTO (medidas fora de banda, 52 = 26 armas × 2 aspectos):
         antes (5737ce8 + VM9 nova): VM1 20 VM3 35 VM5 19 VM9 44 VM12 33 VM16 42 = 193
         depois:                     VM1 10 VM3  2 VM5  6 VM9  0 VM12 14 VM16 21 =  53
       O que NÃO fechou está declarado no relatório: pistola e faca (sem foto de referência)
       e a borda esquerda de 5 armas. */
    rifle:   { roll: -0.0524, pitch: 0.1571, yaw: 0.2793, tanH: 0.360, clear: 0.020, minz: 0.3450, fwdTan: 1.60 },
    sniper:  { roll: 0.580, pitch: 0.1571, yaw: 0.2094, tanH: 0.360, clear: 0.020, minz: 0.3350, fwdTan: 1.60 },
    shotgun: { roll: -0.078, pitch: 0.1047, yaw: 0.3491, tanH: 0.360, clear: 0.020, minz: 0.3450, fwdTan: 1.60 },
    smg:     { roll: -0.085, pitch: 0.4189, yaw: 0.4887, tanH: 0.360, clear: 0.020, minz: 0.3500, fwdTan: 1.60 },
    // Armas curtas: yaw alto expõe o flanco da arma em hip-fire; no ADS o
    // runtime zera pitch/yaw e realinha a alça ao centro.
    pistol:  { roll: 0.000, pitch: 0.1745, yaw: 1.0472, tanH: 0.285, clear: 0.020, minz: 0.3500, fwdTan: 1.45 },
    knife:   { roll: 0, pitch: 0.000, yaw: 0.000, tanH: 0.240, clear: 0.020, minz: 0.3100, fwdTan: 1.60 },   // pitch/yaw n/a: a faca usa knifeRot
  },
  // A faca não tem cano: em vez do cant ela leva a pose CS clássica (lâmina atravessada,
  // gume pra dentro do quadro). Euler XYZ em rad, aplicado ao grupo do viewmodel.
  /* knifeRot RE-RESOLVIDO (RODADA DO GRIP + PITCH) — era [-0,14 ; 0,42 ; -0,40].
     Um crítico mediu que mutar este campo para [1.5,1.5,1.5] passava o portão VERDE: os
     espelhos (vm-mint-audit/vm-project/vm-solve) projetavam a faca com rotação ZERO, ou
     seja mediam uma faca que não é a desenhada. Agora eles usam knifeRot (ver o frame() do
     vm-mint-audit), então o campo virou MENSURÁVEL — e, medido, o valor antigo punha a faca
     em eixo 5,2°, área 1,4% e boca 0,927: fora de VM3, VM5 e VM12 ao mesmo tempo.
     [0,45 ; −0,90 ; 0,30] (26° / −52° / 17°) + tanH 0,24 + minz 0,31 + vm 2,2 (weapons.js)
     põem a faca DENTRO das 6 bandas: esq 0,582 · eixo 30,0°/33,2° · área 7,2%/6,4% ·
     boca 0,588/0,618 · fatiaDir 0,063 · grip 0,989/0,978. É a pose CS clássica com a lâmina
     mais atravessada (yaw maior) — o que sobe o eixo da silhueta de 5° para 30°. */
  /* ESPELHADA EM 04/08 — "a faca é a pior, ela está ao contrário da direção normal" (dono).
     E ele está certo: o valor anterior [0,45 ; −0,90 ; 0,30] foi resolvido para CABER em 6
     bandas de medição (borda, eixo, área, boca, fatia, grip) e nenhuma delas enxerga PARA
     QUE LADO a lâmina aponta. Silhueta de faca virada e faca certa medem quase igual — é a
     Lei 1 da casa acontecendo: o que não virou invariante foi otimizado para fora.

     CONFIRMADO OLHANDO (tools/eval/vm-quake-capture.mjs, 3 capturas):
       [0,45 ; −0,90 ;  0,30]  ponta saindo pela borda DIREITA, lâmina apontando pra fora
       [0,45 ;  2,24 ;  0,30]  giro de 180°: a faca sai quase inteira do quadro
       [0,45 ;  0,90 ; −0,30]  ponta pra dentro da cena, punho no canto  ← esta
     Espelhar yaw E roll (não só o yaw) é o que mantém o gume virado pra dentro em vez de
     mostrar as costas da lâmina.

     A RÉGUA QUE FALTA e que este defeito exige: nenhuma invariante mede direção de lâmina.
     Enquanto não existir, qualquer solver que mexer aqui pode virar a faca de novo e passar
     verde. É o item de maior risco de regressão do viewmodel. */
  // Lâmina lateral e baixa: punho no canto direito, ponta voltada para dentro da
  // tela.  Menos yaw que a revisão anterior evita a faca "deitada" na diagonal.
  knifeRot: [-0.10, 0.50, -0.48],
  /* zMul VAZIO — as 5 exceções por arma (m92/p90/uzi/famas/tavor) FORAM REMOVIDAS, não
     substituídas. Elas empurravam armas atarracadas p/ o fundo para corrigir tamanho
     aparente; com minz uniforme o Zg já é o mesmo (0,500-0,503) para as 26, e cada entrada
     que sobrasse só tiraria o grip da banda da VM9 (m92 com 1,12 ia a Zg 0,560 e o grip
     saía por 0,0009). DÍVIDA REMOVIDA: 5 exceções por arma -> 0. Se alguém precisar de uma,
     o custo é medido: a janela inteira de Zg da VM9 é [0,445 ; 0,558], ou seja ±11%. */
  // Compactas têm caixa alta para o comprimento: afastar em torno do grip
  // impede UZI/P90 de parecerem maiores que um fuzil na lente 1P.
  zMul: { uzi: 1.34, p90: 1.16, mp5: 1.08 },
  // classe de ENQUADRAMENTO (≠ STATIC_CLASS do pipeline Tripo, ≠ BALL_CLASS da balística)
  classOf: {
    ak: 'rifle', akm: 'rifle', m4: 'rifle', m92: 'rifle', g3: 'rifle', carbine: 'rifle',
    scar: 'rifle', tavor: 'rifle', famas: 'rifle', lmg: 'rifle', md97: 'rifle',
    mp5: 'smg', uzi: 'smg', p90: 'smg',
    awp: 'sniper', mosin: 'sniper', rem700: 'sniper', m400: 'sniper', svd: 'sniper', g3sg1: 'sniper', sks: 'sniper',
    shotgun: 'shotgun',
    pistol: 'pistol', deagle: 'pistol', revolver38: 'pistol',
    knife: 'knife',
  },
};

// Composição em espaço de câmera dos pacotes autorados. O pacote inteiro move;
// arma, mãos, clipes, ADS e sockets continuam no mesmo referencial.
export const VM_AUTHORED_FRAME = Object.freeze({
  family: Object.freeze({
    ak:       { x: 0.112, y: -0.068, z: -0.199, fov: 84, rotDeg: [0.6, -0.1, -5] },
    ar:       { x: 0.096, y: -0.129, z: -0.198, fov: 84, rotDeg: [-8.0, 0.9, 0] },
    mp5:      { x: 0.091, y: -0.187, z: -0.204, fov: 84, rotDeg: [-10.1, 0, 0] },
    deagle:   { x: 0.089, y: -0.152, z: -0.217, fov: 84, rotDeg: [-15.8, -0.2, 0] },
    smg:      { x: 0.206, y: -0.141, z: -0.462, fov: 84, rotDeg: [15.4, 6.0, 0] },
    p90:      { x: 0.075, y: -0.020, z: -0.141, fov: 84, rotDeg: [0, 0, 0] },
    pistol:   { x: 0.100, y: -0.100, z: -0.220, fov: 55, rotDeg: [0, 15, -5], drawDrop: 0.34 },
    shotgun:  { x: 0.057, y: -0.114, z: -0.159, fov: 84, rotDeg: [-8.9, 0, 0] },
    sniper:   { x: 0.118, y: -0.128, z: 0.029, fov: 84, rotDeg: [-11.9, 0, 0] },
    bolt:     { x: 0.055, y: -0.083, z: -0.254, fov: 84, rotDeg: [-1.6, -0.3, 0] },
    g3:       { x: 0.117, y: -0.062, z: -0.202, fov: 84, rotDeg: [1.0, -0.2, 0] },
    marksman: { x: 0.107, y: -0.070, z: -0.187, fov: 84, rotDeg: [0.5, -0.3, 0] },
    svd:      { x: 0.107, y: -0.060, z: -0.419, fov: 84, rotDeg: [1.9, 0.5, 0] },
    lmg:      { x: 0.153, y: -0.116, z: -0.409, fov: 84, rotDeg: [-5.2, -0.3, 0] },
    revolver: { x: 0.075, y: -0.042, z: -0.110, fov: 84, rotDeg: [0, 0, 0] },
    grenade:  { x: 0.045, y: -0.035, z: -0.080, fov: 84, rotDeg: [0, 0, 0] },
  }),
  // Moldes GoldSrc: offsets preservam a calibração por arma; rotDeg.z gira o
  // pacote inteiro (arma + mãos + clipes + sockets) para manter o eixo de tela
  // entre 22° e 42° nos dois aspectos. O ADS auto realinha cano/alça depois.
  goldsrc: Object.freeze({
    awp:        { x: 0.141, y: 0.031, z: -0.100 },
    ak:         { x: 0.092, y: 0.064, z: 0, rotDeg: [0, 0, 4] },
    m4:         { x: 0.092, y: 0.009, z: 0 },
    mp5:        { x: 0.133, y: 0.068, z: 0 },
    shotgun:    { x: 0.355, y: 0.040, z: -0.240 },
    deagle:     { x: 0.012, y: 0.084, z: 0, rotDeg: [0, 0, 31], drawDrop: 0.513 },
    pistol:     { x: 0.061, y: -0.043, z: 0, rotDeg: [0, 0, 41], drawDrop: 0.367 },
    m92:        { x: 0.086, y: 0.012, z: -0.100 },
    akm:        { x: 0.092, y: 0.064, z: 0 },
    g3:         { x: 0.183, y: 0.120, z: -0.080, rotDeg: [0, 0, -19] },
    revolver38: { x: 0.053, y: 0.013, z: 0, rotDeg: [0, 0, 28], drawDrop: 0.333 },
    md97:       { x: 0.064, y: 0.099, z: -0.080, rotDeg: [0, 0, -11] },
    carbine:    { x: 0.117, y: 0.085, z: 0 },
    m400:       { x: 0.141, y: 0.031, z: -0.040, rotDeg: [0, 0, -20] },
    mosin:      { x: 0.221, y: -0.140, z: -0.080 },
    rem700:     { x: 0.221, y: -0.140, z: -0.080 },
    lmg:        { x: 0.356, y: 0.173, z: -0.080, rotDeg: [0, 0, -16] },
    scar:       { x: 0.150, y: 0.013, z: -0.040 },
    tavor:      { x: 0.046, y: 0.005, z: 0 },
    famas:      { x: 0.046, y: 0.005, z: -0.150, rotDeg: [0, 0, 12] },
    uzi:        { x: 0.345, y: 0.177, z: 0, rotDeg: [0, 0, -36], drawDrop: 0.280 },
    p90:        { x: 0.042, y: -0.046, z: 0, rotDeg: [0, 0, 17] },
    svd:        { x: 0.183, y: 0.120, z: -0.080, rotDeg: [0, 0, -21] },
    g3sg1:      { x: 0.183, y: 0.120, z: -0.080, rotDeg: [0, 0, -20] },
    sks:        { x: 0.158, y: 0.078, z: -0.080, rotDeg: [0, 0, -20] },
  }),
});

export const VM_SIDE_CONTRACT = Object.freeze({
  aspects: Object.freeze([16 / 9, 3 / 2]),
  axisDeg: Object.freeze([22, 42]),
  areaPct: Object.freeze([4, 16]),
  contactMaxM: 0.025,
  visibleMin: 0.70,
  profileMin: 0.02,
});

export function authoredFrameFor(weapon, family, sourceKey = '', cameraFov = 84) {
  if (sourceKey.startsWith('fab#')) {
    return {
      ...VM_FABRICA_FRAME,
      ...(VM_FABRICA_POS[weapon] || {}),
      ...(VM_FABRICA[weapon]?.frame || {}),
    };
  }
  if (sourceKey.startsWith('gold#')) return { x: 0, y: 0, z: 0, fov: cameraFov };
  if (sourceKey.startsWith('rt#')) return { x: 0, y: 0, z: 0, fov: 74 };
  if (sourceKey.startsWith('gs#')) {
    const frame = VM_AUTHORED_FRAME.goldsrc[weapon];
    if (!frame) throw new Error(`sem frame goldsrc para ${weapon}`);
    return { ...frame, fov: 74 };
  }
  const familyFrame = VM_AUTHORED_FRAME.family[family];
  if (!familyFrame) throw new Error(`sem frame de família para ${family}`);
  const measured = VM_WEAPON_FRAME[weapon];
  const override = VM_WEAPON[weapon]?.frame;
  return {
    ...familyFrame,
    ...(measured || {}),
    ...(override && typeof override === 'object' ? override : {}),
  };
}

const PIPELINE_LICENSE = Object.freeze({
  legacy: 'Mint/project asset',
  golden: 'CC0 mold + Mint/project asset',
  goldsrc: 'CC0 mold + Mint/project asset',
  paid: 'Fab Standard License (private runtime)',
  retarget: 'Fab Standard License (private runtime)',
});

export function viewmodelPlan(weapon, source = 'default') {
  const spec = VM_WEAPON[weapon];
  if (!spec) throw new Error(`arma sem contrato 1P: ${weapon}`);
  const family = spec.family;
  const ready = VM_FAMILY[family]?.ready === true && spec.ready !== false;
  let pipeline = 'legacy';
  if (source === 'goldsrc') pipeline = 'goldsrc';
  else if (source === 'retarget') pipeline = 'retarget';
  else if (ready) pipeline = spec.golden ? 'golden' : 'paid';
  const asset = pipeline === 'goldsrc'
    ? `/private-assets/viewmodels/goldsrc-vm/${weapon}-runtime.glb`
    : pipeline === 'retarget'
      ? `/private-assets/viewmodels/retarget-vm/${weapon}-runtime.glb`
      : pipeline === 'golden'
        ? `/models/viewmodels/coro/${weapon}-hires.glb`
        : pipeline === 'paid'
          ? `/private-assets/viewmodels/${family}/${family}-runtime.glb`
          : `/models/weapons/${weapon}.glb`;
  return {
    weapon,
    family,
    pipeline,
    asset,
    license: PIPELINE_LICENSE[pipeline],
    fallback: 'legacy',
    fallbackUsed: pipeline === 'legacy',
    result: pipeline === 'legacy' ? 'fallback-explicito' : 'autorada',
    assetLimit: spec.assetLimit || null,
  };
}
