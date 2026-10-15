# Archivos de Fase 3

Todos los cambios están bajo fase1-aislada/fase3. No se modifica index.html raíz, Fase 1 ni Fase 2.

| Archivo | Propósito |
|---|---|
| journal.js | Protocolo recuperable derivado de Fase 2, destino V3 |
| inventory.js | Reglas de lotes, transformaciones, reservas y saldos reconstruibles |
| scenario.js | Secuencia ficticia compartida por pruebas locales y Google |
| apps-script/Server.gs | Adaptador con bloqueo, autorización y escritura V3 limitada |
| apps-script/Code.gs | Paquete generado único instalado en el proyecto privado |
| apps-script/Index.html | Interfaz generada para inspección |
| web/shell.html | CSS heredado, menú adaptable y pantallas del laboratorio |
| web/app.js | Cola, formulario, proyección y ensayo integrado real |
| build.cjs | Construcción determinista preservando rutas V2 |
| tests/inventory.test.cjs | Reglas, conservación, concurrencia y recuperación |
| tests/apps-script.test.cjs | Google simulado, guardas, compatibilidad y aislamiento |
| tests/client.test.cjs | Cola V3, reconexión, confirmación perdida y aislamiento |
| tests/fixture.cjs | Doble de Sheets con lista estricta de escrituras |
| tests/resultados-locales.txt | Resultado de toda la regresión: 98 aprobadas |
| tests/evidencia-google-inicial.json | Ensayo inicial fallido conservado |
| tests/evidencia-google-final.json | Informe real final, 30/30 aprobado |
| tests/diario-google-sintetico.json | Diario y efectos reales ficticios para comprobación independiente |
| tests/reconstruccion-google.json | Resumen de la reconstrucción: masa, valor y reservas |
| tests/verificacion-paquete.json | Identidad del CSS y aislamiento del paquete |
| README.md | Arquitectura, datos, política de costos y limitaciones |
| ACTA.md | Resultado de la implementación y validación real |

La captura tests/verificaciones-aprobadas.png se conserva como evidencia local de la interfaz, sin incorporarla al repositorio.

El archivo temporal web/Bundle-source.txt no forma parte de la entrega a GitHub. No se incorporan claves, correos de configuración, datos de clientes ni archivos sources.
