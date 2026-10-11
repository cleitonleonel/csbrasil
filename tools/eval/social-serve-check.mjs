// CI PR807: a raiz precisa conter o componente social real, sem silenciar falhas de render.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import net from 'node:net';
import { moduleCacheManifest } from '../../scripts/module-cache.mjs';

const mutant = process.argv.find(a => a.startsWith('--mutante='))?.split('=')[1];
const mutations = {
  'sem-componente': s => s.replace('astro.handle(req, res);', "res.writeHead(200); res.end('<html><body></body></html>');"),
  'erro-200': s => s.replace('astro.handle(req, res);', "res.writeHead(200); res.end('404');"),
  'shell-removido': s => s.replace("p === '/eval-character.html'", "p === '/shell-ausente'"),
};
assert(!mutant || mutations[mutant], 'mutante desconhecido');
const source = await readFile(new URL('./serve.mjs', import.meta.url), 'utf8');
const file = mutant ? new URL(`./.social-serve-${process.pid}.mjs`, import.meta.url) : new URL('./serve.mjs', import.meta.url);
if (mutant) {
  const changed = mutations[mutant](source);
  assert.notEqual(changed, source, 'mutação não aplicada');
  await writeFile(file, changed);
}
const port = await new Promise((resolve, reject) => {
  const reservation = net.createServer();
  reservation.on('error', reject);
  reservation.listen(0, '127.0.0.1', () => {
    const number = reservation.address().port;
    reservation.close(() => resolve(number));
  });
});
const child = spawn(process.execPath, [file.pathname, String(port)], { stdio: ['ignore', 'pipe', 'pipe'] });
const exited = new Promise(resolve => child.once('exit', resolve));
let log = '';
child.stdout.on('data', c => { log = (log + c).slice(-5000); });
child.stderr.on('data', c => { log = (log + c).slice(-5000); });
try {
  const deadline = Date.now() + 60_000;
  let response;
  while (Date.now() < deadline) {
    if (child.exitCode !== null || child.signalCode !== null) break;
    try { response = await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(60_000) }); break; }
    catch { await new Promise(r => setTimeout(r, 250)); }
  }
  assert(response, `servidor não respondeu; exit=${child.exitCode}; ${log.slice(-1200)}`);
  assert.equal(response.status, 200, `raiz HTTP ${response.status}; ${log.slice(-1200)}`);
  const html = await response.text();
  for (const id of ['hub-community', 'community', 'social-account', 'social-content', 'social-unread', 'account-entry-dialog'])
    assert.match(html, new RegExp(`id="${id}"`), `componente real: ${id}`);
  assert(!html.includes('<Community'), 'componente Astro cru');
  assert(!html.includes('define:vars='), 'variáveis de servidor não renderizadas');
  const { revision } = moduleCacheManifest('public/js');
  assert.match(html, new RegExp(`/js/community\\.js\\?v=[^" ]+${revision}`), 'módulo social com cache por conteúdo');
  assert.match(html, /href="\/social\.css\?v=[a-f0-9]+"/, 'CSS social com hash');
  assert.match(html, /const GIT_SHA = /, 'define:vars real preservado');
  assert.match(html, /type="importmap"/, 'import map preservado');
  const localhost = await fetch(`http://localhost:${port}/eval-character.html`);
  assert.equal(localhost.status, 200, 'hostname usado pelo portão CI');
  const shell = await fetch(`http://127.0.0.1:${port}/eval-character.html`);
  assert.equal(shell.status, 200, 'shell de personagem');
  assert.match(await shell.text(), /three\.module\.js/);
  const asset = await fetch(`http://127.0.0.1:${port}/js/community.js`);
  assert.equal(asset.status, 200);
  assert.equal(await asset.text(), await readFile('public/js/community.js', 'utf8'), 'mesmos bytes do módulo real');
  if (html.includes('/@vite/client')) {
    const vite = await fetch(`http://127.0.0.1:${port}/@vite/client`);
    assert.equal(vite.status, 200, 'runtime do renderer real');
  }
  const missing = await fetch(`http://127.0.0.1:${port}/arquivo-inexistente-ci.js`);
  assert.equal(missing.status, 404, 'ausência não pode virar verde');
  console.log('PASS HTTP real: comunidade, hashes, variáveis, import map, assets e shell');
} catch (e) {
  console.error(`RED social-serve: ${e.message}`);
  process.exitCode = 1;
} finally {
  child.kill('SIGTERM');
  await exited;
  if (mutant) await unlink(file);
}
