# Ensayo de restauración 5E — autorizado y ejecutado

Estado al 22/10/2026: propietario autorizó; cuatro pestañas creadas, interrupción/reanudación comprobada, hashes y reconstrucción aprobados, marca VERIFIED anexada y repetición con cero filas a escribir. Evidencia: tests/restauracion-google-5e.json. Lo siguiente conserva el procedimiento propuesto y ejecutado.

Destino existente: CasaVieja_RECUPERACION_TEST_ONLY_5B, ID 1zB8s5MZN-LGMpnHL3RkOvA802WVfPOPEkRgXmygNk0o. Se verificó por metadata y Control!B3=TEST_ONLY. Las pestañas Control, DiarioInventarioV3 y MovimientosInventarioV3 contienen pruebas anteriores y se conservarán sin editar.

## Escrituras propuestas

Crear exclusivamente cuatro pestañas dentro del mismo archivo, prefijo TEST_ONLY_5E_20261022_: ARCHIVE (39 filas), JOURNAL (26 filas), EFFECTS (21 filas), CONTROL (cinco filas iniciales y una marca final VERIFIED). No crear archivo, proyecto, servicio, cuenta, despliegue, permiso ni facturación.

Fuente: fixture enteramente sintético de 5E, 25 registros del diario, 20 movimientos, configuración ficticia y cola ficticia con un PREPARED parcial; código del paquete de laboratorio desplegado 4c2a04c5 más herramientas locales de recuperación. No es una copia de clientes ni de inventario productivo. SHA256 esperado independiente: b05b5de02ddddeadd342b5291849ee7796362b8ec40194fa04798567079d79e2. El archivo completo y las celdas preparadas están excluidos de Git en evidencia-local. El catálogo público no reemplaza una custodia independiente para operación comercial.

1. Releer metadata y Control!B3. Si cualquiera de los nombres propuestos ya existe con contenido distinto, detener sin escribir ni borrar.
2. Crear solo las cuatro pestañas ausentes. Escribir RAW, sin fórmulas: journal/effects JSON y archivo base64 fragmentado. Guardar solo un primer prefijo de ARCHIVE y detener intencionalmente el ensayo en estado INCOMPLETE.
3. Releer todas las tablas. missingRows verifica todos los prefijos antes de preparar cualquier escritura; una divergencia impide continuar. Reanudar escribiendo exclusivamente los fragmentos ausentes.
4. Releer las cuatro tablas completas. decode valida orden, cantidad y hash de fragmentos, archivo íntegro, código, configuración y correspondencia exacta del diario y movimientos materializados. Reconstruir inventario con el motor local a partir de los registros realmente releídos de Google.
5. Solo tras esa verificación, añadir CONTROL!A6:B6=['VERIFIED', hash esperado]. Releer la marca. Repetir la planificación y verificar cero filas pendientes de escritura. No reescribir filas existentes ni simular aprobación de cuentas.
6. Registrar duración de lectura/escritura y reconstrucción por separado. No llamarlo RTO integral: no restaura cuentas, OAuth, HMAC, despliegues ni colas reales de equipos. No conectar la aplicación comercial o el endpoint público a esta hoja.

Las comprobaciones locales cubren fragmentos incompletos/alterados/repetidos, referencias divergentes, restricción de destino, lectura del diario, reanudación y marca terminal única. Regresión total: 434 aprobadas. Los recursos remotos no han recibido estas escrituras.

## Riesgo, interrupción y reversión

Una interrupción puede dejar pestañas parciales, reconocidas como INCOMPLETE; no se usan como respaldo verificado. Se conservan para reanudar, sin borrar pruebas. Un conflicto detiene el ensayo. No hay escritor concurrente autorizado en estas pestañas de recuperación; esto es mantenimiento exclusivo de laboratorio, no un sustituto de ScriptLock del flujo de ventas.

Para revertir basta detener el ensayo y conservar las pestañas como evidencia; no eliminar datos ni restaurar versiones viejas sobre registros posteriores. Ningún código público recibe funciones de mantenimiento. Publicar las herramientas y evidencia en dev/fase1-estabilizacion no requiere actualizar Worker o Apps Script, cuyos hashes deben permanecer iguales.
