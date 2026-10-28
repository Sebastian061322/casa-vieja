# Estado único — Fase 5G.3

Actualizado 28/10/2026. **NO-GO comercial para el 1 de noviembre mientras persistan los P0 siguientes.** Preparación local parcial; no RC congelado, no nueva publicación de laboratorio ni activación comercial. La fecha no inicia operaciones automáticamente.

## Hecho / evidencia

- HEAD dev remoto verificado: `6578003bcd02988c1b4a44b9402e5dbc23963d34`. Tres commits recientes corresponden al DR (6578003b, 10427bb9, 444eaf7d). El árbol remoto completo no contiene `fase5g2/` ni `census-console.js`. No atribuirle estos archivos locales.
- `git status` local confirma que no hay repositorio Git. No puede presentarse un listado de «untracked» o diff local como si existiera una rama. Se preservaron fases anteriores; trabajo nuevo en fase5g3 y actualización del handoff. No se clonó, publicó, cambió main ni tocó index.html productivo.
- Backend local aislado: tres pestañas propuestas TEST_ONLY, apagado por defecto, sin crearlas automáticamente. Rutas originales conservan su diario. Comandos nuevos requieren ámbito firmado, prefijo propio, permisos, configuración y cabeceras exactas. Recuperación de recibos por el ID original y restauración del ámbito tras errores.
- Adaptador de cola implementado en `scoped-client.mjs`: base nueva por identidad `cv-zero-lab-5g3-v1-google:…`, sin migrar colas antiguas; draftId duradero evita duplicar intención, recupera respuesta perdida y conserva/archiva rechazo con evidencia usando el parser y sesión existentes. Siete pruebas dirigidas, una atraviesa el Apps Script compilado. Falta montar este adaptador y los controles de continuidad/catálogo en la interfaz autenticada y probar IndexedDB real para esta versión.
- Continuidad compilada: apertura parcialmente escrita recuperable, reserva antigua, anticipo, saldo/cobro, despacho y compra nueva del mismo cliente sin recrear ingresos/COGS anteriores. UNKNOWN y cancelaciones sin resolver bloquean apertura. Un rechazo definitivo no equivale a confirmación.
- Se eliminó la dependencia de esperar al 1/11 para ensayar: acta TEST_ONLY con fecha de ensayo válida; reloj de autenticación/auditoría sin falsear. Contrato anterior intacto fuera del ámbito aislado.
- Revisión de acta local: interfaz con colores/tipografía existentes, tabla físico/reserva/disponible/costos, doble revisor declarado y obligaciones. Usa el validador compartido. Confirmación deshabilitada; no identifica revisores reales ni escribe inventario. No se asumieron 300 kg. `node fase1-aislada/fase5g3/preview.cjs` solo en 127.0.0.1:8796.
- Catálogo: fuente actual confirmada por el propietario; 14 ofertas extraídas y seis mixtos comprobados. Ver CATALOGO-EXTRAIDO.md. Adaptador backend local fija composición, precio y reparto exacto de céntimos, exige asignación de lote a línea comercial y bloquea importes o partes de pack manipulados. Sin configuración aprobada no habilita el catálogo.
- **595 pruebas locales aprobadas, 0 fallidas**, 70 archivos; copia temporal excluye private/evidencias y limita fetch/HTTP de las pruebas a loopback. `tests/regression.json`/`.txt` vinculan artefactos y alcance. Pruebas remotas nuevas de este paquete: 0; físicas nuevas: 0. Un recorrido de navegador local observado en `tests/ui-observation.json` y capturas de build/. No certificar iPhone/Android o Google por esa observación.
- Evidencia DR 5G.1 y pruebas físicas previas se reutilizan solo para sus versiones/escenarios históricos; no se repitieron ni se atribuyen al backend nuevo. No se midió ahorro de créditos/tokens ni RPO/RTO comercial.

Backend local SHA256: `70154ddfd484be2ceaeeaf504324d58657d96537d7bb85dca7ea79dc8cd6955e`. El manifiesto local no sustituye un commit, versión de Apps Script, Worker ni esquema remoto verificados. Worker actual sin modificar en este sprint; versiones reportadas previamente no se presentan como una nueva verificación remota.

## Skills verificadas

Comprobación en catálogo de esta sesión, ~/.agents/skills, ~/.codex/skills (incluyendo ocultos) y .agents/skills del laboratorio. No hay herramienta skills.list/refresh expuesta en esta sesión. CLI instalado: 0.162.1; --version emitió advertencia de que no pudo crear alias PATH. No se cambió configuración global ni se probó un nuevo proceso de selección implícita/modelo. Los cuatro ajustes históricos no están identificados/aplicados por este sprint: configuración global NO certificada como terminada.

| Nombre exacto | Disponible / alcance | Carga y uso real |
|---|---|---|
| codex-contexto-eficiente | Sí, usuario/catálogo | Leída; selección de archivos/pruebas y estado único |
| casa-vieja-operaciones | Sí, archivo local del proyecto por AGENTS | Leída manualmente; invariantes de diario/stock/continuidad; no prueba de selección automática |
| auditoria-software | Sí, usuario/catálogo | Leída; revisión acotada de confianza, costos, estados y riesgos del candidato; ediciones autorizadas por el prompt, no por la skill |
| desarrollo-web-comercial | Sí, usuario/catálogo | Leída; prototipo local de revisión con diseño existente, sin publicación |
| cloudflare | Sí, usuario/catálogo | No cargada: no hay cambios de Worker ni selección de producto en este sprint; se cargará antes de ese trabajo |
| esp32-automatizacion | Sí, usuario/catálogo | No cargada; no hay hardware |
| casa-vieja-tienda-astro | No encontrada en rutas revisadas/catálogo | No utilizada; lectura del sitio no requirió editar Astro |
| casa-vieja-whatsapp | No encontrada en rutas revisadas/catálogo | No utilizada; ningún envío/integración WhatsApp |
| openai-docs | Sí, sistema/catálogo | Leída; referencia oficial para distinguir descubrimiento/carga/activación, sin cambios globales |
| google-drive:google-drive | Sí, plugin/catálogo | Leída; búsqueda de referencias de catálogo, solo metadatos; no se leyeron filas de producción |

No se observaron duplicados en los seis archivos de skills de negocio/proyecto encontrados. El título prefijado del plugin y su nombre interno no son duplicados. La documentación distingue metadatos visibles y carga de instrucciones al seleccionar una skill; eso no acredita selección automática en esta sesión. [Referencia oficial](https://developers.openai.com/plugins/concepts/skills).

## P0 actuales / responsable / siguiente acción

| Condición | Estado | Responsable y acción exacta |
|---|---|---|
| Único escritor | No demostrado | Técnico + propietario: completar uso de v2/v15, copias, editores e integraciones; después autorizar contención/cierre. Matriz de 18 rutas en fase5g2/MATRIZ-ESCRITORES.csv, ninguna cerrada por este sprint |
| Censo completo | Pendiente | Propietario: salida limitada del principal Safari, perfil exacto y otros equipos; técnico: revisión individual autorizada. No inferir cero de la falta de datos |
| UNKNOWN y pendientes | Desconocidos en equipos reales | Resolver con motor original compatible y evidencia; no reenviar ni recrear como venta nueva |
| Continuidad remota e interfaz | Local probada, integración incompleta | Técnico: montar el adaptador de cola y controles de interfaz en el ámbito, probar paquete exacto en Google tras aprobación. No mezclar diario nuevo con laboratorio actual |
| Respaldo/custodia | DR sintético anterior aprobado; custodia comercial sin demostrar | Principal propietario, segundo socio; teléfono elegido. Demostrar copia cifrada/restauración allí y recuperación de cuenta/clave, con permiso de exportación específico |
| Acta física | DRAFT | Propietario y segundo revisor: pesar/contar, verificar costos/documentos, reservas, retenidos, firmas y fecha. No usar 300 kg previstos como recepción |
| Catálogo/tarifas | Fuente vigente extraída | Propietario: vigencia de noviembre y lotes aptos. Lima S/8 cobrado confirmado por fuente; costo interno, regiones y crédito/evidencia de cobros por concretar |
| Políticas restantes | Parciales | Propietario: anticipos/cancelaciones, conteos/ajustes, cuarentena/reingreso, estados de lote, recetas/costos/mermas. Usar lista 5G.2 sin volver a pedir precios ya extraídos |
| Tres perfiles y regresión del paquete exacto | Históricos aprobados; nueva versión local únicamente | Técnico + tres usuarios: Google, móvil, concurrencia, reinicio, pérdida de respuesta y cuotas del candidato final. No declarar RC por 588 pruebas locales |
| S/0 | Sin gastos/recursos nuevos | Mantener plan gratuito sin facturación; capacidad/retención/automatización futura sujetas a comprobación, nunca ampliar plan automáticamente |
| Contingencia | Modelo preparado | Detener NEW→NONE, conservar diario/colas; jamás reabrir OLD o restaurar copia antigua sobre operaciones posteriores automáticamente |
| Activación expresa | No autorizada | GO del propietario sobre versión/acta/políticas exactas y P0 cerrados; hasta entonces mantener la operación actual |

## Censo: evidencia y siguiente paso

La autorización sigue limitada a computadora principal/Safari/perfil comercial existente. Su URL fue verificada. Al cerrar preferencias Safari bloqueó AX en dos intentos, antes de introducir la sonda; Desarrollo fue restaurado y verificado 0 ambas veces. El propietario no vio un panel Inspector. No se repite el ciclo automático ni se amplía acceso a celulares.

Archivo revisado completo: `../fase5g2/census-console.js`, SHA256 `38ccbfd75a83279a1eb3849a75136c7ac0dc4d93a07d41397102f4b1b43ab035`. Solo lee dos claves, agrega estados y nombres/versiones de IndexedDB sin abrir bases. Sin red, escrituras, credenciales o comandos comerciales. Dos pruebas sintéticas de la sonda incluidas en la regresión. Procedimiento breve: `../fase5g2/CENSO-MANUAL-LIMITADO.md`. Copiar solo salida CV_5G2_CENSUS, nunca consola completa. count:null/error = desconocido; cero local no acredita todos los equipos. Recibos, último sync y endpoint siguen sin establecer.

## Respaldo elegido para preparar, sin ejecución comercial

Propietario eligió su teléfono y delegó el diseño de bajo consumo S/0. Mantener copia cifrada, clave separada y segundo custodio; falta ubicación privada concreta y prueba física. Propuesta adoptada para diseño: respaldar solo si cambió la revisión confirmada, agrupar cambios hasta una hora durante operación y al cierre; nunca un sondeo/copias por cada refresco de pantalla. Con 3–10 ventas diarias evita copias repetidas sin cambios. Transferencia al teléfono al cierre con verificación de hash, hasta demostrar automatización segura. Retención propuesta: 7 diarias, 4 semanales y 3 mensuales, sin borrados automáticos. Si falta capacidad gratuita, detener/avisar, no contratar.

Sincronización y respaldo son distintos: confirmar en el servidor permite que el otro equipo consulte cambios; no garantiza visualización instantánea sin conexión ni duplica la venta. El respaldo no rescata por sí solo una cola aún local; necesita su tratamiento autorizado. Apps Script no garantiza descargar en segundo plano al teléfono. RPO/RTO comerciales siguen sin medir; una copia horaria del servidor no acredita RPO de colas locales ni de la copia externa al teléfono. No se creó activador, carpeta, archivo remoto ni exportación comercial.

## Paquete único de acciones y aprobaciones por etapa

1. **Lectura comercial limitada:** principal ya autorizado y pendiente de salida manual. Cada celular/computadora/perfil adicional necesita identificación y autorización propia. No incluye exportar clientes, llamar endpoints, reintentar UNKNOWN o modificar colas.
2. **Decisiones comerciales:** fuente/precios conocidos; faltan vigencias, asignación de lotes, costo/envíos cotizados y reglas operativas anteriores. Versionar identidad, fecha, evidencia y hash; no recalcular pasado.
3. **Siguiente laboratorio:** paquete backend exacto local, tres pestañas propuestas TEST_ONLY_5G3_Diario/Movimientos/Verificaciones dentro de CasaVieja_Pruebas_SINTETICA existente, configuración exclusivamente ficticia y mismo endpoint firmado. No aprobado ni ejecutado. Antes de solicitar publicación: verificar código/versión remota de destino, preparar interfaz/colas y configuración completas, manifiesto de archivos, reversión compatible y comprobar pendientes. No pedir autorización general de paquete todavía incompleto.
4. **Respaldo comercial:** permiso separado de archivo, pestañas/rangos, destino del teléfono, datos, custodios y tratamiento de clave; probar custodia sin publicar secretos. Aprobar automatización o borrado como acciones separadas cuando estén concretados.
5. **Contención/corte:** primero acreditar uso/no uso de v2 y pendientes. Después aprobación específica para retirar/cambiar implementaciones y cerrar todos los escritores; no probar GET/POST de producción para demostrar exposición. Verificación de cierre sin efectos antes de activar NEW.
6. **Activación:** acta física firmada, políticas vigentes, respaldo comprobado y candidato exacto remoto/físico aprobados. Congelar commit, hashes, Worker, Apps Script, esquema, configuración/políticas, manual y contingencia. Falta todo el registro de liberación comercial; no sustituirlo por el hash local.

Procedimiento y manual por los tres roles: reutilizar fase5g2/PUBLICACION-Y-CONTINGENCIA.md con las diferencias de ámbito de este sprint. No incluir Meta Ads CSV ni CRM WhatsApp como implementados. Próxima acción técnica segura: montaje de controles y adaptador de cola separada en la interfaz autenticada del ámbito TEST_ONLY y paquete remoto concreto; próxima acción del propietario: salida del censo y decisiones pendientes. No existe corte programado ni tarea automática para el 1/11.
