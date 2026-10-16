#!/usr/bin/env node
/* Converte GLBs de public/ para EXT_meshopt_compression (lane glm/peso, PR meshopt).
   Uso: node tools/meshopta-glb.mjs [arquivo.glb...]   (default: os 15 -hires de coro)
   Preserva textura e hierarquia; re-codifica buffers de vértice/índice/animação.
   A saída TEM que ser container GLB (magic 'glTF'): o NodeIO escolhe o escritor
   pela extensão do destino, e um destino sem .glb explode em .bin + texturas
   externas (foi o que a 1ª versão deste script fez, e o "0,41 MB" era mentira).
   Registra origem/convertido sha256 em tools/eval/meshopt-manifest.json (a régua
   confere). */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import { copyFileSync, existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname } from 'node:path';

await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });

const DIR_VM = 'public/models/viewmodels/coro';
export const ALVOS = readdirSync(DIR_VM).filter((n) => /-hires\.glb$/.test(n)).map((n) => `${DIR_VM}/${n}`);

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const manifestPath = 'tools/eval/meshopt-manifest.json';
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};

const arquivos = process.argv.length > 2 ? process.argv.slice(2) : ALVOS;
for (const arquivo of arquivos) {
  const antes = readFileSync(arquivo);
  const doc = await io.read(arquivo);
  await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
  const tmp = `${arquivo}.tmp.glb`;
  await io.write(tmp, doc);
  const saida = readFileSync(tmp);
  if (saida.readUInt32LE(0) !== 0x46546c67) throw new Error(`${arquivo}: saída não é container GLB (magic 0x${saida.readUInt32LE(0).toString(16)})`);
  const registro = manifest[arquivo] || (manifest[arquivo] = {});
  if (!registro.origemSha256) registro.origemSha256 = sha256(antes);
  copyFileSync(tmp, arquivo);
  rmSync(tmp);
  registro.convertidoSha256 = sha256(readFileSync(arquivo));
  registro.bytesAntes = antes.length;
  registro.bytesDepois = saida.length;
  console.log(`${arquivo}: ${(antes.length / 1e6).toFixed(2)} MB -> ${(saida.length / 1e6).toFixed(2)} MB (${(100 * saida.length / antes.length).toFixed(0)}%)`);
}
mkdirSync(dirname(manifestPath), { recursive: true });
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
