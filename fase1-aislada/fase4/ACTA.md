# Acta de Fase 4 — Integración comercial y experiencia de usuario

Fecha: 15/10/2026, America/Lima. Base: rama dev/fase1-estabilizacion, commit 6fefb5fc3a321cc8ae69b336cb12fd13dba2657b.

## Diagnóstico presentado antes de implementar

Se inspeccionó el index.html original, blob 159727617309256dba3d7599ecc90b1d3113213b, sus diez módulos, formularios, campos de intercambio y cálculos, y la arquitectura V2/V3. Se presentó la matriz DIAGNOSTICO.md antes de programar la integración. Se identificó que el laboratorio no tenía paridad comercial y que V3 no llevaba importes de cobros, gastos ni catálogo validado. No se volvió a auditar ni leer la base productiva.

## Implementación

Extensión comercial sobre los planes recuperables y el inventario V3, sin modificar sus archivos originales. Ofertas versionadas y precios backend, autorización de descuento ligada al pedido, cobros parciales/completos, créditos por devolución, reembolsos separados, costos capitalizables, pagos de compras, gastos y pagos operativos con comprobantes únicos. Los eventos económicos viven en el plan inmutable confirmado; no hay nuevo destino ni pestaña.

Interfaz privada con resumen, registro simple/Tripack/combo, clientes y datos de entrega, pedidos y cobros, inventario con filtros, lotes y preparación, compras, gastos, catálogo y reportes. Se conserva el CSS original y se agrega organización adaptable. Los datos personales de prueba se mantienen dentro del laboratorio; no hay publicidad automática ni envíos de mensajes.

## Pruebas locales

129/129 aprobadas: las 98 anteriores y 31 nuevas de Fase 4; cero fallos. Cobertura explícita de los 22 casos solicitados en MATRIZ_PRUEBAS.md. Incluye precios manipulados, descuentos sin autorización, versiones de ofertas, pagos de más, doble comprobante, devolución/crédito, reembolso, retorno de COGS, gastos/pagos, cuota de compra, tres puntos de fallo de venta comercial, ruta V3 protegida y aislamiento de archivos/destinos.

## Interfaz probada en navegador local

Servicios Google simulados, con barra visible de «Simulación local». Se registró un pedido ficticio de S/35 con transporte desconectado, se recargó la página y siguió pendiente en IndexedDB. Al reconectar apareció una sola vez. Un anticipo de S/10 dejó S/25 por cobrar. Tras despacho y devolución física, quedó S/10 reembolsable y se registró el reembolso separado. No se usó dinero ni clientes reales.

Se verificaron filtros y diseño de inventario a 390×844: ancho de documento 390, sin desbordamiento horizontal del documento. La tabla tiene desplazamiento propio. No equivale a certificación en todos los equipos móviles.

## Problemas encontrados y corregidos

- La cola podía verse confirmada por conectividad aunque se conservara solo una copia anterior: el estado ahora distingue copia local y descarga confirmada.
- El aviso antiguo de conexión podía seguir visible tras reconectar: se actualiza al recuperar conexión.
- Filtros y tarjetas abiertas podían reiniciarse durante actualizaciones: se conservan y no se reconstruyen formularios enfocados.
- El pago previo de V3 era un indicador sin importe: V4 exige eventos de cobro/reembolso con comprobante.
- Una ruta V3 podía intentar despachar un pedido V4 omitiendo su evento económico: queda rechazada durablemente y el pedido se gestiona por V4. Las colas V3 anteriores siguen disponibles.
- Los costos de compras podían restarse como gasto después de incorporarse al producto: se separan costo capitalizable, pago y OPEX.

## Verificación real de Google

Aprobada: commercial-browser-f13fef78-3af4-409c-81e2-d0fcd598bbc5, 48/48 verificaciones. Informe leído directamente en VerificacionesInventarioV3!A4:C4. Incluye los 32 comandos del recorrido, reintento de cada comando, invariantes monetarias, conservación de masa, fallo PREPARED recuperado, reapertura de IndexedDB, respuesta perdida, recuperación de confirmación original y RPC paralelos de dos clientes por la última bolsa. Evidencia en tests/evidencia-google-final.json. El propietario actualizó el mismo despliegue privado manteniendo Solo yo. No se ampliaron proyectos, hojas, pestañas, permisos ni destinos.

### Reconstrucción independiente desde Sheets

Se leyeron de forma acotada DiarioInventarioV3!A1:C220 y MovimientosInventarioV3!A1:C180, y se verificaron con el motor local. Los 89 registros anteriores del diario y los 72 movimientos anteriores de Fase 3 coinciden íntegramente con su evidencia guardada; no se reescribieron.

Resultado acumulado sintético: 164 registros de diario, 111 movimientos, revisión 81, ningún PREPARED pendiente y ninguna reserva abierta. Conservación de café: 33000 g ficticios recibidos = 26755 g físicos + 6245 g de merma registrada.

Resultado comercial del ensayo, en céntimos ficticios: ingreso neto por despacho 700, cobros 19000, reembolsos 18300, COGS neto 0, distribución 500, OPEX 500 y resultado estimado −300. Se registraron pagos de compras por 5000 sin restarlos como otro gasto operativo. Pendiente de cobro y de reembolso: cero. No son cifras del negocio. Evidencia reconstruible en tests/diario-google-sintetico.json y tests/reconstruccion-google.json.

## Límites y recomendación para Fase 5

No hay paridad total con el original: Fondo, conteos prospectivos autorizados, insumos adicionales, restauración de respaldos, reglas de devolución de envío, cuarentena de devoluciones dañadas y estados de lotes requieren trabajo explícito. No se incluyen impuestos, depreciación, conciliación bancaria/caja ni contabilidad fiscal. La recurrencia y los reportes tienen las definiciones operativas del README; pendientes de cobro son saldo actual, no cierre histórico del filtro.

Probar carga y cuotas, paginación/proyecciones, dos dispositivos físicos, cortes prolongados, respaldo/restauración y cambios de versión. Revisar permisos por rol y protección local de datos antes de considerar cualquier uso real. Permanecen funciones de mantenimiento y vistas V2/V3 privadas para pruebas; no son una arquitectura de permisos productivos. Referencias distintas no permiten detectar por sí solas una misma factura registrada dos veces con números diferentes.

No preparar activación ni migración en Fase 5 sin otra decisión explícita. No se modificó main, index.html original, Apps Script productivo, Google Sheets productivo ni información histórica; las fases anteriores se conservan completas.
