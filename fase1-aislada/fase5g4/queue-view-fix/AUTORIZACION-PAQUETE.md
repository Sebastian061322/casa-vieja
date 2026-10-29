# Listado de cola tras rechazos anteriores — paquete exacto

29/10/2026. Preparado localmente; sin aprobación/publicación todavía. Costo S/0.

## Qué se solicita

Publicar queue-view-fix y evidencias saneadas de esta continuación en dev/fase1-estabilizacion. Actualizar exclusivamente Worker casa-vieja-lab-auth y la propiedad no secreta CV_5G4_WORKER_SHA256 del AUTH existente. Sin edición o nueva implementación de Apps Script. Conservar backend6/hashbd4e253c, cuentas, permisos, secretos, acta, diario, movimientos, comandos, borradores, recibos y rechazos. Sin recursos nuevos, facturación, producción, DR o corte.

Worker candidato SHA256 `766f8682deacc69de92a053462be2b10532aafa5b9ce6deda0c2af081697eecf`.

## Hallazgo concreto

La versión bc323432/cf780ac2 ya corrige el aviso superior. En Google apareció otro caso: al existir un rechazo archivado, un render anterior sobrescribe el listado del rechazo nuevo; el encabezado muestra correctamente REJECTED, pero el listado inferior queda con el archivo anterior y falta el botón para revisar el nuevo. Sincronizar una segunda vez recupera el listado; se confirmó y archivó el rechazo real con evidencia, sin consumo de inventario.

El ajuste renderiza el listado completo desde la lectura actual de la cola después de sincronizar. Activos PENDING o REJECTED tienen prioridad sobre archivos anteriores; solo una cola vacía muestra la leyenda de archivos conservados. No escribe ni transforma almacenamiento. Metadatos y atributos se escapan; no añade datos personales o financieros. Reutiliza la sincronización compartida del ajuste anterior.

## Evidencia

645/645 pruebas locales,82archivos; tests/regression.json. Cinco pruebas nuevas: rechazo nuevo con archivo previo, pendiente con archivo previo, archivo/cola vacía, escape/privacidad y comparación de paquete. Fuente de API idéntica; solo dos recursos de interfaz modificados (/entry.mjs y /approved-app.js).

Recorrido navegador/IndexedDB local8803 con código compilado exacto: primer rechazo→archivar→segundo rechazo mientras existe el primero→botón presente sin otra sincronización→archivar segundo→cero pendientes y dos evidencias conservadas. No se presenta como aceptación Google del paquete nuevo. Captura tests/rejection-with-history-local.png.

## Verificación y reversión

Preflight: PC sin pendientes y dos rechazos archivados observados; iPhone conservó pedidos tras actualización previa, sin nuevas altas. Comprobar estado antes de desplegar. Verificar hash/versión/archivos y rechazos públicos. Actualizar solo la propiedad CV mencionada, sin abrir valores ZERO. Comprobar una nueva operación ficticia de stock insuficiente si se necesita, dentro del tope40 original (13confirmadas+2rechazadas utilizadas), verificar cero efectos y botón de archivo visible sin sincronización extra. Conservar todos los recibos; no repetir acta ni pedidos existentes.

Riesgo: error visual. Ante fallo detener altas y conservar registros; volver únicamente a Workerbc323432 y hashcf780ac2 en la propiedad, sin restaurar datos o borrar colas. La base mantiene el defecto conocido y no acredita cierre de aceptación. Sin cambio de backend o de datos comerciales.

La EtapaE exige aprobación específica antes de cambios remotos; las aprobaciones anteriores no cubren este hash.
