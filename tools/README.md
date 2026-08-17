# tools/

Utilidades de desarrollo del sitio de usuario. **Nada de aquí se publica**: no se
enlaza desde ninguna página y el sitio funciona sin ellas.

## `test404.mjs` — la lógica de redirección

```bash
node tools/test404.mjs 404.html mapa-redirecciones.csv
```

Extrae el script de redirección del `404.html` y lo ejecuta contra cada URL del
mapa, sin navegador. Comprueba la regla, no el renderizado.

Es la prueba que hay que pasar tras **cualquier** cambio en el `404.html`, incluido
un cambio de estilo: el rediseño de la página no debe alterar el comportamiento, y
la única forma de saberlo es volver a correr las 121 filas.

## `test-ps.mjs` — que no capture de más

```bash
node tools/test-ps.mjs 404.html
```

Comprueba que las rutas de `/PowerSemiotics/` —el repositorio archivado— y otras
variantes cercanas dan un 404 real y **no** se redirigen a un destino inventado.

La regla usa `indexOf(prefijo) === 0`, anclada al inicio, así que
`PowerSemiotics/neurologia.html` nunca coincide con `neurologia/`. Este script
existe para que eso siga siendo cierto si alguien toca la lógica.

## `verify-map.mjs` — contra producción

```bash
node tools/verify-map.mjs
```

Recorre con navegador real una muestra del mapa antiguo contra
`powersemiotics.com` y confirma que cada URL aterriza en su destino bajo
`/medsemiotics/`, con query y fragmento intactos.

Hace falta navegador porque la redirección es de cliente: `curl` solo vería el 404.

## `fetch-fonts-usersite.mjs` — las fuentes de la portada

```bash
node tools/fetch-fonts-usersite.mjs .
```

Descarga los woff2 de las tres familias de la portada —Bricolage Grotesque,
Newsreader e IBM Plex Mono—, subconjuntos latin y latin-ext, y genera los
`@font-face`.

Al ejecutarlo conviene recordar dos cosas comprobadas: Bricolage Grotesque y
Newsreader son **fuentes variables**, así que un mismo archivo cubre todo su rango
de peso y el `@font-face` debe declarar un rango, no un valor suelto; y la portada
**no usa itálica** —su único `<em>` lleva `font-style: normal`—, de modo que
descargarla sobra.
