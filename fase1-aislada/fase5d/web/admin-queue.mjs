// Cola separada para permisos: conserva el ID aun si se pierde la respuesta.
export async function adminMutation({store,actor,payload,send,uuid=()=>crypto.randomUUID()}){
  let command;
  await store.transact(s=>{
    s.adminQueue5d=s.adminQueue5d||[];
    const old=s.adminQueue5d.find(x=>x.command.subject===payload.subject);
    if(old){if(old.actor!==actor||old.command.role!==payload.role||old.command.active!==payload.active)throw Error('ADMIN_PENDING_RECOVERY_REQUIRED');command=old.command;}
    else{command={...payload,operationId:'admin-'+uuid()};s.adminQueue5d.push({actor,command});}
  });
  const result=await send(command);
  if(result?.state!=='COMMITTED'||result.operationId!==command.operationId||!Number.isSafeInteger(result.revision))throw Error('ADMIN_NOT_CONFIRMED');
  await store.transact(s=>{s.adminReceipts5d=s.adminReceipts5d||{};s.adminReceipts5d[command.operationId]=result;s.adminQueue5d=s.adminQueue5d.filter(x=>x.command.operationId!==command.operationId);});
  return result;
}
