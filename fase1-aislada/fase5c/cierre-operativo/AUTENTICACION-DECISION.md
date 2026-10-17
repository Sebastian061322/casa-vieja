# Decisión de autenticación — pendiente de aprobación

Recomendación para tres personas y 3–10 ventas/día: Google Identity Services + un puente Node en Cloud Run con mínimo cero y facturación por solicitud. El motor idempotente de Apps Script y Sheets se conserva. No se creó ningún recurso ni se habilitó cuenta real. La configuración externa sigue apagada.

| Alternativa | Costo mensual orientativo | Mantenimiento y celular | Decisión |
|---|---|---|---|
| Apps Script nativo, dominio Workspace existente | Sin infraestructura adicional si ya hay licencias; contratar Starter desde precio público regular US$7/usuario/mes con compromiso anual: tres ≈US$21 más impuestos/dominio; cotizar Perú antes de contratar | Login Google sencillo; hay que probar que la identidad real llega en el modo de ejecución elegido sin dar acceso directo a Sheets | Usar solo si ya tienen dominio y la prueba lo confirma. No comprar licencias solo por suponer que resuelve Session. |
| Google Identity + Cloud Run bajo demanda | Sin servidor mensual permanente. Cómputo puede quedar dentro de cuota gratuita; no se garantiza costo cero. Objetivo inicial de presupuesto a aprobar US$0–5/mes, no cotización ni tope automático | SDK oficial Node, login Google desde navegador móvil; mantener dependencias, sesión, claves y monitoreo | Recomendada por compatibilidad con broker.cjs existente y menor cambio del motor. |
| Workers + OIDC | Free 100000 solicitudes/día, 10 ms CPU; Paid desde US$5/mes más consumo | Sin servidor permanente; requiere validar biblioteca OIDC, criptografía y límites del runtime | Alternativa si se prioriza no habilitar facturación Google; todavía no está implementada ni validada. |

Los precios consultados el 16/10/2026 son USD, dependen de región/plan/impuestos y no son contratación. Workspace: [precio oficial](https://workspace.google.com/pricing.html). Cloud Run: [cuota y tarifas](https://cloud.google.com/run/pricing), [mínimo de instancias](https://docs.cloud.google.com/run/docs/configuring/min-instances). Workers: [límites y precios](https://developers.cloudflare.com/workers/platform/pricing/).

Para dimensionar, ejemplo ficticio de 10000 solicitudes/mes × 5 s × 1 vCPU = 50000 vCPU-s; memoria 0,5 GiB = 25000 GiB-s. Estaría bajo los umbrales gratuitos publicados de Cloud Run por solicitud (180000 vCPU-s, 360000 GiB-s, 2 millones de solicitudes), si la cuenta no los consumió en otros proyectos. No incluye compilaciones, logs, secretos, red u otros productos. Configurar alertas y límites de instancias; una alerta de presupuesto NO corta el gasto automáticamente. No habilitar facturación ni planes pagos sin aprobación.

## Recursos concretos propuestos para aprobar, todavía no creados

1. Proyecto Google Cloud de laboratorio separado, cliente OAuth web en modo pruebas con tres cuentas de prueba indicadas por el propietario. No crear cuentas personales por cuenta del usuario.
2. Servicio Cloud Run de laboratorio: mínimo 0, máximo inicial 1, concurrencia 3, facturación por solicitud. Máximo 1 no sustituye el lock transaccional de Apps Script. Sin dominio pagado.
3. Nuevo proyecto Apps Script mínimo con Candidate.gs, conectado EXCLUSIVAMENTE a la hoja sintética ya autorizada. No publicar las funciones de mantenimiento del proyecto actual.
4. Endpoint de ese proyecto accesible por red para que Cloud Run lo invoque, pero cada petición autenticada con HMAC antes de leer Sheets. Este acceso es una ampliación de superficie de seguridad que necesita aprobación específica. El despliegue privado actual queda Solo yo. Nunca compartir la hoja con operadores.
5. Secreto largo fuera del repositorio y del navegador, custodia y rotación; no solicitar contraseñas por chat. Aprobar mecanismo de custodia y eventual costo antes de crearlo.

La aprobación de la arquitectura no autoriza todavía abrir el endpoint ni conceder permisos. Revisar configuración exacta y pruebas negativas antes de cada ampliación sensible. Rechazar identidad ausente, tokens inválidos, audiencia/emisor equivocados, cuentas no permitidas y sujetos revocados; registrar sub estable, rol vigente, hora de servidor y operationId. No depender del correo declarado por el navegador. [Restricciones Session](https://developers.google.com/apps-script/reference/base/session), [verificación oficial de ID token](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token).

Faltan el servicio HTTP real (cookies seguras/sesiones, CSRF, límites de cuerpo/rate limit, rutas y errores sin secretos), la integración de login frontend y pruebas con cuentas reales, incluidos Safari y Chrome móviles. El broker preparado es una pieza, no ese servicio completo. Si el propietario prefiere no crear recursos ahora, se mantiene el laboratorio privado para el administrador y NO se da por resuelto multiusuario.
