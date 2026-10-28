# Continuación manual del censo autorizado

Solo computadora principal, Safari y perfil donde ya estaba abierta la URL comercial confirmada. No abrir/recargar la web ni usar otra computadora. No se solicita exportar clientes, importes, claves, recibos ni operaciones completas.

La automatización verificó la URL existente, pero Safari bloquea su lectura al cerrar Configuración. No se ingresó ni ejecutó código de inspección. La preferencia temporal fue restaurada y verificada desmarcada en ambos intentos. El propietario informó que no veía un panel Inspector/Consola.

## Paso manual, si el propietario puede realizarlo

1. Safari → Configuración → Avanzado → marcar temporalmente «Mostrar funciones para desarrolladores web». Cerrar solo Configuración. No cambiar otras preferencias ni «JavaScript desde eventos de Apple».
2. En la pestaña comercial YA ABIERTA, Desarrollo → Mostrar consola JavaScript. No recargar. Si aparece una advertencia de seguridad o una solicitud inesperada, detenerse y comunicar solo su texto; no eludirla.
3. Abrir el archivo local `census-console.js` de esta misma carpeta y copiar su contenido completo. Pegar en la entrada de la consola, no en la barra de dirección ni en el formulario comercial, y ejecutar una vez. Es una consulta de solo lectura; no llama funciones del sistema ni al servidor, no abre IndexedDB y no modifica almacenamiento. No copiar ningún otro archivo ni ejecutar fragmentos de terceros.
4. Localizar exclusivamente la salida que comienza con `CV_5G2_CENSUS`. Comunicar los conteos/estados de `casa_vieja_outbox` y `casa_vieja_failed_ops` y los nombres/versiones de bases; no enviar una captura completa de la consola, registros de red o datos ajenos a esa salida. Un error o `count:null` no equivale a cero.
5. Cerrar solo Inspector. Safari → Configuración → Avanzado → desmarcar la preferencia temporal y comprobar que volvió a su estado inicial. No borrar historial, cachés, almacenamiento o consola como parte de este procedimiento.

Si la consola no se abre, detenerse. No reinstalar Safari, cambiar protecciones, crear perfiles nuevos ni abrir la web para suplir la falta de acceso.

Esta lectura no establece recibos, última sincronización, URL efectiva de Apps Script ni estado del servidor. No prueba ausencia de escritores externos. Tampoco autoriza reenviar o corregir pendientes: cada caso necesita evidencia y tratamiento en su motor compatible, nunca recrearlo como venta nueva.
