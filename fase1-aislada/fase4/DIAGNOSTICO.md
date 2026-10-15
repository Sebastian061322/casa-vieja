# Fase 4 — Diagnóstico previo a la integración

Fecha: 15/10/2026, America/Lima. Referencias: index.html original, blob 159727617309256dba3d7599ecc90b1d3113213b; Fase 3, commit 6fefb5fc3a321cc8ae69b336cb12fd13dba2657b. Revisión estática del código y de las evidencias previas; no se ejecutó la aplicación productiva ni se abrió la base de producción. No se copiaron sus datos, credenciales ni configuración de conexión.

## Resultado principal

La aplicación original contiene diez módulos comerciales. El laboratorio V3 valida el núcleo de inventario y un formulario de ensayo; no es todavía un reemplazo funcional completo. Tener 98 pruebas locales aprobadas no demuestra cobertura de precios, descuentos, cobros, gastos, clientes, reportes financieros ni todos los formularios originales.

Estados: integrado = motor y formulario; parcial = protocolo sin formulario completo o sin todos los campos; ausente = todavía sin implementación; cambio deliberado = no reproducir una conducta peligrosa del original; fuera de alcance = conservar como pendiente explícito.

## Matriz de correspondencia

| Función original y evidencia | Función nueva actual | Estado | Problema o pérdida al reemplazar hoy | Solución de Fase 4 |
|---|---|---|---|---|
| Dashboard mensual: computeDashboardForMonth:919, renderDashboard | Tabla de inventario V3 | Ausente | Se pierden ventas, ticket, canales, pendientes, gráficos y selección de mes | Reportes por fechas de operaciones confirmadas, separando pedidos, facturación, cobros y resultados |
| Catálogo de presentaciones/precios: renderConfig:2894 | Partidas PACKAGED | Parcial | Partida física no es oferta comercial; no hay catálogo ni precios vigentes | Ofertas versionadas con presentación, consumo y precio backend |
| Venta simple: addSale:1431 | REGISTER_SALE y formulario V3 | Parcial | El laboratorio recibe total libre y no conserva todos los campos originales | Total backend derivado de oferta y descuento autorizado; formulario comercial |
| Duo/Tripack: products.unitsPerSale | Selector Bolsa/Tripack | Parcial | Cantidad física multiplicada, pero no precio de oferta por pack | Oferta con bolsas por presentación y precio por presentación |
| Combo de hasta 8 bolsas: addComboSale:1497 | Varias líneas en motor V3 | Parcial | Falta constructor visual; línea original pierde baseId al serializar combo | Constructor de líneas con partida/lote y oferta explícitos |
| Canal, cliente, teléfono, dirección: renderVentas:1140–1170 | metadata permite customer/phone/zone/note/date | Parcial | Canal no permitido en metadata y formulario V3 no recoge todos los datos | Campos comerciales separados y validados; búsquedas locales protegidas |
| Selección inicial de pago y entrega | PAY_SALE/DELIVER_SALE | Parcial | Solo indicadores booleanos; no importes, fechas, referencias ni pagos parciales | Eventos de cobro y estados derivados; registrar entrega como operación separada |
| Edición modal: saveSaleEdit:1684 | EDIT_SALE | Parcial | UI V3 sin edición de contacto; original recalcula ganancias al editar | Edición comercial sin cambiar importes/costos; ajustes monetarios separados |
| Reserva | RESERVE_SALE | Integrado en motor | Original descuenta al alta; V3 separa reserva/físico | Mantener política V3 y mostrar ambos saldos |
| Despacho y entrega: renderDelivery/updateDeliveryStatus | DISPATCH_SALE/DELIVER_SALE | Parcial | Sin tablero de pedidos ni búsqueda/etapas visibles | Tablero de pedidos y acciones compatibles con estado/versiones |
| Eliminar venta: deleteSale | CANCEL_SALE | Cambio deliberado | Borrar no conserva trazabilidad | Cancelación registrada; despacho exige recepción física |
| Devolución parcial/total | RETURN_SALE | Parcial | UI solo recibe el resto completo; sin tratamiento financiero | Selector por cantidades y eventos de crédito/reembolso separados |
| Stock comercial: renderStock/getAvailableUnits:721 | physical/reserved/qty | Integrado en motor | Falta filtro y alertas configurables | Filtros por lote/familia/molienda/gramaje; saldos de solo lectura |
| Movimientos manuales de entrada/salida: addMovement | RECEIVE_LOT, PREPARE_BAGS, WASTE | Cambio deliberado | Entrada libre puede inventar existencia/costo | Formularios por operación trazable; sin edición absoluta |
| Granel por lote: loteKg/bagStockMap | PARCHMENT/BULK/PACKAGED | Integrado en motor | UI de ensayo usa identificadores técnicos | Formularios con selecciones legibles y filtros |
| Lotes: addLote:3133 y normalizeLote:620 | RECEIVE_LOT | Parcial | Falta productor, puntaje, flete separado, nombre visible y activación | Metadatos adicionales prospectivos; costos y fechas separados |
| Familia Gourmet/Especialidad | family explícita V3 | Integrado | Original identifica uso por molienda, no familia estructurada equivalente | Mantener familia independiente de molienda |
| Tostado/rendimiento por lote | ROAST | Integrado en motor | Transformación resumida, sin trilla independiente | Formulario de tostado con masa y merma; no simular trilla inexistente |
| Preparación: submitBagging:2570 | PREPARE_BAGS | Parcial | Validación segura, pero UI técnica y receta fija | Seleccionar lote, gramos, bolsas, molienda, empaque y etiqueta |
| Compras de materiales: submitPurchase:2709 | RECEIVE_SUPPLY | Parcial | Sin documento de compra ni vínculo financiero | Registro único de costo capitalizable y salida de caja asociada |
| Insumos: INV_ROLES; INV_SIZES 250/500/1000 | BAG250/BAG500/LABEL | Parcial | Se pierden empaques de despacho, cajas, otros insumos y 1000 g | Declarar limitación; no afirmar cobertura fuera del alcance 250/500 |
| Conteos físicos: submitKgCount/submitBagCount/submitItemCount | Sin ajuste por conteo V3 | Ausente | Falta conciliación prospectiva autorizada | No añadir saldo editable; futuro comando con diferencia, motivo y aprobación |
| Deshacer movimientos: undoInvBatch:2747 | Recuperación sin borrados | Cambio deliberado | El original borra efectos | Mantener inmutabilidad; no reconstruir borrados ni permitir undo destructivo |
| Egresos: addExpense:1969 | No hay ledger económico V3 | Ausente | No se pueden registrar ni analizar gastos | Eventos económicos por categoría, documento único y referencia a costos capitalizados |
| Publicidad manual: renderAds:1820 | No hay módulo equivalente | Ausente | Se pierden campaña, plataforma, monto y mensajes | Publicidad como gasto operativo manual; mensajes no son ventas; automatización Meta/Windsor excluida |
| Finanzas: monthFinance:763 / computeDashboardForMonth:919 | profitCents por venta | Ausente | Dos fórmulas originales distintas de utilidad; no distinguen caja/devengo | Separar pedidos, ingreso despachado neto, cobros, COGS, OPEX, caja y margen estimado |
| Clientes: computeCustomers:2078 | metadata por venta | Ausente | Sin búsqueda, agrupación por teléfono, repetición ni historial | Vista derivada de pedidos confirmados, normalización y enmascarado por defecto |
| WhatsApp: waLink | Sin equivalente | Ausente | Se pierde acceso directo | No enviar mensajes automáticamente; solo enlace consciente si luego se incorpora |
| Reposición estimada: gramsPerDay/daysLeft | Sin equivalente | Ausente | Se pierde estimación de consumo | Declarar estimación, no inventario del cliente; diferir si no hay datos fiables |
| Fondo: fundSummary:790, aportes y usos | Sin equivalente | Fuera de alcance actual | Se pierde un módulo completo si se reemplaza hoy | No presentar Fase 4 como paridad total; conservar original y evaluar Fondo en Fase 5 |
| Configuración: productos, precios, mínimos, fondo, conexión | Solo fixtures y datos demo | Parcial | Sin configuración comercial usable | Configuración de ofertas ficticias versionadas; sin editar conexión productiva |
| Historial mensual y acordeones | Tabla/listas V3 | Parcial | Navegación histórica comercial incompleta | Filtros por día/semana/mes y pedidos; no importar meses cerrados |
| Sincronización: outbox localStorage, reintentos, diagnósticos | IndexedDB V2/V3 | Integrado y más seguro | La interfaz anterior permite descartar cola | Mantener recibos, estado verificable y rechazo archivado con evidencia |
| Backup JSON y restauración: exportBackup/importBackup:3384 | Evidencia y diarios, sin restauración UI | Parcial | No hay recuperación completa certificada | Exportación sintética sin secretos; nunca restauración destructiva automática |
| Reset/borrados generales | No disponible | Cambio deliberado | Violación del historial cerrado si se copiara | Excluir esos botones y rutas |
| Apariencia y móvil | CSS original preservado | Parcial | Laboratorio no tiene las diez vistas ni la misma densidad de formularios | Conservar identidad y menú; reorganizar módulos con controles accesibles |

## Contrato de datos frente al sistema original

Del código original se verificaron estos campos de intercambio, no datos personales:

- Venta: id, createdAt, date, productId/productName, qty, unitPrice, total, unitCostUsed, loteIdUsed, channel, customer, phone, paymentStatus, deliveryStatus, deliveryCost/deliveryCharged, zone, profit y combo (grindType/loteId/loteName/unitCost).
- Producto: id/name, price/cost/stock/minStock, weightGrams, packagingCost, grindType, baseProductId y unitsPerSale. Base: bolsa física con stock y costo de empaque.
- Lote: id/name, producer/variety/origin/cupScore/type/date, greenKg/greenCostPerKg/freightCost, roastedKg/roastCost/totalLotCost/costPerKgRoasted/yieldPct/active.
- Egreso: id/date/category/description/amount/provider. Publicidad: id/date/platform/campaign/amount/messages. Fondo: id/date/concept/amount.
- Colecciones: products, baseProducts, sales, ads, expenses, lotes, movements, fund, settings, inv_items e inv_events.

Estos son contratos JavaScript, no una confirmación de encabezados físicos actuales de Sheets. La auditoría previa documenta Ventas, Movimientos, Productos, ProductosBase, Lotes, Egresos y Config, y ausencia remota de colecciones x_* en su corte. No se reabre ni modifica esa base. Los únicos destinos actuales son la hoja sintética y sus diarios autorizados.

## Cambio de arquitectura necesario antes de programar

V3 solo guarda cantidades/costos y flags paid/delivered. No existe un diario de dinero ni catálogo validado por servidor. Copiar formularios encima daría reportes incorrectos: una venta pendiente podría parecer cobrada, un retorno físico no reduciría el ingreso, y una compra de café podría restarse otra vez como gasto después del COGS.

Se propone una extensión comercial versionada sobre los mismos PREPARED/COMMITTED y bloqueo, sin cambiar las reglas de físico/reserva de V3. Los eventos comerciales se incluirán en el plan inmutable, separados de los movimientos físicos. Reutilizará los diarios existentes del laboratorio: no se crearán nuevos proyectos, hojas, pestañas ni destinos sin aprobación.

Necesita: ofertas/precios con vigencia y versión; autorización de descuentos por propietario; cobros/reembolsos con importe y referencia; crédito comercial ligado a devolución; gastos operativos separados de compras capitalizables; referencias únicas para evitar duplicar documentos. El costo histórico de ventas confirmadas se conserva. Pedidos registrados son demanda, no cobros ni ingreso despachado.

Riesgos: un evento económico confirmado debe recuperarse junto al plan; los lectores anteriores deben ignorar extensiones sin reinterpretar inventario; las colas V2/V3 deben permanecer disponibles; nuevos tipos no deben poder sobrescribir ventas o costos previos. La aplicación comercial de pruebas tendrá acceso privado del propietario y solo datos ficticios; no equivale a permisos multioperador productivos.

## Secuencia autorizada

1. Presentar este diagnóstico antes de implementar (sin cambiar código previo).
2. Extender y probar el dominio comercial/financiero en archivos nuevos, conservando pruebas anteriores.
3. Integrar interfaz de ventas, pedidos, inventario, lotes, compras, gastos, clientes y reportes.
4. Ejecutar regresión completa y ensayos sintéticos; documentar límites y evidencia visual.
5. Conservar Fondo, conteos aprobados, insumos adicionales, recuperación de backups, dos equipos físicos y cargas reales como brechas explícitas. No sustituir la aplicación original ni preparar activación.
