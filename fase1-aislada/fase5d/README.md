### Corrección posterior del acceso Google

Se reprodujo GOOGLE_IDENTITY_UNAVAILABLE en el Worker real usando una firma ficticia inválida, sin credenciales de usuario. Se sustituyó el modo redirect:error de la consulta fija de certificados Google por redirect:manual, rechazando cualquier respuesta no exitosa sin seguir redirecciones. El mismo ensayo remoto cambió de 503/GOOGLE_IDENTITY_UNAVAILABLE a 401/IDENTITY_REQUIRED: el verificador ya llega a rechazar la firma inválida. El resto de cambios en esa rutina solo clasifica excepciones en códigos fijos, sin publicar mensajes internos.

24 pruebas específicas aprobadas tras esta corrección; la regresión completa previa fue de 354. No se repitió aún la regresión completa. Se inició otro ingreso administrador real; falta observar su confirmación porque Safari deja de responder a la automatización al cerrar OAuth. No confundir el rechazo correcto de una firma inválida con la aprobación del acceso real.

## Estado verificado — 21 de octubre de 2026

El Worker autorizado ya sirve la interfaz 5A.2 y el acceso Google. El Apps Script nuevo tiene implementación web versión 1 ejecutada por el propietario, con acceso de red Cualquiera y controles HMAC en el código. Se comprobaron tres usuarios OAuth de prueba; los correos y sus vínculos iniciales permanecen exclusivamente en configuración privada.

El GET público del backend devuelve TEST_ONLY / AUTHENTICATED_POST_REQUIRED. El GET directo de /api del Worker devuelve ORIGIN_DENIED. La interfaz sin sesión muestra el botón Google y oculta los datos. Se seleccionó la cuenta administradora autorizada y se continuó el consentimiento de identidad básica, pero Safari dejó de responder al cerrar la ventana OAuth: la confirmación del backend NO está verificada. No declarar validado el acceso real todavía.

Se ejecutaron 22 pruebas específicas de 5D, todas aprobadas. La regresión previa completa suma 354 pruebas locales aprobadas; no equivale a 354 pruebas con Google. La interfaz local con identidades ficticias permitió registrar pedido, cobrar, despachar y consultar el estado desde vendedor sin costos internos. Falta repetir ese flujo contra Google, comprobar las otras identidades, revocación real, rendimiento del Worker con JWT y equipos físicos.

Los indicadores realAccountsEnabled y signedBackendEnabled describen la configuración de laboratorio habilitada, no una certificación del recorrido completo. productionEnabled sigue false. No se modificaron producción ni historial. No se habilitó facturación, tarjeta, KV ni D1.

Continuidad: también se detectan colas administrativas adminQueue5d pendientes, sin borrarlas. Los cambios de permisos conservan operationId y recuperan el recibo tras una respuesta perdida. La interfaz administrativa aún necesita prueba real.

### Continuación necesaria

1. Recuperar lectura de Safari y comprobar si el inicio Google terminó o qué error muestra.
2. Confirmar bootstrap, perfil y snapshot por el puente Worker → Apps Script → hoja sintética.
3. Probar ventas ficticias, rechazos por perfil, reintentos, concurrencia y revocación.
4. Medir latencia/CPU reales; el dato anterior de 1 ms correspondía al Worker cerrado, no al flujo con JWT.
5. Ejecutar protocolo físico con intervención del propietario. Mantener NO-GO para producción y Fase 6.

---

# Fase 5D — avance verificable de infraestructura

Fecha de inspección: 20 de octubre de 2026, America/Lima. **Fase en ejecución; NO-GO para Fase 6.**

Se continuó desde `779381b014db806f1fc8d6e81fd756fb90ee6b83`, posterior al cierre `d2687de4fea1a659e5c4767f0770272bd2eaf315`. Se conservan los paquetes previos y no se modifican `main`, el HTML productivo, Apps Script productivo, hojas ni históricos comerciales.

## Estado real

| Elemento | Evidencia y resultado |
|---|---|
| Cuenta Cloudflare | Workers & Pages accesible; antes de esta ejecución indicaba que no había proyectos. |
| Plan y pagos | Workers Free figura como plan actual y suscripción activa. Billing indica que no hay medio de pago registrado. No se agregó ninguno. |
| Límites visibles | 100 000 solicitudes/día, 10 ms CPU/solicitud, 50 subsolicitudes por petición. No son recursos ilimitados. |
| Worker autorizado | `casa-vieja-lab-auth`; nombre disponible en el formulario, creación confirmada. URL: https://casa-vieja-lab-auth.portopelaez1009.workers.dev |
| Estado desplegado | Versión corta `891eeeb1`: `closed-worker.mjs`. Sin conexión a Google, sin secreto, sin datos y sin operaciones. La plantilla inicial fue sustituida inmediatamente. |
| Prueba remota | GET `/api` desde el panel HTTP del Worker devolvió 503, `CONFIGURATION_PENDING`, `operationsEnabled:false`, `LAB_NOT_APPROVED`, `retryable:true`; `cache-control:no-store`, CSP `default-src 'none'; frame-ancestors 'none'`. No acredita autenticación ni flujo comercial. |
| Almacenamiento adicional | Sin KV, D1, Durable Objects ni bindings. No se conectó GitHub al panel. |
| Google Cloud | Los proyectos encontrados inicialmente correspondían a n8n y se mantuvieron intactos. Con autorización específica se creó `casa-vieja-lab-auth-20261020` / Casa Vieja Lab Auth. |
| Facturación Google | El panel del proyecto nuevo confirmó que no tiene cuenta de facturación vinculada. No se activó prueba gratuita ni servicios de pago. |
| Consentimiento | Se configuró la aplicación Casa Vieja Lab Auth, externa, modo Testing. La aceptación de Google API Services User Data Policy fue autorizada por separado en el momento de realizarla. |
| Cliente OAuth | Se creó Casa Vieja Lab Web, aplicación web, con el único origen HTTPS del Worker. Google aceptó el origen. ID público en CONFIGURACION-PROPUESTA.json; no se descargó JSON de credenciales ni se guardó el secreto del cliente. Google Identity en el navegador no requiere ese secreto. |
| Usuarios reales | El propietario proporcionó tres cuentas por perfil. La última lectura confirmada fue 0 usuarios, antes del intento de guardar la primera; falta verificar persistencia de esa lista. No hay roles backend reales habilitados ni login acreditado. |
| Backend nuevo | Se creó y guardó, con autorización específica, CasaVieja_AUTH_TEST_ONLY_5D. La recarga del editor confirmó persistencia y guardas de Script/Sheet. No se ejecutó ni desplegó. El endpoint firmado y su secreto fueron autorizados después, pero siguen pendientes de configuración y prueba. |
| Pruebas | 332 anteriores + 12 nuevas = 344 locales aprobadas, cero fallos. RSA/JWT y Sheets usan adaptadores sintéticos; no equivalen a login real ni a escrituras remotas. |

La palabra «production» en la ruta interna del panel del Worker designa el entorno predeterminado de **ese servicio de laboratorio**. No se publicó ni se modificó la plataforma comercial de Casa Vieja.

## Correcciones implementadas en el candidato local

1. **Alta — repetición de transporte:** `Replay.gs` conserva nonces vigentes en ScriptProperties dentro del ScriptLock. Rechaza el mismo mensaje firmado; volver a intentar la operación exige un nonce nuevo y conserva su operationId. Se comprueba nuevamente vigencia después de adquirir el bloqueo. La lectura de permisos actuales precede a la escritura del nonce.
2. **Alta — identificador utilizado por otra persona:** el constructor añade comprobación de identidad del responsable para cualquier perfil antes de ejecutar de nuevo un ID existente. La operación y su auditoría no cambian. No impide que un gerente gestione un pedido ajeno mediante una operación nueva autorizada.
3. **Alta — respuestas tardías tras logout/cambio de cuenta:** `web/session.mjs` invalida la generación de sesión y descarta respuestas en tránsito. Credenciales solo en memoria; no elimina colas, recibos ni IndexedDB. Se revalida perfil antes de transmitir comandos.

La ventana antirrepetición admite 64 peticiones activas y hasta 7 500 caracteres; al llenarse falla cerrada. Solo expira metadatos de transporte de 30 segundos. No elimina información comercial. Falta medir y ajustar esta capacidad con el patrón real de llamadas del dashboard, sin aumentar permisos ni contratar almacenamiento.

`build.cjs` toma el Candidate.gs probado de la fase anterior y añade cambios estrictamente identificados. Si cambia la base, exige revisión. Genera `apps-script/Candidate.gs`, ignorado en Git por ser reproducible. Mantiene exclusivamente `zeroRequest`, `doPost`, `doGet` públicos; conserva por defecto el ID imposible `ZERO_NOT_APPROVED_SCRIPT` y los interruptores apagados. La opción `--authorized-script` compila exclusivamente el ID del Script nuevo autorizado. Se retiró la función privada heredada que consultaba Session; el manifiesto propuesto solicita solo Sheets y aún debe guardarse en el recurso remoto. **No pegar este candidato encima del laboratorio completo ni en producción.**

## Pendientes para terminar 5D

| Prioridad | Condición pendiente |
|---|---|
| P0 | Completar configuración del Script mínimo ya creado. Constructor `--authorized-script` enlazado a su ID; las guardas de Script/Sheet se verificaron tras recarga. |
| P0 | El endpoint firmado y el HMAC ya fueron autorizados específicamente. Falta que el propietario introduzca la credencial directamente, luego configurar y probar el despliegue. |
| P0 | Se proporcionaron tres Gmail por perfil. Falta verificar la persistencia de la lista OAuth, enlazar sujetos Google verificados a sus perfiles en backend y comprobar revocación real. No basta el correo declarado por el navegador. |
| P0 | Integrar la sesión nueva con la interfaz 5A/5A.2, conservando dashboard y formularios, y limitar datos/funciones por perfil. El portal mínimo de 5C no sustituye esta integración. El Worker cerrado actual tampoco es la aplicación final. |
| P0 | Validar continuidad por identidad/origen, borradores, perfiles modificados y confirmaciones perdidas desde la interfaz integrada. No migrar colas de motores incompatibles. |
| P0 | Ejecutar OAuth/JWT reales → Worker → Apps Script → Sheet sintético. Las pruebas locales no cierran este bloqueo. |
| P1 | Medir CPU fría/caliente y latencias con muestras suficientes. Las métricas iniciales no sirven para afirmar capacidad comercial. |
| P1 | Ejecutar pruebas físicas en computadora/celular, segunda cuenta gerente y vendedor, última unidad, desconexión y regreso. Sin evidencia no se aprueban. |

Permanecen bloqueados reembolsos, devoluciones físicas y reglas comerciales no aprobadas. Se conserva la matriz de perfiles de multiusuario-gratuito/access.js: administrador, gerente operativo, vendedor; las restricciones se verifican en backend.

No se realizó copia de producción ni acceso a clientes reales. Ningún resultado de este avance autoriza el corte comercial.

## Reproducir

Desde la raíz del repositorio:

```
node fase1-aislada/fase5d/build.cjs
node --test fase1-aislada/fase5d/tests/*.test.mjs
```

La regresión ejecutada incorpora acceptance.cjs, las suites de Fases 2, 3, 4, 5A, refinamiento 5A.2, 5B, 5C, cierre-operativo, multiusuario-gratuito y 5D. `tests/evidencia.json` identifica alcance y artefactos. Las capturas locales de paneles se excluyen del repositorio para evitar divulgar datos de cuenta.

Fuentes técnicas consultadas: [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [configurar Google Identity](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid), [validar ID tokens](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token). Las condiciones particulares de plan, pagos y proyectos se leyeron en la cuenta real; no se dedujeron de esas páginas generales.

## Punto de continuación

Se autorizó crear el Script separado, registrar el secreto y preparar su endpoint público firmado. El Script se creó y guardó sin ejecución ni despliegue. El propietario pidió ayuda para generar la clave: se generó con 32 bytes criptográficos (64 caracteres hexadecimales), exclusivamente en un archivo local privado fuera del repositorio, con permisos 0600. El contenido no se leyó ni se imprimió. El propietario debe introducirla directamente en ambos formularios y cerrarlos antes de reanudar la automatización. Esta autorización no habilitó producción.
