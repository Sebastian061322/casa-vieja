# Fase 5B — Validación operativa, seguridad y rendimiento

Fecha de trabajo: 15/10/2026, Lima (evidencia Google en UTC del 16/10). Base confirmada: `aced42099cfacbbed3889698beee66f115989a9d`, rama `dev/fase1-estabilizacion`.

**Dictamen: no activar comercialmente.** Se implementaron correcciones y se verificó restauración en laboratorio. Quedan condiciones operativas y de acceso pendientes; no se certifican equipos físicos ni capacidad comercial.

## Alcance y separación

No se accedió a datos productivos para las pruebas. No se modificó `main`, `index.html` original, Apps Script productivo ni BaseDatos_CasaVieja. No se publicó una nueva versión web. Se guardó el paquete Laboratory.gs en el Apps Script independiente ya autorizado y se ejecutó desde su editor. El despliegue privado anterior conserva su versión publicada anterior.

El propietario autorizó expresamente una única hoja nueva de recuperación: `CasaVieja_RECUPERACION_TEST_ONLY_5B`, ID `1zB8s5MZN-LGMpnHL3RkOvA802WVfPOPEkRgXmygNk0o`. No se cambiaron permisos de compartición. Una recepción nueva añade dos etiquetas ficticias de costo cero al laboratorio para medir escritura; no representa inventario real. Los registros previos se conservan como prefijo idéntico.

## Hallazgos verificables

| ID | Severidad | Hallazgo y condición | Evidencia / tratamiento | Estado |
|---|---|---|---|---|
| S01 | Alto | `commercialReply_` clasificaba cualquier error en mayúsculas como definitivo, incluido `EFFECT_NOT_DURABLE` tras una escritura parcial. La cola podía quedar REJECTED sin rechazo comercial durable. | `fase4/apps-script/Server.gs`; reintento permitido para persistencia/conexión/bloqueo transitorios. Prueba `fallo de persistencia...`. | Corregido en código y editor de laboratorio; despliegue web anterior no actualizado. |
| S02 | Alto, condicionado a ampliar acceso | El paquete combinaba escenarios, inicialización, guardado de informes y RPC V2/V3. Los RPC antiguos aceptan precios de ensayos; no deben formar parte del candidato nuevo. No se comprobó acceso anónimo: hoy existe guarda de propietario. | Nuevo `Candidate.gs` construido por lista positiva, sin escenarios, inicializadores que crean pestañas ni RPC antiguos. Manifiesto de siete RPC comprobado en VM. Laboratory.gs conserva ensayos. | Corregido en candidato restringido; no publicar aún. |
| S03 | Alto, para operadores | El backend solo contempla propietario; snapshot/reportes contienen costos, contactos y diario. Ocultar teléfonos en pantalla no elimina datos recibidos ni almacenados. | Guarda `cvOwner_` rechaza identidad ausente/ajena antes de abrir Sheets. No se habilitaron operadores. | Pendiente esquema de identidad/filtrado por función; bloquea acceso multiusuario comercial. |
| S04 | Medio | `responsible`, `date` y `deviceId` son declaraciones del navegador; eventos comerciales tienen `recordedAt` del servidor, pero no una identidad individual firmada por comando. | `fase3/inventory.js`, `fase4/commercial.js`. No se reescribió historial ni se alteraron fingerprints de colas. | Pendiente nueva envoltura de auditoría autenticada y política de fechas offline. |
| P01 | Alto, con crecimiento | Reconstrucción buscaba PREPARED por cada commit y reconstruía registros comerciales repetidamente; recuperación consultaba todo el diario por cada operación previa. | Índices Map/Set durante cada ejecución; mismas validaciones de fingerprint, secuencia, efectos y saldos. Comparación exacta contra base aced420. | Corregido; no es un índice persistente. |
| P02 | Medio | Cada append releía íntegramente la pestaña para confirmar una fila. | Bajo ScriptLock se calcula fila siguiente, append/flush y se relee exactamente esa fila, verificando ID/tipo/JSON canónico. Cache vive solo dentro de esa instancia. | Corregido, comprobado con Google. |
| P03 | Medio | Snapshot y reportes aún reconstruyen todo; llamadas periódicas y consultas por día multiplican lecturas; bloqueo serial limita concurrencia. | Nuevo `commercialPage`: límite 100, offset validado y revisión obligatoria coherente si se continúa una consulta. Frontend conserva snapshot actual. | Parcial: página reduce respuesta, NO reduce lectura/reconstrucción completa. Falta integración de paginación y proyecciones persistentes verificadas. |
| R01 | Alto | No había procedimiento de restauración verificado para el diario nuevo. | Respaldo canónico SHA-256; restauración local y en otra hoja sintética; comparación de registros y reconstrucción independiente. | Ensayo aprobado. Faltan automatización, retención, cifrado/ubicación independiente y ensayo de desastre operacional. |
| C01 | Alto para cambio de versión/origen | V2/V3/V4/5A usan bases IndexedDB diferentes; un cambio de nombre u origen puede dejar colas anteriores fuera de la nueva vista. | 5B no cambia cliente, base, epoch, formato ni comandos. Candidato restringido elimina RPC antiguos, mientras laboratorio conserva su servicio. | Prohibida sustitución directa de versiones antiguas con pendientes. Falta inventario por dispositivo y cierre comprobado de colas; sin migraciones reales. |
| D01 | Medio | Caché y borradores persisten en el navegador sin cierre de sesión propio ni aislamiento por cuenta autenticada. | Cliente y experiencia 5A conservados para no perder operaciones. | No usar equipos compartidos; implementar política de sesión/caché antes de habilitar operadores. |
| D02 | Medio | Diario inmutable por aplicación, pero el propietario/editor de Sheets puede editar celdas directamente; checksum no autentica origen de un respaldo modificado deliberadamente. | No se aplicaron cambios de permisos. Hash detecta diferencias, no sustituye firma ni custodia. | Pendiente mínimo acceso a archivo y respaldo independiente con control de acceso. |
| U01 | Medio | Safari iPhone, Chrome Android, teclado virtual y dos equipos físicos no disponibles para esta ejecución. | Protocolo y acta en PRUEBAS-DOS-EQUIPOS.md. Regresión automatizada local sí ejecutada. | Pendiente, sin aprobación física. |
| O01 | Bajo | Funciones comerciales inconclusas pueden confundirse con saldos aprobados. | Fondo permanece “Sin implementar”; no se inventan importes. | Priorización más abajo. |

No se confirmó una vulnerabilidad crítica con el despliegue limitado al propietario. Los riesgos condicionados a ampliar acceso no se presentan como una filtración anónima ya reproducida.

## Seguridad, OAuth y permisos propuestos

La guarda exige correo activo no vacío, coincidencia con SANDBOX_OWNER_EMAIL y correo efectivo del mismo propietario. La falta de identidad rechaza acceso; no se reemplaza por el usuario efectivo para permitir operadores. Script ID, Sheet ID, nombre y marcador TEST_ONLY restringen destino. LockService serializa operaciones del mismo proyecto; no protege contra edición manual u otro script.

El navegador envía cantidades, ofertas y versiones; el backend resuelve precio vigente, presentación, disponibilidad y costo confirmado. Pruebas de fases previas verifican que totalCents/costCents falsos no deciden la venta y que editar no cambia ganancias. El propietario sí puede configurar ofertas e ingresar costos de compras/envíos: es una función autorizada, no una actualización directa de saldos. No se habilita esta capacidad para operadores.

| Función | Propietario | Operador propuesto (aún NO habilitado) |
|---|---|---|
| Catálogo, precios, costos, descuentos, egresos y respaldos | Sí, con auditoría | No |
| Crear pedido y reservar | Sí | Sí, precio resuelto por servidor y límites aprobados |
| Contacto/dirección | Sí | Solo datos necesarios de pedidos asignados |
| Cobro, despacho, devolución | Sí | Permisos separados; devolución/reembolso con autorización |
| Márgenes, diario completo, exportaciones | Sí | No |
| Editar directamente Sheets o Apps Script | Solo administrador técnico autorizado | No |

`appsscript.candidate.json` propone únicamente Sheets y correo de identificación, V8, Lima y acceso MYSELF. Es archivo de revisión, no una modificación de permisos aplicada. Sheets sigue siendo un alcance amplio en este proyecto independiente: una guarda de ID no reduce el consentimiento OAuth. No se incorporan Drive, Gmail, UrlFetch ni claves privadas. La descripción general de Google se revisó: exactamente esos dos ámbitos. La ventana de implementaciones confirmó versión 8, ejecutada como propietario y acceso Solo yo; no se editó. Evidencia en oauth-verificado.json y despliegue-verificado.json. No se solicitaron nuevos permisos. Antes de cualquier identidad multiusuario hay que decidir despliegue y autorización compatibles; Google puede no proporcionar correo activo en ciertos contextos.

## Rendimiento y límites de interpretación

`tests/rendimiento-local.json`: una muestra por tamaño, Node v24.20.0, datos ficticios generados del escenario comercial. Compara estados y reportes completos contra las fuentes de aced420 conservadas en tests/baseline-0.js y baseline-1.js. Para tamaños mayores solo se mide candidato y se comprueba revisión; no se declara equivalencia contra una ejecución base no realizada.

Última carga local: 480 operaciones, base 1457,76 ms frente a 18,80 ms indexados, con estados/reportes idénticos. A 2048 operaciones: 88,77 ms de reconstrucción y 15,46 ms de reportes; a 10240: 458,52 ms y 261,53 ms. Los dos tamaños mayores no ejecutaron la base lenta ni equivalencia cruzada.

La mejora elimina búsquedas repetidas, pero la reconstrucción sigue siendo proporcional al historial y los reportes aún recorren eventos por pedido. No hay proyección persistente/caché compartida que pueda introducir saldos desactualizados. No se usó CacheService como autoridad. El diario sigue siendo fuente de verdad.

Google real, última ejecución: 166 filas de diario / 113 movimientos, revisión 82: carga 623 ms, reconstrucción 17 ms, reportes 2 ms, total 642 ms. Recepción ficticia: 1112 ms; reintento en la misma instancia bloqueada: 6 ms (NO es tiempo de otro dispositivo/RPC). Después: 168 / 114, revisión 83, carga 539 ms, reconstrucción 7 ms, reportes 0 ms, total 546 ms. El 0 ms es resolución de Date.now, no costo inexistente. No incluye viaje de red al navegador ni espera de bloqueo. No son p95 ni pruebas sostenidas de concurrencia.

Google publica 6 min por ejecución, 30 ejecuciones simultáneas por usuario y 1000 por script; esas cuotas no garantizan capacidad del sistema, cuyo ScriptLock serializa escrituras. Valores consultados en documentación oficial y sujetos a cambios. Definir objetivo comercial y medir p50/p95 con mezcla de ventas, consultas y fallos antes de activación. El crecimiento grande se ensayó localmente, no se cargaron miles de filas en Sheets. No se agotaron cuotas deliberadamente.

## Respaldo y restauración

`backup.cjs` exporta el diario y efectos V3/V4 íntegros con versión, epoch y entorno; conserva comandos, fingerprints, planes, costos históricos, pedidos, eventos, resultados y PREPARED. Verifica checksum, reconstrucción y efectos huérfanos. El destino debe ser TEST_ONLY, diferente al origen y vacío; repetir un respaldo idéntico solo verifica, nunca fusiona ni sobrescribe.

Las pruebas de fallos afterPrepare/afterEffect/afterCommit restauran y reintentan el comando original; el consumo/reserva ocurre una sola vez. Si una escritura local falla parcialmente, no se sobrescribe automáticamente un destino divergente: requiere revisión del laboratorio. En Google, el helper privado conserva el ID del único destino aprobado y solo añade el sufijo faltante si el prefijo coincide exactamente; jamás escribe sobre filas antiguas. Retomar un respaldo diferente que no sea extensión exacta falla cerrado.

Google final: restaurados 168 registros, 114 efectos, revisión 83, sin PREPARED pendientes. Comparación canónica de datos y estado aprobada; una lectura independiente del conector verificó ambos archivos y Node volvió a reconstruir revisión 83. Evidencia en google-final.json y verificacion-independiente.json. No se ejecutaron comandos de venta para copiar, ni se duplicaron consumos. El origen fue releído y comparado antes de declarar sourceUnchanged.

Alcance: diario prospectivo V3/V4; no respalda automáticamente archivos de código, propiedades/identidades, colas de cada dispositivo, V2 ni todo el legado histórico. No se modificó ni restauró legado. Para un respaldo comercial completo falta la política de copias separadas y la inclusión explícita de esos componentes mediante futuras lecturas autorizadas. RPO/RTO todavía no comprometidos. La restauración real no incluyó PREPARED porque no existían: ese caso se probó localmente, no se declara ejecutado en Google.

## Continuidad de versiones

Se conserva íntegro fase2/client.js: misma versión de IndexedDB, store state/current, operationId, deviceId, epoch, recibos y validación de revisión. 5B no migra bases ni elimina colas. 5A y 5A.2 comparten cv-commercial-sandbox-v5a-owner; V4 usa cv-commercial-sandbox-v4-owner y V3/V2 sus propios nombres/epoch. Una coincidencia de esquema no implica que puedan reenviarse a otro motor.

Antes de sustituir cualquier servicio, levantar acta por equipo de cada cola/origen/versión, recuperar confirmaciones perdidas con el servidor original, dejar cero pendientes o mantener su servidor de compatibilidad restringido. Nunca transformar V3 en venta V4 ni reenviar con otro ID. No cambiar dominio del iframe sin verificar almacenamiento. El candidato restringido NO está autorizado para sustituir directamente el servicio antiguo mientras haya pendientes.

## Regresión y UX

166 pruebas Node aprobadas (152 anteriores y 14 nuevas). Incluyen ventas, combos, concurrencia simulada, idempotencia, precios/costos backend, recuperación, historial sintético preservado, permisos, paginación y respaldo. 56 verificaciones de navegador local aprobadas: 32 de ventas/cola y 24 de dashboard/refinamiento. La vista se ejercitó contra el servidor local sintético previo; el backend nuevo se comprobó separadamente con Node y en el editor Google, no como una nueva versión web desplegada.

No hubo cambios de HTML/CSS ni del diseño 5A.2. Las evidencias de zoom/Safari escritorio de 5A.2 son antecedentes; no se cuentan como nuevas pruebas físicas 5B. Pruebas físicas y respuesta perdida en red real requieren acta. No se certifica cumplimiento integral de accesibilidad por pruebas semánticas automatizadas.

## Pendientes priorizados

1. P0 antes de operadores: identidad individual, permisos por comando, redacción de costos/contactos en servidor, separación de caché, auditoría de actor y revisión de accesos de archivo. Mantener propietario exclusivo hasta resolverlo.
2. P0 antes de sustitución: inventario de colas por dispositivo y origen, prueba de recuperación en la versión web final, respaldo independiente y restauración de desastre reproducible, pruebas físicas y medición sostenida del volumen esperado.
3. P1 integridad: conteos físicos con acta, corte aprobado, diferencias como nuevos movimientos autorizados (sin reescribir historia); estados de lotes recibido/en proceso/disponible/bloqueado/cerrado y regla que impida vender bloqueados. No se implementaron sin políticas aprobadas.
4. P1 devoluciones: distinguir apto, cuarentena y merma. El flujo actual repone físicamente lo recibido; antes de uso comercial debe aprobarse inspección y destino para evitar vender una devolución no apta. Reembolso financiero separado permanece correcto.
5. P2 insumos adicionales: receta versionada por gramaje/molienda y unidad; validar conversión y costos antes de añadir válvulas/cajas u otros. Hoy BAG250/BAG500/LABEL.
6. P2 Fondo: aprobar aportes, retiros, reparto, períodos y relación con resultado/caja. Mantener “Sin implementar” y no inferir disponible a partir de utilidad.

## Condiciones que impiden activar

Acceso de operadores sin implementar; continuidad de todas las colas no inventariada; despliegue web final no validado; respaldo completo/independiente no operativo; capacidad sostenida de Google no certificada; pruebas físicas pendientes; política de conteos/corte y devoluciones aptas no aprobada. Resolver y documentar cada condición no autoriza por sí mismo una publicación: se necesita la decisión expresa posterior del propietario. Esta fase no prepara ni ejecuta activación.

## Archivos y reproducción

Fuentes modificadas: fase3/journal.js, fase3/inventory.js, fase3/apps-script/Server.gs, fase4/commercial.js, fase4/apps-script/Server.gs; paquetes generados correspondientes de fases 3, 4 y 5A. Nuevos archivos bajo fase5b: build.cjs, backup.cjs, apps-script/{Candidate.gs,Laboratory.gs,ReadApi.gs,Benchmark.gs,rpc-manifest.json,appsscript.candidate.json}, pruebas, informe y protocolo físico. No hay cambios visuales ni en cliente.

Desde la raíz: ejecutar constructores fase3/build.cjs, fase4/build.cjs, fase5a/build.cjs y fase5b/build.cjs en ese orden. Ejecutar Node --test con acceptance.cjs y todos los *.test.cjs de fases 2, 3, 4, 5A, refinamiento-5a2 y 5B. Carga: node fase1-aislada/fase5b/tests/load.cjs. No ejecutar helpers Google fuera del proyecto independiente y hoja sintética; no desplegar Candidate.gs en producción.

Referencias oficiales: [cuotas](https://developers.google.com/apps-script/guides/services/quotas), [identidad Session](https://developers.google.com/apps-script/reference/base/session), [funciones privadas terminadas en guion bajo](https://developers.google.com/apps-script/guides/html/communication), [ámbitos OAuth](https://developers.google.com/apps-script/concepts/scopes).
