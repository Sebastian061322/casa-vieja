# Recuperación y autorizaciones — plan concreto, no ejecutado en proveedores

## Ensayo local completado

run-recovery.mjs crea copia sintética con seis archivos de código/configuración de versión, tres usuarios ficticios y dos colas completas. Interrumpe un proceso tras su primer efecto, respalda PREPARED, interrumpe materialización de configuración, reanuda, recupera perfiles/recibo perdido/proceso parcial y repite sin duplicación. Comprueba revocación y origen intacto. Ver tests/recovery-local.json.

Archivos privados de copia/catálogo/destino están bajo evidencia-local/recovery-* con permisos 0600. Son carpetas separadas del mismo ordenador: no custodia independiente real ni respaldo de equipos comerciales. El tiempo medido solo cubre este ensayo local; no es RTO de Google/OAuth/Cloudflare. No se copiaron secretos, usuarios o datos productivos.

## Próximo paso A — publicación y comprobación del candidato en laboratorio existente

Paquetes exactos en build/manifest.json: rama dev/fase1-estabilizacion, source base 2959eafd. Antes de escribir, autorización específica para publicar solo carpeta fase5g y actualizar exclusivamente Worker casa-vieja-lab-auth y Apps Script CasaVieja_AUTH_TEST_ONLY_5D. No modificar main ni los archivos base de fases anteriores.

Cambios: etapas pilado/verde/molienda y formularios; política DRAFT bloquea rutas no aprobadas; caché de propiedades de una sola petición con readback físico; sondeo 120 s. Conserva mismos usuarios, endpoint, secreto, hoja sintética y alcance OAuth. Las capacidades nuevas MILL/GRIND solo corresponden a gerentes/administrador del laboratorio. Sin CSV/CRM/atribución.

Antes: verificar HEAD/CAS, hashes, versiones actuales, copia y cero pendientes de TODOS los equipos de laboratorio; estado de rechazo archivado conservado. Si aparece pendiente, detener publicación y recuperar en motor compatible; no marcar la revisión por suposición.

Después: confirmar nueva versión de Script/Worker, activos por hash, rechazos públicos, tres perfiles, recibo simple/Tripack/combo, nueva cadena física con pesos ficticios, y diario/inventario. Las pruebas 5E no se cuentan como aprobaciones sobre 5G. Propietario participa solo si Google/Safari exige intervención o para prueba física.

Riesgo: errores del paquete y nuevos eventos GREEN/MILL/GRIND. Si falla antes de crear eventos nuevos, las versiones de referencia son Worker 4fdf13da y Apps Script 3. Si ya existen eventos 5G, detener nuevas altas; conservar una versión compatible para recuperar/consultar todos los planes. No volver a escribir con procesamiento antiguo ni restaurar una copia anterior. Una reversión de interfaz no autoriza revertir el diario.

## Paso B propuesto — infraestructura de recuperación aislada (requiere otro permiso)

Preparar antes de crear: revisión de cuentas/Free, nombres, IDs obtenidos y guarda de destinos. Recursos propuestos, no creados:

1. Una hoja nueva CasaVieja_RECUPERACION_TEST_ONLY_5G, privada, sin clientes reales, Control!B3 TEST_ONLY y tablas nuevas de diario/movimientos. No sobrescribir ni reutilizar como servidor la copia 5B/5E ni su PREPARED sin identidad.
2. Un Apps Script CasaVieja_DR_TEST_ONLY_5G, con guardas exclusivas para su propio ID y esa hoja nueva; API mínima, sin mantenimiento público. Configuración recuperada de usuarios de prueba autorizados y políticas sintéticas, excluyendo credenciales.
3. Un Worker Free casa-vieja-dr-test-only-5g, origen distinto del laboratorio original, sin KV/D1/billing/tarjeta. Ese origen evita que colas existentes del laboratorio se descarguen automáticamente sobre una copia anterior.
4. Solo tras autorización de acceso: cliente OAuth web del mismo proyecto Google de laboratorio o ampliación del origen autorizado exacto, identidad básica y exclusivamente las tres cuentas de prueba ya usadas. No cuentas compartidas ni usuarios productivos nuevos.

No aceptar términos nuevos, ampliar OAuth de Sheets, exponer un endpoint o habilitar acceso de personas por la mera aprobación de creación de recursos vacíos. Esos pasos necesitarán aprobación concreta cuando se conozcan IDs/URL/alcance. La clave HMAC se restaura o regenera mediante entrada directa del propietario en formularios; no se envía al chat, no se imprime y no se publica. Consultar únicamente existencia/estado redactado de las credenciales, no sus valores.

Cargar una copia puramente sintética con comandos autenticados compatibles (el ensayo 5G nuevo, no el fixture V4 sin audit de 5E). Tras crear IDs se compilarán guardas/destinos y se fijarán hashes nuevos, se revisarán permisos y se pedirá autorización de ese despliegue. Verificar hash desde catálogo bajo custodia separada antes de materializar; marcador INCOMPLETE hasta releer todas las secciones. Probar login/roles, recibido original, PREPARED con efecto parcial, idempotencia, reserva/stock/costos y revocación; nunca volver a contabilizar un pedido del origen.

Registrar inicio/fin de recuperación por etapa, interacción del propietario, disponibilidad de credenciales, versiones y recibos. El RPO real será la última revisión respaldada comprobable, no «24 h» por defecto. La pérdida de una cuenta Google propietaria no se simula borrándola; recuperación oficial/custodia del propietario se revisan como controles separados.

Si aparece costo, facturación requerida, destino ajeno, hash divergente, usuario no autorizado o dato comercial: detener. Conservar recursos parciales TEST_ONLY y evidencias; no borrar ni sobrescribir.

## Autorizaciones comerciales, fuera de A/B

- Lectura productiva: archivo/pestañas/rangos precisos, propósito y evidencia a extraer. Este trabajo no la solicita ni la ejecuta todavía.
- Equipos: una autorización por equipo/perfil/origen y alcance de lectura; exportación solo con permiso adicional explícito.
- Políticas/catálogo: decisión/versiones/fechas por el propietario; DRAFT no equivale a aprobación.
- Corte: permisos separados para cerrar escritor antiguo, aplicar acta/saldos y habilitar escritor nuevo. No se infieren de aprobar una prueba de laboratorio.
- Activación del 1/11: GO y autorización comercial final sobre commit/hash/versiones exactos; no permitida por este documento.
