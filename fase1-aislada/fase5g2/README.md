# Fase 5G.2 — avance verificable y condiciones de cierre

Fecha: 28/10/2026. Dictamen actual: **NO-GO comercial; sin Release Candidate congelado**. No se ejecutó el corte ni se cambió producción. El 1 de noviembre es una fecha objetivo, no una autorización.

HEAD remoto de desarrollo comprobado al inicio y al cierre de este avance: `6578003bcd02988c1b4a44b9402e5dbc23963d34`. Este directorio es un laboratorio local sin Git; sus archivos nuevos todavía no están publicados en esa rama. No se tocó main ni index.html productivo.

## Implementado y probado en este avance

- Ejecutor prospectivo de obligaciones y apertura, costos/reservas, cobros futuros y estados versionados: `continuity-engine.cjs`, `opening.cjs`.
- Compilación del backend existente con la extensión: `build.cjs`, `build/Candidate.gs`, manifiesto. SHA256 del artefacto local: `080a6e6e0cb0813cb8741a3d7b63a3cf0c30c943150a11369c0490b46e9dc31c`.
- Exclusión de escritores y drenaje en simulador: `cutover.cjs`; ensayo reproducible: `rehearsal.mjs`.
- Respaldo cifrado autenticado y restauración por prefijos, con interrupción/reanudación sin duplicar: `backup.cjs`, `backup-verify.cjs`.
- Ayudante de inspección limitada de metadatos: `inspect-device.cjs`. Es una herramienta local probada con datos falsos, no evidencia de inspección de dispositivos reales.

**63 pruebas aprobadas, 0 fallidas**, en ocho archivos seleccionados: motor, corte, respaldo, backend compilado, censo y regresiones relacionadas de procesos/comercio/controles. Evidencia exacta: `tests/resultados.json` y `tests/resultados.txt`. No sumar estas pruebas a los conteos históricos como si fueran una regresión completa de RC. No se ejecutaron nuevas pruebas con Google ni equipos físicos para esta extensión.

El ensayo local ejercitó 18 rutas declaradas, drenó una escritura en tránsito, verificó respaldo cifrado, abrió una vez, conservó tres obligaciones, confirmó y recuperó un pedido nuevo sin duplicarlo y terminó en NONE tras un fallo, sin reabrir OLD. Evidencia: `evidencia-local/simulacro.json`. El GET de v2 se representa como lectura, con riesgo de exposición; el GET de v15 incluye escritura potencial. El bloqueo se demuestra en adaptadores del modelo que comparten autoridad; **no demuestra que los endpoints reales estén cerrados**. Sus milisegundos no son un RTO comercial.

Se incorporaron controles para evitar cobros duplicados, despacho doble, cancelación con anticipos sin resolución, reserva con costo inconsistente, uso de stock retenido, apertura sobre datos existentes, aprobación sintética sin procedencia/hash y restauración con un hash no fijado de forma independiente. Sus alcances y límites están en las pruebas y en EJECUTOR-Y-APERTURA.md.

## Matriz de entregables y bloqueos

| Entregable | Estado y evidencia | Qué falta |
|---|---|---|
| Escritores antiguos | Matriz de 18 rutas en MATRIZ-ESCRITORES.csv, con vacíos explícitos | Uso efectivo, otras cuentas/proyectos, editores e integraciones |
| Riesgo v2 | Inspección estática previa reutilizada; plan en CONTENCION-Y-CENSO.md | Probar dependencias sin llamar endpoint; aprobación separada de contención |
| Censo | URL comercial confirmada; cuatro contextos Safari declarados | Inspección individual; perfil/equipo del vendedor y recibos/versiones efectivas desconocidos |
| Cierre antiguo | Plan y ensayo local de ambas versiones | No ejecutado ni autorizado en producción |
| Respaldo/custodia | Primario: propietario; segundo: socio designado. Prueba cifrada local y DR sintético anterior | Destino físico preciso, custodia demostrada, retención/frecuencia aprobadas, permisos para respaldo comercial |
| Continuidad | Ejecutor local y backend compilado probados | Aislamiento remoto vacío, interfaz, prueba Google y aprobación de publicación |
| Apertura | Acta DRAFT y validador sintético | Conteo físico, documentos/costos, vínculos, segundo revisor, fecha efectiva y firma |
| Políticas | Once decisiones concretas en POLITICAS-PARA-APROBACION.md | Valores y aprobación del propietario; catálogo/backend/UI comercial versionados |
| Ensayo integral | Aprobado dentro del modelo local | Cierre dinámico real y regresión del paquete remoto exacto |
| Resultados | 63/63 locales; simulacro aprobado | No sustituye validaciones físicas/remotas posteriores |
| Release Candidate | NO preparado/congelado | Resolver P0 anteriores y fijar artefactos exactos |
| Publicación | Procedimiento en PUBLICACION-Y-CONTINGENCIA.md | Aprobar cada etapa sobre recursos identificados |
| Contingencia | Detener NEW→NONE, conservar colas/diario, sin reapertura OLD automática | Ensayo operativo completo del paquete final |
| Dictamen | NO-GO comercial | No activar por calendario |
| Autorizaciones | Alcances separados a continuación | No inferir permisos generales de aprobaciones parciales |

## Autorizaciones y decisiones restantes

La revisión limitada de la computadora principal/Safari fue autorizada el 28/10: solo conteos/estados de colas y nombres/versiones de almacenamiento, sin abrir/recargar ni llamar al servidor. El propietario seleccionó una pestaña ya existente y se verificó su dirección. Autorizó habilitar temporalmente el menú Desarrollo: preferencia observada 0, habilitada a 1; al intentar abrir la consola Safari dejó de responder a la lectura AX. **No se ingresó ni ejecutó la sonda y no se leyeron colas.** Se reabrieron preferencias y se restauró/verificó el valor 0. La lectura de la web sigue bloqueada; se pidió cerrar únicamente el panel Inspector si está visible, sin recargar ni cerrar la pestaña. No equivale a cuatro equipos aprobados. La sonda `census-console.js` tiene otras dos pruebas locales dirigidas aprobadas; todavía no se ejecutó en el navegador real.

Faltan permisos concretos para cada otro equipo/perfil; lectura adicional de versiones/implementación/recibos si exige datos fuera de ese alcance; cualquier contención, retiro de implementación o cambio de permisos/clave; respaldo comercial con archivos/rangos/destino; destino e integración remota de continuidad; publicación del paquete; inventario real y apertura; cierre antiguo y activación nueva. No se piden todavía acciones comerciales sobre un paquete incompleto.

Faltan decisiones sobre las once políticas de noviembre y la ubicación operativa de copias cifradas. Teléfono u otra laptop son opciones indicadas por el propietario; no son copias existentes ni autorizan exportar datos comerciales.

La recuperación DR ya ensayada en 5G.1 se conserva como evidencia de su escenario sintético; no se repitió innecesariamente ni se presenta como copia del negocio vivo. No se accedió a datos reales, no se crearon servicios, no se habilitó facturación y no se publicaron nuevos archivos ni despliegues.
