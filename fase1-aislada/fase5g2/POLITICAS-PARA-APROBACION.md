# Decisiones de noviembre — pendientes de aprobación

Estado: DRAFT, sin efecto comercial. No se reutilizan los importes ni las aprobaciones ficticias de las pruebas. Roles, Gmail individuales, perfiles separados y costo S/0 ya están confirmados y no se vuelven a solicitar.

Completar cada fila con una decisión concreta y evidencia del propietario. Una aceptación de este documento sin valores no habilita flujos.

| Política | Decisión necesaria | Consecuencia y bloqueo hasta aprobar |
|---|---|---|
| Precios y promociones | Productos, presentaciones, precios en soles, vigencia, composición de packs y descuentos permitidos | Catálogo de noviembre sin habilitar; el vendedor no cambia precios |
| Entrega | Zonas, tarifa, quién asume el costo, condiciones y evidencia de entrega | No deducir una tarifa de direcciones libres ni usar «Zona ficticia» en comercio |
| Cobros | Medios aceptados, evidencia, responsable de comprobarla y tratamiento de pagos parciales | Vendedor no confirma cobros; transferencia declarada por cliente no equivale a cobro verificado |
| Despacho con deuda | Exigir pago completo o permitir excepciones, quién autoriza y hasta qué monto | Propuesta conservadora: bloqueo con saldo; todavía no es una regla comercial aprobada |
| Cancelaciones y anticipos | Quién autoriza, condiciones, devolución de dinero y evidencia | Continuidad bloquea cancelaciones con anticipos hasta resolverlas; no libera dinero automáticamente |
| Conteos y ajustes | Responsables, segundo revisor, motivos y autorización | Ajuste nuevo vinculado al conteo; nunca reescritura del diario o saldos históricos |
| Devoluciones | Apto para reventa, cuarentena, dañado; inspección y devolución económica | No reingresar automáticamente producto devuelto al stock vendible |
| Estados de lotes | Requisitos de apertura, disponibilidad, retención y cierre | Retenido/dañado no vendible; transiciones comerciales definitivas pendientes |
| Empaque | Receta por gramaje/molienda: café, bolsa, válvula, etiqueta y otros materiales | No preparar con recetas ficticias; consumo de cada insumo debe ser explícito |
| Costos y mermas | Documentos, asignación de procesamiento, medición y aprobación de merma | Sin costo respaldado no abrir inventario; ninguna merma implícita ni recálculo de ventas anteriores |
| Respaldos | Aprobar o modificar frecuencia, retención, destino y custodia de RESPALDO-Y-CUSTODIA.md | Copia y restauración comercial pendientes de permiso específico y ensayo de custodia |

## Registro versionado

Usar `templates/POLITICA-DRAFT.json`. Cada política debe tener ID y versión inmutables, contenido completo, hash canónico, identidad verificable del aprobador, fecha de aprobación, fecha efectiva y referencia de evidencia. Un cambio genera una versión nueva; no sustituye la anterior. El backend selecciona la versión efectiva y conserva su referencia en cada operación confirmada. No acepta rol, aprobación o política arbitraria del navegador.

El motor local exige procedencia, hash y aprobación sintética con fecha válida; esos registros TEST_ONLY no son aprobaciones del propietario. Falta implementar la administración comercial de este catálogo y validar su integración remota antes de habilitarlo. Un hash acredita integridad del contenido, no prueba por sí solo la identidad ni la aprobación.

La política de entrega, precios, cancelaciones y devoluciones debe aprobarse junto con sus ejemplos de aceptación/rechazo. Los cambios no recalculan operaciones previas. Obligaciones desconocidas o cancelaciones sin resolver bloquean el paquete de apertura; se resuelven en su motor compatible antes de un corte aprobado.
