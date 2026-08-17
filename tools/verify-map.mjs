import puppeteer from 'puppeteer';
const B = 'https://powersemiotics.com';
const casos = [
  ['/neurologia.html', '/medsemiotics/neurologia.html'],
  ['/gastroenterologia.html', '/medsemiotics/gastroenterologia.html'],
  ['/inmunologia_clinica.html', '/medsemiotics/inmunologia_clinica.html'],
  ['/medicina_y_datos.html', '/medsemiotics/medicina_y_datos.html'],
  ['/neurologia/acv.html', '/medsemiotics/neurologia/acv.html'],
  ['/neurologia/cefaleas/index.html', '/medsemiotics/neurologia/cefaleas/index.html'],
  ['/gastroenterologia/colitis-ulcerosa.html', '/medsemiotics/gastroenterologia/colitis-ulcerosa.html'],
  ['/farmacoterapia_racional/apixaban.html', '/medsemiotics/farmacoterapia_racional/apixaban.html'],
  ['/medicina_y_datos/inferencia-causal.html', '/medsemiotics/medicina_y_datos/inferencia-causal.html'],
  ['/medicamentos_cronicos.html', '/medsemiotics/medicamentos_cronicos.html'],
  ['/trastornos-movimiento-1.html', '/medsemiotics/trastornos-movimiento-1.html'],
  ['/assets/pdf/Colitis-Ulcerosa.pdf', '/medsemiotics/assets/pdf/Colitis-Ulcerosa.pdf'],
  ['/assets/pdf/Razonamiento_Clinico_Modelos_y_Aplicaciones.pdf', '/medsemiotics/assets/pdf/Razonamiento-Clinico-Modelos-y-Aplicaciones.pdf'],
  ['/neurologia', '/medsemiotics/neurologia.html'],
  ['/neurologia/acv.html?caso=2#nihss', '/medsemiotics/neurologia/acv.html?caso=2#nihss'],
];
const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
let ok = 0;
for (const [vieja, esperada] of casos) {
  const p = await b.newPage();
  let final = '', estado = 0;
  try {
    const r = await p.goto(B + vieja, { waitUntil: 'domcontentloaded', timeout: 30000 });
    estado = r ? r.status() : 0;
    await new Promise((r) => setTimeout(r, 900));
    final = p.url();
  } catch (e) { final = 'ERROR ' + e.message.slice(0, 40); }
  const esperadaAbs = B + esperada;
  const bien = final === esperadaAbs;
  if (bien) ok++;
  console.log(`${bien ? 'OK ' : 'MAL'} ${vieja.padEnd(56)} -> ${final.replace(B, '')}`);
  if (!bien) console.log(`     esperada: ${esperada}`);
  await p.close();
}
console.log(`\n${ok}/${casos.length} correctas`);
await b.close();
