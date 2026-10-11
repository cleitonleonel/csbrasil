// Perfil real salvo no menu: LOW usa 4, MED 8; política textures.js e kill-switch texel=0.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../../public/js/textures.js', import.meta.url), 'utf8');
function probe(src, search, storage) {
  class Texture {
    constructor() { this.anisotropy = 1; this.repeat = { set() {} }; }
  }
  const THREE = { CanvasTexture: Texture, SRGBColorSpace: 'srgb', NearestFilter: 'nearest', LinearMipmapLinearFilter: 'mipmap', RepeatWrapping: 'repeat' };
  const ctx = vm.createContext({ THREE, URLSearchParams, location: { search }, localStorage: { getItem: () => storage } });
  vm.runInContext(src.replace(/^import[^\n]*\n/gm, '').replace(/\bexport\s+(?=(?:function|const|let)\b)/g, '') + '\n;globalThis.probe = { tex, detailFor };', ctx);
  const own = ctx.probe.tex({}), local = new Texture();
  ctx.probe.detailFor(local);
  return [own.anisotropy, local.anisotropy, own.magFilter];
}
const cases = [
  ['menu-low', '', '{"quality":"low"}', 4],
  ['menu-med', '', '{"quality":"med"}', 8],
  ['query-low', '?q=low', '{"quality":"med"}', 4],
  ['query-med', '?q=med', '{"quality":"low"}', 8],
  ['off', '?q=low&texel=0', '{"quality":"low"}', 1],
  ['invalid-storage', '', '{', 8],
];
function evaluate(src) {
  return cases.map(([name, search, storage, expected]) => {
    const actual = probe(src, search, storage);
    return { name, expected, actual, pass: actual[0] === expected && actual[1] === expected && actual[2] === 'nearest' };
  });
}
const rows = evaluate(source);
console.log(JSON.stringify({ rows }));
assert.ok(rows.every(r => r.pass), 'LOW do menu precisa usar 4 em tex() e detailFor(); preserve Nearest e texel=0');
if (process.argv.includes('--self-test')) {
  const mutants = [
    ['ignore-menu', source.replace("quality = JSON.parse(localStorage.getItem('awpbr_settings') || '{}').quality || quality;", '')],
    ['ignore-off', source.replace("_texQS.get('texel') !== '0'", 'true')],
  ];
  for (const [name, mutated] of mutants) {
    assert.notEqual(mutated, source, 'mutante não aplicou: ' + name);
    assert.ok(evaluate(mutated).some(r => !r.pass), 'mutante cego: ' + name);
  }
  console.log(JSON.stringify({ detected: mutants.map(m => m[0]) }));
}
