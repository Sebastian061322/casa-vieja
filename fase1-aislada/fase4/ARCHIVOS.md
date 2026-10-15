# Archivos de Fase 4

Todos los archivos nuevos están bajo fase1-aislada/fase4. No se modifica ningún archivo anterior del repositorio.

| Archivo | Función |
|---|---|
| DIAGNOSTICO.md | Diagnóstico previo, matriz original → nuevo y riesgos de arquitectura |
| commercial.js | Catálogo, descuentos, cobros, créditos, reembolsos, gastos y reportes sobre motor V3 |
| scenario.js | Recorrido comercial ficticio compartido por pruebas |
| apps-script/Server.gs | RPC privado, compatibilidad V3 y ensayo real, sin nuevos destinos |
| apps-script/Code.gs | Paquete generado único instalado en Apps Script de pruebas |
| apps-script/Index.html | HTML generado para inspección |
| web/shell.html | Navegación y estructura visual; conserva el CSS original |
| web/app.js | Formularios, filtros, estado de sincronización, cola y verificaciones |
| build.cjs | Construcción preservando rutas anteriores |
| preview.cjs | Vista local con Google simulado; solo 127.0.0.1 |
| tests/commercial.test.cjs | Reglas de precios, dinero, costos, reportes y recuperación |
| tests/client.test.cjs | Cola comercial, reinicio, respuesta perdida y descarga antigua |
| tests/apps-script.test.cjs | Integración con Google simulado, guardas, rutas y protección V3/V4 |
| tests/helpers.cjs / fixture.cjs | Datos y servicios sintéticos de prueba |
| tests/resultados-locales.txt | Regresión completa |
| tests/evidencia-interfaz-local.json | Comprobaciones reales de navegador contra simulación local |
| README.md | Arquitectura, datos, políticas y límites |
| MATRIZ_PRUEBAS.md | Correspondencia de los 22 casos solicitados con su evidencia |
| tests/evidencia-google-final.json | 48 verificaciones reales aprobadas y leídas desde Sheets |
| tests/diario-google-sintetico.json | Diario y movimientos reales ficticios para reproducción |
| tests/reconstruccion-google.json | Contraste independiente de masa, dinero e historial anterior |
| tests/verificacion-paquete.json | Estilos, rutas y destinos permitidos |
| ACTA.md | Resultado final, fallos corregidos, evidencias y pendientes |

Las capturas y el archivo temporal web/Bundle-source.txt se conservan localmente y se excluyen de GitHub. No se incorporan fuentes productivas, configuración secreta ni datos reales de clientes.
