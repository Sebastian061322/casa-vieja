'use strict';
// Propuesta de conteo únicamente: no genera ajustes ni comandos ejecutables.
function reconcile(state,counts){
  if(state?.epoch!=='TEST_ONLY_V3'||!Array.isArray(counts))throw Error('TEST_ONLY_COUNT_REQUIRED');
  const seen=new Set();const rows=counts.map(c=>{
    const r=state.resources[c.resourceId];
    if(!r||seen.has(r.id)||!Number.isSafeInteger(c.physical)||c.physical<0||c.unit!==r.unit)throw Error('INVALID_COUNT');seen.add(r.id);
    return {resourceId:r.id,lot:r.lot,family:r.family||null,stage:r.stage,grind:r.grind||null,grams:r.grams||null,unit:r.unit,expectedPhysical:r.physical,countedPhysical:c.physical,reserved:r.reserved,expectedAvailable:r.physical-r.reserved,countedAvailable:Math.max(0,c.physical-r.reserved),difference:c.physical-r.physical,status:c.physical===r.physical?'MATCH':'OWNER_REVIEW_REQUIRED',reservedExceedsCount:r.reserved>c.physical};
  });
  return {environment:'TEST_ONLY',revision:state.revision,approved:false,canExecuteAdjustments:false,scope:seen.size===Object.keys(state.resources).length?'FULL':'PARTIAL',rows};
}
module.exports={reconcile};
