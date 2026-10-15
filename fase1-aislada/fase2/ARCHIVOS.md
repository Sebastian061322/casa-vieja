# Archivos de la Fase 2

Se añaden únicamente archivos bajo fase1-aislada/fase2 en la rama dev/fase1-estabilizacion. Los ocho archivos de Fase 1 y el index.html raíz se conservan sin modificaciones en esta fase.

| Archivo | Función |
|---|---|
| transactions.js | Regla de venta completa, idempotencia y recuperación |
| client.js | Cola IndexedDB y recibos de confirmación |
| apps-script/Server.gs | Adaptador y RPC de Google, autorización y mantenimiento |
| apps-script/Code.gs | Paquete único generado, instalado en Apps Script de pruebas |
| apps-script/Index.html | Interfaz generada para inspección |
| web/shell.html | CSS original y armazón visual con ventas de laboratorio |
| web/app.js | Controladores de formulario, cola y confirmación |
| web/verification.js | Verificaciones explícitas con backend real |
| build.cjs | Construcción reproducible del paquete |
| tests/transactions.test.cjs | Reglas y recuperación, con diario local en disco |
| tests/apps-script.test.cjs | Adaptador completo con servicios Google simulados |
| tests/fixture.cjs | Doble de Sheets con prohibición de escrituras en legado |
| tests/resultados-locales.txt | Salida de la ejecución final de pruebas |
| tests/evidencia-google-smoke.json | Registros sintéticos observados en Google |
| ACTA.md | Resultados, límites y pendientes verificables |
| README.md | Alcance, semántica, riesgos y pasos reproducibles |
| ARCHIVOS.md | Este inventario |

Se excluyen archivos de transferencia local (*-source.txt), herramientas del equipo, credenciales, caches, dependencias y fuentes productivas sin sanitizar.
