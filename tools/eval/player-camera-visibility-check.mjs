#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (name, fallback = '') => process.argv.find((v) => v.startsWith(`--${name}=`))?.split('=').slice(1).join('=') || fallback;
const port = Number(arg('porta', '9583'));
if (!(port >= 9100 && port <= 9900)) throw new Error(`porta fora da faixa 9100-9900: ${port}`);
const label = arg('captura', 'after');
const diagnostic = process.argv.includes('--diagnostico');
const mutant = arg('mutante');
if (mutant && mutant !== 'oclusao-antiga') throw new Error(`mutante desconhecido: ${mutant}`);
const base = `http://127.0.0.1:${port}`;
const out = path.join(ROOT, 'artifacts/player-camera-visibility', mutant || label);
fs.mkdirSync(out, { recursive: true });

const viewport = { width: 1200, height: 800 };
const weapons = ['p90', 'md97', 'pistol', 'm4'];
const modes = ['first', 'third', 'shoulder'];
const rows = [];
const failures = [];
const checks = [];
const server = spawn(process.execPath, ['tools/eval/serve.mjs', String(port)], { cwd: ROOT, stdio: 'ignore' });
let browser;

let mutantApplied = false;
function check(name, pass, observed) {
  checks.push({ name, pass: Boolean(pass), observed });
  console.log(`${pass ? 'PASSA' : 'FALHA'} ${name} — ${JSON.stringify(observed)}`);
  if (!pass) failures.push(name);
}

async function pixelMetric(buffer) {
  const { data, info } = await sharp(buffer)
    .extract({ left: 180, top: 90, width: 840, height: 520 })
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let neutralBright = 0;
  const colors = new Set();
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (Math.max(r, g, b) - Math.min(r, g, b) <= 12 && (r + g + b) / 3 >= 145) neutralBright++;
    colors.add(`${r >> 4},${g >> 4},${b >> 4}`);
  }
  const pixels = data.length / info.channels;
  return { neutralBright: +(neutralBright / pixels).toFixed(4), colors16: colors.size };
}

async function state(page) {
  return page.evaluate(() => {
    const g = window.__game;
    const meshes = [];
    g.playerTP?.group?.traverse((o) => {
      if (!o.isMesh) return;
      const materials = (Array.isArray(o.material) ? o.material : [o.material]).filter(Boolean);
      meshes.push({
        uuid: o.uuid,
        name: o.name || '(sem nome)',
        parent: o.parent?.name || o.parent?.type || '',
        visible: o.visible,
        skinned: Boolean(o.isSkinnedMesh),
        materials: materials.map((m) => ({ name: m.name || '', color: m.color?.getHexString?.() || null, side: m.side, opacity: m.opacity, transparent: m.transparent })),
      });
    });
    return {
      weapon: g.player.weapon,
      mode: g.camView,
      pitch: g.player.pitch,
      scoped: g.player.scoped,
      camera: g.camera.position.toArray().map((n) => +n.toFixed(3)),
      eye: g._eyeWorld.toArray().map((n) => +n.toFixed(3)),
      tpVisible: Boolean(g.playerTP?.group?.visible),
      tpWeapon: g._tpWeapon,
      vmVisible: Boolean(g.vm?.root?.visible),
      boomClear: g._tpBoomClear == null ? null : +g._tpBoomClear.toFixed(3),
      blockerDistance: window.__bug181Blocker?.visible
        ? +window.__bug181Blocker.position.distanceTo(g._eyeWorld).toFixed(3) : null,
      selfOccluded: Boolean(g.playerTP?.selfOccluded),
      selfMeshes: g.playerTP?.selfMeshes?.length || 0,
      selfMeshesVisible: g.playerTP?.selfMeshes?.filter((item) => item.object.visible).length || 0,
      selfMeshesOriginallyVisible: g.playerTP?.selfMeshes?.filter((item) => item.visible).length || 0,
      meshes,
    };
  });
}

async function diagnoseMeshes(page, baselineMetric) {
  const meshes = (await state(page)).meshes;
  const impact = [];
  for (const mesh of meshes) {
    if (!mesh.visible) continue;
    await page.evaluate((uuid) => {
      window.__bug181Hidden = window.__game.playerTP.group.getObjectByProperty('uuid', uuid);
      if (window.__bug181Hidden) window.__bug181Hidden.visible = false;
    }, mesh.uuid);
    const metric = await pixelMetric(await page.screenshot());
    await page.evaluate(() => {
      if (window.__bug181Hidden) window.__bug181Hidden.visible = true;
      window.__bug181Hidden = null;
    });
    impact.push({ ...mesh, neutralBrightDrop: +(baselineMetric.neutralBright - metric.neutralBright).toFixed(4), metric });
  }
  return impact.sort((a, b) => b.neutralBrightDrop - a.neutralBrightDrop);
}

try {
  let up = false;
  for (let i = 0; i < 80; i++) {
    try { up = (await fetch(base)).ok; if (up) break; } catch { /* servidor subindo */ }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  if (!up) throw new Error('servidor de revisão não subiu');

  browser = await chromium.launch({ headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === '/@id/astro/runtime/client/dev-toolbar/entrypoint.js') return route.fulfill({ contentType: 'application/javascript', body: 'export {};' });
    if (mutant && url.pathname === '/js/game.js') {
      const response = await route.fetch();
      const source = await response.text();
      const pisoAtual = 'const piso = Math.max(0, claro - 0.18);';
      const autoOclusaoAtual = 'const selfOccluded = (this._tpBoomClear ?? boomLen) < 0.38 + cam.near;';
      mutantApplied = source.includes(pisoAtual) && source.includes(autoOclusaoAtual);
      const body = source
        .replace(pisoAtual, 'const piso = Math.max(0.35, claro - 0.18);')
        .replace(autoOclusaoAtual, 'const selfOccluded = false;');
      return route.fulfill({ response, body });
    }
    return route.continue();
  });
  await page.goto(`${base}/?debug=1&auto=E&vmauthored=1&vmfabrica=1&vmweapon=p90&map=praca_poderes&armaslazy=0&vmqa=precision&bloom=0`, { waitUntil: 'load', timeout: 180000 });
  await page.waitForFunction(() => window.__game?.state === 'live', null, { timeout: 180000 });
  const crashText = await page.locator('#crash-overlay').textContent().catch(() => '');
  if (/vite|websocket/i.test(crashText || '')) await page.locator('#crash-overlay').evaluate((el) => el.remove());
  if (await page.locator('#aviso-software button').count()) await page.locator('#aviso-software button').click({ force: true });
  await page.evaluate(async () => {
    const THREE = await import('/vendor/three.module.js');
    const g = window.__game;
    g._ensureVmPrecisionQa();
    g.player.hp = 1e9;
    g.player.pitch = 1.45;
    const blocker = new THREE.Mesh(
      new THREE.BoxGeometry(4, 4, 0.08),
      new THREE.MeshBasicMaterial({ color: 0xd8d8d8 }),
    );
    blocker.name = 'BUG181_NEAR_PROP';
    blocker.visible = false;
    g.scene.add(blocker);
    window.__bug181Blocker = blocker;
    window.__bug181SetBlocker = (enabled) => {
      const index = g.world.occluders.indexOf(blocker);
      if (!enabled) {
        blocker.visible = false;
        if (index >= 0) g.world.occluders.splice(index, 1);
        g._tpBoomClear = undefined;
        return;
      }
      blocker.visible = true;
      if (index < 0) g.world.occluders.push(blocker);
      const eye = g._eyeWorld;
      const boom = g.camera.position.clone().sub(eye).normalize();
      blocker.position.copy(eye).addScaledVector(boom, 0.30);
      blocker.lookAt(eye);
      blocker.updateMatrixWorld(true);
      g._tpBoomClear = undefined;
    };
  });
  await page.waitForTimeout(1000);
  for (const weapon of weapons) {
    await page.evaluate((id) => {
      const g = window.__game;
      g.setCamView('first');
      window.__vmPrecisionQa.equip(id);
      window.__vmPrecisionQa.equip(id);
      g.player.pitch = 1.45;
    }, weapon);
    await page.waitForFunction((id) => window.__game.player.weapon === id, weapon, { timeout: 20000 });
    await page.mouse.down({ button: 'right' });
    await page.waitForTimeout(650);
    for (const mode of modes) {
      await page.evaluate((nextMode) => {
        const g = window.__game;
        window.__bug181SetBlocker(false);
        g.player.pitch = 1.45;
        g.setCamView(nextMode);
      }, mode);
      await page.waitForTimeout(80);
      await page.evaluate((enabled) => window.__bug181SetBlocker(enabled), mode !== 'first');
      await page.waitForTimeout(450);
      const debugOverlay = page.locator('#crash-overlay');
      if (await debugOverlay.count()) {
        const text = await debugOverlay.textContent().catch(() => '');
        if (/vite|websocket/i.test(text || '')) await debugOverlay.evaluate((el) => el.remove());
      }
      const buffer = await page.screenshot({ path: path.join(out, `${weapon}-${mode}-ads.png`) });
      const metric = await pixelMetric(buffer);
      const runtime = await state(page);
      const row = { weapon, mode, metric, runtime };
      if (diagnostic && weapon === 'p90' && mode === 'third') row.meshImpact = await diagnoseMeshes(page, metric);
      rows.push(row);
      // No candidato BUG-181, a região útil era 98,8%–99,2% cinza; 55% preserva
      // mais de 40 pp de margem e o mutante abaixo reproduz a regressão.
      check(`${weapon}/${mode} câmera legível`, mode === 'first' || metric.neutralBright < 0.55, metric);
      check(`${weapon}/${mode} apresentação correta`, mode === 'first'
        ? runtime.vmVisible && !runtime.tpVisible
        : !runtime.vmVisible && runtime.tpVisible && runtime.tpWeapon === weapon,
      { vmVisible: runtime.vmVisible, tpVisible: runtime.tpVisible, tpWeapon: runtime.tpWeapon });
      if (mode !== 'first') {
        check(`${weapon}/${mode} auto-oclusão local`, runtime.selfOccluded
          && runtime.selfMeshesVisible === 0,
        { selfOccluded: runtime.selfOccluded, visible: runtime.selfMeshesVisible, total: runtime.selfMeshes });
        await page.evaluate(() => window.__bug181SetBlocker(false));
        await page.waitForTimeout(550);
        const recovered = await state(page);
        check(`${weapon}/${mode} silhueta restaurada`, !recovered.selfOccluded
          && recovered.selfMeshesVisible === recovered.selfMeshesOriginallyVisible,
        { selfOccluded: recovered.selfOccluded, visible: recovered.selfMeshesVisible,
          original: recovered.selfMeshesOriginallyVisible });
      }
    }
    await page.mouse.up({ button: 'right' });
  }
  check('sem erro de página', pageErrors.length === 0, pageErrors.slice(0, 3));
  if (mutant) check('mutação aplicada ao módulo servido', mutantApplied, { mutantApplied });

  const cells = [];
  const cellW = 400, cellH = 267;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const image = await sharp(path.join(out, `${row.weapon}-${row.mode}-ads.png`)).resize(cellW, cellH, { fit: 'fill' }).png().toBuffer();
    const labelSvg = Buffer.from(`<svg width="${cellW}" height="24"><rect width="100%" height="100%" fill="#050505"/><text x="8" y="17" fill="white" font-family="monospace" font-size="13">${row.weapon} · ${row.mode} · cinza ${row.metric.neutralBright}</text></svg>`);
    cells.push({ input: image, left: (i % 3) * cellW, top: Math.floor(i / 3) * (cellH + 24) + 24 });
    cells.push({ input: labelSvg, left: (i % 3) * cellW, top: Math.floor(i / 3) * (cellH + 24) });
  }
  await sharp({ create: { width: cellW * 3, height: (cellH + 24) * 4, channels: 3, background: '#050505' } })
    .composite(cells).png().toFile(path.join(out, 'contact-sheet.png'));
} catch (error) {
  check('execução', false, error.stack || String(error));
} finally {
  await browser?.close();
  server.kill();
}

const result = { mutant: mutant || null, viewport, pitch: 1.45, rows, checks, failures };
fs.writeFileSync(path.join(out, 'result.json'), `${JSON.stringify(result, null, 2)}\n`);
if (mutant) {
  const alvos = ['p90/third', 'p90/shoulder', 'md97/third', 'md97/shoulder'];
  const bitten = mutantApplied && alvos.every((alvo) => failures.some((name) => name.startsWith(alvo)));
  console.log(`MUTANTE ${mutant} ${bitten ? 'MORDEU' : 'CEGO'}`);
  process.exitCode = bitten ? 0 : 1;
} else {
  console.log(`player-camera-visibility: ${failures.length} falha(s) · ${path.relative(ROOT, path.join(out, 'contact-sheet.png'))}`);
  process.exitCode = failures.length ? 1 : 0;
}
