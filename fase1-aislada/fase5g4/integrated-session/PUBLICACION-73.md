# Comercial-73 publicado en laboratorio

Verificado el 11 de noviembre de 2026 (Lima).

- Código: fb1a64f4aa06bae17a1bd444c068bba797ef5a4a; implementación consolidada f94f19e.
- Worker casa-vieja-lab-auth: d1913a09, Active / Latest, confirmación Version saved.
- SHA256: 6514225f39bab0298dba0e88a7522acfd2c2ee3a1d61ce8c09347e8dadb40c03. Texto completo releído desde el editor antes de publicar: coincidencia exacta.
- CV_5G4_WORKER_SHA256 actualizado y releído en configuración guardada del AUTH de pruebas.
- Apps Script: sin modificaciones de código/despliegue; se conserva backend 9.
- 687/687 pruebas locales aprobadas en la preparación. Seis archivos remotos coinciden byte a byte (comercial73-remote.json). Tres rechazos públicos aprobados: origen ausente, origen ajeno y sin identidad (comercial73-public-security.json).
- Únicamente cambian approved-app.js y entry.mjs respecto a la base; gateway, backend y cola permanecen idénticos. No se registraron operaciones comerciales ni sintéticas durante esta publicación.
- No se tocaron producción, main, historial, permisos, secretos ni facturación.

## Límites de aceptación

La aceptación física del iPhone y recorridos autenticados de los tres perfiles sobre este paquete siguen pendientes. No se afirma que todas las funciones hayan sido comprobadas remotamente con sesión. El respaldo previo de 45 registros/28 movimientos no se repitió; falta confirmar custodia de clave separada.

El manifiesto build/manifest.json describe el artefacto de preparación (deployed:false); este documento y las evidencias remotas acreditan el despliegue posterior sin reconstruir el paquete.

## Reversión y activación

Reversión compatible de interfaz: Worker 21b70d74 y hash anterior 6d5634525d2ff0cb7e4bcf5ea67a331a3bc28936c9a07ef7903a144fc8c6c3e2, conservando backend, diarios, recibos y colas. No ejecutar automáticamente ni restaurar datos antiguos.

No hay activación comercial: faltan aceptación móvil integral, catálogo/tarifas aprobados, inventario físico y costos de apertura, obligaciones previas, respaldo comercial autorizado, revisión de colas/dispositivos y plan de cierre de escritores antiguos con autorización de corte.

## Aceptación remota posterior

Sesión de administrador recuperada tras recarga; navegación y consultas de ventas, pedidos, inventario, clientes, lotes, reportes, Ads y aprobaciones comprobadas. Ensayo del administrador APROBADO, falsificación de identidad rechazada y revisión del diario sin cambios. Evidencia: tests/comercial73-admin-acceptance.json. Estas comprobaciones no acreditan todas las escrituras ni sustituyen la aceptación física en iPhone. Entrada pública nuevamente cotejada con SHA e9ac91f305b91c16b963c2df34fa6f01846cbb028c2e152d4ea7433fd535e6f0. No hubo cambios de paquete ni nuevo despliegue.
