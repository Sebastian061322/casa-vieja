function cvAuthorizedAdjustment62_(engine, command, prepared) {
 const own = key => Object.prototype.hasOwnProperty.call(command, key);
 if (own('deliveryCostCents') || own('deliveryChargedCents')) throw Error('CATALOGUE_BROWSER_PRICE_FORBIDDEN');
 const adjustment = command.commercialAdjustment;
 const manager = ['administrator','operations'].includes(engine.actor.role);
 if (own('commercialAdjustment') && !manager) throw Error('COMMERCIAL_APPROVAL_REQUIRED');
 if (!manager) return null;

 const tariff = engine.policy.shippingByZone?.[command.customer?.zone || ''];
 const valid = value => Number.isSafeInteger(value) && value >= 0 && value <= 100000000000;
 if (!tariff || !valid(tariff.costCents) || !valid(tariff.chargedCents)) throw Error('SHIPPING_POLICY_REQUIRED');
 prepared.command.deliveryCostCents = tariff.costCents;
 prepared.command.deliveryChargedCents = tariff.chargedCents;
 if (!own('commercialAdjustment')) return null;

 if (!adjustment || typeof adjustment !== 'object' || Array.isArray(adjustment) ||
     Object.keys(adjustment).some(key => !['productTotalCents','deliveryChargedCents','reason'].includes(key)) ||
     (!Object.hasOwn(adjustment,'productTotalCents') && !Object.hasOwn(adjustment,'deliveryChargedCents')) ||
     typeof adjustment.reason !== 'string' || !adjustment.reason.trim() || adjustment.reason.length > 500) {
  throw Error('COMMERCIAL_ADJUSTMENT_INVALID');
 }

 const reference = prepared.catalogueRef.totalCents;
 const product = Object.hasOwn(adjustment,'productTotalCents') ? adjustment.productTotalCents : reference;
 const delivery = Object.hasOwn(adjustment,'deliveryChargedCents') ? adjustment.deliveryChargedCents : tariff.chargedCents;
 if (!valid(product) || !valid(delivery) || !valid(product + delivery)) throw Error('COMMERCIAL_ADJUSTMENT_INVALID');

 // The existing sale engine still calculates stock, lot costs and accounting.
 // Only the synthetic catalogue offers for this operation receive the price.
 if (product !== reference) {
  let cumulative = 0, allocated = 0;
  for (let i = 0; i < prepared.command.items.length; i++) {
   const item = prepared.command.items[i];
   const offer = prepared.state.commerce.offers[item.offerId];
   cumulative += offer.priceCents;
   const next = reference
    ? Number(BigInt(product) * BigInt(cumulative) / BigInt(reference))
    : (i === prepared.command.items.length - 1 ? product : 0);
   offer.priceCents = next - allocated;
   allocated = next;
  }
 }
 prepared.command.deliveryChargedCents = delivery;
 delete prepared.command.commercialAdjustment;
 return {
  policyVersion:'TEST_ONLY_OWNER_ADJUSTMENTS_2026_11_04',
  operationId:command.operationId,saleId:command.saleId,subject:engine.actor.subject,
  role:engine.actor.role,reason:adjustment.reason.trim(),recordedAt:engine.context.now(),
  catalogueProductCents:reference,appliedProductCents:product,productDifferenceCents:product-reference,
  referenceDeliveryCents:tariff.chargedCents,appliedDeliveryCents:delivery,
  realDeliveryCostCents:tariff.costCents
 };
}
