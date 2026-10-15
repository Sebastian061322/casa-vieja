# Acta de Fase 3 — Inventario unificado y trazabilidad

Fecha: 15/10/2026, zona America/Lima. Desarrollo exclusivo en dev/fase1-estabilizacion, sobre el commit eec5ecf011c9f34688988776529c95ed94cef69a.

## Implementado

- Una proyección V3 reconstruible de existencias físicas, reservas, disponibilidad y valor por partida/lote.
- Pergamino, tostado a granel, bolsas de 250 y 500 g, molienda grano/molido e insumos de empaque.
- Recepciones con origen, variedad y familia, sin confundir Gourmet con Especialidad.
- Tostado y preparación integral con validación de café, bolsa y etiqueta, costos y merma explícita.
- Ventas que reservan; despacho único que descuenta físico; pago y entrega sin descuento adicional.
- Cancelación previa a despacho y devoluciones físicas parciales/totales sin superar las cantidades originales.
- Costo histórico reservado en backend, edición comercial sin recálculo de ganancia, devoluciones con restitución exacta de céntimos.
- Diario append-only, idempotencia, rechazo terminal, recuperación y verificación de efectos heredados del protocolo de Fase 2.
- Interfaz aislada con CSS original, cola persistente e informes reales guardados en Sheets de pruebas.

## Pruebas locales

98/98 aprobadas, cero fallos: 18 de Fase 1, 39 de Fase 2 y 41 nuevas de Fase 3.

Las nuevas cubren: lotes y familia, conservación de masa y valor, consumos de materiales, presentación/molienda, reservas, cancelación, despacho, pago y entrega sin consumos repetidos, retorno parcial/total, límites de devolución, costos históricos y redondeo exacto, disponibilidad insuficiente, dos clientes lógicos por última unidad, reintentos, seis puntos de caída durante preparación, recuperación de cancelación/despacho/devolución, diario inmutable, lecturas sin escrituras, guardas de identidad/destino, separación V2/V3 y cola desconectada/respuesta perdida con reinicio de cliente.

Servicios Google simulados verifican que V3 solo escriba sus tres pestañas, sin modificar registros históricos ficticios ni las pestañas V2. Esto no equivale a haber leído o calculado hashes de la base productiva.

## Prueba real de Google

Primer ensayo: inventory-browser-0eca30ac-39d7-4140-a839-d8e4a6a98333 aprobó 27 comprobaciones y terminó con SERVER_UNAVAILABLE. El diario confirma que la cancelación 40a30841-b34f-4b50-9067-3dd7b3c59794 sí quedó COMMITTED: no se perdió ni borró la operación. Se conservó el informe fallido. Se corrigió el arnés para cancelar mediante cola y recibo persistentes, y se redujeron las lecturas repetidas en cada bloqueo sin omitir la relectura durable de escrituras. Se añadió una prueba de acuse sin efecto durable: debe quedar PREPARED, nunca confirmado. Reensayo aprobado: inventory-browser-ac988ecc-c1f5-49db-8ff2-4434e7510d5d, 30/30 comprobaciones, leído directamente en VerificacionesInventarioV3!A3:C3. Evidencia en tests/evidencia-google-final.json. El propietario actualizó el despliegue existente manteniendo Solo yo. No se crearon otros proyectos, hojas ni cuentas. La inicialización añadió solo pestañas dentro de CasaVieja_Pruebas_SINTETICA.

### Reconstrucción independiente desde Google

Se descargaron de forma acotada los diarios sintéticos y se verificaron con el motor local, sin confiar en el texto de éxito del navegador: 89 registros de diario, 72 movimientos, 44 operaciones confirmadas, un rechazo terminal, cuatro lotes y 18 partidas. No quedó ningún PREPARED pendiente ni reserva abierta. Las siete ventas de ensayo terminaron CANCELLED o RETURNED.

Los dos ensayos recibieron en total 22000 g ficticios: 17830 g físicos remanentes + 4170 g de merma explícita = 22000 g. El valor remanente sintético es 72340 céntimos. No son cifras del negocio. Ver tests/diario-google-sintetico.json y tests/reconstruccion-google.json.

## Cambios respecto a Fase 2

La semántica de reserva/físico es nueva y está versionada por epoch TEST_ONLY_V3. Las rutas V2 se conservan para sus comandos y su cola; no se reinterpretan ni migran registros V2. La vista V3 no mezcla saldos de ambos laboratorios. Se mantiene la evidencia previa intacta y consultable con ?lab=v2.

## Límites y riesgos

La solución aún requiere medir volumen y cuotas, probar respaldo y restauración, dos dispositivos físicos y revisión móvil detallada. Las pruebas de desconexión son inyectadas; los envíos paralelos usan dos clientes lógicos reales del navegador. No se modelan todavía trilla separada, almacenes múltiples, recetas variables, mezclas de lotes, cuarentena de devoluciones dañadas, FIFO ni vencimientos de reservas.

La interfaz V3 permite venta simple/Tripack, preparación y devolución restante completa. Combos, contacto y devoluciones parciales están en el protocolo y ensayos; su formulario comercial completo queda pendiente. Los indicadores de pago no son procesamiento de dinero. La ganancia histórica se conserva; no representa ajustes contables ni notas de crédito por devoluciones.

El journal reconstruye todo su historial; no hay certificación de rendimiento productivo. La inmutabilidad depende del escritor autorizado: el propietario de Sheets conserva posibilidad técnica de editar manualmente. Las funciones de mantenimiento y el OAuth amplio permanecen restringidos al laboratorio y requieren revisión antes de cualquier uso comercial.

No se modificó main, index.html productivo, Apps Script productivo ni Google Sheets de producción. No hay corte, inventario real, cambios históricos ni activación comercial en esta entrega.
