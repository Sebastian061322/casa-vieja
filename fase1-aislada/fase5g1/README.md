# Fase 5G.1 — avance local, NO-GO

Base GitHub comprobada 4731cabf36eb8471b0c25354a75f47f879f9d583. No hubo avances posteriores al iniciar. El propietario autorizó el paquete exacto. La hoja DR ya contiene 38 registros y 40 movimientos restaurados y releídos exactamente. La recuperación del servicio completo e identidades DR todavía no está validada.

- build.mjs compila derivados DR del backend 5G y el Worker visual aprobado, verificando antes sus hashes. Conserva el epoch del motor y los fingerprints originales; cambia el destino del sobre firmado y exige recoveryScope para comandos nuevos. El origen web DR y su IndexedDB son distintos. Los comandos originales no se ejecutan mediante execute; un PREPARED respaldado se recupera por operationId con su actor original, sin cambiar su identidad ni fingerprint.
- restore.gs proporciona restauración privada por editor, hash independiente, preflight de todos los prefijos/configuración, readback, INCOMPLETE/COMPLETE y bloqueo previo de escrituras. No expone mantenimiento a través de API. Jamás trunca una tabla divergente ni restaura encima de operaciones posteriores.
- fixture.mjs crea un escenario nuevo completamente ficticio con recibo perdido, REJECTED y PREPARED parcial. prepare-archive.mjs fija el archivo privado: 38 registros y 40 movimientos. Los subjects de las cuentas de laboratorio se tomaron de evidencia ya verificada; no se cambia la identidad de registros anteriores. Este archivo NO es una copia de seguridad del laboratorio vivo ni de producción.
- verify-archive.py implementa comprobación de hash independiente del generador JavaScript. Se verificaron todas las secciones y los bytes de código de build/.
- opening.cjs añade evidencia de conteo por fila, fechas, unidades, valores respaldados, distinción de retenidos y balance de gramos sin rendimientos supuestos.
- continuity.cjs calcula obligaciones, reservas y saldos por cobrar sin reingreso, COGS ni cobros históricos. Concilia cada reserva con su referencia de origen. UNKNOWN y cancelaciones no resueltas bloquean. Es un planificador local: no hay todavía ejecutor comercial para importar/atender obligaciones legadas ni autorización de apertura.

Pruebas: `node --test fase1-aislada/fase5g1/tests.mjs`. Son pruebas locales del candidato DR, no resultados Google ni de dispositivos. Los 482 resultados anteriores certifican el paquete anterior, no una publicación 5G.1.

Revisión previa confirmó y corrigió tres detalles antes de congelar: configuración pública de Google debe conservar googleClientId/enabled/realAccountsAuthorized; un restore ya completo debe comprobar prefijos/configuración antes de declarar que el archivo ya fue restaurado; el ámbito DR queda fuera de la huella semántica del intento para que repetir el mismo formulario conserve operationId. Los tests incluyen conflicto de prefijo, interrupción, recibos, actor incorrecto, revocación y bloqueo del origen.

Autorización concreta: AUTORIZACION-RECUPERACION.md. Inspección productiva propuesta, todavía sin ejecutar: INSPECCION-ESCRITORES.md. Decisiones comerciales pendientes: DECISIONES.md.

## Condiciones de salida

| Control | Estado |
|---|---|
| Paquete, esquema, hashes y archivo ficticio | Preparados localmente |
| Hash por implementación independiente | Aprobado local |
| Apertura y continuidad | Validadores/planificador probados; ejecución comercial pendiente |
| Restauración de datos en Google | Aprobada: interrupción y reanudación, 38 registros/40 movimientos exactos |
| Recuperación del servicio e identidades DR | Autorizada, configuración y ensayo autenticado pendientes |
| Tres usuarios en destino DR | Configuración preparada; no habilitados allí |
| Custodia independiente de respaldo y clave | Pendiente de decisión/acción del propietario |
| Inspección/cierre de escritores antiguos | Pendiente de autorización específica; nada inspeccionado ni cerrado |
| Políticas, conteo físico, obligaciones y candidato final | Pendientes; sin RC congelada ni GO |

No se ha activado producción, no se creó infraestructura adicional ni se habilitó facturación. No se ejecutó corte, no se registraron 300 kg reales y no se accedió a datos comerciales. Etapa de datos medida en Google: 8 s hasta interrupción y 36 s de reanudación; 58 s de intervalo con pausa. RTO del servicio completo y RPO comercial todavía no medidos.

Inspección estática autorizada de index.html en main: ver ESCRITORES-LEGADO.md. Detectadas colas localStorage outbox/failedOps; no se leyeron equipos ni datos comerciales.
