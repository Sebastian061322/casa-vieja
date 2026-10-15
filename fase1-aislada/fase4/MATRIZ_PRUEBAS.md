# Cobertura solicitada — Fase 4

| Caso solicitado | Evidencia automatizada / navegador |
|---|---|
| 1. Venta simple | commercial.test: precio backend y costo histórico; scenario simple |
| 2. Tripack | commercial.test: presentación consume tres bolsas y cobra precio de oferta |
| 3. Combo | commercial.test y scenario: varias ofertas/partidas, sumas y consumos completos |
| 4. Reserva | Motor V3, tests previos y venta comercial sin descontar físico |
| 5. Despacho | Reconocimiento de ingreso/COGS y consumo físico único |
| 6. Pago | Anticipos, saldo, documentos únicos, límites y pago completo |
| 7. Entrega | Sin consumo adicional; nuevo ID no duplica la entrega |
| 8. Cancelación | Libera reserva; anticipos permanecen por reembolsar |
| 9. Devolución parcial | Cantidades por línea, crédito proporcional y costo original |
| 10. Devolución total | Crédito completo de productos y restitución de COGS; envío conservado según política de prueba |
| 11. Recepción de materia prima | V3 y scenario comercial con lote/origen/familia y costo capitalizado |
| 12. Preparación de bolsas | V3, escenarios y forms de preparación 250/500 g |
| 13. Consumo de insumos | Receta V3, falta de etiquetas no deja preparación parcial |
| 14. Registro de gastos | OPEX, pago posterior y documento único |
| 15. Cálculo de costos | Costos backend por partida; compra/pago no duplica gasto |
| 16. Cálculo de margen | Despacho − créditos − COGS − distribución − OPEX − merma extraordinaria |
| 17. Pérdida de conexión | Client V4 y navegador local con transporte interrumpido; ensayo Google con fallo inyectado |
| 18. Reintento confirmado | Mismo recibo y sin nuevos efectos; escenario repite todos los comandos |
| 19. Dos clientes concurrentes | Pruebas lógicas por última unidad; RPC paralelos de navegador en ensayo real |
| 20. Reconstrucción | V3 y fase4 con conservación de gramos/costos; verificación de planes y efectos confirmados |
| 21. Historial protegido | Fixtures con listas de escritura; compatibilidad V3; comparación Git y prefijo del diario real cuando se cierre el ensayo |
| 22. Pendientes tras recarga | Reapertura de cliente automatizada y recarga real del navegador local manteniendo IndexedDB; un pedido al reconectar |

La simultaneidad se prueba con dos clientes lógicos. No equivale a dos equipos físicos. Las interrupciones se inyectan en transporte; la recarga local sí se realizó en el navegador. Los dobles de Google no se presentan como integración real: el acta y las evidencias de Sheets separan ambos resultados.
