import { spawnSync } from 'node:child_process';
for (const mutante of [null, 'mono', 'piso', 'peso', 'cabeca', 'teto', 'fx']) {
  const r = spawnSync(process.execPath, [new URL('bot-pellets-check.mjs', import.meta.url).pathname,
    ...(mutante ? [`--mutante=${mutante}`] : [])], { encoding: 'utf8', maxBuffer: 2 ** 20 });
  const ok = mutante ? r.status === 1 && /^FALHA /m.test(r.stdout) && !r.stderr.includes('Error:') : r.status === 0;
  console.log(`${ok ? 'OK' : 'FALHA'} pellets ${mutante || 'normal'}`);
  if (!ok) { process.stdout.write(r.stdout); process.stderr.write(r.stderr); process.exit(1); }
}
