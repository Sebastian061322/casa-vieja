# Contrato propuesto de publicidad — sin conexión

Versión propuesta: 1. Solo vista, sin permisos ni credenciales. No se utilizan datos de Windsor.ai ni Meta.

```json
{
  "schemaVersion": 1,
  "source": "SYNTHETIC_DEMO",
  "currency": "PEN",
  "timezone": "America/Lima",
  "updatedAt": "2026-10-15T12:00:00-05:00",
  "rows": [{
    "date": "2026-10-15",
    "campaignId": "demo-campaign", "campaignName": "DEMO",
    "adsetId": "demo-adset", "adsetName": "DEMO",
    "adId": "demo-ad", "adName": "DEMO",
    "spendCents": 3000, "impressions": 12000, "reach": 8400,
    "clicks": 180, "conversations": 15,
    "attributedOrders": null, "verifiedRevenueCents": null,
    "attributionEvidence": [], "attributionWindow": null,
    "attributionModel": null, "dataStatus": "DEMO"
  }]
}
```

CTR = clics / impresiones; CPC = inversión / clics; CPM = inversión / impresiones × 1000. Divisores cero producen null, no cero. No sumar alcance diario como usuarios únicos del período. La vista conserva filas diarias para evitar esa inferencia. ROAS solo si inversión > 0 e ingresos vinculados a pedidos confirmados mediante evidencia, ventana y modelo explícitos. Devoluciones y reembolsos deben definirse para ingresos netos atribuibles. Conversaciones no son pedidos. Datos ausentes son null; nunca se convierten en cero ventas. Filtros inclusivos por fecha, campaña y anuncio. Los ID deben usarse en integración futura, no nombres como clave.

Pendiente para 5B: validación de esquema, paginación, deduplicación de IDs, conciliación de atribución, frescura y estados de error del proveedor. Ningún ROAS del ejemplo se presenta como verificable.
