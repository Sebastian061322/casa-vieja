# Fase 5A.2 — refinamiento visual en revisión

Estado: IMPLEMENTADO EN LABORATORIO LOCAL, PENDIENTE DE APROBACIÓN VISUAL. No se cierra Fase 5A.

## Resultado

Se mantiene la navegación familiar y agrupada, con iconos propios. El lateral conserva el marrón de Casa Vieja; la zona de trabajo usa crema, blanco cálido y verde. Títulos serif y cuerpo del sistema, sin descargar fuentes. Se distinguen positivo, pendiente y error por texto y color.

Inicio recupera la jerarquía financiera del original: ventas del día/mes reconocidas por despacho; pedidos registrados y pendientes; cobros y cuentas por cobrar; desglose de ingreso, costo histórico neto, margen, distribución, gastos y merma; resultado estimado sin reparto automático. Los saldos actuales se distinguen del período seleccionado. Hay alertas de partidas con menos de tres bolsas, identificadas como umbral visual de laboratorio.

Gráficos: serie diaria con selector de ingreso/importes de pedidos/cantidad de pedidos, detalle seleccionable por fecha y tabla accesible; productos brutos despachados con acceso a inventario; componentes de gasto. Todas las cifras financieras vienen de informes del backend V4; el trazado solo adapta escalas visuales. El gráfico de productos conserva la definición del reporte: bolsas brutas, sin restar devoluciones. No se inventa una serie de varios meses: el laboratorio tiene pocos días con actividad y el gráfico lo refleja.

Fondo tiene ubicación visual y estado pendiente, sin importe ni cálculo. La publicidad manual confirmada aparece como movimientos individuales ya incluidos en gastos operativos. La sección Publicidad es una demo separada, con tarjetas del último día visible, gráfico de inversión diaria, tabla de CTR/CPC/CPM, campañas/conjuntos/anuncios y advertencias de atribución. No hay conexión a Windsor.ai, credenciales, ROAS certificado ni cambios de campañas.

Ventas conserva sus reglas y datos: modos simple/Tripack/combinada, presentaciones rápidas, filtros opcionales recogidos, elección de partida legible con identificador exacto conservado internamente, recuperación de cliente y dirección desde proyecciones confirmadas. El descuento conserva autorización, con código completado automáticamente. La elección de cliente no registra dinero ni entrega. En móvil se mantiene total y registro visibles, estado de guardado actualizado y acceso a Nuevo pedido.

## Comparación de acciones

Conteo estructural observado; no es un estudio cronometrado ni una afirmación de productividad medida. Se cuenta una selección como acción lógica; abrir y escoger en un selector puede requerir dos toques físicos.

| Flujo y condición | Original aislado | 5A.2 |
|---|---|---|
| Desde Inicio a formulario, escritorio | 1 acceso a Ventas | 1 acceso a Ventas o venta rápida |
| Desde Inicio a formulario, celular | 2: menú y Ventas | 1: Ventas en barra inferior |
| Venta simple con producto/cantidad predeterminados y cliente opcional, desde Inicio | 2 acciones escritorio / 3 móvil, incluyendo registrar | 2 en ambos, incluyendo registrar; la confirmación es del servidor |
| Elegir otra presentación | 1 selección en lista | 1 botón rápido, o selector habitual |
| Pasar a Tripack | 1 selección de presentación | 1 modo Tripack |
| Activar combinada | 1 checkbox, después configurar componentes | 1 modo, después elegir cada componente; no se afirma ahorro exacto sin una oferta equivalente |
| Recuperar cliente | Escribir nombre/teléfono/dirección, al menos 3 focos y escritura | Abrir recuperación, buscar y seleccionar: 3 acciones lógicas, sin reescribir sus datos |
| Registrar cobro y despacho | Selectores de estado no acreditaban por sí solos dinero o salida | Operaciones confirmadas separadas; se conserva esta diferencia por seguridad comercial |

## Verificaciones

- 152/152 pruebas locales: 135 anteriores y 17 nuevas de componentes, escalas, fechas, caché, metadatos de clientes, contraste e integridad del paquete.
- 32/32 verificaciones anteriores de interfaz repetidas: simple, Tripack, combinada, cancelaciones, borradores, IndexedDB, offline, reconexión y modales.
- 24/24 nuevas de navegador: panel, filtros, gráficos, foco al cambiar métrica, fallos de conexión, períodos vacíos, cliente existente, partida exacta, fechas de pedidos, publicidad y ausencia de errores JavaScript nuevos.
- Cuatro dimensiones: 320×740, 390×844, 430×932 y 768×1024. Sin desbordamiento del documento; gráfico adaptable, acciones principales y puntos de gráfico de al menos 44 px; total visible. Tabla de inventario: 732 px dentro de contenedor de 360 px, sin ampliar el documento de 390 px.
- Cinco comprobaciones móviles adicionales: modal abre/cierra, tabla confinada, menú secundario y publicidad.
- Safari nativo: Tab desde Cliente a Teléfono con foco visible; menú de página confirmó 200% y activó redistribución adaptable; se restauró tamaño real. Son comprobaciones básicas, no certificación WCAG completa ni prueba del teclado físico iOS/Android.
- Contraste de siete combinaciones de texto comprobado: al menos 4.5:1. No equivale a certificar todos los estados, iconos y componentes de la aplicación.

## Continuidad y errores corregidos

Se dejó una venta ficticia pendiente con el HTML anterior de 5A. Luego se abrió 5A.2 en el mismo origen y la misma base IndexedDB. Conservó el pendiente, reconectó y mostró exactamente un pedido reservado. No generó cobro ni despacho. Se canceló mediante operación trazable para liberar la reserva. Evidencia: tests/continuidad.json y capturas de cola anterior/recuperada.

No se cambió nombre, formato ni cliente de la cola 5A. Las colas V2/V3/V4 permanecen sin borrar ni migrar; esta fase no fusiona sus bases. La vista local /fase4 y las fuentes previas siguen disponibles. El ensayo directo de cambio de interfaz corresponde a 5A→5A.2; no se presenta como migración de todos los clientes anteriores.

Se corrigió un fallo heredado de 5A: su filtro de fechas reasignaba `commercialSales`, declarado const, e interrumpía la inicialización de scripts posteriores. El filtro ahora trabaja sobre las tarjetas renderizadas, sin mutar el selector, ventas ni backend. Las 32 comprobaciones anteriores no cubrían ese tramo completo; se añadieron pruebas de fechas y errores de ejecución para cubrirlo.

Se corrigió también la apertura con un reporte de revisión anterior: se verifica una revisión estable antes/después de consultar y se permite un reintento acotado a través del cliente existente. Si cambia de nuevo o falta conexión, no se sustituyen cifras por ceros ni se mezclan como si fueran actuales.

## Paquete y rendimiento

Sin librería de gráficos, CDN, fuentes remotas o permisos nuevos. Ver peso exacto en tests/paquete.json. Reportes con caché por revisión/fechas y dos solicitudes simultáneas como máximo; serie limitada a siete días. Una combinación no cacheada puede necesitar hasta diez reportes y una comprobación de snapshot. Falta medir latencia y cuotas en Google; no se afirma rendimiento productivo desde el servidor local.

El backend de Code.gs anterior a su constante HTML es idéntico byte a byte al de Fase 4. No se modificaron motores, costos, efectos, idempotencia ni cliente de sincronización. No hubo escrituras a Sheets, Apps Script o main; tampoco despliegue, borrados históricos ni activación comercial.

## Archivos

Modificados en fase5a: build.cjs, web/ux.js, web/ux.css, web/shell.html, apps-script/Index.html y apps-script/Code.gs (solo HTML embebido), junto a notas de seguimiento en README/ACTA/REVISION_VISUAL. app.js no cambia en 5A.2.

Nuevos en refinamiento-5a2: components.js, refinement.js, refinement.css, DIAGNOSTICO_Y_REFERENCIAS.md, INFORME.md, REVISION_VISUAL.md, pruebas y evidencias. La carpeta baseline es material temporal local de comparación y no se publica en GitHub.

## Pendientes y Fase 5B

Primero aprobación visual explícita: organización financiera, paleta crema/marrón/verde, formulario, recuperación de clientes y navegación móvil. Después ajustar con operadores en teléfonos físicos, lectores de pantalla y sesiones prolongadas, y medir carga/latencia con Google de laboratorio. Fondo, permisos por rol, conteos, restauración y políticas financieras pendientes siguen sujetos a definición. Publicidad requiere contrato y atribución validados antes de conectar proveedores. Nada de ello autoriza activación comercial.
