// Se carga dentro del mismo ámbito de la interfaz 5A.2, tras sus refinamientos.
const canView5d=new Set(actor.profile==='seller'?['sales','orders','inventory']:
  Object.keys(menus).filter(name=>actor.profile==='administrator'||name!=='config'));
const changeView5d=changeView;
changeView=async function(name){if(!canView5d.has(name)){notice('Tu perfil no permite abrir esta sección.');return;}return changeView5d(name);};
function permissions5d(){
  document.querySelectorAll('[data-view]').forEach(el=>el.hidden=!canView5d.has(el.dataset.view));
  document.querySelectorAll('[data-action="RETURN_SALE"],[data-action="RECORD_REFUND"]').forEach(el=>el.remove());
  if(actor.profile!=='administrator'){
    document.querySelectorAll('#discount-panel,#discount-form').forEach(el=>{const detail=el.closest('details');if(detail)detail.remove();else el.remove();});
    if($('sale-form'))for(const name of ['discount','authorizationId'])$('sale-form').elements[name]?.closest('label')?.remove();
  }
  if(actor.profile==='seller'){
    if($('sale-form'))for(const name of ['deliveryCharged','deliveryCost'])$('sale-form').elements[name]?.closest('label')?.remove();
    document.querySelectorAll('[data-open-confirmed]').forEach(el=>el.textContent='Ver mi pedido');
    document.querySelectorAll('.nav-secondary').forEach(el=>{if(![...el.querySelectorAll('[data-view]')].some(b=>!b.hidden))el.hidden=true;});
  }
  $('verify').closest('details').hidden=true;
}
const baseSaleForm5d=salesForm;
salesForm=function(){const template=document.createElement('template');template.innerHTML=baseSaleForm5d();
  if(actor.profile!=='administrator'){
    template.content.querySelector('#discount-panel')?.remove();
    template.content.querySelector('#discount-form')?.closest('details')?.remove();
  }
  if(actor.profile==='seller'){
    for(const name of ['deliveryCharged','deliveryCost'])template.content.querySelector('[name="'+name+'"]')?.closest('label')?.remove();
    const note=template.content.querySelector('.field-note');if(note)note.textContent='El pedido se reserva cuando el servidor lo confirma. Los gerentes registran los cobros y despachos; el medio previsto no acredita un pago.';
  }
  return template.innerHTML;
};
if(actor.profile==='seller'){
  preview=function(){try{let total=0;for(const item of items()){const offer=snapshot.commerce.offers[item.offerId];if(!offer)throw Error('Selecciona un producto vigente.');total+=offer.priceCents*item.quantity;}
    $('sale-preview').innerHTML=cards([['Productos a precio de catálogo',money(total)]]);
    if($('sticky-total'))$('sticky-total').textContent=money(total);
    for(const row of $('sale-lines')?.children||[])row.querySelector('[data-remove-line]').disabled=$('sale-lines').children.length===1;
  }catch(e){if($('sale-preview'))$('sale-preview').textContent=e.message;}};
  orderTable=function(){const q=($('order-search')?.value||'').toLowerCase();return commercialSales().filter(s=>(s.id+' '+s.metadata.customer).toLowerCase().includes(q)).map(s=>`<article class="card cv-card-gap"><h3>${esc(s.metadata.customer||'Cliente ficticio')} · ${esc(statusName[s.status])}</h3><p>${esc(s.id)} · ${money(s.totalCents+s.deliveryChargedCents)}</p><p>${esc(s.metadata.zone)} · ${esc(s.metadata.note)}</p>${s.lines.map(l=>`<p>${esc(l.family)} · ${esc(l.grind)} · ${l.grams} g · ${l.qty} bolsa(s)</p>`).join('')}<p class="cv-help">Los cobros y despachos los registran los gerentes.</p></article>`).join('')||'<p>Sin pedidos propios confirmados.</p>';};
}
let usersPanel5d=null;
const render5d=render;
render=function(){if(!snapshot)return;if(!canView5d.has(view))view=actor.profile==='seller'?'sales':'dashboard';
  if(actor.profile==='seller'&&view==='orders')$('orders').innerHTML='<label>Buscar mis pedidos<input id="order-search"></label><div id="order-list">'+orderTable()+'</div>';
  else if(actor.profile==='seller'&&view==='inventory')$('inventory').innerHTML='<h3>Stock disponible</h3>'+allResources().map(r=>`<article class="card cv-card-gap"><h3>${esc(r.product)}</h3><p>${esc(r.family)} · ${esc(r.grind)} · ${r.grams} g</p><strong>${r.qty} disponibles</strong></article>`).join('');
  else render5d();permissions5d();
  if(view==='config'&&actor.profile==='administrator'){$('config').insertAdjacentHTML('beforeend','<section class="card cv-card-gap"><h3>Usuarios del laboratorio</h3><p>Solo cuentas de prueba previamente autorizadas. Los permisos se verifican en el servidor y cada cambio conserva trazabilidad.</p><button class="btn secondary" data-users5d>Cargar usuarios</button><div id="users5d"></div></section>');
    const placeholder=$('users5d');if(usersPanel5d)placeholder.replaceWith(usersPanel5d);else usersPanel5d=placeholder;
  }
};
const operation5d=operation,orderAction5d=orderAction;
const saleState5d=saleState;saleState=function(){saleState5d();permissions5d();};
operation=function(type,id){if(!actor.capabilities.includes(type)){notice('Operación no autorizada para tu perfil.');return;}return operation5d(type,id);};
orderAction=function(type,id){if(!actor.capabilities.includes(type)){notice('Operación no autorizada para tu perfil.');return;}return orderAction5d(type,id);};
view=actor.profile==='seller'?'sales':'dashboard';
document.querySelectorAll('.cv-section').forEach(el=>el.classList.toggle('active',el.id===view));
$('title').textContent=menus[view];permissions5d();
let usersRevision5d=null;
document.addEventListener('click',async event=>{if(!event.target.closest('[data-users5d]'))return;
  try{const result=await rpc('users');if(view!=='config'||actor.profile!=='administrator')return;usersRevision5d=result.revision;
    $('users5d').innerHTML=result.users.map(user=>`<form data-user5d="${esc(user.subject)}" class="card cv-card-gap"><p>${user.subject===actor.subject?'Esta cuenta':'Cuenta de laboratorio'} · …${esc(user.subject.slice(-6))}</p><div class="form-grid">${select('profile','Perfil',['administrator','operations','seller'].map(role=>`<option value="${role}" ${user.role===role?'selected':''}>${({administrator:'Administrador principal',operations:'Gerente operativo',seller:'Vendedor'})[role]}</option>`).join(''))}<label><input type="checkbox" name="active" ${user.active?'checked':''}> Acceso activo</label></div><button class="btn secondary">Guardar permiso de prueba</button></form>`).join('');
  }catch(error){notice(explain(error));}
});
document.addEventListener('submit',async event=>{if(!event.target.matches('[data-user5d]'))return;event.preventDefault();const form=event.target,button=event.submitter;button.disabled=true;
  try{const profile=form.elements.profile.value,subject=form.dataset.user5d,active=form.elements.active.checked;
    const result=await adminMutation({store,actor:actor.subject,payload:{expectedRevision:usersRevision5d,subject,role:profile,active},send:command=>rpc('setUser',command)});
    if(result.state!=='COMMITTED')throw Error('PERMISSION_NOT_CONFIRMED');usersRevision5d=result.revision;notice('Cambio de permiso confirmado por el servidor del laboratorio.');
  }catch(error){notice(explain(error));}finally{button.disabled=false;}
});
// Conserva rechazo definitivo y pendiente como estados diferentes, también en el resumen móvil.
let queueView5d={queue:[],archived:[]};
const explainBase5d=explain;
explain=function(error){if((error.message||error)==='SHIPPING_ZONE_REQUIRED')return 'Selecciona o escribe una zona de envío antes de guardar el pedido.';return (error.message||error)==='SHIPPING_POLICY_REQUIRED'?'La zona no tiene una política de envío aplicable. No se confirmó la venta.':explainBase5d(error);};
function refreshQueueState5d(){
 const status=queueStatus(queueView5d,draftSaleId);$('pending').textContent=status.label;
 if(!status.pending&&status.rejected){
  $('connection').textContent='Rechazo confirmado · revisar';
  if(/^(Operación pendiente\.|Guardada en este equipo\.|Operación guardada localmente\.)/.test($('notice').textContent||''))notice('Rechazo confirmado. No se registró la operación. Revisa la evidencia antes de preparar otro pedido.');
 }
 // A fresh snapshot may arrive while the draft is dirty. Update labels only;
 // never replace the selected lot, quantity, customer or original command.
 if(snapshot)for(const row of document.querySelectorAll('#sale-lines .cv-line'))readableLots(row);
 if(!queueView5d.queue.length&&status.archived)$('queue').innerHTML='<p class="cv-help">Sin operaciones pendientes. '+status.archived+' rechazo(s) conservado(s) con su evidencia.</p>';
 if(view==='sales'&&$('draft-state')&&!snapshot?.sales[draftSaleId]){
  if(status.saleRejected){$('draft-state').textContent='Rechazo confirmado. No se registró la venta. Conserva la evidencia y usa «Nuevo pedido» solo después de revisar la causa.';$('submit-sale').disabled=true;document.querySelector('[data-save-step="pending"]').textContent='2 · Rechazado';}
  else if(status.salePending){$('draft-state').textContent='Guardado en este equipo · pendiente de confirmación.';document.querySelector('[data-save-step="pending"]').textContent='2 · Pendiente';}
 }
}
const syncQueue5d=sync;
sync=async function(){await syncQueue5d();queueView5d=await client.view();refreshQueueState5d();updateMobileStatus();};
const saleQueueState5d=saleState;
saleState=function(){saleQueueState5d();refreshQueueState5d();updateMobileStatus();};

$('sync').onclick=()=>sync();
