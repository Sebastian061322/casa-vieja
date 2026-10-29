// Renderiza exclusivamente metadatos actuales. No modifica la cola persistida.
export function queueMarkup54(local,escape,describe){
 if(local.queue.length)return local.queue.map(item=>`<p>${escape(item.command.type)} · ${escape(item.state)} · ${escape(describe(item.lastError))}${item.state==='REJECTED'?` <button class="btn small secondary" data-archive="${escape(item.command.operationId)}">Archivar rechazo con evidencia</button>`:''}</p>`).join('');
 const archived=(local.archived||[]).length;
 return archived?'<p class="cv-help">Sin operaciones pendientes. '+archived+' rechazo(s) conservado(s) con su evidencia.</p>':'<p class="cv-help">Todo confirmado por el servidor.</p>';
}
