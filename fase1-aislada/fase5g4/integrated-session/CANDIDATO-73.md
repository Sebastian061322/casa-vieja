# Candidato comercial-73 · 07/11/2026

Solo laboratorio TEST_ONLY. No autoriza producción ni despliegue. Costo adicional S/0.

## Recuperación y alcance

Copia íntegra del checkout anterior, incluidos .git y cambios sin commit, en la carpeta de trabajo `casa-vieja`. Origen conservado sin cambios. Rama dev/fase1-estabilizacion, base local/remota d50435664ecb00540d156cfd0995a12567ef8923 comprobada por git ls-remote. Main no modificado.

Entrada pública descargada sin sesión: coincidencia byte a byte con /entry.mjs de d504356 (rendimiento-72). La evidencia del 05/11 registra Worker21b70d74 y AppsScript9; hoy no se abrieron sus consolas ni se releyeron propiedades privadas. El manifiesto deployed:false del repositorio era estado de preparación, no una prueba de ausencia de despliegue.

| Área | Estado local | Pendiente remoto/comercial |
| --- | --- | --- |
| Ventas/carrito/aprobaciones | Contratos sintéticos, stock acumulado, permisos e idempotencia probados | Recorridos actuales gerente/vendedor en Google |
| Clientes | Búsqueda normalizada y recompra explícita; selección conservada con más de 100 fichas | Aceptación del propietario |
| Confirmación/sincronización | Recibo visible, estado real; selección confirmada plegada, nuevo borrador inequívoco, cola traducida | Aceptación física iPhone |
| Ads/reportes | Filtros cuenta/conjunto/anuncio, costo por conversación N/D si faltan mensajes; costo histórico desconocido N/D | Atribución verificable antes de ROAS/CPA |
| Respaldo | Cifrado grande, huella y recuperación sintética en pruebas | Recuperación del archivo remoto en destino aislado y custodia separada |

## Cambios y pruebas

Se integró el trabajo local pendiente de comercial-73. Correcciones nuevas: cliente seleccionado fuera de los primeros 100, confirmación compatible con cancelación/despacho/devolución, formulario confirmado plegable, aviso al comenzar un nuevo borrador y traducción de la cola efectivamente renderizada. Sin cambios al backend, modelos de datos o cálculos de inventario. qty ya significa disponible según la proyección del servidor; no se alteró.

Los fallos de ventas reproducidos en esta recuperación provenían de ofertas sintéticas vencidas el 31/10 contra un reloj servidor actual. Los fixtures de integración generan vigencia de ensayo hasta mañana; el helper de referencia conserva octubre por defecto. La prueba de vencimiento configura explícitamente 31/10 y sigue exigiendo PRICE_NOT_CURRENT y cero efectos el 01/11. No se amplió ninguna oferta remota ni se debilitó validación comercial. El fallo restante inicial era EPERM de loopback. La regresión reconstruye el artefacto histórico 5E en copia temporal y limita red a loopback. Resultado definitivo en ../tests/regression.json (incluye hashes del paquete integrado, no solo el antiguo build raíz).

Navegador local a 390×844: administrador registró pedido ficticio S/22, reserva y recibo, cero pendientes, búsqueda por 999-000-073 y autocompletado. Vendedor: envío offline conservó PENDING; recarga y recuperación automática confirmaron el mismo borrador, operación TEST_ONLY_5G3_bf30fed2-0afe-470c-9640-b093c58089b8, pedido future:4230997a-3d1d-4a39-a228-37a3c42906d3, total S/22, cero pendientes y stock 4→3. Pantalla final plegada y aviso nuevo borrador verificados. El último ajuste de traducción de la cola se validó sobre ambas interfaces compiladas mediante prueba automatizada. No son pruebas de iPhone físico ni Google. No se borró almacenamiento.

Compilación repetida produjo manifiesto idéntico. Escaneo de patrones de clave privada, AWS, GitHub y Slack sobre los dos artefactos: cero coincidencias; alcance limitado, no auditoría de secretos remotos.

## Paquete exacto para eventual aprobación

- Worker: integrated-session/build/worker-bundle.mjs
- SHA-256 Worker: `6514225f39bab0298dba0e88a7522acfd2c2ee3a1d61ce8c09347e8dadb40c03`
- Backend compatible, sin cambios: `e78ae2b52d54727c8e42abdbb9b8384f1c04879704ef26fc74b08160e714449f`
- Candidato: `comercial-73`; deployed:false.

Solicitar autorización específica solo para actualizar Worker casa-vieja-lab-auth y CV_5G4_WORKER_SHA256. No necesita sustituir Apps Script si su código sigue coincidiendo con el backend indicado. Antes de publicar: releer versiones/huellas reales, preservar cualquier versión más reciente y comprobar todas las colas del laboratorio. Verificar activos públicos, permisos, recibos y ambos perfiles operativos después. Reversión al Worker de d504356 (SHA6d5634525d2ff0cb7e4bcf5ea67a331a3bc28936c9a07ef7903a144fc8c6c3e2), únicamente tras contrastar base activa y compatibilidad; este cambio de UI no añade tipos de evento. No ejecutar despliegue con esta documentación como autorización.

## Transición comercial única

Usar OPERACION-Y-VALIDACION.md como procedimiento operativo, con esta secuencia de salida: (1) acta aprobada de catálogo/precios/vigencias, tarifas y costo interno; (2) conteo físico por lote/molienda, etapas, costos documentados e insumos; (3) conciliar pedidos históricos, clientes vinculados, anticipos, saldos y despachos sin modificar historia; (4) respaldo comercial cifrado recuperado en destino aislado y clave custodiada por separado; (5) censo completo de dispositivos, cuentas, orígenes, versiones, PENDING/UNKNOWN y recibos; (6) identificar todos los escritores y, con autorización de corte, drenar colas y cerrar cada escritor anterior; (7) comprobar intervalo sin escritores, aplicar apertura aprobada y habilitar un único escritor; (8) verificar primer pedido/reserva/cobro/despacho. Ante diferencias, detener nuevas escrituras, conservar comandos y conciliar antes de reabrir. Nada de esta secuencia comercial fue ejecutado. Producción continúa NO-GO.

## Revalidación del 11/11/2026 · cierre autónomo

Se detectó que el checkout anterior estaba atrasado y se recuperó `f94f19e600dead2f5ab588cb67a1a36b0033a0c8` desde la rama de desarrollo en una copia de trabajo separada `casa-vieja-cierre-final`. Los cambios locales anteriores se preservaron en `casa-vieja-checkout-5g4`; no se sobrescribieron.

Compilación repetida idéntica al commit: Worker `6514225f39bab0298dba0e88a7522acfd2c2ee3a1d61ce8c09347e8dadb40c03`, backend `e78ae2b52d54727c8e42abdbb9b8384f1c04879704ef26fc74b08160e714449f`. Regresión completa actual: **687/687, cero fallos**, 91 archivos, red de ensayo limitada a loopback. Evidencia en `../tests/regression.json`. Incluye permisos, sesiones, stock, recibos, concurrencia, descuentos, carrito, clientes, Ads, costos históricos, cifrado y recuperación sintética. No equivale a aceptación Google ni física.

La copia anterior obtuvo 653/684; se descartó como base de cierre al encontrar el commit remoto más reciente. El experimento de reloj histórico no modifica ni certifica este candidato. Las 687 pruebas finales se ejecutaron con el reloj actual y los fixtures versionados en f94f19e, sin debilitar el rechazo de precios vencidos.

Interfaz exacta consolidada abierta con gerente ficticio en `http://127.0.0.1:8823/?engine=5g4`: panel conectado, cero pendientes y formulario con cliente, Gourmet/Monte Alto/Mixto, unitario/dúo/tripack, precio y delivery. Captura `tests/comercial73-verificado.png`. El simulador necesita primero `node fase1-aislada/fase5e/build.cjs` para preparar su dependencia de pruebas; jamás publicar preview.mjs ni identidades ficticias.

Comprobación pública remota de /entry.mjs: coincide exactamente con d504356/rendimiento-72, SHA256 `63c297590c5cd9185cd1b2c13cf6561a6391e3ae9880e177a9539712123e1672`. Comercial-73 **no está desplegado**. La consola Cloudflare fue accesible; tras elegir la cuenta administradora en Google, Safari dejó de devolver ventana/estado. No se acreditaron sesión ni colas actuales; no se modificó Worker, propiedades, Apps Script o Sheets. No se solicitó al propietario repetir pasos durante este cierre.

Bloqueos restantes concretos: verificar continuidad actual y sesión autenticada antes del despliegue exacto; publicar Worker + su única propiedad de hash conservando backend9; verificar los tres perfiles y aceptar el paquete en iPhone. Para ventas reales además faltan acta vigente de catálogo/tarifas, conteo físico y costos por lote, obligaciones abiertas, custodia separada de clave, respaldo comercial y censo/cierre autorizado de escritores antiguos. Fondo y políticas no aprobadas continúan deshabilitados. No declarar implementación comercial completa ni inventar decisiones.
