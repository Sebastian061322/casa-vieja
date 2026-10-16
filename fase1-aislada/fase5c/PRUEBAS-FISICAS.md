# Pruebas físicas pendientes — 5C

Estado: NO EJECUTADAS en iPhone ni Android. Las pruebas de navegador local no sustituyen equipos físicos. Utilizar el protocolo de Fase 5B y datos exclusivamente ficticios.

## Preparación

Administrador identifica iPhone/Safari y segundo equipo/Chrome, versión SO/navegador, persona, perfil y URL/origen exactos. No compartir la cuenta del propietario. Las identidades individuales reales requieren primero habilitar y validar el proveedor de identidad en laboratorio; por ahora solo hay sujetos ficticios. La versión publicada privada antigua no prueba el candidato 5C. El acceso /dev es solo para editores autorizados y carga el código guardado; no ampliar permisos para completar este ensayo sin aprobación.

Registrar por paso: hora, dispositivo, usuario, operationId, revisión antes/después, estado, captura y resultado. Exportar cada cola antes y después, conservar recibos y no limpiar almacenamiento. Si falta identidad individual, marcar esa parte BLOQUEADA, no aprobada.

## Casos

1. Dos usuarios registran pedidos ficticios distintos simultáneamente. Debe quedar un recibo por ID y responsable correcto; el vendedor no ve el pedido del otro.
2. Administrador prepara un único envasado sintético. Ambos intentan reservarlo: exactamente uno confirma; el otro recibe rechazo por stock sin reserva adicional.
3. Desconectar un equipo, crear borrador y enviar. Debe verse pendiente, conservar ID al recargar y no mostrar éxito. Reconectar y recuperar un único recibo.
4. Cortar conexión inmediatamente después de enviar; consultar estado con ID original. Si COMMITTED, recuperar recibo; si PREPARED, recuperar con mismo motor/comando. No registrar otra venta como sustituto.
5. Con borrador y pendiente, cargar nueva interfaz en el mismo origen. Deben persistir ambos y bloquear una cola incompatible. Abrir otro origen y comprobar que NO se certifica la cola del primero.
6. Verificar permisos mediante URL/solicitud directa además del menú: vendedor sin costos, utilidades, respaldo, configuración ni elevación de perfil; inventario sin contactos ni precios internos.
7. En Safari/iPhone y Chrome/Android abrir formulario, teclado, cambiar orientación, usar zoom 200 %, recorrer con foco, abrir/cerrar menú, desplazarse y consultar gráficos. Revisar áreas seguras y que el botón de confirmación siga accesible sin perder borrador.
8. Con perfil autorizado, cobrar y despachar una vez; repetir solicitud con mismo ID. El pago no consume stock; despacho único respeta reserva. Cancelar según estado y verificar compensación única.
9. Repetir con tres solicitudes simultáneas y comprobar saldo físico/reservado/disponible y diarios. Conservar comandos rechazados y motivo.

No registrar ventas reales, no usar inventario físico real y no introducir datos personales reales. Si hay duplicación, pérdida de cola, exposición financiera o responsable incorrecto, detener y registrar BLOQUEO P0.

## Acta

| Caso | iPhone/Safari | Segundo equipo | IDs/evidencia | Resultado |
|---|---|---|---|---|
| 1–9 | Pendiente | Pendiente | Sin evidencia física | NO EJECUTADO |

El propietario valida la evidencia antes de cerrar esta condición. Una simulación con tres actores ficticios y una sesión Google no equivale a tres cuentas autenticadas.

Acceso de desarrollo observado en el editor: https://script.google.com/macros/s/AKfycbyYgnficwXzUGuADO4dyjxCSuCin14P7UpsrX7pQceA/dev?phase5c=review . Es privado de editores; no concede acceso a vendedores ni reemplaza la autenticación individual pendiente. La opción fixture=1 representa un acta ficticia y solo sirve para ensayo sintético, nunca para certificar dispositivos comerciales.
