# Reglas que necesita confirmar el propietario

Ninguna fila es una decisión aprobada. politicas-propuestas.json mantiene DRAFT, responsables/fecha/evidencia vacíos y reglas null. No se utilizó esa propuesta para operar. Las reglas marcadas TEST_ONLY en el simulacro son ficticias y no autorizan el negocio.

| Tema | Propuesta para decidir | Alternativa / consecuencia |
|---|---|---|
| Cobros | Definir quién registra y quién verifica Yape/Plin/transferencia; registrar parciales y referencia | Solo administrador mejora control pero demora. Permiso separado a ventas agiliza; comprobar comprobante antes de marcar pagado. |
| Despachos | Descontar físico al despacho; reserva al pedido; pago/entrega no descuentan | Decidir si se permite despachar con saldo pendiente y qué rol autoriza excepciones. No asumir prepago obligatorio. |
| Descuentos | Solo autorización del administrador por pedido con monto y caducidad | Confirmar límites y si vendedor puede solicitar; nunca precio/costo arbitrario del navegador. |
| Cancelación | Vendedor cancela su reserva antes de despacho con motivo | Elegir si toda cancelación necesita administrador; después de despacho requiere devolución física/reembolso según corresponda. |
| Preparación | Receta versionada por gramaje y molienda; costos/materiales definidos por administrador | Confirmar costo por tanda/bolsa y materiales reales; merma explícita. No asumir las cifras ficticias. |
| Devoluciones | Recepción separada de liberación: apto tras inspección, dañado no disponible, cuarentena bloqueada | Definir responsable, plazos y reembolso. El flujo actual de devolución directa NO debe habilitarse hasta implementar la decisión. |
| Lotes | Recibido → en proceso → disponible; bloqueado/cerrado con responsable | Definir quién bloquea/desbloquea y si un bloqueo afecta reservas existentes. No basta el estado físico actual. |
| Ajustes/conteos | Conteo con fecha, acta y doble aprobación; diferencia genera movimiento nuevo | Definir tolerancias/roles; nunca editar saldo ni diario anterior. |
| Respaldos | Diario al cierre + antes de cambios; propuesta 30 diarios y 12 mensuales | Aprobar frecuencia, retención y segundo custodio/destino independiente de la cuenta; RPO/RTO objetivo. No hay tarea automática habilitada. |
| Envío | Tabla por zona/versionada o cotización por pedido aprobada | Confirmar quién modifica costos/cobro de envío; ausencia de regla bloquea vendedor. |

Fondo continúa sin implementar. Confirmar capital, aportes, retiros, caja disponible y utilidad distribuible antes de agregarlo. Insumos adicionales requieren lista, unidad, costo y receta confirmados.

## Versionado implementado para laboratorio

policy.js añade registro append-only de DRAFT y APPROVED. Rechaza operadores, aprobación declarada desde cliente, versión existente, borrador incompleto y alteración de hash. La aprobación exige identidad de servidor y evidencia; este módulo debe recibir un autorizador backend, no exponerse directamente como RPC.

Cada plan nuevo fija policyRef (versión, hash, vigencia) y policySnapshot. La reconstrucción usa el plan confirmado; cambiar la versión activa no reevalúa una venta anterior. Las colas PREPARED se recuperan con su plan original. Un cambio comercial debe guardar nueva versión, quién aprobó, acta, fecha efectiva y operaciones de prueba; nunca sobrescribir una versión ni reinterpretar un epoch antiguo.

El registro general y las pruebas de inmutabilidad están implementados. Su conexión a TODOS los flujos comerciales, la vigencia efectiva por tipo de operación y las reglas de devoluciones/lotes/ajustes quedan pendientes de las decisiones. El simulacro fija una versión TEST_ONLY en sus planes. No afirmar que el candidato comercial ya aplica políticas aún no aprobadas.

Para responder basta indicar cada tema y tu elección; no hace falta escribir un documento técnico. No se activará ninguna propuesta por silencio o por transcurso del tiempo.
