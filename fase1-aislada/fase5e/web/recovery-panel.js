const priorExplain5e=explain;
explain=function(error){const messages={INTENT_CHANGED_REVIEW_REQUIRED:'Este intento ya está guardado con otros datos. Revisa el pendiente antes de continuar.',OPERATION_ALREADY_CONFIRMED:'Esta operación ya fue confirmada. Consulta el pedido.',REJECTED_INTENT_REVIEW_REQUIRED:'Este intento fue rechazado y su evidencia está conservada. Revisa la causa antes de crear otro.',INTENT_STATE_REVIEW_REQUIRED:'Hay un intento registrado que necesita revisión. Conserva los datos de este equipo.',TEST_ONLY_RESPONSE_LOST:'Ensayo: se interrumpió la confirmación. Recupera el mismo pendiente con Sincronizar.'};return messages[error?.message||error]||priorExplain5e(error);};
if (new URLSearchParams(location.search).get('recovery') === '5e') {
  const panel=document.createElement('section');panel.className='card';panel.id='recovery5e';
  const title=document.createElement('h3');title.textContent='Ensayo de respuesta perdida · solo laboratorio';
  const help=document.createElement('p');help.textContent='Solo un pedido nuevo con cliente TEST_ONLY_5E_. El Worker retendrá una confirmación antes de entregarla a esta pestaña. Después recupera el mismo pendiente con Sincronizar.';
  const button=document.createElement('button');button.type='button';button.className='btn secondary';button.textContent='Armar pérdida de una confirmación';
  const result=document.createElement('p');result.setAttribute('role','status');
  button.onclick=async()=>{try{if((await store.read()).queue.length)throw Error('RESOLVE_PENDING_FIRST');responseProbe.arm();button.disabled=true;result.textContent='Ensayo armado. Registra una sola vez el pedido ficticio preparado.';}catch(e){result.textContent=explain(e)}};
  panel.append(title,help,button,result);$('main-content').append(panel);
  const refreshProbe5e=async()=>{const s=await store.read();if(s.responseTest5e)result.textContent='Evidencia local: '+s.responseTest5e.state+' · '+s.responseTest5e.operationId;};
  const beforeProbeSync5e=sync;sync=async function(){await beforeProbeSync5e();if(client.running)await client.running;await refreshProbe5e();};
  Promise.resolve(client.running).then(refreshProbe5e);
}
