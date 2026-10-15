# Fase 2 — ventas y sincronización en laboratorio

Esta versión opera exclusivamente con TEST_ONLY_V2, recursos demo y el Apps Script independiente autorizado. No es una activación productiva.

## Revisión de los ocho archivos de Fase 1

Se inspeccionaron README.md, docs/plan-y-corte.md, docs/protocolo.md, docs/recursos-creados.md, src/engine.cjs, src/sync.cjs, tests/acceptance.cjs y apps-script/Code.gs.

El motor anterior era un modelo en memoria: reservas, despacho y cancelación previa a despacho. Las 18 pruebas cubrían reintentos, serialización simulada, versión global, costos, cola, descarga tardía y validaciones. No demostraban escritura durable en Sheets, llamadas de navegador, bloqueo entre ejecuciones de Apps Script, persistencia de recibos ni compensación de un consumo ya registrado. Se conservaron esos archivos y sus pruebas para trazabilidad. El código de esta fase está separado en esta carpeta.

## Implementación

- transactions.js: reglas comunes de servidor, comandos v2, validación de stock y costos contra apertura backend, consumo por recurso, snapshot completo por línea, edición comercial con versión de entidad y cancelación compensatoria.
- client.js: cola y recibos en una transacción IndexedDB, operationId/deviceId persistentes, consulta de estado antes de reenviar, ACK ligado a destino/venta/operación/revisión, revalidación de descarga y archivo de rechazos sin borrar evidencia.
- apps-script/Server.gs: adaptador de Google Sheets, bloqueo global de Apps Script, comprobaciones del proyecto y destino, autorización de propietario, RPC del HtmlService y verificaciones privadas.
- apps-script/Code.gs: paquete generado del núcleo, adaptador y HTML para instalar en Código.gs del proyecto de pruebas. No contiene secretos ni código de producción. No instalar a la vez Server.gs y Code.gs porque duplicaría definiciones.
- apps-script/Index.html: interfaz generada para inspección. La versión instalada sirve ese HTML embebido en Code.gs y no depende de un archivo HTML separado.
- web/shell.html: conserva exactamente el bloque CSS original y el armazón de navegación. La página de laboratorio implementa solo ventas; los otros módulos explican que están fuera de alcance. No es todavía un reemplazo integral de index.html.
- web/app.js: formulario de ventas simples, tripack y combo, cola, recibos y edición de contacto.
- web/verification.js: pruebas explícitas desde el navegador contra el backend sintético.
- build.cjs: genera el paquete y bloquea la presencia de conexiones antiguas en el frontend.
- tests/: pruebas locales, simulación del adaptador Apps Script y evidencia real de Google separada.

Construcción: `node build.cjs`. Pruebas: `node --test tests/*.test.cjs`. Sin instalación de dependencias.

## Semántica comercial de esta primera versión

REGISTER_SALE descuenta las bolsas de la disponibilidad comercial al confirmar. DISPATCH_SALE marca despacho sin volver a descontar. CANCEL_SALE antes del despacho compensa exactamente los consumos originales y conserva venta, costos, ganancia y motivo. Una cancelación repetida no repone dos veces, incluso con otro operationId. Después del despacho exige recepción de devolución, todavía fuera de alcance.

Tripack = cantidad de presentaciones por tres bolsas. Combo = líneas explícitas con cantidades por recurso. El backend toma lote, familia, molienda, gramos y costo de su apertura, nunca del saldo o costo del navegador. Los importes se guardan como céntimos enteros. La edición comercial solo admite cliente, teléfono, zona, nota y fecha; bloquea cambios de precio, costo, composición y envío. El formulario actual permite editar nombre; los otros campos están disponibles en el protocolo.

No se reimporta ni recalcula ninguna venta histórica. La única apertura es ficticia y pertenece a TEST_ONLY_V2. El inventario físico unificado, reservas completas, granel, preparación e insumos quedan fuera de esta fase.

## Persistencia y recuperación

La apertura sintética se conserva una vez en AperturaV2. DiarioV2 guarda PREPARED, COMMITTED y rechazos terminales REJECTED, y EfectosV2 guarda efectos con IDs deterministas. Todos los escritores usan LockService. Una venta solo es visible por COMMITTED, después de verificar todos sus efectos. Si se interrumpe la escritura, el siguiente comando completa PREPARED antes de validar nuevas ventas. Reintentar el mismo comando devuelve la confirmación original. Mismo ID con contenido diferente se rechaza.

Snapshot y consulta de estado no escriben ni ejecutan migraciones. Una respuesta perdida se recupera consultando el operationId. Una proyección no aplica deltas por segunda vez: reconstruye apertura más efectos de commits únicos. No se usa clearContents ni se actualizan las pestañas existentes.

La implementación no promete transacciones físicas entre pestañas de Google. La garantía es visibilidad lógica y recuperación bajo un único escritor autorizado; editar el diario manualmente o introducir otro escritor rompe esa premisa.

La lectura actual recorre todo el diario y sus efectos; su coste crece con el volumen. Antes de producción requiere límites operativos medidos, proyecciones verificables e índices, sin convertir cachés en autoridad.

## Seguridad y mantenimiento del laboratorio

Se requiere acceso Google de propietario y coincidencia con el correo configurado en Script Properties. El código verifica el ID del proyecto, el ID de la hoja, su nombre y un marcador sintético. Las únicas pestañas de escritura son DiarioV2, EfectosV2, AperturaV2 y VerificacionesV2. Esta última conserva informes sintéticos explícitos del navegador. Los recursos originales de la hoja de pruebas solo se leen. No se conoce ni se configura ningún ID productivo en este paquete.

El propietario autorizó expresamente el despliegue privado y el alcance OAuth de Google Sheets, que incluye lectura, edición, creación y borrado sobre sus hojas. Google no ofrece restricción de ese alcance al ID permitido por el código. No hay operaciones de borrado en la implementación. Ese permiso y las herramientas de mantenimiento no son una solución de autenticación productiva.

sandboxInitialize, sandboxSmoke y sandboxRecovery son funciones exclusivas de mantenimiento del laboratorio. Ejecutar sandboxExecute sin argumentos desde el editor inicializa y ejecuta la prueba sintética de humo, que deja registros y compensaciones. Con argumentos procesa el protocolo normal. Toda futura versión productiva debe eliminar esas rutas de mantenimiento y sustituir el acceso de propietario por roles revisados. Nunca desplegar con acceso público.

## Pendientes antes de producción

Apertura y fecha de corte aprobadas; inventario físico, pedidos y colas en tránsito; roles y seguridad; pruebas en dispositivos físicos distintos y con volúmenes reales; estrategia de proyecciones; observabilidad y respaldos restaurables; interfaz de devolución recibida y pagos; revisión móvil detallada; integración gradual con el resto de módulos, manteniendo index.html productivo intacto. Una prueba verde de laboratorio no autoriza activación.

## Recursos y resultados verificables

Proyecto de Google: https://script.google.com/home/projects/1Dt2JbUp6BkGPdJLfngMR9ld-dVZUhSZykdlLCOsnLPngffKlrSuOxzfR/edit

Hoja sintética: https://docs.google.com/spreadsheets/d/1CtK6KD995Pu2Fzc_na89Ajc0KQ0QLuGq3UFhj4UdLSA/edit

Despliegue privado inicial (Solo yo): https://script.google.com/macros/s/AKfycbxeXkJ5eQj0HA2BLCxLxk93H5qlu9QmHnMoJDmi4DXs38EWmpi70koAtjBJ-ysgtbbnAw/exec

El 15/10/2026, aproximadamente 00:16–00:17 Lima, la prueba de humo real terminó con passed=true, revisión 0 a 5 y stock restaurado. Se verificaron 10 filas de diario (5 PREPARED y 5 COMMITTED), 6 efectos (3 consumos y 3 compensaciones) y una apertura. Evidencia en tests/evidencia-google-smoke.json. Aproximadamente 00:18 se creó la versión privada inicial. Una venta desde Safari con operationId 1e0346b0-73a9-444f-adfb-0125bf214845 confirmó stock molido de 10 a 9 y se conservó tras recargar. No se infiere de esa recarga una pérdida de respuesta, ya que pudo confirmarse antes de terminar la navegación.

El paquete actualizado incluye verificaciones adicionales. Su resultado remoto y la versión efectiva del despliegue deben consultarse en el acta de entrega; no confundir código guardado con versión desplegada. El editor puede contener un HTML adicional «Sin título.html» creado durante la preparación; el paquete sirve el HTML embebido y no lo referencia.
