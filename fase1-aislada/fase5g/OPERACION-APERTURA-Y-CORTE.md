# Operación, apertura y corte — DRAFT, sin autorización comercial

## Lote previsto de aproximadamente 300 kg

Los 300 kg son pergamino previsto, no una recepción, rendimiento, tostado ni bolsas disponibles. Plantilla lote-300kg-DRAFT.json con peso/costos/documentos reales en blanco. Pesos internos enteros en gramos; dinero en céntimos PEN. La clasificación Gourmet/Especialidad se confirma por lote; nunca se mezcla para compensar diferencias.

1. Recepción: pesar con evidencia de balanza y tara, registrar proveedor, fecha, variedad/origen, clasificación, documento, adquisición y flete atribuible. Crear ID único. Control de pago de compra por separado; no ingreso financiero.
2. Pilado: indicar peso de pergamino efectivamente procesado, verde obtenido, merma/subproducto pesado y costo/documento. Conservar remanente no procesado en su recurso. No presumir porcentajes.
3. Tostado: consumir café verde del lote; registrar entrada, tostado obtenido, merma y costo por tanda. No usar pergamino como entrada de tostado.
4. Molienda opcional: consumir tostado en grano, registrar molido obtenido y merma, costo y responsable. Granel en grano y molido son recursos distintos del mismo lote.
5. Preparación: consumir el granel de molienda correcta más empaques/etiquetas de la receta de ensayo, merma explícita y costo. Aumentar exclusivamente bolsas de 250/500 g confirmadas. Receta comercial pendiente de ratificación; no inventar válvulas/cajas/consumos.
6. Control: entrada = salida + merma en cada proceso, con remanentes aparte. Costos de café consumido y proceso se capitalizan; merma normal se conserva explícita y su costo permanece en producto obtenido según modelo de laboratorio. Esta política contable necesita aprobación comercial; no afirmar que una cifra sintética sea costo real.
7. Venta reserva; despacho confirmado consume físico/libera reserva; cobro y entrega no vuelven a consumir. Los costos confirmados quedan en el plan histórico y no se recalculan por cambios de oferta.

No ejecutar recepciones reales hasta tener pesajes/documentos y aprobación. Los ejemplos automatizados de 300000→240000→192000 g son exclusivamente ficticios y no predicen rendimiento de este lote.

## Conteo y acta prospectiva

Usar acta-apertura-DRAFT.json / conteo-apertura.csv. Corte efectivo propuesto 01/11/2026 00:00 America/Lima, sujeto al GO; no activa nada por calendario. Responsable y segundo revisor distintos, lote/etapa/molienda/gramaje, físico, unidad, valor histórico respaldado, referencia de costo, reservado/pedido pendiente y condición AVAILABLE/HELD/DAMAGED. HELD/DAMAGED no se convierten automáticamente en disponibilidad comercial.

Contar pergamino, verde, tostado grano/molido, bolsas, lotes anteriores, insumos, reservas, pedidos sin despachar y retenidos/dañados. No compensar entre lotes. Separar propiedad del inventario, obligación comercial y pago pendiente.

El validador local genera SHA256 de un acta DRAFT completa; hash no equivale a firma ni aprobación. Plantillas vacías no tienen hash válido ni saldos ejecutables. No reproducir ventas anteriores para producir la apertura, ni registrarla como compra o ingreso.

Reservas: cada cantidad debe enlazar un pedido/obligación anterior identificable; no basta copiar «reservado». Diseñar el arrastre prospectivo con referencia al legado y reconocer solamente saldo pendiente respaldado, sin volver a crear venta, ingreso, cobro o COGS histórico. Pedidos despachados con cobro pendiente y reservas sin despacho son casos distintos. El validador marca requiresCarryoverDesign; el candidato NO implementa una migración comercial ni una aprobación de acta. Esa condición bloquea la apertura.

## Inventario de equipos y rutas

Dispositivos-comerciales-DRAFT.csv es un censo propuesto, no una inspección realizada. Antes de leer cada equipo pedir autorización específica: equipo/perfil/persona/origen, lectura de metadatos y estado de colas, sin exportar datos por defecto. La autorización de un equipo no autoriza otro. Cuentas Gmail individuales y perfiles separados ya confirmados; número real de navegadores/orígenes comerciales pendiente.

Por cada origen registrar nombre/versión IndexedDB, stores, epoch/motor, operationIds pendientes, recibos confirmados, rechazos, último sync y usuario. No borrar almacenamiento, reinstalar ni reenviar UNKNOWN. Confirmar COMMITTED por status; conservar PREPARED para su motor compatible; revisar/archivar REJECTED con evidencia sin eliminarlo. No automatizar trasvase V2/V3/V4.

Rutas a inventariar con evidencia actual: frontend main y copias en caché; endpoint Apps Script y versiones aún activas; doPost/doGet que puedan escribir; google.script.run; activadores; sincronizadores/manuales; usuarios con edición directa de Sheets; imports/backups; n8n/bots/webhooks si existen. La existencia de un bot local en otro proyecto no prueba conexión con esta base. No visitar endpoints antiguos sin revisar su código: incluso doGet podría escribir.

## Corte operativo propuesto 31/10 → 01/11

1. GO previo, candidato exacto y respaldos verificados. Registrar último ID/revisión confirmados del motor antiguo y hash de copia; nunca llamar «última» a una fila leída mientras siguen entrando ventas.
2. Aviso operativo y pausa de altas en todos los equipos; contingencia solo por procedimiento expresamente autorizado. Ninguna venta se introduce en un sistema paralelo para suplir la pausa.
3. Drenar colas conocidas en el motor de origen. Si hay UNKNOWN o equipo sin revisar: NO-GO. Resolver PREPARED con versión compatible, no reconstruir comandos a mano.
4. Con aprobación separada, cerrar en servidor TODOS los caminos de escritura antiguos y activadores. Verificar rechazo sin efectos y ausencia de solicitudes en vuelo. Mantener consultas de legado seguras. Un aviso o botón oculto no cierra el backend.
5. Intervalo explícito sin escritor: respaldo posterior al cierre, conteo físico/revisión de reservas y acta final aprobada. Cualquier movimiento físico durante conteo se detiene o documenta bajo contingencia aprobada.
6. Verificar firmas/hashes, obligaciones trasladadas y esquema/destino nuevo. Con autorización de apertura, aplicar una única operación idempotente de apertura; cotejar proyección y acta. No copiar el historial a ese diario como ventas nuevas.
7. Con autorización explícita independiente, habilitar exclusivamente el escritor nuevo. Probar primer pedido autorizado, recibo, reserva, cobro/despacho cuando correspondan y balances; no registrar una venta ficticia en producción.
8. Después de cualquier operación real nueva, si falla: bloquear altas nuevas, conservar recibos/movimientos posteriores y recuperar con motor compatible. Nunca restaurar una copia anterior encima ni reabrir automáticamente el escritor viejo.

writer-fence.cjs prueba OLD→NONE→NEW→NONE, generación obsoleta, control de cambios y prohibición de retorno automático. Solo funciona si TODAS las escrituras pasan por la misma autoridad/lock. ScriptLock de un proyecto NO bloquea otro Apps Script; no se afirma exclusión global de producción.

## Contingencias y manual de tres perfiles

| Incidente | Acción segura |
|---|---|
| Internet / Google / Cloudflare caídos | Conservar misma cola/operationId; no éxito anticipado. Portal nuevo puede no cargar offline. No limpiar datos ni usar otro sistema como escritor alterno. |
| Sesión vencida | Reingresar con la misma cuenta/perfil; consultar el pendiente original. No entregar credenciales por chat ni cambiar de usuario para forzar confirmación. |
| Respuesta perdida | Consultar status/recibo original; sincronizar, sin crear una venta sustituta. |
| Cobro pendiente | «Reservado» no es «pagado». Gerente confirma importe/medio/referencia cuando exista evidencia; no repetir consumo físico. |
| Diferencia de inventario | Detener el producto/lote afectado mediante procedimiento aprobado; conservar diario y pedir revisión. No editar saldos o históricos. |
| Dispositivo averiado | Otro dispositivo no tiene automáticamente su IndexedDB. Preservar equipo/perfil, revisar servidor y copia por dispositivo autorizada; no recrear pedidos desconocidos. |
| Cuenta perdida | Recuperación oficial Google por propietario; verificar segundo administrador/control de acceso según política. No compartir sesión ni elevar vendedor. Secretos solo mediante formularios seguros y custodia acordada. |

Vendedor: ingresar cuenta propia → revisar disponibilidad → nuevo pedido → comprobar datos → Registrar una vez → distinguir borrador, pendiente y confirmado. No cobra, no despacha, no modifica precio/costos ni accede a reportes.

Gerente operativo: lo anterior más compras/lotes/procesos, cobros referenciados, despacho, gastos y reportes. Pesar cada etapa; solo confirmar con evidencia. Sin usuarios/configuración crítica. Las operaciones con política pendiente permanecen bloqueadas.

Administrador: funciones anteriores, catálogo/configuración/usuarios autorizados y supervisión de respaldos/corte. Antes de actualizar: censo de colas, copia/hashes, versión y comprobación de recuperación. No borrar diarios ni limpiar IndexedDB para «arreglar» el sistema.
