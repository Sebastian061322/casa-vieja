# Fase 5A — diagnóstico visual previo a implementación

Comparación realizada en navegador el 15/10/2026 (Lima). Original aislado con CSP que bloquea conexiones, almacenamiento separado y con catálogo y lote ficticios; Fase 4 con motor simulado y catálogo ficticio. No se abrió la aplicación productiva. Capturas en evidencia/. Se revisó primero el original vacío y luego con un catálogo ficticio de tres presentaciones. Esto no permite concluir tiempos de operación con catálogo real.

| Elemento original | Fase 4 | Diferencia | Conservar | Mejorar | Rediseñar |
|---|---|---|---|---|---|
| Ventas con formulario + historial | Registro y pedidos separados | Pierde contexto de lo recién registrado | Nombre Ventas y acceso al historial | Acceso directo a Pedidos | Confirmación con enlace al pedido |
| Producto + checkbox combinada | Lista de ofertas y agregar línea | Combo poco descubrible | Alternancia visible | Simple / Tripack / Combinada | Filtros explícitos por café, molienda y gramaje |
| Fecha, cantidad y precio juntos | Precio dentro de selector | Menos reconocible | Cantidad y precio visibles | Precio de catálogo de solo lectura | No habilitar precio libre sin reglas backend |
| Cliente, teléfono, envío | Mezclados con autorización | Formulario largo y sin grupos | Campos conocidos | Producto / cliente / entrega | Resumen y botón persistentes |
| Pagado / entregado como selectores | Operaciones monetarias separadas | Más pasos pero evita falsos cobros | Vocabulario familiar | Estado actual y botón siguiente | No convertir una intención en cobro confirmado |
| Menú de 10 entradas | Menú de 10 entradas | Ambos largos en móvil | Colores, marca, navegación lateral | Compras y gastos agrupables | Barra móvil de 4 frecuentes + Más |
| Stock e inventario distintos | Una proyección con filtros | Unificación útil | Tarjetas de bolsas, café e insumos | Atajos de etapa | Conservar una sola fuente de existencias |
| Lotes dentro de Configuración | Lotes y preparación propios | Acceso nuevo más directo | Datos y nombres reconocibles | Encabezados y acciones | Evitar duplicación en Configuración |
| Egresos formulario + historial | Gastos modal | Registro exige abrir modal | Término Egresos | Acción visible y lista legible | Compras capitalizables separadas |
| Clientes con segmentos | Búsqueda y detalles | Pierde segmentos originales | Lista y búsqueda | Estados vacíos y privacidad | No inventar segmentación sin backend |
| Configuración con conexión y borrado | Catálogo versionado | Funciones peligrosas excluidas | Nombre Configuración | Precios y vigencias visibles | No recuperar secretos ni borrados |
| Ads con ROAS aproximado | Sin sección | Falta organización futura | Acceso secundario Publicidad | Fecha de actualización y procedencia | Demo sin conexión ni ROAS no probado |
| Menú móvil desplegable | Menú móvil desplegable | Dos toques para funciones frecuentes | Menú Más para secundarios | Un toque Ventas/Pedidos/Inventario | Barra inferior accesible |

## Flujos y clics previstos

Medición estructural, no estudio cronometrado: desde Inicio, original y Fase 4 requieren 1 toque en escritorio para Ventas y normalmente 2 en móvil (abrir menú + Ventas). Propuesta: 1 en ambos. Agregar componente de combo: original 1 checkbox; Fase 4 1 botón sin modo explícito; propuesta 1 modo Combinada que agrega segunda línea y mantiene cada selección. Cobro y despacho conservan confirmaciones separadas; reducirlos a un selector produciría efectos financieros falsos. Consultar pedido tras registro: propuesta enlace directo, sin buscar manualmente.

## Organización propuesta para revisión del propietario

Inicio, Ventas, Pedidos, Inventario como frecuentes. Lotes y preparación, Compras, Egresos, Clientes, Reportes, Configuración y Publicidad en navegación secundaria. Escritorio conserva lateral familiar; móvil barra inferior con Inicio, Ventas, Pedidos, Inventario y Más. Publicidad es una demostración explícita con datos ficticios. No constituye integración de Meta.

La fase solo puede cerrarse después de revisión visual y aprobación del propietario. Las pruebas técnicas no sustituyen esa decisión.
