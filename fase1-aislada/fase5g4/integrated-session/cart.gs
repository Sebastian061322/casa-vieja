function cvPrepareCart63_(state, command, cfg, catalogue, now) {
 const cart=command.catalogueCart;
 if (!Array.isArray(cart) || cart.length<1 || cart.length>8 ||
     ['catalogueOfferId','packs','selections','items','lines','totalCents','costCents','priceCents','discountCents','authorizationId'].some(k=>Object.hasOwn(command,k))) {
  throw Error('CATALOGUE_CART_INVALID');
 }
 const combined=CVInventoryBase.clone(state), items=[], refs=[];
 let total=0;
 for(const row of cart){
  if(!row || typeof row!=='object' || Array.isArray(row) ||
     Object.keys(row).sort().join(',')!=='offerId,packs,selections')throw Error('CATALOGUE_CART_INVALID');
  const prepared=CV53CatalogueRules.prepareSale(state,{...command,catalogueOfferId:row.offerId,packs:row.packs,selections:row.selections},cfg,catalogue,now);
  for(const item of prepared.command.items){
   if(items.length>=8)throw Error('CATALOGUE_CART_TOO_MANY_PARTITIONS');
   const offerId='demo:cv53_internal_'+items.length;
   combined.commerce.offers[offerId]={...prepared.state.commerce.offers[item.offerId],id:offerId};
   items.push({...item,offerId});
  }
  refs.push(prepared.catalogueRef);
  total+=prepared.catalogueRef.totalCents;
 }
 return {state:combined,command:{...CVInventoryBase.clone(command),items},catalogueRef:{
  version:catalogue.version,sha256:cfg.catalogueHash,totalCents:total,offers:refs,
  approvalKind:'SYNTHETIC_TEST_APPROVAL',productionApproved:false
 }};
}
