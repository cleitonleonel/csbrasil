import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(process.env.CORO_RENDER_PACKAGE || path.join(root, '../../../package.json'));
const { Resvg } = require('@resvg/resvg-js');
const sharp = require('sharp');
const tokens = JSON.parse(fs.readFileSync(path.join(root, 'tokens.json')));
const cards = JSON.parse(fs.readFileSync(path.join(root, 'cards.json')));
const c = tokens.colors;
const fontNames = ['bebas', 'barlow', 'barlow-bold', 'mono'];
for (const n of fontNames) {
  if (!fs.existsSync(path.join(root, 'assets', `${n}.ttf`))) throw new Error(`Falta fonte ${n}.ttf`);
}
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const imgCache = new Map();
async function dataImage(name) {
  if (!imgCache.has(name)) {
    const file = path.join(root, 'assets', name);
    const bytes = name.endsWith('.webp') ? await sharp(file).png().toBuffer() : fs.readFileSync(file);
    imgCache.set(name, `data:image/${name.endsWith('.jpg') ? 'jpeg' : 'png'};base64,${bytes.toString('base64')}`);
  }
  return imgCache.get(name);
}
const text = (value, x, y, size, fill = c.ink, family = tokens.fonts.title, extra = '') => `<text x="${x}" y="${y}" fill="${fill}" font-family="${family === tokens.fonts.body ? 'Barlow Condensed Medium' : family}" font-size="${size}" font-weight="400" ${extra}>${esc(value)}</text>`;
const cut = (x, y, w, h, fill) => `<path d="M${x + 16} ${y}H${x + w}V${y + h - 16}L${x + w - 16} ${y + h}H${x}V${y + 16}Z" fill="${fill}"/>`;
async function svg(card, format) {
  const [w, h] = tokens.formats[format];
  const landscape = format === 'landscape', story = format === 'story';
  const left = landscape ? 56 : 72;
  const top = story ? 180 : landscape ? 38 : 56;
  const logo = await dataImage('logo.png'), hero = await dataImage(card.image);
  const photo = card.kind === 'map' || card.kind === 'dev';
  const imageBox = landscape ? [650, 110, 494, 412] : photo ? [72, story ? 700 : 555, 936, story ? 560 : 455] : [220, story ? 660 : 510, 820, story ? 710 : 570];
  const [ix, iy, iw, ih] = imageBox;
  const titleY = landscape ? 285 : story ? 495 : 360;
  const fontSize = landscape ? 84 : 112;
  const gap = landscape ? 82 : 106;
  const descY = landscape ? 445 : story ? 1420 : 1130;
  const ctaY = landscape ? 533 : story ? 1490 : 1195;
  const labelY = landscape ? 548 : photo ? iy + ih + 35 : story ? 1380 : 1090;
  let body = `<defs><clipPath id="photo"><path d="M${ix + 16} ${iy}H${ix + iw}V${iy + ih - 16}L${ix + iw - 16} ${iy + ih}H${ix}V${iy + 16}Z"/></clipPath><linearGradient id="shade" x2="0" y2="1"><stop offset="0" stop-color="${c.background}" stop-opacity="0"/><stop offset="1" stop-color="${c.background}" stop-opacity=".9"/></linearGradient></defs>`;
  body += `<rect width="${w}" height="${h}" fill="${c.background}"/><path d="M0 ${h - 38}H${w}" stroke="${c.line}" stroke-width="2"/>`;
  body += `<image href="${logo}" x="${left}" y="${top}" width="${landscape ? 148 : 200}" height="${landscape ? 115 : 155}" preserveAspectRatio="xMidYMid meet"/>`;
  body += text('@corosolto', w - left, top + (landscape ? 30 : 55), landscape ? 20 : 26, c.muted, tokens.fonts.meta, 'text-anchor="end"');
  body += `<image href="${hero}" x="${ix}" y="${iy}" width="${iw}" height="${ih}" preserveAspectRatio="${photo ? 'xMidYMid slice' : 'xMidYMid meet'}" ${photo ? 'clip-path="url(#photo)"' : ''}/>`;
  if (photo) body += `<path d="M${ix} ${iy}H${ix + iw}" stroke="${c.lime}" stroke-width="4"/>`;
  body += text(card.kicker, left, titleY - (landscape ? 101 : 119), landscape ? 21 : 27, c.amber, tokens.fonts.meta, 'letter-spacing="2"');
  card.headline.forEach((line, i) => { body += text(line, left, titleY + i * gap, fontSize, i ? c.lime : c.ink); });
  card.description.forEach((line, i) => { body += text(line, left, descY + i * 35, landscape ? 27 : 34, c.body, tokens.fonts.body); });
  body += text(card.imageLabel, landscape ? ix : left, labelY, landscape ? 14 : 21, c.muted, tokens.fonts.meta);
  const bw = landscape ? 495 : w - left * 2;
  body += cut(left, ctaY, bw, landscape ? 72 : 78, c.lime);
  body += text(card.cta, left + 24, ctaY + 51, landscape ? 38 : 45, c.background);
  body += `<path d="M${left + bw - 60} ${ctaY + 50}l25 -25m-25 0h25v25" fill="none" stroke="${c.background}" stroke-width="4"/>`;
  const footer = new URL(tokens.site).hostname.toUpperCase();
  body += text(footer, left, ctaY + (landscape ? 101 : 113), landscape ? 21 : 28, c.ink, tokens.fonts.meta);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"><title>${esc(card.alt)}</title>${body}</svg>`;
}
fs.mkdirSync(path.join(root, 'exports'), { recursive: true });
const rows = [];
for (const card of cards) {
  for (const format of Object.keys(tokens.formats)) {
    const content = await svg(card, format);
    const name = `${card.id}-${format}`;
    fs.writeFileSync(path.join(root, 'exports', `${name}.svg`), content);
    const bytes = new Resvg(content, { font: { fontFiles: fontNames.map(n => path.join(root, 'assets', `${n}.ttf`)), loadSystemFonts: false } }).render().asPng();
    fs.writeFileSync(path.join(root, 'exports', `${name}.png`), bytes);
    const meta = await sharp(bytes).metadata();
    rows.push({ file: `exports/${name}.png`, width: meta.width, height: meta.height, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') });
  }
}
fs.writeFileSync(path.join(root, 'exports', 'MANIFEST.json'), JSON.stringify({ generatedAt: new Date().toISOString(), renderer: '@resvg/resvg-js', files: rows }, null, 2) + '\n');
console.log(`Exportadas ${rows.length} peças PNG e seus SVGs editáveis. Veja exports/MANIFEST.json.`);
