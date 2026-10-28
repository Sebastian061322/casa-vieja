'use strict';
const {prepare}=require('../fase5g2/opening.cjs');
function review(input){
 if(!input||Object.keys(input).sort().join(',')!=='act,continuity')throw Error('REVIEW_INPUT_REQUIRED');
 const b=prepare(input.act,input.continuity);
 return {environment:'TEST_ONLY',status:'REVIEW_ONLY_NOT_APPROVED',bundleHash:b.bundleHash,
  actId:b.act.id,effectiveAt:b.act.effectiveAt,responsible:b.act.responsible,secondReviewer:b.act.secondReviewer,
  totals:b.totals,rows:b.act.rows.map(r=>({resourceId:r.resourceId,lot:r.lot,product:r.product,stage:r.stage,unit:r.unit,physical:r.physical,reserved:r.reserved,available:b.totals.available[r.resourceId],historicalValueCents:r.historicalValueCents,availability:r.availability,coffeeGrams:r.stage==='SUPPLY'?0:r.unit==='g'?r.physical:r.physical*r.grams,documentRef:r.documentRef})),
  obligations:b.obligations.map(o=>({legacyRef:o.legacyRef,state:o.state,totalCents:o.totalCents,paidCents:o.paidCents,outstandingCents:o.outstandingCents,responsible:o.responsible})),
  requiresVerifiedOwnerApproval:true,verifiedReviewers:false,inventoryWritten:false,commercialActivation:false};
}
module.exports={review};
