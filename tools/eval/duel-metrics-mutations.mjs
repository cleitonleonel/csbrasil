import { spawnSync } from 'node:child_process';
for (const mutant of [null, 'gap', 'protegido', 'fatal', 'cura']) {
  const result = spawnSync(process.execPath, [new URL('duel-metrics-check.mjs', import.meta.url).pathname,
    ...(mutant ? [`--mutante=${mutant}`] : [])], { encoding: 'utf8', maxBuffer: 2 ** 20 });
  const ok = mutant ? result.status === 1 && /^FALHA /m.test(result.stdout) && !result.stderr.includes('Error:') : result.status === 0;
  console.log(`${ok ? 'OK' : 'FALHA'} duelo ${mutant || 'normal'}`);
  if (!ok) { process.stdout.write(result.stdout); process.stderr.write(result.stderr); process.exit(1); }
}
