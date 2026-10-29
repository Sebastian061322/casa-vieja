# Corrección acotada de catálogo y despacho — autorización pendiente

Fecha Lima: 28/10/2026. Entorno exclusivo TEST_ONLY. Costo adicional S/0.

## Paquete concreto

- Backend build/Candidate.gs: `bd4e253c9092654511935b441ff9d513b849e12d5017daf5bf62e9ca86f74f56`.
- Worker build/worker-bundle.mjs: `029871296ce23a85e36e4b1597719252371e8ae8194c73d750f679ca584de445`.
- Base activa: Worker65c061b6, Apps Script5; diario nuevo revisión4 con apertura aplicada una sola vez. No modificar apertura ni diarios.
- Publicar únicamente este ajuste y la evidencia saneada de la continuación en dev/fase1-estabilizacion. No main ni index.html productivo. Excluir private/, configuracion-para-propietario/, capturas ajenas y logs temporales.

## Cambios y límites

Contrato privado HTTP explícito conserva primero HMAC, identidad Google, permisos, ámbito y control de repetición. Hash UTF8 únicamente para catálogo; no cambia hashes de actas/recibos/movimientos. Catálogo exige configuración TEST_ONLY, aprobación sintética, habilitación y hash exactos. No se fuerza la habilitación ante discrepancias. Diagnóstico autenticado solo administrador: flags y hashes no secretos, sin clientes, costos, sujetos, claves ni propiedades ZERO.

Bloquea DISPATCH_SALE nuevo cuando queda deuda y no existe política de crédito aprobada. El backend impide eludirlo manipulando la UI. No cambia cobros ni recalcula registros previos; recupera recibos PREPARED/COMMITTED existentes. Mantiene Cancelar/Devolver sujetos a aprobación comercial.

No se ha establecido la causa definitiva del bloqueo real: configuración y versión correctas; parche y diagnóstico deben comprobarse en Google. La simulación de un digest con codificación diferente no demuestra que Google use esa codificación.

## Recursos y configuración

Actualizar exclusivamente Worker casa-vieja-lab-auth y mismo despliegue Apps Script CasaVieja_AUTH_TEST_ONLY_5D. Actualizar solamente las propiedades CV_5G4_BACKEND_SHA256 y CV_5G4_WORKER_SHA256 con los hashes anteriores, mediante campos CV dirigidos para evitar mostrar secretos. Conservar scope YES, catálogo aprobado, acta, HMAC, cuentas, OAuth y todas las tablas. Sin pestañas nuevas, nuevos recursos, pagos o cambios DR.

Verificar antes de publicar el estado de las colas usadas; conservar borradores/recibos/rechazos. Tras desplegar: verificar versiones/hashes, siete rechazos públicos, iniciar administrador y comprobar catálogo/diagnóstico. Reanudar solo los ensayos ficticios ya autorizados (tope original40 operaciones de negocio, cuatro utilizadas al corte de evidencia), conservando IDs y sin repetir apertura. No incluye datos reales ni exportación comercial.

## Evidencia y riesgo

633/633 pruebas locales,78 archivos; tests/regression.json. Seis contratos adicionales incluyen doPost, aprobación inválida, separación de perfiles, UTF8, recibos previos, firma/precio manipulados, crédito y reintentos. Navegador/IndexedDB local: catálogo14, venta22, pago22 y despacho único; tests/ui-observation.json. Google y teléfonos sobre ESTE parche todavía pendientes.

Riesgo: error de integración o bloqueo de catálogo persistente. Si falla, detener altas del ámbito y conservar diarios/colas; comparar diagnóstico. Antes de nuevos movimientos puede restituirse Worker65c061b6/Apps Script5 y ambos hashes anteriores, pero esa base conserva los defectos conocidos y no habilita operaciones. Después de nuevos movimientos usar únicamente código comprobado compatible; nunca restaurar datos antiguos ni borrar pendientes. No es una autorización de producción.

La EtapaE de la instrucción del propietario exige: «Antes de realizar cualquier cambio remoto, solicita aprobación específica sobre ese paquete completo». El paquete original31ffa448/3ca709bb no cubre estos nuevos hashes.
