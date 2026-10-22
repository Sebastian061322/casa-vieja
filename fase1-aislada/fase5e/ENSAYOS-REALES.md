# Ensayos Google y físicos — protocolo y resultados 5E

Estado actualizado: Worker 5b787b57 y Apps Script 2 publicados. Respuesta retenida, recuperación y última unidad computadora/iPhone ejecutadas y verificadas; ver tests/ack-google-5e.json y tests/concurrencia-fisica-google-5e.json. Gerente y vendedor aprobaron permisos. Restauración Google aprobada en pestañas separadas. Administrador, reinicio completo, Android, desglose correlacionado y paquete visual final siguen pendientes. El texto siguiente es el protocolo, no una declaración de que todos sus escenarios se hayan ejecutado.

Requieren publicar el paquete probado en los mismos Worker y Apps Script de laboratorio. No crear productos/recursos si existe una partida sintética con una unidad disponible; seleccionar el fixture y registrar su revisión, lote, físico y reserva antes de empezar. No usar inventarios ni clientes reales. No cancelar o borrar registros como limpieza automática.

## Dos equipos y última unidad

1. Computadora con administrador o gerente e iPhone con vendedor; perfiles separados. Actualizar y confirmar versión vigente y colas vacías en ambos. Mantener el rechazo anterior archivado.
2. Elegir exactamente el mismo resourceId de una partida existente, compatible con la misma oferta y con disponible=1. Si no existe, detener la preparación del caso y proponer un fixture controlado; no fabricar productos sin necesidad.
3. Preparar dos pedidos distintos TEST_ONLY_5E_A y TEST_ONLY_5E_B, zona válida, una bolsa, pago por definir. No registrar todavía.
4. Coordinar pulsación de Registrar una vez en cada equipo. Documentar hora y resultado sin contraseñas.
5. Comprobar en servidor: un COMMITTED, un REJECTED por stock, una sola reserva añadida, físico sin cambios y disponible=0. Verificar ambos dispositivos y repetir sincronización sin nuevos efectos. Conservar rechazo y recibos.

## Confirmación retenida por Worker

Abrir el mismo laboratorio con ?recovery=5e. Este modo no concede permisos. Armar el ensayo y registrar una sola venta TEST_ONLY_5E_ACK válida. Worker solo devuelve 503 TEST_ONLY_RESPONSE_LOST después de recibir COMMITTED de Apps Script, sin entregar el recibo comercial al navegador. La cola debe seguir PENDING.

Cerrar esa pestaña o interrumpir conexión después de observar el pendiente; no borrar almacenamiento. Reabrir mismo origen/perfil/cuenta, recuperar por status, cotejar recibo/operationId originales y comprobar un solo efecto. Repetir sincronización. Correlacionar x-cv-trace con registros sanitizados del Worker y Apps Script. No equivale a apagar internet antes de enviar. Un error real diferente no se clasifica como rechazo definitivo.

El ensayo está automatizado y comprobado en navegador localhost con backend simulado; ya se ejecutó también con Google 5E, con las limitaciones de evidencia descritas en INFORME-5E.md. Reinicio completo del navegador y latencia artificial contra proveedores también siguen pendientes. No automatizar cierres de navegadores que puedan afectar trabajo ajeno.

## Permisos en versión vigente

Repetir el ensayo ?validation=5d con cada identidad autorizada. Vendedor: sin costos, reportes financieros, cobros, lotes, users/setUser/configure ni elevación de perfil. Gerente operativo: operaciones/finanzas sin users/setUser/configure. Administrador: administrar solo lo autorizado; no modificar permisos durante pruebas negativas. La revocación se probó en 5D, pero una nueva revocación/restauración requiere el procedimiento y autorización específicos.

Confirmar que minimizar cachés gerenciales no afecta borradores ni pendientes. Verificar campos, teclado, áreas seguras, zoom y navegación en iPhone; Android sin equipo disponible queda pendiente. Una simulación responsiva no acredita Safari/iPhone ni Chrome/Android físicos.

## Medición remota

Conservar antes=observaciones 5D y obtener después=5E con mismo fixture/acción y muestras suficientes. Capturar duración completa del navegador, identityMs/signingMs/backendMs/responseParseMs del Worker, y proofMs/lockWaitMs/lockHeldMs/sheetReadMs/sheetWriteMs/sheetReadbackMs/reconstructMs/reportsMs/totalMs de Apps Script. Los tiempos de backend y lock son inclusivos: no sumar como categorías independientes. Separar arranque frío, caliente, lecturas, escrituras y errores. Los registros no contienen token, Gmail, cliente, contenido comercial ni secreto.
