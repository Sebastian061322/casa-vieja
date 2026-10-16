/* Inspección de solo lectura del origen actual. No crea, borra ni transforma bases antiguas. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CVContinuity=api;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const versions=Object.freeze([
 {name:'cv-sales-sandbox-v2-owner',engine:'V2',epoch:'TEST_ONLY_V2'},
 {name:'cv-inventory-sandbox-v3-owner',engine:'V3',epoch:'TEST_ONLY_V3'},
 {name:'cv-commercial-sandbox-v4-owner',engine:'V4',epoch:'TEST_ONLY_V3'},
 {name:'cv-commercial-sandbox-v5a-owner',engine:'V4',epoch:'TEST_ONLY_V3'}
]);
const clone=x=>JSON.parse(JSON.stringify(x));
function describe(version,data,origin){
 if(!data)return {...version,origin,status:'EMPTY',pending:[],receiptCount:0};
 if(!Array.isArray(data.queue)||!data.receipts||typeof data.receipts!=='object')return {...version,origin,status:'UNREADABLE',pending:[],receiptCount:0};
 const pending=data.queue.map(q=>({operationId:q.command?.operationId,saleId:q.command?.saleId,epoch:q.command?.epoch,schemaVersion:q.command?.schemaVersion,commercialVersion:q.command?.commercialVersion,state:q.state,deviceId:q.command?.deviceId,engine:version.engine}));
 const invalid=pending.some(p=>typeof p.operationId!=='string'||p.epoch!==version.epoch||p.schemaVersion!==2||(version.engine==='V4'&&p.commercialVersion!==4)||!['PENDING','REJECTED'].includes(p.state));
 return {...version,origin,status:invalid?'INCOMPATIBLE':pending.length?'UNRESOLVED':'CLEAR',pending,receiptCount:Object.keys(data.receipts).length};
}
async function scan({list,read,origin,otherOriginsConfirmed=false}){
 let databases;try{databases=await list();}catch(e){return {origin,blocked:true,reason:'ENUMERATION_UNAVAILABLE',databases:[],otherOriginsConfirmed:false};}
 const names=new Set(databases.map(x=>typeof x==='string'?x:x.name)),results=[];
 for(const v of versions){if(!names.has(v.name)){results.push({...v,origin,status:'ABSENT',pending:[],receiptCount:0});continue;}try{results.push(describe(v,await read(v.name),origin));}catch(e){results.push({...v,origin,status:'UNREADABLE',pending:[],receiptCount:0});}}
 // Bases de ensayos y futuras versiones también pueden contener una cola: no ocultarlas.
 for(const name of names)if(name&&!versions.some(v=>v.name===name)&&/^cv-|^(inventory|commercial)-browser-/.test(name)){try{const data=await read(name);if(data?.queue?.length)results.push({name,origin,status:'UNKNOWN_QUEUE',pending:data.queue.map(q=>({operationId:q.command?.operationId,state:q.state})),receiptCount:Object.keys(data.receipts||{}).length});}catch(e){results.push({name,origin,status:'UNREADABLE',pending:[],receiptCount:0});}}
 const unresolved=results.some(d=>!['CLEAR','EMPTY','ABSENT'].includes(d.status));
 return {origin,blocked:unresolved||!otherOriginsConfirmed,reason:unresolved?'UNRESOLVED_QUEUES':otherOriginsConfirmed?'CLEAR_THIS_ORIGIN':'OTHER_ORIGINS_NOT_ATTESTED',otherOriginsConfirmed,databases:results};
}
function browserAdapter(indexedDB,origin){return {origin,list:()=>{if(typeof indexedDB.databases!=='function')throw Error('ENUMERATION_UNAVAILABLE');return indexedDB.databases();},read:name=>new Promise((resolve,reject)=>{const r=indexedDB.open(name);let absent=false;r.onupgradeneeded=()=>{absent=true;r.transaction.abort();};r.onerror=()=>absent?resolve(null):reject(Error('STORAGE_UNREADABLE'));r.onblocked=()=>reject(Error('STORAGE_BLOCKED'));r.onsuccess=()=>{const db=r.result;if(db.version!==1||!db.objectStoreNames.contains('state')){db.close();reject(Error('STORAGE_VERSION_UNSUPPORTED'));return;}const tx=db.transaction('state','readonly'),req=tx.objectStore('state').get('current');let value;req.onsuccess=()=>value=req.result;tx.oncomplete=()=>{db.close();resolve(value||null)};tx.onerror=tx.onabort=()=>{db.close();reject(Error('STORAGE_UNREADABLE'))};};})};}
async function recoverConfirmation({entry,version,transport,client}){
 if(entry.command.epoch!==version.epoch||entry.command.schemaVersion!==2||(version.engine==='V4'&&entry.command.commercialVersion!==4))throw Error('INCOMPATIBLE_ENGINE');
 const original=JSON.stringify(entry.command),r=await transport.status(entry.command.operationId);
 if(!r||r.epoch!==entry.command.epoch||r.operationId!==entry.command.operationId)throw Error('UNVERIFIED_STATUS');
 if(r.state==='COMMITTED'){if(r.saleId!==entry.command.saleId)throw Error('UNVERIFIED_STATUS');await client.ack(r,clone(entry.command));return {confirmed:true,receipt:r};}
 // UNKNOWN/PREPARED no prueba ausencia de venta. Reintentar solamente en su motor original.
 if(JSON.stringify(entry.command)!==original)throw Error('COMMAND_CHANGED');
 return {confirmed:false,state:r.state,retryOnlyOriginalEngine:true,canArchive:r.state==='REJECTED'};
}
async function exportDevice(adapter){const names=(await adapter.list()).map(x=>typeof x==='string'?x:x.name).filter(name=>versions.some(v=>v.name===name)||/^cv-commercial-sandbox-v5c-/.test(name||'')),states=[],failures=[];for(const name of names){try{const data=await adapter.read(name);if(data)states.push({name,origin:adapter.origin,data:clone(data)})}catch(e){failures.push({name,error:'UNREADABLE'})}}return {format:'CV_DEVICE_EXPORT_5C',environment:'TEST_ONLY',capturedAt:new Date().toISOString(),origin:adapter.origin,scope:'CURRENT_ORIGIN_ONLY',states,failures,otherOriginsCovered:false};}
return {versions,describe,scan,browserAdapter,recoverConfirmation,exportDevice};
});
