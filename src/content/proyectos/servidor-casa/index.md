---
title: Servidor casero en una Raspberry
category: Infraestructura
description: Un mini servidor para backups y algún servicio propio. Lleva más tiempo encendido del que esperaba.
status: retomado
progress: 45
started: 2025-11-09
tech:
  - Raspberry Pi 4
  - Docker
  - Tailscale
notes:
  - La SD murió una vez. Ahora arranca desde SSD por USB.
  - Tailscale me quitó de encima todo el lío de abrir puertos.
updates:
  - date: 2026-07-20
    text: Retomado. Backups automáticos del portátil funcionando otra vez.
  - date: 2026-02-11
    text: Aparcado. Se me fue el tiempo en otras cosas.
  - date: 2025-11-09
    text: Primer arranque. Docker instalado y poco más.
---

Empezó como "voy a tener mis backups en casa" y se convirtió en la excusa para
aprender Docker en serio.

Estuvo cinco meses apagado en una estantería. Lo volví a enchufar en julio
porque me hacía falta el backup, y de paso lo he dejado más ordenado que antes.

## Qué corre ahora

- Backups con `restic`
- Tailscale para llegar desde fuera
- Un `syncthing` que va y viene
