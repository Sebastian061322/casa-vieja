# Escritores antiguos y versión 2 — preparación, no ejecución

Base remota comprobada al iniciar 5G.2: `6578003bcd02988c1b4a44b9402e5dbc23963d34`, rama dev/fase1-estabilizacion. El laboratorio local no es un checkout Git. La inspección autorizada del 25/10 se reutiliza como evidencia histórica; no se consultó producción nuevamente ni se presume que su configuración siga igual el día del corte.

`MATRIZ-ESCRITORES.csv` contiene 18 rutas/clases de acceso, con autoridad, riesgos en tránsito, método de suspensión propuesto, prueba, recuperación y permiso requerido. Las clases de editores e integraciones no equivalen a recursos reales ya identificados. Ninguna columna pendiente se reemplaza por «no existe».

## Versión 2: riesgo y opciones

Confirmado estáticamente el 25/10: implementación activa v2, red Cualquiera, ejecución por propietario, GET que lee A1 sin validar clave y POST que reemplaza JSON en A1 con clave compartida. **No se leyó A1 ni se probó exposición de datos.** Las URLs/IDs completos y la clave no se incluyen en este paquete.

| Opción | Condiciones previas | Permiso independiente | Estado actual |
|---|---|---|---|
| Retirar solo v2 antes del corte general | Censo de todos los contextos, pendientes y copias; identificar qué implementación usa cada uno; inventariar integraciones; demostrar que no dependen de v2 y preparar contingencia | Archivo de la implementación v2 exacta, con confirmación de recurso/riesgo/ventana por propietario | **No autorizado ni ejecutado; uso de v2 todavía desconocido** |
| Mantener temporalmente mientras se completa el censo | Registrar el riesgo y minimizar plazo; no compartir claves ni hacer pruebas GET | No modifica configuración, pero tampoco resuelve la exposición | Situación sin cambios; no significa aprobación de seguridad |
| Reemplazo de implementación o rotación coordinada | Copia/versionado y pendientes resueltos en todos los clientes; paquete exacto y validación previa | Cambios de código, permisos o clave requieren autorización separada | No preparado para ejecutar sin estos requisitos; puede interrumpir clientes |

Un registro de ejecución vacío o cero activadores no prueba que un celular desconectado no use v2. No se retirará por deducción. No enviar ping a v2: esa versión no implementa el protocolo action y su POST atraviesa la ruta de escritura A1. No probar nunca su GET sin autenticación para ver qué contiene.

## Censo por contexto

El propietario declaró el 28/10 que dos personas encargadas usan Safari en celular y computadora. Eso define cuatro **contextos de uso por identificar**, no cuatro equipos físicos distintos comprobados. El propietario confirmó el origen `https://sebastian061322.github.io/casa-vieja/` durante 5G.2. El contexto comercial adicional del vendedor y los perfiles/equipos exactos siguen pendientes. GitHub confirma Pages habilitado con homepage vacío; no se visitó ni ejecutó la web comercial para averiguar su dirección.

`templates/CENSO-DISPOSITIVOS.csv` separa declaración, autorización y observación. No hay ninguna cola real inspeccionada en 5G.2.

Antes de cada inspección fijar: etiqueta de equipo, persona/perfil, origen HTTPS exacto, pestaña ya abierta, alcance COUNTS_ONLY, almacenamiento antiguo/nuevo y destino de evidencia. Una aprobación no abarca otros contextos.

1. No abrir una copia nueva de la web ni recargarla para inspeccionar: su arranque puede sincronizar o llamar GET con efectos. Primero revisar el comportamiento de la versión/origen y acordar una ventana sin registro de nuevas operaciones. No cambiar conectividad sin aprobación.
2. Antiguo: contar por separado `casa_vieja_outbox` y `casa_vieja_failed_ops` en localStorage. Malformado/desconocido se registra como tal, nunca como cero. Cero pendientes o badge verde no acredita servidor sin operaciones en tránsito.
3. Nuevo: identificar origen, perfil, motor/versión y bases IndexedDB; leer cantidades/recibos solo dentro del alcance aprobado. Las bases de otro origen no son accesibles automáticamente. No transferir colas entre V2/V3/V4/DR.
4. Registrar versión/implementación a partir de configuración local de conexión con credenciales ocultas. No llamar ping/doGet/doPost ni mostrar el token. IDs de implementación quedan privados; una referencia redactada sirve al informe.
5. Si no hay recibos o último-sync verificables, registrar DESCONOCIDO. No inferir que una operación en outbox no fue aplicada en servidor.
6. UNKNOWN/PREPARED requiere un plan compatible y autorización para cualquier ejecución/reenvío. La aprobación de lectura no permite resolverlo con escrituras. REJECTED conserva evidencia; no borrar ni crear una venta sustituta.

`inspect-device.cjs` es un helper puro probado con almacenamiento ficticio: exige contexto aprobado, lee solo las dos claves antiguas y devuelve cantidades sin payloads, IDs, teléfonos o credenciales. No se ejecutó en ningún navegador real. Su parámetro approved no sustituye la autorización humana. No inspecciona contenidos de IndexedDB, últimos recibos ni URLs: esos controles siguen pendientes del censo autorizado. No existe un recolector automático instalado en equipos comerciales.

## Cierre de ambas implementaciones: procedimiento propuesto

1. Confirmar candidato/políticas, respaldo, censo completo (outbox y failedOps), recibos y obligaciones. Si algún contexto o escritor es desconocido: NO-GO.
2. Pausar admisiones comerciales mediante procedimiento autorizado y resolver pendientes en su motor original. Distinguir solicitudes ya enviadas de borradores locales. No asumir que cerrar una pestaña cancela un POST.
3. Tras autorización específica, cerrar **en servidor/plataforma** las dos implementaciones y demás escritores, incluidos GET con migración, activadores, integraciones y editores directos. El cambio de permisos de Sheets requiere su propio alcance. No confiar en ocultar botones ni en ScriptLock como exclusión global.
4. Verificar por metadatos del plano de administración los IDs/versiones y el estado de retiro, sin invocar el handler antiguo ni leer A1. Cualquier prueba de red adicional exige diseño/autorización separados; no se necesita ni se permite una lectura sin clave del antiguo GET durante inspección.
5. Esperar/identificar solicitudes en tránsito y verificar estado cerrado por todos los canales. No inventar un tiempo fijo suficiente ni declarar escritor único mientras exista un canal desconocido. Crear intervalo explícito SIN ESCRITOR.
6. Respaldo posterior al cierre, conteo/acta y apertura idempotente aprobada. Después, habilitación independiente del nuevo escritor y primer pedido comercial **autorizado**, nunca un pedido ficticio en producción.
7. Si falla después de la apertura/primera operación: detener altas, conservar registros posteriores y recuperar con versión compatible. No reabrir automáticamente lo viejo, revertir saldos o restaurar una copia anterior encima.

El simulador `cutover.cjs` demuestra estas invariantes para 18 adaptadores ficticios bajo una autoridad/mutex compartida, incluidos pedidos en tránsito. GET v2 se modela como lectura, también cerrada por exposición; GET v15 como potencial escritor. No controla Google, editores humanos ni integraciones reales. No acredita cierre productivo.
