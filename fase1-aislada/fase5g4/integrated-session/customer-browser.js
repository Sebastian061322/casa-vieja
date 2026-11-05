 function customerFields64(draft){
  const candidates=Object.values(snapshot.sales).filter(s=>s.commercial&&s.status!=='CANCELLED'&&s.metadata?.phone)
   .sort((a,b)=>String(b.metadata.date).localeCompare(String(a.metadata.date))).slice(0,100);
  const options=candidates.map(s=>option(s.id,s.metadata.customer+' · •••'+s.metadata.phone.slice(-3)+' · '+s.metadata.date)).join('');
  return select('previousOrder','Cliente existente',option('','Cliente nuevo')+options)+
   label('customer','Cliente','text',draft.customer,'required')+
   label('phone','Teléfono','tel',draft.phone||'')+
   label('address','Dirección','text',draft.address||'')+
   label('channel','Canal de venta','text',draft.channel||'Otro');
 }
 function readCustomer64(form,draft){
  for(const key of ['customer','phone','address','previousOrder','channel','zone'])draft[key]=form.elements[key].value.trim();
 }
 function bindCustomer64(command,draft){
  command.customer={...command.customer,phone:draft.phone||'',address:draft.address||'',
   ...(draft.previousOrder?{previousOrder:draft.previousOrder}:{})};
  command.channel=draft.channel||'Otro';
  return command;
 }
 document.addEventListener('change',event=>{
  if(event.target.name!=='previousOrder'||!event.target.closest('#catalogue54-form'))return;
  const form=event.target.form,sale=snapshot.sales[event.target.value];
  if(!sale)return;
  form.elements.customer.value=sale.metadata.customer||'';
  form.elements.phone.value=sale.metadata.phone||'';
  form.elements.address.value=sale.metadata.address64||'';
  form.elements.zone.value=sale.metadata.zone||'';
 },true);
