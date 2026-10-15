/* Cola transaccional. Un documento IndexedDB por dispositivo/cuenta/destino. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CVClient=api;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const copy=x=>JSON.parse(JSON.stringify(x));
const empty=()=>({generation:0,queue:[],archived:[],receipts:{},snapshot:null,deviceId:null});
class Client{
 constructor(store,transport,destination,uuid){this.store=store;this.transport=transport;this.destination=destination;this.uuid=uuid;this.running=null;}
 async enqueue(payload){let saved;await this.store.transact(s=>{s.deviceId=s.deviceId||this.uuid();const command=Object.assign({},copy(payload),{operationId:this.uuid(),deviceId:s.deviceId,epoch:this.destination,schemaVersion:2});saved=copy(command);s.queue.push({command,state:'PENDING',lastError:''});s.generation++;});return {queued:true,confirmed:false,command:saved};}
 async view(){return this.store.read();}
 async archiveRejected(operationId){
  const entry=(await this.store.read()).queue.find(x=>x.command.operationId===operationId);if(!entry||entry.state!=='REJECTED')throw Error('REJECTED_REQUIRED');
  const result=await this.transport.status(operationId);if(!result||result.epoch!==this.destination||result.operationId!==operationId||result.state!=='REJECTED')throw Error('UNRESOLVED_SERVER_STATE');
  await this.store.transact(s=>{const item=s.queue.find(x=>x.command.operationId===operationId);if(!item||item.state!=='REJECTED')throw Error('QUEUE_CHANGED');s.archived=s.archived||[];s.archived.push({...item,serverRejection:copy(result),resolution:'SERVER_REJECTED_NO_SALE_EFFECT'});s.queue=s.queue.filter(x=>x!==item);s.generation++;});
 }
 validAck(r,c){return r&&r.epoch===this.destination&&r.operationId===c.operationId&&r.saleId===c.saleId&&r.state==='COMMITTED'&&Number.isSafeInteger(r.revision)&&r.revision>0&&Number.isSafeInteger(r.saleVersion);}
 async ack(r,c){if(!this.validAck(r,c))throw Error('INVALID_ACK');await this.store.transact(s=>{s.receipts[c.operationId]=copy(r);s.queue=s.queue.filter(x=>x.command.operationId!==c.operationId);s.generation++;});}
 flush(){if(!this.running)this.running=this.drain().finally(()=>this.running=null);return this.running;}
 async drain(){
  while(true){const s=await this.store.read(),item=s.queue[0];if(!item||item.state==='REJECTED')return;
   const c=item.command;
   try{
    let r=await this.transport.status(c.operationId);
    if(!r||r.epoch!==this.destination||r.operationId!==c.operationId)throw Error('INVALID_STATUS');
    if(r.state==='UNKNOWN'||r.state==='PREPARED')r=await this.transport.execute(c);
    if(r&&r.error){const error=Error(r.error);error.permanent=r.retryable===false;throw error;}
    await this.ack(r,c);
   }catch(e){await this.store.transact(state=>{const entry=state.queue.find(x=>x.command.operationId===c.operationId);if(entry){entry.lastError=e.message;entry.state=e.permanent?'REJECTED':'PENDING';}state.generation++;});return;}
  }
 }
 async refresh(){const start=await this.store.read();if(start.queue.length)return false;const snap=await this.transport.snapshot();if(!snap||snap.epoch!==this.destination||!Number.isSafeInteger(snap.revision))return false;let applied=false;await this.store.transact(s=>{const minRevision=Math.max(s.snapshot?s.snapshot.revision:0,...Object.values(s.receipts).map(x=>x.revision));if(!s.queue.length&&s.generation===start.generation&&snap.revision>=minRevision){s.snapshot=copy(snap);s.generation++;applied=true;}});return applied;}
}
class IndexedStore{
 constructor(name){this.name=name;this.dbPromise=null;}
 db(){if(!this.dbPromise)this.dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open(this.name,1);r.onupgradeneeded=()=>r.result.createObjectStore('state');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('STORAGE_BLOCKED'));});return this.dbPromise;}
 async read(){const db=await this.db();return new Promise((resolve,reject)=>{const tx=db.transaction('state','readonly');const req=tx.objectStore('state').get('current');let value;req.onsuccess=()=>value=copy(req.result||empty());tx.oncomplete=()=>resolve(value);tx.onerror=tx.onabort=()=>reject(tx.error||Error('STORAGE_FAILED'));});}
 async transact(fn){const db=await this.db();return new Promise((resolve,reject)=>{const tx=db.transaction('state','readwrite'),store=tx.objectStore('state');let failure;const req=store.get('current');req.onsuccess=()=>{try{const s=copy(req.result||empty());fn(s);store.put(s,'current');}catch(e){failure=e;tx.abort();}};tx.oncomplete=()=>resolve();tx.onerror=tx.onabort=()=>reject(failure||tx.error||Error('STORAGE_FAILED'));});}
}
return {Client,IndexedStore,empty};
});
