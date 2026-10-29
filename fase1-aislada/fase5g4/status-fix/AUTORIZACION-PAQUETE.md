# Ajuste de avisos y sincronización de interfaz 5G.4

Fecha: 29/10/2026. Preparado localmente; todavía no aprobado ni publicado.

## Destinos y alcance

Publicar esta carpeta y la evidencia saneada de los ensayos de la continuación en dev/fase1-estabilizacion. Actualizar exclusivamente el Worker existente casa-vieja-lab-auth y una propiedad no secreta del AUTH existente CasaVieja_AUTH_TEST_ONLY_5D: CV_5G4_WORKER_SHA256. No desplegar otra versión de Apps Script, modificar backend, permisos, cuentas, secretos, apertura, saldos, diarios, colas ni borradores. Costo adicionalS/0, sin nuevos recursos o servicios.

Worker candidato SHA256 `cf780ac29bbe21f45c3a5ebdd7d94de43c62ee9b16cb854e4c2fb1f05019cba3`.

Base activa e571872f, SHA `029871296ce23a85e36e4b1597719252371e8ae8194c73d750f679ca584de445`; Apps Script6/backendbd4e253c permanece exacto. Únicos recursos públicos modificados: /entry.mjs y /approved-app.js. API/HMAC/autenticación permanecen byte a byte iguales. Se conserva el ámbito explícito ?engine=5g4 y la separación de colas por identidad/origen.

## Problema concreto y corrección

Después de recuperar el Tripack o rechazar el dúo, el aviso superior decía pendiente pese a la cola resuelta/recibo definitivo. La función base retorna antes si otra sincronización está ocupada. El ajuste comparte la promesa entre llamadas concurrentes: todas esperan la misma sincronización. Deriva los avisos administrados de los estados actuales de la cola, distinguiendo REJECTED, PENDING y ausencia de pendientes. No transforma cola vacía en venta/pago confirmado ni suprime errores de permisos o validación. No escribe estados financieros ni de inventario.

## Pruebas

Regresión local640/640,80archivos, sin Google/físicos: tests/regression.json. Siete pruebas nuevas: recibo recuperado, rechazo definitivo, offline/cola vacía, preservación de errores, llamadas concurrentes sin salida anticipada, recuperación tras excepción y comparación exacta de los recursos modificados. Los dos primeros intentos del test de paquete corrigieron supuestos del test sobre orden de claves y uso de parser de scripts para un módulo; código compilado no cambió. Batería final aprobada.

Navegador/IndexedDB local8802: pedido sin red queda PENDING; reconectar conserva el pedido y limpia el aviso; otro pedido con cinco bolsas y stock de tres queda REJECTED con aviso de rechazo, sin decir pendiente. No se presenta esta evidencia como aceptación remota del ajuste. El servidor local y sus identidades ficticias no se publican como servicio.

## Publicación y comprobación

Antes de actualizar, comprobar cero pendientes en los contextos usados y conservar rechazos/borradores. Publicar código exacto, verificar SHA y versión activa, actualizar/releer únicamente CV_5G4_WORKER_SHA256 mediante el campo CV dirigido sin abrir valores ZERO. Verificar siete rechazos públicos y archivos estáticos; renovar sesiones de laboratorio si corresponde. Comprobar que el rechazo archivado y los pedidos confirmados persistan, y que los avisos ya no contradigan esos estados. No repetir apertura o ventas existentes. Si se precisa un nuevo ensayo ficticio, permanece dentro del tope40 original y se cuenta a partir de los registros ya usados.

## Riesgo y reversión

Riesgo de error visual o demora de sincronización compartida. Detener altas si falla y conservar todos los datos; restituir solo Worker e571872f y la propiedad CV de hash anterior sin restaurar datos antiguos. La versión anterior conserva el defecto visual; no autoriza seguir registrando sin revisar el estado real. No tocar Apps Script desplegado, historial o producción.

EtapaE exige «Antes de realizar cualquier cambio remoto, solicita aprobación específica sobre ese paquete completo». Las aprobaciones anteriores no cubren este hash nuevo. No incluye main, producción, DR, corte ni nuevas autorizaciones comerciales.
