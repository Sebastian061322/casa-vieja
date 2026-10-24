/* Extensión prospectiva TEST_ONLY. No red, credenciales ni cambios de diarios anteriores. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CVProcess5G=api;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const copy=x=>JSON.parse(JSON.stringify(x)),check=(x,e)=>{if(!x)throw Error(e)},number=(x,min=0)=>{check(Number.isSafeInteger(x)&&x>=min&&x<=100000000000,'INVALID_NUMBER');return x;};
function attach(A,options){
 check(options?.environment==='TEST_ONLY'&&options.policyVersion==='DRAFT_5G_1','TEST_ONLY_REQUIRED');
 check(!A.Engine.prototype.process5g,'ALREADY_INSTALLED');
 const config=copy(options),prior=A.Engine.prototype.plan;
 for(const role of ['administrator','operations'])for(const type of ['MILL','GRIND'])if(!A.roles[role].includes(type))A.roles[role].push(type);
 A.Engine.prototype.process5g=true;
 A.Engine.prototype.plan=function(s,input){
  const risky=['CANCEL_SALE','RETURN_SALE','AUTHORIZE_DISCOUNT','WASTE'];
  if(risky.includes(input.type))check((config.syntheticAllowedCommands||[]).includes(input.type),'POLICY_APPROVAL_REQUIRED');
  if(input.type==='REGISTER_SALE'||input.type==='RESERVE_SALE')check(!input.discountCents,'POLICY_APPROVAL_REQUIRED');
  if(input.type==='RECEIVE_LOT'){check(typeof input.producer==='string'&&input.producer.trim().length>0,'SUPPLIER_REQUIRED');check(typeof input.documentRef==='string'&&input.documentRef.trim().length>0,'DOCUMENT_REQUIRED');}
  const newType=['MILL','ROAST','GRIND'].includes(input.type);let plan;
  if(newType){
   check(['administrator','operations'].includes(this.actor.role),'PERMISSION_DENIED');
   check(input.commercialVersion===4,'COMMERCIAL_VERSION_REQUIRED');
   const r=s.resources[input.resourceId];check(r,'RESOURCE_UNAVAILABLE');
   const rule={MILL:['PARCHMENT','GREEN','verde',undefined],ROAST:['GREEN','BULK','tostado','grano'],GRIND:['BULK','BULK','tostado molido','molido']}[input.type];
   check(r.stage===rule[0]&&(input.type!=='GRIND'||r.grind==='grano'),'INVALID_STAGE');
   const used=number(input.inputGrams,1),out=number(input.outputGrams,1),waste=number(input.wasteGrams),processing=number(input.processingCents);
   check(used===out+waste,'MASS_BALANCE_REQUIRED');check(r.unit==='g'&&r.qty>=used,'INSUFFICIENT_STOCK');
   const key=input.outputResourceId;check(typeof key==='string'&&/^demo:[a-zA-Z0-9:_-]{1,110}$/.test(key)&&!s.resources[key],'INVALID_OUTPUT_RESOURCE');
   check(typeof input.documentRef==='string'&&input.documentRef.trim().length>0&&input.documentRef.length<=100,'DOCUMENT_REQUIRED');
   const doc=input.documentRef.trim().toUpperCase();check(!s.commerce.documents[doc],'DUPLICATE_DOCUMENT');
   const at=this.context.now();check(!Number.isNaN(Date.parse(at)),'INVALID_SERVER_TIME');
   const value=Number(BigInt(r.valueCents-r.reservedValueCents)*BigInt(used)/BigInt(r.qty));number(value+processing);
   const target={id:key,lot:r.lot,product:rule[2],stage:rule[1],unit:'g',family:r.family,physical:0,reserved:0,qty:0,valueCents:0,reservedValueCents:0,...(rule[3]?{grind:rule[3]}:{})};
   const effect=(resource,kind,qtyDelta,valueDelta,extra={})=>({id:input.operationId+':'+kind,operationId:input.operationId,saleId:input.saleId,date:at,responsible:this.actor.subject,lot:r.lot,product:resource.product,unit:'g',resourceId:resource.id,kind,qtyDelta,reservedDelta:0,valueDelta,reservedValueDelta:0,...extra});
   plan={sale:{id:input.saleId,entityType:'inventory',version:1},lots:[],resources:[target],effects:[effect(r,input.type+'_INPUT',-used,-value),effect(target,input.type+'_OUTPUT',out,value+processing,{processingCents:processing,inputResourceId:r.id}),effect(r,'PROCESS_WASTE',0,0,{wasteGrams:waste,fromStage:r.stage,transformation:input.type})],commerceEvents:[{id:input.operationId+':commercial:0',kind:'CAPITALIZED_COST',operationId:input.operationId,saleId:input.saleId,date:at,recordedAt:at,actorRole:this.actor.role,category:'PROCESAMIENTO',amountCents:processing,lotId:r.lot,documentRef:doc,description:input.type}],audit:{subject:this.actor.subject,role:this.actor.role,serverAt:at,submittedAt:input.date,type:input.type,operationId:input.operationId}};
  }else{
   if(input.type==='PREPARE_BAGS'){
    const r=s.resources[input.resourceId];check(r&&r.stage==='BULK'&&['grano','molido'].includes(r.grind),'PROCESS_STAGE_REQUIRED');check(input.grind===r.grind,'GRIND_STAGE_MISMATCH');
   }
   plan=prior.call(this,s,input);
  }
  plan.policy5g={version:config.policyVersion,status:'DRAFT',approvedForProduction:false,environment:'TEST_ONLY'};
  return plan;
 };
 return A;
}
return {attach};
});
