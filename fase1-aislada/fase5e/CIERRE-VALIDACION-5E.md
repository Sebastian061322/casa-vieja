# Fase 5E — cierre de este ciclo de validación, 22/10/2026 (Lima)

**Resultado:** ciclo funcional de laboratorio aprobado. No se declara cerrado el riesgo de recuperación integral de infraestructura ni se autoriza uso comercial. Fase 6 permanece **NO-GO**. Las pruebas físicas se distinguen expresamente de las simuladas.

Fuentes del diagnóstico: `7fcf3c4c980ecd9b85228a044b7e5111aa26697d`; evidencia previa publicada en `8685d49c6e2a83b85fe19f8cbca8b10c56bcf0f1`. Solo rama `dev/fase1-estabilizacion`. Main verificado sin cambios: `12a5f997845f9d31dc1a5d8ae7dc49770928da3d`.

## Paquete vigente y alcance

- Worker de laboratorio `casa-vieja-lab-auth`: versión activa `4fdf13da`, SHA256 `e7abb4227aac185f93ae30d1f6c68dd79b1a727cda56bea92d28fa06b156cd85`.
- Apps Script `CasaVieja_AUTH_TEST_ONLY_5D`: versión 3, mismo endpoint firmado, ejecución como propietario y mismo acceso de red Cualquiera. SHA256 `d0e635dd759d25e2cdb72e67a624d84b9b977c2a8eb6924c23f2d94b4d149c7c`.
- Actualización expresamente autorizada, sin cambios de permisos, secreto HMAC, cuentas o recursos. El diagnóstico solo añade tiempos a una consulta administrativa explícita. No añade mantenimiento público ni escrituras comerciales.
- Google Identity → Worker Free → Apps Script → hoja sintética. IndexedDB conserva comandos, borradores, recibos y rechazos por identidad/origen; los informes gerenciales reconstruibles permanecen en memoria.
- No se modificaron producción, historial comercial, campañas ni presupuestos. No se activó facturación ni se contrataron servicios.

## Matriz de pruebas y evidencia

| Comprobación | Resultado y límite | Evidencia en tests/ |
|---|---|---|
| Regresión | 450 pruebas locales, cero fallos. Backend, cola, recuperación, integridad, permisos y diagnóstico; no equivalen a 450 pruebas físicas. | resultados.txt |
| Acceso público | Siete solicitudes inválidas rechazadas y tres activos iguales por hash, todos no-store. | resultados-red-publica-diagnostico-5e.json |
| Administrador vigente | Cinco comprobaciones observadas en Safari: rol falsificado rechazado, tres consultas y revisión estable. No acredita cambios de usuarios/configuración en este ensayo. | permisos-google-admin-diagnostico-5e.json |
| Vendedor vigente | Once comprobaciones observadas y reportadas por propietario: redacción de datos; denegaciones de usuarios, informes, dashboard, permisos y configuración; rol falsificado; consultas y revisión estable. Solo Ventas, Pedidos e Inventario visibles. | permisos-google-seller-diagnostico-5e.json |
| Gerente vigente | Ocho comprobaciones observadas y reportadas: denegaciones de usuarios, permisos y configuración; rol falsificado; consultas y revisión estable. | permisos-google-operations-diagnostico-5e.json |
| Respuesta perdida | Una confirmación real retenida en Worker, mismo pendiente conservado, reapertura y recuperación del pedido original sin segunda reserva. | ack-google-5e.json |
| Última unidad física | Computadora/Safari gerente e iPhone/Safari vendedor: una reserva y un rechazo definitivo sin efectos. Disponibilidad cero y no negativa. Envíos separados 2819 ms; no se midió solapamiento exacto del lock. | concurrencia-fisica-google-5e.json |
| Reinicio completo de Safari | Propietario cerró Safari desde aplicaciones con un pendiente offline, reabrió con internet y obtuvo pedido reservado. Otra sincronización conservó el mismo pedido, cero pendientes y un rechazo archivado. | iphone-restart-5e.json |
| Ausencia de duplicación tras reinicio | Un PREPARED, un COMMITTED y una reserva física 0 / reservada +1. Relectura posterior a resincronizar idéntica. | integridad-iphone-restart-5e.json |
| UX móvil básica | Propietario reportó menú, navegación, teclado y zoom utilizables en iPhone/Safari y Android/Chrome. No observación automática, sin modelos/versiones ni auditoría formal WCAG. | mobile-ux-owner-5e.json |
| Restauración real de datos | Copia aislada Google con 25 registros, 20 movimientos, código/configuración ficticia y cola sintética; interrupción/reanudación, hashes y reconstrucción verificados. No recupera OAuth, credenciales ni servicio desplegado. | restauracion-google-5e.json |
| Recuperación local del servicio | Cinco ensayos de servicio con código/configuración/diario desde copia: permisos, recibo original, revocación, conflicto de gerentes y rechazo de legado sin identidad. Google e infraestructura simulados. | service-recovery.test.mjs |
| Privacidad durable | IndexedDB real en navegador integrado conserva cola/recibos/borrador/rechazos y retira solo proyecciones gerenciales. No es prueba física de cifrado o reinicio de Safari. | storage-browser-recovery-5e.json |

Los ensayos previos de revocación/restauración de acceso de Fase 5D se conservan como evidencia histórica de laboratorio; no se volvieron a ejecutar cambios de permisos en esta continuación.

## Pedido de reinicio e integridad final

Cliente ficticio `TEST_ONLY_5E_REINICIO_IPHONE_20261022_01`, operación `53dd7eed-0e2a-42a1-8025-4b8970add7c7`, pedido `future:684e14e4-0be0-462f-9fc1-b924da166cf2`. El identificador se cotejó en servidor después de recuperar; no se capturó en la pantalla del iPhone antes de cerrarlo. La continuidad de identificadores cuenta además con pruebas automatizadas y el ensayo real previo de respuesta perdida.

El primer intento no creó cola: la casilla de revisión de otros orígenes estaba vacía después de recargar y la instrucción había omitido volver a comprobarla. El propietario confirmó esa causa. Se comprobó que no existía ese pedido y el diario seguía idéntico; después de la revisión efectiva se marcó la casilla y se usó el mismo borrador. No se borró almacenamiento ni se sustituyó un comando pendiente.

Estado final reconstruido de Google: **268 filas de diario, 182 movimientos, 129 COMMITTED, 10 REJECTED, cero PREPARED incompletos, revisión 129**. Para la partida ensayada: físico 5, reservado 3, disponible 2; antes estaba 5/2/3. Sin cobro ni despacho del pedido nuevo. Los 266 registros y 181 movimientos anteriores del laboratorio conservan exactamente su contenido y orden; solo se añadieron dos eventos de diario y un movimiento. Resincronizar no añadió registros.

## Rendimiento medido, sin garantías inventadas

Tres consultas administrativas reales correlacionadas en versión 3 (`diagnostics-google-admin-5e.json`):

| Etapa, ms | Muestra 1 | Muestra 2 | Muestra 3 |
|---|---:|---:|---:|
| Navegador con bootstrap y red | 6690 | 6416 | 7536 |
| Worker total | 3562 | 4259 | 3929 |
| Apps Script instrumentado | 1688 | 2230 | 1980 |
| Espera de lock | 58 | 391 | 45 |
| Lock sostenido | 1492 | 1722 | 1791 |
| Lectura Sheets | 298 | 430 | 670 |
| Reconstrucción | 33 | 30 | 63 |
| Informes | 4 | 2 | 3 |

Media del código Apps Script 1966 ms; navegador con revalidación 6881 ms. Las categorías se solapan; no sumarlas. Tiempos cero de identidad/firma reflejan resolución temporal y/o caché, no ausencia de verificación. No se escribieron movimientos en estas consultas; escritura y confirmación de ventas no se caracterizan con esos ceros.

La reconstrucción ocupa poco tiempo en estas tres muestras. Transporte/plataforma, revalidación y trabajo no desglosado siguen siendo relevantes; no se atribuye su causa sin medirla. No hay muestras equivalentes de la versión anterior para afirmar una mejora remota. Los 50 tiempos agregados previos de Apps Script son de acciones mixtas, y los tiempos de Fase 5D incluyen otra capa; no son una comparación causal. Las mejoras locales documentadas de reconstrucción no se presentan como mejoras medidas en Google. Tres muestras no sostienen percentiles estables ni garantías de disponibilidad/capacidad.

## Recuperación: alcance probado y pendientes

La restauración Google separada verificó hash `b05b5de02ddddeadd342b5291849ee7796362b8ec40194fa04798567079d79e2`, archivo de 38 partes, interrupción tras 10 y reanudación de 28, marcador VERIFIED y repetición con cero escrituras. Conservó las tres pestañas anteriores. Tiempo de pared 116951 ms incluye inspección y otras tareas; **no es RTO integral**.

El PREPARED antiguo conservado en ese fixture no tiene `plan.audit`. El motor original puede recuperarlo; la pasarela autenticada nueva lo rechaza con OPERATION_ACTOR_MISMATCH sin efectos. No añadir identidad inventada ni migrarlo automáticamente. La ejecución del pendiente en la hoja restaurada y la recreación real de OAuth, credenciales y servicio no se realizaron.

Retención propuesta de 30 copias diarias y 12 mensuales, RPO 24 h y RTO 4 h: propuestas pendientes de aprobación, capacidad y simulacro; no son garantías ni tareas programadas. No se ha copiado producción.

## Riesgos y condiciones que siguen abiertas

| Severidad | Condición | Estado y acción necesaria antes de activar |
|---|---|---|
| Alto | Recuperación integral del servicio real | Datos restaurados en Google y servicio simulado aprobados; falta ensayo que recupere infraestructura/configuración/custodia de credenciales y pendiente autenticado contra destino aislado. Requiere plan y autorización específica si crea recursos o cambia destinos. No declarar cierre integral de recuperación. |
| Alto | Continuidad comercial entre motores y orígenes | Solo se censó laboratorio. Revisar equipos reales con autorización, cerrar confirmaciones en su motor compatible y definir un único escritor. No exportar ni migrar colas comerciales ahora. |
| Alto | Corte y apertura reales | Faltan respaldo comercial autorizado, conteo físico aprobado, saldos de apertura y prueba/aborto del corte. Fase 6 no ejecutada. |
| Medio | Permiso OAuth amplio del propietario | La guarda de ID y HMAC restringen el código; no reducen el alcance del permiso concedido por Google. No se comparte acceso directo a hojas con vendedores. |
| Medio | Datos locales sin cifrado | Informes gerenciales en memoria; comandos/borradores pueden contener datos personales. Usar equipos o perfiles separados, como decidió el propietario; proteger acceso del sistema operativo. |
| Medio | Latencia y cuotas | Consultas completas de varios segundos. Sin SLA ni caracterización remota equivalente de escritura/carga futura. Conservar colas ante indisponibilidad y medir sin alterar autoridad del diario. |
| Medio | Políticas comerciales | Fondo, ajustes, conteos, cuarentena/devoluciones, estados de lotes, recetas e insumos y custodia/retención pendientes de decisión. No habilitar reglas inventadas. |
| Bajo | Cobertura móvil | Prueba física básica reportada; sin versiones exactas, lector de pantalla o matriz exhaustiva. Android no tuvo ensayo de reinicio offline en esta continuación. |

**Dictamen:** GO para continuar trabajo sintético de Fase 5F. NO-GO para automatización publicitaria real mientras no se confirme un plan sostenible S/0 y se autorice la integración; Windsor estaba en TRIAL y no acredita gratuidad permanente. NO-GO para Fase 6 y producción. El ciclo funcional verificado termina aquí; el cierre integral de preparación operativa sigue condicionado por los pendientes altos de esta tabla.

No hacen falta más ventas ficticias para repetir evidencias ya obtenidas. No se han añadido recursos, permisos, automatizaciones, pagos ni despliegues posteriores al paquete autorizado. Capturas y diarios completos permanecen privados; el repositorio solo recibe resúmenes técnicos sin cuentas, tokens ni secretos.
