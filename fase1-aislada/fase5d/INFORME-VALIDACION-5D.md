# Fase 5D — validación del laboratorio

Fecha: 21 de octubre de 2026. Solo TEST_ONLY. No habilita producción ni Fase 6.

## Resultado comprobado

Google Identity → Worker de laboratorio → Apps Script aislado → hoja sintética funciona para administrador, vendedor y gerente operativo. Se conservó la interfaz aprobada 5A.2. La regresión completa pasó 373/373 pruebas locales, incluidas 41 específicas de 5D. No son 357 pruebas con Google.

| Ensayo real de laboratorio | Evidencia | Resultado |
|---|---|---|
| Ingreso administrador | Perfil y actualización del dashboard en Safari | Comprobado |
| Revocación y restauración del vendedor | ACCESS_DENIED tras desactivar; nuevo ingreso restaurado con tres secciones y conexión confirmada | Comprobado con Google |
| Ingreso vendedor | Confirmación del propietario y lectura nativa | Comprobado |
| Vista vendedor | Ventas, Pedidos, Inventario; sin costos, descuentos ni reportes financieros | Comprobado en interfaz |
| Pedido ficticio de S/35 | Confirmado por servidor y visible una sola vez en administrador | Comprobado |
| Reserva | Físico 84 → 84; reservado 2 → 3 | Comprobado |
| Cobro ficticio | Referencia única; pendiente inicial, luego confirmado; saldo por cobrar S/0 y cobrado S/35 | Comprobado |
| Inventario tras cobro | Físico 84, reservado 3 | Comprobado |
| Costo histórico | S/17.35; margen inicial S/17.65 | Comprobado en pedido |
| Despacho ficticio | Estado Despachado; físico 84 → 83; reservado 3 → 2 | Comprobado |
| Actualización en vendedor | Mismo pedido Despachado, sin datos financieros internos | Comprobado |
| Gerente operativo | Perfil y actualización real 12:22:03 Lima; sin usuarios/configuración crítica | Comprobado en interfaz |

Pedido del ensayo: `future:8dc4af32-f795-40dc-acb9-c3cb3c1c065d`. Cliente: PRUEBA 5D GOOGLE VENDEDOR 20261021. Referencia de pago: TEST_ONLY_5D_PAGO_20261021_01. Son datos y eventos ficticios, sin dinero ni entrega reales. No borrar ni cancelar estos registros de evidencia.

## Corrección posterior de sesión

**Alto, corregido y verificado con actualización real de gerente:** SESSION_CHANGED por respuestas de intentos de ingreso anteriores. Solo el intento vigente puede mostrar la interfaz o invalidar su sesión; una denegación actual sigue cerrando acceso. Cinco pruebas nuevas de concurrencia de ingreso, deduplicación y cancelación. El primer ajuste abrió el panel Gerente operativo, pero apareció ACCOUNT_OR_PROFILE_CHANGED; se protegió también el montaje único y se comprobó la actualización real sin avisos con versión 356ce6ca. No se alteran roles, credenciales ni colas.

## Correcciones verificadas

- **Alto, corregido:** consulta de certificados Google incompatible con el modo de redirección usado en Workers. Se usa modo manual y se rechazan desvíos. Una prueba remota sin credenciales pasó de 503/GOOGLE_IDENTITY_UNAVAILABLE a 401/IDENTITY_REQUIRED para firma ficticia inválida.
- **Alto, corregido:** fallo al importar la interfaz después del popup OAuth. El arranque ahora incluye sus módulos antes del acceso, manteniendo el montaje privado condicionado a sesión confirmada. Vendedor entró tras la corrección.
- **Medio, corregido en nuevo paquete:** mientras se esperaba confirmación, otro indicador podía conservar temporalmente el texto anterior de cola vacía. Ahora se muestra pendiente inmediatamente después de guardar localmente. Las pestañas abiertas reciben este cambio en su siguiente recarga; no se fuerza su cierre.
- **Medio, observado:** el cobro pudo quedar pendiente antes de confirmarse. Se recuperó la misma operación sin volver a registrar el pago ni cambiar la referencia. No se simuló pérdida de respuesta contra Google: esa prueba permanece pendiente.

## Seguridad y conservación

La identidad de Google se verifica con firma y audiencia en Worker. El backend recibe la identidad dentro de un mensaje HMAC y resuelve permisos en servidor. Los perfiles no proceden de campos del formulario. Costos y utilidades del vendedor se filtran en la respuesta del backend; además se limita su interfaz. La revocación y restauración del vendedor se comprobaron también con Google: acceso denegado mientras estaba inactivo y nuevo ingreso con el mismo perfil tras restaurarlo. Siguen pendientes solicitudes manipuladas con una sesión válida.

Los correos autorizados y el secreto HMAC permanecen en configuración privada, fuera del repositorio. No se compartieron las hojas con operadores. Se mantuvieron intactos main, index.html productivo, Apps Script productivo, BaseDatos_CasaVieja y el historial. No se habilitaron facturación, tarjetas, KV ni D1.

El propietario confirmó que el laboratorio solo se usó en esta computadora. Antes del pedido se revisaron las pestañas sintéticas conocidas: laboratorio privado anterior, administrador y vendedor, sin pendientes. La comprobación automática del origen actual sigue ejecutándose antes de encolar. Esto no acredita dispositivos productivos ni autoriza un corte comercial.

## Seguridad pública y tiempos observados

Siete rechazos remotos aprobados: origen ausente/ajeno, identidad ausente, firma inválida, rol administrador declarado con firma inválida, credencial demasiado larga y método GET no admitido. Sin credenciales reales ni escritura comercial. No sustituyen pruebas de autorización con una sesión válida.

Se observaron 50 doPost en la consola del Script sintético. Mediana 2.36 s; media 3.73418 s; mínimo 0.9 s; máximo 32.417 s; p95 descriptivo por rango más próximo 17.245 s. Son peticiones mezcladas y estados de ejecución Completada, no resultados comerciales confirmados. No se midió latencia completa ni capacidad con carga simultánea. Los casos lentos permanecen como riesgo de rendimiento.

## Pendientes y condiciones de cierre

| Prioridad | Pendiente | Condición verificable |
|---|---|---|
| P0 | Gerente operativo: alcance funcional restante | Ingreso, reportes y menús comprobados; faltan sus propias escrituras y rechazos directos de funciones administrativas |
| P0 | Autorización adversarial real | Solicitudes manipuladas con sesión válida; revocación y restauración ya comprobadas |
| P0 | Recuperación y concurrencia reales | Mismo operationId ante reconexión/respuesta perdida; última unidad sin doble consumo |
| P1 | Rendimiento | Latencia y CPU con muestras suficientes, incluyendo JWT, diarios y usuarios concurrentes |
| P1 | Equipos físicos | iPhone y segundo dispositivo; evidencia, sin declarar aprobaciones por emulación |
| P1 | Continuidad y políticas | Protocolo de todos los equipos productivos y decisiones del propietario, antes de futura transición |

No se declara cerrada Fase 5D ni listo el sistema para producción. Las evidencias visuales locales están en evidencia-local/ y se excluyen de Git para proteger datos de cuenta. tests/evidencia.json y tests/resultados.txt contienen el registro reproducible sin secretos.

## Formulario de usuarios: continuidad visual

Corrección local verificada: sincronizar conservaba los datos del backend, pero recreaba el panel y ocultaba la lista de usuarios cargada. Se conserva ahora el nodo del formulario y sus cambios sin guardar. En localhost se cargaron tres identidades ficticias, se desmarcó el acceso del vendedor sin guardar y se sincronizó: la lista y el cambio pendiente permanecieron. No se envió ningún cambio de permiso. Regresión 362/362. Publicado en Worker afcb7fcf. Los archivos entry.mjs, approved.css y config.json publicados coinciden por SHA256 con el paquete probado; no cambia la autorización del servidor.

## Continuación del 21 de octubre, tarde (Lima)

Base preservada: 03bee405f93e6d2116ba1718593e16d28f0445a3 en dev/fase1-estabilizacion. main conserva 12a5f997845f9d31dc1a5d8ae7dc49770928da3d. No se modificó Apps Script ni se crearon recursos adicionales.

- Ensayo opcional `?validation=5d`: usa la sesión individual existente, sin leer/exportar tokens. Prueba rutas restringidas, rol falsificado, redacción del vendedor, tres consultas y revisión del diario. Los comandos administrativos son inválidos y no contienen permisos o reglas aplicables. No añade endpoints. Verificado localmente con los tres perfiles; ejecutado en interfaz local con vendedor (11 comprobaciones). Publicado en afcb7fcf. Verificación real con vendedor aún pendiente de recuperar la lectura de Safari después de Google: no darla por aprobada.
- Tres pruebas nuevas recorren JWT RSA ficticio → Worker actual → HMAC → candidato mínimo → adaptador simulado de Sheets. Recuperación de respuesta perdida conserva operationId y deja un recibo/efecto; tres peticiones en vuelo reservan una sola bolsa; revocación/restauración conserva tablas previas. No son prueba de la infraestructura concurrente de Google ni de dos equipos físicos.
- **Medio, confirmado por código:** el temporizador consultaba cada 30 segundos también en pestañas ocultas. Corrección local: pausa consultas automáticas cuando la pestaña no está visible, no hay red o la sesión ya no corresponde; retoma al volver al frente o reconectar y evita solapamientos. No borra ni cambia colas. Tres pruebas aprobadas. Publicación de esta optimización todavía pendiente; no se afirma ahorro medido en Google.
- Repetición remota: 7/7 rechazos públicos aprobados; tres archivos públicos idénticos al paquete afcb7fcf y con no-store. Es comprobación de despliegue, no prueba de permisos con token válido ni carga.
- Panel general de Cloudflare observado durante esta sesión: 422 invocaciones del Worker, indicador CPU Time 3 ms y Errors 0 en últimas 24 horas. La portada de cuenta mostró CPU P90 6 ms y otras cifras actualizadas; son agregados de ventanas/peticiones distintas, no mediciones por operación ni capacidad garantizada. No se infieren cuotas consumidas de Apps Script o Identity a partir de esos indicadores.

Reproducción local: `node fase1-aislada/fase5d/tests/run-all.mjs`. Conserva el candidato previo al terminar, construye el adaptador ficticio para las pruebas y no contacta servicios externos. Evidencia completa: tests/resultados.txt. El ensayo de red es separado y explícito: tests/probe-public-auth.mjs.

**NO-GO para Fase 6:** persisten autorización adversarial con sesión válida, pérdida de respuesta y última unidad contra Google, pruebas de celular/segundo equipo, tiempos bajo carga y decisiones/continuidad comercial. Las pruebas locales no cierran esos bloqueos.
