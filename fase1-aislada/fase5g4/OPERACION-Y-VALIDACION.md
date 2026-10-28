# Operación y validación 5G.4 — solo laboratorio

28/10/2026. No es autorización de producción. Costo adicional S/0; no crea automatizaciones, cuentas, servicios ni facturación.

## Recorrido después de autorizar la publicación

Usar únicamente casa-vieja-lab-auth.portopelaez1009.workers.dev/?engine=5g4. La vista sin engine mantiene la cola anterior, sin moverla. Revisar cada identidad/origen antes de marcar la casilla de continuidad; no borrar IndexedDB ni pendientes. La nueva base es cv-zero-lab-5g3-v1-google:<subject>, epoch TEST_ONLY_V3, commercialVersion4 y prefijo TEST_ONLY_5G3_. La original cv-zero-lab-v1-google:<subject> permanece consultable en su modo. Ninguno importa automáticamente V2/V3/V4 ni cambia el origen comercial GitHub Pages.

1. Administrador y gerente, cada uno con su Google autorizado: revisar las cuatro filas TEST_ONLY y tres obligaciones; cada uno registra su revisión del mismo hash. La aplicación obtiene identidad y hora del servidor. El administrador autoriza y aplica una vez. Sin ambas revisiones distintas el servidor rechaza la apertura. Revisar retenidos y sus cero disponibles. No recibir automáticamente los 300 kg reales.
2. Vendedor: venta simple de una unidad, Tripack y mixto seleccionando cada partida/molienda. Revisar total de catálogo; todavía no acredita pago. Repetir Sincronizar y comprobar el mismo pedido/recibo.
3. Gerente: cobro parcial y final con referencias distintas, comprobar saldo y que el físico no cambie; despachar una vez, confirmar entrega y comprobar que no se puede despachar otra vez. Repetir desde solicitud manipulada en prueba sintética. Configurar ninguna oferta real.
4. Pedidos anteriores: conservar ID/origen/evidencia/anticipo. Cobrar únicamente saldo futuro. Despachar reserva pagada; confirmar entrega. No recrear factura ni ingreso/COGS antiguo. UNKNOWN, documentos insuficientes y cancelaciones con anticipo sin resolución bloquean el traslado.
5. Lotes y preparación: recepción de 10 kg ficticios (no 300 kg comerciales), pilado 8 kg+2 kg merma, tueste 7 kg+1 kg merma, molienda 4 kg→4 kg y empaque con materiales suficientes; comprobar familia, lote y suma de kilos/costos. Probar falta de insumos, etapas inválidas y merma inconsistente; no deben dejar efectos. Gastos: un egreso ficticio S/1 con comprobante único. Cotejar reportes sin duplicar compra/envío como gasto.
6. Registrar tiempos de cada paso desde navegador y diagnóstico administrador; separar navegador/Worker/Apps Script. Tres muestras son descriptivas, no un percentil fiable ni una prueba de carga comercial. Comparar mismo diario, revisión y volumen antes/después. No usar milisegundos del simulador como latencia Google.

## Sesión física breve — PC, iPhone/Safari y Android/Chrome

No realizada para este paquete. Las pruebas físicas 5E/5G anteriores no la sustituyen. Cada persona usa equipo/perfil separado. No compartir claves ni borrar almacenamiento.

- Tres usuarios: administrador/gerente/vendedor entran en sus perfiles; comprobar lectura/denegaciones. Vendedor no ve reportes/costos ni confirma cobros. Gerente no administra usuarios/configuración.
- Última unidad: dos borradores diferentes sobre la misma unidad TEST_ONLY, ambos sin pendientes, pulsar una vez por equipo sin sincronizar entre pulsaciones. Registrar ID y resultado: una reserva, otro rechazo definitivo; disponibles cero. Archivar rechazo solo conservando evidencia.
- iPhone: un borrador nuevo TEST_ONLY_5G4_REINICIO, revisar casilla; apagar datos y Wi-Fi, Registrar una vez. Debe aparecer PENDING, sin éxito. Cerrar Safari completo sin eliminar pestaña/datos, reconectar y abrir mismo origen/cuenta. Consultar/sincronizar: mismo pedido y cero pendientes. Registrar ID, estado y stock.
- ACK: cliente TEST_ONLY_5E_5G4_ACK, origen ?engine=5g4&recovery=5e; armar retención, registrar una vez, ver PENDING. Reabrir mismo origen/cuenta y consultar estado. Debe recuperarse COMMITTED original sin segundo consumo. No reenviar como pedido nuevo.
- Android: repetir permiso, borrador persistente y reconexión; ambos móviles revisar teclado, menú, zoom, área segura, tablas y botones. Indicar por equipo/navegador/versión/hora/paquete qué se ejecutó y qué faltó.
- Salida: comparar diario/effects, costos y reservas con recibos. Cualquier PENDING/UNKNOWN queda conservado y bloquea el cierre del ensayo. No resolverlo limpiando almacenamiento.

## Respaldo y custodia sintética

Administrador → Respaldo sintético → Preparar archivo cifrado. Descargar .cvenc, referencia SHA256 y clave privada por separado; no enviar clave al chat. Transferir personalmente solo archivo cifrado+hash al teléfono elegido. Clave en gestor independiente, custodia compartida por propietario y socio mediante canal privado; no guardar la única clave junto al archivo.

En teléfono, abrir /verify-backup.html, seleccionar archivo, introducir personalmente hash independiente y clave. El verificador cifra/descifra localmente, CSP connect-src 'none', sin restaurar ni llamar API. Resultado debe mostrar hash y cantidades, nunca contenido comercial. Guardar únicamente evidencia de resultado, sin clave. Esta verificación física sigue pendiente.

Incluye diario, movimientos, planes/recibos, costos/saldos reconstruibles, obligaciones, apertura/configuración y hashes de código. No incluye claves, usuarios, permisos de Google/Cloudflare ni operaciones exclusivamente pendientes en otro equipo. Copiar solo servidor no rescata pendientes aún no enviados. Identidades y secretos se restablecen por separado con autorización.

Ante pérdida: detener admisiones nuevas, identificar último respaldo verificado y todas las colas, reponer código compatible en destino vacío/autorizado con escritor NONE, restaurar con INCOMPLETE/reanudar y comprobar hashes/recibos/saldos antes de COMPLETE. No aplicar copia antigua sobre diario con operaciones posteriores, ni reabrir sistema antiguo tras primera operación comercial nueva. Perder la clave impide descifrar. Ni servidor ni modelo conservan una copia recuperable de ella.

Política propuesta: agrupar cambios tras nuevas revisiones confirmadas y verificar al cierre; RPO real todavía no medido (desde última copia completa y verificada), pendientes locales dependen de sus dispositivos. RTO comercial no medido. Retención 7 diarias/4 semanales/3 mensuales pendiente; sin borrado automático, exportaciones productivas ni trabajos programados. La descarga manual sintética implementada no debe confundirse con respaldo automático operativo.

## Censo antiguo — solo computadora principal autorizada

Sonda existente fase5g2/census-console.js SHA256 38ccbfd75a83279a1eb3849a75136c7ac0dc4d93a07d41397102f4b1b43ab035. No cambiarla ni automatizar preferencias Safari de nuevo. Si la consola ya está accesible, dueño en pestaña comercial YA abierta del perfil autorizado: ejecutar personalmente solo esa sonda y compartir únicamente salida CV_5G2_CENSUS; si no hay consola, detener esta revisión y coordinar asistencia manual. No abrir/recargar web comercial, llamar endpoint, pegar recibos/clientes/claves o limpiar almacenamiento.

La salida solo cuenta casa_vieja_outbox/casa_vieja_failed_ops y lista nombres/versiones IndexedDB, sin abrir bases. Cero no demuestra sincronización/recibos ni escritor cerrado. Aún no recibida. Los Safari de celulares y socio requieren autorización individual; vendedor/equipos adicionales e integraciones no inventariadas siguen UNKNOWN.

Estática previa: versión2 GET puede exponer A1 y POST reemplaza JSON con clave compartida; versión15 GET puede escribir/migrar. No se invocan. GitHub Pages puede sincronizar al cargar. Activadores, integraciones y editores directos deben quedar identificados antes del cierre. Ninguna implementación se archivó/deshabilitó.

## Decisiones para noviembre y lote real

Catálogo ya extraído: Gourmet250 S/22,500 S/40,dúo500 S/69,tripack500 S/99; Monte Alto250 S/37,500 S/65,dúo500 S/99,tripack500 S/140; mixtodúo250 S/49/500 S/85; trío2G1M250 S/55/500 S/110; trío1G2M250 S/65/500 S/125. Grano/molido por bolsa. Son referencias, no aprobación de noviembre. Ratificar vigencia y lotes disponibles; no equiparar automáticamente lotes históricos Especialidad con Monte Alto.

Faltan: autorización de crédito/cobros y despacho sin pago; descuentos y responsables; cancelaciones/anticipos; ajustes/conteos; productos dañados/cuarentena; costos reales y recetas de insumos/merma; envío fuera de Lima. Lima S/8 cobrado al cliente no define costo interno de reparto. No activar zonas sin tarifa. Decisiones versionadas con fecha/identidad/evidencia; nunca recalcular operaciones anteriores.

Recepción futura: pesar pergamino real y documentar proveedor/origen/lote/costo/flete; registrar solo etapa alcanzada. Pilado registra verde+merma, tueste tostado+merma, molienda salida real+merma y empaque consume café/materiales; cada paso conserva lote/costo y físico/reservado/disponible. Conteo anterior verificado se abre en lotes independientes. No convertir 300 kg estimados en recepción o bolsas disponibles.
