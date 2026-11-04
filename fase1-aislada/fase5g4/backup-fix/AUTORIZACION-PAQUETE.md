# Respaldo sintético — corrección y validación remota propuesta

31/10/2026. Candidato LOCAL, no publicado ni desplegado. Costo S/0.

## Incidencia observada

En el laboratorio engine5g4, Administrador principal, al preparar el respaldo aparece BACKUP_HASH_MISMATCH y no se crean enlaces de descarga. Se detuvo la custodia: no existe evidencia de un archivo descargable válido en ese intento. No atribuirlo a un error del propietario ni declarar la custodia aprobada.

El exportador Apps Script usa el adaptador genérico CV52Crypto sin charset explícito; el verificador Web Crypto calcula UTF8. Un modelo local con distinta codificación predeterminada reproduce exactamente ese rechazo. La causa concreta en Google todavía no está aislada: la corrección debe aceptarse remotamente, no darse por probada por ese modelo.

## Paquete concreto

Backend candidato SHA256 203e16feb5dffb5360fa2eee96d07d931efd8480ab4416a67dd30be655a306d5.
Base activa: Apps Script6 SHA256 bd4e253c9092654511935b441ff9d513b849e12d5017daf5bf62e9ca86f74f56.
Worker c82dd835 / SHA766f8682deacc69de92a053462be2b10532aafa5b9ce6deda0c2af081697eecf permanece intacto.

Añade un adaptador privado de SHA256 UTF8 exclusivo del empaquetador de respaldos CV54Backup. Conserva CV52Crypto y las huellas de apertura, diario, idempotencia y políticas. No deshabilita ni reemplaza la comparación de integridad del navegador. No cambia esquema de archivo, cifrado AES256GCM, ACL, HMAC, origen, identidad o endpoints públicos.

Se solicita publicar únicamente backup-fix y su evidencia saneada en dev/fase1-estabilizacion; guardar el candidato y actualizar la MISMA implementación de CasaVieja_AUTH_TEST_ONLY_5D a nueva versión; actualizar solo CV_5G4_BACKEND_SHA256 al hash indicado. Sin cambios de Worker, otras propiedades, permisos, secretos, cuentas, hojas o datos. Sin recursos nuevos, pagos, producción, DR ni corte.

## Verificación antes y después

Pruebas dirigidas: snapshot compilado y transporte JSON; modelo de codificación; preservación del adaptador histórico y ausencia de RPC nuevas; acceso denegado a gerente/vendedor y firma falsificada; cifrado/descifrado e integridad; restauración interrumpida, reanudada y repetida sin duplicar. Suite completa:651/651 aprobadas,83archivos, tests/regression.json. Primer intento650/651 por puerto loopback bloqueado por el entorno (EPERM); repetición con permiso local651/651. No equivale a aceptación Google o física.

Antes del despliegue, confirmar cero pendientes en los contextos usados del laboratorio. Después, verificar código/hashes/versiones y rechazos de acceso; preparar un respaldo con la misma cuenta administradora. El navegador debe verificarlo y mostrar archivos/cantidades. Si persiste el error, detener la custodia y solicitar diagnóstico mínimo sin publicar contenido ni claves. No recomputar ni sustituir hashes para forzar aceptación.

Custodia: propietario descarga archivo cifrado y hash al teléfono, conserva clave por separado; no comparte clave ni archivo por chat. Recuperación física solo se acredita después de verificar su archivo y referencia. Ninguna restauración sobre el laboratorio vivo o producción.

## Riesgos y reversión

Error del candidato o persistencia de la causa remota; el exportador queda bloqueado y la custodia pendiente. Regresar solo al backend6/hash anterior, conservando todos los diarios, movimientos, colas y archivos; el backend anterior mantiene el fallo de exportación conocido. No restaurar copias antiguas ni borrar datos. La fase completa y producción siguen NO-GO.

La Etapa E de Fase5G.4 exige «Antes de realizar cualquier cambio remoto, solicita aprobación específica sobre ese paquete completo». Las aprobaciones anteriores no cubren este hash. No publicar ni desplegar sin respuesta afirmativa específica.
