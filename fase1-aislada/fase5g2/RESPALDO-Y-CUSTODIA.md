# Respaldo operativo — propuesta S/0, pendiente de aprobación

No se copió producción ni se repitió la restauración remota DR ya aprobada. El nuevo ensayo se limita al módulo local de continuidad, que sí cambió.

## Decisiones del propietario

| Campo | Propuesta para aprobar, no configuración aplicada |
|---|---|
| Custodio principal | Confirmado por propietario: él mismo, gerente principal |
| Segundo custodio | Designado por propietario: su socio; identidad operativa y entrega verificable por completar, sin conceder accesos todavía |
| Ubicación independiente | Opciones indicadas por propietario: teléfono u otra laptop de trabajo. Falta fijar dispositivo/carpeta privada exactos y demostrar recuperación allí; siempre copia cifrada, no enlace público |
| Frecuencia | Propuesta: cada hora de operación, cierre diario y antes/después de cambios críticos. Automatización pendiente de diseño/autorización y cuotas |
| Retención | Propuesta: 7 diarias, 4 semanales, 3 mensuales. Ningún borrado automático hasta aprobación separada |
| RPO objetivo | Propuesto: como máximo una hora desde el último respaldo íntegro durante operación, sujeto a automatización, alertas y pruebas. No medido en producción |
| RTO objetivo | Propuesto: servicio operativo verificable en hasta 4 horas, sujeto a custodios/cuentas/secretos disponibles. No acreditado por la prueba local ni por 58 s de restauración de datos |
| Simulacro | Propuesta: antes de activar y después de cambios relevantes; periodicidad por aprobar |

S/0 significa usar recursos gratuitos ya autorizados y su capacidad disponible. No se contrataron planes, agregaron tarjetas ni habilitaron facturación. Si la capacidad o cuota gratuita disponible resulta insuficiente, detener el proceso y replantear frecuencia/retención; no ampliar un plan automáticamente. No se creó carpeta/archivo remoto ni activador.

## Contenido y protección

Respaldo del diario, movimientos, configuración/políticas/versiones, referencias de obligaciones, apertura, costos, recibos/pending metadata y hashes de código/esquema. Secretos y tokens se excluyen. Las colas de cada navegador necesitan respaldo/autorización propios; copiar Sheets no copia IndexedDB ni localStorage.

`backup.cjs` empaqueta exclusivamente TEST_ONLY, verifica huellas de comandos y efectos, rechaza credenciales por nombre de campo y usa AES-256-GCM con IV aleatorio y autenticación. La clave se recibe aparte y no se incluye en el archivo, GitHub o salida. La detección por nombre de campo no es un escáner infalible de datos privados: la prueba usa únicamente fixtures ficticios, y no autoriza aplicar este helper a producción.

Guardar catálogo de hashes independiente del archivo; restaurar exige expectedHash además de hashes interiores. Custodiar la clave fuera del respaldo, en medios privados acordados por el propietario. No pedir ni pegar contraseñas, códigos de recuperación, llaves HMAC o claves de cifrado en el chat. La recuperación de cuenta Google se realizará por el propietario con los mecanismos oficiales y factores que él configure; no se cambiaron permisos ni recuperación de cuentas.

## Demostración ejecutada

Pruebas locales: cifrado a archivo temporal; verificación en otro proceso Node mediante clave ficticia enviada por stdin sin imprimirla; rechazo de clave/archivo alterados; interrupción INCOMPLETE y reanudación; prefijos/configuración divergentes rechazados; copia antigua sobre datos nuevos rechazada; PREPARED parcial recuperado con el ID original. La barrera requireReady debe usarse por el adaptador antes de servir un almacén en restauración.

Otro proceso no equivale a otro equipo o custodio. La ubicación temporal está en esta misma computadora, no es custodia independiente. No se ha demostrado RPO/RTO comercial ni pérdida total del equipo propietario. El ensayo de 5G.1 restauró un escenario sintético nuevo, no una copia de la base viva.

## Restauración futura

Solo con escritor cerrado y destino vacío/autorizado: comprobar versión y hash independiente, credencial por canal privado, estructura/configuración compatibles; restaurar con prefijos y marca INCOMPLETE; reanudar sin truncar; verificar diario/efectos/costos/recibos y marcar COMPLETE. Repetir mismo archivo no duplica efectos. Datos posteriores, prefijos o configuraciones divergentes bloquean: nunca sobrescribirlos. Después de operaciones nuevas, recuperar hacia adelante con motor compatible, sin reabrir escritor antiguo.

Antes de respaldar producción se necesitará aprobación de archivo, pestañas/rangos exactos, destino, datos personales, cuentas con acceso, retención y tratamiento de secretos. Ninguna copia comercial está autorizada por este documento.
