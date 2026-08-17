import fs from 'node:fs';
const html = fs.readFileSync(process.argv[2], 'utf8');
const body = html.match(/\(function\s*\(\)\s*\{[\s\S]*?\}\)\(\);/)[0];
function simular(pathname, search='', hash='') {
  let d = null;
  new Function('location', body)({ pathname, search, hash, replace(u){ d = u; } });
  return d;
}
console.log('=== rutas de /PowerSemiotics/ (deben dar 404 real, sin redirigir) ===');
const rutas = [
  '/PowerSemiotics/',
  '/PowerSemiotics/index.html',
  '/PowerSemiotics/neurologia.html',
  '/PowerSemiotics/neurologia/acv.html',
  '/PowerSemiotics/ai_dashboard.html',
  '/PowerSemiotics/assets/pdf/Colitis-Ulcerosa.pdf',
  '/PowerSemiotics/gastroenterologia/cirrosis.html',
  '/PowerSemiotics/inmunologia_clinica.html',
  '/PowerSemiotics/medicina_y_datos/inferencia-causal.html',
  '/PowerSemiotics/assets/pdf/Razonamiento_Clinico_Modelos_y_Aplicaciones.pdf',
];
let mal = 0;
for (const r of rutas) {
  const d = simular(r);
  const ok = d === null;
  if (!ok) mal++;
  console.log(`  ${ok ? 'OK ' : 'MAL'} ${r.padEnd(62)} -> ${d === null ? '(404 real)' : d}`);
}
console.log(`\n${rutas.length - mal}/${rutas.length} dan 404 real`);
console.log('\n=== otros prefijos que NO deben capturarse ===');
for (const r of ['/otro/neurologia.html', '/x/assets/pdf/a.pdf', '/neurologiaX.html', '/mi-neurologia/', '/PowerSemiotics']) {
  const d = simular(r);
  console.log(`  ${d === null ? 'OK ' : 'MAL'} ${r.padEnd(62)} -> ${d === null ? '(404 real)' : d}`);
}
