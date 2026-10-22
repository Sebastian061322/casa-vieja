# Contrato publicitario para 5F — sintético, sin automatización

## Comprobación de origen

Se consultó Windsor en modo lectura. La cuenta conocida y la campaña solicitada existen; se verificaron sus identificadores, moneda PEN y zona America/Lima. Los identificadores y la respuesta privada están en evidencia-local/windsor-context.json, excluidos de Git. Ningún ID real alimentó las pruebas del contrato y no se consultaron clientes ni se cambiaron campañas/presupuestos.

El perfil actual de Windsor devuelve plan_id=TRIAL, plan_name=Trial, is_paid=false. Esto no acredita un plan gratuito permanente ni autoriza activar destinos. La documentación pública describe Free con un usuario, una fuente, una cuenta y ventana histórica de 30 días; las capacidades adicionales de Trial no justifican dependencia operativa. Antes de automatizar, verificar plan efectivo, frecuencia, número de destinos, históricos y permisos de la cuenta, sin pagos ni tarjetas.

Fuentes: https://windsor.ai/pricing/ ; https://windsor.ai/documentation/how-to-start-for-free ; https://windsor.ai/answers/ . Consultadas durante 5E. No se creó un task, webhook, destino o campo personalizado.

## Tablas propuestas, aún no creadas

- AdsRaw5F: observaciones append-only con batchId, provider, sourceDate, sourceTimezone, moneda, cuenta/campaña/conjunto/anuncio, grain, breakdown, attributionWindow, definición de resultado, métricas, observedAt, hash y querySpecVersion.
- AdsSync5F: runId, querySpecHash, intervalo, estado STARTED/COMPLETE/FAILED, cursor, hashes, watermark y error fijo. Un fallo no avanza watermark.
- AdsDaily5F: proyección reconstruible de la observación más reciente por clave, nunca sumando versiones antiguas y nuevas del mismo dato. El diario crudo conserva correcciones retrospectivas.
- CommercialAttribution5F: vínculos append-only a saleId, método UTM/ID/evidencia, VERIFIED/ESTIMATED, cuenta/campaña, modelo/versiones y referencia de evidencia. No modificar ventas históricas para añadirles atribución.

Claves: cuenta+campaña+conjunto+anuncio+fecha de origen+zona+moneda+grain+breakdown+ventana+definición de métrica. ID de observación agrega observedAt y hash. Reimportar lo mismo no duplica; una revisión retroactiva agrega otra observación. Mantener una ventana de relectura limitada por el plan. Los estados de sincronización y agregaciones todavía son diseño, sin importador remoto.

## Métricas y atribución

Campos Windsor comprobados: date, account_id, account_currency, account_timezone, campaign_id, adset_id, ad_id, spend, impressions, reach, clicks y actions_onsite_conversion_messaging_conversation_started_7d. Esta última representa conversaciones iniciadas tras al menos siete días de inactividad, no ventas ni necesariamente clientes nuevos. Guardar su definición exacta junto a cada dato. El campo de costo por conversación tiene una descripción diferente en el catálogo: calcular spend/conversations sobre la misma definición y ventana, sin sustituir denominadores silenciosamente.

Dinero en céntimos y moneda explícita; no mezclar PEN/USD sin una conversión aprobada y trazable. Alcance no se suma entre anuncios o días como personas únicas. No sumar distintos granos, breakdowns o ventanas de atribución. Un agregado diario de otra zona no se puede redistribuir exactamente a Lima sin datos horarios: conservar sourceDate/sourceTimezone y marcar conversión pendiente. Con America/Lima las fechas coinciden.

Separar pedidos registrados, reservas, ingresos por despachos y cobros. La prueba de rentabilidad del contrato solo usa ventas despachadas/entregadas con vínculo VERIFIED y evidencia; es una convención sintética coherente con el reconocimiento actual, no una política nueva aprobada. ESTIMATED se presenta aparte. Conversaciones no generan ventas, ingresos ni ROAS comerciales. ROAS=ingreso atribuible/gasto; resultado después de publicidad=ingreso−costo histórico vendido−envío−otros gastos−publicidad; retorno después de costos=resultado/gasto. Si gasto o evidencia no permiten calcular, mostrar nulo o insuficiente, no cifras inventadas.

ads-contract.cjs y tests/contracts.test.cjs comprueban idempotencia, revisión retroactiva, zonas, monedas, ausencia de ventas inferidas y rechazo de vínculos duplicados. No contienen tokens, conectores ni escrituras contables. GO para continuar diseño sintético; NO-GO para integrar datos reales automáticamente hasta cerrar 5E y confirmar condiciones S/0.
