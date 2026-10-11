import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import vm from 'node:vm';
import path from 'node:path';

const source = readFileSync('public/js/characters.js', 'utf8');
const roster = vm.runInNewContext(source.match(/export const CHARACTERS = (\[[\s\S]*?\n\]);/)[1]).filter(c => c.team === 'P' || c.team === 'M');
const masters = process.env.MASTERS || '../../../launch-media/2026-10-11-wallpapers';
mkdirSync(masters, { recursive: true });
mkdirSync('plans', { recursive: true });
const jobs = [{
  id: 'loading-roster-red', aspect: '16:9', width: 2560,
  refs: ['public/img/loading-1.webp'],
  prompt: 'Extend this exact red clown loading illustration horizontally into a seamless 16:9 fullscreen wallpaper. Preserve the exact clown identity, costume, rifle, face, red lighting, Brazilian Congress architecture and CORO SOLTO TRETA SUPREMA logo from the reference. Recompose with the entire clown visible on the left and the exact logo in the upper right safe area, with generous breathing room. Continue the rain-wet plaza and architecture naturally all the way to BOTH edges. No blurred strips, no black borders, no rectangular patches, no duplicate figures or logos. Keep the reference illustration style. This is original game artwork, not a photograph.',
}];
const wallpapers = roster.map((c, i) => ({ id: c.id, name: c.name, wall: `/img/wall-${29 + i}.webp` }));
for (let i = 0; i < roster.length; i++) {
  const c = roster[i];
  jobs.push({
    id: `wall-${29 + i}`, character: c.id, aspect: '3:2', width: 3072,
    refs: [`references/wallpapers-roster/${c.id}.png`, 'public/img/wall-20.webp'],
    prompt: `Create a new CORO SOLTO game menu wallpaper of ${c.name}. Image 1 is the EXACT current game character render: preserve its face, costume, colors, hairstyle, silhouette, body proportions, signature details and weapon. ${c.blurb} Image 2 supplies only the cinematic Brazilian environment, lighting, composition and exact CORO SOLTO TRETA SUPREMA logo. Show ONLY the character from image 1, full body in the right half, head and feet safely inside the middle 75 percent of the canvas so a 16:9 screen can crop the top and bottom without cutting the figure. ${c.team === 'P' ? 'Keep the character clearly a satirical stylized 3D caricature, never a photograph or realistic real person. Environment: rainy Brasilia civic plaza at blue hour, modern Brazilian architecture, warm street lamps.' : 'Environment: an original Brazilian landscape suited to the character, with recognizable Brazilian vegetation or colonial/cangaco architecture, atmospheric dusk and cinematic lighting.'} Wide 3:2 composition with quiet dark negative space on the left for menu controls. Place the exact small logo from image 2 in the upper left SAFE AREA at least 12 percent below the top. Integrate the figure naturally into the scene with ground contact, shadow and consistent lighting. Sharp detailed original game key art. Edge-to-edge continuous environment. No borders, no blur panels, no extra characters, no watermarks, no captions, no gore, no real-world political party logos.`,
  });
}
writeFileSync('public/img/roster-wallpapers.json', JSON.stringify(wallpapers, null, 2) + '\n');
writeFileSync('plans/WALLPAPERS-ROSTER.md', '<!-- spec:time -->\n# Wallpapers do elenco atual\n\n' + roster.map((c, i) => `## ${i + 1}. ${c.name} — arte do elenco\n\n- **Visual:** ${c.blurb} Identidade exata do GLB versionado.\n- **Papel:** wallpaper e sprite do personagem existente; não altera gameplay.\n- **Arma:** wallpapers seguem CHAR_WEAPON; sprites usam o render sem arma do charvideo.html.\n- **Mecânica:** mantém as habilidades existentes; varia somente apresentação e rotação de mídia.\n- **Procedência:** public/models/characters/${c.id}.glb; references/wallpapers-roster/FONTE.md.\n`).join('\n') + '\n## Vetos e aceite\n\nCaricaturas políticas seguem CONTRIBUTING.md; sem foto real, copyright externo ou gore.\nMenu 3:2; loading 16:9; sprite transparente quadrado; revisão independente no tamanho servido.\n');
writeFileSync(path.join(masters, 'prompts.json'), JSON.stringify(jobs, null, 2) + '\n');
const requested = process.argv.slice(2);
for (const job of jobs) {
  if (requested.length && !requested.includes(job.id) && !requested.includes(job.character)) continue;
  if (existsSync(`public/img/${job.id}.webp`)) { console.log(`${job.id}: já gerado`); continue; }
  const args = ['tools/gen-image.mjs', '--id', job.id, '--prompt', job.prompt, '--aspect', job.aspect, '--crop', job.aspect, '--w', String(job.width), '--quality', '90'];
  for (const ref of job.refs) args.push('--ref', ref);
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`${job.id}: gerador saiu ${code}`)));
  });
  copyFileSync(`/tmp/gen-image/${job.id}.png`, path.join(masters, `${job.id}-source.png`));
}
