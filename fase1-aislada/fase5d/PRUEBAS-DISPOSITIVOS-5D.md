# Pruebas físicas pendientes — laboratorio 5D

Estado actualizado: propietario confirmó ingreso del vendedor y formulario visible en iPhone/Safari. El resto de casos permanece pendiente salvo evidencia individual posterior. Usar exclusivamente la URL del Worker de laboratorio y nombres TEST_ONLY; nunca registrar clientes, pagos ni inventario reales. No abrir BaseDatos_CasaVieja ni borrar almacenamiento del navegador.

## Preparación

1. Computadora: cuenta individual de gerente o administrador. Celular: cuenta individual de vendedor. No compartir contraseñas.
2. Abrir https://casa-vieja-lab-auth.portopelaez1009.workers.dev/ en ambos. Verificar el perfil en el encabezado y el aviso de datos ficticios.
3. Revisar pendientes en cada equipo y en los otros orígenes del laboratorio. Si aparece alguno, conservarlo y recuperar su confirmación antes de actualizar. Marcar la revisión únicamente cuando esté efectuada.
4. Registrar navegador, sistema, hora, perfil y conexión. Capturas solo de datos ficticios; ocultar correos o identificadores de cuenta si se comparten.

## Casos

| Caso | Pasos | Resultado esperado |
|---|---|---|
| Permisos | Vendedor abre sus tres secciones; gerente consulta Inicio y reportes | Vendedor sin costos/utilidades/descuentos/cobros/despachos; gerente sin usuarios/configuración crítica |
| Última unidad | Ambos seleccionan exactamente la misma partida ficticia con una unidad disponible; cada uno prepara un pedido TEST_ONLY distinto y registra simultáneamente | Un pedido confirmado; el otro rechazado por stock, conservando evidencia; no dos reservas de la misma unidad |
| Desconexión | En celular preparar otro pedido ficticio válido, desconectar internet y registrarlo una sola vez | Pendiente local, sin mensaje de éxito ni consumo confirmado |
| Reconexión | Recuperar internet y pulsar Sincronizar; conservar la misma operación | Un recibo y una reserva; no crear otro pedido para sustituir el pendiente |
| Recarga | Tras confirmación, recargar e ingresar otra vez | Se conserva pedido y recibo; no se registra de nuevo |
| Cobro y despacho | Gerente registra pago ficticio con referencia TEST_ONLY única y despacha el pedido confirmado | Pago sin descuento adicional; despacho consume una sola vez y libera reserva; vendedor ve el nuevo estado |
| Móvil | Revisar menú, formularios, teclado, selección de partida, gráficos gerenciales, zoom y rotación | Controles accesibles, sin campos ocultos por teclado ni desbordes que impidan operar |

Una pérdida de respuesta real requiere un ensayo separado y controlado: no equipararla a apagar internet antes de enviar. No usar una operación real ni dar esa prueba por aprobada con el caso de desconexión.

## Evidencia por caso

Registrar fecha/hora de Lima, equipo/navegador, perfil, nombre TEST_ONLY, saleId/operationId visible cuando exista, estado antes/después, físico/reservado antes/después y resultado observado. Si hay error, copiar el código y conservar el pendiente. No exportar tokens ni contenido de IndexedDB.

No cancelar ni borrar pedidos como limpieza del ensayo. Mantener los registros como evidencia; una compensación necesita seguir la política comercial aprobada. Cualquier resultado inesperado suspende el siguiente paso y debe documentarse.

## Ensayo de permisos con sesión individual

Abrir la misma URL del Worker con `?validation=5d`, ingresar con la cuenta individual autorizada y pulsar «Comprobar permisos y consultas». No compartir credenciales ni abrir la consola del navegador. El informe visible contiene solo perfil, códigos de resultado y tiempos; no incluye datos de clientes ni tokens.

En vendedor se esperan denegaciones de usuarios, reportes, dashboard, modificación de usuarios y configuración, más rechazo del rol falsificado. En gerente operativo se esperan denegaciones de usuarios y configuración. Los comandos administrativos usan un identificador inválido y no contienen cambios válidos: incluso una regresión de permisos no debe producir una modificación. El ensayo verifica además que la revisión del diario permanezca igual. Si hay otra operación concurrente, esa última comprobación puede fallar y exige investigar, no repetir escrituras.

Tres consultas de snapshot informan duración de ida y vuelta incluyendo la comprobación de sesión. Tres muestras no permiten afirmar capacidad, p95 ni rendimiento bajo carga. Un error de red, sesión o cuota deja el ensayo incompleto; no equivale a aprobado. El ensayo es optativo y exclusivo del paquete de laboratorio, sin nuevos endpoints ni funciones de mantenimiento.

Aplicar la decisión de SEGURIDAD-ALMACENAMIENTO-LOCAL-5D.md: equipos o perfiles de navegador separados por persona. Cambiar la cuenta Google dentro del mismo perfil no aísla los datos de IndexedDB.
