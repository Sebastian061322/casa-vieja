# Validación física pendiente — Fase 5B

Estado: NO EJECUTADA. Un navegador de escritorio o un ancho simulado no certifica Safari de iPhone ni Chrome de Android.

Usar exclusivamente el despliegue privado sintético autorizado. Registrar versión de despliegue; actualmente el despliegue anterior no incorpora 5B. No compartir una cuenta del propietario con operadores. Para la prueba, el propietario inicia su propia sesión en ambos equipos. Nunca utilizar clientes reales. Antes de empezar, confirmar TEST_ONLY y ausencia de operaciones propias pendientes. No borrar datos del navegador para resolver fallos.

## Preparación y evidencia

Equipo A: iPhone, modelo, iOS, Safari, zoom, fecha/hora Lima. Equipo B: Android, modelo, versión Android/Chrome, zoom, fecha/hora. Registrar red, versión de frontend, nombre de base IndexedDB, epoch, operationId, saleId, revisión y capturas con datos ficticios. Guardar evidencia en una carpeta local privada. No publicar exportaciones de colas con contactos reales.

1. Seleccionar una partida sintética que tenga exactamente una bolsa disponible y precio vigente. En ambos equipos abrir el mismo producto; usar clientes `DEMO físico A` y `DEMO físico B`.
2. Registrar simultáneamente una bolsa por equipo. Debe confirmarse una sola reserva; el otro debe mostrar rechazo por falta de stock, conservando evidencia. Físico 1, reservado 1, disponible 0. Comparar ambos operationId con diario; solo una operación COMMITTED.
3. En el equipo ganador cortar la red, intentar sincronizar y recargar. La cola debe conservar su mismo operationId. Reconectar: recuperar confirmación, sin crear otro pedido. Para respuesta perdida real, interrumpir red mientras se envía; si no se logra esa ventana, marcar caso NO EJECUTADO, no aprobado.
4. Cancelar el pedido reservado con motivo. Reintentar: físico 1, reservado 0, disponible 1; ninguna devolución física adicional. Archivar el rechazo del otro equipo solo cuando el servidor confirme REJECTED.
5. Venta sintética nueva → cobro → despacho → entrega. Solo despacho debe descontar físico. Regresar producto físicamente mediante devolución registrada y tramitar reembolso separado. Comparar costo original y costo compensado; repetir devolución debe rechazarse.
6. Dejar una operación pendiente en una versión anterior y actualizar únicamente la interfaz en el mismo origen. Verificar misma base IndexedDB, command/fingerprint/operationId, consulta de estado y recuperación de confirmación original. No copiar ni transformar comandos V2/V3 en V4. Si cambia el origen del iframe o el nombre de base, detener y registrar incidencia: la migración automática no existe.
7. En iPhone abrir teclado en nombre, teléfono, cantidad y envío. Confirmar visibilidad del campo, botón y mensajes; probar orientación, área inferior segura, menús y desplazamiento de modal. Android: repetir con Chrome y teclado del dispositivo.
8. Probar zoom 200%, tamaño de texto grande y navegación por teclado externo o lector de pantalla cuando disponible. Verificar foco al abrir/cerrar menú y modal, etiquetas, errores anunciados, tabla alternativa del gráfico y contraste de estados. Ausencia de equipo/lector se registra como pendiente.
9. Cerrar sesión y comprobar si quedan datos del propietario en el navegador. Actualmente existe caché local sin cierre de sesión propio: no usar equipos compartidos. Este caso es bloqueo para habilitar operadores.

## Acta por caso

| Caso | Equipo / sistema / navegador | Versión | operationId / revisión | Esperado | Observado | Captura | Resultado |
|---|---|---|---|---|---|---|---|
| Simultaneidad | Pendiente | Pendiente | Pendiente | Una reserva | Sin ejecutar | — | NO EJECUTADO |
| Respuesta perdida | Pendiente | Pendiente | Pendiente | Una confirmación | Sin ejecutar | — | NO EJECUTADO |
| Persistencia y actualización | Pendiente | Pendiente | Pendiente | Sin pérdida | Sin ejecutar | — | NO EJECUTADO |
| Teclado/zoom/área segura | Pendiente | Pendiente | — | Flujo completo | Sin ejecutar | — | NO EJECUTADO |

Detener ante duplicación, saldo negativo, confirmación sin recibo, desaparición de cola o exposición de costos a una cuenta no autorizada. Conservar evidencia y no editar los diarios para corregir el ensayo.
