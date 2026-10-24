# Fase 5G — preparación preoperativa, 23/10/2026

**Estado: PRE_RC local; producción NO-GO.** Preparación y pruebas locales terminadas para este paquete. No es una versión comercial congelada ni un lanzamiento. La fecha objetivo 01/11 depende de cerrar P0 y de autorización del propietario.

Base GitHub verificada: `dev/fase1-estabilizacion` en `2959eafd2ad1c126422e6444c2fd35c7d6ca08d9`; main `12a5f997845f9d31dc1a5d8ae7dc49770928da3d`. Ninguna escritura remota 5G ejecutada. La Fase 5F no existe aún, confirmado por propietario y árbol de código; se excluye del mínimo comercial sin fingir integración CSV/WhatsApp/atribución.

## Cambios implementados localmente

- Etapas trazables MILL (pilado/verde), ROAST desde verde y GRIND desde tostado en grano; preparación con molienda correcta. Conservación de gramos/costos/lote, merma explícita, idempotencia y responsables backend. Ningún cambio de eventos anteriores.
- Formularios conservan diseño y piden pesos/costos sin valores supuestos; recepción exige clasificación explícita y proveedor. Los 300 kg solo existen como caso ficticio del ensayo, no como stock comercial.
- Cancelaciones, devoluciones, descuentos excepcionales y merma manual sin política quedan bloqueados en backend. No se aprobó ninguna política comercial implícitamente.
- Lecturas de configuración reutilizadas solo dentro de una solicitud; verificación durable y revocación conservadas. Sondeo automático 120 s; no se omite validación backend. Datos gerenciales continúan en memoria, sin tocar comandos ni IndexedDB comercial.
- Coordinador sintético de escritor único y validador de acta DRAFT/hash. No están conectados a rutas productivas ni ejecutan apertura/migración.

## Evidencia ejecutada

- **477 pruebas locales aprobadas, cero fallos**: suites anteriores más 27 nuevas; ver tests/regresion.json y resultados.txt. Copia temporal para pruebas antiguas: no recompilación destructiva de los archivos base.
- Reserva simple/Tripack/combo, cobro parcial/total y despacho; última unidad; permisos; masa/costos por etapa; idempotencia; bloqueos de política; precios vencidos al 1/11; nonce y revocación.
- Restauración local desde copia con código/configuración, tres identidades ficticias y dos colas compatibles: recibo perdido y PREPARED con un efecto parcial, reanudación y reintento único. No es recuperación real de infraestructura/credenciales Google/Cloudflare.
- Navegador integrado local con backend/identidad simulados: formularios, pilado/tostado ficticios y exclusión de demo. No pruebas físicas nuevas sobre el paquete 5G; la evidencia física 5E no se da por repetida.

## Entregables y pendientes

| Pedido | Archivo / resultado |
|---|---|
| 1–2. Auditoría 5F e integración | AUDITORIA-5F-Y-DEFECTOS.md: inexistente; CSV/CRM/atribución no aprobados. |
| 3. Defectos críticos | Mismo registro G-01…G-08: correcciones locales y P0 remotos abiertos; catálogo de noviembre como bloqueo de configuración. |
| 4–5. Candidato/pruebas | build/manifest.json, Candidate.gs, worker-bundle.mjs, tests/regresion.json. Commit de base exacto; candidato solo local, sin versiones remotas nuevas. |
| 6, 13. Recuperación y copia | tests/recovery-local.json y RECUPERACION-Y-AUTORIZACIONES.md. Copias privadas en evidencia-local; falta ensayo de infraestructura independiente. |
| 7. Políticas | DECISIONES-DRAFT.md, ninguna aprobación inventada. |
| 8. Lote previsto | OPERACION-APERTURA-Y-CORTE.md y templates/lote-300kg-DRAFT.json. |
| 9. Acta | templates/acta-apertura-DRAFT.json / conteo-apertura.csv y opening-act.cjs; sin pesos, costos o reservas reales cargados. |
| 10. Corte | OPERACION-APERTURA-Y-CORTE.md y writer-fence.cjs. Sin control real de escritor aplicado. |
| 11. Dispositivos | templates/dispositivos-comerciales-DRAFT.csv; ninguna inspección real por equipo realizada. |
| 12, 14. Manuales/contingencia | OPERACION-APERTURA-Y-CORTE.md, tres perfiles y diez incidentes. |
| 15–16. Calendario/dictamen | CRONOGRAMA-Y-GO.md: 24–30, revisión 31, objetivo 01/11 condicionado; NO-GO actual. |
| 17. Autorizaciones | RECUPERACION-Y-AUTORIZACIONES.md: siguiente paso A concreto, plan B de infraestructura y permisos comerciales separados. |

Para revisar/reproducir: `node fase1-aislada/fase5g/run-tests.mjs` y `node fase1-aislada/fase5g/run-recovery.mjs`. Solo localhost: `node fase1-aislada/fase5g/tests/serve-local.mjs`; sus cuentas ficticias nunca van al paquete remoto.

No registrar datos reales con este candidato TEST_ONLY ni sustituirlo por producción mediante un simple interruptor. Faltan recuperación integral real, inventario/cuentas/reservas de apertura, censo/rutas reales, permisos de corte y configuración/namespace comercial, catálogo/tarifas/receta aprobados y regresión remota/física exacta. No se programaron tareas para fechas futuras.
