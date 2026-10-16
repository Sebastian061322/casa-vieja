# Identidad individual y permisos — propuesta 5C

Estado: autorización implementada y probada en laboratorio. No hay operadores habilitados ni proveedor externo desplegado. El propietario solicitó identidades ficticias por ahora.

## Frontera de autenticación

Google documenta que Session.getActiveUser().getEmail puede estar vacío al ejecutar una web app como propietario. Ejecutar como operador cambia la autoridad con la que se abre Sheets; conceder edición directa del archivo expondría costos y permitiría saltarse las reglas de la aplicación. Por tanto, no se utiliza ese supuesto para habilitar vendedores.

El acceso nativo actual sigue limitado al propietario: correo activo presente, correo efectivo y configuración del propietario coincidentes. No se concede administración cuando falta identidad. Es una vía de laboratorio, no una cuenta para compartir.

La vía multiusuario preparada es:

1. Cada persona inicia sesión en Google en un frontend autorizado.
2. Un servicio de autenticación Node verifica el ID token con google-auth-library: firma, emisor, audiencia y caducidad. Se usa el identificador estable `sub`, no un correo enviado por el navegador.
3. Ese servicio firma una solicitud con HMAC-SHA256: sujeto, acción, contenido, destino, emisión y vencimiento máximo de 60 segundos. El token Google no se guarda en la cola ni en el diario ni se entrega a Apps Script.
4. Apps Script verifica la firma antes de abrir Sheets y obtiene el perfil de una lista controlada en el servidor. Nunca utiliza un perfil enviado en el comando.
5. ScriptLock serializa la operación. El motor conserva el comando original y su fingerprint; el plan nuevo añade actor autenticado, perfil, identificador, tipo, hora del servidor y fecha declarada por el cliente. Los movimientos usan la identidad del servidor.
6. Un reintento conserva el mismo comando y operationId; puede renovar la prueba de identidad sin cambiar la operación. Una cuenta distinta no puede consultar o recuperar el recibo de otra.

`secureRequest` y `doPost` rechazan todas las pruebas mientras PHASE5C_AUTH_MODE no sea SIGNED_GATEWAY y no exista una clave válida. Esa configuración NO se activó. El despliegue publicado sigue privado y sin cambio de versión. Los helpers de ensayo no forman parte de Candidate.gs.

La prueba local usa claves RSA y HMAC efímeras generadas en memoria. Se comprueban firmas alteradas, emisor/audiencia erróneos, vencimiento, cambio de sujeto, revocación y alteración del cuerpo. Esto NO equivale a un inicio de sesión real con tres cuentas Google; dicho ensayo sigue pendiente.

## Perfiles iniciales propuestos

| Capacidad | Administrador | Ventas | Inventario |
|---|---|---|---|
| Registrar y reservar pedidos | Sí | Sí, propios, precio backend | No |
| Consultar pedidos/contactos | Todos | Solo propios | No |
| Editar contacto y cancelar reserva | Sí | Solo propios, con versión y motivo | No |
| Consultar disponibilidad | Sí | Envasados | Existencias e insumos |
| Preparar bolsas | Sí | No | Sí, receta/costo de servidor |
| Precios, costos, descuentos, compras, mermas | Sí | No | No |
| Cobros, despachos, devoluciones y reembolsos | Sí | No inicialmente | No inicialmente |
| Utilidades, reportes financieros, configuración, usuarios, respaldo | Sí | No | No |

La separación de cobros/despachos es conservadora y requiere aprobación antes de uso comercial. No existe RPC para asignarse permisos. Altas, bajas y cambios de perfil quedan en configuración del servidor, fuera del alcance de operadores. Se probó revocación de un usuario aun cuando conservaba una solicitud firmada.

Los vendedores reciben DTO por lista positiva: sus pedidos, precios de catálogo y existencias disponibles, sin diarios, costos, utilidades, autorizaciones o contactos ajenos. Inventario recibe existencias sin datos financieros ni pedidos. Ocultar elementos de menú es solo presentación; la denegación ocurre en backend. Las vistas por perfil y la identidad separada del almacenamiento están implementadas en web/role-ui.js y web/session.js.

Las colas nuevas se separan por sujeto verificado. Al cambiar de cuenta/perfil se conservan y bloquean para revisión; no se reasignan. La identidad de presentación guardada para recarga offline no concede autoridad: cada envío y consulta vuelve a comprobar la identidad del servidor. No se guardan tokens en localStorage/IndexedDB. Los borradores sí contienen contactos del propio pedido: el diseño final debe evitar equipos/perfiles compartidos, separar el origen administrativo del operativo y definir cierre de sesión/retención. Un nombre de base distinto no cifra datos ni protege frente al dueño del equipo con herramientas del navegador.

No hay reglas reales de envío o procesamiento configuradas para operadores. La ausencia de política aprobada produce SHIPPING_POLICY_REQUIRED o RECIPE_POLICY_REQUIRED. Los importes cero/100 céntimos utilizados en fixtures son exclusivamente ficticios.

## Alternativas económicas, sin recursos creados

| Alternativa | Ventaja | Costo y condición | Limitación |
|---|---|---|---|
| Apps Script nativo en un único dominio Workspace | Menos infraestructura, si el negocio ya posee ese dominio | Depende de sus licencias; no se contrató nada | Verificar identidad por cuenta en ese modo; falla cerrado si Google no la entrega. No sirve asumirlo entre cuentas Gmail externas. |
| Proxy Node con Google Identity + puente firmado a Apps Script | Reutiliza motor y Sheets; SDK oficial para verificar tokens | Cloud Run ofrece cuota gratuita y cobro por uso; cuenta de facturación y presupuesto deben aprobarse | Requiere cliente OAuth, servicio, custodia/rotación de clave, controles CSRF/sesión/rate limiting y un endpoint firmado de laboratorio autorizado. |
| Cloudflare Workers + proveedor OIDC | Plan gratuito con límites publicados; posibilidad de bajo costo | Free: 100000 solicitudes/día y 10 ms CPU por invocación según documentación consultada; plan pagado base y consumo adicionales | Validar compatibilidad del SDK/criptografía y límites; no se implementó ni se afirma equivalencia probada con Node. |

Para 3–10 ventas diarias y un escenario de tres solicitudes simultáneas, recomiendo validar primero la vía Node con SDK oficial si se usarán cuentas Google externas. No prometo factura cero: logs, compilaciones, almacenamiento y otros servicios pueden facturar aparte. No se instaló google-auth-library ni se creó proyecto, cliente OAuth, servicio, secreto o cuenta de prueba externa.

Antes de crear ese entorno: aprobar proveedor, proyecto de laboratorio separado, presupuesto/tope, cuentas de prueba y custodia de claves. Antes de ampliar acceso a un endpoint: revisión específica de permisos y rechazo de solicitudes no firmadas, protección de cuotas y pruebas reales. No se enviarán credenciales por este chat ni se almacenarán en GitHub.

Fuentes oficiales consultadas el 16/10/2026: [Session](https://developers.google.com/apps-script/reference/base/session), [modos de web app](https://developers.google.com/apps-script/guides/web), [verificación de tokens](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token), [Cloud Run](https://cloud.google.com/run/pricing), [Workers](https://developers.cloudflare.com/workers/platform/pricing/). Son restricciones y tarifas del proveedor, no una certificación de nuestra integración.
