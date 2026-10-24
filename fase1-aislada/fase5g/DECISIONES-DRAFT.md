# Decisiones operativas — DRAFT, no son aprobaciones

Confirmado: tres Gmail individuales; administrador principal, gerente operativo y vendedor; equipos/perfiles separados; infraestructura adicional S/0; objetivo 01/11 condicionado a GO. No volver a presentar esas decisiones como desconocidas.

| Tema | Propuesta para decidir | Estado / comportamiento candidato |
|---|---|---|
| Cobros | Gerentes registran monto, medio y referencia solo tras verificar evidencia; parciales admitidos; vendedor no confirma. | Perfiles confirmados; procedimiento de evidencia DRAFT. Sin habilitar pasarela o método de cobro nuevo. |
| Despacho/entrega | Gerentes confirman salida física; entrega no descuenta de nuevo. Definir si despacho exige pago total, anticipo o autorización de crédito. | Descuento físico al despachar probado; regla de crédito DRAFT, no imponer pago total sin decisión. |
| Envíos y catálogo de noviembre | Precios y tarifas por zona aprobados/versionados con vigencia; sin envío gratis implícito. | El catálogo del fixture vence en octubre y «Zona ficticia» no sirve para clientes reales. Son bloqueos de configuración; no extenderlos automáticamente. |
| Cancelación | Antes de despacho, con motivo y aprobación gerencial; anticipo queda como obligación de reembolso, sin borrado histórico. | DRAFT; CANCEL_SALE bloqueado en candidato hasta ratificación. Pruebas permitidas anteriores solo sintéticas. |
| Conteo | Ventana breve sin movimientos, dos revisores y acta/hash. | DRAFT; plantilla, sin apertura ejecutable. |
| Ajuste físico | Solicitud con causa/evidencia y autorización administrativa, movimiento prospectivo. | DRAFT; no edición de saldos ni ajuste automático. |
| Devoluciones/dañado | Recepción en retenido/cuarentena; liberación o merma solo por aprobación; reembolso separado. | DRAFT; RETURN_SALE/merma manual bloqueados. No usar reintegro directo legado. |
| Lotes | Recibido/en proceso/disponible/bloqueado/cerrado y responsables; desbloqueo administrativo trazable. | Etapas físicas implementadas; estados comerciales y transiciones DRAFT, sin bloqueo por etiqueta visual. |
| Receta/insumos | Ratificar bolsa y etiqueta por presentación; registrar costo real/tanda y merma pesada. Incorporar válvula/caja/cinta solo con receta aprobada. | Receta de ensayo existente, comercial DRAFT. No consumos adicionales supuestos. |
| Gastos | Referencia única y categoría; distinguir inventario/costo capitalizado de gasto operativo/pago; quién revisa y cuándo. | Motor ya separa conceptos; revisión y límites monetarios DRAFT. |
| Descuentos | Mantener precio de catálogo; excepción con autorización trazable por pedido. | DRAFT; excepciones deshabilitadas. |
| Respaldos | Al cierre diario y antes de cambios; segunda custodia/catálogo hash separado; simulacro periódico. | DRAFT, no tarea automática. 30 diarios/12 mensuales solo si capacidad aprobada. RPO/RTO sin promesa. |
| Retención/privacidad | Definir plazo, responsable, quién puede exportar y destrucción controlada de copias; nunca borrar pendientes por rutina. | DRAFT; no se aplica borrado. |
| Permisos | Mantener los tres perfiles confirmados; baja/revocación administrativa, sin cuentas compartidas. Confirmar custodia de recuperación y sustituto del propietario. | Roles vigentes conservados; accesos comerciales y recuperación pendientes de verificación específica. |

Cada decisión aprobada necesitará versión, fecha efectiva, identidad del propietario, referencia de evidencia y hash. Los nuevos planes deben fijar la versión aplicable al confirmarse; nunca recalcular planes anteriores por una política posterior. policy5g sigue explícitamente DRAFT y approvedForProduction=false. No hay endpoint público de aprobación.
