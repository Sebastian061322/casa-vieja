# Diagnóstico correlacionado de lectura — propuesta concreta

Estado: preparado y probado localmente; no publicado ni guardado en Apps Script. No es otra modificación de estimación visual. Resuelve la recogida pendiente de tiempos por etapa sin vincular proyectos Cloud, ampliar OAuth ni crear recursos.

## Evidencia y motivo

El panel de ejecuciones muestra duraciones totales, pero seleccionar/abrir la fila no expuso el detalle de console.log mediante la automatización. No se ha establecido la causa ni se atribuye a una avería confirmada de Google. La documentación oficial explica la diferencia entre registro ligero, visor simplificado y acceso completo mediante proyecto Cloud estándar: https://developers.google.com/apps-script/guides/logging . No cambiar la asociación del Script ni permisos para eludir esta limitación.

## Cambio mínimo propuesto

- Reutilizar exclusivamente snapshot con format=ui5d y metricsProbe=true, una petición firmada normal.
- Resolver identidad y perfil desde configuración privada bajo ScriptLock, conservar consumo de nonce y bloqueo de repeticiones. Solo administrador; vendedor y gerente reciben PERMISSION_DENIED incluso si declaran role=administrator.
- La respuesta de lectura administrativa explícita añade diagnostics5e: traceId aleatorio y duraciones numéricas. El Worker adjunta sus duraciones con el mismo traceId. No se añade un RPC público ni acceso a mantenimiento.
- El frontend muestra el ensayo únicamente con validation=5d&performance=5e y perfil administrador. Tres muestras secuenciales. No guarda snapshots, reportes, tokens, identidad ni métricas en IndexedDB.
- No tocar comandos, recibos, huellas de idempotencia, efectos, saldos, costos o reglas comerciales. La petición normal permanece sin diagnostics5e.
- Cero escrituras de negocio. Las peticiones siguen consumiendo su nonce de seguridad en las propiedades del Script como antes; no se promete ausencia de esas escrituras técnicas existentes.

## Pruebas terminadas antes de solicitar autorización

450 pruebas locales aprobadas. Nuevas comprobaciones: diagnóstico administrativo explícito sin modificaciones del diario, denegación y rechazo de repetición para gerente/vendedor, correlación Worker/backend sin información personal. La UI completa ejecutó tres lecturas a través del Worker real de código, con Google Identity y Sheets simulados en localhost; la evidencia se etiqueta actualGoogle=false y no se presenta como rendimiento de los proveedores.

## Paquetes y destinos de la autorización solicitada

Fuente de desarrollo sobre 1a588bc72b32ba5dd4a11663fc47569b3df8cee2.

Worker candidato SHA256 e7abb4227aac185f93ae30d1f6c68dd79b1a727cda56bea92d28fa06b156cd85. Actualizar solo casa-vieja-lab-auth.

Backend candidato SHA256 d0e635dd759d25e2cdb72e67a624d84b9b977c2a8eb6924c23f2d94b4d149c7c. Guardar y crear versión nueva del mismo CasaVieja_AUTH_TEST_ONLY_5D, mismo endpoint firmado, ejecutar como propietario, mismo acceso de red Cualquiera. La guarda sigue admitiendo únicamente el ID sintético autorizado. No cambiar permisos ni secretos.

Riesgos: error del paquete, mayor volumen de peticiones de lectura o diagnóstico visible indebidamente. Controles: denegación backend probada, modo explícito, solo tres muestras por pulsación, lista fija de métricas sin payload ni usuarios y comprobación de integridad antes/después. No extrapolar tres muestras a disponibilidad o percentiles estables.

Reversión: Worker 9a3a6e2b y versión 2 del mismo Apps Script, conservando todos los registros, borradores y colas. Copias locales de código actual conservadas fuera del repositorio; ningún secreto forma parte de ellas.

## Medición real posterior a aprobación

Verificar primero que las tres muestras devuelvan el mismo traceId entre Worker y backend, revisión del diario estable y sheetWriteMs=0. Recoger nuevos bloques solo si hace falta suficiente muestra y no hay operaciones pendientes en prueba. Identificar duración de autenticación, firma, HTTP hacia Apps Script, parsing, espera de lock, lock sostenido, lecturas, reconstrucción y reportes.

Las categorías se solapan: lockHeldMs incluye lectura/reconstrucción; backendMs del Worker incluye transporte/plataforma además de totalMs del código Apps Script. browserWithBootstrapMs incluye la revalidación de sesión por bootstrap, la solicitud y la red; no es una medición aislada de UI ni se debe sumar a las otras categorías. Una lectura no mide escritura o despacho; sus contadores de escritura cero no prueban latencia de escrituras.

No se activa producción ni Fase 6. Este diagnóstico tampoco sustituye las pruebas físicas de reinicio, UX y continuidad pendientes ni el simulacro integral de recuperación de infraestructura.
