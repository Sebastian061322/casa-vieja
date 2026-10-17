# Revisión sencilla y pruebas físicas

Estado: equipos comerciales NO inspeccionados; iPhone/Android NO certificados. No se accedió ni exportó información comercial real.

## Revisar equipos actuales, solo después de autorización específica

Primero identificar sin abrir datos: persona, computadora/celular, Safari/Chrome, perfil personal y URL utilizada. No enviar contraseñas, contactos o capturas con clientes. Una misma persona puede tener varias colas por equipo/perfil/origen.

Una vez que el propietario autorice la lectura de esos equipos y destinos concretos:

1. Abrir la versión ORIGINAL usada en cada equipo; no actualizar, reinstalar ni borrar almacenamiento. Registrar hora, versión/origen, cuenta y disponibilidad de conexión.
2. Consultar su panel de sincronización. Si no muestra el estado, marcar DESCONOCIDO y pedir inspección técnica de ese origen; no concluir cero pendientes. El sistema anterior real podría tener un formato distinto al laboratorio.
3. Identificar pendientes, confirmadas/recibos y rechazadas. Anotar operationId sin datos de cliente. Un nombre o número de venta no sustituye el identificador técnico.
4. Para cada pendiente consultar el servidor/motor original: COMMITTED recupera recibo; PREPARED reanuda mismo comando; UNKNOWN requiere investigar antes de reenviar; REJECTED conserva rechazo y motivo. No registrar en el nuevo sistema una venta que podría existir en el antiguo.
5. Exportar comandos/recibos solo si se aprueba separadamente la exportación y su destino privado. El archivo puede contener datos personales. No subirlo a GitHub ni enviarlo por chat como rutina.
6. Firmar acta por equipo: pendientes resueltas/por revisar y última confirmación. No cerrar el corte si falta un equipo/origen. El guardia nuevo está cerrado por defecto hasta disponer del acta.

Nunca eliminar IndexedDB, limpiar caché/datos del sitio ni usar incógnito como forma de resolver una cola. Tampoco transformar V2/V3 a V4 ni mover datos de localhost a Google.

## Acceso privado preparado para computadora y celular del propietario

[Panel del simulacro](https://script.google.com/macros/s/AKfycbyYgnficwXzUGuADO4dyjxCSuCin14P7UpsrX7pQceA/dev?phase5c=operational)

[Interfaz 5C con protección de continuidad](https://script.google.com/macros/s/AKfycbyYgnficwXzUGuADO4dyjxCSuCin14P7UpsrX7pQceA/dev?phase5c=review)

Son accesos /dev del proyecto autorizado: código guardado, acceso de editor/propietario, sin nueva publicación. Si Google solicita otra cuenta, usar tu cuenta propietaria en tu propio equipo; no compartirla. Si alguien no autorizado no puede entrar, es un resultado esperado; no conceder edición de Sheets o Script para sortearlo.

### Ensayo físico del propietario que sí puede hacerse ahora

1. En tu computadora abre el panel, pulsa Consultar avance y toma captura del run, step y done. El simulacro automatizado puede estar terminado: pulsar continuar debe devolver el mismo resultado, sin nueva venta.
2. En tu celular, con tu cuenta propietaria, abre el mismo panel y pulsa Consultar avance. Deben coincidir run, 21 pasos, done true y saldos. No es una prueba de dos usuarios distintos.
3. Desactiva internet en el celular y consulta avance: no debe inventar una confirmación. Reconecta y vuelve a consultar; el resultado original debe recuperarse. Este panel no usa cola IndexedDB: NO acredita persistencia de una venta offline.
4. Abre la interfaz 5C en ambos equipos. Debe mostrar la revisión de colas y no permitir nuevas altas sin el acta de otros orígenes. No uses fixture=1 para aparentar cierre de equipos reales.
5. Revisa menú, zoom 200 %, orientación y desplazamiento. Anota modelo/SO/navegador, hora, paso, resultado y captura sin datos personales. No declarar aprobado solo por abrir la página.

### Pruebas que deben esperar autenticación individual

Registrar simultáneamente como dos sujetos distintos, última unidad, borrador/cola offline y recarga, recuperación de confirmación, cobro/despacho según permisos y denegación de costos/configuración. Usar el protocolo 5C PRUEBAS-FISICAS.md y únicamente catálogo/contactos sintéticos. Necesitamos el servicio de identidad aprobado y cuentas de prueba; hoy no existe acceso de vendedor real.

| Equipo / navegador | Perfil | Caso | operationId / run | Resultado | Evidencia |
|---|---|---|---|---|---|
| Computadora del propietario | Administrador lab | 1, 3–5 | Por completar | PENDIENTE FÍSICO | — |
| Celular del propietario | Administrador lab | 2–5 | Por completar | PENDIENTE FÍSICO | — |
| Segundo operador con cuenta propia | Ventas / inventario | Protocolo multiusuario | Por completar | BLOQUEADO POR IDENTIDAD REAL | — |
