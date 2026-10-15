# Recursos de pruebas autorizados

El propietario respondió «si autorizo» a la creación de rama remota, hoja sintética y proyecto Apps Script independiente. Esta autorización se limita al entorno de desarrollo y no habilita producción, corte de inventario, main ni despliegues.

## Recursos verificados

- Rama: https://github.com/Sebastian061322/casa-vieja/tree/dev/fase1-estabilizacion
- Punto de partida: commit `12a5f997845f9d31dc1a5d8ae7dc49770928da3d`. Se verificó que main permanece en ese commit. Árbol completo de origen: solo index.html; no hay .github/workflows. No se inspeccionaron ni alteraron integraciones externas ni webhooks.
- Carpeta Google: https://drive.google.com/drive/folders/1i8Ey3VLDVqgvg5bXD_K6P1SWZi1lrjRp
- Hoja: https://docs.google.com/spreadsheets/d/1CtK6KD995Pu2Fzc_na89Ajc0KQ0QLuGq3UFhj4UdLSA/edit
- Apps Script: https://script.google.com/home/projects/1Dt2JbUp6BkGPdJLfngMR9ld-dVZUhSZykdlLCOsnLPngffKlrSuOxzfR/edit

Se verificaron título, tipo y carpeta de ambos recursos de Google por conector. Apps Script es independiente (creado desde Mis proyectos, no desde una hoja). Su código guardado se verificó tras recargar el editor: función sandboxInfo sin servicios externos y doGet/doPost que rechazan solicitudes. No se ejecutó ni desplegó. El proyecto productivo existente quedó intacto.

## Hoja sintética

Creada desde cero mediante archivo local e importación nativa, nunca copiada del histórico. Pestañas: Control (ID 315642042), RecursosDemo (399595924) y Operaciones (1854788085). Solo hay dos recursos demo ficticios, sin clientes ni ventas. Operaciones contiene únicamente encabezados; no es todavía un diario conectado.

Zona horaria verificada: America/Lima. La importación asignó es_MX; el intento de cambiarla a es_PE fue rechazado por Google como locale no soportado. Se mantuvo es_MX y se aplicó solo la zona de Lima. No hay fórmulas financieras ni fechas de operaciones afectadas.

Se verificaron valores y estilos por lectura acotada del conector y visualmente las tres pestañas en Google Sheets a 100%. La interfaz confirmó que la hoja es privada, solo para el propietario. No se cambiaron permisos de ninguno de los recursos.

## Estado y siguiente integración

Preparación remota terminada. API real, persistencia durable, autenticación, integración de index.html, pruebas sobre Apps Script/Sheets y corte físico siguen pendientes. Las 18 pruebas locales prueban el modelo de referencia, no el backend remoto. No usar la hoja para pedidos reales. La autorización recibida reemplaza las menciones de aprobación pendiente de creación en los documentos iniciales; sus prohibiciones de producción siguen vigentes.
