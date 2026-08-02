---
title: Este taller
category: Web
description: "El sitio que estás mirando. Astro, cero frameworks y un objetivo: que se vea de un golpe todo lo que tengo entre manos."
status: en-curso
progress: 80
started: 2026-07-30
tech:
  - Astro
  - TypeScript
  - CSS
links:
  - label: Astro Docs
    url: https://docs.astro.build
notes:
  - Las tarjetas se abren sin cambiar de página. Era el requisito que más me importaba.
  - Sin analíticas. No quiero saber cuánta gente entra.
updates:
  - date: 2026-08-01
    text: Filtros por categoría y estado, con el estado guardado en la URL.
  - date: 2026-07-30
    text: Primera versión del sistema de tarjetas y estados.
---

No quería un portfolio ni un blog. Quería algo que respondiera de un vistazo a
"¿en qué andas metido?" — incluidas las cosas pequeñas y las que llevan meses
paradas.

Decisiones que tenía claras desde el principio:

- **Un markdown por proyecto.** Añadir algo tiene que costar menos de un minuto.
- **Nada desaparece.** Un proyecto abandonado sigue en la página, con su estado.
- **Sin JavaScript de más.** Lo único que hay es abrir tarjetas y filtrar.
