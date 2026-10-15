# Casa Vieja — Fase 1 aislada

Fecha de trabajo: 14/10/2026, America/Lima. Estado: preparación local y modelo de referencia probados; integración y activación pendientes.

**Actualización tras autorización del propietario:** se crearon la rama remota, la hoja sintética y el proyecto Apps Script independiente. Ver [recursos creados](docs/recursos-creados.md). El alcance descrito a continuación registra la primera ejecución local; ya no describe la ausencia de esos tres recursos.

## Alcance autorizado y acciones realizadas

Se interpretó la solicitud actual «si existe autorización suficiente para edición EN ENTORNO AISLADO, implementa allí» como permiso para crear este laboratorio local con datos sintéticos. No se crearon ramas, commits, repositorios, copias de Drive ni despliegues. No se accedió a Google Sheets ni al endpoint Apps Script. No se modificaron main, fuentes sincronizadas, auditoría previa, código web ni datos históricos. La carpeta raíz del proyecto no es un checkout Git; este laboratorio tampoco lo es.

Se recuperaron los entregables locales de auditoría y se leyó index.html por el conector GitHub. Blob actual de main: `159727617309256dba3d7599ecc90b1d3113213b`, idéntico al del commit auditado `12a5f997845f9d31dc1a5d8ae7dc49770928da3d`. Esta comparación confirma únicamente igualdad de index.html, no ausencia de cambios en todo el repositorio. No se ejecutó ese HTML, que puede contener conexiones reales. Apps Script v3.2 figura en un adjunto del chat; su correspondencia con el despliegue vigente no está verificada.

## Archivos

- `docs/plan-y-corte.md`: acciones, continuidad, corte, criterios de aprobación y reversión.
- `docs/protocolo.md`: contrato futuro, almacenamiento separado y recuperación.
- `src/engine.cjs`: motor de referencia de reservas, despacho, cancelación, contacto y pago; diario PREPARED/COMMITTED.
- `src/sync.cjs`: cola local y defensa contra descarga tardía.
- `apps-script/Code.gs`: barrera desactivada para futura integración; no es un backend funcional.
- `tests/acceptance.cjs`: pruebas locales con datos ficticios.
- `docs/resultados-pruebas.txt`: resultado ejecutado.

Ejecución reproducible, sin instalar dependencias: `node --test tests/acceptance.cjs` desde esta carpeta. No necesita tokens ni conexión.

## Lo que todavía no está resuelto

Este es un modelo de referencia separado, no un parche de la aplicación. Journal conserva filas en memoria; las pruebas serializan y reconstruyen ese diario para simular un reinicio. No demuestra durabilidad física, bloqueo entre procesos, límites de Sheets ni fallos reales de almacenamiento. expectedVersion global fuerza revalidar comandos competidores y protege el estado; reduce concurrencia y no autoriza reintentos ciegos con una versión nueva.

Las cinco reproducciones anteriores siguen documentando defectos del código original. Las nuevas pruebas verifican reglas equivalentes del modelo; no equivalen a pasar esas mismas regresiones sobre index.html corregido. No se han probado interfaz móvil, apariencia, rendimiento real, retorno físico, preparación de café, recepción de lotes, insumos, pagos parciales, autenticación o integración Apps Script. Ninguna venta actual está protegida por este laboratorio.

La historia queda CERRADA E INMUTABLE. Las propuestas de conciliación o corrección histórica de la auditoría quedan expresamente descartadas por la decisión actual del propietario. No hay autorización para ajustar una sola celda histórica.
