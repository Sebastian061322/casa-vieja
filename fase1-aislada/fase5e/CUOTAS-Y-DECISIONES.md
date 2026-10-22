# Cuotas y decisiones pendientes

## Disponibilidad y costes

Se mantiene el diseño S/0: Worker Free, Apps Script y Sheets ya autorizados, sin KV/D1 ni nuevos recursos. Las condiciones efectivas de cuenta se revisan nuevamente antes de publicar; no se habilitó facturación. Documentación consultada: https://developers.cloudflare.com/workers/platform/pricing/ ; https://developers.cloudflare.com/workers/platform/limits/ ; https://developers.google.com/apps-script/guides/services/quotas .

La documentación de Workers Free indica límite diario de solicitudes y CPU por invocación; la página de precios cita 100000/día y 10 ms CPU. Revisar los límites efectivos del panel al medir y no confundir espera de red con CPU. Apps Script publica límites por usuario/script y errores al excederlos; ejecutar como propietario concentra cuotas en esa identidad. ScriptLock y sus 30 segundos de espera pueden generar demora o fallo aunque haya pocas ventas.

Estimación, no medición: tres pestañas visibles durante ocho horas, polling cada 30 s, suponen 2880 ciclos. Una consulta que revalida bootstrap y después snapshot produce hasta 5760 llamadas Worker/Apps Script, antes de paneles, ventas, activos, reintentos y tráfico externo. No son las horas reales del negocio ni consumo observado. Ocultar pestaña o desconectar ya pausa polling. Medir antes de cambiar frecuencia.

No afirmar disponibilidad ilimitada ni pérdida cero. Un 503, timeout o caída de proveedor conserva pendiente y exige consultar estado original. El endpoint HMAC público sigue expuesto a agotamiento de cuotas por tráfico externo; la firma no elimina ese riesgo. No se instalaron servicios pagos de protección.

## Reglas que el propietario debe decidir

| Área | Decisión necesaria | Consecuencia |
|---|---|---|
| Cobro y despacho | Condiciones para despachar con deuda, responsables y evidencia | No asumir autorización de crédito por aparecer un pedido reservado |
| Descuentos | Límites por perfil, vigencia y aprobación | Mantener autorización backend y valores históricos |
| Cancelación | Estados permitidos y tratamiento del anticipo | Liberar reserva no prueba un reembolso |
| Preparación | Recetas por gramaje, insumos, merma y café ya molido a granel | No consumir empaques extra ni mezclar lotes por una regla inferida |
| Devoluciones | Apta, dañada, cuarentena y quién libera | No reingresar producto no inspeccionado como vendible |
| Lotes | Activo, bloqueado, agotado, cerrado y responsables | Definir disponibilidad sin alterar la historia de movimientos |
| Conteos/ajustes | Acta de conteo, doble revisión y aprobación | Diferencias son propuestas, no ajustes automáticos |
| Fondo | Aportes/retiros/distribución y evidencia | No confundir efectivo con utilidad distribuible |
| Respaldos | Custodia, destino independiente, 30 diarios/12 mensuales, RPO/RTO | No activar tareas ni borrar copias sin aprobación y capacidad |
| Privacidad | Equipo/perfil protegido por persona y acceso del sistema operativo | La caché minimizada no cifra comandos ni protege perfiles abiertos |

Las propuestas no se consideran reglas aprobadas. Versionar cualquier aprobación futura y fijar la versión en cada nueva operación; nunca recalcular operaciones anteriores. Continúan las pruebas sintéticas independientes de estas decisiones.
