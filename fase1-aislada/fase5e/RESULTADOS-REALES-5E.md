# Resultados reales 5E — 22 de octubre de 2026

Esta actualización prevalece sobre los pendientes de las notas preparatorias. Laboratorio exclusivamente; no se activa Fase 6 ni se modifica producción.

| Ensayo | Evidencia | Resultado |
|---|---|---|
| Confirmación retenida por Worker después de COMMITTED | tests/ack-google-5e.json | Mismo operationId, una sola reserva y recibo original. El propietario reabrió la pestaña; interfaz sin pendientes y pedido reservado. No se reinició todo Safari. |
| Última unidad: computadora/Safari gerente + iPhone/Safari vendedor | tests/concurrencia-fisica-google-5e.json | iPhone reservado; computadora INSUFFICIENT_STOCK sin efectos. Identidades backend distintas; físico 1, reserva 1, disponible 0. Envíos separados por 2819 ms; no se midió solapamiento exacto de locks. |
| Resincronización física | Confirmación del propietario y diario Google | Mismo pedido en iPhone, cero pendientes y disponibilidad 0. No cobros ni despachos. |
| Integridad posterior | Diario sintético releído y verificador independiente | 266 registros, 181 movimientos, revisión 128, cero PREPARED incompletos. |
| Restauración separada Google | tests/restauracion-google-5e.json | Cuatro pestañas 5E nuevas en la hoja de recuperación existente. 25 registros y 20 movimientos ficticios, siete archivos, configuración ficticia y cola sintética recuperados por lectura real. Hash válido, interrupción tras diez fragmentos, reanudación de 28 faltantes, evento VERIFIED y cero filas al planificar repetición. |
| Permisos | tests/permisos-google-operations.json y permisos-google-seller.json | Gerente ocho y vendedor once comprobaciones aprobadas sobre Worker 5b787b57 / Apps Script 2. Administrador 5E todavía pendiente. |
| Rendimiento backend | tests/tiempos-backend-google-5e.json | 50 ejecuciones mixtas: mediana 2142 ms, p95 descriptivo 4006 ms, máximo 5108 ms. No incluye navegador/Worker/red y no acredita mejora antes/después equivalente. |

## Alcance de restauración

Se conservan las tres pestañas antiguas de CasaVieja_RECUPERACION_TEST_ONLY_5B. Las cuatro nuevas se identifican con TEST_ONLY_5E_20261022_. La copia es enteramente ficticia, no un respaldo de clientes ni una copia productiva. El evento INCOMPLETE inicial permanece como historial del ensayo; VERIFIED es la marca terminal añadida tras comprobar la copia.

Se preservó un PREPARED parcial del fixture, no se ejecutó contra la hoja restaurada. Su recuperación sin duplicar efectos se probó localmente. Tampoco se restauraron cuentas, OAuth, HMAC, despliegues o colas físicas reales ni se conectó la aplicación a ese destino. Los 116951 ms medidos incluyen inspección y tareas intercaladas; no son RTO integral.

SHA256 esperado: b05b5de02ddddeadd342b5291849ee7796362b8ec40194fa04798567079d79e2. La custodia independiente real, retención, frecuencia y recuperación completa del servicio siguen pendientes. No hay tarea de respaldo programada.

## Corrección visual desplegada en laboratorio

Se observó un aviso antiguo de pendiente después de un rechazo definitivo y etiquetas de disponibilidad anteriores en un borrador sucio. El servidor mantuvo el stock correcto. El arreglo local preserva comandos y campos, corrige el aviso y refresca etiquetas cuando existe un snapshot nuevo. La cola base bloquea descargas mientras haya rechazos por revisar: revisar/archivar con evidencia es un paso previo necesario para obtener el nuevo snapshot; el parche no cambia esa regla ni borra la cola.

Dos pruebas reprodujeron los defectos y las cuatro nuevas pasan con el arreglo. Última regresión local: 438 aprobadas, que incluyen cinco pruebas del transporte de restauración y cuatro del arreglo visual. El propietario autorizó esta corrección específica. Fuente de17516f69b0e7ef5ceca3270e13d779bcf7a2e6; Worker activo 37306312, SHA256 a09881983136afefb2d5a2797f88576a6d0b3181e1dfbb6b7088ccd1536e5add. Backend permanece en versión 2. Siete solicitudes públicas inválidas rechazadas y tres activos remotos coinciden por SHA256 con el candidato; sin credenciales reales. La comprobación visual autenticada sigue pendiente: la pestaña del gerente solicita reingreso, sin borrar su almacenamiento. Evidencia: tests/release-queue-display.json y tests/resultados-red-publica-parche-5e.json.

## Condiciones abiertas

Repetir administrador y paquete final; completar desglose de tiempos correlacionados; validar aislamiento local por perfil, reinicio completo y equipos todavía no disponibles; simular recuperación integral del servicio y aprobar políticas comerciales/custodia. Mantener NO-GO de Fase 6. GO solo para diseño y pruebas sintéticas 5F; automatización real depende también del plan efectivo S/0 de Windsor, actualmente observado como TRIAL. No se alteraron campañas ni se habilitó facturación.
