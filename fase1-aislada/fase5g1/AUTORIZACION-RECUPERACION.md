# Paquete 5G.1 — autorizado por el propietario, solo destino DR

Base confirmada: 4731cabf36eb8471b0c25354a75f47f879f9d583. Propietario autorizó el paquete exacto y sus acciones el 24/10/2026. La configuración está en curso; restauración real todavía no validada.

## Recursos exactos, ya existentes

- Hoja privada CasaVieja_RECUPERACION_TEST_ONLY_5G: `1d-DLDxHdOBRJMT9JFtATNuvStu3NCw9qVtw3y8xJSGo`.
- Script CasaVieja_DR_TEST_ONLY_5G: `1Cd6xNhxaLwbtzP50-amfkBlYizFmoG0ifR4X6ZyB9KFGfiEYKTTErgLC`.
- Worker Free casa-vieja-dr-test-only-5g: `https://casa-vieja-dr-test-only-5g.portopelaez1009.workers.dev`.
- Identidad: proyecto existente Casa Vieja Lab Auth, cliente web existente Casa Vieja Lab Web. Añadir exclusivamente ese origen HTTPS. Solo openid/email/profile y las mismas tres cuentas de laboratorio ya autorizadas, con los mismos tres perfiles. Sin usuarios nuevos ni acceso directo a Sheets.

## Acciones solicitadas conjuntamente

1. Publicar exclusivamente fase1-aislada/fase5g1 en dev/fase1-estabilizacion, excluyendo private/ y evidencia-local/. Sin main ni archivos de fases anteriores.
2. Configurar Control!B3 TEST_ONLY y crear solo RestoreInput, DiarioInventarioV3, MovimientosInventarioV3 y VerificacionesInventarioV3 en la hoja DR. Materializar el archivo sintético privado: 38 registros de diario y 40 movimientos, con una confirmación perdida, un REJECTED y un PREPARED con un efecto parcial. No es una copia del estado actual del laboratorio ni de producción: es un escenario nuevo creado localmente con el motor 5G y los subjects verificados de las cuentas de prueba. No se cambia la identidad de registros existentes.
3. Guardar el backend fijado por hash en el Script DR. Crear su primer despliegue web, ejecutar como propietario y acceso de red Cualquiera, firmado mediante una clave HMAC NUEVA exclusiva de DR. El endpoint devuelto por Google se comprobará contra este proyecto antes de conectarlo al Worker; no se permite usar el endpoint original. Autorizar Sheets para este Script si Google lo solicita: Google concede ver/editar/crear/borrar todas las hojas de la cuenta; el código está restringido exclusivamente al ID y nombre de la hoja DR. No tiene funciones de borrado ni mantenimiento público. El propietario completa personalmente consentimiento y entrada de la clave en ambos formularios.
4. Añadir el origen exacto DR al cliente OAuth existente. Guardar la nueva clave directamente, nunca en chat, GitHub ni el archivo de respaldo. No reutilizar ni leer la clave del laboratorio original.
5. Publicar el Worker fijado por hash en el recurso DR existente. Mantenerlo bloqueado hasta hash completo, configuración privada y pruebas de rechazo. Configurar su URL de backend y flags de entorno exclusivamente para DR, sin KV/D1, tarjeta, facturación ni servicios nuevos.
6. Ejecutar restauración con interrupción/reanudación, tres accesos individuales, denegaciones, recibo perdido, recuperación del PREPARED por su actor original, rechazo de comandos del origen, reintentos y proyección por lote/costo. Desactivar temporalmente solo al vendedor DR para probar rechazo y restaurar su mismo perfil; no cambiar la cuenta del laboratorio original. El propietario realiza Touch ID/contraseña/OTP si Google los pide.

## Artefactos congelados

| Archivo | SHA256 de bytes |
|---|---|
| build/Candidate.gs | f5a9b7ada394cb2a138701bf921903072efb823a8e7f058241955d580ea17b60 |
| build/worker-bundle.mjs | 9ac92655e66705f83b0f9267e62dd0663b9171e397902f85464c0167fe756561 |
| build/schema.json | ea8ff695c207e216a54d8cf06871c01e1680b0490e2a04a00b252e487f5481ac |
| Archivo sintético privado, hash canónico | 7fd9f9a9a981b8478272cfb7f23ac21d0f28e118386ea9db4b919fc375f552d1 |

El catálogo y el archivo privado no se publican. verify-archive.py confirmó el hash de forma independiente del generador JavaScript. Los archivos de código dentro del archivo sintético incluyen sus hashes; no incluyen secretos. La custodia local de estos dos archivos no equivale todavía a custodia independiente del propietario.

## Costos, riesgos y detención

Costo adicional autorizado: S/0. Usar únicamente Free y Apps Script existente; detenerse ante tarjeta, facturación o servicio de pago.

Riesgos: permiso Google amplio aunque el código limite el destino; endpoint de red público expuesto a consumo de cuotas; errores de restauración; acceso indebido si se compromete la nueva clave; dependencia de Google y Cloudflare sin SLA pagado. El vendedor seguirá sin acceso directo a la hoja ni a costos/reportes. El archivo privado contiene identificadores de cuentas de prueba, nunca clientes reales.

Reversión segura: ZERO_LAB_ENABLED=NO y DR_RELEASE_ENABLED distinto de YES, o volver al Worker cerrado 47610702-3eca-4778-8604-51a43d518a13; desactivar únicamente el despliegue DR y retirar el origen OAuth añadido si corresponde. Conservar los datos parciales INCOMPLETE, colas y evidencias; no borrarlos ni reponer un respaldo anterior sobre operaciones posteriores. No tocar el Worker, Script o hoja del laboratorio original ni producción.

Esta solicitud no autoriza inspección productiva, corte, lanzamiento, cambios comerciales ni actas de apertura. Cualquier cambio de paquete o alcance requiere revisar la aprobación antes de publicarlo.

## Medición y aceptación

Registrar tiempo de carga, materialización, reanudación, configuración manual de identidad/clave, primer bootstrap, primer snapshot y recuperación de recibos. RTO de servicio: inicio del ensayo hasta primer servicio recuperado verificado, identificando por separado esperas manuales. RPO: revisión y operaciones realmente incluidas en este archivo; no es RPO comercial, ni garantiza cero pérdida de comandos que solo existan en un dispositivo sin copia.

Resultado remoto actual: NO EJECUTADO. La aprobación de pruebas locales no cierra la recuperación integral.
