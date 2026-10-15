# Acta de implementación — Fase 2

Fecha: 15/10/2026, America/Lima.

## Cambios y errores resueltos

1. El modelo en memoria no escribía en Google. Se implementó adaptador append-only con bloqueo de Apps Script y una apertura sintética durable.
2. El alta comercial no era una operación integral: ahora el plan completo vincula venta, costos y consumos; COMMITTED define su visibilidad lógica.
3. Los reintentos podían perder el resultado al recargar. La cola v2 conserva comandos inmutables y recibos atómicos en IndexedDB; consulta estado antes de reenviar.
4. La descarga remota podía pisar cambios o revisiones confirmadas más nuevas. Se revalidan generación, destino, pendientes y revisión mínima de recibos al aplicar.
5. La cancelación del modelo previo solo liberaba reservas. Esta fase registra consumo comercial y su compensación referenciada, sin borrar venta ni efectos.
6. El costo de combos se calculaba incorrectamente en el sistema legado. La implementación nueva suma cantidades por costo backend y guarda ese snapshot; editar contacto no cambia ganancias. No se corrigió ningún registro antiguo.
7. Un rechazo permanente podía bloquear toda la cola sin salida. Ahora puede archivarse, conservando el comando, solo si la consulta de estado confirma REJECTED terminal; conserva la evidencia del servidor.
8. Un rechazo por stock podía aceptarse más tarde tras una reposición con el mismo operationId. Ahora REJECTED es durable y conserva el resultado original.
9. El mensaje inicial quedaba en «Conectando» aun después de recibir stock. El paquete actualizado muestra la conexión confirmada.

## Pruebas ejecutadas

- 18 pruebas de Fase 1 conservadas: aprobadas.
- 39 pruebas nuevas locales: aprobadas. Incluyen reglas, diario local en disco, seis puntos de fallo, confirmación perdida, concurrencia lógica, aislamiento, edición, cancelación, archivo de rechazo y adaptador Apps Script completo con servicios simulados.
- Prueba real de backend Google: aprobada, 5 comandos confirmados y stock demo restaurado. La repetición de comando devolvió la confirmación original.
- Interfaz real en Safari: alta confirmada, stock demo 10 a 9 y recarga sin duplicación observada.

La concurrencia local usa dos clientes lógicos; no son dos dispositivos físicos. Los fallos de red locales son inyectados. El paquete de verificaciones de navegador permite probar dos deviceId con RPC paralelos reales y pérdida de respuesta simulada sobre una venta real de pruebas. Su ejecución remota adicional está pendiente de actualizar y comprobar la versión del despliegue privado.

## Límites de alcance

No se escribió ni se leyó BaseDatos_CasaVieja productiva en esta fase. No se modificó Apps Script productivo. No hay migración, corrección histórica ni corte aprobado. El código conserva en pruebas los registros antiguos mediante separación de almacenes y listas de pestañas permitidas; no afirma haber calculado hashes de producción ni inmovilizado los clientes productivos antiguos.

El diseño visual conserva CSS y navegación originales, pero la aplicación privada de laboratorio solo implementa ventas. Otros módulos no realizan acciones. Falta revisión móvil completa y la futura integración gradual con la aplicación comercial. No se reemplazó index.html raíz.

## Estado de entrega de la versión final

57 pruebas locales aprobadas (18 anteriores + 39 nuevas), sin fallos. La corrección final está guardada en el editor de Google. Su actualización en el despliegue privado y la lectura del informe completo del navegador siguen pendientes; no se presentan como verificadas. La ejecución previa del navegador dejó ventas sintéticas canceladas, pero su resultado completo no se recuperó.

## Riesgos y pendientes

- Unificar granel, envasado, reservas, preparación, insumos, recepción y devoluciones físicas; quedan fuera de esta fase.
- Separar reserva/físico para la evolución posterior; por ahora registrar venta descuenta disponibilidad comercial y despacho no vuelve a descontar.
- Eliminar funciones de mantenimiento de laboratorio y revisar roles/autenticación antes de producción. El OAuth autorizado es amplio aunque el código limite el destino.
- Medir cuotas, tiempos y crecimiento del diario; el cálculo actual recorre todo el historial FUTURO de prueba.
- Probar respaldo/restauración aislada, dos dispositivos físicos, funcionamiento móvil y nuevas versiones sin perder colas.
- Aprobar conteo físico, fecha de corte, pedidos y colas en tránsito por separado. Conservar el legado inmutable y evitar que clientes antiguos sigan escribiendo durante una futura activación.

No hay autorización implícita para producción por tener pruebas aprobadas.
