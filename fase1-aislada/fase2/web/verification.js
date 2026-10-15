// Verificaciones explícitas del laboratorio privado. Solo datos demo.
async function runBrowserChecks(){
 const button=$('verify');button.disabled=true;const results=[];const run='browser-'+uuid();
 const record=(name,ok,detail='')=>{results.push({name,passed:!!ok,detail});$('verification-results').textContent=JSON.stringify(results,null,2);if(!ok)throw Error(name+' '+detail);};
 const make=(suffix,qty=1)=>({type:'REGISTER_SALE',saleId:'future:'+run+'-'+suffix,lines:[{resourceId:'demo:molido',qty}],totalCents:3300*qty,metadata:{customer:'Demo '+suffix}});
 const freshClient=suffix=>new CVClient.Client(new CVClient.IndexedStore('cv-check-'+run+'-'+suffix),{execute:c=>rpc('execute',c),status:id=>rpc('status',id),snapshot:()=>rpc('snapshot')},epoch,uuid);
 const cleanup=async c=>{const state=await rpc('snapshot');const s=state.sales[c.saleId];if(s&&s.status==='REGISTERED'){const r=await rpc('execute',{operationId:uuid(),deviceId:'browser-cleanup',epoch,schemaVersion:2,type:'CANCEL_SALE',saleId:c.saleId,expectedSaleVersion:s.version,reason:'Fin de verificación sintética'});if(r.error)throw Error(r.error);}};
 const created=[];
 try{
  const before=await rpc('snapshot');record('Conexión real a Apps Script y Sheets',before.epoch===epoch);
  const offline=freshClient('offline'),payload=make('offline');const queued=await offline.enqueue(payload);created.push(queued.command);
  const realTransport=offline.transport;offline.transport={status:async()=>{throw Error('OFFLINE_SIMULATED');}};await offline.flush();record('Interrupción simulada conserva cola en IndexedDB',(await offline.view()).queue.length===1);
  offline.transport=realTransport;await offline.flush();record('Reconexión confirma una sola venta',(await offline.view()).receipts[queued.command.operationId]?.state==='COMMITTED');await cleanup(queued.command);
  const lost=freshClient('lost'),lostQueued=await lost.enqueue(make('lost'));created.push(lostQueued.command);const execute=lost.transport.execute;lost.transport.execute=async c=>{await execute(c);throw Error('RESPONSE_LOST_SIMULATED');};await lost.flush();record('Respuesta perdida mantiene operación pendiente',(await lost.view()).queue.length===1);
  await lost.flush();record('Consulta recupera confirmación original',(await lost.view()).receipts[lostQueued.command.operationId]?.state==='COMMITTED');await cleanup(lostQueued.command);
  const a=freshClient('device-A'),b=freshClient('device-B');const qa=await a.enqueue(make('concurrent-A',3)),qb=await b.enqueue(make('concurrent-B',2));created.push(qa.command,qb.command);const stock=(await rpc('snapshot')).resources['demo:molido'].qty;
  await Promise.all([a.flush(),b.flush()]);const after=await rpc('snapshot');record('Dos dispositivos lógicos envían en paralelo',qa.command.deviceId!==qb.command.deviceId&&(await a.view()).queue.length===0&&(await b.view()).queue.length===0);record('Stock concurrente disminuye exactamente 3 + 2',after.resources['demo:molido'].qty===stock-5);await cleanup(qa.command);await cleanup(qb.command);
  const recovery=await rpc('recovery');record('Recuperación real después de fallos parciales',recovery.passed===true,JSON.stringify(recovery));
  const rejected=freshClient('rejected');const qr=await rejected.enqueue(make('rejected',999));await rejected.flush();record('Stock insuficiente queda rechazado de forma durable',(await rpc('status',qr.command.operationId)).state==='REJECTED');await rejected.archiveRejected(qr.command.operationId);record('Rechazo se archiva sin perder comando ni evidencia',(await rejected.view()).archived.length===1&&(await rejected.view()).queue.length===0);
  const end=await rpc('snapshot');record('Verificaciones dejan el stock como estaba',JSON.stringify(before.resources)===JSON.stringify(end.resources));
  window.lastVerification={run,results,passed:true};notice('Verificaciones del laboratorio completadas.');
 }catch(e){results.push({name:'Error de verificación',passed:false,detail:e.message});window.lastVerification={run,results,passed:false};notice('Verificación interrumpida: '+e.message);
 }finally{for(const c of created){try{await cleanup(c);}catch(e){results.push({name:'Compensación pendiente',passed:false,detail:c.operationId});}}try{await rpc('report',window.lastVerification);}catch(e){results.push({name:'Informe remoto pendiente',passed:false,detail:e.message});} $('verification-results').textContent=run+'\n'+(window.lastVerification.passed?'APROBADO':'REVISAR')+'\n'+results.map(r=>(r.passed?'PASS ':'FAIL ')+r.name+(r.detail?' · '+r.detail:'')).join('\n');await synchronize();button.disabled=false;}
}
$('verify').onclick=runBrowserChecks;
