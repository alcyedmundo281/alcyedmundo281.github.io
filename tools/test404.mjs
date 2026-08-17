// Extrae el script de redirección del 404.html y lo ejecuta contra cada URL del
// mapa, sin navegador: comprueba la regla, no el renderizado.
import fs from 'node:fs';
const html = fs.readFileSync(process.argv[2], 'utf8');
const body = html.match(/\(function\s*\(\)\s*\{[\s\S]*?\}\)\(\);/)[0];

function simular(pathname, search = '', hash = '') {
  let destino = null;
  const location = {
    pathname, search, hash,
    replace(u) { destino = u; },
  };
  new Function('location', body)(location);
  return destino;
}

const csv = fs.readFileSync(process.argv[3], 'utf8').trim().split('\n').slice(1);
let ok = 0; const fallos = [];
for (const linea of csv) {
  const [vieja, nueva] = linea.split(',');
  const got = simular(vieja);
  if (got === nueva) ok++;
  else fallos.push({ vieja, esperada: nueva, obtenida: got });
}
console.log(`mapa: ${ok}/${csv.length} correctas`);
if (fallos.length) { console.log('FALLOS:'); fallos.slice(0, 12).forEach(f => console.log('  ', f.vieja, '\n     esperada:', f.esperada, '\n     obtenida:', f.obtenida)); }

console.log('\n--- casos especiales ---');
const casos = [
  ['/', null], ['/index.html', null], ['/404.html', null],
  ['/googledb9dc851be57aff6.html', null],
  ['/assets/fonts/fonts.css', null], ['/assets/images/logo.png', null],
  ['/assets/tailwind.css', null],
  ['/neurologia', '/medsemiotics/neurologia.html'],
  ['/assets/pdf/Razonamiento_Clinico_Modelos_y_Aplicaciones.pdf', '/medsemiotics/assets/pdf/Razonamiento-Clinico-Modelos-y-Aplicaciones.pdf'],
  ['/pagina-inventada', null],
  ['/ai_dashboard.html', null],
];
for (const [p, esp] of casos) {
  const got = simular(p);
  const bien = got === esp;
  console.log(`  ${bien ? 'OK ' : 'MAL'} ${p.padEnd(56)} -> ${got === null ? '(404 real)' : got}`);
}
console.log('\n--- query y fragmento ---');
console.log('  ', simular('/neurologia/acv.html', '?caso=2', '#nihss'));
