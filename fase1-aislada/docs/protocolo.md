# Protocolo futuro — especificación para integración

## Frontera de datos

Legado inmutable: todas las pestañas existentes, incluso Config, Productos y Lotes. Ni siquiera las lecturas llaman a funciones antiguas con migraciones. Futuro: almacén nuevo con apertura aprobada, Operaciones, DetallesVenta, EventosInventario, Reservas y proyecciones reconstruibles. No añadir pestañas en BaseDatos_CasaVieja. No usar clearContents, upsert de histórico, delete, saveDB, ni conciliación con escrituras. Los saldos futuros derivan solo de apertura y eventos futuros confirmados.

## Sobre del comando

operationId estable desde la persistencia local, schemaVersion, epoch del corte, commandType, entityId, deviceId, actor autenticado por servidor, expectedVersion y payload. Hash canónico del contenido incluye destino/epoch. No confiar en actor, profit, costo ni saldo enviados por navegador. Identidad de usuario y permisos deben verificarse en servidor; un secreto dentro del HTML no autentica a cada operador. No se eligió todavía proveedor de autenticación.

Reintento idéntico devuelve resultado original aunque expectedVersion sea antiguo. operationId igual con hash distinto produce conflicto. Consultar estado ante timeout, luego reenviar mismo comando. Un rechazo de versión conserva comando y pide revalidar; crear un comando nuevo requiere resolución explícita, no mutar el anterior. Respuesta: operationId, epoch, state y revisión; solo COMMITTED significa confirmado. Colas separadas por destino y cuenta; datos de cliente fuera de logs.

## Persistencia Apps Script propuesta

1. Validar autenticación, autorización y destino; adquirir bloqueo del escritor. Todos los comandos deben usar el mismo dominio de bloqueo. Lecturas puras sin migración.
2. Buscar operationId durable. Recuperar PREPARED previo antes de aceptar comandos posteriores incompatibles.
3. Validar versión, referencias, lotes/familias, cantidades, estados y disponibilidad con proyección de solo commits.
4. Persistir PREPARED con hash y plan inmutable validado. Si falla el acuse del append, releer antes de reintentar. Rechazar duplicados conflictivos.
5. Persistir efectos con IDs deterministas operationId/índice, verificar contenido exacto y completitud; nunca aplicar deltas independientes a saldos definitivos. Si el plan cabe en un registro, ese registro puede contener el efecto completo. Si no cabe, fragmentos con manifiesto/hash y validación antes de COMMITTED.
6. Persistir COMMITTED con revisión monótona únicamente tras verificar efectos. Lectores excluyen PREPARED y fragmentos sin commit. Un timeout después del commit no duplica nada.
7. Proyecciones derivadas, no autoridad; retraso de proyección debe verse como pendiente. Reconstruir desde apertura y commits reemplazando solo proyecciones FUTURAS, nunca sumando deltas por segunda vez.
8. Lectura consistente: capturar revisión al inicio y al final; reintentar o devolver snapshot de revisión fija. No permitir efectos de otra revisión mezclados. Cada fallo parcial se prueba en adaptador real.

LockService no aporta atomicidad entre pestañas. La garantía propuesta es visibilidad lógica y recuperación, condicionada al adaptador y control de todos los escritores. El modelo local usa un plan embebido PREPARED y un marcador COMMITTED en memoria; no implementa los fragmentos, los límites de celda, el bloqueo real, el almacenamiento Sheets ni su autenticación.

## Reglas comerciales futuras

- Venta/pedido crea reserva; stock físico no cambia. Disponible considera todas las reservas.
- Despacho consume físico y libera reserva en la misma operación lógica. Pago/entrega no consumen otra vez.
- Cancelación antes del despacho libera reserva, conserva documento y componentes. Después del despacho requiere devolución física explícita, recepción/condición y autorización; no restaurar por eliminar venta.
- Combo conserva por línea recurso/base/producto, lote, familia, molienda, gramos, cantidad, costo unitario y costo total en céntimos. Costo total suma cantidades por costo snapshot. Contacto no recalcula margen ni costos.
- Preparación consume gramos e insumos y genera bolsas por lote; merma explícita, sin crear café. Recepción registra ingreso una vez por documento y lote, no confundir producción histórica con saldo.
- Cambios de estado de lote se registran en el espacio futuro. Bloquear nueva reserva de lote inactivo; no reasignar reservas previas silenciosamente.
- Correcciones futuras serán eventos compensatorios vinculados y autorizados. Ningún comando del protocolo opera sobre entidad histórica.

Implementado en demo: reserva, despacho, cancelación previa a despacho, edición de contacto, pago, snapshot de costo y reglas de sincronización. Pendientes: recepción, preparación, devoluciones, activación de lotes, costes desconocidos, traducción de pedidos de legado, autorización por rol y adaptadores durables.
