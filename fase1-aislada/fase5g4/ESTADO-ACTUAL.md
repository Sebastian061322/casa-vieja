# Fase 5G.4 — estado verificable al 28/10/2026

**Actualización 29/10: corrección autorizada publicada en desarrollo (6b3ff7b), Worker e571872f y Apps Script6. Catálogo habilitado en Google; apertura única, venta simple, cobro parcial/final y despacho confirmados. Tripack recuperado, última unidad PC/iPhone y reinicio sin conexión aprobados con evidencia Google. Aviso superior corregido y listado adicional publicado en Worker c82dd835; Apps Script6 intacto; aceptación del nuevo listado en Google confirmada. NO-GO comercial.** Trabajo en checkout separado casa-vieja-checkout-5g4, rama dev/fase1-estabilizacion. Este estado sustituye el checkpoint provisional; conserva informes anteriores como historia.

## A. Código

Consolidación 5G.2/5G.3 publicada y comprobada por lectura GitHub: **a6e1fe88323615010383a3c4fd2129f184235b57**, descendiente de 6578003b. Diez dependencias base contrastadas byte a byte; 15 pruebas dirigidas de consolidación. Corrección de import de prueba hacia fase2/client.js versionado; fixture 5D se genera antes de comprobarlo. Sin private, claves o logs publicados. main intacta.

Nuevo código **5G.4 publicado y verificado en GitHub**, commit **f10c5ac84d1c1f28bbb3aa73ab15de1e96fe1051**: build.cjs, backend54.gs, ui54.js, intent54.mjs, catalogue-command54.mjs, backup54.mjs y verificador de teléfono, prepare-lab.mjs, preview.mjs solo local, tests y run-regression.mjs. El commit a6e1fe8 conserva la consolidación anterior; f10c5ac incorpora esta integración.

## B. Frontend + backend

Aplicación/estilos/login originales reutilizados. Nuevo modo explícito ?engine=5g4, cola por sujeto/origen y ámbito, draftId persistente, operationId estable y recuperación por estado. Modo anterior conserva su propia cola; no se transforma ninguna cola incompatible.

Catálogo de 14 ofertas conectado, selección por bolsa/partida/molienda, precios/composición/stock validados en backend. Apertura exige dos sujetos verificados distintos y autorización de administrador del hash; no bastan nombres declarados. Continuidad muestra anticipo/saldo/cobros futuros separados. Cobros, despacho, lotes/procesos, gastos/reportes reutilizan módulos existentes en el diario aislado. Respaldo administrador y verificador cifrado sin red integrados.

Defecto detectado/corregido: formulario enviaba name a normalizador que espera customer. catalogue-command54.mjs centraliza el contrato; prueba y recorrido posterior muestran nombre correcto. Pruebas de procesamiento usan ahora el inspector que contempla reservas anteriores, en lugar del inspector5E incompatible con esas reservas; no se debilitó la validación. Se completaron fixtures históricos omitidos dentro de la copia temporal, sin reconstruir/sobrescribir fuentes originales.

## C. Pruebas separadas

| Evidencia | Versión/alcance | Resultado y límite |
|---|---|---|
| tests/regression.json | Código nuevo y regresión histórica, 77 archivos | **627/627**, cero fallos. Copia temporal sin private ni evidencia sensible, red saliente solo loopback. No Google/físicos |
| tests/ui-observation.json | Backend31ffa448 + Worker3ca709bb en navegador real/IndexedDB local | Offline simulado→recarga→misma cuenta; ACK retenido por Worker→recarga→recibo; sincronizaciones repetidas; exactamente dos pedidos. Cobro S/10+S/12, despacho único, continuidad S/25 y despacho; egreso S/1 |
| tests/worker.test.mjs | Worker compilado real + JWT RSA ficticio + HMAC + backend VM | Tres perfiles, origen inválido/sin sesión, rol falsificado, lectura financiera denegada, ámbito requerido; verificador CSP sin red |
| build/lab-config.json | Propuesta exacta de cuatro recursos/tres obligaciones | Revisión/aprobación/apertura aplicada en VM; retenido con cero disponibles, sin escribir Google |
| Remotas públicas | Worker65c061b6 / Apps Script5 | **7 rechazos sin sesión y 4 archivos públicos comparados aprobados**; tests/remote-public.json. No usan cuentas ni ejecutan comandos comerciales |
| Google autenticado nuevo | Paquete 5G.4 / administrador | Login/snapshot scoped correctos, acta exacta y una revisión COMMITTED, sin efectos de stock. Apertura sigue bloqueada con un solo revisor. Falta gerente/vendedor y batería funcional |
| iPhone/Android nuevo | Paquete 5G.4 | **No ejecutadas**. Evidencia anterior no certifica paquete nuevo |

El preseed del fixture actual no es prueba de apertura por UI; revisiones/apertura UI se recorrieron en una compilación provisional anterior, y el candidato actual se verifica por pruebas backend. Ensayos locales no acreditan reinicio físico de Safari, latencia/cuotas Google o cierre de escritores reales. La primera corrida de regresión tuvo fallos por fixtures ausentes/servidor loopback no permitido; el ejecutor prepara los fixtures en su copia temporal y la corrida final autorizada pasó. No se ocultan las corridas iniciales como aprobadas.

## D. Seguridad

Identidad/roles provenientes de Google verificado y registro backend existente; sesión/firmas/locks/idempotencia conservados. Vendedor sin costos/utilidades/acta/aprobaciones/cobros/admin; gerente sin usuarios/configuración de precios. No se fía de precio, rol, costo o identidad enviados por navegador. Apertura/políticas fijan sujeto y evidencia desde autorización del diario. Helpers privados: solo doGet/doPost/zeroRequest expuestos.

Escaneo dirigido del paquete sin coincidencias de claves privadas/tokens comunes; hashes de 26 archivos verificados. No equivale a certificación absoluta de seguridad. En la continuación de configuración la lectura automática de Safari incluyó propiedades privadas existentes; sus valores no se guardan en evidencia. HMAC y cuentas no se modificaron. Sigue el riesgo de cuotas del endpoint público; autenticación/denegaciones reales se repiten tras autorización. Equipos/perfiles separados es una condición del dueño, no cifrado completo de todas las colas locales.

## E. Censo y escritores antiguos

| Ruta/contexto | Evidencia | Estado |
|---|---|---|
| PC principal Safari comercial | Autorización limitada; sonda revisada hash38ccbfd7 comprobado | Salida manual **pendiente**, sin repetir preferencias/recargas |
| Celulares y PC socio | Alcance individual no concedido | Pendientes; no inspeccionados |
| Otros perfiles/vendedor/integraciones | Identificación incompleta | UNKNOWN |
| Pages/main y Apps Script v2/v15 | Inspección estática previa reutilizada | v2 GET lectura/POST reemplazo; v15 GET puede escribir; no se llaman ni deshabilitan |
| Editores directos/activadores/escritores adicionales | Cierre real no ejecutado | Bloqueo P0 comercial |

Instrucciones mínimas y matriz de dependencias en OPERACION-Y-VALIDACION.md y documentos5G.2. Cero colas en un equipo no demostraría cierre global. No se cierra el sistema comercial actual.

## F. Apertura, obligaciones y catálogo

Config ficticia de cuatro recursos/tres obligaciones, retenidos separados; hash del bundle **ee624c999299b925d83bc531d9dbf011a7e9b654495d62be37474e4732deeeea**. Falta aplicarla en Google mediante dos revisiones auténticas y autorización administrador. No hay acta comercial, conteo real o migración autorizada.

Catálogo público ya extraído y probado: 14 ofertas/seis mixtas; no se volvió a investigar. Ensayo con vigencia28–31/10, ninguna aprobación de noviembre. Faltan disponibilidad/asignación de lotes, crédito/cobros/despachos, cancelaciones/anticipos, ajustes/devoluciones, costos/recetas/merma y envíos fuera de Lima. S/8 al cliente Lima no es costo interno de distribución. Funciones sin política aprobada siguen bloqueadas. Los 300 kg son previsión, no recepción confirmada.

## G. Respaldos

Pack íntegro servidor/diario/efectos/configuración/apertura/hashes; AES256-GCM en navegador, SHA256 de bytes reales y verificador CSP connect-src none. Clave separada, no enviada ni guardada por servidor. Tres pruebas: exclusión de credenciales/roles, interoperabilidad/cifrado/hash/tamper y restauración interrumpida/reanudada en destino vacío simulado sin duplicar revisiones/apertura/obligaciones. Conflicto con datos posteriores bloquea.

Teléfono elegido como custodia y socio segundo responsable. Transferencia/verificación física **pendiente**. Exportación es manual y sintética, no respaldo automático ya operativo. RPO/RTO comercial no medidos; el servidor no contiene pendientes exclusivamente locales. Retención propuesta pendiente, sin automatizaciones/borrados. No se copió producción ni se restauró otro recurso remoto.

## H. Candidato técnico

No hay RC congelada/aceptada remotamente todavía. Artefactos reproducibles preparados:

- Backend SHA256 **31ffa448d69ab99c093cd203da2df7d0a5105967a0ba8c0c627d003549be3cfc**.
- Worker SHA256 **3ca709bb257dabaf0e9edbf4dff40d438a653558ec93995cea6e0071e7c5a128**.
- Config SHA256 **79cd7460836a56def08508c5d48ccbd566b696e321806e6128c5e946e24df9da**.
- Manifiesto de26 archivos SHA256 **777b3facf5647e109ffd2ab73d26f5fc05e1d2c95540b19cb3b714f43bcb84ed**.
- Commit de código: **f10c5ac84d1c1f28bbb3aa73ab15de1e96fe1051**, comprobado por lectura de ref y manifiesto en GitHub.
- Worker nuevo: **65c061b6 Active/Latest**, fuente leída del editor SHA exacto antes de Deploy.
- Apps Script nuevo: **versión5**, confirmación de implementación exitosa28/10 17:07, mismo endpoint; fuente guardada/releída SHA exacto. Sin cambiar permisos ni secretos.
- Las tres pestañas aprobadas creadas y cabeceras A1:C2 releídas: ID/Tipo/JSON y sin registros todavía. IDs154040001/154040002/154040003; las diez anteriores conservadas.
- Configuración CV completada a petición expresa posterior del propietario en Safari: cinco valores que estaban incorrectamente en NO fueron corregidos, comparados exactamente, guardados con interruptor NO y releídos; luego interruptor YES guardado y las seis releídas con coincidencia exacta. Se volvió al Editor. Lectura automática nativa incluyó propiedades privadas existentes: ningún valor privado se copia a evidencias ni se modificó. La validación funcional mediante snapshot Google aún está pendiente.

Preflight remoto ANTERIOR al despliegue, leído28/10: Worker **7c1806c8**,100%Ready, fuente **b350fe05fadd3cdc72b7b8c17637674bbc53fe84bde462dd19f47941dc5b1676**; Apps Script **versión4**, fuente **0a64a97eabf93224e407de9f491c4b8c757d5742edb7ad1db5f42d0e8b8df604**. Cloudflare **Free / Current plan**. Hoja CasaVieja_Pruebas_SINTETICA ID1CtK6KD995Pu2Fzc_na89Ajc0KQ0QLuGq3UFhj4UdLSA, diez pestañas, ninguna de las tres propuestas; Control confirma TEST_ONLY. Ese preflight fue solo lectura; después se aplicaron los cambios autorizados descritos arriba. Durante ese preflight no se abrieron propiedades privadas ni se ejecutaron funciones del editor; la continuación de configuración posterior se detalla arriba. Los seis valores CV ya se guardaron y verificaron en la continuación posterior; no se cambiaron propiedades ZERO.

## I. Autorizaciones

**Autorización única recibida28/10**: AUTORIZACION-PAQUETE.md. Código, Worker, Script y tres pestañas ya publicados; configuración guardada; ensayos autenticados pendientes. CostoS/0, sin servicios/cuentas/permisos/secretos nuevos. No incluye producción, DR ni corte.

Se pide por cita expresa de EtapaE: «Antes de realizar cualquier cambio remoto, solicita aprobación específica sobre ese paquete completo». Si aparece divergencia remota, comparar antes de sobrescribir. Si falla tras escribir nuevos registros, detener nuevo ámbito y recuperar con código compatible sin borrar diario/colas ni restaurar versiones de datos antiguas.

## J. Dictamen y publicación

**GO local para solicitar despliegue de laboratorio. NO-GO de aceptación técnica remota/RC congelada. NO-GO comercial.** La fecha1/11 no activa nada.

El propietario confirmó cero pendientes en todos los contextos usados antes del despliegue. Para aceptar el laboratorio faltan pruebas Google autenticadas/dispositivos/custodia con evidencia. Para publicar comercial faltan además censo completo, políticas/catálogo vigentes, conteo/acta física/obligaciones aprobadas, respaldo comercial expresamente autorizado y verificado, cierre efectivo de todos los escritores con intervalo NONE y autorización independiente de apertura/nuevo escritor. El procedimiento existente prohíbe reapertura automática del antiguo después de nuevos movimientos.

## Handoff operativo

Checkout activo casa-vieja-checkout-5g4; código f10c5ac remoto. Documentación/evidencia posterior se publica aparte sin cambiar los artefactos autorizados. Preview local actual8800, exec46265, tab11 vendedor (dos pedidos confirmados) y tab12gerente (gasto confirmado), JWT/hojas ficticios; no desplegar preview.mjs. Provisionales8797/8798/8799 detenidos, sus tabs antiguas no son entregable. Preflight IAB tab7Scriptlectura/tab9Workereditorlectura/tab10Free. Publicación autorizada realizada. Tab7 Editor del Script y tab9 Worker65c061b6; no volver a pegar/desplegar para ingresar las seis propiedades. No leer propiedades privadas hasta que el propietario regrese a Editor. HMAC no se modificó; la lectura automática del formulario se documentó sin conservar su valor.

### Continuación — ayuda de configuración solicitada por propietario

Se corrigieron las cinco propiedades que tenían NO en lugar del JSON/hash; seis coincidencias exactas verificadas antes y después de guardar, scopeYES. Safari volvió al Editor y se abrió una pestaña nueva del laboratorio ?engine=5g4, sin ejecutar ventas o apertura. El botón Google devolvió error de accesibilidad; captura nativa quedó en blanco. Se pidió al propietario pulsar Acceder con Google y confirmar Administrador principal o error. No intentar manejar TouchID/contraseñas. Autenticación funcional Google5G.4 aún no aprobada. La pantalla de propiedades devolvió automáticamente campos privados en AX: no repetir/reutilizar valores ni guardarlos en documentos. No afirmar que no se leyeron propiedades privadas en esta continuación; no se modificaron secretos/cuentas.

### Google5G.4 — administrador y bloqueo externo de la segunda cuenta

Acceso administrador confirmado por propietario y observado en Safari. Snapshot scoped devolvió propuesta exacta de cuatro filas (físico4/2/4/4, reservado1/0/0/0, disponible3/0/4/4); retenidoHELD sin disponibilidad. Primera revisión TEST_ONLY_5G3_53593990-422c-4b48-8f41-34fdc0ac052f registrada una vez: PREPARED+COMMITTED, revisión1, auditroleadministrator y sujetoGoogle verificado. HojaMovimientos nueva conserva únicamente cabecera. UI terminó confirmada y sin pendientes; autorización y aplicación bloqueadas hasta segunda cuenta. Evidencia tests/administrator-google-5g4.json sin identidad cruda.

Gerente en esta computadora tiene confirmación de identidad Google pendiente; no se cuenta como error de configuración/app. El titular completará el acceso desde otro equipo donde ya tiene sesión iniciada. Se pidió allí abrir únicamente laboratorio ?engine=5g4, verificar perfil/acta y registrar una revisión. Espera respuesta; no duplicar revisión ni aplicar apertura hasta comprobar ambas identidades en diario. No cambiar cuentas/roles, recuperar contraseña o retirar segundo factor desde automatización.

### Contraste de la segunda revisión

El titular reportó una confirmación en la laptop; dos lecturas acotadas del diario siguieron mostrando una sola revisión COMMITTED. Al comprobar el encabezado, el titular confirmó que esa pantalla decía Administrador principal. No se contó como revisión de operations ni se autorizó/aplicó apertura. Se indicó cerrar solo la sesión de Casa Vieja y seleccionar expresamente la cuenta ya autorizada del gerente; espera confirmación del perfil correcto. Ninguna cuenta o permiso se cambió.


### Continuación 28/10 — apertura confirmada y catálogo bloqueado

Este hito sustituye los pendientes de segunda revisión/apertura de los apartados anteriores. Dos identidades Google distintas verificadas (administrator y operations) revisaron el mismo hash. El administrador autorizó y aplicó la apertura TEST_ONLY una sola vez: revisión4, ocho filas de diario (cuatro PREPARED + cuatro COMMITTED), cuatro movimientos y tres obligaciones anteriores separadas. Evidencia saneada: tests/opening-google-5g4.json. Ninguna venta Google nueva ejecutada. No aplicar otra apertura.

Las seis propiedades CV se releen exactamente correctas; el código guardado de versión5 coincide con SHA31ffa448. Pese a renovar el acceso y sincronizar, el propietario confirma «Catálogo sin habilitar». La composición de la respuesta HTTP y el hash del catálogo requieren comprobación remota adicional; no se atribuye una causa definitiva al charset de Google. Ejecución de diagnóstico doGet en editor finalizada y breakpoint retirado, sin cambios de código ni escrituras comerciales.

Se prepara en catalogue-fix un candidato independiente, todavía NO aprobado, NO publicado y NO desplegado. Incluye contrato HTTP explícito, hash UTF8 solo para catálogo, diagnóstico sin secretos exclusivo de administrador y bloqueo de despacho nuevo sin pago cuando no hay política de crédito aprobada. Este último defecto sí se reprodujo contra la versión anterior local. Regresión final633/633 (78 archivos); primer intento632/633 con un test impedido por el permiso del puerto, repetición autorizada633/633. UI local/IndexedDB muestra14ofertas, una reserva S/22, despacho bloqueado antes de pago, cobro confirmado y despacho único después. No equivale a aceptación Google/física del parche.

Permanece activo Worker65c061b6/Apps Script5. No se modificaron secretos ni configuración ZERO en esta continuación. Aceptación remota integral/RC congelada y producción: NO-GO. Siguiente paso: aprobar paquete exacto catalogue-fix/AUTORIZACION-PAQUETE.md; después verificar catálogo en Google antes de nuevas ventas sintéticas. No incluye corte, cambios productivos, DR, nuevos recursos o pagos.


### Publicación autorizada de la corrección y primer flujo Google

El propietario aprobó expresamente el nuevo paquete bd4e253c/02987129. Commit6b3ff7b publicado en dev/fase1-estabilizacion y referencia releída mediante conector GitHub. Worker e571872f Active/Latest; fuente comparada antes de Deploy. Apps Script misma implementación, versión6; código de esa versión releído en Historial y hash completo bd4e253c9092654511935b441ff9d513b849e12d5017daf5bf62e9ca86f74f56 contrastado. Se actualizaron/releyeron únicamente los dos hashes CV de versión; no se abrieron valores ZERO. Siete rechazos públicos y seis recursos públicos comparados aprobados (catalogue-fix/tests/remote-public.json).

Catálogo habilitado confirmado por propietario y observado en UI nativa. Venta TEST_ONLY_5G4_SIMPLE_G250_01: S/22, costo histórico S/5, reserva una bolsa G250; cobros S/10 y S/12 sin efectos de inventario; despacho único -1 físico/-1 reservado con control de crédito versionado. UI bloqueada antes y después del pago parcial; habilitada con saldo cero y deshabilitada tras despacho. Sincronizar repetido mantuvo ocho operaciones confirmadas y16filas de diario, sin duplicar venta/cobros/despacho. La apertura anterior y sus tres obligaciones permanecen separadas. Evidencia saneada catalogue-fix/tests/deployment-google.json; no contiene sujetos Google.

La sesión del administrador venció al intentar el Tripack después de la interrupción de la sesión de trabajo. La lectura de Google seguía en revisión8: no crear pedido sustituto. Se renovó Google con la misma cuenta y se pidió al propietario Ventas/Sincronizar una vez para recuperar el intento original. El iPhone informa Vendedor y cero pendientes en ?engine=5g4. No se ha ejecutado aún concurrencia entre equipos ni aprobado física/funcionalmente todo el paquete. Costo S/0; producción y main intactos. Estas evidencias no congelan una RC ni autorizan corte.


### Aceptación operativa Google y dispositivos — 29/10

Tripack recuperado una vez tras reingreso: revisión9, tres bolsas MonteAlto500, total14000/costo6000. PC administrador y iPhone vendedor solicitaron el mismo DúoEncuentro500 (8500) de la última bolsa MonteAlto: iPhone COMMITTED revisión10; PC REJECTED INSUFFICIENT_STOCK. Rechazo con cero efectos, archivado con recibo del servidor; dueño confirmó iPhone mismo pedido, cero pendientes y stock disponibleMonte0/Gourmet5002. Efectos únicos, ningún prefijo negativo o sobre-reservado. Evidencia catalogue-fix/tests/last-unit-google.json. Las pulsaciones seguidas las realizó el propietario; no se presenta como medición instrumental de simultaneidad exacta.

Continuidad sintética: cobro2500 revision11, conservando anticipo1000; despacho futurorevision12, -1 físico/-1 reservado, sin nuevos eventos de venta, ingreso o COGS históricos. UI saldo0, anticipo10/cobrosposteriores25 y despacho deshabilitado tras confirmar. catalogue-fix/tests/continuity-google.json.

iPhone/Safari: dueño registró un PENDING sin internet, cerró completamente Safari, reconectó y reabrió la misma pestaña/cuenta. Mismo cliente TEST_ONLY_5G4_RESTART_IPHONE_01 recuperado una vez, COMMITTED revisión13; sincronización repetida mantiene pedido, cero pendientes y Gourmet2502disponibles. Confirmado en Sheets:27filas,13COMMITTED,1REJECTED,11movimientos únicos. Físico/reservado/disponible: Gourmet5003/1/2, retenido2/0/0, Monte5004/4/0, Gourmet2503/1/2. catalogue-fix/tests/restart-iphone-google.json. Ninguna operación productiva.

Aviso superior obsoleto PENDING pese a rechazo/recuperación es incidencia visual media confirmada. Nuevo ajuste status-fix espera la misma sincronización entre llamadas concurrentes y deriva avisos de la cola real sin inventar éxito.640/640 locales80archivos y recorrido local offline→reconexión→rechazo→archivo. Worker candidato cf780ac29bbe21f45c3a5ebdd7d94de43c62ee9b16cb854e4c2fb1f05019cba3 aprobado expresamente para desarrollo/Worker y una propiedad CV de hash, sin backend o despliegue de Apps Script. Su publicación/aceptación remota se registra aparte; no presentar640como pruebas físicas o código ya activo antes de contrastar versión.

Quedan procesamiento/molienda/empaque/gasto y reportes Google del nuevo ámbito, pérdida de ACK5G4, custodia cifrada en teléfono, regresión física Android pertinente, matriz de cuentas según equivalencia/cambios y políticas/censo/conteo comerciales. No declarar fase/RC íntegramente aprobadas. Tope original40 operaciones:13confirmadas+1rechazada hasta este hito; no reiniciar cupo ni abrir otro inventario.


### Ajuste visual publicado — comprobación posterior pendiente

Commit b81f4c0fe7d7bac51370c0e3831e15ce1b1531da publicado en desarrollo y referencia GitHub releída. Worker bc323432 Active/Latest y SHA cf780ac29bbe21f45c3a5ebdd7d94de43c62ee9b16cb854e4c2fb1f05019cba3 contrastado antes de Deploy. Únicamente CV_5G4_WORKER_SHA256 actualizado/releído; hash backendbd4e253c permanece igual. Sin nueva implementación o edición de código Apps Script. Siete rechazos públicos y seis archivos públicos correctos en status-fix/tests/remote-public.json.

PC estaba sin pendientes y con rechazo archivado antes de recargar. Se renueva acceso administrador; pendiente observar interfaz cargada. Se pidió al propietario recargar iPhone ?engine=5g4, ingresar mismo Vendedor y sincronizar una vez, comprobando los dos pedidos LAST_IPHONE_01/RESTART_IPHONE_01, cero pendientes y ausencia de aviso obsoleto. No crear nuevos pedidos para comprobar la actualización. Aceptación visual remota todavía no cerrada.


### Segundo caso de interfaz — versión exacta posterior

En bc323432 el rechazo controlado TEST_ONLY_5G4_UI_REJECT_01 terminó REJECTED INSUFFICIENT_STOCK, sin efectos; aviso superior correcto. Con un rechazo archivado anterior, el listado inferior era sobrescrito por una vista previa de archivo y faltaba el botón del rechazo nuevo. La segunda sincronización lo mostró y permitió archivarlo con evidencia: PC0pendientes/2archivados. Diario28filas,13COMMITTED/2REJECTED,11movimientos;27filas anteriores idénticas. Ver status-fix/tests/google-rejection-with-archive.json. El iPhone conservó ambos pedidos después de recargar. No se cuenta el paquete anterior como cierre de interfaz íntegro.

queue-view-fix corrige solo el render de cola: lectura actual después de sincronizar, prioridad de los elementos activos sobre archivos previos, escape de metadatos.645/645 locales82archivos. Recorrido local real con primer rechazo/archivo y segundo rechazo: botón visible sin sincronización adicional; luego ambos archivos conservados. No cambia persistencia, backend, identidad o API. SHA766f8682deacc69de92a053462be2b10532aafa5b9ce6deda0c2af081697eecf aprobado por propietario. Worker c82dd835 Active, hash verificado antes de Deploy y única propiedad CV de Worker actualizada/releída. Apps Script sigue versión6/hashbd4e253c sin edición/despliegue. Pendiente contraste remoto de archivos y caso nuevo de rechazo con dos archivos previos; no repetir pedidos anteriores.


### Reanudación verificada — 31/10

El listado c82dd835 se verificó en Google: el rechazo nuevo aparece con su botón de archivo sin una segunda sincronización, pese a dos rechazos previos conservados. Tras archivarlo, PC sin pendientes y tres rechazos conservados. Evidencia queue-view-fix/tests/google-result.json; no cambió el backend6.

Lectura acotada de los diarios sintéticos confirma RECEIVE_LOT (revisión14) y MILL (revisión15), exactamente una confirmación cada uno. No se reenvió el pilado tras la interrupción. Diez kilos ficticios = ocho kilos verdes + dos de merma; costo10500c + proceso1000c =11500c. Los15 movimientos son únicos, coinciden con los planes confirmados y no presentan prefijos físicos/reservados inválidos. Estado33filas:15COMMITTED,3REJECTED,18intentos del máximo40 autorizado. Evidencia tests/processing-google.json. Son cantidades de laboratorio, no rendimientos ni inventario comercial aprobado.

La ventana anterior del laboratorio ya no está disponible en Safari; se solicitó abrir el mismo ámbito como administrador para continuar tostado/molienda/insumos/envasado. No se interactuó con la tarea de Meta visible. Continúan pendientes las demás verificaciones remotas y custodia: fase completa y transición comercial NO-GO.


### Procesamiento completo del ensayo y gasto — 31/10

Se reanudó la misma sesión de administrador. ROAST revisión16 y GRIND revisión17 confirmados una sola vez. Recepciones de cuatro BAG500 (200c) y cuatro LABEL (40c), revisiones18/19; PREPARE_BAGS revisión20 consume2050g, cuatro empaques y cuatro etiquetas, produce cuatro bolsas500g y registra50g de merma. Cada etapa conserva lote/familia y sus costos. Resultado del escenario:4250g a granel +2000g en bolsas +3750g de merma =10000g recibidos. Valor9445c a granel +4795c en bolsas =14240c de adquisición/procesamiento/materiales.28movimientos únicos, todos contrastados con planes confirmados; sin prefijos negativos o reservas excesivas. UI confirma cuatro bolsas disponibles,4250g a granel, materiales0 y cero pendientes/tres rechazos archivados. tests/processing-google.json.

RECORD_EXPENSE revisión21:100c PUBLICIDAD ficticia pendiente de pago, cero movimientos. Reporte observado de octubre:pedidos26900c, ingreso por despachos2200c, cobros4700c, cuentas por cobrar27700c, COGS500c, margen1700c, gasto100c, resultado1600c. Las compras y procesos no se restaron de nuevo como gasto. tests/expense-reports-google.json.24intentos del máximo40; no reiniciar el cupo.

Pendiente de integración: las bolsas nuevas existen en inventario, pero ventas filtra las partidas mediante resourceLines54, derivadas de las asignaciones explícitas de catálogo. El ensayo aprobado solo asigna cuatro partidas de apertura. No se autoriza vender una partida nueva por deducir su nombre, ni confundir Especialidad con Monte Alto. Antes de declarar el flujo completo recepción→venta listo debe resolverse la asignación comercial prospectiva, con evidencia y aprobación del paquete remoto correspondiente.

Se dejó Respaldo sintético abierto y se solicitó al titular generar/guardar archivo cifrado y hash en el teléfono, conservando clave separada y privada. No registrar custodia ni recuperación como aprobadas hasta comprobarlas. No hubo nuevos despliegues, cambios de permisos o producción en esta reanudación.


### Respaldo bloqueado observado — 31/10

Al ayudar con las descargas se observa BACKUP_HASH_MISMATCH en el laboratorio; no hay enlaces de archivo válido. Custodia y recuperación física siguen sin aprobar. Candidato local backup-fix: adaptador UTF8 exclusivo del empaquetador, conservando huellas históricas y verificación del navegador. La causa remota no está aislada; un modelo de distinta codificación reproduce el rechazo, pero no prueba el charset real de Google. SHA candidato203e16feb5dffb5360fa2eee96d07d931efd8480ab4416a67dd30be655a306d5. No publicado/desplegado: necesita autorización específica EtapaE, detallada en backup-fix/AUTORIZACION-PAQUETE.md. Worker y backend activos permanecen c82dd835/versión6. No intentar forzar ni omitir integridad, ni declarar descargado un respaldo inexistente.

### Fase 5G.5 · 03/11

HEAD inicial de desarrollo contrastado en GitHub: 10b4cd6ec37fa84f3480c3530c7b969879b510d6. Candidato de respaldo publicado en desarrollo en 6fbb6e0985a4ee878e1a19c33849d43c192b4348. Manifiesto cotejado y seis pruebas dirigidas repetidas con éxito. Regresión previa del mismo paquete: 651/651. Backend activo al último contraste: versión 6, bd4e253c. Worker activo c82dd835, 766f8682. La implementación de AUTH está pendiente de aprobación específica y prueba en Google. Descarga, descifrado del archivo real de laboratorio y custodia física pendientes.

| Función antigua (lectura estática de main/index.html) | Función 5G.4 | Problema | Mejora 5G.5 |
|---|---|---|---|
| Dashboard, Ventas, Egresos, Entregas, Clientes, Inventario | Menú por perfil, pedidos y operaciones | Falta confirmar recorrido completo en los tres perfiles de la misma versión | Conservar navegación y permisos existentes |
| Venta individual y combo con molienda y lote | Catálogo fijo, cantidad y asignación por bolsa | El formulario empezaba por el pack y pedía la zona antes de seleccionar partidas | Cliente primero, zona después de las partidas y subtotal destacado |
| Selector de lotes en combos | Etiqueta con molienda, lote y saldo | Seleccionar la misma partida varias veces podía superar el saldo visible antes de enviar | Advertencia y botón bloqueado por demanda acumulada |
| Clientes agrupados por teléfono e historial | Nombre en pedido y vista Clientes | Recompra y selección por identidad pendientes | No inferir identidad por nombre |
| Inventario y preparación por lote | Inventario por etapa y diario por lote | La partida nueva preparada requiere asignación de catálogo y vigencia de ensayo | Validación local de la asignación Gourmet molido 500 g y del precio sintético S/40. Pendiente configuración exacta aprobada |
| Entregas, historial, egresos y dashboard | Cobro, despacho y reportes derivados del diario | Faltan filtros gerenciales por producto/lote y revisión móvil conjunta | Conservar evidencia por lote y cobro separado de ingresos |

Candidato local de interfaz: ux55/build/worker-bundle.mjs, SHA256 344d3b2cd3ac57e66313df4ef6d3c78eb00ab9abf10c345bcbb8580d23c47d9c. Las dos variantes del formulario compilan y pasan comprobaciones dirigidas de orden y saldo agregado. No es la versión publicada. Falta recorrido en navegador y regresión de cierre antes de congelar una RC.

| Recorrido | Evidencia reutilizada de 5G.4 | Pendiente de 5G.5 |
|---|---|---|
| 1. Inicio de sesión | Roles verificados en pruebas técnicas, acceso de administrador en Safari | Menú y permisos de los tres perfiles en el candidato |
| 2. Pedido simple | Reserva Google por S/22 | Confirmar nueva interfaz |
| 3. Pedido combinado | Tripack recuperado y Dúo con competencia por última bolsa, PC/iPhone | Recompra y envío según política en el candidato |
| 4. Lotes activos | Procesamiento y disponibilidad en Google | Selección comercial de partida nueva |
| 5. Cobro y despacho | Dos cobros, S/10 y S/12, y despacho único en Google | Confirmar estados en versión candidata |
| 6. Rentabilidad | Ingreso S/22, costo S/5 y margen S/17 contrastados | Filtros y recorrido en versión candidata |
| 7. Sin conexión | Reinicio físico de Safari iPhone, mismo recibo | Confirmar compatibilidad del candidato |
| 8. Móvil | Pedido y recuperación desde iPhone | Recorrido completo por ventas, lotes y pedidos |

Estado: laboratorio operativo para las funciones verificadas en 5G.4. NO-GO técnico para congelar RC por respaldo remoto, catálogo y recorridos pendientes. NO-GO comercial por censo, custodia/recuperación, catálogo/políticas, conteo y obligaciones, y cierre autorizado de escritores. El lote previsto de 300 kg requiere pesos, conteo y documentos reales.

### Fase 5G.6 · validación del candidato móvil

HEAD remoto y local al inicio coinciden en 6fbb6e0985a4ee878e1a19c33849d43c192b4348. Backend candidato de respaldo 203e16feb5dffb5360fa2eee96d07d931efd8480ab4416a67dd30be655a306d5 y Worker UX 344d3b2cd3ac57e66313df4ef6d3c78eb00ab9abf10c345bcbb8580d23c47d9c cotejados localmente. Actualizaciones remotas pendientes de aprobación. El último estado verificado de despliegue sigue siendo AUTH6 y Worker c82dd835. Las colas en todos los dispositivos y la implementación de AUTH deben contrastarse antes de aplicar el paquete.

Simulador en navegador con datos ficticios, Worker compilado y backend VM: cliente primero, lote y molienda visibles, subtotal S/22, botón bloqueado con cinco bolsas de una partida con cuatro y reserva confirmada para una bolsa. Acceso con las tres identidades ficticias, menú básico del vendedor y menú ampliado del administrador observados. A 390 px el formulario mide 328 px. El pequeño desborde medido corresponde al control de desconexión del simulador. No es prueba de Google, de iPhone/Android físicos ni del acceso instalado. El selector ficticio del simulador requirió recarga al cambiar de sesión.

Dos controles dirigidos nuevos aprobados en ux55/worker.test.mjs. El HTML de entrada y el verificador de respaldo coinciden con el Worker base. El manifiesto del paquete está en ux55/manifest-files.json. En una actualización futura del Worker se debe cotejar el código activo, publicar exactamente el candidato y actualizar CV_5G4_WORKER_SHA256 para identificar el respaldo. Reversión a c82dd835 y a su hash anterior. Costo adicional S/0.

En los ocho recorridos, el login de tres identidades y la reserva individual tienen evidencia local nueva, y el selector de lote se revisó en el formulario. Para pedidos combinados, cobro/despacho, margen y recuperación se mantiene la evidencia anterior anotada en la matriz. La aceptación física del candidato y del acceso desde pantalla de inicio queda pendiente. Usar la URL del laboratorio con ?engine=5g4 y una cuenta Google individual autorizada. Etiquetar el acceso directo Casa Vieja · Laboratorio. El acceso directo del sistema comercial anterior es otro destino.

Dictamen: GO para demostración local. NO-GO de aceptación remota de 5G.6 y NO-GO comercial hasta verificar respaldo y custodia, catálogo vigente y partida vinculada, censo y cierre de escritores, inventario físico y obligaciones. La base TEST_ONLY es exclusiva del ensayo.

### Implementación comercial final · 04/11

HEAD local inicial 6eadd73 y remoto 6fbb6e0. Lectura estática de renderVentas, toggleComboMode, renderComboRows, renderAds, addAdSpend, renderDashboard, renderClientes e inventario. El candidato local reutiliza el flujo de pedido del diario y reemplaza la selección visible de oferta por botones Gourmet, Monte Alto y Mixto. Los packs salen de la composición del catálogo. Las presentaciones unitario/dúo/trío sin precio aparecen deshabilitadas. El backend conserva la autoridad sobre catálogo, stock y confirmación.

La vista Ads para perfiles gerenciales registra mediante el formulario RECORD_EXPENSE existente y consulta los eventos PUBLICIDAD del mismo diario. Filtros de fecha y campaña, inversión, mensajes y costo por mensaje. El comprobante enlaza ambos módulos. No hay un segundo asiento de gasto ni atribución automática. Plataforma/cuenta/anuncio estructurados, correcciones con historial y atribución siguen pendientes. Prueba local en navegador: S/25, diez mensajes y S/2,50 por mensaje. Capturas venta-local.jpg y ads-local.jpg conservadas localmente.

Candidato Worker SHA256 31b5741550e62a17575640a0cb9170c3c21b5c60b3ca290671774614cfa63a41. Nueve controles dirigidos aprobados en esta continuación, incluidos seis del respaldo. El candidato conserva las respuestas de seguridad comprobadas y los recursos del verificador. Regresión final pendiente. El paquete no se ha desplegado. Manifiesto en comercial-final/manifest-files.json. Una futura actualización de Worker de laboratorio debe publicar ese artefacto y registrar su hash en CV_5G4_WORKER_SHA256. Reversión al Worker c82dd835 y su hash. Costo adicional S/0.

| Recorrido solicitado | Evidencia |
|---|---|
| Reabrir sesión y cerrar voluntariamente | Cierre observado en simulador. Sesión renovable y persistencia en dispositivos físicos pendientes |
| Gourmet unitario | Reserva S/22 comprobada en el candidato anterior. Pendiente con los botones nuevos |
| Pack Monte Alto | Selector de tripack, tres bolsas y subtotal S/140 observados localmente. Registro pendiente |
| Mixto | Dúo, dos líneas y subtotal S/85 observados. El fixture del vendedor no ofreció partida Monte Alto elegible. Registro pendiente |
| Descuento | Pendiente política aprobada y autorización backend por operación |
| Ads | Gasto y costo por mensaje confirmados por el simulador local |
| Stock, lotes y margen | Selector local y evidencia previa de saldo, despacho y costo. Filtros gerenciales por producto/lote pendientes |
| Recuperación desde teléfono | Evidencia 5G.4 de iPhone. Pendiente con el candidato nuevo |

Quedan pendientes pedidos con varias ofertas en una operación, identidad verificada de cliente y recompra, y sesión renovable revocable. El Worker actual exige token Google vigente. La reautenticación sigue siendo el mecanismo de acceso. Antes de configurar un almacén de sesiones se requiere un recurso y paquete aprobados. No se ha aprobado el despliegue de AUTH de respaldo 203e16fe. NO-GO para aceptación remota del candidato y para producción.
