/* Solo para el Apps Script independiente y la hoja sintética autorizados. */
const CV_TEST_SHEET_ID_ = '1CtK6KD995Pu2Fzc_na89Ajc0KQ0QLuGq3UFhj4UdLSA';
const CV_TEST_SCRIPT_ID_ = "1m79GZ0TkADVZuji4E1XFnPmdMCAHCWI-FRZvawkx9vGnxzmao0NfPki3";
const CV_TABS_ = ['DiarioV2','EfectosV2','AperturaV2','VerificacionesV2'];
function cvBook_(){
 if(ScriptApp.getScriptId()!==CV_TEST_SCRIPT_ID_)throw Error('WRONG_SCRIPT');
 const ss=SpreadsheetApp.openById(CV_TEST_SHEET_ID_);
 if(ss.getName()!=='CasaVieja_Pruebas_SINTETICA'||ss.getSheetByName('Control').getRange('B3').getValue()!=='TEST_ONLY')throw Error('WRONG_DESTINATION');
 return ss;
}
function cvLockedBase5e_(fn){const lock=LockService.getScriptLock();lock.waitLock(30000);try{return fn();}finally{lock.releaseLock();}}

/* Núcleo compartido de pruebas. No tiene red ni credenciales. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CVInventoryBase=api;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const EPOCH='TEST_ONLY_V3';
const clone=x=>JSON.parse(JSON.stringify(x));
const canonical=x=>Array.isArray(x)?'['+x.map(canonical).join(',')+']':x&&typeof x==='object'?'{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k])).join(',')+'}':JSON.stringify(x);
function require_(ok,code){if(!ok)throw Error(code);}
function uint(x,min=0){require_(Number.isSafeInteger(x)&&x>=min&&x<=100000000000,'INVALID_NUMBER');return x;}
function id(x,prefix=''){require_(typeof x==='string'&&x.length<=120&&new RegExp('^'+prefix+'[a-zA-Z0-9:_-]+$').test(x),'INVALID_ID');return x;}
function distinct(rows,key){const map=new Map();for(const row of rows){const k=key(row);if(map.has(k))require_(canonical(map.get(k))===canonical(row),'JOURNAL_CONFLICT');else map.set(k,row);}return [...map.values()];}
class BaseEngine {
 constructor(store,opening,hook=()=>{}){this.store=store;this.opening=clone(opening);this.hook=hook;require_(opening.epoch===EPOCH,'WRONG_EPOCH');for(const [key,r]of Object.entries(opening.resources)){id(key,'demo:');uint(r.qty);uint(r.unitCostCents);uint(r.grams,1);require_(r.lot&&r.family&&['grano','molido'].includes(r.grind),'INVALID_OPENING');}}
 records(){return distinct(this.store.readJournal(),r=>r.kind+':'+r.id);}
 effects(){return distinct(this.store.readEffects(),r=>r.id);}
 status(operationId){id(operationId);const rows=this.records(),p=rows.find(x=>x.id===operationId&&x.kind==='PREPARED');const commit=rows.find(x=>x.id===operationId&&x.kind==='COMMITTED');const rejected=rows.find(x=>x.id===operationId&&x.kind==='REJECTED');return rejected?clone(rejected.result):commit?clone(commit.result):{epoch:EPOCH,operationId,state:p?'PREPARED':'UNKNOWN'};}
 finish(p){
  for(const effect of p.plan.effects){const old=this.effects().find(x=>x.id===effect.id);if(old)require_(canonical(old)===canonical(effect),'EFFECT_CONFLICT');else {this.hook('beforeEffect',effect);this.store.appendEffect(clone(effect));this.hook('afterEffect',effect);}}
  for(const e of p.plan.effects)require_(this.effects().some(x=>x.id===e.id&&canonical(x)===canonical(e)),'EFFECT_NOT_DURABLE');
  if(this.status(p.id).state!=='COMMITTED'){this.hook('beforeCommit',p);this.store.appendJournal({kind:'COMMITTED',id:p.id,result:p.result});this.hook('afterCommit',p);}
  return this.status(p.id);
 }
 recover(){const rows=this.records(),committed=new Set(rows.filter(x=>x.kind==='COMMITTED').map(x=>x.id));for(const p of rows.filter(x=>x.kind==='PREPARED'))if(!committed.has(p.id)){this.finish(p);committed.add(p.id);}}
 execute(input){
  require_(input&&typeof input==='object'&&!Array.isArray(input),'INVALID_COMMAND');
  require_(JSON.stringify(input).length<25000,'COMMAND_TOO_LARGE');
  const c=clone(input);require_(c.schemaVersion===2&&c.epoch===EPOCH,'PROTOCOL_REJECTED');id(c.operationId);id(c.deviceId);id(c.saleId,'future:');
  const fingerprint=canonical(c);const rejected=this.records().find(x=>x.id===c.operationId&&x.kind==='REJECTED');if(rejected){require_(rejected.fingerprint===fingerprint,'IDEMPOTENCY_CONFLICT');throw Error(rejected.result.error);}const previous=this.records().find(x=>x.id===c.operationId&&x.kind==='PREPARED');
  if(previous){require_(previous.fingerprint===fingerprint,'IDEMPOTENCY_CONFLICT');if(this.status(c.operationId).state==='COMMITTED')return this.status(c.operationId);}
  this.recover();if(previous)return this.status(c.operationId);
  const s=this.state();let plan;try{plan=this.plan(s,c);}catch(error){if(!/^[A-Z_]+$/.test(error.message))throw error;this.store.appendJournal({kind:'REJECTED',id:c.operationId,fingerprint,command:c,result:{epoch:EPOCH,operationId:c.operationId,saleId:c.saleId,state:'REJECTED',error:error.message,retryable:false}});throw error;}
  const p={kind:'PREPARED',id:c.operationId,fingerprint,command:c,plan,result:{epoch:EPOCH,operationId:c.operationId,state:'COMMITTED',revision:s.revision+1,saleId:c.saleId,saleVersion:plan.sale.version}};
  this.hook('beforePrepare',p);this.store.appendJournal(p);this.hook('afterPrepare',p);return this.finish(p);
 }
 metadata(input){require_(input&&typeof input==='object'&&!Array.isArray(input),'INVALID_METADATA');const out={};for(const [k,v]of Object.entries(input)){require_(['customer','phone','zone','note','date'].includes(k)&&typeof v==='string'&&v.length<=500,'INVALID_METADATA');out[k]=v;}return out;}
}
return {BaseEngine,EPOCH,canonical,clone,uint,id,require_};
});

/* Inventario sintético: cantidades enteras en gramos o unidades; dinero en céntimos. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./journal.js'):root.CVInventoryBase);if(typeof module==='object'&&module.exports)module.exports=api;else root.CVInventory=api;})(typeof globalThis==='object'?globalThis:this,function(B){
'use strict';
const {BaseEngine,EPOCH,canonical,clone,uint,id,require_:check}=B;
const proportion=(value,qty,total)=>Number(BigInt(value)*BigInt(qty)/BigInt(total));
class Engine extends BaseEngine{
 constructor(store,opening={epoch:EPOCH,resources:{}},hook=()=>{}){check(opening.epoch===EPOCH&&Object.keys(opening.resources).length===0,'INVALID_OPENING');super(store,opening,hook);}
 state(){
  const rows=this.records(),effects=this.effects(),s={epoch:EPOCH,revision:0,resources:{},lots:{},sales:{},effects:[]};
  const preparedById=new Map(rows.filter(r=>r.kind==='PREPARED').map(r=>[r.id,r]));
  const effectsById=new Map(effects.map(e=>[e.id,canonical(e)]));
  for(const commit of rows.filter(r=>r.kind==='COMMITTED')){
   const p=preparedById.get(commit.id);check(p&&p.result.revision===s.revision+1&&canonical(commit.result)===canonical(p.result)&&p.fingerprint===canonical(p.command),'CORRUPT_COMMIT');
   for(const r of p.plan.resources||[]){check(!s.resources[r.id],'RESOURCE_EXISTS');s.resources[r.id]=clone(r);}
   for(const lot of p.plan.lots||[]){check(!s.lots[lot.id],'LOT_EXISTS');s.lots[lot.id]=clone(lot);}
   for(const e of p.plan.effects){check(effectsById.get(e.id)===canonical(e),'INCOMPLETE_COMMIT');const r=s.resources[e.resourceId];check(r,'RESOURCE_UNAVAILABLE');r.physical+=e.qtyDelta;r.reserved+=e.reservedDelta;r.valueCents+=e.valueDelta;r.reservedValueCents+=e.reservedValueDelta;r.qty=r.physical-r.reserved;check([r.physical,r.reserved,r.valueCents,r.reservedValueCents,r.qty].every(Number.isSafeInteger)&&r.qty>=0&&r.reserved>=0&&r.valueCents>=r.reservedValueCents&&r.reservedValueCents>=0,'CORRUPT_STOCK');s.effects.push(clone(e));}
   if(p.plan.sale.entityType==='sale')s.sales[p.plan.sale.id]=clone(p.plan.sale);s.revision=p.result.revision;
  }return s;
 }
 plan(s,c){
  check(typeof c.date==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(c.date)&&!Number.isNaN(Date.parse(c.date)),'INVALID_DATE');
  check(typeof c.responsible==='string'&&c.responsible.trim().length>0&&c.responsible.length<=120,'INVALID_RESPONSIBLE');
  const effects=[],resources=[],lots=[];let sale={id:c.saleId,version:1,entityType:'inventory'};
  const resource=key=>{id(key,'demo:');const r=s.resources[key];check(r,'RESOURCE_UNAVAILABLE');return r;};
  const effect=(r,kind,physical=0,reserved=0,value=0,reservedValue=0,extra={})=>{check([physical,reserved,value,reservedValue].every(Number.isSafeInteger),'INVALID_NUMBER');effects.push({id:c.operationId+':'+effects.length,operationId:c.operationId,saleId:c.saleId,date:c.date,responsible:c.responsible,lot:r.lot,product:r.product,unit:r.unit,resourceId:r.id,kind,qtyDelta:physical,reservedDelta:reserved,valueDelta:value,reservedValueDelta:reservedValue,...extra});};
  const define=(key,attrs)=>{id(key,'demo:');check(!s.resources[key]&&!resources.some(x=>x.id===key),'RESOURCE_EXISTS');const r={id:key,physical:0,reserved:0,valueCents:0,reservedValueCents:0,qty:0,...attrs};resources.push(r);return r;};
  const allocate=(r,n)=>{uint(n,1);check(r.qty>=n,'INSUFFICIENT_STOCK');return proportion(r.valueCents-r.reservedValueCents,n,r.qty);};
  const reason=()=>check(typeof c.reason==='string'&&c.reason.trim().length>0&&c.reason.length<=500,'REASON_REQUIRED');
  if(c.type==='RECEIVE_LOT'){
   id(c.lotId,'demo:');check(!s.lots[c.lotId],'LOT_EXISTS');check(['Gourmet','Especialidad'].includes(c.family),'INVALID_FAMILY');check(typeof c.origin==='string'&&c.origin.trim().length>0&&c.origin.length<=200&&typeof c.coffeeType==='string'&&c.coffeeType.length>0&&c.coffeeType.length<=120,'INVALID_LOT');uint(c.grams,1);const cost=uint(uint(c.acquisitionCents)+uint(c.processingCents));
   const lot={id:c.lotId,origin:c.origin,coffeeType:c.coffeeType,family:c.family,receivedGrams:c.grams,acquisitionCents:c.acquisitionCents,processingCents:c.processingCents,date:c.date,operationId:c.operationId};lots.push(lot);
   const r=define(c.resourceId,{lot:c.lotId,product:'pergamino',stage:'PARCHMENT',family:c.family,unit:'g'});effect(r,'LOT_RECEIPT',c.grams,0,cost);
  }else if(c.type==='RECEIVE_SUPPLY'){
   check(['BAG250','BAG500','LABEL'].includes(c.supplyKind),'INVALID_SUPPLY');uint(c.qty,1);uint(c.totalCostCents);id(c.lotId,'demo:');
   const r=define(c.resourceId,{lot:c.lotId,product:c.supplyKind,stage:'SUPPLY',unit:'unit',supplyKind:c.supplyKind});effect(r,'SUPPLY_RECEIPT',c.qty,0,c.totalCostCents);
  }else if(c.type==='ROAST'){
   const r=resource(c.resourceId);check(r.stage==='PARCHMENT','INVALID_STAGE');uint(c.outputGrams,1);uint(c.wasteGrams);uint(c.processingCents);const input=uint(c.outputGrams+c.wasteGrams,1),cost=allocate(r,input);
   const out=define(c.outputResourceId,{lot:r.lot,product:'tostado',stage:'BULK',unit:'g',family:r.family});
   effect(r,'ROAST_INPUT',-input,0,-cost);effect(out,'ROAST_OUTPUT',c.outputGrams,0,uint(cost+c.processingCents),0,{processingCents:c.processingCents});effect(r,'PROCESS_WASTE',0,0,0,0,{wasteGrams:c.wasteGrams,fromStage:'PARCHMENT'});
  }else if(c.type==='PREPARE_BAGS'){
   const r=resource(c.resourceId);check(r.stage==='BULK','INVALID_STAGE');check([250,500].includes(c.bagGrams)&&['grano','molido'].includes(c.grind),'INVALID_PRESENTATION');uint(c.bags,1);uint(c.wasteGrams);uint(c.processingCents);const used=uint(c.bags*c.bagGrams+c.wasteGrams,1),coffeeCost=allocate(r,used);
   check(Array.isArray(c.materials)&&c.materials.length===2,'INVALID_RECIPE');const seen=new Set();let cost=coffeeCost+c.processingCents;
   for(const item of c.materials){const m=resource(item.resourceId);check(m.stage==='SUPPLY'&&[c.bagGrams===250?'BAG250':'BAG500','LABEL'].includes(m.supplyKind)&&!seen.has(m.supplyKind),'INVALID_RECIPE');seen.add(m.supplyKind);const v=allocate(m,c.bags);cost+=v;effect(m,'PREPARATION_SUPPLY',-c.bags,0,-v);}
   const out=define(c.outputResourceId,{lot:r.lot,product:r.family+' '+c.grind+' '+c.bagGrams+'g',stage:'PACKAGED',unit:'unit',family:r.family,grind:c.grind,grams:c.bagGrams,preparedBy:c.responsible});
   effect(r,'PREPARATION_COFFEE',-used,0,-coffeeCost);effect(out,'PREPARATION_OUTPUT',c.bags,0,uint(cost),0,{processingCents:c.processingCents});effect(r,'PROCESS_WASTE',0,0,0,0,{wasteGrams:c.wasteGrams,fromStage:'BULK'});
  }else if(c.type==='REGISTER_SALE'||c.type==='RESERVE_SALE'){
   check(!s.sales[c.saleId],'SALE_EXISTS');check(Array.isArray(c.lines)&&c.lines.length>0&&c.lines.length<=20,'INVALID_LINES');const seen=new Set();const lines=c.lines.map(l=>{const r=resource(l.resourceId);check(r.stage==='PACKAGED'&&!seen.has(r.id),'INVALID_LINES');seen.add(r.id);const cost=allocate(r,l.qty);effect(r,'SALE_RESERVATION',0,l.qty,0,cost);return {resourceId:r.id,qty:l.qty,lot:r.lot,family:r.family,grind:r.grind,grams:r.grams,totalCostCents:cost,returned:0,returnedCostCents:0};});
   const total=uint(c.totalCents),cost=uint(lines.reduce((n,l)=>n+l.totalCostCents,0)),shipping=uint(c.deliveryCostCents||0),charged=uint(c.deliveryChargedCents||0);
   sale={id:c.saleId,entityType:'sale',version:1,status:'RESERVED',lines,totalCents:total,costCents:cost,profitCents:total+charged-shipping-cost,deliveryCostCents:shipping,deliveryChargedCents:charged,metadata:this.metadata(c.metadata||{}),originOperationId:c.operationId};
  }else if(c.type==='WASTE'){
   reason();const r=resource(c.resourceId),cost=allocate(r,c.qty);effect(r,'STOCK_WASTE',-c.qty,0,-cost,0,{reason:c.reason,wasteGrams:r.unit==='g'?c.qty:r.stage==='PACKAGED'?uint(c.qty*r.grams):0});
  }else{
   const old=s.sales[c.saleId];check(old,'FUTURE_SALE_NOT_FOUND');sale=clone(old);
   if(c.type==='CANCEL_SALE'&&old.status==='CANCELLED')return {sale,effects,resources,lots};
   check(c.expectedSaleVersion===old.version,'SALE_VERSION_CONFLICT');
   if(c.type==='CANCEL_SALE'){
    reason();check(old.status==='RESERVED','RETURN_RECEIPT_REQUIRED');for(const l of sale.lines)effect(resource(l.resourceId),'RESERVATION_RELEASE',0,-l.qty,0,-l.totalCostCents, {reverses:old.originOperationId});sale.status='CANCELLED';sale.cancelReason=c.reason;
   }else if(c.type==='DISPATCH_SALE'){
    check(old.status==='RESERVED','INVALID_SALE_STATE');for(const l of sale.lines)effect(resource(l.resourceId),'DISPATCH',-l.qty,-l.qty,-l.totalCostCents,-l.totalCostCents,{reservationOperationId:old.originOperationId});sale.status='DISPATCHED';
   }else if(c.type==='RETURN_SALE'){
    reason();check(['DISPATCHED','PART_RETURNED'].includes(old.status),'INVALID_SALE_STATE');check(Array.isArray(c.lines)&&c.lines.length>0&&c.lines.length<=20,'INVALID_LINES');const seen=new Set();
    for(const item of c.lines){check(!seen.has(item.resourceId),'INVALID_LINES');seen.add(item.resourceId);const l=sale.lines.find(x=>x.resourceId===item.resourceId);check(l,'INVALID_LINES');uint(item.qty,1);check(l.returned+item.qty<=l.qty,'RETURN_EXCEEDS_DISPATCH');const cumulative=proportion(l.totalCostCents,l.returned+item.qty,l.qty),cost=cumulative-l.returnedCostCents;effect(resource(l.resourceId),'PHYSICAL_RETURN',item.qty,0,cost,0,{dispatchSaleId:sale.id,reason:c.reason});l.returned+=item.qty;l.returnedCostCents=cumulative;}
    sale.status=sale.lines.every(l=>l.returned===l.qty)?'RETURNED':'PART_RETURNED';
   }else if(c.type==='EDIT_SALE'){
    check(!['totalCents','profitCents','costCents','lines','deliveryCostCents','deliveryChargedCents'].some(k=>Object.hasOwnProperty.call(c,k)),'FINANCIAL_EDIT_NOT_ALLOWED');sale.metadata=Object.assign({},sale.metadata,this.metadata(c.metadata||{}));
   }else if(c.type==='PAY_SALE'||c.type==='DELIVER_SALE'){
    check(c.type==='PAY_SALE'?['RESERVED','DISPATCHED'].includes(old.status):old.status==='DISPATCHED','INVALID_SALE_STATE');sale[c.type==='PAY_SALE'?'paid':'delivered']=true;
   }else throw Error('COMMAND_NOT_ALLOWED');sale.version++;
  }
  return {sale,effects,resources,lots};
 }
}
return {Engine,EPOCH,canonical,clone};
});

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
 state(){const s=super.state();s.commerce={offers:{},authorizations:{},events:[],documents:{}};const records=this.records(),preparedById=new Map(records.filter(r=>r.kind==='PREPARED').map(r=>[r.id,r]));for(const row of records.filter(r=>r.kind==='COMMITTED')){const p=preparedById.get(row.id);for(const e of p.plan.commerceEvents||[]){s.commerce.events.push(clone(e));if(e.documentRef){check(!s.commerce.documents[e.documentRef],'COMMERCIAL_DOCUMENT_CONFLICT');s.commerce.documents[e.documentRef]=e.id;}if(e.kind==='OFFER')s.commerce.offers[e.offer.id]=clone(e.offer);if(e.kind==='DISCOUNT_AUTHORIZATION')s.commerce.authorizations[e.authorization.id]=clone(e.authorization);if(e.kind==='DISCOUNT_USED')s.commerce.authorizations[e.authorizationId].usedBy=e.operationId;}}return s;}
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

/* Perfiles confirmados por el propietario. Solo candidato de laboratorio. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('../../fase4/commercial.js'):root.CVCommercial,typeof module==='object'&&module.exports?require('../../fase3/journal.js'):root.CVInventoryBase);if(typeof module==='object'&&module.exports)module.exports=api;else root.CVZeroAccess=api;})(typeof globalThis==='object'?globalThis:this,function(C,B){
'use strict';const {clone,canonical}=B,check=(ok,e)=>{if(!ok)throw Error(e)};
const operational=['REGISTER_SALE','RESERVE_SALE','EDIT_SALE','CANCEL_SALE','RECORD_PAYMENT','DISPATCH_SALE','DELIVER_SALE','RECEIVE_LOT','RECEIVE_SUPPLY','ROAST','PREPARE_BAGS','WASTE','RECORD_EXPENSE','RECORD_EXPENSE_PAYMENT','RECORD_PURCHASE_PAYMENT'];
const roles={administrator:[...operational,'CONFIGURE_OFFER','AUTHORIZE_DISCOUNT'],operations:[...operational],seller:['REGISTER_SALE','RESERVE_SALE']};
const financial=['totalCents','costCents','unitCostCents','profitCents','deliveryCostCents','deliveryChargedCents','discountCents','authorizationId','lines'];
function principal(subject,events){const event=events.filter(x=>x.target===subject).at(-1);check(event?.active===true&&Object.hasOwn(roles,event.role),'ACCESS_DENIED');return {subject,role:event.role};}
function owns(engine,id){const p=engine.records().find(r=>r.id===id&&['PREPARED','REJECTED'].includes(r.kind));if(p&&engine.actor.role==='seller')check((p.plan?.audit||p.audit)?.subject===engine.actor.subject,'ACCESS_DENIED');}
class Engine extends C.Engine{
 constructor(store,hook,ctx){check(ctx?.actor&&Object.hasOwn(roles,ctx.actor.role)&&ctx.now,'IDENTITY_REQUIRED');super({readJournal:()=>store.readJournal(),readEffects:()=>store.readEffects(),appendEffect:r=>store.appendEffect(r),appendJournal:r=>store.appendJournal(r.kind==='REJECTED'?{...r,audit:{subject:ctx.actor.subject,role:ctx.actor.role,serverAt:ctx.now()}}:r)},undefined,hook,{role:'owner',now:ctx.now});this.actor=ctx.actor;this.policy=ctx.policy||{};this.recovering=false;}
 execute(c){check(c&&typeof c==='object'&&!Array.isArray(c),'INVALID_COMMAND');check(!['role','roles','actor','actorId','subject','authenticatedUser','audit','permissions','policy','policyRef','policySnapshot'].some(k=>Object.hasOwn(c,k)),'IDENTITY_SPOOFING');const prior=this.records().find(r=>r.id===c.operationId&&['PREPARED','REJECTED'].includes(r.kind));if(prior)check((prior.plan?.audit||prior.audit)?.subject===this.actor.subject,'OPERATION_ACTOR_MISMATCH');owns(this,c.operationId);return super.execute(c);}
 status(id){if(!this.recovering)owns(this,id);return super.status(id);}
 finish(p){const previous=this.recovering;this.recovering=true;try{return super.finish(p)}finally{this.recovering=previous}}
 plan(s,input){check(roles[this.actor.role].includes(input.type),'PERMISSION_DENIED');const c=clone(input);c.date=this.context.now();c.responsible=this.actor.subject;
  if(this.actor.role==='seller'){check(!financial.some(k=>Object.hasOwn(c,k)),'FINANCIAL_FIELDS_FORBIDDEN');check(Array.isArray(c.items)&&c.items.every(i=>Object.keys(i).every(k=>['offerId','offerVersion','resourceId','quantity'].includes(k))),'INVALID_ITEMS');const shipping=this.policy.shippingByZone?.[c.customer?.zone||''];check(shipping&&Number.isSafeInteger(shipping.costCents)&&shipping.costCents>=0&&Number.isSafeInteger(shipping.chargedCents)&&shipping.chargedCents>=0,'SHIPPING_POLICY_REQUIRED');c.deliveryCostCents=shipping.costCents;c.deliveryChargedCents=shipping.chargedCents;}
  const p=super.plan(s,c);p.audit={subject:this.actor.subject,role:this.actor.role,serverAt:c.date,submittedAt:input.date,type:input.type,operationId:input.operationId};p.policyRef={version:this.policy.version||0,environment:'TEST_ONLY',rulesApprovedForProduction:false};for(const e of p.commerceEvents||[])e.actorRole=this.actor.role;return p;
 }
}
function snapshot(engine,{offset=0,limit=50,revision}={}){check(Number.isSafeInteger(offset)&&offset>=0&&Number.isSafeInteger(limit)&&limit>0&&limit<=100,'INVALID_PAGE');const s=engine.state();check(revision===undefined||revision===s.revision,'REVISION_CHANGED');const management=engine.actor.role!=='seller',pick=(o,keys)=>Object.fromEntries(keys.filter(k=>o[k]!==undefined).map(k=>[k,clone(o[k])])),resources=Object.values(s.resources).filter(r=>management||r.stage==='PACKAGED').map(r=>pick(r,['id','product','lot','stage','family','grind','grams','unit','physical','reserved','qty','supplyKind',...(management?['valueCents','reservedValueCents']:[])]));const sales=Object.values(s.sales).filter(sale=>management||engine.records().some(p=>p.kind==='PREPARED'&&p.id===sale.originOperationId&&p.plan.audit?.subject===engine.actor.subject)).map(sale=>({...pick(sale,['id','version','status','totalCents','deliveryChargedCents','metadata',...(management?['costCents','deliveryCostCents']:[])]),lines:sale.lines.map(l=>pick(l,['resourceId','qty','lot','family','grind','grams','returned',...(management?['totalCostCents']:[])]))}));const offers=Object.values(s.commerce.offers).filter(o=>o.active).map(o=>pick(o,['id','name','family','grind','grams','bags','priceCents','validFrom','validUntil','version']));return {epoch:s.epoch,revision:s.revision,profile:engine.actor.role,resources:resources.slice(offset,offset+limit),sales:sales.slice(offset,offset+limit),offers:offers.slice(offset,offset+limit),next:Math.max(resources.length,sales.length,offers.length)>offset+limit?offset+limit:null};}
class Service{
 constructor(io){check(io.environment==='TEST_ONLY','TEST_ONLY_REQUIRED');this.io=io;}
 handle(envelope){const request=this.io.verify(envelope);check(request.version===2&&request.destination==='TEST_ONLY_ZERO_1','PROTOCOL_REJECTED');return this.io.lock(()=>{const events=this.io.users.read(),actor=principal(request.subject,events),p=request.payload;
  if(request.action==='bootstrap')return {subject:actor.subject,profile:actor.role,capabilities:roles[actor.role],epoch:'TEST_ONLY_V3',destination:'TEST_ONLY_ZERO_1',environment:'TEST_ONLY'};
  if(request.action==='users'||request.action==='setUser'||request.action==='configure'){check(actor.role==='administrator','PERMISSION_DENIED');if(request.action==='users')return {users:Object.values(Object.fromEntries(events.map(e=>[e.target,e]))).map(e=>({subject:e.target,role:e.role,active:e.active})),revision:events.length};check(p&&/^admin-[a-zA-Z0-9_-]{1,90}$/.test(p.operationId),'INVALID_ADMIN_COMMAND');const history=request.action==='setUser'?events:this.io.policies.read(),old=history.find(e=>e.operationId===p.operationId);if(old){check(old.actor===actor.subject,'OPERATION_ACTOR_MISMATCH');check(old.fingerprint===canonical(p),'IDEMPOTENCY_CONFLICT');return {state:'COMMITTED',operationId:p.operationId,revision:old.revision};}check(p.expectedRevision===history.length,'VERSION_CONFLICT');let row;if(request.action==='setUser'){check(/^google:[0-9]{5,64}$/.test(p.subject)&&Object.hasOwn(roles,p.role)&&typeof p.active==='boolean','INVALID_BINDING');const current={...Object.fromEntries(events.map(e=>[e.target,e])),[p.subject]:{role:p.role,active:p.active}};check(Object.values(current).some(e=>e.active&&e.role==='administrator'),'LAST_ADMIN_REQUIRED');row={target:p.subject,role:p.role,active:p.active};}else{check(p.rules&&Object.keys(p.rules).every(k=>['shippingByZone','preparationByGrams'].includes(k))&&JSON.stringify(p.rules).length<4000,'INVALID_POLICY');row={rules:clone(p.rules),environment:'TEST_ONLY'};}const event={...row,kind:request.action,operationId:p.operationId,fingerprint:canonical(p),revision:history.length+1,actor:actor.subject,serverAt:this.io.now()};(request.action==='setUser'?this.io.users:this.io.policies).append(event);return {state:'COMMITTED',operationId:p.operationId,revision:event.revision};}
  const policies=this.io.policies.read(),policy=policies.at(-1)?.rules||{},engine=new Engine(this.io.store(),this.io.hook,{actor,policy:{...policy,version:policies.length},now:this.io.now});
  if(request.action==='execute')return engine.execute(p);if(request.action==='status')return engine.status(p);if(request.action==='dashboard')return CV5DView.dashboard(engine,p);if(request.action==='snapshot')return p?.format==='ui5d'?CV5DView.snapshot(engine):snapshot(engine,p||{});if(request.action==='reports'){check(actor.role!=='seller','PERMISSION_DENIED');check(p&&/^\d{4}-\d{2}-\d{2}$/.test(p.from)&&/^\d{4}-\d{2}-\d{2}$/.test(p.to)&&p.from<=p.to,'INVALID_PERIOD');return engine.reports(engine.state(),p.from,p.to);}throw Error('PERMISSION_DENIED');});
 }
}
return {roles,principal,Engine,snapshot,Service};});

/* Reutiliza exclusivamente las guardas y bloqueo del proyecto autorizado. V2 permanece disponible. */
const INV_TABS_=['DiarioInventarioV3','MovimientosInventarioV3','VerificacionesInventarioV3'];
function invReadBase5e_(ss,name){if(!INV_TABS_.includes(name))throw Error('TAB_FORBIDDEN');const sh=ss.getSheetByName(name);if(!sh)throw Error('SETUP_REQUIRED');const n=sh.getLastRow();return n<2?[]:sh.getRange(2,1,n-1,3).getValues().map(r=>JSON.parse(r[2]));}
function invAppendBase5e_(ss,name,r){if(!INV_TABS_.includes(name))throw Error('TAB_FORBIDDEN');const raw=JSON.stringify(r);if(raw.length>40000)throw Error('RECORD_TOO_LARGE');ss.getSheetByName(name).appendRow([r.id,r.kind,raw]);SpreadsheetApp.flush();}
function invEngine_(){
 const ss=cvBook_();let journal=invRead_(ss,INV_TABS_[0]),effects=invRead_(ss,INV_TABS_[1]);
 // Cache solo durante el bloqueo actual. Cada append se relee de Sheets antes de confirmar.
 const append=(index,r)=>{const sh=ss.getSheetByName(INV_TABS_[index]),row=sh.getLastRow()+1;invAppend_(ss,INV_TABS_[index],r);const cells=CV5EMetrics.measure("sheetReadbackMs",()=>sh.getRange(row,1,1,3).getValues());if(cells.length!==1||cells[0][0]!==r.id||cells[0][1]!==r.kind||CVInventory.canonical(JSON.parse(cells[0][2]))!==CVInventory.canonical(r))throw Error('EFFECT_NOT_DURABLE');if(index===0)journal.push(CVInventory.clone(r));else effects.push(CVInventory.clone(r));};
 return new CVInventory.Engine({readJournal:()=>CVInventory.clone(journal),readEffects:()=>CVInventory.clone(effects),appendJournal:r=>append(0,r),appendEffect:r=>append(1,r)});
}

/* Candidato S/0, apagado. Nunca pegar en Apps Script productivo. */
function zeroProof_(envelope,config){const cfg=config||{enabled:cvProps5g_().getProperty('ZERO_LAB_ENABLED')==='YES',secret:cvProps5g_().getProperty('ZERO_GATEWAY_SECRET'),now:Date.now()};if(!cfg.enabled||typeof cfg.secret!=='string'||cfg.secret.length<43||JSON.stringify(envelope||{}).length>32000)throw Error('IDENTITY_REQUIRED');const r=envelope?.request;if(!r||typeof envelope.mac!=='string')throw Error('IDENTITY_REQUIRED');const expected=Utilities.base64Encode(Utilities.computeHmacSha256Signature(CVInventoryBase.canonical(r),cfg.secret,Utilities.Charset.UTF_8));let different=expected.length^envelope.mac.length;for(let i=0;i<expected.length;i++)different|=expected.charCodeAt(i)^(envelope.mac.charCodeAt(i)||0);if(different)throw Error('IDENTITY_REQUIRED');if(r.version!==2||r.destination!=='TEST_ONLY_ZERO_1'||!Number.isSafeInteger(r.issuedAt)||!Number.isSafeInteger(r.expiresAt)||r.issuedAt>cfg.now+30000||r.expiresAt<=cfg.now||r.expiresAt-r.issuedAt>30000||!/^google:[0-9]{5,64}$/.test(r.subject)||typeof r.requestId!=='string'||r.requestId.length>120)throw Error('IDENTITY_REQUIRED');return r;}
function zeroPropertyLog_(prefix){const p=cvProps5g_();const read=()=>{const rows=[];for(let i=0;i<200;i++){const raw=p.getProperty(prefix+i);if(!raw)return rows;rows.push(JSON.parse(raw));}throw Error('LAB_ADMIN_LOG_FULL');};return {read,append:r=>{const rows=read(),raw=JSON.stringify(r);if(raw.length>7500||rows.length>=199)throw Error('LAB_ADMIN_LOG_FULL');const key=prefix+rows.length;p.setProperty(key,raw);if(p.getProperty(key)!==raw)throw Error('ADMIN_EVENT_NOT_DURABLE');}};}
function zeroRequestBase5e_(envelope){try{const verified=CV5EMetrics.measure("proofMs",()=>zeroProof_(envelope));CV5EMetrics.current.authorized=true;return cvLocked_(()=>{const p=cvProps5g_(),approved=p.getProperty('ZERO_APPROVED_SCRIPT_ID');if(!approved||ScriptApp.getScriptId()!==approved)throw Error('APPROVED_LAB_REQUIRED');const current=zeroProof_(envelope);const actor5e=zeroActor_(current,zeroPropertyLog_('ZERO_USER_'),p);zeroConsumeNonce_(current,p,Date.now());if(current.action==='snapshot'&&current.payload?.metricsProbe===true){if(actor5e.role!=='administrator')throw Error('PERMISSION_DENIED');CV5EMetrics.current.adminProbe=true;}const service=new CVZeroAccess.Service({environment:'TEST_ONLY',verify:()=>verified,lock:fn=>fn(),users:zeroPropertyLog_('ZERO_USER_'),policies:zeroPropertyLog_('ZERO_POLICY_'),now:()=>new Date().toISOString(),store:()=>invEngine_().store});return service.handle(envelope);});}catch(e){return {error:/^[A-Z_]+$/.test(e.message)?e.message:'SERVER_UNAVAILABLE',retryable:!['INSUFFICIENT_STOCK','PERMISSION_DENIED','FINANCIAL_FIELDS_FORBIDDEN','IDENTITY_SPOOFING','IDEMPOTENCY_CONFLICT','INVALID_ITEMS'].includes(e.message)};}}
function doPost(event){try{return ContentService.createTextOutput(JSON.stringify(zeroRequest(JSON.parse(event.postData.contents)))).setMimeType(ContentService.MimeType.JSON)}catch(e){return ContentService.createTextOutput(JSON.stringify({error:'IDENTITY_REQUIRED',retryable:true})).setMimeType(ContentService.MimeType.JSON)}}
function doGet(){return ContentService.createTextOutput(JSON.stringify({environment:'TEST_ONLY',status:'AUTHENTICATED_POST_REQUIRED'})).setMimeType(ContentService.MimeType.JSON);}

/* Consumir dentro del mismo ScriptLock que protege el diario.
 * El nonce protege transporte; operationId protege la operación comercial.
 * Solo caducan metadatos de transporte, nunca registros comerciales. */
function zeroConsumeNonce_(request, properties, now) {
  if (request.expiresAt <= now || request.issuedAt > now + 30000 ||
      request.expiresAt - request.issuedAt > 30000 ||
      !/^[a-zA-Z0-9_-]{8,120}$/.test(request.requestId)) throw Error('IDENTITY_REQUIRED');
  const key = 'ZERO_REPLAY_WINDOW';
  const raw = properties.getProperty(key);
  const saved = raw ? JSON.parse(raw) : [];
  if (!Array.isArray(saved) || saved.some(x => !Array.isArray(x) ||
      typeof x[0] !== 'string' || !Number.isSafeInteger(x[1]))) throw Error('REPLAY_STATE_INVALID');
  const active = saved.filter(x => x[1] > now);
  if (active.some(x => x[0] === request.requestId)) throw Error('REQUEST_REPLAYED');
  if (active.length >= 64) throw Error('REPLAY_WINDOW_FULL');
  active.push([request.requestId, request.expiresAt]);
  const next = JSON.stringify(active);
  if (next.length > 7500) throw Error('REPLAY_WINDOW_FULL');
  properties.setProperty(key, next);
  if (properties.getProperty(key) !== next) throw Error('REPLAY_STATE_NOT_DURABLE');
}

/* Solo dentro del ScriptLock, después de verificar HMAC y vigencia.
 * El correo proviene del token Google verificado por Worker, no del payload.
 * Los perfiles se obtienen exclusivamente de configuración privada del servidor. */
function zeroActor_(request, users, properties) {
  const events = users.read();
  if (events.some(row => row.target === request.subject)) {
    return CVZeroAccess.principal(request.subject, events);
  }
  if (request.action !== 'bootstrap') throw Error('ACCESS_DENIED');
  const email = request.verifiedEmail;
  if (typeof email !== 'string' || email.length > 254 || email !== email.toLowerCase()) throw Error('ACCESS_DENIED');
  const raw = properties.getProperty('ZERO_ENROLLMENT_EMAILS');
  if (!raw) throw Error('ACCESS_DENIED');
  const allowed = JSON.parse(raw);
  const roles = ['administrator','operations','seller'];
  if (!Array.isArray(allowed) || allowed.length !== 3 ||
      new Set(allowed.map(x=>x.email)).size !== 3 ||
      roles.some(role => allowed.filter(x=>x.role===role).length !== 1) ||
      allowed.some(x=>typeof x.email !== 'string' || x.email !== x.email.toLowerCase())) throw Error('ENROLLMENT_CONFIG_INVALID');
  const binding = allowed.find(row => row.email === email);
  if (!binding || events.some(row => row.enrollmentEmail === email)) throw Error('ACCESS_DENIED');
  users.append({kind:'ENROLLMENT',target:request.subject,role:binding.role,active:true,
    enrollmentEmail:email,actor:'AUTHORIZED_LAB_CONFIGURATION',serverAt:new Date().toISOString(),
    revision:events.length+1,operationId:'enroll-'+request.subject.slice(7)});
  return CVZeroAccess.principal(request.subject, users.read());
}

/* DTO explícito para la interfaz 5A.2. Autorización y redacción en servidor. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CV5DView=api;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const copy=x=>JSON.parse(JSON.stringify(x));
const pick=(x,keys)=>Object.fromEntries(keys.filter(k=>x[k]!==undefined).map(k=>[k,copy(x[k])]));
function snapshot(engine){
  const state=engine.state();
  if(engine.actor.role!=='seller'){
    const result=copy(state);result.reports=engine.reports(state);
    for(const sale of Object.values(result.sales))if(sale.commercial)sale.financial=engine.financial(state,sale.id);
    result.profile=engine.actor.role;result.uiVersion='5D';return bounded(result);
  }
  const own=new Set(engine.records().filter(row=>row.kind==='PREPARED'&&row.plan.audit?.subject===engine.actor.subject).map(row=>row.id));
  const resources=Object.fromEntries(Object.values(state.resources).filter(r=>r.stage==='PACKAGED').map(r=>[r.id,pick(r,['id','product','lot','stage','family','grind','grams','unit','physical','reserved','qty'])]));
  const offers=Object.fromEntries(Object.values(state.commerce.offers).filter(o=>o.active).map(o=>[o.id,pick(o,['id','name','family','grind','grams','bags','priceCents','validFrom','validUntil','version','active'])]));
  const sales=Object.fromEntries(Object.values(state.sales).filter(s=>s.commercial&&own.has(s.originOperationId)).map(s=>[s.id,{
    ...pick(s,['id','version','status','totalCents','deliveryChargedCents','metadata','delivered']),
    commercial:pick(s.commercial,['channel']),
    lines:s.lines.map(l=>pick(l,['resourceId','qty','lot','family','grind','grams','returned']))
  }]));
  return bounded({epoch:state.epoch,revision:state.revision,profile:'seller',uiVersion:'5D',resources,sales,
    commerce:{offers},reports:{customers:[]}});
}
function bounded(result){if(JSON.stringify(result).length>1500000)throw Error('UI_SNAPSHOT_LIMIT');return result;}
function dashboard(engine,p){
  if(engine.actor.role==='seller')throw Error('PERMISSION_DENIED');
  const valid=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d);
  if(!p||![p.from,p.to,p.today].every(valid)||p.from>p.to||!Array.isArray(p.days)||p.days.length>45||
    new Set(p.days).size!==p.days.length||p.days.some(d=>!valid(d)||d<p.from||d>p.to))throw Error('INVALID_PERIOD');
  const s=engine.state();if(s.revision!==p.revision)throw Error('REVISION_CHANGED');
  return {revision:s.revision,range:engine.reports(s,p.from,p.to),today:engine.reports(s,p.today,p.today),
    month:engine.reports(s,p.today.slice(0,7)+'-01',p.today),
    daily:p.days.map(day=>({day,report:engine.reports(s,day,day)}))};
}
return {snapshot,dashboard};});

(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CV5EReports=api;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const contexts=new WeakMap();
function withState(state,fn){
  if(contexts.has(state))return fn();
  const index=new Map();for(const event of state.commerce.events){const rows=index.get(event.saleId)||[];rows.push(event);index.set(event.saleId,rows);}
  contexts.set(state,index);try{return fn()}finally{contexts.delete(state)}
}
function attach(Engine){
  const report=Engine.prototype.reports,financial=Engine.prototype.financial;
  Engine.prototype.reports=function(state,...args){return withState(state,()=>report.call(this,state,...args));};
  Engine.prototype.financial=function(state,id){const index=contexts.get(state);return financial.call(this,index?{...state,commerce:{...state.commerce,events:index.get(id)||[]}}:state,id);};
}
return {withState,attach};
});

CV5EReports.attach(CVZeroAccess.Engine);
// Una medición por invocación; solo ID aleatorio y duraciones, sin identidad ni payload.
const CV5EMetrics={current:null,measure(name,fn){const start=Date.now();try{return fn()}finally{if(this.current)this.current[name]=(this.current[name]||0)+Math.max(0,Date.now()-start);}}};
function cvLocked_(fn){const lock=LockService.getScriptLock();CV5EMetrics.measure('lockWaitMs',()=>lock.waitLock(30000));try{return CV5EMetrics.measure('lockHeldMs',fn)}finally{lock.releaseLock()}}
function invRead_(ss,name){return CV5EMetrics.measure('sheetReadMs',()=>invReadBase5e_(ss,name));}
function invAppend_(ss,name,row){return CV5EMetrics.measure('sheetWriteMs',()=>invAppendBase5e_(ss,name,row));}
function zeroRequestBase5g_(envelope){
  const start=Date.now();CV5EMetrics.current={};let result;
  try{result=zeroRequestBase5e_(envelope);
    if(CV5EMetrics.current.adminProbe===true&&result?.profile==='administrator'&&result.uiVersion==='5D'&&!result.error){
      const durations={};for(const key of ['proofMs','lockWaitMs','lockHeldMs','sheetReadMs','sheetWriteMs','sheetReadbackMs','reconstructMs','reportsMs'])durations[key]=CV5EMetrics.current[key]||0;
      result={...result,diagnostics5e:{kind:'CV_5E_READ_TIMING',traceId:envelope.request.requestId,totalMs:Math.max(0,Date.now()-start),...durations}};
    }
    return result}
  finally{
    const metrics=CV5EMetrics.current;CV5EMetrics.current=null;
    // No publicar tiempos de peticiones sin prueba de identidad válida.
    if(metrics.authorized===true){delete metrics.authorized;delete metrics.adminProbe;console.log(JSON.stringify({kind:'CV_5E_TIMING',traceId:envelope.request.requestId,totalMs:Math.max(0,Date.now()-start),...metrics}));}
  }
}

const CV5EStateBase_ = CVZeroAccess.Engine.prototype.state;
CVZeroAccess.Engine.prototype.state=function(){return CV5EMetrics.measure("reconstructMs",()=>CV5EStateBase_.call(this));};
const CV5EReportBase_ = CVZeroAccess.Engine.prototype.reports;
CVZeroAccess.Engine.prototype.reports=function(...args){return CV5EMetrics.measure("reportsMs",()=>CV5EReportBase_.apply(this,args));};

/* Memo por solicitud, nunca entre usuarios/peticiones. Releer físicamente tras cada escritura. */
let cvPropertyScope5g_=null;
function cvProps5g_(){
 const base=PropertiesService.getScriptProperties();if(cvPropertyScope5g_===null)return base;const memo=cvPropertyScope5g_;
 return {getProperty(key){if(!memo.has(key))memo.set(key,base.getProperty(key));return memo.get(key);},setProperty(key,value){try{base.setProperty(key,value)}finally{memo.delete(key)}return this;}};
}
function zeroRequest(envelope){const previous=cvPropertyScope5g_;cvPropertyScope5g_=new Map();try{return zeroRequestBase5g_(envelope)}finally{cvPropertyScope5g_=previous;}}

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

CVProcess5G.attach(CVZeroAccess,{"environment":"TEST_ONLY","policyVersion":"DRAFT_5G_1","syntheticAllowedCommands":[]});
