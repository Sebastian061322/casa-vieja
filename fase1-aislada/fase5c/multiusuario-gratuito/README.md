# Casa Vieja · prueba de concepto multiusuario S/0

Estado: implementada y comprobada LOCALMENTE, apagada para servicios externos. **No es una activación ni una certificación de acceso Gmail real.** La nueva decisión elimina Cloud Run, Blaze y todo plan con facturación. No se creó ningún recurso externo, cuenta, secreto persistente ni despliegue. No se utilizó información comercial real.

Recomendación: Google Identity Services → Workers Free → Apps Script mínimo firmado → Sheets. Mantiene el motor comercial, idempotencia, recuperación, costos históricos y lock de Google. No migrar a Supabase por modernización. COMPARACION-S0.md compara las cuatro opciones con fuentes y limitaciones. El costo obligatorio objetivo es S/0, condicionado a mantener planes gratuitos sin facturación; no se garantiza disponibilidad ilimitada ni tarifas inmutables.

## Perfiles aplicados en el backend

- Gerente 1: administrator; operaciones comerciales, reportes, usuarios y configuración crítica.
- Gerente 2: operations; ventas/pedidos, cobros/despachos, compras/lotes/inventario/gastos y reportes. Sin usuarios, precios ni configuración crítica.
- Vendedor: seller; alta de ventas/pedidos, catálogo, stock y estados de sus propios pedidos. Sin cobros confirmados, precios arbitrarios, lotes, gastos, costos ni utilidades.

Los perfiles nunca se toman del navegador. Permisos y revocación se verifican dentro del lock por solicitud; campos de identidad/rol manipulados se rechazan. Los datos para vendedor salen por lista positiva, sin diario ni costos. La autoridad de inventario sigue en el backend. Cambiar el perfil no recalcula planes confirmados.

## Evidencia y matriz

| Comprobación | Resultado | Alcance / pendiente |
|---|---|---|
| Identidad firmada y claims | Aprobada, RSA/Web Crypto | Tres sujetos ficticios; claves efímeras de un proveedor simulado |
| Perfiles, solicitudes manipuladas, datos filtrados | Aprobada | Worker simulado y Apps Script compilado en VM |
| Cobros/compras/preparación/gastos del gerente operativo | Aprobada | Datos ficticios; configuración comercial real sin aprobar |
| Revocación y protección del último administrador | Aprobada | No se cambió ninguna cuenta real |
| Tres usuarios compiten por última unidad | Una reserva y dos rechazos | Peticiones locales concurrentes; no tres dispositivos reales |
| Desconexión, respuesta perdida, fallo parcial | Aprobada | Mismo ID, recibo y efectos únicos; cola conservada |
| Usuario/perfil cambiado con cola pendiente | Bloqueado conservando cola | No se reasigna a otra identidad |
| Regresión | 332 pruebas aprobadas: 258 previas + 74 nuevas | tests/resultados.txt; tests/evidencia.json |
| Configuración S/0 en cuentas reales | Pendiente | Aprobar recursos y verificar que no pidan tarjeta/billing |
| Google OAuth/origen HTTPS real | Pendiente | Sin cliente externo creado ni Gmail utilizado |
| Ejecución Workers Free y margen CPU 10 ms | Pendiente | No se probó runtime remoto ni cuotas reales |
| Safari/iPhone, Chrome/Android y tres cuentas reales | No ejecutado | Protocolo y autorizaciones pendientes |
| Producción, main, index original e historial | Sin cambios | No Fase 6, ni nueva publicación de Apps Script |

Los 74 casos nuevos pueden repetirse sin red externa con `node --test fase1-aislada/fase5c/multiusuario-gratuito/tests/*.test.mjs`. El contexto de Apps Script usa un adaptador sintético de Sheets, no Google real. Las pruebas previas con Google de otras fases NO se atribuyen a esta autenticación.

## Candidatos y seguridad de la entrega

Worker y Apps Script están deshabilitados por defecto. Candidate.gs exige un ID de Script aún no aprobado y solo conoce el Sheet sintético; no incluye rutas antiguas de mantenimiento. El portal de acceso es un PoC aparte y no altera la apariencia de 5A. La credencial permanece en memoria; la cola comercial conserva comandos y recibos sin tokens. No se persisten claves RSA privadas de pruebas.

El cliente OAuth/ID es público; el HMAC es secreto y nunca debe llegar al navegador o Git. El límite de tamaño de cuerpo/origen, protocolo firmado nuevo, expiración, JWKS fijo y ausencia de fallback a Session forman parte de los controles. Ni una variable Free del ejemplo ni un test local certifican el estado de facturación de una cuenta remota.

La lista administrativa del PoC está acotada y falla cerrada cuando se llena. Debe resolverse su persistencia/retención antes de uso comercial. Quedan pendientes integración completa de la nueva sesión con la UI 5A, reautenticación/borradores en navegador real, métricas del edge y revisión del endpoint firmado. Devoluciones/reembolsos y otras políticas no confirmadas permanecen fuera de esta ampliación.

## Próxima autorización necesaria

Ver PRUEBAS-Y-AUTORIZACION.md para el alcance exacto: Worker Free, cliente OAuth sin billing y Apps Script mínimo separado. No se dará acceso a las hojas a vendedores ni gerente operativo. Abrir el endpoint firmado y usar cuentas reales requerirá aprobación específica posterior. Si un alta exige pago/tarjeta o una prueba no cabe en Free, se detiene y se informa; no se contrata ni migra automáticamente.
