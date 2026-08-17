// Descarga los woff2 de Google Fonts (subconjuntos latin y latin-ext) y genera
// un CSS con @font-face apuntando a rutas locales.
import fs from 'node:fs/promises';
import path from 'node:path';

const REPO = process.argv[2];
const OUT_DIR = path.join(REPO, 'assets', 'fonts');
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// URLs únicas encontradas en el repo, normalizadas (&amp; -> &).
const URLS = [
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,300;0,400;1,300&display=swap',
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap',
];
const _OLD = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&display=swap',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap',
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@400;600&display=swap',
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap',
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;600&display=swap',
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap',
  'https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap',
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap',
  'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300;1,8..60,400&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap',
];

const KEEP_SUBSETS = new Set(['latin', 'latin-ext']);

await fs.mkdir(OUT_DIR, { recursive: true });

let css = `/* Fuentes autoalojadas. Generado por scripts/fetch-fonts.mjs.
   Subconjuntos: latin y latin-ext. No editar a mano. */\n\n`;
const downloaded = new Map();
const report = [];

for (const url of URLS) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) {
    console.error('FALLO', res.status, url);
    continue;
  }
  const text = await res.text();

  // Cada @font-face viene precedido de un comentario con el nombre del subconjunto.
  const blocks = text.split('/*').slice(1);
  let kept = 0;
  for (const raw of blocks) {
    const subset = raw.slice(0, raw.indexOf('*/')).trim();
    const body = raw.slice(raw.indexOf('*/') + 2);
    if (!KEEP_SUBSETS.has(subset)) continue;

    const m = body.match(/@font-face\s*\{[^}]*\}/s);
    if (!m) continue;
    let face = m[0];

    const famM = face.match(/font-family:\s*'([^']+)'/);
    const wM = face.match(/font-weight:\s*([^;]+);/);
    const sM = face.match(/font-style:\s*([^;]+);/);
    const urlM = face.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/);
    if (!famM || !urlM) continue;

    const family = famM[1];
    const weight = (wM ? wM[1] : '400').trim().replace(/\s+/g, '-');
    const style = (sM ? sM[1] : 'normal').trim();
    const slug = family.toLowerCase().replace(/\s+/g, '-');
    const fname = `${slug}-${weight}-${style}-${subset}.woff2`;

    if (!downloaded.has(fname)) {
      const fres = await fetch(urlM[1], { headers: { 'User-Agent': UA } });
      const buf = Buffer.from(await fres.arrayBuffer());
      await fs.writeFile(path.join(OUT_DIR, fname), buf);
      downloaded.set(fname, buf.length);
    }

    face = face.replace(/url\(https:\/\/fonts\.gstatic\.com\/[^)]+\)/, `url('./${fname}')`);
    css += face.trim() + '\n\n';
    kept++;
  }
  const fam = decodeURIComponent(url.match(/family=([^:&]+)/)[1]).replace(/\+/g, ' ');
  report.push({ family: fam, faces: kept });
}

await fs.writeFile(path.join(OUT_DIR, 'fonts.css'), css, 'utf8');

let total = 0;
for (const n of downloaded.values()) total += n;
console.log(JSON.stringify({
  familias: report,
  archivos_woff2: downloaded.size,
  peso_total_kb: Math.round(total / 1024),
  css_kb: Math.round(Buffer.byteLength(css) / 1024),
}, null, 2));
