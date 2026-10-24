# Corrección visual publicada y verificada en laboratorio

AUTORIZADO por el propietario exclusivamente para desarrollo y el Worker existente de laboratorio. Publicado en desarrollo y Worker 7c1806c8. Verificación pública y comprobación visual autenticada final aprobadas. Ver red-publica.json e interfaz-remota.json.

Base desplegada: Worker 94e3fbd3 / SHA256 966dc1577447a4b95b07975fd57ae9693743b2473ba61f527c999a584116ba8a. Parche activo: b350fe05fadd3cdc72b7b8c17637674bbc53fe84bde462dd19f47941dc5b1676. Backend sin cambios.

1. Muestra «No registrado» si faltan metadatos históricos de lote. Un cero explícito sigue siendo cero; no rellena ni recalcula datos.
2. Deshabilita cancelación/devolución también al reconstruir las tarjetas filtradas. El servidor ya rechaza esos comandos bajo política DRAFT.

Construcción: node fase1-aislada/fase5g/patches-ui/build.cjs
Pruebas: node --test fase1-aislada/fase5g/patches-ui/metadata.test.cjs
Resultado: 482 pruebas de regresión aprobadas (incluidas las cinco nuevas), sobre el hash exacto propuesto. Revisión local en navegador completada con metadatos ausentes simulados; sin modificar el historial remoto.

No cambia precios, comandos, saldos, cuentas, secretos, permisos, estilos ni datos. No modifica los archivos congelados de build/ del candidato desplegado. Las salidas están en patches-ui/build/.
