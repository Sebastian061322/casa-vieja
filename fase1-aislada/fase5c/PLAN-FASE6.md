# Fase 6 — procedimiento propuesto, no ejecutado

Condición de entrada: cerrar los P0 de la matriz 5C y obtener autorización expresa para el corte. Este documento no autoriza leer/copiar producción ni publicar cambios. El sistema actual continúa operando mientras se realizan las pruebas.

## 1. Preparar la decisión de corte

Fijar responsables: propietario aprueba inventario y activación; administrador técnico ejecuta; operador registra el acta; encargado cuenta físicamente. Confirmar versión exacta y hash del candidato, proveedor de identidad validado, perfiles aprobados, dispositivos identificados, respaldo independiente comprobado y resultados físicos firmados. Congelar solo el candidato, no las ventas actuales durante esta preparación.

Crear un registro de dispositivos/orígenes: persona, equipo, navegador/perfil, URL exacta, base IndexedDB, motor/epoch, cantidad de pendientes, recibos, última revisión y evidencia. La falta de datos se marca desconocida, nunca cero. Un dispositivo no verificado impide cerrar el corte o requiere dejar su ruta antigua habilitada bajo una contingencia aprobada.

## 2. Resolver operaciones en tránsito antes de cambiar de escritor

En cada origen original consultar estado por operationId en su motor:

- COMMITTED: recuperar el recibo original y comprobar venta/efectos; no reenviar con otro ID.
- PREPARED: recuperar con el mismo comando y mismo motor bajo bloqueo; no sumar manualmente un ajuste paralelo.
- UNKNOWN: conservar comando, investigar destino/origen y reenviar solo en el motor original cuando esté validado. No prueba que la venta no exista en otro destino.
- REJECTED: verificar rechazo durable; archivar conservando comando/evidencia y preparar una operación corregida solo con intervención explícita.
- Cuenta revocada o destino diferente: retener y resolver con administrador; no atribuir a otra persona.

Exportar el estado íntegro de cada equipo antes de actualizar. No vaciar IndexedDB, reinstalar el navegador ni copiar V2/V3 a V4 para “limpiar” una cola. No abrir simultáneamente una venta en el sistema nuevo como sustituto de un pendiente antiguo.

## 3. Respaldo y breve ventana operativa

Tras una autorización separada para datos productivos, tomar una lectura y respaldo verificable del sistema actual y su configuración. Conservar su archivo, código y despliegue intactos como legado consultable. Guardar hash, revisión, hora Lima/UTC y pendientes incluidos; contrastar la copia con el catálogo independiente. No restaurar una copia antigua sobre producción.

En la ventana acordada: pausar altas/despachos del sistema antiguo en todos los dispositivos; registrar la última operación confirmada, cobros y movimientos en tránsito. Si existe una venta urgente, usar el registro de contingencia aprobado con ID único y responsable, sin registrarla además en ambos sistemas.

## 4. Conteo físico y apertura nueva

Contar por lote/familia/etapa: pergamino, granel tostado, envasados por gramaje y molienda, insumos, reservas pendientes, despachados no entregados, cuarentena y mermas. Separar Gourmet y Especialidad. Preparar acta, unidades en gramos/unidades, costo de apertura sustentado y revisión por propietario. Diferencia documental antigua se describe; no se corrige retrospectivamente.

Resolver el tratamiento aprobado de reservas heredadas: cumplirlas antes del corte o importar únicamente una obligación nueva enlazada al legado bajo regla aprobada. No llevar una venta anterior al motor nuevo si vuelve a consumir inventario ya descontado. La apertura debe describir físico, reservado y disponible de manera consistente con esa decisión.

Registrar saldos de apertura como operaciones nuevas con cutoverId y referencias al acta. El mecanismo de apertura para datos reales requiere implementación/pruebas y aprobación futura: en 5C NO se ejecutó ni se fabricó un inventario inicial. El historial anterior permanece inmutable y consultable por su ruta original.

## 5. Un solo escritor

Antes de habilitar ventas nuevas, comprobar que el antiguo ya no acepta operaciones que afecten el mismo stock. Una lista en papel o un aviso no equivale a un bloqueo técnico: hay que diseñar y aprobar el mecanismo de cierre de escritura de la plataforma antigua sin cambiar sus registros históricos. Esa modificación productiva requerirá autorización específica posterior.

El sistema nuevo será el único que reserva/descuenta el inventario de apertura. Cobrar y confirmar entrega no descuentan otra vez. Mantener el legado con acceso de consulta y su respaldo, sin habilitar dos fuentes de stock sobre las mismas existencias.

## 6. Pedido testigo y liberación gradual

Comprobar primero un pedido de laboratorio y sus variantes físicas. El primer pedido comercial requiere decisión expresa del propietario: identidad individual correcta, precio autorizado, reserva, cobro separado, despacho único, costos históricos, entrega y recibo visible desde otro dispositivo. Verificar diario/efectos antes de liberar el resto de usuarios. No utilizar una venta real para experimentar sin aprobación.

Registrar tiempos, revisión anterior/posterior y conteo de efectos. Cualquier duplicación, saldo negativo, pérdida de cola, costo expuesto a un perfil sin permiso o falta de recibo detiene la liberación.

## 7. Detención y recuperación

Si falla antes de abrir ventas nuevas: conservar candidato y evidencia, no avanzar con apertura incompleta; mantener o reanudar el sistema antiguo solo tras comprobar que continúa siendo el único escritor y que el conteo no quedó consumido en ambos.

Si ya hay operaciones nuevas confirmadas: detener nuevas escrituras, preservar los diarios y colas, consultar PREPARED/COMMITTED por ID y reconstruir en destino separado. No volver automáticamente a la base antigua ni restaurar un backup anterior: perdería operaciones posteriores. El propietario decidirá continuidad tras verificar movimientos desde el cutoverId y un acta nueva.

El modo de contingencia debe tener un responsable, IDs únicos, hora, cantidad, lote y estado de envío/cobro. Su posterior ingreso se hace una sola vez y conserva la referencia; nunca se reinterpreta como apertura adicional.

## Acta de salida

No declarar transición completa hasta revisar todos los dispositivos, primera jornada, reservas, cobros, saldos físicos y respaldo posterior al corte. Guardar aprobación del propietario, responsables, versión/hash, hora de cambio de escritor, operaciones límite y evidencia de que el legado sigue intacto. Ninguno de estos pasos comerciales se realizó en 5C.
