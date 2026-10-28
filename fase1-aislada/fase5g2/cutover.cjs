'use strict';
// Simulador: todos los adaptadores deben pasar por ESTA autoridad. No controla Google real.
const {clone}=require('../fase3/journal.js');
const check=(ok,e)=>{if(!ok)throw Error(e)};
const OLD_ROUTES=Object.freeze(['v15:get:migration','v15:post','v15:saveDB','v15:ACTION_MAP','v15:setSetting','v15:upsertItem','v15:upsertItems','v15:deleteItem','v15:deleteItems','v15:writeTab','v2:get','v2:post','web:published-copy','web:outbox','web:failedOps','script:trigger','sheet:direct-editor','integration:confirmed-fixture']);
class Mutex{#tail=Promise.resolve();run(fn){const p=this.#tail.then(fn);this.#tail=p.catch(()=>{});return p;}}
class Cutover{
 #mutex=new Mutex();#closing=false;#writer='OLD';#generation=0;#activated=false;#routes;#events=[];#oldWrites=[];#receipt=null;
 constructor({environment,routes=OLD_ROUTES}){check(environment==='TEST_ONLY','TEST_ONLY_REQUIRED');check(routes.length===OLD_ROUTES.length&&new Set(routes).size===routes.length&&OLD_ROUTES.every(r=>routes.includes(r)),'INCOMPLETE_ROUTE_CENSUS');this.#routes=new Set(routes);}
 snapshot(){return clone({environment:'TEST_ONLY',writer:this.#writer,generation:this.#generation,newActivated:this.#activated,acceptingOld:!this.#closing&&this.#writer==='OLD',oldWrites:this.#oldWrites,events:this.#events,openingReceipt:this.#receipt});}
 old(route,generation,handler){
  if(this.#closing)return Promise.reject(Error('OLD_ADMISSION_CLOSED'));
  return this.#mutex.run(async()=>{check(this.#routes.has(route),'UNKNOWN_OLD_ROUTE');check(this.#writer==='OLD'&&generation===this.#generation,'WRITER_FENCED');
   let held=true;const append=data=>{check(held&&this.#writer==='OLD'&&generation===this.#generation,'WRITER_FENCED');check(route!=='v2:get','READ_ONLY_ROUTE');this.#oldWrites.push({route,data:clone(data)});};
   try{return await handler(append)}finally{held=false;}
  });
 }
 close(evidence,actor){
  check(actor?.role==='administrator','PERMISSION_DENIED');
  check(evidence?.kind==='SYNTHETIC_TEST_APPROVAL'&&evidence.census==='COMPLETE_SYNTHETIC_FIXTURE'&&evidence.pending===0&&evidence.failedOps===0&&evidence.unknown===0&&/^[a-f0-9]{64}$/.test(evidence.backupHash||''),'CLOSURE_EVIDENCE_REQUIRED');
  this.#closing=true;
  return this.#mutex.run(()=>{check(this.#writer==='OLD','INVALID_TRANSITION');this.#writer='NONE';this.#generation++;this.#events.push({type:'CLOSE_OLD',writer:'NONE',generation:this.#generation,closedRoutes:[...this.#routes],evidence:clone(evidence)});return this.snapshot();});
 }
 opening(handler,actor){return this.#mutex.run(async()=>{check(actor?.role==='administrator','PERMISSION_DENIED');check(this.#writer==='NONE'&&!this.#activated,'OPENING_WINDOW_REQUIRED');const r=await handler();check(r?.state==='COMMITTED'&&typeof r.operationId==='string','OPENING_RECEIPT_REQUIRED');if(this.#receipt)check(this.#receipt.operationId===r.operationId,'OPENING_RECEIPT_CONFLICT');this.#receipt=clone(r);return r;});}
 activate(evidence,actor){return this.#mutex.run(()=>{check(actor?.role==='administrator','PERMISSION_DENIED');check(this.#writer==='NONE'&&!this.#activated&&this.#receipt,'INVALID_TRANSITION');check(evidence?.kind==='SYNTHETIC_TEST_APPROVAL'&&/^[a-f0-9]{64}$/.test(evidence.releaseHash||'')&&evidence.openingOperationId===this.#receipt.operationId,'ACTIVATION_EVIDENCE_REQUIRED');this.#writer='NEW';this.#generation++;this.#activated=true;this.#events.push({type:'OPEN_NEW',writer:'NEW',generation:this.#generation,evidence:clone(evidence)});return this.snapshot();});}
 new(generation,handler){return this.#mutex.run(()=>{check(this.#writer==='NEW'&&generation===this.#generation,'WRITER_FENCED');return handler();});}
 halt(actor){return this.#mutex.run(()=>{check(actor?.role==='administrator','PERMISSION_DENIED');check(this.#writer==='NEW','INVALID_TRANSITION');this.#writer='NONE';this.#generation++;this.#events.push({type:'HALT_NEW',writer:'NONE',generation:this.#generation});return this.snapshot();});}
 reopenOld(){throw Error('AUTOMATIC_OLD_REOPEN_FORBIDDEN');}
}
module.exports={Cutover,OLD_ROUTES,Mutex};
