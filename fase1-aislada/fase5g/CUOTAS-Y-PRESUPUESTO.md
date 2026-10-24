# S/0 obligatorio y cuotas — consulta oficial 23/10/2026

No se contrató nada, no se añadió tarjeta, no se vinculó facturación ni se creó recurso remoto en esta fase. Sin Windsor, Cloud Run, WhatsApp API con cargos o dominio de pago. La aplicación WhatsApp Business y el CSV manual son decisiones de alcance del propietario; no se implementó su integración.

Google documenta para cuentas de consumidor 6 minutos por ejecución, 30 ejecuciones simultáneas por usuario y 50 000 lecturas/escrituras de Properties diarias, sujetas a cambios. Estas cuotas no son capacidad garantizada del negocio; el propietario de Apps Script comparte su presupuesto con otros scripts. [Cuotas oficiales de Apps Script](https://developers.google.com/apps-script/guides/services/quotas).

Workers Free documenta 100 000 peticiones diarias y 10 ms de CPU por invocación. Esperar la red no equivale a CPU. Sobrepasar el límite puede interrumpir el servicio: no se habilitará Paid para remediarlo. No se verificó una nueva configuración de facturación de la cuenta en este trabajo. [Límites oficiales](https://developers.cloudflare.com/workers/platform/limits/), [precios oficiales](https://developers.cloudflare.com/workers/platform/pricing/).

Medición de código con Google simulado: snapshot administrativo, lecturas getProperty 17→11; ciclo bootstrap+snapshot 32→20. No se almacena autorización entre peticiones. La escritura de nonce invalida memo y exige readback físico; revocación se relee en la siguiente petición. Sondeo automático 30→120 s; consultas explícitas, reconexión y validación de stock no se omiten.

Hipótesis conservadora de tres pestañas visibles ocho horas: 92 160→14 400 llamadas getProperty según ese fixture y frecuencia, más escrituras/otras acciones. No es contador facturado de Google, ni prueba de cuota real o carga productiva. El número cambia al crecer los eventos de configuración; no afirmar que siempre cabe. Ver tests/property-reads.json y tests/polling-model.json.

La disponibilidad de pantalla puede quedar más antigua por el intervalo mayor; es una proyección. Toda reserva sigue validándose en backend. La latencia real de 5G y CPU Worker quedan pendientes de medición autorizada; no trasladar a Google los tiempos de Node ni usar tres muestras de 5E como garantía.
