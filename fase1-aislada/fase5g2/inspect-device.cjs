'use strict';
// Helper de metadatos para un censo autorizado. No navegador global, red ni escrituras.
const check=(ok,e)=>{if(!ok)throw Error(e)};
function inspect({deviceId,profile,origin,authorization,storage,databaseMetadata=[]}){
 check(authorization?.approved===true&&authorization.deviceId===deviceId&&authorization.profile===profile&&authorization.origin===origin&&authorization.scope==='COUNTS_ONLY','DEVICE_APPROVAL_REQUIRED');
 let url;try{url=new URL(origin)}catch{throw Error('EXACT_HTTPS_ORIGIN_REQUIRED')}
 check(typeof origin==='string'&&url.protocol==='https:'&&url.origin===origin&&!url.username&&!url.password,'EXACT_HTTPS_ORIGIN_REQUIRED');
 const queue=name=>{const raw=storage.getItem(name);if(raw===null)return {key:name,present:false,count:0,states:{}};let rows;try{rows=JSON.parse(raw)}catch{return {key:name,present:true,count:null,error:'MALFORMED_JSON'}}
  if(!Array.isArray(rows))return {key:name,present:true,count:null,error:'UNKNOWN_SCHEMA'};
  const states={};for(const row of rows){const state=['PENDING','PREPARED','COMMITTED','REJECTED','UNKNOWN'].includes(row?.state)?row.state:'STATE_NOT_RECORDED';states[state]=(states[state]||0)+1;}return {key:name,present:true,count:rows.length,states};};
 return {deviceId,profile,origin,readOnly:true,personalDataExported:false,credentialsRead:false,queues:[queue('casa_vieja_outbox'),queue('casa_vieja_failed_ops')],indexedDb:databaseMetadata.map(x=>({name:String(x.name),version:x.version})),indexedDbContentsRead:false,receipts:'NOT_ESTABLISHED',lastSync:'NOT_ESTABLISHED',effectiveVersion:'NOT_ESTABLISHED',endpoint:'NOT_READ',warning:'Zero outbox is not proof of zero failedOps or of an uncommitted server operation'};
}
module.exports={inspect};
