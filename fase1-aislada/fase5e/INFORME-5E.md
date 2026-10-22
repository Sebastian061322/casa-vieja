# Informe de avance 5E — paquete local verificable

Referencia: 4e9c95bd09be526a17fb86173eca1a66126e5566, dev/fase1-estabilizacion. HEAD remoto comprobado antes de editar. Estado: IMPLEMENTACIÓN LOCAL; publicación y validación remota pendientes de autorización específica. Los ensayos de esta fase no escribieron en Google Sheets, Apps Script ni Worker remotos. No hay commit 5E publicado.

## Bloqueos puntuales y cambios

| Riesgo | Cambio local y evidencia | Falta para cerrar |
|---|---|---|
| P0: doble envío o pestañas duplicadas producen intents distintos | Índice durable por tipo/pedido/versión, fingerprint semántico y operationId original; prueba de dos clientes simultáneos sobre la misma transacción local y reinicio | Competencia real desde dos dispositivos y ScriptLock de Google |
| P0: respuesta confirmada no entregada al navegador | Worker candidato retiene ACK solo tras COMMITTED y devuelve 503 temporal para un pedido TEST_ONLY_5E_; consulta status devuelve recibo original sin otro efecto. Pruebas de API y navegador localhost | Repetir con Worker/Apps Script reales e iPhone después de publicar |
| P0: saldos y movimientos | Verificador independiente detecta IDs duplicados, commits fuera de orden, fingerprints alterados y huérfanos. Se probaron seis puntos de caída, conflicto de edición entre gerentes, cancelación repetida, precio futuro, costos y 11000 g conservados | Pasar lectura acotada del diario Google autorizado por el mismo verificador; no reparar historial |
| P0: recuperación completa no demostrada | Nuevo archivo por secciones, catálogo esperado, estado/código/configuración sintética/colas, restauración a carpeta separada, interrupción y reanudación, recuperación PREPARED | Restauración 5E en destino Google autorizado y recuperación de accesos/credenciales como procedimiento independiente |
| P0: permisos del candidato vigente | Pruebas sobre candidato 5E generado y guardado solo local: vendedor/gerente denegados, sin funciones de mantenimiento públicas | Tres sesiones Google reales sobre versión publicada 5E |
| P1: costos/reportes persistidos en navegador | Gerencia conserva snapshot/reportes solo en memoria. Solo retira cachés reconstruibles, conserva comandos, recibos, evidencia y borradores. Memoria de proyecciones se limpia al cerrar sesión | Validación real por perfil/equipo; pendientes y borradores necesarios pueden contener importes. No se implementó cifrado |
| P1: demora en reportes | Índice efímero de eventos por pedido evita barridos repetidos; resultados idénticos en Node | Medir mejora real de extremo a extremo en Google |
| P1: tiempos sin desglose | Correlación aleatoria y medidas en Worker y Apps Script sin datos personales o credenciales | Publicar y capturar muestras reales; tiempos inclusivos no se suman |

## Pruebas

429 aprobadas, cero fallos en tests/resultados.txt: 385 de la base más 44 incorporadas en 5E. Identidad, Sheets y servicios de las pruebas automatizadas son simulados. El candidato con el ID del Apps Script autorizado se evaluó en runtime simulado; esto no otorga ni comprueba permisos reales de Google.

Navegador localhost: formulario gerencial correcto; recepción de error temporal con pedido pendiente tras confirmar backend simulado; cierre y reapertura de pestaña recupera reserva sin registrar otra venta. Evidencia visual privada en evidencia-local. No se reinició todo el navegador ni se simula ese resultado como un iPhone físico.

La prueba física heredada de 5D sí confirmó iPhone/Safari offline, reconexión y resincronización con una sola reserva, rechazo antiguo conservado y cola vacía. Sigue vigente como evidencia de ese paquete, no certifica las modificaciones 5E.

## Rendimiento medido en Node

30 muestras por variante y volumen, orden alternado, mismo resultado y estado fuente inalterado. Datos totalmente ficticios; son cálculos de reportes en memoria, no reconstrucción de miles de operaciones Google.

| Ventas / eventos | Media antes ms | Media después ms | p95 descriptivo antes ms | p95 descriptivo después ms |
|---|---:|---:|---:|---:|
| 100 / 300 | 0.635 | 0.334 | 0.805 | 0.386 |
| 500 / 1500 | 5.556 | 1.558 | 6.002 | 1.727 |
| 1000 / 3000 | 19.365 | 2.883 | 19.820 | 3.084 |

No comparar estos milisegundos con los 2,36 s de mediana y 17,245 s de p95 de las observaciones mixtas 5D. La mejora remota antes/después todavía no existe. La instrumentación distingue verificación Google/HMAC, firma, comunicación backend, bloqueo, lecturas, escrituras y relecturas, reconstrucción y reportes. lockHeld y backend incluyen otras etapas; no son una partición aditiva ni CPU aislada del Worker.

## Restauración ejecutada

Archivo SHA256: 3a0a65e6af1f25f3eb58d0ca15978f9c9dd8dfa2c3aa4fc23343ca2b841cceb4. Origen TEST_ONLY:local-source; destino TEST_ONLY:local-destination. Se restauraron código completo generado del frontend/backend y manifiesto, fuentes del verificador, diario/movimientos, configuración ficticia y una cola sintética con comando original.

Resultado: fuente sin cambios, copia verificada, restauración interrumpida/reanudada, repetición sin efectos adicionales y un PREPARED recuperado. Inventario final: seis unidades físicas, dos reservadas. Materialización/validación local medida: 15.755 ms. No es un RTO integral. No incluye recuperación de cuentas, OAuth, secretos ni colas de equipos físicos. Custodia y retención independientes siguen por aprobar; no hay tarea programada.

## Seguridad y alcance residual

La identidad sigue siendo Google verificado → Worker → HMAC → Apps Script → permisos backend. No hay roles confiados al navegador ni acceso directo a hojas para vendedor. Persisten epoch/schema de las colas existentes; no se cambian comandos previos. El ensayo de fallos no añade RPC de mantenimiento ni relaja permisos; solo afecta la entrega de un recibo sintético después de su confirmación.

Apps Script standalone necesita el alcance Sheets para openById. El manifiesto no se amplió y sigue siendo amplio respecto de las hojas accesibles al propietario. La guarda de Script/Sheet reduce el camino normal de aplicación, pero no reduce el permiso OAuth concedido. Una eventual cuenta propietaria dedicada con acceso mínimo requiere diseño y aprobación; no se creó ni se habilitó ninguna.

Minimizar proyecciones no protege un perfil gerencial abierto ni elimina información imprescindible de comandos/borradores. Mantener equipos o perfiles de sistema operativo protegidos por persona. No limpiar IndexedDB como reparación. Los registros de tiempo se limitan a ID aleatorio, acción enum y números; no registrar Gmail, token, payload ni secretos. No se contrató almacenamiento adicional.

## Conteos y decisiones

count-plan.cjs devuelve comparación por resourceId/lote/familia/etapa/molienda/gramaje/unidad: físico esperado, contado, reservas, disponible y diferencias. approved=false y canExecuteAdjustments=false siempre. Una diferencia menor que reservas bloquea la interpretación de disponibilidad y requiere revisión. No se ejecutó inventario real ni se fijaron costos reales.

Siguen pendientes de decisión: cuarentena y aptitud de devoluciones, bloqueo/estados de lotes, ajustes tras conteo, recetas e insumos adicionales, condiciones de cobro/despacho/cancelación y Fondo. El motor actual distingue pergamino, tostado a granel, bolsas molido/grano de 250/500 g e insumos. Un inventario separado de granel ya molido, cuarentena o bloqueo requiere política/modelo adicional; no se declara implementado por existir este diseño.

## Publicidad

Contrato sintético probado con nuevas observaciones crudas, deduplicación, correcciones retrospectivas y vínculos comerciales; no se crearon tablas remotas ni una sincronización. Cuenta/campaña y zona/moneda comprobadas en Windsor en modo lectura; evidencia de IDs excluida de Git. Plan actual devuelto: TRIAL, is_paid=false. La documentación Free no sustituye comprobar el plan efectivo después del trial. No se activó ni contrató nada. Ver META-ADS-5F.md.

## Dictamen

GO para continuar pruebas y diseño sintéticos. NO-GO para declarar cerrada 5E, automatizar integración real 5F o iniciar Fase 6: faltan publicación autorizada y pruebas reales vigentes, última unidad entre dos equipos, ACK retenido contra Google, restauración 5E en Google, medición remota, aislamiento físico y decisiones operativas. Mantener escritor comercial actual e historial.

La nueva restricción del propietario dice «No publicar cambios remotos, ampliar permisos o crear nuevos recursos sin autorización específica». Por eso el trabajo queda listo para revisión local, con paquete, hashes y plan de publicación restringido; no se interpreta la autorización anterior de 5D como aprobación automática de 5E.
