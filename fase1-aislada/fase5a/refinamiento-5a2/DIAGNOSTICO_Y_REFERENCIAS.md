# Fase 5A.2 — análisis visual y decisiones previas

El index.html de main conserva blob `159727617309256dba3d7599ecc90b1d3113213b`, verificado mediante GitHub. Se reinspeccionó su copia aislada: no se ejecutó la aplicación productiva. La navegación agrupada de 5A tiene aprobación parcial; la fase sigue abierta.

## Qué hace familiar al original

- Paleta: fondo #1C1410, superficies #241B15/#2E241C/#382B20, crema #F2E9DC, texto secundario #A8998A, oro #D4A34A, verde #6B8F5C, rojo #C1432E y azul #5C7F8F.
- Títulos serif Iowan/Palatino/Georgia y cuerpo del sistema. La marca y los encabezados crean jerarquía sin depender de fuentes externas.
- Menú lateral con iconos lineales y selección por superficie. Es familiar por su posición, nombre y asociación icono/módulo, no únicamente por sus colores.
- Dashboard con desglose financiero de filas, resultado destacado y aclaraciones bajo cada concepto. Es más interpretable que una pared de tarjetas iguales.
- Tarjetas de indicadores con etiqueta pequeña, importe grande y contexto de período. Gráficos secundarios después del desglose.
- Ventas: producto/cantidad/precio cercanos, combinación visible, cliente/envío y registro en la misma vista. No se recuperan selectores que marquen pagos sin registrar dinero.
- Tablas densas, movimientos agrupados e historiales por período; modales con cierre y confirmación juntos. Los modales originales no ofrecen por sí solos garantías transaccionales.
- En móvil el menú se despliega encima del contenido y los formularios se apilan. 5A mejora el acceso con barra inferior, pero su formulario y sus avisos ocupan demasiado alto.

## Comparación y propuesta

| Patrón | Problema en 5A | Refinamiento |
|---|---|---|
| Panel financiero original | Tarjetas equivalentes sin explicación de resultado | Desglose de ingresos, costo, margen, distribución, gastos y merma; resultado destacado del backend |
| Iconos del menú | Texto sin referencias visuales | SVG lineales propios, con nombres visibles |
| Café oscuro | Poco contraste entre tarjetas y fondo | Lateral marrón familiar y área de trabajo crema; verde para acciones y positivos |
| Registro de ventas | Filtros opcionales siempre abiertos y campos técnicos | Presentaciones rápidas; filtros en detalle; datos del cliente recuperables; lote con etiqueta legible y código en detalle |
| Indicadores | No distinguen flujo y saldo | Etiquetas explícitas: pedidos registrados, ingreso por despacho, cobros del período, cuentas por cobrar actuales |
| Gráficos | Ausentes en Inicio | Series diarias obtenidas del reporte backend, selector de métrica, tabla accesible y detalle de cada punto |
| Fondo | Solo mencionado como pendiente | Espacio visual identificado «Pendiente de diseño de reglas», sin importe ni reparto |

## Referencias investigadas

Se consultó documentación oficial, sin copiar diseño ni código:

- [Shopify — dashboard de analítica](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/overview-dashboard/using-the-overview-dashboard): filtros rápidos de fecha, tarjetas con acceso a reporte y aviso de datos incompletos. Se adapta el patrón, no sus métricas de comercio electrónico.
- [Square — Seller Dashboard](https://developer.squareup.com/docs/devtools/seller-dashboard): áreas de pedidos, pagos, inventario y reportes. Se mantiene la separación operativa, evitando confundir ingresos con cobros.
- [Odoo — paneles de inventario](https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/inventory/warehouses_storage/reporting/dashboards.html): supervisión de operaciones y existencias. La página apareció en la búsqueda oficial, pero su apertura completa falló; no se atribuyen detalles visuales no inspeccionados.

## Gráficos y datos

SVG propio con controles HTML y tablas: no se añade librería, descarga remota, dependencia o CDN. El trazado escala números del reporte, sin calcular ganancias ni existencias. Se solicitan reportes de cada día con el endpoint existente; concurrencia limitada y caché por revisión/período. Los datos son solo del laboratorio ficticio.

No se recupera la fórmula antigua de reparto 50/50. El backend V4 es la autoridad para costo, margen y resultado. El desglose de publicidad manual se muestra como movimientos confirmados; no se suma en frontend ni se convierte en rendimiento de Meta. El alcance publicitario diario no se suma como alcance único del período.

También se abrió la página pública [Shopify Analytics](https://www.shopify.com/analytics) en navegador: se observaron tarjetas de métricas y gráficos con títulos explícitos, espacio entre secciones y jerarquía de cifra/etiqueta. No se inició sesión ni se copiaron sus imágenes, código o identidad.
