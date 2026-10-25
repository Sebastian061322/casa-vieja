# Corrección del ensayo de permisos DR — 25 de octubre de 2026

Estado: autorización específica recibida el 25 de octubre de 2026. Publicado únicamente en Worker DR, versión `cebc33f5-c85e-461a-947c-358fbaeceebd`. Verificaciones públicas aprobadas; pruebas autenticadas pendientes.

La página raíz del Worker no muestra «Comprobar permisos y consultas». El ensayo se habilita expresamente con `?validation=5d`; el enlace anterior omitía ese parámetro. El ingreso como administrador fue confirmado por el propietario, pero no equivale a aprobar las pruebas de permisos.

Al revisar el ensayo heredado se encontró que su solicitud para intentar falsificar un rol no incluía el ámbito DR. El backend la rechazaba antes de alcanzar la comprobación de identidad. El ajuste incorpora ese ámbito exclusivamente en el ensayo y añade una comprobación independiente del rechazo de comandos sin ámbito DR.

## Paquete concreto

- Destino remoto único: Worker existente `casa-vieja-dr-test-only-5g` y archivos/evidencia en `dev/fase1-estabilizacion`.
- Worker SHA256: `86c04fff1b690fdd08ae8caf83dd0576ee9324454f2dd84ab7d0953432471287`.
- Solo cambian los módulos de verificación `/validation.mjs` y `/entry.mjs`.
- No cambian Apps Script, autenticación/API fuera de esos módulos, interfaz comercial, permisos, cuentas, secretos, comandos comerciales ni registros.
- Sin recursos nuevos, pagos ni modificaciones en producción o en el laboratorio original.
- Reversión de código: Worker `412e54bf-4803-4017-93b2-316dbdc6e8d5`, conservando configuración, datos y colas. No restaurar copias antiguas de Sheets.

## Evidencia local

27 pruebas aprobadas y cero fallos: 22 pruebas DR existentes más cinco comprobaciones del ajuste. Incluyen el módulo compilado de verificación contra el backend simulado para los tres perfiles, rechazo de falsificación de identidad, rechazo de comandos sin ámbito y conservación de diarios/movimientos. No sustituyen las verificaciones reales con Google.

Ver `resultados.txt`, `validation.test.mjs` y `build/manifest.json`.

Después de autorizar y verificar el despliegue se abrirá:
https://casa-vieja-dr-test-only-5g.portopelaez1009.workers.dev/?validation=5d

La solicitud de aprobación específica responde a la sección 3 de la instrucción Fase 5G.1 y al alcance por paquete autorizado anteriormente. La autorización previa cubría el Worker de hash `9ac92655e66705f83b0f9267e62dd0663b9171e397902f85464c0167fe756561`, no este nuevo candidato.
