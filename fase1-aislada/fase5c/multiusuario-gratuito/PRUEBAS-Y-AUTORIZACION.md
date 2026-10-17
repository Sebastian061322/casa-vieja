# Prueba de concepto S/0 y autorización pendiente

## Ejecutado

74 pruebas nuevas, más las 258 anteriores: **332 aprobadas**, cero fallos. Runtime Node con Web Crypto, claves RSA efímeras y tres sujetos ficticios. No son tokens emitidos por Google para personas reales. tests/resultados.txt es la salida reproducible.

- Firma, emisor, audiencia, sub estable, correo verificado, expiración, emisión futura, azp, algoritmo y URL de claves manipulada.
- Caché/rotación de claves públicas y fallo cerrado ante caída del servicio de claves.
- Los tres perfiles se obtienen del backend. Vendedor sin costos/utilidades, sin cobros, precios, gastos, lotes ni administración, aun mediante solicitudes directas.
- Gerente operativo con ventas, cobros, despachos, compras/proceso/preparación/gastos y reportes; sin usuarios ni configuración crítica. Administrador con cambios de usuarios versionados, idempotentes y protección del último administrador.
- Revocación inmediata aun con token válido, sin caché de roles. Auditoría conserva actor/fecha original.
- Tres peticiones concurrentes a la última unidad: una reserva y dos rechazos. No se ejecutó con tres dispositivos físicos ni tres Workers remotos.
- Desconexión, confirmación perdida y fallo parcial: cola conservada, mismo ID, un recibo y efectos únicos. Rechazo por revocación no borra la cola ni fabrica éxito. Snapshot antiguo no reemplaza recibo reciente.
- Apps Script compilado ejecutado en VM con el adaptador sintético de Sheets: verifica HMAC, caducidad/versión/destino, perfiles, revocación e ID de proyecto. No fueron escrituras contra Google real.
- El candidato solo expone zeroRequest, doPost y doGet. No incluye helpers de mantenimiento ni usa Session como identidad del operador.

## Archivos y límites

access.js contiene roles y autorización; identity.mjs verifica JWT mediante Web Crypto; worker.mjs limita origen/cuerpo y firma el puente; auth-client.mjs preserva sujeto/perfil de cola sin persistir token; apps-script/Candidate.gs es un candidato apagado; web/ contiene un portal mínimo de acceso, no sustituye la interfaz 5A. config.json mantiene enabled y realAccountsAuthorized en false. wrangler.example.jsonc no tiene cuenta, claves ni publicación autorizada. manifest.json identifica exactamente los archivos.

El candidato tiene ZERO_NOT_APPROVED_SCRIPT como ID imposible y requiere configuración adicional de aprobación. No debe pegarse encima del laboratorio existente o del productivo. Después de autorizar el proyecto nuevo habrá que incorporar SU ID al constructor y verificar que el binario sigue restringido al Sheet sintético. No se debe sustituir el ID de la hoja por producción.

El log administrativo del PoC es append-only en ScriptProperties, máximo 199 entradas por categoría y registros limitados; al llenarse falla cerrado. Para uso comercial habría que aprobar persistencia/auditoría y exportación adecuadas. Los cambios de políticas del PoC son TEST_ONLY; no aprobaron reglas comerciales anteriores. Las recetas/valores empleados son ficticios.

No se midió CPU/cuotas Cloudflare, no se completó consentimiento Google, no se certificó Gmail real, no se aprobó ni ejecutó Safari/iPhone o Chrome/Android físico. El portal no integra aún el registro completo 5A, todos los borradores offline ni su ciclo de reautenticación. Los tests de cola usan el cliente comercial existente y el transporte nuevo; no acreditan una navegación móvil completa. No se migró ninguna base.

## Reproducir sin red ni nuevos recursos

1. node fase1-aislada/fase5c/multiusuario-gratuito/build.cjs
2. node --test fase1-aislada/fase5c/multiusuario-gratuito/tests/*.test.mjs
3. Para regresión: acceptance.cjs y suites de fases previas, cierre-operativo y multiusuario-gratuito. No instalar paquetes ni ejecutar comandos de despliegue.

## Recursos que solicito aprobar antes de crear

1. Cuenta Cloudflare existente o alta Free del propietario SIN tarjeta; el usuario acepta los términos si hace falta. Un Worker Free de laboratorio con assets gratuitos, sin Workers Paid, KV, D1, Durable Objects, IA u otro servicio pagado. Verificar plan/cuenta sin facturación antes de publicar.
2. Un cliente Google OAuth web en proyecto de laboratorio sin Cloud Billing enlazado. Solo openid/email/profile para identidad; nada de acceso directo a Sheets desde el navegador. Verificar origen gratuito aceptado por Google.
3. Un Apps Script nuevo y mínimo que use Candidate.gs y únicamente la hoja sintética ya autorizada. No copiar el proyecto productivo ni modificar el privado existente.
4. Preparar un HMAC privado generado y almacenado en los almacenes de secretos del Worker y ScriptProperties, nunca en GitHub, frontend o chat.

Crear estos recursos NO autoriza todavía usar tus tres Gmail reales ni abrir acceso de red del Script. Antes de habilitar el endpoint firmado o registrar usuarios reales, mostraré la configuración exacta y solicitaré su aprobación. Si aparece tarjeta, plan de prueba con conversión, pago o billing, detener sin aceptar. El presupuesto no es “hasta S/5”: es S/0 obligatorio.

## Protocolo remoto/físico, después de las autorizaciones

- Usar tres cuentas Google de prueba individuales autorizadas por el propietario; no compartir contraseñas ni darles edición del Sheet. Registrar sub verificado y perfil server-side, sin copiar tokens.
- Gerente 1 administra; gerente 2 registra cobro/gasto y consulta finanzas pero recibe denegación en usuarios/configuración; vendedor registra pedido y stock, y recibe denegación en costos/reportes/cobros incluso con solicitud manipulada.
- Revocar vendedor conservando su sesión abierta: siguiente consulta/escritura debe ser denegada y pendientes preservados; administrador resuelve sus operaciones con identidad histórica intacta.
- En computadora y celular registrar simultáneamente una última unidad ficticia. Cortar red, recargar, renovar login y recuperar recibo original. Registrar ID, hora, dispositivo, estado y revisión; no limpiar IndexedDB.
- Safari/iPhone y Chrome/Android: botón Google fuera de iframe, permisos correctos, teclado, orientación, zoom 200 %, navegación y recuperación tras cierre de pestaña. Los tokens no deben aparecer en almacenamiento ni capturas.
- Medir CPU fría/caliente del Worker, latencia hasta Apps Script, espera del lock y cortes por cuotas. Si Free falla, conservar cola y detener; no habilitar facturación para aprobar la prueba.

Acta actual: todas las pruebas remotas y físicas anteriores PENDIENTES. No usar el despliegue antiguo para atribuir resultados a esta arquitectura.
