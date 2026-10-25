# Inspección estática autorizada de main

Solo index.html del commit 12a5f997845f9d31dc1a5d8ae7dc49770928da3d, SHA256 dd0f84bfea29087ab70251f43ac8e4d77d40f56714c6827e4d2d234d313aa522. No se ejecutó el HTML, no se llamó ningún endpoint y no se leyó almacenamiento de equipos ni Sheets productivo. No certifica que la web publicada sea idéntica.

| Ruta observada | Evidencia estática | Implicación para corte |
|---|---|---|
| apiPost(action,payload) | líneas 453–460: POST a URL de configuración por navegador | Es necesario identificar cada URL efectiva sin extraer su token y revisar backend antes de llamarla |
| saveDB | líneas 383–393: puede enviar toda DB | El cierre no puede cubrir solo addSale |
| syncRemote / flushOutbox | líneas 511–531 y 607–613: envío/reintento automático | Pausar UI no detiene todos los envíos; revisar solicitudes en vuelo |
| upsertItem(s), deleteItem(s) | líneas 2382–2390: variantes según versión | Incluir todos los verbos y versiones activas al cerrar escritor |
| Cola local | líneas 469–478: casa_vieja_outbox y casa_vieja_failed_ops en localStorage | Revisar ambas por equipo/perfil/origen, con autorización individual; no suponer que son IndexedDB V4 |

Hallazgo alto confirmado en frontend: hasPendingSync y el aviso Guardado en Sheets solo consideran outbox/flushing; failedOps puede contener operaciones apartadas después de ocho intentos no transitorios. Un aviso verde no acredita continuidad comercial cerrada. No se leyó ninguna cola real.

Riesgo alto dependiente del backend: el id de la cola no se envía como operationId en el sobre común apiPost; no certificamos idempotencia o recuperación de respuesta perdida sin revisar el Script productivo. Esto no prueba por sí solo que se hayan duplicado ventas.

El frontend no fija una URL de Apps Script en el código inspeccionado: se obtiene de la configuración local. Por eso todavía no conocemos el proyecto/versión realmente utilizados por cada equipo. No se leyó cv_script_token ni ninguna credencial.

Pendiente con autorización separada: proyecto Apps Script productivo exacto, despliegues/activadores, permisos de edición directa en Sheets, integraciones confirmadas y cada dispositivo. No hay cierre técnico del escritor antiguo ni GO.
