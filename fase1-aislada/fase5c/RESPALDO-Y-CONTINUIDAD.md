# Respaldo y continuidad 5C

## Alcance real

El archivo CV_COMPLETE_5C contiene diez tablas sintéticas, configuración sin secretos, código fuente con versión y hashes, y tres exportaciones de navegador de laboratorio. Estas exportaciones son de localhost, no de los dispositivos comerciales ni del frontend Google. Nunca se deben reenviar a Google por compartir un epoch. Su procedencia forma parte de la evidencia.

La copia se guarda comprimida y fragmentada en Control!D:F de la hoja de recuperación TEST_ONLY ya autorizada, independiente del archivo fuente. Se conserva cada intento. No sustituye un archivo independiente fuera de la cuenta Google: falta aprobar destino, custodia, retención y automatización. No hay programador automático habilitado.

El verificador local exige un hash esperado y una versión esperada de un catálogo independiente. Un checksum dentro del mismo archivo detecta corrupción accidental pero no acredita autenticidad. Guardar el catálogo de hashes separado, con acceso restringido y revisión del administrador. No publicar copias de clientes ni secretos en GitHub. El laboratorio contiene exclusivamente datos ficticios.

## Recuperación reproducible

1. Conservar el archivo y el catálogo independiente; comparar SHA256 y versión antes de abrir un destino.
2. Verificar cada tabla, código y metadato con backup.cjs. No aceptar firmas o hashes recalculados por el mismo archivo desconocido.
3. Restaurar exclusivamente a destino TEST_ONLY separado. Si está vacío, reconstruir diarios/efectos; si tiene el mismo prefijo, anexar solo el sufijo faltante. Si difiere, detener sin sobrescribir.
4. Reconstruir estado y comparar operaciones, reservas, consumos, costos históricos y recibos por sus IDs. No reejecutar ventas para recrear el saldo.
5. Consultar operaciones pendientes en su motor original; una confirmación perdida se recupera como recibo original, nunca como venta nueva.
6. Verificar que repetir la restauración no añade movimientos. Comparar también los registros fuente antes/después.

Los secretos, claves, permisos OAuth, identidades reales y despliegues no son exportados. Se recuperan mediante un procedimiento de custodia independiente todavía por aprobar. Tener el código respaldado no concede esos accesos.

## Colas por versión

| Base conocida | Motor | Epoch |
|---|---|---|
| cv-sales-sandbox-v2-owner | V2 | TEST_ONLY_V2 |
| cv-inventory-sandbox-v3-owner | V3 | TEST_ONLY_V3 |
| cv-commercial-sandbox-v4-owner | V4 | TEST_ONLY_V3 |
| cv-commercial-sandbox-v5a-owner | V4 | TEST_ONLY_V3 |

IndexedDB usa versión 1, almacén state, clave current. El comando comercial usa schemaVersion 2. Las nuevas bases separan sujetos autenticados. No confundir versión de base, protocolo y epoch.

El guardia examina bases existentes en modo lectura, no crea una base faltante, conserva comandos y recibos y bloquea altas ante colas anteriores incompatibles o bases no inspeccionables. La cola compatible puede sincronizarse para recuperar sus recibos. UNKNOWN/PREPARED no son ventas ausentes. REJECTED requiere revisión conservando evidencia. No se convierten V2/V3 a V4 automáticamente.

Cada origen web, perfil y dispositivo tiene almacenamiento independiente. Enumerar localhost no acredita script.google.com, googleusercontent.com ni Safari de otro equipo. El guardia exige un acta externa de otros orígenes: por defecto falta y el alta permanece bloqueada. El fixture que la simula sirve solo para pruebas locales privadas.

## RPO y RTO

RPO medible: última revisión y hora contenidas en la copia. Operaciones confirmadas después de ella no están cubiertas; comandos pendientes solo están cubiertos si el dispositivo fue exportado. Una cola guardada solo en un equipo perdido puede perderse si no hubo confirmación del servidor. No se promete pérdida cero.

RTO medido en Google cubre lectura, compresión, escritura y reconstrucción sintética. No incluye recuperar cuentas, credenciales, permisos, DNS, despliegue ni validar un corte comercial. Esos pasos y una política de frecuencia deben aprobarse y ensayarse antes de activación. Ninguna restauración debe sobrescribir producción con una copia antigua.

Nota de implementación: el restaurador de archivo backup.cjs acepta destino vacío o copia exactamente idéntica. La anexión de sufijo de diarios la ejecuta solo el helper sintético de Google tras comprobar el prefijo; no es una estrategia automática de mezcla entre bases divergentes. La recuperación completa de aplicación, accesos y despliegue aún no fue ensayada.
