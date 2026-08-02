# El Cacharreo de un Nerd

Banco de trabajo personal — <https://lab.elrefugiodeunnerd.es>

Todo lo que estoy montando, probando o dejando a medias, en una sola página. No
es un portfolio ni un blog: es la mesa de trabajo, con las cosas terminadas y
las que llevan meses paradas al mismo nivel.

Astro · Markdown · TypeScript estricto · CSS · sin frameworks.

---

## Añadir un proyecto

Crea una carpeta en `src/content/proyectos/<slug>/` con un `index.md` dentro. El
nombre de la carpeta es el slug: la URL del enlace directo (`/#<slug>`). Deja la
portada al lado, si tienes.

```
src/content/proyectos/mi-proyecto/
├── index.md
└── cover.jpg      ← opcional
```

Nada más. No hay índice que actualizar ni ruta que añadir.

### Frontmatter

```yaml
---
title: Nombre del proyecto        # obligatorio
category: Sistemas                # obligatorio, texto libre
description: Una o dos frases.    # obligatorio — es el gancho de la tarjeta
status: activo                    # activo | retomado | pausado | hibernado | completado
progress: 65                      # obligatorio, 0-100
started: 2026-06-14               # obligatorio

updated: 2026-07-28               # opcional (ver abajo)
cover: ./cover.jpg                # opcional — ruta relativa
coverAlt: Texto alternativo       # opcional, por defecto el título
pinned: true                      # opcional, arriba del todo
tech: [Arch Linux, Hyprland]      # opcional
notes:                            # opcional
  - Una nota suelta.
links:                            # opcional
  - label: Documentación
    url: https://ejemplo.com
updates:                          # opcional, se ordena solo (más nuevo primero)
  - date: 2026-07-28
    text: Qué pasó ese día.
---

El cuerpo markdown va aquí. Se ve al abrir la tarjeta.
```

Solo son obligatorios los seis primeros. `updated` se calcula del `update` más
reciente y, si no hay ninguno, de `started` — así que normalmente no hace falta
escribirlo. Empieza los encabezados del cuerpo en `##`.

Las portadas conviene que tengan **960 px de ancho o más**: es el tamaño mayor
que se genera. Sin portada se dibuja un degradado con las iniciales, derivado
del slug — siempre el mismo para el mismo proyecto.

### Estados

| Estado | Etiqueta | Cuándo |
| --- | --- | --- |
| `activo` | En marcha | Trabajando en ello ahora |
| `retomado` | Retomado | Aparcado un tiempo y de vuelta |
| `pausado` | En pausa | Parado, con intención de volver |
| `hibernado` | Hibernando | Parado hace mucho, nunca descartado |
| `completado` | Completado | Terminado, aunque puede volver |

Orden por defecto: fijados primero, luego por estado (lo vivo arriba), luego por
actividad más reciente.

---

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm run check    # tipos y contenido
npm run build    # estático en dist/
npm run preview  # sirve dist/ tal cual se publicará
```

---

## Decisiones

Escritas aquí porque no se deducen del código.

**Un markdown por proyecto, sin rutas propias.** Toda la web es la portada. No
hay páginas de detalle, ni archivo, ni paginación: las tarjetas se abren en el
sitio. Añadir un proyecto tiene que costar menos de un minuto o se deja de hacer.

**Las tarjetas se abren con JS propio, no con `<details>`.** Decisión consciente,
y por eso el script cuida lo que el elemento nativo daba gratis: el botón vive
dentro del encabezado con `aria-expanded`/`aria-controls`, los paneles cerrados
llevan `inert` (fuera del tabulador y del árbol de accesibilidad), y al cerrar
con el foco dentro se devuelve el foco al botón. El alto se anima con
`grid-template-rows: 0fr → 1fr`, sin medir nada desde JS.

**Sin JS todo sigue funcionando.** Los paneles están siempre en el HTML: sin
scripts se ven abiertos y no se pierde nada. Un script en línea cambia
`no-js` → `js` antes del primer pintado, así que las tarjetas ya aparecen
cerradas — no hay parpadeo. La barra de filtros es `.js-only` y desaparece:
el modo degradado es "se ve todo", que es justo la idea del sitio.

**Los filtros van en la URL.** `?categoria=…&estado=…` con `replaceState`, y el
estado se restaura al recargar. Filtrar solo oculta tarjetas ya renderizadas: es
instantáneo y no hay nada que volver a pedir.

**El estado nunca se comunica solo con color.** Cada estado tiene también su
glifo, así que sobrevive a impresión en gris y a daltonismo.

**Claro y oscuro, los dos de primera.** Por defecto se sigue al sistema; el botón
guarda una preferencia explícita en `localStorage`, que el mismo script en línea
vuelve a aplicar antes de pintar.

**Claves en inglés, valores en español.** El frontmatter usa `title`/`status`
(convención de Astro y de las herramientas); todo lo que se lee en pantalla es
español. Cambiarlo sería tocar solo `src/content.config.ts` y las plantillas.

**Sin dependencias de ejecución.** Solo Astro. Tipografía del sistema, cero
peticiones de red, cero analíticas.

### Si algún día hay ~100 proyectos

Se renderizan todos en una página. A esa escala habrá que replantear el orden y
mirar renderizado diferido o paginación. Hasta entonces no compensa la
complejidad.

---

## Publicación

GitHub Pages vía Actions (`.github/workflows/deploy.yml`): cada push a `main`
publica. En el repo hay que poner **Settings → Pages → Source: GitHub Actions**,
y el dominio propio sale de `public/CNAME`.

> **Nota:** en la máquina donde se montó esto `git` no estaba en el `PATH`. Hace
> falta instalarlo y crear el repositorio remoto antes del primer despliegue.
