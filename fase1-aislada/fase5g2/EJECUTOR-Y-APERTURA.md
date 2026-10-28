# Continuidad y apertura: implementación local

## Qué hace

`opening.cjs` prepara y verifica un paquete sintético de acta y obligaciones. Exige vínculo de origen, revisión y evidencia; producto, lote, responsable y documento; cantidades, costos y reservas consistentes. No convierte los aproximadamente 300 kg esperados en stock. El acta vacía `templates/ACTA-APERTURA-NOVIEMBRE-DRAFT.json` se completa y firma antes de cualquier inventario real; no es ejecutable ni una aprobación.

`continuity-engine.cjs` extiende el motor recuperable existente. `OPEN_CONTINUITY` crea saldos nuevos y obligaciones prospectivas; no recrea ventas históricas. Las operaciones son `CONTINUITY_PAYMENT`, `CONTINUITY_DISPATCH`, `CONTINUITY_DELIVER` y `CONTINUITY_CANCEL`. Cada comando exige versión, política del servidor, permisos, ID persistente y recibo recuperable. Son comandos definidos y probados en el código local, no una API comercial habilitada.

El pago posterior disminuye la deuda y registra el cobro futuro una vez, sin recrear ingreso por venta ni costo histórico. El despacho consume físico y reserva una vez. La entrega posterior no vuelve a consumir inventario. Cancelar una reserva sin anticipos la libera; con anticipos se bloquea hasta contar con resolución autorizada. Las partidas retenidas o dañadas no quedan disponibles para ventas. El inspector comprueba reservas tanto de obligaciones anteriores como de ventas nuevas.

La apertura requiere saldo vacío, coincidencia con el hash aprobado en configuración del servidor y política efectiva. Un ID repetido con contenido distinto se rechaza; una operación parcialmente escrita se recupera. Un paquete de apertura supera el límite local de 12.000 caracteres se rechaza antes de registrar el comando: todavía no existe un protocolo de apertura grande por fragmentos. No dividirlo manualmente en aperturas parciales.

## Integración comprobada y límite actual

`build.cjs` genera `build/Candidate.gs` sobre el backend 5G cuyo hash está fijado. Las pruebas ejecutan ese Apps Script compilado en una máquina virtual local con firmas, identidad, almacenamiento y reloj sintéticos. La configuración `CV_5G2_CONTINUITY_CONFIG` ausente bloquea los comandos nuevos. Las pruebas no utilizan servicios de Google ni secretos reales.

**No desplegar este archivo en el laboratorio poblado.** Conserva las restricciones de Script/Sheet del backend base y rechaza una apertura sobre recursos existentes. Falta fijar un destino vacío o un esquema de aislamiento explícito, preparar su paquete, verificar permisos y solicitar la aprobación correspondiente. No se autoriza vaciar, sustituir o restaurar sobre el laboratorio actual para lograrlo. El escenario DR anterior tampoco se reutiliza por defecto.

La interfaz actual no incluye todavía los controles de obligaciones arrastradas ni la presentación completa de sus indicadores. La integración remota, esos controles, la validación de políticas comerciales y una regresión física del paquete exacto son pendientes. El candidato local no es un Release Candidate comercial ni un paquete listo para desplegar.

## Reproducción segura

Desde la raíz del proyecto:

```
node fase1-aislada/fase5g2/run-tests.mjs
node fase1-aislada/fase5g2/rehearsal.mjs
```

Solo generan artefactos locales y datos ficticios. No instalar dependencias, leer archivos privados ni hacer llamadas remotas. `tests/resultados.json` y `evidencia-local/simulacro.json` distinguen explícitamente el alcance local del remoto.

El simulador `cutover.cjs` pasa de OLD a NONE después de drenar solicitudes admitidas; la apertura ocurre en NONE y solo su recibo permite NEW. Ante fallo, NEW pasa a NONE y no vuelve automáticamente a OLD. Sus 18 adaptadores usan una autoridad compartida: esto demuestra el algoritmo del modelo, no bloquea los endpoints, editores o integraciones reales de Google. La prueba efectiva de cierre de esos escritores requiere el censo, la contención autorizada y evidencia independiente.
