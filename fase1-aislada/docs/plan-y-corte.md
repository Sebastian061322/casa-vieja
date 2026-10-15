# Plan concreto y continuidad

## 1. Preparación local — realizada

Laboratorio independiente, fixtures sintéticos y pruebas sin red. Lectura de auditoría existente, sin repetir diagnóstico general. Ningún dato de cliente se copió al laboratorio. No se guardó el código original con credenciales en esta carpeta.

La petición actual autoriza trabajo local aislado. Se requiere confirmación expresa antes de crear una rama remota o recursos Google: propuesta revisable, rama `dev/fase1-estabilizacion` desde un SHA verificado, repositorio existente; proyecto Apps Script independiente y hoja nueva `CasaVieja_Pruebas_SINTETICA`. Nunca vinculados a BaseDatos_CasaVieja, nunca clonados con datos de clientes. Sin push automático ni cobros. Confirmar también disparadores y automatizaciones del repositorio antes de cualquier push, ya que una rama podría activar despliegues.

## 2. Integración en copia aislada — pendiente

Orden de cambios pequeños, cada uno revisable y con prueba:

| Paso | Archivos propuestos | Criterio de aceptación | Riesgo y reversión local |
|---|---|---|---|
| Backend sin red productiva | apps-script/Code.gs, Operations.gs, Journal.gs, Validation.gs | identidad de destino de pruebas comprobada, lecturas sin escrituras, acciones desconocidas/saveDB rechazadas | No copiar constantes productivas; desechar solo recursos sintéticos |
| Diario durable y recuperación | Journal.gs y pruebas de adaptador | inyectar caída antes/después de cada append y commit; recuperar sin doble efecto; verificar lock real | LockService no es transacción; no habilitar hasta probar recuperación |
| Cola antes de éxito local | copia de index.html: saveDB/persistOutbox/syncRemote/flushOutbox | offline persiste, errores visibles, ACK operationId/epoch/revisión, timeout consulta estado | Mensaje de éxito prematuro; conservar exportación de cola |
| Descarga consistente | copia de index.html: refreshFromRemote | generación, destino, revisión y colas fallidas revalidados al recibir | Respuesta vieja; descartar respuesta y mantener cola |
| Venta y combo futuros | addSale/addComboSale/saveSaleEdit/deleteSale e invAllocateBags | líneas completas, costo snapshot, no sobreasignación, cancelación sin borrado ni devolución ficticia | No usar producto actual para revertir consumo original |
| Stock/lotes/reservas | motor y vistas existentes | un diario futuro, recepción/preparación/despacho conservan cantidades, lotes/familias separados | Doble inventario; retirar autoridades de saldo absoluto solo en copia |
| Interfaz | HTML/CSS actuales de la copia | comparación visual móvil/escritorio y mismo flujo; estados pendiente/conflicto visibles | No hay cambios visuales aplicados todavía |

Estimación orientativa de esfuerzo: backend y recuperación, 2–4 jornadas; integración cliente y combos, 1–3; inventario y transición, 2–4; validación operativa depende de conteo y dispositivos. No es fecha comprometida ni garantía de cierre en una noche.

## 3. Continuidad mientras se vende — procedimiento propuesto, no activado

El sistema actual continúa con sus limitaciones. No llamar a su doGet para extraer información: puede migrar y escribir. No limpiar caché, reinstalar PWA, cerrar sesiones ni vaciar colas antes de resguardar cada dispositivo. No ejecutar saveDB, restaurar copias completas, reintentar en masa ni reenviar colas antiguas al backend nuevo.

Inventariar cada PC/celular: responsable, versión, pedidos abiertos, última confirmación y operaciones pendientes/fallidas. Obtener exportaciones locales bajo autorización y sin conectarlas a producción; protegerlas fuera de Git. Conservar hash, hora y destino; no copiar tokens a informes. Revisar qué funciones de exportación realmente son solo lectura antes de usarlas.

Preparar registro separado de transición con transitionId, deviceId, operación original, venta/pedido, fecha de captura, fecha de confirmación, estado (local/recibido/confirmado/ambiguo), cantidades, recurso/lote y evidencia. Un dato ambiguo no se descarta ni se reenvía automáticamente. No adjudicar vínculo por fecha o nombre. Si el sistema antiguo no da operationId, registrar referencia externa única y exigir revisión humana.

Tener una breve ventana de cambio coordinada: detener solo nuevas escrituras del cliente antiguo, capturar todas las colas y pedidos, registrar las ventas durante la ventana en un canal separado con ID único y acuse. Si no hay canal disponible, posponer el corte: no prometer ventas confirmadas sin registro durable. Las operaciones en tránsito se clasifican antes de habilitar el sistema nuevo.

## 4. Corte inicial — requiere aprobación humana

No hay fecha/hora T0, saldos ni costos aprobados todavía. No usar 47/40 u otras cifras de auditoría como apertura. No usar kg tostados originales como disponible.

1. Contar por lote físico, familia comercial, grano/molido, tamaño y condición. Separar granel (gramos enteros), bolsas (unidades enteras), insumos, mercadería en tránsito, preparada, reservada, despachada, devuelta y cuarentena.
2. Cada fila de conteo: recurso, unidad, cantidad, ubicación, hora real, responsable, verificador, evidencia. Conteo a distintas horas requiere registrar cada movimiento hasta T0; no asumir simultaneidad.
3. Apertura física = existencias contadas llevadas documentalmente a T0. Reserva no resta físico; disponible = físico − reservas confirmadas. Preparado sigue físico mientras permanezca en almacén. Ya despachado no vuelve a descontarse. Mercadería entrante aún no recibida no es disponible.
4. Pedidos abiertos anteriores se referencian con identificador externo de legado en el espacio FUTURO, sin actualizar sus filas antiguas. La aprobación distingue lo aún por despachar de lo ya consumido. No se importa toda venta antigua ni se repiten movimientos históricos.
5. Cada comando en tránsito debe quedar en exactamente una categoría: confirmado en legado antes de T0 e incluido en conteo; pendiente trasladado explícitamente al registro futuro; ambiguo retenido con evidencia. No marcar trasladado hasta aceptación durable del destino. Conservar tabla externa de correspondencia, nunca reescribir IDs antiguos.
6. Costos de apertura documentados y aprobados por recurso/lote. Si desconocidos, margen queda pendiente; nunca cero por defecto ni inferido del precio de venta. El demo usa costos ficticios completos, no implementa todavía costo pendiente.
7. Nuevo lote con ID independiente, recepción física y costo acreditado; no absorber faltantes históricos. Variedad y molienda son dimensiones distintas.
8. Firmar manifiesto de corte: T0 en America/Lima, recursos, cantidades, reservas, colas, excepciones, costos, responsables y versión cliente/backend. No activar mientras haya ambigüedad que pueda duplicar consumo.

La apertura se registra en un almacén NUEVO, externo a todas las pestañas productivas existentes. Esa escritura futura requerirá autorización específica. El legado permanece consultable a través de un lector que no invoca migraciones, no guarda ni recalcula y no mezcla sus saldos con la apertura. BaseDatos_CasaVieja no será destino del protocolo nuevo.

## 5. Aprobación y activación — fuera de esta ejecución

Para aprobar: cinco regresiones sobre aplicación integrada corregida; 100 reintentos; dos dispositivos reales; última unidad; caída en cada paso; PREPARED invisible; recuperación y proyecciones reconstruidas; colas fallidas conservadas; 100% de dispositivos identificados y pedidos en tránsito clasificados; conteo firmado; comprobación de que ninguna ruta llega a Sheets histórico. Recepción/preparación/insumos requieren sus propias pruebas antes de habilitarse.

Se necesita una decisión adicional sobre los clientes antiguos: mientras sigan guardando en el sistema anterior, la inmutabilidad total futura de esa base no puede garantizarse. No se modificaron clientes, credenciales, permisos ni despliegues para detenerlos. La retirada/restricción del escritor antiguo deberá aprobarse junto con la activación; es una dependencia, no una acción autorizada ahora.

Reversión: antes de activar, descartar cambios de la copia; después de activar, suspender escrituras nuevas afectadas, conservar comandos, recuperar y reconstruir solo proyecciones futuras desde diario. No restaurar un backup antiguo sobre ventas actuales. No volver a habilitar escritor antiguo. Backups futuros deben incluir diario, IDs, apertura, manifiesto y colas; probar recuperación en otro destino de pruebas, con hashes y sin acceso productivo.

## Datos necesarios para el siguiente paso

- Aprobación de rama remota y recursos sintéticos si se desean ahora; local ya preparado.
- Exportación sanitizada del Apps Script realmente desplegado y su versión (no token).
- Identificación de dispositivos y pedidos en tránsito; posteriormente conteo físico y responsables.
- Aprobación separada de T0 y apertura; nunca se deduce del silencio ni de una prueba aprobada.
