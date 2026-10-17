# Cierre operativo de 5C — avances y decisiones pendientes

16/10/2026, Lima. Base c3bf6eb4f94a06ad38831e84f53881a402cb8c27, dev/fase1-estabilizacion. Alcance: únicamente laboratorio; 3–10 ventas/día y hasta tres personas. Este informe complementa 5C; no reemplaza la evidencia anterior ni declara listo el sistema comercial.

## Resultado concreto

Se implementó y ejecutó un simulacro recuperable de 21 pasos, primero local y luego en Apps Script/Sheets sintéticos. Se preparó un panel privado para revisar el mismo ensayo desde computadora y celular del propietario, sin crear recursos externos ni publicar una versión comercial. El acceso es /dev, privado de editor/propietario; el /exec publicado conserva su versión/acceso anterior.

El sistema antiguo del simulacro tiene un diario separado en propiedades TEST_ONLY del Script. El nuevo usa operaciones con un prefijo de ensayo en el diario sintético autorizado. No se copió ni leyó BaseDatos_CasaVieja. El cierre de escritura del simulacro se aplica en su coordinador bajo ScriptLock; NO es un cierre técnico de las rutas del sistema antiguo real. Eso requiere diseño y autorización específicos antes de Fase 6.

## Simulacro ejecutado

1. Inventario antiguo ficticio: seis bolsas Gourmet molido de 500 g, cuatro Especialidad grano de 250 g, 1000 g tostados y diez empaques. Separación por lote/familia/presentación.
2. Pedido con respuesta perdida y otro con fallo después de escribir un efecto. Respaldo mientras el segundo está PREPARED.
3. Recuperación en el mismo motor con IDs originales; cierre compensatorio de ambas reservas. No se lleva una venta antigua al motor nuevo.
4. Cierre del escritor antiguo simulado; rechazo de una venta tardía. Acta ficticia explícita, nunca aprobación del propietario real.
5. Apertura nueva mediante OPEN_LAB_INVENTORY con referencia/hash del acta. Se interrumpe después del primer efecto y se recupera con el mismo ID. No es una compra ni ingreso financiero.
6. Pedido nuevo: reserva sin consumo físico; cobro sin segundo descuento; despacho interrumpido y recuperado una sola vez.
7. Detención de nuevas escrituras al cerrar la contingencia. Respaldo posterior y reconstrucción de ambos diarios.

Saldo esperado y comprobado del ensayo: Gourmet 5 bolsas disponibles, Especialidad 4, granel 1000 g, empaques 10; cero reservas. 5000 g iniciales = 4500 g restantes + 500 g despachados. Costo histórico vendido 3000 céntimos (S/30), valor restante Gourmet S/150. Estas cifras son ficticias y no representan stock, precios o costos comerciales.

Pruebas locales: 258 aprobadas, cero fallos, incluidas las 246 anteriores y 12 nuevas. El ensayo de pérdida de checkpoint recorre cada uno de los 21 puntos de reinicio; no duplica efectos ni commits. Se verifican política no aprobada, denegación de operadores, versiones inmutables, restauración repetida, rechazo de contexto productivo, guardia 5C y hashes de fuentes embebidas. No es una nueva medición de rendimiento comercial ni una prueba física.

## Defecto detectado y corrección

La descarga independiente encontró SOURCE_HASH: el primer empaquetado renombraba funciones dentro del texto serializado de ciertas fuentes del respaldo. Los diarios/saldos eran consistentes, pero esa copia NO acreditaba restauración íntegra del código. Se corrigió el constructor para actuar solo sobre declaraciones ejecutables y comprobar cada fuente antes de producir el paquete y antes de respaldar en Google.

Se conservaron los primeros intentos. Se regeneraron copias con los datos capturados originales y código verificado, indicando procedencia y hash original; no se repitieron ventas, aperturas, pagos ni despachos. El paquete corregido tiene su propia versión. El respaldo previo regenerado permite recuperar la operación que originalmente estaba PREPARED; no se presenta como una nueva captura cronológica anterior al ensayo.

Ver tests/google-resultados.json para rangos, hashes, versión, tiempos y verificación independiente final.

Resultado independiente final: APROBADO, 53 fuentes verificadas, operación pendiente recuperada con su ID original, 242 registros/170 movimientos anteriores conservados y doble reconstrucción sin cambios. Run drill5c-20065364-0398-445e-b76f-9fb60c596f89. Versión del laboratorio 106b47719a441ce0075daf6bcfa1a317387d125a900ada19a358cda1c1b080a4.

| Copia final verificada | Destino sintético | SHA256 | Tiempo Google |
|---|---|---|---|
| Datos previos con PREPARED, reempaquetados y con procedencia | Control!D60:F67 | f0bddfac0064ff16a56aebf161f34ef376a36dfdb83f9dd6cbf15886b235fd06 | 3,032 s |
| Estado posterior detenido | Control!D68:F76 | 9615456c504cd210aa75a01bd7605abe2488a287345b8c5af97eada66c73b579 | 3,487 s |

Los tiempos cubren el helper de respaldo/restauración sintético, no recuperación de credenciales ni puesta en servicio. El total del simulacro incluye invocaciones y esperas; no se presenta como RTO comercial. Los informes iniciales passed=true fueron insuficientes para acreditar fuentes; se debe usar la verificación independiente final y las copias anteriores quedan como evidencia del defecto. Los archivos comprimidos completos permanecen privados en el laboratorio/local; GitHub recibe evidencia ficticia resumida, no imágenes de cuentas ni copias de clientes.

## Matriz de cierre

| Condición | Estado y evidencia | Pendiente / aprobación | Riesgo antes de Fase 6 |
|---|---|---|---|
| Pendiente/confirmación perdida | Resuelto en ensayo local y Google, IDs originales | Revisar cada equipo real con permiso específico | P0: desconocemos sus colas reales |
| Un solo escritor | Resuelto para sistema antiguo simulado y coordinador | Diseñar y autorizar cierre de TODAS las rutas reales | P0: no activar dos escritores |
| Conteo/apertura | Apertura ficticia recuperable, hash/acta y costo fijados | Conteo real aprobado y mecanismo comercial de apertura | P0: OPEN_LAB no se debe habilitar comercialmente |
| Reserva/cobro/despacho | Ensayo sin descuento doble, 21 checks Google | Pruebas físicas y permisos de negocio | Alto mientras falten |
| Respaldo y recuperación | Dos capturas, pendiente recuperado, diarios reconstruidos y destino sintético separado | Retención, custodia, automatización y recuperación de accesos completos | P0 operativo sin esas decisiones |
| Identidad individual | Arquitectura comparada, permisos ya probados con sujetos ficticios | Aprobar opción, recursos, cuentas de prueba y accesos exactos | P0: ninguna cuenta de operador habilitada |
| Reglas comerciales | Borrador null y registro versionado implementados | Confirmar tabla de políticas; integrar solo después | P0 para devoluciones/ajustes/lotes afectados |
| Dispositivos actuales | Procedimiento preparado; sin acceso/exportación de datos reales | Autorización por equipos/destinos y acta de todos los orígenes | P0: no confundir ausencia local con cola cerrada |
| Computadora/celular | Panel privado preparado; protocolo preciso | Ejecución y evidencia física del propietario | Pendiente; no certificado |
| Diseño y regresión | CSS/UX comercial 5A conservados, 258 tests | Aprobación visual del propietario y accesibilidad física | Pendiente |
| Producción e historial | Sin cambios; main/index/Script/Sheet productivos intactos | Mantener restricción hasta nueva autorización | No se ejecutó transición real |

## Decisiones y siguiente paso

AUTENTICACION-DECISION.md recomienda Google Identity + Cloud Run mínimo cero por compatibilidad y costo bajo esperado; contrasta Workspace y Workers. No se contrató ni creó servicio. Antes de hacerlo, aprobar arquitectura/recursos; facturación y ampliación de acceso requieren revisión específica. No compartir la cuenta del propietario con vendedores.

POLITICAS-PARA-CONFIRMAR.md presenta cobros, despachos, descuentos, cancelaciones, preparación, devoluciones, lotes, ajustes y respaldo. politicas-propuestas.json permanece DRAFT; no se aprobó nada por silencio. policy.js implementa el registro de versiones y snapshots, pero su aplicación completa a los flujos comerciales espera las reglas aprobadas.

DISPOSITIVOS-Y-PRUEBAS.md permite comenzar con consultas del ensayo ficticio en tus propios equipos. No autoriza abrir/exportar información real. Las pruebas de dos sujetos reales siguen bloqueadas por la autenticación pendiente.

Entrada a Fase 6: identidad real aprobada y validada, políticas firmadas e implementadas, todos los orígenes revisados, respaldos/custodia y restauración operacional completos, pruebas físicas acreditadas, versión comercial congelada y autorización expresa del corte. Después aplicar PLAN-FASE6.md: conteo aprobado, apertura nueva, un único escritor, pedido testigo y detención sin sobrescribir ventas posteriores. Nada de ese corte se ejecutó aquí.

## Archivos y reproducción

Nuevos archivos únicamente bajo fase5c/cierre-operativo/: policy.js, rehearsal.js, verify-archive.cjs, build.cjs, politicas-propuestas.json, manifiesto, helpers/panel/paquete de Apps Script, documentos de decisión y pruebas. El candidato comercial previo no incorpora OPEN_LAB_INVENTORY ni estos helpers.

Ejecutar node --test con acceptance.cjs y tests de fases anteriores más cierre-operativo/tests/*.test.cjs. Para generar el paquete privado: node fase1-aislada/fase5c/cierre-operativo/build.cjs. Para verificar las copias descargadas y su catálogo independiente: node fase1-aislada/fase5c/cierre-operativo/verify-archive.cjs ARCHIVO_PRIVADO_JSON SALIDA_JSON. No usar comandos de despliegue ni conectar producción para reproducir pruebas locales.
