# Estado verificado de laboratorio — Fase 5G

Fecha: 24 de octubre de 2026, Lima. Dictamen comercial: **NO-GO**. No se autoriza lanzamiento ni corte.

## Versiones

- Fuente: 9c2539ff8c5ee612b4fb9bdc1d27de53900ea76f; evidencia inicial: 7db0da57831157300cfc5c567680869969e2a525. Exclusivamente fase1-aislada/fase5g en dev/fase1-estabilizacion.
- Worker base validado: 94e3fbd3 / SHA256 966dc1577447a4b95b07975fd57ae9693743b2473ba61f527c999a584116ba8a. Parche visual autorizado activo: 7c1806c8 / SHA256 b350fe05fadd3cdc72b7b8c17637674bbc53fe84bde462dd19f47941dc5b1676, commit aa58d7e2d28498770b2cc2cbafb07c8926d830d7. Código de API/autenticación idéntico; solo cambian approved-app.js y entry.mjs.
- Apps Script: versión 4 observada, mismo endpoint; ejecutado por propietario y acceso de red Cualquiera, protegido por la firma existente. SHA256 del candidato guardado: 0a64a97eabf93224e407de9f491c4b8c757d5742edb7ad1db5f42d0e8b8df604.
- main conservado: 12a5f997845f9d31dc1a5d8ae7dc49770928da3d. Sin escrituras productivas, pagos, cuentas ni cambios de OAuth o secretos. Los tres recursos vacíos de recuperación fueron creados con aprobación específica posterior.

## Comprobaciones aprobadas

- 477 pruebas locales del candidato original.
- Siete rechazos públicos y tres archivos públicos por hash/no-store: tests/red-publica-5g.json.
- Gerente operativo: permisos administrativos denegados, identidad falsificada denegada, tres consultas y revisión sin cambios: tests/permisos-remotos-5g.json.
- Recepción original recuperada tras sesión vencida, una sola confirmación; cola vacía y rechazo archivado conservado: tests/recepcion-remota-5g.json.
- Cadena real en Google con datos ficticios: recepción 10000 g; pilado 10000→8000+2000 g; tostado 8000→7000+1000 g; molienda parcial 4000→4000+0 g; ocho bolsas molidas de 500 g y ocho en grano de 250 g, con consumo de empaques y etiquetas. Resta 1000 g tostado en grano. Balance: 7000 g conservados + 3000 g de merma = 10000 g. Valor previo a ventas: 16260 céntimos, de los cuales 14500 café/procesos y 1760 materiales. tests/cadena-google-5g.json.
- Venta simple, Tripack y combinada reservados sobre el lote nuevo. Simple: cobro parcial 1000 céntimos, saldo 2500; cobro final 2500; despacho único; edición solo de observación. Costo 1172 y margen 2328 céntimos conservados. Cobros y edición sin efectos de inventario; segundo despacho deshabilitado; sincronización repetida sin nuevas escrituras. tests/comercial-google-5g.json.
- Total del ensayo: 13 operaciones COMMITTED, cero rechazos nuevos, 25 movimientos nuevos con IDs únicos. Diario total 294 filas y movimientos totales 207. Los 268 registros y 182 movimientos previos siguen exactamente iguales.

## Pendientes y límites

Administrador y vendedor: repetición sobre 5G aprobada por el propietario y observada en navegador. El vendedor completó personalmente Touch ID. Evidencias en tests/permisos-vendedor-google-5g.json y tests/permisos-administrador-google-5g.json; ambas sobre Worker 94e3fbd3 y Apps Script 4. Las pruebas previas de 5E no se cuentan como nuevas aprobaciones.

Dos defectos visuales medios encontrados: tarjetas de lotes sintéticos antiguos sin metadatos muestran undefined/NaN; el filtro de pedidos puede reactivar visualmente Cancelar pese a que el servidor lo bloquea. Corrección preparada con 482 pruebas completas y revisión local de interfaz; propietario autorizó publicar únicamente desarrollo y Worker de laboratorio. Paquete b350fe05fadd3cdc72b7b8c17637674bbc53fe84bde462dd19f47941dc5b1676. Publicado como Worker 7c1806c8: siete rechazos públicos aprobados y tres activos por hash/no-store. Revisión visual autenticada final aprobada: metadatos ausentes muestran «No registrado» y Cancelar/Devolver permanecen deshabilitados tras filtrar. Backend y registros sin cambios.

Pendientes críticos: recuperación integral independiente en proveedores, cierre comprobado de todos los escritores antiguos, censo autorizado de dispositivos comerciales, inventario de apertura y continuidad de pedidos/cobros existentes, políticas y catálogo/tarifas aprobados. También falta repetir móviles y escenarios de concurrencia/reconexión sobre el candidato final. No se han utilizado inventarios físicos ni clientes reales. Los 300 kg previstos no se han registrado.

## Destino de recuperación creado, todavía no restaurado

Con autorización específica se crearon CasaVieja_RECUPERACION_TEST_ONLY_5G (hoja privada vacía, Control sin configurar), CasaVieja_DR_TEST_ONLY_5G (solo función vacía, sin ejecución ni despliegue) y Worker Free casa-vieja-dr-test-only-5g (versión 47610702-3eca-4778-8604-51a43d518a13). GET, POST y OPTIONS devuelven 403, RECOVERY_NOT_CONFIGURED y dataAccess:false, sin caché. No hay secretos, conexiones de backend, KV ni D1. Evidencia: tests/recursos-vacios-5g.json.

La autorización cubre solo la creación vacía. Configurar identidad, credencial, endpoint y restaurar datos sintéticos exige preparar y aprobar el paquete concreto. La recuperación integral en proveedores sigue PENDIENTE; no se declara cierre 5G ni aptitud comercial.
