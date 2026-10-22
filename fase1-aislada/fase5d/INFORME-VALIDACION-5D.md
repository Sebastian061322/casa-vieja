# Fase 5D — estado verificable del laboratorio

Actualizado el 21 de octubre de 2026 (Lima). Exclusivamente TEST_ONLY. **NO-GO para Fase 6.**

## Arquitectura y recursos

Google Identity Services → Worker casa-vieja-lab-auth → Apps Script CasaVieja_AUTH_TEST_ONLY_5D → CasaVieja_Pruebas_SINTETICA. No se comparte Sheets con operadores. La identidad se verifica criptográficamente en Worker y se firma con HMAC hacia Apps Script; los permisos se resuelven en backend, antes de acceder a datos. Se reutiliza el motor recuperable de inventario/comercio y la interfaz 5A.2.

Worker actual **4c2cd709**, activo y verificado en Cloudflare. entry.mjs, approved.css y config.json publicados coinciden por SHA256 con el paquete probado; cabecera no-store. Apps Script conserva el candidato mínimo previo: SHA256 8b2c817abe5e9489c05ffc0507cceddce5ff4a0f8ad3667c70001aabe41b5c22. En esta continuación no se modificó ni desplegó Apps Script, no se crearon recursos ni credenciales adicionales.

Recursos aprobados en plan Free, proyecto Google sin facturación, sin tarjeta ni KV/D1. El portal público exige identidad y el endpoint sintético exige firma; una URL pública no implica autorización. No se promete disponibilidad ilimitada ni protección completa contra agotamiento de cuotas por tráfico externo.

main conserva 12a5f997845f9d31dc1a5d8ae7dc49770928da3d. No se modificaron index.html productivo, Apps Script productivo, BaseDatos_CasaVieja ni registros comerciales históricos. Trabajo únicamente en dev/fase1-estabilizacion.

## Pruebas y evidencia

| Comprobación | Entorno y evidencia | Resultado |
|---|---|---|
| Regresión de fases anteriores y 5D | Node, adaptadores ficticios; tests/resultados.txt | 385 aprobadas, 0 fallos; 53 específicas de 5D |
| JWT → Worker → HMAC → candidato mínimo → adaptador Sheets | tests/full-path.test.mjs | 3 aprobadas: ACK perdido, tres solicitudes por una bolsa, revocación/conservación; no es infraestructura Google real |
| Rechazos públicos | tests/resultados-red-publica.json | 7/7; sin credenciales reales ni escrituras comerciales |
| Integridad de publicación | Mismo archivo anterior | 3 archivos idénticos al paquete final y no-store |
| Vendedor con sesión Google válida | tests/validacion-google-vendedor.json; lectura Safari y propietario | 11/11 sobre 08092eb0: redacción de costos, users/reports/dashboard/setUser/configure denegados, rol falsificado rechazado, consultas y diario sin cambios |
| Gerente operativo con sesión Google válida | tests/validacion-google-gerente.json; lectura Safari y propietario | 8/8 sobre 08092eb0: users/setUser/configure denegados, rol falsificado rechazado, consultas y diario sin cambios |
| Revocación y restauración del vendedor | tests/evidencia.json y capturas privadas | ACCESS_DENIED mientras inactivo; nuevo ingreso restaurado con mismo perfil y tres secciones |
| iPhone/Safari | Confirmación del propietario | Ingreso/formulario visibles; pedido ficticio guardado como pendiente sin internet y sin confirmación del servidor. Reconexión detectó SHIPPING_POLICY_REQUIRED: servidor REJECTED; la interfaz antigua lo conservaba erróneamente PENDING. Corrección publicada; recuperación física pendiente |
| Pedido, cobro y despacho ficticios | Ensayo previo real descrito abajo | Confirmados con inventario consistente |

Las denegaciones autenticadas se ejecutaron sobre 08092eb0. El paquete actual 4c2cd709 conserva la misma autenticación/backend y corrige el resumen de importes del gerente; no se afirma haber repetido todas las pruebas autenticadas sobre esa versión. No se cuentan las pruebas locales como pruebas con Google.

## Correcciones implementadas

| Severidad | Hallazgo confirmado | Corrección y verificación |
|---|---|---|
| Alto | Consulta de claves Google incompatible con redirección usada en Worker | Modo manual, rechazos de desvíos; prueba pública dejó de fallar con GOOGLE_IDENTITY_UNAVAILABLE y rechaza firma inválida con 401 |
| Alto | Importación de interfaz fallaba tras popup OAuth | Módulo de arranque único antes de autenticar; montaje privado condicionado a sesión confirmada; vendedor ingresó |
| Alto | Respuestas de ingreso antiguas cerraban una sesión nueva; montaje duplicado | Coordinador por intento, deduplicación y montaje único; cinco pruebas y actualización real del gerente sin SESSION_CHANGED/ACCOUNT_OR_PROFILE_CHANGED |
| Medio | Sincronizar recreaba la lista de usuarios y perdía cambios visuales sin guardar | Conserva el nodo del formulario. Prueba local: lista y casilla sin guardar sobreviven a sincronizar. Publicado |
| Medio | Indicador podía mostrar cola vacía mientras aguardaba ACK | Pendiente visible inmediatamente tras persistir. Publicado; no confirma pagos/ventas antes del servidor |
| Medio | Consultas cada 30 s incluso con pestaña oculta/sin red/sesión cerrada | Pausa automática, retoma al volver o reconectar, evita solapamientos. Tres pruebas; publicado. Sin ahorro real cuantificado |
| Medio | Resumen del gerente leía descuento inexistente | Cero por defecto solo si el campo falta; importes inválidos siguen rechazándose. Prueba ejecuta el formulario generado, comprueba total/costo/margen. Publicado af55b8af; relectura real del formulario pendiente |
| Bajo | Informe opcional se solapaba con resumen fijo del pedido | Informe dentro del contenido principal y lista accesible por comprobación. Verificado en informes reales de vendedor y gerente |

## Flujo comercial real previamente comprobado

Pedido future:8dc4af32-f795-40dc-acb9-c3cb3c1c065d, cliente PRUEBA 5D GOOGLE VENDEDOR 20261021, S/35. Costo histórico S/17.35; margen inicial S/17.65. Visible una vez en administrador. Físico/reservado: 84/2 antes, 84/3 tras reservar, 84/3 tras cobrar, 83/2 tras despachar. Referencia ficticia de cobro TEST_ONLY_5D_PAGO_20261021_01; saldo S/0 y cobrado S/35. Vendedor vio Despachado sin datos financieros internos. Sin dinero, cliente ni entrega reales. Conservar registros de evidencia.

El cobro estuvo inicialmente pendiente y luego se confirmó recuperando la misma operación. No fue una simulación controlada de pérdida de respuesta contra Google. Esa prueba sigue pendiente.

## Rendimiento observado y sus límites

- 50 doPost mixtos observados: mediana 2.36 s, media 3.73418 s, máximo 32.417 s, p95 descriptivo 17.245 s. tests/tiempos-google-observados.json. Estado Completada no demuestra éxito comercial. No es carga controlada ni latencia completa.
- Snapshot con sesión válida de vendedor: 4268, 6177 y 5596 ms. Gerente: 5100, 5247 y 4385 ms. Incluyen ida/vuelta y comprobación de sesión. Tres muestras por perfil no permiten p95 o capacidad garantizada.
- Panel Worker observado durante esta sesión: 422 invocaciones, indicador CPU Time 3 ms, Errors 0 en últimas 24 h. La portada de cuenta mostró CPU P90 6 ms, otra agregación. No son CPU por venta ni garantía de margen ante límites Free. No se infiere consumo de Apps Script/Identity desde esos indicadores.

## Privacidad y continuidad

**Alto, condicionado al equipo:** IndexedDB no cifra datos por usuario; cambiar cuenta Google en el mismo perfil no aísla copias gerenciales ya guardadas. El propietario confirmó equipos o perfiles de navegador separados por persona. Aplicar SEGURIDAD-ALMACENAMIENTO-LOCAL-5D.md; si alguien puede abrir el perfil ajeno, esa separación no basta. No se implementó cifrado ni se declara seguro el uso compartido de un mismo perfil. Verificación física de la separación pendiente antes de Fase 6.

Se mantienen operationId, cola y recibos persistentes por cuenta/destino. Nunca limpiar IndexedDB para resolver pendientes ni transformar automáticamente comandos incompatibles. El laboratorio se usaba solo en esta computadora hasta el nuevo ingreso confirmado del iPhone; revisar ambos antes de futuras actualizaciones. No se han inspeccionado ni exportado colas productivas.

Credenciales solo en memoria; secreto HMAC y correos autorizados fuera de Git. Capturas privadas en evidencia-local/, excluidas del repositorio. El ensayo opcional ?validation=5d no expone tokens ni incorpora endpoints de mantenimiento; sus comandos administrativos son deliberadamente inválidos y no pueden aplicar cambios de usuarios/reglas.

## Condiciones todavía pendientes

| Prioridad | Condición |
|---|---|
| P0 | Releer el resumen corregido del gerente y comprobar sus propias escrituras operativas reales |
| P0 | Última unidad concurrente contra Google; no sustituirla por Promise.all local |
| P0 | Desconexión/reconexión y pérdida controlada de respuesta contra Google, mismo operationId sin duplicar efectos |
| P1 | iPhone/Safari y segundo equipo: completar navegación, teclado, persistencia y operaciones; ingreso inicial no equivale a prueba completa |
| P1 | Latencia/CPU con muestras y carga representativas; investigar colas largas observadas |
| P1 | Verificar aislamiento de equipos/perfiles, continuidad comercial, respaldo y políticas pendientes antes de transición |

No activar producción ni Fase 6. Reproducción local: node fase1-aislada/fase5d/tests/run-all.mjs; conserva el candidato previo y no contacta servicios externos. El ensayo de red tests/probe-public-auth.mjs es separado, explícito y limitado a destinos públicos del laboratorio.

## Incidente de reconexión del iPhone — 21 de octubre

La lectura acotada del diario sintético confirmó que la zona enviada era `"Zona ficticia "`, con un espacio final. La operación dabf64df-fdc2-446a-b5fa-4bf4dfc8238d quedó REJECTED en la fila 260 de DiarioInventarioV3, por SHIPPING_POLICY_REQUIRED. No fue una venta confirmada. No se cambió su comando ni el registro del servidor.

Hallazgos altos: el transporte de sesión perdía el recibo estructurado del rechazo, y la presentación seguía mostrando pendiente. Ahora conserva el recibo, distingue rechazo definitivo de fallo temporal y permite archivarlo únicamente con evidencia verificada; el borrador rechazado no se puede reenviar como venta. Para pedidos nuevos, se recortan espacios exteriores de la zona antes de crear el comando; no se transforman operaciones ya encoladas ni se aceptan zonas desconocidas.

385 pruebas locales aprobadas. En navegador local con IndexedDB se comprobó: rechazo visible tras recarga, archivo conservando evidencia y borrador bloqueado, y un pedido NUEVO con espacio final confirmado por el servidor simulado. Esto no sustituye la prueba física. Versión 4c2cd709 publicada en el Worker autorizado; siete rechazos públicos y tres archivos verificados por SHA256. Apps Script sin cambios. Pendiente: que el iPhone recupere el rechazo, conserve su evidencia y complete un nuevo ensayo de desconexión/reconexión. No aprobar todavía ese caso ni la transición.
