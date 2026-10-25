# Alcance propuesto de inspección, pendiente de autorización específica

Solo lectura, sin consultar filas comerciales ni ejecutar aplicaciones/endpoints. No desactivar rutas ni realizar pruebas de escritura.

1. Código de index.html de main en Sebastian061322/casa-vieja: registrar hash y referencias a endpoints, google.script.run, almacenamiento, sincronización y copias. Leer código no requiere llamar las URLs descubiertas. Comparar con el frontend efectivamente publicado mediante archivos estáticos solo cuando se conozca el destino y se confirme que no ejecutan lógica.
2. Apps Script productivo: el propietario identifica el proyecto exacto antes de abrirlo. Leer código, manifiesto, lista de versiones/despliegues y activadores, sin ejecutar funciones ni abrir valores de propiedades/secretos. Registrar nombres de propiedades, nunca valores. No llamar doGet/doPost ni consultas que puedan escribir. Las APIs que registren un acceso operativo se excluyen hasta revisar su código.
3. BaseDatos_CasaVieja: autorización separada solo para metadatos de estructura, permisos y posibles automatizaciones, sin filas de Ventas/Movimientos/Clientes ni valores de Config sensibles. No compartir la hoja, exportarla ni cambiar permisos.
4. Integraciones: inventariar nombres y destino declarado, si el propietario confirma n8n/webhooks/bots conectados. No explorar otros proyectos por suposición. Leer el código/configuración redactada del flujo exacto después de identificarlo; nunca tokens o historial de mensajes.
5. Cada dispositivo/perfil/origen comercial: requerirá permiso individual antes de inspeccionar IndexedDB. Alcance propuesto: nombres/versión/stores/motor/epoch, cantidades por estado y últimos recibos, sin contenido de clientes. No exportar colas u operationIds fuera del equipo sin permiso de destino. No limpiar almacenamiento, recargar forzosamente ni reenviar pendientes.

La lista efectiva de escritores permanece DESCONOCIDA, no certificada. No confundir el censo del laboratorio con el comercial. Una aprobación de inspección no autoriza cierre de escritores ni apertura del nuevo.

Salida exigida: matriz ruta → versión/hash → autoridad real → mecanismo de pausa → prueba sin efectos propuesta → autorización necesaria. ScriptLock no excluye otro proyecto de Apps Script ni ediciones directas de la hoja.
