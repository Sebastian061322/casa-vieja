# Paquete exacto para aprobación — Fase 5G.4

**Preparado y validado localmente; todavía NO desplegado.** La sección 7/Etapa E de la instrucción 5G.4 exige: «Antes de realizar cualquier cambio remoto, solicita aprobación específica sobre ese paquete completo». Esta solicitud no proviene de una restricción inventada ni requiere acceso a producción.

## Identificación y evidencia

- Consolidación anterior ya publicada: a6e1fe88323615010383a3c4fd2129f184235b57 en dev/fase1-estabilizacion. Archivos 5G.4 aún locales, sin commit remoto nuevo.
- Backend build/Candidate.gs: SHA256 **31ffa448d69ab99c093cd203da2df7d0a5105967a0ba8c0c627d003549be3cfc**.
- Worker build/worker-bundle.mjs: SHA256 **3ca709bb257dabaf0e9edbf4dff40d438a653558ec93995cea6e0071e7c5a128**.
- Configuración build/lab-config.json: SHA256 **79cd7460836a56def08508c5d48ccbd566b696e321806e6128c5e946e24df9da**.
- Manifiesto build/package-manifest.json, 26 archivos de código/configuración/pruebas: SHA256 **777b3facf5647e109ffd2ab73d26f5fc05e1d2c95540b19cb3b714f43bcb84ed**. Documentos e imágenes son evidencia separada; no incluyen claves.
- Regresión completa: 627/627, 77 archivos de pruebas, cero fallos; tests/regression.json. Evidencia de navegador/IndexedDB: tests/ui-observation.json. No es certificación remota ni física.

## Destinos existentes y acciones propuestas

1. Publicar solo fase1-aislada/fase5g4 y sus documentos/pruebas pertinentes en la rama de desarrollo. Excluir private, claves, regresión de texto y archivos temporales. Verificar commit por lectura GitHub. No cambiar main ni index.html productivo.
2. Actualizar el código del Worker **casa-vieja-lab-auth** con el archivo exacto anterior. Mismo dominio/origen, cuenta/plan Free y cliente Google. Mismo secreto HMAC y tres cuentas/perfiles autorizados. Conservar modo anterior por defecto; nuevo ensayo solo con **?engine=5g4**. No crea Worker, KV, D1 ni facturación.
3. Guardar backend exacto en **CasaVieja_AUTH_TEST_ONLY_5D**, proyecto **1m79GZ0TkADVZuji4E1XFnPmdMCAHCWI-FRZvawkx9vGnxzmao0NfPki3**; nueva versión de la misma implementación. Conservar como propietario/Cualquiera, endpoint firmado y alcance OAuth ya existente. No crear implementación nueva, abrir propiedades de secretos ni ampliar accesos.
4. Únicamente en **CasaVieja_Pruebas_SINTETICA**, ID **1CtK6KD995Pu2Fzc_na89Ajc0KQ0QLuGq3UFhj4UdLSA**: crear tres pestañas inexistentes **TEST_ONLY_5G3_Diario**, **TEST_ONLY_5G3_Movimientos**, **TEST_ONLY_5G3_Verificaciones**, cada una 1000 filas×3 columnas, cabecera **ID / Tipo / JSON**. Sin borrar/copiar/reescribir las diez pestañas anteriores.
5. Configurar las seis propiedades CV_* incluidas en lab-config.json: interruptor inicial NO, continuidad, propuesta de apertura, catálogo y hashes del código; habilitar ámbito YES solo al comprobar encabezados/paquete. El mayor valor tiene 4134 bytes. Conservar configuración ZERO, secretos y usuarios; los nonces/recibos del protocolo sí evolucionan normalmente al ensayar. No abrir valores privados para copiarlos.
6. Ejecutar exclusivamente ensayos ficticios acotados (hasta 40 comandos comerciales distintos; consultas/reintentos adicionales del mismo ID): dos revisiones autenticadas y autorización, una apertura de cuatro recursos/tres obligaciones, ventas simples/Tripack/mixto, última unidad, cobro/despacho, gasto, procesamiento/merma/insumos, continuidad, recuperación y consultas de perfiles. Comparar efectos/recibos y medir tiempos. No inventar aceptación por usuario/dispositivo: asistencia personal para Google/biometría y pruebas físicas se registra como tal. No revocar cuentas ni cambiar permisos en este paquete.
7. Preparar un respaldo cifrado exclusivamente de este diario sintético y verificarlo en teléfono con intervención personal del propietario; la clave se descarga/introduce personalmente y no se envía al chat. No exportar/custodiar producción, ni restaurar en otro recurso no aprobado. La restauración de este formato ya se ensayó localmente; un nuevo ensayo remoto de restauración requerirá fijar destino/alcance antes de escribir.

La vigencia del catálogo de ensayo es 28–31/10/2026. NO aprueba ofertas/políticas de noviembre ni las extiende por fecha. El acta es un escenario ficticio; no migra pedidos reales ni recibe 300 kg estimados. No modifica recursos DR.

## Preflight comprobado solo por lectura

Worker actual 7c1806c8/100% Ready, fuente b350fe05fadd3cdc72b7b8c17637674bbc53fe84bde462dd19f47941dc5b1676; Apps Script versión4, fuente 0a64a97eabf93224e407de9f491c4b8c757d5742edb7ad1db5f42d0e8b8df604. Cloudflare Free/Current plan. Hoja sintética identifica TEST_ONLY, diez pestañas y ninguna de las tres nuevas. Revalidar antes de escribir: si hay divergencia, detener y comparar, no sobrescribir trabajo posterior.

## Riesgos y contención

Costo adicional S/0, sin tarjetas, suscripciones, recursos o privilegios nuevos. Servicios gratuitos conservan cuotas y carecen de garantía de disponibilidad. La latencia Google de este paquete todavía no está medida. El endpoint de red sigue público con HMAC/identidad/permisos, sujeto a consumo de cuotas externo. Los respaldos manuales no garantizan RPO automático y no contienen pendientes locales de otros equipos.

Antes de actualizar, confirmar cero pendientes por cuenta/origen/equipo en laboratorio; conservar borradores/recibos/rechazos. Registrar revisión y versiones actuales. Publicar backend compatible primero, comprobar rechazos, instalar esquema/configuración con ámbito apagado, publicar Worker, comprobar hashes públicos y activar exclusivamente nuevo ensayo. Iniciar revisiones/apertura solo con aprobación de este paquete.

Si falla antes de operaciones nuevas, desactivar ámbito y volver a las versiones comprobadas sin borrar datos. Si hay operaciones nuevas, detener admisiones del nuevo ámbito (CV_5G3_SCOPE_ENABLED=NO), conservar diario/colas y código compatible; corregir hacia adelante. No degradar a un motor incapaz de leer los nuevos registros, restaurar copias antiguas o borrar pestañas. No reabrir escritor comercial antiguo ni tocar producción.

**Aprobación solicitada:** publicar este paquete exacto en desarrollo y actualizar únicamente los dos servicios y la hoja sintética descritos, con sus ensayos ficticios. No incluye activación comercial, corte, modificación del historial, nuevas cuentas o recursos.
