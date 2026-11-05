# Auditoría editorial de Powersemiotics — 04/11/2026

## Cambio de la portada propuesto en este PR

En la ficha de biosemiotics de «Cartera» se añaden, como texto visible:

> Publicación seriada de Powersemiotics · ISSN 3144-7813 (en línea)
> Licencia CC BY 4.0 · Acceso abierto, sin cargos al autor

La licencia enlaza a https://creativecommons.org/licenses/by/4.0/deed.es.
Se mantienen dominio, DOI, estado y enlace al atlas.

El pie «La puerta está abierta» tiene contacto y correo a la izquierda y los
bloques Editor y Autor apilados a la derecha, separados por una línea.
Antes de modificarlo se reportó su contexto a Alcy. La decisión explícita fue
retirar la ciudad personal y dejar tres líneas:

> Autor
> Alcy Edmundo Torres Guerrero
> Medicina interna · ORCID 0000-0002-9742-375X

ORCID mantiene su enlace. No se sustituye Quito por otra ciudad. El bloque
Editor conserva exactamente su HTML y su texto:

> Publicado por Powersemiotics · Wellesley, Massachusetts, EE. UU.

## Cobertura del barrido

Se inspeccionaron fuentes HTML, metadatos, plantillas, scripts y datos de los
tres repositorios que sirven el dominio, junto al HTML y recursos públicos:

- Sitio raíz: `alcyedmundo281/alcyedmundo281.github.io`, base
  `5a60baeb80aba0e1bf9ce1e6cfdf7b90896f6b37` (42 HTML).
- Proyecto `/medsemiotics/`: `alcyedmundo281/medsemiotics`,
  `1cea81909ba9a31ad9606758807470a3b7fc38f9` (98 HTML), solo lectura.
- Proyecto `/farmacosemiotics/`: `alcyedmundo281/farmacosemiotics`,
  `2005c60bcba1c53f09cde739a504cfa3115b2c4b`, solo lectura. El sitio es
  generado: se siguieron las 149 rutas de su índice público `index.json`.

El inventario `auditoria-ubicacion-2026-11-04.csv` registra 382 URLs:
358 respuestas 200 y 24 respuestas 404, sin errores de conexión en el barrido
completado. Incluye portada, `/index.html`, `/404.html`, ambos proyectos,
sitemaps y recursos de texto con menciones de ubicación. Las rutas del índice
público de farmacosemiotics se resolvieron respecto a su directorio.

Los proyectos de GitHub Pages prevalecen sobre las carpetas homónimas del
repositorio raíz: no se dio por vivo un HTML antiguo solo por estar en Git.
Las 24 respuestas 404 son 22 rutas antiguas de farmacosemiotics y dos archivos
fuente de ese proyecto que no se publican. Se registran; no se reparan ni se
alteran redirecciones en este PR.

## Resultado y menciones que se conservan

No se encontró otra ubicación presentada como sede de Powersemiotics fuera
de Wellesley. La portada ya atribuye Wellesley al estudio y al Editor; la 404
también dice «Publicado por Powersemiotics · Wellesley, Massachusetts, EE. UU.».
En `/medsemiotics/lecciones/AI-USE.md` el Editor figura en Wellesley.
El proyecto actual de farmacosemiotics no declara otra ciudad editorial.
El Quito del bloque Autor de la portada es el único cambio de ubicación
propuesto y fue decidido expresamente por Alcy. En producción sigue visible
hasta que se fusione y despliegue este PR.

Las siguientes menciones se dejan intactas:

| Ruta o fuente | Contexto de Quito | Situación |
|---|---|---|
| `/medsemiotics/gastroenterologia/helicobacter_pylori.html` | Paciente masculino de 45 años, de Quito | Caso clínico, público |
| `/medsemiotics/neurologia/trastornos-movimiento-2.html` | Paciente atendida en un Centro de Salud Tipo C en Quito | Caso clínico, público |
| `/medsemiotics/medicina_e_implementacion/parentalidad-salud.html` | Cuatro referencias: estudio en Quito y lugares de publicación de PUCE/Abya-Yala | Bibliografía, pública |
| `/medsemiotics/lecciones/paratextos/autores.md` y `lecciones/mapa.yaml` | Perfil y afiliación de Gladys Torres Guerrero en VisionUno, Quito | Otra persona e institución; no sede del sello |
| `medsemiotics: assets/plantilla-leccion.qmd`, `lecciones/leccion-examen-neurologico-recien-nacido.qmd`, `lecciones/mapa.yaml`, `mapa-maestro-libro.md` | Lugar de publicación de las obras de Torres Catefort de 1991/1993 | Legado bibliográfico; no sede del sello actual |
| `farmacosemiotics/apixaban.html`, en el repo raíz, línea 340 | Precios de mercado de Mantixa/Eliquis en Quito, Ecuador (Sumerlabs; 2023) | Fuente antigua conservada; su URL pública devuelve 404 |
| `farmacosemiotics/pembrolizumab_escamoso.html`, en el repo raíz, línea 253 | Barreras de acceso para pacientes fuera de Quito/Guayaquil | Fuente antigua conservada; su URL pública devuelve 404 |

También se conservaron Guayaquil en un caso docente, Ecuador en epidemiología,
sistema sanitario, afiliaciones y costos, y Boston en afiliaciones personales
de otros autores. No se confunden con la sede del editor.

## Verificación del cambio

Comprobación del HTML de la vista previa: texto editorial completo y visible
en la ficha, enlace CC BY correcto, bloque Autor coincidente con la decisión
y bloque Editor idéntico byte por byte al original. `git diff --check` pasa.
No se cambia la 404 ni su lógica, los contenidos de los proyectos ni sus
licencias. No se modifica el repositorio ni el sitio biosemiotics.net.
