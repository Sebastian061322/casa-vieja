# Acta técnica — Fase 5A en revisión visual

Estado: candidato implementado y comprobado localmente; fase ABIERTA hasta aprobación del propietario.

Se compararon el original saneado, la interfaz Fase 4 y la propuesta en navegador. El original conserva su estructura; usa un catálogo ficticio y sus conexiones están bloqueadas por CSP y funciones de conexión anuladas. El archivo productivo no fue editado. Se inspeccionaron ventas, stock, inventario, clientes, egresos y configuración/lotes, con sus controles y estados vacíos.

Se entregó diagnóstico antes de implementar. La matriz en DIAGNOSTICO.md distingue lo que se conserva, mejora y rediseña. La propuesta conserva identidad, nombres y orden operativo; reduce el acceso móvil a funciones frecuentes a un toque y mantiene el cobro separado de la venta.

## Resultados

- 135/135 pruebas locales aprobadas: 129 de fases anteriores y 6 del paquete de revisión.
- 32/32 comprobaciones de interfaz de escritorio: simple, Tripack, combinada, cancelación, borrador al navegar/recargar, modales, offline, reintento, recarga offline, reconexión sin duplicar, pedido exacto, inventario y accesibilidad semántica.
- 6/6 comprobaciones móviles: acceso a inventario, filtro, menú secundario, apertura/cierre de modal, publicidad sin atribución y filtro vacío.
- 4/4 dimensiones: 320×740, 390×844, 430×932 y 768×1024, sin desbordamiento del documento, total visible y botones inferiores de 50 px.
- Backend compilado idéntico byte a byte al de Fase 4 antes de su constante HTML. No se editaron motores, reglas de costo, diario ni cliente transaccional de fases anteriores.
- Nuevas pruebas en Google: ninguna. Ningún despliegue se actualizó en esta fase. Solo backend simulado local.

## Hallazgos corregidos durante el ensayo

- El estado visual podía interpretar «Sin operaciones pendientes» como pendiente: se corrigió la condición y se consulta la cola real para la venta actual.
- Un nuevo pedido podía heredar controles bloqueados tras una venta pendiente: se serializó el reinicio del borrador, sin borrar las operaciones pendientes de la cola.
- FormData omite campos deshabilitados: el borrador ahora conserva sus valores de controles explícitamente.
- El menú cerrado podía mantener controles accesibles: se agregó inert y control de expansión en móvil.
- Se redujo riesgo de perder líneas al cambiar combinada/simple: se conservan las líneas apartadas y se recuperan al volver.
- Los nombres repetidos de prueba podían seleccionar un pedido cancelado anterior: el recorrido utiliza sufijos únicos y selecciona el estado reservado. El error de prueba no fue una duplicación del protocolo.

## Pendiente obligatorio

El propietario debe revisar la organización de menú, formulario, total y navegación móvil. No se considera terminada Fase 5A ni se prepara activación comercial. Las limitaciones físicas, integración Google y continuidad de colas V4/V5A están documentadas en README.md. Todo el contenido monetario y de inventario de las capturas es ficticio.
