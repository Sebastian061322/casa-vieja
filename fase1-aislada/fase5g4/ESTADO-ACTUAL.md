# Fase 5G.4 — estado verificable al 28/10/2026

**Paquete autorizado publicado en desarrollo, Worker65c061b6 y Apps Script5. Configuración manual pendiente; todavía sin aceptación funcional remota. NO-GO comercial.** Trabajo en checkout separado casa-vieja-checkout-5g4, rama dev/fase1-estabilizacion. Este estado sustituye el checkpoint provisional; conserva informes anteriores como historia.

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
| Google autenticado nuevo | Paquete 5G.4 | **0 pruebas funcionales nuevas**. Configuración personal todavía pendiente |
| iPhone/Android nuevo | Paquete 5G.4 | **No ejecutadas**. Evidencia anterior no certifica paquete nuevo |

El preseed del fixture actual no es prueba de apertura por UI; revisiones/apertura UI se recorrieron en una compilación provisional anterior, y el candidato actual se verifica por pruebas backend. Ensayos locales no acreditan reinicio físico de Safari, latencia/cuotas Google o cierre de escritores reales. La primera corrida de regresión tuvo fallos por fixtures ausentes/servidor loopback no permitido; el ejecutor prepara los fixtures en su copia temporal y la corrida final autorizada pasó. No se ocultan las corridas iniciales como aprobadas.

## D. Seguridad

Identidad/roles provenientes de Google verificado y registro backend existente; sesión/firmas/locks/idempotencia conservados. Vendedor sin costos/utilidades/acta/aprobaciones/cobros/admin; gerente sin usuarios/configuración de precios. No se fía de precio, rol, costo o identidad enviados por navegador. Apertura/políticas fijan sujeto y evidencia desde autorización del diario. Helpers privados: solo doGet/doPost/zeroRequest expuestos.

Escaneo dirigido del paquete sin coincidencias de claves privadas/tokens comunes; hashes de 26 archivos verificados. No equivale a certificación absoluta de seguridad. No se leyeron propiedades secretas. HMAC y cuentas se conservan. Sigue el riesgo de cuotas del endpoint público; autenticación/denegaciones reales se repiten tras autorización. Equipos/perfiles separados es una condición del dueño, no cifrado completo de todas las colas locales.

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
- Configuración CV: pendiente de ingreso personal; la automatización no abrió pantalla de propiedades para no leer secretos. Guía local configuracion-para-propietario/LEER.md abierta/verificada en Editor de Texto. El nuevo ámbito todavía no se da por habilitado ni validado.

Preflight remoto ANTERIOR al despliegue, leído28/10: Worker **7c1806c8**,100%Ready, fuente **b350fe05fadd3cdc72b7b8c17637674bbc53fe84bde462dd19f47941dc5b1676**; Apps Script **versión4**, fuente **0a64a97eabf93224e407de9f491c4b8c757d5742edb7ad1db5f42d0e8b8df604**. Cloudflare **Free / Current plan**. Hoja CasaVieja_Pruebas_SINTETICA ID1CtK6KD995Pu2Fzc_na89Ajc0KQ0QLuGq3UFhj4UdLSA, diez pestañas, ninguna de las tres propuestas; Control confirma TEST_ONLY. Ese preflight fue solo lectura; después se aplicaron los cambios autorizados descritos arriba. No se abrieron propiedades privadas ni se ejecutaron funciones del editor. Los valores TEST_ONLY de las seis claves CV esperan intervención del propietario.

## I. Autorizaciones

**Autorización única recibida28/10**: AUTORIZACION-PAQUETE.md. Código, Worker, Script y tres pestañas ya publicados; configuración/ensayos autenticados pendientes. CostoS/0, sin servicios/cuentas/permisos/secretos nuevos. No incluye producción, DR ni corte.

Se pide por cita expresa de EtapaE: «Antes de realizar cualquier cambio remoto, solicita aprobación específica sobre ese paquete completo». Si aparece divergencia remota, comparar antes de sobrescribir. Si falla tras escribir nuevos registros, detener nuevo ámbito y recuperar con código compatible sin borrar diario/colas ni restaurar versiones de datos antiguas.

## J. Dictamen y publicación

**GO local para solicitar despliegue de laboratorio. NO-GO de aceptación técnica remota/RC congelada. NO-GO comercial.** La fecha1/11 no activa nada.

El propietario confirmó cero pendientes en todos los contextos usados antes del despliegue. Para aceptar el laboratorio faltan configuración CV, pruebas Google autenticadas/dispositivos/custodia con evidencia. Para publicar comercial faltan además censo completo, políticas/catálogo vigentes, conteo/acta física/obligaciones aprobadas, respaldo comercial expresamente autorizado y verificado, cierre efectivo de todos los escritores con intervalo NONE y autorización independiente de apertura/nuevo escritor. El procedimiento existente prohíbe reapertura automática del antiguo después de nuevos movimientos.

## Handoff operativo

Checkout activo casa-vieja-checkout-5g4; código f10c5ac remoto. Documentación/evidencia posterior se publica aparte sin cambiar los artefactos autorizados. Preview local actual8800, exec46265, tab11 vendedor (dos pedidos confirmados) y tab12gerente (gasto confirmado), JWT/hojas ficticios; no desplegar preview.mjs. Provisionales8797/8798/8799 detenidos, sus tabs antiguas no son entregable. Preflight IAB tab7Scriptlectura/tab9Workereditorlectura/tab10Free. Publicación autorizada realizada. Tab7 Editor del Script y tab9 Worker65c061b6; no volver a pegar/desplegar para ingresar las seis propiedades. No leer propiedades privadas hasta que el propietario regrese a Editor. HMAC no se ha leído.
