# Candidato de transición comercial

Estado: corrección de instalación móvil preparada; requiere publicación en laboratorio.

## Datos de origen

- Base antigua: copia XLSX descargada en modo de solo lectura el 13/11/2026.
- SHA-256 de la copia privada: `86c6a093b1cd832959b1c23f6c09b8d498fd696cc8bdb563a114853e561063ff`.
- Paquete privado de migración: SHA-256 `bae672a598a88cc30814ea2569e5c8f46be1acf75c204c631a8bab73dd5e5cff`.
- La copia y el paquete con datos personales permanecen fuera de Git.

## Cobertura preparada

- Ventas: 328, sin IDs duplicados.
- Julio: 2; agosto: 59; septiembre: 101; octubre: 121; noviembre: 45.
- Movimientos conservados para auditoría: 430. No se reproducen contra inventario.
- Egresos: 17.
- Registros de Ads: 103.
- Lotes de referencia: 10.

## Apertura

- Fondo común: `CASA_VIEJA_COMMON_BLEND_2026_11`.
- Lote: Lote-09; Mendoza; Grano Fuerte; Blend.
- Compra: 300 kg verde a S/19.50/kg; flete S/100; tostado S/1,050.
- Resultado tostado medido: 192.58 kg.
- Rendimiento: 64.193333%.
- Costo tostado: S/36.34853/kg; regla operativa S/36.35/kg.
- Apertura operativa al 01/11/2026: 200 kg.
- Consumo de las 45 ventas de noviembre: 60.50 kg.
- Saldo no comprometido por el cálculo: 139.50 kg.

## Protección de continuidad

- Las ventas históricas se importan como legado inmutable y sin efectos de stock.
- La apertura neta es el único evento que crea inventario en el destino nuevo.
- `sourceRef` evita reimportar una fila.
- Un ensayo interrumpido se reanuda sin duplicar registros.
- El sistema antiguo continúa activo.
- Hasta el corte, el nuevo destino no puede registrar ventas reales. Así se evita que ambos sistemas descuenten el mismo café.

## Aplicación móvil

- Se añadió manifiesto instalable, metadatos de iPhone, iconos y service worker.
- El service worker no intercepta `/api`, navegación ni HTML privado.
- El candidato abre en modo `standalone` desde la pantalla de inicio; iOS utiliza internamente WebKit/Safari.
- El artefacto conserva las barreras TEST_ONLY hasta que exista un backend comercial separado.

## Verificación

- Pruebas nuevas: 7/7 aprobadas.
- Regresión completa: 694/694 aprobadas.
- Worker PWA corregido: `eeb81a74279db433d740e397ef8075319d4594e3387a5237f6a0db3d32e38e7c`.
- La verificación remota del primer paquete detectó que `/index.html` anunciaba la PWA pero `/` no. El candidato corregido cubre ambas rutas y añade una prueba de regresión específica.
- Backend vigente, sin cambios: `e78ae2b52d54727c8e42abdbb9b8384f1c04879704ef26fc74b08160e714449f`.

## Bloqueo para datos reales

El backend vigente está ligado a la hoja sintética, el destino `TEST_ONLY_ZERO_1`, el epoch `TEST_ONLY_V3`, IDs `demo:` y políticas no aprobadas para producción. No es seguro reemplazar textos para ocultar esa condición. La siguiente acción remota debe crear un destino comercial independiente y cargar allí el paquete de migración; no debe modificar la base antigua.
