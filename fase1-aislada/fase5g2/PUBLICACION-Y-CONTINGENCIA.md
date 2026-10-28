# Procedimiento preparado; no ejecutado

## Antes de una publicación de laboratorio

1. Fijar un destino vacío explícito y aislado para la continuidad. El Candidate.gs local actual no está autorizado para desplegarse ni permite abrir inventario sobre el laboratorio poblado.
2. Completar controles de interfaz para obligaciones, políticas del servidor y pruebas de aislamiento; mostrar el paquete exacto y sus hashes para aprobación remota. No cambiar cuentas, permisos o secretos por conveniencia.
3. Verificar colas del laboratorio en todos sus orígenes y equipos, compatibilidad de recibos y esquema. Conservar rechazos y borradores. No vaciar almacenamiento.
4. Ejecutar apertura y continuidad sintéticas en Google, interrupción/reanudación, recuperación de confirmación y concurrencia; demostrar que el laboratorio existente permanece intacto.
5. Repetir la regresión pertinente sobre el paquete final exacto y las pruebas físicas afectadas. Un éxito anterior no valida modificaciones posteriores.

## Antes de congelar un Release Candidate

No congelar RC hasta resolver P0 de README.md. La ficha de liberación debe fijar commit remoto, hashes de Worker y Apps Script, versiones desplegadas, esquema, configuración sin secretos, políticas aprobadas, evidencias, manual y contingencia. El hash local actual identifica un artefacto de desarrollo, no una versión desplegada ni una aprobación.

La publicación comercial y el corte requieren autorizaciones separadas y concretas. Antes: censo completo, resolución en motor compatible de pendientes y UNKNOWN, respaldo comercial autorizado/verificado con custodia independiente, acta física revisada y firmada, políticas vigentes y prueba de suspensión de todos los escritores. Las pruebas de bloqueo se diseñan sin invocar GET/POST productivos de efectos inciertos. La versión 2 no se retira por su antigüedad: primero se prueba quién depende de ella.

## Corte futuro

Secuencia: rechazar admisiones antiguas → drenar solicitudes en tránsito → comprobar cierre de ambas implementaciones y demás escritores → estado SIN ESCRITOR → respaldo y verificación final → apertura idempotente vinculada al acta → comprobar recibo y saldos → autorización del nuevo escritor → primer pedido controlado → verificar reserva, cobro y despacho según política. Cada paso exige evidencia y responsable. El simulador local no ejecuta esos controles reales.

Si falla antes de abrir, conservar SIN ESCRITOR y colas; investigar antes de autorizar cualquier reapertura. Si falla después de abrir, detener nuevas admisiones del sistema nuevo, conservar diario, recibos y pendientes; determinar qué quedó COMMITTED antes de reintentar. **No reabrir automáticamente el sistema antiguo ni restaurar una copia anterior sobre nuevas operaciones.** Corregir con una versión compatible con los movimientos ya creados. Nunca borrar IndexedDB como solución.

## Guía operativa para los tres perfiles

Aplicable al modelo de permisos confirmado; falta validar su interfaz de continuidad final.

- Administrador principal: administra usuarios/configuración, verifica cierres, acta, políticas, respaldo y autorización de apertura. No confirma un paso sin evidencia.
- Gerente operativo: registra operaciones comerciales autorizadas, verifica pagos y despachos; no administra usuarios ni configuración crítica. Escala diferencias de conteo o pendientes desconocidos.
- Vendedor: registra pedidos con catálogo aprobado y consulta disponibilidad; no confirma cobros ni modifica precios, costos o utilidades. Una operación pendiente no equivale a venta confirmada. Sincronizar recupera el mismo operationId; no crear un pedido sustituto para corregir incertidumbre.

Para todos: cuenta individual y equipo/perfil separado; comprobar origen y perfil; conservar almacenamiento; ante error anotar solo el identificador y mensaje sin datos personales, detener reenvíos manuales y pedir revisión. Publicidad, CSV/Meta Ads y CRM WhatsApp quedan fuera de esta liberación.
