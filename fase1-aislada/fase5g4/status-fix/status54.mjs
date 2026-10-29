// Estado visual derivado de la cola: no modifica comandos, recibos ni saldos.
export function statusNotice54(local,current){
 const managed=/^(Operación guardada en este equipo\.|Guardada en este equipo\.|Hay operaciones pendientes de confirmación\.|Pendiente de confirmación\.|Operación pendiente\.|Nuevo borrador\. Las operaciones anteriores pendientes|Rechazo confirmado:|Rechazo archivado)/.test(current||'');
 if(!managed)return null;
 const rejected=local.queue.find(item=>item.state==='REJECTED');
 if(rejected)return {kind:'REJECTED',error:rejected.lastError};
 if(local.queue.length)return {kind:'PENDING'};
 // Una cola vacía no acredita por sí sola una venta; no inventar confirmación.
 return {kind:'CLEAR'};
}
export function createSyncStatus54({runSync,read,currentNotice,notice,describe}){
 let running=null;
 return function(){
  if(!running)running=(async()=>{
   await runSync();
   const state=statusNotice54(await read(),currentNotice());
   if(state)notice(state.kind==='REJECTED'?'Rechazo confirmado: '+describe(state.error):state.kind==='PENDING'?'Pendiente de confirmación. Se conserva el mismo identificador.':'Sin operaciones pendientes. Los recibos y rechazos se conservan en este equipo.');
  })().finally(()=>{running=null;});
  return running;
 };
}
