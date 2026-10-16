/* Autorización en servidor. Los perfiles nunca se obtienen del comando del navegador. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('../fase4/commercial.js'):root.CVCommercial,typeof module==='object'&&module.exports?require('../fase3/journal.js'):root.CVInventoryBase);if(typeof module==='object'&&module.exports)module.exports=api;else root.CVAccess=api;})(typeof globalThis==='object'?globalThis:this,function(C,B){
'use strict';const {clone,canonical}=B,fail=code=>{throw Error(code)},check=(ok,code)=>{if(!ok)fail(code)};
const roles=Object.freeze({administrator:['*'],sales:['REGISTER_SALE','RESERVE_SALE','EDIT_SALE','CANCEL_SALE'],inventory:['PREPARE_BAGS']});
const forbidden=['role','roles','permissions','actor','actorId','subject','audit','authenticatedUser'];
function principal(subject,bindings){check(typeof subject==='string'&&subject.length>0&&subject.length<=160,'IDENTITY_REQUIRED');const binding=Object.hasOwn(bindings,subject)?bindings[subject]:null;check(binding&&binding.active===true&&Object.hasOwn(roles,binding.role),'ACCESS_DENIED');return Object.freeze({subject,role:binding.role});}
function own(engine,actor,operationId){const records=engine.records(),p=records.find(x=>x.id===operationId&&['PREPARED','REJECTED'].includes(x.kind));if(p&&actor.role!=='administrator')check((p.plan?.audit||p.audit)?.subject===actor.subject,'ACCESS_DENIED');return p;}
function saleOwned(engine,actor,sale){if(actor.role==='administrator')return;check(sale,'ACCESS_DENIED');const p=engine.records().find(p=>p.kind==='PREPARED'&&p.id===sale.originOperationId);check(p?.plan?.audit?.subject===actor.subject,'ACCESS_DENIED');}
class Engine extends C.Engine{
 constructor(store,opening,hook,context){check(context&&context.actor&&context.now,'IDENTITY_REQUIRED');const trustedStore={readJournal:()=>store.readJournal(),readEffects:()=>store.readEffects(),appendEffect:r=>store.appendEffect(r),appendJournal:r=>store.appendJournal(r.kind==='REJECTED'?{...r,audit:{subject:context.actor.subject,role:context.actor.role,serverAt:context.now()}}:r)};super(trustedStore,opening,hook,{role:'owner',now:context.now});this.actor=context.actor;this.policy=context.policy||{};this.financialIndexes=new WeakMap();}
 execute(c){check(c&&typeof c==='object','INVALID_COMMAND');check(!forbidden.some(k=>Object.hasOwn(c,k)),'IDENTITY_SPOOFING');own(this,this.actor,c.operationId);return super.execute(c);}
 plan(s,input){const actor=this.actor,allowed=roles[actor.role];check(allowed&&(allowed.includes('*')||allowed.includes(input.type)),'PERMISSION_DENIED');
  const c=clone(input),serverAt=this.context.now();c.responsible=actor.subject;c.date=serverAt;
  if(actor.role==='sales'){
   check(!['totalCents','costCents','profitCents','deliveryCostCents','deliveryChargedCents','discountCents','authorizationId','lines'].some(k=>Object.hasOwn(c,k)),'FINANCIAL_FIELDS_FORBIDDEN');
   if(['REGISTER_SALE','RESERVE_SALE'].includes(c.type)){const shipping=this.policy.shippingByZone?.[c.customer?.zone||''];check(shipping&&Number.isSafeInteger(shipping.costCents)&&shipping.costCents>=0&&Number.isSafeInteger(shipping.chargedCents)&&shipping.chargedCents>=0,'SHIPPING_POLICY_REQUIRED');c.deliveryCostCents=shipping.costCents;c.deliveryChargedCents=shipping.chargedCents;}
   else saleOwned(this,actor,s.sales[c.saleId]);
  }
  if(actor.role==='inventory'){
   check(!['processingCents','acquisitionCents','totalCostCents','freightCents'].some(k=>Object.hasOwn(c,k)),'FINANCIAL_FIELDS_FORBIDDEN');
   const recipe=this.policy.preparationByGrams?.[c.bagGrams];check(recipe&&Number.isSafeInteger(recipe.processingPerBagCents)&&recipe.processingPerBagCents>=0,'RECIPE_POLICY_REQUIRED');c.processingCents=B.uint(recipe.processingPerBagCents*c.bags);c.documentRef='PREP:'+c.operationId;
  }
  const plan=super.plan(s,c);plan.audit={subject:actor.subject,role:actor.role,serverAt,submittedAt:input.date,operationId:input.operationId,type:input.type};for(const event of plan.commerceEvents||[])event.actorRole=actor.role;return plan;
 }
 status(id){own(this,this.actor,id);return super.status(id);}
 // Recuperación interna de planes ya autorizados, sin exponer confirmaciones ajenas.
 finish(p){const actor=this.actor;this.actor={subject:actor.subject,role:'administrator'};try{return super.finish(p)}finally{this.actor=actor}}
 financial(s,saleId){let index=this.financialIndexes.get(s);if(!index){index=new Map();for(const e of s.commerce.events){if(!index.has(e.saleId))index.set(e.saleId,[]);index.get(e.saleId).push(e)}this.financialIndexes.set(s,index)}const sale=s.sales[saleId],events=index.get(saleId)||[],sum=k=>events.filter(e=>e.kind===k).reduce((n,e)=>n+e.amountCents,0),credit=sum('RETURN_CREDIT'),due=sale?.status==='CANCELLED'?0:(sale?.totalCents||0)+(sale?.deliveryChargedCents||0)-credit,paid=sum('PAYMENT'),refunded=sum('REFUND');return {dueCents:due,paidCents:paid,refundedCents:refunded,cashCents:paid-refunded,outstandingCents:Math.max(0,due-paid+refunded),refundableCents:Math.max(0,paid-refunded-due)};}
}
function snapshot(engine,{offset=0,limit=50,revision}={}){check(Number.isSafeInteger(offset)&&offset>=0&&Number.isSafeInteger(limit)&&limit>0&&limit<=100,'INVALID_PAGE');const s=engine.state(),actor=engine.actor;check(revision===undefined||revision===s.revision,'REVISION_CHANGED');
 if(actor.role==='administrator'){s.reports=engine.reports(s);for(const sale of Object.values(s.sales))if(sale.commercial)sale.financial=engine.financial(s,sale.id);return s;}
 const resources=Object.values(s.resources).filter(r=>actor.role==='inventory'||r.stage==='PACKAGED').map(r=>Object.fromEntries(['id','product','lot','stage','family','grind','grams','unit','physical','reserved','qty','supplyKind'].filter(k=>r[k]!==undefined).map(k=>[k,r[k]])));
 const sales=actor.role==='sales'?Object.values(s.sales).filter(sale=>{try{saleOwned(engine,actor,sale);return true}catch(e){return false}}).map(sale=>({id:sale.id,version:sale.version,status:sale.status,totalCents:sale.totalCents,deliveryChargedCents:sale.deliveryChargedCents,metadata:clone(sale.metadata),lines:sale.lines.map(l=>Object.fromEntries(['resourceId','qty','lot','family','grind','grams','returned'].map(k=>[k,l[k]])))})):[];
 const offers=actor.role==='sales'?Object.values(s.commerce.offers).filter(o=>o.active).map(o=>Object.fromEntries(['id','name','family','grind','grams','bags','priceCents','validFrom','validUntil','version'].map(k=>[k,o[k]]))):[];
 return {epoch:s.epoch,revision:s.revision,profile:actor.role,resources:resources.slice(offset,offset+limit),sales:sales.slice(offset,offset+limit),offers:offers.slice(offset,offset+limit),next:Math.max(resources.length,sales.length,offers.length)>offset+limit?offset+limit:null};
}
return {roles,principal,Engine,snapshot,canonical};
});
