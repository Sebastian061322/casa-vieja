// Estados informativos. Solo un recibo validado por Client confirma o archiva una operación.
export function queueStatus(state,saleId){
 const queue=state.queue||[],archived=state.archived||[],pending=queue.filter(x=>x.state!=='REJECTED').length,rejected=queue.length-pending;
 const active=queue.find(x=>x.command.saleId===saleId),old=archived.findLast(x=>x.command.saleId===saleId&&x.state==='REJECTED');
 return {pending,rejected,archived:archived.length,
  label:pending?`${pending} pendiente(s) de confirmación · ${rejected} rechazo(s) por revisar`:rejected?`Rechazos por revisar: ${rejected}`:'Sin operaciones pendientes',
  saleRejected:active?.state==='REJECTED'||!!old,salePending:!!active&&active.state!=='REJECTED',
  error:active?.lastError||old?.serverRejection?.error||''};
}
