function cvApprovalBinding63_(command){
 const fields=['saleId','catalogueVersion','catalogueOfferId','packs','selections','catalogueCart','customer','channel'];
 return CVInventoryBase.canonical(Object.fromEntries(fields.filter(key=>Object.hasOwn(command,key)).map(key=>[key,command[key]])));
}
function cvApprovalRows63_(engine){
 const rows=engine.records(), committed=new Set(rows.filter(row=>row.kind==='COMMITTED').map(row=>row.id));
 const requests={};
 for(const row of rows){
  const event=row.plan?.adjustmentApproval63;
  if(row.kind!=='PREPARED'||!event||!committed.has(row.id))continue;
  if(event.kind==='REQUEST')requests[event.id]={...event,state:'PENDING'};
  else if(requests[event.id])Object.assign(requests[event.id],{state:event.kind,reviewer:event.reviewer,reviewedAt:event.reviewedAt});
 }
 return requests;
}
function cvApprovalPlan63_(engine,state,command){
 if(command.commercialVersion!==4)throw Error('COMMERCIAL_VERSION_REQUIRED');
 const role=engine.actor.role,subject=engine.actor.subject,now=engine.context.now();
 const requests=cvApprovalRows63_(engine);
 let event;
 if(command.type==='REQUEST_COMMERCIAL_ADJUSTMENT'){
  if(role!=='seller')throw Error('PERMISSION_DENIED');
  const proposal=command.proposal, adjustment=command.commercialAdjustment;
  if(!proposal||typeof proposal!=='object'||Array.isArray(proposal)||proposal.saleId!==command.saleId||
     proposal.catalogueVersion!==CV53CatalogueSource.version||JSON.stringify(proposal).length>14000||
     Object.keys(proposal).some(k=>!['saleId','catalogueVersion','catalogueOfferId','packs','selections','catalogueCart','customer','channel'].includes(k))||
     (!Array.isArray(proposal.catalogueCart)&&typeof proposal.catalogueOfferId!=='string'))throw Error('APPROVAL_PROPOSAL_INVALID');
  if(!adjustment||typeof adjustment!=='object'||Array.isArray(adjustment)||
     Object.keys(adjustment).some(k=>!['productTotalCents','deliveryChargedCents','reason'].includes(k))||
     (!Object.hasOwn(adjustment,'productTotalCents')&&!Object.hasOwn(adjustment,'deliveryChargedCents'))||
     ['productTotalCents','deliveryChargedCents'].some(k=>Object.hasOwn(adjustment,k)&&(!Number.isSafeInteger(adjustment[k])||adjustment[k]<0||adjustment[k]>100000000000))||
     typeof adjustment.reason!=='string'||!adjustment.reason.trim()||adjustment.reason.length>500)throw Error('COMMERCIAL_ADJUSTMENT_INVALID');
  const cfg=JSON.parse(cvProps5g_().getProperty('CV_5G3_CATALOGUE_CONFIG')||'{}');
  const sale={...proposal,type:'REGISTER_SALE'};
  const prepared=Object.hasOwn(sale,'catalogueCart')?cvPrepareCart63_(state,sale,cfg,CV53CatalogueSource,now):
   CV53CatalogueRules.prepareSale(state,sale,cfg,CV53CatalogueSource,now);
  const tariff=engine.policy.shippingByZone?.[proposal.customer?.zone||''];
  if(!tariff||!Number.isSafeInteger(tariff.chargedCents)||tariff.chargedCents<0)throw Error('SHIPPING_POLICY_REQUIRED');
  if(state.sales[command.saleId]||Object.values(requests).some(r=>r.saleId===command.saleId&&r.subject===subject&&r.state!=='REJECTED'&&Date.parse(r.expiresAt)>Date.parse(now)))throw Error('APPROVAL_ALREADY_EXISTS');
  event={kind:'REQUEST',id:command.operationId,saleId:command.saleId,subject,binding:cvApprovalBinding63_(proposal),
   catalogueProductCents:prepared.catalogueRef.totalCents,catalogueSha256:prepared.catalogueRef.sha256,referenceDeliveryCents:tariff.chargedCents,
   shippingPolicyVersion:engine.policy.version,policyVersion:'TEST_ONLY_OWNER_ADJUSTMENTS_2026_11_04',
   adjustment:CVInventoryBase.clone(adjustment),createdAt:now,expiresAt:new Date(Date.parse(now)+86400000).toISOString()};
 }else{
  if(!['administrator','operations'].includes(role))throw Error('PERMISSION_DENIED');
  const r=requests[command.requestId];
  if(!r||r.saleId!==command.saleId||r.state!=='PENDING'||Date.parse(r.expiresAt)<=Date.parse(now)||state.sales[r.saleId])throw Error('APPROVAL_NOT_PENDING');
  if(!['APPROVED','REJECTED'].includes(command.decision))throw Error('APPROVAL_DECISION_INVALID');
  event={kind:command.decision,id:r.id,reviewer:subject,reviewedAt:now};
 }
 return {sale:{id:command.saleId,version:1,entityType:'inventory'},resources:[],lots:[],effects:[],commerceEvents:[],
  adjustmentApproval63:event,audit:{subject,role,serverAt:now,type:command.type,operationId:command.operationId}};
}
function cvApprovedAdjustment63_(engine,command,prepared){
 if(!Object.hasOwn(command,'commercialApprovalId'))return null;
 const r=cvApprovalRows63_(engine)[command.commercialApprovalId], now=engine.context.now();
 if(engine.actor.role!=='seller'||!r||r.state!=='APPROVED'||r.subject!==engine.actor.subject||
    r.saleId!==command.saleId||r.binding!==cvApprovalBinding63_(command)||r.shippingPolicyVersion!==engine.policy.version||
    r.catalogueProductCents!==prepared.catalogueRef.totalCents||r.catalogueSha256!==prepared.catalogueRef.sha256||Date.parse(r.expiresAt)<=Date.parse(now)||
    Object.hasOwn(command,'commercialAdjustment'))throw Error('COMMERCIAL_APPROVAL_REQUIRED');
 return r;
}

const CVApprovalViewBase63_=CV5DView.snapshot;
CV5DView.snapshot=function(engine){
 const snapshot=CVApprovalViewBase63_(engine);
 if(!CV_SCOPE53_ACTIVE)return snapshot;
 const management=engine.actor.role!=='seller';
 return {...snapshot,adjustmentApprovals63:Object.values(cvApprovalRows63_(engine))
  .filter(r=>management||r.subject===engine.actor.subject)
  .filter(r=>Date.parse(r.expiresAt)>Date.parse(engine.context.now()))
  .slice(-50).map(r=>({id:r.id,saleId:r.saleId,state:r.state,adjustment:r.adjustment,
   catalogueProductCents:r.catalogueProductCents,referenceDeliveryCents:r.referenceDeliveryCents,expiresAt:r.expiresAt}))};
};
