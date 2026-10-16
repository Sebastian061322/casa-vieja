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
