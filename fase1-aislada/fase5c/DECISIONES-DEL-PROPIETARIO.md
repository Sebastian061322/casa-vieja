# Decisiones pendientes — no se aplicaron como reglas comerciales

El negocio registra 3–10 ventas diarias y hasta tres personas pueden usar el sistema durante el día. Se probó como caso conservador un pico de tres solicitudes; no se afirmó que las tres personas siempre coincidan.

| Decisión | Alternativas y consecuencias | Propuesta para aprobar |
|---|---|---|
| Quién registra cobros y despachos | Solo administrador: más control y posible espera. Permiso específico para ventas/inventario: agiliza, exige auditoría y límites. | Identificar personas y separar permiso de cobro, despacho y reembolso. No dar administración completa. |
| Cancelación de una reserva propia | Vendedor con motivo antes del despacho, o aprobación de administrador en cada caso. | La arquitectura de laboratorio prueba la primera; falta ratificación comercial. |
| Costos/envío para vendedores | Tabla por zona/versionada, cotización aprobada por pedido o monto variable con autorización. | Seleccionar política; no se asumió envío gratis. Sin configuración se bloquea. |
| Preparación | Costo de proceso por bolsa, por tanda o costo real autorizado; recetas por presentación. | Aprobar regla/unidad/versiones; el operador no decide costos desde el formulario. |
| Conteo físico | Bloqueo breve de movimientos; o conteo por zona con conciliación de movimientos del período. | Para el corte inicial, ventana breve y un solo responsable de apertura, con doble revisión de diferencias. No ejecutar todavía. |
| Ajustes | Cualquier operador, o solicitud con causa/documento y aprobación de administrador. | Solo ajuste nuevo autorizado con acta; nunca editar el saldo o el diario anterior. Definir tolerancias. |
| Estados de lote | Recibido, en proceso, disponible, bloqueado, agotado/cerrado; definir transiciones y quién desbloquea. | Aprobar reglas antes de implementarlas. Hoy el motor distingue etapas físicas; no debe confundirse eso con un bloqueo comercial aprobado. |
| Devolución apta | Regresar directamente a disponible o inspeccionar antes. | Inspección; separar recepción física de liberación comercial. Definir responsable y evidencia. |
| Dañado/cuarentena | No vendible hasta revisión; luego merma o liberación aprobada. | No volver a disponible automáticamente. El flujo heredado de laboratorio devuelve físicamente al recurso; esta política es bloqueo para activación. |
| Plazos y condiciones de devolución | Por defecto comercial propio, por canal y condición del empaque; obligaciones aplicables requieren revisión aparte. | Aprobar condiciones sin inventar plazos ni prometer reembolsos automáticos. |
| Fondo | Caja/reserva de liquidez, capital/aportes o distribución entre socios son conceptos diferentes. | Definir aportantes, propiedad, retiros autorizados, obligaciones y utilidad distribuible. Mantener “Sin implementar”. |
| Insumos | Bolsa/etiqueta actual; añadir válvula, caja, cinta, transporte u otros según uso real. | Confirmar lista, unidad, consumo por receta, merma y costo; no añadir consumos ficticios a pedidos. |
| Respaldos | Copia diaria al cierre + antes de cambios; exportación por equipo antes de actualizar. | Aprobar retención y custodia independiente; propuesta técnica: 30 diarios y 12 mensuales. No se programaron disparadores. |
| Autenticación | Dominio Workspace existente o proveedor OIDC/servicio Node separado. | Aprobar una alternativa del documento de permisos antes de crear recursos o habilitar operadores. |

No se ejecutaron conteos, aperturas reales, bloqueos comerciales de lotes, repartos de Fondo ni cambios de reglas de devoluciones. Los fixtures están identificados como ficticios y no constituyen aprobación de precios, costos o políticas para producción.
