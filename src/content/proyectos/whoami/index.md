---
title: Arch Linux en el portátil viejo
category: Sistemas
description: Revivir un portátil de 2013 con Arch y un escritorio mínimo, a ver cuánto aguanta como máquina de diario.
status: en-curso
progress: 65
started: 2026-06-14
pinned: true
tech:
  - Arch Linux
  - Hyprland
  - systemd-boot
links:
  - label: Arch Wiki — Installation guide
    url: https://wiki.archlinux.org/title/Installation_guide
notes:
  - El táctil va raro con libinput. Apuntado para mirar con calma.
  - La batería aguanta 2h reales. Suficiente para lo que quiero.
updates:
  - date: 2026-07-28
    text: Hyprland configurado y arrancando solo. Ya lo uso para escribir notas.
  - date: 2026-07-05
    text: Instalación base terminada. systemd-boot en lugar de GRUB, mucho más simple.
  - date: 2026-06-14
    text: Formateado. Punto de no retorno.
---

Tenía este portátil muerto en un cajón y me daba pena tirarlo. La idea es
dejarlo usable sin pelearme demasiado: instalación mínima, un compositor ligero
y nada más.

Lo interesante no es Arch en sí, es ver **cuánto se puede exprimir** hardware de
hace más de una década cuando le quitas todo lo que no hace falta.

## Dónde está ahora

- Sistema base funcionando
- Hyprland arrancando en automático
- Pendiente: arreglar el táctil y decidir qué hago con el suspend
