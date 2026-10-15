# Fase 3 — Inventario unificado de laboratorio

Esta versión está limitada al proyecto independiente y a CasaVieja_Pruebas_SINTETICA ya autorizados. No contiene conexiones productivas. No importa ni reescribe historial. La única apertura V3 es cero: las existencias nacen de recepciones ficticias trazables. No se prepara una activación comercial.

## Arquitectura y continuidad

El núcleo journal.js conserva el protocolo probado en Fase 2: fingerprint canónico, operationId persistente, estados PREPARED/COMMITTED/REJECTED, efectos deterministas, confirmación verificable y recuperación antes del siguiente escritor. inventory.js sustituye las reglas comerciales y la proyección por el inventario unificado. El adaptador conserva una caché únicamente dentro del bloqueo de cada ejecución. Cada escritura se relee desde Sheets antes de confirmar su durabilidad; no convierte la caché en autoridad. Los lectores solo incluyen operaciones COMMITTED, cuyos efectos deben existir y coincidir. Google Sheets no ofrece aquí una transacción física entre pestañas: se garantiza visibilidad lógica y recuperación con un único escritor autorizado y LockService.

Se reutiliza client.js de Fase 2 sin modificarlo. IndexedDB guarda comandos/recibos en transacciones; la cola V3 usa nombre y destino separados. Los RPC V2 originales y su HTML se conservan en el paquete generado, disponibles con `?lab=v2`. Una operación pendiente V2 conserva su semántica anterior y no se convierte en reserva V3. No se migra ni combina su inventario. El inventario V3 es la única autoridad para operaciones V3. No hay una vista sumada V2+V3 ni se afirma que ambas sean inventario físico real. En laboratorio, las pruebas sintéticas de cada época son independientes.

## Modelo de datos

| Registro | Contenido |
|---|---|
| Lote | ID, origen, variedad, familia Gourmet/Especialidad, gramos recibidos, adquisición, procesamiento, fecha y operación |
| Existencia | ID de partida, lote, producto, etapa, unidad, molienda/gramaje cuando corresponde |
| Movimiento | ID único, operationId, saleId de correlación, fecha ISO, responsable, lote, producto, resourceId, unidad, tipo, cambios de físico/reserva/valor, referencias de origen |
| Operación | Comando inmutable, fingerprint, plan completo, resultado original y revisión |
| Venta | Líneas con lote/familia/molienda/gramaje, cantidades y costo histórico confirmado al reservar, versión, estado y devoluciones recibidas |

Tres pestañas nuevas dentro de la misma hoja sintética: DiarioInventarioV3 (planes, confirmaciones y rechazos), MovimientosInventarioV3 (efectos inmutables) y VerificacionesInventarioV3 (informes de ensayo). Las listas de escritura de V3 no incluyen pestañas V2 ni históricas. No hay borrados, actualizaciones de filas antiguas ni edición manual de saldos.

La proyección reconstruye `physical`, `reserved`, `qty = physical - reserved`, `valueCents` y `reservedValueCents`. Las cantidades son enteras: gramos para pergamino/granel, unidades para bolsas e insumos. No se usan decimales flotantes para repartir costos: la asignación proporcional usa enteros y BigInt intermedio; las devoluciones parciales calculan diferencias acumuladas para recuperar exactamente el costo original total.

## Política única de inventario V3

1. RECEIVE_LOT recibe pergamino y costo por lote. Gourmet y Especialidad son familias explícitas e inmutables.
2. ROAST convierte pergamino en tostado a granel, declara gramos de merma y agrega costo de procesamiento. Es una transformación resumida, no modela por separado trilla y tueste.
3. RECEIVE_SUPPLY registra partidas ficticias de bolsas de 250/500 g y etiquetas, con cantidad y costo.
4. PREPARE_BAGS valida gramos y materiales; consume café, una bolsa del gramaje indicado y una etiqueta por unidad; crea una partida preparada con el mismo lote, molienda y responsable. Declara merma y costo de procesamiento.
5. REGISTER_SALE/RESERVE_SALE reserva cantidad y costo, sin reducir físico. Cada recurso se elige explícitamente; no hay selección automática FIFO de lotes. Un Tripack son tres bolsas por presentación; un combo contiene varias líneas.
6. DISPATCH_SALE descuenta físico y valor exactamente una vez y libera esa reserva. PAY_SALE y DELIVER_SALE no producen movimientos. La aplicación de laboratorio registra indicadores de pago/entrega; no procesa pagos ni constituye contabilidad de cobros.
7. CANCEL_SALE solo en RESERVED libera reserva y valor reservado. Después de despachar exige RETURN_SALE: recepción física explícita parcial o total, ligada a las líneas originales y con tope en lo despachado. No borra ni recalcula la venta original. Reintentar el mismo comando recupera el resultado; otra devolución no puede exceder lo pendiente.
8. WASTE descuenta solo existencias disponibles y registra motivo y masa de café perdida. Nunca consume reservas.

Los costos normales de merma de tostado/preparación se capitalizan en las unidades resultantes; la merma extraordinaria de WASTE retira valor de inventario. La reserva fija el costo histórico desde el servidor; despacho, edición de contacto y retorno conservan ese snapshot. El valor devuelto se incorpora a la misma partida, sin cambiar costos de ventas previas. La ganancia original no pretende representar notas de crédito ni devolución monetaria.

## Construcción y recursos

Ejecutar `node fase1-aislada/fase3/build.cjs`. Instalar únicamente apps-script/Code.gs en Código.gs del Apps Script de laboratorio. Ese paquete contiene V2 preservado, motor V3 y HTML embebido; no instalar Server.gs adicionalmente ni duplicar definiciones. Index.html se entrega para inspección.

La inicialización solo crea las tres pestañas si faltan, dentro del destino sintético autorizado. No necesita nuevos proyectos, cuentas, hojas ni permisos OAuth. El despliegue sigue privado, Solo yo. Las funciones de mantenimiento son solo para el laboratorio.

Pruebas reproducibles: `node --test fase1-aislada/tests/acceptance.cjs fase1-aislada/fase2/tests/*.test.cjs fase1-aislada/fase3/tests/*.test.cjs`.

## Límites pendientes

- Pruebas en dos equipos físicos y desconexión física prolongada; la concurrencia remota usa dos clientes lógicos con RPC paralelos y la pérdida de conexión/respuesta se inyecta en transporte.
- Rendimiento con grandes diarios, índices/proyecciones verificables y respaldo/restauración aislada. Cada lectura aún reconstruye todo el diario V3; las pruebas no miden capacidad productiva.
- Catálogo de insumos adicionales, recetas configurables, trilla separada, mezclas entre lotes, múltiples almacenes, devoluciones dañadas a cuarentena, vencimientos de reservas y selección FIFO automática.
- UI de combo manual y devolución parcial: soportadas por protocolo y pruebas; el formulario V3 permite venta simple/Tripack y recepción del resto completo. Falta integrar todos los campos comerciales del frontend original.
- Revisión de roles, autenticación y auditoría de identidad. El responsable es un dato del comando, no un rol certificado. El alcance OAuth autorizado es amplio aunque el código limite el destino.
- La inmutabilidad es de la aplicación append-only, no protección frente a edición manual por un propietario de Sheets. Nunca editar el diario manualmente.

No hay corte físico, migración, aprobación de precios ni preparación de activación. El stock y los costos de estas pruebas son completamente ficticios.
