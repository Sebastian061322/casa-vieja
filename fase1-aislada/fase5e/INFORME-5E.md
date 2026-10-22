# Fase 5E — avance verificado al 22 de octubre de 2026

Estado: laboratorio en validación, sin activación comercial. Rama dev/fase1-estabilizacion. Fuentes publicadas en 4c2a04c5b43858db32d9e130e2590c25b92d6522; primera evidencia en 1ea579a1decf81d349f3be5248b674ce39325cee. Apps Script sintético versión 2 y Worker 37306312. La corrección visual posterior fue autorizada, publicada en de17516f69b0e7ef5ceca3270e13d779bcf7a2e6 y desplegada; siete rechazos públicos y tres activos por hash aprobados. No se modificó main, index.html comercial, Apps Script productivo, BaseDatos_CasaVieja ni historial anterior.

## Resultados concretos

| Comprobación | Resultado y alcance |
|---|---|
| Respuesta perdida real | COMMITTED en Google, respuesta retenida por Worker, navegador PENDING sin éxito anticipado. Reapertura por el propietario, mismo pedido reservado y sin pendientes; una sola reserva al releer Google. |
| Última unidad en dos equipos | Computadora/Safari con gerente e iPhone/Safari con vendedor, identidades autenticadas distintas. Una reserva y un rechazo INSUFFICIENT_STOCK; físico 1, reservado 1, disponible 0. |
| Reintento posterior | El propietario confirmó el mismo pedido en iPhone, cero pendientes y disponibilidad 0 tras Sincronizar. La resincronización del pedido con ACK retenido tampoco añadió efectos. |
| Integridad Google | Última lectura: 266 filas del diario, 181 movimientos, revisión 128 y cero PREPARED incompletos. Reconstrucción independiente aprobada. |
| Restauración Google separada | Archivo ficticio restaurado en cuatro pestañas nuevas de la hoja de recuperación existente, sin editar sus tres pestañas previas; lectura posterior y hashes correctos. Interrupción y reanudación verificadas. |
| Acceso vigente | Gerente: ocho comprobaciones. Vendedor: once. Administrador: repetición 5E todavía pendiente. Siete rechazos públicos y tres activos verificados por SHA256. |
| Pruebas locales | 438 aprobadas, cero fallos en el candidato más reciente: 429 iniciales, cinco de transporte de recuperación y cuatro de interfaz. La corrección está desplegada; falta su comprobación visual autenticada. |

No se equipara un ensayo físico con una simulación. Los dos envíos físicos estuvieron separados por 2819 ms según los comandos recibidos; no se midió el solapamiento exacto del ScriptLock. La identidad autoritativa y la hora del servidor se comprobaron en audit, no en el campo responsible declarado por el navegador.

## Dónde se almacena la información

| Capa | Datos y protección |
|---|---|
| Google Identity | Identidad individual verificada de las tres cuentas autorizadas; no se comparten contraseñas en el código ni en el chat. |
| Cloudflare Worker del laboratorio | Interfaz y pasarela. Verifica identidad y origen; firma la comunicación al backend. HMAC en secreto del proveedor, no en archivos públicos. |
| Apps Script aislado | Valida firma, caducidad, repetición y permisos backend; usa ScriptLock y restringe el destino a la hoja sintética autorizada. |
| Google Sheets sintético | Diario y movimientos durables. Los saldos se reconstruyen; el navegador no fija existencias absolutas ni costos autoritativos. |
| IndexedDB de cada perfil | Comandos originales, borradores, recibos y rechazos conservados. Proyecciones financieras gerenciales pasan a memoria; no se eliminan las colas. |
| Hoja de recuperación TEST_ONLY | Cuatro pestañas 5E separadas contienen diario, movimientos, copia integral ficticia por fragmentos y eventos de verificación. |

La arquitectura sigue Google Identity → Worker → HMAC → Apps Script → Sheets. Los vendedores no reciben acceso directo a las hojas. El acceso de red Cualquiera del endpoint no equivale a autorización comercial: se exige la firma y la identidad autorizada. Un atacante puede consumir cuota enviando tráfico inválido; no se promete disponibilidad absoluta.

Permanece amplio el permiso OAuth de Sheets concedido al proyecto propietario. La guarda del ID limita el código normal, pero no reduce el alcance OAuth. Las colas y borradores necesarios aún pueden contener información sensible; no se implementó cifrado. Mantener equipos/perfiles separados y protegidos por persona, como decidió el propietario.

## Recuperación de confirmación comprobada

Pedido TEST_ONLY_5E_ACK_GOOGLE_20261022_01, operationId 8ba1180c-36c6-46bf-9e28-df64a1f4eb2c, recibo revisión 127 y saleId future:9c63873a-27a9-499a-accf-c3438c2a0e41. Google conservó un PREPARED, un COMMITTED y un movimiento SALE_RESERVATION, cantidad física 0 y reserva +1.

El navegador mostró WORKER_ACK_WITHHELD y PENDING sin recibo comercial. El propietario reabrió la pestaña y comunicó RECOVERED_COMMITTED_BY_STATUS; se corroboró por interfaz el mismo cliente, reservado y sin pendientes, y se releyó el único recibo/movimiento en Google. La pestaña inspeccionada tras el reingreso terminó en validation=5d, por lo que el texto de recuperación procede del reporte del propietario y no de una captura automatizada del panel de ensayo. No se reinició todo Safari. La automatización restauró inicialmente una ventana auxiliar de Google; su reenvío de formulario fue cancelado y no cuenta como ensayo exitoso.

## Última unidad física

El iPhone confirmó 14a921bb-8467-4c8e-aa43-112160eb62b8, revisión 128. La computadora recibió rechazo definitivo 717b5160-89c1-4eda-9d6a-ea1dea231b37, sin movimiento. La partida existente demo:g3-b52c5bb2-da19-4787-b799-3b6778170ccc-recovery pasó de físico/reserva/disponible 1/0/1 a 1/1/0. No se crearon productos adicionales, cobros ni despachos.

La identidad autenticada del ganador fue seller y la del rechazo operations; se comprobó que sus sujetos son distintos sin publicarlos. El diario conserva el rechazo. Se intentó archivarlo por la interfaz para mantener su evidencia, pero no se corroboró el archivo local; no se declara eliminado ni archivado. El iPhone conservó el rechazo anterior ya archivado.

## Hallazgo visual y corrección desplegada

Medio: si una sincronización ya estaba en curso, podía quedar un aviso viejo de operación pendiente después de llegar el rechazo definitivo. Además, el borrador sucio conserva sus campos y no se reconstruye automáticamente; sus etiquetas de partida podían mostrar disponibilidad anterior.

La corrección de presentation.js actualiza el aviso cuando ya no hay pendientes reales y refresca solo las etiquetas de lote desde el snapshot autenticado. No cambia lote seleccionado, cantidades, cliente, identificador ni comandos. La descarga base sigue bloqueada mientras haya rechazos sin revisar: es necesario revisarlos y archivarlos con evidencia antes de obtener un snapshot nuevo. Dos pruebas reprodujeron los defectos antes del arreglo; las cuatro nuevas y la regresión completa pasaron después. No se reescribe historial. Worker candidato SHA256 a09881983136afefb2d5a2797f88576a6d0b3181e1dfbb6b7088ccd1536e5add, desplegado como Worker 37306312 con autorización específica. Backend sin cambios.

## Rendimiento medido

Cincuenta ejecuciones reales doPost de Apps Script versión 2, 22/10/2026 entre 00:18:31 y 00:27:45 de Lima: media 2342,92 ms; mediana por rango 2142 ms; p95 descriptivo 4006 ms; máximo 5108 ms. Son ejecuciones mixtas de autenticación, consultas y operaciones; no clasificadas por acción y sin tiempo de navegador/Worker/red. Completada en la consola no significa que una operación comercial haya sido aceptada.

Consultas de snapshot de gerente: 5519, 6200 y 7101 ms de ida y vuelta; vendedor: 6165, 5860 y 6968 ms. Tres muestras por perfil no acreditan percentiles estables. Los 2,36 s de mediana y 17,245 s de p95 anteriores eran observaciones mixtas de otra capa: no existe una comparación remota equivalente que pruebe mejora. La instrumentación por correlación está desplegada, pero falta recopilar el desglose real de autenticación, Worker, bloqueo, Sheets y reconstrucción.

En Node, 30 muestras alternadas por variante con iguales resultados: 100/500/1000 ventas y 300/1500/3000 eventos. Medias de reportes antes→después: 0,635→0,334 ms; 5,556→1,558 ms; 19,365→2,883 ms. Esto solo mide cálculo sintético en memoria. El índice por pedido es efímero y no sustituye el diario.

## Restauración y sus límites

Destino existente CasaVieja_RECUPERACION_TEST_ONLY_5B. Se conservaron Control, DiarioInventarioV3 y MovimientosInventarioV3 con sus IDs originales. Solo se añadieron TEST_ONLY_5E_20261022_ARCHIVE/JOURNAL/EFFECTS/CONTROL.

Copia SHA256 b05b5de02ddddeadd342b5291849ee7796362b8ec40194fa04798567079d79e2: 25 registros de diario, 20 movimientos, siete archivos de código, configuración ficticia y una cola sintética completa. Se escribieron diez de 38 fragmentos, se detuvo el ensayo, se releyeron todas las tablas y se reanudaron exclusivamente los 28 fragmentos ausentes. La copia completa se releyó desde Google, verificó hashes y reconstruyó ocho recursos. La planificación repetida produce cero filas a escribir. Solo después se añadió un evento VERIFIED; el INCOMPLETE anterior se conserva como estado inicial del ensayo.

Se preservó el PREPARED parcial original en la copia; no se ejecutó ese comando contra la hoja restaurada ni se conectó la aplicación a ella. Su recuperación se había probado en Node sin duplicar efectos. La materialización y comprobación Google tomó 116951 ms de pared, incluyendo inspección y tareas intercaladas: no es RTO integral ni tiempo puro de escritura. No se restauraron cuentas, OAuth, HMAC, despliegues ni colas reales de celulares. No usar esta copia ficticia como respaldo comercial.

El hash esperado debe estar bajo custodia independiente del archivo para una operación real; guardarlos juntos no prueba autenticidad. Retención propuesta de 30 diarios y 12 mensuales, respaldo diario y previo a cambios, RPO de 24 horas sujeto a copia exitosa y RTO propuesto de cuatro horas siguen por aprobar, dimensionar y simular. No se creó programador.

## Archivos y evidencias

Fuentes principales: private-projections.mjs, intents.mjs, controlled-response.mjs, recovery-panel.js, integrity.cjs, recovery.cjs, report-index.js, Observability.gs, count-plan.cjs y ads-contract.cjs. Nuevas herramientas de restauración: sheet-recovery.cjs y prepare-sheet-recovery.cjs, sin llamadas de red. Los cambios de integración están en build-web.cjs, api-worker.mjs, entry.mjs y la corrección de presentation.js. El servidor ficticio serve-ui.mjs nunca se publica como backend real.

Pruebas sanitizadas: ack-google-5e.json, concurrencia-fisica-google-5e.json, restauracion-google-5e.json, permisos-google-operations.json, permisos-google-seller.json, integridad-google-5e.json, tiempos-backend-google-5e.json y resultados-red-publica-5e.json. Los JSON completos de Sheets, archivos de copia y capturas quedan privados en evidencia-local, fuera de Git. El manifiesto original conserva los hashes del paquete aprobado inicialmente; el parche tiene registro separado.

## Matriz de cierre y decisiones

| Prioridad | Estado | Condición pendiente |
|---|---|---|
| P0 integridad y reserva de última unidad | Aprobado en este fixture real | No extrapolar a todas las políticas/combinaciones comerciales. |
| P0 confirmación retenida y recuperación | Aprobado en Worker/Google + reapertura física | Reinicio completo de navegador y otras interrupciones siguen pendientes. |
| P0 restauración de datos en destino separado | Aprobado con datos ficticios | Recuperación integral de servicio, configuración real y credenciales no demostrada. |
| P0 permisos | Gerente y vendedor aprobados | Repetir administrador en 5E y verificar el paquete final de interfaz. |
| P1 interfaz | Arreglo desplegado, 438 pruebas aprobadas | Comprobar aviso/disponibilidad tras reingreso autenticado. |
| P1 rendimiento | Medidas reales y mejora de algoritmo local | Desglose correlacionado y comparación remota por acción equivalentes. |
| P1 aislamiento local | Cachés gerenciales minimizados | Verificar en perfiles/equipos; comandos y borradores sensibles no cifrados. |
| P1 dispositivos | iPhone/Safari físico y computadora probados | Android y reinicio completo no probados; no declararlos aprobados. |
| P1 respaldos operativos | Diseño y simulacro de datos | Aprobar retención/custodia y recuperar servicio completo; no hay tarea programada. |

Conteo físico: comparación propuesta por producto/lote/familia/etapa/molienda/gramaje/unidad, siempre approved=false y canExecuteAdjustments=false. No se realizó inventario real ni apertura. Cuarentena, devoluciones dañadas, bloqueo/estados de lotes, recetas adicionales, ajustes, condiciones de cobro/despacho/cancelación y Fondo requieren decisiones del propietario. Un stock diferenciado de granel ya molido o cuarentena aún no se declara implementado.

Windsor/Meta: contrato ficticio con deduplicación, revisiones retrospectivas y atribución verificada separada de estimación. Cuenta/campaña actuales consultadas solo en lectura, IDs privados fuera de Git. Windsor devolvió TRIAL/is_paid=false; no se garantiza automatización gratuita posterior. No se importaron métricas al sistema, ni se crearon tareas, ni se cambiaron anuncios/presupuestos.

## Dictamen

GO para continuar diseño y pruebas sintéticas 5F. NO-GO para automatización real 5F mientras no se confirme la viabilidad S/0 del plan efectivo y se cierre confiabilidad pendiente. NO-GO para Fase 6: faltan validación final, recuperación de servicio completo, reglas comerciales aprobadas, censo autorizado de dispositivos/orígenes productivos y respaldo real autorizado, conteo físico y apertura aprobada, y plan de escritor único. Mantener el sistema comercial actual y su historial inmutable. No se declara cerrada toda la Fase 5E.
