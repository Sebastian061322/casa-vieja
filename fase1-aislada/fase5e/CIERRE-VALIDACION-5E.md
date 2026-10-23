# Cierre de validación 5E — trabajo en curso, 22/10/2026

## Actualización comprobada — diagnóstico desplegado

Con autorización específica del propietario, fuentes publicadas en `7fcf3c4c980ecd9b85228a044b7e5111aa26697d`, Worker activo `4fdf13da` y Apps Script versión **3**, mismo endpoint, ejecución como propietario y acceso de red Cualquiera protegido por HMAC. Huellas: Worker `e7abb4227aac185f93ae30d1f6c68dd79b1a727cda56bea92d28fa06b156cd85`; backend `d0e635dd759d25e2cdb72e67a624d84b9b977c2a8eb6924c23f2d94b4d149c7c`. Sin cambios de permisos, secretos ni recursos.

Regresión: **450 pruebas locales aprobadas**. Comprobación remota posterior al despliegue: siete solicitudes inválidas rechazadas y tres activos iguales por SHA256, todos `no-store` (`tests/resultados-red-publica-diagnostico-5e.json`). Main conserva `12a5f997845f9d31dc1a5d8ae7dc49770928da3d`. Lectura previa del diario: revisión 128, 266 registros y 181 movimientos, sin pendientes ni cambios (`tests/integridad-before-diagnostics-5e.json`).

El administrador tiene disponible la medición de tres consultas sintéticas correlacionadas. **Todavía no se dispone del resultado autenticado**. El propietario confirmó iPhone disponible y cero pendientes; el ensayo de reinicio completo sigue pendiente. No declarar cerrada toda la fase. Las secciones siguientes conservan la evidencia de versiones anteriores y deben interpretarse con esta actualización de estado.

No constituye autorización comercial ni cierre definitivo de la fase. Referencia remota comprobada: `34eca552469ce99f8591d4a4c77d3fd61ebe0c67`, rama `dev/fase1-estabilizacion`. Worker de laboratorio `9a3a6e2b`; Apps Script sintético versión 2. Fuentes y pruebas publicadas en cdb630e12d66e4d17c017f0e37f5b6c7c9315abc con autorización específica. Candidato definitivo 5d94dd50 desplegado como 9a3a6e2b.

## Comprobaciones de esta continuación

| Resultado | Evidencia y alcance |
|---|---|
| Diario Google íntegro y sin cambios desde el ensayo físico | `tests/integridad-google-final-5e.json`: lectura sin escrituras; 266 registros, 181 movimientos, 128 COMMITTED, 10 REJECTED, cero PREPARED incompletos, revisión 128 y 50 recursos. Comparación exacta con el registro posterior a la última unidad. |
| Misma huella de los candidatos publicados | Worker SHA256 `a09881983136afefb2d5a2797f88576a6d0b3181e1dfbb6b7088ccd1536e5add`; backend SHA256 `a0c7222ce06b9bc695e29a6997728115036ec61b000c11f62aacc36ef17b3ce4`. No se cambió código remoto. |
| Continuidad y privacidad en IndexedDB real | `tests/storage-browser-recovery-5e.json` y capturas privadas. Navegador integrado, dos almacenes con identidades ficticias, seis verificaciones de preparación y siete posteriores al cierre/reapertura de pestaña. Backend simulado; no es prueba física ni reinicio completo de Safari. |
| Cachés gerenciales minimizados | Las proyecciones de costo/utilidad solo viven en memoria; se conservaron comando, borrador, recibo previo y rechazo. Otro almacén de vendedor no obtuvo esos datos. No demuestra aislamiento frente a una persona con acceso al mismo perfil de sistema operativo; no hay cifrado de comandos ni borradores. |
| Recuperación local del servicio | Cinco pruebas adicionales de servicio (447 pruebas locales totales, cero fallos) en `tests/service-recovery.test.mjs`: código y diario desde copia verificada; tres perfiles; permisos denegados; recibo original sin reserva duplicada; revocación; bloqueo de pendiente legado sin identidad autenticada. Apps Script, Sheets y verificación de identidad simulados. No recupera infraestructura, OAuth ni credenciales reales. |
| Marca de recuperación Google conservada | Relectura de `TEST_ONLY_5E_20261022_CONTROL!A1:B6`: mismo hash esperado y evento terminal VERIFIED. INCOMPLETE permanece como evento inicial del ensayo. No se volvió a escribir ni modificar la copia. |

Reproducibilidad local: `node fase1-aislada/fase5e/run-tests.mjs --authorized-script`. El indicador mantiene la guarda del ID de Script del candidato autorizado; no despliega ni llama a Google. Para la prueba de IndexedDB: ejecutar `node fase1-aislada/fase5e/tests/serve-storage-browser.mjs`, abrir su URL con `?run=TEST_ONLY_` seguido de un identificador nuevo, preparar una vez, cerrar esa pestaña, reabrir la misma URL y verificar. El origen y puerto deben mantenerse. No borrar IndexedDB para repetir; usar otro identificador.

## Limitación encontrada al comprobar recuperación

Confirmada, severidad media: el fixture de restauración Google conserva un PREPARED antiguo de motor V4 sin `plan.audit`. Sirve para verificar copia, reconstrucción e idempotencia del motor original, pero no acredita reejecución mediante la pasarela multiusuario nueva. Esa pasarela rechaza `OPERATION_ACTOR_MISMATCH` sin añadir efectos. La nueva prueba automatizada lo verifica.

No agregar una identidad inventada al plan, reescribir el comando ni transferirlo automáticamente. Una copia con comandos autenticados nuevos sí recupera el recibo original en el servicio simulado. El simulacro integral de recuperación de infraestructura real permanece pendiente; no convertir estas pruebas en una afirmación de RTO integral.

## Pasos físicos restantes, sin datos reales

1. Ya ejecutado y corroborado en versión 37306312. Computadora, misma pestaña y cuenta de gerente: reingresar y ejecutar «Comprobar permisos y consultas». Esperar resultado `APROBADO · operations`; conservar la página. La automatización perdió lectura al cerrarse la ventana Google; no se registra el resultado sin evidencia.
2. Ya corroborado: rechazo conservado, cero pendientes y disponible 0. Protocolo para revisar el rechazo original `717b5160-89c1-4eda-9d6a-ea1dea231b37`. Si sigue REJECTED y el servidor lo confirma, usar «Archivar rechazo con evidencia» una vez. Esto conserva el rechazo y no confirma la venta. Sincronizar y verificar cero pendientes y partida 2 disponible 0. No registrar un sustituto. Las descargas se bloquean mientras haya rechazos sin revisar.
3. Administrador principal: usar su cuenta autorizada en una pestaña del mismo laboratorio `?validation=5d`, ejecutar ensayo y registrar resultado. No guardar usuarios ni configuración. El ensayo actual del administrador comprueba rol falsificado, tres consultas y revisión sin cambios; los permisos positivos de administración deben comprobarse aparte en lectura, sin atribuirle pruebas de cambios de usuarios no realizadas.
4. Repetir ensayo del vendedor en el paquete final; verificar ausencia de costos/utilidades/reportes/cobros. Cotejar resultado visible y revisión del diario.
5. iPhone: usar mismo perfil/cuenta vendedor y misma pestaña. Verificar cero pendientes y conservar rechazos. Preparar un único pedido ficticio `TEST_ONLY_5E_REINICIO_IPHONE_20261022_01`, una bolsa de la partida inicial Gourmet molido 500 g con disponibilidad suficiente, zona exactamente «Zona ficticia», sin teléfono ni cobro ni despacho. Antes de enviarlo cotejar disponibilidad actual; la lectura de referencia mostró 3 disponibles, no garantiza el saldo futuro.
6. Desactivar internet y registrar una sola vez. Documentar operationId y estado PENDING sin éxito. Cerrar Safari completamente de forma manual, sin limpiar datos. Abrir el mismo origen y perfil; reconectar y entrar como el mismo vendedor. Sincronizar una vez. Cotejar un único recibo/reserva en servidor con ese mismo operationId. Repetir Sincronizar y comprobar ausencia de efectos adicionales. No repetir Registrar.
7. Si al abrir sin conexión Safari no carga la interfaz, conservar almacenamiento y reconectar. El despliegue Worker no acredita una aplicación instalable ni disponibilidad completa de la interfaz tras recarga offline. Lo que se comprueba es conservación y recuperación del pendiente al regresar la conexión.
8. En el iPhone revisar campos con teclado, menú, desplazamiento, zoom y recibo. Registrar dispositivo y resultado concreto. Android solo si existe un equipo disponible; no exigir comprarlo ni darlo por aprobado mediante simulación.

## Criterios de cierre y clasificación

| Prioridad | Condición 5E | Estado actual |
|---|---|---|
| P0 | Concurrencia real de última unidad y resincronización | Aprobado en el fixture documentado, no repetir venta sin necesidad. |
| P0 | ACK perdido y recibo original | Google/Worker y reapertura física aprobados; reinicio completo físico pendiente. |
| P0 | Integridad del diario durable | Aprobada nuevamente en lectura. |
| P0 | Respaldo separado, hashes, interrupción/reanudación | Datos ficticios en Google aprobados. Recuperación integral de infraestructura real no demostrada. |
| P0 | Permisos sobre versión final | Gerente: ocho comprobaciones observadas en Worker 37306312 / backend 2 después de recargar la interfaz. Evidencia tests/permisos-google-operations-final-5e.json. Administrador: cinco comprobaciones nativas aprobadas. Vendedor en Android: resultado general aprobado reportado por propietario. Pendiente comprobación posterior al parche adicional. |
| P1 | Aviso y disponibilidad tras rechazo | Verificación nativa aprobada: borrador y partida conservados, cero pendientes, rechazo archivado y disponible 0. Hallazgo adicional de estimación en partida agotada corregido localmente; desplegado como 9a3a6e2b; comprobación autenticada final pendiente. |
| P1 | Rendimiento | Medidas reales agregadas existentes; falta desglose por correlación y comparación por acción equivalente. No inventar mejoras remotas. |
| P1 | Privacidad local | Minimización e IndexedDB real aprobados en entorno ficticio. Perfiles separados decididos por propietario; evidencia física pendiente. |
| P1 | Pruebas móviles | iPhone previo y concurrencia física aprobados; reinicio completo y revisión final de UX pendientes. Android/Chrome: acceso y permisos aprobados por reporte del propietario, sin tiempos ni observación automática; UX y reinicio pendientes. |

Las decisiones sobre Fondo, cuarentena, devoluciones, ajustes, retención y custodia no están aprobadas. Se mantienen como condiciones para funciones comerciales/operación futura; no impiden continuar ensayos sintéticos independientes. No crear respaldo automático, servicios o nuevas pestañas sin autorización específica.

Dictamen provisional: continuar laboratorio y diseño sintético 5F; no declarar toda la Fase 5E aprobada mientras falten verificaciones P0. Fase 6 sigue NO-GO y no se ejecutará el corte. Ningún acceso o escritura a producción en esta continuación.

## Hallazgo visual adicional

Confirmado, severidad media: la estimación gerencial de una partida agotada mostraba costo cero y margen completo. Se omitirá costo/margen cuando las bolsas requeridas superen disponibilidad; se agregan las líneas repetidas y las bolsas de cada combo. No modifica precios, costo histórico, comandos ni registros. Cuatro pruebas específicas y la regresión de 447 pasan. Paquete local 5d94dd500066d1917f4628aa85b527dc6860bf2e4f98a468f0c9222f90bbe0ce, autorizado específicamente y desplegado como Worker 9a3a6e2b. Backend conserva huella a0c7222ce06b9bc695e29a6997728115036ec61b000c11f62aacc36ef17b3ce4.

La comprobación completa de interfaz local verificó 7 bolsas con 6 disponibles: omite estimación y conserva total de catálogo S/245. Al volver a 1 bolsa, reaparecen costo S/17.35, margen S/17.65 y total S/35. No se registró ninguna operación. El envoltorio conserva los efectos de formulario de la previsualización original y no declara desconocido un pedido confirmado. Los paquetes intermedios e49498a1 y 9fc2ebc6 quedan retirados, sin despliegue.

Se detectó una expectativa inestable en la prueba de doble clic: suponía que la segunda llamada terminaba siempre después. Se corrigió para exigir exactamente un duplicado, con el mismo operationId y una sola cola, sin depender del orden de resolución del hash asíncrono. No se modificó la lógica de idempotencia. La regresión final de 447 pasó después.

## Aclaración de pestaña y cuenta

El propietario indicó que no aparecía el borrador. Se inspeccionó primero la pestaña Administrador principal: formulario nuevo sin cliente. Al seleccionar la pestaña Gerente operativo se corroboró el mismo cliente TEST_ONLY_5E_ULTIMA_PC_20261022_01, partida 2 con 0 disponibles, cantidad 1, rechazo definitivo, cero pendientes y un rechazo archivado. El aislamiento por subject explica la diferencia; no se borró ni recreó el comando.

## Publicación final autorizada

Solo se publicó el candidato 5d94dd500066d1917f4628aa85b527dc6860bf2e4f98a468f0c9222f90bbe0ce, Worker activo 9a3a6e2b. Los intermedios retirados no se desplegaron. Prueba pública final aprobada: siete solicitudes inválidas rechazadas y tres activos remotos iguales por SHA256, todos no-store. Fuente cdb630e1; backend permanece en versión 2, sin cambios de permisos ni secretos. Evidencia tests/resultados-red-publica-definitivo-5e.json.
