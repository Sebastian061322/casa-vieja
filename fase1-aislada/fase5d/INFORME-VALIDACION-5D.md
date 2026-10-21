# Fase 5D — validación del laboratorio

Fecha: 21 de octubre de 2026. Solo TEST_ONLY. No habilita producción ni Fase 6.

## Resultado comprobado

Google Identity → Worker de laboratorio → Apps Script aislado → hoja sintética funciona para administrador y vendedor. Se conservó la interfaz aprobada 5A.2. La regresión completa pasó 362/362 pruebas locales, incluidas 30 específicas de 5D. No son 357 pruebas con Google.

| Ensayo real de laboratorio | Evidencia | Resultado |
|---|---|---|
| Ingreso administrador | Perfil y actualización del dashboard en Safari | Comprobado |
| Ingreso vendedor | Confirmación del propietario y lectura nativa | Comprobado |
| Vista vendedor | Ventas, Pedidos, Inventario; sin costos, descuentos ni reportes financieros | Comprobado en interfaz |
| Pedido ficticio de S/35 | Confirmado por servidor y visible una sola vez en administrador | Comprobado |
| Reserva | Físico 84 → 84; reservado 2 → 3 | Comprobado |
| Cobro ficticio | Referencia única; pendiente inicial, luego confirmado; saldo por cobrar S/0 y cobrado S/35 | Comprobado |
| Inventario tras cobro | Físico 84, reservado 3 | Comprobado |
| Costo histórico | S/17.35; margen inicial S/17.65 | Comprobado en pedido |
| Despacho ficticio | Estado Despachado; físico 84 → 83; reservado 3 → 2 | Comprobado |
| Actualización en vendedor | Mismo pedido Despachado, sin datos financieros internos | Comprobado |
| Gerente operativo | Acceso personal de Google preparado | Pendiente de intervención del propietario |

Pedido del ensayo: `future:8dc4af32-f795-40dc-acb9-c3cb3c1c065d`. Cliente: PRUEBA 5D GOOGLE VENDEDOR 20261021. Referencia de pago: TEST_ONLY_5D_PAGO_20261021_01. Son datos y eventos ficticios, sin dinero ni entrega reales. No borrar ni cancelar estos registros de evidencia.

## Corrección posterior de sesión

**Alto, corregido localmente y desplegado en laboratorio; validación remota pendiente:** SESSION_CHANGED por respuestas de intentos de ingreso anteriores. Solo el intento vigente puede mostrar la interfaz o invalidar su sesión; una denegación actual sigue cerrando acceso. Cinco pruebas nuevas de concurrencia de ingreso, deduplicación y cancelación. El primer ajuste abrió el panel Gerente operativo, pero apareció ACCOUNT_OR_PROFILE_CHANGED; se protegió también el montaje único y se repite la comprobación con versión 356ce6ca. No se alteran roles, credenciales ni colas.

## Correcciones verificadas

- **Alto, corregido:** consulta de certificados Google incompatible con el modo de redirección usado en Workers. Se usa modo manual y se rechazan desvíos. Una prueba remota sin credenciales pasó de 503/GOOGLE_IDENTITY_UNAVAILABLE a 401/IDENTITY_REQUIRED para firma ficticia inválida.
- **Alto, corregido:** fallo al importar la interfaz después del popup OAuth. El arranque ahora incluye sus módulos antes del acceso, manteniendo el montaje privado condicionado a sesión confirmada. Vendedor entró tras la corrección.
- **Medio, corregido en nuevo paquete:** mientras se esperaba confirmación, otro indicador podía conservar temporalmente el texto anterior de cola vacía. Ahora se muestra pendiente inmediatamente después de guardar localmente. Las pestañas abiertas reciben este cambio en su siguiente recarga; no se fuerza su cierre.
- **Medio, observado:** el cobro pudo quedar pendiente antes de confirmarse. Se recuperó la misma operación sin volver a registrar el pago ni cambiar la referencia. No se simuló pérdida de respuesta contra Google: esa prueba permanece pendiente.

## Seguridad y conservación

La identidad de Google se verifica con firma y audiencia en Worker. El backend recibe la identidad dentro de un mensaje HMAC y resuelve permisos en servidor. Los perfiles no proceden de campos del formulario. Costos y utilidades del vendedor se filtran en la respuesta del backend; además se limita su interfaz. Las pruebas de solicitudes manipuladas y revocación están aprobadas localmente; aún faltan equivalentes con sesiones reales.

Los correos autorizados y el secreto HMAC permanecen en configuración privada, fuera del repositorio. No se compartieron las hojas con operadores. Se mantuvieron intactos main, index.html productivo, Apps Script productivo, BaseDatos_CasaVieja y el historial. No se habilitaron facturación, tarjetas, KV ni D1.

El propietario confirmó que el laboratorio solo se usó en esta computadora. Antes del pedido se revisaron las pestañas sintéticas conocidas: laboratorio privado anterior, administrador y vendedor, sin pendientes. La comprobación automática del origen actual sigue ejecutándose antes de encolar. Esto no acredita dispositivos productivos ni autoriza un corte comercial.

## Pendientes y condiciones de cierre

| Prioridad | Pendiente | Condición verificable |
|---|---|---|
| P0 | Gerente operativo | Cuenta individual entra, puede gestionar operación y consultar reportes; no usuarios/configuración crítica |
| P0 | Autorización adversarial real | Solicitudes manipuladas y revocación verificadas contra Google sin elevar permisos |
| P0 | Recuperación y concurrencia reales | Mismo operationId ante reconexión/respuesta perdida; última unidad sin doble consumo |
| P1 | Rendimiento | Latencia y CPU con muestras suficientes, incluyendo JWT, diarios y usuarios concurrentes |
| P1 | Equipos físicos | iPhone y segundo dispositivo; evidencia, sin declarar aprobaciones por emulación |
| P1 | Continuidad y políticas | Protocolo de todos los equipos productivos y decisiones del propietario, antes de futura transición |

No se declara cerrada Fase 5D ni listo el sistema para producción. Las evidencias visuales locales están en evidencia-local/ y se excluyen de Git para proteger datos de cuenta. tests/evidencia.json y tests/resultados.txt contienen el registro reproducible sin secretos.
