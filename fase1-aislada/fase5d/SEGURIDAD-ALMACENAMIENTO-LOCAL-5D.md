# Almacenamiento local y equipos — Fase 5D

Decisión expresa del propietario, 21 de octubre de 2026: cada persona utilizará su propio equipo o un perfil de navegador separado. No se aprueba compartir un mismo perfil de Safari/Chrome entre vendedor y gerentes.

## Hallazgo y alcance

**Alto, confirmado por código; confidencialidad condicionada al equipo:** IndexedStore guarda copias de datos comerciales y operaciones en IndexedDB. Los nombres por Google subject separan colas, pero no cifran la información ni constituyen una barrera entre usuarios del mismo origen web dentro del mismo perfil del navegador. Un snapshot gerencial contiene costos y reportes. No se extrajeron datos de otros usuarios para demostrarlo y no se accedió a producción.

La autorización backend sigue siendo necesaria y sus denegaciones no corrigen el acceso a copias ya almacenadas. Cerrar sesión oculta la vista, pero no borra esas copias. En este laboratorio los datos son ficticios; la prueba de varios perfiles Google en la misma computadora no autoriza ese uso en producción.

## Condición operativa aprobada

- Equipo o perfil de navegador asignado por persona; una pestaña, ventana privada o cambio de cuenta Google no equivale a esa separación.
- El vendedor no debe poder acceder al perfil/equipo usado por un gerente. Si comparten una computadora con acceso libre a todos sus perfiles, la separación no protege de quien abra el perfil ajeno; usar acceso del sistema operativo separado y protegido o equipos distintos.
- No iniciar una cuenta gerencial dentro del perfil asignado al vendedor. No copiar sus bases locales, historial o respaldos al perfil del vendedor.
- Registrar equipo, navegador, perfil operativo y responsable durante las pruebas físicas, sin contraseñas ni tokens.
- Si se necesita compartir el mismo perfil, detener esa modalidad y diseñar/probar cifrado por usuario, custodia y recuperación de claves antes de habilitarla. No está implementado ni aprobado como solución actual.
- Nunca limpiar IndexedDB para resolver un pendiente. La revisión y recuperación de cada cola precede a cualquier cambio de perfil/equipo. El historial de Sheets permanece inalterado.

**Estado:** decisión de uso confirmada; implementación de cifrado por usuario inexistente. La separación física/perfiles y el control del acceso a perfiles ajenos aún deben verificarse antes de Fase 6. No se declara resuelta la privacidad para equipos compartidos sin esa separación.
