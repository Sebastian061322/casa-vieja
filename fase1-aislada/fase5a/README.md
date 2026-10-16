# Fase 5A — candidato de interfaz, pendiente de aprobación visual

Implementado exclusivamente como laboratorio local con datos ficticios. No se subió código a Apps Script ni se actualizó el despliegue privado de Google. El servidor simula los mismos métodos del backend de Fase 4; sus reglas completas se mantienen sin cambios. Ninguna escritura a Sheets, producción, main o archivos de fases anteriores.

## Revisión

Abrir http://127.0.0.1:8795/ mientras esté ejecutándose `node fase1-aislada/fase5a/preview.cjs`. Solo escucha 127.0.0.1. `/original` muestra copia saneada del original con catálogo ficticio y conexiones bloqueadas; `/fase4` muestra la interfaz anterior con el mismo backend sintético. La información local se elimina al detener el proceso, salvo borradores/cola en IndexedDB. No es un sistema comercial.

La comparación y matriz están en DIAGNOSTICO.md. La galería está en REVISION_VISUAL.md. El contrato futuro de publicidad está en META_ADS_CONTRATO.md. El propietario debe aprobar la organización antes del cierre; las pruebas técnicas no sustituyen su revisión.

## Qué cambió

- Nombres familiares: Inicio, Ventas, Pedidos, Inventario, Egresos, Configuración. Navegación secundaria agrupada en Compras y egresos y Configuración y más.
- Ventas: modos Simple / Tripack / Combinada, filtros opcionales de familia/molienda/gramaje, partida explícita, precio de catálogo, grupos de producto/contacto/envío y total persistente. Cambiar de combinada a una presentación aparta las líneas extra y permite recuperarlas al volver, sin descartarlas silenciosamente.
- Guardado de campos y líneas del borrador en IndexedDB, conservado al navegar y recargar. Borrador local, comando pendiente y venta confirmada son estados distintos. Los controles se bloquean al enviar una venta pendiente para no cambiar su contenido mientras se recupera.
- Cobro y despacho siguen siendo operaciones separadas. El medio de pago previsto es solo un dato local del borrador y se indica explícitamente. No se marca pagado sin un cobro confirmado. No se habilita precio libre, fecha comercial arbitraria ni entrega automática.
- Enlace al pedido exacto tras confirmación. Búsqueda, estado y filtro de fechas sobre proyecciones del backend. Se conserva la distinción entre pago y devolución física.
- Inventario con atajos Café a granel / Bolsas listas / Insumos, filtros existentes y tabla desplazable. Nunca se escriben saldos desde el navegador.
- Formularios operativos en modal, agrupación de campos, botones de 44 px como mínimo, acceso al contenido, regiones de estado, etiquetas y menú móvil cerrado fuera del foco.
- Móvil: barra inferior Inicio, Ventas, Pedidos, Inventario y Más; total y acción de venta fijos sobre la barra. Se conserva menú lateral familiar en escritorio.
- Publicidad: demo diaria con inversión, campaña, conjunto, anuncio, impresiones, alcance, clics, CTR, CPC, CPM y conversaciones; pedidos/ROAS no verificables sin evidencia. Filtros y fecha de actualización. No conecta proveedores.

## Archivos

Todos los archivos son nuevos bajo `fase1-aislada/fase5a/`:

| Archivo | Propósito |
|---|---|
| DIAGNOSTICO.md | Comparación previa, matriz y flujos |
| web/app.js | Copia de Fase 4 con solo nombre de almacenamiento aislado y delegación de Nuevo pedido |
| web/ux.js | Presentación, filtros, borradores y navegación |
| web/ux.css, web/shell.html | Distribución adaptable y estructura accesible |
| build.cjs | Compila candidato, sin subir ni desplegar |
| apps-script/Code.gs, Index.html | Candidato compilado; backend anterior idéntico |
| preview.cjs | Servidor local, RPC simulados y datos ficticios |
| prepare-original.cjs | Genera referencia sin conexiones desde fuente de solo lectura |
| tests/original-fixture.json, original-sanitizado.html | Catálogo ficticio y referencia visual aislada |
| tests/browser-tests.mjs | Recorrido repetible por CUA, sin manipular el estado interno de la página |
| tests/package.test.cjs | Integridad del backend, limitación de cambios y seguridad del paquete |
| tests/regresion.txt | Resultado de las 135 pruebas locales |
| tests/interfaz-escritorio.json, interfaz-movil.json | Evidencia de acciones y dimensiones |
| evidencia/*.png | Capturas de comparación y revisión |
| META_ADS_CONTRATO.md | Contrato propuesto, sin integración |
| ACTA.md, REVISION_VISUAL.md | Resultados, límites y revisión pendiente |

## Pruebas

Construir: `node fase1-aislada/fase5a/build.cjs`.

Regresión:

```sh
node --test fase1-aislada/tests/acceptance.cjs fase1-aislada/fase2/tests/*.test.cjs fase1-aislada/fase3/tests/*.test.cjs fase1-aislada/fase4/tests/*.test.cjs fase1-aislada/fase5a/tests/*.test.cjs
```

135 pruebas: 129 anteriores + 6 de integridad del candidato. Además 32 comprobaciones de navegador de escritorio, 6 de interacción móvil y 4 tamaños representativos. El recorrido browser-tests.mjs se ejecuta con `runUXTests(tab)` mediante la API CUA documentada, sobre el preview local; no usa servicios Google ni datos reales. Los ensayos liberan sus reservas mediante cancelaciones trazables. Se corrigió el propio recorrido para distinguir intentos sucesivos con nombres ficticios únicos.

## Límites y Fase 5B

No hay aprobación visual todavía. Falta probar teclado virtual y zonas seguras en teléfonos físicos, lectores de pantalla reales, zoom, contrastes medidos y operación prolongada. Se validaron atributos de teclado, no un teclado nativo de iOS/Android. Las pruebas móviles usan anchos representativos, no emulación certificada de esos equipos.

No se repitieron las 48 verificaciones reales de Google de Fase 4: se conservan como evidencia de esa fase, no se atribuyen al candidato nuevo. Antes de actualizar el despliegue privado: aprobar organización, verificar continuidad de colas y ejecutar ensayos de integración del paquete final.

La base IndexedDB `cv-commercial-sandbox-v5a-owner` es deliberadamente distinta de V4 para aislar este ensayo. No se borró ni migró la cola V4. No desplegar este candidato sobre un uso existente sin un mecanismo revisado que detecte y gestione operaciones V4 en tránsito. Mantener acceso a la interfaz previa mientras se valide esa continuidad.

Persisten los límites de Fase 4: Fondo, conteos autorizados, restauración, roles, carga y políticas de devolución. La navegación y los reportes propuestos no equivalen a contabilidad fiscal. Publicidad no implementa atribución ni conexión. Fase 5B debe resolver estos puntos con alcance aprobado; no se prepara activación comercial.
