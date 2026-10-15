/* Núcleo compartido de pruebas. No tiene red ni credenciales. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CVTransactions=api;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const EPOCH='TEST_ONLY_V2';
const clone=x=>JSON.parse(JSON.stringify(x));
const canonical=x=>Array.isArray(x)?'['+x.map(canonical).join(',')+']':x&&typeof x==='object'?'{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k])).join(',')+'}':JSON.stringify(x);
function require_(ok,code){if(!ok)throw Error(code);}
function uint(x,min=0){require_(Number.isSafeInteger(x)&&x>=min&&x<=100000000000,'INVALID_NUMBER');return x;}
function id(x,prefix=''){require_(typeof x==='string'&&x.length<=120&&new RegExp('^'+prefix+'[a-zA-Z0-9:_-]+$').test(x),'INVALID_ID');return x;}
function distinct(rows,key){const map=new Map();for(const row of rows){const k=key(row);if(map.has(k))require_(canonical(map.get(k))===canonical(row),'JOURNAL_CONFLICT');else map.set(k,row);}return [...map.values()];}
class Engine {
 constructor(store,opening,hook=()=>{}){this.store=store;this.opening=clone(opening);this.hook=hook;require_(opening.epoch===EPOCH,'WRONG_EPOCH');for(const [key,r]of Object.entries(opening.resources)){id(key,'demo:');uint(r.qty);uint(r.unitCostCents);uint(r.grams,1);require_(r.lot&&r.family&&['grano','molido'].includes(r.grind),'INVALID_OPENING');}}
 records(){return distinct(this.store.readJournal(),r=>r.kind+':'+r.id);}
 effects(){return distinct(this.store.readEffects(),r=>r.id);}
 state(){
  const rows=this.records(),effects=this.effects(),s={epoch:EPOCH,revision:0,resources:clone(this.opening.resources),sales:{},effects:[]};
  for(const commit of rows.filter(r=>r.kind==='COMMITTED')){
   const p=rows.find(r=>r.kind==='PREPARED'&&r.id===commit.id);
   require_(p&&p.result.revision===s.revision+1&&canonical(commit.result)===canonical(p.result),'CORRUPT_COMMIT');
   require_(p.fingerprint===canonical(p.command),'CORRUPT_COMMAND');
   for(const e of p.plan.effects){require_(effects.some(x=>x.id===e.id&&canonical(x)===canonical(e)),'INCOMPLETE_COMMIT');s.resources[e.resourceId].qty+=e.qtyDelta;require_(s.resources[e.resourceId].qty>=0,'NEGATIVE_STOCK');s.effects.push(clone(e));}
   s.sales[p.plan.sale.id]=clone(p.plan.sale);s.revision=p.result.revision;
  }
  return s;
 }
 status(operationId){id(operationId);const rows=this.records(),p=rows.find(x=>x.id===operationId&&x.kind==='PREPARED');const commit=rows.find(x=>x.id===operationId&&x.kind==='COMMITTED');const rejected=rows.find(x=>x.id===operationId&&x.kind==='REJECTED');return rejected?clone(rejected.result):commit?clone(commit.result):{epoch:EPOCH,operationId,state:p?'PREPARED':'UNKNOWN'};}
 finish(p){
  for(const effect of p.plan.effects){const old=this.effects().find(x=>x.id===effect.id);if(old)require_(canonical(old)===canonical(effect),'EFFECT_CONFLICT');else {this.hook('beforeEffect',effect);this.store.appendEffect(clone(effect));this.hook('afterEffect',effect);}}
  for(const e of p.plan.effects)require_(this.effects().some(x=>x.id===e.id&&canonical(x)===canonical(e)),'EFFECT_NOT_DURABLE');
  if(this.status(p.id).state!=='COMMITTED'){this.hook('beforeCommit',p);this.store.appendJournal({kind:'COMMITTED',id:p.id,result:p.result});this.hook('afterCommit',p);}
  return this.status(p.id);
 }
 recover(){for(const p of this.records().filter(x=>x.kind==='PREPARED'))if(this.status(p.id).state!=='COMMITTED')this.finish(p);}
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
 plan(s,c){
  let sale;const effects=[];const old=s.sales[c.saleId];
  if(c.type==='REGISTER_SALE'){
   require_(!old,'SALE_EXISTS');require_(Array.isArray(c.lines)&&c.lines.length>0&&c.lines.length<=40,'INVALID_LINES');
   const lines=c.lines.map(l=>{require_(l&&typeof l==='object','INVALID_LINE');id(l.resourceId,'demo:');const r=s.resources[l.resourceId];require_(r&&r.active===true,'RESOURCE_UNAVAILABLE');uint(l.qty,1);return {resourceId:l.resourceId,qty:l.qty,lot:r.lot,family:r.family,grind:r.grind,grams:r.grams,unitCostCents:r.unitCostCents,totalCostCents:uint(l.qty*r.unitCostCents)};});
   const aggregate={};for(const l of lines)aggregate[l.resourceId]=uint((aggregate[l.resourceId]||0)+l.qty);
   for(const [key,qty]of Object.entries(aggregate))require_(s.resources[key].qty>=qty,'INSUFFICIENT_STOCK');
   const total=uint(c.totalCents),cost=uint(lines.reduce((n,l)=>n+l.totalCostCents,0)),charged=uint(c.deliveryChargedCents===undefined?0:c.deliveryChargedCents),shipping=uint(c.deliveryCostCents===undefined?0:c.deliveryCostCents);
   sale={id:c.saleId,status:'REGISTERED',version:1,lines,totalCents:total,costCents:cost,deliveryChargedCents:charged,deliveryCostCents:shipping,profitCents:total+charged-shipping-cost,metadata:this.metadata(c.metadata||{}),originOperationId:c.operationId};
   for(const [resourceId,qty]of Object.entries(aggregate))effects.push({id:c.operationId+':'+effects.length,operationId:c.operationId,saleId:c.saleId,resourceId,qtyDelta:-qty,kind:'SALE_CONSUMPTION'});
  }else{
   require_(old,'FUTURE_SALE_NOT_FOUND');sale=clone(old);
   if(c.type==='CANCEL_SALE'&&old.status==='CANCELLED')return {sale,effects};
   require_(c.expectedSaleVersion===old.version,'SALE_VERSION_CONFLICT');
   if(c.type==='CANCEL_SALE'){
    require_(old.status==='REGISTERED','RETURN_RECEIPT_REQUIRED');require_(typeof c.reason==='string'&&c.reason.trim().length>0&&c.reason.length<=500,'REASON_REQUIRED');
    sale.status='CANCELLED';sale.cancelReason=c.reason;
    const consumed=s.effects.filter(e=>e.saleId===c.saleId&&e.kind==='SALE_CONSUMPTION');require_(consumed.length>0,'CONSUMPTION_REQUIRED');
    for(const e of consumed)effects.push({id:c.operationId+':'+effects.length,operationId:c.operationId,saleId:c.saleId,resourceId:e.resourceId,qtyDelta:-e.qtyDelta,kind:'CANCELLATION_COMPENSATION',reverses:e.id});
   }else if(c.type==='EDIT_SALE'){
    require_(!['totalCents','profitCents','costCents','lines','deliveryCostCents','deliveryChargedCents'].some(k=>Object.prototype.hasOwnProperty.call(c,k)),'FINANCIAL_EDIT_NOT_ALLOWED');
    sale.metadata=Object.assign({},old.metadata,this.metadata(c.metadata||{}));
   }else if(c.type==='DISPATCH_SALE'){require_(old.status==='REGISTERED','INVALID_SALE_STATE');sale.status='DISPATCHED';
   }else throw Error('COMMAND_NOT_ALLOWED');
   sale.version++;
  }
  return {sale,effects};
 }
 metadata(input){require_(input&&typeof input==='object'&&!Array.isArray(input),'INVALID_METADATA');const out={};for(const [k,v]of Object.entries(input)){require_(['customer','phone','zone','note','date'].includes(k)&&typeof v==='string'&&v.length<=500,'INVALID_METADATA');out[k]=v;}return out;}
}
return {Engine,EPOCH,canonical,clone};
});
