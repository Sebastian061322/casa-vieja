# Fase 5C — cierre técnico de riesgos, laboratorio

Fecha: 16/10/2026. Base: c013be7c37b682bf7b1901f1d2835df5713e9cef, rama dev/fase1-estabilizacion. Volumen informado: 3–10 ventas diarias, hasta tres personas al día. Tres solicitudes simultáneas son un escenario de estrés conservador, no una medición del uso habitual.

**No está autorizado ni listo el paso a producción.** Se implementaron controles y ensayos; permanecen bloqueos de autenticación real, continuidad de todos los equipos, políticas y validación física. No se modificaron main, index.html original, Apps Script productivo, BaseDatos_CasaVieja ni historial comercial. Solo se añadieron archivos 5C y escrituras sintéticas en recursos de laboratorio autorizados. El despliegue publicado privado no cambió de versión ni de acceso.

## Soluciones y archivos

- continuity.js y web/guard.js: inspección de colas existentes por motor/origen, bloqueo de actualización incompatible, recuperación de recibo original y exportación conservando pendientes. No migran comandos entre motores.
- access.js y apps-script/Gateway.gs: autorización backend por administrador, ventas e inventario, identidad estampada en planes/efectos, protección de estados ajenos, precios/costos/recetas del servidor y respuestas limitadas por perfil.
- broker.cjs y google-verifier.example.mjs: contrato de identidad OIDC y puente firmado corto, vinculado a acción/cuerpo/destino. Pruebas con criptografía y sujetos ficticios; proveedor externo NO habilitado.
- web/session.js y web/role-ui.js: interfaz por perfil, colas por sujeto, borradores persistentes y recuperación offline sin falsos éxitos. Mantienen CSS y distribución 5A. Un perfil de presentación offline no autoriza escrituras.
- web/admin-dashboard.js: consulta agrupada del dashboard y reutilización de la misma revisión del estado, sin convertir caché en autoridad de stock.
- backup.cjs: archivo completo, verificación de código/tablas/configuración/colas y restauración con hash/versión esperados de catálogo independiente. Rechaza destino divergente o copia desconocida.
- apps-script/Laboratory.gs y Race.gs: ensayos privados, copia separada y concurrencia sintética; excluidos de Candidate.gs. Code-laboratorio.gs contiene el paquete sintético; Candidate.gs solo expone cuatro rutas controladas y producción deshabilitada.
- build.cjs y release-manifest.json: construcción y trazabilidad de fuentes. tests/ conserva resultados reproducibles con su alcance local/Google explícito.

## Hallazgos y estado

| Severidad | Hallazgo | Corrección / condición restante |
|---|---|---|
| Crítico | No existe todavía autenticación individual real validada para tres perfiles | Backend falla cerrado; puente firmado y roles probados con sujetos ficticios. Falta aprobar recurso de identidad, implementar servicio HTTP completo y ensayar cuentas reales. |
| Crítico | Un origen nuevo no puede ver colas de otro navegador/dispositivo | Guardia y exportación implementados. Falta inventario y acta de todos los equipos; ninguna cola comercial se declaró cerrada. |
| Alto | Ocultar menús no protegía datos financieros en la respuesta | DTO por lista positiva y permisos backend, consulta/recuperación ajena denegada; pruebas locales y Google sintético. |
| Alto | Reintentos podían eludir un control de propiedad si se comprobaba después de idempotencia | Propiedad validada antes del acceso al recibo o ejecución. Mantiene ID/fingerprint originales. |
| Alto | Precio, costo, responsable o perfil declarados por cliente no son confiables | Perfil e identidad verificados, política de servidor obligatoria; los campos manipulados se rechazan. |
| Alto | Un ensayo completo superó seis minutos y dejó PREPARED | Checkpoint durable, IDs estables y tramos cortos; se reanudó la operación original sin efectos duplicados. El límite del proveedor sigue vigente. |
| Alto | Respaldo incompleto de configuración/código/colas y checksum autoaportado insuficiente | Archivo integral sintético y catálogo de hash esperado independiente. Falta política operativa externa, automatización y custodia de secretos. |
| Alto | Datos offline accesibles al dueño de un equipo/perfil compartido | No se guardan tokens; aislamiento lógico por sujeto. Falta aprobar perfiles de navegador/orígenes separados, cierre de sesión y retención. No hay cifrado local implementado. |
| Medio | Reportes repetían búsquedas por cada venta/evento y llamadas de dashboard | Índice por estado y consulta agrupada, comparación exacta de resultados. Reconstrucción sigue creciendo linealmente con el diario. |
| Medio | Gzip del primer respaldo Google no se podía descomprimir por MIME ausente | Blob application/gzip explícito y comprobación de lectura/reconstrucción; el intento fallido se conserva. |
| Medio | Aprobación visual y accesibilidad física no acreditadas | 56 regresiones visuales/funcionales locales y siete comprobaciones por perfil; iPhone/Android y aprobación del propietario pendientes. |
| Bajo | No estaban formalizadas decisiones sobre Fondo/lotes/devoluciones/conteos | Alternativas y consecuencias documentadas; no se inventaron reglas comerciales ni implementaron ampliaciones. |

## Pruebas automatizadas y navegador

246 pruebas Node aprobadas, cero fallos: incluyen las 166 anteriores más 80 de continuidad, permisos, identidad/firma, respaldo, recuperación, sesiones y ejecución por tramos. Reproducir con node --test sobre acceptance.cjs y tests/*.test.cjs de fases 2/3/4/5A/5A.2/5B/5C. La salida exacta está en tests/resultados-locales.txt.

Navegador local: 32 verificaciones del flujo de ventas y 24 del dashboard aprobadas contra Gateway 5C simulado; cinco de vendedor y dos de inventario aprobadas, incluida recarga offline conservando ID/borrador y recuperación. El ensayo de continuidad creó una cola V2 ficticia, bloqueó la actualización y recuperó un recibo simulado original conservándolo. No es una recuperación de dispositivos comerciales ni de un servidor V2 productivo.

Las pruebas locales usan identidades ficticias y políticas de envío/receta ficticias. No certifican inicio de sesión Google. Las pruebas con dispositivos físicos siguen NO EJECUTADAS.

## Rendimiento

20 muestras por volumen local (32, 320, 2048 y 10240 operaciones), datos ficticios, Node v24.20.0, sin red. A 10240 operaciones: reconstrucción media 268,250 ms / p95 287,083 ms; reportes anteriores 114,764 / 130,435 ms; nuevos 11,024 / 11,887 ms; diez periodos sobre un estado 98,430 / 107,313 ms. Comparación exacta de estado y resultados aprobada. Es una mejora de cálculo local, no una estimación de latencia Google.

Primer ensayo Google: 20 muestras a revisión 99, lectura+reconstrucción+reportes media 264,75 ms, p50 219, p95 489, máximo 877. No incluye red frontend ni espera de bloqueo. Escrituras reanudadas mostraron aproximadamente 1–6 segundos por comando en tramos observados; no se publica un p95 de escritura con esa muestra irregular. Ensayo final a revisión 115: 20 muestras, media 368,95 ms, p50 286 ms, p95 593 ms y máximo 1404 ms. Ver tests/google-resultados.json.

La reconstrucción completa continúa siendo O(diario), y las escrituras serializan con ScriptLock. No se ha medido Google con 10240 operaciones: no extrapolar tiempos locales ni las cuotas publicadas a capacidad garantizada. Para 3–10 ventas/día el volumen local probado ofrece margen de cálculo, pero faltan mediciones de red, cuentas reales y seguimiento operativo. El timeout de seis minutos del ensayo muestra por qué mantenimiento y respaldos deben usar tramos/checkpoints. [Cuotas oficiales](https://developers.google.com/apps-script/guides/services/quotas).

Ensayo concurrente Google /dev: tres solicitudes lanzadas simultáneamente por la sesión privada del propietario, actores ficticios; una COMMITTED y dos rechazadas por última unidad. Cierre compensatorio confirmado: físico 1, reservado 0, disponible 1, revisión 117. No equivale a tres cuentas Google ni equipos físicos. Evidencia: tests/google-concurrencia.json y captura local.

## Respaldo y continuidad

Después del ensayo concurrente se repitió el respaldo sin repetir ventas: revisión estable 117, Control!D18:F26, hash c4dad456cea02c5c4274b62748af6e093453103c24bcf3f55cfed05fd5df98b4. Preparación 3,327 s, restauración/verificación 3,588 s, total 6,915 s. Descarga y doble restauración local verificadas sin cambios adicionales. Última medición Google: 20 muestras, media 264,75 ms, p50 223 ms, p95 499 ms, máximo 609 ms, sin red ni espera del lock.

Alcance preciso: las diez tablas y fuentes se recuperaron del archivo comprimido; V2/V3 se reconstruyeron y verificaron localmente. En Sheets de recuperación se materializaron los dos diarios V3 y se compararon sus proyecciones. No se montó una segunda aplicación completa ni se restauraron permisos/credenciales. Ese simulacro operativo integral sigue pendiente.

Restauración Google completa comprobada: revisión 115, diez tablas, 46 archivos fuente y tres estados de navegador local. Copia en Control!D9:F17 del destino separado; 4,296 s de preparación y 6,463 s de restauración/verificación, total 10,759 s. Descarga independiente descomprimida y validada con backup.cjs: SHA256 4f91c71307ac6a6f469caf31c4ed7d69b0a0c6436ea4f81b8676c13390a96d80, release ca73588111c3d04101d3aad1facff5b1d06ffaacc915631c054e96405b5789b0, sin PREPARED pendientes. El historial sintético fuente permaneció intacto. Los datos de personas comerciales no se incluyeron.

Consultar RESPALDO-Y-CONTINUIDAD.md. No se accedió ni copió producción. La copia integra tablas sintéticas, costos, estados, código, configuración sin secretos y tres namespaces de navegador local. Otros dispositivos/orígenes permanecen desconocidos. Nunca se considera UNKNOWN como prueba de ausencia ni se transforma una cola incompatible.

## Matriz para futura activación

| Condición | Estado 5C | Impide activar |
|---|---|---|
| Regresión local e integridad | 246 aprobadas | No por sí sola |
| Permisos backend con sujetos ficticios | Implementados y probados | Falta identidad real |
| Autenticación individual y servicio completo | Pendiente aprobación/recurso/cuentas reales | Sí P0 |
| Inventario de todos los orígenes/colas comerciales | Sin ejecutar, solo fixture | Sí P0 |
| Respaldo sintético y recuperación | Implementado; evidencia Google adjunta | Falta política y ensayo operativo completo |
| Copia independiente de cuenta/custodia/retención | Pendiente decisión | Sí P0 |
| Rendimiento Google a gran volumen/red y tres cuentas | Parcial | Sí antes de certificar uso |
| iPhone y segundo equipo | No ejecutado | Sí P1 |
| Políticas de negocio y permisos finales | Alternativas presentadas | Sí para los flujos afectados |
| Apariencia 5A aprobada por propietario | Por confirmar | Sí |
| Corte, apertura real y único escritor | Plan únicamente | Sí P0 |
| Protección de producción/historial | Respetada | Debe mantenerse |

PRUEBAS-FISICAS.md contiene pasos y acta. DECISIONES-DEL-PROPIETARIO.md presenta decisiones de negocio. ARQUITECTURA-PERMISOS.md compara alternativas sin contratar servicios. PLAN-FASE6.md detalla continuidad, respaldo, conteo aprobado, aperturas nuevas, único escritor, pedido testigo y detención sin restaurar copias antiguas sobre ventas nuevas. Ninguno autoriza ejecutar el corte.
