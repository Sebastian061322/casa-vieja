/* Extensión comercial prospectiva. El motor V3 sigue siendo autoridad física. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('../fase3/inventory.js'):root.CVInventory);if(typeof module==='object'&&module.exports)module.exports=api;else root.CVCommercial=api;})(typeof globalThis==='object'?globalThis:this,function(I){
'use strict';
const {Engine:Inventory,EPOCH,clone}=I;
const check=(ok,error)=>{if(!ok)throw Error(error);};
const num=(n,min=0)=>{check(Number.isSafeInteger(n)&&n>=min&&n<=100000000000,'INVALID_NUMBER');return n;};
const text=(s,max=200)=>{check(typeof s==='string'&&s.trim().length>0&&s.length<=max,'INVALID_TEXT');return s.trim();};
const share=(v,q,n)=>Number(BigInt(v)*BigInt(q)/BigInt(n));
const day=iso=>new Date(Date.parse(iso)-5*3600000).toISOString().slice(0,10);
const ref=s=>text(s,100).toUpperCase();
class Engine extends Inventory{
 constructor(store,opening,hook,context={role:'owner',now:()=>new Date().toISOString()}){super(store,opening,hook);this.context=context;}
 state(){const s=super.state();s.commerce={offers:{},authorizations:{},events:[],documents:{}};for(const row of this.records().filter(r=>r.kind==='COMMITTED')){const p=this.records().find(r=>r.id===row.id&&r.kind==='PREPARED');for(const e of p.plan.commerceEvents||[]){s.commerce.events.push(clone(e));if(e.documentRef){check(!s.commerce.documents[e.documentRef],'COMMERCIAL_DOCUMENT_CONFLICT');s.commerce.documents[e.documentRef]=e.id;}if(e.kind==='OFFER')s.commerce.offers[e.offer.id]=clone(e.offer);if(e.kind==='DISCOUNT_AUTHORIZATION')s.commerce.authorizations[e.authorization.id]=clone(e.authorization);if(e.kind==='DISCOUNT_USED')s.commerce.authorizations[e.authorizationId].usedBy=e.operationId;}}return s;}
 financial(s,saleId){const sale=s.sales[saleId],events=s.commerce.events.filter(e=>e.saleId===saleId);const sum=k=>events.filter(e=>e.kind===k).reduce((n,e)=>n+e.amountCents,0);const credit=sum('RETURN_CREDIT');const due=sale?.status==='CANCELLED'?0:(sale?.totalCents||0)+(sale?.deliveryChargedCents||0)-credit;const paid=sum('PAYMENT'),refunded=sum('REFUND');return {dueCents:due,paidCents:paid,refundedCents:refunded,cashCents:paid-refunded,outstandingCents:Math.max(0,due-paid+refunded),refundableCents:Math.max(0,paid-refunded-due)};}
 plan(s,c){
  check(c.commercialVersion===4,'COMMERCIAL_VERSION_REQUIRED');check(this.context&&this.context.role==='owner','OWNER_ONLY');const now=this.context.now();check(!Number.isNaN(Date.parse(now)),'INVALID_SERVER_TIME');
  const events=[];const event=(kind,data={})=>events.push({id:c.operationId+':commercial:'+events.length,kind,operationId:c.operationId,saleId:c.saleId,date:c.date,recordedAt:now,actorRole:'owner',...data});
  const doc=()=>{const r=ref(c.documentRef);check(!s.commerce.documents[r],'DUPLICATE_DOCUMENT');return r;};
  const pure=()=>({sale:{id:c.saleId,version:1,entityType:'inventory'},resources:[],lots:[],effects:[]});
  let p;
  if(c.type==='CONFIGURE_OFFER'){
   const o=c.offer;check(o&&/^demo:[a-zA-Z0-9:_-]+$/.test(o.id),'INVALID_OFFER');const old=s.commerce.offers[o.id];check(c.expectedOfferVersion===(old?old.version:0),'OFFER_VERSION_CONFLICT');check(['Gourmet','Especialidad'].includes(o.family)&&['grano','molido'].includes(o.grind)&&[250,500].includes(o.grams),'INVALID_OFFER');num(o.bags,1);num(o.priceCents);check(o.bags<=8&&/^\d{4}-\d{2}-\d{2}$/.test(o.validFrom)&&/^\d{4}-\d{2}-\d{2}$/.test(o.validUntil)&&o.validFrom<=o.validUntil,'INVALID_OFFER');
   p=pure();event('OFFER',{offer:{id:o.id,name:text(o.name,100),family:o.family,grind:o.grind,grams:o.grams,bags:o.bags,priceCents:o.priceCents,validFrom:o.validFrom,validUntil:o.validUntil,active:o.active===true,version:(old?.version||0)+1,synthetic:true}});
  }else if(c.type==='AUTHORIZE_DISCOUNT'){
   check(/^demo:[a-zA-Z0-9:_-]+$/.test(c.authorizationId)&&!s.commerce.authorizations[c.authorizationId],'INVALID_AUTHORIZATION');num(c.maxCents,1);check(Date.parse(c.expiresAt)>Date.parse(now),'INVALID_EXPIRY');p=pure();event('DISCOUNT_AUTHORIZATION',{authorization:{id:c.authorizationId,saleId:c.saleId,maxCents:c.maxCents,reason:text(c.reason,500),expiresAt:c.expiresAt,approvedBy:'owner'}});
  }else if(c.type==='REGISTER_SALE'||c.type==='RESERVE_SALE'){
   check(Array.isArray(c.items)&&c.items.length>0&&c.items.length<=8,'INVALID_ITEMS');const details=[],aggregate={};let gross=0;
   for(const l of c.items){const offer=s.commerce.offers[l.offerId],r=s.resources[l.resourceId];check(offer&&offer.active&&offer.validFrom<=day(now)&&offer.validUntil>=day(now),'PRICE_NOT_CURRENT');check(l.offerVersion===offer.version,'OFFER_VERSION_CONFLICT');check(r&&r.stage==='PACKAGED'&&r.family===offer.family&&r.grind===offer.grind&&r.grams===offer.grams,'OFFER_RESOURCE_MISMATCH');num(l.quantity,1);const qty=num(l.quantity*offer.bags,1),lineGross=num(l.quantity*offer.priceCents);gross=num(gross+lineGross);details.push({offer:clone(offer),resourceId:r.id,presentations:l.quantity,qty,grossCents:lineGross});if(!aggregate[r.id])aggregate[r.id]={resourceId:r.id,qty:0,grossCents:0,netCents:0};aggregate[r.id].qty=num(aggregate[r.id].qty+qty);aggregate[r.id].grossCents=num(aggregate[r.id].grossCents+lineGross);}
   const discount=num(c.discountCents||0);check(discount<=gross,'INVALID_DISCOUNT');if(discount){const a=s.commerce.authorizations[c.authorizationId];check(a&&!a.usedBy&&a.saleId===c.saleId&&a.maxCents>=discount&&Date.parse(a.expiresAt)>=Date.parse(now),'DISCOUNT_NOT_AUTHORIZED');event('DISCOUNT_USED',{authorizationId:a.id,amountCents:discount});}
   let cumulative=0,allocated=0;for(const l of Object.values(aggregate)){cumulative+=l.grossCents;const next=gross?share(discount,cumulative,gross):0;l.netCents=l.grossCents-(next-allocated);allocated=next;}
   const metadata=c.customer||{};check(Object.keys(metadata).every(k=>['name','phone','zone','note'].includes(k)),'INVALID_CUSTOMER');for(const v of Object.values(metadata))check(typeof v==='string'&&v.length<=500,'INVALID_CUSTOMER');
   p=super.plan(s,{...c,totalCents:gross-discount,lines:Object.values(aggregate).map(l=>({resourceId:l.resourceId,qty:l.qty})),metadata:{customer:metadata.name||'',phone:metadata.phone||'',zone:metadata.zone||'',note:metadata.note||'',date:day(c.date)}});
   p.sale.commercial={version:4,channel:text(c.channel||'Otro',80),grossCents:gross,discountCents:discount,authorizationId:c.authorizationId||null,items:details,allocations:Object.values(aggregate),createdAt:now};event('ORDER_REGISTERED',{grossCents:gross,discountCents:discount,amountCents:p.sale.totalCents+p.sale.deliveryChargedCents});
  }else if(['RECORD_PAYMENT','RECORD_REFUND'].includes(c.type)){
   const sale=s.sales[c.saleId];check(sale?.commercial,'COMMERCIAL_SALE_REQUIRED');check(c.expectedSaleVersion===sale.version,'SALE_VERSION_CONFLICT');const f=this.financial(s,c.saleId),amount=num(c.amountCents,1);if(c.type==='RECORD_PAYMENT'){check(sale.status!=='CANCELLED'&&amount<=f.outstandingCents,'PAYMENT_EXCEEDS_DUE');}else{check(amount<=f.refundableCents,'REFUND_EXCEEDS_CREDIT');text(c.reason,500);}
   p=pure();p.sale=clone(sale);p.sale.version++;p.sale.paid=c.type==='RECORD_PAYMENT'?amount===f.outstandingCents:f.outstandingCents===0;event(c.type==='RECORD_PAYMENT'?'PAYMENT':'REFUND',{amountCents:amount,documentRef:doc(),method:text(c.method||'Otro',60),reason:c.reason||''});
  }else if(c.type==='RECORD_EXPENSE'){
   check(['PUBLICIDAD','ADMINISTRACION','TRANSPORTE','OTROS'].includes(c.category),'CAPITALIZED_COST_REQUIRED');check(!c.linkedSaleId,'SALE_DISTRIBUTION_ALREADY_INCLUDED');p=pure();event('OPERATING_EXPENSE',{category:c.category,amountCents:num(c.amountCents,1),description:text(c.description,500),provider:text(c.provider||'Proveedor ficticio',120),documentRef:doc(),campaign:String(c.campaign||'').slice(0,120),messages:num(c.messages||0),paid:c.paid===true});
  }else if(c.type==='RECORD_EXPENSE_PAYMENT'){
   const expense=s.commerce.events.find(e=>e.kind==='OPERATING_EXPENSE'&&e.operationId===c.sourceOperationId);check(expense,'EXPENSE_NOT_FOUND');const paid=(expense.paid?expense.amountCents:0)+s.commerce.events.filter(e=>e.kind==='EXPENSE_PAYMENT'&&e.sourceOperationId===c.sourceOperationId).reduce((n,e)=>n+e.amountCents,0),amount=num(c.amountCents,1);check(paid+amount<=expense.amountCents,'PAYMENT_EXCEEDS_DUE');p=pure();event('EXPENSE_PAYMENT',{sourceOperationId:c.sourceOperationId,amountCents:amount,documentRef:doc()});
  }else if(c.type==='RECORD_PURCHASE_PAYMENT'){
   const capital=s.commerce.events.filter(e=>e.kind==='CAPITALIZED_COST'&&e.operationId===c.sourceOperationId).reduce((n,e)=>n+e.amountCents,0);const paid=s.commerce.events.filter(e=>e.kind==='PURCHASE_PAYMENT'&&e.sourceOperationId===c.sourceOperationId).reduce((n,e)=>n+e.amountCents,0);const amount=num(c.amountCents,1);check(capital>0&&paid+amount<=capital,'PURCHASE_PAYMENT_EXCEEDS_COST');p=pure();event('PURCHASE_PAYMENT',{sourceOperationId:text(c.sourceOperationId),amountCents:amount,documentRef:doc()});
  }else{
   const sale=s.sales[c.saleId];if(c.type==='DELIVER_SALE')check(!sale?.delivered,'INVALID_SALE_STATE');if(['PAY_SALE'].includes(c.type))throw Error('USE_RECORD_PAYMENT');if(['EDIT_SALE','CANCEL_SALE','DISPATCH_SALE','DELIVER_SALE','RETURN_SALE'].includes(c.type))check(sale?.commercial,'COMMERCIAL_SALE_REQUIRED');
   const freight=c.type==='RECEIVE_LOT'?num(c.freightCents||0):0;p=super.plan(s,{...c,...(c.type==='RECEIVE_LOT'?{acquisitionCents:num(c.acquisitionCents+freight)}:{})});
   if(c.type==='RECEIVE_LOT'){Object.assign(p.lots[0],{name:text(c.lotName||c.lotId,120),producer:String(c.producer||'').slice(0,200),freightCents:freight});}
   if(['RECEIVE_LOT','RECEIVE_SUPPLY','ROAST','PREPARE_BAGS'].includes(c.type)){
    const amount=c.type==='RECEIVE_LOT'?num(c.acquisitionCents+freight+c.processingCents):c.type==='RECEIVE_SUPPLY'?c.totalCostCents:c.processingCents;
    if(amount>0)event('CAPITALIZED_COST',{category:c.type==='RECEIVE_LOT'?'MATERIA_PRIMA':c.type==='RECEIVE_SUPPLY'?'EMPAQUES':'PROCESAMIENTO',amountCents:amount,lotId:c.lotId||s.resources[c.resourceId]?.lot||null,documentRef:doc(),description:String(c.description||c.type).slice(0,500)});
   }
   if(c.type==='DELIVER_SALE')event('DELIVERY_RECORDED');
   if(c.type==='WASTE')event('STOCK_LOSS',{amountCents:-p.effects.reduce((n,e)=>n+e.valueDelta,0)});
   if(c.type==='DISPATCH_SALE')event('DISPATCH_RECOGNIZED',{amountCents:sale.totalCents+sale.deliveryChargedCents,costCents:sale.costCents,distributionCents:sale.deliveryCostCents});
   if(c.type==='RETURN_SALE'){
    let credit=0,cost=0;for(const item of c.lines){const before=sale.lines.find(l=>l.resourceId===item.resourceId),after=p.sale.lines.find(l=>l.resourceId===item.resourceId),a=sale.commercial.allocations.find(l=>l.resourceId===item.resourceId);credit+=share(a.netCents,after.returned,a.qty)-share(a.netCents,before.returned,a.qty);cost+=after.returnedCostCents-before.returnedCostCents;}
    event('RETURN_CREDIT',{amountCents:credit,costCents:cost,reason:c.reason});
   }
   if(c.type==='CANCEL_SALE'&&sale.status!=='CANCELLED')event('ORDER_CANCELLED',{amountCents:sale.totalCents+sale.deliveryChargedCents});
  }
  // V3 valida también el sobre de operaciones puramente comerciales.
  check(typeof c.date==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(c.date)&&!Number.isNaN(Date.parse(c.date)),'INVALID_DATE');text(c.responsible,120);p.commerceEvents=events;return p;
 }
 reports(s,from='0000-01-01',to='9999-12-31'){
  const events=s.commerce.events.filter(e=>day(e.date)>=from&&day(e.date)<=to),sum=(k,f='amountCents')=>events.filter(e=>e.kind===k).reduce((n,e)=>n+(e[f]||0),0);
  const revenue=sum('DISPATCH_RECOGNIZED')-sum('RETURN_CREDIT'),cogs=sum('DISPATCH_RECOGNIZED','costCents')-sum('RETURN_CREDIT','costCents'),distribution=sum('DISPATCH_RECOGNIZED','distributionCents'),opex=sum('OPERATING_EXPENSE');
  const orders=events.filter(e=>e.kind==='ORDER_REGISTERED'),sales=Object.values(s.sales).filter(x=>x.commercial);const customers={};
  for(const sale of sales){const raw=sale.metadata.phone||'',phone=raw.replace(/\D/g,'').replace(/^51(?=\d{9}$)/,'');const key=phone||sale.id;if(!customers[key])customers[key]={id:key,name:sale.metadata.customer||'Sin nombre',phone,orders:[],purchaseCount:0,totalCents:0};const customer=customers[key];customer.orders.push(sale.id);if(['DISPATCHED','PART_RETURNED'].includes(sale.status))customer.purchaseCount++;if(sale.status!=='CANCELLED')customer.totalCents+=this.financial(s,sale.id).dueCents;}
  const top={};for(const e of events.filter(e=>e.kind==='DISPATCH_RECOGNIZED'))for(const l of s.sales[e.saleId].lines){const key=l.family+' '+l.grind+' '+l.grams+'g';top[key]=(top[key]||0)+l.qty;}
  return {from,to,registeredOrders:orders.length,registeredCents:orders.reduce((n,e)=>n+e.amountCents,0),dispatchedOrders:events.filter(e=>e.kind==='DISPATCH_RECOGNIZED').length,deliveredOrders:events.filter(e=>e.kind==='DELIVERY_RECORDED').length,revenueCents:revenue,collectionsCents:sum('PAYMENT'),refundsCents:sum('REFUND'),netCollectionsCents:sum('PAYMENT')-sum('REFUND'),cogsCents:cogs,distributionCents:distribution,operatingExpenseCents:opex,grossMarginCents:revenue-cogs,estimatedProfitCents:revenue-cogs-distribution-opex-sum('STOCK_LOSS'),stockLossCents:sum('STOCK_LOSS'),paidOperatingExpensesCents:sum('EXPENSE_PAYMENT')+events.filter(e=>e.kind==='OPERATING_EXPENSE'&&e.paid).reduce((n,e)=>n+e.amountCents,0),purchasePaymentsCents:sum('PURCHASE_PAYMENT'),outstandingCents:sales.reduce((n,sale)=>n+this.financial(s,sale.id).outstandingCents,0),refundableCents:sales.reduce((n,sale)=>n+this.financial(s,sale.id).refundableCents,0),topProducts:top,customers:Object.values(customers)};
 }
}
return {Engine,EPOCH,day};
});
