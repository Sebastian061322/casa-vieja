# Resultado del ensayo DR — 25 de octubre de 2026

**Ensayo técnico sintético aprobado dentro del alcance descrito; Fase 5G.1 y activación comercial: NO-GO.**

Se utilizó exclusivamente CasaVieja_RECUPERACION_TEST_ONLY_5G, CasaVieja_DR_TEST_ONLY_5G y casa-vieja-dr-test-only-5g. No se modificó producción, main ni el laboratorio original. Se conservaron los permisos originales de las tres cuentas de prueba autorizadas. No se crearon servicios adicionales ni se habilitó facturación.

## Versión comprobada

- Apps Script DR: implementación existente, versión 2; fuente aprobada SHA256 `f5a9b7ada394cb2a138701bf921903072efb823a8e7f058241955d580ea17b60`. El hash identifica el archivo local usado para guardar el candidato; las rutas públicas y el servicio autenticado comprobaron el comportamiento del despliegue. No se afirma una extracción independiente del hash remoto de Apps Script.
- Worker DR: versión `cebc33f5-c85e-461a-947c-358fbaeceebd`, SHA256 `86c04fff1b690fdd08ae8caf83dd0576ee9324454f2dd84ab7d0953432471287`.
- Archivo sintético autorizado: SHA256 `7fd9f9a9a981b8478272cfb7f23ac21d0f28e118386ea9db4b919fc375f552d1`, 38 filas de diario y 40 movimientos. Es un escenario nuevo local, **no un respaldo del laboratorio vivo ni de producción**.
- Ajuste del ensayo autorizado: solo `/entry.mjs` y `/validation.mjs`; no modificó backend, permisos ni comandos comerciales. El parámetro `?validation=5d` muestra el botón de pruebas, sin conceder permisos.

## Evidencia y resultados

| Control requerido | Resultado comprobado |
|---|---|
| Archivos y hashes | Archivo y secciones comprobados con implementación independiente; archivos públicos del Worker coinciden exactamente |
| Configuración restaurada | Restaurador exige hash, prefijos y configuración compatibles antes de declarar COMPLETE; servicio real conserva catálogo y política sintética |
| Identidades y permisos | Administrador, gerente operativo y vendedor ingresaron; pruebas de backend aprobadas, leídas en Safari y confirmadas por el propietario |
| Información restringida | Vendedor sin costos internos en su respuesta; usuarios, reportes, dashboard y configuración denegados |
| Falsificación de identidad | IDENTITY_SPOOFING en los tres perfiles; no se confía en roles enviados por navegador |
| Comandos del origen | SOURCE_COMMAND_FORBIDDEN en los tres perfiles; ámbito DR obligatorio |
| Restauración interrumpida | Primera ejecución persistió una fila y cero movimientos; reanudación restauró exactamente 38/40 |
| PREPARED parcial | TEST_ONLY_5G_9 conservó GRIND_INPUT y añadió solo GRIND_OUTPUT y PROCESS_WASTE; quedó COMMITTED con el mismo identificador |
| Repetición | Repetir recuperación dejó exactamente las mismas 39 filas y 42 movimientos |
| Confirmación perdida | Vendedor consultó TEST_ONLY_5G_7: recibo COMMITTED original, revisión 18, sin reenviar venta |
| Rechazo previo | TEST_ONLY_5G_8 conserva REJECTED por INSUFFICIENT_STOCK; sin efectos nuevos |
| Inventario y costos | Panel del gerente coincide con suma independiente de movimientos de Google: 30 bolsas físicas, una reservada, 3875 g de granel. Recurso recuperado: 950 g, valor histórico sintético 130053 céntimos |
| Masa del proceso recuperado | Entrada 1000 g = salida 950 g + merma explícita 50 g; efectos y costo coinciden exactamente con el plan original |
| Revocación | Servidor confirmó desactivación del vendedor DR; sesión existente perdió acceso y reingreso mostró ACCESS_DENIED, leído directamente en Safari |
| Restauración de acceso | Servidor confirmó y releyó Vendedor activo; reingreso y consulta nueva del recibo COMMITTED comprobados en Safari y por propietario |
| Historial sintético | Prefijos de 38 filas y 40 movimientos intactos después de recuperar; consultas y cambios de acceso no añadieron ventas ni consumos |
| Colas y destinos | Origen web DR separado; no se leyeron ni migraron colas de producción/origen. El ensayo utilizó recibos respaldados e identificadores originales, no una migración automática de IndexedDB |

La regresión previa fue de 504 pruebas locales (482 compartidas + 22 DR). El ajuste de verificación pasó 27 pruebas dirigidas (incluye las 22 anteriores y cinco nuevas). **No se suman 504 + 27 como casos independientes.** No se presenta esta regresión como validación final de una RC comercial todavía inexistente.

Diez verificaciones públicas del Worker: seis recursos exactos/no-store y cuatro rechazos de origen/sesión. Dos verificaciones públicas del backend: GET exige POST autenticado y POST sin identidad es rechazado. Los perfiles reales se verificaron por el frontend contra Google, no solo mediante simulación local. Las pruebas físicas anteriores pertenecen al laboratorio y versiones documentados entonces; no certifican automáticamente este destino DR.

## Tiempos y pérdida de información

- Restauración de datos, 24 de octubre, hora de Lima: 21:13:47–21:13:55 hasta la interrupción deliberada (8 s); reanudación 21:14:09–21:14:45 (36 s). Intervalo total con pausa: 58 s.
- Administrador, 25 de octubre: 08:48:49–08:49:13, aproximadamente 25 s para su batería; consultas individuales 3503/4630/3218 ms.
- Gerente: 08:51:25–08:52:02, aproximadamente 37 s; consultas 4071/3946/4521 ms.
- Vendedor: 08:57:13–08:57:56, aproximadamente 43 s; consultas 3432/3736/3080 ms.
- Verificación de servicio, operaciones, inventario y revocación/restauración consolidada a las 09:08:13 del 25 de octubre. Ventana observada desde iniciar la restauración: 11 h 54 min 26 s, incluyendo noche, configuración, intervenciones del propietario y esperas de automatización. **No es un RTO automatizado ni una promesa de recuperación comercial.**
- No faltó ninguna de las 38 filas/40 movimientos del archivo. Se completó una operación parcial añadiendo un COMMITTED y dos efectos. Esto no establece un RPO comercial: aún faltan frecuencia de respaldo, custodia, operaciones posteriores al respaldo y un ensayo con esa política.

## Bloqueos que siguen abiertos

| Severidad | Pendiente | Condición para cerrar |
|---|---|---|
| Crítico | Custodia y respaldo operativo independiente | Propietario define custodios, ubicación, frecuencia, retención y acceso de emergencia; probar recuperación sin depender de esta computadora |
| Crítico | Escritores productivos y equipos | Solo index.html de main tiene inspección estática autorizada. Identificar Apps Script productivo, activadores, editores directos, integraciones y colas por equipo; pedir autorización exacta de solo lectura. No desactivar nada todavía |
| Crítico | Apertura y obligaciones previas | Validadores y planificador sintéticos existentes; falta ejecutor integrado/verificado de continuidad comercial, acta/conteos/costos aprobados y coordinación verificable del escritor único |
| Crítico | Políticas comerciales | Aprobar catálogo de noviembre, envío, cobros/despacho, cancelación, ajustes, devoluciones, lotes, costos y recetas; mantener bloqueados flujos sin política |
| Alto | RC y regresión final | Congelar solo después de resolver los críticos; repetir las pruebas afectadas sobre ese candidato exacto y documentar contingencia compatible |
| Medio | Automatización de Safari | Fallos recurrentes de lectura tras Google requieren intervención; evidencia humana se distingue de lectura directa. No borrar almacenamiento ni repetir ventas como solución |

El resultado permite cerrar este ensayo técnico acotado de recuperación. No aprueba la Fase 6, no autoriza uso comercial del entorno DR y no garantiza la fecha de lanzamiento.
