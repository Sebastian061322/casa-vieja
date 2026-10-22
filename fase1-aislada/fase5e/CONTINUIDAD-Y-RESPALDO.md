Estado 22/10/2026: además del ensayo local descrito, se materializó y verificó una copia totalmente ficticia en cuatro pestañas separadas de la hoja Google de recuperación existente, con interrupción/reanudación y cero filas al planificar repetición. Ver tests/restauracion-google-5e.json y PLAN-RESTAURACION-GOOGLE-5E.md. No se restauraron cuentas, secretos, despliegues ni colas reales.

# Respaldo y continuidad — propuesta 5E

## Copia y restauración implementadas

Archivo CV_RECOVERY_5E con cuatro secciones obligatorias: ledger (diario/movimientos), configuration (reglas y usuarios sintéticos, sin secretos), release (backend, frontend, manifiesto y fuentes con hashes), devices (procedencia, motor, epoch y cobertura de cada estado). Un registro METADATA_ONLY no implica que la cola de ese equipo esté respaldada. Las credenciales no se exportan.

Se verifica SHA256 por sección, contenido de código, hash global esperado desde catálogo separado, consistencia del diario, duplicados y movimientos huérfanos. El hash incluido en la misma copia no prueba su autenticidad. En operación futura el catálogo debe estar bajo custodia independiente del archivo, con permisos restringidos; no basta guardarlos juntos.

Restauración a destino TEST_ONLY distinto del origen. Se verifican todas las secciones existentes antes de escribir; solo se crean partes ausentes. Una divergencia o datos posteriores detienen el proceso. La marca complete se escribe únicamente después de releer y reconstruir el estado completo. Repetir la restauración idéntica no añade consumos; una interrupción entre partes admite reanudación.

El ensayo run-lab.cjs creó un archivo local y lo restauró en otra carpeta, interrumpió una escritura y reanudó, recuperó un PREPARED con efecto parcial y repitió la operación sin duplicarla. Fuente sin cambios, seis bolsas físicas y dos reservadas al terminar. El resultado medido está en tests/recovery-local.json. No es una restauración nueva en Google ni un RTO de aplicación completa. Las colas son sintéticas, no exportaciones de computadoras o iPhone reales.

## Frecuencia y capacidad: pendientes de aprobación

Propuesta: respaldo diario y previo a cambios, retener 30 diarios y 12 mensuales. No se creó programador ni destino externo. Revisar espacio gratuito real, crecimiento y custodia antes de aprobar. Presupuesto inicial de almacenamiento: 42 × tamaño de la copia mayor, más espacio de restauración y margen; no se promete que quepa siempre. No borrar copias sin una política aprobada y una copia recuperable verificada.

RPO propuesto para información confirmada: como máximo 24 horas con copia diaria EXITOSA. Hasta contar con automatización y supervisión, el RPO real es la fecha/revisión de la última copia verificada. Ventas confirmadas posteriores a ella no están cubiertas. Pendientes guardados solo en un equipo perdido pueden perderse; un respaldo del servidor no los incluye.

RTO inicial propuesto: cuatro horas laborales desde disponer de copia, credenciales y proveedores operativos, sujeto a simulacro integral. No está medido ni aprobado. El tiempo local de pocos milisegundos solo corresponde a materialización y verificación sintética; no incluye cuentas, OAuth, secretos, despliegues, restauración Google, revisión ni indisponibilidad externa.

## Contingencia por proveedor

1. Conservar el mismo comando/operationId en IndexedDB; mostrar pendiente, nunca éxito anticipado.
2. Si el token caducó, reingresar con la misma cuenta cuando vuelva Google; no crear otro pedido para reemplazar el pendiente.
3. Al volver el servicio, consultar status. UNKNOWN/PREPARED requiere recuperación del comando original; COMMITTED devuelve su recibo; REJECTED se revisa y archiva con evidencia.
4. No prometer disponibilidad de stock sin validación backend. No permitir dos escritores comerciales durante la contingencia.
5. No confirmar cobros, despachos ni recurrir a otra plataforma por una supuesta venta perdida sin inspeccionar primero la operación.
6. Si el portal no abre, conservar navegador/perfil y dispositivo. Cerrar una pestaña conserva IndexedDB; borrar almacenamiento puede destruir pendientes. No se promete carga offline del portal en una pestaña nueva.

La hoja Google de recuperación ya autorizada se conserva como recurso para un ensayo remoto posterior. Se añadieron únicamente cuatro pestañas 5E autorizadas, sin sobrescribir las anteriores. Antes de materializar, comprobar el destino y evitar cualquier sobrescritura de ensayos previos; no se habilita restauración desde el endpoint público multiusuario.
