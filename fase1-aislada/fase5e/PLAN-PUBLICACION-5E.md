# Publicación propuesta — solo laboratorio autorizado

Estado: PENDIENTE DE AUTORIZACIÓN ESPECÍFICA. Este archivo no ejecuta acciones.

## Destinos exactos

1. Commit con los archivos enumerados en release-manifest.json, rama dev/fase1-estabilizacion del repositorio Sebastian061322/casa-vieja, mediante actualización condicionada al HEAD real. Preservar avances concurrentes; no escribir main ni archivos comerciales.
2. Actualizar código/versión del Worker existente casa-vieja-lab-auth, manteniendo URL casa-vieja-lab-auth.portopelaez1009.workers.dev, plan Free, los mismos secretos, origen y cliente Google.
3. Guardar candidato y actualizar la implementación existente de CasaVieja_AUTH_TEST_ONLY_5D, mismo Script autorizado y misma hoja sintética. Mantener firma HMAC, ejecución por propietario y acceso de red Cualquiera ya autorizados; sin funciones de mantenimiento nuevas y sin ampliar OAuth.

No crear recursos, cuentas, scopes, claves, bindings, tareas automáticas, facturación ni servicios adicionales. No modificar Apps Script comercial, BaseDatos_CasaVieja, main ni anuncios. Una restauración Google 5E necesita su propio plan concreto de destino no destructivo; no se incluye como escritura ciega en esta aprobación.

## Comportamiento que cambia

Se conserva la misma base IndexedDB/origen/epoch. Nuevas intenciones añaden índice de deduplicación; comandos existentes mantienen contenido e ID. Gerencia deja de persistir únicamente snapshot y uxHome5a2, que son cachés reconstruibles. Borradores, colas, recibos y rechazos archivados se conservan. Tras recargar sin red un gerente puede necesitar conexión para recuperar catálogo/reportes; no se promete operación offline nueva si no hay catálogo en memoria.

Se añade telemetría sanitaria por ID aleatorio, acción enumerada y duraciones. La consulta autorizada puede registrar tiempos en los proveedores; no registra Gmail, nombres de clientes, tokens, secretos ni payloads. El índice de reportes se limita a la petición actual.

El modo ?recovery=5e permite armar explícitamente una respuesta retenida por Worker solo para REGISTER_SALE con TEST_ONLY_5E_ y epoch sintético. Después de COMMITTED devuelve 503 sin entregar el recibo; el pendiente se recupera por status. Esto produce intencionalmente un error temporal para el ensayo. No cambiar el escritor ni aplicar este código a un sistema comercial.

## Revisión y comprobación

Antes de escribir, releer HEAD, proyecto/implementación, ID de hoja y condiciones del plan. Revisar hashes de Candidate.gs y worker-bundle.mjs contra release-manifest.json. Conservar identificador de versión anterior antes de actualizar. Las fuentes y pruebas están listas localmente; no hay commit nuevo publicado.

Después, verificar tres activos públicos por hash, rechazos sin identidad, acceso por los tres perfiles, ausencia de RPC de mantenimiento, recuperación del pendiente y una sola reserva. La participación física en iPhone se solicita con pasos concretos. Pruebas Node/locales no reemplazan Google ni un segundo equipo real.

## Riesgos y reversión

Riesgos específicos: defecto en el nuevo índice de intentos, error en minimización de caché, coste de telemetría o una prueba de respuesta retenida que quede pendiente. Los tests y el guardia de protocolo reducen esos riesgos, pero la validación real sigue siendo obligatoria.

Si aparece un error, detener nuevas operaciones de laboratorio, preservar y revisar sus pendientes, guardar evidencia y volver a la versión anterior del Worker (referencia 4c2cd709) y del Apps Script identificada antes del cambio. No borrar IndexedDB ni revertir registros de negocio. La reversión de código no deshace ventas confirmadas. Recuperar cada cola antes de autorizar nuevas altas después de una reversión. La corrección de Git se hace por un commit posterior, sin forzar historial ni cambiar main.
