Estado actualizado al 22/10/2026: consultar [RESULTADOS-REALES-5E.md](RESULTADOS-REALES-5E.md). La recuperación de confirmación, última unidad física y materialización/restauración Google ya tienen evidencia. Las notas de preparación reflejan el estado anterior. La corrección visual posterior está preparada y pendiente de publicación.

# Fase 5E — paquete local de estabilización

Base remota verificada: `4e9c95bd09be526a17fb86173eca1a66126e5566`, rama `dev/fase1-estabilizacion`. No se publicó este paquete ni se cambió el escritor comercial. Los datos utilizados son sintéticos.

## Implementación

- `web/intents.mjs`: índice durable por intención. Dos pestañas o doble envío del mismo borrador reutilizan el operationId; cambiar un pendiente exige revisión. No transforma colas anteriores.
- `web/private-projections.mjs`: snapshots y reportes gerenciales reconstruibles solo en memoria. Conserva comandos, recibos, evidencia y borradores. No es cifrado ni elimina los datos financieros imprescindibles de operaciones pendientes.
- `web/controlled-response.mjs`: ensayo explícito de respuesta retenida en Worker. El navegador recibe 503 temporal después de COMMITTED y recupera por status. Solo cliente ficticio `TEST_ONLY_5E_`, REGISTER_SALE y modo `?recovery=5e`.
- `integrity.cjs`: verificación independiente de IDs, orden, huérfanos, fingerprints, reservas y proyecciones.
- `recovery.cjs`: archivo con diario, configuración sintética, código/versiones y estado de dispositivos, hashes y restauración reanudable sobre destino separado.
- `report-index.js`: índice de eventos por pedido durante una consulta; se descarta después y no reemplaza el diario.
- `apps-script/Observability.gs`: correlación y tiempos sin identidad, tokens ni payload. Métricas inclusivas; no sumar lockHeld con reconstrucción o Sheets.
- `count-plan.cjs`: conciliación de conteo solo como propuesta, sin generar ajustes ni aprobar reglas.
- `ads-contract.cjs`: contrato publicitario sintético append-only, correcciones retrospectivas y atribución verificable separada de estimaciones.

Se integraron estos módulos en el constructor y arranque del laboratorio 5D, conservando diseño y los nombres de IndexedDB. Los únicos RPC públicos del candidato siguen siendo zeroRequest, doPost y doGet. No se incorporó mantenimiento al endpoint público.

## Reproducción local

1. `node fase1-aislada/fase5e/run-tests.mjs --authorized-script`
2. `node fase1-aislada/fase5e/run-lab.cjs`

El primer paso usa adaptadores de identidad/Sheets ficticios y guarda su resultado en tests/resultados.txt, sin alterar el resultado histórico de 5D. El segundo restaura archivos locales separados y mide reportes sintéticos. No hay publicación, llamadas a Google ni activación de integraciones en estos comandos. Candidate.gs y copias completas quedan excluidos de Git.

## Estado

Resultados y límites: INFORME-5E.md. Retención/RPO/RTO: CONTINUIDAD-Y-RESPALDO.md. Pruebas Google y físicas pendientes: ENSAYOS-REALES.md. Contrato para Fase 5F: META-ADS-5F.md.

No confundir 5E local con Worker remoto 4c2cd709. La publicación requiere autorización específica conforme al prompt del propietario. NO-GO para activar Fase 6 y para automatizar publicidad.
